import { useRef } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toggleFavorite, useFavorites } from "@/lib/cart";
import { formatCurrency } from "@/lib/format";
import SmartImage from "@/components/SmartImage";
import { imageSources, jerseyImages, stockState, subtitle } from "@/lib/jersey";

const CARD_SIZES = "(min-width: 1024px) 25vw, 50vw";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/motion";
import { cn } from "@/lib/utils";

export const FavoriteButton = ({ jersey, className }) => {
  const isFavorite = useFavorites().includes(jersey.id);
  const button = useRef(null);
  const { contextSafe } = useGSAP({ scope: button });

  // A small "pop" with a ring burst when saving.
  const onClick = contextSafe(() => {
    toggleFavorite(jersey.id);
    if (prefersReducedMotion()) return;
    gsap.fromTo(
      "[data-heart]",
      { scale: 0.5 },
      { scale: 1, duration: 0.5, ease: "back.out(4)", overwrite: true },
    );
    if (!isFavorite) {
      gsap.fromTo(
        "[data-burst]",
        { scale: 0.4, autoAlpha: 0.9 },
        { scale: 1.8, autoAlpha: 0, duration: 0.55, ease: "power2.out" },
      );
    }
  });

  return (
    <button
      ref={button}
      type="button"
      onClick={onClick}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? `Remove ${jersey.name} from saved` : `Save ${jersey.name}`}
      className={cn(
        "grid size-10 cursor-pointer place-items-center rounded-full bg-background/85 text-foreground shadow-sm backdrop-blur transition hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
    >
      <span
        data-burst
        aria-hidden="true"
        className="pointer-events-none invisible col-start-1 row-start-1 size-full rounded-full border-2 border-red-500"
      />
      <Heart
        data-heart
        aria-hidden="true"
        className={cn(
          "col-start-1 row-start-1 size-4 transition-colors",
          isFavorite && "fill-red-500 text-red-500",
        )}
      />
    </button>
  );
};

export const ProductCard = ({ item, priority = false }) => {
  const [front, back] = jerseyImages(item);
  const stock = stockState(item);
  const backImage = back ? imageSources(back) : null;

  return (
    <li className="group relative flex flex-col" data-reveal data-flip-id={item.id}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-surface">
        {back && (
          <img
            src={backImage.src}
            srcSet={backImage.srcSet}
            sizes={backImage.srcSet ? CARD_SIZES : undefined}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full object-cover transition duration-500 ease-out group-hover:scale-[1.03]"
          />
        )}
        <SmartImage
          file={front}
          sizes={CARD_SIZES}
          priority={priority}
          className="group-hover:scale-[1.03]"
          wrapperClassName={cn(
            "transition-opacity duration-500",
            back && "group-hover:opacity-0",
            stock.tone === "out" && "opacity-60 grayscale",
          )}
        />

        {stock.tone !== "in" && (
          <span
            className={cn(
              "absolute top-3 left-3 rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur",
              stock.tone === "out"
                ? "bg-foreground/85 text-background"
                : "bg-background/85 text-foreground",
            )}
          >
            {stock.label}
          </span>
        )}

        <FavoriteButton jersey={item} className="absolute top-3 right-3 z-10" />
      </div>

      <div className="flex flex-col gap-1 pt-3 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-medium">
            {/* The whole card is clickable through this link's ::after. */}
            <Link
              to={`/p/${item.id}`}
              className="after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-ring"
            >
              {item.name}
            </Link>
          </h3>
          {subtitle(item) && (
            <p className="mt-0.5 truncate text-sm text-muted-foreground">{subtitle(item)}</p>
          )}
        </div>
        <p className="text-sm font-medium tabular-nums">{formatCurrency(item.price)}</p>
      </div>
    </li>
  );
};

const ProductSkeleton = () => (
  <li aria-hidden="true">
    <Skeleton className="aspect-[4/5] rounded-lg" />
    <Skeleton className="mt-3 h-4 w-3/4" />
    <Skeleton className="mt-2 h-4 w-1/2" />
  </li>
);

export const EmptyState = ({ icon: Icon, title, children, action }) => (
  <div className="flex flex-col items-center rounded-xl border border-dashed px-6 py-16 text-center">
    {Icon && (
      <span className="mb-4 grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
        <Icon className="size-5" aria-hidden="true" />
      </span>
    )}
    {title && <p className="font-medium">{title}</p>}
    <p className="mt-1 max-w-sm text-sm text-muted-foreground">{children}</p>
    {action && <div className="mt-6">{action}</div>}
  </div>
);

const GRID = "grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4";

const ProductGrid = ({
  products = [],
  isLoading = false,
  error = null,
  skeletonCount = 8,
  emptyTitle = "Nothing here yet",
  emptyMessage = "No jerseys are available right now.",
  emptyAction,
  label,
  className,
  gridRef,
}) => {
  if (error) {
    return (
      <EmptyState title="Something went wrong">
        <span role="alert">
          We couldn&apos;t load the jerseys. Check your connection and refresh the page.
        </span>
      </EmptyState>
    );
  }

  if (isLoading) {
    return (
      <ul className={cn(GRID, className)} aria-busy="true" aria-label={label}>
        {Array.from({ length: skeletonCount }, (_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </ul>
    );
  }

  if (!products.length) {
    return (
      <EmptyState title={emptyTitle} action={emptyAction}>
        {emptyMessage}
      </EmptyState>
    );
  }

  return (
    <ul ref={gridRef} className={cn(GRID, className)} aria-label={label}>
      {products.map((item, index) => (
        <ProductCard item={item} key={item.id} priority={index < 4} />
      ))}
    </ul>
  );
};

export default ProductGrid;
