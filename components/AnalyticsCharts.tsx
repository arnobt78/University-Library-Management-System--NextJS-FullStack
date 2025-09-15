"use client";

import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface AnalyticsData {
  borrowingTrends: Array<{
    date: string;
    borrows: number;
    returns: number;
  }>;
  popularBooks: Array<{
    bookTitle: string;
    totalBorrows: number;
    activeBorrows: number;
    returnedBorrows: number;
  }>;
  popularGenres: Array<{
    genre: string;
    totalBorrows: number;
    uniqueBooks: number;
  }>;
  userActivity: Array<{
    userName: string;
    totalBorrows: number;
    activeBorrows: number;
    returnedBorrows: number;
  }>;
  overdueBooks: Array<{
    recordId: string;
    bookTitle: string;
    bookAuthor: string;
    userName: string;
    userEmail: string;
    borrowDate: Date;
    dueDate: string | null;
    daysOverdue: number;
    fineAmount: string | null;
  }>;
  overdueStats: {
    totalOverdue: number;
    avgDaysOverdue: number;
    totalFines: number;
  };
  monthlyStats: {
    currentMonth: {
      month: string;
      borrows: number;
    };
    lastMonth: {
      month: string;
      borrows: number;
    };
  };
  systemHealth: {
    totalBooks: number;
    totalUsers: number;
    activeBorrows: number;
    overdueBooks: number;
    recentActivity: number;
  };
}

interface AnalyticsChartsProps {
  data: AnalyticsData;
}

const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ data }) => {
  // Prepare data for charts
  const trendsData = data.borrowingTrends.map((trend) => ({
    date: new Date(trend.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    borrows: trend.borrows,
    returns: trend.returns,
  }));

  const popularBooksData = data.popularBooks.map((book) => ({
    title:
      book.bookTitle.length > 20
        ? book.bookTitle.substring(0, 20) + "..."
        : book.bookTitle,
    borrows: book.totalBorrows,
    active: book.activeBorrows,
    returned: book.returnedBorrows,
  }));

  const genresData = data.popularGenres.map((genre) => ({
    name: genre.genre,
    value: genre.totalBorrows,
    books: genre.uniqueBooks,
  }));

  const userActivityData = data.userActivity.slice(0, 10).map((user) => ({
    name:
      user.userName.length > 15
        ? user.userName.substring(0, 15) + "..."
        : user.userName,
    borrows: user.totalBorrows,
    active: user.activeBorrows,
    returned: user.returnedBorrows,
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          📊 Analytics Dashboard
        </h1>
        <p className="text-gray-600">
          Comprehensive insights into library operations and user behavior
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
          <div className="flex items-center">
            <div className="shrink-0">
              <div className="text-2xl">📚</div>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-blue-600">
                Total Books
              </div>
              <div className="text-2xl font-bold text-blue-900">
                {data.systemHealth?.totalBooks || 0}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-green-200 bg-green-50 p-6">
          <div className="flex items-center">
            <div className="shrink-0">
              <div className="text-2xl">👥</div>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-green-600">
                Total Users
              </div>
              <div className="text-2xl font-bold text-green-900">
                {data.systemHealth?.totalUsers || 0}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-purple-200 bg-purple-50 p-6">
          <div className="flex items-center">
            <div className="shrink-0">
              <div className="text-2xl">📖</div>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-purple-600">
                Active Borrows
              </div>
              <div className="text-2xl font-bold text-purple-900">
                {data.systemHealth?.activeBorrows || 0}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-orange-200 bg-orange-50 p-6">
          <div className="flex items-center">
            <div className="shrink-0">
              <div className="text-2xl">⚠️</div>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-orange-600">
                Overdue Books
              </div>
              <div className="text-2xl font-bold text-orange-900">
                {data.systemHealth?.overdueBooks || 0}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Borrowing Trends */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">Borrowing Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="borrows"
                stroke="#8884d8"
                strokeWidth={2}
                name="Borrows"
              />
              <Line
                type="monotone"
                dataKey="returns"
                stroke="#82ca9d"
                strokeWidth={2}
                name="Returns"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Popular Books */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">Popular Books</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={popularBooksData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="title" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="borrows" fill="#8884d8" name="Total Borrows" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Genre Distribution */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">Genre Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={genresData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {genresData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* User Activity */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">Top Users by Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userActivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="borrows" fill="#8884d8" name="Total Borrows" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Overdue Books Table */}
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">Overdue Books</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left">Book</th>
                <th className="px-4 py-2 text-left">User</th>
                <th className="px-4 py-2 text-left">Days Overdue</th>
                <th className="px-4 py-2 text-left">Fine Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.overdueBooks.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className="text-4xl">✅</div>
                      <div className="text-lg font-medium">
                        No Overdue Books
                      </div>
                      <div className="text-sm">
                        All books are returned on time!
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                data.overdueBooks.map((book) => (
                  <tr key={book.recordId} className="border-b">
                    <td className="px-4 py-2">
                      <div>
                        <div className="font-medium">{book.bookTitle}</div>
                        <div className="text-sm text-gray-600">
                          {book.bookAuthor}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <div>
                        <div className="font-medium">{book.userName}</div>
                        <div className="text-sm text-gray-600">
                          {book.userEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <span className="rounded-full bg-red-100 px-2 py-1 text-sm text-red-800">
                        {book.daysOverdue} days
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      {book.fineAmount ? (
                        <span className="font-medium text-red-600">
                          ${book.fineAmount}
                        </span>
                      ) : (
                        <span className="text-gray-500">No fine</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">Monthly Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Current Month:</span>
              <span className="font-medium">
                {data.monthlyStats?.currentMonth?.borrows || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Month:</span>
              <span className="font-medium">
                {data.monthlyStats?.lastMonth?.borrows || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">Overdue Analysis</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Overdue:</span>
              <span className="font-medium">
                {data.overdueStats?.totalOverdue || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Avg Days Overdue:</span>
              <span className="font-medium">
                {typeof data.overdueStats?.avgDaysOverdue === "number"
                  ? data.overdueStats.avgDaysOverdue.toFixed(1)
                  : 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Fines:</span>
              <span className="font-medium text-red-600">
                ${data.overdueStats?.totalFines || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Overdue Rate:</span>
              <span className="font-medium">
                {data.systemHealth?.activeBorrows > 0
                  ? (
                      ((data.systemHealth?.overdueBooks || 0) /
                        data.systemHealth?.activeBorrows) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;
