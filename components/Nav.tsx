"use client";

import { navLinks, wedding } from "@/lib/content";

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 md:px-8">
        <a
          href="#top"
          className="rounded-full bg-paper/75 px-3 py-1.5 font-[family-name:var(--font-display)] text-lg tracking-tight text-ink backdrop-blur-md md:text-xl"
        >
          {wedding.partnerA} <span className="text-gold">&</span>{" "}
          {wedding.partnerB}
        </a>
        <nav
          aria-label="Sections"
          className="hidden items-center gap-1 rounded-full bg-paper/75 px-2 py-1.5 text-sm text-ink-soft backdrop-blur-md lg:flex"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-2.5 py-1 transition-colors hover:bg-ink/5 hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href="#story"
          className="rounded-full bg-ink px-4 py-2 text-sm text-paper transition-opacity hover:opacity-90 lg:hidden"
        >
          Story
        </a>
      </div>
    </header>
  );
}
