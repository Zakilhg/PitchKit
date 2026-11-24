import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RotateCcw, Truck } from "lucide-react";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Magnifier from "@/components/Magnifier";
import ProductGrid, { EmptyState, FavoriteButton } from "@/components/Product";
import SmartImage from "@/components/SmartImage";
import useFetch from "@/hooks/useFetch";
import useJerseys from "@/hooks/useJerseys";
import { apiUrl } from "@/lib/api";
import { addCartItem } from "@/lib/cart";
import { formatCurrency } from "@/lib/format";
import { imageUrl, jerseyImages, stockState } from "@/lib/jersey";
import { cn } from "@/lib/utils";

const SIZES = ["S", "M", "L", "XL"];

const StockLine = ({ stock }) => (
  <p className="flex items-center gap-2 text-sm">
    <span
      aria-hidden="true"
      className={cn(
        "size-2 rounded-full",
        stock.tone === "in" && "bg-success",
        stock.tone === "low" && "bg-warning",
        stock.tone === "out" && "bg-muted-foreground",
      )}
    />
    {stock.tone === "low" ? `Only ${stock.quantity} left in stock` : stock.label}
  </p>
);

const Gallery = ({ images, name }) => {
  const [active, setActive] = useState(0);

  return (
    <section aria-label="Product images">
      {/* Phones: one large image with thumbnails. Desktop: every view in a grid. */}
      <div className="lg:hidden">
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-surface">
          <SmartImage
            key={images[active] || images[0]}
            file={images[active] || images[0]}
            alt={`${name}, view ${active + 1} of ${images.length}`}
            sizes="100vw"
            priority
          />
        </div>
        {images.length > 1 && (
          <div className="mt-3 flex gap-2">
            {images.map((image, index) => (
              <button
                type="button"
                key={image}
                onClick={() => setActive(index)}
                aria-label={`Show view ${index + 1}`}
                aria-pressed={index === active}
                className={cn(
                  "relative size-16 cursor-pointer overflow-hidden rounded-md bg-surface ring-offset-2 ring-offset-background transition",
                  index === active ? "ring-2 ring-foreground" : "opacity-70 hover:opacity-100",
                )}
              >
                <SmartImage file={image} sizes="64px" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="hidden gap-3 lg:grid lg:grid-cols-2">
        {images.map((image, index) => (
          <div
            key={image}
            className={cn(
              "relative overflow-hidden rounded-xl bg-surface",
              index === 0 ? "col-span-2 aspect-[4/5]" : "aspect-[4/5]",
            )}
          >
            <Magnifier file={image}>
              <SmartImage
                file={image}
                alt={`${name}, view ${index + 1} of ${images.length}`}
                sizes={index === 0 ? "(min-width: 1024px) 55vw, 100vw" : "28vw"}
                priority={index === 0}
              />
            </Magnifier>
          </div>
        ))}
      </div>
    </section>
  );
};

const DetailSkeleton = () => (
  <main className="container-page py-8" aria-busy="true">
    <Skeleton className="h-4 w-48" />
    <div className="mt-6 grid gap-10 lg:grid-cols-[1.25fr_1fr]">
      <Skeleton className="aspect-[4/5] rounded-xl" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-9 w-3/4" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="mt-8 h-24 w-full" />
        <Skeleton className="h-11 w-full" />
      </div>
    </div>
    <p className="sr-only">Loading jersey details…</p>
  </main>
);

// Keyed by id so size, errors and gallery reset when moving to another jersey.
const ProductDetail = () => {
  const { id } = useParams();
  return <ProductPage key={id} id={id} />;
};

const ProductPage = ({ id }) => {
  const navigate = useNavigate();
  const [size, setSize] = useState("");
  const [sizeError, setSizeError] = useState(false);
  const { data, isLoading, error } = useFetch(
    id ? apiUrl(`jerseys/${encodeURIComponent(id)}`) : null,
  );
  const { jerseys } = useJerseys();
  const jersey = data?.data;

  if (isLoading) return <DetailSkeleton />;

  if (error || !jersey) {
    return (
      <main className="container-page py-20">
        <EmptyState
          title="We couldn't find this jersey"
          action={
            <Button asChild>
              <Link to="/shop">Back to the shop</Link>
            </Button>
          }
        >
          It may have been removed from the store.
        </EmptyState>
      </main>
    );
  }

  const images = jerseyImages(jersey);
  const stock = stockState(jersey);
  const isOutOfStock = stock.tone === "out";
  const related = jerseys
    .filter((item) => item.id !== jersey.id && item.league_name === jersey.league_name)
    .concat(
      jerseys.filter((item) => item.id !== jersey.id && item.league_name !== jersey.league_name),
    )
    .slice(0, 4);

  const handleAdd = () => {
    if (isOutOfStock) return;
    if (!size) {
      setSizeError(true);
      document.querySelector("#size-picker button")?.focus();
      return;
    }
    addCartItem({ productId: jersey.id, size });
    toast.success("Added to your bag", {
      description: `${jersey.name} · Size ${size}`,
      action: { label: "View bag", onClick: () => navigate("/bag") },
    });
  };

  return (
    <main>
      <div className="container-page py-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/shop">Shop</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {jersey.league_name && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={`/shop?league=${encodeURIComponent(jersey.league_name)}`}>
                      {jersey.league_name}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="max-w-[16rem] truncate">{jersey.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
          <Gallery images={images} name={jersey.name} />

          <section aria-labelledby="product-title" className="lg:sticky lg:top-24 lg:self-start">
            <div className="flex items-center justify-between gap-4">
              <p className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
                {jersey.club_name || "Football jersey"}
              </p>
              {jersey.brand_image && (
                <img
                  src={imageUrl(jersey.brand_image)}
                  alt={jersey.brand_name || ""}
                  className="h-7 w-auto object-contain brightness-0 dark:invert"
                />
              )}
            </div>
            <h1 id="product-title" className="mt-3 text-3xl font-semibold sm:text-4xl">
              {jersey.name}
            </h1>
            <p className="mt-3 text-xl tabular-nums">{formatCurrency(jersey.price)}</p>
            <div className="mt-4">
              <StockLine stock={stock} />
            </div>

            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between">
                <p id="size-label" className="text-sm font-medium">
                  Size
                </p>
                <p className="text-sm text-muted-foreground">Regular fit</p>
              </div>
              <ToggleGroup
                id="size-picker"
                type="single"
                variant="outline"
                value={size}
                onValueChange={(value) => {
                  setSize(value);
                  if (value) setSizeError(false);
                }}
                disabled={isOutOfStock}
                aria-labelledby="size-label"
                aria-describedby={sizeError ? "size-error" : undefined}
                className="grid w-full grid-cols-4 gap-2 shadow-none"
              >
                {SIZES.map((option) => (
                  <ToggleGroupItem
                    key={option}
                    value={option}
                    aria-label={`Size ${option}`}
                    className="h-12 cursor-pointer rounded-md! border text-sm data-[state=on]:border-foreground data-[state=on]:bg-foreground data-[state=on]:text-background"
                  >
                    {option}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              {sizeError && (
                <p id="size-error" role="alert" className="mt-2 text-sm text-destructive">
                  Choose a size first.
                </p>
              )}
            </div>

            <div className="mt-6 flex gap-2">
              <Button size="lg" className="h-12 flex-1" onClick={handleAdd} disabled={isOutOfStock}>
                {isOutOfStock ? "Sold out" : "Add to bag"}
              </Button>
              <FavoriteButton
                jersey={jersey}
                className="size-12 rounded-md border bg-background shadow-none backdrop-blur-none hover:bg-accent"
              />
            </div>

            <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Truck className="size-4" aria-hidden="true" /> Free shipping on orders over $100
              </li>
              <li className="flex items-center gap-2">
                <RotateCcw className="size-4" aria-hidden="true" /> Free returns within 30 days
              </li>
            </ul>

            <Accordion type="multiple" defaultValue={["details"]} className="mt-8 border-t">
              <AccordionItem value="details">
                <AccordionTrigger>Details</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {jersey.description && <p className="mb-4">{jersey.description}</p>}
                  <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
                    {[
                      ["Club", jersey.club_name],
                      ["League", jersey.league_name],
                      ["Brand", jersey.brand_name],
                    ]
                      .filter(([, value]) => value)
                      .map(([label, value]) => (
                        <div key={label} className="contents">
                          <dt>{label}</dt>
                          <dd className="text-foreground">{value}</dd>
                        </div>
                      ))}
                  </dl>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="shipping">
                <AccordionTrigger>Shipping &amp; returns</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Orders over $100 ship free; anything under costs $7.50. Send it back unworn within
                  30 days for a full refund.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="sizing">
                <AccordionTrigger>Size guide</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Jerseys run true to size. Between sizes? Go one up for a relaxed fit.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="container-page border-t py-16">
          <h2 id="related-title" className="mb-8 text-2xl font-semibold">
            You might also like
          </h2>
          <ProductGrid products={related} label="Related jerseys" />
        </section>
      )}
    </main>
  );
};

export default ProductDetail;
