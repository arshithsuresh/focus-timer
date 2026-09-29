import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Standard Vite + React SPA. `base` matches the GitHub Pages project path so
// asset URLs resolve correctly when deployed to <user>.github.io/zen-timer/.
export default defineConfig({
  base: "/focus-timer/",
  plugins: [react(), tailwindcss()],
  resolve: { tsconfigPaths: true },
});
