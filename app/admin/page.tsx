import React from "react";
import { getAllUsers } from "@/lib/admin/actions/user";
import { getAllBorrowRequests } from "@/lib/admin/actions/borrow";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) => {
  const params = await searchParams;
  // Fetch all data for dashboard
  const [usersResult, borrowResult, booksResult] = await Promise.all([
    getAllUsers(),
    getAllBorrowRequests(),
    db.select().from(books),
  ]);

  const users = usersResult.success ? usersResult.data : [];
  const borrowRequests = borrowResult.success ? borrowResult.data : [];
  const allBooks = booksResult;

  // Calculate statistics
  const totalUsers = users.length;
  const approvedUsers = users.filter((u) => u.status === "APPROVED").length;
  const pendingUsers = users.filter((u) => u.status === "PENDING").length;
  const adminUsers = users.filter((u) => u.role === "ADMIN").length;

  const totalBooks = allBooks.length;
  const totalCopies = allBooks.reduce((sum, book) => sum + book.totalCopies, 0);
  const availableCopies = allBooks.reduce(
    (sum, book) => sum + book.availableCopies,
    0
  );

  // Calculate borrowed copies based on actual BORROWED status (not PENDING)
  const borrowedCopies = borrowRequests.filter(
    (r) => r.status === "BORROWED"
  ).length;

  // Enhanced book statistics
  const activeBooks = allBooks.filter((book) => book.isActive).length;
  const inactiveBooks = allBooks.filter((book) => !book.isActive).length;
  const booksWithISBN = allBooks.filter((book) => book.isbn).length;
  const booksWithPublisher = allBooks.filter((book) => book.publisher).length;
  const averagePageCount =
    allBooks
      .filter((book) => book.pageCount)
      .reduce((sum, book) => sum + (book.pageCount || 0), 0) /
      allBooks.filter((book) => book.pageCount).length || 0;

  const activeBorrows = borrowRequests.filter(
    (r) => r.status === "BORROWED"
  ).length;
  const pendingBorrows = borrowRequests.filter(
    (r) => r.status === "PENDING"
  ).length;
  const returnedBooks = borrowRequests.filter(
    (r) => r.status === "RETURNED"
  ).length;

  const recentBorrows = borrowRequests.slice(0, 5);
  const recentUsers = users.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {params.success === "admin-granted" && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                🎉 Admin Access Granted!
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>
                  You are now an admin! You can access all admin features and
                  manage the library system.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="stat">
          <div className="stat-info">
            <h3 className="stat-label">Total Users</h3>
            <p className="text-2xl font-bold text-blue-600">{totalUsers}</p>
          </div>
          <div className="text-sm text-gray-500">
            {approvedUsers} approved, {pendingUsers} pending
          </div>
        </div>

        <div className="stat">
          <div className="stat-info">
            <h3 className="stat-label">Total Books</h3>
            <p className="text-2xl font-bold text-green-600">{totalBooks}</p>
          </div>
          <div className="text-sm text-gray-500">
            {totalCopies} total copies
          </div>
        </div>

        <div className="stat">
          <div className="stat-info">
            <h3 className="stat-label">Active Borrows</h3>
            <p className="text-2xl font-bold text-purple-600">
              {activeBorrows}
            </p>
          </div>
          <div className="text-sm text-gray-500">
            {pendingBorrows} pending, {returnedBooks} returned
          </div>
        </div>

        <div className="stat">
          <div className="stat-info">
            <h3 className="stat-label">Admins</h3>
            <p className="text-2xl font-bold text-orange-600">{adminUsers}</p>
          </div>
          <div className="text-sm text-gray-500">System administrators</div>
        </div>

        <div className="stat">
          <div className="stat-info">
            <h3 className="stat-label">Book Status</h3>
            <p className="text-2xl font-bold text-indigo-600">{activeBooks}</p>
          </div>
          <div className="text-sm text-gray-500">
            {activeBooks} active, {inactiveBooks} inactive
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Book Availability Chart */}
        <div className="stat">
          <h3 className="text-lg font-semibold mb-4">Book Availability</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Available Copies</span>
              <span className="font-medium">{availableCopies}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${(availableCopies / totalCopies) * 100}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm">Borrowed Copies</span>
              <span className="font-medium">{borrowedCopies}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${(borrowedCopies / totalCopies) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* User Status Chart */}
        <div className="stat">
          <h3 className="text-lg font-semibold mb-4">User Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Approved Users</span>
              <span className="font-medium">{approvedUsers}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${(approvedUsers / totalUsers) * 100}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm">Pending Users</span>
              <span className="font-medium">{pendingUsers}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-600 h-2 rounded-full"
                style={{ width: `${(pendingUsers / totalUsers) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Enhanced Book Information Chart */}
        <div className="stat">
          <h3 className="text-lg font-semibold mb-4">Book Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Books with ISBN</span>
              <span className="font-medium">{booksWithISBN}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full"
                style={{ width: `${(booksWithISBN / totalBooks) * 100}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm">Books with Publisher</span>
              <span className="font-medium">{booksWithPublisher}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full"
                style={{ width: `${(booksWithPublisher / totalBooks) * 100}%` }}
              ></div>
            </div>

            {averagePageCount > 0 && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Avg Page Count</span>
                  <span className="font-medium">
                    {Math.round(averagePageCount)}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Borrows */}
        <div className="stat">
          <h3 className="text-lg font-semibold mb-4">Recent Borrows</h3>
          <div className="space-y-3">
            {recentBorrows.length === 0 ? (
              <p className="text-gray-500 text-sm">No recent borrows</p>
            ) : (
              recentBorrows.map((borrow) => (
                <div
                  key={borrow.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded"
                >
                  <div>
                    <p className="font-medium text-sm">{borrow.bookTitle}</p>
                    <p className="text-xs text-gray-600">
                      by {borrow.userName}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      borrow.status === "BORROWED"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {borrow.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="stat">
          <h3 className="text-lg font-semibold mb-4">Recent Users</h3>
          <div className="space-y-3">
            {recentUsers.length === 0 ? (
              <p className="text-gray-500 text-sm">No recent users</p>
            ) : (
              recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded"
                >
                  <div>
                    <p className="font-medium text-sm">{user.fullName}</p>
                    <p className="text-xs text-gray-600">{user.email}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === "APPROVED"
                        ? "bg-green-100 text-green-800"
                        : user.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
