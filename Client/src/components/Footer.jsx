import { Link } from "react-router-dom";
import footer from "../css/footer.module.css";

const Footer = () => {
  return (
    <footer className={footer.container}>
      <div className={footer.wrapper}>
        <div className={footer.title}>
          <Link to="/">PitchKit.</Link>
        </div>

        <div className={footer.menu}>
          <div className={footer.item}>
            <h5 className={footer.menu_title}>Shop</h5>
            <ul>
              <li>
                <Link to="/">New Collection</Link>
              </li>
            </ul>
          </div>
          <div className={footer.item}>
            <h5 className={footer.menu_title}>Account</h5>
            <ul>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </ul>
          </div>
          <div className={footer.item}>
            <h5 className={footer.menu_title}>About</h5>
            <ul>
              <li>
                <a href="https://github.com/Zakilhg/PitchKit">Source code</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className={footer.copyright}>
        <p>© PitchKit · Zakaria Lahgaz &amp; AitTamaldou</p>
      </div>
    </footer>
  );
};

export default Footer;
