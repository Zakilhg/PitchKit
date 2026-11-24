import { cn } from "@/lib/utils";

/**
 * The PitchKit "P" as a little player: it winds up, kicks, turns into the
 * ball and the ball flies into the net. Animated purely in CSS (the .kick-*
 * rules in index.html) so the same scene is also the boot splash before any
 * JavaScript runs. Keep this markup in sync with index.html.
 */
const KickScene = ({ className }) => (
  <svg viewBox="0 0 184 100" className={cn("kick", className)} aria-hidden="true">
    <g className="kick-lines" fill="none" stroke="currentColor" strokeWidth="1.2">
      <rect x="6" y="12" width="160" height="76" rx="2" />
      <path d="M86 12V88" />
      <circle cx="86" cy="50" r="12" />
      <path d="M6 32H24V68H6" />
      <path d="M166 32H148V68H166" />
    </g>
    <g className="kick-net" fill="none" stroke="currentColor">
      <path d="M166 40H178V60H166" strokeWidth="1.2" />
      <path d="M170 40V60M174 40V60M166 45H178M166 50H178M166 55H178" strokeWidth="0.5" />
    </g>
    <circle className="kick-ring" cx="172" cy="50" r="8" fill="none" strokeWidth="1.5" />
    <g transform="translate(40 66)">
      <ellipse className="kick-pshadow" cx="-2" cy="10" rx="7" ry="1.6" />
      <g className="kick-player">
        <g className="kick-body">
          <rect className="kick-leg kick-fill" x="-5" y="-4" width="4" height="13" rx="1.6" />
          <path className="kick-fill" d="M-5 -16H1.5A7 7 0 0 1 1.5 -2H-5Z" />
          <circle className="kick-eye" cx="1.6" cy="-9" r="1.8" />
        </g>
      </g>
      <g className="kick-burst" strokeWidth="1.5" strokeLinecap="round">
        <path d="M15 -1L20 -4M16 3H22M15 7L20 10" />
      </g>
      <g transform="translate(9 2)">
        <g className="kick-x">
          <ellipse className="kick-shadow" cx="0" cy="7" rx="5" ry="1.4" />
          <g className="kick-y">
            <g className="kick-ball">
              <g className="kick-spin">
                <circle r="6.5" className="kick-fill" />
                <path className="kick-cut" d="M-3 -3.6H0.4A2.3 2.3 0 0 1 0.4 1H-1.3V3.8H-3Z" />
                <circle className="kick-eye" cx="0.5" cy="-1.3" r="0.9" />
              </g>
            </g>
          </g>
        </g>
      </g>
    </g>
  </svg>
);

export default KickScene;
