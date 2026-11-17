import { wedding } from "@/lib/content";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-night text-cream">
      <div className="mx-auto max-w-3xl px-6 pb-[calc(3.5rem+env(safe-area-inset-bottom))] pt-20 text-center md:px-8">
        <p className="font-display text-5xl font-light italic leading-tight md:text-7xl">
          <span className="block">{wedding.fullNameA}</span>
          <span className="font-script text-gold">&amp;</span> {wedding.fullNameB}
        </p>
        <p className="eyebrow mt-5 text-cream/60">
          {wedding.dateShort} · {wedding.venue.city}
        </p>
        <p className="mx-auto mt-8 w-fit rounded-full px-4 py-1.5 text-sm font-semibold tracking-wide text-gold-soft ring-1 ring-gold/35">
          {wedding.hashtag}
        </p>
        <p className="mt-2 text-xs text-cream/50">Tag your photos so we can see them all.</p>
        <p className="mx-auto mt-8 max-w-xs text-sm text-cream/40">
          Made with love — thank you for floating along with us.
        </p>
      </div>
    </footer>
  );
}
