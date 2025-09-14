import { db } from "@/database/drizzle";
import { books, users, borrowRecords } from "@/database/schema";
import { eq, sql, desc, and, gte, lt } from "drizzle-orm";

// Export types
export type ExportFormat = "csv" | "json" | "pdf";
export type ExportType = "books" | "users" | "borrows" | "analytics";

// CSV export utilities
export class CSVExporter {
  static escapeCSVField(field: unknown): string {
    if (field === null || field === undefined) {
      return "";
    }

    const str = String(field);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  static arrayToCSV(
    data: Record<string, unknown>[],
    headers: string[]
  ): string {
    const csvRows = [headers.join(",")];

    for (const row of data) {
      const values = headers.map((header) => {
        const value =
          row[header.toLowerCase().replace(/\s+/g, "_")] || row[header] || "";
        return this.escapeCSVField(value);
      });
      csvRows.push(values.join(","));
    }

    return csvRows.join("\n");
  }
}

// Export books data
export async function exportBooks(format: ExportFormat = "csv") {
  const booksData = await db
    .select({
      id: books.id,
      title: books.title,
      author: books.author,
      genre: books.genre,
      rating: books.rating,
      totalCopies: books.totalCopies,
      availableCopies: books.availableCopies,
      isbn: books.isbn,
      publicationYear: books.publicationYear,
      publisher: books.publisher,
      language: books.language,
      pageCount: books.pageCount,
      edition: books.edition,
      isActive: books.isActive,
      createdAt: books.createdAt,
      updatedAt: books.updatedAt,
    })
    .from(books)
    .orderBy(desc(books.createdAt));

  if (format === "csv") {
    const headers = [
      "ID",
      "Title",
      "Author",
      "Genre",
      "Rating",
      "Total Copies",
      "Available Copies",
      "ISBN",
      "Publication Year",
      "Publisher",
      "Language",
      "Page Count",
      "Edition",
      "Is Active",
      "Created At",
      "Updated At",
    ];

    return {
      data: CSVExporter.arrayToCSV(booksData, headers),
      filename: `books_export_${new Date().toISOString().split("T")[0]}.csv`,
      contentType: "text/csv",
    };
  }

  if (format === "json") {
    return {
      data: JSON.stringify(booksData, null, 2),
      filename: `books_export_${new Date().toISOString().split("T")[0]}.json`,
      contentType: "application/json",
    };
  }

  return { data: "", filename: "", contentType: "" };
}

// Export users data
export async function exportUsers(format: ExportFormat = "csv") {
  const usersData = await db
    .select({
      id: users.id,
      fullName: users.fullName,
      email: users.email,
      universityId: users.universityId,
      role: users.role,
      status: users.status,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt));

  if (format === "csv") {
    const headers = [
      "ID",
      "Full Name",
      "Email",
      "University ID",
      "Role",
      "Status",
      "Created At",
    ];

    return {
      data: CSVExporter.arrayToCSV(usersData, headers),
      filename: `users_export_${new Date().toISOString().split("T")[0]}.csv`,
      contentType: "text/csv",
    };
  }

  if (format === "json") {
    return {
      data: JSON.stringify(usersData, null, 2),
      filename: `users_export_${new Date().toISOString().split("T")[0]}.json`,
      contentType: "application/json",
    };
  }

  return { data: "", filename: "", contentType: "" };
}

// Export borrows data
export async function exportBorrows(
  format: ExportFormat = "csv",
  dateRange?: { start: Date; end: Date }
) {
  const baseQuery = db
    .select({
      id: borrowRecords.id,
      bookTitle: books.title,
      bookAuthor: books.author,
      userName: users.fullName,
      userEmail: users.email,
      borrowDate: borrowRecords.borrowDate,
      dueDate: borrowRecords.dueDate,
      returnDate: borrowRecords.returnDate,
      status: borrowRecords.status,
      fineAmount: borrowRecords.fineAmount,
      notes: borrowRecords.notes,
      renewalCount: borrowRecords.renewalCount,
      createdAt: borrowRecords.createdAt,
      updatedAt: borrowRecords.updatedAt,
    })
    .from(borrowRecords)
    .innerJoin(books, eq(borrowRecords.bookId, books.id))
    .innerJoin(users, eq(borrowRecords.userId, users.id));

  const borrowsData = dateRange
    ? await baseQuery
        .where(
          and(
            gte(borrowRecords.createdAt, dateRange.start),
            lt(borrowRecords.createdAt, dateRange.end)
          )
        )
        .orderBy(desc(borrowRecords.createdAt))
    : await baseQuery.orderBy(desc(borrowRecords.createdAt));

  if (format === "csv") {
    const headers = [
      "ID",
      "Book Title",
      "Book Author",
      "User Name",
      "User Email",
      "Borrow Date",
      "Due Date",
      "Return Date",
      "Status",
      "Fine Amount",
      "Notes",
      "Renewal Count",
      "Created At",
      "Updated At",
    ];

    return {
      data: CSVExporter.arrayToCSV(borrowsData, headers),
      filename: `borrows_export_${new Date().toISOString().split("T")[0]}.csv`,
      contentType: "text/csv",
    };
  }

  if (format === "json") {
    return {
      data: JSON.stringify(borrowsData, null, 2),
      filename: `borrows_export_${new Date().toISOString().split("T")[0]}.json`,
      contentType: "application/json",
    };
  }

  return { data: "", filename: "", contentType: "" };
}

// Export analytics data
export async function exportAnalytics(format: ExportFormat = "csv") {
  const now = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    borrowingTrends,
    popularBooks,
    userActivity,
    overdueStats,
    systemHealth,
  ] = await Promise.all([
    // Borrowing trends
    db
      .select({
        date: sql<string>`DATE(${borrowRecords.createdAt})`,
        borrows: sql<number>`count(*)`,
        returns: sql<number>`count(case when ${borrowRecords.status} = 'RETURNED' then 1 end)`,
      })
      .from(borrowRecords)
      .where(gte(borrowRecords.createdAt, thirtyDaysAgo))
      .groupBy(sql`DATE(${borrowRecords.createdAt})`)
      .orderBy(sql`DATE(${borrowRecords.createdAt})`),

    // Popular books
    db
      .select({
        bookTitle: books.title,
        bookAuthor: books.author,
        bookGenre: books.genre,
        totalBorrows: sql<number>`count(*)`,
        activeBorrows: sql<number>`count(case when ${borrowRecords.status} = 'BORROWED' then 1 end)`,
      })
      .from(borrowRecords)
      .innerJoin(books, eq(borrowRecords.bookId, books.id))
      .groupBy(borrowRecords.bookId, books.title, books.author, books.genre)
      .orderBy(desc(sql`count(*)`))
      .limit(20),

    // User activity
    db
      .select({
        userName: users.fullName,
        userEmail: users.email,
        totalBorrows: sql<number>`count(*)`,
        activeBorrows: sql<number>`count(case when ${borrowRecords.status} = 'BORROWED' then 1 end)`,
      })
      .from(borrowRecords)
      .innerJoin(users, eq(borrowRecords.userId, users.id))
      .groupBy(borrowRecords.userId, users.fullName, users.email)
      .orderBy(desc(sql`count(*)`))
      .limit(20),

    // Overdue stats
    db
      .select({
        totalOverdue: sql<number>`count(case when ${borrowRecords.dueDate} < ${now} and ${borrowRecords.status} = 'BORROWED' then 1 end)`,
        totalFines: sql<number>`COALESCE(sum(case when ${borrowRecords.dueDate} < ${now} and ${borrowRecords.status} = 'BORROWED' then ${borrowRecords.fineAmount} end), 0)`,
      })
      .from(borrowRecords),

    // System health
    db
      .select({
        totalBooks: sql<number>`count(distinct ${books.id})`,
        totalUsers: sql<number>`count(distinct ${users.id})`,
        activeBorrows: sql<number>`count(case when ${borrowRecords.status} = 'BORROWED' then 1 end)`,
      })
      .from(books)
      .leftJoin(users, sql`1=1`)
      .leftJoin(borrowRecords, sql`1=1`),
  ]);

  const analyticsData = {
    summary: {
      exportDate: new Date().toISOString(),
      totalBooks: systemHealth[0]?.totalBooks || 0,
      totalUsers: systemHealth[0]?.totalUsers || 0,
      activeBorrows: systemHealth[0]?.activeBorrows || 0,
      totalOverdue: overdueStats[0]?.totalOverdue || 0,
      totalFines: overdueStats[0]?.totalFines || 0,
    },
    borrowingTrends,
    popularBooks,
    userActivity,
  };

  if (format === "csv") {
    // Create multiple CSV sections
    const sections = [
      { name: "Summary", data: [analyticsData.summary] },
      { name: "Borrowing_Trends", data: borrowingTrends },
      { name: "Popular_Books", data: popularBooks },
      { name: "User_Activity", data: userActivity },
    ];

    let csvContent = "";
    for (const section of sections) {
      csvContent += `\n=== ${section.name} ===\n`;
      if (section.data.length > 0) {
        const headers = Object.keys(section.data[0]);
        csvContent += CSVExporter.arrayToCSV(section.data, headers);
      }
      csvContent += "\n";
    }

    return {
      data: csvContent,
      filename: `analytics_export_${new Date().toISOString().split("T")[0]}.csv`,
      contentType: "text/csv",
    };
  }

  if (format === "json") {
    return {
      data: JSON.stringify(analyticsData, null, 2),
      filename: `analytics_export_${new Date().toISOString().split("T")[0]}.json`,
      contentType: "application/json",
    };
  }

  return { data: "", filename: "", contentType: "" };
}

// Generate export filename
export function generateExportFilename(
  type: ExportType,
  format: ExportFormat
): string {
  const date = new Date().toISOString().split("T")[0];
  return `${type}_export_${date}.${format}`;
}

// Get export statistics
export async function getExportStats() {
  const [booksCount, usersCount, borrowsCount] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(books),
    db.select({ count: sql<number>`count(*)` }).from(users),
    db.select({ count: sql<number>`count(*)` }).from(borrowRecords),
  ]);

  return {
    totalBooks: booksCount[0]?.count || 0,
    totalUsers: usersCount[0]?.count || 0,
    totalBorrows: borrowsCount[0]?.count || 0,
    lastExportDate: new Date().toISOString(),
  };
}
