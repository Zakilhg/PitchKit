import { useState } from "react";
import product from "../css/product.module.css";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { assetUrl } from "../lib/api";
import { formatCurrency } from "../lib/format";

const SKELETON_COUNT = 6;

const Product = ({ products = [], isLoading = false, error = null }) => {
  const [favoriteProductIds, setFavoriteProductIds] = useState(() => new Set());

  const toggleFavorite = (productId) => {
    setFavoriteProductIds((currentIds) => {
      const nextIds = new Set(currentIds);

      if (nextIds.has(productId)) {
        nextIds.delete(productId);
      } else {
        nextIds.add(productId);
      }

      return nextIds;
    });
  };

  if (error) {
    return (
      <p className={product.status} role="alert">
        We could not load the jerseys. Please try again.
      </p>
    );
  }

  if (isLoading) {
    return Array.from({ length: SKELETON_COUNT }, (_, index) => (
      <ProductSkeleton key={index} />
    ));
  }

  if (!products.length) {
    return <p className={product.status}>No jerseys are available right now.</p>;
  }

  return (
    <>
      {products.map((item) => {
        const isFavorite = favoriteProductIds.has(item.id);

        return (
          <article className={product.product__card_container} key={item.id}>
            <div className={product.card}>
              <div className={product.image__container}>
                <Link
                  to={`/p/${item.id}`}
                  aria-label={`View ${item.name}`}
                  className={product.product__link}
                >
                  <img
                    src={assetUrl(`images/${item.image}`)}
                    className={product.img}
                    alt={item.name}
                    loading="lazy"
                  />

                  <div className={product.overlay}>
                    <span className={product.addToBagBtn}>View jersey</span>
                  </div>
                </Link>
              </div>
              <div className={product.card_body}>
                <h5 className={product.card_title}>{item.name}</h5>
                <p className={product.card_text_muted}>Football jersey</p>
                <p className={product.card_text}>{formatCurrency(item.price)}</p>
                <button
                  type="button"
                  className={product.heart_btn}
                  onClick={() => toggleFavorite(item.id)}
                  aria-pressed={isFavorite}
                  aria-label={`${isFavorite ? "Remove" : "Add"} ${item.name} ${
                    isFavorite ? "from" : "to"
                  } favorites`}
                >
                  {isFavorite ? (
                    <FaHeart aria-hidden="true" />
                  ) : (
                    <FaRegHeart aria-hidden="true" />
                  )}
                </button>
              </div>
              {item.brand_image && (
                <img
                  src={assetUrl(`images/${item.brand_image}`)}
                  className={product.small_icon}
                  alt=""
                  loading="lazy"
                />
              )}
            </div>
          </article>
        );
      })}
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
