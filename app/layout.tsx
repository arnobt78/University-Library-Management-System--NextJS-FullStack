import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

import localFont from "next/font/local";
import { ReactNode } from "react";
import SessionProviderWrapper from "./SessionProviderWrapper";
import { auth } from "@/auth";

const ibmPlexSans = localFont({
  src: [
    { path: "/fonts/IBMPlexSans-Regular.ttf", weight: "400", style: "normal" },
    { path: "/fonts/IBMPlexSans-Medium.ttf", weight: "500", style: "normal" },
    { path: "/fonts/IBMPlexSans-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "/fonts/IBMPlexSans-Bold.ttf", weight: "700", style: "normal" },
  ],
});

const bebasNeue = localFont({
  src: [
    { path: "/fonts/BebasNeue-Regular.ttf", weight: "400", style: "normal" },
  ],
  variable: "--bebas-neue",
});

export const metadata: Metadata = {
  title: "BookWise | University Library Management",
  description:
    "BookWise is a modern university library management solution for borrowing, tracking, and discovering books. Built for students and staff.",
  authors: [
    {
      name: "Arnob Mahmud",
      url: "https://arnob-mahmud.vercel.app/",
    },
    { name: "arnob_t78@yahoo.com" },
  ],
  keywords: [
    "BookWise",
    "library",
    "university library",
    "book borrowing",
    "library management",
    "student portal",
    "Arnob Mahmud",
    "Next.js",
    "TypeScript",
    "Drizzle ORM",
    "ImageKit",
    "Upstash",
    "Resend",
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "BookWise | University Library Management",
    description:
      "BookWise is a modern university library management solution for borrowing, tracking, and discovering books. Built for students and staff.",
    url: "https://arnob-mahmud.vercel.app/",
    siteName: "BookWise",
    images: [
      {
        url: "/images/auth-illustration.png",
        width: 1200,
        height: 630,
        alt: "BookWise Library App",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <SessionProviderWrapper session={session}>
        <body
          className={`${ibmPlexSans.className} ${bebasNeue.variable} antialiased`}
          suppressHydrationWarning
        >
          {children}

          <Toaster />
        </body>
      </SessionProviderWrapper>
    </html>
  );
};

export default RootLayout;
