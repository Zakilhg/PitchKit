import { useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/motion";

/*
 * A VAR offside review, drawn as a broadcast replay: the missing page is the
 * attacker, caught 0.404 m beyond the last defender.
 */

// Pitch coordinates (SVG units). The attacker is 4 units past the defender's line.
const W = 640;
const H = 400;
const DEFENDER_X = 404;
const ATTACKER_X = 444;
const PASSER = { x: 150, y: 250 };
const DEFENDER = { x: DEFENDER_X, y: 150 };
const ATTACKER = { x: ATTACKER_X, y: 214 };
const OTHERS = [
  { x: 330, y: 300, team: "def" },
  { x: 290, y: 110, team: "def" },
  { x: 250, y: 185, team: "att" },
];

const DEF_COLOR = "#38bdf8";
const ATT_COLOR = "#fb7185";

const Player = ({ x, y, team, label, ...props }) => (
  <g data-player transform={`translate(${x} ${y})`} {...props}>
    <circle r="15" fill={team === "att" ? ATT_COLOR : DEF_COLOR} fillOpacity="0.18" />
    <circle r="8" fill={team === "att" ? ATT_COLOR : DEF_COLOR} />
    {label && (
      <text
        y="-24"
        textAnchor="middle"
        className="fill-white font-mono text-[10px] tracking-widest uppercase"
      >
        {label}
      </text>
    )}
  </g>
);

const Pitch = () => (
  <svg
    viewBox={`0 0 ${W} ${H}`}
    className="block h-auto w-full"
    role="img"
    aria-labelledby="var-title"
  >
    <title id="var-title">
      Offside replay: the attacker is 0.404 metres beyond the last defender.
    </title>
    <defs>
      <linearGradient id="scan" x1="0" x2="1">
        <stop offset="0" stopColor="#4ade80" stopOpacity="0" />
        <stop offset="1" stopColor="#4ade80" stopOpacity="0.5" />
      </linearGradient>
      <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
        <path d="M32 0H0V32" fill="none" stroke="white" strokeOpacity="0.05" />
      </pattern>
    </defs>

    {/* Mown stripes and a measurement grid */}
    {Array.from({ length: 10 }, (_, i) => (
      <rect key={i} x={i * 64} width="64" height={H} fill={i % 2 ? "#0f2418" : "#12291c"} />
    ))}
    <rect width={W} height={H} fill="url(#grid)" />

    {/* Pitch markings: halfway line, penalty area, goal */}
    <g data-markings fill="none" stroke="white" strokeOpacity="0.35" strokeWidth="2">
      <path d="M24 24H616V376H24Z" />
      <path d="M24 140A60 60 0 0 1 24 260" />
      <path d="M616 110H520V290H616" />
      <path d="M616 160H584V240H616" />
      <path d="M520 160A40 40 0 0 0 520 240" />
    </g>

    {/* The pass */}
    <path
      data-pass
      d={`M${PASSER.x} ${PASSER.y}Q300 ${PASSER.y - 10} ${ATTACKER.x - 14} ${ATTACKER.y + 6}`}
      fill="none"
      stroke="white"
      strokeOpacity="0.7"
      strokeWidth="2"
      strokeDasharray="6 6"
    />

    {/* Calibrated offside lines */}
    <line
      data-line="def"
      x1={DEFENDER_X}
      x2={DEFENDER_X}
      y1="24"
      y2="376"
      stroke={DEF_COLOR}
      strokeWidth="2"
    />
    <line
      data-line="att"
      x1={ATTACKER_X}
      x2={ATTACKER_X}
      y1="24"
      y2="376"
      stroke={ATT_COLOR}
      strokeWidth="2"
    />

    {OTHERS.map((p) => (
      <Player key={`${p.x}-${p.y}`} {...p} />
    ))}
    <Player {...PASSER} team="att" />
    <Player {...DEFENDER} team="def" label="Last defender" />
    <Player {...ATTACKER} team="att" label="Your page" data-attacker />

    {/* Ball */}
    <circle data-ball cx={ATTACKER.x - 14} cy={ATTACKER.y + 6} r="5" fill="white" />

    {/* Gap measurement */}
    <g data-gap>
      <path
        d={`M${DEFENDER_X} 340V350H${ATTACKER_X}V340`}
        fill="none"
        stroke="white"
        strokeWidth="1.5"
      />
      <rect x={DEFENDER_X - 16} y="356" width="72" height="20" rx="4" fill="#fb7185" />
      <text
        data-gap-value
        x={(DEFENDER_X + ATTACKER_X) / 2}
        y="370"
        textAnchor="middle"
        className="fill-neutral-950 font-mono text-[11px] font-semibold"
      >
        +0.404 m
      </text>
    </g>

    {/* Scanning beam used while the frame is "calibrated" */}
    <rect data-scan x="-80" y="0" width="80" height={H} fill="url(#scan)" />
  </svg>
);

const NotFound = () => {
  const root = useRef(null);
  const { pathname } = useLocation();
  const timeline = useRef(null);

  useGSAP(
    () => {
      // Reduced motion: show the final decision straight away.
      if (prefersReducedMotion()) {
        gsap.set("[data-scan]", { autoAlpha: 0 });
        return;
      }

      const clock = { t: 0 };
      const gap = { m: 0 };
      const ballPath = { p: 0 };
      const pass = root.current.querySelector("[data-pass]");
      const length = pass.getTotalLength();

      timeline.current = gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from("[data-copy] > *", { autoAlpha: 0, y: 16, stagger: 0.08, duration: 0.6 })
        .from("[data-screen]", { autoAlpha: 0, scale: 0.97, duration: 0.6 }, 0)
        .to(
          "[data-status]",
          { duration: 0.8, scrambleText: { text: "Searching frame…", chars: "01#/" } },
          0.2,
        )
        .to(
          clock,
          {
            t: 244,
            duration: 3.2,
            ease: "none",
            onUpdate: () => {
              const s = Math.round(clock.t);
              // Ends on 90+4:04.
              root.current.querySelector("[data-clock]").textContent =
                `90+${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
            },
          },
          0.2,
        )
        .fromTo("[data-scan]", { x: 0 }, { x: W + 80, duration: 1.1, ease: "power1.inOut" }, 0.4)
        .from("[data-markings] path", { drawSVG: 0, duration: 0.9, stagger: 0.08 }, 0.4)
        .from(
          "[data-player]",
          {
            scale: 0,
            transformOrigin: "center",
            duration: 0.5,
            stagger: 0.06,
            ease: "back.out(2.4)",
          },
          0.9,
        )
        .from("[data-pass]", { drawSVG: 0, duration: 0.7, ease: "power2.inOut" }, 1.4)
        .to(
          ballPath,
          {
            p: 1,
            duration: 0.7,
            ease: "power2.inOut",
            onUpdate: () => {
              const point = pass.getPointAtLength(length * ballPath.p);
              gsap.set("[data-ball]", { attr: { cx: point.x, cy: point.y } });
            },
          },
          1.4,
        )
        .to(
          "[data-status]",
          { duration: 0.6, scrambleText: { text: "Drawing lines…", chars: "01#/" } },
          2.0,
        )
        .from("[data-line='def']", { drawSVG: "50% 50%", duration: 0.6, ease: "expo.out" }, 2.1)
        .from("[data-line='att']", { drawSVG: "50% 50%", duration: 0.6, ease: "expo.out" }, 2.3)
        .from("[data-gap]", { autoAlpha: 0, y: 8, duration: 0.4 }, 2.7)
        .fromTo(
          gap,
          { m: 0 },
          {
            m: 0.404,
            duration: 0.8,
            ease: "power2.out",
            onUpdate: () => {
              root.current.querySelector("[data-gap-value]").textContent = `+${gap.m.toFixed(3)} m`;
            },
          },
          2.7,
        )
        .to(
          "[data-status]",
          { duration: 0.5, scrambleText: { text: "Offside", chars: "01#/" } },
          3.4,
        )
        .fromTo(
          "[data-verdict]",
          { autoAlpha: 0, scale: 1.6, rotate: -6 },
          { autoAlpha: 1, scale: 1, rotate: -3, duration: 0.45, ease: "back.out(2)" },
          3.5,
        )
        .fromTo(
          "[data-flash]",
          { autoAlpha: 0.45 },
          { autoAlpha: 0, duration: 0.6, ease: "power2.out", immediateRender: false },
          3.5,
        )
        .to(
          "[data-attacker]",
          { scale: 1.25, transformOrigin: "center", duration: 0.3, yoyo: true, repeat: 3 },
          3.6,
        );
    },
    { scope: root },
  );

  // Restarting an existing timeline creates nothing new, so it needs no contextSafe.
  const replay = () => timeline.current?.restart();

  return (
    <main
      ref={root}
      className="container-page grid items-center gap-10 py-12 lg:grid-cols-[1fr_1.15fr] lg:py-20"
    >
      <div data-copy className="max-w-lg">
        <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Error 404 · VAR decision
        </p>
        <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">This page is offside</h1>
        <p className="mt-4 text-muted-foreground">
          You made a run to{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground">
            {pathname}
          </code>
          , but it was beyond the last defender. The flag is up, so play restarts from somewhere
          that exists.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link to="/">
              <ArrowLeft aria-hidden="true" /> Back to kick-off
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/shop">Shop jerseys</Link>
          </Button>
          <Button size="lg" variant="ghost" onClick={replay}>
            <RotateCcw aria-hidden="true" /> Replay the check
          </Button>
        </div>
      </div>

      {/* Broadcast-style replay screen; always dark, like the real thing. */}
      <figure
        data-screen
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 text-white shadow-2xl shadow-black/20"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5 font-mono text-[11px] tracking-widest uppercase">
          <span className="flex items-center gap-2">
            <span className="size-2 animate-pulse rounded-full bg-red-500" aria-hidden="true" />
            VAR · Review
          </span>
          <span className="text-white/60">
            Cam 404 · <span data-clock>90+4:04</span>
          </span>
        </div>

        <div className="relative">
          <Pitch />
          <div data-flash className="pointer-events-none absolute inset-0 bg-red-500 opacity-0" />
          <div
            data-verdict
            className="absolute top-6 left-1/2 -translate-x-1/2 rounded-md border-2 border-white bg-red-600 px-4 py-1.5 font-mono text-lg font-bold tracking-[0.3em] uppercase shadow-lg"
          >
            Offside
          </div>
        </div>

        <figcaption className="flex items-center justify-between gap-4 border-t border-white/10 px-4 py-2.5 font-mono text-[11px] tracking-widest uppercase">
          <span className="text-white/60">
            Status:{" "}
            <span data-status className="text-white">
              Offside
            </span>
          </span>
          <span className="flex items-center gap-3 text-white/60">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full" style={{ background: DEF_COLOR }} /> Def
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full" style={{ background: ATT_COLOR }} /> Att
            </span>
          </span>
        </figcaption>
      </figure>
    </main>
  );
};

export default NotFound;
