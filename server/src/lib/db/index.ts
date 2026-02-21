// server/src/lib/db/index.ts
import { env } from "../env";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

// Keep a single connection in dev (watch mode)
const g = globalThis as unknown as {
	__sql?: postgres.Sql;
};

export const sql =
	g.__sql ??
	postgres(env.DATABASE_URL, {
		max: env.NODE_ENV === "production" ? 10 : 1,
		idle_timeout: 20,
		connect_timeout: 10,
	});

if (env.NODE_ENV !== "production") g.__sql = sql;

export const db = drizzle(sql, { schema });
