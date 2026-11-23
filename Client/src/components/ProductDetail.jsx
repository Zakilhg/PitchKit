import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FiCheckCircle, FiChevronRight, FiRefreshCw, FiTruck } from "react-icons/fi";
import detail from "../css/detail.module.css";
import useFetch from "../hooks/useFetch";
import { apiUrl, assetUrl } from "../lib/api";
import { addCartItem, toggleFavorite, useFavorites } from "../lib/cart";
import { formatCurrency } from "../lib/format";

const AVAILABLE_SIZES = ["S", "M", "L", "XL"];

const ProductDetail = () => {
  const { id } = useParams();
  const [selectedSize, setSelectedSize] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [confirmation, setConfirmation] = useState("");
  const [sizeError, setSizeError] = useState(false);
  const favorites = useFavorites();
  const productUrl = id ? apiUrl(`jerseys/${encodeURIComponent(id)}`) : null;
  const { data: response, isLoading, error } = useFetch(productUrl);
  const jersey = response?.data;

  if (isLoading) {
    return (
      <main className={`container ${detail.page}`} aria-busy="true">
        <div className={detail.layout}>
          <div className={`${detail.mainImage} ${detail.skeleton}`} />
          <div>
            <div className={`${detail.skeletonLine} ${detail.skeleton}`} />
            <div className={`${detail.skeletonLine} ${detail.skeletonWide} ${detail.skeleton}`} />
            <p className="visually-hidden">Loading jersey details…</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !jersey) {
    return (
      <main className={`container ${detail.missing}`}>
        <h1>We couldn&apos;t find this jersey</h1>
        <p>It may have been removed from the store.</p>
        <Link to="/shop" className="btn btn-primary">
          Back to the shop
        </Link>
      </main>
    );
  }

  const images = jersey.images?.length
    ? jersey.images
    : [jersey.image, jersey.image1, jersey.image2].filter(Boolean);
  const quantity = Number(jersey.quantity);
  const isOutOfStock = quantity <= 0;
  const isFavorite = favorites.includes(jersey.id);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    if (!selectedSize) {
      setSizeError(true);
      return;
    }

    addCartItem({ productId: jersey.id, size: selectedSize });
    setConfirmation(`Added ${jersey.name}, size ${selectedSize}, to your bag.`);
  };

  return (
    <main className={`container ${detail.page}`}>
      <nav aria-label="Breadcrumb">
        <ol className={detail.breadcrumb}>
          <li>
            <Link to="/shop">Shop</Link>
            <FiChevronRight aria-hidden="true" />
          </li>
          {jersey.league_name && (
            <li>
              <Link to={`/shop?league=${encodeURIComponent(jersey.league_name)}`}>
                {jersey.league_name}
              </Link>
              <FiChevronRight aria-hidden="true" />
            </li>
          )}
          <li aria-current="page">{jersey.name}</li>
        </ol>
      </nav>

      <div className={detail.layout}>
        <section className={detail.gallery} aria-label="Product images">
          <div className={detail.mainImage}>
            <img
              src={assetUrl(`images/${images[activeImage] || images[0]}`)}
              alt={`${jersey.name}, view ${activeImage + 1} of ${images.length}`}
              width="800"
              height="1000"
            />
          </div>
          {images.length > 1 && (
            <div className={detail.thumbs}>
              {images.map((image, index) => (
                <button
                  type="button"
                  key={image}
                  className={`${detail.thumb} ${index === activeImage ? detail.thumbOn : ""}`}
                  onClick={() => setActiveImage(index)}
                  aria-label={`Show view ${index + 1}`}
                  aria-pressed={index === activeImage}
                >
                  <img src={assetUrl(`images/${image}`)} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </section>

        <section className={detail.info}>
          <div className={detail.top}>
            <p className="eyebrow">
              {[jersey.club_name, jersey.league_name].filter(Boolean).join(" · ") ||
                "Football jersey"}
            </p>
            {jersey.brand_image && (
              <img
                className={detail.brand}
                src={assetUrl(`images/${jersey.brand_image}`)}
                alt={jersey.brand_name || ""}
                width="40"
                height="40"
              />
            )}
          </div>
          <h1 className={detail.title}>{jersey.name}</h1>
          <p className={detail.price}>{formatCurrency(jersey.price)}</p>
          <p
            className={`${detail.stock} ${
              isOutOfStock ? detail.stockOut : quantity <= 10 ? detail.stockLow : ""
            }`}
          >
            {isOutOfStock
              ? "Sold out"
              : quantity <= 10
                ? `Only ${quantity} left in stock`
                : "In stock"}
          </p>

          {jersey.description && <p className={detail.description}>{jersey.description}</p>}

          <fieldset
            className={detail.sizes}
            disabled={isOutOfStock}
            aria-describedby={sizeError ? "size-error" : undefined}
          >
            <legend>Size</legend>
            <div className={detail.sizeGrid}>
              {AVAILABLE_SIZES.map((size) => (
                <label
                  className={`${detail.size} ${selectedSize === size ? detail.sizeOn : ""}`}
                  key={size}
                >
                  <input
                    type="radio"
                    name="size"
                    value={size}
                    checked={selectedSize === size}
                    onChange={(event) => {
                      setSelectedSize(event.target.value);
                      setSizeError(false);
                      setConfirmation("");
                    }}
                  />
                  {size}
                </label>
              ))}
            </div>
            {sizeError && (
              <p id="size-error" className={detail.error} role="alert">
                Choose a size first.
              </p>
            )}
          </fieldset>

          <div className={detail.buttons}>
            <button
              type="button"
              className={`btn btn-primary ${detail.addButton}`}
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              {isOutOfStock ? "Sold out" : "Add to bag"}
            </button>
            <button
              type="button"
              className={`${detail.favorite} ${isFavorite ? detail.favoriteOn : ""}`}
              onClick={() => toggleFavorite(jersey.id)}
              aria-pressed={isFavorite}
              aria-label="Save to favorites"
            >
              {isFavorite ? <FaHeart aria-hidden="true" /> : <FaRegHeart aria-hidden="true" />}
            </button>
          </div>

          <div aria-live="polite">
            {confirmation && (
              <p className={detail.confirmation}>
                <FiCheckCircle aria-hidden="true" />
                <span>
                  {confirmation}{" "}
                  <Link to="/bag" className="link">
                    View bag
                  </Link>
                </span>
              </p>
            )}
          </div>

          <ul className={detail.perks}>
            <li>
              <FiTruck aria-hidden="true" /> Free shipping on orders over $100
            </li>
            <li>
              <FiRefreshCw aria-hidden="true" /> Free returns within 30 days
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
};

export default ProductDetail;
