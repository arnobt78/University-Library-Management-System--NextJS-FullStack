import React from "react";
import { getAllUsers } from "@/lib/admin/actions/user";
import {
  approveUserAction,
  rejectUserAction,
} from "@/lib/admin/actions/account-requests";
import AccountRequestsClient from "./AccountRequestsClient";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) => {
  const params = await searchParams;
  const result = await getAllUsers();

  if (!result.success) {
    return <div>Error loading account requests: {result.error}</div>;
  }

  const users = result.data || [];
  const pendingUsers = users.filter((user) => user.status === "PENDING");

  return (
    <AccountRequestsClient
      users={pendingUsers}
      searchParams={params}
      approveAction={approveUserAction}
      rejectAction={rejectUserAction}
    />
  );
};

export default Page;
