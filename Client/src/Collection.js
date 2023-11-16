import React, { useRef } from "react";
import "./collection.css";
import Product from "./Components/Product";

const Collection = () => {
  const scrollContainerRef = useRef(null);

  const scrollRight = () => {
    scrollContainerRef.current.scrollBy({
      left: -200,
      behavior: "smooth",
    });
  };

  const scrollLeft = () => {
    scrollContainerRef.current.scrollBy({
      left: 200,
      behavior: "smooth",
    });
  };
  return (
    <>
      <div className="collection">
        <div className="slider">
          <h1 className="collection-title">Our New Collection </h1>
          <div className="collection-description">
            <p className="text-muted slogan">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </p>
          </div>
          <div className="horizontal-scroll">
            <button className="next" onClick={scrollRight}>
              <i className="fas fa-arrow-left"></i>
            </button>
            <button className="previous" onClick={scrollLeft}>
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
        <Product scroll={scrollContainerRef} />
      </div>
    </>
  );
};

export default Collection;
