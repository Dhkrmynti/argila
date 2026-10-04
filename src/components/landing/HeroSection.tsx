"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, MotionValue, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ArrowUpRight } from "lucide-react";
import { formatApy, formatTokenAmount } from "@/lib/utils/formatters";
import { GuillocheRosette, MicrMark } from "@/components/vault/Guilloche";
import { RollingNumber } from "@/components/vault/RollingNumber";

interface HeroSectionProps {
  scrollProgress: MotionValue<number>;
  smoothProgress: MotionValue<number>;
  calculatedApy?: number;
  totalStaked?: bigint;
  stakeDecimals?: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  smoothProgress,
  calculatedApy,
  totalStaked,
  stakeDecimals = 6,
}) => {
  const root = useRef<HTMLElement>(null);

  // The wheel keeps turning as the visitor walks into the kiln
  const dialRotate = useTransform(smoothProgress, [0, 0.3], [0, 70]);
  const dialScale = useTransform(smoothProgress, [0, 0.3], [1, 1.12]);
  const dialY = useTransform(smoothProgress, [0, 0.3], ["0%", "12%"]);

  const apy = calculatedApy !== undefined && calculatedApy > 0 ? formatApy(calculatedApy) : null;
  const deposits = totalStaked ? formatTokenAmount(totalStaked, stakeDecimals, 2) : "0.00";

  // Opening sequence: rule, headline lines lifting out of their mask, body, actions, MICR line
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // A fresh page load already painted the server HTML: replaying it would flicker,
    // unless the kiln door is covering the studio, in which case play as it opens.
    const freshLoad = performance.now() < 4000 && !document.documentElement.dataset.argilaNavigated;
    const doorShowing = document.documentElement.dataset.vaultSeen !== "1";
    document.documentElement.dataset.argilaNavigated = "1";
    if (freshLoad && !doorShowing) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: doorShowing ? 0.75 : 0.15 });
      tl.from("[data-h-rule]", { scaleX: 0, transformOrigin: "left center", duration: 1.1 })
        .from("[data-h-line]", { yPercent: 110, duration: 1.15, stagger: 0.12 }, "<0.1")
        .from("[data-h-body]", { opacity: 0, y: 18, filter: "blur(6px)", duration: 0.9 }, "<0.45")
        .from("[data-h-cta] > *", { opacity: 0, y: 14, duration: 0.8, stagger: 0.08 }, "<0.15")
        .from("[data-h-micr] > *", { opacity: 0, x: -12, duration: 0.7, stagger: 0.06 }, "<0.1");
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} data-recede className="relative w-full min-h-[100svh] flex flex-col text-paper overflow-hidden">

      {/* The wheel. Positioned by the outer box; the inner one owns the scroll transforms. */}
      <div
        className="pointer-events-none absolute right-[-50vw] sm:right-[-24vw] lg:right-[-17vw] top-[88%] sm:top-[44%] -translate-y-1/2 opacity-35 sm:opacity-100 w-[115vw] sm:w-[80vw] lg:w-[min(56vw,54rem)] aspect-square"
        aria-hidden="true"
      >
        <motion.div style={{ rotate: dialRotate, scale: dialScale, y: dialY }} className="absolute inset-0">
          <GuillocheRosette engrave spin delay={0.1} className="absolute inset-0 w-full h-full text-terra" />
          <div className="absolute inset-[34%] rounded-full bg-ink/85" />
        </motion.div>
        {/* The vessel stays upright while the wheel turns around it */}
        <img
          src="/argila-logo-terra.png"
          alt=""
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[22%] h-[22%] object-contain"
        />
      </div>
      <div className="absolute inset-y-0 left-0 w-full lg:w-[60%] bg-gradient-to-r from-ink via-ink/85 to-transparent pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 flex-1 w-full max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-10 pt-28 sm:pt-32 pb-12 flex flex-col justify-center">
        <div className="max-w-[52rem]">
          <span data-h-rule className="block w-24 h-px bg-terra mb-8" aria-hidden="true" />
          <h1 className="font-display font-extrabold leading-[0.96] text-[2.4rem] sm:text-[3.75rem] lg:text-[3.4rem] xl:text-[3.7rem]">
            <span className="block overflow-hidden pb-[0.06em]">
              <span data-h-line className="block">Your USDG,</span>
            </span>
            <span className="block overflow-hidden pb-[0.06em]">
              <span data-h-line className="block">set in the kiln.</span>
            </span>
            <span className="block overflow-hidden pb-[0.06em]">
              <span data-h-line className="block text-terra-hi">ARGL every block.</span>
            </span>
          </h1>

          <p data-h-body className="mt-8 text-lg sm:text-xl leading-relaxed text-paper-dim max-w-[36rem]">
            Argila is a staking protocol on Robinhood Chain. Set your USDG in the kiln, draw ARGL from every block it
            fires, and take the whole piece back whenever you choose. No lockup, no cooling period.
          </p>

          <div data-h-cta className="mt-10 flex flex-col sm:flex-row gap-3">
            <Link href="/stake" className="btn btn-paper group !h-14 !px-8 !text-[16px]">
              Light the kiln
              <ArrowUpRight className="w-5 h-5 transition-transform duration-500 ease-vault group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link href="/position" className="btn btn-line !h-14 !px-8 !text-[16px]">
              View my firing log
            </Link>
          </div>
        </div>
      </div>

      {/* The kiln gauge: live figures stamped along the foot of the page */}
      <div className="relative z-10 w-full mb-12 sm:mb-16 border-y border-terra/25 bg-ink-3/70 backdrop-blur-[2px]">
        <dl
          data-h-micr
          className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-10 grid grid-cols-2 lg:grid-cols-4 font-mono text-paper"
        >
          {[
            { k: "Estimated APY", v: apy ?? "—", mark: "transit" as const, hi: true },
            { k: "In the kiln", v: `${deposits} USDG`, mark: "amount" as const },
            { k: "Lockup", v: "None", mark: "onus" as const },
            { k: "Rewards paid", v: "Every block", mark: "transit" as const },
          ].map((item, i) => (
            <div
              key={item.k}
              className={`py-5 sm:py-6 min-w-0 ${i % 2 === 1 ? "pl-5 sm:pl-8 border-l border-terra/20" : ""} ${
                i >= 2 ? "border-t lg:border-t-0 border-terra/20" : ""
              } ${i === 2 ? "lg:pl-8 lg:border-l" : ""}`}
            >
              <dt className="flex items-center gap-2 text-[11px] tracking-[0.04em] text-paper-faint">
                <MicrMark kind={item.mark} className="text-terra" />
                {item.k}
              </dt>
              <dd className={`pt-2 text-[17px] sm:text-xl font-medium truncate ${item.hi ? "text-terra-hi" : ""}`}>
                {item.k === "In the kiln" ? <RollingNumber value={item.v} /> : item.v}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};
