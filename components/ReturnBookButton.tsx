"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { returnBook } from "@/lib/admin/actions/borrow";
import { showToast } from "@/lib/toast";

interface Props {
  recordId: string;
  bookTitle: string;
  dueDate: Date | null; // Can be null for pending requests
}

const ReturnBookButton = ({ recordId, bookTitle, dueDate }: Props) => {
  const router = useRouter();
  const [returning, setReturning] = useState(false);

  const handleReturnBook = async () => {
    setReturning(true);

    try {
      const result = await returnBook(recordId);

      if (result.success) {
        if (result.data?.isOverdue) {
          showToast.warning(
            "Book Returned with Fine",
            `"${bookTitle}" was returned ${result.data.daysOverdue} days overdue. Fine: $${result.data.fineAmount.toFixed(2)}`
          );
        } else {
          showToast.book.returnSuccess(bookTitle);
        }

        // Refresh the page to update the data
        setTimeout(() => {
          router.refresh();
        }, 1000);
      } else {
        showToast.book.returnError(result.error || "Failed to return book");
      }
    } catch (error) {
      console.error("Error returning book:", error);
      showToast.book.returnError("An error occurred while returning the book");
    } finally {
      setReturning(false);
    }
  };

  // Calculate if book is overdue (only if dueDate exists)
  const today = new Date();
  const isOverdue = dueDate && today > new Date(dueDate);
  const daysOverdue = isOverdue
    ? Math.floor(
        (today.getTime() - new Date(dueDate).getTime()) / (1000 * 60 * 60 * 24)
      )
    : 0;

  return (
    <Button
      className={`book-overview_btn ${isOverdue ? "bg-red-600 hover:bg-red-700" : "bg-orange-600 hover:bg-orange-700"}`}
      onClick={handleReturnBook}
      disabled={returning}
    >
      <img src="/icons/book.svg" alt="return book" width={20} height={20} />
      <p className="font-bebas-neue text-xl text-dark-100">
        {returning
          ? "Returning..."
          : isOverdue
            ? `Return Book (${daysOverdue} days overdue)`
            : "Return Book"}
      </p>
    </Button>
  );
};

export default ReturnBookButton;
