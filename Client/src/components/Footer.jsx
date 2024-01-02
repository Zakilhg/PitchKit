import React from "react";
import footer from "../css/footer.module.css";

const Footer = () => {
  return (
    <footer className={footer.container}>
      <div className={footer.wrapper}>
        <div className={footer.title}>
          <a href="/">PitchKit.</a>
        </div>

        <div className={footer.menu}>
          <div className={footer.item}>
            <h5 className={footer.menu_title}>Shop Online</h5>
            <ul>
              <li>
                <a href="/">New Collection</a>
              </li>
              <li>
                <a href="/">Categories</a>
              </li>
              <li>
                <a href="/">Gallery</a>
              </li>
            </ul>
          </div>
          <div className={footer.item}>
            <h5 className={footer.menu_title}>Services</h5>
            <ul>
              <li>
                <a href="/">Interior Design</a>
              </li>
              <li>
                <a href="/">Interior Design</a>
              </li>
              <li>
                <a href="/">Product Design</a>
              </li>
            </ul>
          </div>
          <div className={footer.item}>
            <h5 className={footer.menu_title}>About</h5>
            <ul>
              <li>
                <a href="/">Contact Us</a>
              </li>
              <li>
                <a href="/">Stories</a>
              </li>
              <li>
                <a href="/">FAQ</a>
              </li>
            </ul>
          </div>
        </div>

        <div className={footer.social}>
          <a href="/">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="/">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="/">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="/">
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div>
      </div>

      <div className={footer.copyright}>
        <p>@ Zakaria Lahgaz</p>
      </div>
    </footer>
  );
};

export default Footer;
