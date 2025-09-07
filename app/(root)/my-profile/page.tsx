import React from "react";
import BookList from "@/components/BookList";
import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { borrowRecords, books } from "@/database/schema";
import { eq, and } from "drizzle-orm";

const Page = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    return <div>Please sign in to view your profile.</div>;
  }

  // Fetch actual borrowed books for the current user
  const borrowedBooks = await db
    .select({
      id: books.id,
      title: books.title,
      author: books.author,
      genre: books.genre,
      rating: books.rating,
      totalCopies: books.totalCopies,
      availableCopies: books.availableCopies,
      description: books.description,
      coverColor: books.coverColor,
      coverUrl: books.coverUrl,
      videoUrl: books.videoUrl,
      summary: books.summary,
      createdAt: books.createdAt,
    })
    .from(borrowRecords)
    .innerJoin(books, eq(borrowRecords.bookId, books.id))
    .where(
      and(
        eq(borrowRecords.userId, session.user.id),
        eq(borrowRecords.status, "BORROWED")
      )
    );

  return (
    <>
      <BookList
        title="Borrowed Books"
        books={borrowedBooks}
        containerClassName="mt-0"
      />
    </>
  );
};
export default Page;
