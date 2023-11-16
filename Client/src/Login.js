import React, { useState } from "react";
import "./Login.css";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";

const Login = ({handleAuthentication}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/auth/login', {
        email: email,
        password: password,
      });

      // Store the token in local storage or a cookie
      localStorage.setItem('id', response.data.id);

      // Update the login status
      setIsLoggedIn(true);

      // Redirect to Home component or the desired route
      handleAuthentication(true);
      alert(response.data.message)

    } catch (error) {
      alert('Invalid email or password');
    }

  };


  if (isLoggedIn) {
   return <Navigate to = "/" />
  }



  return (
    <div className="login-container">
      <div className="login-title">
        <h1 className="wlc-login">Welcome to PitchKit</h1>
        <h4>Login to your account</h4>
      </div>
      <form className="login-form">
        <div className="login-control">
          <label className="login-email">Email</label>
          <input
            type="email"
            placeholder=" Example@exemple.com"
            className="log-mail"
            name="password"
            value={email}
          onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="login-control">
          <label className="login-pass">Password</label>
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              placeholder=" Enter your password"
              className="log-pass"
              name='password'
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
        <div className="login-control">
          <button className="login-button" onClick={handleLogin}>login</button>
        </div>
        <div className="already-login">
          <p>D'ont have an account? &nbsp;</p>
          <Link className="login-link" to="/Register">
            Register
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
