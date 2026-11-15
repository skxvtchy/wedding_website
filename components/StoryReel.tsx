"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import RotatingText from "@/components/reactbits/RotatingText";
import { rotatingWords, snippets, wedding } from "@/lib/content";
import { Reveal } from "./Reveal";

const IMAGE_MS = 5200;

/**
 * Tap-through "stories" reel. Photos get a slow Ken Burns push so they feel
 * like video; real clips (type: "video") play inline, muted, and advance
 * when they end.
 */
export function StoryReel() {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const held = useRef(false);

  const item = snippets[index];
  const running = inView && !paused;

  const progressRef = useRef(0);

  const go = useCallback((delta: number) => {
    setIndex((i) => (i + delta + snippets.length) % snippets.length);
    progressRef.current = 0;
    setProgress(0);
  }, []);

  const jump = (i: number) => {
    setIndex(i);
    progressRef.current = 0;
    setProgress(0);
  };

  // Play only while visible.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.45 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Timer for photos.
  useEffect(() => {
    if (item.type !== "image" || !running) return;
    let raf = 0;
    let last = performance.now();
    const tick = (t: number) => {
      const dt = t - last;
      last = t;
      progressRef.current += dt / IMAGE_MS;
      if (progressRef.current >= 1) {
        go(1);
        return;
      }
      setProgress(progressRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [item.type, running, index, go]);

  // Videos follow their own clock.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || item.type !== "video") return;
    if (running) v.play().catch(() => {});
    else v.pause();
  }, [running, item.type, index]);

  // Keyboard support when focused.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") go(1);
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === " ") {
      e.preventDefault();
      setPaused((p) => !p);
    }
  };

  const onPointerDown = () => {
    held.current = false;
    holdTimer.current = setTimeout(() => {
      held.current = true;
      setPaused(true);
    }, 220);
  };

  const onPointerUp = (dir: 1 | -1) => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    if (held.current) {
      setPaused(false);
      return;
    }
    go(dir);
  };

  return (
    <section id="story" className="relative overflow-hidden bg-cream px-5 py-20 md:px-8 md:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1fr_minmax(0,24rem)] md:gap-20">
        <div>
          <Reveal>
            <p className="eyebrow text-rose">Our story · in snippets</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-3 font-display text-[clamp(2.4rem,9vw,4.25rem)] font-light italic leading-[1.05] tracking-tight text-ink">
              {2026 - wedding.together.since} years of
              <RotatingText
                texts={[...rotatingWords]}
                effect="blur"
                rotationInterval={2400}
                staggerDuration={0.02}
                splitBy="characters"
                mainClassName="mt-1 flex w-fit overflow-hidden rounded-2xl bg-rose px-3 pb-1 not-italic text-cream md:px-4"
                elementLevelClassName="font-display italic"
              />
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-md text-base leading-relaxed text-ink-soft md:text-lg">
              From high-school hallway selfies to a hot air balloon proposal. Tap through the
              highlights — tap right for next, left for back, and hold to pause.
            </p>
          </Reveal>

          {/* Chapter list (desktop) */}
          <ol className="mt-10 hidden max-w-md md:block">
            {snippets.map((s, i) => (
              <li key={s.src}>
                <button
                  type="button"
                  onClick={() => jump(i)}
                  className={`group flex w-full items-baseline gap-4 border-t border-line py-3 text-left transition-colors ${
                    i === index ? "text-ink" : "text-ink-soft/70 hover:text-ink"
                  }`}
                >
                  <span className={`w-12 text-sm tabular-nums ${i === index ? "text-rose" : ""}`}>
                    {s.year}
                  </span>
                  <span className="font-display text-lg italic">{s.title}</span>
                  {i === index ? (
                    <motion.span layoutId="chapter-dot" className="ml-auto h-1.5 w-1.5 self-center rounded-full bg-rose" />
                  ) : null}
                </button>
              </li>
            ))}
          </ol>
        </div>

        <Reveal y={50}>
          <div
            ref={rootRef}
            tabIndex={0}
            role="region"
            aria-roledescription="carousel"
            aria-label="Story snippets"
            onKeyDown={onKeyDown}
            className="relative mx-auto aspect-[9/16] max-h-[82svh] w-full max-w-[26rem] select-none overflow-hidden rounded-[2rem] bg-night shadow-[0_40px_80px_-30px_rgba(13,20,36,0.55)] ring-1 ring-ink/10"
          >
            <AnimatePresence initial={false}>
              <motion.div
                key={item.src}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                {item.type === "video" ? (
                  <video
                    ref={videoRef}
                    src={item.src}
                    poster={item.poster}
                    muted
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-cover"
                    style={{ objectPosition: item.focus }}
                    onTimeUpdate={(e) => {
                      const v = e.currentTarget;
                      if (v.duration) setProgress(v.currentTime / v.duration);
                    }}
                    onEnded={() => go(1)}
                  />
                ) : (
                  <div
                    className="kenburns absolute inset-0"
                    style={{
                      animationPlayState: running ? "running" : "paused",
                      ["--kb" as string]: `${IMAGE_MS + 800}ms`,
                    }}
                  >
                    <Image
                      src={item.src}
                      alt={`${item.year}: ${item.title}`}
                      fill
                      sizes="(min-width: 768px) 26rem, 92vw"
                      className="object-cover"
                      style={{ objectPosition: item.focus }}
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Preload next image */}
            {snippets[(index + 1) % snippets.length].type === "image" ? (
              <Image
                src={snippets[(index + 1) % snippets.length].src}
                alt=""
                width={10}
                height={10}
                sizes="(min-width: 768px) 26rem, 92vw"
                className="pointer-events-none absolute h-px w-px opacity-0"
                aria-hidden
              />
            ) : null}

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-night/60 via-transparent to-night/85" />

            {/* Progress bars */}
            <div className="absolute inset-x-3 top-3 flex gap-1">
              {snippets.map((s, i) => (
                <div key={s.src} className="h-[3px] flex-1 overflow-hidden rounded-full bg-cream/30">
                  <div
                    className="h-full rounded-full bg-cream"
                    style={{
                      width: `${i < index ? 100 : i === index ? progress * 100 : 0}%`,
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="pointer-events-none absolute inset-x-4 top-7 flex items-center justify-between text-cream">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cream/15 font-script text-lg ring-1 ring-cream/40 backdrop-blur">
                  J
                </span>
                <span className="text-xs font-semibold">
                  {wedding.partnerA.toLowerCase()}.and.{wedding.partnerB.toLowerCase()}
                </span>
                <span className="text-xs text-cream/60">{item.year}</span>
              </div>
              {paused ? <span className="text-[0.65rem] uppercase tracking-widest text-cream/80">Paused</span> : null}
            </div>

            {/* Caption */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 p-6 text-cream">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={item.src}
                  initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -8, filter: "blur(8px)" }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="font-display text-6xl font-light italic leading-none text-gold-soft">
                    {item.year}
                  </p>
                  <p className="mt-3 font-display text-2xl">{item.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-cream/80">{item.caption}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Tap zones */}
            <button
              type="button"
              aria-label="Previous snippet"
              className="absolute inset-y-0 left-0 w-1/3 cursor-w-resize focus:outline-none"
              onPointerDown={onPointerDown}
              onPointerUp={() => onPointerUp(-1)}
              onPointerLeave={() => holdTimer.current && clearTimeout(holdTimer.current)}
              onContextMenu={(e) => e.preventDefault()}
            />
            <button
              type="button"
              aria-label="Next snippet"
              className="absolute inset-y-0 right-0 w-2/3 cursor-e-resize focus:outline-none"
              onPointerDown={onPointerDown}
              onPointerUp={() => onPointerUp(1)}
              onPointerLeave={() => holdTimer.current && clearTimeout(holdTimer.current)}
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
