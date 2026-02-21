// server/src/routes/health.ts
import { Hono } from "hono";

/**
 * ROUTING RULE:
 * - This file is mounted at a prefix in app.ts.
 * - DO NOT repeat that prefix here.
 * - All paths must be relative.
 */

export const healthRoutes = new Hono()
	.get("/live", (c) => {
		return c.text("ok", 200);
	})
	.get("/ready", async (c) => {
		try {
			// optional: ping DB
			return c.text("ready", 200);
		} catch {
			return c.text("not ready", 503);
		}
	});
