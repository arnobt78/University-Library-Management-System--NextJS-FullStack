-- Migration to add PENDING status to borrow_status enum
-- This migration adds PENDING as the first value in the borrow_status enum

-- First, we need to alter the enum to add PENDING status
-- Note: PostgreSQL doesn't support adding values to the middle of an enum, so we need to recreate it

-- Step 1: Create a new enum with PENDING added
CREATE TYPE borrow_status_new AS ENUM ('PENDING', 'BORROWED', 'RETURNED');

-- Step 2: Update the borrow_records table to use the new enum
ALTER TABLE borrow_records 
ALTER COLUMN status TYPE borrow_status_new 
USING status::text::borrow_status_new;

-- Step 3: Drop the old enum and rename the new one
DROP TYPE borrow_status;
ALTER TYPE borrow_status_new RENAME TO borrow_status;

-- Step 4: Update any existing BORROWED records to PENDING (optional - you might want to keep them as BORROWED)
-- UPDATE borrow_records SET status = 'PENDING' WHERE status = 'BORROWED';
