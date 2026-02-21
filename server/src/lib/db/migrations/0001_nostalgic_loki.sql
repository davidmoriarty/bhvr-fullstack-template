ALTER TABLE "refresh_tokens" ADD COLUMN "lookup_hash" text NOT NULL;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_lookup_hash_unique" UNIQUE("lookup_hash");