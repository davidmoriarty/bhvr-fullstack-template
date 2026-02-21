// server/src/routes/api.ts
import { Hono } from "hono";

/**
 * ROUTING RULE:
 * - This file is mounted at a prefix in app.ts.
 * - DO NOT repeat that prefix here.
 * - All paths must be relative.
 */

export const apiRoutes = new Hono();
