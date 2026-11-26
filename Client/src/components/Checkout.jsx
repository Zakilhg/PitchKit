import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Info, Loader2, Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderTotals } from "@/components/OrderBits";
import PromoCode from "@/components/PromoCode";
import SmartImage from "@/components/SmartImage";
import { apiUrl, ApiError, DEMO_MODE, requestJson } from "@/lib/api";
import { displayName } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { money } from "@/lib/format";
import { useSession } from "@/lib/session";
import { cn } from "@/lib/utils";

const COUNTRIES = [
  "US",
  "GB",
  "CA",
  "FR",
  "DE",
  "ES",
  "IT",
  "NL",
  "BE",
  "PT",
  "IE",
  "CH",
  "AT",
  "SE",
  "DK",
  "NO",
  "MA",
  "DZ",
  "TN",
  "AE",
  "AU",
  "BR",
  "AR",
  "MX",
  "JP",
];
const countryName = new Intl.DisplayNames(["en"], { type: "region" });

// The code survives a trip to the payment page and back within this tab.
const CODE_KEY = "pitchkit.discountCode";
const readCode = () => {
  try {
    return sessionStorage.getItem(CODE_KEY) || "";
  } catch {
    return "";
  }
};
const saveCode = (code) => {
  try {
    if (code) sessionStorage.setItem(CODE_KEY, code);
    else sessionStorage.removeItem(CODE_KEY);
  } catch {
    // Storage blocked: the code just won't be remembered.
  }
};

const toItems = (cart) =>
  cart.map((item) => ({ jersey_id: item.productId, size: item.size, quantity: item.quantity }));

const Field = ({ id, label, error, optional, className, children }) => (
  <div className={cn("space-y-2", className)}>
    <Label htmlFor={id}>
      {label}
      {optional && <span className="font-normal text-muted-foreground">optional</span>}
    </Label>
    {children}
    {error && (
      <p id={`${id}-error`} className="text-sm text-destructive">
        {error}
      </p>
    )}
  </div>
);

const Checkout = () => {
  const cart = useCart();
  const session = useSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [params, setParams] = useSearchParams();
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [values, setValues] = useState(() => ({
    email: session?.user?.email ?? "",
    name: displayName(session?.user),
    line1: "",
    line2: "",
    city: "",
    postal_code: "",
    country: "US",
  }));
  const set = (key) => (event) => setValues((v) => ({ ...v, [key]: event.target.value }));
  const items = toItems(cart);
  const [code, setCodeState] = useState(readCode);
  const setCode = (next) => {
    saveCode(next);
    setCodeState(next);
  };

  // Server-priced summary: the source of truth for totals, stock and the code.
  const quote = useQuery({
    queryKey: ["quote", items, code],
    queryFn: () =>
      requestJson(apiUrl("checkout/quote"), { json: { items, code: code || null } }),
    enabled: items.length > 0 && !DEMO_MODE,
    retry: false,
    staleTime: 0,
    // Keep showing the last totals while a code is checked.
    placeholderData: keepPreviousData,
  });
  const summary = quote.data?.data;
  const appliedCode = summary?.code ?? null;
  const codeError = code && !quote.isPlaceholderData ? summary?.code_error : null;

  // Coming back from a payment page with "back": free the stock that order held.
  const cancelled = params.get("cancelled");
  const handledCancel = useRef(false);
  useEffect(() => {
    if (!cancelled || handledCancel.current) return;
    handledCancel.current = true;
    requestJson(apiUrl(`orders/${encodeURIComponent(cancelled)}/cancel`), { method: "POST" })
      .catch(() => {})
      .finally(() => {
        toast("Payment cancelled", { description: "Your bag is just as you left it." });
        setParams({}, { replace: true });
      });
  }, [cancelled, setParams]);

  // The static demo has no server to take the order.
  if (!cart.length || DEMO_MODE) return <Navigate to="/bag" replace />;

  const quoteErrors = quote.error instanceof ApiError ? quote.error.errors : {};
  const lineError = (i) => quoteErrors[`items.${i}`]?.[0];
  const lines = quote.data?.data?.lines ?? [];

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setErrors({});
    setFormError("");
    try {
      const { data } = await requestJson(apiUrl("checkout"), {
        json: {
          items,
          // Only send a code the server has accepted for this bag.
          code: appliedCode?.code ?? null,
          email: values.email,
          name: values.name,
          address: {
            line1: values.line1,
            line2: values.line2 || null,
            city: values.city,
            postal_code: values.postal_code,
            country: values.country,
          },
        },
      });
      queryClient.invalidateQueries({ queryKey: ["http"] }); // stock just changed

      const url = new URL(data.payment_url, window.location.href);
      const base = import.meta.env.BASE_URL.replace(/\/$/, "");
      if (url.origin === window.location.origin && url.pathname.startsWith(base)) {
        navigate(url.pathname.slice(base.length) + url.search);
      } else {
        window.location.assign(url.href); // Stripe Checkout
      }
    } catch (error) {
      const e = error instanceof ApiError ? error : new ApiError(String(error), 0);
      const pick = (key) => e.field(key);
      const next = {
        email: pick("email"),
        name: pick("name"),
        line1: pick("address.line1"),
        line2: pick("address.line2"),
        city: pick("address.city"),
        postal_code: pick("address.postal_code"),
        country: pick("address.country"),
      };
      setErrors(next);
      if (!Object.values(next).some(Boolean)) {
        setFormError(
          pick("items") ||
            pick("payment") ||
            (pick("code") && `${pick("code")} Remove it or try another code.`) ||
            Object.values(e.errors)[0]?.[0] ||
            e.message,
        );
        quote.refetch();
      }
      setBusy(false);
    }
  };

  const describe = (key) => (errors[key] ? `${key}-error` : undefined);
  const hasStockProblem = Object.keys(quoteErrors).length > 0;

  return (
    <main className="container-page py-8 sm:py-10">
      <Button asChild variant="ghost" className="-ml-3 text-muted-foreground">
        <Link to="/bag">
          <ArrowLeft aria-hidden="true" /> Back to bag
        </Link>
      </Button>
      <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Checkout</h1>

      <p className="mt-4 flex items-start gap-2 rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        PitchKit is a portfolio store: nothing ships and payments run in test mode. Please
        don&apos;t enter real personal details.
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_400px] lg:gap-16">
        <form onSubmit={handleSubmit} noValidate className="space-y-10">
          <fieldset className="space-y-5">
            <legend className="mb-4 text-lg font-semibold">Contact</legend>
            {!session && (
              <p className="text-sm text-muted-foreground">
                Have an account?{" "}
                <Link
                  to="/login?next=/checkout"
                  className="font-medium text-foreground underline underline-offset-4"
                >
                  Log in
                </Link>{" "}
                to see this order in your account later.
              </p>
            )}
            <Field id="email" label="Email" error={errors.email}>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={values.email}
                onChange={set("email")}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={describe("email")}
                className="h-10"
              />
            </Field>
          </fieldset>

          <fieldset className="space-y-5">
            <legend className="mb-4 text-lg font-semibold">Shipping address</legend>
            <Field id="name" label="Full name" error={errors.name}>
              <Input
                id="name"
                autoComplete="name"
                required
                value={values.name}
                onChange={set("name")}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={describe("name")}
                className="h-10"
              />
            </Field>
            <Field id="line1" label="Address" error={errors.line1}>
              <Input
                id="line1"
                autoComplete="address-line1"
                required
                value={values.line1}
                onChange={set("line1")}
                aria-invalid={Boolean(errors.line1)}
                aria-describedby={describe("line1")}
                className="h-10"
              />
            </Field>
            <Field id="line2" label="Apartment, suite, etc. " optional error={errors.line2}>
              <Input
                id="line2"
                autoComplete="address-line2"
                value={values.line2}
                onChange={set("line2")}
                className="h-10"
              />
            </Field>
            <div className="grid gap-5 sm:grid-cols-[1fr_160px]">
              <Field id="city" label="City" error={errors.city}>
                <Input
                  id="city"
                  autoComplete="address-level2"
                  required
                  value={values.city}
                  onChange={set("city")}
                  aria-invalid={Boolean(errors.city)}
                  aria-describedby={describe("city")}
                  className="h-10"
                />
              </Field>
              <Field id="postal_code" label="Postal code" error={errors.postal_code}>
                <Input
                  id="postal_code"
                  autoComplete="postal-code"
                  required
                  value={values.postal_code}
                  onChange={set("postal_code")}
                  aria-invalid={Boolean(errors.postal_code)}
                  aria-describedby={describe("postal_code")}
                  className="h-10"
                />
              </Field>
            </div>
            <Field id="country" label="Country" error={errors.country}>
              <Select
                value={values.country}
                onValueChange={(country) => setValues((v) => ({ ...v, country }))}
              >
                <SelectTrigger id="country" className="h-10 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((code) => (
                    <SelectItem key={code} value={code}>
                      {countryName.of(code)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </fieldset>

          <fieldset>
            <legend className="mb-4 text-lg font-semibold">Payment</legend>
            <p className="flex items-start gap-3 rounded-lg bg-muted/60 p-4 text-sm">
              <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>
                You&apos;ll pay on the next step. Your items are held for 35 minutes while you do.
              </span>
            </p>
          </fieldset>

          <div aria-live="polite">
            {formError && (
              <p
                role="alert"
                className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
              >
                {formError}
              </p>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            className="h-12 w-full sm:w-auto sm:min-w-64"
            disabled={busy || hasStockProblem || quote.isLoading}
          >
            {busy ? (
              <Loader2 className="animate-spin" aria-hidden="true" />
            ) : (
              <Lock aria-hidden="true" />
            )}
            {quote.data
              ? `Continue to payment · ${money(quote.data.data.total_cents)}`
              : "Continue to payment"}
          </Button>
        </form>

        <aside aria-labelledby="summary-title" className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border bg-card p-6">
            <h2 id="summary-title" className="text-lg font-semibold">
              Order summary
            </h2>

            {quote.isLoading ? (
              <div className="mt-5 space-y-3" aria-busy="true">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : hasStockProblem ? (
              <div className="mt-5 space-y-3">
                {items.map((item, i) =>
                  lineError(i) ? (
                    <p key={i} role="alert" className="text-sm text-destructive">
                      {lineError(i)}
                    </p>
                  ) : null,
                )}
                <Button asChild variant="outline" className="w-full">
                  <Link to="/bag">Update your bag</Link>
                </Button>
              </div>
            ) : quote.error || !quote.data ? (
              <p role="alert" className="mt-5 text-sm text-destructive">
                {quote.error?.message ?? "We couldn't price your bag. Refresh to try again."}
              </p>
            ) : (
              <>
                <ul className="mt-5 divide-y">
                  {lines.map((line) => (
                    <li
                      key={`${line.jersey_id}-${line.size}`}
                      className="flex items-center gap-3 py-3"
                    >
                      <span className="relative h-16 w-12 shrink-0 overflow-hidden rounded-md bg-surface">
                        <SmartImage file={line.image} sizes="48px" />
                        <span className="absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-foreground text-[10px] font-semibold text-background">
                          {line.quantity}
                        </span>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{line.name}</span>
                        <span className="text-sm text-muted-foreground">Size {line.size}</span>
                      </span>
                      <span className="text-sm tabular-nums">
                        {money(line.unit_price_cents * line.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 border-t pt-4">
                  <PromoCode
                    applied={appliedCode}
                    error={codeError}
                    checking={quote.isFetching}
                    onApply={(next) => {
                      setFormError("");
                      setCode(next.toUpperCase());
                    }}
                    onRemove={() => {
                      setFormError("");
                      setCode("");
                    }}
                  />
                </div>
                <div className="mt-4 border-t pt-4">
                  <OrderTotals order={{ ...summary, discount_code: appliedCode?.code }} />
                </div>
              </>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
};

export default Checkout;
