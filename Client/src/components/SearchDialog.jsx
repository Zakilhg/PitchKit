import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import useJerseys from "@/hooks/useJerseys";
import { formatCurrency } from "@/lib/format";
import SmartImage from "@/components/SmartImage";
import { subtitle } from "@/lib/jersey";
import { cn } from "@/lib/utils";

const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

/** Search button for the header, plus a ⌘K / Ctrl K command palette. */
const SearchDialog = ({ className }) => {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const navigate = useNavigate();
  const { jerseys } = useJerseys(open);
  // Plain substring matching: cmdk's fuzzy scoring matches "mil" to "Bayern Munich".
  const needle = term.trim().toLowerCase();
  const matches = (...fields) =>
    !needle || fields.some((field) => field?.toLowerCase().includes(needle));
  const results = jerseys.filter((jersey) =>
    matches(jersey.name, jersey.club_name, jersey.league_name, jersey.brand_name),
  );
  const leagues = [...new Set(jerseys.map((jersey) => jersey.league_name).filter(Boolean))].filter(
    (league) => matches(league),
  );

  useEffect(() => {
    const onKey = (event) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const go = (to) => {
    setOpen(false);
    setTerm("");
    navigate(to);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border bg-muted/40 px-3 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground",
          className,
        )}
      >
        <Search className="size-4" aria-hidden="true" />
        <span className="hidden lg:inline">Search jerseys…</span>
        <span className="sr-only lg:hidden">Search jerseys</span>
        <kbd className="pointer-events-none ml-4 hidden h-5 items-center gap-0.5 rounded border bg-background px-1.5 font-mono text-[10px] font-medium lg:inline-flex">
          {isMac ? "⌘" : "Ctrl"} K
        </kbd>
      </button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search jerseys"
        description="Search by club, league or brand"
        commandProps={{ shouldFilter: false }}
      >
        <CommandInput
          placeholder="Search clubs, leagues, brands…"
          value={term}
          onValueChange={setTerm}
        />
        <CommandList>
          {!results.length && !leagues.length && (
            <CommandEmpty>No jerseys match “{term.trim()}”.</CommandEmpty>
          )}
          {needle && (
            <CommandGroup>
              <CommandItem
                value={`search-all ${term}`}
                onSelect={() => go(`/shop?q=${encodeURIComponent(term.trim())}`)}
              >
                <Search aria-hidden="true" />
                See all results for “{term.trim()}”
              </CommandItem>
            </CommandGroup>
          )}
          {results.length > 0 && (
            <CommandGroup heading="Jerseys">
              {results.map((jersey) => (
                <CommandItem
                  key={jersey.id}
                  value={`jersey-${jersey.id}`}
                  onSelect={() => go(`/p/${jersey.id}`)}
                  className="gap-3"
                >
                  <span className="relative size-10 shrink-0 overflow-hidden rounded">
                    <SmartImage file={jersey.image} sizes="40px" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate">{jersey.name}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {subtitle(jersey)}
                    </span>
                  </span>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {formatCurrency(jersey.price)}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {leagues.length > 0 && (
            <CommandGroup heading="Leagues">
              {leagues.map((league) => (
                <CommandItem
                  key={league}
                  value={`league ${league}`}
                  onSelect={() => go(`/shop?league=${encodeURIComponent(league)}`)}
                >
                  <ArrowRight aria-hidden="true" />
                  {league}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default SearchDialog;
