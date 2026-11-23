import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiEye, FiEyeOff, FiInfo } from "react-icons/fi";
import form from "../css/form.module.css";
import { DEMO_MODE } from "../lib/api";

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
    <main className={form.page}>
      <div className={form.card}>
        <h1>{isRegister ? "Create your account" : "Welcome back"}</h1>
        <p className={form.lead}>
          {isRegister
            ? "Save your favorites and check out faster."
            : "Log in to see your orders and saved jerseys."}
        </p>

        <form className={form.form} onSubmit={handleSubmit} noValidate>
          {isRegister && (
            <div className={form.field}>
              <label htmlFor="name">Full name</label>
              <input id="name" type="text" autoComplete="name" required />
            </div>
          )}

          <div className={form.field}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className={form.field}>
            <label htmlFor="password">Password</label>
            <div className={form.password}>
              <input
                id="password"
                type={show ? "text" : "password"}
                autoComplete={isRegister ? "new-password" : "current-password"}
                aria-describedby={isRegister ? "password-hint" : undefined}
                required
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                aria-label={show ? "Hide password" : "Show password"}
                aria-pressed={show}
              >
                {show ? <FiEyeOff aria-hidden="true" /> : <FiEye aria-hidden="true" />}
              </button>
            </div>
            {isRegister && (
              <p id="password-hint" className={form.hint}>
                At least 8 characters.
              </p>
            )}
          </div>

          <button className="btn btn-primary" type="submit">
            {isRegister ? "Create account" : "Log in"}
          </button>

          {notice && (
            <p className={form.notice} role="status">
              <FiInfo aria-hidden="true" />
              {notice}
            </p>
          )}
        </form>

        <p className={form.switch}>
          {isRegister ? "Already have an account? " : "New to PitchKit? "}
          <Link className="link" to={isRegister ? "/login" : "/register"}>
            {isRegister ? "Log in" : "Create an account"}
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
