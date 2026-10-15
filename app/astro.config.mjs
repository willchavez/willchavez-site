import { defineConfig } from "astro/config";

// Static output for GitHub Pages. "file" format keeps the old URLs
// (/work.html, /portfolio/*.html) working next to the new pages.
export default defineConfig({
  site: "https://willchavez.com",
  output: "static",
  trailingSlash: "ignore",
  build: { format: "file" },
});
