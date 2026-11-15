"use client";

import Image from "next/image";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef, useState } from "react";
import { storyChapters, wedding } from "@/lib/content";

export function PhotoJourney() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <section id="story" ref={ref} className="relative scroll-mt-24 bg-ink">
      <div style={{ height: `${storyChapters.length * 85}vh` }}>
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

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent px-5 pb-10 pt-28 md:px-10">
            <p className="text-xs uppercase tracking-[0.3em] text-paper/60">
              Our story
            </p>
            <ActiveCaption progress={scrollYProgress} />
            <p className="mt-4 max-w-md text-sm text-paper/55">
              Keep scrolling to float through the years with {wedding.partnerA}{" "}
              & {wedding.partnerB}.
            </p>
          </div>

          <div
            className="absolute right-5 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-2 md:flex"
            aria-hidden
          >
            {storyChapters.map((chapter, i) => (
              <Dot key={chapter.year + i} index={i} progress={scrollYProgress} />
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
  progress: MotionValue<number>;
  reduceMotion: boolean;
}) {
  const start = index / total;
  const end = (index + 1) / total;
  const opacity = useTransform(
    progress,
    [Math.max(0, start - 0.05), start + 0.03, end - 0.03, Math.min(1, end + 0.05)],
    index === 0 ? [1, 1, 1, 0] : index === total - 1 ? [0, 1, 1, 1] : [0, 1, 1, 0],
  );
  const scale = useTransform(
    progress,
    [start, end],
    reduceMotion ? [1, 1] : [1.1, 1],
  );

  return (
    <motion.div style={{ opacity, scale }} className="absolute inset-0 will-change-transform">
      <Image
        src={chapter.src}
        alt={`${chapter.year}: ${chapter.caption}`}
        fill
        priority={index < 2}
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-ink/20" />
    </motion.div>
  );
}

function ActiveCaption({ progress }: { progress: MotionValue<number> }) {
  const [index, setIndex] = useState(0);

  useMotionValueEvent(progress, "change", (v) => {
    const next = Math.min(
      storyChapters.length - 1,
      Math.floor(v * storyChapters.length),
    );
    setIndex(next);
  });

  const chapter = storyChapters[index];

  return (
    <div className="relative mt-3 min-h-[7.5rem]">
      <p className="font-[family-name:var(--font-display)] text-4xl text-paper md:text-6xl">
        {chapter.year}
      </p>
      <p className="mt-2 max-w-lg text-lg text-paper/85 md:text-xl">
        {chapter.caption}
      </p>
    </div>
  );
}

function Dot({
  index,
  progress,
}: {
  index: number;
  progress: MotionValue<number>;
}) {
  const total = storyChapters.length;
  const start = index / total;
  const end = (index + 1) / total;
  const mid = (start + end) / 2;
  const scale = useTransform(progress, [start, mid, end], [1, 1.7, 1]);
  const opacity = useTransform(progress, [start, mid, end], [0.35, 1, 0.35]);

  return (
    <motion.span
      style={{ scale, opacity }}
      className="block h-2 w-2 rounded-full bg-paper"
    />
  );
}
