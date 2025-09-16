"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BookCard from "@/components/BookCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BookCollectionProps {
  books: Book[];
  genres: string[];
  searchParams: {
    search: string;
    genre: string;
    availability: string;
    rating: string;
    sort: string;
    page: number;
  };
  pagination: {
    currentPage: number;
    totalPages: number;
    totalBooks: number;
    booksPerPage: number;
  };
}

const BookCollection: React.FC<BookCollectionProps> = ({
  books,
  genres,
  searchParams,
  pagination,
}) => {
  const router = useRouter();
  const searchParamsHook = useSearchParams();
  const [localSearch, setLocalSearch] = useState(searchParams.search);

  const updateSearchParams = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParamsHook.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Reset to page 1 when filters change
    if (Object.keys(newParams).some((key) => key !== "page")) {
      params.delete("page");
    }

    router.push(`/all-books?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearchParams({ search: localSearch });
  };

  const handleFilterChange = (key: string, value: string) => {
    updateSearchParams({ [key]: value });
  };

  const handleSortChange = (sort: string) => {
    updateSearchParams({ sort });
  };

  const handlePageChange = (page: number) => {
    updateSearchParams({ page: page.toString() });
  };

  const clearFilters = () => {
    router.push("/all-books");
  };

  const hasActiveFilters =
    searchParams.search ||
    searchParams.genre ||
    searchParams.availability ||
    searchParams.rating;

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-bold text-light-100">
          Book Collection
        </h1>
        <p className="text-light-200">
          Discover and explore our complete library of {pagination.totalBooks}{" "}
          books
        </p>
      </div>

      <div className="flex gap-6">
        {/* Filters Sidebar */}
        <div className="w-64 shrink-0 ">
          <Card className="rounded-lg border border-gray-600 bg-gray-800/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-light-100">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="space-y-2">
                <Input
                  placeholder="Search books..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="w-full text-light-100"
                />
                <Button type="submit" className="w-full">
                  Search
                </Button>
              </form>

              {/* Genre Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-100">
                  Genre
                </label>
                <select
                  value={searchParams.genre}
                  onChange={(e) => handleFilterChange("genre", e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="">All Genres</option>
                  {genres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Availability Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-100">
                  Availability
                </label>
                <select
                  value={searchParams.availability}
                  onChange={(e) =>
                    handleFilterChange("availability", e.target.value)
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="">All Books</option>
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>

              {/* Rating Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-100">
                  Minimum Rating
                </label>
                <select
                  value={searchParams.rating}
                  onChange={(e) => handleFilterChange("rating", e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                  <option value="1">1+ Stars</option>
                </select>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full"
                >
                  Clear All Filters
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Sort and Results Header */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-100">
                Showing {books.length} of {pagination.totalBooks} books
              </span>
              {hasActiveFilters && (
                <div className="flex gap-2">
                  {searchParams.search && (
                    <Badge variant="secondary">
                      Search: &quot;{searchParams.search}&quot;
                    </Badge>
                  )}
                  {searchParams.genre && (
                    <Badge variant="secondary">
                      Genre: {searchParams.genre}
                    </Badge>
                  )}
                  {searchParams.availability && (
                    <Badge variant="secondary">
                      {searchParams.availability === "available"
                        ? "Available"
                        : "Unavailable"}
                    </Badge>
                  )}
                  {searchParams.rating && (
                    <Badge variant="secondary">
                      {searchParams.rating}+ Stars
                    </Badge>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-100">Sort by:</span>
              <select
                value={searchParams.sort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-1 text-sm"
              >
                <option value="title">Title A-Z</option>
                <option value="author">Author A-Z</option>
                <option value="rating">Rating (High to Low)</option>
                <option value="date">Newest First</option>
              </select>
            </div>
          </div>

          {/* Books Grid */}
          {books.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">
                  No books found matching your criteria.
                </p>
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="mt-4"
                  >
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {books.map((book) => (
                <BookCard key={book.id} {...book} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
              >
                Previous
              </Button>

              <div className="flex gap-1">
                {Array.from(
                  { length: Math.min(5, pagination.totalPages) },
                  (_, i) => {
                    const pageNum = Math.max(1, pagination.currentPage - 2) + i;
                    if (pageNum > pagination.totalPages) return null;

                    return (
                      <Button
                        key={pageNum}
                        variant={
                          pageNum === pagination.currentPage
                            ? "default"
                            : "outline"
                        }
                        onClick={() => handlePageChange(pageNum)}
                        className="w-10"
                      >
                        {pageNum}
                      </Button>
                    );
                  }
                )}
              </div>

              <Button
                variant="outline"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCollection;
