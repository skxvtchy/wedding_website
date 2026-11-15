"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

type PhotoBreakProps = {
  src: string;
  caption?: string;
  tall?: boolean;
};

export function PhotoBreak({ src, caption, tall = false }: PhotoBreakProps) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? ["0%", "0%"] : ["-12%", "12%"],
  );

  return (
    <section
      ref={ref}
      className={`relative overflow-hidden ${tall ? "h-[75vh]" : "h-[55vh]"}`}
      aria-label={caption || "Photo"}
    >
      <motion.div style={{ y }} className="absolute inset-[-18%]">
        <Image
          src={src}
          alt={caption || ""}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-ink/20" />
      {caption ? (
        <div className="absolute inset-x-0 bottom-0 px-5 pb-8 md:px-10">
          <p className="font-[family-name:var(--font-display)] text-2xl text-paper md:text-4xl">
            {caption}
          </p>
        </div>
      ) : null}
    </section>
  );
}
