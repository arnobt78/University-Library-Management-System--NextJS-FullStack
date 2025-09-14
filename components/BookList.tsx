import React from "react";
import BookCard from "@/components/BookCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Props {
  title: string;
  books: Book[];
  containerClassName?: string;
  showViewAllButton?: boolean;
}

const BookList = ({
  title,
  books,
  containerClassName,
  showViewAllButton = false,
}: Props) => {
  return (
    <section className={containerClassName}>
      <h2 className="font-bebas-neue text-4xl text-light-100">{title}</h2>

      {books.length > 0 ? (
        <ul className="book-list">
          {books.map((book) => (
            <BookCard key={book.title} {...book} isLoanedBook={false} />
          ))}
        </ul>
      ) : (
        <p className="text-lg text-light-100">No books available.</p>
      )}

      {showViewAllButton && (
        <div className="mt-12 flex justify-center">
          <Link href="/all-books">
            <Button className="p-6 font-bebas-neue text-xl text-dark-100">
              View All Books
            </Button>
          </Link>
        </div>
      )}
    </section>
  );
};
export default BookList;
