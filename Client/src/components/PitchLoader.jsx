import { useRef } from "react";
import { gsap, useMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

const MESSAGES = ["Warming up", "Checking the kit room", "Lacing boots", "Walking out"];

/**
 * A pitch that draws itself while the ball moves between penalty spots, with a
 * status line that scrambles between messages. Shown while a page loads.
 */
const PitchLoader = ({ label = "Loading", className }) => {
  const root = useRef(null);

  useMotion(
    () => {
      gsap
        .timeline({ repeat: -1, defaults: { ease: "power2.inOut" } })
        .fromTo(
          "[data-line]",
          { drawSVG: "0% 0%" },
          { drawSVG: "0% 100%", duration: 0.9, stagger: 0.12 },
        )
        .to("[data-ball]", { attr: { cx: 92 }, duration: 0.7, ease: "power3.inOut" }, 0.2)
        .to("[data-ball]", { attr: { cx: 28 }, duration: 0.7, ease: "power3.inOut" }, 0.9)
        .to("[data-line]", { drawSVG: "100% 100%", duration: 0.7, stagger: 0.08 }, 1.2);

      const status = gsap.timeline({ repeat: -1 });
      MESSAGES.forEach((text) => {
        status.to("[data-status]", {
          duration: 0.6,
          scrambleText: { text, chars: "01/#·", speed: 0.5 },
        });
        status.to({}, { duration: 1.1 });
      });
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      role="status"
      aria-live="polite"
      className={cn("flex flex-col items-center gap-4 text-muted-foreground", className)}
    >
      <svg viewBox="0 0 120 80" className="w-28" aria-hidden="true">
        <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path data-line d="M4 4H116V76H4Z" />
          <path data-line d="M60 4V76" />
          <path data-line d="M60 26A14 14 0 1 1 60 54A14 14 0 1 1 60 26" />
          <path data-line d="M4 22H20V58H4" />
          <path data-line d="M116 22H100V58H116" />
        </g>
        <circle data-ball cx="28" cy="40" r="3.5" className="fill-brand" />
      </svg>
      <p className="font-mono text-[11px] tracking-[0.25em] uppercase">
        <span className="sr-only">{label}…</span>
        <span data-status aria-hidden="true">
          {label}
        </span>
      </p>
    </div>
  );
};

export default PitchLoader;
