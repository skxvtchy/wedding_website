"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import BlurText from "@/components/reactbits/BlurText";
import { allPhotos, photosByYear, years } from "@/lib/allPhotos";
import { Lightbox } from "./Lightbox";
import { Reveal } from "./Reveal";

export function Album() {
  const [index, setIndex] = useState<number | null>(null);

  return (
    <>
      <div className="mx-auto max-w-6xl px-5 pt-[calc(6rem+env(safe-area-inset-top))] md:px-8 md:pt-32">
        <Link href="/" className="inline-flex min-h-11 items-center text-sm text-ink-soft transition hover:text-ink">
          ← Back home
        </Link>
        <p className="eyebrow mt-6 text-rose">
          {years[0]} — {years[years.length - 1]}
        </p>
        <BlurText
          as="h1"
          text="The whole album"
          animateBy="words"
          trigger="load"
          className="mt-3 font-display text-[clamp(3rem,12vw,6rem)] font-light italic leading-none tracking-tight text-ink"
        />
        <p className="mt-4 max-w-lg text-ink-soft">
          Every photo we could find — {allPhotos.length} of them. Tap any to view full size.
        </p>
      </div>

      {/* Year jump bar */}
      <nav
        aria-label="Years"
        className="no-scrollbar sticky top-16 z-30 mt-8 flex gap-1 overflow-x-auto border-y border-line bg-paper/90 px-5 py-3 backdrop-blur-xl md:justify-center"
      >
        {years.map((y) => (
          <a
            key={y}
            href={`#y${y}`}
            className="shrink-0 rounded-full px-4 py-2 text-sm font-semibold tabular-nums text-ink-soft transition hover:bg-ink hover:text-cream"
          >
            {y}
          </a>
        ))}
      </nav>

      <div className="mx-auto max-w-6xl px-3 pb-24 md:px-8">
        {years.map((y) => (
          <section key={y} id={`y${y}`} className="scroll-mt-32 pt-14">
            <Reveal>
              <div className="mb-5 flex items-baseline justify-between px-2 md:px-0">
                <h2 className="font-display text-5xl font-light italic text-ink md:text-7xl">{y}</h2>
                <span className="text-sm text-ink-soft">{photosByYear[y].length} photos</span>
              </div>
            </Reveal>
            <div className="columns-2 gap-2 md:columns-3 md:gap-4 lg:columns-4">
              {photosByYear[y].map((p) => {
                const i = allPhotos.indexOf(p);
                return (
                  <button
                    key={p.src}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Open photo from ${y}`}
                    className="group relative mb-2 block w-full overflow-hidden rounded-xl bg-line md:mb-4 md:rounded-2xl"
                    style={{ aspectRatio: `${p.width} / ${p.height}` }}
                  >
                    <Image
                      src={p.src}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <Lightbox photos={allPhotos} index={index} onIndexChange={setIndex} onClose={() => setIndex(null)} />
    </>
  );
}
