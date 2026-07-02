import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import { file } from "astro/loaders";

const notesCollection = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/notes" }),
  schema: () =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      aliases: z.array(z.string()).optional(),
      startDate: z.coerce.date(),
      updated: z.coerce.date(),
      type: z.literal("note"),
      topics: z.array(z.string()).optional(),
      growthStage: z.string(),
      draft: z.boolean().optional(),
      toc: z.boolean().optional(),
      version: z.number().optional(),
      versionSummary: z.string().optional(),
    }),
});

const essaysCollection = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/essays" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      updated: z.coerce.date(),
      startDate: z.coerce.date(),
      type: z.literal("essay"),
      cover: image().optional(),
      topics: z.array(z.string()).optional(),
      growthStage: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      toc: z.boolean().optional(),
      aliases: z.array(z.string()).optional(),
      version: z.number().optional(),
      versionSummary: z.string().optional(),
    }),
});




const booksCollection = defineCollection({
  loader: file("src/content/books.json"),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      author: z.string(),
      cover: image().optional(),
      link: z.string().url(),
      id: z.number(),
    }),
});

const antibooksCollection = defineCollection({
  loader: file("src/content/antibooks.json"),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      author: z.string(),
      cover: image().optional(),
      link: z.string().url(),
      id: z.number(),
    }),
});

const nowCollection = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/now" }),
  schema: z.object({
    title: z.string(),
    startDate: z.coerce.date(),
    type: z.literal("now"),
    topics: z.array(z.string()).optional(),
    growthStage: z.string().default("evergreen"),
    draft: z.boolean().default(false),
  }),
});

const smidgeonsCollection = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/smidgeons" }),
  schema: () =>
    z.object({
      title: z.string(),
      startDate: z.coerce.date(),
      type: z.literal("smidgeon"),
      topics: z.array(z.string()).optional(),
      draft: z.boolean().optional(),
      external: z
        .object({
          title: z.string(),
          url: z.string().url(),
          author: z.string().optional(),
        })
        .optional(),
      citation: z
        .object({
          title: z.string(),
          authors: z.array(z.string()),
          journal: z.string(),
          year: z.number(),
          url: z.string().optional(),
        })
        .optional(),
    }),
});



const shortfilmsCollection = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/shortfilms" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      startDate: z.coerce.date(),
      updated: z.coerce.date(),
      type: z.literal("shortfilm"),
      cover: image().optional(),
      videoUrl: z.string().url(),
      duration: z.string().optional(),
      camera: z.string().optional(),
      lens: z.string().optional(),
      musicComposer: z.string().optional(),
      locations: z.array(z.string()).optional(),
      topics: z.array(z.string()).optional(),
      growthStage: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      toc: z.boolean().optional(),
      aliases: z.array(z.string()).optional(),
      version: z.number().optional(),
      versionSummary: z.string().optional(),
    }),
});

const musicCollection = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/music" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      startDate: z.coerce.date(),
      updated: z.coerce.date(),
      type: z.literal("music"),
      cover: image().optional(),
      audioUrl: z.string().url().optional(),
      videoUrl: z.string().url().optional(),
      duration: z.string().optional(),
      composer: z.string().optional(),
      instruments: z.array(z.string()).optional(),
      topics: z.array(z.string()).optional(),
      growthStage: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      toc: z.boolean().optional(),
      aliases: z.array(z.string()).optional(),
      version: z.number().optional(),
      versionSummary: z.string().optional(),
    }),
});

const pagesCollection = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/pages" }),
  schema: () =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      updated: z.coerce.date().optional(),
      startDate: z.coerce.date().optional(),
      type: z.literal("page"),
    }),
});


const researchCollection = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "src/content/research" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    abstract: z.string().optional(),
    authors: z.array(z.string()),
    type: z.enum(["paper", "preprint", "draft", "talk", "poster", "thesis", "technical-report"]).default("paper"),
    status: z.enum(["published", "submitted", "in-review", "draft"]).default("draft"),
    published: z.coerce.date().optional(),
    updated: z.coerce.date().optional(),
    researchArea: z.array(z.string()).optional(),
    venues: z.array(z.string()).optional(),
    arxiv: z.string().url().optional(),
    doi: z.string().optional(),
    pdf: z.string().url().optional(),
    code: z.string().url().optional(),
    data: z.string().url().optional(),
    slides: z.string().url().optional(),
    video: z.string().url().optional(),
    methodology: z.array(z.string()).optional(),
    keywords: z.array(z.string()).optional(),
    featured: z.boolean().default(false),
    toc: z.boolean().default(true),
    draft: z.boolean().default(false),
    math: z.boolean().default(true),
  }),
});

const notebooksCollection = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/notebooks" }),
  schema: () =>
    z.object({
      title: z.string(),
      description: z.string(),
      type: z.literal("notebook"),
      startDate: z.coerce.date(),
      updated: z.coerce.date(),
      topics: z.array(z.string()).optional(),
      growthStage: z.string(),
      draft: z.boolean().optional(),
      toc: z.boolean().optional(),
      sourceFile: z.string(),
      interactiveUrl: z.string(),
      molabUrl: z.string().url().optional(),
      wasmCompatible: z.boolean().default(true),
      aliases: z.array(z.string()).optional(),
    }),
});

// This key should match your collection directory name in "src/content"
export const collections = {
  now: nowCollection,
  notes: notesCollection,
  essays: essaysCollection,

  books: booksCollection,
  antibooks: antibooksCollection,
  smidgeons: smidgeonsCollection,

  shortfilms: shortfilmsCollection,
  music: musicCollection,
  pages: pagesCollection,
  research: researchCollection,
  notebooks: notebooksCollection,
};
