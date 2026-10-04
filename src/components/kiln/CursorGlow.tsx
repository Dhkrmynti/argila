"use client";

import { useEffect } from "react";

export const CursorGlow = () => {
  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      // Hanya berjalan untuk mouse
      if (e.pointerType !== "mouse") return;
      
      const btns = document.querySelectorAll<HTMLElement>('.btn-hot, .btn-ghost');
      for (const btn of Array.from(btns)) {
        const rect = btn.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        btn.style.setProperty('--mx', `${mx}px`);
        btn.style.setProperty('--my', `${my}px`);
      }
    };

    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);

  return null;
};
