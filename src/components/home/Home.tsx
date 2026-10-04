"use client";

import React from "react";
import { useLayer5Staking } from "@/lib/hooks/useLayer5Staking";
import { formatApy, formatTokenAmount } from "@/lib/utils/formatters";
import { Hero } from "./Hero";
import { Firing } from "./Firing";
import { Stages } from "./Stages";
import { Materials } from "./Materials";
import { LiveKiln } from "./LiveKiln";
import { Faq } from "./Faq";
import { Cta } from "./Cta";

export const Home: React.FC = () => {
  const { totalStaked, calculatedApy, totalStakers, stakeDecimals } = useLayer5Staking();

  // Unread chain values render as an em dash, never as an invented figure
  const apy = calculatedApy !== undefined && calculatedApy > 0 ? formatApy(calculatedApy) : "—";
  const inKiln = totalStaked > 0n ? formatTokenAmount(totalStaked, stakeDecimals, 2) : "0.00";
  const stakers = totalStakers !== undefined ? totalStakers.toLocaleString() : "—";

  return (
    <div className="relative w-full overflow-x-clip">
      <Hero />
      <Firing />
      <Stages />
      <Materials />
      <LiveKiln apy={apy} inKiln={inKiln} stakers={stakers} />
      <Faq />
      <Cta />
    </div>
  );
};

export default Home;
