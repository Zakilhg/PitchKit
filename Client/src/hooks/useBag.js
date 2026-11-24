import useJerseys from "./useJerseys";
import { useCart } from "@/lib/cart";

export const FREE_SHIPPING_FROM = 100;
export const SHIPPING = 7.5;

/** The bag joined with the catalog, plus totals. */
const useBag = () => {
  const cart = useCart();
  const { jerseys, data, isLoading, error } = useJerseys(cart.length > 0);

  const lines = cart
    .map((item) => ({ ...item, jersey: jerseys.find((jersey) => jersey.id === item.productId) }))
    .filter((line) => line.jersey);
  // Only call items unavailable once the catalog has actually loaded.
  const unavailable = data
    ? cart.filter((item) => !jerseys.some((jersey) => jersey.id === item.productId))
    : [];

  const subtotal = lines.reduce(
    (total, line) => total + Number(line.jersey.price) * line.quantity,
    0,
  );
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING;
  const count = cart.reduce((total, item) => total + item.quantity, 0);

  return {
    cart,
    lines,
    unavailable,
    subtotal,
    shipping,
    total: subtotal + shipping,
    count,
    isLoading: cart.length > 0 && isLoading,
    error,
  };
};

export default useBag;
