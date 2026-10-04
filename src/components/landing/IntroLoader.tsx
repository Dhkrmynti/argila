"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GuillocheRosette } from "@/components/vault/Guilloche";

const ease = [0.76, 0, 0.24, 1] as const;

/*
 * The kiln door, once per session: the wheel turns a quarter, the vessel
 * settles, and the two leaves part to reveal the studio. About a second.
 */
export const IntroLoader: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (document.documentElement.dataset.vaultSeen === "1") {
      setVisible(false);
      return;
    }
    try {
      sessionStorage.setItem("argila-kiln-opened", "1");
    } catch {}

    const t1 = setTimeout(() => setOpen(true), 650);
    const t2 = setTimeout(() => {
      setVisible(false);
      // Later client-side visits to the studio skip the door too
      document.documentElement.dataset.vaultSeen = "1";
    }, 1500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <>
    {/* Decided before first paint so a returning visitor never sees the door flash */}
    <script
      dangerouslySetInnerHTML={{
        __html: `try{if(sessionStorage.getItem("argila-kiln-opened")==="1"||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.dataset.vaultSeen="1"}catch(e){}`,
      }}
    />
    <AnimatePresence>
      {visible && (
        <motion.div
          key="vault-door"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="vault-door fixed inset-0 z-[9999] pointer-events-none select-none"
          aria-hidden="true"
        >
          {(["top", "bottom"] as const).map((leaf) => (
            <motion.div
              key={leaf}
              initial={{ y: 0 }}
              animate={{ y: open ? (leaf === "top" ? "-100%" : "100%") : 0 }}
              transition={{ duration: 0.85, ease }}
              className={`absolute left-0 right-0 h-1/2 bg-ink-3 overflow-hidden ${leaf === "top" ? "top-0" : "bottom-0"}`}
            >
              <div className={`absolute left-1/2 -translate-x-1/2 w-[22rem] h-[22rem] ${leaf === "top" ? "-bottom-[11rem]" : "-top-[11rem]"}`}>
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 90 }}
                  transition={{ duration: 0.65, ease }}
                  className="w-full h-full"
                >
                  <GuillocheRosette className="w-full h-full text-terra" />
                </motion.div>
                <img
                  src="/argila-logo-terra.png"
                  alt=""
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 object-contain"
                />
              </div>
              <div
                className={`absolute left-0 right-0 h-px bg-terra/60 ${leaf === "top" ? "bottom-0" : "top-0"}`}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
};
