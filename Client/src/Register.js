import React, { useState } from "react";
import "./Register.css";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isregistred, setIsregistred] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/register",
        {
          username: username,
          email: email,
          password: password,
        }
      );
      alert(response.data.message);
      setIsregistred(true);
    } catch (error) {
      console.log(error);
    }
  };

  if (isregistred) {
    return <Navigate to="/login" />;
  }

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="register-container">
      <div className="register-title">
        <h1 className="wlc-register">Welcome to PitchKit</h1>
        <h4>Create an account</h4>
      </div>
      <form className="register-form" onSubmit={handleRegister}>
        <div className="register-control">
          <label className="register-name">Userame</label>
          <input
            type="text"
            placeholder=" Enter your username"
            className="reg-name"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="register-control">
          <label className="register-email">Email</label>
          <input
            type="email"
            placeholder=" Example@exemple.com"
            className="reg-mail"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="register-control">
          <label className="register-pass">Password</label>
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              placeholder=" Enter your password"
              className="reg-pass"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <img
              src={
                showPassword
                  ? "../../image/eye-off-thin.svg"
                  : "../../image/eye-thin.svg"
              }
              alt="Toggle password visibility"
              className="eye-icon"
              onClick={handleShowPassword}
            />
          </div>
        </div>
        <div className="register-control">
          <button className="register-button">Register</button>
        </div>
        <div className="already-register">
          <p>Already have an account? &nbsp;</p>
          <Link className="login-link" to="/Login">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
