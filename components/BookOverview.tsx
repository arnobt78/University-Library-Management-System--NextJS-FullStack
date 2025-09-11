import React from "react";
// import Image from "next/image";
import BookCover from "@/components/BookCover";
import BorrowBook from "@/components/BorrowBook";
import ReturnBookButton from "@/components/ReturnBookButton";
import { db } from "@/database/drizzle";
import { users, borrowRecords } from "@/database/schema";
import { eq, count, sql, and, or } from "drizzle-orm";

interface Props extends Book {
  userId: string;
  isDetailPage?: boolean;
}
const BookOverview = async ({
  title,
  author,
  genre,
  rating,
  totalCopies,
  availableCopies,
  description,
  coverColor,
  coverUrl,
  id,
  userId,
  isDetailPage = false,
  // Enhanced fields
  isbn,
  publicationYear,
  publisher,
  language,
  pageCount,
  edition,
  isActive,
  createdAt,
  updatedAt,
}: Props) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  // Get borrow records statistics for this book
  const borrowStats = await db
    .select({
      totalBorrows: count(),
      activeBorrows: sql<number>`count(case when ${borrowRecords.status} = 'BORROWED' then 1 end)`,
      returnedBorrows: sql<number>`count(case when ${borrowRecords.status} = 'RETURNED' then 1 end)`,
    })
    .from(borrowRecords)
    .where(eq(borrowRecords.bookId, id));

  // Check if the current user already has an active or pending borrow for this book
  const userExistingBorrow = await db
    .select()
    .from(borrowRecords)
    .where(
      and(
        eq(borrowRecords.userId, userId),
        eq(borrowRecords.bookId, id),
        or(
          eq(borrowRecords.status, "BORROWED"),
          eq(borrowRecords.status, "PENDING")
        )
      )
    )
    .limit(1);

  const hasExistingBorrow = userExistingBorrow.length > 0;

  const borrowingEligibility = {
    isEligible:
      availableCopies > 0 &&
      user?.status === "APPROVED" &&
      isActive &&
      !hasExistingBorrow,
    message: hasExistingBorrow
      ? "You already have an active borrow or pending request for this book"
      : !isActive
        ? "This book is currently unavailable"
        : availableCopies <= 0
          ? "Book is not available"
          : "You are not eligible to borrow this book",
  };
  return (
    <section className="book-overview">
      <div className="flex flex-1 flex-col gap-5">
        <h1>{title}</h1>

        <div className="book-info">
          <p>
            By <span className="font-semibold text-light-200">{author}</span>
          </p>

          <p>
            Category{" "}
            <span className="font-semibold text-light-200">{genre}</span>
          </p>

          <div className="flex flex-row gap-1">
            <img src="/icons/star.svg" alt="star" width={22} height={22} />
            <p>{rating}</p>
          </div>
        </div>

        {/* Enhanced Book Information */}
        <div className="pt-4 text-lg font-semibold text-light-100">
          Book Details
        </div>
        <div className="book-info">
          <div className="space-y-3">
            {/* First row: ISBN and Published */}
            <div className="grid grid-cols-2 gap-36">
              <p>
                ISBN{" "}
                <span className="font-semibold text-light-200">
                  {isbn || "N/A"}
                </span>
              </p>
              <p>
                Published{" "}
                <span className="font-semibold text-light-200">
                  {publicationYear || "N/A"}
                </span>
              </p>
            </div>

            {/* Second row: Publisher and Language */}
            <div className="grid grid-cols-2 gap-36">
              <p>
                Publisher{" "}
                <span className="font-semibold text-light-200">
                  {publisher || "N/A"}
                </span>
              </p>
              <p>
                Language{" "}
                <span className="font-semibold text-light-200">
                  {language || "N/A"}
                </span>
              </p>
            </div>

            {/* Third row: Pages and Edition */}
            <div className="grid grid-cols-2 gap-36">
              <p>
                Pages{" "}
                <span className="font-semibold text-light-200">
                  {pageCount || "N/A"}
                </span>
              </p>
              <p>
                Edition{" "}
                <span className="font-semibold text-light-200">
                  {edition || "N/A"}
                </span>
              </p>
            </div>

            {/* Fourth row: Total Copies and Available Copies */}
            <div className="">
              <div className="grid grid-cols-2 gap-36">
                <p>
                  Total Books{" "}
                  <span className="font-semibold text-light-200">
                    {totalCopies || "N/A"}
                  </span>
                </p>
                <p>
                  Available Books{" "}
                  <span className="font-semibold text-light-200">
                    {availableCopies || "N/A"}
                  </span>
                </p>
              </div>

              {!isActive && (
                <p className="font-semibold text-red-400">
                  ⚠️ This book is currently unavailable
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Database Metadata Section */}
        <div className="book-info">
          <div className="pt-4 text-lg font-semibold text-light-100">
            Library Database Information
          </div>
          <div className="space-y-3">
            {/* Database dates */}
            <div className="grid grid-cols-2 gap-12">
              <p>
                Added to Library{" "}
                <span className="font-semibold text-light-200">
                  {createdAt
                    ? new Date(createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"}
                </span>
              </p>
              <p>
                Last Updated{" "}
                <span className="font-semibold text-light-200">
                  {updatedAt
                    ? new Date(updatedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Borrow Statistics Section */}
        <div className="book-info">
          <div className="pt-4 text-lg font-semibold text-light-100">
            Borrow Statistics
          </div>
          <div className="space-y-3">
            {/* Borrow counts */}
            <div className="grid grid-cols-2 gap-24">
              <p>
                Total Times Borrowed{" "}
                <span className="font-semibold text-light-200">
                  {borrowStats[0]?.totalBorrows || 0}
                </span>
              </p>
              <p>
                Currently Borrowed{" "}
                <span className="font-semibold text-light-200">
                  {borrowStats[0]?.activeBorrows || 0}
                </span>
              </p>
            </div>

            {/* Availability status */}
            <div className="grid grid-cols-2 gap-24">
              <p>
                Availability Status{" "}
                <span
                  className={`font-semibold ${
                    availableCopies > 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {availableCopies > 0 ? "Available" : "Unavailable"}
                </span>
              </p>
              <p>
                Successfully Returned{" "}
                <span className="font-semibold text-light-200">
                  {borrowStats[0]?.returnedBorrows || 0}
                </span>
              </p>
            </div>
          </div>
        </div>

        <p className="book-description">{description}</p>

        {user && (
          <div className="flex gap-4">
            {/* Show Return Book button if user has an active borrow */}
            {hasExistingBorrow &&
            userExistingBorrow[0]?.status === "BORROWED" ? (
              <ReturnBookButton
                recordId={userExistingBorrow[0].id}
                bookTitle={title}
                dueDate={userExistingBorrow[0].dueDate}
              />
            ) : (
              <BorrowBook
                bookId={id}
                userId={userId}
                borrowingEligibility={borrowingEligibility}
              />
            )}
            {!isDetailPage && (
              <a
                href={`/books/${id}`}
                className="book-overview_btn flex items-center gap-2 rounded-lg bg-gray-600 px-6 py-3 text-white transition-colors hover:bg-gray-700"
              >
                <img
                  src="/icons/book.svg"
                  alt="book details"
                  width={20}
                  height={20}
                />
                <p className="font-bebas-neue text-xl text-dark-100">
                  Book Details
                </p>
              </a>
            )}
          </div>
        )}
      </div>

      <div className="relative flex flex-1 justify-center">
        <div className="relative">
          <BookCover
            variant="wide"
            className="z-10"
            coverColor={coverColor}
            coverImage={coverUrl}
          />

          <div className="absolute left-16 top-10 rotate-12 opacity-40 max-sm:hidden">
            <BookCover
              variant="wide"
              coverColor={coverColor}
              coverImage={coverUrl}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookOverview;
