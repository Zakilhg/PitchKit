import React from "react";
import Product from "./Product";
import popular from "../css/popular.module.css";
import useFetch from "../hooks/useFetch";

const Popular = () => {
  const [products] = useFetch("http://127.0.0.1:8000/api/jersey");
  return (
    <section className={popular.container}>
      <h2>Popular For You </h2>
      <div className={popular.product__list}>
        <Product
          products={products.slice(10, 18)}
          className={popular.product}
        />
      </div>
    </section>
  );
};

export default Popular;
