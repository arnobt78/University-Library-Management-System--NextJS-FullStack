import { db } from "@/database/drizzle";
import { books, users, borrowRecords } from "@/database/schema";
import { eq, sql, desc, and, notInArray, inArray } from "drizzle-orm";

// Get user's borrowing history
export async function getUserBorrowingHistory(userId: string) {
  const userHistory = await db
    .select({
      bookId: borrowRecords.bookId,
      bookTitle: books.title,
      bookAuthor: books.author,
      bookGenre: books.genre,
      borrowDate: borrowRecords.borrowDate,
      status: borrowRecords.status,
    })
    .from(borrowRecords)
    .innerJoin(books, eq(borrowRecords.bookId, books.id))
    .where(eq(borrowRecords.userId, userId))
    .orderBy(desc(borrowRecords.borrowDate));

  return userHistory;
}

// Get user's favorite genres based on borrowing history
export async function getUserFavoriteGenres(userId: string) {
  const genreStats = await db
    .select({
      genre: books.genre,
      borrowCount: sql<number>`count(*)`,
    })
    .from(borrowRecords)
    .innerJoin(books, eq(borrowRecords.bookId, books.id))
    .where(eq(borrowRecords.userId, userId))
    .groupBy(books.genre)
    .orderBy(desc(sql`count(*)`));

  return genreStats;
}

// Get user's favorite authors
export async function getUserFavoriteAuthors(userId: string) {
  const authorStats = await db
    .select({
      author: books.author,
      borrowCount: sql<number>`count(*)`,
    })
    .from(borrowRecords)
    .innerJoin(books, eq(borrowRecords.bookId, books.id))
    .where(eq(borrowRecords.userId, userId))
    .groupBy(books.author)
    .orderBy(desc(sql`count(*)`));

  return authorStats;
}

// Get books similar to user's borrowing history
export async function getSimilarBooks(userId: string, limit = 10) {
  // Get user's favorite genres
  const favoriteGenres = await getUserFavoriteGenres(userId);
  const topGenres = favoriteGenres.slice(0, 3).map((g) => g.genre);

  if (topGenres.length === 0) {
    // If user has no history, return popular books
    return getPopularBooks(limit);
  }

  // Get books in user's favorite genres that they haven't borrowed
  const userBorrowedBooks = await db
    .select({ bookId: borrowRecords.bookId })
    .from(borrowRecords)
    .where(eq(borrowRecords.userId, userId));

  const borrowedBookIds = userBorrowedBooks.map((b) => b.bookId);

  const similarBooks = await db
    .select({
      id: books.id,
      title: books.title,
      author: books.author,
      genre: books.genre,
      rating: books.rating,
      totalCopies: books.totalCopies,
      availableCopies: books.availableCopies,
      coverColor: books.coverColor,
      coverUrl: books.coverUrl,
      description: books.description,
      isbn: books.isbn,
      publicationYear: books.publicationYear,
      publisher: books.publisher,
      language: books.language,
      pageCount: books.pageCount,
      edition: books.edition,
      isActive: books.isActive,
      createdAt: books.createdAt,
      updatedAt: books.updatedAt,
      popularityScore: sql<number>`count(${borrowRecords.id})`,
    })
    .from(books)
    .leftJoin(borrowRecords, eq(books.id, borrowRecords.bookId))
    .where(
      and(
        inArray(books.genre, topGenres),
        eq(books.isActive, true),
        sql`${books.availableCopies} > 0`,
        borrowedBookIds.length > 0
          ? notInArray(books.id, borrowedBookIds)
          : sql`1=1`
      )
    )
    .groupBy(books.id)
    .orderBy(desc(sql`count(${borrowRecords.id})`))
    .limit(limit);

  return similarBooks;
}

// Get popular books (fallback for new users)
export async function getPopularBooks(limit = 10) {
  const popularBooks = await db
    .select({
      id: books.id,
      title: books.title,
      author: books.author,
      genre: books.genre,
      rating: books.rating,
      totalCopies: books.totalCopies,
      availableCopies: books.availableCopies,
      coverColor: books.coverColor,
      coverUrl: books.coverUrl,
      description: books.description,
      isbn: books.isbn,
      publicationYear: books.publicationYear,
      publisher: books.publisher,
      language: books.language,
      pageCount: books.pageCount,
      edition: books.edition,
      isActive: books.isActive,
      createdAt: books.createdAt,
      updatedAt: books.updatedAt,
      borrowCount: sql<number>`count(${borrowRecords.id})`,
    })
    .from(books)
    .leftJoin(borrowRecords, eq(books.id, borrowRecords.bookId))
    .where(and(eq(books.isActive, true), sql`${books.availableCopies} > 0`))
    .groupBy(books.id)
    .orderBy(desc(sql`count(${borrowRecords.id})`))
    .limit(limit);

  return popularBooks;
}

// Get trending books (most borrowed in last 30 days)
export async function getTrendingBooks(limit = 10) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const trendingBooks = await db
    .select({
      id: books.id,
      title: books.title,
      author: books.author,
      genre: books.genre,
      rating: books.rating,
      totalCopies: books.totalCopies,
      availableCopies: books.availableCopies,
      coverColor: books.coverColor,
      coverUrl: books.coverUrl,
      description: books.description,
      isbn: books.isbn,
      publicationYear: books.publicationYear,
      publisher: books.publisher,
      language: books.language,
      pageCount: books.pageCount,
      edition: books.edition,
      isActive: books.isActive,
      createdAt: books.createdAt,
      updatedAt: books.updatedAt,
      recentBorrows: sql<number>`count(${borrowRecords.id})`,
    })
    .from(books)
    .leftJoin(borrowRecords, eq(books.id, borrowRecords.bookId))
    .where(
      and(
        eq(books.isActive, true),
        sql`${books.availableCopies} > 0`,
        sql`${borrowRecords.createdAt} >= ${thirtyDaysAgo}`
      )
    )
    .groupBy(books.id)
    .orderBy(desc(sql`count(${borrowRecords.id})`))
    .limit(limit);

  return trendingBooks;
}

// Get personalized recommendations for a user
export async function getPersonalizedRecommendations(
  userId: string,
  limit = 6
) {
  const userHistory = await getUserBorrowingHistory(userId);

  if (userHistory.length === 0) {
    // New user - return popular books
    return getPopularBooks(limit);
  }

  // Get similar books based on user's history
  const similarBooks = await getSimilarBooks(userId, Math.ceil(limit / 2));

  // Get trending books
  const trendingBooks = await getTrendingBooks(Math.ceil(limit / 2));

  // Combine and deduplicate
  const allBooks = [...similarBooks, ...trendingBooks];
  const uniqueBooks = allBooks.filter(
    (book, index, self) => index === self.findIndex((b) => b.id === book.id)
  );

  return uniqueBooks.slice(0, limit);
}

// Get recommendation reasons
export async function getRecommendationReasons(userId: string, bookId: string) {
  const userHistory = await getUserBorrowingHistory(userId);
  const userGenres = await getUserFavoriteGenres(userId);
  const userAuthors = await getUserFavoriteAuthors(userId);

  const reasons = [];

  // Check if book matches user's favorite genre
  const bookGenre = userHistory.find((h) => h.bookId === bookId)?.bookGenre;
  if (bookGenre && userGenres.some((g) => g.genre === bookGenre)) {
    reasons.push(`You enjoy ${bookGenre} books`);
  }

  // Check if book matches user's favorite author
  const bookAuthor = userHistory.find((h) => h.bookId === bookId)?.bookAuthor;
  if (bookAuthor && userAuthors.some((a) => a.author === bookAuthor)) {
    reasons.push(`You like books by ${bookAuthor}`);
  }

  // Check if it's a trending book
  const trendingBooks = await getTrendingBooks(20);
  if (trendingBooks.some((b) => b.id === bookId)) {
    reasons.push("This book is trending in the library");
  }

  // Check if it's popular
  const popularBooks = await getPopularBooks(20);
  if (popularBooks.some((b) => b.id === bookId)) {
    reasons.push("This is a popular book among library users");
  }

  return reasons.length > 0 ? reasons : ["Recommended based on library trends"];
}
