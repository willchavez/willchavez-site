import { getCollection } from "astro:content";

const byDateDesc = (a: { data: { date: Date } }, b: { data: { date: Date } }) =>
  b.data.date.getTime() - a.data.date.getTime();

export async function getWriting() {
  return (await getCollection("writing", (e) => !e.data.draft)).sort(byDateDesc);
}
export async function getPhotos() {
  return (await getCollection("photos", (e) => !e.data.draft)).sort(byDateDesc);
}
export async function getEnjoying() {
  return (await getCollection("enjoying", (e) => !e.data.draft)).sort((a, b) =>
    ((b.data.date ?? b.data.releaseDate)?.getTime() ?? 0) - ((a.data.date ?? a.data.releaseDate)?.getTime() ?? 0) ||
    a.id.localeCompare(b.id),
  );
}

export const fmtDate = (d: Date) =>
  d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

// Uploaded photos are resized at build time (scripts/images.mjs) to
// /uploads/w/<width>/<name>.webp. In dev those don't exist, so use the original.
export function img(src: string | undefined, width: number) {
  if (!src) return undefined;
  if (!import.meta.env.PROD || !src.startsWith("/uploads/")) return src;
  const name = src.slice("/uploads/".length).replace(/\.[^.]+$/, "");
  return `/uploads/w/${width}/${name}.webp`;
}

export const VERB: Record<string, string> = { music: "listen", film: "watch", game: "play", paper: "read", book: "read" };
export const KIND_PLURAL: Record<string, string> = { music: "music", film: "films", game: "games", paper: "papers", book: "books" };
