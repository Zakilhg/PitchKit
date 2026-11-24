import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BagLine, ShippingProgress, UnavailableNotice } from "@/components/BagLines";
import useBag from "@/hooks/useBag";
import { formatCurrency } from "@/lib/format";

/** Bag icon in the header that opens a slide-over bag. */
const CartSheet = () => {
  const [open, setOpen] = useState(false);
  const { lines, unavailable, subtotal, count, isLoading } = useBag();
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon-lg"
          className="relative"
          aria-label={`Bag, ${count} ${count === 1 ? "item" : "items"}`}
        >
          <ShoppingBag aria-hidden="true" />
          {count > 0 && (
            <span
              aria-hidden="true"
              className="absolute top-1 right-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground tabular-nums"
            >
              {count > 99 ? "99+" : count}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle>
            Your bag{" "}
            {count > 0 && <span className="font-normal text-muted-foreground">({count})</span>}
          </SheetTitle>
          <SheetDescription className="sr-only">Items you have added to your bag</SheetDescription>
        </SheetHeader>

        {count === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <span className="grid size-14 place-items-center rounded-full bg-muted">
              <ShoppingBag className="size-6 text-muted-foreground" aria-hidden="true" />
            </span>
            <div>
              <p className="font-medium">Your bag is empty</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Find your club&apos;s jersey and it will show up here.
              </p>
            </div>
            <Button asChild onClick={close}>
              <Link to="/shop">Shop jerseys</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="mb-5 space-y-4">
                <ShippingProgress subtotal={subtotal} />
                <UnavailableNotice items={unavailable} />
              </div>
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading your bag…</p>
              ) : (
                <ul className="divide-y">
                  {lines.map((line) => (
                    <BagLine
                      key={`${line.productId}-${line.size}`}
                      line={line}
                      compact
                      onNavigate={close}
                    />
                  ))}
                </ul>
              )}
            </div>

            <SheetFooter className="gap-3 border-t px-6 py-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium tabular-nums">{formatCurrency(subtotal)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Shipping is calculated in the bag.</p>
              <Button asChild size="lg" className="w-full" onClick={close}>
                <Link to="/bag">View bag</Link>
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
