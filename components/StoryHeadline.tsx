"use client";

import { AnimatePresence, animate, motion, useInView, useMotionValue, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;
const WORD_MS = 2600;
/** A loose, hand-drawn underline. */
const SWASH = "M3 9.5C40 4 88 2.5 130 5.5c26 1.9 47 4.6 67-.5";

/**
 * "9 years of ___": the number counts up when it comes into view, then the
 * last word rolls through a list — letters rise in one by one while the old
 * word lifts away, and a gold underline draws itself under each new word.
 */
export function StoryHeadline({ years, words }: { years: number; words: readonly string[] }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { amount: 0.6 });
  const seen = useInView(ref, { amount: 0.6, once: true });
  const [index, setIndex] = useState(0);

  const count = useMotionValue(1);
  const shown = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    if (!seen) return;
    const controls = animate(count, years, { duration: 1.4, ease: EASE });
    return () => controls.stop();
  }, [seen, years, count]);

  useEffect(() => {
    if (!inView) return;
    const id = setTimeout(() => setIndex((i) => (i + 1) % words.length), WORD_MS);
    return () => clearTimeout(id);
  }, [inView, index, words.length]);

  const word = words[index];

  return (
    <h2
      ref={ref}
      className="mt-3 font-display text-[clamp(2.6rem,11vw,4.5rem)] font-light italic leading-[1.02] tracking-tight text-ink"
    >
      <span className="sr-only">
        {years} years of {words.join(", ")}
      </span>
      <span aria-hidden className="block">
        <motion.span className="tabular-nums">{shown}</motion.span> years of
      </span>
      <span aria-hidden className="-mb-[0.25em] inline-grid overflow-hidden pb-[0.3em] pl-[0.04em] pr-[0.2em]">
        <AnimatePresence initial={false}>
          <motion.span key={index} className="relative col-start-1 row-start-1 justify-self-start whitespace-nowrap text-rose">
            {Array.from(word).map((ch, i) => (
              <motion.span
                key={i}
                className="inline-block will-change-transform"
                initial={{ y: "110%", rotate: 8, opacity: 0 }}
                animate={{ y: "0%", rotate: 0, opacity: 1 }}
                exit={{ y: "-110%", rotate: -6, opacity: 0, transition: { duration: 0.4, ease: EASE, delay: i * 0.015 } }}
                transition={{ type: "spring", stiffness: 240, damping: 22, delay: 0.08 + i * 0.035 }}
              >
                {ch === " " ? " " : ch}
              </motion.span>
            ))}
            <svg
              viewBox="0 0 200 12"
              preserveAspectRatio="none"
              className="absolute left-0 top-full -mt-[0.04em] h-[0.26em] w-full overflow-visible text-gold"
            >
              <motion.path
                d={SWASH}
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.3 + word.length * 0.035 }}
              />
            </svg>
          </motion.span>
        </AnimatePresence>
      </span>
    </h2>
  );
}
