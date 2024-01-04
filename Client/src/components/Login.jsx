import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import form from "../css/form.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";


const Login = ({handleAuthentication}) => {
  const [show, setShow] = useState(false);
  const [IsRegister, setIsRegister] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isregistred, setIsregistred] = useState('');


  const handleRegister = () => {
    setIsRegister(!IsRegister);
  };

  const handleShow = () => {
    setShow(!show);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (IsRegister) {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username,
            email: email,
            password: password,
          }),
        });
    
        if (response.ok) {
          // Successful registration
          setEmail('');
          setPassword('');
          setIsregistred(true);
        } else {
          // Handle registration failure
          console.log('Registration failed:', response.statusText);
        }
      } catch (error) {
        console.error('Error during registration:', error);
      }
    }
    
    else {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        });
    
        if (response.ok) {
          const responseData = await response.json();
    
          // Store the token in local storage or a cookie
          localStorage.setItem('token', responseData.token);
    
          // Update the login status
          setIsLoggedIn(true);
    
          // Redirect to Home component or the desired route
          handleAuthentication(true);
          alert(responseData.message);
        } else {
          // Handle login failure
          alert('Invalid email or password');
        }
      } catch (error) {
        console.error('Error during login:', error);
      }
    }
    };

  if (isregistred) {
    return <Navigate to = "/login" />
   }

  if (isLoggedIn) {
    return <Navigate to = "/" />
   }

  return (
    <div className={form.container}>
      <h2>Welcome to PitchKit</h2>
      <p>Login to your account</p>
      <form className={form.form}>
        {IsRegister && <>
          <label htmlFor="name">Username </label>
          <input type='text' id='username' placeholder='username' onChange={(e) => setUsername(e.target.value)}/>
        </>}
        <label htmlFor="email">Email </label>
        <input type="email" id="email" placeholder="Example@mail.com" name="email"
            value={email}
          onChange={(e) => setEmail(e.target.value)}/>

        <label htmlFor="password">Password</label>
        <div className={form.pass}>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            name='password'
              value={password}
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
