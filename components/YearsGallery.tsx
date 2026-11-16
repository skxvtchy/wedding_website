"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import { allPhotos, photosByYear, years } from "@/lib/allPhotos";
import { wedding } from "@/lib/content";
import { Lightbox } from "./Lightbox";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { YearTimeline } from "./YearTimeline";

const PREVIEW = 9;

export function YearsGallery() {
  const [year, setYear] = useState(years[years.length - 1]);
  const [expanded, setExpanded] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const selectYear = (y: string) => {
    setYear(y);
    setExpanded(false);
    // If they've scrolled down into a long year, bring the new year's heading
    // back into view instead of leaving them stranded mid-grid.
    const panelTop = panelRef.current?.getBoundingClientRect().top;
    const barBottom = barRef.current?.getBoundingClientRect().bottom;
    if (panelTop !== undefined && barBottom !== undefined && panelTop < barBottom - 1) {
      window.scrollTo({ top: window.scrollY + panelTop - barBottom, behavior: reduceMotion ? "auto" : "smooth" });
    }
  };

  const photos = photosByYear[year];
  const visible = expanded ? photos : photos.slice(0, PREVIEW);

  return (
    <section id="photos" className="relative bg-paper py-20 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Through the years"
          title="More moments, more chaos, more us."
          lead={`${allPhotos.length} photos, ${years.length} years, one very patient camera roll. Pick a year and tap any photo.`}
        />
      </div>

      <YearTimeline ref={barRef} years={years} year={year} onSelect={selectYear} panelId="years-panel" />

      <div
        ref={panelRef}
        id="years-panel"
        role="tabpanel"
        aria-labelledby={`year-tab-${year}`}
        className="mx-auto max-w-6xl px-3 pt-8 md:px-8"
      >
        <div className="mb-5 flex items-baseline justify-between px-2 md:px-0">
          <AnimatePresence mode="wait">
            <motion.p
              key={year}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="font-display text-5xl font-light italic text-ink md:text-7xl"
            >
              {year}
            </motion.p>
          </AnimatePresence>
          <p className="text-sm text-ink-soft">{photos.length} photos</p>
        </div>

        <motion.div layout className="columns-2 gap-2 md:columns-3 md:gap-4">
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => (
              <motion.button
                key={p.src}
                type="button"
                layout
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.5, delay: Math.min(i, 8) * 0.04, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => setLightbox(i)}
                className="group relative mb-2 block w-full overflow-hidden rounded-xl bg-line md:mb-4 md:rounded-2xl"
                style={{ aspectRatio: `${p.width} / ${p.height}` }}
                aria-label={`Open photo ${i + 1} from ${year}`}
              >
                <Image
                  src={p.src}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 33vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          {photos.length > PREVIEW ? (
            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              className="h-12 w-full rounded-full border border-ink/15 px-6 text-sm font-semibold text-ink transition hover:bg-ink hover:text-cream sm:w-auto"
            >
              {expanded ? "Show less" : `Show all ${photos.length} from ${year}`}
            </button>
          ) : null}
          <Link
            href="/album"
            className="flex h-12 w-full items-center justify-center rounded-full bg-ink px-6 text-sm font-semibold text-cream transition hover:bg-rose sm:w-auto"
          >
            Open the full album →
          </Link>
        </div>

        {/* Her last name is Then… */}
        <Reveal className="mx-2 mt-14 md:mx-auto md:max-w-lg">
          <div className="rounded-3xl border border-line bg-cream px-5 py-8 text-center">
            <p className="eyebrow text-rose">Taking photos at the wedding?</p>
            <p className="mt-3 whitespace-nowrap font-display text-[clamp(1.25rem,7vw,2.25rem)] italic leading-tight text-ink">
              {wedding.hashtag}
            </p>
            <p className="mt-2 text-sm text-ink-soft">Tag them so we can find every one.</p>
          </div>
        </Reveal>
      </div>

      <Lightbox
        photos={photos}
        index={lightbox}
        onIndexChange={setLightbox}
        onClose={() => setLightbox(null)}
      />
    </section>
  );
}
