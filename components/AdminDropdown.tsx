"use client";

import Link from "next/link";
import { useState } from "react";

const AdminDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Main Admin Dashboard Link with padding for better hover area */}
      <div className="px-2 py-1">
        <Link
          href="/admin"
          className="text-light-100 transition-colors hover:text-light-200"
        >
          Admin Dashboard
        </Link>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1 w-48 rounded-lg border border-gray-700 bg-gray-800 shadow-lg">
          {/* Add a small invisible bridge to prevent hover gap */}
          <div className="absolute inset-x-0 -top-1 h-1"></div>
          <div className="py-2">
            <Link
              href="/admin"
              className="block px-4 py-2 text-light-100 transition-colors hover:bg-gray-700 hover:text-light-200"
            >
              Dashboard Overview
            </Link>
            <Link
              href="/admin/users"
              className="block px-4 py-2 text-light-100 transition-colors hover:bg-gray-700 hover:text-light-200"
            >
              Users
            </Link>
            <Link
              href="/admin/books"
              className="block px-4 py-2 text-light-100 transition-colors hover:bg-gray-700 hover:text-light-200"
            >
              Books
            </Link>
            <Link
              href="/admin/book-requests"
              className="block px-4 py-2 text-light-100 transition-colors hover:bg-gray-700 hover:text-light-200"
            >
              Borrow Requests
            </Link>
            <Link
              href="/admin/account-requests"
              className="block px-4 py-2 text-light-100 transition-colors hover:bg-gray-700 hover:text-light-200"
            >
              Account Requests
            </Link>
            <Link
              href="/admin/business-insights"
              className="block px-4 py-2 text-light-100 transition-colors hover:bg-gray-700 hover:text-light-200"
            >
              Analytics Dashboard
            </Link>
            <Link
              href="/admin/automation"
              className="block px-4 py-2 text-light-100 transition-colors hover:bg-gray-700 hover:text-light-200"
            >
              Automation Center
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDropdown;
