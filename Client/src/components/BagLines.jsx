import { Link } from "react-router-dom";
import { Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FREE_SHIPPING_FROM } from "@/hooks/useBag";
import { removeCartItem, setCartItemQuantity } from "@/lib/cart";
import { formatCurrency } from "@/lib/format";
import SmartImage from "@/components/SmartImage";
import { cn } from "@/lib/utils";

export const QuantityStepper = ({ jersey, size, quantity, productId }) => (
  <div className="inline-flex h-10 items-center rounded-md border">
    <button
      type="button"
      className="grid h-full w-10 cursor-pointer place-items-center rounded-l-md text-muted-foreground transition hover:bg-accent hover:text-foreground"
      aria-label={`Decrease quantity of ${jersey.name}`}
      onClick={() => setCartItemQuantity({ productId, size }, quantity - 1)}
    >
      <Minus className="size-3.5" aria-hidden="true" />
    </button>
    <span className="w-9 text-center text-sm tabular-nums" aria-live="polite">
      {quantity}
    </span>
    <button
      type="button"
      className="grid h-full w-10 cursor-pointer place-items-center rounded-r-md text-muted-foreground transition hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
      aria-label={`Increase quantity of ${jersey.name}`}
      disabled={quantity >= Number(jersey.quantity)}
      onClick={() => setCartItemQuantity({ productId, size }, quantity + 1)}
    >
      <Plus className="size-3.5" aria-hidden="true" />
    </button>
  </div>
);

export const BagLine = ({ line, compact = false, onNavigate }) => {
  const { jersey, size, quantity, productId } = line;

  return (
    <li data-bag-line className="flex gap-4 py-5 first:pt-0 last:pb-0">
      <Link
        to={`/p/${jersey.id}`}
        onClick={onNavigate}
        className={cn(
          "relative shrink-0 overflow-hidden rounded-md bg-surface",
          compact ? "h-24 w-20" : "h-32 w-24 sm:h-40 sm:w-32",
        )}
        tabIndex={-1}
        aria-hidden="true"
      >
        <SmartImage file={jersey.image} sizes="128px" />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Link
              to={`/p/${jersey.id}`}
              onClick={onNavigate}
              className="text-sm font-medium hover:underline hover:underline-offset-4"
            >
              {jersey.name}
            </Link>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Size {size}
              {!compact && jersey.club_name ? ` · ${jersey.club_name}` : ""}
            </p>
          </div>
          <p className="text-sm font-medium tabular-nums">
            {formatCurrency(Number(jersey.price) * quantity)}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3">
          <QuantityStepper {...line} />
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={() => removeCartItem({ productId, size })}
            aria-label={`Remove ${jersey.name}, size ${size}`}
          >
            <X aria-hidden="true" />
            Remove
          </Button>
        </div>
      </div>
    </li>
  );
};

export const ShippingProgress = ({ subtotal }) => {
  const remaining = FREE_SHIPPING_FROM - subtotal;
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_FROM) * 100);

  return (
    <div>
      <p className="text-sm">
        {remaining > 0 ? (
          <>
            Add <span className="font-medium">{formatCurrency(remaining)}</span> for free shipping
          </>
        ) : (
          <>You&apos;ve unlocked free shipping</>
        )}
      </p>
      <div
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-label="Progress to free shipping"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
      >
        <div
          className="h-full rounded-full bg-brand transition-[width] duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export const UnavailableNotice = ({ items }) =>
  items.length > 0 && (
    <div
      role="status"
      className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-warning/40 bg-warning/10 px-4 py-3 text-sm"
    >
      <span>
        {items.length === 1
          ? "1 item in your bag is no longer sold."
          : `${items.length} items in your bag are no longer sold.`}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => items.forEach((item) => removeCartItem(item))}
      >
        Remove {items.length === 1 ? "it" : "them"}
      </Button>
    </div>
  );
