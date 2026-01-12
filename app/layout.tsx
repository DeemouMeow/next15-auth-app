import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

interface RootLayoutProps {
    children: React.ReactNode;
};

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Auth App",
  description: "Authorization application",
};

const RootLayout = async ({
  children,
}: RootLayoutProps) => {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="ru">
        <body className={inter.className}>
          {children}
        </body>
      </html>
    </SessionProvider>
  );
};

export default RootLayout;