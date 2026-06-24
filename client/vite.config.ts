import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    // Span a WebKit target (needs -webkit-backdrop-filter) and a Firefox target
    // (needs the unprefixed property). Without this the CSS minifier collapses
    // .glass down to only -webkit-backdrop-filter, killing the navbar blur in
    // Firefox/non-WebKit browsers.
    cssTarget: ["chrome90", "firefox90", "safari14"],
  },
});
