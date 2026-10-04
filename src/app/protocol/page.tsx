import React from "react";
import { Layer5Emblem } from "@/components/Brand/Layer5Emblem";

export const metadata = {
  title: "Protocol Specification • Argila",
  description: "Comprehensive specification and architectural mechanics of Argila on Robinhood Chain.",
};

export default function ProtocolPage() {
  return (
    <div className="relative min-h-screen pt-28 pb-24 px-6 sm:px-12 bg-[#F6F3EC] text-[#1C1B18] font-sans selection:bg-[#1C1B18] selection:text-[#F6F3EC] overflow-hidden">
      <article className="relative z-10 max-w-3xl mx-auto space-y-16">
        {/* Editorial Header */}
        <header className="space-y-4 text-center sm:text-left border-b border-black/[0.08] pb-12">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-[0.35em] text-[#6B665E] uppercase font-bold">
              SPECIFICATION • ARCHITECTURE 01
            </span>
            <div className="hidden sm:block">
              <Layer5Emblem size={28} variant="black" animate={false} />
            </div>
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-black tracking-tight text-[#1C1B18] uppercase">
            THE <span className="text-[#283615]">PROTOCOL</span>
          </h1>
          <p className="text-sm font-mono tracking-[0.1em] text-[#6B665E] uppercase max-w-xl">
            CONTINUOUS STREAM LIQUIDITY AND STAKING MECHANICS ON ROBINHOOD CHAIN.
          </p>
        </header>

        {/* Section 1: Lore & Philosophy */}
        <section className="space-y-6">
          <div className="flex items-baseline gap-4">
            <span className="text-xs font-mono font-bold text-[#283615]">01</span>
            <h2 className="text-lg font-mono font-bold tracking-[0.15em] uppercase text-[#1C1B18]">
              PHILOSOPHY & ETHOS
            </h2>
          </div>
          <p className="text-[#2C2A26] leading-relaxed text-sm sm:text-base font-sans">
            In classical antiquity, the <strong className="font-bold text-[#1C1B18]">Argila</strong> symbolized an impenetrable golden shield carrying the divine mandate of protection and sovereign security. In decentralized finance, Argila translates this principle into autonomous, non-custodial staking infrastructure engineered specifically for Robinhood Chain L2.
          </p>
          <p className="text-[#5A554E] leading-relaxed text-sm sm:text-base font-sans">
            Traditional staking systems rely on rigid lockup epochs, punitive slashing schedules, and gas-intensive multi-stage interactions. Argila replaces friction with continuous flow: USDG deposited into the smart contract instantly enters an algorithmic reward stream calculated on every single block with zero custody surrender.
          </p>
        </section>

        {/* Section 2: Mathematical Foundation */}
        <section className="space-y-6">
          <div className="flex items-baseline gap-4">
            <span className="text-xs font-mono font-bold text-[#283615]">02</span>
            <h2 className="text-lg font-mono font-bold tracking-[0.15em] uppercase text-[#1C1B18]">
              MATHEMATICAL ACCOUNTING MODEL
            </h2>
          </div>
          <p className="text-[#2C2A26] leading-relaxed text-sm font-sans">
            Argila implements constant-time <code className="text-xs font-mono bg-[#FAF8F5] text-[#283615] font-bold px-2 py-0.5 rounded border border-black/[0.08]">O(1)</code> Synthetix-standard reward distribution. Regardless of whether there are 10 stakers or 100,000 stakers, every deposit, withdrawal, and claim executes with minimal computation and deterministic gas.
          </p>

          <div className="p-6 bg-white border border-black/[0.08] rounded-2xl font-mono text-xs space-y-4 shadow-sm">
            <div className="text-[#6B665E] text-[10px] tracking-widest uppercase font-bold">
              Accumulated Reward Per Token Equation
            </div>
            <div className="text-[#1C1B18] font-bold leading-loose tracking-wider text-sm sm:text-base">
              r(t) = r(t₀) + [ (t - t₀) &times; R &times; 10¹⁸ ] / S
            </div>
            <div className="text-[#5A554E] text-[11px] leading-relaxed pt-2 border-t border-black/[0.06]">
              Where <strong className="text-[#1C1B18]">R</strong> is the protocol reward rate per second, <strong className="text-[#1C1B18]">S</strong> is the total staked USDG supply in the contract, and <strong className="text-[#1C1B18]">(t - t₀)</strong> is the elapsed duration since the last checkpoint.
            </div>
          </div>

          <div className="p-6 bg-white border border-black/[0.08] rounded-2xl font-mono text-xs space-y-4 shadow-sm">
            <div className="text-[#6B665E] text-[10px] tracking-widest uppercase font-bold">
              User Claimable Reward Calculation
            </div>
            <div className="text-[#283615] font-bold leading-loose tracking-wider text-sm sm:text-base">
              E(u) = E_stored(u) + [ s(u) &times; ( r(t) - r_paid(u) ) ] / 10¹⁸
            </div>
            <div className="text-[#5A554E] text-[11px] leading-relaxed pt-2 border-t border-black/[0.06]">
              Where <strong className="text-[#1C1B18]">s(u)</strong> represents user balance, and <strong className="text-[#1C1B18]">r_paid(u)</strong> represents the reward per token checkpoint already settled.
            </div>
          </div>
        </section>

        {/* Section 3: The Flow Lifecycle */}
        <section className="space-y-6">
          <div className="flex items-baseline gap-4">
            <span className="text-xs font-mono font-bold text-[#283615]">03</span>
            <h2 className="text-lg font-mono font-bold tracking-[0.15em] uppercase text-[#1C1B18]">
              LIFECYCLE OF STAKED CAPITAL
            </h2>
          </div>

          <div className="border border-black/[0.08] rounded-2xl divide-y divide-black/[0.06] bg-white overflow-hidden shadow-sm">
            <div className="p-5 flex flex-col sm:flex-row justify-between gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#1C1B18] sm:w-1/3">
                Deposit (Stake USDG)
              </span>
              <span className="text-xs sm:text-sm text-[#5A554E] sm:w-2/3 leading-relaxed">
                User deposits USDG into KAWAStaking.sol via standard ERC-20 approval. Account checkpoint is immediately captured on Robinhood Chain.
              </span>
            </div>
            <div className="p-5 flex flex-col sm:flex-row justify-between gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#1C1B18] sm:w-1/3">
                Continuous Stream
              </span>
              <span className="text-xs sm:text-sm text-[#5A554E] sm:w-2/3 leading-relaxed">
                ARGL yield accrues continuously every second without requiring manual re-staking or lock-in penalties.
              </span>
            </div>
            <div className="p-5 flex flex-col sm:flex-row justify-between gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#1C1B18] sm:w-1/3">
                Claim (Harvest Rewards)
              </span>
              <span className="text-xs sm:text-sm text-[#5A554E] sm:w-2/3 leading-relaxed">
                Accrued ARGL rewards are transferred directly to the user wallet while the staked USDG principal remains active.
              </span>
            </div>
            <div className="p-5 flex flex-col sm:flex-row justify-between gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#1C1B18] sm:w-1/3">
                Exit (Unstake USDG)
              </span>
              <span className="text-xs sm:text-sm text-[#5A554E] sm:w-2/3 leading-relaxed">
                Users can withdraw their staked USDG principal at any time with zero lockup penalty and instant settlement.
              </span>
            </div>
          </div>
        </section>

        {/* Section 4: Security & Verification */}
        <section className="space-y-6">
          <div className="flex items-baseline gap-4">
            <span className="text-xs font-mono font-bold text-[#283615]">04</span>
            <h2 className="text-lg font-mono font-bold tracking-[0.15em] uppercase text-[#1C1B18]">
              SECURITY INVARIANTS & AUDIT
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-black/[0.08] space-y-2 shadow-sm">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#283615] font-bold">GUARD</span>
              <div className="text-xs font-mono font-bold text-[#1C1B18]">ReentrancyGuard</div>
              <p className="text-xs text-[#5A554E] leading-relaxed">All state-modifying deposit, withdrawal, and claim functions enforce OpenZeppelin nonReentrant execution.</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-black/[0.08] space-y-2 shadow-sm">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#283615] font-bold">TRANSFER SAFETY</span>
              <div className="text-xs font-mono font-bold text-[#1C1B18]">OpenZeppelin SafeERC20</div>
              <p className="text-xs text-[#5A554E] leading-relaxed">Strict boolean verification handles non-standard ERC-20 return behaviors safely.</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-black/[0.08] space-y-2 shadow-sm">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#283615] font-bold">GAS ASSET</span>
              <div className="text-xs font-mono font-bold text-[#1C1B18]">Robinhood Chain ETH</div>
              <p className="text-xs text-[#5A554E] leading-relaxed">Network transactions utilize native ETH for execution gas fees only.</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-black/[0.08] space-y-2 shadow-sm">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#283615] font-bold">NETWORK</span>
              <div className="text-xs font-mono font-bold text-[#1C1B18]">Robinhood Chain EVM</div>
              <p className="text-xs text-[#5A554E] leading-relaxed">Sub-second transaction finality with robust settlement guarantees.</p>
            </div>
          </div>
        </section>

        {/* Section 5: Contract Addresses */}
        <section className="space-y-6 pt-4 border-t border-black/[0.08]">
          <div className="flex items-baseline gap-4">
            <span className="text-xs font-mono font-bold text-[#283615]">05</span>
            <h2 className="text-lg font-mono font-bold tracking-[0.15em] uppercase text-[#1C1B18]">
              DEPLOYED CONTRACT SPECIFICATION
            </h2>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-4 rounded-xl bg-white border border-black/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm">
              <span className="text-[#6B665E] uppercase text-[10px] tracking-wider font-semibold">Staking Vault Contract</span>
              <span className="text-[#283615] font-bold font-mono text-[11px]">TBA (Announced at Mainnet Launch)</span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-black/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm">
              <span className="text-[#6B665E] uppercase text-[10px] tracking-wider font-semibold">Staking Asset (USDG)</span>
              <span className="text-[#1C1B18] font-bold font-mono text-[11px]">TBA (Announced at Mainnet Launch)</span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-black/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm">
              <span className="text-[#6B665E] uppercase text-[10px] tracking-wider font-semibold">Reward Token (ARGL)</span>
              <span className="text-[#1C1B18] font-bold font-mono text-[11px]">TBA (Announced at Mainnet Launch)</span>
            </div>
          </div>
        </section>

        {/* Editorial Colophon */}
        <footer className="pt-12 border-t border-black/[0.08] text-center text-xs font-mono text-[#6B665E] uppercase tracking-widest space-y-3">
          <div className="font-bold">ARGILA • SPECIFICATION RELEASE 1.0</div>
          <div className="flex items-center justify-center gap-2">
            <a
              href="https://x.com/argilaxyz"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#5A554E] hover:text-[#1C1B18] transition lowercase text-xs font-semibold"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>@argilaxyz</span>
            </a>
          </div>
          <div className="text-[10px] text-[#6B665E]">ROBINHOOD CHAIN MAINNET • ARCHITECTURAL SPECIFICATION</div>
        </footer>
      </article>
    </div>
  );
}
