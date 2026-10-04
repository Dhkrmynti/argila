"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useReducedMotionSafe } from "@/components/kiln/useReducedMotionSafe";

// The first page arrives as server HTML and must be visible before any script runs;
// only later client-side navigations fade in.
let hasHydrated = false;

export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotionSafe();
  const animateIn = hasHydrated && !reduce;

  useEffect(() => {
    hasHydrated = true;
  }, []);

  return (
    <motion.div
      initial={animateIn ? { opacity: 0, y: 10 } : false}
      animate={{ opacity: 1, y: 0, transitionEnd: { transform: "none" } }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full flex-1 flex flex-col"
    >
      {children}
    </motion.div>
  );
}
