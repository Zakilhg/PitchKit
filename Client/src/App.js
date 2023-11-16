import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "./Components/NavBar";
import Login from "./Login";
import Register from "./Register";
import Home from "./Home";
import ProductDetails from "./Components/ProductDetails";
import Footer from "./Components/Footer";
import Profile from "./Profile";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [count, setCount] = useState(0);
  const handleAuthentication = (authenticated) => {
    setIsAuthenticated(authenticated);
  };

  const increaseCounter = () => {
    setCount(count + 1);
  };

  return (
    <div className="main">
      <BrowserRouter>
        <NavBar isAuthenticated={isAuthenticated} count={count} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/login"
            element={<Login handleAuthentication={handleAuthentication} />}
          />
          <Route path="/register" element={<Register />} />
          <Route
            path="/p/:id"
            element={<ProductDetails handleClick={increaseCounter} />}
          />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
