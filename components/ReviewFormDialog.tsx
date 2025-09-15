"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Star } from "lucide-react";

interface ReviewFormDialogProps {
  bookId: string;
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted: () => void;
}

export default function ReviewFormDialog({
  bookId,
  isOpen,
  onClose,
  onReviewSubmitted,
}: ReviewFormDialogProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) {
      toast({
        title: "Error",
        description: "Please write a comment",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/reviews/${bookId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
          comment: comment.trim(),
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success",
          description: "Your review has been submitted successfully!",
        });
        // Add delay before closing to let user see the toast
        setTimeout(() => {
          onReviewSubmitted();
          onClose();
          // Reset form
          setRating(5);
          setComment("");
        }, 1500);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to submit review",
          variant: "destructive",
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      // Reset form when closing
      setRating(5);
      setComment("");
    }
  };

  const StarRating = () => (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          className="transition-colors hover:scale-110"
        >
          <Star
            className={`size-6 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-300 text-gray-300"
            }`}
          />
        </button>
      ))}
      <span className="ml-2 text-sm text-light-200/70">
        {rating} star{rating !== 1 ? "s" : ""}
      </span>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="border-gray-600 bg-gray-800/95 sm:max-w-md [&>button]:text-white [&>button]:hover:text-white">
        <DialogHeader>
          <DialogTitle className="text-light-100">Write a Review</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-light-200">Rating</label>
            <StarRating />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-light-200">
              Your Review
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about this book..."
              className="w-full resize-none rounded-md border border-gray-600 bg-gray-700/50 px-3 py-2 text-sm text-light-100 placeholder:text-light-200/50 focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400"
              rows={4}
              required
            />
            <p className="text-xs text-light-200/70">
              {comment.length}/500 characters
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="border-gray-500 bg-gray-600 text-white hover:bg-gray-500 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !comment.trim()}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
