import { isAddress } from "viem";
import { robinhoodChain, hardhatChain } from "./chains";

export interface ProtocolConfig {
  chainId: number;
  chainName: string;
  stakeAsset: "USDG";
  rewardAsset: "ARGL";
  gasAsset: "ETH";
  currencySymbol: "USDG";
  rpcUrl: string;
  explorerUrl: string;
  stakingContractAddress?: `0x${string}`;
  stakeTokenAddress?: `0x${string}`;
  rewardTokenAddress?: `0x${string}`;
  isConfigured: boolean;
  isDevMode: boolean;
}

const parseAddress = (addr?: string): `0x${string}` | undefined => {
  if (addr && isAddress(addr)) {
    return addr as `0x${string}`;
  }
  return undefined;
};

export const protocolConfig: ProtocolConfig = {
  chainId: robinhoodChain.id,
  chainName: robinhoodChain.name,
  stakeAsset: "USDG",
  rewardAsset: "ARGL",
  gasAsset: "ETH",
  currencySymbol: "USDG",
  rpcUrl: robinhoodChain.rpcUrls.default.http[0],
  explorerUrl: robinhoodChain.blockExplorers?.default.url || "",
  stakingContractAddress: parseAddress(
    process.env.STAKING_CONTRACT_ADDRESS || process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS
  ),
  stakeTokenAddress: parseAddress(
    process.env.STAKE_TOKEN_ADDRESS || process.env.NEXT_PUBLIC_STAKE_TOKEN_ADDRESS
  ),
  rewardTokenAddress: parseAddress(
    process.env.REWARD_TOKEN_ADDRESS || process.env.NEXT_PUBLIC_REWARD_TOKEN_ADDRESS
  ),
  isConfigured: Boolean(
    parseAddress(
      process.env.STAKING_CONTRACT_ADDRESS || process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS
    )
  ),
  isDevMode: process.env.NEXT_PUBLIC_ENABLE_TESTNET_MODE === "true",
};

export const SUPPORTED_CHAINS = [robinhoodChain, hardhatChain] as const;

export type ArgilaCoreState = "dormant" | "activated" | "growing" | "mature" | "awakened";
export type Layer5CoreState = ArgilaCoreState;
export type KawaCoreState = ArgilaCoreState;

export function deriveArgilaState(stakedAmount: bigint, durationSeconds: number): ArgilaCoreState {
  if (stakedAmount === 0n) {
    return "dormant";
  }
  const ONE_DAY = 86400;
  const ONE_WEEK = 7 * ONE_DAY;
  const ONE_MONTH = 30 * ONE_DAY;

  if (durationSeconds < ONE_DAY) {
    return "activated";
  } else if (durationSeconds < ONE_WEEK) {
    return "growing";
  } else if (durationSeconds < ONE_MONTH) {
    return "mature";
  } else {
    return "awakened";
  }
}

export const deriveLayer5State = deriveArgilaState;
export const deriveKawaState = deriveArgilaState;
