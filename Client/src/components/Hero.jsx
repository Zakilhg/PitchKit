import { Link } from "react-router-dom";
import hero from "../css/hero.module.css";
import { assetUrl } from "../lib/api";

// Product shots that ship with the catalog seeder and the demo build.
const PHOTOS = [
  { file: "barca1.jpg", label: "FC Barcelona home" },
  { file: "liverpool-1.jpg", label: "Liverpool home" },
  { file: "REAL-MADRIR1jpg.jpg", label: "Real Madrid home" },
];

const Hero = () => {
  return (
    <section className={hero.hero} aria-labelledby="hero-title">
      <div className={`container ${hero.inner}`}>
        <div className={hero.content}>
          <p className={hero.kicker}>This season&apos;s kits</p>
          <h1 id="hero-title" className={hero.title}>
            Wear your club&apos;s colours.
          </h1>
          <p className={hero.lead}>
            Home and away jerseys from the Premier League, La Liga, Serie A,
            Bundesliga and Ligue 1, in every size from S to XL.
          </p>
          <div className={hero.actions}>
            <Link to="/shop" className="btn btn-light">
              Shop all jerseys
            </Link>
            <Link to="/#new" className="btn btn-outline-light">
              See what&apos;s new
            </Link>
          </div>
        </div>

        <div className={hero.collage} aria-hidden="true">
          {PHOTOS.map((photo, index) => (
            <figure className={hero.photo} key={photo.file}>
              <img
                src={assetUrl(`images/${photo.file}`)}
                alt=""
                width="400"
                height="500"
                fetchPriority={index === 0 ? "high" : undefined}
              />
              <figcaption>{photo.label}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
