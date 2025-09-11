"use server";

import { db } from "@/database/drizzle";
import { borrowRecords, books, users } from "@/database/schema";
import { eq, and, desc } from "drizzle-orm";

export const getAllBorrowRequests = async () => {
  try {
    const requests = await db
      .select({
        id: borrowRecords.id,
        userId: borrowRecords.userId,
        bookId: borrowRecords.bookId,
        borrowDate: borrowRecords.borrowDate,
        dueDate: borrowRecords.dueDate,
        returnDate: borrowRecords.returnDate,
        status: borrowRecords.status,
        createdAt: borrowRecords.createdAt,
        // Enhanced tracking fields
        borrowedBy: borrowRecords.borrowedBy,
        returnedBy: borrowRecords.returnedBy,
        fineAmount: borrowRecords.fineAmount,
        notes: borrowRecords.notes,
        renewalCount: borrowRecords.renewalCount,
        lastReminderSent: borrowRecords.lastReminderSent,
        updatedAt: borrowRecords.updatedAt,
        updatedBy: borrowRecords.updatedBy,
        // User details
        userName: users.fullName,
        userEmail: users.email,
        userUniversityId: users.universityId,
        // Book details
        bookTitle: books.title,
        bookAuthor: books.author,
        bookGenre: books.genre,
        bookCoverUrl: books.coverUrl,
        bookCoverColor: books.coverColor,
      })
      .from(borrowRecords)
      .innerJoin(users, eq(borrowRecords.userId, users.id))
      .innerJoin(books, eq(borrowRecords.bookId, books.id))
      .orderBy(desc(borrowRecords.createdAt));

    return { success: true, data: requests };
  } catch (error) {
    console.error("Error fetching borrow requests:", error);
    return { success: false, error: "Failed to fetch borrow requests" };
  }
};

export const updateBorrowStatus = async (
  recordId: string,
  status: "PENDING" | "BORROWED" | "RETURNED"
) => {
  try {
    await db
      .update(borrowRecords)
      .set({ status })
      .where(eq(borrowRecords.id, recordId));

    return { success: true };
  } catch (error) {
    console.error("Error updating borrow status:", error);
    return { success: false, error: "Failed to update borrow status" };
  }
};

export const approveBorrowRequest = async (recordId: string) => {
  try {
    // Get the borrow record with user email
    const record = await db
      .select({
        bookId: borrowRecords.bookId,
        userId: borrowRecords.userId,
        userEmail: users.email,
      })
      .from(borrowRecords)
      .innerJoin(users, eq(borrowRecords.userId, users.id))
      .where(eq(borrowRecords.id, recordId))
      .limit(1);

    if (record.length === 0) {
      return { success: false, error: "Borrow record not found" };
    }

    // Check if book is still available
    const book = await db
      .select({ availableCopies: books.availableCopies })
      .from(books)
      .where(eq(books.id, record[0].bookId))
      .limit(1);

    if (book.length === 0 || book[0].availableCopies <= 0) {
      return { success: false, error: "Book is no longer available" };
    }

    // Calculate due date (7 days from approval date)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);
    const dueDateString = dueDate.toISOString().split("T")[0];

    // Update borrow record status to BORROWED and set borrowedBy and dueDate
    await db
      .update(borrowRecords)
      .set({
        status: "BORROWED",
        borrowedBy: record[0].userEmail, // Set who actually borrowed the book (email for readability)
        dueDate: dueDateString, // Set due date when approved
        updatedAt: new Date(),
        updatedBy: record[0].userEmail,
      })
      .where(eq(borrowRecords.id, recordId));

    // Decrement available copies
    await db
      .update(books)
      .set({ availableCopies: book[0].availableCopies - 1 })
      .where(eq(books.id, record[0].bookId));

    return { success: true };
  } catch (error) {
    console.error("Error approving borrow request:", error);
    return { success: false, error: "Failed to approve borrow request" };
  }
};

export const rejectBorrowRequest = async (recordId: string) => {
  try {
    // For now, we'll just delete the pending request
    // In a real system, you might want to keep it for audit purposes
    await db.delete(borrowRecords).where(eq(borrowRecords.id, recordId));

    return { success: true };
  } catch (error) {
    console.error("Error rejecting borrow request:", error);
    return { success: false, error: "Failed to reject borrow request" };
  }
};

export const returnBook = async (
  recordId: string,
  returnedByUserId?: string
) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    // Get the borrow record details first with user email
    const record = await db
      .select({
        bookId: borrowRecords.bookId,
        userId: borrowRecords.userId,
        dueDate: borrowRecords.dueDate,
        borrowedBy: borrowRecords.borrowedBy,
        userEmail: users.email,
      })
      .from(borrowRecords)
      .innerJoin(users, eq(borrowRecords.userId, users.id))
      .where(eq(borrowRecords.id, recordId))
      .limit(1);

    if (record.length === 0) {
      return { success: false, error: "Borrow record not found" };
    }

    // Calculate fine if overdue
    const dueDate = new Date(record[0].dueDate);
    const returnDate = new Date(today);
    const daysOverdue = Math.max(
      0,
      Math.floor(
        (returnDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
      )
    );
    const fineAmount =
      daysOverdue > 0 ? (daysOverdue * 1.0).toFixed(2) : "0.00"; // $1 per day overdue

    // Update borrow record with enhanced tracking (store email instead of user ID for readability)
    await db
      .update(borrowRecords)
      .set({
        status: "RETURNED",
        returnDate: today,
        returnedBy: record[0].userEmail, // Store email for better readability
        borrowedBy: record[0].borrowedBy || record[0].userEmail, // Set borrowedBy if not already set
        fineAmount: fineAmount,
        updatedAt: new Date(),
        updatedBy: record[0].userEmail,
      })
      .where(eq(borrowRecords.id, recordId));

    // Update available copies
    const book = await db
      .select({ availableCopies: books.availableCopies })
      .from(books)
      .where(eq(books.id, record[0].bookId))
      .limit(1);

    if (book.length > 0) {
      await db
        .update(books)
        .set({ availableCopies: book[0].availableCopies + 1 })
        .where(eq(books.id, record[0].bookId));
    }

    return {
      success: true,
      data: {
        fineAmount: parseFloat(fineAmount),
        daysOverdue,
        isOverdue: daysOverdue > 0,
      },
    };
  } catch (error) {
    console.error("Error returning book:", error);
    return { success: false, error: "Failed to return book" };
  }
};
