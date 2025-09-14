import React from "react";
import {
  getBorrowingTrends,
  getPopularBooks,
  getPopularGenres,
  getUserActivityPatterns,
  getOverdueAnalysis,
  getOverdueStats,
  getMonthlyStats,
  getSystemHealth,
} from "@/lib/admin/actions/analytics";
import AnalyticsCharts from "@/components/AnalyticsCharts";

// Define proper types
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

const AnalyticsPage = async () => {
  // Fetch all analytics data on the server
  const [
    borrowingTrends,
    popularBooks,
    popularGenres,
    userActivity,
    overdueBooks,
    overdueStats,
    monthlyStats,
    systemHealth,
  ] = await Promise.all([
    getBorrowingTrends(),
    getPopularBooks(10),
    getPopularGenres(),
    getUserActivityPatterns(),
    getOverdueAnalysis(),
    getOverdueStats(),
    getMonthlyStats(),
    getSystemHealth(),
  ]);

  const data: AnalyticsData = {
    borrowingTrends,
    popularBooks,
    popularGenres,
    userActivity,
    overdueBooks,
    overdueStats,
    monthlyStats,
    systemHealth,
  };

  return <AnalyticsCharts data={data} />;
};

export default AnalyticsPage;
