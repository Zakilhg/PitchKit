import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Info, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Nav";
import SmartImage from "@/components/SmartImage";
import { DEMO_MODE } from "@/lib/api";
import { login, register } from "@/lib/auth";
import { useSession } from "@/lib/session";
import { cn } from "@/lib/utils";

const Field = ({ id, label, error, hint, children }) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    {children}
    {error ? (
      <p id={`${id}-error`} className="text-sm text-destructive">
        {error}
      </p>
    ) : (
      hint && (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )
    )}
  </div>
);

const Login = () => {
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const isRegister = pathname.endsWith("/register");
  const session = useSession();
  // Only follow in-app paths after signing in.
  const next = (params.get("next") || "").startsWith("/") ? params.get("next") : "/account";

  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [values, setValues] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const set = (key) => (event) => setValues((v) => ({ ...v, [key]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (DEMO_MODE) {
      setFormError("This demo has no backend, so accounts are turned off.");
      return;
    }
    setBusy(true);
    setErrors({});
    setFormError("");
    try {
      const user = await (isRegister ? register(values) : login(values));
      toast.success(
        isRegister ? "Welcome to PitchKit" : `Welcome back, ${user.first_name || ""}`.trim(),
      );
      navigate(next, { replace: true });
    } catch (error) {
      const fieldErrors = {
        firstName: error.field?.("first_name"),
        lastName: error.field?.("last_name"),
        email: error.field?.("email"),
        password: error.field?.("password"),
      };
      setErrors(fieldErrors);
      if (!Object.values(fieldErrors).some(Boolean)) setFormError(error.message);
    } finally {
      setBusy(false);
    }
  };

  if (session) return <Navigate to={next} replace />;

  const describedBy = (id, hint) => (errors[id] ? `${id}-error` : hint ? `${id}-hint` : undefined);

  return (
    <main className="container-page py-10 lg:py-16">
      <div className="grid overflow-hidden rounded-2xl border bg-card lg:grid-cols-2">
        <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
          <div className="mx-auto w-full max-w-sm">
            <h1 className="text-2xl font-semibold">
              {isRegister ? "Create your account" : "Welcome back"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {isRegister
                ? "Track your orders and check out faster."
                : "Log in to see your orders."}
            </p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
              {isRegister && (
                <div className="grid grid-cols-2 gap-3">
                  <Field id="firstName" label="First name" error={errors.firstName}>
                    <Input
                      id="firstName"
                      autoComplete="given-name"
                      required
                      value={values.firstName}
                      onChange={set("firstName")}
                      aria-invalid={Boolean(errors.firstName)}
                      aria-describedby={describedBy("firstName")}
                      className="h-10"
                    />
                  </Field>
                  <Field id="lastName" label="Last name" error={errors.lastName}>
                    <Input
                      id="lastName"
                      autoComplete="family-name"
                      required
                      value={values.lastName}
                      onChange={set("lastName")}
                      aria-invalid={Boolean(errors.lastName)}
                      aria-describedby={describedBy("lastName")}
                      className="h-10"
                    />
                  </Field>
                </div>
              )}

              <Field id="email" label="Email" error={errors.email}>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  value={values.email}
                  onChange={set("email")}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={describedBy("email")}
                  className="h-10"
                />
              </Field>

              <Field
                id="password"
                label="Password"
                error={errors.password}
                hint={isRegister ? "At least 8 characters." : undefined}
              >
                <div className="relative">
                  <Input
                    id="password"
                    type={show ? "text" : "password"}
                    autoComplete={isRegister ? "new-password" : "current-password"}
                    required
                    value={values.password}
                    onChange={set("password")}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={describedBy("password", isRegister)}
                    className="h-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    aria-label={show ? "Hide password" : "Show password"}
                    aria-pressed={show}
                    className="absolute inset-y-0 right-0 grid w-10 cursor-pointer place-items-center text-muted-foreground hover:text-foreground"
                  >
                    {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </Field>

              <Button type="submit" size="lg" className="h-11 w-full" disabled={busy}>
                {busy && <Loader2 className="animate-spin" aria-hidden="true" />}
                {isRegister ? "Create account" : "Log in"}
              </Button>

              <div aria-live="polite">
                {formError && (
                  <p
                    role="alert"
                    className={cn(
                      "flex items-start gap-2 rounded-lg border p-3 text-sm",
                      DEMO_MODE ? "bg-muted/50" : "border-destructive/30 bg-destructive/5",
                    )}
                  >
                    <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    {formError}
                  </p>
                )}
              </div>
            </form>

            {!isRegister && !DEMO_MODE && (
              <p className="mt-6 rounded-lg border border-dashed p-3 text-xs text-muted-foreground">
                Test customer: <code className="font-mono text-foreground">fan@pitchkit.test</code>{" "}
                / <code className="font-mono text-foreground">pitchkit-demo</code>
              </p>
            )}

            <p className="mt-8 text-center text-sm text-muted-foreground">
              {isRegister ? "Already have an account? " : "New to PitchKit? "}
              <Link
                className="font-medium text-foreground underline underline-offset-4"
                to={`${isRegister ? "/login" : "/register"}${params.get("next") ? `?next=${encodeURIComponent(next)}` : ""}`}
              >
                {isRegister ? "Log in" : "Create an account"}
              </Link>
            </p>
            <p className="mt-3 text-center text-sm text-muted-foreground">
              Store staff?{" "}
              <Link
                className="font-medium text-foreground underline underline-offset-4"
                to="/admin"
              >
                Open the admin dashboard
              </Link>
            </p>
          </div>
        </div>

        <div className="relative hidden min-h-[560px] lg:block">
          <SmartImage file="liverpool-1.jpg" sizes="50vw" className="object-top" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute right-8 bottom-8 left-8 text-white">
            <Logo className="text-white [&_.fill-foreground]:fill-white [&_.fill-background]:fill-neutral-900" />
            <p className="mt-3 max-w-xs text-sm text-white/80">
              Every league. Every club. One bag.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
