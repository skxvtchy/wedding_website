"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { dressCode, faq, schedule, travel, wedding } from "@/lib/content";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function Schedule() {
  return (
    <section id="schedule" className="bg-cream px-5 py-20 md:px-8 md:py-32">
      <div className="mx-auto max-w-3xl">
        <SectionHeading eyebrow={wedding.date} title={schedule.title} lead={schedule.lead} />
        <ol className="relative mt-12 ml-2 border-l border-line md:ml-0">
          {schedule.items.map((item, i) => (
            <li key={item.time} className="relative pb-10 pl-8 last:pb-0 md:pl-10">
              <span className="absolute -left-[7px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-cream bg-rose shadow-[0_0_0_4px_var(--blush)]" />
              <Reveal delay={i * 0.06} className="md:grid md:grid-cols-[8rem_1fr] md:gap-8">
                <time className="eyebrow block text-rose md:pt-1.5">{item.time}</time>
                <div>
                  <p className="mt-1 font-display text-2xl text-ink md:mt-0 md:text-3xl">{item.title}</p>
                  <p className="mt-1 text-ink-soft">{item.detail}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Travel() {
  return (
    <section id="travel" className="bg-paper px-5 py-20 md:px-8 md:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionHeading eyebrow="Venue & parking" title={travel.title} lead={travel.lead} />

        <div className="mt-12 grid gap-4 md:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <div className="relative h-full overflow-hidden rounded-3xl bg-night p-7 text-cream md:p-10">
              <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold/20 blur-3xl" />
              <p className="eyebrow text-gold">The venue</p>
              <p className="mt-3 font-display text-3xl italic md:text-4xl">{wedding.venue.name}</p>
              <p className="mt-2 text-cream/70">{wedding.venue.address}</p>
              <p className="mt-6 text-sm leading-relaxed text-cream/70">{travel.directions}</p>
              <a
                href={wedding.venue.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-gold px-6 text-sm font-semibold text-night transition active:scale-95 md:hover:brightness-110"
              >
                Open in Maps <span aria-hidden>↗</span>
              </a>
            </div>
          </Reveal>
          <div className="grid gap-4">
            {travel.parkingNotes.map((note, i) => (
              <Reveal key={note.title} delay={0.08 * (i + 1)}>
                <div className="rounded-3xl border border-line bg-cream p-6">
                  <p className="font-display text-xl italic text-ink">{note.title}</p>
                  <p className="mt-1 text-sm text-ink-soft">{note.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function DressCode() {
  return (
    <section id="dress-code" className="bg-paper px-5 py-20 md:px-8 md:py-32">
      <div className="mx-auto max-w-3xl">
        <SectionHeading eyebrow="What to wear" title={dressCode.title} lead={dressCode.lead} />
        <Reveal delay={0.1}>
          <ul className="mt-10 flex flex-wrap gap-4">
            {dressCode.palette.map((c, i) => (
              <motion.li
                key={c.hex}
                className="flex flex-col items-center gap-2"
                whileHover={{ y: -6 }}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.07, type: "spring", stiffness: 300, damping: 18 }}
              >
                <span
                  className="h-14 w-14 rounded-full shadow-inner ring-4 ring-paper outline outline-1 outline-line md:h-16 md:w-16"
                  style={{ backgroundColor: c.hex }}
                />
                <span className="text-xs text-ink-soft">{c.name}</span>
              </motion.li>
            ))}
          </ul>
        </Reveal>
        <ul className="mt-10 space-y-3">
          {dressCode.details.map((line, i) => (
            <li key={line}>
              <Reveal delay={0.05 * i} className="flex gap-3 text-ink-soft">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                {line}
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function FaqItem({ q, a, defaultOpen = false }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-line">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-6 py-5 text-left"
      >
        <span className="font-display text-xl text-ink md:text-2xl">{q}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-xl text-rose"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-6 pr-12 leading-relaxed text-ink-soft">{a}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function Faq() {
  return (
    <section id="faq" className="bg-paper px-5 py-20 md:px-8 md:py-32">
      <div className="mx-auto max-w-3xl">
        <SectionHeading eyebrow="Good to know" title="Questions & answers" />
        <Reveal delay={0.1} className="mt-10 border-t border-line">
          {faq.map((item, i) => (
            <FaqItem key={item.q} q={item.q} a={item.a} defaultOpen={i === 0} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
