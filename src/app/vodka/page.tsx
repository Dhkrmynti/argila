import { VodkaAdminPanel } from "@/components/Admin/VodkaAdminPanel";

export const metadata = {
  title: "Admin • /vodka • Argila",
  description: "Administrative console for Argila pool assets on Robinhood Chain.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function VodkaAdminPage() {
  return (
    <div className="relative min-h-screen pt-28 pb-20 px-4 sm:px-6 bg-[#0B0D13] text-white overflow-hidden selection:bg-[#c8f53c] selection:text-black">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/[0.04] blur-[150px] pointer-events-none -z-0" />
      
      <div className="relative z-10 w-full max-w-4xl mx-auto">
        <VodkaAdminPanel />
      </div>
    </div>
  );
}
