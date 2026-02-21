import type { Config } from "drizzle-kit";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
	throw new Error("DATABASE_URL is missing");
}

export default {
	schema: "./src/lib/db/schema.ts",
	out: "./src/lib/db/migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: DATABASE_URL,
	},
} satisfies Config;
