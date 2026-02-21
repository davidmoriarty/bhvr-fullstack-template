// server/src/routes/auth.ts
import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { db } from "../lib/db";
import { users } from "../lib/db/schema";
import { getCookie, setCookie } from "hono/cookie";
import {
	getExpiredRefreshCookieOptions,
	getRefreshCookieOptions,
} from "../lib/auth/cookie";
import { hashPassword, verifyPassword } from "../lib/auth/password";
import {
	createRefreshToken,
	revokeRefreshTokenById,
	signAccessToken,
	verifyRefreshToken,
} from "../lib/auth/tokens";

/**
 * ROUTING RULE:
 * - This file is mounted at a prefix in app.ts.
 * - DO NOT repeat that prefix here.
 * - All paths must be relative.
 */

export const authRoutes = new Hono()

	// REGISTER
	.post("/register", async (c) => {
		const { email, password, name } = await c.req.json();

		if (!email || !password) {
			return c.json({ error: "Email and password required" }, 400);
		}

		try {
			const hashed = await hashPassword(password);

			const [user] = await db
				.insert(users)
				.values({ email, name, passwordHash: hashed })
				.returning({
					id: users.id,
					publicId: users.publicId,
					email: users.email,
					name: users.name,
				});

			if (!user) {
				return c.json({ error: "Failed to create user" }, 500);
			}

			return c.json(
				{
					id: user.id, // internal
					publicId: user.publicId, // exposed
					email: user.email,
					name: user.name,
				},
				201,
			);
		} catch {
			return c.json({ error: "User already exists or failed to create" }, 400);
		}
	})

	// LOGIN
	.post("/login", async (c) => {
		const { email, password } = await c.req.json();

		if (!email || !password) {
			return c.json({ error: "Email and password required" }, 401);
		}

		const user = await db.query.users.findFirst({
			where: eq(users.email, email),
		});

		if (!user) return c.json({ error: "Invalid credentials" }, 401);

		const valid = await verifyPassword(password, user.passwordHash);
		if (!valid) return c.json({ error: "Invalid credentials" }, 401);

		const accessToken = signAccessToken({ userId: user.id });
		const refreshToken = await createRefreshToken(user.id);

		setCookie(c, "refresh", refreshToken, getRefreshCookieOptions());

		return c.json(
			{
				publicId: user.publicId,
				email: user.email,
				name: user.name,
				token: accessToken,
			},
			200,
		);
	})

	// ME
	.get("/me", async (c) => {
		const userId = c.get("userId");

		const user = await db.query.users.findFirst({
			where: eq(users.id, userId),
		});

		if (!user) {
			return c.json({ error: "User not found" }, 404);
		}

		return c.json({
			publicId: user.publicId,
			email: user.email,
			name: user.name,
		});
	})

	// REFRESH
	.post("/refresh", async (c) => {
		const refreshCookie = getCookie(c, "refresh");

		// Silent "not logged in" path
		if (!refreshCookie) {
			return c.body(null, 204);
		}

		try {
			const validToken = await verifyRefreshToken(refreshCookie);
			const accessToken = signAccessToken({ userId: validToken.userId });

			const newRefreshToken = await createRefreshToken(validToken.userId);
			await revokeRefreshTokenById(validToken.id);

			setCookie(c, "refresh", newRefreshToken, getRefreshCookieOptions());

			return c.json({ token: accessToken }, 200);
		} catch {
			// Invalid / expired token: also treat as "no session"
			return c.body(null, 204);
		}
	})

	// LOGOUT
	.post("/logout", async (c) => {
		const refreshCookie = getCookie(c, "refresh");

		if (refreshCookie) {
			try {
				const row = await verifyRefreshToken(refreshCookie);
				await revokeRefreshTokenById(row.id);
			} catch {
				// ignore
			}
		}

		setCookie(c, "refresh", "", getExpiredRefreshCookieOptions());
		return c.json({ success: true }, 200);
	});
