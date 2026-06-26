import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

// Site is fully static — all dynamic work (inquiry POST, Turnstile) happens in
// client islands hitting the separate Worker API. No Astro server routes, so no
// adapter: a flat `dist/` ships straight to Pages via `wrangler pages deploy dist`.
// ponytail: add `@astrojs/cloudflare` + `output: "server"` only if you ever need
// SSR/Astro endpoints — it splits output into dist/client + dist/server, which
// would break the current deploy command.
export default defineConfig({
  // Production origin — powers canonical URLs, absolute og:image, sitemap.
  site: "https://damn-hq.pages.dev",
  output: "static",
  integrations: [react(), sitemap()],
  vite: {
    // Astro only injects PUBLIC_* env vars into client bundles; our public vars
    // use the VITE_ prefix, so widen envPrefix or they resolve to undefined in
    // the browser (Turnstile falls back to the test key, API_BASE to localhost).
    envPrefix: ["PUBLIC_", "VITE_"],
    build: {
      // Preserve the Vite-config note: span WebKit (needs -webkit-backdrop-filter)
      // and Firefox (needs unprefixed) so the CSS minifier keeps both .glass decls.
      cssTarget: ["chrome90", "firefox90", "safari14"],
    },
  },
});
