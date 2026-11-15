import Link from "next/link";
import { Nav } from "@/components/Nav";
import { SchoolDays } from "@/components/SchoolDays";
import { ShoeChase } from "@/components/ShoeChase";

export default function SchoolPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 bg-[#f7f4ee]">
        <div className="mx-auto max-w-2xl px-5 pt-[max(6rem,calc(env(safe-area-inset-top)+5rem))] sm:px-6">
          <Link
            href="/"
            className="inline-flex min-h-10 items-center text-sm text-ink/50 transition-colors hover:text-ink"
          >
            ← Photos
          </Link>
        </div>
        <SchoolDays />
      </main>
      <ShoeChase />
    </>
  );
}
