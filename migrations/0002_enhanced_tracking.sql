-- Enhanced tracking and control fields for books table
ALTER TABLE "books" ADD COLUMN "isbn" varchar(20);
ALTER TABLE "books" ADD COLUMN "publication_year" integer;
ALTER TABLE "books" ADD COLUMN "publisher" varchar(255);
ALTER TABLE "books" ADD COLUMN "language" varchar(50) DEFAULT 'English';
ALTER TABLE "books" ADD COLUMN "page_count" integer;
ALTER TABLE "books" ADD COLUMN "edition" varchar(50);
ALTER TABLE "books" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;
ALTER TABLE "books" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now();
ALTER TABLE "books" ADD COLUMN "updated_by" uuid REFERENCES "users"("id");

-- Enhanced tracking and control fields for borrow_records table
ALTER TABLE "borrow_records" ADD COLUMN "borrowed_by" uuid REFERENCES "users"("id");
ALTER TABLE "borrow_records" ADD COLUMN "returned_by" uuid REFERENCES "users"("id");
ALTER TABLE "borrow_records" ADD COLUMN "fine_amount" numeric(10,2) DEFAULT '0.00';
ALTER TABLE "borrow_records" ADD COLUMN "notes" text;
ALTER TABLE "borrow_records" ADD COLUMN "renewal_count" integer DEFAULT 0 NOT NULL;
ALTER TABLE "borrow_records" ADD COLUMN "last_reminder_sent" timestamp with time zone;
ALTER TABLE "borrow_records" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now();
ALTER TABLE "borrow_records" ADD COLUMN "updated_by" uuid REFERENCES "users"("id");
