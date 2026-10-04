"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount } from "wagmi";
import { useConnectModal, useAccountModal } from "@rainbow-me/rainbowkit";
import { formatAddress } from "@/lib/utils/formatters";
import { protocolConfig } from "@/lib/blockchain/config";
import { WalletConnectModal } from "@/components/Wallet/WalletConnectModal";
import { GuillocheRosette } from "@/components/vault/Guilloche";
import { ArrowUpRight, Menu, X } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

export const LandingNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const pathname = usePathname();

  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Deposit", href: "/stake" },
    { label: "Firing log", href: "/position" },
    { label: "Report", href: "/stats" },
    { label: "Docs", href: "/docs" },
  ];

  const openWallet = () => {
    if (isConnected && address) {
      if (openAccountModal) openAccountModal();
      else setWalletModalOpen(true);
    } else if (openConnectModal) {
      openConnectModal();
    } else {
      setWalletModalOpen(true);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 text-paper transition-[background-color,box-shadow] duration-500 ease-vault ${
          isScrolled || isOpen
            ? "bg-ink/95 shadow-[0_14px_30px_-18px_rgba(0,0,0,0.85)] backdrop-blur-[6px]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[88rem] mx-auto h-16 sm:h-[76px] px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-4">
          <Link href="/" onClick={() => setIsOpen(false)} className="group flex items-center gap-2 sm:gap-3 select-none shrink-0">
            <span className="relative w-9 h-9 grid place-items-center">
              <GuillocheRosette className="absolute inset-0 w-full h-full text-terra transition-transform duration-[1.4s] ease-vault group-hover:rotate-90" />
              <img src="/argila-logo-terra.png" alt="" className="relative w-[22px] h-[22px] object-contain" />
            </span>
            <span className="font-display font-extrabold text-[14px] min-[390px]:text-[15px] sm:text-[21px] leading-none tracking-[0.02em] min-[390px]:tracking-[0.03em] sm:tracking-[0.06em] whitespace-nowrap">ARGILA</span>
          </Link>

          <nav aria-label="Primary" className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative px-4 py-2 wide text-[15px] font-medium transition-colors duration-300 ${
                    isActive ? "text-paper" : "text-paper-dim hover:text-paper"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-rule"
                      transition={{ type: "spring", stiffness: 380, damping: 34 }}
                      className="absolute left-4 right-4 -bottom-0.5 h-px bg-terra-hi"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <span className="hidden xl:flex items-center gap-2 px-2 py-1 bg-ink/85 font-mono text-[11px] tracking-[0.04em] text-paper-dim select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-terra tick-dot" aria-hidden="true" />
              Robinhood Chain · {protocolConfig.chainId}
            </span>

            <button
              type="button"
              onClick={openWallet}
              className={`btn !h-10 !px-3 min-[390px]:!px-4 sm:!px-5 !text-[14px] ${isConnected && address ? "btn-line" : "btn-paper"}`}
              title={isConnected ? "Account" : "Connect wallet"}
            >
              {isConnected && address ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-terra-hi" aria-hidden="true" />
                  <span className="font-mono text-[12px] tnum">{formatAddress(address)}</span>
                </>
              ) : (
                <span>
                  Connect<span className="hidden sm:inline"> wallet</span>
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden grid place-items-center w-10 h-10 border border-terra/45 text-paper hover:border-terra-hi transition-colors cursor-pointer"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <motion.div
          initial={false}
          animate={{ opacity: isScrolled || isOpen ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="band-wave h-[10px] text-terra/40"
          aria-hidden="true"
        />
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-nav"
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.7, ease }}
            className="fixed inset-0 z-40 bg-ink-3 text-paper flex flex-col justify-between px-6 pt-28 pb-8 overflow-y-auto lg:hidden"
          >
            <GuillocheRosette
              spin
              className="pointer-events-none absolute -right-40 top-1/3 w-[34rem] h-[34rem] text-terra/25"
            />
            <ul className="relative w-full max-w-lg mx-auto">
              {navLinks.map((item, idx) => {
                const isActive = pathname === item.href;
                return (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.18 + 0.06 * idx, duration: 0.55, ease }}
                    className="border-b border-terra/20"
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                      className="flex items-baseline justify-between py-4"
                    >
                      <span className={`font-display font-extrabold text-[2.6rem] leading-none ${isActive ? "text-terra-hi" : ""}`}>
                        {item.label}
                      </span>
                      <span className="font-mono text-[11px] text-paper-faint">{item.href === "/" ? "/" : item.href}</span>
                    </Link>
                  </motion.li>
                );
              })}
            </ul>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="relative w-full max-w-lg mx-auto space-y-5"
            >
              <div className="band-wave text-terra/40" aria-hidden="true" />
              <div className="flex items-center justify-between text-[15px] wide text-paper-dim">
                <a
                  href={`${protocolConfig.explorerUrl}/address/${protocolConfig.stakingContractAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-paper"
                >
                  Explorer <ArrowUpRight className="w-4 h-4" />
                </a>
                <a
                  href="https://x.com/argilaxyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-paper"
                >
                  X @argilaxyz <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <WalletConnectModal isOpen={walletModalOpen} onClose={() => setWalletModalOpen(false)} />
    </>
  );
};
