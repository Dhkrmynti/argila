"use client";

import { useEffect, useRef, useState } from "react";

/*
 * Pending ARGL between chain reads. The contract value refreshes every few
 * seconds; in between, this adds the position's share of the reward rate for
 * the time elapsed since the last read. It snaps back to the chain value on
 * every refresh and never projects more than 15 seconds ahead.
 */
export function useLiveRewards(pending: bigint, rewardRate: bigint, staked: bigint, totalStaked: bigint): number {
  const base = Number(pending) / 1e18;
  const perSecond = staked > 0n && totalStaked > 0n ? (Number(rewardRate) / 1e18) * (Number(staked) / Number(totalStaked)) : 0;

  const [value, setValue] = useState(base);
  const anchor = useRef({ base, at: Date.now() });

  useEffect(() => {
    anchor.current = { base, at: Date.now() };
    setValue(base);
  }, [base]);

  useEffect(() => {
    if (perSecond <= 0) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      const elapsed = Math.min(15, (Date.now() - anchor.current.at) / 1000);
      setValue(anchor.current.base + perSecond * elapsed);
    }, 100);
    return () => clearInterval(id);
  }, [perSecond]);

  return value;
}
