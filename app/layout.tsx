import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope, Pinyon_Script } from "next/font/google";
import { images, wedding } from "@/lib/content";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "opsz"],
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

const script = Pinyon_Script({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
});

const title = `${wedding.partnerA} & ${wedding.partnerB} · ${wedding.dateShort}`;
const description = `${wedding.partnerA} and ${wedding.partnerB} are getting married on ${wedding.date} at ${wedding.venue.name}. Our story, the details, and years of photos.`;

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "http://localhost:3000"),
  ),
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    images: [{ url: images.hero, width: 1350, height: 1800 }],
  },
  twitter: { card: "summary_large_image", title, description, images: [images.hero] },
};

export const viewport: Viewport = {
  themeColor: "#0d1424",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${script.variable} antialiased`}
    >
      <body className="flex min-h-dvh flex-col">{children}</body>
    </html>
  );
}
