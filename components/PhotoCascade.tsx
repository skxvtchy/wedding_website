"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { photoCascade } from "@/lib/content";
import { Reveal } from "./Reveal";

const layouts = [
  "col-span-2 row-span-2 aspect-[4/5] md:aspect-auto md:min-h-[28rem]",
  "col-span-1 aspect-[3/4]",
  "col-span-1 aspect-square",
  "col-span-2 aspect-[16/10]",
  "col-span-1 aspect-[3/4]",
  "col-span-1 aspect-[4/5]",
  "col-span-2 aspect-[5/3]",
  "col-span-1 aspect-square",
  "col-span-1 aspect-[3/4]",
  "col-span-2 aspect-[16/9]",
  "col-span-1 aspect-[4/5]",
  "col-span-1 aspect-square",
] as const;

export function PhotoCascade() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const drift = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [40, -40]);

  return (
    <section
      id="photos"
      ref={ref}
      className="relative overflow-hidden bg-paper px-4 py-20 md:px-8 md:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-sm uppercase tracking-[0.28em] text-ink-soft">
            Through the years
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl tracking-tight text-ink md:text-6xl">
            More moments, more chaos, more us.
          </h2>
          <p className="mt-4 max-w-xl text-lg text-ink-soft">
            Keep scrolling — the balloon was only the beginning.
          </p>
        </Reveal>

        <motion.div
          style={{ y: drift }}
          className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4"
        >
          {photoCascade.map((src, i) => (
            <Reveal
              key={src}
              delay={Math.min(i * 0.04, 0.28)}
              className={layouts[i % layouts.length]}
            >
              <div className="group relative h-full min-h-[11rem] overflow-hidden md:min-h-[14rem]">
                <Image
                  src={src}
                  alt={`Memory ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
            </Reveal>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
