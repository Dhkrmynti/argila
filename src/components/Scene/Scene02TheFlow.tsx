"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export const Scene02TheFlow: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Stage 1: STAKE
  const opacityStake = useTransform(scrollYProgress, [0.0, 0.08, 0.22, 0.28], [0, 1, 1, 0]);
  const yStake = useTransform(scrollYProgress, [0.0, 0.08, 0.22, 0.28], [24, 0, 0, -24]);

  // Stage 2: FLOW
  const opacityFlow = useTransform(scrollYProgress, [0.25, 0.33, 0.47, 0.53], [0, 1, 1, 0]);
  const yFlow = useTransform(scrollYProgress, [0.25, 0.33, 0.47, 0.53], [24, 0, 0, -24]);

  // Stage 3: GROW
  const opacityGrow = useTransform(scrollYProgress, [0.50, 0.58, 0.72, 0.78], [0, 1, 1, 0]);
  const yGrow = useTransform(scrollYProgress, [0.50, 0.58, 0.72, 0.78], [24, 0, 0, -24]);

  // Stage 4: REWARD
  const opacityReward = useTransform(scrollYProgress, [0.75, 0.83, 0.95, 1.0], [0, 1, 1, 0]);
  const yReward = useTransform(scrollYProgress, [0.75, 0.83, 0.95, 1.0], [24, 0, 0, -24]);

  // Progress bar indicator
  const progressScale = useTransform(scrollYProgress, [0, 1], [0.1, 1]);

  return (
    <section
      id="the-flow"
      ref={containerRef}
      className="relative w-full h-[350vh]"
    >
      {/* Pinned Sticky Viewport */}
      <div className="sticky top-0 w-full h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* Fixed Title & Context */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-light tracking-[0.2em] text-white uppercase">
            CONTINUOUS <span className="text-[#c8f53c]">VALUE</span>
          </h2>
        </div>

        {/* Dynamic Stage Display (Pinned Centered Stack) */}
        <div className="relative w-full max-w-md h-40 flex items-center justify-center">
          {/* Stage 1: STAKE USDG */}
          <motion.div
            style={{ opacity: opacityStake, y: yStake }}
            className="absolute inset-0 flex flex-col items-center justify-center space-y-2 select-none"
          >
            <div className="text-4xl sm:text-6xl font-light tracking-[0.25em] text-white uppercase font-mono">
              STAKE USDG
            </div>
            <div className="text-xs font-mono tracking-[0.25em] text-[#8e95a2] uppercase max-w-xs">
              COMMIT USDG TO SMART CONTRACT
            </div>
          </motion.div>

          {/* Stage 2: FLOW */}
          <motion.div
            style={{ opacity: opacityFlow, y: yFlow }}
            className="absolute inset-0 flex flex-col items-center justify-center space-y-2 select-none"
          >
            <div className="text-4xl sm:text-6xl font-light tracking-[0.25em] text-white uppercase font-mono">
              FLOW
            </div>
            <div className="text-xs font-mono tracking-[0.25em] text-[#8e95a2] uppercase max-w-xs">
              ENTER CONTINUOUS LIQUIDITY STREAM
            </div>
          </motion.div>

          {/* Stage 3: GROW */}
          <motion.div
            style={{ opacity: opacityGrow, y: yGrow }}
            className="absolute inset-0 flex flex-col items-center justify-center space-y-2 select-none"
          >
            <div className="text-4xl sm:text-6xl font-light tracking-[0.25em] text-[#c8f53c] uppercase font-mono">
              GROW
            </div>
            <div className="text-xs font-mono tracking-[0.25em] text-[#8e95a2] uppercase max-w-xs">
              ARGL REWARDS ACCUMULATE
            </div>
          </motion.div>

          {/* Stage 4: REWARD */}
          <motion.div
            style={{ opacity: opacityReward, y: yReward }}
            className="absolute inset-0 flex flex-col items-center justify-center space-y-2 select-none"
          >
            <div className="text-4xl sm:text-6xl font-light tracking-[0.25em] text-white uppercase font-mono">
              REWARD
            </div>
            <div className="text-xs font-mono tracking-[0.25em] text-[#8e95a2] uppercase max-w-xs">
              CLAIM HARVESTED ARGL TOKENS
            </div>
          </motion.div>
        </div>

        {/* Subtle Step Tracker & Indicator */}
        <div className="mt-12 flex flex-col items-center space-y-3">
          <div className="w-32 h-[2px] bg-neutral-800 relative overflow-hidden rounded-full">
            <motion.div
              style={{ scaleX: progressScale }}
              className="absolute inset-0 bg-[#c8f53c] origin-left shadow-[0_0_6px_#c8f53c]"
            />
          </div>
          <div className="text-[10px] font-mono tracking-[0.3em] text-neutral-500 uppercase">
            SCROLL TO ADVANCE SEQUENCE
          </div>
        </div>
      </div>
    </section>
  );
};
