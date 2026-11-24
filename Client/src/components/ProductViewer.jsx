import { useCallback, useEffect, useRef, useState } from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { ChevronLeft, ChevronRight, Minus, Plus, X } from "lucide-react";
import { imageUrl, optimizedUrl } from "@/lib/jersey";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/motion";
import { cn } from "@/lib/utils";

const ZOOM = 2.5;
const MAX_ZOOM = 4;
const SWIPE = 60; // px before a horizontal drag changes photo
const pad = (n) => String(n).padStart(2, "0");

/**
 * Full-screen photo viewer, in the spirit of the big sportswear stores:
 * click to zoom where you point, move the mouse to explore (or drag on touch),
 * scroll to zoom further. A mini-map shows which part of the shirt you're on.
 * Arrows, swipes, thumbnails and the keyboard switch photos.
 */
const ProductViewer = ({ images, name, startIndex = 0, onClose }) => {
  const [index, setIndex] = useState(startIndex);
  const [zoomed, setZoomed] = useState(false);
  const [hiResReady, setHiResReady] = useState(false);
  // The dialog renders in a portal a tick after mount, so track the stage
  // element in state and start the effects once it exists.
  const stage = useRef(null);
  const [stageEl, setStageEl] = useState(null);
  const attachStage = useCallback((el) => {
    stage.current = el;
    setStageEl(el);
  }, []);
  const frame = useRef(null);
  const view = useRef({ s: 1, nx: 0, ny: 0 });
  const tweens = useRef(null);
  const file = images[index];

  // Pan targets for a given zoom and pointer position (-1..1 from the centre).
  const panFor = useCallback((s, nx, ny) => {
    const st = stage.current.getBoundingClientRect();
    const overflowX = Math.max(0, (s * frame.current.offsetWidth - st.width) / 2);
    const overflowY = Math.max(0, (s * frame.current.offsetHeight - st.height) / 2);
    return { x: -nx * overflowX, y: -ny * overflowY };
  }, []);

  useGSAP(
    () => {
      if (!stageEl) return;
      const reduce = prefersReducedMotion();
      const speed = reduce ? 0 : 0.6;
      tweens.current = {
        x: gsap.quickTo(frame.current, "x", { duration: speed, ease: "power3" }),
        y: gsap.quickTo(frame.current, "y", { duration: speed, ease: "power3" }),
      };

      // Keep the mini-map rectangle in step with whatever the frame is doing.
      const syncMiniMap = () => {
        const rect = stage.current?.querySelector("[data-minimap-rect]");
        if (!rect || !frame.current) return;
        const s = gsap.getProperty(frame.current, "scale");
        const x = gsap.getProperty(frame.current, "x");
        const y = gsap.getProperty(frame.current, "y");
        const st = stage.current.getBoundingClientRect();
        const w = frame.current.offsetWidth * s;
        const h = frame.current.offsetHeight * s;
        const fw = Math.min(1, st.width / w);
        const fh = Math.min(1, st.height / h);
        const cx = 0.5 - x / w;
        const cy = 0.5 - y / h;
        gsap.set(rect, {
          left: `${(cx - fw / 2) * 100}%`,
          top: `${(cy - fh / 2) * 100}%`,
          width: `${fw * 100}%`,
          height: `${fh * 100}%`,
        });
      };
      gsap.ticker.add(syncMiniMap);

      gsap.from(stage.current, { autoAlpha: 0, scale: 0.97, duration: reduce ? 0 : 0.4 });
      // Handlers below start tweens after this runs; stop them when the viewer closes.
      const el = frame.current;
      return () => {
        gsap.ticker.remove(syncMiniMap);
        gsap.killTweensOf(el);
      };
    },
    { scope: stage, dependencies: [stageEl] },
  );

  const zoomTo = (s, nx = view.current.nx, ny = view.current.ny) => {
    view.current = { s, nx, ny };
    setZoomed(s > 1);
    const { x, y } = s > 1 ? panFor(s, nx, ny) : { x: 0, y: 0 };
    gsap.to(frame.current, {
      scale: s,
      duration: prefersReducedMotion() ? 0 : 0.5,
      ease: "power3.out",
      overwrite: "auto",
    });
    tweens.current.x(x);
    tweens.current.y(y);
    gsap.to(stage.current.querySelector("[data-minimap]"), {
      autoAlpha: s > 1 ? 1 : 0,
      duration: 0.25,
    });
  };

  const go = (direction) => {
    if (images.length < 2) return;
    const next = (index + direction + images.length) % images.length;
    view.current = { s: 1, nx: 0, ny: 0 };
    gsap.set(frame.current, { scale: 1, x: 0, y: 0 });
    gsap.set(stage.current.querySelector("[data-minimap]"), { autoAlpha: 0 });
    setZoomed(false);
    setHiResReady(false);
    setIndex(next);
    if (!prefersReducedMotion()) {
      gsap.fromTo(
        frame.current,
        { xPercent: direction * 8, autoAlpha: 0 },
        { xPercent: 0, autoAlpha: 1, duration: 0.45, ease: "power3.out" },
      );
    }
  };

  const pointerNorm = (event) => {
    const st = stage.current.getBoundingClientRect();
    const clamp = gsap.utils.clamp(-1, 1);
    return {
      nx: clamp((event.clientX - st.left - st.width / 2) / (st.width / 2)),
      ny: clamp((event.clientY - st.top - st.height / 2) / (st.height / 2)),
    };
  };

  // Pointer handling: mouse = click to zoom + move to explore;
  // touch = double-tap to zoom, drag to pan when zoomed, swipe to browse.
  const drag = useRef(null);
  const lastTap = useRef(0);

  const onPointerDown = (event) => {
    drag.current = { x: event.clientX, y: event.clientY, moved: false, ...view.current };
  };

  const onPointerMove = (event) => {
    const { s } = view.current;
    if (event.pointerType === "mouse") {
      if (s > 1) {
        const { nx, ny } = pointerNorm(event);
        view.current = { s, nx, ny };
        const { x, y } = panFor(s, nx, ny);
        tweens.current.x(x);
        tweens.current.y(y);
      }
      return;
    }
    if (!drag.current) return;
    const dx = event.clientX - drag.current.x;
    const dy = event.clientY - drag.current.y;
    if (Math.hypot(dx, dy) > 6) drag.current.moved = true;
    if (s > 1) {
      // Convert the finger's movement into the same -1..1 pan space.
      const st = stage.current.getBoundingClientRect();
      const toNorm = (v, size, frameSize) => v / Math.max(1, (s * frameSize - size) / 2);
      const clamp = gsap.utils.clamp(-1, 1);
      const nx = clamp(drag.current.nx - toNorm(dx, st.width, frame.current.offsetWidth));
      const ny = clamp(drag.current.ny - toNorm(dy, st.height, frame.current.offsetHeight));
      view.current = { s, nx, ny };
      const { x, y } = panFor(s, nx, ny);
      tweens.current.x(x);
      tweens.current.y(y);
    } else {
      gsap.set(frame.current, { x: dx * 0.6 });
    }
  };

  const onPointerUp = (event) => {
    const start = drag.current;
    drag.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;

    if (event.pointerType === "mouse") {
      if (start.moved) return;
      if (view.current.s > 1) zoomTo(1, 0, 0);
      else {
        const { nx, ny } = pointerNorm(event);
        zoomTo(ZOOM, nx, ny);
      }
      return;
    }

    if (view.current.s === 1 && Math.abs(dx) > SWIPE) {
      go(dx < 0 ? 1 : -1);
      return;
    }
    if (view.current.s === 1) gsap.to(frame.current, { x: 0, duration: 0.3 });

    if (!start.moved) {
      const now = Date.now();
      if (now - lastTap.current < 300) {
        const { nx, ny } = pointerNorm(event);
        zoomTo(view.current.s > 1 ? 1 : ZOOM, nx, ny);
        lastTap.current = 0;
      } else {
        lastTap.current = now;
      }
    }
  };

  // Wheel zoom needs a non-passive listener to stop the page from scrolling.
  useEffect(() => {
    const el = stageEl;
    if (!el) return undefined;
    const onWheel = (event) => {
      event.preventDefault();
      const factor = event.deltaY < 0 ? 1.15 : 1 / 1.15;
      const s = gsap.utils.clamp(1, MAX_ZOOM, view.current.s * factor);
      const { nx, ny } = pointerNorm(event);
      zoomTo(s < 1.05 ? 1 : s, nx, ny);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [stageEl]); // eslint-disable-line react-hooks/exhaustive-deps -- handlers only touch refs

  const onKeyDown = (event) => {
    if (event.key === "ArrowRight") go(1);
    else if (event.key === "ArrowLeft") go(-1);
    else if (event.key === "+" || event.key === "=")
      zoomTo(Math.min(MAX_ZOOM, view.current.s + 0.75));
    else if (event.key === "-") zoomTo(Math.max(1, view.current.s - 0.75));
    else if (event.key === "0") zoomTo(1, 0, 0);
  };

  return (
    <DialogPrimitive.Root open onOpenChange={(open) => !open && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Content
          onKeyDown={onKeyDown}
          className="fixed inset-0 z-50 flex flex-col bg-background outline-none"
        >
          <header className="flex h-14 shrink-0 items-center gap-3 border-b px-4 sm:px-6">
            <DialogPrimitive.Title className="min-w-0 truncate text-sm font-medium">
              {name}
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="sr-only">
              Photo viewer. Click or double-tap to zoom, use the arrow keys to change photo.
            </DialogPrimitive.Description>
            <span className="font-mono text-xs whitespace-nowrap text-muted-foreground tabular-nums">
              {pad(index + 1)} / {pad(images.length)}
            </span>
            <div className="ml-auto flex items-center gap-1">
              <button
                type="button"
                onClick={() => zoomTo(Math.max(1, view.current.s - 0.75))}
                disabled={!zoomed}
                aria-label="Zoom out"
                className="grid size-10 cursor-pointer place-items-center rounded-md hover:bg-accent disabled:opacity-40"
              >
                <Minus className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => zoomTo(Math.min(MAX_ZOOM, Math.max(ZOOM, view.current.s + 0.75)))}
                aria-label="Zoom in"
                className="grid size-10 cursor-pointer place-items-center rounded-md hover:bg-accent"
              >
                <Plus className="size-4" />
              </button>
              <DialogPrimitive.Close
                aria-label="Close viewer"
                className="ml-2 grid size-10 cursor-pointer place-items-center rounded-full bg-muted hover:bg-accent"
              >
                <X className="size-4" />
              </DialogPrimitive.Close>
            </div>
          </header>

          <div
            ref={attachStage}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={() => (drag.current = null)}
            className={cn(
              "relative grid flex-1 touch-none place-items-center overflow-hidden bg-surface select-none",
              zoomed ? "cursor-zoom-out" : "cursor-zoom-in",
            )}
          >
            <div ref={frame} className="relative will-change-transform">
              {/* The 960px copy shows at once; the original fades in over it for full detail. */}
              <img
                src={optimizedUrl(file, 960)}
                alt={`${name}, photo ${index + 1} of ${images.length}`}
                draggable="false"
                className="block max-h-[calc(100dvh-11rem)] max-w-[92vw] object-contain"
              />
              <img
                key={file}
                src={imageUrl(file)}
                alt=""
                draggable="false"
                onLoad={() => setHiResReady(true)}
                className={cn(
                  "absolute inset-0 size-full object-contain transition-opacity duration-500",
                  hiResReady ? "opacity-100" : "opacity-0",
                )}
              />
            </div>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onPointerDown={(e) => e.stopPropagation()}
                  onPointerUp={(e) => e.stopPropagation()}
                  onClick={() => go(-1)}
                  aria-label="Previous photo"
                  className="absolute top-1/2 left-4 grid size-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-background/90 shadow-md backdrop-blur transition hover:scale-105"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  type="button"
                  onPointerDown={(e) => e.stopPropagation()}
                  onPointerUp={(e) => e.stopPropagation()}
                  onClick={() => go(1)}
                  aria-label="Next photo"
                  className="absolute top-1/2 right-4 grid size-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-background/90 shadow-md backdrop-blur transition hover:scale-105"
                >
                  <ChevronRight className="size-5" />
                </button>
              </>
            )}

            {/* Mini-map: where the zoomed view sits on the whole photo. */}
            <div
              data-minimap
              aria-hidden="true"
              className="pointer-events-none invisible absolute right-4 bottom-4 w-20 overflow-hidden rounded-md border-2 border-background shadow-lg sm:w-24"
            >
              <img src={optimizedUrl(file, 480)} alt="" className="block w-full" />
              <div className="absolute inset-0 bg-black/40" />
              <div
                data-minimap-rect
                className="absolute rounded-sm border-2 border-brand bg-white/10"
              />
            </div>

            <span
              className={cn(
                "pointer-events-none absolute bottom-4 left-1/2 hidden -translate-x-1/2 rounded-full bg-background/90 px-3 py-1.5 font-mono text-[11px] tracking-wider text-muted-foreground uppercase shadow-sm backdrop-blur transition-opacity sm:block",
                zoomed && "opacity-0",
              )}
            >
              Click to zoom · Scroll for more · ← → to browse
            </span>
            <span
              className={cn(
                "pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-background/90 px-3 py-1.5 font-mono text-[11px] tracking-wider whitespace-nowrap text-muted-foreground uppercase shadow-sm backdrop-blur transition-opacity sm:hidden",
                zoomed && "opacity-0",
              )}
            >
              Double-tap to zoom · Swipe
            </span>
          </div>

          {images.length > 1 && (
            <nav
              aria-label="Photos"
              className="flex shrink-0 justify-center gap-2 border-t bg-background px-4 py-3"
            >
              {images.map((image, i) => (
                <button
                  type="button"
                  key={image}
                  onClick={() => i !== index && go(i - index)}
                  aria-label={`Show photo ${i + 1}`}
                  aria-current={i === index ? "true" : undefined}
                  className={cn(
                    "h-16 w-12 cursor-pointer overflow-hidden rounded-md ring-offset-2 ring-offset-background transition",
                    i === index ? "ring-2 ring-foreground" : "opacity-60 hover:opacity-100",
                  )}
                >
                  <img src={optimizedUrl(image, 480)} alt="" className="size-full object-cover" />
                </button>
              ))}
            </nav>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export default ProductViewer;
