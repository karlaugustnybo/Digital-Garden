# Pagefind Full-Text Search Plan

## Why

The garden only has **faceted filters** today (topic / growth-stage / type buttons in `src/components/search/GardenFilters.astro`). There is no way to type a query and find matching content. Adding real text search is the single highest-value discovery feature.

## Why Pagefind

[Pagefind](https://pagefind.app) is the best fit for this static Astro site:

- **Astro-native** — official `@pagefind/default-ui` and a documented Astro integration path.
- **Zero-runtime cost until used** — the index is generated *after* the static build by crawling the HTML output, so it adds no build-time content pipeline and no server.
- **Tiny** — search UI loads only when the user opens search; the index is sharded and fetched on demand.
- **No third-party service** — fully self-hosted, no Algolia/API keys. Aligns with the small-web stance.
- **Respects the existing HTML** — it indexes the rendered prose, so wiki-links, KaTeX text, and MDX components are all searchable as-is.

---

## Architecture

```
bun run build  ──►  dist/**.html  ──►  pagefind --site dist  ──►  dist/pagefind/**
                                                              (index + UI assets)
            └─ served statically by Vercel
```

The search index is produced as a **post-build step**, then deployed alongside the rest of `dist/`. A search UI (Pagefind UI or a custom component) fetches the index client-side when the user opens search.

### Indexable pages

Index **post content pages only**, not listing pages. Pagefind keys off CSS, so we mark up content with:

- `data-pagefind-body` on the prose wrapper (`ProseWrapper.astro` in `src/components/layouts/`) → only this region is indexed (avoids indexing nav/footer/cards).
- `data-pagefind-meta="title:{...}"` / `type` / `growthStage` / `topics` on each post so results can be filtered and labeled.
- `data-pagefind-ignore` on WebMentions, backlinks, TOC, and tooltips so they don't pollute results.

Listing pages (`/garden`, `/essays`, `/notes`, `/archive`, homepage) get `data-pagefind-ignore` at the `<body>` level (or simply aren't marked with `data-pagefind-body`, which excludes them by default).

---

## Implementation steps

### 1. Install Pagefind
```bash
bun add -D pagefind
```

### 2. Annotate the markup
- **`src/components/layouts/ProseWrapper.astro`** — add `data-pagefind-body` to the prose container.
- **`src/layouts/PostLayout.astro`** (and `SmidgeonLayout`) — add Pagefind metadata attributes to the header:
  ```html
  <article
    data-pagefind-body
    data-pagefind-meta="title={title}"
    data-pagefind-meta="type={type}"
    data-pagefind-meta="growthStage={growthStage}"
    data-pagefind-meta="topics={topics?.join(',')}"
  >
  ```
- **`src/components/layouts/Backlinks.astro`, `WebMentions.astro`, `TableOfContents.astro`** — add `data-pagefind-ignore`.
- **Listing/homepage pages** — add `data-pagefind-ignore` on `<body>` (in `Layout.astro`, gated by a frontmatter flag like `noindex`) so they're excluded.

### 3. Add the build step
In `package.json`, extend the `build` script to index after Astro:
```json
"build": "bun run check-fonts && bun run generate-links && bun run generate-topics && bun run get-webmentions && astro build && pagefind --site dist"
```
Add a convenience script:
```json
"index": "pagefind --site dist"
```

### 4. Add the search UI
Two options — pick one:

**Option A — `@pagefind/default-ui` (fastest):**
- Add a search trigger to the navbar (`src/components/layouts/navbar/`) that opens a modal/overlay containing `<div id="pagefind-search"></div>`.
- Mount the default UI in a client script:
  ```ts
  import { PagefindUI } from "@pagefind/default-ui";
  import "@pagefind/default-ui/css/ui.css";
  new PagefindUI({ element: "#pagefind-search", showSubResults: true });
  ```
- Install: `bun add @pagefind/default-ui`.

**Option B — Custom component matching the site aesthetic:**
- Build a small `SearchModal.astro` that calls the Pagefind JS API (`import "/pagefind/pagefind-entry.js"; await Pagefind.search(query)`) and renders results with the existing card styles + growth-stage icons.
- More work, but consistent with the cream/green design system and Tippy tooltips.

Recommend **Option A first**, then restyle to match once it's working.

### 5. Wire keyboard shortcut
- Connect the `/` shortcut from the main plan (2.7) to open the search modal and focus its input.
- Add a search icon to the navbar (use `astro-icon` with an existing lucide/heroicon `search` icon — both icon sets are already installed).

### 6. View-transition safety
- The search modal must initialize on every navigation. Use `onPageLifecycle()` from `src/utils/viewTransitionLifecycle.ts` (already implemented) to re-mount the UI after view transitions, or lazy-init on first open (preferred — Pagefind UI fetches its index lazily anyway).

---

## Styling

- Style the Pagefind UI container to match the site: cream background, `--font-body`, green accents for highlighted matches, growth-stage icons next to each result.
- Show result type as a small badge (essay / note / smidgeon / research) using the metadata from step 2.
- Limit to ~10 results, with "show more".

---

## Verification

```bash
bun run build      # includes pagefind --site dist at the end
bun run dev        # open /, press /, type a known word from an essay → it appears
```
- Confirm listing pages (`/garden`, `/essays`, home) do **not** appear as results.
- Confirm drafts are excluded (they're filtered out of the build already, so they won't be indexed).
- Confirm the index is sharded under `dist/pagefind/` and only fetched when search is opened (DevTools network).

## Out of scope
- Searching inside marimo notebook iframes (out of reach — they're cross-origin/sandboxed).
- Search synonyms / fuzzy tuning beyond Pagefind defaults (can revisit later).
