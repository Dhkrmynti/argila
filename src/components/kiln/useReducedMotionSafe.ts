"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/*
 * The server can't know the visitor's motion preference, so the first client
 * render must match the server's (motion on). The real preference applies
 * right after mount. Entry animations are handled globally by
 * <MotionConfig reducedMotion="user"> in Providers; use this hook only for
 * render-time branches such as scroll-linked styles.
 */
export function useReducedMotionSafe(): boolean {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && Boolean(reduce);
}
