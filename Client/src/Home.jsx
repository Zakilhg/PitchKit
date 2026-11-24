import { Link } from "react-router-dom";
import { ArrowRight, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductGrid from "@/components/Product";
import useJerseys from "@/hooks/useJerseys";
import { imageUrl, LEAGUE_LOGOS } from "@/lib/jersey";
import { cn } from "@/lib/utils";

const HERO_PHOTOS = ["barca1.jpg", "liverpool-1.jpg", "REAL-MADRIR1jpg.jpg"];

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
  <div className="mb-8 flex items-end justify-between gap-6">
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

const Hero = () => (
  <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-neutral-900">
    {/* Portrait photos: one on phones, three side by side from md up, so none gets cropped hard. */}
    <div className="absolute inset-0 -z-10 grid md:grid-cols-3">
      {HERO_PHOTOS.map((file, index) => (
        <img
          key={file}
          src={imageUrl(file)}
          alt=""
          width="600"
          height="800"
          fetchPriority={index === 0 ? "high" : undefined}
          className={cn(
            "size-full object-cover object-[center_25%]",
            index > 0 && "hidden md:block",
          )}
        />
      ))}
    </div>
    <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/30 to-black/0" />
    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/60 via-black/10 to-transparent" />

    <div className="container-page flex min-h-[min(82svh,760px)] flex-col justify-end pt-24 pb-12 text-white sm:pb-16">
      <p className="mb-4 font-mono text-xs tracking-wider text-white/75 uppercase">
        Home &amp; away kits · Europe&apos;s top five leagues
      </p>
      <h1 id="hero-title" className="max-w-3xl text-5xl font-semibold tracking-tighter sm:text-7xl">
        Wear your club&apos;s colours.
      </h1>
      <p className="mt-5 max-w-xl text-base text-white/80 sm:text-lg">
        Jerseys from the Premier League, La Liga, Serie A, Bundesliga and Ligue 1, in every size
        from S to XL.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
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

const Home = () => {
  const { jerseys, isLoading, error } = useJerseys();

  // Leagues that actually have jerseys, with how many.
  const leagues = Object.entries(
    jerseys.reduce((counts, jersey) => {
      if (jersey.league_name) counts[jersey.league_name] = (counts[jersey.league_name] || 0) + 1;
      return counts;
    }, {}),
  );

  return (
    <main>
      <Hero />

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
          <SectionHeader eyebrow="Shop by league" title="Find your competition" id="leagues-title" />
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {leagues.map(([name, count]) => (
              <li key={name}>
                <Link
                  to={`/shop?league=${encodeURIComponent(name)}`}
                  className="group flex h-full flex-col rounded-xl border bg-card p-5 transition hover:border-foreground/20 hover:shadow-sm"
                >
                  <span className="grid size-14 place-items-center rounded-lg bg-white p-2 ring-1 ring-black/5">
                    {LEAGUE_LOGOS[name] && (
                      <img
                        src={imageUrl(LEAGUE_LOGOS[name])}
                        alt=""
                        className="max-h-full max-w-full object-contain"
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
                      className="size-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="story-title" className="container-page pb-20">
        <div className="grid overflow-hidden rounded-2xl border bg-card md:grid-cols-2">
          <div className="relative aspect-[4/5] bg-surface md:aspect-auto md:min-h-[520px]">
            <img
              src={imageUrl("milan1.jpg")}
              alt=""
              loading="lazy"
              className="absolute inset-0 size-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
            <p className="mb-3 font-mono text-xs tracking-wider text-muted-foreground uppercase">
              Off the pitch
            </p>
            <h2 id="story-title" className="text-3xl font-semibold sm:text-4xl">
              Made for matchday. Worn every day.
            </h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              Europe&apos;s biggest clubs in one place. Save the kits you like, compare
              home and away, and pick your size in a couple of taps.
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
            <li key={title} className="flex gap-4">
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
