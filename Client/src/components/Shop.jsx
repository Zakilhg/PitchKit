import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { FiX } from "react-icons/fi";
import ProductGrid from "./Product";
import useFetch from "../hooks/useFetch";
import { apiUrl } from "../lib/api";
import { useFavorites } from "../lib/cart";
import shop from "../css/shop.module.css";

const SORTS = {
  newest: { label: "Newest", compare: () => 0 },
  "price-asc": { label: "Price: low to high", compare: (a, b) => a.price - b.price },
  "price-desc": { label: "Price: high to low", compare: (a, b) => b.price - a.price },
};

const Shop = () => {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") || "";
  const league = params.get("league") || "";
  const sort = SORTS[params.get("sort")] ? params.get("sort") : "newest";
  const inStockOnly = params.get("stock") === "1";
  const savedOnly = params.get("saved") === "1";
  const favorites = useFavorites();

  const { data, isLoading, error } = useFetch(apiUrl("jerseys"));

  const jerseys = useMemo(() => data?.data || [], [data]);
  const leagues = useMemo(
    () => [...new Set(jerseys.map((jersey) => jersey.league_name).filter(Boolean))].sort(),
    [jerseys],
  );

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    return jerseys
      .filter((jersey) => !league || jersey.league_name === league)
      .filter((jersey) => !inStockOnly || Number(jersey.quantity) > 0)
      .filter((jersey) => !savedOnly || favorites.includes(jersey.id))
      .filter((jersey) =>
        !term
          ? true
          : [jersey.name, jersey.club_name, jersey.brand_name, jersey.league_name]
              .filter(Boolean)
              .some((value) => value.toLowerCase().includes(term)),
      )
      .sort(SORTS[sort].compare);
  }, [jerseys, league, inStockOnly, savedOnly, favorites, query, sort]);

  const update = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const title = savedOnly
    ? "Saved jerseys"
    : league || (query ? `Results for “${query}”` : "All jerseys");
  const hasFilters = Boolean(query || league || inStockOnly);
  const emptyMessage = savedOnly
    ? "You haven't saved any jerseys yet. Tap the heart on a jersey to keep it here."
    : hasFilters
      ? "No jerseys match these filters. Try another league or clear the search."
      : "No jerseys are available right now.";

  return (
    <main className={`container ${shop.page}`}>
      <header className={shop.header}>
        <p className="eyebrow">Shop</p>
        <h1>{title}</h1>
        {!isLoading && !error && (
          <p className={shop.count} aria-live="polite">
            {results.length} {results.length === 1 ? "jersey" : "jerseys"}
          </p>
        )}
      </header>

      <div className={shop.toolbar}>
        <div className={shop.chips} role="group" aria-label="Filter by league">
          <button
            type="button"
            className={`${shop.chip} ${!league ? shop.chipOn : ""}`}
            aria-pressed={!league}
            onClick={() => update("league", "")}
          >
            All leagues
          </button>
          {leagues.map((name) => (
            <button
              type="button"
              key={name}
              className={`${shop.chip} ${league === name ? shop.chipOn : ""}`}
              aria-pressed={league === name}
              onClick={() => update("league", league === name ? "" : name)}
            >
              {name}
            </button>
          ))}
        </div>

        <div className={shop.controls}>
          <label className={shop.check}>
            <input
              type="checkbox"
              checked={savedOnly}
              onChange={(event) => update("saved", event.target.checked ? "1" : "")}
            />
            Saved only
          </label>
          <label className={shop.check}>
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(event) => update("stock", event.target.checked ? "1" : "")}
            />
            In stock only
          </label>
          <label className={shop.sort}>
            <span>Sort by</span>
            <select
              value={sort}
              onChange={(event) =>
                update("sort", event.target.value === "newest" ? "" : event.target.value)
              }
            >
              {Object.entries(SORTS).map(([value, { label }]) => (
                <option value={value} key={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {query && (
        <p className={shop.activeQuery}>
          Searching for <strong>{query}</strong>
          <button
            type="button"
            onClick={() => update("q", "")}
            aria-label="Clear search"
          >
            <FiX aria-hidden="true" />
          </button>
        </p>
      )}

      <ProductGrid
        products={results}
        isLoading={isLoading}
        error={error}
        label="Jerseys"
        emptyMessage={emptyMessage}
      />
    </main>
  );
};

export default Shop;
