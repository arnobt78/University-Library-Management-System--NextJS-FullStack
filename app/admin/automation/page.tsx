import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getReminderStats,
  sendDueSoonReminders,
  sendOverdueReminders,
} from "@/lib/admin/actions/reminders";
import { getExportStats } from "@/lib/admin/actions/data-export";
import {
  generateAllUserRecommendations,
  updateTrendingBooks,
  refreshRecommendationCache,
} from "@/lib/admin/actions/recommendations";
import { redirect } from "next/navigation";
import FineManagement from "@/components/FineManagement";

// Server Actions for reminder sending
async function handleSendDueSoonReminders() {
  "use server";
  const results = await sendDueSoonReminders();
  const successCount = results.filter((r) => r.status === "sent").length;
  const failedCount = results.filter((r) => r.status === "failed").length;

  if (successCount > 0) {
    redirect(
      "/admin/automation?success=due-soon-sent&count=" +
        successCount +
        (failedCount > 0 ? "&failed=" + failedCount : "")
    );
  } else {
    redirect("/admin/automation?error=due-soon-failed");
  }
}

async function handleSendOverdueReminders() {
  "use server";
  const results = await sendOverdueReminders();
  const successCount = results.filter((r) => r.status === "sent").length;
  const failedCount = results.filter((r) => r.status === "failed").length;

  if (successCount > 0) {
    redirect(
      "/admin/automation?success=overdue-sent&count=" +
        successCount +
        (failedCount > 0 ? "&failed=" + failedCount : "")
    );
  } else {
    redirect("/admin/automation?error=overdue-failed");
  }
}

// Server Actions for recommendation functions
async function handleGenerateAllUserRecommendations() {
  "use server";
  const results = await generateAllUserRecommendations();
  const totalUsers = results.length;
  const totalRecommendations = results.reduce(
    (sum, user) => sum + user.recommendations.length,
    0
  );

  redirect(
    `/admin/automation?success=recommendations-generated&users=${totalUsers}&recommendations=${totalRecommendations}`
  );
}

async function handleUpdateTrendingBooks() {
  "use server";
  const result = await updateTrendingBooks();
  redirect(
    `/admin/automation?success=trending-updated&count=${result.trendingCount}`
  );
}

async function handleRefreshRecommendationCache() {
  "use server";
  await refreshRecommendationCache();
  redirect("/admin/automation?success=cache-refreshed");
}

// Server Actions for Bulk Operations (Coming Soon)
async function handleBulkEditBooks() {
  "use server";
  redirect("/admin/automation?coming-soon=bulk-edit-books");
}

async function handleBulkActivateBooks() {
  "use server";
  redirect("/admin/automation?coming-soon=bulk-activate-books");
}

async function handleBulkDeactivateBooks() {
  "use server";
  redirect("/admin/automation?coming-soon=bulk-deactivate-books");
}

async function handleBulkDeleteBooks() {
  "use server";
  redirect("/admin/automation?coming-soon=bulk-delete-books");
}

async function handleBulkApproveUsers() {
  "use server";
  redirect("/admin/automation?coming-soon=bulk-approve-users");
}

async function handleBulkRejectUsers() {
  "use server";
  redirect("/admin/automation?coming-soon=bulk-reject-users");
}

async function handleBulkMakeAdmin() {
  "use server";
  redirect("/admin/automation?coming-soon=bulk-make-admin");
}

async function handleBulkRemoveAdmin() {
  "use server";
  redirect("/admin/automation?coming-soon=bulk-remove-admin");
}

async function handleBulkApproveRequests() {
  "use server";
  redirect("/admin/automation?coming-soon=bulk-approve-requests");
}

async function handleBulkRejectRequests() {
  "use server";
  redirect("/admin/automation?coming-soon=bulk-reject-requests");
}

async function handleBulkSendReminders() {
  "use server";
  redirect("/admin/automation?coming-soon=bulk-send-reminders");
}

async function handleBulkUpdateStatus() {
  "use server";
  redirect("/admin/automation?coming-soon=bulk-update-status");
}

const AutomationDashboard = async ({
  searchParams,
}: {
  searchParams: Promise<{
    success?: string;
    error?: string;
    count?: string;
    failed?: string;
    users?: string;
    recommendations?: string;
    "coming-soon"?: string;
  }>;
}) => {
  const params = await searchParams;

  // Fetch automation data
  const [reminderStats, exportStats] = await Promise.all([
    getReminderStats(),
    getExportStats(),
  ]);

  return (
    <div className="space-y-6">
      {/* Success/Error Messages */}
      {params.success === "due-soon-sent" && (
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
                ✅ Due Soon Reminders Sent Successfully!
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>
                  Successfully sent {params.count} due soon reminder(s) via
                  email.
                  {params.failed &&
                    ` ${params.failed} reminder(s) failed to send.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {params.success === "overdue-sent" && (
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
                ✅ Overdue Reminders Sent Successfully!
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>
                  Successfully sent {params.count} overdue reminder(s) via
                  email.
                  {params.failed &&
                    ` ${params.failed} reminder(s) failed to send.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {params.error === "due-soon-failed" && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center">
            <div className="shrink-0">
              <svg
                className="size-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule={"evenodd" as const}
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule={"evenodd" as const}
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                ❌ Failed to Send Due Soon Reminders
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  There was an error sending due soon reminders. Please try
                  again.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {params.error === "overdue-failed" && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center">
            <div className="shrink-0">
              <svg
                className="size-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule={"evenodd" as const}
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule={"evenodd" as const}
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                ❌ Failed to Send Overdue Reminders
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  There was an error sending overdue reminders. Please try
                  again.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommendation Success Messages */}
      {params.success === "recommendations-generated" && (
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
                ✅ Recommendations Generated Successfully!
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>
                  Generated {params.recommendations} personalized
                  recommendations for {params.users} users using AI-powered
                  algorithms.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {params.success === "trending-updated" && (
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
                ✅ Trending Books Updated Successfully!
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>
                  Updated trending books data. Found {params.count} trending
                  books based on recent borrowing activity.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {params.success === "cache-refreshed" && (
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
                ✅ Recommendation Cache Refreshed!
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>
                  Recommendation cache has been cleared and refreshed. All
                  cached recommendations will be regenerated on next request.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommendation Error Messages */}
      {params.error === "recommendations-failed" && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center">
            <div className="shrink-0">
              <svg
                className="size-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule={"evenodd" as const}
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule={"evenodd" as const}
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                ❌ Failed to Generate Recommendations
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  There was an error generating recommendations. Please try
                  again.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {params.error === "trending-failed" && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center">
            <div className="shrink-0">
              <svg
                className="size-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule={"evenodd" as const}
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule={"evenodd" as const}
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                ❌ Failed to Update Trending Books
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  There was an error updating trending books. Please try again.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {params.error === "cache-failed" && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center">
            <div className="shrink-0">
              <svg
                className="size-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule={"evenodd" as const}
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule={"evenodd" as const}
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                ❌ Failed to Refresh Cache
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  There was an error refreshing the recommendation cache. Please
                  try again.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Coming Soon Messages for Bulk Operations */}
      {params["coming-soon"] === "bulk-edit-books" && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-center">
            <div className="shrink-0">
              <svg
                className="size-5 text-blue-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule={"evenodd" as const}
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule={"evenodd" as const}
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                🚀 Bulk Edit Books - Coming Soon!
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  This feature will allow you to edit multiple books
                  simultaneously, updating common attributes like genre,
                  publisher, and descriptions across your entire collection.
                  Stay tuned!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {params["coming-soon"] === "bulk-activate-books" && (
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
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule={"evenodd" as const}
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                ✅ Bulk Activate Books - Coming Soon!
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>
                  This feature will enable you to activate multiple books at
                  once, making them available for borrowing across your library.
                  Perfect for adding new collections!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {params["coming-soon"] === "bulk-deactivate-books" && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <div className="flex items-center">
            <div className="shrink-0">
              <svg
                className="size-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule={"evenodd" as const}
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule={"evenodd" as const}
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                ❌ Bulk Deactivate Books - Coming Soon!
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  This feature will allow you to temporarily deactivate multiple
                  books, removing them from circulation while preserving all
                  data. Ideal for maintenance or updates!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {params["coming-soon"] === "bulk-delete-books" && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center">
            <div className="shrink-0">
              <svg
                className="size-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule={"evenodd" as const}
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule={"evenodd" as const}
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                🗑️ Bulk Delete Books - Coming Soon!
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  This feature will enable safe bulk deletion of books with
                  automatic checks for active borrows. Includes confirmation
                  dialogs and comprehensive safety measures!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {params["coming-soon"] === "bulk-approve-users" && (
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
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule={"evenodd" as const}
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                ✅ Bulk Approve Users - Coming Soon!
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>
                  This feature will streamline user approval by allowing you to
                  approve multiple pending users at once. Perfect for processing
                  new student registrations efficiently!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {params["coming-soon"] === "bulk-reject-users" && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center">
            <div className="shrink-0">
              <svg
                className="size-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule={"evenodd" as const}
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule={"evenodd" as const}
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                ❌ Bulk Reject Users - Coming Soon!
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  This feature will allow you to reject multiple user
                  applications simultaneously with proper notification handling.
                  Includes automated rejection emails!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {params["coming-soon"] === "bulk-make-admin" && (
        <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
          <div className="flex items-center">
            <div className="shrink-0">
              <svg
                className="size-5 text-purple-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule={"evenodd" as const}
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule={"evenodd" as const}
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-purple-800">
                👑 Bulk Make Admin - Coming Soon!
              </h3>
              <div className="mt-2 text-sm text-purple-700">
                <p>
                  This feature will enable you to grant admin privileges to
                  multiple users at once. Perfect for promoting trusted staff
                  members to administrative roles!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {params["coming-soon"] === "bulk-remove-admin" && (
        <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
          <div className="flex items-center">
            <div className="shrink-0">
              <svg
                className="size-5 text-orange-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule={"evenodd" as const}
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule={"evenodd" as const}
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-orange-800">
                👤 Bulk Remove Admin - Coming Soon!
              </h3>
              <div className="mt-2 text-sm text-orange-700">
                <p>
                  This feature will allow you to revoke admin privileges from
                  multiple users simultaneously. Includes safety checks to
                  prevent accidental removal of all admins!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {params["coming-soon"] === "bulk-approve-requests" && (
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
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule={"evenodd" as const}
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                ✅ Bulk Approve Requests - Coming Soon!
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>
                  This feature will streamline borrow request approval by
                  allowing you to approve multiple requests at once.
                  Automatically sets due dates and sends confirmation emails!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {params["coming-soon"] === "bulk-reject-requests" && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center">
            <div className="shrink-0">
              <svg
                className="size-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule={"evenodd" as const}
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule={"evenodd" as const}
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                ❌ Bulk Reject Requests - Coming Soon!
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  This feature will allow you to reject multiple borrow requests
                  simultaneously with proper notification handling. Includes
                  automated rejection emails!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {params["coming-soon"] === "bulk-send-reminders" && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-center">
            <div className="shrink-0">
              <svg
                className="size-5 text-blue-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule={"evenodd" as const}
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule={"evenodd" as const}
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                📧 Bulk Send Reminders - Coming Soon!
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  This feature will enable you to send personalized reminders to
                  multiple users at once. Supports both due soon and overdue
                  notifications with smart scheduling!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {params["coming-soon"] === "bulk-update-status" && (
        <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4">
          <div className="flex items-center">
            <div className="shrink-0">
              <svg
                className="size-5 text-indigo-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule={"evenodd" as const}
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule={"evenodd" as const}
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-indigo-800">
                📊 Bulk Update Status - Coming Soon!
              </h3>
              <div className="mt-2 text-sm text-indigo-700">
                <p>
                  This feature will allow you to update the status of multiple
                  borrow records at once. Perfect for marking books as returned
                  or updating due dates in bulk!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Smart Automation Dashboard
        </h1>
        <p className="text-gray-600">
          Automated reminders, recommendations, bulk operations, and data export
        </p>
      </div>

      {/* Automation Overview Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">
              Due Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {reminderStats?.dueSoon || 0}
            </div>
            <p className="text-xs text-blue-600">Books due in 2 days</p>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600">
              Overdue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">
              {reminderStats?.overdue || 0}
            </div>
            <p className="text-xs text-red-600">Books past due date</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">
              Reminders Sent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {reminderStats?.remindersSentToday || 0}
            </div>
            <p className="text-xs text-green-600">Today&apos;s reminders</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-600">
              Total Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {(exportStats?.totalBooks || 0) +
                (exportStats?.totalUsers || 0) +
                (exportStats?.totalBorrows || 0)}
            </div>
            <p className="text-xs text-purple-600">Books + Users + Borrows</p>
          </CardContent>
        </Card>
      </div>

      {/* Auto-Reminders Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            📧 Auto-Reminders
          </CardTitle>
          <p className="text-sm text-gray-600">
            Automated email reminders for due dates and overdue books
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Due Soon Reminders */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">
                  Due Soon Reminders
                </h4>
                <Badge
                  variant="outline"
                  className="border-blue-200 text-blue-600"
                >
                  {reminderStats?.dueSoon || 0} books
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                Send reminders to users whose books are due within 2 days
              </p>
              <form action={handleSendDueSoonReminders}>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 text-white hover:bg-blue-700"
                  disabled={(reminderStats?.dueSoon || 0) === 0}
                >
                  Send Due Soon Reminders
                </Button>
              </form>
            </div>

            {/* Overdue Reminders */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">Overdue Reminders</h4>
                <Badge
                  variant="outline"
                  className="border-red-200 text-red-600"
                >
                  {reminderStats?.overdue || 0} books
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                Send urgent reminders for books that are past their due date
              </p>
              <form action={handleSendOverdueReminders}>
                <Button
                  type="submit"
                  variant="destructive"
                  className="w-full"
                  disabled={(reminderStats?.overdue || 0) === 0}
                >
                  Send Overdue Reminders
                </Button>
              </form>
            </div>
          </div>

          {/* Reminder Settings */}
          <div className="mt-6 rounded-lg bg-gray-50 p-4">
            <h5 className="mb-2 font-medium text-gray-900">
              Reminder Settings
            </h5>
            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
              <div>
                <span className="font-medium text-gray-700">Due Soon:</span>
                <span className="ml-2 text-gray-600">
                  2 days before due date
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Overdue:</span>
                <span className="ml-2 text-gray-600">Daily after due date</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Frequency:</span>
                <span className="ml-2 text-gray-600">Once per day maximum</span>
              </div>
            </div>

            {/* Fine Update Section */}
            <div className="mt-4 border-t border-gray-200 pt-4">
              <FineManagement />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Smart Recommendations Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            🎯 Smart Recommendations
          </CardTitle>
          <p className="text-sm text-gray-600">
            AI-powered book recommendations based on user behavior
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Recommendation Engine */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">
                Recommendation Engine
              </h4>
              <div className="space-y-3">
                <div
                  className={`flex items-center justify-between rounded-lg p-3 ${
                    params.success === "recommendations-generated"
                      ? "border-2 border-green-300 bg-green-100"
                      : "bg-green-50"
                  }`}
                >
                  <div>
                    <p
                      className={`font-medium ${
                        params.success === "recommendations-generated"
                          ? "text-green-900"
                          : "text-green-900"
                      }`}
                    >
                      Genre-based
                    </p>
                    <p
                      className={`text-sm ${
                        params.success === "recommendations-generated"
                          ? "text-green-700"
                          : "text-green-600"
                      }`}
                    >
                      Based on user&apos;s favorite genres
                    </p>
                  </div>
                  <Badge
                    className={`${
                      params.success === "recommendations-generated"
                        ? "border border-green-400 bg-green-200 text-green-900"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {params.success === "recommendations-generated"
                      ? "Recently Updated"
                      : "Active"}
                  </Badge>
                </div>
                <div
                  className={`flex items-center justify-between rounded-lg p-3 ${
                    params.success === "recommendations-generated"
                      ? "border-2 border-blue-300 bg-blue-100"
                      : "bg-blue-50"
                  }`}
                >
                  <div>
                    <p
                      className={`font-medium ${
                        params.success === "recommendations-generated"
                          ? "text-blue-900"
                          : "text-blue-900"
                      }`}
                    >
                      Author-based
                    </p>
                    <p
                      className={`text-sm ${
                        params.success === "recommendations-generated"
                          ? "text-blue-700"
                          : "text-blue-600"
                      }`}
                    >
                      Based on user&apos;s favorite authors
                    </p>
                  </div>
                  <Badge
                    className={`${
                      params.success === "recommendations-generated"
                        ? "border border-blue-400 bg-blue-200 text-blue-900"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {params.success === "recommendations-generated"
                      ? "Recently Updated"
                      : "Active"}
                  </Badge>
                </div>
                <div
                  className={`flex items-center justify-between rounded-lg p-3 ${
                    params.success === "trending-updated"
                      ? "border-2 border-purple-300 bg-purple-100"
                      : "bg-purple-50"
                  }`}
                >
                  <div>
                    <p
                      className={`font-medium ${
                        params.success === "trending-updated"
                          ? "text-purple-900"
                          : "text-purple-900"
                      }`}
                    >
                      Trending
                    </p>
                    <p
                      className={`text-sm ${
                        params.success === "trending-updated"
                          ? "text-purple-700"
                          : "text-purple-600"
                      }`}
                    >
                      Most borrowed books recently
                    </p>
                  </div>
                  <Badge
                    className={`${
                      params.success === "trending-updated"
                        ? "border border-purple-400 bg-purple-200 text-purple-900"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {params.success === "trending-updated"
                      ? "Recently Updated"
                      : "Active"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Recommendation Actions */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">
                Recommendation Actions
              </h4>
              <div className="space-y-3">
                <form action={handleGenerateAllUserRecommendations}>
                  <Button
                    type="submit"
                    className={`w-full disabled:opacity-50 ${
                      params.success === "recommendations-generated"
                        ? "bg-purple-600 text-white hover:bg-purple-700"
                        : "bg-purple-600 text-white hover:bg-purple-700"
                    }`}
                  >
                    Generate All User Recommendations
                  </Button>
                </form>
                <form action={handleUpdateTrendingBooks}>
                  <Button
                    type="submit"
                    className={`w-full disabled:opacity-50 ${
                      params.success === "trending-updated"
                        ? "bg-purple-600 text-white hover:bg-purple-700"
                        : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Update Trending Books
                  </Button>
                </form>
                <form action={handleRefreshRecommendationCache}>
                  <Button
                    type="submit"
                    className={`w-full disabled:opacity-50 ${
                      params.success === "cache-refreshed"
                        ? "bg-purple-600 text-white hover:bg-purple-700"
                        : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Refresh Recommendation Cache
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Operations Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            ⚡ Bulk Operations
          </CardTitle>
          <p className="text-sm text-gray-600">
            Perform batch actions on multiple books, users, or borrow requests
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Book Operations */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Book Operations</h4>
              <div className="space-y-2">
                <form action={handleBulkEditBooks}>
                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full justify-start"
                  >
                    📚 Bulk Edit Books
                  </Button>
                </form>
                <form action={handleBulkActivateBooks}>
                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full justify-start"
                  >
                    ✅ Bulk Activate Books
                  </Button>
                </form>
                <form action={handleBulkDeactivateBooks}>
                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full justify-start"
                  >
                    ❌ Bulk Deactivate Books
                  </Button>
                </form>
                <form action={handleBulkDeleteBooks}>
                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full justify-start text-red-600"
                  >
                    🗑️ Bulk Delete Books
                  </Button>
                </form>
              </div>
            </div>

            {/* User Operations */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">User Operations</h4>
              <div className="space-y-2">
                <form action={handleBulkApproveUsers}>
                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full justify-start"
                  >
                    ✅ Bulk Approve Users
                  </Button>
                </form>
                <form action={handleBulkRejectUsers}>
                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full justify-start"
                  >
                    ❌ Bulk Reject Users
                  </Button>
                </form>
                <form action={handleBulkMakeAdmin}>
                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full justify-start"
                  >
                    👑 Bulk Make Admin
                  </Button>
                </form>
                <form action={handleBulkRemoveAdmin}>
                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full justify-start"
                  >
                    👤 Bulk Remove Admin
                  </Button>
                </form>
              </div>
            </div>

            {/* Borrow Operations */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Borrow Operations</h4>
              <div className="space-y-2">
                <form action={handleBulkApproveRequests}>
                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full justify-start"
                  >
                    ✅ Bulk Approve Requests
                  </Button>
                </form>
                <form action={handleBulkRejectRequests}>
                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full justify-start"
                  >
                    ❌ Bulk Reject Requests
                  </Button>
                </form>
                <form action={handleBulkSendReminders}>
                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full justify-start"
                  >
                    📧 Bulk Send Reminders
                  </Button>
                </form>
                <form action={handleBulkUpdateStatus}>
                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full justify-start"
                  >
                    📊 Bulk Update Status
                  </Button>
                </form>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-lg bg-yellow-50 p-4">
            <div className="flex items-center">
              <div className="shrink-0">
                <svg
                  className="size-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule={"evenodd" as const}
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule={"evenodd" as const}
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Bulk Operations Notice
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Bulk operations will be performed on selected items. Please
                    ensure you have selected the correct items before
                    proceeding.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            📊 Data Export
          </CardTitle>
          <p className="text-sm text-gray-600">
            Export library data in various formats for analysis and backup
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Export Options */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Export Options</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                  <div>
                    <p className="font-medium text-gray-900">Books Data</p>
                    <p className="text-sm text-gray-600">
                      {exportStats?.totalBooks || 0} books
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <form action="/api/admin/export/books" method="POST">
                      <input type="hidden" name="format" value="csv" />
                      <Button type="submit" size="sm" variant="outline">
                        CSV
                      </Button>
                    </form>
                    <form action="/api/admin/export/books" method="POST">
                      <input type="hidden" name="format" value="json" />
                      <Button type="submit" size="sm" variant="outline">
                        JSON
                      </Button>
                    </form>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                  <div>
                    <p className="font-medium text-gray-900">Users Data</p>
                    <p className="text-sm text-gray-600">
                      {exportStats?.totalUsers || 0} users
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <form action="/api/admin/export/users" method="POST">
                      <input type="hidden" name="format" value="csv" />
                      <Button type="submit" size="sm" variant="outline">
                        CSV
                      </Button>
                    </form>
                    <form action="/api/admin/export/users" method="POST">
                      <input type="hidden" name="format" value="json" />
                      <Button type="submit" size="sm" variant="outline">
                        JSON
                      </Button>
                    </form>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                  <div>
                    <p className="font-medium text-gray-900">Borrows Data</p>
                    <p className="text-sm text-gray-600">
                      {exportStats?.totalBorrows || 0} borrows
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <form action="/api/admin/export/borrows" method="POST">
                      <input type="hidden" name="format" value="csv" />
                      <Button type="submit" size="sm" variant="outline">
                        CSV
                      </Button>
                    </form>
                    <form action="/api/admin/export/borrows" method="POST">
                      <input type="hidden" name="format" value="json" />
                      <Button type="submit" size="sm" variant="outline">
                        JSON
                      </Button>
                    </form>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                  <div>
                    <p className="font-medium text-gray-900">Analytics Data</p>
                    <p className="text-sm text-gray-600">
                      Complete analytics report
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <form action="/api/admin/export/analytics" method="POST">
                      <input type="hidden" name="format" value="csv" />
                      <Button type="submit" size="sm" variant="outline">
                        CSV
                      </Button>
                    </form>
                    <form action="/api/admin/export/analytics" method="POST">
                      <input type="hidden" name="format" value="json" />
                      <Button type="submit" size="sm" variant="outline">
                        JSON
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            {/* Export Settings */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Export Settings</h4>
              <div className="space-y-3">
                <div className="rounded-lg bg-blue-50 p-3">
                  <p className="font-medium text-blue-900">Date Range Export</p>
                  <p className="text-sm text-blue-600">
                    Export borrows data for a specific date range
                  </p>
                  <form
                    action="/api/admin/export/borrows-range"
                    method="POST"
                    className="mt-2"
                  >
                    <div className="flex gap-2">
                      <input
                        type="date"
                        name="startDate"
                        className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm"
                        required
                      />
                      <input
                        type="date"
                        name="endDate"
                        className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm"
                        required
                      />
                      <Button type="submit" size="sm">
                        Export
                      </Button>
                    </div>
                  </form>
                </div>

                <div className="rounded-lg bg-green-50 p-3">
                  <p className="font-medium text-green-900">Last Export</p>
                  <p className="text-sm text-green-600">
                    {exportStats?.lastExportDate
                      ? new Date(exportStats.lastExportDate).toLocaleString()
                      : "No exports yet"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutomationDashboard;
