import { useRef } from "react";
import KickScene from "@/components/KickScene";
import { gsap, useMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

const MESSAGES = ["Warming up", "Checking the kit room", "Lacing boots", "Walking out"];

/** The kicked-logo scene with a status line that scrambles between messages. */
const PitchLoader = ({ label = "Loading", className }) => {
  const root = useRef(null);

  useMotion(
    () => {
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
      className={cn("flex flex-col items-center gap-3 text-foreground", className)}
    >
      <KickScene className="w-44" />
      <p className="font-mono text-[11px] tracking-[0.25em] text-muted-foreground uppercase">
        <span className="sr-only">{label}…</span>
        <span data-status aria-hidden="true">
          {label}
        </span>
      </p>
    </div>
  );
};

export default PitchLoader;
