"use client";

import Image from "next/image";
import {
  AnimatePresence,
  MotionConfig,
  animate,
  motion,
  useInView,
  useMotionValue,
} from "motion/react";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { rotatingWords, snippets, wedding, type Snippet, type StoryPhoto } from "@/lib/content";
import { Reveal } from "./Reveal";
import { StoryHeadline } from "./StoryHeadline";

/** How long each photo stays on top of the stack. */
const PHOTO_MS = 2800;

const isClip = (src: string) => /\.(mp4|mov|webm)$/i.test(src);

// Hydration-safe: the server (and first client render) assume motion is fine.
const REDUCE_QUERY = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (onChange: () => void) => {
  const mq = window.matchMedia(REDUCE_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};
const usePrefersReducedMotion = () =>
  useSyncExternalStore(subscribeReduced, () => window.matchMedia(REDUCE_QUERY).matches, () => false);

/** Resting pose for a card by its depth in the stack (0 = front). */
const POSES = [
  { x: 0, y: 0, rotate: -2.5, scale: 1 },
  { x: 6, y: -1.5, rotate: 5, scale: 0.97 },
  { x: -6, y: -3, rotate: -7, scale: 0.94 },
  { x: 3, y: -4.5, rotate: 9, scale: 0.91 },
  { x: -2, y: -5.5, rotate: -4, scale: 0.88 },
];
/** Where the front card flies to before it tucks in at the back. */
const OUT = { x: 72, y: -8, rotate: 16, scale: 1 };

/**
 * "Our story" as an animated scrapbook: each chapter is a stack of polaroids
 * that shuffles on its own — the front photo drifts in slowly, flies off,
 * and tucks in behind — then the next chapter is dealt in.
 */
export function StoryReel() {
  const [chapter, setChapter] = useState(0);
  const [step, setStep] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);
  const [playing, setPlaying] = useState<boolean | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const inView = useInView(stageRef, { amount: 0.35 });
  const seen = useInView(stageRef, { amount: 0.2, once: true });
  const reduceMotion = usePrefersReducedMotion();
  /** 0 → 1 across the current chapter. */
  const progress = useMotionValue(0);

  const item = snippets[chapter];
  const count = item.photos.length;
  const isPlaying = playing ?? !reduceMotion;
  const running = inView && isPlaying;

  const goChapter = useCallback(
    (i: number) => {
      clearTimeout(leaveTimer.current);
      setLeaving(null);
      setStep(0);
      setChapter((i + snippets.length) % snippets.length);
      progress.set(0);
    },
    [progress],
  );

  const next = useCallback(() => {
    if (step >= count - 1) {
      goChapter(chapter + 1);
      return;
    }
    setLeaving(step);
    setStep(step + 1);
    progress.set((step + 1) / count);
    clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => setLeaving(null), 380);
  }, [step, count, chapter, goChapter, progress]);

  useEffect(() => () => clearTimeout(leaveTimer.current), []);

  // Advance on a clock while visible; pausing keeps the spot.
  useEffect(() => {
    if (!running) return;
    const target = (step + 1) / count;
    const remaining = Math.max(0, target - progress.get()) * count * PHOTO_MS;
    const controls = animate(progress, target, {
      duration: remaining / 1000,
      ease: "linear",
      onComplete: next,
    });
    return () => controls.stop();
  }, [running, step, count, chapter, next, progress]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === "ArrowRight") goChapter(chapter + 1);
    if (e.key === "ArrowLeft") goChapter(chapter - 1);
  };

  const nextChapter = snippets[(chapter + 1) % snippets.length];

  return (
    <MotionConfig reducedMotion="user">
      <section id="story" className="relative overflow-hidden bg-cream px-5 py-20 md:px-8 md:py-32">
        <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-2 md:gap-16">
          <div>
            <Reveal>
              <p className="eyebrow text-rose">Our story · in snippets</p>
            </Reveal>
            <Reveal delay={0.05}>
              <StoryHeadline years={wedding.yearsTogether} words={rotatingWords} />
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-md text-base leading-relaxed text-ink-soft md:text-lg">
                From high-school hallway selfies to a hot air balloon proposal. The photos flip
                themselves — tap the stack to flip faster, or jump to any chapter.
              </p>
            </Reveal>

            {/* Chapter list (desktop) */}
            <ol className="mt-10 hidden max-w-md md:block">
              {snippets.map((s, i) => (
                <li key={s.title}>
                  <button
                    type="button"
                    onClick={() => goChapter(i)}
                    aria-current={i === chapter ? "step" : undefined}
                    className={`group relative flex w-full items-center gap-4 py-3 text-left transition-colors ${
                      i === chapter ? "text-ink" : "text-ink-soft/70 hover:text-ink"
                    }`}
                  >
                    <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-line" />
                    {i === chapter ? (
                      <motion.span
                        aria-hidden
                        className="absolute inset-x-0 top-0 h-px origin-left bg-rose"
                        style={{ scaleX: progress }}
                      />
                    ) : null}
                    <span className={`w-12 text-sm tabular-nums ${i === chapter ? "text-rose" : ""}`}>{s.year}</span>
                    <span className="font-display text-lg italic">{s.title}</span>
                    <span className="ml-auto flex items-center">
                      {s.photos.slice(0, 3).map((p, j) => (
                        <span
                          key={p.src}
                          className={`relative -ml-2 h-7 w-7 overflow-hidden rounded-full ring-2 ring-cream transition duration-300 first:ml-0 ${
                            i === chapter ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                          }`}
                          style={{ zIndex: 3 - j }}
                        >
                          <Image src={p.src} alt="" fill sizes="28px" className="object-cover" />
                        </span>
                      ))}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </div>

          {/* The stage */}
          <div
            ref={stageRef}
            role="region"
            aria-roledescription="carousel"
            aria-label="Our story in photos"
            tabIndex={0}
            onKeyDown={onKeyDown}
            className="relative flex flex-col items-center rounded-3xl outline-offset-8"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-[42%] -z-0 h-[120%] w-[140%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,rgba(217,165,76,0.2),rgba(212,80,109,0.07)_55%,transparent)]"
            />

            {/* Chapter progress (phones) */}
            <div className="mb-10 flex w-full max-w-[22rem] gap-1 md:hidden" aria-hidden>
              {snippets.map((s, i) => (
                <span key={s.title} className="h-[3px] flex-1 overflow-hidden rounded-full bg-ink/10">
                  {i < chapter ? <span className="block h-full w-full bg-rose" /> : null}
                  {i === chapter ? (
                    <motion.span className="block h-full w-full origin-left bg-rose" style={{ scaleX: progress }} />
                  ) : null}
                </span>
              ))}
            </div>

            <div className="relative aspect-[4/5] w-[min(74vw,21rem)] md:w-[min(100%,23rem)]">
              {seen ? (
                <AnimatePresence initial={false}>
                  <motion.div
                    key={chapter}
                    className="absolute inset-0"
                    initial={{ opacity: 0, y: 70, rotate: chapter % 2 ? 6 : -6 }}
                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                    exit={{ opacity: 0, y: -40, x: chapter % 2 ? 60 : -60, rotate: chapter % 2 ? 10 : -10 }}
                    transition={{ type: "spring", stiffness: 140, damping: 20 }}
                  >
                    {item.photos.map((photo, i) => {
                      const depth = (i - step + count) % count;
                      return (
                        <Card
                          key={photo.src}
                          photo={photo}
                          item={item}
                          depth={depth}
                          count={count}
                          flying={leaving === i}
                          mirror={chapter % 2 ? -1 : 1}
                        />
                      );
                    })}
                  </motion.div>
                </AnimatePresence>
              ) : null}

              <button
                type="button"
                onClick={next}
                aria-label="Next photo"
                className="absolute inset-0 z-20 cursor-pointer rounded-md focus:outline-none"
              />

              {/* Preload the next chapter */}
              {nextChapter.photos.slice(0, 2).map((p) =>
                isClip(p.src) ? null : (
                  <Image
                    key={p.src}
                    src={p.src}
                    alt=""
                    width={10}
                    height={10}
                    sizes="(min-width: 768px) 23rem, 74vw"
                    className="pointer-events-none absolute h-px w-px opacity-0"
                    aria-hidden
                  />
                ),
              )}
            </div>

            {/* Caption */}
            <div className="relative mt-10 min-h-[7rem] w-full max-w-sm text-center" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={chapter}
                  initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="font-display text-5xl font-light italic leading-none text-rose">
                    {item.year}
                  </p>
                  <p className="mt-3 text-base leading-relaxed text-ink-soft">{item.caption}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="mt-4 flex items-center gap-2">
              <span aria-hidden className="mr-2 w-14" />
              <ControlButton label="Previous chapter" onClick={() => goChapter(chapter - 1)}>
                <path d="M12.5 4.5 7 10l5.5 5.5" />
              </ControlButton>
              <ControlButton
                label={isPlaying ? "Pause" : "Play"}
                onClick={() => setPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <path d="M7.5 5v10M12.5 5v10" />
                ) : (
                  <path d="M7 4.8v10.4a.5.5 0 0 0 .77.42l8-5.2a.5.5 0 0 0 0-.84l-8-5.2A.5.5 0 0 0 7 4.8Z" />
                )}
              </ControlButton>
              <ControlButton label="Next chapter" onClick={() => goChapter(chapter + 1)}>
                <path d="M7.5 4.5 13 10l-5.5 5.5" />
              </ControlButton>
              <span className="ml-2 w-14 text-xs tabular-nums text-ink-soft">
                {String(chapter + 1).padStart(2, "0")} / {String(snippets.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}

function Card({
  photo,
  item,
  depth,
  count,
  flying,
  mirror,
}: {
  photo: StoryPhoto;
  item: Snippet;
  depth: number;
  count: number;
  flying: boolean;
  mirror: 1 | -1;
}) {
  const pose = flying ? OUT : POSES[Math.min(depth, POSES.length - 1)];
  const front = depth === 0 && !flying;

  return (
    <motion.div
      className="absolute inset-0"
      style={{ zIndex: flying ? count + 1 : count - depth }}
      // Dealt from a squared-up pile, then fanned out.
      initial={{ x: "0%", y: "0%", rotate: 0, scale: 0.96 }}
      animate={{
        x: `${pose.x * mirror}%`,
        y: `${pose.y}%`,
        rotate: pose.rotate * mirror,
        scale: pose.scale,
      }}
      transition={{ type: "spring", stiffness: flying ? 260 : 190, damping: flying ? 26 : 22 }}
    >
      <div className="absolute inset-0 flex flex-col rounded-[6px] bg-paper p-2.5 shadow-[0_28px_50px_-24px_rgba(28,24,20,0.55),0_2px_6px_rgba(28,24,20,0.08)] ring-1 ring-ink/5 md:p-3">
        {/* washi tape, only on the card in front */}
        <span
          aria-hidden
          className={`absolute -top-3 left-1/2 z-10 h-6 w-20 -translate-x-1/2 -rotate-3 bg-[repeating-linear-gradient(-45deg,rgba(241,217,168,0.9)_0_6px,rgba(241,217,168,0.7)_6px_12px)] shadow-[0_1px_2px_rgba(28,24,20,0.12)] transition-opacity duration-300 ${
            front ? "opacity-100" : "opacity-0"
          }`}
        />
        <div className="relative flex-1 overflow-hidden rounded-[3px] bg-line">
          <motion.div
            className="absolute inset-0"
            initial={false}
            animate={{ scale: front ? 1.12 : 1.02 }}
            transition={front ? { duration: PHOTO_MS / 1000 + 0.8, ease: "linear" } : { duration: 0.6 }}
          >
            {isClip(photo.src) ? (
              <video
                src={photo.src}
                muted
                loop
                autoPlay
                playsInline
                className="h-full w-full object-cover"
                style={{ objectPosition: photo.focus }}
              />
            ) : (
              <Image
                src={photo.src}
                alt={front ? `${item.year}: ${item.title}` : ""}
                fill
                sizes="(min-width: 768px) 23rem, 74vw"
                className="object-cover"
                style={{ objectPosition: photo.focus }}
              />
            )}
          </motion.div>
        </div>
        <div className="flex h-12 shrink-0 items-center justify-between gap-3 px-1 md:h-14">
          <span className="truncate font-script text-2xl leading-none text-ink/85 md:text-[1.75rem]">
            {item.title}
          </span>
          <span className="text-[0.65rem] font-semibold tabular-nums tracking-[0.2em] text-ink-soft/80">
            {item.year}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function ControlButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid h-11 w-11 place-items-center rounded-full border border-ink/10 bg-paper/70 text-ink backdrop-blur transition hover:border-ink/25 hover:bg-paper active:scale-95"
    >
      <svg
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-[18px] w-[18px]"
        aria-hidden
      >
        {children}
      </svg>
    </button>
  );
}
