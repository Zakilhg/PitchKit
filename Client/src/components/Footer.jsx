import { Link } from "react-router-dom";
import footer from "../css/footer.module.css";

const Footer = () => {
  return (
    <footer className={footer.footer}>
      <div className={`container ${footer.grid}`}>
        <div className={footer.brand}>
          <Link to="/" className={footer.logo}>
            PitchKit
          </Link>
          <p>
            Club jerseys from Europe&apos;s top leagues, picked for fans who wear
            their colours every matchday.
          </p>
        </div>

        <nav className={footer.column} aria-label="Shop">
          <h2>Shop</h2>
          <ul>
            <li>
              <Link to="/shop">All jerseys</Link>
            </li>
            <li>
              <Link to="/#new">New this season</Link>
            </li>
            <li>
              <Link to="/bag">Your bag</Link>
            </li>
          </ul>
        </nav>

        <nav className={footer.column} aria-label="Account">
          <h2>Account</h2>
          <ul>
            <li>
              <Link to="/login">Log in</Link>
            </li>
            <li>
              <Link to="/register">Create account</Link>
            </li>
          </ul>
        </nav>

        <nav className={footer.column} aria-label="About">
          <h2>About</h2>
          <ul>
            <li>
              <a href="https://github.com/Zakilhg/PitchKit">Source code</a>
            </li>
          </ul>
        </nav>
      </div>

      <div className={`container ${footer.bottom}`}>
        <p>© PitchKit · Zakaria Lahgaz &amp; AitTamaldou</p>
        <p>A portfolio project. No real orders are taken.</p>
      </div>
    </footer>
  );
};

export default Footer;
