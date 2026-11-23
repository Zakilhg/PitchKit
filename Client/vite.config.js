import { defineConfig } from "vite";
import process from "node:process";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves the demo from /PitchKit/; local dev uses the root.
  base: process.env.BASE_PATH || "/",
});
