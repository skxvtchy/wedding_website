"use client";

import { motion } from "motion/react";
import { useActionState, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { wedding } from "@/lib/content";
import { unlock } from "./actions";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"] as const;

// Deterministic sparkles so server and client markup match.
const sparkles = Array.from({ length: 16 }, (_, i) => {
  const r = (n: number) => ((Math.sin(i * 7919 + n * 104729) + 1) / 2) % 1;
  return {
    left: `${(r(1) * 100).toFixed(2)}%`,
    top: `${(r(2) * 100).toFixed(2)}%`,
    size: 2 + Math.round(r(3) * 3),
    dur: `${(3 + r(4) * 4).toFixed(2)}s`,
    delay: `${(-r(5) * 5).toFixed(2)}s`,
  };
});

// Where they were headed (from ?next=). The server snapshot keeps hydration in sync.
const noSubscribe = () => () => {};
const readNext = () => new URLSearchParams(window.location.search).get("next") ?? "/";

/** Lock-screen style number pad. Numbers only; submits as soon as every digit is in. */
export function PinGate({ length }: { length: number }) {
  const [state, action, pending] = useActionState(unlock, { error: false, tries: 0 });
  // Typing belongs to an attempt; a new wrong answer starts a fresh, empty entry.
  const [entry, setEntry] = useState({ tries: 0, pin: "" });
  const pin = entry.tries === state.tries ? entry.pin : "";
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const next = useSyncExternalStore(noSubscribe, readNext, () => "/");

  const update = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, length);
    setEntry({ tries: state.tries, pin: digits });
    if (digits.length === length) {
      // Submit once the input has re-rendered with the final digit.
      requestAnimationFrame(() => formRef.current?.requestSubmit());
    }
  };

  const press = (key: (typeof KEYS)[number]) => {
    if (pending || !key) return;
    update(key === "del" ? pin.slice(0, -1) : pin + key);
  };

  // Physical keyboards (the hidden input handles its own typing).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target === inputRef.current || e.metaKey || e.ctrlKey || e.altKey) return;
      if (/^\d$/.test(e.key)) press(e.key as (typeof KEYS)[number]);
      else if (e.key === "Backspace") press("del");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const showError = state.error && pin.length === 0 && !pending;

  return (
    <main className="grain relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-night px-6 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-[calc(2rem+env(safe-area-inset-top))] text-cream">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[30%] h-96 w-[140%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-gold/10 blur-3xl"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {sparkles.map((s, i) => (
          <span
            key={i}
            className="twinkle absolute rounded-full bg-gold-soft shadow-[0_0_10px_3px_rgba(241,217,168,0.5)]"
            style={
              {
                left: s.left,
                top: s.top,
                width: s.size,
                height: s.size,
                "--dur": s.dur,
                "--delay": s.delay,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <motion.div
        className="relative flex w-full max-w-xs flex-col items-center text-center"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="font-script text-5xl leading-none text-gold">
          {wedding.partnerA[0]}&amp;{wedding.partnerB[0]}
        </p>
        <h1 className="mt-3 font-display text-[2.1rem] font-light italic leading-tight">
          <span className="block">{wedding.fullNameA}</span>
          <span className="font-script text-gold">&amp;</span> {wedding.fullNameB}
        </h1>
        <p className="eyebrow mt-2 text-gold-soft/80">
          {wedding.dateShort} · {wedding.venue.city}
        </p>

        <form ref={formRef} action={action} className="mt-[min(2.5rem,5svh)] flex w-full flex-col items-center">
          <label htmlFor="pin" className="text-sm text-cream/70">
            Enter the password from your invitation
          </label>
          <input
            ref={inputRef}
            id="pin"
            name="pin"
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            maxLength={length}
            value={pin}
            onChange={(e) => update(e.target.value)}
            disabled={pending}
            className="sr-only"
          />
          <input type="hidden" name="next" value={next} />

          {/* Dots */}
          <motion.div
            key={state.tries}
            aria-hidden
            className="mt-5 flex gap-4"
            onClick={() => inputRef.current?.focus()}
            animate={state.error ? { x: [0, -14, 12, -9, 6, -3, 0] } : undefined}
            transition={{ duration: 0.5 }}
          >
            {Array.from({ length }, (_, i) => (
              <span
                key={i}
                className={`h-3.5 w-3.5 rounded-full border transition-all duration-200 ${
                  i < pin.length ? "scale-110 border-gold bg-gold" : "border-cream/40"
                } ${pending ? "animate-pulse" : ""}`}
              />
            ))}
          </motion.div>

          <p role="alert" className="mt-3 h-5 text-sm text-blush">
            {showError ? "Not quite — try again." : ""}
          </p>
        </form>

        {/* Keypad */}
        <div className="mt-[min(1.5rem,3svh)] grid grid-cols-3 gap-x-6 gap-y-[min(1rem,2svh)]" role="group" aria-label="Number pad">
          {KEYS.map((key, i) =>
            key === "" ? (
              <span key={i} />
            ) : (
              <button
                key={i}
                type="button"
                onClick={() => press(key)}
                disabled={pending || (key === "del" && pin.length === 0)}
                aria-label={key === "del" ? "Delete" : key}
                className={`grid size-[min(4.5rem,9.5svh)] place-items-center rounded-full transition duration-150 focus-visible:rounded-full! active:scale-95 disabled:opacity-40 ${
                  key === "del"
                    ? "text-cream/70 active:bg-cream/10"
                    : "bg-cream/[0.07] font-display text-3xl font-light ring-1 ring-cream/15 hover:bg-cream/[0.12] active:bg-cream/25"
                }`}
              >
                {key === "del" ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-7 w-7" aria-hidden>
                    <path d="M9 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-6-7 6-7Z" strokeLinejoin="round" />
                    <path d="m12 9.5 5 5m0-5-5 5" strokeLinecap="round" />
                  </svg>
                ) : (
                  key
                )}
              </button>
            ),
          )}
        </div>
      </motion.div>
    </main>
  );
}
