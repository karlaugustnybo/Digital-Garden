// @ts-nocheck — Astro virtual modules (astro:content) resolved at build time
import { Feed } from "feed";
import { getCollection } from "astro:content";
import { extractBaseSlug } from "../utils/versionUtils.ts";
import {
    buildSmidgeonDescription,
    buildSmidgeonContent,
} from "../utils/feedUtils.ts";

export async function GET(context: any) {
    const siteUrl = context.site?.toString().replace(/\/$/, "") || "";
    const smidgeons = await getCollection("smidgeons", ({ data }) => !data.draft);

    const feed = new Feed({
        title: "Karl August's Smidgeons",
        description: "A stream of interesting links, papers, and tiny thoughts",
        id: siteUrl + "/smidgeons/",
        link: siteUrl + "/smidgeons/",
        language: "en-gb",
        favicon: siteUrl + "/images/favicon/favicon.ico",
        copyright: `© ${new Date().getFullYear()} Karl August Krogh Nybo`,
        updated: new Date(),
        feedLinks: {
            atom: siteUrl + "/smidgeons-atom.xml",
            rss: siteUrl + "/smidgeons.xml",
        },
        author: {
            name: "Karl August Krogh Nybo",
            link: siteUrl,
        },
    });

    for (const post of smidgeons) {
        const categories = (post.data.topics || []).map((t: string) => ({ name: t, term: t }));
        feed.addItem({
            title: post.data.title,
            id: siteUrl + `/${extractBaseSlug(post.id)}/`,
            link: siteUrl + `/${extractBaseSlug(post.id)}/`,
            description: buildSmidgeonDescription(post),
            date: post.data.startDate,
            content: buildSmidgeonContent(post, siteUrl),
            category: categories,
        });
    }

    const atomXml = feed.atom1();
    const withXsl = atomXml.replace(
        '<?xml version="1.0" encoding="utf-8"?>',
        '<?xml version="1.0" encoding="utf-8"?>\n<?xml-stylesheet type="text/xsl" href="/atom-feed.xsl"?>',
    );

    return new Response(withXsl, {
        headers: { "Content-Type": "application/xml; charset=utf-8" },
    });
}
