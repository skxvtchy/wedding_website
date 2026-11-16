"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Cucumber, OrangeCat, Sneaker } from "../Stickers";

type Kind = "shoe" | "gold" | "cuke";
type Item = { kind: Kind; x: number; y: number; vy: number; size: number; rot: number; spin: number; sway: number; phase: number };
type Particle = { x: number; y: number; vx: number; vy: number; life: number; color: string };
type Popup = { x: number; y: number; text: string; life: number; color: string };
type Phase = "ready" | "playing" | "over";

const LIVES = 3;
// Kept from the game's first name so saved best scores carry over.
const BEST_KEY = "kick-catch-best";
const GOLD = "#e2b25c";

// Best score lives in localStorage; the server snapshot keeps hydration in sync.
const bestListeners = new Set<() => void>();
const readBest = () => {
  try {
    return Number(window.localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
};
const writeBest = (value: number) => {
  try {
    window.localStorage.setItem(BEST_KEY, String(value));
  } catch {}
  bestListeners.forEach((l) => l());
};
const subscribeBest = (l: () => void) => {
  bestListeners.add(l);
  window.addEventListener("storage", l);
  return () => {
    bestListeners.delete(l);
    window.removeEventListener("storage", l);
  };
};

// Deterministic stars for the night sky.
const STARS = Array.from({ length: 46 }, (_, i) => {
  const r = (n: number) => ((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1;
  return { x: r(1), y: r(2) * 0.85, s: 0.6 + r(3) * 1.6, p: r(4) * Math.PI * 2 };
});

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Play with Sol: slide Sol the orange cat to catch falling sneakers. Golden pairs
 * are worth 5, catching in a row builds a combo, and cucumbers cost a life.
 */
export function CatGame() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spritesRef = useRef<HTMLDivElement>(null);
  const images = useRef<Partial<Record<"cat" | Kind, HTMLImageElement>>>({});
  const [phase, setPhase] = useState<Phase>("ready");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(LIVES);
  const [combo, setCombo] = useState(1);
  const best = useSyncExternalStore(subscribeBest, readBest, () => 0);
  const [newBest, setNewBest] = useState(false);

  const g = useRef({
    running: false,
    items: [] as Item[],
    particles: [] as Particle[],
    popups: [] as Popup[],
    catX: 0,
    targetX: 0,
    tilt: 0,
    keys: { left: false, right: false },
    t: 0,
    clock: 0,
    spawnIn: 0.6,
    score: 0,
    lives: LIVES,
    streak: 0,
    combo: 1,
    hurt: 0,
    shake: 0,
    w: 0,
    h: 0,
    dpr: 1,
    fonts: { body: "sans-serif", display: "serif" },
  });

  // Turn the SVG stickers into images the canvas can draw.
  useEffect(() => {
    const root = spritesRef.current;
    if (!root) return;
    root.querySelectorAll<HTMLElement>("[data-sprite]").forEach((holder) => {
      const svg = holder.querySelector("svg");
      if (!svg) return;
      const clone = svg.cloneNode(true) as SVGSVGElement;
      const [, , vw, vh] = (svg.getAttribute("viewBox") ?? "0 0 100 100").split(" ").map(Number);
      clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      clone.setAttribute("width", String(vw * 3));
      clone.setAttribute("height", String(vh * 3));
      const img = new Image();
      img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(clone))}`;
      images.current[holder.dataset.sprite as "cat" | Kind] = img;
    });
    const css = getComputedStyle(document.documentElement);
    g.current.fonts = {
      body: css.getPropertyValue("--font-body").trim() || "sans-serif",
      display: css.getPropertyValue("--font-display").trim() || "serif",
    };
  }, []);

  // Keep the canvas sharp and sized to its box.
  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const fit = () => {
      const s = g.current;
      const { width, height } = wrap.getBoundingClientRect();
      s.dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      s.w = width;
      s.h = height;
      canvas.width = Math.round(width * s.dpr);
      canvas.height = Math.round(height * s.dpr);
      if (!s.running) s.catX = s.targetX = width / 2;
      s.catX = Math.min(Math.max(s.catX, 0), width);
      s.targetX = Math.min(Math.max(s.targetX, 0), width);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  const endGame = useCallback(() => {
    const s = g.current;
    s.running = false;
    const record = s.score > readBest();
    if (record) writeBest(s.score);
    setNewBest(record);
    setPhase("over");
  }, []);

  const start = useCallback(() => {
    const s = g.current;
    Object.assign(s, {
      running: true,
      items: [],
      particles: [],
      popups: [],
      t: 0,
      spawnIn: 0.6,
      score: 0,
      lives: LIVES,
      streak: 0,
      combo: 1,
      hurt: 0,
      shake: 0,
      catX: s.w / 2,
      targetX: s.w / 2,
    });
    setScore(0);
    setLives(LIVES);
    setCombo(1);
    setNewBest(false);
    setPhase("playing");
  }, []);

  // Game loop.
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    let raf = 0;
    let last = performance.now();

    const burst = (x: number, y: number, color: string, n: number) => {
      const s = g.current;
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const v = 80 + Math.random() * 220;
        s.particles.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 120, life: 0.7, color });
      }
    };

    const update = (dt: number) => {
      const s = g.current;
      s.clock += dt;
      const catW = Math.min(s.w * 0.24, 116);
      const catH = catW;
      const catY = s.h - catH - Math.max(14, s.h * 0.03);

      // Movement: follow the finger, or the arrow keys.
      const dir = (s.keys.right ? 1 : 0) - (s.keys.left ? 1 : 0);
      if (dir) s.targetX += dir * s.w * 1.25 * dt;
      s.targetX = Math.min(Math.max(s.targetX, catW / 2), s.w - catW / 2);
      const prev = s.catX;
      s.catX += (s.targetX - s.catX) * Math.min(1, dt * 16);
      s.tilt += ((s.catX - prev) / Math.max(dt, 0.001) / 900 - s.tilt) * Math.min(1, dt * 10);
      s.hurt = Math.max(0, s.hurt - dt);
      s.shake = Math.max(0, s.shake - dt);

      if (s.running) {
        s.t += dt;
        const d = Math.min(1, s.t / 80);
        const scale = s.h / 720;
        s.spawnIn -= dt;
        if (s.spawnIn <= 0) {
          s.spawnIn = lerp(0.85, 0.34, d) * (0.75 + Math.random() * 0.5);
          const r = Math.random();
          const kind: Kind = r < 0.07 ? "gold" : r < 0.07 + lerp(0.18, 0.32, d) ? "cuke" : "shoe";
          const size = Math.min(Math.max(s.w * 0.17, 52), 86);
          s.items.push({
            kind,
            size,
            x: size / 2 + Math.random() * (s.w - size),
            y: -size,
            vy: lerp(170, 470, d) * scale * (0.85 + Math.random() * 0.3) * (kind === "gold" ? 1.2 : 1),
            rot: Math.random() * Math.PI * 2,
            spin: (Math.random() - 0.5) * 3,
            sway: 20 + Math.random() * 30,
            phase: Math.random() * Math.PI * 2,
          });
        }

        const zone = { l: s.catX - catW * 0.42, r: s.catX + catW * 0.42, t: catY + catH * 0.05, b: catY + catH * 0.55 };
        for (let i = s.items.length - 1; i >= 0; i--) {
          const it = s.items[i];
          it.y += it.vy * dt;
          it.x += Math.cos(s.t * 2 + it.phase) * it.sway * dt;
          it.rot += it.spin * dt;
          const half = it.size * 0.32;
          const hit = it.x + half > zone.l && it.x - half < zone.r && it.y + half > zone.t && it.y - half < zone.b;
          if (hit) {
            s.items.splice(i, 1);
            if (it.kind === "cuke") {
              s.lives -= 1;
              s.streak = 0;
              s.combo = 1;
              s.hurt = 0.7;
              s.shake = 0.35;
              s.popups.push({ x: it.x, y: catY - 10, text: "Eek!", life: 0.9, color: "#86cc66" });
              burst(it.x, catY, "#86cc66", 10);
              navigator.vibrate?.(80);
              setLives(s.lives);
              setCombo(1);
              if (s.lives <= 0) endGame();
            } else {
              s.streak += 1;
              s.combo = Math.min(5, 1 + Math.floor(s.streak / 5));
              const pts = (it.kind === "gold" ? 5 : 1) * s.combo;
              s.score += pts;
              s.popups.push({ x: it.x, y: catY - 10, text: `+${pts}`, life: 0.8, color: it.kind === "gold" ? GOLD : "#fbf7ef" });
              burst(it.x, catY + catH * 0.2, it.kind === "gold" ? GOLD : "#f1d9a8", it.kind === "gold" ? 18 : 8);
              setScore(s.score);
              setCombo(s.combo);
            }
          } else if (it.y - it.size > s.h) {
            s.items.splice(i, 1);
            if (it.kind !== "cuke" && s.streak > 0) {
              s.streak = 0;
              s.combo = 1;
              setCombo(1);
            }
          }
        }
      }

      for (let i = s.particles.length - 1; i >= 0; i--) {
        const p = s.particles[i];
        p.life -= dt;
        p.vy += 520 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.life <= 0) s.particles.splice(i, 1);
      }
      for (let i = s.popups.length - 1; i >= 0; i--) {
        const p = s.popups[i];
        p.life -= dt;
        p.y -= 60 * dt;
        if (p.life <= 0) s.popups.splice(i, 1);
      }
      return { catW, catH, catY };
    };

    const draw = ({ catW, catH, catY }: { catW: number; catH: number; catY: number }) => {
      const s = g.current;
      const { w, h, dpr } = s;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, "#0d1424");
      sky.addColorStop(1, "#1d2945");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      if (s.shake > 0) {
        const m = s.shake * 18;
        ctx.translate((Math.random() - 0.5) * m, (Math.random() - 0.5) * m);
      }

      for (const st of STARS) {
        ctx.globalAlpha = 0.35 + 0.45 * (0.5 + 0.5 * Math.sin(s.clock * 1.6 + st.p));
        ctx.fillStyle = "#f1d9a8";
        ctx.beginPath();
        ctx.arc(st.x * w, st.y * h, st.s, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // A soft glow and floor under the cat.
      const glow = ctx.createRadialGradient(w / 2, h, 0, w / 2, h, h * 0.55);
      glow.addColorStop(0, "rgba(217,165,76,0.16)");
      glow.addColorStop(1, "rgba(217,165,76,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      const imgs = images.current;
      for (const it of s.items) {
        const img = imgs[it.kind];
        if (!img?.complete) continue;
        const ratio = img.naturalHeight / img.naturalWidth || 0.7;
        ctx.save();
        ctx.translate(it.x, it.y);
        ctx.rotate(it.kind === "cuke" ? it.rot : Math.sin(it.rot) * 0.5);
        if (it.kind === "gold") {
          ctx.shadowColor = "rgba(226,178,92,0.9)";
          ctx.shadowBlur = 18;
        }
        ctx.drawImage(img, -it.size / 2, (-it.size * ratio) / 2, it.size, it.size * ratio);
        ctx.restore();
      }

      // The cat.
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.beginPath();
      ctx.ellipse(s.catX, catY + catH * 0.95, catW * 0.38, catH * 0.06, 0, 0, Math.PI * 2);
      ctx.fill();
      const cat = imgs.cat;
      if (cat?.complete) {
        const bob = s.running ? Math.abs(Math.sin(s.clock * 9)) * 3 : Math.sin(s.clock * 2) * 3;
        ctx.save();
        ctx.translate(s.catX, catY + catH / 2 - bob - (s.hurt > 0.45 ? 14 : 0));
        ctx.rotate(Math.max(-0.25, Math.min(0.25, s.tilt)));
        if (s.hurt > 0) ctx.globalAlpha = Math.sin(s.hurt * 40) > 0 ? 1 : 0.45;
        ctx.drawImage(cat, -catW / 2, -catH / 2, catW, catH);
        ctx.restore();
        ctx.globalAlpha = 1;
      }

      for (const p of s.particles) {
        ctx.globalAlpha = Math.max(0, p.life / 0.7);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.textAlign = "center";
      for (const p of s.popups) {
        ctx.globalAlpha = Math.min(1, p.life * 2);
        ctx.fillStyle = p.color;
        ctx.font = `italic 600 ${Math.round(Math.min(w * 0.08, 34))}px ${s.fonts.display}`;
        ctx.fillText(p.text, p.x, p.y);
      }
      ctx.globalAlpha = 1;
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      draw(update(dt));
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [endGame]);

  // Keyboard: arrows / A-D to move, Space or Enter to start.
  useEffect(() => {
    const set = (e: KeyboardEvent, down: boolean) => {
      const k = e.key.toLowerCase();
      if (k === "arrowleft" || k === "a") g.current.keys.left = down;
      else if (k === "arrowright" || k === "d") g.current.keys.right = down;
      else if (down && (k === " " || k === "enter") && !g.current.running) {
        e.preventDefault();
        start();
        return;
      } else return;
      e.preventDefault();
    };
    const onDown = (e: KeyboardEvent) => set(e, true);
    const onUp = (e: KeyboardEvent) => set(e, false);
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, [start]);

  const follow = (e: React.PointerEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) g.current.targetX = e.clientX - rect.left;
  };

  return (
    <div
      ref={wrapRef}
      className="relative h-full w-full touch-none select-none overflow-hidden overscroll-none"
      onPointerDown={(e) => {
        if (!g.current.running) return;
        (e.target as Element).setPointerCapture?.(e.pointerId);
        follow(e);
      }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || e.buttons || g.current.running) follow(e);
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />

      {/* SVG sources for the canvas sprites */}
      <div ref={spritesRef} hidden>
        <span data-sprite="cat">
          <OrangeCat />
        </span>
        <span data-sprite="shoe">
          <Sneaker />
        </span>
        <span data-sprite="gold">
          <Sneaker accent={GOLD} />
        </span>
        <span data-sprite="cuke">
          <Cucumber />
        </span>
      </div>

      {/* HUD */}
      {phase === "playing" ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4 text-cream">
          <div>
            <p className="eyebrow text-[0.6rem] text-cream/60">Pairs</p>
            <p className="font-display text-4xl italic leading-none tabular-nums" aria-live="polite">
              {score}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <p className="flex gap-1 text-xl" aria-label={`${lives} lives left`}>
              {Array.from({ length: LIVES }, (_, i) => (
                <span key={i} className={i < lives ? "text-rose" : "text-cream/20"}>
                  ♥
                </span>
              ))}
            </p>
            {combo > 1 ? (
              <p className="rounded-full bg-gold px-2.5 py-0.5 text-xs font-bold text-night">x{combo} combo</p>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* Start / game over */}
      {phase !== "playing" ? (
        <div className="absolute inset-0 flex items-center justify-center bg-night/55 p-6 backdrop-blur-[2px]">
          <div className="w-full max-w-xs rounded-3xl bg-night/80 p-7 text-center text-cream ring-1 ring-cream/10">
            {phase === "ready" ? (
              <>
                <div className="flex items-end justify-center gap-3" aria-hidden>
                  <OrangeCat className="h-16 w-16" />
                  <Sneaker className="h-12 w-16" />
                </div>
                <h1 className="mt-4 font-display text-4xl italic">Play with Sol</h1>
                <p className="mt-3 text-sm leading-relaxed text-cream/75">
                  Help Sol catch every sneaker. Golden pairs are worth 5 — and dodge the cucumbers,
                  Sol hates those.
                </p>
                <p className="mt-3 text-xs text-cream/50">Drag to move · or use ← →</p>
              </>
            ) : (
              <>
                <p className="eyebrow text-gold">{newBest ? "New best!" : "Game over"}</p>
                <p className="mt-3 font-display text-6xl italic leading-none tabular-nums">{score}</p>
                <p className="mt-2 text-sm text-cream/70">pairs caught</p>
              </>
            )}
            <button
              type="button"
              onClick={start}
              className="mt-6 h-12 w-full rounded-full bg-gold text-sm font-semibold text-night transition active:scale-95"
            >
              {phase === "ready" ? "Play" : "Play again"}
            </button>
            {best > 0 ? <p className="mt-3 text-xs text-cream/50">Best: {best}</p> : null}
            <Link href="/" className="mt-2 inline-flex min-h-11 items-center text-sm text-cream/70 underline-offset-4 hover:underline">
              Back to the wedding site
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
