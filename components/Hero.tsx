"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import BlurText from "@/components/reactbits/BlurText";
import CircularText from "@/components/reactbits/CircularText";
import { images, wedding } from "@/lib/content";

// Deterministic "lantern" sparkles so server and client markup match.
const sparkles = Array.from({ length: 22 }, (_, i) => {
  const r = (n: number) => ((Math.sin(i * 9301 + n * 49297) + 1) / 2) % 1;
  return {
    left: `${(r(1) * 100).toFixed(2)}%`,
    top: `${(r(2) * 55).toFixed(2)}%`,
    size: 2 + Math.round(r(3) * 4),
    dur: `${(3 + r(4) * 4).toFixed(2)}s`,
    delay: `${(-r(5) * 5).toFixed(2)}s`,
  };
});

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      id="top"
      className="grain relative isolate flex min-h-[100svh] overflow-hidden bg-night text-cream"
    >
      {/* Photo: full-bleed on phones, an arched frame on larger screens */}
      <div className="absolute inset-0 -z-10 md:inset-auto md:right-[6%] md:top-1/2 md:h-[min(78vh,46rem)] md:w-[min(36vw,34rem)] md:-translate-y-1/2">
      <motion.div style={{ y: imgY }} className="parallax h-full w-full">
        <motion.div
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-full w-full overflow-hidden md:rounded-t-full md:shadow-[0_40px_120px_-20px_rgba(217,165,76,0.35)] md:ring-1 md:ring-gold/30"
        >
          <Image
            src={images.hero}
            alt={`${wedding.partnerA} and ${wedding.partnerB} sharing a kiss under a sky of floating lanterns`}
            fill
            preload
            sizes="(min-width: 768px) 36vw, 100vw"
            className="object-cover object-[55%_70%]"
          />
        </motion.div>
      </motion.div>
      </div>

      {/* Readability gradients (phone) */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-night/85 via-night/10 to-night/90 md:hidden" />
      <div className="pointer-events-none absolute inset-0 -z-10 hidden bg-[radial-gradient(ellipse_at_70%_50%,rgba(217,165,76,0.12),transparent_60%)] md:block" />

      {/* Lantern sparkles */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {sparkles.map((s, i) => (
          <span
            key={i}
            className="twinkle absolute rounded-full bg-gold-soft shadow-[0_0_12px_4px_rgba(241,217,168,0.6)]"
            style={
              {
                left: s.left,
                top: s.top,
                width: s.size,
                height: s.size,
                "--dur": s.dur,
                "--delay": s.delay,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <motion.div
        style={{ y: textY, opacity: fade }}
        className="mx-auto flex w-full max-w-6xl flex-col px-6 pb-[calc(2.5rem+env(safe-area-inset-bottom))] pt-[calc(6.5rem+env(safe-area-inset-top))] md:justify-center md:px-8 md:pt-0"
      >
        <BlurText
          text={wedding.tagline}
          as="p"
          trigger="load"
          delay={90}
          animateBy="words"
          className="eyebrow text-gold-soft"
        />

        <h1 className="mt-5 font-display font-light leading-[0.88] tracking-tight">
          <BlurText
            text={wedding.partnerA}
            as="span"
            trigger="load"
            animateBy="letters"
            delay={70}
            stepDuration={0.45}
            className="text-[clamp(4.25rem,21vw,9.5rem)] italic"
          />
          <span className="flex items-center gap-4">
            <motion.span
              initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.7, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="-mb-3 font-script text-[clamp(4.5rem,22vw,9rem)] leading-none text-gold"
            >
              &amp;
            </motion.span>
            <BlurText
              text={wedding.partnerB}
              as="span"
              trigger="load"
              animateBy="letters"
              delay={90}
              stepDuration={0.45}
              className="text-[clamp(4.25rem,21vw,9.5rem)] italic"
            />
          </span>
        </h1>

        <div className="mt-auto flex items-end justify-between gap-6 md:mt-12 md:max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 1 }}
          >
            <p className="font-display text-2xl md:text-3xl">{wedding.date.split(", ").slice(1).join(", ")}</p>
            <p className="mt-1 text-sm text-cream/70">
              {wedding.venue.name} · {wedding.venue.city}
            </p>
            <a
              href="#story"
              className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-cream px-6 text-sm font-semibold text-night shadow-lg shadow-night/30 transition active:scale-95 md:hover:bg-gold"
            >
              Our story
              <span aria-hidden>↓</span>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            transition={{ delay: 1.6, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="shrink-0"
          >
            <CircularText
              text={`${wedding.dateShort} ✦ ${wedding.partnerA} & ${wedding.partnerB} ✦ `}
              size={112}
              fontSize={11}
              fontWeight={600}
              letterSpacing={2}
              spinDuration={22}
              onHover="speedUp"
              color="var(--gold-soft)"
              className="font-sans"
            >
              <span className="font-script text-3xl text-gold">J&amp;J</span>
            </CircularText>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <div
        aria-hidden
        className="absolute bottom-3 left-1/2 hidden h-10 w-px -translate-x-1/2 overflow-hidden bg-cream/20 md:block"
      >
        <span className="scroll-cue absolute inset-x-0 top-0 h-1/2 bg-gold" />
      </div>
    </section>
  );
}
