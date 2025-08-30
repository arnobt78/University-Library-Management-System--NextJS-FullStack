"use client";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

const SessionProviderWrapper = ({
  session,
  children,
}: {
  session: import("next-auth").Session | null;
  children: ReactNode;
}) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default SessionProviderWrapper;
