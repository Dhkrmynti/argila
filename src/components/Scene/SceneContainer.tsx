"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { 
  ArrowDownRight, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Layers, 
  TrendingUp, 
  Coins, 
  Activity, 
  RefreshCw,
  Cpu,
  Lock,
  ArrowRight
} from "lucide-react";
import { Auralis } from "@/components/ui/auralis";
import { useLayer5Staking } from "@/lib/hooks/useLayer5Staking";
import { formatApy } from "@/lib/utils/formatters";

export const SceneContainer: React.FC = () => {
  const { calculatedApy } = useLayer5Staking();
  const trackRef = useRef<HTMLDivElement>(null);

  // 1. Master Scroll Driver for the entire 600vh cinematic canvas
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  // Ultra-responsive, butter-smooth spring physics for organic kinetic lerp
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.8,
    restDelta: 0.0001,
  });

  // =========================================================================
  // FRAME 01: MONUMENTAL PROTOCOL REVELATION (0% -> 20%)
  // =========================================================================
  // =========================================================================
  // FRAME 01: MONUMENTAL PROTOCOL REVELATION (0% -> 20%)
  // Dynamic aperture parting exit: Title shifts Up-Left, Actions shift Down-Right
  // =========================================================================
  const f1_opacity = useTransform(smoothProgress, [0, 0.12, 0.18], [1, 1, 0]);
  const f1_scale = useTransform(smoothProgress, [0, 0.16], [1, 0.94]);
  const f1_blur = useTransform(smoothProgress, [0, 0.14, 0.18], ["blur(0px)", "blur(0px)", "blur(10px)"]);
  const f1_pointer = useTransform(smoothProgress, (v) => (v < 0.18 ? "auto" : "none"));
  const f1_title_x = useTransform(smoothProgress, [0, 0.16], [0, -70]);
  const f1_title_y = useTransform(smoothProgress, [0, 0.16], [0, -40]);
  const f1_actions_x = useTransform(smoothProgress, [0, 0.16], [0, 70]);
  const f1_actions_y = useTransform(smoothProgress, [0, 0.16], [0, 40]);

  // =========================================================================
  // FRAME 02: PROTOCOL MANIFESTO & 3 ARCHITECTURAL PILLARS (20% -> 40%)
  // Multidirectional Assembly: Header from TOP, Card 1 from LEFT, Card 2 from BOTTOM, Card 3 from RIGHT!
  // =========================================================================
  const f2_opacity = useTransform(smoothProgress, [0.15, 0.22, 0.35, 0.40], [0, 1, 1, 0]);
  const f2_scale = useTransform(smoothProgress, [0.15, 0.22, 0.35, 0.40], [0.92, 1, 1, 0.94]);
  const f2_blur = useTransform(smoothProgress, [0.15, 0.22, 0.35, 0.40], ["blur(10px)", "blur(0px)", "blur(0px)", "blur(10px)"]);
  const f2_pointer = useTransform(smoothProgress, (v) => (v >= 0.18 && v <= 0.38 ? "auto" : "none"));

  // Vectorized individual component morphs:
  const f2_header_y = useTransform(smoothProgress, [0.16, 0.24, 0.35, 0.40], [-90, 0, 0, -60]); // From TOP
  const f2_p1_x = useTransform(smoothProgress, [0.18, 0.26, 0.35, 0.40], [-180, 0, 0, -140]); // From FAR LEFT
  const f2_p2_y = useTransform(smoothProgress, [0.19, 0.27, 0.35, 0.40], [130, 0, 0, 100]); // From BOTTOM
  const f2_p3_x = useTransform(smoothProgress, [0.20, 0.28, 0.35, 0.40], [180, 0, 0, 140]); // From FAR RIGHT

  // =========================================================================
  // FRAME 03: THE CAPITAL PIPELINE (40% -> 60%)
  // Multidirectional Cross-Weave: Header from LEFT, Stage 1 from Top-Left, Stage 2 from Bottom,
  // Stage 3 from Top, Stage 4 from Bottom-Right!
  // =========================================================================
  const f3_opacity = useTransform(smoothProgress, [0.36, 0.43, 0.56, 0.61], [0, 1, 1, 0]);
  const f3_scale = useTransform(smoothProgress, [0.36, 0.43, 0.56, 0.61], [0.92, 1, 1, 0.94]);
  const f3_blur = useTransform(smoothProgress, [0.36, 0.43, 0.56, 0.61], ["blur(10px)", "blur(0px)", "blur(0px)", "blur(10px)"]);
  const f3_pointer = useTransform(smoothProgress, (v) => (v >= 0.38 && v <= 0.58 ? "auto" : "none"));

  const f3_header_x = useTransform(smoothProgress, [0.36, 0.43, 0.56, 0.61], [-120, 0, 0, -80]); // From LEFT
  // Stage 01: Top-Left diagonal entry
  const f3_s1_x = useTransform(smoothProgress, [0.37, 0.44, 0.56, 0.61], [-160, 0, 0, -100]);
  const f3_s1_y = useTransform(smoothProgress, [0.37, 0.44, 0.56, 0.61], [-60, 0, 0, -30]);
  // Stage 02: Bottom entry
  const f3_s2_y = useTransform(smoothProgress, [0.38, 0.45, 0.56, 0.61], [100, 0, 0, 60]);
  // Stage 03: Top entry
  const f3_s3_y = useTransform(smoothProgress, [0.39, 0.46, 0.56, 0.61], [-100, 0, 0, -60]);
  // Stage 04: Bottom-Right diagonal entry
  const f3_s4_x = useTransform(smoothProgress, [0.40, 0.47, 0.56, 0.61], [160, 0, 0, 100]);
  const f3_s4_y = useTransform(smoothProgress, [0.40, 0.47, 0.56, 0.61], [60, 0, 0, 30]);

  // Interactive Pipeline Stages Progress (conduit lights up sequentially)
  const pipe_stage1 = useTransform(smoothProgress, [0.38, 0.42], [0.3, 1]);
  const pipe_stage2 = useTransform(smoothProgress, [0.43, 0.47], [0.3, 1]);
  const pipe_stage3 = useTransform(smoothProgress, [0.48, 0.52], [0.3, 1]);
  const pipe_stage4 = useTransform(smoothProgress, [0.53, 0.57], [0.3, 1]);

  // =========================================================================
  // FRAME 04: YIELD TELEMETRY & RADAR (60% -> 80%)
  // Dual-Wing Horizontal Slam: Left Dashboard from FAR LEFT, Right Stats from FAR RIGHT!
  // =========================================================================
  const f4_opacity = useTransform(smoothProgress, [0.57, 0.64, 0.76, 0.81], [0, 1, 1, 0]);
  const f4_scale = useTransform(smoothProgress, [0.57, 0.64, 0.76, 0.81], [0.92, 1, 1, 0.94]);
  const f4_blur = useTransform(smoothProgress, [0.57, 0.64, 0.76, 0.81], ["blur(10px)", "blur(0px)", "blur(0px)", "blur(10px)"]);
  const f4_pointer = useTransform(smoothProgress, (v) => (v >= 0.58 && v <= 0.78 ? "auto" : "none"));

  // Wings collide horizontally to lock in place:
  const f4_left_x = useTransform(smoothProgress, [0.57, 0.65, 0.76, 0.81], [-220, 0, 0, -160]); // From FAR LEFT
  const f4_right_x = useTransform(smoothProgress, [0.57, 0.65, 0.76, 0.81], [220, 0, 0, 160]);  // From FAR RIGHT

  // =========================================================================
  // FRAME 05: PORTAL LAUNCH & MONUMENTAL COMPOSITION (80% -> 100%)
  // Top & Bottom Clamping Gateway: Headline from TOP, Actions from BOTTOM, Badges Center-Zoom
  // =========================================================================
  const f5_opacity = useTransform(smoothProgress, [0.77, 0.85, 1], [0, 1, 1]);
  const f5_scale = useTransform(smoothProgress, [0.77, 0.86, 1], [0.90, 1, 1]);
  const f5_blur = useTransform(smoothProgress, [0.77, 0.85, 1], ["blur(10px)", "blur(0px)", "blur(0px)"]);
  const f5_pointer = useTransform(smoothProgress, (v) => (v >= 0.78 ? "auto" : "none"));

  const f5_header_y = useTransform(smoothProgress, [0.77, 0.86, 1], [-100, 0, 0]); // From TOP
  const f5_actions_y = useTransform(smoothProgress, [0.78, 0.87, 1], [100, 0, 0]);  // From BOTTOM
  const f5_footer_scale = useTransform(smoothProgress, [0.79, 0.88, 1], [0.8, 1, 1]); // Zoom from CENTER

  // =========================================================================
  // CENTRAL MORPHING KINETIC CORE ENTITY (Persists & Morphs across 0% -> 100%)
  // =========================================================================
  const core_scale = useTransform(
    smoothProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [1, 1.25, 0.85, 1.15, 1.4]
  );
  const core_rotate = useTransform(smoothProgress, [0, 1], [0, 360]);
  const core_rotate_reverse = useTransform(smoothProgress, [0, 1], [360, 0]);
  const core_borderRadius = useTransform(
    smoothProgress,
    [0, 0.3, 0.6, 0.85, 1],
    ["50%", "35%", "25%", "40%", "50%"]
  );
  const core_glow_opacity = useTransform(
    smoothProgress,
    [0, 0.2, 0.5, 0.75, 1],
    [0.15, 0.25, 0.18, 0.28, 0.35]
  );

  return (
    <div ref={trackRef} className="relative w-full h-[600vh] bg-[#08090c] text-white">
      {/* =====================================================================
          FIXED VIEWPORT CINEMATIC CANVAS (100% width x 100dvh)
          ===================================================================== */}
      <div className="sticky top-0 h-[100dvh] w-full max-w-full overflow-hidden flex items-center justify-center select-none bg-[#08090c]">
        {/* Subtle Ambient Background Lighting Layers */}
        <div className="absolute inset-0 pointer-events-none -z-30">
          <motion.div
            style={{ opacity: core_glow_opacity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[800px] h-[320px] sm:h-[800px] bg-[#c8f53c] blur-[140px] sm:blur-[220px] rounded-full"
          />
          <div className="absolute bottom-10 right-10 w-[300px] sm:w-[600px] h-[250px] sm:h-[500px] bg-indigo-600/[0.04] blur-[120px] sm:blur-[180px] rounded-full" />
          <div className="absolute top-10 left-10 w-[250px] sm:w-[500px] h-[200px] sm:h-[400px] bg-sky-500/[0.03] blur-[100px] sm:blur-[160px] rounded-full" />
        </div>

        {/* 21st.dev Auralis WebGL Ambient Fluid Background (Cyber Electric Lime Theme) */}
        <div className="absolute inset-0 pointer-events-none -z-25 opacity-70">
          <Auralis
            colors={["#c8f53c", "#22c55e", "#10b981"]}
            speed={0.25}
            grain={0.45}
            className="w-full h-full bg-transparent"
          />
        </div>

        {/* ===================================================================
            THE LIVING CENTRAL MORPHING KINETIC ENTITY
            =================================================================== */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-20 overflow-hidden">
          {/* Outer Orbital Gyro Ring */}
          <motion.div
            style={{
              scale: core_scale,
              rotate: core_rotate,
              borderRadius: core_borderRadius,
            }}
            className="w-[280px] h-[280px] sm:w-[540px] sm:h-[540px] lg:w-[680px] lg:h-[680px] border border-white/[0.07] flex items-center justify-center transition-colors duration-700"
          >
            {/* Inner Counter-Rotating Ring */}
            <motion.div
              style={{ rotate: core_rotate_reverse }}
              className="w-[75%] h-[75%] rounded-full border border-dashed border-[#c8f53c]/20 flex items-center justify-center"
            >
              {/* Inner Harmonic Pulse */}
              <div className="w-[50%] h-[50%] rounded-full bg-radial from-[#c8f53c]/[0.08] via-transparent to-transparent" />
            </motion.div>
          </motion.div>
        </div>

        {/* ===================================================================
            FRAME 01: MONUMENTAL PROTOCOL REVELATION (0% -> 20%)
            =================================================================== */}
        <motion.div
          style={{
            opacity: f1_opacity,
            scale: f1_scale,
            filter: f1_blur,
            pointerEvents: f1_pointer as any,
          }}
          className="absolute inset-0 flex flex-col justify-center items-center px-4 sm:px-12 text-center max-w-5xl mx-auto"
        >
          <div className="space-y-4 sm:space-y-6">
            <motion.div style={{ x: f1_title_x, y: f1_title_y }} className="space-y-3 sm:space-y-6">
              <h1 className="font-editorial text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-[-0.02em] uppercase leading-[0.98] sm:leading-[0.95] text-white">
                FLOW CAPITAL.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#c8f53c] to-white">
                  STREAM YIELD.
                </span>
              </h1>

              <p className="text-xs sm:text-base md:text-lg text-neutral-300 max-w-2xl mx-auto font-sans leading-relaxed px-2">
                Deposit USDG to continuously stream cryptographic Argila (ARGL) yield per block.
                Zero lockup epochs. Sub-second Robinhood Chain finality.
              </p>

              <div className="flex items-center justify-center gap-2 pt-0.5 sm:pt-1 font-cursive text-lg sm:text-2xl text-[#c8f53c]">
                ~ autonomous non-custodial liquidity ~
              </div>
            </motion.div>

            <motion.div
              style={{ x: f1_actions_x, y: f1_actions_y }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4 w-full sm:w-auto"
            >
              <LiquidButton
                size="xl"
                variant="kawa"
                href="/stake"
                className="w-full sm:w-auto px-7 sm:px-9 font-mono text-xs tracking-widest uppercase font-bold shadow-2xl shadow-[#c8f53c]/30 group"
              >
                <span className="flex items-center justify-center gap-2.5">
                  <span>START STAKING</span>
                  <ArrowDownRight className="w-4 h-4 text-[#08090c]" />
                </span>
              </LiquidButton>

              <LiquidButton
                size="xl"
                variant="default"
                href="/position"
                className="w-full sm:w-auto px-6 sm:px-8 font-mono text-xs tracking-widest uppercase text-neutral-300 hover:text-white"
              >
                <span>VIEW POSITION</span>
              </LiquidButton>
            </motion.div>
          </div>
        </motion.div>

        {/* ===================================================================
            FRAME 02: PROTOCOL MANIFESTO & 3 ARCHITECTURAL PILLARS (20% -> 40%)
            Multidirectional: Header from TOP, Left from LEFT, Mid from BOTTOM, Right from RIGHT
            =================================================================== */}
        <motion.div
          style={{
            opacity: f2_opacity,
            scale: f2_scale,
            filter: f2_blur,
            pointerEvents: f2_pointer as any,
          }}
          className="absolute inset-0 flex flex-col justify-center items-center px-4 sm:px-12 max-w-6xl mx-auto"
        >
          <div className="w-full space-y-4 sm:space-y-10">
            {/* Header comes from TOP */}
            <motion.div style={{ y: f2_header_y }} className="space-y-1.5 sm:space-y-3 text-center sm:text-left">
              <h2 className="font-editorial text-xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-white leading-tight">
                CAPITAL THAT <span className="text-[#c8f53c]">KEEPS MOVING</span>
              </h2>
              <p className="text-[11px] sm:text-sm font-mono text-neutral-400 max-w-xl">
                Traditional staking traps liquidity in multi-week cooldown epochs. Argila replaces friction with continuous streaming yield.
              </p>
            </motion.div>

            {/* 3 Physical Architecture Cards with Inward Kinetic Entrance */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-5">
              <motion.div style={{ x: f2_p1_x }} className="sg-tier-container">
                <div className="sg-tier-underlay-1" />
                <div className="sg-tier-underlay-2" />
                <div className="sg-tier-main p-3.5 sm:p-7 space-y-2 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#c8f53c]">01</span>
                    <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#c8f53c]" />
                  </div>
                  <h3 className="font-editorial text-base sm:text-2xl font-bold uppercase text-white">ZERO LOCKUPS</h3>
                  <p className="text-[11px] sm:text-xs text-neutral-300 font-sans leading-relaxed">
                    Deposit or exit your USDG principal at any second. Zero unbonding delays or lockup penalties.
                  </p>
                  <div className="text-[9px] sm:text-[10px] font-mono text-neutral-500 pt-1.5 sm:pt-2 border-t border-white/5">
                    INSTANT CAPITAL MOBILITY
                  </div>
                </div>
              </motion.div>

              <motion.div style={{ y: f2_p2_y }} className="sg-tier-container">
                <div className="sg-tier-underlay-1" />
                <div className="sg-tier-underlay-2" />
                <div className="sg-tier-main p-3.5 sm:p-7 space-y-2 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#c8f53c]">02</span>
                    <Cpu className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#c8f53c]" />
                  </div>
                  <h3 className="font-editorial text-base sm:text-2xl font-bold uppercase text-white">O(1) ACCOUNTING</h3>
                  <p className="text-[11px] sm:text-xs text-neutral-300 font-sans leading-relaxed">
                    Synthetix constant-time algorithmic indices. Gas fees remain micro-cent whether 10 or 1,000,000 stakers.
                  </p>
                  <div className="text-[9px] sm:text-[10px] font-mono text-neutral-500 pt-1.5 sm:pt-2 border-t border-white/5">
                    CONSTANT-TIME EFFICIENCY
                  </div>
                </div>
              </motion.div>

              <motion.div style={{ x: f2_p3_x }} className="sg-tier-container">
                <div className="sg-tier-underlay-1" />
                <div className="sg-tier-underlay-2" />
                <div className="sg-tier-main p-3.5 sm:p-7 space-y-2 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#c8f53c]">03</span>
                    <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#c8f53c]" />
                  </div>
                  <h3 className="font-editorial text-base sm:text-2xl font-bold uppercase text-white">BLOCK ACCRUAL</h3>
                  <p className="text-[11px] sm:text-xs text-neutral-300 font-sans leading-relaxed">
                    Rewards accrue continuously per confirmed block on Robinhood Chain, streamed directly into your ledger balance.
                  </p>
                  <div className="text-[9px] sm:text-[10px] font-mono text-neutral-500 pt-1.5 sm:pt-2 border-t border-white/5">
                    SUB-SECOND TICK FINALITY
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* ===================================================================
            FRAME 03: THE CAPITAL PIPELINE (40% -> 60%)
            Multidirectional: Header from LEFT, Stage 1 Top-Left, Stage 2 Bottom,
            Stage 3 Top, Stage 4 Bottom-Right
            =================================================================== */}
        <motion.div
          style={{
            opacity: f3_opacity,
            scale: f3_scale,
            filter: f3_blur,
            pointerEvents: f3_pointer as any,
          }}
          className="absolute inset-0 flex flex-col justify-center items-center px-4 sm:px-12 max-w-6xl mx-auto"
        >
          <div className="w-full space-y-4 sm:space-y-8">
            {/* Header sweeps in from LEFT */}
            <motion.div style={{ x: f3_header_x }} className="space-y-1 sm:space-y-2 text-center sm:text-left">
              <h2 className="font-editorial text-xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-white leading-tight">
                THE 4-STAGE <span className="text-[#c8f53c]">CAPITAL STREAM</span>
              </h2>
            </motion.div>

            {/* 4 Continuous Interconnected Pipeline Conduits - 2x2 grid on mobile, 4 in row on lg */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
              <motion.div
                style={{ opacity: pipe_stage1, x: f3_s1_x, y: f3_s1_y }}
                className="p-3 sm:p-5 rounded-xl sm:rounded-2xl liquid-glass-card border border-white/10 space-y-1.5 sm:space-y-3"
              >
                <div className="flex items-center justify-between text-[10px] sm:text-xs font-mono">
                  <span className="text-[#c8f53c] font-bold">STAGE 01</span>
                  <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#c8f53c]" />
                </div>
                <h4 className="font-editorial text-sm sm:text-xl font-bold uppercase text-white">USDG DEPOSIT</h4>
                <p className="text-[10px] sm:text-xs text-neutral-400 leading-relaxed font-sans line-clamp-2 sm:line-clamp-none">
                  Approved ERC-20 commit. Principal is 100% backed and non-custodial.
                </p>
                <div className="text-[9px] sm:text-[10px] font-mono text-[#c8f53c]">0s Lockup Period</div>
              </motion.div>

              <motion.div
                style={{ opacity: pipe_stage2, y: f3_s2_y }}
                className="p-3 sm:p-5 rounded-xl sm:rounded-2xl liquid-glass-card border border-white/10 space-y-1.5 sm:space-y-3"
              >
                <div className="flex items-center justify-between text-[10px] sm:text-xs font-mono">
                  <span className="text-[#c8f53c] font-bold">STAGE 02</span>
                  <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#c8f53c]" />
                </div>
                <h4 className="font-editorial text-sm sm:text-xl font-bold uppercase text-white">INDEX SNAPSHOT</h4>
                <p className="text-[10px] sm:text-xs text-neutral-400 leading-relaxed font-sans line-clamp-2 sm:line-clamp-none">
                  Captures global reward index. O(1) mathematical allocation begins.
                </p>
                <div className="text-[9px] sm:text-[10px] font-mono text-[#c8f53c]">&lt;0.0001 ETH Gas</div>
              </motion.div>

              <motion.div
                style={{ opacity: pipe_stage3, y: f3_s3_y }}
                className="p-3 sm:p-5 rounded-xl sm:rounded-2xl liquid-glass-card border border-white/10 space-y-1.5 sm:space-y-3"
              >
                <div className="flex items-center justify-between text-[10px] sm:text-xs font-mono">
                  <span className="text-[#c8f53c] font-bold">STAGE 03</span>
                  <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#c8f53c]" />
                </div>
                <h4 className="font-editorial text-sm sm:text-xl font-bold uppercase text-white">STREAM YIELD</h4>
                <p className="text-[10px] sm:text-xs text-neutral-400 leading-relaxed font-sans line-clamp-2 sm:line-clamp-none">
                  Newly minted Argila (ARGL) tokens stream per block into your position.
                </p>
                <div className="text-[9px] sm:text-[10px] font-mono text-[#c8f53c]">Real-Time Accrual</div>
              </motion.div>

              <motion.div
                style={{ opacity: pipe_stage4, x: f3_s4_x, y: f3_s4_y }}
                className="p-3 sm:p-5 rounded-xl sm:rounded-2xl liquid-glass-card border border-white/10 space-y-1.5 sm:space-y-3"
              >
                <div className="flex items-center justify-between text-[10px] sm:text-xs font-mono">
                  <span className="text-[#c8f53c] font-bold">STAGE 04</span>
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#c8f53c]" />
                </div>
                <h4 className="font-editorial text-sm sm:text-xl font-bold uppercase text-white">CLAIM & EXIT</h4>
                <p className="text-[10px] sm:text-xs text-neutral-400 leading-relaxed font-sans line-clamp-2 sm:line-clamp-none">
                  Claim rewards anytime or withdraw 100% of your principal immediately.
                </p>
                <div className="text-[9px] sm:text-[10px] font-mono text-[#c8f53c]">Instant Settlement</div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* ===================================================================
            FRAME 04: YIELD TELEMETRY & LIVE RADAR (60% -> 80%)
            Multidirectional: Dual-Wing Convergence (Left Wing from FAR LEFT,
            Right Wing from FAR RIGHT)
            =================================================================== */}
        <motion.div
          style={{
            opacity: f4_opacity,
            scale: f4_scale,
            filter: f4_blur,
            pointerEvents: f4_pointer as any,
          }}
          className="absolute inset-0 flex flex-col justify-center items-center px-4 sm:px-12 max-w-6xl mx-auto"
        >
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6 items-center">
            {/* Left Big Telemetry Dashboard (7 cols) - Slides from FAR LEFT */}
            <motion.div style={{ x: f4_left_x }} className="lg:col-span-7">
              <div className="sg-tier-container">
                <div className="sg-tier-underlay-1" />
                <div className="sg-tier-underlay-2" />
                <div className="sg-tier-main p-4 sm:p-10 space-y-3 sm:space-y-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2.5 sm:pb-4 font-mono text-[10px] sm:text-xs">
                    <span className="text-[#8e95a2] uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
                      <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#c8f53c]" /> CURRENT EMISSION APY
                    </span>
                    <span className="text-[#c8f53c] px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#c8f53c]/10 border border-[#c8f53c]/30 font-bold">
                      SYNTHETIX O(1)
                    </span>
                  </div>

                  <div className="space-y-1 sm:space-y-2">
                    <div className="font-mono text-2xl sm:text-4xl md:text-5xl font-bold text-[#c8f53c] tracking-tight">
                      {formatApy(calculatedApy)}
                    </div>
                    <div className="text-[10px] sm:text-xs font-mono text-neutral-300 flex items-center gap-2 pt-0.5 sm:pt-1">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#c8f53c] animate-ping" />
                      <span>Continuous Argila Block Streaming on Robinhood Chain</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-2 sm:pt-4 border-t border-white/10 font-mono text-xs">
                    <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-[#131622] border border-white/5">
                      <span className="text-[9px] sm:text-[10px] text-[#8e95a2] block uppercase">DAILY</span>
                      <span className="text-white font-bold text-xs sm:text-sm">
                        {calculatedApy ? `+${(calculatedApy / 365).toFixed(3)}%` : "0.00%"}
                      </span>
                    </div>
                    <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-[#131622] border border-white/5">
                      <span className="text-[9px] sm:text-[10px] text-[#8e95a2] block uppercase">MONTHLY</span>
                      <span className="text-white font-bold text-xs sm:text-sm">
                        {calculatedApy ? `+${(calculatedApy / 12).toFixed(2)}%` : "0.00%"}
                      </span>
                    </div>
                    <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-[#131622] border border-white/5">
                      <span className="text-[9px] sm:text-[10px] text-[#8e95a2] block uppercase">1 YEAR</span>
                      <span className="text-[#c8f53c] font-bold text-xs sm:text-sm">
                        {calculatedApy ? `+${calculatedApy.toFixed(2)}%` : "0.00%"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Radar Visualizer (5 cols) - Slides from FAR RIGHT */}
            <motion.div style={{ x: f4_right_x }} className="lg:col-span-5">
              <div className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-[#090b12]/80 border border-white/10 space-y-3 sm:space-y-6 text-center">
                <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-[#c8f53c]/10 border border-[#c8f53c]/30 flex items-center justify-center mx-auto text-[#c8f53c]">
                  <Sparkles className="w-5 h-5 sm:w-8 sm:h-8 animate-pulse" />
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <h3 className="font-editorial text-lg sm:text-2xl font-bold uppercase text-white">AUTONOMOUS HARVEST</h3>
                  <p className="text-[11px] sm:text-xs text-neutral-400 font-sans leading-relaxed line-clamp-2 sm:line-clamp-none">
                    Zero lockup constraints. Rewards compound every single block and can be harvested at any millisecond with micro-cent network gas.
                  </p>
                </div>
                <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl liquid-glass-subcard border border-white/10 flex items-center justify-between font-mono text-[10px] sm:text-xs">
                  <span className="text-neutral-400 uppercase">Settlement Time</span>
                  <span className="text-[#c8f53c] font-bold">&lt; 1 Second</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ===================================================================
            FRAME 05: LAUNCH PROTOCOL & FINAL CTA (80% -> 100%)
            Multidirectional: Vertical Pillar Drop & Rise (Header falls from top,
            buttons rise from bottom)
            =================================================================== */}
        <motion.div
          style={{
            opacity: f5_opacity,
            scale: f5_scale,
            filter: f5_blur,
            pointerEvents: f5_pointer as any,
          }}
          className="absolute inset-0 flex flex-col justify-center items-center px-4 sm:px-12 text-center max-w-4xl mx-auto"
        >
          <div className="space-y-5 sm:space-y-8">
            {/* Header drops from TOP */}
            <motion.div style={{ y: f5_header_y }} className="space-y-2 sm:space-y-4">
              <h2 className="font-editorial text-2xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-white leading-tight">
                READY TO PUT YOUR
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#c8f53c] to-white">
                  CAPITAL TO WORK?
                </span>
              </h2>

              <p className="text-xs sm:text-base text-neutral-300 max-w-xl mx-auto leading-relaxed font-sans px-2">
                Deposit USDG and begin generating non-custodial Argila (ARGL) yield on Robinhood Chain in under 60 seconds. Zero lockups, micro-cent gas.
              </p>
            </motion.div>

            {/* Action buttons rise from BOTTOM */}
            <motion.div
              style={{ y: f5_actions_y }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-1 sm:pt-2 w-full sm:w-auto"
            >
              <LiquidButton
                size="xl"
                variant="kawa"
                href="/stake"
                className="w-full sm:w-auto px-7 sm:px-9 font-mono text-xs tracking-widest uppercase font-bold shadow-2xl shadow-[#c8f53c]/25 group"
              >
                <span className="flex items-center justify-center gap-2">
                  <span>ENTER STAKING TERMINAL</span>
                  <ArrowDownRight className="w-4 h-4 text-[#08090c]" />
                </span>
              </LiquidButton>

              <LiquidButton
                size="xl"
                variant="default"
                href="/stats"
                className="w-full sm:w-auto px-6 sm:px-8 font-mono text-xs tracking-widest uppercase text-neutral-300 hover:text-white"
              >
                <span>VIEW GLOBAL STATS</span>
              </LiquidButton>
            </motion.div>

            {/* Security badges zoom from CENTER */}
            <motion.div
              style={{ scale: f5_footer_scale }}
              className="pt-4 sm:pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[10px] sm:text-xs font-mono text-neutral-400"
            >
              <span className="flex items-center gap-1.5 text-[#c8f53c]">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Synthetix Non-Custodial
              </span>
              <span>•</span>
              <span>Robinhood Chain L2</span>
              <span>•</span>
              <span>Audited Contracts</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
export default SceneContainer;
