import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { Flip } from "gsap/Flip";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

// Register once, before any component calls useGSAP.
gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, ScrambleTextPlugin, DrawSVGPlugin, Flip);
gsap.defaults({ ease: "power3.out", duration: 0.7 });

/** Motion only runs for people who haven't asked their OS to reduce it. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && !window.matchMedia(MOTION_OK).matches;

/**
 * useGSAP + gsap.matchMedia: `setup` only runs when motion is allowed, and
 * everything it creates (tweens, ScrollTriggers, SplitText) is reverted on
 * unmount or when the preference changes.
 */
export const useMotion = (setup, config = {}) =>
  useGSAP((context, contextSafe) => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => setup(contextSafe), config.scope);
    return () => mm.revert();
  }, config);

/**
 * Fades and lifts every `[data-reveal]` inside `scope` as it scrolls into view.
 * Elements already revealed are skipped, so lists can grow without flashing.
 */
export const useReveal = (scope, dependencies = []) =>
  useMotion(
    () => {
      const items = gsap.utils
        .toArray("[data-reveal]", scope.current)
        .filter((el) => !el.dataset.revealed);
      if (!items.length) return;

      gsap.set(items, { autoAlpha: 0, y: 28 });
      ScrollTrigger.batch(items, {
        start: "top 92%",
        once: true,
        onEnter: (entered) => {
          // Something else (e.g. a Flip) may have shown these already.
          const batch = entered.filter((el) => !el.dataset.revealed);
          if (!batch.length) return;
          batch.forEach((el) => (el.dataset.revealed = "true"));
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.08,
            overwrite: true,
            clearProps: "transform",
          });
        },
      });
    },
    { scope, dependencies },
  );

export { gsap, useGSAP, ScrollTrigger, SplitText, Flip };
