import type { APIRoute } from "astro";
import { portfolioProjects } from "../data/portfolio-projects";
import { getEnjoying, getPhotos, getWriting } from "../lib/content";

const encodePath = (id: string) => id.split("/").map(encodeURIComponent).join("/");
const xmlEscape = (value: string) => value.replace(/[<>&'\"]/g, (character) => ({
  "<": "&lt;",
  ">": "&gt;",
  "&": "&amp;",
  "'": "&apos;",
  '"': "&quot;",
}[character]!));

export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL("https://willchavez.com/");
  const [writing, photos, enjoying] = await Promise.all([getWriting(), getPhotos(), getEnjoying()]);
  const pages = [
    "/",
    "/about",
    "/portfolio",
    "/notes",
    "/photos",
    "/enjoying",
    ...portfolioProjects.map((project) => `/portfolio/${encodePath(project.slug)}`),
    ...writing.map((entry) => `/notes/${encodePath(entry.id)}`),
    ...photos.map((entry) => `/photos/${encodePath(entry.id)}`),
    ...enjoying.map((entry) => `/enjoying/${encodePath(entry.id)}`),
  ];

  const urls = pages.map((path) => {
    const location = xmlEscape(new URL(path, base).href);
    return `<url><loc>${location}</loc></url>`;
  }).join("");

  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
