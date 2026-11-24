import catalog from "./catalog.json";
import { ApiError } from "../lib/api";

// Mirrors the Laravel JerseyResource so the UI can't tell the difference.
const withIds = (items) => items.map((item, index) => ({ id: index + 1, ...item }));
const brands = withIds(catalog.brands);
const leagues = withIds(catalog.leagues);
const clubs = withIds(catalog.clubs);
const byName = (items, name) => items.find((item) => item.name === name) || null;

// Same split the server's migration uses: M and L get the remainder first.
const splitStock = (total) => {
  const base = Math.floor(total / 4);
  const stock = { S: base, M: base, L: base, XL: base };
  ["M", "L", "S", "XL"].slice(0, total % 4).forEach((size) => (stock[size] += 1));
  return stock;
};

const jerseys = catalog.jerseys.map((jersey, index) => {
  const brand = byName(brands, jersey.brand);
  const club = byName(clubs, jersey.club);
  const league = club ? byName(leagues, club.league) : null;
  const [image, image1 = null, image2 = null] = jersey.images;

  return {
    id: index + 1,
    name: jersey.name,
    description: jersey.description ?? null,
    price: jersey.price,
    quantity: jersey.quantity,
    sizes: splitStock(jersey.quantity),
    images: jersey.images,
    image,
    image1,
    image2,
    brand: brand && { id: brand.id, name: brand.name, image: brand.image },
    club: club && { id: club.id, name: club.name },
    league: league && { id: league.id, name: league.name },
    brand_image: brand?.image ?? null,
    brand_name: brand?.name ?? null,
    club_name: club?.name ?? null,
    league_name: league?.name ?? null,
  };
});

export const demoRequest = async (url) => {
  const { pathname } = new URL(url, window.location.origin);

  if (/\/jerseys\/?$/.test(pathname)) {
    return { data: jerseys };
  }

  const match = pathname.match(/\/jerseys\/([^/]+)$/);
  const jersey = match && jerseys.find((item) => String(item.id) === decodeURIComponent(match[1]));
  if (jersey) {
    return { data: jersey };
  }

  throw new ApiError("Not found.", 404);
};
