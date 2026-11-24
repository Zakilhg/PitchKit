import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FlaskConical, Loader2, Timer } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderLines, OrderTotals } from "@/components/OrderBits";
import { Logo } from "@/components/Nav";
import { apiUrl, requestJson } from "@/lib/api";
import { money } from "@/lib/format";

const useCountdown = (iso) => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  if (!iso) return null;
  const left = Math.max(0, new Date(iso).getTime() - now);
  return `${Math.floor(left / 60000)}:${String(Math.floor((left % 60000) / 1000)).padStart(2, "0")}`;
};

/**
 * The built-in test gateway's payment page. It never shows card fields: the
 * buttons just tell the server how the "payment" went. With Stripe keys set,
 * customers go to Stripe Checkout instead and never see this page.
 */
const TestPayment = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState("");
  const {
    data,
    isLoading,
    error: loadError,
  } = useQuery({
    queryKey: ["order", token],
    queryFn: () => requestJson(apiUrl(`orders/${encodeURIComponent(token)}`)),
  });
  const order = data?.data;
  const countdown = useCountdown(order?.expires_at);

  if (loadError) return <Navigate to={`/order/${token}`} replace />;
  if (order && order.status !== "pending") return <Navigate to={`/order/${token}`} replace />;

  const send = (outcome) => async () => {
    setBusy(outcome);
    setError("");
    try {
      await requestJson(apiUrl(`orders/${encodeURIComponent(token)}/test-payment`), {
        json: { outcome },
      });
      navigate(`/order/${token}`, { replace: true });
    } catch (e) {
      setError(e.field?.("payment") || e.field?.("order") || e.message);
      setBusy(null);
    }
  };

  const cancel = async () => {
    setBusy("cancel");
    await requestJson(apiUrl(`orders/${encodeURIComponent(token)}/cancel`), {
      method: "POST",
    }).catch(() => {});
    toast("Payment cancelled", { description: "Your bag is just as you left it." });
    navigate("/bag", { replace: true });
  };

  return (
    <main className="min-h-[80vh] bg-muted/40 py-10 sm:py-16">
      <div className="container-page grid max-w-5xl gap-8 lg:grid-cols-[1fr_380px]">
        <section className="rounded-2xl border bg-card p-6 shadow-sm sm:p-10">
          <div className="flex items-center justify-between gap-4">
            <Logo />
            <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/15 px-2.5 py-1 font-mono text-[11px] font-medium tracking-wider text-warning uppercase">
              <FlaskConical className="size-3.5" aria-hidden="true" /> Test mode
            </span>
          </div>

          <h1 className="mt-10 text-sm font-medium text-muted-foreground">Pay PitchKit</h1>
          {isLoading ? (
            <Skeleton className="mt-2 h-10 w-40" />
          ) : (
            <p className="mt-1 text-4xl font-semibold tracking-tight tabular-nums">
              {money(order.total_cents)}
            </p>
          )}

          <div className="mt-8 rounded-xl border border-dashed p-5">
            <p className="font-medium">This is the built-in test gateway</p>
            <p className="mt-1 text-sm text-muted-foreground">
              No card is needed and nothing is charged. Pick how the payment should go. With Stripe
              keys configured, this step is Stripe Checkout instead.
            </p>
          </div>

          <div aria-live="polite">
            {error && (
              <p
                role="alert"
                className="mt-5 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
              >
                {error}
              </p>
            )}
          </div>

          <div className="mt-8 space-y-3">
            <Button
              size="lg"
              className="h-12 w-full"
              onClick={send("succeed")}
              disabled={!order || busy}
            >
              {busy === "succeed" && <Loader2 className="animate-spin" aria-hidden="true" />}
              {order ? `Pay ${money(order.total_cents)}` : "Pay"}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 w-full"
              onClick={send("decline")}
              disabled={!order || busy}
            >
              {busy === "decline" && <Loader2 className="animate-spin" aria-hidden="true" />}
              Simulate a declined payment
            </Button>
            <Button
              variant="link"
              className="w-full text-muted-foreground"
              onClick={cancel}
              disabled={busy}
            >
              Cancel and return to your bag
            </Button>
          </div>

          {countdown && (
            <p className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Timer className="size-4" aria-hidden="true" />
              Items held for <span className="font-mono tabular-nums">{countdown}</span>
            </p>
          )}
        </section>

        <aside
          aria-labelledby="pay-summary"
          className="rounded-2xl border bg-card p-6 lg:self-start"
        >
          <h2 id="pay-summary" className="flex items-center justify-between text-sm font-medium">
            Order summary
            {order && <span className="font-mono text-muted-foreground">{order.reference}</span>}
          </h2>
          {isLoading ? (
            <Skeleton className="mt-4 h-32 w-full" />
          ) : (
            <>
              <div className="mt-2">
                <OrderLines items={order.items} />
              </div>
              <div className="mt-4 border-t pt-4">
                <OrderTotals order={order} />
              </div>
            </>
          )}
          <p className="mt-6 text-xs text-muted-foreground">
            Changed your mind about something?{" "}
            <Link to="/bag" onClick={cancel} className="underline underline-offset-4">
              Edit your bag
            </Link>
          </p>
        </aside>
      </div>
    </main>
  );
};

export default TestPayment;
