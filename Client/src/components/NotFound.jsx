import { Link } from "react-router-dom";
import notFound from "../css/notFound.module.css";

const NotFound = () => {
  return (
    <main className={`container ${notFound.page}`}>
      <p className={notFound.code} aria-hidden="true">
        404
      </p>
      <h1>This page is offside</h1>
      <p>The page you were looking for doesn&apos;t exist or has moved.</p>
      <div className={notFound.actions}>
        <Link to="/" className="btn btn-primary">
          Go to the homepage
        </Link>
        <Link to="/shop" className="btn btn-outline">
          Shop jerseys
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
