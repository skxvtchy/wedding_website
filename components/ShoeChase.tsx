import Image from "next/image";
import { images, wedding } from "@/lib/content";

export function ShoeChase() {
  return (
    <footer className="relative overflow-hidden bg-ink text-paper">
      <div className="mx-auto max-w-3xl px-5 py-16 text-center md:px-8">
        <p className="font-[family-name:var(--font-display)] text-3xl md:text-4xl">
          {wedding.partnerA} <span className="text-gold">&</span>{" "}
          {wedding.partnerB}
        </p>
        <p className="mt-3 text-paper/70">
          {wedding.dateShort} · {wedding.venue.name}
        </p>
        <p className="mt-8 text-sm text-paper/50">
          With love — and a sole that never quite catches the shoes.
        </p>
      </div>

      <div
        className="relative h-28 border-t border-paper/10 bg-sky-top/20"
        aria-hidden
      >
        <div className="chase-track absolute bottom-3 flex items-end">
          <Image
            src={images.shoes}
            alt=""
            width={110}
            height={70}
            className="drop-shadow-lg"
          />
        </div>
        <div className="chase-sole absolute bottom-2 flex items-end">
          <Image
            src={images.sole}
            alt=""
            width={52}
            height={90}
            className="drop-shadow-lg"
          />
        </div>
      </div>
    </footer>
  );
}
