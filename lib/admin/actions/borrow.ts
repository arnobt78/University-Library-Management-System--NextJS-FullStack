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
    // Get the borrow record
    const record = await db
      .select({ bookId: borrowRecords.bookId })
      .from(borrowRecords)
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

    // Update borrow record status to BORROWED
    await db
      .update(borrowRecords)
      .set({ status: "BORROWED" })
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

export const returnBook = async (recordId: string) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    await db
      .update(borrowRecords)
      .set({
        status: "RETURNED",
        returnDate: today,
      })
      .where(eq(borrowRecords.id, recordId));

    // Update available copies
    const record = await db
      .select({ bookId: borrowRecords.bookId })
      .from(borrowRecords)
      .where(eq(borrowRecords.id, recordId))
      .limit(1);

    if (record.length > 0) {
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
    }

    return { success: true };
  } catch (error) {
    console.error("Error returning book:", error);
    return { success: false, error: "Failed to return book" };
  }
};
