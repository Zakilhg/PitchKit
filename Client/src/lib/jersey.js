import { assetUrl } from "./api";

export const LOW_STOCK = 10;

export const jerseyImages = (jersey) =>
  (jersey.images?.length ? jersey.images : [jersey.image, jersey.image1, jersey.image2]).filter(
    Boolean,
  );

export const imageUrl = (file) => assetUrl(`images/${file}`);

export const stockState = (jersey) => {
  const quantity = Number(jersey.quantity);
  if (quantity <= 0) return { tone: "out", label: "Sold out", quantity };
  if (quantity <= LOW_STOCK) return { tone: "low", label: `Only ${quantity} left`, quantity };
  return { tone: "in", label: "In stock", quantity };
};

export const subtitle = (jersey) =>
  [jersey.club_name, jersey.league_name].filter(Boolean).join(" · ");

// League logos ship with the catalog images (and the Pages demo build).
export const LEAGUE_LOGOS = {
  "Premier League": "premier-league-logo.png",
  "La Liga": "la-liga-logo.png",
  "Serie A": "serie-a-2022-logo.png",
  Bundesliga: "bundesliga-logo.png",
  "Ligue 1": "ligue-1-logo.png",
};
