"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
// import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { borrowBook } from "@/lib/actions/book";

interface Props {
  userId: string;
  bookId: string;
  borrowingEligibility: {
    isEligible: boolean;
    message: string;
  };
}

const BorrowBook = ({
  userId,
  bookId,
  borrowingEligibility: { isEligible, message },
}: Props) => {
  const router = useRouter();
  const [borrowing, setBorrowing] = useState(false);

  const handleBorrowBook = async () => {
    if (!isEligible) {
      toast({
        title: "⚠️ Cannot Borrow Book",
        description: message,
        variant: "destructive",
      });
      return;
    }

    setBorrowing(true);

    try {
      const result = await borrowBook({ bookId, userId });

      if (result.success) {
        toast({
          title: "📚 Borrow Request Submitted!",
          description:
            "Your borrow request has been submitted and is pending admin approval. Check your profile for updates.",
        });

        // Use setTimeout to ensure the toast is shown before navigation
        setTimeout(() => {
          router.push("/my-profile");
        }, 100);
      } else {
        toast({
          title: "❌ Borrowing Failed",
          description:
            result.error ||
            "Unable to borrow the book at this time. Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Borrow book error:", error);
      toast({
        title: "❌ Network Error",
        description:
          "Unable to connect to the server. Please check your internet connection and try again.",
        variant: "destructive",
      });
    } finally {
      setBorrowing(false);
    }
  };

  return (
    <Button
      className="book-overview_btn"
      onClick={handleBorrowBook}
      disabled={borrowing}
    >
      <img src="/icons/book.svg" alt="book" width={20} height={20} />
      <p className="font-bebas-neue text-xl text-dark-100">
        {borrowing ? "Borrowing ..." : "Borrow Book"}
      </p>
    </Button>
  );
};
export default BorrowBook;
