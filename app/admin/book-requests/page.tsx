import React from "react";
import { Button } from "@/components/ui/button";
import {
  getAllBorrowRequests,
  returnBook,
  approveBorrowRequest,
  rejectBorrowRequest,
} from "@/lib/admin/actions/borrow";
import { redirect } from "next/navigation";
import BookCover from "@/components/BookCover";

const Page = async () => {
  const result = await getAllBorrowRequests();

  if (!result.success) {
    return <div>Error loading borrow requests: {result.error}</div>;
  }

  const requests = result.data || [];

  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">
          Borrow Requests ({requests.length})
        </h2>
      </div>

      <div className="mt-7 w-full overflow-hidden">
        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              No borrow requests found.
            </div>
          ) : (
            requests.map((request) => (
              <div
                key={request.id}
                className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
              >
                <div className="flex items-start gap-4">
                  {/* Book Cover */}
                  <div className="shrink-0">
                    <BookCover
                      coverColor={request.bookCoverColor}
                      coverImage={request.bookCoverUrl}
                      className="h-20 w-16"
                    />
                  </div>

                  {/* Request Details */}
                  <div className="flex-1">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {request.bookTitle}
                        </h3>
                        <p className="text-gray-600">by {request.bookAuthor}</p>
                        <p className="text-sm text-gray-500">
                          {request.bookGenre}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-medium">Borrower Details</h4>
                        <p className="text-sm">{request.userName}</p>
                        <p className="text-sm text-gray-600">
                          {request.userEmail}
                        </p>
                        <p className="text-sm text-gray-500">
                          ID: {request.userUniversityId}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                      <div>
                        <span className="font-medium">Borrow Date:</span>
                        <p>
                          {new Date(request.borrowDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Due Date:</span>
                        <p>{new Date(request.dueDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="font-medium">Status:</span>
                        <span
                          className={`ml-2 rounded-full px-2 py-1 text-xs font-medium ${
                            request.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-800"
                              : request.status === "BORROWED"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {request.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="shrink-0">
                    {request.status === "PENDING" && (
                      <div className="flex gap-2">
                        <form
                          action={async () => {
                            "use server";
                            const result = await approveBorrowRequest(
                              request.id
                            );
                            if (result.success) {
                              redirect("/admin/book-requests?success=approved");
                            } else {
                              redirect("/admin/book-requests?error=failed");
                            }
                          }}
                        >
                          <Button className="bg-green-600 hover:bg-green-700">
                            Approve
                          </Button>
                        </form>
                        <form
                          action={async () => {
                            "use server";
                            const result = await rejectBorrowRequest(
                              request.id
                            );
                            if (result.success) {
                              redirect("/admin/book-requests?success=rejected");
                            } else {
                              redirect("/admin/book-requests?error=failed");
                            }
                          }}
                        >
                          <Button variant="destructive">Reject</Button>
                        </form>
                      </div>
                    )}
                    {request.status === "BORROWED" && (
                      <form
                        action={async () => {
                          "use server";
                          const result = await returnBook(request.id);
                          if (result.success) {
                            redirect("/admin/book-requests?success=returned");
                          } else {
                            redirect("/admin/book-requests?error=failed");
                          }
                        }}
                      >
                        <Button className="bg-green-600 hover:bg-green-700">
                          Mark as Returned
                        </Button>
                      </form>
                    )}
                    {request.status === "RETURNED" && (
                      <div className="text-sm text-gray-500">
                        Returned on:{" "}
                        {request.returnDate
                          ? new Date(request.returnDate).toLocaleDateString()
                          : "N/A"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Page;
