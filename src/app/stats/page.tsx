import { StatsViewer } from "@/components/Stats/StatsViewer";
import { Scene06LiveActivity } from "@/components/Scene/Scene06LiveActivity";

export const metadata = {
  title: "Report • Argila",
  description: "Live figures for Argila on Robinhood Chain, read from the staking contract.",
};

export default function StatsPage() {
  return (
    <div className="relative min-h-screen pt-28 sm:pt-36 pb-24 text-paper overflow-hidden">
      <div className="relative z-10 w-full max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-10 space-y-20">
        <StatsViewer />
        <Scene06LiveActivity />
      </div>
    </div>
  );
}
