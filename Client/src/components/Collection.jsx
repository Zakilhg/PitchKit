import React, { useRef } from "react";
import collection from "../css/collection.module.css";
import Product from "./Product";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import useFetch from "../hooks/useFetch";

const Collection = () => {
  const [products] = useFetch("http://127.0.0.1:8000/api/jersey");
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
      <div className={collection.collection}>
        <div className={collection.slider}>
          <h1 className={collection.collection_title}>Our New Collection </h1>
          <div className={collection.collection_description}>
            <p className="text-muted slogan">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </p>
          </div>
          <div className={collection.horizontal_scroll}>
            <button className={collection.next} onClick={scrollRight}>
              <FaArrowLeft />
            </button>
            <button className={collection.previous} onClick={scrollLeft}>
              <FaArrowRight />
            </button>
          </div>
        </div>
        <section
          className={collection.product__container}
          ref={scrollContainerRef}
        >
          <Product
            scroll={scrollContainerRef}
            products={products.slice(0, 6)}
          />
        </section>
      </div>
    </>
  );
};

export default Collection;
