"use client";

import React, { useEffect, useRef, useState } from "react";

/*
 * Rolling counter. Each digit is a drum of 0-9 that rolls to its value
 * when the figure enters view, and again whenever the chain reports a new one.
 * The real string is always present for assistive tech.
 *
 * Each digit keeps an invisible copy of itself in the flow, so the figure sits
 * on the same baseline as the text around it (units, neighbouring cells);
 * the drum is laid over that copy and clipped to the same line box.
 */

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const LINE = 1.15; // em: one drum cell, matched to the in-flow copy's line box

export const RollingNumber: React.FC<{ value: string; className?: string }> = ({ value, className = "" }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setArmed(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setArmed(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const chars = value.split("");
  const digitCount = chars.filter((c) => c >= "0" && c <= "9").length;
  let seen = 0;

  return (
    <span ref={ref} className={`relative inline tnum whitespace-nowrap ${className}`}>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true" style={{ lineHeight: LINE }}>
        {chars.map((c, i) => {
          if (c < "0" || c > "9") {
            return (
              <span key={`${i}-${c}`} className="whitespace-pre">
                {c}
              </span>
            );
          }
          const fromRight = digitCount - seen++;
          const d = armed ? Number(c) : 0;
          return (
            <span key={`d-${chars.length - i}`} className="relative inline-block" style={{ lineHeight: LINE }}>
              <span className="invisible">{c}</span>
              <span className="absolute inset-0 overflow-hidden">
                <span
                  className="flex flex-col transition-transform duration-[1100ms] ease-vault motion-reduce:transition-none"
                  style={{
                    transform: `translateY(${-d * LINE}em)`,
                    transitionDelay: `${Math.min(fromRight, 8) * 45}ms`,
                  }}
                >
                  {DIGITS.map((n) => (
                    <span key={n} className="block text-center" style={{ height: `${LINE}em`, lineHeight: LINE }}>
                      {n}
                    </span>
                  ))}
                </span>
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
};

export default RollingNumber;
