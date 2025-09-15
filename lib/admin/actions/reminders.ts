import { db } from "@/database/drizzle";
import { borrowRecords, users, books } from "@/database/schema";
import { eq, and, sql } from "drizzle-orm";
import { Resend } from "resend";

// Initialize Resend
const resend = new Resend(process.env.RESEND_TOKEN);

// Email service for sending reminders
export class EmailService {
  static async sendReminderEmail(to: string, subject: string, body: string) {
    try {
      // Send email using Resend API
      const { data, error } = await resend.emails.send({
        from: "BookWise Library <onboarding@resend.dev>",
        to: [to],
        subject: subject,
        html: this.generateEmailTemplate(subject, body),
        text: body, // Plain text fallback
      });

      if (error) {
        console.error("Resend email error:", error);
        return { success: false, error: error.message };
      }

      console.log(`📧 Email sent successfully to ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Message ID: ${data?.id}`);

      return { success: true, messageId: data?.id };
    } catch (error) {
      console.error("Email sending failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  private static generateEmailTemplate(subject: string, body: string): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f8f9fa;
            }
            .container {
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px 20px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
                font-weight: 600;
            }
            .content {
                padding: 30px 20px;
            }
            .message {
                background-color: #f8f9fa;
                border-left: 4px solid #667eea;
                padding: 20px;
                margin: 20px 0;
                border-radius: 4px;
            }
            .message pre {
                white-space: pre-wrap;
                font-family: inherit;
                margin: 0;
            }
            .footer {
                background-color: #f8f9fa;
                padding: 20px;
                text-align: center;
                border-top: 1px solid #e9ecef;
                font-size: 14px;
                color: #6c757d;
            }
            .contact-info {
                margin-top: 15px;
                padding-top: 15px;
                border-top: 1px solid #e9ecef;
            }
            .contact-info p {
                margin: 5px 0;
                font-size: 13px;
            }
            .logo {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">📚 BookWise Library</div>
                <h1>Library Notification</h1>
            </div>
            <div class="content">
                <div class="message">
                    <pre>${body}</pre>
                </div>
            </div>
            <div class="footer">
                <p><strong>BookWise Library Management System</strong></p>
                <div class="contact-info">
                    <p>📧 Email: support@bookwise-library.com</p>
                    <p>📞 Phone: +1 (555) 123-4567</p>
                    <p>🌐 Website: www.bookwise-library.com</p>
                    <p>📍 Address: 123 Library Street, Education City, EC 12345</p>
                </div>
                <p style="margin-top: 15px; font-size: 12px;">
                    This is an automated message. Please do not reply to this email.
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
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
      daysUntilDue: sql<number>`(${borrowRecords.dueDate}::date - ${now}::date)`,
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
      daysOverdue: sql<number>`(${now}::date - ${borrowRecords.dueDate}::date)`,
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
    const subject = `Library Book Return Reminder - ${book.bookTitle}`;
    const body = `
Dear ${book.userName},

This is a friendly reminder that your borrowed book is due for return soon.

Book Details:
• Title: ${book.bookTitle}
• Author: ${book.bookAuthor}
• Due Date: ${
      book.dueDate
        ? new Date(book.dueDate).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "N/A"
    }
• Days Remaining: ${Math.ceil(book.daysUntilDue)} day(s)

Please return the book to the library by the due date to avoid any late fees. You can return the book during our regular operating hours.

If you need to renew the book, please contact the library staff before the due date.

Thank you for using BookWise Library services.

Best regards,
BookWise Library Management Team

---
This is an automated reminder. For assistance, please contact us at support@bookwise-library.com or call +1 (555) 123-4567.
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
    const subject = `Overdue Book Notice - ${book.bookTitle}`;
    const body = `
Dear ${book.userName},

We are writing to inform you that you have an overdue book that needs to be returned immediately.

Book Details:
• Title: ${book.bookTitle}
• Author: ${book.bookAuthor}
• Original Due Date: ${
      book.dueDate
        ? new Date(book.dueDate).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "N/A"
    }
• Days Overdue: ${Math.ceil(book.daysOverdue)} day(s)
• Current Fine Amount: $${book.fineAmount || "0.00"}

Please return this book to the library as soon as possible. Late fees continue to accumulate daily at a rate of $1.00 per day.

To avoid additional charges, please:
1. Return the book immediately during library hours
2. Contact us if you have any questions or concerns
3. Consider renewing the book if it's still available

We appreciate your prompt attention to this matter.

Best regards,
BookWise Library Management Team

---
This is an automated notice. For assistance, please contact us at support@bookwise-library.com or call +1 (555) 123-4567.
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
