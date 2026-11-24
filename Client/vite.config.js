import { defineConfig } from "vite";
import path from "node:path";
import process from "node:process";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "src") },
  },
  // GitHub Pages serves the demo from /PitchKit/; local dev uses the root.
  base: process.env.BASE_PATH || "/",
});
