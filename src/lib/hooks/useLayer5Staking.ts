"use client";

import { useState, useCallback } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useChainId,
  useSwitchChain,
  useBalance,
} from "wagmi";
import { parseUnits } from "viem";
import { protocolConfig, deriveLayer5State, Layer5CoreState, deriveKawaState, KawaCoreState } from "../blockchain/config";
import { layer5StakingAbi } from "../contracts/layer5StakingAbi";
import { erc20Abi } from "../contracts/erc20Abi";
import { parseWeb3Error } from "../utils/errors";

export type TxStep = "IDLE" | "CONFIRMING" | "PENDING" | "SUCCESS" | "FAILED";

export interface TransactionState {
  step: TxStep;
  title: string;
  description: string;
  txHash?: `0x${string}`;
  error?: string;
}

export function useLayer5Staking() {
  const { address, isConnected, chainId: accountChainId, chain } = useAccount();
  const currentChainId = useChainId();
  const { switchChain } = useSwitchChain();

  // Accurately check if wallet is on a different chain than Robinhood Chain (4663)
  const isWrongNetwork = isConnected && Boolean(accountChainId && accountChainId !== protocolConfig.chainId);

  const [txState, setTxState] = useState<TransactionState>({
    step: "IDLE",
    title: "",
    description: "",
  });

  const contractAddress = protocolConfig.stakingContractAddress;
  const stakeTokenAddress = protocolConfig.stakeTokenAddress;
  const rewardTokenAddress = protocolConfig.rewardTokenAddress;

  // Staking asset decimals (USDG has 6 decimals, fallback to 6)
  const { data: stakeDecimalsRaw } = useReadContract({
    address: stakeTokenAddress,
    abi: erc20Abi,
    functionName: "decimals",
    query: {
      enabled: Boolean(stakeTokenAddress),
    },
  });
  const stakeDecimals = typeof stakeDecimalsRaw === "number" ? stakeDecimalsRaw : 6;

  // Staked USDG balance in contract
  const { data: stakedBalanceRaw, refetch: refetchStaked } = useReadContract({
    address: contractAddress,
    abi: layer5StakingAbi,
    functionName: "stakedBalance",
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(contractAddress && address),
      refetchInterval: 4000,
    },
  });

  // Pending KAWA rewards in contract
  const { data: pendingRewardsRaw, refetch: refetchRewards } = useReadContract({
    address: contractAddress,
    abi: layer5StakingAbi,
    functionName: "pendingRewards",
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(contractAddress && address),
      refetchInterval: 3000,
    },
  });

  // Staking duration in seconds
  const { data: stakingDurationRaw, refetch: refetchDuration } = useReadContract({
    address: contractAddress,
    abi: layer5StakingAbi,
    functionName: "getStakingDuration",
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(contractAddress && address),
      refetchInterval: 5000,
    },
  });

  // Total USDG staked across protocol
  const { data: totalStakedRaw, refetch: refetchTotalStaked } = useReadContract({
    address: contractAddress,
    abi: layer5StakingAbi,
    functionName: "totalStaked",
    query: {
      enabled: Boolean(contractAddress),
      refetchInterval: 10000,
    },
  });

  // KAWA reward rate per second
  const { data: rewardRateRaw } = useReadContract({
    address: contractAddress,
    abi: layer5StakingAbi,
    functionName: "rewardRate",
    query: {
      enabled: Boolean(contractAddress),
    },
  });

  // Total unique stakers count
  const { data: totalStakersRaw } = useReadContract({
    address: contractAddress,
    abi: layer5StakingAbi,
    functionName: "totalStakers",
    query: {
      enabled: Boolean(contractAddress),
    },
  });

  // User wallet USDG balance
  const { data: usdgBalanceRaw, refetch: refetchUsdgBalance } = useReadContract({
    address: stakeTokenAddress,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(stakeTokenAddress && address),
      refetchInterval: 5000,
    },
  });

  // User wallet KAWA balance
  const { data: kawaBalanceRaw, refetch: refetchKawaBalance } = useReadContract({
    address: rewardTokenAddress,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(rewardTokenAddress && address),
      refetchInterval: 5000,
    },
  });

  // Native ETH gas balance on Robinhood Chain
  const { data: ethBalanceData, refetch: refetchEthBalance } = useBalance({
    address,
    query: {
      enabled: Boolean(address),
      refetchInterval: 10000,
    },
  });

  // USDG allowance on staking contract
  const { data: allowanceRaw, refetch: refetchAllowance } = useReadContract({
    address: stakeTokenAddress,
    abi: erc20Abi,
    functionName: "allowance",
    args: address && contractAddress ? [address, contractAddress] : undefined,
    query: {
      enabled: Boolean(stakeTokenAddress && address && contractAddress),
      refetchInterval: 5000,
    },
  });

  const refetchAll = useCallback(() => {
    refetchStaked();
    refetchRewards();
    refetchDuration();
    refetchTotalStaked();
    refetchUsdgBalance();
    refetchKawaBalance();
    refetchEthBalance();
    refetchAllowance();
  }, [
    refetchStaked,
    refetchRewards,
    refetchDuration,
    refetchTotalStaked,
    refetchUsdgBalance,
    refetchKawaBalance,
    refetchEthBalance,
    refetchAllowance,
  ]);

  const { writeContractAsync } = useWriteContract();

  const resetTxState = () => {
    setTxState({ step: "IDLE", title: "", description: "" });
  };

  const stakedBig = stakedBalanceRaw ? BigInt(stakedBalanceRaw.toString()) : 0n;
  const totalStakedBig = totalStakedRaw ? BigInt(totalStakedRaw.toString()) : 0n;
  const rewardRateBig = rewardRateRaw ? BigInt(rewardRateRaw.toString()) : 0n;
  const durationSeconds = stakingDurationRaw ? Number(stakingDurationRaw) : 0;

  // Derive APY strictly from deployed contract variables (returns undefined if unconfigured)
  let calculatedApy: number | undefined = undefined;
  if (totalStakedBig > 0n && rewardRateBig > 0n) {
    const yearlyRewardsKAWA = Number(rewardRateBig * 31536000n) / 1e18;
    const totalStakedTokens = Number(totalStakedBig) / (10 ** stakeDecimals);
    if (totalStakedTokens > 0) {
      calculatedApy = (yearlyRewardsKAWA / totalStakedTokens) * 100;
    }
  }

  const layer5State: Layer5CoreState = deriveLayer5State(stakedBig, durationSeconds);
  const kawaState: KawaCoreState = layer5State;

  // Approve USDG
  const approveToken = async (amountWei: bigint) => {
    if (!stakeTokenAddress || !contractAddress) return false;
    try {
      setTxState({
        step: "CONFIRMING",
        title: "APPROVING USDG",
        description: "Please confirm USDG token spending approval in your wallet...",
      });
      const hash = await writeContractAsync({
        address: stakeTokenAddress,
        abi: erc20Abi,
        functionName: "approve",
        args: [contractAddress, amountWei],
      });
      setTxState({
        step: "PENDING",
        title: "USDG APPROVAL PENDING",
        description: "Approval submitted to Robinhood Chain (Gas: ETH)...",
        txHash: hash,
      });
      await refetchAllowance();
      setTxState({
        step: "SUCCESS",
        title: "USDG APPROVED",
        description: "USDG approval confirmed. You can now stake USDG.",
        txHash: hash,
      });
      return true;
    } catch (err) {
      const parsed = parseWeb3Error(err);
      setTxState({
        step: "FAILED",
        title: parsed.title,
        description: parsed.description,
        error: err instanceof Error ? err.message : String(err),
      });
      return false;
    }
  };

  // Stake USDG
  const stake = async (amountStr: string) => {
    if (!contractAddress) {
      setTxState({
        step: "FAILED",
        title: "Contract Not Configured",
        description: "Robinhood Chain staking contract address is not configured.",
      });
      return;
    }

    try {
      const amountWei = parseUnits(amountStr, stakeDecimals);
      if (amountWei <= 0n) return;

      const currentAllowance = allowanceRaw ? BigInt(allowanceRaw.toString()) : 0n;
      if (currentAllowance < amountWei) {
        const approved = await approveToken(amountWei);
        if (!approved) return;
      }

      setTxState({
        step: "CONFIRMING",
        title: "STAKING USDG",
        description: `Confirm deposit of ${amountStr} USDG in your wallet (Network Fee: ETH)...`,
      });

      const hash = await writeContractAsync({
        address: contractAddress,
        abi: layer5StakingAbi,
        functionName: "stake",
        args: [amountWei],
      });

      setTxState({
        step: "PENDING",
        title: "STAKE TRANSACTION PENDING",
        description: "Waiting for Robinhood Chain confirmation...",
        txHash: hash,
      });

      setTimeout(() => {
        refetchAll();
        setTxState({
          step: "SUCCESS",
          title: "STAKE CONFIRMED",
          description: `${amountStr} USDG is now actively generating Argila rewards.`,
          txHash: hash,
        });
      }, 2500);
    } catch (err) {
      const parsed = parseWeb3Error(err);
      setTxState({
        step: "FAILED",
        title: parsed.title,
        description: parsed.description,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  };

  // Unstake USDG
  const unstake = async (amountStr: string) => {
    if (!contractAddress) return;
    try {
      const amountWei = parseUnits(amountStr, stakeDecimals);
      if (amountWei <= 0n) return;

      setTxState({
        step: "CONFIRMING",
        title: "UNSTAKING USDG",
        description: `Confirm withdrawal of ${amountStr} USDG in your wallet (Network Fee: ETH)...`,
      });

      const hash = await writeContractAsync({
        address: contractAddress,
        abi: layer5StakingAbi,
        functionName: "unstake",
        args: [amountWei],
      });

      setTxState({
        step: "PENDING",
        title: "UNSTAKE PENDING",
        description: "Waiting for Robinhood Chain confirmation...",
        txHash: hash,
      });

      setTimeout(() => {
        refetchAll();
        setTxState({
          step: "SUCCESS",
          title: "UNSTAKE CONFIRMED",
          description: `${amountStr} USDG has been returned to your wallet.`,
          txHash: hash,
        });
      }, 2500);
    } catch (err) {
      const parsed = parseWeb3Error(err);
      setTxState({
        step: "FAILED",
        title: parsed.title,
        description: parsed.description,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  };

  // Claim Argila rewards
  const claim = async () => {
    if (!contractAddress) return;
    try {
      setTxState({
        step: "CONFIRMING",
        title: "CLAIMING ARGL REWARDS",
        description: "Confirm Argila reward claim in your wallet (Network Fee: ETH)...",
      });

      const hash = await writeContractAsync({
        address: contractAddress,
        abi: layer5StakingAbi,
        functionName: "claim",
      });

      setTxState({
        step: "PENDING",
        title: "CLAIM PENDING",
        description: "Transferring Argila rewards on Robinhood Chain...",
        txHash: hash,
      });

      setTimeout(() => {
        refetchAll();
        setTxState({
          step: "SUCCESS",
          title: "ARGL REWARDS CLAIMED",
          description: "Accumulated Argila rewards have been transferred to your wallet.",
          txHash: hash,
        });
      }, 2500);
    } catch (err) {
      const parsed = parseWeb3Error(err);
      setTxState({
        step: "FAILED",
        title: parsed.title,
        description: parsed.description,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  };

  return {
    isConnected,
    isWrongNetwork,
    address,
    switchToRobinhood: () => switchChain({ chainId: protocolConfig.chainId }),
    // Balances
    stakeDecimals, // USDG token decimals (6)
    stakedBalance: stakedBig, // USDG in contract
    pendingRewards: pendingRewardsRaw ? BigInt(pendingRewardsRaw.toString()) : 0n, // KAWA accrued
    tokenBalance: usdgBalanceRaw ? BigInt(usdgBalanceRaw.toString()) : 0n, // USDG in wallet
    kawaBalance: kawaBalanceRaw ? BigInt(kawaBalanceRaw.toString()) : 0n, // KAWA in wallet
    ethBalance: ethBalanceData, // ETH for network gas
    allowance: allowanceRaw ? BigInt(allowanceRaw.toString()) : 0n,
    isContractConfigured: Boolean(contractAddress),
    // Protocol stats
    totalStaked: totalStakedBig, // Total USDG staked
    rewardRate: rewardRateBig, // KAWA per second
    totalStakers: totalStakersRaw ? Number(totalStakersRaw) : 0,
    stakingDuration: durationSeconds,
    calculatedApy,
    argilaState: layer5State,
    layer5State,
    kawaState,
    // Transactions
    txState,
    resetTxState,
    stake,
    unstake,
    claim,
    refetchAll,
  };
}

export const useArgilaStaking = useLayer5Staking;
export const useKawaStaking = useLayer5Staking;
