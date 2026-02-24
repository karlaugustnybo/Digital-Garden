// @ts-nocheck — Astro virtual modules (astro:content) resolved at build time
import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { extractBaseSlug } from "../utils/versionUtils.ts";
import {
  processContentForFeed,
  buildSmidgeonDescription,
  buildSmidgeonContent,
} from "../utils/feedUtils.ts";

export async function GET(context: any) {
  const notes = await getCollection("notes", ({ data }) => !data.draft);
  const essays = await getCollection("essays", ({ data }) => !data.draft);
  const smidgeons = await getCollection("smidgeons", ({ data }) => !data.draft);
  const now = await getCollection("now", ({ data }) => !data.draft);
  const research = await getCollection("research", ({ data }) => !data.draft);

  const siteUrl = context.site?.toString().replace(/\/$/, "") || "";

  return rss({
    title: "Karl August Krogh Nybo",
    description: "Essays on programming, design, and anthropology",
    site: context.site,
    stylesheet: "/feed.xsl",
    items: [
      ...notes.map((post) => ({
        title: post.data.title,
        pubDate: post.data.startDate,
        description: post.data.description,
        link: `/${extractBaseSlug(post.id)}/`,
        content: processContentForFeed(post.body, siteUrl),
        categories: post.data.topics || [],
      })),
      ...essays.map((post) => ({
        title: post.data.title,
        pubDate: post.data.startDate,
        description: post.data.description,
        link: `/${extractBaseSlug(post.id)}/`,
        content: processContentForFeed(post.body, siteUrl),
        categories: post.data.topics || [],
      })),
      ...research.map((post) => ({
        title: post.data.title,
        pubDate: post.data.published || post.data.updated || new Date(),
        description: post.data.description,
        link: `/research/${post.id}/`,
        categories: post.data.researchArea || [],
      })),
      ...now.map((post) => ({
        title: post.data.title,
        pubDate: post.data.startDate,
        link: `/now-${post.id}/`,
        content: processContentForFeed(post.body, siteUrl),
        categories: post.data.topics || [],
      })),
      ...smidgeons.map((post) => ({
        title: post.data.title,
        pubDate: post.data.startDate,
        description: buildSmidgeonDescription(post),
        link: `/${extractBaseSlug(post.id)}/`,
        content: buildSmidgeonContent(post, siteUrl),
        categories: post.data.topics || [],
      })),
    ].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf()),
    customData: `<language>en-gb</language><lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
  });
}