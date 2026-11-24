import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import CartSheet from "@/components/CartSheet";
import SearchDialog from "@/components/SearchDialog";
import ThemeMenu, { ThemeSegmented } from "@/components/ThemeMenu";
import { displayName } from "@/lib/auth";
import { useFavorites } from "@/lib/cart";
import { useSession } from "@/lib/session";
import { cn } from "@/lib/utils";

const LINKS = [
  { to: "/shop", label: "Shop all" },
  { to: "/shop?league=Premier League", label: "Premier League" },
  { to: "/shop?league=La Liga", label: "La Liga" },
  { to: "/shop?league=Serie A", label: "Serie A" },
  { to: "/shop?league=Bundesliga", label: "Bundesliga" },
];

export const Logo = ({ className, onClick }) => (
  <Link
    to="/"
    onClick={onClick}
    className={cn("flex items-center gap-2 text-[15px] font-semibold tracking-tight", className)}
    aria-label="PitchKit home"
  >
    <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
      <rect width="24" height="24" rx="6" className="fill-foreground" />
      <path d="M7 6.5h6.2a4.3 4.3 0 0 1 0 8.6H10V18H7z" className="fill-background" />
      <circle cx="13" cy="10.8" r="1.6" className="fill-brand" />
    </svg>
    PitchKit
  </Link>
);

// Compare parsed params so "Premier+League" and "Premier%20League" both match.
const useIsActive = () => {
  const location = useLocation();
  return (to) => {
    const target = new URL(to, window.location.origin);
    const current = new URLSearchParams(location.search);
    return (
      location.pathname === target.pathname &&
      (current.get("league") || "") === (target.searchParams.get("league") || "") &&
      !current.get("q") &&
      !current.get("saved")
    );
  };
};

const MobileMenu = () => {
  const [open, setOpen] = useState(false);
  const session = useSession();
  const isActive = useIsActive();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon-lg" className="-ml-2 md:hidden" aria-label="Open menu">
          <Menu aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full max-w-xs gap-0">
        <SheetHeader className="border-b">
          <SheetTitle asChild>
            <div>
              <Logo onClick={() => setOpen(false)} />
            </div>
          </SheetTitle>
          <SheetDescription className="sr-only">Site navigation</SheetDescription>
        </SheetHeader>
        <nav aria-label="Mobile" className="flex flex-col p-2">
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              aria-current={isActive(link.to) ? "page" : undefined}
              className="rounded-md px-3 py-3 text-base font-medium transition hover:bg-accent aria-[current=page]:bg-accent"
            >
              {link.label}
            </Link>
          ))}
          <Separator className="my-2" />
          <Link
            to="/shop?saved=1"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-md px-3 py-3 text-base transition hover:bg-accent"
          >
            <Heart className="size-4" aria-hidden="true" /> Saved
          </Link>
          <Link
            to={session ? "/account" : "/login"}
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-md px-3 py-3 text-base transition hover:bg-accent"
          >
            <User className="size-4" aria-hidden="true" /> {session ? "Your account" : "Log in"}
          </Link>
        </nav>
        <div className="mt-auto border-t p-4">
          <p className="mb-2 text-xs font-medium text-muted-foreground">Theme</p>
          <ThemeSegmented />
        </div>
      </SheetContent>
    </Sheet>
  );
};

const Nav = () => {
  const session = useSession();
  const savedCount = useFavorites().length;
  const isActive = useIsActive();

  return (
    <>
      <div className="bg-neutral-950 text-neutral-100 dark:border-b dark:bg-neutral-900">
        <p className="container-page py-2 text-center text-xs font-medium">
          Free shipping on orders over $100 · 30-day returns
        </p>
      </div>
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
        <div className="container-page flex h-16 items-center gap-2">
          <MobileMenu />
          <Logo className="mr-6" />

          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    aria-current={isActive(link.to) ? "page" : undefined}
                    className="rounded-md px-3 py-2 text-sm text-muted-foreground transition hover:text-foreground aria-[current=page]:font-medium aria-[current=page]:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <SearchDialog className="mr-1 max-lg:size-10 max-lg:justify-center max-lg:border-0 max-lg:bg-transparent max-lg:px-0" />
            <div className="hidden md:block">
              <ThemeMenu />
            </div>
            <Button
              asChild
              variant="ghost"
              size="icon-lg"
              className="relative hidden sm:inline-flex"
            >
              <Link to="/shop?saved=1" aria-label={`Saved jerseys, ${savedCount}`}>
                <Heart aria-hidden="true" />
                {savedCount > 0 && (
                  <span
                    aria-hidden="true"
                    className="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-500 ring-2 ring-background"
                  />
                )}
              </Link>
            </Button>
            <Button asChild variant="ghost" size="icon-lg" className="hidden sm:inline-flex">
              <Link
                to={session ? "/account" : "/login"}
                aria-label={
                  session ? `Account, signed in as ${displayName(session.user)}` : "Log in"
                }
              >
                {session ? (
                  <span className="grid size-7 place-items-center rounded-full bg-foreground text-xs font-semibold text-background">
                    {(session.user.first_name || session.user.email || "?").charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <User aria-hidden="true" />
                )}
              </Link>
            </Button>
            <CartSheet />
          </div>
        </div>
      </header>
    </>
  );
};

export default Nav;
