import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Eye, EyeOff, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Nav";
import { DEMO_MODE } from "@/lib/api";
import { imageUrl } from "@/lib/jersey";

const Login = () => {
  const { pathname } = useLocation();
  const isRegister = pathname.endsWith("/register");
  const [show, setShow] = useState(false);
  const [notice, setNotice] = useState("");

  // The API has /api/auth endpoints, but this form isn't connected to them yet.
  const handleSubmit = (event) => {
    event.preventDefault();
    setNotice(
      DEMO_MODE
        ? "This is a demo without a backend, so accounts are turned off."
        : "Accounts aren't connected to the storefront yet.",
    );
  };

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
                ? "Save your favourites and check out faster."
                : "Log in to see your orders and saved jerseys."}
            </p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
              {isRegister && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" autoComplete="name" required className="h-10" />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={show ? "text" : "password"}
                    autoComplete={isRegister ? "new-password" : "current-password"}
                    aria-describedby={isRegister ? "password-hint" : undefined}
                    required
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
                {isRegister && (
                  <p id="password-hint" className="text-xs text-muted-foreground">
                    At least 8 characters.
                  </p>
                )}
              </div>

              <Button type="submit" size="lg" className="h-11 w-full">
                {isRegister ? "Create account" : "Log in"}
              </Button>

              {notice && (
                <p
                  role="status"
                  className="flex items-start gap-2 rounded-lg border bg-muted/50 p-3 text-sm"
                >
                  <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  {notice}
                </p>
              )}
            </form>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              {isRegister ? "Already have an account? " : "New to PitchKit? "}
              <Link
                className="font-medium text-foreground underline underline-offset-4"
                to={isRegister ? "/login" : "/register"}
              >
                {isRegister ? "Log in" : "Create an account"}
              </Link>
            </p>
          </div>
        </div>

        <div className="relative hidden min-h-[560px] lg:block">
          <img
            src={imageUrl("liverpool-1.jpg")}
            alt=""
            className="absolute inset-0 size-full object-cover object-top"
          />
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
