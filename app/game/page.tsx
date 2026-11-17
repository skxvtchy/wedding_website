import type { Metadata } from "next";
import { CatGame } from "@/components/game/CatGame";
import { Nav } from "@/components/Nav";
import { wedding } from "@/lib/content";

export const metadata: Metadata = {
  title: `Play with Sole · ${wedding.partnerA} & ${wedding.partnerB}`,
};

export default function GamePage() {
  return (
    <>
      <Nav solid />
      <main className="flex flex-1 flex-col bg-night pt-[calc(4rem+env(safe-area-inset-top))] md:items-center md:justify-center md:py-24">
        <div className="h-[calc(100svh-4rem-env(safe-area-inset-top))] w-full md:h-[min(760px,calc(100svh-9rem))] md:max-w-md md:overflow-hidden md:rounded-[2rem] md:shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)] md:ring-1 md:ring-cream/10">
          <CatGame />
        </div>
      </main>
    </>
  );
}
