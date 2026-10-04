import { StakingDashboard } from "@/components/Staking/StakingDashboard";

export const metadata = {
  title: "Deposit USDG — Argila",
  description:
    "Deposit USDG into Argila on Robinhood Chain and collect ARGL every block. No lockup, withdraw any time.",
};

export default function StakePage() {
  return (
    <div className="relative min-h-screen pt-16 sm:pt-[76px] text-paper">
      <StakingDashboard />
    </div>
  );
}
