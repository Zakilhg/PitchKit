import Product from "./Product";
import popular from "../css/popular.module.css";
import useFetch from "../hooks/useFetch";
import { apiUrl } from "../lib/api";

const Popular = () => {
  const {
    data: products,
    isLoading,
    error,
  } = useFetch(apiUrl("jersey"));
  const jerseys = products || [];
  return (
    <section className={popular.container}>
      <h2>Popular For You </h2>
      <div className={popular.product__list}>
        <Product
          products={jerseys.slice(10, 18)}
          className={popular.product}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </section>
  );
};

export default Popular;
