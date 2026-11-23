import { useRef } from "react";
import collection from "../css/collection.module.css";
import Product from "./Product";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import useFetch from "../hooks/useFetch";
import { apiUrl } from "../lib/api";

const Collection = () => {
  const {
    data: products,
    isLoading,
    error,
  } = useFetch(apiUrl("jerseys"));
  const jerseys = products?.data || [];
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
              This season's kits from Europe's top leagues.
            </p>
          </div>
          <div className={collection.horizontal_scroll}>
            <button
              type="button"
              className={collection.next}
              onClick={scrollRight}
              aria-label="View previous jerseys"
            >
              <FaArrowLeft aria-hidden="true" />
            </button>
            <button
              type="button"
              className={collection.previous}
              onClick={scrollLeft}
              aria-label="View next jerseys"
            >
              <FaArrowRight aria-hidden="true" />
            </button>
          </div>
        </div>
        <section
          className={collection.product__container}
          ref={scrollContainerRef}
        >
          <Product
            scroll={scrollContainerRef}
            products={jerseys.slice(0, 6)}
            isLoading={isLoading}
            error={error}
          />
        </section>
      </div>
    </>
  );
};

export default Collection;
