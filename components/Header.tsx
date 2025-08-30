import Link from "next/link";
import Image from "next/image";
import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  session: Session;
}

const Header = ({ session }: HeaderProps) => {
  return (
    <header className="my-10 flex justify-between gap-5">
      <Link href="/">
        <Image src="/icons/logo.svg" alt="logo" width={40} height={40} />
      </Link>

      <ul className="flex flex-row items-center gap-8">
        {session?.user?.email && (
          <li className="font-bold text-light-100">{session.user.email}</li>
        )}
        <li>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
            className="mb-10"
          >
            <Button>Logout</Button>
          </form>
        </li>
      </ul>
    </header>
  );
};

export default Header;
