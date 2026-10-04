"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

/*
 * Rubber stamp. Lands with a short overshoot, the way a teller presses one
 * into a passbook, and settles a few degrees off true.
 */

interface StampProps {
  children: React.ReactNode;
  sub?: React.ReactNode;
  tone?: "cobalt" | "ink" | "terra" | "paper";
  tilt?: number;
  /** Press when scrolled into view (default) or immediately on mount */
  trigger?: "view" | "mount";
  delay?: number;
  className?: string;
}

const toneClass = {
  cobalt: "text-cobalt-deep",
  ink: "text-ink",
  terra: "text-terra-hi",
  paper: "text-paper",
};

export const Stamp: React.FC<StampProps> = ({
  children,
  sub,
  tone = "cobalt",
  tilt = -6,
  trigger = "view",
  delay = 0,
  className = "",
}) => {
  const reduce = useReducedMotion();
  const pressed = { opacity: 0.92, scale: 1, rotate: tilt };
  const lifted = reduce ? pressed : { opacity: 0, scale: 1.7, rotate: tilt - 10 };
  const transition = { type: "spring" as const, stiffness: 520, damping: 24, mass: 0.9, delay };

  return (
    <motion.span
      initial={lifted}
      {...(trigger === "view"
        ? { whileInView: pressed, viewport: { once: true, amount: 0.8 } }
        : { animate: pressed })}
      transition={transition}
      className={`inline-flex flex-col items-center justify-center px-3.5 py-1.5 border-[2.5px] border-current outline outline-1 outline-current outline-offset-[3px] font-display font-extrabold uppercase leading-none tracking-[0.04em] select-none mix-blend-multiply ${toneClass[tone]} ${className}`}
      style={{ mixBlendMode: tone === "paper" || tone === "terra" ? "normal" : "multiply" }}
    >
      <span className="text-[0.95em]">{children}</span>
      {sub && <span className="mt-1 font-mono font-medium text-[0.5em] tracking-[0.08em] normal-case">{sub}</span>}
    </motion.span>
  );
};

export default Stamp;
