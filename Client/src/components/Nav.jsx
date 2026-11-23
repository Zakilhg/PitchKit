import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { FiHeart, FiMenu, FiSearch, FiShoppingBag, FiUser, FiX } from "react-icons/fi";
import nav from "../css/nav.module.css";
import { useCartCount, useFavorites } from "../lib/cart";
import ThemeToggle from "./ThemeToggle";

const LINKS = [
  { to: "/shop", label: "Shop all" },
  { to: "/shop?league=Premier League", label: "Premier League" },
  { to: "/shop?league=La Liga", label: "La Liga" },
  { to: "/shop?league=Serie A", label: "Serie A" },
];

const Nav = () => {
  const [query, setQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const bagCount = useCartCount();
  const savedCount = useFavorites().length;

  // The mobile menu belongs to the page it was opened on, so navigating closes it.
  const [openOn, setOpenOn] = useState(null);
  const menuOpen = openOn === location.key;
  const setMenuOpen = (open) => {
    const next = typeof open === "function" ? open(menuOpen) : open;
    setOpenOn(next ? location.key : null);
  };

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (event) => event.key === "Escape" && setOpenOn(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const handleSearch = (event) => {
    event.preventDefault();
    const term = query.trim();
    navigate(term ? `/shop?q=${encodeURIComponent(term)}` : "/shop");
  };

  // Compare parsed params so "Premier+League" and "Premier%20League" both match.
  const isActive = (to) => {
    const target = new URL(to, window.location.origin);
    const current = new URLSearchParams(location.search);
    return (
      location.pathname === target.pathname &&
      (current.get("league") || "") === (target.searchParams.get("league") || "") &&
      !current.get("q") &&
      !current.get("saved")
    );
  };

  return (
    <header className={nav.header}>
      <div className={`container ${nav.bar}`}>
        <button
          type="button"
          className={`${nav.iconButton} ${nav.menuToggle}`}
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
        </button>

        <Link to="/" className={nav.logo} aria-label="PitchKit home">
          <span className={nav.logoMark} aria-hidden="true" />
          PitchKit
        </Link>

        <nav
          id="site-menu"
          className={`${nav.menu} ${menuOpen ? nav.menuOpen : ""}`}
          aria-label="Main"
        >
          <ul className={nav.links}>
            {LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={() => `${nav.link} ${isActive(link.to) ? nav.linkActive : ""}`}
                  aria-current={isActive(link.to) ? "page" : undefined}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
          {/* On phones the toggle lives in the menu so the top bar stays uncrowded. */}
          <ThemeToggle className={`${nav.link} ${nav.themeRow}`} withLabel />
        </nav>

        <div className={nav.actions}>
          <form className={nav.search} role="search" onSubmit={handleSearch}>
            <label htmlFor="site-search" className="visually-hidden">
              Search jerseys
            </label>
            <FiSearch className={nav.searchIcon} aria-hidden="true" />
            <input
              id="site-search"
              type="search"
              placeholder="Search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </form>

          <ThemeToggle className={`${nav.iconButton} ${nav.themeIcon}`} />
          <Link
            to="/shop?saved=1"
            className={`${nav.iconButton} ${nav.saved}`}
            aria-label={`Saved jerseys, ${savedCount}`}
          >
            <FiHeart aria-hidden="true" />
            {savedCount > 0 && (
              <span className={`${nav.badge} ${nav.badgeQuiet}`} aria-hidden="true">
                {savedCount}
              </span>
            )}
          </Link>
          <Link to="/login" className={`${nav.iconButton} ${nav.account}`} aria-label="Account">
            <FiUser aria-hidden="true" />
          </Link>
          <Link
            to="/bag"
            className={`${nav.iconButton} ${nav.bag}`}
            aria-label={`Bag, ${bagCount} ${bagCount === 1 ? "item" : "items"}`}
          >
            <FiShoppingBag aria-hidden="true" />
            {bagCount > 0 && (
              <span className={nav.badge} aria-hidden="true">
                {bagCount > 99 ? "99+" : bagCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Nav;
