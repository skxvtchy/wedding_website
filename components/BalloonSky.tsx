"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { images } from "@/lib/content";

type BalloonSpec = {
  left: string;
  size: number;
  delay: number;
  duration: number;
  drift: number;
  blur?: number;
  opacity?: number;
};

// Bigger = closer = faster. Blurred, smaller ones read as far away.
const BALLOONS: BalloonSpec[] = [
  { left: "8%", size: 46, delay: 0.3, duration: 5.2, drift: 18 },
  { left: "70%", size: 30, delay: 0.6, duration: 7.5, drift: -12, blur: 1, opacity: 0.8 },
  { left: "44%", size: 60, delay: 0.9, duration: 5.6, drift: 22 },
  { left: "22%", size: 22, delay: 1.1, duration: 8.5, drift: 10, blur: 1.5, opacity: 0.65 },
  { left: "84%", size: 50, delay: 1.3, duration: 5.4, drift: -20 },
  { left: "58%", size: 26, delay: 1.6, duration: 8, drift: 12, blur: 1, opacity: 0.7 },
  { left: "2%", size: 34, delay: 1.9, duration: 6.5, drift: 16 },
  { left: "34%", size: 40, delay: 2.2, duration: 6, drift: -14 },
  { left: "76%", size: 38, delay: 2.5, duration: 6.2, drift: 14 },
  { left: "14%", size: 28, delay: 2.8, duration: 7.8, drift: -10, blur: 1, opacity: 0.75 },
  { left: "52%", size: 44, delay: 3.1, duration: 5.8, drift: 18 },
  { left: "90%", size: 24, delay: 3.4, duration: 8.2, drift: -8, blur: 1.5, opacity: 0.6 },
];

const TOTAL_MS = Math.max(...BALLOONS.map((b) => b.delay + b.duration)) * 1000 + 300;

/** A one-time launch of heart balloons that float up when the site opens. */
export function BalloonSky() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setDone(true), TOTAL_MS);
    return () => clearTimeout(id);
  }, []);

  if (done) return null;

  return (
    <div aria-hidden className="balloon-sky pointer-events-none fixed inset-0 z-20 overflow-hidden">
      {BALLOONS.map((b, i) => (
        <motion.div
          key={i}
          className="absolute top-full"
          style={{
            left: b.left,
            width: b.size,
            opacity: b.opacity ?? 0.95,
            filter: b.blur ? `blur(${b.blur}px)` : undefined,
          }}
          initial={{ y: 0, x: 0, rotate: 0 }}
          animate={{
            y: "-130lvh",
            x: [0, b.drift, -b.drift * 0.6, b.drift * 0.4],
            rotate: [0, b.drift > 0 ? 6 : -6, b.drift > 0 ? -4 : 4, 0],
          }}
          transition={{
            y: { delay: b.delay, duration: b.duration, ease: [0.33, 0, 0.67, 1] },
            x: { delay: b.delay, duration: b.duration, ease: "easeInOut" },
            rotate: { delay: b.delay, duration: b.duration, ease: "easeInOut" },
          }}
        >
          <Image
            src={images.balloon}
            alt=""
            width={520}
            height={781}
            sizes="64px"
            preload={i === 0}
            className="drop-shadow-[0_8px_12px_rgba(13,20,36,0.3)]"
          />
        </motion.div>
      ))}
    </div>
  );
}
