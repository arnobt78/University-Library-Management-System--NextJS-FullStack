"use client";

import { useQuery } from "@tanstack/react-query";
import { useQueryPerformance } from "@/hooks/usePerformance";

// Books queries
export const useBooks = () => {
  const { trackQuery } = useQueryPerformance();

  return useQuery({
    queryKey: ["books"],
    queryFn: () =>
      trackQuery("books", async () => {
        const response = await fetch("/api/books");
        if (!response.ok) throw new Error("Failed to fetch books");
        return response.json();
      }),
  });
};

export const useBook = (id: string) => {
  const { trackQuery } = useQueryPerformance();

  return useQuery({
    queryKey: ["book", id],
    queryFn: () =>
      trackQuery(`book-${id}`, async () => {
        const response = await fetch(`/api/books/${id}`);
        if (!response.ok) throw new Error("Failed to fetch book");
        return response.json();
      }),
    enabled: !!id,
  });
};

// User queries
export const useUserProfile = (userId: string) => {
  const { trackQuery } = useQueryPerformance();

  return useQuery({
    queryKey: ["user", userId],
    queryFn: () =>
      trackQuery(`user-${userId}`, async () => {
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch user");
        return response.json();
      }),
    enabled: !!userId,
  });
};

// Borrow records queries
export const useBorrowRecords = (userId: string) => {
  const { trackQuery } = useQueryPerformance();

  return useQuery({
    queryKey: ["borrow-records", userId],
    queryFn: () =>
      trackQuery(`borrow-records-${userId}`, async () => {
        const response = await fetch(`/api/borrow-records?userId=${userId}`);
        if (!response.ok) throw new Error("Failed to fetch borrow records");
        return response.json();
      }),
    enabled: !!userId,
  });
};

// Admin queries
export const useAdminStats = () => {
  const { trackQuery } = useQueryPerformance();

  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: () =>
      trackQuery("admin-stats", async () => {
        const response = await fetch("/api/admin/stats");
        if (!response.ok) throw new Error("Failed to fetch admin stats");
        return response.json();
      }),
  });
};

export const useBorrowRequests = () => {
  const { trackQuery } = useQueryPerformance();

  return useQuery({
    queryKey: ["borrow-requests"],
    queryFn: () =>
      trackQuery("borrow-requests", async () => {
        const response = await fetch("/api/admin/borrow-requests");
        if (!response.ok) throw new Error("Failed to fetch borrow requests");
        return response.json();
      }),
  });
};
