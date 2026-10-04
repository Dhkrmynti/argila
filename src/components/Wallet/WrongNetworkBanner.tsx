"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { protocolConfig } from "@/lib/blockchain/config";

interface WrongNetworkBannerProps {
  onSwitch: () => void;
}

export const WrongNetworkBanner: React.FC<WrongNetworkBannerProps> = ({ onSwitch }) => (
  <motion.div
    role="alert"
    initial={{ opacity: 0, y: -12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    className="w-full rounded-3xl border border-flame/40 bg-flame/[0.08] text-bone"
  >
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-5 sm:px-6 py-4">
      <div className="flex items-start gap-3">
        <span className="grid place-items-center w-9 h-9 rounded-full bg-flame/15 shrink-0">
          <AlertTriangle className="w-[18px] h-[18px] text-glow" />
        </span>
        <div>
          <p className="font-display font-semibold">Wrong network</p>
          <p className="text-[14px] text-bone-2">
            Switch your wallet to {protocolConfig.chainName} ({protocolConfig.chainId}) to deposit, claim or withdraw.
          </p>
        </div>
      </div>
      <button type="button" onClick={onSwitch} className="btn btn-hot shrink-0 !h-11">
        Switch network
      </button>
    </div>
  </motion.div>
);

export default WrongNetworkBanner;
