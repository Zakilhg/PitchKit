import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductGrid from "@/components/Product";
import SmartImage from "@/components/SmartImage";
import useJerseys from "@/hooks/useJerseys";
import { imageUrl, LEAGUE_LOGOS } from "@/lib/jersey";
import { gsap, SplitText, useMotion, useReveal } from "@/lib/motion";
import { cn } from "@/lib/utils";

const HERO_PHOTOS = ["barca1.jpg", "liverpool-1.jpg", "REAL-MADRIR1jpg.jpg"];
const TICKER = ["Premier League", "La Liga", "Serie A", "Bundesliga", "Ligue 1", "Sizes S–XL"];

const PERKS = [
  { icon: Truck, title: "Free shipping over $100", text: "Tracked delivery on every order." },
  { icon: RotateCcw, title: "30-day returns", text: "Wrong size? Send it back unworn." },
  {
    icon: ShieldCheck,
    title: "Secure checkout",
    text: "Card details stay with the payment provider.",
  },
];

const SectionHeader = ({ eyebrow, title, id, action }) => (
  <div className="mb-8 flex items-end justify-between gap-6" data-reveal>
    <div>
      <p className="mb-2 font-mono text-xs tracking-wider text-muted-foreground uppercase">
        {eyebrow}
      </p>
      <h2 id={id} className="text-2xl font-semibold sm:text-3xl">
        {title}
      </h2>
    </div>
    {action}
  </div>
);

const Hero = () => {
  const root = useRef(null);

  useMotion(
    () => {
      const title = SplitText.create("[data-hero-title]", { type: "lines, words", mask: "lines" });
      const intro = gsap.timeline({ defaults: { ease: "power4.out" } });

      intro
        .fromTo(
          "[data-hero-photo]",
          { clipPath: "inset(100% 0% 0% 0%)", scale: 1.35 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            scale: 1.15,
            duration: 1.4,
            stagger: 0.12,
            ease: "expo.out",
          },
        )
        .from("[data-hero-shade]", { autoAlpha: 0, duration: 1 }, 0.2)
        .to(
          "[data-hero-eyebrow]",
          {
            duration: 1.1,
            scrambleText: {
              text: "{original}",
              chars: "upperCase",
              speed: 0.6,
              revealDelay: 0.2,
            },
          },
          0.45,
        )
        .from(title.words, { yPercent: 110, duration: 1, stagger: 0.06 }, 0.5)
        .from("[data-hero-fade]", { autoAlpha: 0, y: 20, duration: 0.8, stagger: 0.1 }, 0.9);

      // Photos drift slower than the page as you scroll past.
      gsap.to("[data-hero-photo]", {
        yPercent: 6,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-neutral-950"
    >
      {/* Portrait photos: one on phones, three side by side from md up, so none gets cropped hard. */}
      <div className="absolute inset-0 -z-10 grid md:grid-cols-3">
        {HERO_PHOTOS.map((file, index) => (
          <div
            key={file}
            className={cn("relative overflow-hidden", index > 0 && "hidden md:block")}
          >
            <SmartImage
              data-hero-photo
              file={file}
              sizes="(min-width: 768px) 34vw, 100vw"
              priority={index === 0}
              className="object-[center_25%] will-change-transform"
            />
          </div>
        ))}
      </div>
      <div data-hero-shade className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/0" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/10 to-transparent" />
      </div>

      <div className="container-page flex min-h-[min(82svh,760px)] flex-col justify-end pt-24 pb-12 text-white sm:pb-16">
        <p
          data-hero-eyebrow
          className="mb-4 font-mono text-xs tracking-wider text-white/75 uppercase"
        >
          Home &amp; away kits · Europe&apos;s top five leagues
        </p>
        <h1
          id="hero-title"
          data-hero-title
          className="max-w-3xl text-5xl font-semibold tracking-tighter sm:text-7xl"
        >
          Wear your club&apos;s colours.
        </h1>
        <p data-hero-fade className="mt-5 max-w-xl text-base text-white/80 sm:text-lg">
          Jerseys from the Premier League, La Liga, Serie A, Bundesliga and Ligue 1, in every size
          from S to XL.
        </p>
        <div data-hero-fade className="mt-8 flex flex-wrap items-center gap-3">
          <Button asChild size="lg" className="bg-white text-neutral-900 hover:bg-white/90">
            <Link to="/shop">
              Shop all jerseys <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white/20 hover:text-white dark:border-white/30 dark:bg-white/10 dark:hover:bg-white/20"
          >
            <Link to="/#new">New this season</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

/** An endless strip of leagues; it speeds up while you scroll and slows on hover. */
const Ticker = () => {
  const root = useRef(null);

  useMotion(
    (contextSafe) => {
      const loop = gsap.to("[data-ticker-track]", {
        xPercent: -50,
        duration: 28,
        ease: "none",
        repeat: -1,
      });

      const onScroll = contextSafe(() => {
        gsap
          .timeline()
          .to(loop, { timeScale: 3.5, duration: 0.2, ease: "power1.out" })
          .to(loop, { timeScale: 1, duration: 1.2, ease: "power2.out" });
      });
      const slow = contextSafe(() => gsap.to(loop, { timeScale: 0.25, duration: 0.5 }));
      const resume = contextSafe(() => gsap.to(loop, { timeScale: 1, duration: 0.5 }));

      const el = root.current;
      window.addEventListener("wheel", onScroll, { passive: true });
      el.addEventListener("pointerenter", slow);
      el.addEventListener("pointerleave", resume);
      return () => {
        window.removeEventListener("wheel", onScroll);
        el.removeEventListener("pointerenter", slow);
        el.removeEventListener("pointerleave", resume);
      };
    },
    { scope: root },
  );

  // Two identical halves so moving by -50% loops seamlessly.
  const half = (key) => (
    <ul key={key} className="flex shrink-0 items-center">
      {TICKER.map((label) => (
        <li key={label} className="flex items-center">
          <span className="px-6 font-mono text-sm tracking-widest whitespace-nowrap uppercase">
            {label}
          </span>
          <span className="size-1.5 rounded-full bg-brand" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );

  return (
    // Decorative: the same leagues are links further down the page.
    <div ref={root} className="overflow-hidden border-b bg-background py-4" aria-hidden="true">
      <div data-ticker-track className="flex w-max will-change-transform">
        {[0, 1, 2, 3].map(half)}
      </div>
    </div>
  );
};

const Home = () => {
  const root = useRef(null);
  const { jerseys, isLoading, error } = useJerseys();

  // Leagues that actually have jerseys, with how many.
  const leagues = Object.entries(
    jerseys.reduce((counts, jersey) => {
      if (jersey.league_name) counts[jersey.league_name] = (counts[jersey.league_name] || 0) + 1;
      return counts;
    }, {}),
  );

  // Reveal sections and cards as they scroll in; re-run once the catalog arrives.
  useReveal(root, [jerseys.length]);

  useMotion(
    () => {
      gsap.fromTo(
        "[data-story-photo]",
        { clipPath: "inset(12% 12% 12% 12% round 16px)", scale: 1.2 },
        {
          clipPath: "inset(0% 0% 0% 0% round 0px)",
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-story]",
            start: "top 85%",
            end: "center 55%",
            scrub: 0.6,
          },
        },
      );
    },
    { scope: root },
  );

  return (
    <main ref={root}>
      <Hero />
      <Ticker />

      <section id="new" aria-labelledby="new-title" className="container-page scroll-mt-28 py-20">
        <SectionHeader
          eyebrow="Just landed"
          title="New this season"
          id="new-title"
          action={
            <Button asChild variant="ghost" className="-mr-3">
              <Link to="/shop">
                View all <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          }
        />
        <ProductGrid
          products={jerseys.slice(0, 8)}
          isLoading={isLoading}
          error={error}
          label="New jerseys"
        />
      </section>

      {leagues.length > 0 && (
        <section aria-labelledby="leagues-title" className="container-page pb-20">
          <SectionHeader
            eyebrow="Shop by league"
            title="Find your competition"
            id="leagues-title"
          />
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {leagues.map(([name, count]) => (
              <li key={name} data-reveal>
                <Link
                  to={`/shop?league=${encodeURIComponent(name)}`}
                  className="group flex h-full flex-col rounded-xl border bg-card p-5 transition duration-300 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-lg hover:shadow-black/5"
                >
                  <span className="grid size-14 place-items-center rounded-lg border bg-muted/50 p-2.5 transition duration-300 group-hover:rotate-[-4deg]">
                    {/* Full colour in light mode; a clean white mark on dark where it reads well. */}
                    {LEAGUE_LOGOS[name] && (
                      <img
                        src={imageUrl(LEAGUE_LOGOS[name].file)}
                        alt=""
                        className={cn(
                          "max-h-full max-w-full object-contain",
                          LEAGUE_LOGOS[name].monoOnDark && "dark:brightness-0 dark:invert",
                        )}
                        loading="lazy"
                      />
                    )}
                  </span>
                  <span className="mt-6 flex items-end justify-between gap-2">
                    <span>
                      <span className="block font-medium">{name}</span>
                      <span className="text-sm text-muted-foreground">
                        {count} {count === 1 ? "jersey" : "jerseys"}
                      </span>
                    </span>
                    <ArrowRight
                      className="size-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-foreground"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section data-story aria-labelledby="story-title" className="container-page pb-20">
        <div className="grid overflow-hidden rounded-2xl border bg-card md:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden bg-surface md:aspect-auto md:min-h-[520px]">
            <SmartImage
              data-story-photo
              file="milan1.jpg"
              sizes="(min-width: 768px) 50vw, 100vw"
              className="will-change-transform"
            />
          </div>
          <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16" data-reveal>
            <p className="mb-3 font-mono text-xs tracking-wider text-muted-foreground uppercase">
              Off the pitch
            </p>
            <h2 id="story-title" className="text-3xl font-semibold sm:text-4xl">
              Made for matchday. Worn every day.
            </h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              Europe&apos;s biggest clubs in one place. Save the kits you like, compare home and
              away, and pick your size in a couple of taps.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/shop">Browse the shop</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/shop?league=Serie A">Serie A kits</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Why shop with us" className="border-t">
        <ul className="container-page grid gap-8 py-12 sm:grid-cols-3">
          {PERKS.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-4" data-reveal>
              <span className="grid size-10 shrink-0 place-items-center rounded-full border">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-sm font-medium">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export default Home;
