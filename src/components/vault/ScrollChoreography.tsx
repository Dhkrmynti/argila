"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

/*
 * One conductor for scroll motion across every page, driven by data attributes:
 *   data-reveal="lines"  headline lines lift out of their mask
 *   data-reveal="paper"  a sheet slides up and settles onto the desk
 *   data-reveal="rows"   ledger rows are entered one after another
 *   data-reveal="band"   an engraved band draws across with the scroll
 *   data-recede          a section steps back into the room as the next arrives
 * Anything already on screen when the page loads is left alone, so nothing
 * that was painted ever disappears to be animated back in.
 */

const belowFold = (el: Element) => el.getBoundingClientRect().top > window.innerHeight * 0.92;

export const ScrollChoreography: React.FC = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ctx: gsap.Context | undefined;
    let inner = 0;
    // Wait two frames so the new route's markup and fonts have laid out
    const raf = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => {
        ctx = gsap.context(() => {
          gsap.utils.toArray<HTMLElement>('[data-reveal="lines"]').forEach((el) => {
            if (!belowFold(el)) return;
            SplitText.create(el, {
              type: "lines",
              mask: "lines",
              autoSplit: true,
              onSplit: (self) =>
                gsap.from(self.lines, {
                  yPercent: 108,
                  duration: 1.15,
                  ease: "expo.out",
                  stagger: 0.09,
                  scrollTrigger: { trigger: el, start: "top 86%", once: true },
                }),
            });
          });

          gsap.utils.toArray<HTMLElement>('[data-reveal="paper"]').forEach((el) => {
            if (!belowFold(el)) return;
            gsap.from(el, {
              y: 90,
              rotate: -1.6,
              opacity: 0,
              duration: 1.25,
              ease: "expo.out",
              clearProps: "transform,opacity",
              scrollTrigger: { trigger: el, start: "top 90%", once: true },
            });
          });

          gsap.utils.toArray<HTMLElement>('[data-reveal="rows"]').forEach((list) => {
            const rows = Array.from(list.children).filter(belowFold);
            if (!rows.length) return;
            gsap.from(rows, {
              opacity: 0,
              x: -22,
              filter: "blur(4px)",
              duration: 0.9,
              ease: "expo.out",
              stagger: 0.07,
              clearProps: "filter,transform,opacity",
              scrollTrigger: { trigger: list, start: "top 85%", once: true },
            });
          });

          gsap.utils.toArray<HTMLElement>('[data-reveal="band"]').forEach((el) => {
            gsap.fromTo(
              el,
              { scaleX: 0 },
              {
                scaleX: 1,
                ease: "none",
                transformOrigin: "left center",
                scrollTrigger: { trigger: el, start: "top 98%", end: "top 55%", scrub: 0.8 },
              }
            );
          });

          gsap.utils.toArray<HTMLElement>("[data-recede]").forEach((section) => {
            const inner = section.querySelector<HTMLElement>("[data-recede-inner]") ?? section;
            gsap.to(inner, {
              scale: 0.94,
              yPercent: -6,
              opacity: 0.25,
              filter: "blur(2px)",
              ease: "none",
              transformOrigin: "50% 100%",
              scrollTrigger: { trigger: section, start: "bottom 85%", end: "bottom 15%", scrub: 0.6 },
            });
          });
        });
        ScrollTrigger.refresh();
      });
    });

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(inner);
      ctx?.revert();
    };
  }, [pathname]);

  return null;
};

export default ScrollChoreography;
