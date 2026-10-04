import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { protocolConfig } from "@/lib/blockchain/config";
import { VesselMark } from "./Logo";

const col = "space-y-3";
const link = "text-bone-2 hover:text-bone transition-colors";

export const Footer: React.FC = () => (
  <footer className="relative z-10 mt-24 overflow-hidden">
    <div className="mx-auto max-w-6xl px-5 sm:px-8">
      <div className="surface p-8 sm:p-12 grid grid-cols-2 md:grid-cols-12 gap-10">
        <div className="col-span-2 md:col-span-5 space-y-4">
          <VesselMark className="w-10 h-10" id="ft" />
          <p className="font-display text-2xl font-semibold tracking-tight max-w-xs text-balance">Patience, fired into value.</p>
          <p className="text-bone-2 text-[15px] leading-relaxed max-w-sm">
            Stake USDG on Robinhood Chain, earn ARGL every block, and take it back whenever you choose.
          </p>
        </div>
        <div className={`md:col-span-2 ${col}`}>
          <p className="eyebrow">Protocol</p>
          <ul className="space-y-2.5 text-[15px]">
            <li><Link href="/stake" className={link}>Kiln</Link></li>
            <li><Link href="/position" className={link}>My firing</Link></li>
            <li><Link href="/stats" className={link}>Stats</Link></li>
            <li><Link href="/docs" className={link}>Docs</Link></li>
          </ul>
        </div>
        <div className={`md:col-span-3 ${col}`}>
          <p className="eyebrow">On chain</p>
          <ul className="space-y-2.5 text-[15px]">
            <li>
              <a href={`${protocolConfig.explorerUrl}/address/${protocolConfig.stakingContractAddress}`} target="_blank" rel="noopener noreferrer" className={`${link} inline-flex items-center gap-1`}>
                Staking contract <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </li>
            <li>
              <a href={`${protocolConfig.explorerUrl}/address/${protocolConfig.rewardTokenAddress}`} target="_blank" rel="noopener noreferrer" className={`${link} inline-flex items-center gap-1`}>
                ARGL token <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </li>
            <li><Link href="/vodka" className={link}>Admin</Link></li>
          </ul>
        </div>
        <div className={`md:col-span-2 ${col}`}>
          <p className="eyebrow">Social</p>
          <ul className="space-y-2.5 text-[15px]">
            <li>
              <a href="https://x.com/argilaxyz" target="_blank" rel="noopener noreferrer" className={`${link} inline-flex items-center gap-1`}>
                X @argilaxyz <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </li>
            <li className="text-bone-3">argila.xyz</li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-between gap-2 py-6 font-mono text-[11.5px] text-bone-3">
        <span>© 2026 Argila</span>
        <span>Robinhood Chain · {protocolConfig.chainId} · USDG / ARGL</span>
      </div>
    </div>
    {/* The name, set large and cut off by the edge of the page like a kiln stamp */}
    <p
      className="pointer-events-none select-none text-center font-display font-extrabold lowercase leading-[0.75] tracking-[-0.06em] text-heat opacity-90 text-[26vw] -mb-[4vw]"
      aria-hidden="true"
    >
      argila
    </p>
  </footer>
);

export default Footer;
