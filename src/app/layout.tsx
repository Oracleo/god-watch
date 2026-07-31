import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { auth } from "@/auth";
import { Providers } from "@/components/providers/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "God Watch — Every Day Leaves Evidence",
    template: "%s · God Watch",
  },
  description:
    "A date-first habit tracker and daily checklist. Record whether each task was completed, failed, or missed — and build consistency through analytics and long-term tracking.",
  keywords: ["habit tracker", "daily checklist", "consistency", "streaks", "productivity"],
  authors: [{ name: "Devnetra Consultancy" }],
  applicationName: "God Watch",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "God Watch",
  },
  openGraph: {
    title: "God Watch — Every Day Leaves Evidence",
    description: "A date-first habit tracker and daily checklist.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}
      >
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}

