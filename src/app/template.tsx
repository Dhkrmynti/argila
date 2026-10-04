"use client";

import React, { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

// The first page arrives as server HTML and must be visible before any script runs;
// only later client-side navigations get the page-turn.
let hasHydrated = false;

/* Each route arrives like a page turned in the firing log: a terra rule
   sweeps across, and the sheet settles from a soft focus. */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const animateIn = hasHydrated && !reduce;

  useEffect(() => {
    hasHydrated = true;
  }, []);

  return (
    <>
      {animateIn && (
        <motion.span
          aria-hidden="true"
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: 1, opacity: 0 }}
          transition={{ scaleX: { duration: 0.7, ease }, opacity: { duration: 0.35, delay: 0.6 } }}
          className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-terra-hi origin-left pointer-events-none"
        />
      )}
      {/* transitionEnd clears filter/transform: either would trap the pinned, fixed-position sections */}
      <motion.div
        initial={animateIn ? { opacity: 0, y: 14, filter: "blur(6px)" } : false}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none", transform: "none" } }}
        transition={{ duration: 0.65, ease }}
        className="w-full flex-1 flex flex-col"
      >
        {children}
      </motion.div>
    </>
  );
}
