import NextAuth, { User } from "next-auth";
import { sha256 } from "@noble/hashes/sha256";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

function concatUint8Arrays(a: Uint8Array, b: Uint8Array): Uint8Array {
  const c = new Uint8Array(a.length + b.length);
  c.set(a, 0);
  c.set(b, a.length);
  return c;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email.toString()))
          .limit(1);

        if (user.length === 0) return null;

        // Extract salt and hash from stored password
        const [saltB64, hashB64] = user[0].password.split(":");
        const salt = Uint8Array.from(Buffer.from(saltB64, "base64"));
        const expectedHash = Buffer.from(hashB64, "base64");
        // Hash the provided password with the stored salt
        const passwordBytes = new TextEncoder().encode(
          credentials.password.toString()
        );
        const hashBuffer = sha256(concatUint8Arrays(passwordBytes, salt));
        const isPasswordValid = Buffer.from(hashBuffer).equals(expectedHash);

        if (!isPasswordValid) return null;

        return {
          id: user[0].id.toString(),
          email: user[0].email,
          name: user[0].fullName,
        } as User;
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;

        // Update last_login timestamp when user signs in
        try {
          await db
            .update(users)
            .set({ lastLogin: new Date() })
            .where(eq(users.id, user.id));
        } catch (error) {
          console.error("Failed to update last_login:", error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
      }

      return session;
    },
  },
});
