-- Migration to make due_date nullable for pending requests
-- This allows due_date to be null for PENDING status and set when admin approves

ALTER TABLE "borrow_records" ALTER COLUMN "due_date" DROP NOT NULL;

-- Update existing records where due_date is null to have a default value
-- This is for existing data integrity
UPDATE "borrow_records" 
SET "due_date" = "borrow_date" + INTERVAL '7 days' 
WHERE "due_date" IS NULL AND "status" = 'BORROWED';
