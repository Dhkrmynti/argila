import { NextResponse } from "next/server";
import { protocolConfig } from "@/lib/blockchain/config";

export async function GET() {
  try {
    // Read contract state or cached stats
    const stats = {
      protocol: "Argila",
      chain: protocolConfig.chainName,
      chainId: protocolConfig.chainId,
      stakeAsset: "USDG",
      rewardAsset: "ARGL",
      gasAsset: "ETH",
      tvlUsd: null, // As specified in section 19: "$— instead of fake numbers"
      totalStaked: "0.00",
      totalUsdStaked: "0.00",
      totalRewardsDistributed: "0.00",
      totalArgilaDistributed: "0.00",
      totalKawaDistributed: "0.00",
      totalStakers: 0,
      rewardRate: null,
      currentApy: null,
      contractConfigured: protocolConfig.isConfigured,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch protocol statistics" },
      { status: 500 }
    );
  }
}
