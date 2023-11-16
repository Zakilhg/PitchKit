import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-title">
        <a
          href="/"
          style={{
            color: "white",
            textDecoration: "none",
            fontWeight: "800",
            lineHeight: "29px",
            fontSize: "26px",
          }}
        >
          PitchKit.
        </a>
      </div>
      <div className="footer-menu">
        <div className="item">
          <h4>Shop Online</h4>
          <a href="/">New Collection</a>
          <a href="/">Categories</a>
          <a href="/">Gallery</a>
        </div>
        <div className="item">
          <h4>Services</h4>
          <a href="/">Interior Design</a>
          <a href="/">Interior Design</a>
          <a href="/">Product Design</a>
        </div>

        <div className="item">
          <h4>About</h4>
          <a href="/">Contact Us</a>
          <a href="/">Stories</a>
          <a href="/">FAQ</a>
        </div>
      </div>
      <div className="social-media">
        <i className="fab fa-facebook"></i>
        <i className="fab fa-twitter"></i>
        <i className="fab fa-instagram"></i>
        <i className="fab fa-youtube"></i>
      </div>

      <div className="copyright">
        <p>@ 2023, Anass&Zakaria</p>
      </div>
    </footer>
  );
};

export default Footer;
