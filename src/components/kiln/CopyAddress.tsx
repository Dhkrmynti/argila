"use client";

import React, { useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import { protocolConfig } from "@/lib/blockchain/config";

interface CopyAddressProps {
  label: string;
  address?: string;
  note?: string;
}

/* One contract row: label, full address, copy and explorer actions. */
export const CopyAddress: React.FC<CopyAddressProps> = ({ label, address, note }) => {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 py-5">
      <div className="sm:w-56 shrink-0">
        <p className="font-medium text-bone">{label}</p>
        {note && <p className="font-mono text-[11px] text-bone-3 mt-0.5">{note}</p>}
      </div>
      <p className="flex-1 min-w-0 font-mono text-[12.5px] text-bone-2 break-all">{address || "Not configured"}</p>
      {address && (
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full border border-line-strong text-[13px] text-bone-2 hover:text-bone hover:border-glow/50 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-glow" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
          <a
            href={`${protocolConfig.explorerUrl}/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-line-strong text-bone-2 hover:text-bone hover:border-glow/50 transition-colors"
            title="View on explorer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}
    </div>
  );
};

export default CopyAddress;
