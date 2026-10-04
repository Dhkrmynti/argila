"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccount } from "wagmi";
import gsap from "gsap";
import { formatAddress } from "@/lib/utils/formatters";
import { useConnectModal, useAccountModal } from "@rainbow-me/rainbowkit";
import { WalletConnectModal } from "../Wallet/WalletConnectModal";
import { Layer5Emblem } from "../Brand/Layer5Emblem";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { Wallet, ShieldCheck, ExternalLink } from "lucide-react";
import { protocolConfig } from "@/lib/blockchain/config";
import "./kinetic-nav.css";

interface NavItem {
  id: string;
  num: string;
  label: string;
  href: string;
  isExternal?: boolean;
}

export const SterlingGateNav: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();

  const navItems: NavItem[] = [
    { id: "1", num: "01", label: "PROTOCOL", href: "/" },
    { id: "2", num: "02", label: "STAKE", href: "/stake" },
    { id: "3", num: "03", label: "POSITION", href: "/position" },
    { id: "4", num: "04", label: "STATS", href: "/stats" },
    { id: "5", num: "05", label: "DOCS", href: "/docs" },
  ];

  // Track page scroll for sleek navbar compression
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Ambient shape reactive hover animations
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const items = containerRef.current?.querySelectorAll<HTMLElement>(".sg-menu-list-item[data-shape]");
      const ambientContainer = containerRef.current?.querySelector<HTMLElement>(".sg-ambient-background-shapes");

      items?.forEach((item) => {
        const shapeId = item.getAttribute("data-shape");
        const shape = ambientContainer?.querySelector<HTMLElement>(`.bg-shape-${shapeId}`);
        if (!shape) return;

        const elements = shape.querySelectorAll<SVGElement>(".sg-shape-element");

        const onEnter = () => {
          ambientContainer?.querySelectorAll(".sg-bg-shape").forEach((s) => s.classList.remove("active"));
          shape.classList.add("active");
          gsap.fromTo(
            elements,
            { scale: 0.6, opacity: 0, rotation: -12 },
            { scale: 1, opacity: 1, rotation: 0, duration: 0.6, stagger: 0.07, ease: "back.out(1.7)", overwrite: "auto" }
          );
        };

        const onLeave = () => {
          gsap.to(elements, {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => shape.classList.remove("active"),
            overwrite: "auto",
          });
        };

        item.addEventListener("mouseenter", onEnter);
        item.addEventListener("mouseleave", onLeave);

        (item as any)._cleanup = () => {
          item.removeEventListener("mouseenter", onEnter);
          item.removeEventListener("mouseleave", onLeave);
        };
      });
    }, containerRef);

    return () => {
      ctx.revert();
      containerRef.current?.querySelectorAll<HTMLElement>(".sg-menu-list-item[data-shape]").forEach((it: any) => {
        if (it._cleanup) it._cleanup();
      });
    };
  }, []);

  // Main drawer open/close kinetic timeline
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const overlayWrapper = containerRef.current?.querySelector<HTMLElement>(".sg-nav-overlay-wrapper");
      const menuContent = containerRef.current?.querySelector<HTMLElement>(".sg-menu-content");
      const overlay = containerRef.current?.querySelector<HTMLElement>(".sg-overlay");
      const backdrops = containerRef.current?.querySelectorAll<HTMLElement>(".sg-backdrop-layer");
      const links = containerRef.current?.querySelectorAll<HTMLElement>(".sg-nav-link");
      const menuBtn = containerRef.current?.querySelector<HTMLElement>(".sg-nav-close-btn");
      const btnTexts = menuBtn?.querySelectorAll<HTMLElement>("p");
      const btnIcon = menuBtn?.querySelector<HTMLElement>(".sg-menu-button-icon");
      const fadeElements = containerRef.current?.querySelectorAll<HTMLElement>("[data-menu-fade]");

      if (!overlayWrapper || !menuContent || !overlay) return;

      const tl = gsap.timeline();

      if (isOpen) {
        overlayWrapper.setAttribute("data-nav", "open");
        tl.set(overlayWrapper, { display: "block" })
          .set(menuContent, { xPercent: 0 }, "<");

        if (btnTexts && btnTexts.length > 0) {
          tl.fromTo(btnTexts, { yPercent: 0 }, { yPercent: -100, stagger: 0.15, duration: 0.4 }, "<");
        }

        if (btnIcon) {
          tl.fromTo(btnIcon, { rotate: 0 }, { rotate: 315, duration: 0.5, ease: "power2.out" }, "<");
        }

        tl.fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, "<");

        if (backdrops && backdrops.length > 0) {
          tl.fromTo(
            backdrops,
            { xPercent: 101 },
            { xPercent: 0, stagger: 0.1, duration: 0.55, ease: "power3.out" },
            "<"
          );
        }

        if (links && links.length > 0) {
          tl.fromTo(
            links,
            { yPercent: 120, rotate: 6, opacity: 0 },
            { yPercent: 0, rotate: 0, opacity: 1, stagger: 0.06, duration: 0.5, ease: "power3.out" },
            "<+=0.25"
          );
        }

        if (fadeElements && fadeElements.length > 0) {
          tl.fromTo(
            fadeElements,
            { autoAlpha: 0, yPercent: 20 },
            { autoAlpha: 1, yPercent: 0, stagger: 0.05, duration: 0.4, clearProps: "all" },
            "<+=0.1"
          );
        }
      } else {
        overlayWrapper.setAttribute("data-nav", "closed");
        tl.to(overlay, { autoAlpha: 0, duration: 0.35 })
          .to(menuContent, { xPercent: 110, duration: 0.45, ease: "power3.in" }, "<");

        if (btnTexts && btnTexts.length > 0) {
          tl.to(btnTexts, { yPercent: 0, duration: 0.35 }, "<");
        }

        if (btnIcon) {
          tl.to(btnIcon, { rotate: 0, duration: 0.35 }, "<");
        }

        tl.set(overlayWrapper, { display: "none" });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [isOpen]);

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <div ref={containerRef} className="relative z-50">
      {/* Top Header Bar */}
      <header
        className={`sg-header-wrapper px-2 sm:px-8 transition-all duration-500 ${
          isScrolled ? "py-2 sm:py-3" : "py-3 sm:py-6"
        }`}
      >
        <div
          className={`mx-auto flex items-center justify-between transition-all duration-500 pointer-events-auto ${
            isScrolled
              ? "max-w-6xl px-3 sm:px-6 py-2 sm:py-2.5 rounded-full liquid-glass-nav shadow-2xl shadow-black/70 border border-white/15"
              : "max-w-7xl px-2 py-1 bg-transparent"
          }`}
        >
          {/* Logo -> Protocol Home */}
          <Link
            href="/"
            onClick={closeMenu}
            className="pointer-events-auto flex items-center gap-2 sm:gap-3 group select-none"
          >
            <div className="transition-transform duration-300 group-hover:scale-105 group-hover:rotate-6">
              <Layer5Emblem size={26} variant={isScrolled ? "white" : "black"} animate={false} />
            </div>
            <div className="flex flex-col">
              <span className={`text-sm sm:text-base font-bold tracking-[0.2em] sm:tracking-[0.22em] uppercase font-sans ${isScrolled ? "text-white" : "text-[#1C1B18]"}`}>
                Argila
              </span>
              {!isScrolled && (
                <span className="hidden sm:inline text-[8px] font-mono tracking-[0.3em] text-[#6B665E] uppercase">
                  ROBINHOOD CHAIN
                </span>
              )}
            </div>
          </Link>

          {/* Right Action Cluster: Wallet Connect + Sterling Gate Kinetic Trigger */}
          <div className="sg-nav-right">
            {/* Wallet Action Button */}
            {isConnected && address ? (
              <button
                type="button"
                onClick={() => {
                  if (openAccountModal) {
                    openAccountModal();
                  } else {
                    setWalletModalOpen(true);
                  }
                }}
                className="group relative flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-4 py-2 rounded-full bg-[#10131d] border border-white/20 hover:border-[#c8f53c] transition-all duration-300 shadow-xl shadow-black/60 hover:shadow-[0_0_18px_rgba(200,245,60,0.25)] cursor-pointer select-none"
                title="View Connected Account & Balances"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c8f53c] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c8f53c] shadow-[0_0_8px_#c8f53c]" />
                </span>

                <span className="font-mono text-xs sm:text-sm font-bold text-white tracking-wider group-hover:text-[#c8f53c] transition-colors">
                  {formatAddress(address)}
                </span>

                <span className="text-xs text-[#8e95a2] font-mono group-hover:text-white transition-colors">
                  ▾
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (openConnectModal) {
                    openConnectModal();
                  } else {
                    setWalletModalOpen(true);
                  }
                }}
                className="group relative flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#B8F34A] text-[#10170e] hover:bg-[#cbfb65] border border-[#B8F34A] font-mono text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(184,243,74,0.3)] hover:shadow-[0_0_28px_rgba(184,243,74,0.5)] hover:scale-[1.03] active:scale-[0.97] cursor-pointer select-none"
                title="Connect Web3 Wallet"
              >
                <Wallet className="w-4 h-4 text-[#10170e] transition-transform group-hover:scale-110" />
                <span>
                  <span className="hidden sm:inline">CONNECT </span>WALLET
                </span>
              </button>
            )}


            <button
              type="button"
              className="sg-nav-close-btn"
              onClick={toggleMenu}
              aria-label="Toggle Navigation Drawer"
            >
              <div className="sg-menu-button-text">
                <p>Menu</p>
                <p>Close</p>
              </div>
              <div className="sg-icon-wrap">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="sg-menu-button-icon"
                >
                  <path
                    d="M7.33333 16L7.33333 -3.2055e-07L8.66667 -3.78832e-07L8.66667 16L7.33333 16Z"
                    fill="currentColor"
                  />
                  <path
                    d="M16 8.66667L-2.62269e-07 8.66667L-3.78832e-07 7.33333L16 7.33333L16 8.66667Z"
                    fill="currentColor"
                  />
                  <path
                    d="M6 7.33333L7.33333 7.33333L7.33333 6C7.33333 6.73637 6.73638 7.33333 6 7.33333Z"
                    fill="currentColor"
                  />
                  <path
                    d="M10 7.33333L8.66667 7.33333L8.66667 6C8.66667 6.73638 9.26362 7.33333 10 7.33333Z"
                    fill="currentColor"
                  />
                  <path
                    d="M6 8.66667L7.33333 8.66667L7.33333 10C7.33333 9.26362 6.73638 8.66667 6 8.66667Z"
                    fill="currentColor"
                  />
                  <path
                    d="M10 8.66667L8.66667 8.66667L8.66667 10C8.66667 9.26362 9.26362 8.66667 10 8.66667Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Kinetic Navigation Fullscreen Drawer Overlay */}
      <section className="sg-nav-overlay-wrapper" data-nav="closed">
        {/* Backdrop Darkening Layer */}
        <div className="sg-overlay" onClick={closeMenu} />

        {/* Sliding Kinetic Drawer Panel */}
        <nav className="sg-menu-content">
          {/* Multi-tier Curved Backdrops */}
          <div className="sg-menu-bg">
            <div className="sg-backdrop-layer first" />
            <div className="sg-backdrop-layer second" />
            <div className="sg-backdrop-layer main" />

            {/* Reactive Ambient Background Shapes */}
            <div className="sg-ambient-background-shapes">
              {/* Shape 1: Protocol / Core Staking Orbital Circles */}
              <svg className="sg-bg-shape bg-shape-1" viewBox="0 0 400 400" fill="none">
                <circle className="sg-shape-element" cx="90" cy="110" r="45" fill="rgba(200,245,60,0.18)" />
                <circle className="sg-shape-element" cx="310" cy="90" r="65" fill="rgba(99,102,241,0.16)" />
                <circle className="sg-shape-element" cx="190" cy="310" r="85" fill="rgba(200,245,60,0.12)" />
                <circle className="sg-shape-element" cx="340" cy="270" r="35" fill="rgba(56,189,248,0.15)" />
              </svg>

              {/* Shape 2: Stake / Sine Flow Waves */}
              <svg className="sg-bg-shape bg-shape-2" viewBox="0 0 400 400" fill="none">
                <path
                  className="sg-shape-element"
                  d="M0 180 Q100 80, 200 180 T 400 180"
                  stroke="rgba(200,245,60,0.22)"
                  strokeWidth="50"
                  fill="none"
                />
                <path
                  className="sg-shape-element"
                  d="M0 270 Q100 170, 200 270 T 400 270"
                  stroke="rgba(99,102,241,0.18)"
                  strokeWidth="35"
                  fill="none"
                />
              </svg>

              {/* Shape 3: Position / Matrix Constellation Dots */}
              <svg className="sg-bg-shape bg-shape-3" viewBox="0 0 400 400" fill="none">
                <circle className="sg-shape-element" cx="60" cy="60" r="9" fill="rgba(200,245,60,0.3)" />
                <circle className="sg-shape-element" cx="160" cy="60" r="9" fill="rgba(56,189,248,0.3)" />
                <circle className="sg-shape-element" cx="260" cy="60" r="9" fill="rgba(200,245,60,0.3)" />
                <circle className="sg-shape-element" cx="360" cy="60" r="9" fill="rgba(99,102,241,0.3)" />
                <circle className="sg-shape-element" cx="110" cy="160" r="13" fill="rgba(200,245,60,0.25)" />
                <circle className="sg-shape-element" cx="210" cy="160" r="13" fill="rgba(56,189,248,0.25)" />
                <circle className="sg-shape-element" cx="310" cy="160" r="13" fill="rgba(200,245,60,0.25)" />
                <circle className="sg-shape-element" cx="60" cy="260" r="11" fill="rgba(99,102,241,0.3)" />
                <circle className="sg-shape-element" cx="160" cy="260" r="11" fill="rgba(56,189,248,0.3)" />
                <circle className="sg-shape-element" cx="260" cy="260" r="11" fill="rgba(56,189,248,0.3)" />
                <circle className="sg-shape-element" cx="360" cy="260" r="11" fill="rgba(200,245,60,0.3)" />
              </svg>

              {/* Shape 4: Stats / Analytic Geometric Petals */}
              <svg className="sg-bg-shape bg-shape-4" viewBox="0 0 400 400" fill="none">
                <path
                  className="sg-shape-element"
                  d="M100 100 Q150 50, 200 100 Q250 150, 200 200 Q150 250, 100 200 Q50 150, 100 100"
                  fill="rgba(200,245,60,0.15)"
                />
                <path
                  className="sg-shape-element"
                  d="M240 190 Q290 140, 340 190 Q390 240, 340 290 Q290 340, 240 290 Q190 240, 240 190"
                  fill="rgba(56,189,248,0.12)"
                />
              </svg>

              {/* Shape 5: Docs / Kinetic Diagonal Beams */}
              <svg className="sg-bg-shape bg-shape-5" viewBox="0 0 400 400" fill="none">
                <line
                  className="sg-shape-element"
                  x1="0"
                  y1="90"
                  x2="310"
                  y2="400"
                  stroke="rgba(200,245,60,0.2)"
                  strokeWidth="28"
                />
                <line
                  className="sg-shape-element"
                  x1="90"
                  y1="0"
                  x2="390"
                  y2="300"
                  stroke="rgba(99,102,241,0.16)"
                  strokeWidth="22"
                />
                <line
                  className="sg-shape-element"
                  x1="190"
                  y1="0"
                  x2="390"
                  y2="200"
                  stroke="rgba(56,189,248,0.14)"
                  strokeWidth="18"
                />
              </svg>
            </div>
          </div>

          {/* Drawer Inner Content */}
          <div className="sg-menu-content-wrapper">
            {/* Top Close Button inside drawer for mobile */}
            <div className="flex items-center justify-between px-6 pb-4 sm:hidden">
              <span className="font-mono text-xs tracking-widest text-[#c8f53c] uppercase">
                NAVIGATION
              </span>
              <button
                onClick={closeMenu}
                className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                ✕
              </button>
            </div>

            {/* Kinetic Nav List */}
            <ul className="sg-menu-list">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/" || pathname === "/protocol"
                    : pathname === item.href || pathname.startsWith(item.href);

                return (
                  <li
                    key={item.id}
                    className="sg-menu-list-item"
                    data-shape={item.id}
                  >
                    {item.isExternal ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="sg-nav-link"
                        onClick={closeMenu}
                      >
                        <span className="sg-eyebrow">{item.num}</span>
                        <p className="sg-nav-link-text flex items-center gap-4">
                          {item.label}
                          <ExternalLink className="w-5 h-5 opacity-40 inline" />
                        </p>
                        <div className="sg-nav-link-hover-bg" />
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className="sg-nav-link"
                        onClick={closeMenu}
                      >
                        <span
                          className={`sg-eyebrow ${
                            isActive ? "text-[#c8f53c] font-black" : ""
                          }`}
                        >
                          {item.num}
                        </span>
                        <p
                          className={`sg-nav-link-text ${
                            isActive ? "text-[#c8f53c]" : ""
                          }`}
                        >
                          {item.label}
                        </p>
                        <div className="sg-nav-link-hover-bg" />
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>

            {/* Bottom Details / Metadata */}
            <div className="sg-menu-details" data-menu-fade>
              <div className="flex flex-wrap items-center gap-3">
                <div className="sg-menu-badge">
                  <span className="w-2 h-2 rounded-full bg-[#c8f53c] animate-pulse" />
                  <span>Robinhood Chain Mainnet ({protocolConfig.chainId})</span>
                </div>
                <div className="sg-menu-badge">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#c8f53c]" />
                  <span>Audited Contract</span>
                </div>
              </div>

              <div className="sg-details-meta">
                <div className="sg-socials-row">
                  <a
                    href="https://x.com/argilaxyz"
                    target="_blank"
                    rel="noreferrer"
                    className="sg-social-link"
                  >
                    X (@argilaxyz)
                  </a>
                </div>
                <span className="text-[10px] text-neutral-500 font-mono">
                  ARGL PROTOCOL © 2026
                </span>
              </div>
            </div>
          </div>
        </nav>
      </section>

      {/* Wallet Connection Modal */}
      <WalletConnectModal
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
      />
    </div>
  );
};
export default SterlingGateNav;
