// server/src/lib/middleware/auth.ts
import type { Context, Next } from "hono";
import { verify } from "jsonwebtoken";
import { type AccessTokenPayload, JWT_SECRET } from "../auth/jwt";

declare module "hono" {
	interface ContextVariableMap {
		userId: number;
	}
}

export async function authMiddleware(c: Context, next: Next) {
	const auth = c.req.header("authorization") || "";
	if (!auth.startsWith("Bearer ")) {
		return c.json({ error: "Unauthorized" }, { status: 401 });
	}

	const token = auth.slice(7);

	try {
		const decoded = verify(token, JWT_SECRET);
		if (
			typeof decoded !== "object" ||
			decoded === null ||
			!("userId" in decoded)
		) {
			return c.json({ error: "Invalid token" }, { status: 401 });
		}
		c.set("userId", (decoded as AccessTokenPayload).userId);
		return await next();
	} catch (err: unknown) {
		if (err instanceof Error && err.name === "TokenExpiredError") {
			return c.json({ error: "Access token expired" }, { status: 401 });
		}
		return c.json({ error: "Invalid token" }, { status: 401 });
	}
}
