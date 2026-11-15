"use client";

import CurvedLoop from "@/components/reactbits/CurvedLoop";
import { places } from "@/lib/content";
import { Reveal } from "./Reveal";

/** "Places we've floated" — two curved text loops drifting in opposite directions. */
export function Marquee() {
  const forward = places.join(" ✦ ");
  const backward = [...places].reverse().join(" ✦ ");

  return (
    <section aria-labelledby="places-title" className="grain relative overflow-hidden bg-night py-16 text-cream md:py-24">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-gold/10 blur-3xl" />
      <Reveal className="relative px-6 text-center">
        <p id="places-title" className="eyebrow text-gold">
          Places we&apos;ve floated together
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
            outline
            color="var(--gold)"
            className="font-display italic"
          />
        </div>
      </div>
    </section>
  );
}
