const CART_STORAGE_KEY = "pitchkit.cart";

const readCart = () => {
  try {
    const storedCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
    return Array.isArray(storedCart) ? storedCart : [];
  } catch {
    return [];
  }
};

export const addCartItem = ({ productId, size }) => {
  const cart = readCart();
  const existingItem = cart.find(
    (item) => item.productId === productId && item.size === size,
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ productId, size, quantity: 1 });
  }

  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent("pitchkit:cart-updated", { detail: cart }));

  return cart;
};
