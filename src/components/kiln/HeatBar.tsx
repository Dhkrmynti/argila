"use client";

import React from "react";
import { motion } from "framer-motion";
import { useReducedMotionSafe } from "@/components/kiln/useReducedMotionSafe";
import { STAGES } from "./stages";

interface HeatBarProps {
  /** Index into STAGES to mark as current; omit to show the scale alone */
  current?: number;
  className?: string;
}

/* The firing scale: the heat ramp with a marker for each stage. */
export const HeatBar: React.FC<HeatBarProps> = ({ current, className = "" }) => {
  const reduce = useReducedMotionSafe();
  const pct = (i: number) => (i / (STAGES.length - 1)) * 100;

  return (
    <div className={className}>
      <div className="relative h-3 rounded-full bg-coal-3 overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-heat rounded-full"
          initial={reduce ? false : { width: 0 }}
          whileInView={{ width: current === undefined ? "100%" : `${Math.max(4, pct(current))}%` }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <ol className="relative mt-4 grid grid-cols-5 gap-2">
        {STAGES.map((s, i) => {
          const active = current === i;
          const passed = current !== undefined && i <= current;
          return (
            <li key={s.key} className={`min-w-0 ${i === 0 ? "text-left" : i === STAGES.length - 1 ? "text-right" : "text-center"}`}>
              <p
                className={`font-display font-semibold text-[13px] sm:text-[15px] truncate ${
                  active ? "text-glow" : passed || current === undefined ? "text-bone" : "text-bone-3"
                }`}
              >
                {s.name}
              </p>
              <p className="font-mono text-[10px] sm:text-[11px] text-bone-3 truncate">{s.window}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default HeatBar;
