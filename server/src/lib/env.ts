// server/src/lib/env.ts
import { z } from "zod";

const isUrl = (value: string) => {
	try {
		const u = new URL(value);
		return u.protocol === "http:" || u.protocol === "https:";
	} catch {
		return false;
	}
};

const envSchema = z.object({
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),

	DATABASE_URL: z.string().min(1),
	JWT_SECRET: z.string().min(32),

	CLIENT_ORIGIN: z
		.string()
		.min(1)
		.refine(isUrl, { message: "CLIENT_ORIGIN must be a valid URL" }),

	PORT: z.string().optional(),
	APP_VERSION: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
	console.error("❌ Invalid environment variables");

	for (const issue of parsed.error.issues) {
		console.error(`- ${issue.path.join(".") || "root"}: ${issue.message}`);
	}

	process.exit(1);
}

export const env = parsed.data;
