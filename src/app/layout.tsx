import type { Metadata } from "next";
import { Jua } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const jua = Jua({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "뿌끼몬",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" trancy-version="7.8.7">
      <body className={`${jua.className} antialiased`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
