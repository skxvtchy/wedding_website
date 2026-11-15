"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import type { PhotoItem } from "@/lib/allPhotos";

type Props = {
  photos: PhotoItem[];
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
};

export function Lightbox({ photos, index, onIndexChange, onClose }: Props) {
  const [dir, setDir] = useState(0);
  const open = index !== null;
  const current = index ?? 0;

  const step = useCallback(
    (d: number) => {
      setDir(d);
      onIndexChange((current + d + photos.length) % photos.length);
    },
    [current, photos.length, onIndexChange],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, step]);

  const photo = photos[current];

  return (
    <AnimatePresence>
      {open && photo ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          className="fixed inset-0 z-[60] flex flex-col bg-night/95 text-cream backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between px-4 pt-[calc(0.75rem+env(safe-area-inset-top))] md:px-8">
            <p className="text-sm tabular-nums text-cream/70">
              <span className="font-display text-lg italic text-gold-soft">{photo.year}</span>
              <span className="mx-2 text-cream/30">·</span>
              {current + 1} / {photos.length}
            </p>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close photo viewer"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-cream/10 text-xl transition hover:bg-cream/20"
            >
              ✕
            </button>
          </div>

          <div className="relative flex-1 overflow-hidden">
            <AnimatePresence initial={false} custom={dir} mode="popLayout">
              <motion.div
                key={photo.src}
                custom={dir}
                className="absolute inset-0 touch-pan-y"
                initial={{ x: dir >= 0 ? "40%" : "-40%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: dir >= 0 ? "-40%" : "40%", opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60 || info.velocity.x < -400) step(1);
                  else if (info.offset.x > 60 || info.velocity.x > 400) step(-1);
                }}
              >
                <Image
                  src={photo.src}
                  alt={`Photo from ${photo.year}`}
                  fill
                  sizes="100vw"
                  draggable={false}
                  className="pointer-events-none object-contain p-2 md:p-10"
                />
              </motion.div>
            </AnimatePresence>

            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous photo"
              className="absolute left-4 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-cream/10 text-xl transition hover:bg-cream/20 md:flex"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next photo"
              className="absolute right-4 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-cream/10 text-xl transition hover:bg-cream/20 md:flex"
            >
              →
            </button>
          </div>

          <p className="pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 text-center text-xs text-cream/40 md:hidden">
            Swipe to browse
          </p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
