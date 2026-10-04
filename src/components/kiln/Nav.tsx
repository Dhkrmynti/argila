"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useAccount } from "wagmi";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { Menu, X } from "lucide-react";
import { formatAddress } from "@/lib/utils/formatters";
import { protocolConfig } from "@/lib/blockchain/config";
import { WalletConnectModal } from "@/components/Wallet/WalletConnectModal";
import { Wordmark } from "./Logo";

const LINKS = [
  { label: "Kiln", href: "/stake" },
  { label: "My firing", href: "/position" },
  { label: "Stats", href: "/stats" },
  { label: "Docs", href: "/docs" },
];

export const Nav: React.FC = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

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
      <header className="fixed top-0 inset-x-0 z-50 px-3 sm:px-5 pt-3 sm:pt-4">
        <div
          className={`mx-auto max-w-6xl h-14 sm:h-16 pl-4 sm:pl-5 pr-2 flex items-center justify-between gap-3 rounded-full border transition-all duration-500 ${
            scrolled || open
              ? "bg-coal-2/80 border-line-strong backdrop-blur-xl shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)]"
              : "bg-coal/30 border-line backdrop-blur-md"
          }`}
        >
          <Link href="/" className="shrink-0" aria-label="Argila home">
            <Wordmark />
          </Link>

          <nav aria-label="Primary" className="hidden md:flex items-center gap-1 p-1 rounded-full">
            {LINKS.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative px-4 h-9 inline-flex items-center rounded-full text-[14.5px] font-medium transition-colors ${
                    active ? "text-coal" : "text-bone-2 hover:text-bone"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-bone"
                      transition={{ type: "spring", stiffness: 420, damping: 36 }}
                    />
                  )}
                  <span className="relative">{l.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openWallet}
              className={`btn !h-10 sm:!h-11 !px-4 sm:!px-5 !text-[14px] ${isConnected && address ? "btn-ghost" : "btn-hot"}`}
            >
              {isConnected && address ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-glow animate-pulse-dot" aria-hidden="true" />
                  <span className="font-mono text-[12.5px] tnum">{formatAddress(address)}</span>
                </>
              ) : (
                <span>
                  Connect<span className="hidden sm:inline"> wallet</span>
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="md:hidden w-10 h-10 grid place-items-center rounded-full border border-line-strong text-bone cursor-pointer"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X className="w-[18px] h-[18px]" /> : <Menu className="w-[18px] h-[18px]" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 md:hidden bg-coal/95 backdrop-blur-xl pt-24 px-5"
          >
            <nav aria-label="Mobile" className="flex flex-col">
              {[{ label: "Home", href: "/" }, ...LINKS].map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={l.href}
                    className={`block py-4 border-b border-line font-display font-semibold text-4xl tracking-tight ${
                      pathname === l.href ? "text-heat" : "text-bone"
                    }`}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <p className="mt-8 flex items-center gap-2 font-mono text-[12px] text-bone-3">
              <span className="w-1.5 h-1.5 rounded-full bg-glow animate-pulse-dot" aria-hidden="true" />
              Robinhood Chain · {protocolConfig.chainId}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <WalletConnectModal isOpen={walletModalOpen} onClose={() => setWalletModalOpen(false)} />
    </>
  );
};

export default Nav;
