import imageColors from "./image-colors.json";
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
// `monoOnDark`: the mark still reads as a white silhouette in dark mode. Logos
// that are a filled shape (Bundesliga, Serie A) keep their colours instead.
export const LEAGUE_LOGOS = {
  "Premier League": { file: "premier-league-logo.png", monoOnDark: true },
  "La Liga": { file: "la-liga-logo.png", monoOnDark: true },
  "Serie A": { file: "serie-a-2022-logo.png", monoOnDark: false },
  Bundesliga: { file: "bundesliga-logo.png", monoOnDark: false },
  "Ligue 1": { file: "ligue-1-logo.png", monoOnDark: true },
};

// Placeholder colours and small WebP sizes come from `npm run images`.
const OPT_WIDTHS = [480, 960];
const baseName = (file) => file.replace(/\.[^.]+$/, "");

/**
 * Everything an <img> needs to load a catalog photo well: a responsive WebP
 * srcset (when one was generated), the original as fallback, and a colour to
 * paint while it loads.
 */
export const imageSources = (file) => {
  const color = imageColors[file];
  return {
    src: imageUrl(file),
    // Only catalog photos have optimised copies; admin uploads use the original.
    srcSet: color
      ? OPT_WIDTHS.map((w) => `${imageUrl(`opt/${baseName(file)}-${w}.webp`)} ${w}w`).join(", ")
      : undefined,
    color,
  };
};

/** URL of a generated WebP copy, or the original when none exists (admin uploads). */
export const optimizedUrl = (file, width) =>
  imageColors[file] ? imageUrl(`opt/${baseName(file)}-${width}.webp`) : imageUrl(file);
