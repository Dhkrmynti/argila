"use client";

import React from "react";
import { motion } from "framer-motion";
import { useReducedMotionSafe } from "@/components/kiln/useReducedMotionSafe";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}

/* Rises into place the first time it scrolls into view. */
export const Reveal: React.FC<RevealProps> = ({ children, delay = 0, y = 28, className = "", as = "div" }) => {
  const reduce = useReducedMotionSafe();
  const M = motion[as];
  return (
    <M
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </M>
  );
};

export default Reveal;
