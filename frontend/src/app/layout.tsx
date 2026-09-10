import type { Metadata } from "next";
import { Fraunces, Work_Sans } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600"],
});

const workSans = Work_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Event RSVP Tracker",
  description: "Create events and track RSVPs.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${workSans.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-ink font-body text-paper antialiased">
        <header className="border-b border-paper/10">
          <div className="mx-auto flex max-w-2xl items-center gap-2 px-6 py-5">
            <span
              aria-hidden
              className="inline-block h-2 w-2 rounded-full bg-brass"
            />
            <Link
              href="/"
              className="font-display text-lg tracking-tight text-paper"
            >
              Events
            </Link>
          </div>
        </header>
        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}
