import type { Metadata } from "next";
import { Sour_Gummy, Nanum_Pen_Script } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const sourGummy = Sour_Gummy({
  variable: "--font-sour-gummy",
  subsets: ["latin"],
});

const nanumPenScript = Nanum_Pen_Script({
  variable: "--font-nanum-pen-script",
  subsets: ["latin"],
  weight: ["400"],
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
    <html lang="en">
      <body
        className={`${sourGummy.className} ${nanumPenScript.className} antialiased`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
