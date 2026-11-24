import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, LogOut, Package } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/Product";
import { OrderStatusBadge } from "@/components/OrderBits";
import { money } from "@/lib/format";
import { apiUrl, requestJson } from "@/lib/api";
import { displayName, logout } from "@/lib/auth";
import { clearSession, useSession } from "@/lib/session";

const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

const Account = () => {
  const session = useSession();
  const navigate = useNavigate();
  const [leaving, setLeaving] = useState(false);
  const orders = useQuery({
    queryKey: ["my-orders", session?.user?.id],
    queryFn: () => requestJson(apiUrl("me/orders")),
    enabled: Boolean(session),
  });

  // A token the server no longer accepts (revoked or reset): sign out locally.
  const unauthorised = orders.error?.status === 401;
  useEffect(() => {
    if (unauthorised) clearSession();
  }, [unauthorised]);

  if (!session) return <Navigate to="/login?next=/account" replace />;
  const user = session.user;

  const signOut = async () => {
    setLeaving(true);
    await logout().catch(() => {});
    toast("You're signed out");
    navigate("/", { replace: true });
  };

  const list = orders.data?.data ?? [];

  return (
    <main className="container-page py-10">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b pb-6">
        <div className="flex items-center gap-4">
          <span className="grid size-14 place-items-center rounded-full bg-foreground text-lg font-semibold text-background">
            {(user.first_name || user.email || "?").charAt(0).toUpperCase()}
          </span>
          <div>
            <h1 className="text-2xl font-semibold sm:text-3xl">{displayName(user)}</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <Button variant="outline" onClick={signOut} disabled={leaving}>
          <LogOut aria-hidden="true" /> Sign out
        </Button>
      </div>

      <section aria-labelledby="orders-title" className="mt-10">
        <h2 id="orders-title" className="text-lg font-semibold">
          Your orders
        </h2>

        {orders.isLoading ? (
          <div className="mt-4 space-y-3" aria-busy="true">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        ) : orders.error ? (
          <p role="alert" className="mt-4 text-sm text-destructive">
            We couldn&apos;t load your orders. Refresh to try again.
          </p>
        ) : list.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              icon={Package}
              title="No orders yet"
              action={
                <Button asChild>
                  <Link to="/shop">Find your kit</Link>
                </Button>
              }
            >
              Orders you place while signed in show up here.
            </EmptyState>
          </div>
        ) : (
          <ul className="mt-4 divide-y overflow-hidden rounded-xl border">
            {list.map((order) => (
              <li key={order.token}>
                <Link
                  to={`/order/${order.token}`}
                  className="flex flex-wrap items-center gap-x-6 gap-y-2 p-4 transition hover:bg-accent/50 sm:p-5"
                >
                  <span className="font-mono text-sm font-medium">{order.reference}</span>
                  <span className="text-sm text-muted-foreground">
                    {dateFormat.format(new Date(order.created_at))}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {order.items.reduce((n, item) => n + item.quantity, 0)} items
                  </span>
                  <OrderStatusBadge status={order.status} />
                  <span className="ml-auto flex items-center gap-2 text-sm font-medium tabular-nums">
                    {money(order.total_cents)}
                    <ChevronRight className="size-4 text-muted-foreground" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};

export default Account;
