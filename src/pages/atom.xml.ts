// @ts-nocheck — Astro virtual modules (astro:content) resolved at build time
import { Feed } from "feed";
import { getCollection } from "astro:content";
import { extractBaseSlug } from "../utils/versionUtils.ts";
import {
    processContentForFeed,
    buildSmidgeonDescription,
    buildSmidgeonContent,
} from "../utils/feedUtils.ts";

export async function GET(context: any) {
    const siteUrl = context.site?.toString().replace(/\/$/, "") || "";

    const notes = await getCollection("notes", ({ data }) => !data.draft);
    const essays = await getCollection("essays", ({ data }) => !data.draft);
    const smidgeons = await getCollection("smidgeons", ({ data }) => !data.draft);
    const now = await getCollection("now", ({ data }) => !data.draft);
    const research = await getCollection("research", ({ data }) => !data.draft);

    const feed = new Feed({
        title: "Karl August Krogh Nybo",
        description: "Essays on programming, design, and anthropology",
        id: siteUrl + "/",
        link: siteUrl + "/",
        language: "en-gb",
        favicon: siteUrl + "/images/favicon/favicon.ico",
        copyright: `© ${new Date().getFullYear()} Karl August Krogh Nybo`,
        updated: new Date(),
        feedLinks: {
            atom: siteUrl + "/atom.xml",
            rss: siteUrl + "/rss.xml",
        },
        author: {
            name: "Karl August Krogh Nybo",
            link: siteUrl,
        },
    });

    // Notes (with full content and updated date)
    for (const post of notes) {
        const categories = (post.data.topics || []).map((t: string) => ({ name: t, term: t }));
        feed.addItem({
            title: post.data.title,
            id: siteUrl + `/${extractBaseSlug(post.id)}/`,
            link: siteUrl + `/${extractBaseSlug(post.id)}/`,
            description: post.data.description,
            date: post.data.updated || post.data.startDate,
            published: post.data.startDate,
            content: processContentForFeed(post.body, siteUrl),
            category: categories,
        });
    }

    // Essays (with full content and updated date)
    for (const post of essays) {
        const categories = (post.data.topics || []).map((t: string) => ({ name: t, term: t }));
        feed.addItem({
            title: post.data.title,
            id: siteUrl + `/${extractBaseSlug(post.id)}/`,
            link: siteUrl + `/${extractBaseSlug(post.id)}/`,
            description: post.data.description,
            date: post.data.updated || post.data.startDate,
            published: post.data.startDate,
            content: processContentForFeed(post.body, siteUrl),
            category: categories,
        });
    }

    // Research
    for (const post of research) {
        const categories = (post.data.researchArea || []).map((t: string) => ({ name: t, term: t }));
        feed.addItem({
            title: post.data.title,
            id: siteUrl + `/research/${post.id}/`,
            link: siteUrl + `/research/${post.id}/`,
            description: post.data.description,
            date: post.data.updated || post.data.published || new Date(),
            published: post.data.published,
            category: categories,
        });
    }

    // Now posts
    for (const post of now) {
        const categories = (post.data.topics || []).map((t: string) => ({ name: t, term: t }));
        feed.addItem({
            title: post.data.title,
            id: siteUrl + `/now-${post.id}/`,
            link: siteUrl + `/now-${post.id}/`,
            date: post.data.startDate,
            content: processContentForFeed(post.body, siteUrl),
            category: categories,
        });
    }

    // Smidgeons
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

    // Inject XSL stylesheet processing instruction into the output
    const atomXml = feed.atom1();
    const withXsl = atomXml.replace(
        '<?xml version="1.0" encoding="utf-8"?>',
        '<?xml version="1.0" encoding="utf-8"?>\n<?xml-stylesheet type="text/xsl" href="/atom-feed.xsl"?>',
    );

    return new Response(withXsl, {
        headers: { "Content-Type": "application/xml; charset=utf-8" },
    });
}
