import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import BookCover from "@/components/BookCover";

const Page = async () => {
  const allBooks = await db.select().from(books);

  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">All Books ({allBooks.length})</h2>
        <Button className="bg-primary-admin" asChild>
          <Link href="/admin/books/new" className="text-white">
            + Create a New Book
          </Link>
        </Button>
      </div>

      <div className="mt-7 w-full overflow-hidden">
        {allBooks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No books found. Create your first book!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allBooks.map((book) => (
              <div
                key={book.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <BookCover
                    coverColor={book.coverColor}
                    coverImage={book.coverUrl}
                    className="w-16 h-20"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-gray-600 text-sm">by {book.author}</p>
                    <p className="text-xs text-gray-500 mt-1">{book.genre}</p>

                    <div className="mt-3 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Total Copies:</span>
                        <span className="font-medium">{book.totalCopies}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Available:</span>
                        <span
                          className={`font-medium ${
                            book.availableCopies > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {book.availableCopies}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Rating:</span>
                        <span className="font-medium">{book.rating}/5</span>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Button size="sm" asChild>
                        <Link href={`/books/${book.id}`} className="text-white">
                          View Details
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/admin/books/${book.id}/edit`}>
                          Edit Book
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Page;
