// server/src/lib/db/schema.ts
import {
	uuid,
	boolean,
	integer,
	pgTable,
	serial,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { sql, relations } from "drizzle-orm";

export const users = pgTable("users", {
	id: serial("id").primaryKey(),

	publicId: uuid("public_id")
		.default(sql`gen_random_uuid()`)
		.notNull()
		.unique(),

	email: text("email").notNull().unique(),
	name: text("name"),
	passwordHash: text("password_hash").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});

export const refreshTokens = pgTable("refresh_tokens", {
	id: serial("id").primaryKey(),
	userId: integer("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	lookupHash: text("lookup_hash").notNull().unique(),
	tokenHash: text("token_hash").notNull(),
	revoked: boolean("revoked").notNull().default(false),
	expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
	refreshTokens: many(refreshTokens),
}));

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
	user: one(users, {
		fields: [refreshTokens.userId],
		references: [users.id],
	}),
}));
