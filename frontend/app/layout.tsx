import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import "./globals.css";


export const metadata: Metadata = {
  title: {
    default: "Signals & Systems — Data Portfolio",
    template: "%s — Signals & Systems",
  },
  description: "Four investigative data products spanning sport, games, streaming culture, and music archives.",
};


export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const apiUrl = process.env.DJANGO_PUBLIC_URL || (process.env.STATIC_EXPORT === "true" ? null : "http://127.0.0.1:8000/api/projects/");
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#content">Skip to content</a>
        <header className="site-header">
          <Link className="brand" href="/" aria-label="Signals and Systems home">
            <span className="brand-mark" aria-hidden="true">S/S</span>
            <span>Signals &amp; Systems</span>
          </Link>
          <nav aria-label="Primary navigation">
            <Link href="/#about">About</Link>
            <Link href="/#work">Work</Link>
            {apiUrl ? <a href={apiUrl}>API</a> : null}
          </nav>
        </header>
        <main id="content">{children}</main>
        <footer className="site-footer">
          <span>Four independent analytical systems.</span>
          <span>Python ETL · Static JSON · Next.js</span>
        </footer>
      </body>
    </html>
  );
}
