"use client";

import { navLinks, wedding } from "@/lib/content";

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 md:px-8">
        <a
          href="#top"
          className="font-[family-name:var(--font-display)] text-lg tracking-tight text-ink md:text-xl"
        >
          {wedding.partnerA} <span className="text-gold">&</span>{" "}
          {wedding.partnerB}
        </a>
        <nav
          aria-label="Sections"
          className="hidden items-center gap-5 text-sm text-ink-soft md:flex"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href="#schedule"
          className="rounded-full bg-ink px-4 py-2 text-sm text-paper transition-opacity hover:opacity-90 md:hidden"
        >
          Details
        </a>
      </div>
    </header>
  );
}
