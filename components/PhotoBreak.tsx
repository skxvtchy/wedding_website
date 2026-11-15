"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import BlurText from "@/components/reactbits/BlurText";

type PhotoBreakProps = {
  src: string;
  caption?: string;
  position?: string;
};

/** Full-bleed parallax photo between sections. */
export function PhotoBreak({ src, caption, position = "center" }: PhotoBreakProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1.05, 1.15]);

  return (
    <section ref={ref} className="relative h-[70svh] overflow-hidden md:h-[85vh]" aria-label={caption || "Photo"}>
      <motion.div style={{ y, scale }} className="parallax absolute inset-[-12%]">
        <Image src={src} alt={caption || ""} fill sizes="100vw" className="object-cover" style={{ objectPosition: position }} />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-night/75 via-night/10 to-transparent" />
      {caption ? (
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-6 pb-10 md:px-8 md:pb-16">
          <BlurText
            text={caption}
            as="p"
            animateBy="words"
            delay={90}
            className="max-w-2xl font-display text-[clamp(2rem,8vw,4rem)] font-light italic leading-[1.05] text-cream"
          />
        </div>
      ) : null}
    </section>
  );
}
