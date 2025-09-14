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

  // Calculate statistics with null safety
  const totalUsers = users?.length || 0;
  const approvedUsers =
    users?.filter((u) => u.status === "APPROVED").length || 0;
  const pendingUsers = users?.filter((u) => u.status === "PENDING").length || 0;
  const adminUsers = users?.filter((u) => u.role === "ADMIN").length || 0;

  const totalBooks = allBooks.length;
  const totalCopies = allBooks.reduce((sum, book) => sum + book.totalCopies, 0);
  const availableCopies = allBooks.reduce(
    (sum, book) => sum + book.availableCopies,
    0
  );

  // Calculate borrowed copies based on actual BORROWED status (not PENDING)
  const borrowedCopies =
    borrowRequests?.filter((r) => r.status === "BORROWED").length || 0;

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

  const activeBorrows =
    borrowRequests?.filter((r) => r.status === "BORROWED").length || 0;
  const pendingBorrows =
    borrowRequests?.filter((r) => r.status === "PENDING").length || 0;
  const returnedBooks =
    borrowRequests?.filter((r) => r.status === "RETURNED").length || 0;

  const recentBorrows = borrowRequests?.slice(0, 5) || [];
  const recentUsers = users?.slice(0, 5) || [];

  // Calculate book categories
  const categoryStats = allBooks.reduce(
    (acc, book) => {
      const genre = book.genre || "Unknown";
      if (!acc[genre]) {
        acc[genre] = {
          count: 0,
          totalCopies: 0,
          availableCopies: 0,
          avgRating: 0,
          totalRating: 0,
          ratingCount: 0,
        };
      }
      acc[genre].count += 1;
      acc[genre].totalCopies += book.totalCopies;
      acc[genre].availableCopies += book.availableCopies;
      if (book.rating && book.rating > 0) {
        acc[genre].totalRating += book.rating;
        acc[genre].ratingCount += 1;
      }
      return acc;
    },
    {} as Record<
      string,
      {
        count: number;
        totalCopies: number;
        availableCopies: number;
        avgRating: number;
        totalRating: number;
        ratingCount: number;
      }
    >
  );

  // Calculate average ratings for each category
  Object.keys(categoryStats).forEach((genre) => {
    if (categoryStats[genre].ratingCount > 0) {
      categoryStats[genre].avgRating =
        categoryStats[genre].totalRating / categoryStats[genre].ratingCount;
    }
  });

  // Sort categories by book count
  const sortedCategories = Object.entries(categoryStats)
    .sort(([, a], [, b]) => b.count - a.count)
    .map(([genre, stats]) => ({ genre, ...stats }));

  // Calculate additional useful statistics
  const booksByYear = allBooks.reduce(
    (acc, book) => {
      const year = book.publicationYear || "Unknown";
      if (!acc[year]) {
        acc[year] = 0;
      }
      acc[year] += 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const sortedBooksByYear = Object.entries(booksByYear)
    .sort(([a], [b]) => {
      if (a === "Unknown") return 1;
      if (b === "Unknown") return -1;
      return parseInt(b) - parseInt(a);
    })
    .slice(0, 5);

  const booksByLanguage = allBooks.reduce(
    (acc, book) => {
      const language = book.language || "Unknown";
      if (!acc[language]) {
        acc[language] = 0;
      }
      acc[language] += 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const sortedBooksByLanguage = Object.entries(booksByLanguage)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {params.success === "admin-granted" && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <div className="flex items-center">
            <div className="shrink-0">
              <svg
                className="size-5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule={"evenodd" as const}
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule={"evenodd" as const}
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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
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
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Book Availability Chart */}
        <div className="stat">
          <h3 className="mb-4 text-lg font-semibold">Book Availability</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Available Copies</span>
              <span className="font-medium">{availableCopies}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-green-600"
                style={{ width: `${(availableCopies / totalCopies) * 100}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Borrowed Copies</span>
              <span className="font-medium">{borrowedCopies}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-blue-600"
                style={{ width: `${(borrowedCopies / totalCopies) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* User Status Chart */}
        <div className="stat">
          <h3 className="mb-4 text-lg font-semibold">User Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Approved Users</span>
              <span className="font-medium">{approvedUsers}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-green-600"
                style={{ width: `${(approvedUsers / totalUsers) * 100}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Pending Users</span>
              <span className="font-medium">{pendingUsers}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-yellow-600"
                style={{ width: `${(pendingUsers / totalUsers) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Enhanced Book Information Chart */}
        <div className="stat">
          <h3 className="mb-4 text-lg font-semibold">Book Information</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Books with ISBN</span>
              <span className="font-medium">{booksWithISBN}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-indigo-600"
                style={{ width: `${(booksWithISBN / totalBooks) * 100}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Books with Publisher</span>
              <span className="font-medium">{booksWithPublisher}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-purple-600"
                style={{ width: `${(booksWithPublisher / totalBooks) * 100}%` }}
              ></div>
            </div>

            {averagePageCount > 0 && (
              <>
                <div className="flex items-center justify-between">
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
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Borrows */}
        <div className="stat">
          <h3 className="mb-4 text-lg font-semibold">Recent Borrows</h3>
          <div className="space-y-3">
            {recentBorrows.length === 0 ? (
              <p className="text-sm text-gray-500">No recent borrows</p>
            ) : (
              recentBorrows.map((borrow) => (
                <div
                  key={borrow.id}
                  className="flex items-center justify-between rounded bg-gray-50 p-3"
                >
                  <div>
                    <p className="text-sm font-medium">{borrow.bookTitle}</p>
                    <p className="text-xs text-gray-600">
                      by {borrow.userName}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
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
          <h3 className="mb-4 text-lg font-semibold">Recent Users</h3>
          <div className="space-y-3">
            {recentUsers.length === 0 ? (
              <p className="text-sm text-gray-500">No recent users</p>
            ) : (
              recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded bg-gray-50 p-3"
                >
                  <div>
                    <p className="text-sm font-medium">{user.fullName}</p>
                    <p className="text-xs text-gray-600">{user.email}</p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
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

      {/* Book Categories Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Book Categories */}
        <div className="stat">
          <h3 className="mb-4 text-lg font-semibold">📚 Book Categories</h3>
          <div className="space-y-3">
            {sortedCategories.length === 0 ? (
              <p className="text-sm text-gray-500">No books found</p>
            ) : (
              sortedCategories.map((category) => (
                <div
                  key={category.genre}
                  className="flex items-center justify-between rounded bg-gray-50 p-3"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">
                        {category.genre}
                      </span>
                      <span className="text-sm font-bold text-blue-600">
                        {category.count} books
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-xs text-gray-600">
                      <span>{category.totalCopies} total copies</span>
                      <span>{category.availableCopies} available</span>
                      {category.avgRating > 0 && (
                        <span className="flex items-center">
                          ⭐ {category.avgRating.toFixed(1)}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 h-1 w-full rounded-full bg-gray-200">
                      <div
                        className="h-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                        style={{
                          width: `${(category.count / totalBooks) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Books by Publication Year */}
        <div className="stat">
          <h3 className="mb-4 text-lg font-semibold">
            📅 Books by Publication Year
          </h3>
          <div className="space-y-3">
            {sortedBooksByYear.length === 0 ? (
              <p className="text-sm text-gray-500">No publication year data</p>
            ) : (
              sortedBooksByYear.map(([year, count]) => (
                <div
                  key={year}
                  className="flex items-center justify-between rounded bg-gray-50 p-3"
                >
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900">{year}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-green-600">
                      {count} books
                    </span>
                    <div className="h-2 w-16 rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                        style={{ width: `${(count / totalBooks) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Additional Statistics Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Books by Language */}
        <div className="stat">
          <h3 className="mb-4 text-lg font-semibold">🌍 Books by Language</h3>
          <div className="space-y-2">
            {sortedBooksByLanguage.length === 0 ? (
              <p className="text-sm text-gray-500">No language data</p>
            ) : (
              sortedBooksByLanguage.map(([language, count]) => (
                <div
                  key={language}
                  className="flex items-center justify-between rounded bg-gray-50 p-2"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {language}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-purple-600">
                      {count}
                    </span>
                    <div className="h-1 w-12 rounded-full bg-gray-200">
                      <div
                        className="h-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                        style={{ width: `${(count / totalBooks) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Rated Books */}
        <div className="stat">
          <h3 className="mb-4 text-lg font-semibold">⭐ Top Rated Books</h3>
          <div className="space-y-2">
            {allBooks
              .filter((book) => book.rating && book.rating > 0)
              .sort((a, b) => (b.rating || 0) - (a.rating || 0))
              .slice(0, 5).length === 0 ? (
              <p className="text-sm text-gray-500">No rated books</p>
            ) : (
              allBooks
                .filter((book) => book.rating && book.rating > 0)
                .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                .slice(0, 5)
                .map((book) => (
                  <div
                    key={book.id}
                    className="flex items-center justify-between rounded bg-gray-50 p-2"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {book.title}
                      </p>
                      <p className="truncate text-xs text-gray-600">
                        {book.author}
                      </p>
                    </div>
                    <div className="ml-2 flex items-center space-x-1">
                      <span className="text-xs font-bold text-yellow-600">
                        ⭐ {book.rating}
                      </span>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Library Health Metrics */}
        <div className="stat">
          <h3 className="mb-4 text-lg font-semibold">🏥 Library Health</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Collection Diversity
              </span>
              <span className="text-sm font-bold text-indigo-600">
                {sortedCategories.length} categories
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500"
                style={{
                  width: `${Math.min((sortedCategories.length / 10) * 100, 100)}%`,
                }}
              ></div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Availability Rate</span>
              <span className="text-sm font-bold text-green-600">
                {totalCopies > 0
                  ? Math.round((availableCopies / totalCopies) * 100)
                  : 0}
                %
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                style={{
                  width: `${totalCopies > 0 ? (availableCopies / totalCopies) * 100 : 0}%`,
                }}
              ></div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">User Engagement</span>
              <span className="text-sm font-bold text-purple-600">
                {totalUsers > 0
                  ? Math.round((activeBorrows / totalUsers) * 100)
                  : 0}
                %
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                style={{
                  width: `${totalUsers > 0 ? Math.min((activeBorrows / totalUsers) * 100, 100) : 0}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
