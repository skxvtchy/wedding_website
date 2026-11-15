"use client";

import type { ReactNode } from "react";
import BlurText from "@/components/reactbits/BlurText";
import { Reveal } from "./Reveal";

type Props = {
  eyebrow: string;
  title: string;
  lead?: ReactNode;
  tone?: "light" | "dark";
  align?: "left" | "center";
};

/** Consistent section header: small caps eyebrow, blur-in serif title, lead. */
export function SectionHeading({ eyebrow, title, lead, tone = "light", align = "left" }: Props) {
  const center = align === "center";
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <Reveal>
        <p className={`eyebrow ${tone === "dark" ? "text-gold" : "text-rose"}`}>{eyebrow}</p>
      </Reveal>
      <BlurText
        as="h2"
        text={title}
        animateBy="words"
        delay={80}
        className={`mt-3 font-display text-[clamp(2.4rem,9vw,4.25rem)] font-light italic leading-[1.02] tracking-tight ${
          center ? "justify-center" : ""
        } ${tone === "dark" ? "text-cream" : "text-ink"}`}
      />
      {lead ? (
        <Reveal delay={0.15}>
          <p
            className={`mt-4 text-base leading-relaxed md:text-lg ${
              tone === "dark" ? "text-cream/70" : "text-ink-soft"
            }`}
          >
            {lead}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
