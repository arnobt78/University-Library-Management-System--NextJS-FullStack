"use server";

import { signOut } from "@/auth";
import { redirect } from "next/navigation";

export async function logoutAction() {
  await signOut();
  redirect("/sign-in");
}
