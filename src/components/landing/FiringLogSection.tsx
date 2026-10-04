"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/*
 * The firing log: four entries written into one page as the visitor scrolls.
 * Each line is inked left to right, then the potter's mark lands beside it.
 * Amounts are a specimen, labelled as such; no rate is ever implied.
 */

const ENTRIES = [
  {
    entry: "Deposit",
    detail: "USDG moves from your wallet into the kiln contract.",
    amount: "+1,000.00",
    unit: "USDG",
    balance: "1,000.00",
    stamp: "Set",
    title: "Deposit any amount.",
    body: "Approve once, then deposit. Your USDG is recorded in the staking contract against your address, and you can withdraw it whenever you choose.",
  },
  {
    entry: "Rewards",
    detail: "ARGL accrues to your share with every block.",
    amount: "accruing",
    unit: "ARGL",
    balance: "1,000.00",
    stamp: "Firing",
    title: "Rewards every block.",
    body: "The contract tracks reward per token, so your share of each block's ARGL is credited the moment the block lands. Nothing to restake, nothing to wait for.",
  },
  {
    entry: "Claim",
    detail: "Collected ARGL is sent to your wallet.",
    amount: "to wallet",
    unit: "ARGL",
    balance: "1,000.00",
    stamp: "Drawn",
    title: "Collect when you like.",
    body: "Claim at any moment and your accrued ARGL lands in your wallet. Your USDG stays in the kiln and keeps earning.",
  },
  {
    entry: "Withdrawal",
    detail: "Principal returns to your wallet, in full or in part.",
    amount: "−1,000.00",
    unit: "USDG",
    balance: "0.00",
    stamp: "Unloaded",
    title: "Leave whenever.",
    body: "There is no lockup and no notice period. Withdraw part of your balance or exit entirely, rewards included, in a single transaction.",
  },
];

export const FiringLogSection: React.FC = () => {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Desktop: pin the page and write one entry per stretch of scroll
      mm.add("(min-width: 1024px)", () => {
        const rows = gsap.utils.toArray<HTMLElement>("[data-pb-row]");
        const captions = gsap.utils.toArray<HTMLElement>("[data-pb-caption]");
        gsap.set(captions.slice(1), { autoAlpha: 0, y: 24 });
        gsap.set("[data-pb-ink]", { clipPath: "inset(0 100% 0 0)" });
        gsap.set("[data-pb-stamp]", { autoAlpha: 0, scale: 1.8, rotate: -18 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: "[data-pb-stage]",
            start: "top top",
            end: () => `+=${window.innerHeight * 3.2}`,
            pin: true,
            scrub: 0.6,
            snap: { snapTo: "labels", duration: { min: 0.2, max: 0.6 }, ease: "power2.out", delay: 0.05 },
            invalidateOnRefresh: true,
          },
        });

        // The first entry is already written as the page settles into place
        gsap
          .timeline({ scrollTrigger: { trigger: "[data-pb-stage]", start: "top 55%", toggleActions: "play none none reverse" } })
          .to(rows[0].querySelectorAll("[data-pb-ink]"), { clipPath: "inset(0 0% 0 0)", duration: 0.9, stagger: 0.08, ease: "expo.out" })
          .to(rows[0].querySelector("[data-pb-stamp]"), { autoAlpha: 0.92, scale: 1, rotate: -7, duration: 0.45, ease: "back.out(2.4)" }, "-=0.35")
          .to(rows[0], { backgroundColor: "rgba(18,14,11,0.035)", duration: 0.2 }, "<");

        rows.forEach((row, i) => {
          if (i === 0) return;
          const at = i - 0.7;
          // Outgoing caption is gone before the next arrives: never two at once
          tl.to(captions[i - 1], { autoAlpha: 0, y: -24, duration: 0.18, ease: "power2.in" }, at - 0.22).to(
            captions[i],
            { autoAlpha: 1, y: 0, duration: 0.28, ease: "power2.out" },
            at + 0.02
          );
          tl.to(row.querySelectorAll("[data-pb-ink]"), { clipPath: "inset(0 0% 0 0)", duration: 0.45, stagger: 0.08 }, at)
            .to(row.querySelector("[data-pb-stamp]"), { autoAlpha: 0.92, scale: 1, rotate: -7, duration: 0.18, ease: "back.out(2.4)" }, at + 0.5)
            .to(row, { backgroundColor: "rgba(18,14,11,0.035)", duration: 0.1 }, at + 0.5);
        });
        tl.to({}, { duration: 0.4 });
        // Rest points for snapping: the start, and each entry fully written and stamped
        tl.addLabel("e0", 0);
        rows.slice(1).forEach((_, j) => tl.addLabel(`e${j + 1}`, j + 1));
      });

      // Small screens: no pin, each entry writes itself as it arrives
      mm.add("(max-width: 1023px)", () => {
        gsap.utils.toArray<HTMLElement>("[data-pb-row]").forEach((row) => {
          gsap
            .timeline({ scrollTrigger: { trigger: row, start: "top 82%", once: true } })
            .from(row.querySelectorAll("[data-pb-ink]"), { clipPath: "inset(0 100% 0 0)", duration: 0.9, stagger: 0.08, ease: "expo.out" })
            .from(row.querySelector("[data-pb-stamp]"), { autoAlpha: 0, scale: 1.8, rotate: -18, duration: 0.45, ease: "back.out(2.4)" }, "-=0.4");
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative text-paper">
      {/* While pinned, the page sits below the fixed nav (about 86px), centred in what is left */}
      <div data-pb-stage className="relative lg:h-[100svh] lg:pt-[96px] lg:pb-6 flex items-center overflow-hidden">
        <div className="w-full max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-10 py-24 lg:py-0 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* The potter's explanation, one entry at a time */}
          <div className="lg:col-span-5">
            <h2 data-reveal="lines" className="font-display font-extrabold text-[2.4rem] sm:text-5xl lg:text-[3.6rem] leading-[0.98] text-balance">
              How the firing log reads.
            </h2>
            <div className="relative mt-10 lg:min-h-[13rem]">
              {ENTRIES.map((e, i) => (
                <div
                  key={e.entry}
                  data-pb-caption
                  className={`${i === 0 ? "lg:relative" : "lg:absolute lg:inset-x-0 lg:top-0"} hidden lg:block`}
                >
                  <p className="font-display font-bold text-2xl text-terra-hi">{e.title}</p>
                  <p className="mt-4 text-lg leading-relaxed text-paper-dim max-w-[34rem]">{e.body}</p>
                </div>
              ))}
              <ul className="lg:hidden space-y-6">
                {ENTRIES.map((e) => (
                  <li key={e.entry}>
                    <p className="font-display font-bold text-xl text-terra-hi">{e.title}</p>
                    <p className="mt-2 leading-relaxed text-paper-dim">{e.body}</p>
                  </li>
                ))}
              </ul>
            </div>
            <Link href="/stake" className="mt-10 inline-flex items-center gap-2 wide font-medium text-paper hover:text-terra-hi transition-colors group">
              Set the first piece
              <ArrowRight className="w-4 h-4 transition-transform duration-500 ease-vault group-hover:translate-x-1" />
            </Link>
          </div>

          {/* The page itself */}
          <div className="lg:col-span-7">
            <div className="paper tint on-paper relative flex">
              <div className="perf-y shrink-0 my-3 [--perf-hole:var(--ink)]" aria-hidden="true" />
              <div className="flex-1 min-w-0 px-4 sm:px-8 py-7 sm:py-9 [@media(min-width:1024px)_and_(max-height:860px)]:py-6">
                <div className="flex items-end justify-between gap-4 pb-4 border-b-2 border-ink">
                  <div>
                    <p className="font-display font-extrabold text-xl sm:text-2xl leading-none">Argila</p>
                    <p className="mt-1.5 font-mono text-[10px] sm:text-[11px] text-ink/60">Firing log · Robinhood Chain</p>
                  </div>
                  <p className="font-mono text-[10px] sm:text-[11px] text-cobalt-deep text-right leading-snug">
                    Specimen page
                    <br />
                    <span className="text-ink/55">illustrative amounts</span>
                  </p>
                </div>

                <div className="hidden sm:grid grid-cols-12 gap-3 pt-4 pb-2 font-mono text-[10px] text-ink/55">
                  <span className="col-span-4">Entry</span>
                  <span className="col-span-2 text-center">Mark</span>
                  <span className="col-span-3 text-right">Amount</span>
                  <span className="col-span-3 text-right">Balance USDG</span>
                </div>

                <ol className="ledger [--rule:rgba(18,14,11,0.16)] border-t border-ink/20">
                  {ENTRIES.map((e) => (
                    <li key={e.entry} data-pb-row className="relative grid grid-cols-12 gap-3 py-4 sm:py-5 [@media(min-width:1024px)_and_(max-height:860px)]:py-3 items-center transition-colors">
                      <div className="col-span-12 sm:col-span-4 min-w-0 pr-16 sm:pr-0">
                        <p data-pb-ink className="font-display font-bold text-lg leading-tight">{e.entry}</p>
                        <p data-pb-ink className="text-[13px] leading-snug text-ink/65 mt-0.5">{e.detail}</p>
                      </div>
                      <span className="absolute right-0 top-3 sm:static sm:col-span-2 sm:flex sm:justify-center" aria-hidden="true">
                        <span
                          data-pb-stamp
                          className="pointer-events-none inline-block px-2 py-1 border-2 border-cobalt-deep outline outline-1 outline-cobalt-deep outline-offset-2 font-display font-extrabold uppercase text-[10px] tracking-[0.05em] whitespace-nowrap text-cobalt-deep mix-blend-multiply rotate-[-7deg] opacity-90"
                        >
                          {e.stamp}
                        </span>
                      </span>
                      <p data-pb-ink className="col-span-7 sm:col-span-3 sm:text-right font-mono text-[13px] sm:text-sm tnum">
                        {e.amount} <span className="text-ink/55">{e.unit}</span>
                      </p>
                      <p data-pb-ink className="col-span-5 sm:col-span-3 text-right font-mono text-[13px] sm:text-sm tnum font-medium">
                        {e.balance}
                      </p>
                    </li>
                  ))}
                </ol>

                <div className="mt-5 pt-3 border-t-2 border-ink flex items-center justify-between font-mono text-[10px] sm:text-[11px] text-ink/60">
                  <span>Lockup · none</span>
                  <span>Notice period · none</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FiringLogSection;
