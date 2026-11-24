import { useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Clock, Loader2, Package, Truck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/Product";
import { OrderLines, OrderStatusBadge, OrderTotals } from "@/components/OrderBits";
import { apiUrl, requestJson } from "@/lib/api";
import { clearCart } from "@/lib/cart";
import { gsap, useMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

const CLEARED_KEY = "pitchkit.clearedFor";
const PAID = ["paid", "fulfilled"];

/** Empty the bag once per paid order, so revisiting the page never wipes a newer bag. */
const clearBagOnce = (token) => {
  try {
    if (localStorage.getItem(CLEARED_KEY) === token) return;
    localStorage.setItem(CLEARED_KEY, token);
  } catch {
    // Storage blocked: clearing on every visit is the lesser evil.
  }
  clearCart();
};

const SuccessMark = () => {
  const root = useRef(null);
  useMotion(
    () => {
      gsap
        .timeline()
        .from("[data-ring]", { scale: 0.4, autoAlpha: 0, duration: 0.5, ease: "back.out(2)" })
        .from("[data-check]", { drawSVG: 0, duration: 0.5, ease: "power2.out" }, "-=0.15")
        .from(
          "[data-pulse]",
          { scale: 0.6, autoAlpha: 0.6, duration: 1.2, ease: "power2.out" },
          0.2,
        );
    },
    { scope: root },
  );
  return (
    <span ref={root} className="relative grid size-16 place-items-center" aria-hidden="true">
      <span data-pulse className="absolute inset-0 rounded-full bg-success/20 opacity-0" />
      <span
        data-ring
        className="grid size-16 place-items-center rounded-full bg-success text-white"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-8"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path data-check d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </span>
    </span>
  );
};

const STEPS = [
  { key: "placed", label: "Order placed", icon: Package },
  { key: "paid", label: "Payment confirmed", icon: Check },
  { key: "fulfilled", label: "Shipped", icon: Truck },
];

const Progress = ({ status }) => {
  const reached = { pending: 0, paid: 1, fulfilled: 2 }[status] ?? 0;
  return (
    <ol className="grid grid-cols-3 gap-2" aria-label="Order progress">
      {STEPS.map((step, i) => (
        <li key={step.key} className="flex flex-col gap-2">
          <span className={cn("h-1 rounded-full", i <= reached ? "bg-foreground" : "bg-muted")} />
          <span
            className={cn(
              "flex items-center gap-1.5 text-xs",
              i <= reached ? "text-foreground" : "text-muted-foreground",
            )}
          >
            <step.icon className="size-3.5" aria-hidden="true" />
            {step.label}
            {i <= reached && <span className="sr-only">(done)</span>}
          </span>
        </li>
      ))}
    </ol>
  );
};

const OrderStatus = () => {
  const { token } = useParams();
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["order", token],
    queryFn: () => requestJson(apiUrl(`orders/${encodeURIComponent(token)}`)),
    // While a payment is settling (Stripe's webhook can lag), check every 2s.
    refetchInterval: (query) => (query.state.data?.data?.status === "pending" ? 2000 : false),
  });
  const order = data?.data;
  const paid = PAID.includes(order?.status);

  useEffect(() => {
    if (!paid) return;
    clearBagOnce(token);
    queryClient.invalidateQueries({ queryKey: ["http"] }); // stock changed
    queryClient.invalidateQueries({ queryKey: ["my-orders"] });
  }, [paid, token, queryClient]);

  if (error) {
    return (
      <main className="container-page py-20">
        <EmptyState
          title="We couldn't find that order"
          action={
            <Button asChild>
              <Link to="/shop">Back to the shop</Link>
            </Button>
          }
        >
          Check the link, or find it under your account if you were signed in.
        </EmptyState>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="container-page max-w-3xl py-16" aria-busy="true">
        <Skeleton className="size-16 rounded-full" />
        <Skeleton className="mt-6 h-9 w-2/3" />
        <Skeleton className="mt-8 h-48 w-full rounded-xl" />
      </main>
    );
  }

  const address = order.shipping_address ?? {};
  const closed = ["cancelled", "expired"].includes(order.status);

  return (
    <main className="container-page max-w-3xl py-12 sm:py-16">
      <div className="flex flex-col items-start gap-5">
        {paid ? (
          <SuccessMark />
        ) : closed ? (
          <span className="grid size-16 place-items-center rounded-full bg-muted">
            <X className="size-7 text-muted-foreground" aria-hidden="true" />
          </span>
        ) : (
          <span className="grid size-16 place-items-center rounded-full bg-muted">
            <Clock className="size-7 text-muted-foreground" aria-hidden="true" />
          </span>
        )}

        <div aria-live="polite">
          <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Order {order.reference}
          </p>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">
            {paid
              ? `Thanks, ${order.name.split(" ")[0]}. You're all set.`
              : closed
                ? "This order was not completed"
                : "Waiting for your payment…"}
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            {paid
              ? "Your order is confirmed. Bookmark this page to check on it, or find it in your account if you were signed in."
              : closed
                ? "The payment didn't go through, so nothing was charged and the items went back on the shelf."
                : "This usually takes a few seconds. This page updates on its own."}
          </p>
        </div>

        {!closed && <Progress status={order.status} />}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-[1fr_220px]">
        <section aria-labelledby="items-title" className="rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 id="items-title" className="font-semibold">
              Items
            </h2>
            <OrderStatusBadge status={order.status} />
          </div>
          <div className="mt-2">
            <OrderLines items={order.items} />
          </div>
          <div className="mt-4 border-t pt-4">
            <OrderTotals order={order} />
          </div>
        </section>
        <section aria-labelledby="ship-title" className="rounded-xl border bg-card p-5 text-sm">
          <h2 id="ship-title" className="font-semibold">
            Shipping to
          </h2>
          <address className="mt-3 leading-relaxed text-muted-foreground not-italic">
            {order.name}
            <br />
            {address.line1}
            {address.line2 && (
              <>
                <br />
                {address.line2}
              </>
            )}
            <br />
            {address.postal_code} {address.city}
            <br />
            {address.country}
          </address>
        </section>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        {closed ? (
          <Button asChild size="lg">
            <Link to="/bag">Back to your bag</Link>
          </Button>
        ) : (
          <Button asChild size="lg">
            <Link to="/shop">Keep shopping</Link>
          </Button>
        )}
        {order.status === "pending" && order.gateway === "test" && (
          <Button asChild size="lg" variant="outline">
            <Link to={`/checkout/pay/${token}`}>
              <Loader2 className="animate-spin" aria-hidden="true" /> Go back to payment
            </Link>
          </Button>
        )}
      </div>
    </main>
  );
};

export default OrderStatus;
