import { defineConfig } from "astro/config";
import rehypeResponsiveImages from "./scripts/rehype-responsive-images.mjs";

// Static output for GitHub Pages. "file" format keeps the old URLs
// (/work.html, /portfolio/*.html) working next to the new pages.
export default defineConfig(({ command }) => ({
  site: "https://willchavez.com",
  output: "static",
  trailingSlash: "ignore",
  markdown: { rehypePlugins: command === "build" ? [rehypeResponsiveImages] : [] },
  build: { format: "file" },
}));
