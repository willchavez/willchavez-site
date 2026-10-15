// Self-host the Sveltia CMS bundle at /admin/cms so the editor doesn't depend on a CDN.
import fs from "node:fs";
fs.cpSync("node_modules/@sveltia/cms/dist", "dist/admin/cms", { recursive: true });
console.log("admin: copied sveltia cms into dist/admin/cms");
