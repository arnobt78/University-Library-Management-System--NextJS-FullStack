import { db } from "@/database/drizzle";
import { borrowRecords, users, books } from "@/database/schema";
import { eq, and, sql } from "drizzle-orm";

// Email service for sending reminders
export class EmailService {
  static async sendReminderEmail(to: string, subject: string, body: string) {
    // In a real application, you would integrate with an email service like:
    // - SendGrid
    // - AWS SES
    // - Nodemailer with SMTP
    // - Resend

    console.log(`📧 Email sent to ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);

    // For now, we'll just log the email details
    // In production, replace this with actual email sending logic
    return { success: true, messageId: `mock-${Date.now()}` };
  }
}

// Reminder types
export type ReminderType = "due_soon" | "overdue" | "return_reminder";

// Get books that are due soon (within 2 days)
export async function getBooksDueSoon() {
  const twoDaysFromNow = new Date();
  twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);

  const now = new Date();

  const dueSoonBooks = await db
    .select({
      recordId: borrowRecords.id,
      bookTitle: books.title,
      bookAuthor: books.author,
      userName: users.fullName,
      userEmail: users.email,
      borrowDate: borrowRecords.borrowDate,
      dueDate: borrowRecords.dueDate,
      daysUntilDue: sql<number>`EXTRACT(DAY FROM (${borrowRecords.dueDate} - ${now}))`,
    })
    .from(borrowRecords)
    .innerJoin(books, eq(borrowRecords.bookId, books.id))
    .innerJoin(users, eq(borrowRecords.userId, users.id))
    .where(
      and(
        eq(borrowRecords.status, "BORROWED"),
        sql`${borrowRecords.dueDate} IS NOT NULL`,
        sql`${borrowRecords.dueDate} > ${now}`,
        sql`${borrowRecords.dueDate} <= ${twoDaysFromNow}`
      )
    );

  return dueSoonBooks;
}

// Get overdue books
export async function getOverdueBooks() {
  const now = new Date();

  const overdueBooks = await db
    .select({
      recordId: borrowRecords.id,
      bookTitle: books.title,
      bookAuthor: books.author,
      userName: users.fullName,
      userEmail: users.email,
      borrowDate: borrowRecords.borrowDate,
      dueDate: borrowRecords.dueDate,
      daysOverdue: sql<number>`EXTRACT(DAY FROM (${now} - ${borrowRecords.dueDate}))`,
      fineAmount: borrowRecords.fineAmount,
    })
    .from(borrowRecords)
    .innerJoin(books, eq(borrowRecords.bookId, books.id))
    .innerJoin(users, eq(borrowRecords.userId, users.id))
    .where(
      and(
        eq(borrowRecords.status, "BORROWED"),
        sql`${borrowRecords.dueDate} IS NOT NULL`,
        sql`${borrowRecords.dueDate} < ${now}`
      )
    );

  return overdueBooks;
}

// Send due soon reminders
export async function sendDueSoonReminders() {
  const dueSoonBooks = await getBooksDueSoon();
  const results = [];

  for (const book of dueSoonBooks) {
    const subject = `📚 Book Due Soon: ${book.bookTitle}`;
    const body = `
Dear ${book.userName},

Your book "${book.bookTitle}" by ${book.bookAuthor} is due in ${Math.ceil(book.daysUntilDue)} day(s).

Due Date: ${book.dueDate ? new Date(book.dueDate).toLocaleDateString() : "N/A"}

Please return the book on time to avoid any fines.

Best regards,
BookWise Library Team
    `.trim();

    try {
      const result = await EmailService.sendReminderEmail(
        book.userEmail,
        subject,
        body
      );
      results.push({
        recordId: book.recordId,
        userEmail: book.userEmail,
        bookTitle: book.bookTitle,
        status: "sent",
        result,
      });
    } catch (error) {
      results.push({
        recordId: book.recordId,
        userEmail: book.userEmail,
        bookTitle: book.bookTitle,
        status: "failed",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return results;
}

// Send overdue reminders
export async function sendOverdueReminders() {
  const overdueBooks = await getOverdueBooks();
  const results = [];

  for (const book of overdueBooks) {
    const subject = `⚠️ Overdue Book: ${book.bookTitle}`;
    const body = `
Dear ${book.userName},

Your book "${book.bookTitle}" by ${book.bookAuthor} is overdue by ${Math.ceil(book.daysOverdue)} day(s).

Due Date: ${book.dueDate ? new Date(book.dueDate).toLocaleDateString() : "N/A"}
Current Fine: $${book.fineAmount || "0.00"}

Please return the book immediately to avoid additional fines.

Best regards,
BookWise Library Team
    `.trim();

    try {
      const result = await EmailService.sendReminderEmail(
        book.userEmail,
        subject,
        body
      );
      results.push({
        recordId: book.recordId,
        userEmail: book.userEmail,
        bookTitle: book.bookTitle,
        status: "sent",
        result,
      });
    } catch (error) {
      results.push({
        recordId: book.recordId,
        userEmail: book.userEmail,
        bookTitle: book.bookTitle,
        status: "failed",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return results;
}

// Update last reminder sent timestamp
export async function updateLastReminderSent(recordId: string) {
  await db
    .update(borrowRecords)
    .set({
      lastReminderSent: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(borrowRecords.id, recordId));
}

// Get reminder statistics
export async function getReminderStats() {
  const now = new Date();
  const twoDaysFromNow = new Date();
  twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);

  const [dueSoonCount, overdueCount, remindersSentToday] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)` })
      .from(borrowRecords)
      .where(
        and(
          eq(borrowRecords.status, "BORROWED"),
          sql`${borrowRecords.dueDate} IS NOT NULL`,
          sql`${borrowRecords.dueDate} > ${now}`,
          sql`${borrowRecords.dueDate} <= ${twoDaysFromNow}`
        )
      ),
    db
      .select({ count: sql<number>`count(*)` })
      .from(borrowRecords)
      .where(
        and(
          eq(borrowRecords.status, "BORROWED"),
          sql`${borrowRecords.dueDate} IS NOT NULL`,
          sql`${borrowRecords.dueDate} < ${now}`
        )
      ),
    db
      .select({ count: sql<number>`count(*)` })
      .from(borrowRecords)
      .where(
        and(
          sql`${borrowRecords.lastReminderSent} IS NOT NULL`,
          sql`DATE(${borrowRecords.lastReminderSent}) = DATE(${now})`
        )
      ),
  ]);

  return {
    dueSoon: dueSoonCount[0]?.count || 0,
    overdue: overdueCount[0]?.count || 0,
    remindersSentToday: remindersSentToday[0]?.count || 0,
  };
}
