"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Layer5Emblem } from "./Layer5Emblem";

export interface Layer5WatermarkProps {
  className?: string;
}

export type KawaWatermarkProps = Layer5WatermarkProps;

export const Layer5Watermark: React.FC<Layer5WatermarkProps> = ({ className = "" }) => {
  const { scrollYProgress } = useScroll();

  // Subtle rotation and scale tied directly to overall document scroll progress
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 30]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 1.1]);

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none flex items-center justify-center overflow-hidden select-none z-0 ${className}`}
      style={{
        maskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 75%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 75%)",
      }}
    >
      <motion.div
        style={{ rotate, scale }}
        className="w-[700px] h-[700px] sm:w-[900px] sm:h-[900px] lg:w-[1100px] lg:h-[1100px] text-black opacity-[0.025] shrink-0"
      >
        <Layer5Emblem
          size="100%"
          animate={false}
          className="w-full h-full"
        />
      </motion.div>
    </div>
  );
};

export const ArgilaWatermark = Layer5Watermark;
export const KawaWatermark = Layer5Watermark;
