"use client";

import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { storyChapters, wedding } from "@/lib/content";

export function PhotoJourney() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const activeIndex = useTransform(scrollYProgress, (v) => {
    const i = Math.min(
      storyChapters.length - 1,
      Math.floor(v * storyChapters.length),
    );
    return i;
  });

  return (
    <section id="story" ref={ref} className="relative bg-ink">
      <div
        className="h-[calc(var(--chapters)*85vh)]"
        style={
          {
            "--chapters": storyChapters.length,
          } as React.CSSProperties
        }
      >
        <div className="sticky top-0 h-svh overflow-hidden">
          {storyChapters.map((chapter, i) => (
            <ChapterSlide
              key={chapter.src}
              chapter={chapter}
              index={i}
              total={storyChapters.length}
              progress={scrollYProgress}
              reduceMotion={!!reduceMotion}
            />
          ))}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent px-5 pb-10 pt-24 md:px-10">
            <p className="text-xs uppercase tracking-[0.3em] text-paper/60">
              Our story
            </p>
            <ActiveCaption activeIndex={activeIndex} />
            <p className="mt-4 max-w-md text-sm text-paper/55">
              Scroll to float through the years with {wedding.partnerA} &{" "}
              {wedding.partnerB}.
            </p>
          </div>

          <div
            className="absolute right-5 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-2 md:flex"
            aria-hidden
          >
            {storyChapters.map((chapter, i) => (
              <Dot key={chapter.year} index={i} progress={scrollYProgress} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ChapterSlide({
  chapter,
  index,
  total,
  progress,
  reduceMotion,
}: {
  chapter: (typeof storyChapters)[number];
  index: number;
  total: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  reduceMotion: boolean;
}) {
  const start = index / total;
  const end = (index + 1) / total;
  const opacity = useTransform(
    progress,
    [start - 0.04, start + 0.02, end - 0.02, end + 0.04],
    [0, 1, 1, 0],
  );
  const scale = useTransform(
    progress,
    [start, end],
    reduceMotion ? [1, 1] : [1.08, 1],
  );

  return (
    <motion.div
      style={{ opacity, scale }}
      className="absolute inset-0"
    >
      <Image
        src={chapter.src}
        alt={`${chapter.year}: ${chapter.caption}`}
        fill
        priority={index < 2}
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-ink/25" />
    </motion.div>
  );
}

function ActiveCaption({
  activeIndex,
}: {
  activeIndex: ReturnType<typeof useTransform<number, number>>;
}) {
  return (
    <motion.div className="mt-3">
      {storyChapters.map((chapter, i) => (
        <CaptionLine key={chapter.src} chapter={chapter} index={i} activeIndex={activeIndex} />
      ))}
    </motion.div>
  );
}

function CaptionLine({
  chapter,
  index,
  activeIndex,
}: {
  chapter: (typeof storyChapters)[number];
  index: number;
  activeIndex: ReturnType<typeof useTransform<number, number>>;
}) {
  const opacity = useTransform(activeIndex, (v) => (Math.round(v) === index ? 1 : 0));
  const y = useTransform(activeIndex, (v) => (Math.round(v) === index ? 0 : 12));

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute"
    >
      <p className="font-[family-name:var(--font-display)] text-4xl text-paper md:text-6xl">
        {chapter.year}
      </p>
      <p className="mt-2 max-w-lg text-lg text-paper/85 md:text-xl">
        {chapter.caption}
      </p>
    </motion.div>
  );
}

function Dot({
  index,
  progress,
}: {
  index: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const total = storyChapters.length;
  const start = index / total;
  const end = (index + 1) / total;
  const scale = useTransform(progress, [start, (start + end) / 2, end], [1, 1.6, 1]);
  const opacity = useTransform(progress, [start, (start + end) / 2, end], [0.35, 1, 0.35]);

  return (
    <motion.span
      style={{ scale, opacity }}
      className="block h-2 w-2 rounded-full bg-paper"
    />
  );
}
