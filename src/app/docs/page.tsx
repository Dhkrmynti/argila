"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { protocolConfig } from "@/lib/blockchain/config";
import { 
  BookOpen, 
  Layers, 
  Coins, 
  TrendingUp, 
  FileCode, 
  ShieldCheck, 
  Network, 
  HelpCircle, 
  Search, 
  Copy, 
  Check, 
  ExternalLink, 
  ArrowRight, 
  ArrowLeft,
  Terminal,
  Zap,
  Lock,
  Cpu
} from "lucide-react";

interface DocSection {
  id: string;
  num: string;
  title: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("intro");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const sections: DocSection[] = [
    {
      id: "intro",
      num: "01",
      title: "Introduction",
      category: "Protocol",
      icon: BookOpen,
      description: "Overview, vision, and architectural tenets of Argila.",
    },
    {
      id: "how-it-works",
      num: "02",
      title: "How Argila Works",
      category: "Architecture",
      icon: Layers,
      description: "The perpetual 4-stage cycle: Stake, Flow, Grow, and Reward.",
    },
    {
      id: "staking",
      num: "03",
      title: "Staking Mechanics",
      category: "Mechanics",
      icon: Coins,
      description: "Approval, deposit, and withdrawals at any time.",
    },
    {
      id: "rewards",
      num: "04",
      title: "Reward Mathematics",
      category: "Yield Engine",
      icon: TrendingUp,
      description: "How reward per token turns the reward rate into your share of ARGL.",
    },
    {
      id: "contracts",
      num: "05",
      title: "Smart Contracts",
      category: "Contracts",
      icon: FileCode,
      description: "Deployed addresses, interfaces, Solidity methods, and verified sources.",
    },
    {
      id: "security",
      num: "06",
      title: "Security",
      category: "Security",
      icon: ShieldCheck,
      description: "Reentrancy guards and SafeERC20 token transfers.",
    },
    {
      id: "robinhood-chain",
      num: "07",
      title: "Robinhood Chain L2",
      category: "Network",
      icon: Network,
      description: "Network parameters, RPC endpoints, and one-click wallet integration.",
    },
    {
      id: "faq",
      num: "08",
      title: "FAQ & Support",
      category: "Support",
      icon: HelpCircle,
      description: "Common questions regarding lockup periods, APY calculation, and gas.",
    },
  ];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleAddNetwork = async () => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      try {
        await (window as any).ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: `0x${protocolConfig.chainId.toString(16)}`,
              chainName: protocolConfig.chainName,
              nativeCurrency: {
                name: protocolConfig.gasAsset,
                symbol: protocolConfig.gasAsset,
                decimals: 18,
              },
              rpcUrls: [protocolConfig.rpcUrl],
              blockExplorerUrls: protocolConfig.explorerUrl ? [protocolConfig.explorerUrl] : undefined,
            },
          ],
        });
      } catch (err) {
        console.error("Failed to add network:", err);
      }
    }
  };

  // Filter sections by search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const q = searchQuery.toLowerCase();
    return sections.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const currentIndex = sections.findIndex((s) => s.id === activeSection);
  const prevSection = currentIndex > 0 ? sections[currentIndex - 1] : null;
  const nextSection = currentIndex < sections.length - 1 ? sections[currentIndex + 1] : null;

  return (
    <div className="relative w-full min-h-screen text-bone pt-28 sm:pt-36 pb-24 overflow-hidden">
      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 space-y-10">
        
        {/* Title page of the manual */}
        <header className="relative pb-10 border-b border-line-strong">
          <div className="pointer-events-none absolute -right-40 -top-56 w-[36rem] h-[36rem] rounded-full bg-[radial-gradient(closest-side,rgba(242,140,56,0.18),transparent)] hidden md:block" aria-hidden="true" />
          <div className="relative flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="space-y-5 max-w-3xl">
              <h1 className="font-display font-bold tracking-[-0.04em] text-[2.6rem] sm:text-6xl lg:text-[4.6rem] leading-[0.95] text-bone">
                The kiln manual.
              </h1>
              <p className="text-bone-2 text-lg leading-relaxed max-w-2xl">
                How the Argila contracts hold your USDG, how rewards are calculated, where everything is deployed, and how to
                connect to Robinhood Chain.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button type="button" onClick={handleAddNetwork} className="btn btn-ghost">
                <Network className="w-4 h-4" />
                Add Robinhood Chain
              </button>
              <Link href="/stake" className="btn btn-hot group">
                Light the kiln
                <ArrowRight className="w-4 h-4 transition-transform duration-500 ease-out group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Search the manual */}
          <div className="relative mt-10 max-w-2xl">
            <Search className="w-4 h-4 text-bone-3 absolute left-0 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search the manual: stake, reward rate, contract address, RPC…"
              className="w-full bg-transparent border-b border-line-strong pl-7 pr-16 py-3 text-[16px] text-bone placeholder:text-bone-3 focus:outline-none focus:border-glow/60 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-0 top-1/2 -translate-y-1/2 font-mono text-[11px] text-bone-2 hover:text-bone cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </header>

        {/* Mobile Section Nav (Horizontal scroll on < lg) */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
          {filteredSections.map((sec) => {
            const isActive = activeSection === sec.id;
            const Icon = sec.icon;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => {
                  setActiveSection(sec.id);
                }}
                className={`shrink-0 flex items-center gap-2 px-4 h-10 rounded-full text-[13px] transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-bone text-coal font-semibold"
                    : "text-bone-2 border border-line"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-coal" : "text-flame"}`} />
                <span>{sec.title}</span>
              </button>
            );
          })}
        </div>

        {/* Documentation Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sticky Navigation Column (Desktop only) */}
          <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 lg:sticky lg:top-28 space-y-3">
            <div className="surface p-2 space-y-0.5">
              <div className="px-3 py-2 font-mono text-[11px] text-bone-3 border-b border-line-strong mb-1">
                Contents · {filteredSections.length}
              </div>

              {filteredSections.map((sec) => {
                const isActive = activeSection === sec.id;
                const Icon = sec.icon;

                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => {
                      setActiveSection(sec.id);
                      window.scrollTo({ top: 120, behavior: "smooth" });
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-left transition-colors duration-300 text-[14px] cursor-pointer ${
                      isActive
                        ? "bg-bone text-coal font-semibold"
                        : "text-bone-2 hover:text-bone hover:bg-bone/[0.04]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-coal" : "text-flame"}`} />
                      <span className="truncate">{sec.title}</span>
                    </div>
                    <span className={`text-[10px] font-mono shrink-0 ml-2 ${isActive ? "text-coal/60" : "text-bone-3"}`}>
                      {sec.num}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Support / Community Card */}
            <div className="p-3 text-[13px] space-y-3">
              <span className="font-mono text-[11px] text-bone-3 block">
                Elsewhere
              </span>
              <div className="space-y-1.5 text-bone-2">
                <a
                  href="https://x.com/argilaxyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between hover:text-glow transition py-1"
                >
                  <span>Protocol Twitter / X (@argilaxyz)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href={protocolConfig.explorerUrl || "https://explorer.robinhood.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between hover:text-glow transition py-1"
                >
                  <span>Block Explorer</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </aside>

          {/* Right Main Article Reader */}
          <main className="lg:col-span-8 xl:col-span-9 relative surface p-6 sm:p-12 space-y-10 min-h-[600px] text-bone">
            
            {/* =============================================================
                SECTION 01: INTRODUCTION
                ============================================================= */}
            {activeSection === "intro" && (
              <article className="space-y-8">
                <div className="space-y-2 border-b border-line pb-6">
                  <h2 className="font-display font-bold tracking-[-0.04em] text-3xl sm:text-[2.6rem] leading-[1.02] text-bone text-balance">
                    Introduction to Argila
                  </h2>
                  <p className="text-bone-2 text-lg leading-relaxed">
                    Argila is a staking protocol on Robinhood Chain: deposit USDG, earn ARGL every block, withdraw whenever you choose.
                  </p>
                </div>

                <div className="space-y-4 text-[16px] text-bone leading-[1.7] font-sans">
                  <p>
                    The cycle is simple: you stake USDG, your share of the pool earns ARGL with every block, and you claim or withdraw whenever you choose. There is no lockup.
                  </p>
                  <p>
                    <em>Argila</em> is the Portuguese and Spanish word for clay. Clay gains its strength in the kiln, one hour of heat at a time; your USDG sits in the staking contract the same way, and every block it stays there fires a little more ARGL. The piece you set in is the piece you take out: your principal is never burned, only the reward grows.
                  </p>
                  <p>
                    Rewards are distributed by a reward-per-token accumulator, and the kiln charges no deposit or withdrawal fee; you pay only the network fee in ETH.
                  </p>
                </div>

                <dl className="surface divide-y divide-line px-5 sm:px-8 py-2">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-6 py-5">
                    <dt className="sm:col-span-4 font-display font-bold text-[17px] text-bone">Rewards every block</dt>
                    <dd className="sm:col-span-8 text-[15px] leading-relaxed text-bone-2">ARGL accrues to your share as each block lands. There is nothing to restake and no batch to wait for.</dd>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-6 py-5">
                    <dt className="sm:col-span-4 font-display font-bold text-[17px] text-bone">No lockup</dt>
                    <dd className="sm:col-span-8 text-[15px] leading-relaxed text-bone-2">Withdraw part or all of your principal at any time, in a single transaction, with no fee charged by the kiln.</dd>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-6 py-5">
                    <dt className="sm:col-span-4 font-display font-bold text-[17px] text-bone">Reward per token</dt>
                    <dd className="sm:col-span-8 text-[15px] leading-relaxed text-bone-2">Rewards are tracked with a running reward-per-token accumulator, so the cost of an action does not grow with the number of depositors.</dd>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-6 py-5">
                    <dt className="sm:col-span-4 font-display font-bold text-[17px] text-bone">Robinhood Chain</dt>
                    <dd className="sm:col-span-8 text-[15px] leading-relaxed text-bone-2">USDG lives on Robinhood Chain, and its low network fees make small claims and frequent adjustments practical.</dd>
                  </div>
                </dl>
              </article>
            )}

            {/* =============================================================
                SECTION 02: HOW ARGILA WORKS
                ============================================================= */}
            {activeSection === "how-it-works" && (
              <article className="space-y-8">
                <div className="space-y-2 border-b border-line pb-6">
                  <h2 className="font-display font-bold tracking-[-0.04em] text-3xl sm:text-[2.6rem] leading-[1.02] text-bone text-balance">
                    How Argila Works
                  </h2>
                  <p className="text-bone-2 text-lg leading-relaxed">
                    A walkthrough of the 4 continuous phases in the Argila staking lifecycle.
                  </p>
                </div>

                <dl className="surface divide-y divide-line px-5 sm:px-8 py-2">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-6 py-5">
                    <dt className="sm:col-span-4 font-display font-bold text-[17px] text-bone">Stake</dt>
                    <dd className="sm:col-span-8 text-[15px] leading-relaxed text-bone-2">Approve USDG, then call <code className="font-mono text-[13px] text-bone font-semibold">stake(amount)</code>. The contract records your balance and the time against your address.</dd>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-6 py-5">
                    <dt className="sm:col-span-4 font-display font-bold text-[17px] text-bone">Flow</dt>
                    <dd className="sm:col-span-8 text-[15px] leading-relaxed text-bone-2">Your deposit joins the pool. The global <code className="font-mono text-[13px] text-bone font-semibold">rewardPerToken</code> accumulator advances with the reward rate, in proportion to total USDG staked.</dd>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-6 py-5">
                    <dt className="sm:col-span-4 font-display font-bold text-[17px] text-bone">Grow</dt>
                    <dd className="sm:col-span-8 text-[15px] leading-relaxed text-bone-2">Your earned ARGL is your balance multiplied by how far the accumulator has moved since your last action. Read it any time with <code className="font-mono text-[13px] text-bone font-semibold">pendingRewards(address)</code>.</dd>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-6 py-5">
                    <dt className="sm:col-span-4 font-display font-bold text-[17px] text-bone">Reward</dt>
                    <dd className="sm:col-span-8 text-[15px] leading-relaxed text-bone-2">Call <code className="font-mono text-[13px] text-bone font-semibold">claim()</code> to receive ARGL and keep your USDG staked, or <code className="font-mono text-[13px] text-bone font-semibold">exit()</code> to withdraw your whole principal and claim in one transaction.</dd>
                  </div>
                </dl>
              </article>
            )}

            {/* =============================================================
                SECTION 03: STAKING MECHANICS
                ============================================================= */}
            {activeSection === "staking" && (
              <article className="space-y-8">
                <div className="space-y-2 border-b border-line pb-6">
                  <h2 className="font-display font-bold tracking-[-0.04em] text-3xl sm:text-[2.6rem] leading-[1.02] text-bone text-balance">
                    Staking Mechanics
                  </h2>
                  <p className="text-bone-2 text-lg leading-relaxed">
                    Standardized 2-step EVM pipeline: Approval & Deposit.
                  </p>
                </div>

                <div className="space-y-4 text-sm text-bone font-sans leading-relaxed">
                  <p>
                    In accordance with standard ERC-20 token design, staking tokens requires granting the staking contract permission to pull the specified amount from your account. The Argila interface automatically queries your current allowance and executes seamlessly:
                  </p>

                  <ol className="list-decimal list-inside space-y-2 text-xs font-mono text-bone pl-2">
                    <li><strong className="text-bone">Check Allowance:</strong> Read <code className="text-flame font-mono font-semibold">allowance(user, stakingContract)</code>.</li>
                    <li><strong className="text-bone">Approve (if insufficient):</strong> Call <code className="text-flame font-mono font-semibold">token.approve(stakingContract, amount)</code>.</li>
                    <li><strong className="text-bone">Execute Stake:</strong> Call <code className="text-flame font-mono font-semibold">stakingContract.stake(amount)</code>.</li>
                  </ol>
                </div>

                {/* Solidity Interface Code Block */}
                <div className="rounded-xl bg-coal text-bone border border-line overflow-hidden font-mono text-xs">
                  <div className="flex items-center justify-between px-4 py-2.5 bg-bone/[0.02] border-b border-line text-bone-2">
                    <span className="flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-flame" />
                      <span className="font-semibold text-bone">ILayer5Staking.sol</span>
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          `interface ILayer5Staking {\n  function stake(uint256 amount) external;\n  function unstake(uint256 amount) external;\n  function claim() external;\n  function exit() external;\n  function earned(address account) external view returns (uint256);\n}`,
                          "sol-interface"
                        )
                      }
                      className="hover:text-bone transition flex items-center gap-1.5 font-bold cursor-pointer"
                    >
                      {copiedKey === "sol-interface" ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-flame" />
                          <span className="text-flame">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="font-mono p-4 text-bone bg-coal/40 leading-relaxed overflow-x-auto">
{`interface ILayer5Staking {
    // Deposits USDG into staking pool (requires prior approval)
    function stake(uint256 amount) external;

    // Withdraws staked USDG without forfeiting accrued rewards
    function unstake(uint256 amount) external;

    // Transfers all accumulated ARGL rewards to caller
    function claim() external;

    // Atomic combined operation: claims all rewards and withdraws full principal
    function exit() external;

    // View function calculating pending ARGL rewards for account
    function earned(address account) external view returns (uint256);
}`}
                  </pre>
                </div>
              </article>
            )}

            {/* =============================================================
                SECTION 04: REWARD MATHEMATICS
                ============================================================= */}
            {activeSection === "rewards" && (
              <article className="space-y-8">
                <div className="space-y-2 border-b border-line pb-6">
                  <h2 className="font-display font-bold tracking-[-0.04em] text-3xl sm:text-[2.6rem] leading-[1.02] text-bone text-balance">
                    Reward Mathematics
                  </h2>
                  <p className="text-bone-2 text-lg leading-relaxed">
                    A reward-per-token accumulator with constant gas cost per action.
                  </p>
                </div>

                <div className="space-y-4 text-sm text-bone font-sans leading-relaxed">
                  <p>
                    Rather than iterating through stakers in expensive and vulnerable loops, Argila computes reward distributions continuously using the cumulative integral of yield per token:
                  </p>

                  <div className="p-5 rounded-xl bg-coal border border-flame/30 font-mono text-xs text-flame leading-relaxed space-y-2">
                    <div className="text-bone-3 text-[11px] font-medium">// Global Reward Index Accumulator</div>
                    <div className="font-semibold">
                      R(t) = R(t₀) + [ (t - t₀) × rewardRate × 1e18 ] / totalStaked
                    </div>
                  </div>

                  <p className="pt-2">
                    When any user interacts with the contract or queries their pending balance, their earned rewards are derived in a single math step:
                  </p>

                  <div className="p-5 rounded-xl bg-coal border border-line font-mono text-xs text-bone leading-relaxed space-y-2">
                    <div className="text-bone-3 text-[11px] font-medium">// User Earned Calculation</div>
                    <div className="font-semibold">
                      earned(user) = [ balance(user) × ( R(t) - userRewardPerTokenPaid(user) ) ] / 1e18 + storedRewards(user)
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-coal border border-line text-xs font-mono text-bone-2 space-y-2">
                    <div className="font-display text-bone font-bold flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-flame" />
                      <span>Mathematical Invariants</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Gas cost remains constant whether there is 1 staker or 100,000 stakers.</li>
                      <li>Precision is guarded to 18 decimal places using 1e18 scaling.</li>
                      <li>Reward rates are bounded by strictly capped emission budgets.</li>
                    </ul>
                  </div>
                </div>
              </article>
            )}

            {/* =============================================================
                SECTION 05: SMART CONTRACTS & ADDRESSES
                ============================================================= */}
            {activeSection === "contracts" && (
              <article className="space-y-8">
                <div className="space-y-2 border-b border-line pb-6">
                  <h2 className="font-display font-bold tracking-[-0.04em] text-3xl sm:text-[2.6rem] leading-[1.02] text-bone text-balance">
                    Smart Contracts & Addresses
                  </h2>
                  <p className="text-bone-2 text-lg leading-relaxed">
                    Verified smart contract deployments on Robinhood Chain L2.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Staking Vault Contract */}
                  <div className="p-5 rounded-xl bg-coal border border-line space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-display text-bone font-bold">Staking Vault Contract</span>
                      <span className="text-flame text-[10px] bg-flame/10 font-bold px-2 py-0.5 rounded">Core Contract</span>
                    </div>
                    <div className="flex items-center justify-between bg-coal-2 p-3 rounded-lg border border-line text-xs font-mono shadow-inner">
                      <span className="font-mono text-bone font-bold truncate mr-2 select-all">
                        {protocolConfig.stakingContractAddress || "TBA (Announced upon Mainnet Launch)"}
                      </span>
                      {protocolConfig.stakingContractAddress && (
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(
                              protocolConfig.stakingContractAddress!,
                              "addr-vault"
                            )
                          }
                          className="text-bone-2 hover:text-bone transition shrink-0 p-1 cursor-pointer"
                        >
                          {copiedKey === "addr-vault" ? (
                            <Check className="w-3.5 h-3.5 text-flame" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Staking Asset (USDG) */}
                  <div className="p-5 rounded-xl bg-coal border border-line space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-display text-bone font-bold">Staking Asset (USDG Token)</span>
                      <span className="text-bone-2 text-[10px] font-semibold">ERC-20 (6 Decimals)</span>
                    </div>
                    <div className="flex items-center justify-between bg-coal-2 p-3 rounded-lg border border-line text-xs font-mono shadow-inner">
                      <span className="font-mono text-bone font-bold truncate mr-2 select-all">
                        {protocolConfig.stakeTokenAddress || "TBA (Announced upon Mainnet Launch)"}
                      </span>
                      {protocolConfig.stakeTokenAddress && (
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(
                              protocolConfig.stakeTokenAddress!,
                              "addr-usdg"
                            )
                          }
                          className="text-bone-2 hover:text-bone transition shrink-0 p-1 cursor-pointer"
                        >
                          {copiedKey === "addr-usdg" ? (
                            <Check className="w-3.5 h-3.5 text-flame" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Reward Token */}
                  <div className="p-5 rounded-xl bg-coal border border-line space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-display text-bone font-bold">Reward Asset</span>
                      <span className="text-bone-2 text-[10px] font-semibold">ERC-20 (18 Decimals)</span>
                    </div>
                    <div className="flex items-center justify-between bg-coal-2 p-3 rounded-lg border border-line text-xs font-mono shadow-inner">
                      <span className="font-mono text-bone font-bold truncate mr-2 select-all">
                        {protocolConfig.rewardTokenAddress || "TBA (Announced upon Mainnet Launch)"}
                      </span>
                      {protocolConfig.rewardTokenAddress && (
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(
                              protocolConfig.rewardTokenAddress!,
                              "addr-reward"
                            )
                          }
                          className="text-bone-2 hover:text-bone transition shrink-0 p-1 cursor-pointer"
                        >
                          {copiedKey === "addr-reward" ? (
                            <Check className="w-3.5 h-3.5 text-flame" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            )}

            {/* =============================================================
                SECTION 06: SECURITY ARCHITECTURE
                ============================================================= */}
            {activeSection === "security" && (
              <article className="space-y-8">
                <div className="space-y-2 border-b border-line pb-6">
                  <h2 className="font-display font-bold tracking-[-0.04em] text-3xl sm:text-[2.6rem] leading-[1.02] text-bone text-balance">
                    Security Architecture
                  </h2>
                  <p className="text-bone-2 text-lg leading-relaxed">
                    How the contract guards against common smart contract vulnerabilities.
                  </p>
                </div>

                <dl className="surface divide-y divide-line px-5 sm:px-8 py-2">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-6 py-5">
                    <dt className="sm:col-span-4 font-display font-bold text-[17px] text-bone">Reentrancy protection</dt>
                    <dd className="sm:col-span-8 text-[15px] leading-relaxed text-bone-2">Every state-changing user function uses OpenZeppelin&apos;s <code className="font-mono text-[13px] text-bone font-semibold">ReentrancyGuard</code>, and balances are updated before tokens are transferred.</dd>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-6 py-5">
                    <dt className="sm:col-span-4 font-display font-bold text-[17px] text-bone">SafeERC20 transfers</dt>
                    <dd className="sm:col-span-8 text-[15px] leading-relaxed text-bone-2">Token transfers go through OpenZeppelin&apos;s <code className="font-mono text-[13px] text-bone font-semibold">SafeERC20</code>, which handles non-standard return values and reverts.</dd>
                  </div>
                </dl>
              </article>
            )}

            {/* =============================================================
                SECTION 07: ROBINHOOD CHAIN L2
                ============================================================= */}
            {activeSection === "robinhood-chain" && (
              <article className="space-y-8">
                <div className="space-y-2 border-b border-line pb-6">
                  <h2 className="font-display font-bold tracking-[-0.04em] text-3xl sm:text-[2.6rem] leading-[1.02] text-bone text-balance">
                    Robinhood Chain L2
                  </h2>
                  <p className="text-bone-2 text-lg leading-relaxed">
                    Network parameters and direct wallet RPC connection details.
                  </p>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-4 rounded-xl bg-coal border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-bone-3 font-medium">Network Name</span>
                    <span className="text-bone font-bold">{protocolConfig.chainName}</span>
                  </div>

                  <div className="p-4 rounded-xl bg-coal border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-bone-3 font-medium">Chain ID</span>
                    <span className="text-flame font-bold">{protocolConfig.chainId}</span>
                  </div>

                  <div className="p-4 rounded-xl bg-coal border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-bone-3 font-medium">Gas Currency</span>
                    <span className="text-bone font-bold">{protocolConfig.gasAsset} (18 Decimals)</span>
                  </div>

                  <div className="p-4 rounded-xl bg-coal border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-bone-3 font-medium">RPC Endpoint</span>
                    <div className="flex items-center gap-2">
                      <span className="text-bone font-bold select-all">{protocolConfig.rpcUrl}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(protocolConfig.rpcUrl, "rpc-url")}
                        className="text-bone-2 hover:text-bone cursor-pointer"
                      >
                        {copiedKey === "rpc-url" ? (
                          <Check className="w-3.5 h-3.5 text-flame" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={handleAddNetwork}
                      className="btn btn-hot w-full"
                    >
                      <Network className="w-4 h-4" />
                      <span>Connect / Add Network to MetaMask & Rabby</span>
                    </button>
                  </div>
                </div>
              </article>
            )}

            {/* =============================================================
                SECTION 08: FAQ & SUPPORT
                ============================================================= */}
            {activeSection === "faq" && (
              <article className="space-y-8">
                <div className="space-y-2 border-b border-line pb-6">
                  <h2 className="font-display font-bold tracking-[-0.04em] text-3xl sm:text-[2.6rem] leading-[1.02] text-bone text-balance">
                    Frequently Asked Questions
                  </h2>
                  <p className="text-bone-2 text-lg leading-relaxed">
                    Clear answers to protocol fundamentals, yield mechanics, and security guarantees.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-5 rounded-xl bg-coal border border-line space-y-2">
                    <h3 className="text-bone font-bold font-sans text-sm">
                      Are my staked USDG tokens locked for any minimum time period?
                    </h3>
                    <p className="text-xs text-bone-2 leading-relaxed font-sans">
                      No. Argila strictly follows a zero lockup policy. You may unstake any portion or 100% of your principal at any moment without penalty or withdrawal fees.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-coal border border-line space-y-2">
                    <h3 className="text-bone font-bold font-sans text-sm">
                      How frequently do staking rewards accrue?
                    </h3>
                    <p className="text-xs text-bone-2 leading-relaxed font-sans">
                      Rewards accrue continuously per second / per block. Your pending balance updates in real-time on your dashboard as new blocks are finalized on Robinhood Chain.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-coal border border-line space-y-2">
                    <h3 className="text-bone font-bold font-sans text-sm">
                      Can I claim my ARGL rewards without withdrawing my staked USDG?
                    </h3>
                    <p className="text-xs text-bone-2 leading-relaxed font-sans">
                      Yes. Calling the <code className="text-flame font-mono font-semibold">claim()</code> function transfers all accrued yield directly to your wallet while leaving your staked deposit intact to continue earning.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-coal border border-line space-y-2">
                    <h3 className="text-bone font-bold font-sans text-sm">
                      What wallet software is compatible with Argila?
                    </h3>
                    <p className="text-xs text-bone-2 leading-relaxed font-sans">
                      Any standard EVM-compatible Web3 wallet, including MetaMask, Rabby, Coinbase Wallet, Rainbow, and WalletConnect v2 mobile apps.
                    </p>
                  </div>
                </div>
              </article>
            )}

            {/* Bottom Section Pager Navigation */}
            <div className="pt-8 border-t border-line flex items-center justify-between text-xs font-mono">
              {prevSection ? (
                <button
                  type="button"
                  onClick={() => {
                    setActiveSection(prevSection.id);
                    window.scrollTo({ top: 120, behavior: "smooth" });
                  }}
                  className="flex items-center gap-2 text-bone-2 hover:text-bone transition cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{prevSection.title}</span>
                </button>
              ) : (
                <div />
              )}

              {nextSection ? (
                <button
                  type="button"
                  onClick={() => {
                    setActiveSection(nextSection.id);
                    window.scrollTo({ top: 120, behavior: "smooth" });
                  }}
                  className="flex items-center gap-2 text-flame hover:text-bone transition font-bold cursor-pointer"
                >
                  <span>{nextSection.title}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <div />
              )}
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}
