import rss from "@astrojs/rss";
import { getWriting } from "../lib/content";

export async function GET(context: { site: URL }) {
  const posts = await getWriting();
  return rss({
    title: "Will Chavez",
    description: "Notes by Will Chavez",
    site: context.site,
    items: posts.map((p) => ({ title: p.data.title, pubDate: p.data.date, description: p.data.summary, link: `/notes/${p.id}` })),
  });
}
