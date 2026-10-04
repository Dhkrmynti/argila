import { PositionViewer } from "@/components/Position/PositionViewer";

export const metadata = {
  title: "Firing log • Argila",
  description: "Your Argila firing log: USDG in the kiln, ARGL accrued, and every way out.",
};

export default function PositionPage() {
  return (
    <div className="relative min-h-screen pt-28 sm:pt-36 pb-24 text-paper overflow-hidden">
      <div className="relative z-10 w-full max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-10">
        <PositionViewer />
      </div>
    </div>
  );
}
