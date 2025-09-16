ALTER TYPE "public"."borrow_status" ADD VALUE 'PENDING' BEFORE 'BORROWED';--> statement-breakpoint
CREATE TABLE "admin_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"request_reason" text NOT NULL,
	"status" "status" DEFAULT 'PENDING' NOT NULL,
	"reviewed_by" uuid,
	"reviewed_at" timestamp with time zone,
	"rejection_reason" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "admin_requests_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "book_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"book_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"rating" integer NOT NULL,
	"comment" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "book_reviews_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "system_config" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar(100) NOT NULL,
	"value" text NOT NULL,
	"description" text,
	"updated_at" timestamp with time zone DEFAULT now(),
	"updated_by" text,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "system_config_id_unique" UNIQUE("id"),
	CONSTRAINT "system_config_key_unique" UNIQUE("key")
);
--> statement-breakpoint
ALTER TABLE "borrow_records" ALTER COLUMN "due_date" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "isbn" varchar(20);--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "publication_year" integer;--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "publisher" varchar(255);--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "language" varchar(50) DEFAULT 'English';--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "page_count" integer;--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "edition" varchar(50);--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "updated_by" uuid;--> statement-breakpoint
ALTER TABLE "borrow_records" ADD COLUMN "borrowed_by" text;--> statement-breakpoint
ALTER TABLE "borrow_records" ADD COLUMN "returned_by" text;--> statement-breakpoint
ALTER TABLE "borrow_records" ADD COLUMN "fine_amount" numeric(10, 2) DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE "borrow_records" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "borrow_records" ADD COLUMN "renewal_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "borrow_records" ADD COLUMN "last_reminder_sent" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "borrow_records" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "borrow_records" ADD COLUMN "updated_by" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_login" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "admin_requests" ADD CONSTRAINT "admin_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_requests" ADD CONSTRAINT "admin_requests_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_reviews" ADD CONSTRAINT "book_reviews_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_reviews" ADD CONSTRAINT "book_reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "books" ADD CONSTRAINT "books_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;