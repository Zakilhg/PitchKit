import React from "react";
import product from "../css/product.module.css";

const SkeletonLoading = ({ products }) => {
  return (
    <section className={product.product__container_Skelton} ref={scroll}>
      {products?.map((item, index) => (
        <div className={product.product__card_container_Skelton} key={index}>
          <div className={product.card_Skelton}>
            <div className={product.image__container_Skelton}>
              <div className={product.overlay}></div>
            </div>
            <div className={product.card_body_Skelton}></div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default SkeletonLoading;
