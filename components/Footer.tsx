import { wedding } from "@/lib/content";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-night text-cream">
      <div className="mx-auto max-w-3xl px-6 pb-[calc(3.5rem+env(safe-area-inset-bottom))] pt-20 text-center md:px-8">
        <p className="font-display text-5xl font-light italic md:text-7xl">
          {wedding.partnerA} <span className="font-script text-gold">&amp;</span> {wedding.partnerB}
        </p>
        <p className="eyebrow mt-5 text-cream/60">
          {wedding.dateShort} · {wedding.venue.city}
        </p>
        <p className="mx-auto mt-8 max-w-xs text-sm text-cream/40">
          Made with love — thank you for floating along with us.
        </p>
      </div>
    </footer>
  );
}
