import React from "react";
import "./popular.css";
import Populaire from "./Populaire";
const Popular = () => {
  return (
    <>
      <div className="Popular">
        <div className="popular-title">
          <h2>Popular For You </h2>
        </div>
        <div className="product-filter">
          <div className="product-filter-1"></div>
          <div className="product-filter-2"></div>
        </div>
        <div className="product-popular">
          <Populaire />
        </div>
      </div>
    </>
  );
};

export default Popular;
