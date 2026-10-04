"use client";

import React, { useEffect, useRef } from "react";

interface EmbersProps {
  /** Particles per 100k px² of canvas; scaled down on small screens */
  density?: number;
  /** 0 to 1: how hot the sparks burn (speed and brightness) */
  heat?: number;
  className?: string;
}

/* Sparks rising off the kiln. A plain 2D canvas, paused when off screen or hidden. */
export const Embers: React.FC<EmbersProps> = ({ density = 3, heat = 1, className = "" }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    type P = { x: number; y: number; vx: number; vy: number; r: number; life: number; max: number };
    let parts: P[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const spawn = (anywhere = false): P => ({
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : h + 10,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -(0.25 + Math.random() * 0.75) * (0.5 + heat * 0.7),
      r: 0.6 + Math.random() * 1.8,
      life: 0,
      max: 220 + Math.random() * 320,
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(((w * h) / 100000) * density * (w < 640 ? 0.6 : 1));
      parts = Array.from({ length: count }, () => spawn(true));
    };

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        p.life++;
        p.x += p.vx + Math.sin((p.life + i * 13) / 40) * 0.2;
        p.y += p.vy;
        const t = p.life / p.max;
        if (t >= 1 || p.y < -10) {
          parts[i] = spawn();
          continue;
        }
        const fade = t < 0.15 ? t / 0.15 : 1 - (t - 0.15) / 0.85;
        const a = Math.max(0, fade) * (0.35 + heat * 0.55);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        g.addColorStop(0, `rgba(255, 228, 170, ${a})`);
        g.addColorStop(0.35, `rgba(242, 140, 56, ${a * 0.6})`);
        g.addColorStop(1, "rgba(217, 98, 43, 0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
      if (visible) raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(([e]) => {
      const was = visible;
      visible = e.isIntersecting && !document.hidden;
      if (visible && !was) raf = requestAnimationFrame(tick);
    });
    const onVis = () => {
      const was = visible;
      visible = !document.hidden;
      if (visible && !was) raf = requestAnimationFrame(tick);
    };

    resize();
    io.observe(canvas);
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", resize);
    };
  }, [density, heat]);

  return <canvas ref={ref} className={`pointer-events-none ${className}`} aria-hidden="true" />;
};

export default Embers;
