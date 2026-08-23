import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import detail from "../css/detail.module.css";
import useFetch from "../hooks/useFetch";
import { apiUrl, assetUrl } from "../lib/api";
import { addCartItem } from "../lib/cart";
import { formatCurrency } from "../lib/format";

const AVAILABLE_SIZES = ["S", "M", "L", "XL"];

const ProductDetail = () => {
  const { id } = useParams();
  const [selectedSize, setSelectedSize] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const productUrl = id ? apiUrl(`jerseys/${encodeURIComponent(id)}`) : null;
  const {
    data: response,
    isLoading,
    error,
  } = useFetch(productUrl);
  const jersey = response?.data;

  if (isLoading) {
    return (
      <main className={detail.status} aria-busy="true">
        <div className={detail.status__placeholder} />
        <p>Loading jersey details…</p>
      </main>
    );
  }

  if (error || !jersey) {
    return (
      <main className={detail.status} role="alert">
        <h2>We could not load this jersey.</h2>
        <p>Please return to the collection and try again.</p>
        <Link to="/">Back to the collection</Link>
      </main>
    );
  }

  const images = jersey.images?.length
    ? jersey.images
    : [jersey.image, jersey.image1, jersey.image2].filter(Boolean);
  const isOutOfStock = Number(jersey.quantity) <= 0;

  const handleAddToCart = () => {
    if (!selectedSize || isOutOfStock) return;

    addCartItem({ productId: jersey.id, size: selectedSize });
    setConfirmation(`${jersey.name}, size ${selectedSize}, was added to your bag.`);
  };

  return (
    <main className={detail.container}>
      <section className={detail.image__carousel} aria-label="Product images">
        {images.map((image, index) => (
          <div className={detail.image__wrapper} key={image}>
            <img
              src={assetUrl(`images/${image}`)}
              alt={`${jersey.name}, view ${index + 1}`}
            />
          </div>
        ))}
      </section>

      <section className={detail.content__wrapper}>
        {jersey.brand_image && (
          <div className={detail.brand}>
            <img
              src={assetUrl(`images/${jersey.brand_image}`)}
              alt={`${jersey.brand_name || "Jersey"} brand`}
            />
          </div>
        )}

        <div className={detail.content}>
          <header className={detail.header}>
            <p className={detail.eyebrow}>
              {[jersey.club_name, jersey.league_name].filter(Boolean).join(" · ") ||
                "Football jersey"}
            </p>
            <h1 className={detail.title}>{jersey.name}</h1>
            <div className={detail.desc}>
              <p className={detail.category}>
                {jersey.brand_name || "Official-style football kit"}
              </p>
              <p className={isOutOfStock ? detail.outOfStock : detail.inStock}>
                {isOutOfStock ? "Out of stock" : `${jersey.quantity} available`}
              </p>
            </div>
            <p className={detail.price}>{formatCurrency(jersey.price)}</p>
          </header>

          <fieldset className={detail.size} disabled={isOutOfStock}>
            <legend className={detail.size__head}>
              Select size <span>Required</span>
            </legend>
            <div className={detail.size__wrapper}>
              {AVAILABLE_SIZES.map((size) => (
                <label
                  className={`${detail.size__box} ${
                    selectedSize === size ? detail.active : ""
                  }`}
                  htmlFor={`size-${size}`}
                  key={size}
                >
                  <input
                    type="radio"
                    name="size"
                    value={size}
                    id={`size-${size}`}
                    checked={selectedSize === size}
                    onChange={(event) => {
                      setSelectedSize(event.target.value);
                      setConfirmation("");
                    }}
                  />
                  <span>{size}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className={detail.btn__wrapper}>
            <button
              type="button"
              className={detail.add__cart}
              onClick={handleAddToCart}
              disabled={!selectedSize || isOutOfStock}
            >
              {isOutOfStock ? "Out of stock" : "Add to bag"}
            </button>
            <Link className={detail.continueShopping} to="/">
              Continue shopping
            </Link>
          </div>

          <p className={detail.confirmation} aria-live="polite">
            {confirmation}
          </p>
        </div>
      </section>
    </main>
  );
};

export default ProductDetail;
