-- Migration: Add system_config table for dynamic configuration
-- This migration adds a system configuration table to store dynamic settings like fine amounts

CREATE TABLE IF NOT EXISTS "system_config" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar(100) NOT NULL,
	"value" text NOT NULL,
	"description" text,
	"updated_at" timestamp with time zone DEFAULT now(),
	"updated_by" text,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "system_config_key_unique" UNIQUE("key")
);

-- Insert default fine amount configuration
INSERT INTO "system_config" ("key", "value", "description", "updated_by", "created_at", "updated_at")
VALUES ('daily_fine_amount', '1.00', 'Daily fine amount for overdue books', 'system', now(), now())
ON CONFLICT ("key") DO NOTHING;
