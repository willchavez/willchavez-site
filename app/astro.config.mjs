import { defineConfig } from "astro/config";
import rehypeResponsiveImages from "./scripts/rehype-responsive-images.mjs";

// Static output for GitHub Pages. "file" format keeps the old URLs
// (/work.html, /portfolio/*.html) working next to the new pages.
export default defineConfig({
  site: "https://willchavez.com",
  output: "static",
  trailingSlash: "ignore",
  markdown: {
    // Astro sets NODE_ENV=production for builds. Keep the source image paths
    // during dev, where the generated responsive variants do not exist yet.
    rehypePlugins: process.env.NODE_ENV === "production" ? [rehypeResponsiveImages] : [],
  },
  build: { format: "file" },
});
