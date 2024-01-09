import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import form from "../css/form.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  // const passRef = useRef();
  const [show, setShow] = useState(false);
  const [IsRegister, setIsRegister] = useState(false);

  const handleRegister = () => {
    setIsRegister(!IsRegister);
  };

  const handleShow = () => {
    setShow(!show);

    // if (!show) {
    //   passRef.current.type = "text";
    // } else {
    //   passRef.current.type = "password";
    // }
  };
  return (
    <div className={form.container}>
      <h2>Welcome to PitchKit</h2>
      <p>Login to your account</p>
      <form className={form.form}>
        <label htmlFor="email">Email </label>
        <input type="email" id="email" placeholder="Example@mail.com" />

        <label htmlFor="password">Password</label>
        <div className={form.pass}>
          <input
            // ref={passRef}
            type={!show ? "password" : "text"}
            id="password"
            placeholder="Enter your password"
          />
          {show ? (
            <FaEyeSlash className={form.eye} onClick={handleShow} />
          ) : (
            <FaEye className={form.eye} onClick={handleShow} />
          )}
        </div>

        <a href="#">Forget Password?</a>
        <button className={form.submit} type="submit">
          {IsRegister ? "Register" : "Login"}
        </button>
      </form>
      <p>
        {!IsRegister ? "Don't have an account?" : "have an account?"}

        <Link to="/register" onClick={handleRegister}>
          {!IsRegister ? "Register" : "Login"}
        </Link>
      </p>
    </div>
  );
};

export default Login;
