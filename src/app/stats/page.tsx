import { KilnStats } from "@/components/Stats/KilnStats";

export const metadata = {
  title: "Stats — Argila",
  description: "Live figures for Argila on Robinhood Chain, read from the staking contract.",
};

export default function StatsPage() {
  return <KilnStats />;
}
