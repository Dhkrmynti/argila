import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { KilnOrb } from "@/components/kiln/KilnOrb";
import { Embers } from "@/components/kiln/Embers";
import { Reveal } from "@/components/kiln/Reveal";

export const Cta: React.FC = () => (
  <section className="relative mx-auto max-w-6xl px-5 sm:px-8 pt-12">
    <div className="relative overflow-hidden rounded-[2.5rem] border border-line-strong bg-coal-2 px-6 sm:px-12 pt-16 sm:pt-24 pb-[46%] sm:pb-[34%] text-center">
      <Embers className="absolute inset-0 w-full h-full" density={3} />
      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2 w-[130%] sm:w-[85%]">
        <KilnOrb heat={0.95} />
      </div>
      <Reveal className="relative">
        <h2 className="font-display font-bold text-[3rem] sm:text-[5.5rem] tracking-[-0.045em] leading-[0.9] text-balance">
          The kiln is <span className="text-heat">lit.</span>
        </h2>
        <p className="mt-6 mx-auto max-w-lg text-lg text-bone-2 leading-relaxed">
          Connect a wallet with USDG on Robinhood Chain and set your first piece in. It starts earning on the next block.
        </p>
        <div className="mt-9 flex flex-col min-[420px]:flex-row gap-3 justify-center">
          <Link href="/stake" className="btn btn-hot !h-14 !px-8 !text-[16px] group">
            Start firing
            <ArrowRight className="w-[18px] h-[18px] transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link href="/stats" className="btn btn-ghost !h-14 !px-8 !text-[16px] backdrop-blur">
            See the stats
          </Link>
        </div>
      </Reveal>
    </div>
  </section>
);

export default Cta;
