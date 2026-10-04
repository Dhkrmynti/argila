"use client";

import React, { useRef } from "react";
import { useScroll, useSpring } from "framer-motion";
import { IntroLoader } from "./IntroLoader";
import { HeroSection } from "./HeroSection";
import { FiringLogSection } from "./FiringLogSection";
import { NotesSection } from "./NotesSection";
import { LiveMetricsSection } from "./LiveMetricsSection";
import { ProtocolFaqSection } from "./ProtocolFaqSection";
import { FinalCTASection } from "./FinalCTASection";
import { useLayer5Staking } from "@/lib/hooks/useLayer5Staking";

export const LandingContainer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001,
  });

  // Pull real-time on-chain data for live telemetry
  const { totalStaked, calculatedApy, totalStakers, stakeDecimals } = useLayer5Staking();

  return (
    <div ref={containerRef} className="relative min-h-screen w-full text-paper overflow-x-clip">
      <IntroLoader />

      <HeroSection
        scrollProgress={scrollYProgress}
        smoothProgress={smoothProgress}
        calculatedApy={calculatedApy}
        totalStaked={totalStaked}
        stakeDecimals={stakeDecimals}
      />

      <FiringLogSection />

      <NotesSection />

      <LiveMetricsSection
        totalStaked={totalStaked}
        calculatedApy={calculatedApy}
        totalStakers={totalStakers}
        stakeDecimals={stakeDecimals}
      />

      <ProtocolFaqSection />

      <FinalCTASection />
    </div>
  );
};

export default LandingContainer;
