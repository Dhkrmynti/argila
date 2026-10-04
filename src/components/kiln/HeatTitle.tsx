"use client";

import React from "react";
import { motion } from "framer-motion";
import { useReducedMotionSafe } from "./useReducedMotionSafe";

interface HeatTitleProps {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
}

/*
 * Sweeps color from ember to bone on reveal. Children with .text-heat
 * will maintain their own gradient over this effect.
 */
export const HeatTitle: React.FC<HeatTitleProps> = ({ children, className = "", as = "h2" }) => {
  const reduce = useReducedMotionSafe();
  const Component = motion[as];

  if (reduce) {
    return <Component className={className}>{children}</Component>;
  }

  return (
    <Component
      className={className}
      initial={{
        backgroundImage: "linear-gradient(90deg, var(--bone) 45%, var(--ember) 55%, var(--ember) 100%)",
        backgroundSize: "240% 100%",
        backgroundPosition: "100% 0",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        color: "transparent",
      }}
      whileInView={{ backgroundPosition: "0% 0" }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Component>
  );
};
