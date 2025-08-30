import Link from "next/link";
// import Image from "next/image";
import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  session: Session;
}

const Header = ({ session }: HeaderProps) => {
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
          <Link href="/books/1">Book Details</Link>
        </li>
        <li>
          <Link href="/my-profile">My Profile</Link>
        </li>
        <li>
          <Link href="/admin">Admin Dashboard</Link>
        </li>
        <li>
          <Link href="/admin/books">Admin Books</Link>
        </li>
        <li>
          <Link href="/admin/books/new">Add New Book</Link>
        </li>
        {session?.user?.email && (
          <li className="font-bold text-light-100">{session.user.email}</li>
        )}
        <li>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
            className="mb-0"
          >
            <Button>Logout</Button>
          </form>
        </li>
      </ul>
    </header>
  );
};

export default Header;
