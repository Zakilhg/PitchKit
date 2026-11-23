import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import form from "../css/form.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
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
    <div className={form.container}>
      <h2>Welcome to PitchKit</h2>
      <p>{isRegister ? "Create your account" : "Login to your account"}</p>
      <form className={form.form} onSubmit={handleSubmit}>
        <label htmlFor="email">Email </label>
        <input type="email" id="email" placeholder="Example@mail.com" autoComplete="email" />

        <label htmlFor="password">Password</label>
        <div className={form.pass}>
          <input
            type={!show ? "password" : "text"}
            id="password"
            placeholder="Enter your password"
            autoComplete={isRegister ? "new-password" : "current-password"}
          />
          <button
            type="button"
            className={form.eye}
            onClick={() => setShow(!show)}
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <FaEyeSlash aria-hidden="true" /> : <FaEye aria-hidden="true" />}
          </button>
        </div>

        <button className={form.submit} type="submit">
          {isRegister ? "Register" : "Login"}
        </button>
        {notice && <p role="status">{notice}</p>}
      </form>
      <p>
        {isRegister ? "Have an account? " : "Don't have an account? "}
        <Link to={isRegister ? "/login" : "/register"}>
          {isRegister ? "Login" : "Register"}
        </Link>
      </p>
    </div>
  );
};

export default Login;
