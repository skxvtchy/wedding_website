"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { allPhotos, photosByYear, years } from "@/lib/allPhotos";
import { Lightbox } from "./Lightbox";
import { SectionHeading } from "./SectionHeading";

const PREVIEW = 9;

export function YearsGallery() {
  const [year, setYear] = useState(years[years.length - 1]);
  const [expanded, setExpanded] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const chipsRef = useRef<HTMLDivElement>(null);

  // Keep the selected year chip in view inside the horizontal scroller.
  useEffect(() => {
    const row = chipsRef.current;
    const chip = row?.querySelector<HTMLElement>(`[data-year="${year}"]`);
    if (!row || !chip) return;
    row.scrollTo({ left: chip.offsetLeft - row.clientWidth / 2 + chip.offsetWidth / 2, behavior: "smooth" });
  }, [year]);

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

      {/* Year chips — sticky + horizontally scrollable on phones */}
      <div className="sticky top-16 z-30 mt-10 border-y border-line bg-paper/90 backdrop-blur-xl">
        <div ref={chipsRef} className="no-scrollbar relative mx-auto flex max-w-6xl snap-x gap-1 overflow-x-auto px-5 py-3 md:px-8">
          {years.map((y) => (
            <button
              key={y}
              data-year={y}
              type="button"
              onClick={() => {
                setYear(y);
                setExpanded(false);
              }}
              aria-pressed={y === year}
              className={`relative shrink-0 snap-start rounded-full px-4 py-2 text-sm font-semibold tabular-nums transition-colors ${
                y === year ? "text-cream" : "text-ink-soft hover:text-ink"
              }`}
            >
              {y === year ? (
                <motion.span
                  layoutId="year-pill"
                  className="absolute inset-0 rounded-full bg-ink"
                  transition={{ type: "spring", stiffness: 400, damping: 34 }}
                />
              ) : null}
              <span className="relative">{y}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-6xl px-3 md:px-8">
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
