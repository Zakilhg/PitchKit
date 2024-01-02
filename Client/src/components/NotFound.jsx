import React from "react";
import { Link } from "react-router-dom";
import notFound from "../css/notFound.module.css";

const NotFound = () => {
  return (
    <div className={notFound.container}>
      <h2 className={notFound.title}>404</h2>
      <p>Oops! Page not found</p>
      <p>Something went wrong. Please try again...</p>
      <Link to={"/"}>
        <button className={notFound.btn}>Back To Homepage</button>
      </Link>
    </div>
  );
};

export default NotFound;
