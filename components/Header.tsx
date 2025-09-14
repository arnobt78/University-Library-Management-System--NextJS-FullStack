import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Session } from "next-auth";
import { logoutAction } from "@/lib/actions/logout";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

interface HeaderProps {
  session: Session;
}

const Header = async ({ session }: HeaderProps) => {
  // Check if user is admin
  const userRole = session?.user?.id
    ? await db
        .select({ role: users.role })
        .from(users)
        .where(eq(users.id, session.user.id))
        .limit(1)
        .then((res) => res[0]?.role)
    : null;

  const isAdmin = userRole === "ADMIN";

  return (
    <header className="my-10 flex justify-between">
      <Link href="/">
        <img src="/icons/logo.svg" alt="logo" width={40} height={40} />
      </Link>

      <ul className="flex flex-row items-center gap-8 text-light-100">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/all-books">All Books</Link>
        </li>
        <li>
          <Link href="/my-profile">My Profile</Link>
        </li>

        {/* Admin-only navigation items */}
        {isAdmin ? (
          <>
            <li>
              <Link href="/admin">Admin Dashboard</Link>
            </li>
            <li>
              <Link href="/admin/users">Users</Link>
            </li>
            <li>
              <Link href="/admin/books">Books</Link>
            </li>
            <li>
              <Link href="/admin/book-requests">Borrow Requests</Link>
            </li>
            <li>
              <Link href="/admin/account-requests">Account Requests</Link>
            </li>
          </>
        ) : (
          <li>
            <Link
              href="/make-admin"
              className="text-purple-300 hover:text-purple-200"
            >
              Become Admin
            </Link>
          </li>
        )}

        {/* User email */}
        {session?.user?.email && (
          <li className="font-bold text-light-100">{session.user.email}</li>
        )}

        {/* Logout button */}
        <li>
          <form action={logoutAction} className="mb-0 text-dark-100">
            <Button>Logout</Button>
          </form>
        </li>
      </ul>
    </header>
  );
};

export default Header;
