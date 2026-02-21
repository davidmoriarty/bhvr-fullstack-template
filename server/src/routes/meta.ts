// server/src/routes/meta.ts
import { Hono } from "hono";
import { env } from "../lib/env";

const startedAtMs = Date.now();

/**
 * ROUTING RULE:
 * - This file is mounted at a prefix in app.ts.
 * - DO NOT repeat that prefix here.
 * - All paths must be relative.
 */

export const metaRoutes = new Hono()
	.get("/", (c) => {
		return c.json({
			name: "bhvr-app",
			version: env.APP_VERSION ?? "dev",
			status: "ok",
			documentation: null,
		});
	})
	.get("/__info", (c) => {
		const uptimeSeconds = Math.floor((Date.now() - startedAtMs) / 1000);

		return c.json({
			name: "bhvr-app",
			nodeEnv: env.NODE_ENV ?? "development",
			uptimeSeconds,
			clientOrigin: env.CLIENT_ORIGIN ?? null,
		});
	});
