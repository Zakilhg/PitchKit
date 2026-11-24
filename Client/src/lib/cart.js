import { useSyncExternalStore } from "react";

const CART_STORAGE_KEY = "pitchkit.cart";
const FAVORITES_STORAGE_KEY = "pitchkit.favorites";
const CHANGE_EVENT = "pitchkit:storage-updated";

const readList = (key) => {
  try {
    const stored = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
};

const writeList = (key, list) => {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch {
    // Storage can be unavailable (private mode); the UI still updates.
  }
  snapshots.delete(key);
  window.dispatchEvent(new Event(CHANGE_EVENT));
};

// useSyncExternalStore needs a stable snapshot between changes.
const snapshots = new Map();
const getSnapshot = (key) => {
  if (!snapshots.has(key)) snapshots.set(key, readList(key));
  return snapshots.get(key);
};

const subscribe = (callback) => {
  const onStorage = (event) => {
    if (event.type === "storage") snapshots.clear();
    callback();
  };
  window.addEventListener(CHANGE_EVENT, onStorage);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onStorage);
    window.removeEventListener("storage", onStorage);
  };
};

/* Bag */

export const readCart = () => getSnapshot(CART_STORAGE_KEY);

/** Adds one; returns false (and changes nothing) if the bag already holds `max`. */
export const addCartItem = ({ productId, size, max = Infinity }) => {
  const cart = readList(CART_STORAGE_KEY);
  const existingItem = cart.find(
    (item) => item.productId === productId && item.size === size,
  );

  if ((existingItem?.quantity ?? 0) >= max) return false;

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ productId, size, quantity: 1 });
  }

  writeList(CART_STORAGE_KEY, cart);
  return true;
};

export const setCartItemQuantity = ({ productId, size }, quantity) => {
  const cart = readList(CART_STORAGE_KEY)
    .map((item) =>
      item.productId === productId && item.size === size
        ? { ...item, quantity }
        : item,
    )
    .filter((item) => item.quantity > 0);

  writeList(CART_STORAGE_KEY, cart);
};

export const removeCartItem = (item) => setCartItemQuantity(item, 0);

export const clearCart = () => writeList(CART_STORAGE_KEY, []);

export const useCart = () =>
  useSyncExternalStore(subscribe, readCart, () => []);

export const useCartCount = () =>
  useCart().reduce((total, item) => total + item.quantity, 0);

/* Favorites */

const readFavorites = () => getSnapshot(FAVORITES_STORAGE_KEY);

export const toggleFavorite = (productId) => {
  const favorites = readList(FAVORITES_STORAGE_KEY);
  const next = favorites.includes(productId)
    ? favorites.filter((id) => id !== productId)
    : [...favorites, productId];

  writeList(FAVORITES_STORAGE_KEY, next);
};

export const useFavorites = () =>
  useSyncExternalStore(subscribe, readFavorites, () => []);
