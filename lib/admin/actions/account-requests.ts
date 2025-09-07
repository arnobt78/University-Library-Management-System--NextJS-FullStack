"use server";

import { updateUserStatus } from "@/lib/admin/actions/user";
import { redirect } from "next/navigation";

export async function approveUserAction(userId: string) {
  const result = await updateUserStatus(userId, "APPROVED");
  if (result.success) {
    redirect("/admin/account-requests?success=account-approved");
  } else {
    redirect("/admin/account-requests?error=failed");
  }
}

export async function rejectUserAction(userId: string) {
  const result = await updateUserStatus(userId, "REJECTED");
  if (result.success) {
    redirect("/admin/account-requests?success=account-rejected");
  } else {
    redirect("/admin/account-requests?error=failed");
  }
}
