import { FiMoon, FiSun } from "react-icons/fi";
import { setTheme, useTheme } from "../lib/theme";

// A switch: its name stays the same and aria-checked says whether dark is on.
const ThemeToggle = ({ className, withLabel = false }) => {
  const theme = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={withLabel ? undefined : "Dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={className}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <FiSun aria-hidden="true" /> : <FiMoon aria-hidden="true" />}
      {withLabel && <span>Dark theme</span>}
    </button>
  );
};

export default ThemeToggle;
