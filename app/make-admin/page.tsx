import React from "react";
import { Button } from "@/components/ui/button";
import { createAdminRequest } from "@/lib/admin/actions/admin-requests";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) => {
  const params = await searchParams;
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold">
          Request Admin Access
        </h1>

        {/* Success Message */}
        {params.success === "request-sent" && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4">
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
                  ✅ Admin Request Sent Successfully!
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    Your admin request has been sent to the administrators for
                    review. You will be notified once it&apos;s approved or
                    rejected.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {params.error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
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
                  ❌ Request Failed
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    {params.error === "already-admin" &&
                      "You are already an admin."}
                    {params.error === "pending-request" &&
                      "You already have a pending admin request."}
                    {params.error === "failed" &&
                      "Failed to send admin request. Please try again."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="text-center">
            <p className="mb-4 text-gray-600">
              Submit a request to become an administrator. Your request will be
              reviewed by existing administrators before approval.
            </p>

            <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm text-blue-800">
                <strong>Current User:</strong> {session.user.email}
              </p>
            </div>
          </div>

          <form
            action={async (formData) => {
              "use server";
              const requestReason = formData.get("requestReason") as string;

              if (!requestReason || requestReason.trim().length < 10) {
                redirect("/make-admin?error=failed");
              }

              if (!session.user?.id) {
                redirect("/make-admin?error=failed");
              }

              const result = await createAdminRequest(
                session.user.id,
                requestReason
              );

              if (result.success) {
                redirect("/make-admin?success=request-sent");
              } else {
                if (result.error?.includes("already an admin")) {
                  redirect("/make-admin?error=already-admin");
                } else if (result.error?.includes("pending admin request")) {
                  redirect("/make-admin?error=pending-request");
                } else {
                  redirect("/make-admin?error=failed");
                }
              }
            }}
          >
            <div className="mb-4">
              <label
                htmlFor="requestReason"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Why do you need admin access?
              </label>
              <textarea
                id="requestReason"
                name="requestReason"
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Please explain why you need admin access and how you plan to use it responsibly..."
                required
                minLength={10}
              />
              <p className="mt-1 text-xs text-gray-500">
                Minimum 10 characters required
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-600 text-white hover:bg-purple-700"
            >
              Submit Admin Request
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              After approval, you&apos;ll be able to access:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-gray-500">
              <li>• Admin Dashboard</li>
              <li>• User Management</li>
              <li>• Book Management</li>
              <li>• Borrow Requests</li>
              <li>• Account Requests</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
