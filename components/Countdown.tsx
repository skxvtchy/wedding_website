"use client";

import { AnimatePresence, motion } from "motion/react";
import { useSyncExternalStore } from "react";
import CountUp from "@/components/reactbits/CountUp";
import { stats, wedding } from "@/lib/content";
import { Reveal } from "./Reveal";

const target = new Date(wedding.dateISO).getTime();

// A once-per-second clock; the server snapshot is null so markup stays static.
function subscribeToClock(onTick: () => void) {
  const id = setInterval(onTick, 1000);
  return () => clearInterval(id);
}
const readClock = () => Math.floor(Date.now() / 1000);

function parts(ms: number) {
  const s = Math.floor(Math.abs(ms) / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

function Unit({ value, label }: { value: number; label: string }) {
  const text = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center">
      <div className="relative flex h-[4.5rem] w-full items-center justify-center overflow-hidden rounded-2xl bg-cream/[0.06] ring-1 ring-cream/10 md:h-24">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={text}
            initial={{ y: "70%", opacity: 0, filter: "blur(6px)" }}
            animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
            exit={{ y: "-70%", opacity: 0, filter: "blur(6px)" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-4xl tabular-nums text-cream md:text-5xl"
          >
            {text}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="eyebrow mt-2 text-[0.6rem] text-cream/50">{label}</span>
    </div>
  );
}

export function Countdown() {
  const now = useSyncExternalStore(subscribeToClock, readClock, () => null);
  const diff = now === null ? null : target - now * 1000;
  const past = diff !== null && diff < 0;
  const p = diff === null ? null : parts(diff);

  return (
    <section aria-label="Countdown" className="relative bg-night px-5 pb-20 pt-16 text-cream md:px-8 md:pb-28">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <p className="eyebrow text-gold">{past ? "Happily married for" : "Counting down"}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mx-auto mt-6 grid max-w-md grid-cols-4 gap-2.5 md:max-w-xl md:gap-4">
            <Unit value={p?.days ?? 0} label="Days" />
            <Unit value={p?.hours ?? 0} label="Hours" />
            <Unit value={p?.minutes ?? 0} label="Min" />
            <Unit value={p?.seconds ?? 0} label="Sec" />
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-6 text-sm text-cream/60">
            {past ? `Since ${wedding.date} — and counting.` : `Until ${wedding.date}.`}
          </p>
        </Reveal>

        <dl className="mt-16 grid grid-cols-2 gap-x-4 gap-y-10 border-t border-cream/10 pt-12 md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <CountUp
                  to={s.value}
                  duration={2.2}
                  mode="roll"
                  className="font-display text-5xl font-light italic text-gold md:text-6xl"
                />
                <p className="mt-2 text-sm text-cream/60">{s.label}</p>
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
