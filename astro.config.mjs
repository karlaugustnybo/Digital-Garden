// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import icon from "astro-icon";
import partytown from "@astrojs/partytown";
import { unified } from "@astrojs/markdown-remark";
import { remarkWikiLink } from "./src/plugins/remark-wiki-link";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

// https://astro.build/config
export default defineConfig({
  site: "https://karlaugust.vercel.app",
  image: {
    domains: ["res.cloudinary.com"],
  },
  compressHTML: true,
  prefetch: true,
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath, remarkWikiLink],
      rehypePlugins: [rehypeKatex],
    }),
  },
  integrations: [
    mdx({
      shikiConfig: {
        theme: "night-owl",
        wrap: true,
      },
    }),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
    react(),
    icon({
      iconDir: "src/assets/icons",
    }),
  ],
});
