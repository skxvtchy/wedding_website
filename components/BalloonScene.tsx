"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { images } from "@/lib/content";

export function BalloonScene() {
  const ref = useRef<HTMLDivElement>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["12%", "-70%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.85, 1], [1, 1, 0.2]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <div ref={ref} className="relative h-[160vh]">
      <div className="sticky top-0 flex h-svh items-end justify-center overflow-hidden md:items-center">
        <motion.div
          style={reduceMotion ? undefined : { y, opacity }}
          className="relative mb-10 w-[min(72vw,380px)] md:mb-0"
        >
          <div className="relative aspect-[1023/1537] w-full">
            <Image
              src={images.balloon}
              alt="Hot air balloon"
              fill
              priority
              className="object-contain drop-shadow-xl"
              sizes="380px"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
