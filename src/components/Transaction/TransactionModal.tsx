"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TransactionState } from "@/lib/hooks/useLayer5Staking";
import { protocolConfig } from "@/lib/blockchain/config";
import { GuillocheRosette } from "@/components/vault/Guilloche";
import { Stamp } from "@/components/vault/Stamp";
import { ExternalLink, X } from "lucide-react";

interface TransactionModalProps {
  state: TransactionState;
  onClose: () => void;
}

const ease = [0.16, 1, 0.3, 1] as const;

/* A kiln receipt. The dial turns while the chain works; the stamp lands when it settles. */
export const TransactionModal: React.FC<TransactionModalProps> = ({ state, onClose }) => {
  const isOpen = state.step !== "IDLE";
  const isClosable = state.step === "SUCCESS" || state.step === "FAILED";
  const working = state.step === "CONFIRMING" || state.step === "PENDING";

  const status = {
    IDLE: { label: "", tone: "ink" as const },
    CONFIRMING: { label: "Awaiting signature", tone: "ink" as const },
    PENDING: { label: "Processing", tone: "ink" as const },
    SUCCESS: { label: "Settled", tone: "cobalt" as const },
    FAILED: { label: "Declined", tone: "cobalt" as const },
  }[state.step];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="tx-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-3/80 backdrop-blur-[3px]"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-live="polite"
            aria-labelledby="tx-title"
            initial={{ y: 48, opacity: 0, rotate: 1.5 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.55, ease }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm paper tint on-paper text-center"
          >
            <div className="perf-x mx-3 [--perf-hole:var(--ink-3)]" aria-hidden="true" />

            {isClosable && (
              <button
                onClick={onClose}
                className="absolute top-5 right-4 grid place-items-center w-8 h-8 border border-ink/30 text-ink/70 hover:text-ink hover:border-ink transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <div className="px-6 sm:px-8 pt-6 pb-8 space-y-6">
              <p className="font-mono text-[11px] text-ink/55">Argila · receipt</p>

              {/* The dial */}
              <div className="relative mx-auto w-32 h-32">
                <motion.div
                  animate={working ? { rotate: 360 } : { rotate: 0 }}
                  transition={working ? { duration: 6, ease: "linear", repeat: Infinity } : { duration: 0.8, ease }}
                  className="absolute inset-0"
                >
                  <GuillocheRosette className="w-full h-full text-ink/55" />
                </motion.div>
                <img
                  src="/argila-logo-ink.png"
                  alt=""
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 object-contain"
                />
                <AnimatePresence>
                  {isClosable && (
                    <div className="absolute inset-0 grid place-items-center">
                      <Stamp key={state.step} trigger="mount" tone="cobalt" tilt={state.step === "SUCCESS" ? -9 : 7} delay={0.1} className="text-lg bg-paper/40">
                        {status.label}
                      </Stamp>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-2">
                {working && (
                  <p className="flex items-center justify-center gap-2 font-mono text-[11px] text-ink/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-cobalt-deep tick-dot" aria-hidden="true" />
                    {status.label}
                  </p>
                )}
                <h3 id="tx-title" className="font-display font-extrabold text-xl leading-tight">
                  {state.title}
                </h3>
                <p className="text-[14px] text-ink/70 leading-relaxed max-w-xs mx-auto">{state.description}</p>
              </div>

              {state.txHash && protocolConfig.explorerUrl && (
                <a
                  href={`${protocolConfig.explorerUrl}/tx/${state.txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-[12px] text-ink underline decoration-ink/30 hover:decoration-ink"
                >
                  {state.txHash.slice(0, 10)}…{state.txHash.slice(-6)} <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              <div className="pt-1 border-t border-dashed border-ink/30">
                {state.step === "CONFIRMING" && (
                  <button onClick={onClose} className="btn btn-outline-ink mt-5 !h-11">
                    Cancel
                  </button>
                )}
                {isClosable && (
                  <button onClick={onClose} className="btn btn-ink w-full mt-5">
                    Close receipt
                  </button>
                )}
                {state.step === "PENDING" && (
                  <p className="mt-5 font-mono text-[11px] text-ink/55">Waiting for Robinhood Chain to confirm…</p>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
