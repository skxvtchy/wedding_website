"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { images, wedding } from "@/lib/content";
import { PhotoFrame } from "./PhotoFrame";

export function BalloonScene() {
  const ref = useRef<HTMLDivElement>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["8%", "-55%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.75, 1], [1, 1, 0.35]);

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
          className="relative mb-8 w-[min(78vw,420px)] md:mb-0"
        >
          <div className="relative aspect-[1023/1537] w-full">
            <Image
              src={images.balloon}
              alt="Hot air balloon"
              fill
              priority
              className="object-contain drop-shadow-xl"
              sizes="420px"
            />

            <div className="absolute bottom-[7%] left-1/2 flex w-[42%] -translate-x-1/2 items-end justify-center gap-0.5">
              <PhotoFrame
                src={images.jon}
                alt={wedding.partnerA}
                className="h-14 w-14 rounded-full border-[3px] border-white shadow-md md:h-[4.5rem] md:w-[4.5rem]"
                objectPosition="38% 28%"
                sizes="80px"
                priority
              />
              <PhotoFrame
                src={images.partner}
                alt={wedding.partnerB}
                className="h-14 w-14 rounded-full border-[3px] border-white shadow-md md:h-[4.5rem] md:w-[4.5rem]"
                objectPosition="58% 28%"
                sizes="80px"
                priority
              />
            </div>

            <div className="sway absolute top-[48%] left-[2%] w-[12%]">
              <div className="mx-auto mb-1 h-8 w-px bg-ink/40 md:h-10" />
              <Image
                src={images.sole}
                alt=""
                width={56}
                height={98}
                className="mx-auto h-auto w-full drop-shadow"
              />
            </div>

            <div className="sway-delayed absolute top-[46%] right-[1%] w-[20%]">
              <Image
                src={images.shoes}
                alt=""
                width={120}
                height={78}
                className="h-auto w-full drop-shadow"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
