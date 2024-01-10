import React, { useState } from "react";
import product from "../css/product.module.css";
import { Link } from "react-router-dom";

const Product = ({ products }) => {
  const [favoriteProducts, setFavoriteProducts] = useState([]);

  const handleClick = (index) => {
    setFavoriteProducts((prevFavoriteProducts) => {
      const updatedFavoriteProducts = [...prevFavoriteProducts];
      updatedFavoriteProducts[index] = !updatedFavoriteProducts[index];
      return updatedFavoriteProducts;
    });
  };

  return (
    <>
      {products.map((item, index) => (
        <div className={product.product__card_container} key={index}>
          <div className={product.card}>
            <div className={`${product.image__container}`}>
              <Link to={`p/${item.id}`}>
                <img
                  src={`http://127.0.0.1:8000/images/${item.image}`}
                  className={product.img}
                  alt="CardImage"
                />

                <div className={product.overlay}>
                  <button className={product.addToBagBtn}>Add to Cart</button>
                </div>
              </Link>
            </div>
            <div className={product.card_body}>
              <h5 className={product.card_title}>{item.name}</h5>
              <p className={product.card_text_muted}>Football jersey</p>
              <p className={product.card_text}>{item.price} $</p>
              <button
                className={product.heart_btn}
                onClick={() => handleClick(index)}
              >
                <i
                  className={`fa-heart ${
                    favoriteProducts[index] ? "fa-solid" : "fa-regular"
                  }`}
                  style={{ color: favoriteProducts[index] ? "red" : "" }}
                ></i>
              </button>
            </div>
            <img
              src={`http://127.0.0.1:8000/images/${item.brand_image}`}
              className={product.small_icon}
              id="brand"
              alt="Icon"
            />
          </div>
        </div>
      ))}

      {!products.length &&
        [1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <>
            <ProductSkeleton key={n} />
          </>
        ))}
    </>
  );
};

export const ProductSkeleton = () => {
  return (
    <div className={product.product__card_container}>
      <div className={product.card}>
        <div
          className={`${product.image__container} ${product.skeleton}`}
        ></div>
        <div className={product.card_body}>
          <div className={`${product.card_title} ${product.skeleton}`}></div>
          <div
            className={`${product.card_text_muted} ${product.skeleton}`}
          ></div>
          <div className={`${product.card_text} ${product.skeleton}`}></div>
          <div className={`${product.heart_btn} ${product.skeleton}`}></div>
        </div>
        <div className={product.small_icon}></div>
      </div>
    </div>
  );
};

export default Product;
