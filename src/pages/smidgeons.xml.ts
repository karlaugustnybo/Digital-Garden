// @ts-nocheck — Astro virtual modules (astro:content) resolved at build time
import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { extractBaseSlug } from "../utils/versionUtils.ts";
import {
  buildSmidgeonDescription,
  buildSmidgeonContent,
} from "../utils/feedUtils.ts";

export async function GET(context: any) {
  const smidgeons = await getCollection("smidgeons", ({ data }) => !data.draft);
  const siteUrl = context.site?.toString().replace(/\/$/, "") || "";

  return rss({
    title: "Karl August's Smidgeons",
    description: "A stream of interesting links, papers, and tiny thoughts",
    site: context.site,
    stylesheet: "/feed.xsl",
    items: smidgeons
      .map((post) => ({
        title: post.data.title,
        pubDate: post.data.startDate,
        description: buildSmidgeonDescription(post),
        link: `/${extractBaseSlug(post.id)}/`,
        content: buildSmidgeonContent(post, siteUrl),
        categories: post.data.topics || [],
      }))
      .sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf()),
    customData: `<language>en-gb</language><lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
  });
}