import SmartImage from "@/components/SmartImage";
import { money } from "@/lib/format";
import { cn } from "@/lib/utils";

const STATUS = {
  pending: { label: "Awaiting payment", tone: "bg-muted text-muted-foreground" },
  paid: { label: "Paid · preparing", tone: "bg-success/12 text-success" },
  fulfilled: { label: "Shipped", tone: "bg-success/12 text-success" },
  cancelled: { label: "Cancelled", tone: "bg-muted text-muted-foreground" },
  expired: { label: "Expired", tone: "bg-muted text-muted-foreground" },
};

export const OrderStatusBadge = ({ status, className }) => {
  const { label, tone } = STATUS[status] ?? { label: status, tone: "bg-muted" };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        tone,
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {label}
    </span>
  );
};

export const OrderLines = ({ items }) => (
  <ul className="divide-y">
    {items.map((item) => (
      <li key={`${item.jersey_id}-${item.size}`} className="flex items-center gap-4 py-3">
        <span className="relative h-16 w-12 shrink-0 overflow-hidden rounded-md bg-surface">
          {item.image && <SmartImage file={item.image} sizes="48px" />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium">{item.name}</span>
          <span className="text-sm text-muted-foreground">
            Size {item.size} · Qty {item.quantity}
          </span>
        </span>
        <span className="text-sm tabular-nums">{money(item.unit_price_cents * item.quantity)}</span>
      </li>
    ))}
  </ul>
);

const CodeTag = ({ code }) => (
  <span className="ml-1.5 rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-foreground">
    {code}
  </span>
);

/** Totals for a placed order or a checkout quote (same field names). */
export const OrderTotals = ({ order }) => (
  <dl className="space-y-2 text-sm">
    <div className="flex justify-between">
      <dt className="text-muted-foreground">Subtotal</dt>
      <dd className="tabular-nums">{money(order.subtotal_cents)}</dd>
    </div>
    {order.discount_cents > 0 && (
      <div className="flex justify-between text-success">
        <dt>
          Discount
          <CodeTag code={order.discount_code} />
        </dt>
        <dd className="tabular-nums">&minus;{money(order.discount_cents)}</dd>
      </div>
    )}
    <div className="flex justify-between">
      <dt className="text-muted-foreground">
        Shipping
        {order.discount_code && !order.discount_cents && <CodeTag code={order.discount_code} />}
      </dt>
      <dd className="tabular-nums">
        {order.shipping_cents ? money(order.shipping_cents) : "Free"}
      </dd>
    </div>
    <div className="flex justify-between border-t pt-2 text-base font-semibold">
      <dt>Total</dt>
      <dd className="tabular-nums">{money(order.total_cents)}</dd>
    </div>
  </dl>
);
