import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./nav.css";

const NavBar = ({ isAuthenticated, count }) => {
  const location = useLocation();
  const [searchVisible, setSearchVisible] = useState(false);

  const renderSignInButton = () => {
    if (isAuthenticated) {
      return (
        <Link to="/profile" className="nav-link">
          <i className="fa fa-user"></i>
        </Link>
      );
    } else if (location.pathname === "/login") {
      return (
        <Link to="/register" className="nav-link">
          Register
        </Link>
      );
    } else {
      return (
        <Link to="/login" className="nav-link">
          Login
        </Link>
      );
    }
  };

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
  };

  return (
    <>
      <nav className="nav">
        <Link className="title-link" to="/" style={{ textDecoration: "none" }}>
          <h1 className="title">PitchKit.</h1>
        </Link>
        <div className="menu">
          <ul>
            <li>
              <a href="/Men">Men</a>
            </li>
            <li>
              <a href="/Women">Women</a>
            </li>
            <li>
              <a href="/Kids">Kids</a>
            </li>
            <li>
              <a href="/Brands">Brands</a>
            </li>
          </ul>
        </div>
        <div className="actions">
          <div className={`search ${searchVisible ? "active" : ""}`}>
            <i className="fa fa-search" onClick={toggleSearch}></i>
          </div>
          <div className="bag">
            <Link to="cart">
              <i
                className="fas fa-shopping-bag"
                style={{ position: "relative", cursor: "pointer" }}
              ></i>
              {count > 0 && <span className="counter">{count}</span>}
            </Link>
          </div>
          <div className="heart">
            <i className="fa fa-heart"></i>
          </div>
          <div className="signin">{renderSignInButton()}</div>
        </div>
      </nav>
      {searchVisible && (
        <div className="Search-container">
          <input type="text" placeholder=" Search" className="search-input" />
        </div>
      )}
    </>
  );
};

export default NavBar;
