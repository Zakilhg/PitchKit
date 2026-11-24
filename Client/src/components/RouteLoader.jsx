import { useRef } from "react";
import PitchLoader from "@/components/PitchLoader";
import { gsap, useMotion } from "@/lib/motion";

/**
 * Suspense fallback while a page's code downloads: a progress bar along the top
 * straight away, and the pitch loader only if the wait is long enough to notice.
 */
const RouteLoader = () => {
  const root = useRef(null);

  useMotion(
    () => {
      gsap.fromTo("[data-bar]", { scaleX: 0 }, { scaleX: 0.85, duration: 2.5, ease: "power4.out" });
      gsap.from("[data-loader]", { autoAlpha: 0, y: 8, duration: 0.4, delay: 0.25 });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="min-h-[60vh]" aria-busy="true">
      <div
        data-bar
        className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-brand"
        aria-hidden="true"
      />
      <div data-loader className="grid min-h-[60vh] place-items-center">
        <PitchLoader />
      </div>
    </div>
  );
};

export default RouteLoader;
