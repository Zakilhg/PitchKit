import { useSyncExternalStore } from "react";

const STORAGE_KEY = "pitchkit.theme";
const CHANGE_EVENT = "pitchkit:theme-changed";
const SURFACE = { light: "#ffffff", dark: "#0a0a0a" };
const systemDark = () => window.matchMedia("(prefers-color-scheme: dark)");

const readSaved = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "light" || saved === "dark" ? saved : null;
  } catch {
    return null;
  }
};

const resolve = (preference) =>
  preference === "system" ? (systemDark().matches ? "dark" : "light") : preference;

const apply = (theme) => {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", SURFACE[theme]);
  window.dispatchEvent(new Event(CHANGE_EVENT));
};

const getTheme = () => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");
const getPreference = () => readSaved() || "system";

const subscribe = (callback) => {
  // Follow the system setting until the visitor picks a theme themselves.
  const media = systemDark();
  const onSystemChange = (event) => {
    if (!readSaved()) apply(event.matches ? "dark" : "light");
  };
  media.addEventListener("change", onSystemChange);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    media.removeEventListener("change", onSystemChange);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
};

/** preference: "light" | "dark" | "system" */
export const setTheme = (preference) => {
  try {
    if (preference === "system") localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, preference);
  } catch {
    // Storage blocked: the theme still changes for this visit.
  }
  apply(resolve(preference));
};

/** The theme on screen right now: "light" or "dark". */
export const useTheme = () => useSyncExternalStore(subscribe, getTheme, () => "light");

/** What the visitor chose: "light", "dark" or "system". */
export const useThemePreference = () =>
  useSyncExternalStore(subscribe, getPreference, () => "system");

// Keep the browser UI colour in step with the theme chosen before React loaded.
if (typeof document !== "undefined") {
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", SURFACE[getTheme()]);
}
