import { useRef, useState } from "react";
import { ZoomIn } from "lucide-react";
import { imageUrl } from "@/lib/jersey";
import { gsap, useGSAP } from "@/lib/motion";

const LENS = 220; // px
const START_ZOOM = 2.5;
const MIN_ZOOM = 1.5;
const MAX_ZOOM = 4;
const FINE_POINTER = "(hover: hover) and (pointer: fine)";

/**
 * Hover lens for product photos. Follows the cursor and shows the original,
 * full-resolution file magnified; scroll inside it to change the zoom.
 * Only on devices with a mouse or trackpad; touch keeps the plain photo.
 */
const Magnifier = ({ file, children }) => {
  const root = useRef(null);
  const zoom = useRef(START_ZOOM);
  const point = useRef({ x: 0, y: 0 });
  const [armed, setArmed] = useState(false); // load the big file on first hover
  const [level, setLevel] = useState(START_ZOOM);

  useGSAP(
    () => {
      if (!window.matchMedia(FINE_POINTER).matches) return;
      gsap.set("[data-lens]", { autoAlpha: 0, scale: 0.6, xPercent: -50, yPercent: -50 });

      const el = root.current;
      const lensX = gsap.quickTo("[data-lens]", "x", { duration: 0.25, ease: "power3" });
      const lensY = gsap.quickTo("[data-lens]", "y", { duration: 0.25, ease: "power3" });
      const viewX = gsap.quickTo("[data-lens-view]", "x", { duration: 0.25, ease: "power3" });
      const viewY = gsap.quickTo("[data-lens-view]", "y", { duration: 0.25, ease: "power3" });

      // Keep the spot under the cursor in the middle of the lens.
      const follow = (x, y) => {
        point.current = { x, y };
        lensX(x);
        lensY(y);
        viewX(LENS / 2 - x * zoom.current);
        viewY(LENS / 2 - y * zoom.current);
      };

      const onMove = (event) => {
        const rect = el.getBoundingClientRect();
        follow(event.clientX - rect.left, event.clientY - rect.top);
      };
      const onEnter = (event) => {
        setArmed(true);
        const rect = el.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        gsap.set("[data-lens]", { x, y });
        // Same size as the box so object-cover crops the big copy identically.
        gsap.set("[data-lens-view]", {
          width: rect.width,
          height: rect.height,
          transformOrigin: "0 0",
          scale: zoom.current,
          x: LENS / 2 - x * zoom.current,
          y: LENS / 2 - y * zoom.current,
        });
        follow(x, y);
        gsap.to("[data-lens]", { autoAlpha: 1, scale: 1, duration: 0.35, ease: "back.out(1.8)" });
        gsap.to("[data-zoom-hint]", { autoAlpha: 0, duration: 0.2 });
      };
      const onLeave = () => {
        gsap.to("[data-lens]", { autoAlpha: 0, scale: 0.6, duration: 0.25, ease: "power2.in" });
        gsap.to("[data-zoom-hint]", { autoAlpha: 1, duration: 0.3, delay: 0.2 });
      };
      const onWheel = (event) => {
        event.preventDefault();
        const next = gsap.utils.clamp(
          MIN_ZOOM,
          MAX_ZOOM,
          zoom.current + (event.deltaY < 0 ? 0.5 : -0.5),
        );
        if (next === zoom.current) return;
        zoom.current = next;
        setLevel(next);
        gsap.to("[data-lens-view]", { scale: next, duration: 0.3, ease: "power3" });
        follow(point.current.x, point.current.y);
      };

      el.addEventListener("pointerenter", onEnter);
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      el.addEventListener("wheel", onWheel, { passive: false });
      return () => {
        el.removeEventListener("pointerenter", onEnter);
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
        el.removeEventListener("wheel", onWheel);
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className="group/zoom absolute inset-0 [@media(pointer:fine)]:cursor-zoom-in">
      {children}

      <span
        data-zoom-hint
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 left-3 hidden items-center gap-1.5 rounded-full bg-background/85 px-2.5 py-1 text-xs font-medium shadow-sm backdrop-blur [@media(hover:hover)_and_(pointer:fine)]:inline-flex"
      >
        <ZoomIn className="size-3.5" /> Hover to zoom
      </span>

      <div
        data-lens
        aria-hidden="true"
        className="pointer-events-none invisible absolute top-0 left-0 z-10 overflow-hidden rounded-full bg-surface shadow-2xl ring-2 ring-white/90 ring-offset-0"
        style={{ width: LENS, height: LENS }}
      >
        <div data-lens-view className="absolute top-0 left-0">
          {armed && (
            <img src={imageUrl(file)} alt="" decoding="async" className="size-full object-cover" />
          )}
        </div>
        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-2 py-0.5 font-mono text-[10px] text-white tabular-nums">
          {level.toFixed(1)}×
        </span>
      </div>
    </div>
  );
};

export default Magnifier;
