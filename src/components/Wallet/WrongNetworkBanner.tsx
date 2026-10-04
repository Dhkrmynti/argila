"use client";

import React from "react";
import { motion } from "framer-motion";
import { protocolConfig } from "@/lib/blockchain/config";
import { AlertTriangle } from "lucide-react";

interface WrongNetworkBannerProps {
  onSwitch: () => void;
}

export const WrongNetworkBanner: React.FC<WrongNetworkBannerProps> = ({ onSwitch }) => {
  return (
    <motion.div
      role="alert"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full border border-terra/60 bg-terra-deep/15 text-paper"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-5 py-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0 text-terra-hi" />
          <div>
            <p className="font-display font-bold">Wrong network</p>
            <p className="text-[14px] text-paper-dim">
              Switch your wallet to {protocolConfig.chainName} ({protocolConfig.chainId}) to deposit, claim or withdraw.
            </p>
          </div>
        </div>
        <button type="button" onClick={onSwitch} className="btn btn-terra shrink-0 !h-11">
          Switch network
        </button>
      </div>
    </motion.div>
  );
};
