"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { useReducedMotionSafe } from "./useReducedMotionSafe";

const COLORS = ["#FFF0D4", "#FFC56E", "#F28C38", "#D9622B"];
const ease = [0.22, 1, 0.36, 1] as const;

const color = (i: number) => COLORS[i % COLORS.length];

/*
 * A one-shot burst of embers from the centre of the parent (which must be
 * positioned). Each change of `burstKey` above 0 fires a new burst. Under
 * reduced motion it becomes a single soft glow pulse in place.
 */
export const EmberBurst: React.FC<{ burstKey: number; count?: number }> = ({ burstKey, count = 14 }) => {
  const reduce = useReducedMotionSafe();
  if (burstKey <= 0) return null;

  if (reduce) {
    return (
      <motion.span
        key={burstKey}
        aria-hidden="true"
        initial={{ opacity: 0.8 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-[-20%] rounded-full pointer-events-none bg-[radial-gradient(closest-side,rgba(255,197,110,0.55),transparent)]"
      />
    );
  }

  return (
    <span key={burstKey} aria-hidden="true" className="absolute inset-0 pointer-events-none">
      {Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2 + (i % 3) * 0.35;
        const dist = 70 + (i % 4) * 22;
        const size = 4 + (i % 3) * 2;
        return (
          <motion.span
            key={i}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist - 30, opacity: 0, scale: 0.3 }}
            transition={{ duration: 0.9 + (i % 4) * 0.1, ease }}
            className="absolute left-1/2 top-1/2 rounded-full"
            style={{ width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2, background: color(i), boxShadow: `0 0 10px ${color(i)}` }}
          />
        );
      })}
    </span>
  );
};

interface Point {
  x: number;
  y: number;
}

/*
 * Embers that fly from one element to another across the page, rendered in a
 * portal so transformed ancestors don't offset them. Each change of
 * `flightKey` above 0 launches a flight from `fromRef` to the first element
 * matching `targetSelector`. Skipped entirely under reduced motion.
 */
export const EmberFlight: React.FC<{
  flightKey: number;
  fromRef: React.RefObject<HTMLElement>;
  targetSelector: string;
  count?: number;
}> = ({ flightKey, fromRef, targetSelector, count = 7 }) => {
  const reduce = useReducedMotionSafe();
  const [path, setPath] = useState<{ from: Point; to: Point } | null>(null);

  useEffect(() => {
    if (flightKey <= 0 || reduce) return;
    const fromEl = fromRef.current;
    const toEl = document.querySelector(targetSelector);
    if (!fromEl || !toEl) return;
    const a = fromEl.getBoundingClientRect();
    const b = toEl.getBoundingClientRect();
    setPath({ from: { x: a.left + a.width * 0.3, y: a.top + a.height / 2 }, to: { x: b.left + b.width / 2, y: b.top + b.height / 2 } });
    const t = setTimeout(() => setPath(null), 1200);
    return () => clearTimeout(t);
  }, [flightKey, reduce, fromRef, targetSelector]);

  if (!path || typeof document === "undefined") return null;

  const dx = path.to.x - path.from.x;
  const dy = path.to.y - path.from.y;

  return createPortal(
    <div aria-hidden="true" className="fixed inset-0 z-[60] pointer-events-none">
      {Array.from({ length: count }, (_, i) => {
        const spread = (i - (count - 1) / 2) * 14;
        const size = 5 + (i % 3) * 2;
        return (
          <motion.span
            key={`${flightKey}-${i}`}
            initial={{ x: 0, y: 0, opacity: 0, scale: 1 }}
            animate={{
              x: [0, dx * 0.4 + spread, dx],
              y: [0, dy * 0.4 - 60 - Math.abs(spread), dy],
              opacity: [0, 1, 0],
              scale: [1, 1.1, 0.4],
            }}
            transition={{ duration: 0.8, delay: i * 0.04, ease }}
            className="absolute rounded-full"
            style={{
              left: path.from.x - size / 2,
              top: path.from.y - size / 2,
              width: size,
              height: size,
              background: color(i),
              boxShadow: `0 0 12px ${color(i)}`,
            }}
          />
        );
      })}
    </div>,
    document.body
  );
};
