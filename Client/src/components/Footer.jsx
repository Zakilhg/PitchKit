import { Link } from "react-router-dom";
import { Logo } from "@/components/Nav";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { to: "/shop", label: "All jerseys" },
      { to: "/#new", label: "New this season" },
      { to: "/shop?saved=1", label: "Saved" },
      { to: "/bag", label: "Your bag" },
    ],
  },
  {
    title: "Leagues",
    links: ["Premier League", "La Liga", "Serie A", "Bundesliga", "Ligue 1"].map((name) => ({
      to: `/shop?league=${encodeURIComponent(name)}`,
      label: name,
    })),
  },
  {
    title: "Account",
    links: [
      { to: "/login", label: "Log in" },
      { to: "/register", label: "Create account" },
      { to: "/admin", label: "Admin dashboard" },
    ],
  },
];

const Footer = () => (
  <footer className="mt-auto border-t bg-muted/30">
    <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
      <div>
        <Logo />
        <p className="mt-4 max-w-xs text-sm text-muted-foreground">
          Club jerseys from Europe&apos;s top leagues, for fans who wear their colours every
          matchday.
        </p>
      </div>
      {COLUMNS.map((column) => (
        <nav key={column.title} aria-label={column.title}>
          <h2 className="text-sm font-medium">{column.title}</h2>
          <ul className="mt-4 space-y-2.5">
            {column.links.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-sm text-muted-foreground transition hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ))}
    </div>
    <div className="border-t">
      <div className="container-page flex flex-col gap-2 py-6 text-xs text-muted-foreground sm:flex-row sm:justify-between">
        <p>© PitchKit · Zakaria Lahgaz &amp; AitTamaldou</p>
        <p>
          A portfolio project. No real orders are taken.{" "}
          <a
            href="https://github.com/Zakilhg/PitchKit"
            className="underline underline-offset-4 hover:text-foreground"
          >
            Source code
          </a>
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
