"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ExternalLink, X } from "lucide-react";
import { protocolConfig } from "@/lib/blockchain/config";
import { TransactionState } from "@/lib/hooks/useLayer5Staking";
import { KilnOrb } from "@/components/kiln/KilnOrb";

interface TransactionModalProps {
  state: TransactionState;
  onClose: () => void;
}

const ease = [0.22, 1, 0.36, 1] as const;

/* The kiln works while the chain does: it burns brighter as the transaction moves along. */
export const TransactionModal: React.FC<TransactionModalProps> = ({ state, onClose }) => {
  const isOpen = state.step !== "IDLE";
  const isClosable = state.step === "SUCCESS" || state.step === "FAILED";
  const working = state.step === "CONFIRMING" || state.step === "PENDING";

  const status = {
    IDLE: { label: "", heat: 0 },
    CONFIRMING: { label: "Waiting for your signature", heat: 0.45 },
    PENDING: { label: "Firing on Robinhood Chain", heat: 0.8 },
    SUCCESS: { label: "Done", heat: 1 },
    FAILED: { label: "Didn't go through", heat: 0.12 },
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
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-coal/80 backdrop-blur-md"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-live="polite"
            aria-labelledby="tx-title"
            initial={{ y: 40, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.5, ease }}
            className="relative w-full max-w-sm surface-raised p-7 sm:p-8 text-center overflow-hidden"
          >
            {isClosable && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 grid place-items-center w-9 h-9 rounded-full bg-bone/[0.06] text-bone-2 hover:text-bone transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <div className="relative mx-auto w-36 h-36">
              <KilnOrb heat={status.heat}>
                {state.step === "SUCCESS" && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 16, delay: 0.15 }}
                    className="grid place-items-center w-12 h-12 rounded-full bg-coal/85 text-glow"
                  >
                    <Check className="w-6 h-6" />
                  </motion.span>
                )}
                {state.step === "FAILED" && (
                  <span className="grid place-items-center w-12 h-12 rounded-full bg-coal/85 text-flame">
                    <X className="w-6 h-6" />
                  </span>
                )}
              </KilnOrb>
              {working && (
                <motion.span
                  className="absolute -inset-2 rounded-full border-2 border-transparent border-t-glow/80"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.4, ease: "linear", repeat: Infinity }}
                  aria-hidden="true"
                />
              )}
            </div>

            <p className="mt-6 inline-flex items-center gap-2 font-mono text-[11.5px] tracking-[0.06em] uppercase text-bone-2">
              {working && <span className="w-1.5 h-1.5 rounded-full bg-glow animate-pulse-dot" aria-hidden="true" />}
              {status.label}
            </p>
            <h3 id="tx-title" className="mt-2 font-display font-bold text-2xl tracking-tight">
              {state.title}
            </h3>
            <p className="mt-2 text-[14.5px] text-bone-2 leading-relaxed">{state.description}</p>

            {state.txHash && protocolConfig.explorerUrl && (
              <a
                href={`${protocolConfig.explorerUrl}/tx/${state.txHash}`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 font-mono text-[12px] text-glow hover:text-hot"
              >
                {state.txHash.slice(0, 10)}…{state.txHash.slice(-6)} <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <div className="mt-7">
              {state.step === "CONFIRMING" && (
                <button onClick={onClose} className="btn btn-ghost w-full">
                  Cancel
                </button>
              )}
              {state.step === "PENDING" && <p className="font-mono text-[11.5px] text-bone-3">Waiting for the chain to confirm…</p>}
              {isClosable && (
                <button onClick={onClose} className={`btn w-full ${state.step === "SUCCESS" ? "btn-hot" : "btn-ghost"}`}>
                  Close
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TransactionModal;
