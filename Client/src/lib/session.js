import { useSyncExternalStore } from "react";

// The signed-in customer: a Sanctum API token plus the user it belongs to.
// Kept apart from api.js so the request helper can read the token without a cycle.
const KEY = "pitchkit.session";
const EVENT = "pitchkit:session-changed";

let cached;
const read = () => {
  if (cached !== undefined) return cached;
  try {
    const value = JSON.parse(localStorage.getItem(KEY) || "null");
    cached = value?.token ? value : null;
  } catch {
    cached = null;
  }
  return cached;
};

const write = (value) => {
  cached = value;
  try {
    if (value) localStorage.setItem(KEY, JSON.stringify(value));
    else localStorage.removeItem(KEY);
  } catch {
    // Storage blocked: the session lasts for this page only.
  }
  window.dispatchEvent(new Event(EVENT));
};

const subscribe = (callback) => {
  const onStorage = (event) => {
    if (event.key === KEY) cached = undefined;
    callback();
  };
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", onStorage);
  };
};

export const getToken = () => read()?.token ?? null;
export const setSession = ({ token, user }) => write({ token, user });
export const clearSession = () => write(null);
export const useSession = () => useSyncExternalStore(subscribe, read, () => null);
