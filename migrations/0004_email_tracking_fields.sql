-- Migration to change borrowed_by, returned_by, and updated_by from UUID to TEXT for email storage
-- This allows storing email addresses instead of user IDs for better readability

-- Change borrowed_by column type
ALTER TABLE "borrow_records" ALTER COLUMN "borrowed_by" TYPE TEXT;

-- Change returned_by column type  
ALTER TABLE "borrow_records" ALTER COLUMN "returned_by" TYPE TEXT;

-- Change updated_by column type
ALTER TABLE "borrow_records" ALTER COLUMN "updated_by" TYPE TEXT;

-- Drop foreign key constraints since we're no longer referencing users.id
ALTER TABLE "borrow_records" DROP CONSTRAINT IF EXISTS "borrow_records_borrowed_by_users_id_fk";
ALTER TABLE "borrow_records" DROP CONSTRAINT IF EXISTS "borrow_records_returned_by_users_id_fk";
ALTER TABLE "borrow_records" DROP CONSTRAINT IF EXISTS "borrow_records_updated_by_users_id_fk";
