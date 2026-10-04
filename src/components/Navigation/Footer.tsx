"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { protocolConfig } from "@/lib/blockchain/config";
import { formatAddress } from "@/lib/utils/formatters";
import { MicrMark } from "@/components/vault/Guilloche";

export const Footer: React.FC = () => {
  const link = "text-paper-dim hover:text-paper transition-colors";
  const ext = `${link} inline-flex items-center gap-1`;
  const explorer = protocolConfig.explorerUrl;

  return (
    <footer className="relative z-10 w-full mt-auto bg-ink-3 text-paper">
      <div data-reveal="band" className="band-wave text-terra/30" aria-hidden="true" />
      <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-10 pt-16 sm:pt-20 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-x-8 gap-y-12">
          <div className="col-span-2 md:col-span-5 space-y-5">
            <Link href="/" className="inline-flex items-center gap-3">
              <img src="/argila-logo-terra.png" alt="" className="w-8 h-8 object-contain" />
              <span className="font-display font-extrabold text-2xl tracking-[0.06em]">ARGILA</span>
            </Link>
            <p className="text-paper-dim leading-relaxed max-w-sm">
              Patience, fired into value. A staking protocol on Robinhood Chain: set USDG in the kiln, draw ARGL every block, take it back whenever you choose.
            </p>
          </div>

          <nav aria-label="Footer" className="md:col-span-2 space-y-4">
            <p className="font-mono text-[11px] tracking-[0.06em] text-terra">Argila</p>
            <ul className="space-y-2.5 wide">
              <li><Link href="/stake" className={link}>Deposit</Link></li>
              <li><Link href="/position" className={link}>Firing log</Link></li>
              <li><Link href="/stats" className={link}>Report</Link></li>
              <li><Link href="/docs" className={link}>Documentation</Link></li>
            </ul>
          </nav>

          <div className="md:col-span-3 space-y-4">
            <p className="font-mono text-[11px] tracking-[0.06em] text-terra">Registered contracts</p>
            <ul className="space-y-2.5 wide">
              <li>
                <a href={`${explorer}/address/${protocolConfig.stakingContractAddress}`} target="_blank" rel="noopener noreferrer" className={ext}>
                  Staking contract <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </li>
              <li>
                <a href={`${explorer}/token/${protocolConfig.rewardTokenAddress}`} target="_blank" rel="noopener noreferrer" className={ext}>
                  ARGL token <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </li>
              <li>
                <a href={`${explorer}/token/${protocolConfig.stakeTokenAddress}`} target="_blank" rel="noopener noreferrer" className={ext}>
                  USDG token <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </li>
              <li><Link href="/vodka" className={link}>Admin</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-4">
            <p className="font-mono text-[11px] tracking-[0.06em] text-terra">Correspondence</p>
            <ul className="space-y-2.5 wide">
              <li>
                <a href="https://x.com/argilaxyz" target="_blank" rel="noopener noreferrer" className={ext}>
                  X @argilaxyz <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </li>
              <li className="text-paper-faint">argila.xyz</li>
            </ul>
          </div>
        </div>

        {/* The MICR line along the foot of a cheque */}
        <div className="mt-16 pt-6 border-t border-terra/20 flex flex-col md:flex-row md:items-center justify-between gap-3 font-mono text-[12px] text-paper-faint tnum">
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <MicrMark kind="transit" />
            <span>{protocolConfig.chainId}</span>
            <MicrMark kind="transit" />
            <span>{formatAddress(protocolConfig.stakingContractAddress) || "unconfigured"}</span>
            <MicrMark kind="onus" />
            <span>USDG/ARGL</span>
            <MicrMark kind="amount" />
          </span>
          <span>© 2026 Argila</span>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
