import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import product from "../css/product.module.css";
import { assetUrl } from "../lib/api";
import { toggleFavorite, useFavorites } from "../lib/cart";
import { formatCurrency } from "../lib/format";

const LOW_STOCK = 10;

export const ProductCard = ({ item }) => {
  const favorites = useFavorites();
  const isFavorite = favorites.includes(item.id);
  const quantity = Number(item.quantity);
  const isOutOfStock = quantity <= 0;
  const subtitle = [item.club_name, item.league_name].filter(Boolean).join(" · ");

  return (
    <li className={product.card}>
      <div className={product.media}>
        <img
          src={assetUrl(`images/${item.image}`)}
          alt=""
          loading="lazy"
          width="400"
          height="500"
          className={isOutOfStock ? product.faded : undefined}
        />
        {isOutOfStock ? (
          <span className={`${product.tag} ${product.tagMuted}`}>Sold out</span>
        ) : (
          quantity <= LOW_STOCK && (
            <span className={product.tag}>Only {quantity} left</span>
          )
        )}
        {item.brand_image && (
          <img
            src={assetUrl(`images/${item.brand_image}`)}
            className={product.brand}
            alt={item.brand_name ? `${item.brand_name}` : ""}
            loading="lazy"
            width="32"
            height="32"
          />
        )}
      </div>

      <div className={product.body}>
        <h3 className={product.title}>
          {/* The whole card is clickable through this link's ::after. */}
          <Link to={`/p/${item.id}`} className={product.link}>
            {item.name}
          </Link>
        </h3>
        {subtitle && <p className={product.meta}>{subtitle}</p>}
        <p className={product.price}>{formatCurrency(item.price)}</p>
      </div>

      <button
        type="button"
        className={`${product.favorite} ${isFavorite ? product.favoriteOn : ""}`}
        onClick={() => toggleFavorite(item.id)}
        aria-pressed={isFavorite}
        aria-label={`Save ${item.name} to favorites`}
      >
        {isFavorite ? <FaHeart aria-hidden="true" /> : <FaRegHeart aria-hidden="true" />}
      </button>
    </li>
  );
};

const ProductSkeleton = () => (
  <li className={product.card} aria-hidden="true">
    <div className={`${product.media} ${product.skeleton}`} />
    <div className={product.body}>
      <div className={`${product.skeletonLine} ${product.skeleton}`} />
      <div className={`${product.skeletonLine} ${product.skeletonShort} ${product.skeleton}`} />
    </div>
  </li>
);

const ProductGrid = ({
  products = [],
  isLoading = false,
  error = null,
  skeletonCount = 8,
  emptyMessage = "No jerseys are available right now.",
  label,
}) => {
  if (error) {
    return (
      <p className="status-message" role="alert">
        We could not load the jerseys. Check your connection and refresh the page.
      </p>
    );
  }

  if (isLoading) {
    return (
      <ul className="product-grid" aria-busy="true" aria-label={label}>
        {Array.from({ length: skeletonCount }, (_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </ul>
    );
  }

  if (!products.length) {
    return <p className="status-message">{emptyMessage}</p>;
  }

  return (
    <ul className="product-grid" aria-label={label}>
      {products.map((item) => (
        <ProductCard item={item} key={item.id} />
      ))}
    </ul>
  );
};

export default ProductGrid;
