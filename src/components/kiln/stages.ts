import type { ArgilaCoreState } from "@/lib/blockchain/config";

/*
 * Firing stages. The contract reports how long a position has been staked;
 * deriveArgilaState() buckets that duration, and these are the names the UI
 * gives each bucket. Stages are a record of time in the kiln, not a reward
 * multiplier: every staker earns the same rate per USDG.
 */
export interface FiringStage {
  key: ArgilaCoreState;
  name: string;
  window: string;
  /** Reference temperature for the stage, part of the lore, not a measured value */
  temp: string;
  /** 0 to 1, drives the orb's intensity */
  heat: number;
  line: string;
}

export const STAGES: FiringStage[] = [
  { key: "dormant", name: "Cold", window: "Nothing staked", temp: "20°C", heat: 0.08, line: "The kiln is empty. Set some clay in to start firing." },
  { key: "activated", name: "Kindling", window: "Under 1 day", temp: "600°C", heat: 0.35, line: "The fire has caught. ARGL is accruing every block." },
  { key: "growing", name: "Bisque", window: "1 to 7 days", temp: "950°C", heat: 0.55, line: "First firing. The clay has set and keeps earning." },
  { key: "mature", name: "Glaze", window: "7 to 30 days", temp: "1,220°C", heat: 0.78, line: "A steady burn. Your position is well into the firing." },
  { key: "awakened", name: "Porcelain", window: "30 days and up", temp: "1,300°C", heat: 1, line: "The hottest stage. A long-standing piece, still earning every block." },
];

export const stageFor = (key: ArgilaCoreState | undefined) => STAGES.find((s) => s.key === key) ?? STAGES[0];
export const stageIndex = (key: ArgilaCoreState | undefined) => Math.max(0, STAGES.findIndex((s) => s.key === key));
