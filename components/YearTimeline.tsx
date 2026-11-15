"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type KeyboardEvent, type Ref } from "react";

type Props = {
  years: string[];
  year: string;
  onSelect: (year: string) => void;
  /** id of the element whose contents change with the selected year. */
  panelId: string;
  /** The sticky bar itself, so the parent can measure where it sits. */
  ref?: Ref<HTMLDivElement>;
};

/**
 * Year picker styled as a timeline: dots on a line that fills up to the
 * selected year. Spreads across the full width on desktop; on phones it
 * scrolls sideways with soft edge fades and prev/next arrows.
 */
export function YearTimeline({ years, year, onSelect, panelId, ref }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: false, end: false });
  const reduceMotion = useReducedMotion();

  const n = years.length;
  const index = years.indexOf(year);
  const progress = n > 1 ? index / (n - 1) : 0;
  // Stops are equal width, so dot centres sit at (i + 0.5) / n of the track.
  const inset = `${50 / n}%`;

  // Fade an edge only when there is more to scroll on that side.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      setEdges({ start: el.scrollLeft > 2, end: el.scrollLeft < max - 2 });
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  // Keep the selected year centred in the scroller.
  useEffect(() => {
    const el = scrollerRef.current;
    const stop = el?.querySelector<HTMLElement>(`[data-year="${year}"]`);
    if (!el || !stop) return;
    const a = el.getBoundingClientRect();
    const b = stop.getBoundingClientRect();
    el.scrollBy({
      left: b.left + b.width / 2 - (a.left + a.width / 2),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [year, reduceMotion]);

  const go = (i: number) => {
    const next = years[Math.max(0, Math.min(n - 1, i))];
    if (next === year) return;
    onSelect(next);
    return next;
  };

  // Arrow keys / Home / End move between years, like a tab list.
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const target = { ArrowLeft: index - 1, ArrowRight: index + 1, Home: 0, End: n - 1 }[e.key];
    if (target === undefined) return;
    e.preventDefault();
    const next = go(target);
    if (next) scrollerRef.current?.querySelector<HTMLElement>(`[data-year="${next}"]`)?.focus();
  };

  const fade = "2.5rem";
  const mask = `linear-gradient(to right, ${edges.start ? "transparent" : "#000"}, #000 ${fade}, #000 calc(100% - ${fade}), ${
    edges.end ? "transparent" : "#000"
  })`;

  return (
    <div
      ref={ref}
      className="sticky top-[calc(4rem+env(safe-area-inset-top))] z-30 mt-10 border-y border-line bg-paper/90 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-6xl items-center gap-1 px-2 md:gap-3 md:px-8">
        <Arrow dir="prev" disabled={index <= 0} onClick={() => go(index - 1)} />

        {/* layoutScroll keeps the sliding halo in step while this row scrolls */}
        <motion.div
          ref={scrollerRef}
          layoutScroll
          className="no-scrollbar min-w-0 flex-1 snap-x overflow-x-auto"
          style={{ maskImage: mask, WebkitMaskImage: mask }}
        >
          <div
            role="tablist"
            aria-label="Choose a year"
            onKeyDown={onKeyDown}
            className="relative flex w-max py-3 md:w-full"
          >
            {/* The line, and its filled portion up to the selected year */}
            <span
              aria-hidden
              className="absolute top-[calc(1.625rem-1px)] h-0.5 rounded-full bg-ink/10"
              style={{ left: inset, right: inset }}
            />
            <motion.span
              aria-hidden
              className="absolute top-[calc(1.625rem-1px)] h-0.5 origin-left rounded-full bg-linear-to-r from-gold to-rose"
              style={{ left: inset, right: inset }}
              initial={false}
              animate={{ scaleX: progress }}
              transition={{ type: "spring", stiffness: 260, damping: 32 }}
            />

            {years.map((y, i) => {
              const active = i === index;
              const passed = i < index;
              return (
                <button
                  key={y}
                  id={`year-tab-${y}`}
                  data-year={y}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls={panelId}
                  tabIndex={active ? 0 : -1}
                  onClick={() => go(i)}
                  className="group relative flex w-[4.25rem] shrink-0 snap-center flex-col items-center gap-2.5 rounded-xl py-1 outline-offset-0 md:w-auto md:flex-1"
                >
                  <span className="relative grid h-5 w-5 place-items-center">
                    {active ? (
                      <motion.span
                        layoutId="year-halo"
                        className="absolute inset-0 rounded-full bg-rose/15 ring-1 ring-rose/40"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    ) : null}
                    <span
                      className={`relative h-2.5 w-2.5 rounded-full border-2 transition-colors duration-300 ${
                        active
                          ? "border-rose bg-rose"
                          : passed
                            ? "border-gold bg-gold"
                            : "border-ink/20 bg-paper group-hover:border-ink/45"
                      }`}
                    />
                  </span>
                  <span
                    className={`font-display text-[1.05rem] leading-none md:text-lg tabular-nums transition-[color,transform] duration-300 ease-out-soft ${
                      active ? "scale-125 italic text-ink" : "text-ink-soft group-hover:text-ink"
                    }`}
                  >
                    {y}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        <Arrow dir="next" disabled={index >= n - 1} onClick={() => go(index + 1)} />
      </div>
    </div>
  );
}

function Arrow({ dir, disabled, onClick }: { dir: "prev" | "next"; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "Previous year" : "Next year"}
      className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-ink transition hover:bg-ink/5 active:scale-95 disabled:pointer-events-none disabled:opacity-25"
    >
      <svg
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`h-[18px] w-[18px] ${dir === "next" ? "rotate-180" : ""}`}
        aria-hidden
      >
        <path d="M12.5 4.5 7 10l5.5 5.5" />
      </svg>
    </button>
  );
}
