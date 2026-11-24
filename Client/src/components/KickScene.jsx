import { cn } from "@/lib/utils";

/**
 * The logo gets kicked across a pitch into the net. Animated purely in CSS
 * (the .kick-* rules in index.html) so the same scene can play as the boot
 * splash before any JavaScript runs. Keep this markup in sync with index.html.
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
      <g className="kick-burst" strokeWidth="1.5" strokeLinecap="round">
        <path d="M-9 0H-14M-7 -6L-11 -10M-7 6L-11 10" />
      </g>
      <g className="kick-x">
        <ellipse className="kick-shadow" cx="0" cy="9" rx="6" ry="1.6" />
        <g className="kick-y">
          <g className="kick-ball">
            <g className="kick-spin">
              <g transform="translate(-7 -7) scale(0.5833)">
                <rect width="24" height="24" rx="6" className="kick-logo-bg" />
                <path d="M7 6.5h6.2a4.3 4.3 0 0 1 0 8.6H10V18H7z" className="kick-logo-fg" />
                <circle cx="13" cy="10.8" r="1.6" className="kick-logo-dot" />
              </g>
            </g>
          </g>
        </g>
      </g>
    </g>
  </svg>
);

export default KickScene;
