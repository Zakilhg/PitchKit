import { Link } from "react-router-dom";
import { FiMinus, FiPlus, FiShoppingBag, FiTrash2 } from "react-icons/fi";
import useFetch from "../hooks/useFetch";
import { apiUrl, assetUrl, DEMO_MODE } from "../lib/api";
import { removeCartItem, setCartItemQuantity, useCart } from "../lib/cart";
import { formatCurrency } from "../lib/format";
import bag from "../css/bag.module.css";

const FREE_SHIPPING_FROM = 100;
const SHIPPING = 7.5;

const Bag = () => {
  const cart = useCart();
  const { data, isLoading, error } = useFetch(cart.length ? apiUrl("jerseys") : null);
  const jerseys = data?.data || [];

  const lines = cart
    .map((item) => ({
      ...item,
      jersey: jerseys.find((jersey) => jersey.id === item.productId),
    }))
    .filter((line) => line.jersey);

  const subtotal = lines.reduce(
    (total, line) => total + Number(line.jersey.price) * line.quantity,
    0,
  );
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING;

  if (!cart.length) {
    return (
      <main className={`container ${bag.empty}`}>
        <span className={bag.emptyIcon} aria-hidden="true">
          <FiShoppingBag />
        </span>
        <h1>Your bag is empty</h1>
        <p>Find your club&apos;s jersey and it will show up here.</p>
        <Link to="/shop" className="btn btn-primary">
          Shop jerseys
        </Link>
      </main>
    );
  }

  return (
    <main className={`container ${bag.page}`}>
      <h1 className={bag.title}>Your bag</h1>

      {error && (
        <p className="status-message" role="alert">
          We could not load your bag. Refresh the page to try again.
        </p>
      )}
      {isLoading && <p className="status-message">Loading your bag…</p>}

      {!isLoading && !error && (
        <div className={bag.layout}>
          <ul className={bag.lines}>
            {lines.map(({ jersey, size, quantity, productId }) => (
              <li className={bag.line} key={`${productId}-${size}`}>
                <img
                  src={assetUrl(`images/${jersey.image}`)}
                  alt=""
                  width="96"
                  height="120"
                />
                <div className={bag.info}>
                  <Link to={`/p/${jersey.id}`} className={bag.name}>
                    {jersey.name}
                  </Link>
                  <p className={bag.meta}>Size {size}</p>
                  <div className={bag.stepper}>
                    <button
                      type="button"
                      aria-label={`Decrease quantity of ${jersey.name}`}
                      onClick={() =>
                        setCartItemQuantity({ productId, size }, quantity - 1)
                      }
                    >
                      <FiMinus aria-hidden="true" />
                    </button>
                    <span aria-live="polite">{quantity}</span>
                    <button
                      type="button"
                      aria-label={`Increase quantity of ${jersey.name}`}
                      disabled={quantity >= Number(jersey.quantity)}
                      onClick={() =>
                        setCartItemQuantity({ productId, size }, quantity + 1)
                      }
                    >
                      <FiPlus aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <div className={bag.right}>
                  <p className={bag.price}>
                    {formatCurrency(Number(jersey.price) * quantity)}
                  </p>
                  <button
                    type="button"
                    className={bag.remove}
                    onClick={() => removeCartItem({ productId, size })}
                  >
                    <FiTrash2 aria-hidden="true" /> Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <aside className={bag.summary} aria-labelledby="summary-title">
            <h2 id="summary-title">Order summary</h2>
            <dl>
              <div>
                <dt>Subtotal</dt>
                <dd>{formatCurrency(subtotal)}</dd>
              </div>
              <div>
                <dt>Shipping</dt>
                <dd>{shipping ? formatCurrency(shipping) : "Free"}</dd>
              </div>
              <div className={bag.total}>
                <dt>Total</dt>
                <dd>{formatCurrency(subtotal + shipping)}</dd>
              </div>
            </dl>
            {shipping > 0 && (
              <p className={bag.hint}>
                Add {formatCurrency(FREE_SHIPPING_FROM - subtotal)} more for free
                shipping.
              </p>
            )}
            <button type="button" className={`btn btn-primary ${bag.checkout}`} disabled>
              Checkout
            </button>
            <p className={bag.hint}>
              {DEMO_MODE
                ? "Checkout is turned off in this demo."
                : "Checkout isn't available yet."}
            </p>
          </aside>
        </div>
      )}
    </main>
  );
};

export default Bag;
