"use server";

import { eq } from "drizzle-orm";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { sha256 } from "@noble/hashes/sha256";
import { randomBytes } from "@noble/hashes/utils";

function concatUint8Arrays(a: Uint8Array, b: Uint8Array): Uint8Array {
  const c = new Uint8Array(a.length + b.length);
  c.set(a, 0);
  c.set(b, a.length);
  return c;
}
import { signIn } from "@/auth";
import { headers } from "next/headers";
import ratelimit from "@/lib/ratelimit";
import { redirect } from "next/navigation";
import { workflowClient } from "@/lib/workflow";
import config from "@/lib/config";

export const signInWithCredentials = async (
  params: Pick<AuthCredentials, "email" | "password">
) => {
  const { email, password } = params;

  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  const { success } = await ratelimit.limit(ip);

  if (!success) return redirect("/too-fast");

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { success: false, error: result.error };
    }

    return { success: true };
  } catch (error) {
    console.log(error, "Signin error");
    return { success: false, error: "Signin error" };
  }
};

export const signUp = async (params: AuthCredentials) => {
  const { fullName, email, universityId, password, universityCard } = params;

  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  const { success } = await ratelimit.limit(ip);

  if (!success) return redirect("/too-fast");

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    return { success: false, error: "User already exists" };
  }

  // Generate a random salt
  const salt = randomBytes(16);
  // Hash the password with the salt
  const passwordBytes = new TextEncoder().encode(password);
  const hashBuffer = sha256(concatUint8Arrays(passwordBytes, salt));
  // Store salt and hash as base64
  const hashedPassword = `${Buffer.from(salt).toString("base64")}:${Buffer.from(hashBuffer).toString("base64")}`;

  try {
    await db.insert(users).values({
      fullName,
      email,
      universityId,
      password: hashedPassword,
      universityCard,
    });

    // Only trigger workflow in production or if explicitly enabled
    if (
      process.env.NODE_ENV === "production" ||
      process.env.ENABLE_WORKFLOWS === "true"
    ) {
      await workflowClient.trigger({
        url: `${config.env.prodApiEndpoint}/api/workflows/onboarding`,
        body: {
          email,
          fullName,
        },
      });
    } else {
      console.log("Skipping workflow trigger in development mode");
    }

    await signInWithCredentials({ email, password });

    return { success: true };
  } catch (error) {
    console.log(error, "Signup error");
    return { success: false, error: "Signup error" };
  }
};
