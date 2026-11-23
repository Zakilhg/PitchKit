import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import Hero from "./components/Hero";
import Features from "./components/Features";
import ProductGrid from "./components/Product";
import useFetch from "./hooks/useFetch";
import { apiUrl } from "./lib/api";
import home from "./css/home.module.css";

const Home = () => {
  const { data, isLoading, error } = useFetch(apiUrl("jerseys"));
  const jerseys = data?.data || [];

  // Leagues that actually have jerseys, with how many.
  const leagues = Object.entries(
    jerseys.reduce((counts, jersey) => {
      if (jersey.league_name) {
        counts[jersey.league_name] = (counts[jersey.league_name] || 0) + 1;
      }
      return counts;
    }, {}),
  );

  return (
    <main>
      <Hero />

      <section className="section container" id="new" aria-labelledby="new-title">
        <div className="section-head">
          <div>
            <p className="eyebrow">Just landed</p>
            <h2 id="new-title">New this season</h2>
            <p>The latest home and away kits, straight from the clubs.</p>
          </div>
          <Link to="/shop" className="btn btn-outline">
            View all <FiArrowRight aria-hidden="true" />
          </Link>
        </div>
        <ProductGrid
          products={jerseys.slice(0, 8)}
          isLoading={isLoading}
          error={error}
          label="New jerseys"
        />
      </section>

      {leagues.length > 0 && (
        <section className={home.leagues} aria-labelledby="leagues-title">
          <div className="container">
            <div className="section-head">
              <div>
                <p className="eyebrow">Shop by league</p>
                <h2 id="leagues-title">Find your competition</h2>
              </div>
            </div>
            <ul className={home.leagueList}>
              {leagues.map(([name, count]) => (
                <li key={name}>
                  <Link
                    className={home.league}
                    to={`/shop?league=${encodeURIComponent(name)}`}
                  >
                    <span className={home.leagueName}>{name}</span>
                    <span className={home.leagueCount}>
                      {count} {count === 1 ? "jersey" : "jerseys"}
                    </span>
                    <FiArrowRight className={home.leagueArrow} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <Features />
    </main>
  );
};

export default Home;
