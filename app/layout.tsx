import type { Metadata } from "next";
import { Fraunces, Nunito_Sans } from "next/font/google";
import { wedding } from "@/lib/content";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["SOFT", "WONK"],
});

const body = Nunito_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${wedding.partnerA} & ${wedding.partnerB} · Wedding`,
  description: `${wedding.partnerA} and ${wedding.partnerB} are getting married on ${wedding.date}.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-[family-name:var(--font-body)]">
        {children}
      </body>
    </html>
  );
}
