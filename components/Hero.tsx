import { wedding } from "@/lib/content";
import { BalloonScene } from "./BalloonScene";

export function Hero() {
  return (
    <section id="top" className="relative sky-wash">
      <div className="cloud-grain absolute inset-0" aria-hidden />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex min-h-svh flex-col items-center justify-start px-5 pt-28 text-center md:pt-32">
        <p className="mb-3 text-sm uppercase tracking-[0.28em] text-ink-soft">
          {wedding.tagline}
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-[clamp(3rem,12vw,6.5rem)] leading-[0.92] tracking-tight text-ink">
          {wedding.partnerA}
          <span className="mx-2 text-gold md:mx-4">&</span>
          {wedding.partnerB}
        </h1>
        <p className="mt-5 max-w-md text-base text-ink-soft md:text-lg">
          {wedding.date}
          <span className="mx-2 text-gold">·</span>
          {wedding.venue.name}
        </p>
        <a
          href="#story"
          className="pointer-events-auto mt-8 inline-flex items-center rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-transform hover:scale-[1.02]"
        >
          {wedding.heroCta}
        </a>
      </div>

      <BalloonScene />
    </section>
  );
}
