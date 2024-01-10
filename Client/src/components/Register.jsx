import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import form from "../css/form.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const [show, setShow] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isregistred, setIsregistred] = useState("");

  const handleShow = () => {
    setShow(!show);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
        }),
      });

      if (response.ok) {
        // Successful registration
        setEmail("");
        setPassword("");
        setIsregistred(true);
      } else {
        // Handle registration failure
        console.log("Registration failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };
  if (isregistred) {
    return <Navigate to="/login" />;
  }

  return (
    <div className={form.container}>
      <h2>Welcome to PitchKit</h2>
      <p>Create new account</p>
      <form className={form.form}>
        <label htmlFor="name">Username </label>
        <input
          type="text"
          id="username"
          placeholder="username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <label htmlFor="email">Email </label>
        <input
          type="email"
          id="email"
          placeholder="Example@mail.com"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">Password</label>
        <div className={form.pass}>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {show ? (
            <FaEyeSlash className={form.eye} onClick={handleShow} />
          ) : (
            <FaEye className={form.eye} onClick={handleShow} />
          )}
        </div>

        <a href="#">Forget Password?</a>
        <button className={form.submit} type="submit" onClick={handleLogin}>
          Sign Up
        </button>
      </form>
      <p>
        "have an account?
        <Link to="/login">Sign In</Link>
      </p>
    </div>
  );
};

export default Register;
