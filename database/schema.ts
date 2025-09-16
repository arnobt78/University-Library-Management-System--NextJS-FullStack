import {
  varchar,
  uuid,
  integer,
  text,
  pgTable,
  date,
  pgEnum,
  timestamp,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";

export const STATUS_ENUM = pgEnum("status", [
  "PENDING",
  "APPROVED",
  "REJECTED",
]);
export const ROLE_ENUM = pgEnum("role", ["USER", "ADMIN"]);
export const BORROW_STATUS_ENUM = pgEnum("borrow_status", [
  "PENDING",
  "BORROWED",
  "RETURNED",
]);

export const users = pgTable("users", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: text("email").notNull().unique(),
  universityId: integer("university_id").notNull().unique(),
  password: text("password").notNull(),
  universityCard: text("university_card").notNull(),
  status: STATUS_ENUM("status").default("PENDING"),
  role: ROLE_ENUM("role").default("USER"),
  lastActivityDate: date("last_activity_date").defaultNow(),
  lastLogin: timestamp("last_login", { withTimezone: true }),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow(),
});

export const books = pgTable("books", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  author: varchar("author", { length: 255 }).notNull(),
  genre: text("genre").notNull(),
  rating: integer("rating").notNull(),
  coverUrl: text("cover_url").notNull(),
  coverColor: varchar("cover_color", { length: 7 }).notNull(),
  description: text("description").notNull(),
  totalCopies: integer("total_copies").notNull().default(1),
  availableCopies: integer("available_copies").notNull().default(0),
  videoUrl: text("video_url").notNull(),
  summary: varchar("summary").notNull(),
  // Enhanced tracking and control fields
  isbn: varchar("isbn", { length: 20 }),
  publicationYear: integer("publication_year"),
  publisher: varchar("publisher", { length: 255 }),
  language: varchar("language", { length: 50 }).default("English"),
  pageCount: integer("page_count"),
  edition: varchar("edition", { length: 50 }),
  isActive: boolean("is_active").default(true).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  updatedBy: uuid("updated_by").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const borrowRecords = pgTable("borrow_records", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  bookId: uuid("book_id")
    .references(() => books.id)
    .notNull(),
  borrowDate: timestamp("borrow_date", { withTimezone: true })
    .defaultNow()
    .notNull(),
  dueDate: date("due_date"), // Nullable - set when admin approves
  returnDate: date("return_date"),
  status: BORROW_STATUS_ENUM("status").default("BORROWED").notNull(),
  // Enhanced tracking and control fields
  borrowedBy: text("borrowed_by"), // Who actually borrowed (email for readability)
  returnedBy: text("returned_by"), // Who returned the book (email for readability)
  fineAmount: decimal("fine_amount", { precision: 10, scale: 2 }).default(
    "0.00"
  ), // Late return fines
  notes: text("notes"), // Additional notes about the borrowing
  renewalCount: integer("renewal_count").default(0).notNull(), // How many times the book was renewed
  lastReminderSent: timestamp("last_reminder_sent", { withTimezone: true }), // Track reminder notifications
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  updatedBy: text("updated_by"), // Email for readability
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// System configuration table for dynamic settings
export const systemConfig = pgTable("system_config", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value").notNull(),
  description: text("description"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  updatedBy: text("updated_by"), // Email for readability
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Book reviews table for user reviews and ratings
export const bookReviews = pgTable("book_reviews", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  bookId: uuid("book_id")
    .references(() => books.id)
    .notNull(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  rating: integer("rating").notNull(), // 1-5 stars
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Admin requests table for users requesting admin privileges
export const adminRequests = pgTable("admin_requests", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  requestReason: text("request_reason").notNull(), // Why they want admin access
  status: STATUS_ENUM("status").default("PENDING").notNull(), // PENDING, APPROVED, REJECTED
  reviewedBy: uuid("reviewed_by").references(() => users.id), // Admin who reviewed the request
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  rejectionReason: text("rejection_reason"), // Reason for rejection if applicable
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});
