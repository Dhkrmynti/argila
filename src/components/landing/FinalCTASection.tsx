"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { GuillocheRosette } from "@/components/vault/Guilloche";

/* The closing: the potter's wheel swings into view and turns with the scroll. */
export const FinalCTASection: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const rotate = useTransform(scrollYProgress, [0, 1], [-120, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.7, 1]);
  const lift = useTransform(scrollYProgress, [0, 1], [80, 0]);

  return (
    <section ref={ref} className="relative text-paper overflow-hidden">
      <div data-reveal="band" className="band-wave text-terra/30" aria-hidden="true" />
      <div className="relative max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-10 py-28 sm:py-36 lg:py-44 grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">
        <motion.div style={reduce ? undefined : { y: lift }} className="lg:col-span-7 relative z-10">
          <h2 data-reveal="lines" className="font-display font-extrabold text-[3rem] sm:text-[4.5rem] lg:text-[5.75rem] leading-[0.93] text-balance">
            The kiln is lit.
          </h2>
          <p className="mt-8 text-lg sm:text-xl leading-relaxed text-paper-dim max-w-[34rem]">
            Connect a wallet holding USDG on Robinhood Chain, make a deposit, and watch your firing log fill one block at a time.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <Link href="/stake" className="btn btn-paper group !h-14 !px-8 !text-[16px]">
              Make a deposit
              <ArrowUpRight className="w-5 h-5 transition-transform duration-500 ease-vault group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link href="/stats" className="btn btn-line !h-14 !px-8 !text-[16px]">
              Read the kiln report
            </Link>
          </div>
        </motion.div>

        <div className="lg:col-span-5 flex justify-center lg:justify-end" aria-hidden="true">
          <motion.div
            style={reduce ? undefined : { scale }}
            className="relative w-72 h-72 sm:w-96 sm:h-96 lg:w-[30rem] lg:h-[30rem]"
          >
            <motion.div style={reduce ? undefined : { rotate }} className="absolute inset-0">
              <GuillocheRosette className="absolute inset-0 w-full h-full text-terra" />
            </motion.div>
            <div className="absolute inset-[30%] rounded-full bg-ink border border-terra/40" />
            {/* The vessel stays upright while the wheel turns around it */}
            <img
              src="/argila-logo-terra.png"
              alt=""
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[24%] h-[24%] object-contain"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
