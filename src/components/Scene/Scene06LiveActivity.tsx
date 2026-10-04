"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useBlockNumber } from "wagmi";
import { protocolConfig } from "@/lib/blockchain/config";
import { ExternalLink } from "lucide-react";

interface StreamEvent {
  id: string;
  type: "STAKE" | "CLAIM" | "COMPOUND";
  address: string;
  amount: string;
  asset: "USDG" | "ARGL";
  elapsed: string;
  hash: string;
}

const ease = [0.16, 1, 0.3, 1] as const;

/* The day book: every entry the kiln records, newest first. */
export const Scene06LiveActivity: React.FC = () => {
  const [events, setEvents] = useState<StreamEvent[]>([]);
  const { data: blockNumberData } = useBlockNumber({ watch: true });
  const liveBlockHeight = blockNumberData ? Number(blockNumberData) : 0;

  return (
    <section id="activity" className="relative w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b border-terra/30">
        <div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl">Day book</h2>
          <p className="mt-2 text-paper-dim">Deposits, claims and withdrawals as the chain records them.</p>
        </div>
        <p className="font-mono text-[12px] text-paper-dim tnum">
          Current block <span className="text-paper">#{liveBlockHeight.toLocaleString()}</span>
        </p>
      </div>

      {events.length > 0 ? (
        <ol className="ledger [--rule:rgba(210,105,60,0.16)]">
          {events.map((ev, i) => (
            <motion.li
              key={ev.id}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease, delay: i * 0.05 }}
              className="grid grid-cols-12 gap-3 items-center py-4 font-mono text-[13px]"
            >
              <span className={`col-span-3 sm:col-span-2 ${ev.type === "STAKE" ? "text-terra-hi" : "text-paper-dim"}`}>{ev.type}</span>
              <span className="col-span-5 sm:col-span-4 text-paper truncate">{ev.address}</span>
              <span className="col-span-4 sm:col-span-3 text-right tnum">
                {ev.amount} <span className="text-paper-faint">{ev.asset}</span>
              </span>
              <span className="hidden sm:block col-span-2 text-right text-paper-faint">{ev.elapsed}</span>
              <span className="hidden sm:flex col-span-1 justify-end">
                {protocolConfig.explorerUrl && (
                  <a
                    href={`${protocolConfig.explorerUrl}/tx/${ev.hash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-paper-dim hover:text-paper transition-colors"
                    title="View on explorer"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </span>
            </motion.li>
          ))}
        </ol>
      ) : (
        <div className="py-16 sm:py-20 text-center">
          <div className="relative mx-auto w-14 h-14" aria-hidden="true">
            <span className="absolute inset-0 rounded-full border border-terra/40 animate-ping motion-reduce:animate-none" />
            <span className="absolute inset-3 rounded-full border border-terra-hi" />
          </div>
          <p className="mt-6 font-display font-bold text-xl">Waiting for the next entry</p>
          <p className="mt-2 text-paper-dim max-w-md mx-auto leading-relaxed">
            New deposits, claims and withdrawals on Robinhood Chain will be written here as their blocks are mined.
          </p>
        </div>
      )}
    </section>
  );
};
