import { useLayoutEffect, useMemo, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ProductGrid from "@/components/Product";
import useJerseys from "@/hooks/useJerseys";
import { useFavorites } from "@/lib/cart";
import { Flip, gsap, prefersReducedMotion, ScrollTrigger, useReveal } from "@/lib/motion";
import { cn } from "@/lib/utils";

const SORTS = {
  newest: { label: "Newest", compare: () => 0 },
  "price-asc": { label: "Price: low to high", compare: (a, b) => a.price - b.price },
  "price-desc": { label: "Price: high to low", compare: (a, b) => b.price - a.price },
};

const FilterGroup = ({ title, children }) => (
  <fieldset>
    <legend className="mb-3 text-sm font-medium">{title}</legend>
    <div className="space-y-1">{children}</div>
  </fieldset>
);

const LeagueOption = ({ active, onClick, children, count }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={cn(
      "flex w-full cursor-pointer items-center justify-between rounded-md px-2.5 py-2 text-left text-sm transition hover:bg-accent",
      active ? "bg-accent font-medium text-foreground" : "text-muted-foreground",
    )}
  >
    {children}
    <span className="text-xs tabular-nums text-muted-foreground">{count}</span>
  </button>
);

const Filters = ({ leagues, league, total, inStockOnly, savedOnly, update }) => (
  <div className="space-y-8">
    <FilterGroup title="League">
      <LeagueOption active={!league} onClick={() => update("league", "")} count={total}>
        All leagues
      </LeagueOption>
      {leagues.map(([name, count]) => (
        <LeagueOption
          key={name}
          active={league === name}
          onClick={() => update("league", league === name ? "" : name)}
          count={count}
        >
          {name}
        </LeagueOption>
      ))}
    </FilterGroup>

    <FilterGroup title="Show">
      <div className="flex items-center gap-3 px-2.5 py-1.5">
        <Checkbox
          id="filter-stock"
          checked={inStockOnly}
          onCheckedChange={(checked) => update("stock", checked ? "1" : "")}
        />
        <Label htmlFor="filter-stock" className="font-normal">
          In stock only
        </Label>
      </div>
      <div className="flex items-center gap-3 px-2.5 py-1.5">
        <Checkbox
          id="filter-saved"
          checked={savedOnly}
          onCheckedChange={(checked) => update("saved", checked ? "1" : "")}
        />
        <Label htmlFor="filter-saved" className="font-normal">
          Saved only
        </Label>
      </div>
    </FilterGroup>
  </div>
);

const Shop = () => {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") || "";
  const league = params.get("league") || "";
  const sort = SORTS[params.get("sort")] ? params.get("sort") : "newest";
  const inStockOnly = params.get("stock") === "1";
  const savedOnly = params.get("saved") === "1";
  const favorites = useFavorites();
  const { jerseys, isLoading, error } = useJerseys();

  const leagues = useMemo(
    () =>
      Object.entries(
        jerseys.reduce((counts, jersey) => {
          if (jersey.league_name)
            counts[jersey.league_name] = (counts[jersey.league_name] || 0) + 1;
          return counts;
        }, {}),
      ).sort(([a], [b]) => a.localeCompare(b)),
    [jerseys],
  );

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    return jerseys
      .filter((jersey) => !league || jersey.league_name === league)
      .filter((jersey) => !inStockOnly || Number(jersey.quantity) > 0)
      .filter((jersey) => !savedOnly || favorites.includes(jersey.id))
      .filter(
        (jersey) =>
          !term ||
          [jersey.name, jersey.club_name, jersey.brand_name, jersey.league_name]
            .filter(Boolean)
            .some((value) => value.toLowerCase().includes(term)),
      )
      .sort(SORTS[sort].compare);
  }, [jerseys, league, inStockOnly, savedOnly, favorites, query, sort]);

  // Filters and sorting animate the grid: record where every card is now,
  // then let Flip move them to their new spots after React re-renders.
  const root = useRef(null);
  const grid = useRef(null);
  const flipState = useRef(null);

  const apply = (next) => {
    if (grid.current && !prefersReducedMotion()) {
      flipState.current = Flip.getState(grid.current.querySelectorAll("[data-flip-id]"));
    }
    setParams(next, { replace: true });
  };

  useLayoutEffect(() => {
    const state = flipState.current;
    flipState.current = null;
    if (!state || !grid.current) return;
    const cards = grid.current.querySelectorAll("[data-flip-id]");
    // Cards still waiting for their scroll reveal may now sit in view: show them.
    cards.forEach((card) => {
      if (card.dataset.revealed) return;
      card.dataset.revealed = "true";
      gsap.set(card, { autoAlpha: 1, y: 0 });
    });
    const flip = Flip.from(state, {
      targets: cards,
      props: "opacity",
      duration: 0.6,
      ease: "power3.inOut",
      stagger: 0.02,
      onEnter: (cards) =>
        gsap.fromTo(
          cards,
          { autoAlpha: 0, scale: 0.94 },
          { autoAlpha: 1, scale: 1, duration: 0.5, delay: 0.15 },
        ),
      onComplete: () => ScrollTrigger.refresh(),
    });
    return () => flip.kill();
  }, [results]);

  useReveal(root, [isLoading]);

  const update = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    apply(next);
  };

  const active = [
    query && { key: "q", label: `“${query}”` },
    league && { key: "league", label: league },
    inStockOnly && { key: "stock", label: "In stock" },
    savedOnly && { key: "saved", label: "Saved" },
  ].filter(Boolean);

  const title = savedOnly ? "Saved jerseys" : league || (query ? "Search results" : "All jerseys");
  const emptyMessage = savedOnly
    ? "You haven't saved any jerseys yet. Tap the heart on a jersey to keep it here."
    : "No jerseys match these filters. Try another league or clear the search.";

  const filterProps = { leagues, league, total: jerseys.length, inStockOnly, savedOnly, update };

  return (
    <main ref={root} className="container-page py-8 sm:py-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {league || savedOnly ? (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/shop">Shop</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{title}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          ) : (
            <BreadcrumbItem>
              <BreadcrumbPage>Shop</BreadcrumbPage>
            </BreadcrumbItem>
          )}
        </BreadcrumbList>
      </Breadcrumb>

      <header className="mt-4 mb-8 flex flex-wrap items-end justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-semibold sm:text-4xl">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground" aria-live="polite">
            {isLoading
              ? "Loading jerseys…"
              : `${results.length} ${results.length === 1 ? "jersey" : "jerseys"}`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden">
                <SlidersHorizontal aria-hidden="true" />
                Filters
                {active.length > 0 && (
                  <span className="grid size-5 place-items-center rounded-full bg-primary text-[10px] text-primary-foreground">
                    {active.length}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-xs">
              <SheetHeader className="border-b">
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription className="sr-only">Narrow down the jerseys</SheetDescription>
              </SheetHeader>
              <div className="overflow-y-auto px-4">
                <Filters {...filterProps} />
              </div>
              <SheetFooter className="border-t">
                <SheetClose asChild>
                  <Button>Show {results.length} jerseys</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          <Select
            value={sort}
            onValueChange={(value) => update("sort", value === "newest" ? "" : value)}
          >
            <SelectTrigger className="w-[190px]" aria-label="Sort by">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              {Object.entries(SORTS).map(([value, { label }]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>

      <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
        <aside aria-label="Filters" className="hidden lg:block">
          <div className="sticky top-24">
            <Filters {...filterProps} />
          </div>
        </aside>

        <div>
          {active.length > 0 && (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              {active.map((filter) => (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => update(filter.key, "")}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border bg-background py-1 pr-2 pl-3 text-sm transition hover:bg-accent"
                  aria-label={`Remove filter ${filter.label}`}
                >
                  {filter.label}
                  <X className="size-3.5 text-muted-foreground" aria-hidden="true" />
                </button>
              ))}
              <Button
                variant="link"
                size="sm"
                className="text-muted-foreground"
                onClick={() => apply(sort === "newest" ? {} : { sort })}
              >
                Clear all
              </Button>
            </div>
          )}

          <ProductGrid
            gridRef={grid}
            products={results}
            isLoading={isLoading}
            error={error}
            label="Jerseys"
            className="lg:grid-cols-3"
            skeletonCount={6}
            emptyTitle={
              savedOnly ? "No saved jerseys" : active.length ? "No matches" : "No jerseys yet"
            }
            emptyMessage={
              active.length || savedOnly ? emptyMessage : "No jerseys are available right now."
            }
            emptyAction={
              active.length > 0 && (
                <Button variant="outline" onClick={() => apply(sort === "newest" ? {} : { sort })}>
                  Clear filters
                </Button>
              )
            }
          />
        </div>
      </div>
    </main>
  );
};

export default Shop;
