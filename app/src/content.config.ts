import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { soundCloudURL } from "./lib/soundcloud.mjs";

// Three kinds of things you can post. Each is a folder of markdown files that
// the CMS at /admin writes to. Nothing here is seeded: empty folders render
// as designed empty states.

const writing = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/writing" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string().optional(),
    deck: z.string().optional(),
    thumbnail: z.string().optional(),
    cover: z.string().optional(),
    source: z.string().url().optional(),
    topics: z.array(z.string()).default([]),
    soundcloud: z.string().trim().refine((value) => !value || Boolean(soundCloudURL(value)), "Use an https://soundcloud.com or https://on.soundcloud.com link.").optional(),
    draft: z.boolean().default(false),
  }),
});

const photos = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/photos" }),
  schema: z.object({
    title: z.string().optional(),
    date: z.coerce.date(),
    image: z.string(),
    alt: z.string().optional(),
    caption: z.string().optional(),
    place: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

// A curated log of things Will has watched, read, played, or listened to.
export const KINDS = ["music", "film", "game", "paper", "book"] as const;
const enjoying = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/enjoying" }),
  schema: z.object({
    title: z.string(),
    kind: z.enum(KINDS),
    creator: z.string().optional(),
    year: z.number().optional(),
    date: z.coerce.date().optional(),
    releaseDate: z.coerce.date().optional(),
    releaseDateSource: z.string().url().optional(),
    rating: z.number().min(0.5).max(5).multipleOf(0.5).optional(),
    cover: z.string().optional(),
    link: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { writing, photos, enjoying };
