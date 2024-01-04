import React, { useEffect, useRef, useState } from "react";
import nav from "../css/nav.module.css";
import { FaHeart, FaSearch, FaShoppingBag } from "react-icons/fa";
import { RxCross2, RxHamburgerMenu } from "react-icons/rx";
import { motion } from "framer-motion";
import { IoIosArrowForward } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";

const Nav = ({isAuthenticated}) => {
  const location = useLocation();

  const navRef = useRef();
  const [IsActive, setIsActive] = useState(false);
  const [IsMobile, setIsMobile] = useState(false);

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
    setIsActive(!IsActive);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsMobile(false);
        navRef.current.classList.remove(nav.mobile);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleMobileView = () => {
    setIsMobile(!IsMobile);
    navRef.current.classList.toggle(nav.mobile);
  };
  return (
    <nav className={nav.nav__container} ref={navRef}>
      <div className={nav.hamburger__menu}>
        {IsMobile ? (
          <>
            <div className={nav.hamburger__menu_top}>
              <p>Menu</p>
              <RxCross2 onClick={handleMobileView} />
            </div>
            <div className={nav.hamburger__menu_profile}>
              <div className={nav.hamburger__menu_profile__image}>
                <img
                  src="https://i.pinimg.com/564x/07/9e/d1/079ed13f9f319ac714983765d6f98de9.jpg"
                  alt="wow"
                />
              </div>

              <div className={nav.hamburger__menu_profile__name}>
                <p>Hi, Pristia</p>
                <p className={nav.member__since}>Member Since 2022</p>
              </div>
              <IoIosArrowForward className={nav.arrow} />
            </div>

            <label htmlFor="search" className={nav.hamburger__menu_search}>
              <input
                id="search"
                type="text"
                placeholder="Search name product or etc"
              />
              <FaSearch className={nav.search__icon} />
            </label>

            <ul className={nav.hamburger__menu_links}>
              <li>
                <a href="#">My bag</a>
              </li>
              <li>
                <a href="#">Favorites</a>
              </li>
              <li>
                <a href="#">Men</a>
              </li>
              <li>
                <a href="#">Women</a>
              </li>
              <li>
                <a href="#">Kids</a>
              </li>
              <li>
                <a href="#">Brands</a>
              </li>
            </ul>
          </>
        ) : (
          <>
            <RxHamburgerMenu onClick={handleMobileView} />
          </>
        )}
      </div>
      <div className={nav.nav__logo}>
        <Link to={"/"}>
          <h1>PitchKit</h1>
        </Link>
      </div>
      <div className={nav.nav__links}>
        <ul>
          <li>
            <a href="#">Men</a>
          </li>
          <li>
            <a href="#">Women</a>
          </li>
          <li>
            <a href="#">Kids</a>
          </li>
          <li>
            <a href="#">Brands</a>
          </li>
        </ul>
      </div>

      <div className={nav.right__side}>
        <div className={nav.icons__container}>
          <div className={nav.search__container}>
            {IsActive ? (
              <motion.div
                animate={{
                  x: -200,
                  opacity: 1,
                  zIndex: 1,
                }}
                transition={{ duration: 0.2 }}
                className={nav.search__bar}
              >
                <input
                  type="text"
                  placeholder="Search"
                  className={nav.active}
                />
              </motion.div>
            ) : (
              <motion.div
                initial={{
                  y: "-50%",
                  x: -200,
                  opacity: 1,
                  zIndex: -1,
                }}
                animate={{
                  x: -150,
                }}
                transition={{ duration: 0.2 }}
                className={nav.search__bar}
              >
                <input
                  type="text"
                  placeholder="Search"
                  className={nav.active}
                />
              </motion.div>
            )}
          </div>
          <div className={nav.icons}>
            {IsActive ? (
              <RxCross2
                className={nav.icon_cross}
                onClick={toggleSearch}
                style={{ color: "red" }}
              />
            ) : (
              <FaSearch className={nav.icon_search} onClick={toggleSearch} />
            )}
            <FaHeart className={nav.icon_heart} />
            <FaShoppingBag className={nav.icon__shopping__bag} />

            <div className={nav.shopping__bag__notification}></div>
          </div>
        </div>

        <div className={nav.account__container}>
        {renderSignInButton()}
        </div>
      </div>
    </nav>
  );
};

export default Nav;
