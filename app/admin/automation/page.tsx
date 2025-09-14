import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getReminderStats } from "@/lib/admin/actions/reminders";
import { getExportStats } from "@/lib/admin/actions/data-export";

const AutomationDashboard = async () => {
  // Fetch automation data
  const [reminderStats, exportStats] = await Promise.all([
    getReminderStats(),
    getExportStats(),
  ]);

  return (
    <div className="space-y-6">
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
              <form action="/api/admin/send-due-reminders" method="POST">
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
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
              <form action="/api/admin/send-overdue-reminders" method="POST">
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
                <div className="flex items-center justify-between rounded-lg bg-green-50 p-3">
                  <div>
                    <p className="font-medium text-green-900">Genre-based</p>
                    <p className="text-sm text-green-600">
                      Based on user&apos;s favorite genres
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-blue-50 p-3">
                  <div>
                    <p className="font-medium text-blue-900">Author-based</p>
                    <p className="text-sm text-blue-600">
                      Based on user&apos;s favorite authors
                    </p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-purple-50 p-3">
                  <div>
                    <p className="font-medium text-purple-900">Trending</p>
                    <p className="text-sm text-purple-600">
                      Most borrowed books recently
                    </p>
                  </div>
                  <Badge className="bg-purple-100 text-purple-800">
                    Active
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
                <form
                  action="/api/admin/generate-recommendations"
                  method="POST"
                >
                  <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    Generate All User Recommendations
                  </Button>
                </form>
                <form action="/api/admin/update-trending" method="POST">
                  <Button type="submit" variant="outline" className="w-full">
                    Update Trending Books
                  </Button>
                </form>
                <form action="/api/admin/refresh-recommendations" method="POST">
                  <Button type="submit" variant="outline" className="w-full">
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
                <Button variant="outline" className="w-full justify-start">
                  📚 Bulk Edit Books
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  ✅ Bulk Activate Books
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  ❌ Bulk Deactivate Books
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600"
                >
                  🗑️ Bulk Delete Books
                </Button>
              </div>
            </div>

            {/* User Operations */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">User Operations</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  ✅ Bulk Approve Users
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  ❌ Bulk Reject Users
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  👑 Bulk Make Admin
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  👤 Bulk Remove Admin
                </Button>
              </div>
            </div>

            {/* Borrow Operations */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Borrow Operations</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  ✅ Bulk Approve Requests
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  ❌ Bulk Reject Requests
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  📧 Bulk Send Reminders
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  📊 Bulk Update Status
                </Button>
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
