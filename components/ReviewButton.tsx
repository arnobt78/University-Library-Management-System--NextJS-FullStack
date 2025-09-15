"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import ReviewFormDialog from "@/components/ReviewFormDialog";
import { MessageCircle } from "lucide-react";

interface ReviewButtonProps {
  bookId: string;
  userId: string;
}

export default function ReviewButton({
  bookId,
  userId: _userId,
}: ReviewButtonProps) {
  const [canReview, setCanReview] = useState(false);
  const [hasExistingReview, setHasExistingReview] = useState(false);
  const [isCurrentlyBorrowed, setIsCurrentlyBorrowed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);

  const checkReviewEligibility = useCallback(async () => {
    try {
      const response = await fetch(`/api/reviews/eligibility/${bookId}`);
      const result = await response.json();

      if (result.success) {
        setCanReview(result.canReview);
        setHasExistingReview(result.hasExistingReview);
        setIsCurrentlyBorrowed(result.isCurrentlyBorrowed);
      }
    } catch (error) {
      console.error("Error checking review eligibility:", error);
    } finally {
      setIsLoading(false);
    }
  }, [bookId]);

  useEffect(() => {
    checkReviewEligibility();
  }, [checkReviewEligibility]);

  const handleReviewSubmitted = () => {
    setShowDialog(false);
    setHasExistingReview(true);
    // Refresh the page to show the new review
    window.location.reload();
  };

  if (isLoading) {
    return (
      <Button
        disabled
        className="flex items-center gap-2 border-gray-600 bg-gray-700/50 text-light-200/50"
      >
        <MessageCircle className="size-5 text-light-200/50" />
        <p className="font-bebas-neue text-xl text-light-200/50">Loading...</p>
      </Button>
    );
  }

  if (hasExistingReview) {
    return (
      <Button
        disabled
        className="hover:bg-primary/90 mt-4 min-h-14 w-fit bg-primary text-dark-100 max-md:w-full"
      >
        <MessageCircle className="size-6 text-dark-100" />
        <p className="font-bebas-neue text-xl text-dark-100">
          Review Submitted
        </p>
      </Button>
    );
  }

  if (!canReview) {
    return (
      <Button
        disabled
        className="hover:bg-primary/90 mt-4 min-h-14 w-fit bg-primary text-dark-100 max-md:w-full"
      >
        <MessageCircle className="size-6 text-dark-100" />
        <p className="font-bebas-neue text-xl text-dark-100">
          {isCurrentlyBorrowed
            ? "Return Borrow Book to Review"
            : "Borrow Book to Review"}
        </p>
      </Button>
    );
  }

  return (
    <>
      <Button
        onClick={() => setShowDialog(true)}
        className="hover:bg-primary/90 mt-4 min-h-14 w-fit bg-primary text-dark-100 max-md:w-full"
      >
        <MessageCircle className="size-6 text-dark-100" />
        <p className="font-bebas-neue text-xl text-dark-100">
          Review This Book
        </p>
      </Button>

      <ReviewFormDialog
        bookId={bookId}
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </>
  );
}
