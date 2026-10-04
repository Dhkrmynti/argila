"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { parseUnits, isAddress } from "viem";
import { protocolConfig } from "@/lib/blockchain/config";
import { layer5StakingAbi as kawaStakingAbi } from "@/lib/contracts/layer5StakingAbi";
import { erc20Abi } from "@/lib/contracts/erc20Abi";
import { formatTokenAmount, formatAddress } from "@/lib/utils/formatters";
import { TransactionModal } from "../Transaction/TransactionModal";
import { WalletConnectModal } from "../Wallet/WalletConnectModal";
import { ShieldCheck, ShieldAlert, Lock, ArrowDownToLine, Wallet, RefreshCw, CheckCircle2, ExternalLink, Zap } from "lucide-react";

export const VodkaAdminPanel: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [usdgWithdrawAmount, setUsdgWithdrawAmount] = useState("");
  const [kawaWithdrawAmount, setKawaWithdrawAmount] = useState("");
  const [rewardRateInput, setRewardRateInput] = useState("");
  const [txState, setTxState] = useState<{
    step: "IDLE" | "CONFIRMING" | "PENDING" | "SUCCESS" | "FAILED";
    title: string;
    description: string;
    txHash?: `0x${string}`;
  }>({
    step: "IDLE",
    title: "",
    description: "",
  });

  const contractAddress = protocolConfig.stakingContractAddress;
  const stakeTokenAddress = protocolConfig.stakeTokenAddress;
  const rewardTokenAddress = protocolConfig.rewardTokenAddress;

  // 1. Read Owner from Staking Contract
  const { data: ownerAddressRaw, isLoading: isOwnerLoading } = useReadContract({
    address: contractAddress,
    abi: kawaStakingAbi,
    functionName: "owner",
    query: { enabled: Boolean(contractAddress) },
  });

  const ownerAddress = ownerAddressRaw as `0x${string}` | undefined;
  const isAdmin =
    isConnected &&
    Boolean(address) &&
    Boolean(ownerAddress) &&
    address?.toLowerCase() === ownerAddress?.toLowerCase();

  // 2. Read Total USDG Staked
  const { data: totalStakedRaw, refetch: refetchTotalStaked } = useReadContract({
    address: contractAddress,
    abi: kawaStakingAbi,
    functionName: "totalStaked",
    query: { enabled: Boolean(contractAddress), refetchInterval: 5000 },
  });

  // 3. Read Contract's USDG Token Balance
  const { data: contractUsdgBalanceRaw, refetch: refetchContractUsdg } = useReadContract({
    address: stakeTokenAddress,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: contractAddress ? [contractAddress] : undefined,
    query: { enabled: Boolean(contractAddress && stakeTokenAddress), refetchInterval: 5000 },
  });

  // 4. Read Contract's KAWA Reward Token Balance
  const { data: contractKawaBalanceRaw, refetch: refetchContractKawa } = useReadContract({
    address: rewardTokenAddress,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: contractAddress ? [contractAddress] : undefined,
    query: { enabled: Boolean(contractAddress && rewardTokenAddress), refetchInterval: 5000 },
  });

  // 5. Read Contract's Reward Emission Rate (Speed)
  const { data: rewardRateRaw, refetch: refetchRewardRate } = useReadContract({
    address: contractAddress,
    abi: kawaStakingAbi,
    functionName: "rewardRate",
    query: { enabled: Boolean(contractAddress), refetchInterval: 5000 },
  });

  const { writeContractAsync } = useWriteContract();

  const totalStakedBig = totalStakedRaw ? BigInt(totalStakedRaw.toString()) : 0n;
  const contractUsdgBig = contractUsdgBalanceRaw ? BigInt(contractUsdgBalanceRaw.toString()) : 0n;
  const contractKawaBig = contractKawaBalanceRaw ? BigInt(contractKawaBalanceRaw.toString()) : 0n;
  const rewardRateBig = rewardRateRaw ? BigInt(rewardRateRaw.toString()) : 0n;

  // Stake token uses 6 decimals (USDG)
  const USDG_DECIMALS = 6;
  // Reward token uses 18 decimals (KAWA)
  const KAWA_DECIMALS = 18;

  const handleRefreshAll = async () => {
    await Promise.all([refetchTotalStaked(), refetchContractUsdg(), refetchContractKawa(), refetchRewardRate()]);
  };

  // Withdraw USDG
  const handleWithdrawUsdg = async () => {
    if (!contractAddress || !usdgWithdrawAmount || parseFloat(usdgWithdrawAmount) <= 0) return;
    try {
      const amountWei = parseUnits(usdgWithdrawAmount, USDG_DECIMALS);
      setTxState({
        step: "CONFIRMING",
        title: "CONFIRM USDG WITHDRAWAL",
        description: `Confirm administrative withdrawal of ${usdgWithdrawAmount} USDG in your wallet...`,
      });

      const hash = await writeContractAsync({
        address: contractAddress,
        abi: kawaStakingAbi,
        functionName: "adminWithdrawStakingToken",
        args: [amountWei],
      });

      setTxState({
        step: "PENDING",
        title: "WITHDRAWING USDG",
        description: "Transaction submitted to Robinhood Chain...",
        txHash: hash,
      });

      setUsdgWithdrawAmount("");
      setTimeout(async () => {
        setTxState({
          step: "SUCCESS",
          title: "USDG WITHDRAWAL CONFIRMED",
          description: `Successfully withdrawn to admin address ${formatAddress(address)}.`,
          txHash: hash,
        });
        await handleRefreshAll();
      }, 2000);
    } catch (err: any) {
      setTxState({
        step: "FAILED",
        title: "TRANSACTION FAILED",
        description: err?.shortMessage || err?.message || "Failed to execute USDG withdrawal.",
      });
    }
  };

  // Withdraw KAWA
  const handleWithdrawKawa = async () => {
    if (!contractAddress || !kawaWithdrawAmount || parseFloat(kawaWithdrawAmount) <= 0) return;
    try {
      const amountWei = parseUnits(kawaWithdrawAmount, KAWA_DECIMALS);
      setTxState({
        step: "CONFIRMING",
        title: "CONFIRM ARGL WITHDRAWAL",
        description: `Confirm administrative withdrawal of ${kawaWithdrawAmount} ARGL in your wallet...`,
      });

      const hash = await writeContractAsync({
        address: contractAddress,
        abi: kawaStakingAbi,
        functionName: "adminWithdrawRewardToken",
        args: [amountWei],
      });

      setTxState({
        step: "PENDING",
        title: "WITHDRAWING ARGL",
        description: "Transaction submitted to Robinhood Chain...",
        txHash: hash,
      });

      setKawaWithdrawAmount("");
      setTimeout(async () => {
        setTxState({
          step: "SUCCESS",
          title: "ARGL WITHDRAWAL CONFIRMED",
          description: `Successfully withdrawn to admin address ${formatAddress(address)}.`,
          txHash: hash,
        });
        await handleRefreshAll();
      }, 2000);
    } catch (err: any) {
      setTxState({
        step: "FAILED",
        title: "TRANSACTION FAILED",
        description: err?.shortMessage || err?.message || "Failed to execute ARGL withdrawal.",
      });
    }
  };

  // Update Reward Emission Rate
  const handleSetRewardRate = async (customRate?: string) => {
    const rateToUse = customRate !== undefined ? customRate : rewardRateInput;
    if (!contractAddress || !rateToUse || parseFloat(rateToUse) < 0) return;
    try {
      const rateWei = parseUnits(rateToUse, KAWA_DECIMALS);
      setTxState({
        step: "CONFIRMING",
        title: "CONFIRM REWARD SPEED UPDATE",
        description: `Setting reward speed to ${rateToUse} ARGL/sec in your wallet...`,
      });

      const hash = await writeContractAsync({
        address: contractAddress,
        abi: kawaStakingAbi,
        functionName: "setRewardRate",
        args: [rateWei],
      });

      setTxState({
        step: "PENDING",
        title: "UPDATING REWARD SPEED",
        description: "Transaction submitted to Robinhood Chain...",
        txHash: hash,
      });

      setRewardRateInput("");
      setTimeout(async () => {
        setTxState({
          step: "SUCCESS",
          title: "REWARD SPEED UPDATED",
          description: `Reward emission rate successfully set to ${rateToUse} ARGL/sec.`,
          txHash: hash,
        });
        await handleRefreshAll();
      }, 2000);
    } catch (err: any) {
      setTxState({
        step: "FAILED",
        title: "TRANSACTION FAILED",
        description: err?.shortMessage || err?.message || "Failed to update reward rate.",
      });
    }
  };

  return (
    <div className="w-full space-y-8 font-sans text-left text-white">
      {/* Header */}
      <div className="space-y-3 border-b border-white/10 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-[10px] font-mono tracking-[0.35em] text-[#c8f53c] uppercase flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" /> ADMIN PROTOCOL INTERFACE • /VODKA
          </span>
          <div className="flex items-center gap-2">
            {isAdmin ? (
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-[#c8f53c] bg-[#151a14] border border-[#c8f53c]/30 px-3 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" /> ADMIN AUTHENTICATED
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-amber-400 bg-amber-950/40 border border-amber-500/30 px-3 py-1 rounded-full">
                <ShieldAlert className="w-3.5 h-3.5" /> RESTRICTED ACCESS
              </span>
            )}
            <button
              onClick={handleRefreshAll}
              title="Refresh contract balances"
              className="p-1.5 rounded-full bg-[#121418] border border-white/10 text-neutral-400 hover:text-white transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-light tracking-[0.08em] text-white uppercase font-sans">
          ADMIN <span className="text-[#c8f53c] font-normal">PANEL</span>
        </h1>
        <p className="text-xs sm:text-sm font-mono tracking-[0.05em] text-[#8e95a2] max-w-xl">
          Direct administrative custody interface for KAWA Protocol pool assets on Robinhood Chain Mainnet.
        </p>
      </div>

      {/* Access Control Guard */}
      {!contractAddress ? (
        <div className="border border-white/10 rounded-2xl p-8 sm:p-12 bg-[#121418] text-center space-y-6 shadow-2xl">
          <div className="w-14 h-14 rounded-full bg-[#1b1e26] border border-white/10 flex items-center justify-center mx-auto text-[#c8f53c]">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-mono uppercase tracking-wider text-white">
              STAKING CONTRACT PENDING DEPLOYMENT
            </h3>
            <p className="text-xs font-mono text-[#8e95a2] max-w-md mx-auto">
              KAWAStaking smart contract is not yet deployed or configured in .env.
              Once deployed using the admin wallet, configure its address in STAKING_CONTRACT_ADDRESS.
            </p>
          </div>
        </div>
      ) : !isConnected ? (
        <div className="border border-white/10 rounded-2xl p-8 sm:p-12 bg-[#121418] text-center space-y-6 shadow-2xl">
          <div className="w-14 h-14 rounded-full bg-[#1b1e26] border border-white/10 flex items-center justify-center mx-auto text-[#c8f53c]">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-mono uppercase tracking-wider text-white">
              ADMIN WALLET REQUIRED
            </h3>
            <p className="text-xs font-mono text-[#8e95a2] max-w-md mx-auto">
              Please connect the authorized protocol deployer wallet to access the /vodka withdrawal console.
            </p>
          </div>
          <button
            onClick={() => setWalletModalOpen(true)}
            className="inline-flex items-center gap-2 py-3.5 px-8 rounded-full bg-[#c8f53c] text-[#090a0c] font-mono text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#b8e52c] transition shadow-lg shadow-[#c8f53c]/20"
          >
            <Wallet className="w-4 h-4" /> CONNECT ADMIN WALLET
          </button>
        </div>
      ) : !isAdmin ? (
        <div className="border border-red-500/20 rounded-2xl p-8 sm:p-12 bg-[#161214] space-y-6 shadow-2xl text-left">
          <div className="flex items-center gap-3 text-red-400">
            <ShieldAlert className="w-6 h-6 shrink-0" />
            <h3 className="text-lg font-mono uppercase tracking-wider text-white">
              UNAUTHORIZED ADDRESS
            </h3>
          </div>
          <p className="text-xs font-mono text-neutral-400 leading-relaxed">
            The connected wallet is not the owner of the KAWAStaking smart contract. Administrative withdrawal functions are strictly locked on-chain.
          </p>
          <div className="space-y-3 font-mono text-xs p-4 rounded-xl bg-[#0b0a0c] border border-white/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-[#8e95a2] uppercase text-[10px]">Your Connected Address</span>
              <span className="text-white font-medium select-all">{address}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-t border-white/5 pt-2">
              <span className="text-[#8e95a2] uppercase text-[10px]">Contract Owner (Admin)</span>
              <span className="text-[#c8f53c] font-medium select-all">
                {ownerAddress || "Querying..."}
              </span>
            </div>
          </div>
          <p className="text-[11px] font-mono text-neutral-500">
            Switch to the deployer account in your OKX Wallet / MetaMask to unlock administrative actions.
          </p>
        </div>
      ) : (
        /* Authenticated Admin View: Pools & Emission Controls */
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* CARD 1: USDG Staking Asset */}
          <div className="border border-white/[0.1] rounded-2xl p-4 sm:p-8 bg-[#121418] space-y-6 shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/20 shrink-0">
                    <Image
                      src="/usdg-icon.png"
                      alt="USDG"
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-sm font-mono tracking-wider text-white uppercase font-medium">
                      USDG STAKING POOL
                    </h2>
                    <span className="text-[10px] font-mono text-[#8e95a2] uppercase">
                      STAKING ASSET (6 DECIMALS)
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[#c8f53c] bg-[#1a2016] border border-[#c8f53c]/20 px-2.5 py-0.5 rounded-full">
                  PRINCIPAL
                </span>
              </div>

              {/* Balances Display */}
              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="p-4 rounded-xl bg-[#0a0b0d] border border-white/5 space-y-1">
                  <span className="text-[10px] text-[#8e95a2] uppercase block">TOTAL STAKED</span>
                  <div className="text-xl sm:text-2xl font-light text-white">
                    {formatTokenAmount(totalStakedBig, USDG_DECIMALS, 2)}
                  </div>
                  <span className="text-[10px] text-neutral-500">Committed by users</span>
                </div>

                <div className="p-4 rounded-xl bg-[#0a0b0d] border border-white/5 space-y-1">
                  <span className="text-[10px] text-[#8e95a2] uppercase block">VAULT BALANCE</span>
                  <div className="text-xl sm:text-2xl font-light text-[#c8f53c]">
                    {formatTokenAmount(contractUsdgBig, USDG_DECIMALS, 2)}
                  </div>
                  <span className="text-[10px] text-neutral-500">In contract address</span>
                </div>
              </div>

              {/* Withdraw Form */}
              <div className="space-y-2 pt-2">
                <label className="text-[10px] font-mono text-[#8e95a2] uppercase tracking-wider block">
                  AMOUNT TO WITHDRAW (USDG)
                </label>
                <div className="border border-white/10 rounded-xl p-3.5 bg-[#0a0b0d] flex items-center justify-between focus-within:border-[#c8f53c] transition">
                  <input
                    type="number"
                    placeholder="0.00"
                    value={usdgWithdrawAmount}
                    onChange={(e) => setUsdgWithdrawAmount(e.target.value)}
                    className="w-full bg-transparent font-mono text-xl sm:text-2xl text-white outline-none placeholder:text-neutral-600 font-light"
                  />
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span className="text-xs font-mono text-[#8e95a2] uppercase">USDG</span>
                    <button
                      type="button"
                      onClick={() =>
                        setUsdgWithdrawAmount(formatTokenAmount(contractUsdgBig, USDG_DECIMALS, 6))
                      }
                      className="px-2 py-0.5 rounded bg-[#1a1c22] border border-white/15 text-[10px] font-mono text-[#c8f53c] hover:bg-[#252830] transition uppercase font-semibold"
                    >
                      MAX
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleWithdrawUsdg}
              disabled={
                !usdgWithdrawAmount ||
                parseFloat(usdgWithdrawAmount) <= 0 ||
                contractUsdgBig === 0n ||
                parseUnits(usdgWithdrawAmount || "0", USDG_DECIMALS) > contractUsdgBig
              }
              className="w-full py-3.5 px-6 rounded-full bg-[#1a1c22] border border-[#c8f53c]/40 text-[#c8f53c] font-mono text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#c8f53c] hover:text-[#090a0c] disabled:opacity-30 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center gap-2 shadow-lg"
            >
              <ArrowDownToLine className="w-4 h-4" /> WITHDRAW USDG TO ADMIN
            </button>
          </div>

          {/* CARD 2: KAWA Reward Asset */}
          <div className="border border-white/[0.1] rounded-2xl p-4 sm:p-8 bg-[#121418] space-y-6 shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#1b1e26] border border-white/20 flex items-center justify-center font-mono text-xs text-[#c8f53c] font-bold shrink-0">
                    ARGL
                  </div>
                  <div>
                    <h2 className="text-sm font-mono tracking-wider text-white uppercase font-medium">
                      ARGL REWARD POOL
                    </h2>
                    <span className="text-[10px] font-mono text-[#8e95a2] uppercase">
                      REWARD TOKEN (18 DECIMALS)
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/30 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                  EMISSION POOL
                </span>
              </div>

              {/* Balances Display */}
              <div className="grid grid-cols-1 font-mono">
                <div className="p-4 rounded-xl bg-[#0a0b0d] border border-white/5 space-y-1">
                  <span className="text-[10px] text-[#8e95a2] uppercase block">
                    TOTAL ARGL IN CONTRACT
                  </span>
                  <div className="text-2xl sm:text-3xl font-light text-[#c8f53c]">
                    {rewardTokenAddress ? formatTokenAmount(contractKawaBig, KAWA_DECIMALS, 4) : "—"}
                  </div>
                  <span className="text-[10px] text-neutral-500">
                    {rewardTokenAddress
                      ? "Available balance for reward distribution"
                      : "Awaiting token contract address in .env"}
                  </span>
                </div>
              </div>

              {/* Withdraw Form */}
              <div className="space-y-2 pt-2">
                <label className="text-[10px] font-mono text-[#8e95a2] uppercase tracking-wider block">
                  AMOUNT TO WITHDRAW (ARGL)
                </label>
                <div className="border border-white/10 rounded-xl p-3.5 bg-[#0a0b0d] flex items-center justify-between focus-within:border-[#c8f53c] transition">
                  <input
                    type="number"
                    placeholder="0.00"
                    disabled={!rewardTokenAddress}
                    value={kawaWithdrawAmount}
                    onChange={(e) => setKawaWithdrawAmount(e.target.value)}
                    className="w-full bg-transparent font-mono text-xl sm:text-2xl text-white outline-none placeholder:text-neutral-600 font-light disabled:opacity-40 disabled:cursor-not-allowed"
                  />
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span className="text-xs font-mono text-[#8e95a2] uppercase">ARGL</span>
                    <button
                      type="button"
                      disabled={!rewardTokenAddress}
                      onClick={() =>
                        setKawaWithdrawAmount(formatTokenAmount(contractKawaBig, KAWA_DECIMALS, 6))
                      }
                      className="px-2 py-0.5 rounded bg-[#1a1c22] border border-white/15 text-[10px] font-mono text-[#c8f53c] hover:bg-[#252830] transition uppercase font-semibold disabled:opacity-40"
                    >
                      MAX
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleWithdrawKawa}
              disabled={
                !rewardTokenAddress ||
                !kawaWithdrawAmount ||
                parseFloat(kawaWithdrawAmount) <= 0 ||
                contractKawaBig === 0n ||
                parseUnits(kawaWithdrawAmount || "0", KAWA_DECIMALS) > contractKawaBig
              }
              className="w-full py-3.5 px-6 rounded-full bg-[#c8f53c] text-[#090a0c] font-mono text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#b8e52c] disabled:opacity-30 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#c8f53c]/20"
            >
              <ArrowDownToLine className="w-4 h-4" /> {rewardTokenAddress ? "WITHDRAW ARGL TO ADMIN" : "TOKEN NOT CONFIGURED"}
            </button>
          </div>
        </div>

        {/* Reward Emission Rate (Speed) Card */}
        <div className="border border-white/10 rounded-2xl p-6 sm:p-8 bg-[#121418] space-y-6 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1b2216] border border-[#c8f53c]/30 flex items-center justify-center text-[#c8f53c] shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-mono font-medium tracking-[0.1em] uppercase text-white">
                  REWARD EMISSION SPEED
                </h2>
                <span className="text-[10px] font-mono text-[#8e95a2] uppercase tracking-wider">
                  Block-by-block distribution rate
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-mono text-[#8e95a2] uppercase tracking-wider">CURRENT SPEED</div>
              <div className="text-xl font-mono font-semibold text-[#c8f53c]">
                {formatTokenAmount(rewardRateBig, KAWA_DECIMALS, 4)} ARGL/sec
              </div>
              <span className="text-[10px] text-neutral-500 font-mono">
                ≈ {(parseFloat(formatTokenAmount(rewardRateBig, KAWA_DECIMALS, 4)) * 86400).toLocaleString()} ARGL/day
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-mono text-[#8e95a2] uppercase tracking-wider">
                SET NEW SPEED (ARGL PER SECOND)
              </label>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-neutral-500">Presets:</span>
                {["0.05", "0.5", "2.5", "5.0", "10.0"].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setRewardRateInput(preset)}
                    className="px-2 py-0.5 rounded bg-[#1a1c22] hover:bg-[#252830] border border-white/10 text-[10px] font-mono text-[#c8f53c] transition"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <div className="border border-white/10 rounded-xl p-3.5 bg-[#0a0b0d] flex items-center justify-between focus-within:border-[#c8f53c] transition">
              <input
                type="number"
                step="0.0001"
                placeholder="e.g. 5.0"
                value={rewardRateInput}
                onChange={(e) => setRewardRateInput(e.target.value)}
                className="w-full bg-transparent font-mono text-xl sm:text-2xl text-white outline-none placeholder:text-neutral-600 font-light"
              />
              <span className="text-xs font-mono text-[#8e95a2] uppercase ml-3 shrink-0">
                ARGL / SEC
              </span>
            </div>
          </div>

          <button
            onClick={() => handleSetRewardRate()}
            disabled={!rewardRateInput || parseFloat(rewardRateInput) < 0}
            className="w-full py-3.5 px-6 rounded-full bg-[#c8f53c] text-[#090a0c] font-mono text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#b8e52c] disabled:opacity-30 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#c8f53c]/20"
          >
            <Zap className="w-4 h-4 fill-current" /> UPDATE REWARD SPEED
          </button>
        </div>
        </div>
      )}

      {/* Contract Reference Info */}
      <div className="p-4 rounded-xl bg-[#0e1014] border border-white/5 font-mono text-xs text-[#8e95a2] space-y-1.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <span className="text-[10px] uppercase">Active Staking Contract:</span>
          {contractAddress ? (
            <a
              href={`${protocolConfig.explorerUrl}/address/${contractAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#c8f53c] flex items-center gap-1 transition"
            >
              <span>{contractAddress}</span>
              <ExternalLink className="w-3 h-3 inline" />
            </a>
          ) : (
            <span className="text-neutral-500">Not Deployed Yet (Pending in .env)</span>
          )}
        </div>
      </div>

      {/* Modals */}
      <TransactionModal
        onClose={() => setTxState({ step: "IDLE", title: "", description: "" })}
        state={{
          step: txState.step,
          title: txState.title,
          description: txState.description,
          txHash: txState.txHash,
        }}
      />

      <WalletConnectModal
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
      />
    </div>
  );
};
