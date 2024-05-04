import type { Metadata } from "next";
import { Jersey_15 } from "next/font/google";
import classNames from "classnames";

import { ReactQueryProvider } from "@/providers";

import "./globals.css";

const jersey = Jersey_15({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Marvel heros",
  description: "List of marvel heros",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={classNames(jersey.className, "px-14")}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
