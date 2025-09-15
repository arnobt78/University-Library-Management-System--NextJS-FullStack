"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BookCover from "@/components/BookCover";
import CountdownTimer from "@/components/CountdownTimer";
import { useRouter } from "next/navigation";
import { returnBook } from "@/lib/admin/actions/borrow";
import { showToast } from "@/lib/toast";
// Define the actual data structure from the database query
interface BorrowRecordWithBook {
  id: string;
  userId: string;
  bookId: string;
  borrowDate: Date;
  dueDate: Date | null; // Can be null for pending requests
  returnDate?: Date | null;
  status: "PENDING" | "BORROWED" | "RETURNED";
  borrowedBy?: string | null;
  returnedBy?: string | null;
  fineAmount: number;
  notes?: string | null;
  renewalCount: number;
  lastReminderSent?: Date | null;
  updatedAt: Date | null;
  updatedBy?: string | null;
  createdAt: Date | null;
  book: {
    id: string;
    title: string;
    author: string;
    genre: string;
    rating: number;
    totalCopies: number;
    availableCopies: number;
    description: string;
    coverColor: string;
    coverUrl: string;
    videoUrl: string;
    summary: string;
    isbn?: string | null;
    publicationYear?: number | null;
    publisher?: string | null;
    language?: string | null;
    pageCount?: number | null;
    edition?: string | null;
    isActive: boolean;
    createdAt: Date | null;
    updatedAt: Date | null;
    updatedBy?: string | null;
  };
}

interface MyProfileTabsProps {
  activeBorrows: BorrowRecordWithBook[];
  pendingRequests: BorrowRecordWithBook[];
  borrowHistory: BorrowRecordWithBook[];
  totalReviews: number;
}

const MyProfileTabs: React.FC<MyProfileTabsProps> = ({
  activeBorrows,
  pendingRequests,
  borrowHistory,
  totalReviews,
}) => {
  const router = useRouter();
  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="secondary">Pending Approval</Badge>;
      case "BORROWED":
        return <Badge variant="default">Currently Borrowed</Badge>;
      case "RETURNED":
        return <Badge variant="outline">Returned</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const BorrowCard: React.FC<{
    record: BorrowRecordWithBook;
    showCountdown?: boolean;
  }> = ({ record, showCountdown = false }) => {
    const handleViewDetails = () => {
      router.push(`/books/${record.book.id}`);
    };

    const handleReturnBook = async () => {
      try {
        const result = await returnBook(record.id);
        if (result.success) {
          if (result.data?.isOverdue) {
            showToast.warning(
              "Book Returned with Fine",
              `"${record.book.title}" was returned ${result.data.daysOverdue} days overdue. Fine: $${result.data.fineAmount.toFixed(2)}`
            );
          } else {
            showToast.book.returnSuccess(record.book.title);
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
        showToast.book.returnError(
          "An error occurred while returning the book"
        );
      }
    };

    // Calculate if book is overdue (only for BORROWED status with dueDate)
    const today = new Date();
    const isOverdue =
      record.status === "BORROWED" &&
      record.dueDate &&
      today > new Date(record.dueDate);
    const daysOverdue = isOverdue
      ? Math.floor(
          (today.getTime() - new Date(record.dueDate!).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;
    const calculatedFine = isOverdue ? daysOverdue * 1.0 : 0;

    return (
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex gap-4">
            {/* Full-height Book Cover */}
            <div className="shrink-0">
              <BookCover
                variant="regular"
                coverColor={record.book.coverColor}
                coverImage={record.book.coverUrl}
                className="h-full"
              />
            </div>

            {/* Main Content */}
            <div className="min-w-0 flex-1">
              {/* Header Row: Title and Status */}
              <div className="mb-3 flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {record.book.title}
                    </h3>
                    {/* Overdue Warning */}
                    {isOverdue && (
                      <Badge variant="destructive" className="text-xs">
                        OVERDUE ({daysOverdue} days)
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    by {record.book.author}
                  </p>
                </div>
                <div className="ml-4 shrink-0">
                  {getStatusBadge(record.status)}
                </div>
              </div>

              {/* Second Row: Category and Rating */}
              <div className="mb-3 flex items-center gap-4">
                <Badge variant="outline" className="px-2 py-1 text-sm">
                  {record.book.genre}
                </Badge>
                <div className="flex items-center gap-1">
                  <img
                    src="/icons/star.svg"
                    alt="rating"
                    width={16}
                    height={16}
                  />
                  <span className="text-sm text-gray-600">
                    {record.book.rating}
                  </span>
                </div>
              </div>

              {/* Third Row: Borrow Dates and Status */}
              <div className="mb-3 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Borrowed</span>
                  <p className="text-gray-600">
                    {formatDate(record.borrowDate)}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Due</span>
                  <p className="text-gray-600">
                    {record.dueDate ? formatDate(record.dueDate) : "Not set"}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Status</span>
                  <p className="text-gray-600">
                    {record.status === "RETURNED" && record.returnDate
                      ? formatDate(record.returnDate)
                      : record.status === "PENDING"
                        ? "Awaiting"
                        : "Active"}
                  </p>
                </div>
              </div>

              {/* Fourth Row: ISBN and Countdown */}
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {record.book.isbn && (
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-gray-700">
                        ISBN:
                      </span>
                      <span className="font-mono text-sm text-gray-600">
                        {record.book.isbn.slice(-4)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Countdown Timer - only show for BORROWED status with dueDate */}
                {showCountdown &&
                  record.status === "BORROWED" &&
                  record.dueDate && (
                    <div className="shrink-0">
                      <CountdownTimer
                        dueDate={record.dueDate}
                        borrowDate={record.borrowDate}
                      />
                    </div>
                  )}
              </div>

              {/* Additional Info Row */}
              <div className="flex items-center justify-between">
                {/* Status-specific compact info - only show helpful context, not redundant info */}
                {record.status === "PENDING" && (
                  <div className="flex items-center gap-2 text-sm">
                    <img
                      src="/icons/clock.svg"
                      alt="pending"
                      width={16}
                      height={16}
                    />
                    <span className="text-yellow-700">
                      Awaiting admin approval
                    </span>
                  </div>
                )}

                {showCountdown &&
                  record.status === "BORROWED" &&
                  record.dueDate && (
                    <div className="flex items-center gap-2 text-sm">
                      <img
                        src="/icons/book.svg"
                        alt="borrowed"
                        width={16}
                        height={16}
                      />
                      <span
                        className={isOverdue ? "text-red-700" : "text-blue-700"}
                      >
                        {isOverdue
                          ? `OVERDUE! Please return immediately (${daysOverdue} days late)`
                          : `Currently borrowed, please return on ${formatDate(record.dueDate)}`}
                      </span>
                    </div>
                  )}

                {record.status === "RETURNED" && (
                  <div className="flex items-center gap-2 text-sm">
                    <img
                      src="/icons/calendar.svg"
                      alt="returned"
                      width={16}
                      height={16}
                    />
                    <span className="text-green-700">
                      Successfully returned
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  {/* Show existing fine or calculated overdue fine */}
                  {(record.fineAmount > 0 || calculatedFine > 0) && (
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-red-600">
                        $
                        {(record.fineAmount > 0
                          ? record.fineAmount
                          : calculatedFine
                        ).toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {isOverdue ? "overdue fine" : "fine"}
                      </span>
                    </div>
                  )}
                  {record.renewalCount > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-purple-600">
                        {record.renewalCount}
                      </span>
                      <span className="text-sm text-gray-500">renewals</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  {/* Return Book Button - only show for BORROWED status */}
                  {record.status === "BORROWED" && (
                    <button
                      onClick={handleReturnBook}
                      className="flex items-center gap-1 rounded-md bg-red-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-red-700"
                    >
                      <img
                        src="/icons/book.svg"
                        alt="return book"
                        width={16}
                        height={16}
                      />
                      <span className="font-medium">Return Book</span>
                    </button>
                  )}

                  {/* View Book Details Link - hide for RETURNED status */}
                  {record.status !== "RETURNED" && (
                    <button
                      onClick={handleViewDetails}
                      className="flex items-center gap-1 text-sm text-blue-600 transition-colors hover:text-blue-800"
                    >
                      <img
                        src="/icons/book.svg"
                        alt="view details"
                        width={16}
                        height={16}
                      />
                      <span className="font-medium">View Book Details</span>
                    </button>
                  )}

                  {/* Review This Book Link - only show for RETURNED status */}
                  {record.status === "RETURNED" && (
                    <button
                      onClick={handleViewDetails}
                      className="flex items-center gap-1 text-sm text-green-600 transition-colors hover:text-green-800"
                    >
                      <img
                        src="/icons/star.svg"
                        alt="review book"
                        width={16}
                        height={16}
                      />
                      <span className="font-medium">Review This Book</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto">
      <h1 className="mb-6 text-3xl font-bold text-light-100">
        My Borrowing History
      </h1>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">
            Active Borrows ({activeBorrows.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending Requests ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="history">
            Borrow History ({borrowHistory.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-0">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Currently Borrowed Books</h2>
            {activeBorrows.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">No active borrows</p>
                </CardContent>
              </Card>
            ) : (
              activeBorrows.map((record) => (
                <BorrowCard
                  key={record.id}
                  record={record}
                  showCountdown={true}
                />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="mt-0">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Pending Approval</h2>
            {pendingRequests.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">No pending requests</p>
                </CardContent>
              </Card>
            ) : (
              pendingRequests.map((record) => (
                <BorrowCard key={record.id} record={record} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-0">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Complete Borrow History</h2>
            {borrowHistory.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">No borrow history</p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Statistics */}
                <Card className="mb-4">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">
                      📊 Borrow Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                      <div className="rounded-lg bg-gray-50 p-2 text-center">
                        <p className="text-xl font-bold text-gray-900">
                          {borrowHistory.length}
                        </p>
                        <p className="text-xs text-gray-600">Total Borrows</p>
                      </div>
                      <div className="rounded-lg bg-blue-50 p-2 text-center">
                        <p className="text-xl font-bold text-blue-600">
                          {
                            borrowHistory.filter((r) => r.status === "PENDING")
                              .length
                          }
                        </p>
                        <p className="text-xs text-blue-700">Pending</p>
                      </div>
                      <div className="rounded-lg bg-orange-50 p-2 text-center">
                        <p className="text-xl font-bold text-orange-600">
                          {
                            borrowHistory.filter((r) => r.status === "BORROWED")
                              .length
                          }
                        </p>
                        <p className="text-xs text-orange-700">Active</p>
                      </div>
                      <div className="rounded-lg bg-green-50 p-2 text-center">
                        <p className="text-xl font-bold text-green-600">
                          {
                            borrowHistory.filter((r) => r.status === "RETURNED")
                              .length
                          }
                        </p>
                        <p className="text-xs text-green-700">Returned</p>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                      <div className="rounded-lg bg-red-50 p-2 text-center">
                        <p className="text-lg font-bold text-red-600">
                          {borrowHistory.filter((r) => r.fineAmount > 0).length}
                        </p>
                        <p className="text-xs text-red-700">With Fines</p>
                      </div>
                      <div className="rounded-lg bg-red-50 p-2 text-center">
                        <p className="text-lg font-bold text-red-600">
                          $
                          {borrowHistory
                            .reduce((sum, r) => sum + r.fineAmount, 0)
                            .toFixed(2)}
                        </p>
                        <p className="text-xs text-red-700">Total Fines</p>
                      </div>
                      <div className="rounded-lg bg-purple-50 p-2 text-center">
                        <p className="text-lg font-bold text-purple-600">
                          {borrowHistory.reduce(
                            (sum, r) => sum + r.renewalCount,
                            0
                          )}
                        </p>
                        <p className="text-xs text-purple-700">
                          Total Renewals
                        </p>
                      </div>
                      <div className="rounded-lg bg-indigo-50 p-2 text-center">
                        <p className="text-lg font-bold text-indigo-600">
                          {totalReviews}
                        </p>
                        <p className="text-xs text-indigo-700">Total Reviews</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* History List */}
                {borrowHistory
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt || 0).getTime() -
                      new Date(a.createdAt || 0).getTime()
                  )
                  .map((record) => (
                    <BorrowCard key={record.id} record={record} />
                  ))}
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyProfileTabs;
