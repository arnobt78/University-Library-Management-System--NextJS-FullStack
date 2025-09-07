import React from "react";
import { Button } from "@/components/ui/button";
import { updateUserRole } from "@/lib/admin/actions/user";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          Make Yourself Admin
        </h1>

        <div className="space-y-4">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Click the button below to make your account an admin. This will
              give you access to all admin features.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800">
                <strong>Current User:</strong> {session.user.email}
              </p>
            </div>
          </div>

          <form
            action={async () => {
              "use server";
              const result = await updateUserRole(session.user.id, "ADMIN");
              if (result.success) {
                redirect("/admin?success=admin-granted");
              } else {
                redirect("/make-admin?error=failed");
              }
            }}
          >
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              Make Me Admin
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              After clicking the button, you'll be able to access:
            </p>
            <ul className="text-sm text-gray-500 mt-2 space-y-1">
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
