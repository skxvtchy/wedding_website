"use client";

import CurvedLoop from "@/components/reactbits/CurvedLoop";
import { favorites } from "@/lib/content";
import { Reveal } from "./Reveal";
import { OrangeCat, Sneaker } from "./Stickers";

/** "A few of our favorite things" — two curved text loops drifting in opposite directions. */
export function Marquee() {
  const forward = favorites.join(" ✦ ");
  const backward = [...favorites].reverse().join(" ✦ ");

  return (
    <section aria-labelledby="favorites-title" className="grain relative overflow-hidden bg-night py-16 text-cream md:py-24">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-gold/10 blur-3xl" />
      <Reveal className="relative px-6 text-center">
        <div className="flex items-end justify-center gap-5" aria-hidden>
          <OrangeCat className="float h-24 w-24 drop-shadow-[0_10px_18px_rgba(0,0,0,0.35)] md:h-32 md:w-32" />
          <Sneaker
            className="float h-20 w-28 drop-shadow-[0_10px_18px_rgba(0,0,0,0.35)] [animation-delay:-3.5s] md:h-28 md:w-40"
          />
        </div>
        <p id="favorites-title" className="eyebrow mt-5 text-gold">
          A few of our favorite things
        </p>
      </Reveal>

      {/* Scaled up on phones so the words stay big; the edges fade out. */}
      <div className="relative mt-6 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <div className="-mx-[45%] md:mx-0">
          <CurvedLoop
            marqueeText={forward}
            separator="✦"
            separatorColor="var(--gold)"
            shape="wave"
            curveAmount={110}
            fontSize={92}
            fontWeight={300}
            speed={1.1}
            scrollBoost={1}
            interactive={false}
            ignoreReducedMotion
            color="var(--cream)"
            className="font-display italic"
          />
        </div>
        <div className="-mx-[45%] -mt-4 md:mx-0 md:-mt-8">
          <CurvedLoop
            marqueeText={backward}
            separator="✦"
            shape="wave"
            curveAmount={-110}
            fontSize={92}
            fontWeight={400}
            speed={0.9}
            direction="right"
            scrollBoost={1}
            interactive={false}
            ignoreReducedMotion
            outline
            color="var(--gold)"
            className="font-display italic"
          />
        </div>
      </div>
    </section>
  );
}
