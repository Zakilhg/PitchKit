import { Link } from "react-router-dom";
import { Lock, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BagLine, ShippingProgress, UnavailableNotice } from "@/components/BagLines";
import PitchLoader from "@/components/PitchLoader";
import { EmptyState } from "@/components/Product";
import useBag from "@/hooks/useBag";
import { DEMO_MODE } from "@/lib/api";
import { sizeStock } from "@/lib/jersey";
import { formatCurrency } from "@/lib/format";

const Row = ({ label, children, strong }) => (
  <div className="flex items-center justify-between">
    <dt className={strong ? "font-medium" : "text-muted-foreground"}>{label}</dt>
    <dd className={strong ? "text-base font-semibold tabular-nums" : "tabular-nums"}>{children}</dd>
  </div>
);

const Bag = () => {
  const { cart, lines, unavailable, subtotal, shipping, total, count, isLoading, error } = useBag();
  const blocked =
    unavailable.length > 0 ||
    lines.some((line) => line.quantity > sizeStock(line.jersey, line.size));

  if (!cart.length) {
    return (
      <main className="container-page py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Your bag is empty"
          action={
            <Button asChild>
              <Link to="/shop">Shop jerseys</Link>
            </Button>
          }
        >
          Find your club&apos;s jersey and it will show up here.
        </EmptyState>
      </main>
    );
  }

  return (
    <main className="container-page py-10">
      <h1 className="text-3xl font-semibold sm:text-4xl">
        Your bag{" "}
        <span className="text-xl font-normal text-muted-foreground">
          ({count} {count === 1 ? "item" : "items"})
        </span>
      </h1>

      {error && (
        <p role="alert" className="mt-6 text-sm text-destructive">
          We couldn&apos;t load your bag. Refresh the page to try again.
        </p>
      )}

      {!error && !isLoading && !lines.length && (
        <div className="mt-8 max-w-2xl space-y-6">
          <UnavailableNotice items={unavailable} />
          <Button asChild>
            <Link to="/shop">Shop jerseys</Link>
          </Button>
        </div>
      )}

      {!error && (isLoading || lines.length > 0) && (
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-16">
          <div className="space-y-6">
            <UnavailableNotice items={unavailable} />
            {isLoading ? (
              <PitchLoader label="Loading your bag" className="py-16" />
            ) : (
              <ul className="divide-y border-y py-6">
                {lines.map((line) => (
                  <BagLine key={`${line.productId}-${line.size}`} line={line} />
                ))}
              </ul>
            )}
          </div>

          <aside aria-labelledby="summary-title" className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border bg-card p-6">
              <h2 id="summary-title" className="text-lg font-semibold">
                Order summary
              </h2>
              <div className="mt-5">
                <ShippingProgress subtotal={subtotal} />
              </div>
              <dl className="mt-6 space-y-3 text-sm">
                <Row label="Subtotal">{formatCurrency(subtotal)}</Row>
                <Row label="Shipping">{shipping ? formatCurrency(shipping) : "Free"}</Row>
                <Separator />
                <Row label="Total" strong>
                  {formatCurrency(total)}
                </Row>
              </dl>
              {DEMO_MODE ? (
                <>
                  <Button size="lg" className="mt-6 h-12 w-full" disabled>
                    <Lock aria-hidden="true" /> Checkout
                  </Button>
                  <p className="mt-3 text-center text-xs text-muted-foreground">
                    This demo has no backend, so checkout is turned off. Run the project locally to
                    try the full flow.
                  </p>
                </>
              ) : (
                <>
                  <Button
                    asChild={!blocked}
                    size="lg"
                    className="mt-6 h-12 w-full"
                    disabled={blocked}
                  >
                    {blocked ? (
                      <span>
                        <Lock aria-hidden="true" /> Checkout
                      </span>
                    ) : (
                      <Link to="/checkout">
                        <Lock aria-hidden="true" /> Checkout
                      </Link>
                    )}
                  </Button>
                  <p className="mt-3 text-center text-xs text-muted-foreground">
                    {blocked
                      ? "Fix the items marked in red to check out."
                      : "Secure checkout · test payments only"}
                  </p>
                </>
              )}
            </div>
            <Button asChild variant="link" className="mt-3 w-full text-muted-foreground">
              <Link to="/shop">Continue shopping</Link>
            </Button>
          </aside>
        </div>
      )}
    </main>
  );
};

export default Bag;
