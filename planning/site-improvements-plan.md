# Site Improvements Plan

A consolidated plan to fix bugs and add small/medium features across the digital garden. Each phase is roughly independent and can ship as its own PR. Large features (Pagefind search, interactive content graph) have their own plans under `planning/`.

The canonical site URL is `https://karlaugust.vercel.app` (from `astro.config.mjs`).

---

## Phase 0 — Cleanup (do first, no behavior change)

### 0.1 Delete orphaned legacy script
- **What:** `src/scripts/build/post-links.ts` is dead code. It references a non-existent `posts/essays` path, uses CommonJS `require`, and is not wired into the build (`package.json` build script only runs `generate-links`, `generate-topics`, `get-webmentions`).
- **Action:** Delete `src/scripts/build/post-links.ts`.
- **Verify:** `bun run build` still succeeds.

### 0.2 Delete stale upstream recommendations report
- **What:** `scripts/comparison/recommendations-2026-07-01.md` lists upstream fixes (view-transition lifecycle helper, Accordion/GrowthStage a11y, MobileMenu rewrite, etc.) that are **already implemented** in this repo.
- **Action:** Delete `scripts/comparison/recommendations-2026-07-01.md`. Keep `compare-upstream.sh` and the `reports/` tree (still useful for future comparison runs).
- **Verify:** `scripts/comparison/compare-upstream.sh` still runs.

---

## Phase 1 — Bugfixes

### 1.1 Fix broken WebMentions domain
- **What:** `src/components/layouts/WebMentions.astro` hardcodes the wrong domain, so mentions never match local posts.
  - Line 18: `const baseUrl = \`https://maggieappleton.com/${postSlug}\`;`
  - Line 297: `content.replace(/maggieappleton.com.*/g, "")`
- **Action:** Replace `https://maggieappleton.com` with `https://karlaugust.vercel.app` in both places. Better: derive the base from `Astro.site` so it stays in sync with `astro.config.mjs`:
  ```ts
  const site = Astro.site?.toString().replace(/\/$/, "") ?? "https://karlaugust.vercel.app";
  const baseUrl = `${site}/${postSlug}`;
  ```
  Update the regex on line 297 to strip the real domain (or `new URL(site).host`).
- **Verify:** Re-run `bun run fetch-webmentions`, then `bun run build`; check a post that has inbound mentions renders them.

### 1.2 Remove dead `/garden-history` link
- **What:** `src/pages/index.astro:59` links to `/garden-history`, which has no page. (`about.astro:78` links to an *external* Maggie Appleton page, which is fine.)
- **Action:** Two options — pick one:
  - **(a)** Remove the "Learn more" link entirely and leave the descriptive sentence.
  - **(b)** Point it at a real destination, e.g. the `/about` page anchor or a future `/colophon` section on digital gardening.
- **Verify:** No 404 on the homepage; link resolves.

### 1.3 Make `generate-topics.ts` actually write its output
- **What:** `src/scripts/build/generate-topics.ts` computes the topic set but only `console.log`s the count — it never writes `src/content/data/topics.json`, so that file is stale/manual.
- **Action:** After computing `sortedTopics`, write a stable JSON file:
  ```ts
  const out = { topics: sortedTopics, generatedAt: new Date().toISOString() };
  await fs.writeFile("src/content/data/topics.json", JSON.stringify(out, null, 2) + "\n");
  ```
  Keep the `console.log`. Ensure the output shape matches whatever `getTopics.ts` consumes (check before writing — if `getTopics.ts` expects an array, write the array directly).
- **Verify:** Delete `src/content/data/topics.json`, run `bun run generate-topics`, confirm the file is regenerated and `bun run build` still resolves topics on `/topics/[topic]`.

### 1.4 Complete the wiki-link graph
- **What:** `src/scripts/build/generate-links.ts` (`getAllPostData`, lines ~127–148) only indexes **essays, notes, notebooks**. Smidgeons, research, music, shortfilms, and now are excluded, so backlinks to/from those collections never resolve.
- **Action:**
  - Add `getFilesFromDir` calls for `smidgeons`, `research`, `music`, `shortfilms`, `now`.
  - Run each through `getDataForBacklinks` and concat into the merged dataset used for inbound/outbound link maps.
  - Be careful with versioning (`extractBaseSlug`) — research/smidgeons may use folder-based versioning later; the existing logic handles it.
  - Confirm `src/links.json` gains entries for the newly-included collections.
- **Verify:** Pick a smidgeon that links `[[to a note]]` (or vice-versa) and confirm a backlink appears on the target after `bun run generate-links && bun run build`.

### 1.5 Update stale feed taglines
- **What:** `src/pages/rss.xml.ts:22` and `src/pages/atom.xml.ts:22` declare Maggie's tagline — `description: "Essays on programming, design, and anthropology"`. The site is ML/AI safety/music. (1.1 fixes the WebMentions domain; this is the same class of stale fork copy in the feeds.)
- **Action:** Replace both with the Layout default: `"Karl August's digital garden exploring ML, AI safety, music, design, and mathematics"`.
- **Verify:** `curl localhost/rss.xml` (or a feed validator) shows the updated description.

### 1.6 Update default OG image copy
- **What:** `src/pages/og.png.ts` still renders Maggie's text — `:67-68` description fallback ("A digital garden filled with visual essays on programming, design, and anthropology"), `:138` eyebrow ("essays, notes, and design patterns" — patterns is a disabled collection), `:206` site URL rendered as `karlaugustnybo.com` (not the configured `karlaugust.vercel.app` in `astro.config.mjs:14`).
- **Action:** Update the description and eyebrow to Karl's. Render the domain from `Astro.site` (or the literal `karlaugust.vercel.app`) so it matches the config.
- **Verify:** `bun run dev` → visit `/og.png?title=Test` → rendered text and domain are Karl's.

### 1.7 Rewrite or unpublish stale hire-me content
- **What:** `src/pages/hire-me.astro` + `src/content/pages/hire-me.mdx` still carry Maggie's copy — subtitle reads "Senior product designer and design engineer seeks friendly, **London-based** team". Karl is an ML student in Copenhagen.
- **Action:** Either rewrite to Karl's actual situation, or remove `hire-me.astro` + the `hire-me.mdx` entry (and any nav/footer link) until ready.
- **Verify:** `/hire-me` no longer references London/design-engineer; or 404s cleanly if removed.

### 1.8 Pass a description to Layout in `now-[slug].astro`
- **What:** `src/pages/now-[slug].astro:47` passes only `title` to `<Layout>` — no `desc`. Every now-update shares the generic homepage description in OG/Twitter cards.
- **Action:** Pass `desc={\`${entry.data.title} — a now update from Karl August.\`}` (or derive a snippet from the body).
- **Verify:** View-source on a now-update page → `og:description` is specific to that update.

---

## Phase 2 — Small features

### 2.1 Custom 404 page
- **What:** No `src/pages/404.astro` exists.
- **Action:** Create `src/pages/404.astro` using `Layout.astro`. Include: a short message, a "back to the garden" link (`/garden`), and the serendipity button from 2.4 once it exists. Astro auto-detects `404.astro` in dev and serves it in production.
- **Verify:** Visit a bogus URL in `bun run dev` → renders the custom 404.

### 2.2 Lightweight `robots.txt` (open, small-web friendly)
- **What:** No `public/robots.txt`. The user is fine with scrapers/LLMs and doesn't want big-tech SEO games.
- **Action:** Add `public/robots.txt` that explicitly **allows all** crawlers (including AI) and points at the homepage. Keep it minimal — no sitemap reference (out of scope per user). Example:
  ```
  User-agent: *
  Allow: /
  ```
- **Verify:** `curl localhost/robots.txt` returns the file.

### 2.3 Remove (or replace) broken analytics scaffolding
- **What:** `astro.config.mjs` wires `partytown` with `forward: ["dataLayer.push"]`, and `Layout.astro` declares `window.gtag`/`dataLayer` types — but **no GA script or measurement ID ever loads**, so it's dead weight. The user wants *no hostile analytics*; if any, it must be privacy-first and extremely light.
- **Action (default — remove):**
  - Remove the `partytown({ config: { forward: ["dataLayer.push"] } })` integration and its import from `astro.config.mjs`.
  - Remove the `window.gtag` / `dataLayer` type declarations from `Layout.astro`.
  - Remove `@astrojs/partytown` from `package.json` (`bun remove @astrojs/partytown`).
- **Action (optional, only if user opts in later):** drop in a privacy-first, self-hosted option (e.g. self-hosted Plausible or Umami via a single script tag). Keep it out of the default build until decided.
- **Verify:** `bun run build` succeeds; view-source on any page shows no GA/partytown scripts.

### 2.4 "Serendipity" / random-note button
- **What:** A "take me somewhere" button that jumps to a random non-draft note/essay. Very on-brand for a garden.
- **Action:**
  - Add a small endpoint or inline script. Simplest: a client script that, on click, picks a random slug from a build-time-generated JSON list of public post slugs (essays + notes + smidgeons, excluding drafts).
  - Generate the slug list in the existing build pipeline (e.g. extend `generate-topics.ts` or add a tiny `generate-random-pool.ts`), or expose it via an Astro endpoint `src/pages/api/random.json.ts` that returns `{ slug }`.
  - Place the button on the 404 page, the `/garden` page header, and/or the footer.
- **Verify:** Click repeatedly → lands on different live posts; never lands on a draft or 404.

### 2.5 Reading-time estimates
- **What:** No reading-time indicator on cards or post headers.
- **Action:**
  - Compute at build time from rendered word count (~200 wpm). Two approaches:
    - **(a) remark plugin** (`remark-reading-time` or a 10-line custom plugin) that injects `data.readingTime` into frontmatter/vfile data.
    - **(b) utility in cards** that estimates from raw `body` length.
  - Display ("~4 min read") in `NoteCard.astro`, `EssayCard.astro`, and the `PostLayout.astro` header next to dates.
- **Verify:** A 1000-word essay shows "~5 min read"; a smidgeon shows "~1 min read" or nothing for very short items.

### 2.6 Footnote hover popovers
- **What:** Footnotes are plain links today. Wikipedia-style hover popovers would preview the footnote content without navigation.
- **Action:**
  - Reuse the existing `Tooltip.astro` (Tippy.js) infrastructure.
  - Add a remark/rehype step (or a small client script) that detects footnote-ref links (`href="#fn-..."`) and attaches a Tippy tooltip whose content is the corresponding `<li id="fn-...">` text.
  - Respect `prefers-reduced-motion`.
- **Verify:** Hover a footnote ref on an essay → popover shows the footnote text; click still jumps to the footnote.

### 2.7 Keyboard shortcuts
- **What:** No site-wide keyboard shortcuts.
- **Action:** Add a tiny client script (loaded in `Layout.astro`, view-transition-safe using `viewTransitionLifecycle.ts`):
  - `/` → focus the search input (once Pagefind search lands; until then, scroll to the garden filter).
  - `g` → `/garden`
  - `n` → `/notes`
  - `e` → `/essays`
  - `s` → `/smidgeons`
  - `r` → random note (calls 2.4)
  - `?` → toggle a shortcuts help dialog
  - Ignore when focus is in an input/textarea/contenteditable.
- **Verify:** Press `g` from any page → navigates to `/garden`; `?` shows the help dialog; typing in a search box doesn't trigger shortcuts.

### 2.8 Print stylesheet for essays & research
- **What:** No print styles; printing an essay dumps the whole chrome (nav, footer, tooltips).
- **Action:** Add a `@media print` block to `src/global.css` (or a scoped print stylesheet imported only in `PostLayout.astro`):
  - Hide navbar, footer, sidebar, tooltips, back-to-top button, webmentions.
  - Expand prose to full width, set base font to serif, ensure links are black (not colored), keep `href` visible via `a[href]::after { content: " (" attr(href) ")"; }` for external links only.
  - Page-break before major headings (`h2 { break-before: page }` is too aggressive — use `break-inside: avoid` on cards/blockquotes).
- **Verify:** Print-preview an essay → clean, readable, no nav clutter.

### 2.9 IndieWeb microformats (h-card / h-entry)
- **What:** No structured microformats; aligns with the small-web / IndieWeb ethos the user wants.
- **Action:**
  - Add `h-card` classes to the about page (name, photo, url, rel-me) — the `rel="me"` Bluesky link already exists in `Layout.astro`.
  - Add `h-entry` wrapper + `e-content`, `dt-published`, `p-name`, `p-author` classes around post bodies in `PostLayout.astro` and `SmidgeonLayout`.
  - This is pure CSS-class markup — no JS, no dependencies.
- **Verify:** Install the microformats parser (or use `https://pin13.net/mf2/`) and confirm the about page parses as a valid h-card and a post parses as h-entry.

### 2.10 Article structured data (JSON-LD)
- **What:** `PostLayout.astro` emits no schema.org markup. Articles have rich frontmatter (title, description, dates, topics, authors for research) but no `Article`/`BlogPosting` structured data. This is complementary to 2.9 — 2.9 adds IndieWeb microformat *CSS classes* (h-entry) for the small web; this adds machine-readable JSON-LD for search engines.
- **Action:** Add a `<script type="application/ld+json">` in `PostLayout.astro` using `frontmatter.title`/`description`/`startDate`/`updated`/`canonicalURL`/`topics`. Use `BlogPosting` for essays/notes/smidgeons and `ScholarlyArticle` for research where applicable.
- **Verify:** Paste a post URL into Google's Rich Results test → Article schema validates with no warnings on required fields.

---

## Phase 3 — Medium features

### 3.1 Dark mode toggle
- **What:** Only the cream/light theme exists (`src/global.css`). A dark mode respects `prefers-color-scheme` and lets users override manually.
- **Action:**
  - Define a `[data-theme="dark"]` token set in `global.css` mirroring the existing `:root` color tokens (cream → dark, green/brown adjusted for contrast, keep oklch). Leave spacing/type tokens shared.
  - Add a theme toggle button in the navbar (`navbar/`), persisted in `localStorage` and applied before first paint to avoid FOUC (small inline script in `<head>` of `Layout.astro`).
  - Default to the user's OS preference (`prefers-color-scheme: dark`) when no stored preference exists.
  - Respect `transition: background-color ...` on body for a smooth swap (disable transition under `prefers-reduced-motion`).
  - Ensure KaTeX colors and code blocks (Shiki `night-owl`) still read well on dark — Shiki already dark-friendly.
- **Verify:** Toggle persists across reloads and view transitions; toggling on the OS dark mode flips the site when no manual pref is set.

### 3.2 Archive / timeline view
- **What:** A date-ordered view of all content. `Timeline.astro` already exists (used on the about page) but only for a hand-written bio timeline.
- **Action:**
  - Add `src/pages/archive.astro` (or `timeline.astro`).
  - Pull all non-draft entries across collections (essays, notes, smidgeons, research, now, music, shortfilms, notebooks), sort by `startDate` (or `published` for research), group by year/month.
  - Render as a vertical timeline (reuse/extend `Timeline.astro` styling) with growth-stage icons and type badges.
  - Link each entry to its canonical (versioned) URL.
  - Add a nav link (garden page or footer).
- **Verify:** `/archive` shows everything in chronological order; drafts excluded; links resolve.

---

## Phase 4 — Accessibility & polish

### 4.1 Skip-to-content link
- **What:** `Layout.astro:123` has no skip link; keyboard users tab through the whole 10-item megamenu before reaching content.
- **Action:** Add `<a class="skip-link" href="#main">Skip to content</a>` as the first `<body>` child; give `<main>` `id="main"`; style `.skip-link` visually-hidden until focused (reuse the `.visually-hidden` pattern + a `:focus` reveal).
- **Verify:** Tab from the address bar → first focus is the skip link; Enter jumps focus into main content.

### 4.2 Fix nested `<main>` landmarks
- **What:** `Layout.astro:125` wraps the slot in `<main>`, but `PageWrapper.astro:9`, `PostLayout.astro:171`, and `now.astro:62` each add another `<main>` inside it — invalid HTML (only one `<main>` per page allowed), confusing to screen readers.
- **Action:** Keep the single `<main>` in `Layout.astro`. Change the inner elements to `<div>` (or `<article>` in `PostLayout`, which is more semantic anyway).
- **Verify:** View-source on any page → exactly one `<main>`; axe reports one main landmark.

### 4.3 Make cards keyboard-accessible
- **What:** `card-click.ts` makes `<div data-card-link>` clickable with no `role`/`tabindex`/keyboard handler. Divs aren't focusable; Enter/Space doesn't navigate. Affects `EssayCard`, `NoteCard`, `BookCard`, `ResearchCard`, `SmidgeonCard`, `MusicCard`, `NotebookCard`, `ShortfilmCard`.
- **Action:** In `card-click.ts` add a keydown listener (Enter + Space → navigate). On each card's clickable div add `role="link"` and `tabindex="0"`. Add `:focus-visible` styles (outline using `--color-primary-green`) matching the hover state.
- **Verify:** Tab through a listing page → each card is focusable and outlined; Enter on a card navigates.

### 4.4 Footer social icon a11y + invalid button-in-anchor
- **What:** `Footer.astro:25-36` — four icon-only links (Bluesky/GitHub/LinkedIn/Twitter) have no accessible names. Separately, `Footer.astro:11-22` wraps `<button>` inside `<a>` (invalid HTML).
- **Action:** Add `aria-label` to each social `<a>`. Drop the `<button>` from the feed links and style the `<a>` itself as the button (move `.rss-feed button` rules to `.rss-feed a.feed-button`).
- **Verify:** Screen reader announces "Bluesky" etc.; axe reports no nested interactive elements.

### 4.5 Consistent focus color
- **What:** `MainNavLinks.astro:399` uses hardcoded `darkblue` for `:focus-visible`, while `MobileMenu.astro:59` uses `--color-primary-green` for the same pattern.
- **Action:** Replace `darkblue` with `var(--color-primary-green)` (or a dedicated `--color-focus` token).
- **Verify:** Tab through the nav → focus ring is green across desktop and mobile menus.

### 4.6 Mobile menu aria-expanded + nav label
- **What:** `Navbar.astro:15` toggle has `aria-label` but never sets `aria-expanded`; `MobileMenu`'s `<nav>` has no `aria-label`.
- **Action:** In `openMenu()`/`closeMenu()` set `menuToggle.setAttribute("aria-expanded", ...)` (default `false` in markup). Add `aria-label="Mobile"` to the `MobileMenu` `<nav>`.
- **Verify:** Toggle opens → `aria-expanded` flips; screen reader announces expanded/collapsed state.

### 4.7 Growth-stage icons need accessible names in cards
- **What:** `GrowthIcon.astro` alone in cards (`EssayCard:38`, `NoteCard:17`, `ResearchCard:32`, `MusicCard:38`, `NotebookCard:22`, `ShortfilmCard:38`) — the stage is invisible to AT. (PostLayout pairs the icon with text, so it's fine there.)
- **Action:** Pass `title={`${growthStage} stage`}` to astro-icon's `<Icon>` (renders an SVG `<title>`), or add `aria-label` on the icon wrapper.
- **Verify:** Screen reader announces "evergreen stage" when focusing a card.

### 4.8 Add `<h1>` to `now-[slug].astro`
- **What:** `now-[slug].astro:74` renders the title as `<h3>`; there's no `<h1>` — the outline skips from h1(none) to h3.
- **Action:** Change to `<h1 class="title">` (adjust the `--font-size-lg` style if the size changes undesirably).
- **Verify:** Heading outline shows a single h1 per now-update page.

### 4.9 Fix low-contrast metadata text
- **What:** `global.css:25` `--color-gray-500: #8e8f94` (~2.9:1 on cream) fails WCAG AA (needs 4.5:1 for normal text). Used for small card metadata/descriptions across all cards.
- **Action:** Switch the small-text uses to `--color-gray-600` (`#73706d`), or darken `--color-gray-500` itself. Prefer the latter if it doesn't hurt the lighter decorative uses.
- **Verify:** axe contrast check passes on a card; no visual regression on listing pages.

### 4.10 Standardize lang/locale
- **What:** `Layout.astro:55` `lang="en"` vs `:104` `locale: "en_GB"` vs feeds `en-gb` — inconsistent.
- **Action:** Standardize on `lang="en-GB"` in `Layout.astro` (matches the en-GB date formatting used everywhere).
- **Verify:** `<html lang>` and OG locale agree.

---

## Phase 5 — Performance

### 5.1 Wire up self-hosted `@font-face`, drop Google Fonts link
- **What:** `public/fonts/` holds Baskervville/Noto Sans/Noto Serif Display/JetBrains Mono woff2/ttf; `sync-fonts.ts` + `check-fonts.ts` exist and run in the build; but `global.css:50-54` declares `--font-*` with **no `@font-face`**. The live site still pays for a render-blocking Google Fonts request loading 5 families with full weight ranges (`Layout.astro:64-67`). The local fonts currently only feed the OG generator.
- **Action:** Add `@font-face` declarations in `global.css` pointing at `/fonts/*`. Remove the Google Fonts `<link>` from `Layout.astro` (and its preconnect). Verify the weight/style subset matches what's actually used.
- **Verify:** Network tab shows no request to `fonts.googleapis.com`; fonts render correctly; Lighthouse no longer flags render-blocking fonts.
- **Note:** pairs naturally with Phase 3.1 (dark mode) since both touch `global.css` tokens.

### 5.2 Lazy-load card cover images (keep detail-page embeds eager)
- **What:** `MusicCard.astro:28` and `ShortfilmCard.astro:28` use `loading="eager"` for cover images rendered in masonry lists (mostly below the fold), competing with LCP. `EssayCard` already uses `lazy`.
- **Action:** Change the cover `<img loading>` to `"lazy"` in both cards. **Note:** the detail pages (music/shortfilm routes) embed slow third-party players — those embeds should stay eager on their own pages; this change is only the card covers.
- **Verify:** Listing pages lazy-load covers on scroll; detail pages still load embeds eagerly.

### 5.3 Replace Backlinks motion animation with CSS
- **What:** `Backlinks.astro:140-150` imports `motion`'s `animate()` for a one-time 0.3s fade-in — ships a library for a decorative effect, and it isn't re-run after view transitions.
- **Action:** Replace with a CSS `@keyframes` fade-in (or remove the animation). Drop the `motion` import if it's the only usage (grep imports repo-wide first).
- **Verify:** Backlinks still fade in on load and after view transitions; bundle no longer includes `motion` for this.

### 5.4 Scope `content-visibility: auto` to below-fold images
- **What:** `Layout.astro:129-135` applies `img { content-visibility: auto }` to every image including above-the-fold LCP candidates, which can delay rendering and cause scroll-jump (no `contain-intrinsic-size` set).
- **Action:** Scope to a class on below-the-fold images, or add `contain-intrinsic-size` hints. Keep LCP images (e.g. essay covers near the top) eager and un-scoped.
- **Verify:** No scroll-jump on long image-heavy pages; LCP image renders without delay.

### 5.5 Drop redundant `node-fetch`
- **What:** `get-webmentions.ts:2` imports `node-fetch`, but Bun (the runtime for all scripts) has a global `fetch`. It's also a dependency in `package.json:48`.
- **Action:** Remove the import; `bun remove node-fetch`. Confirm no other script imports it (grep).
- **Verify:** `bun run fetch-webmentions` still works; `bun run build` succeeds.

---

## Phase 6 — Content collection validation

### 6.1 Enum-validate `growthStage`
- **What:** `content.config.ts:17,36,134,160,222` use `growthStage: z.string()` for notes, essays, shortfilms, music, notebooks. Every consumer casts to `"seedling"|"budding"|"evergreen"` (`index.astro:110`, `PostLayout.astro:126`). Typos pass the schema.
- **Action:** Change to `z.enum(["seedling","budding","evergreen"])` across all five.
- **Verify:** `bun run build` fails on a deliberately misspelled `growthStage`; succeeds once corrected.

### 6.2 Make `description` consistently required (or guard consumers)
- **What:** `content.config.ts:11` makes `description` optional for notes, but essays/shortfilms/music/notebooks require it (`:30,122,151,217`). `NoteCard`/`PostLayout` render `{description}` — yields `undefined` for notes.
- **Action:** Either require `description` for notes too, or guard consumers (`{frontmatter.description && <p>...}`). Pick one contract.
- **Verify:** A note without a description doesn't render an empty `<p>`; build validation is consistent.

### 6.3 Require `smidgeons.citation.url` (or guard the link)
- **What:** `content.config.ts:109` `citation.url: z.string().optional()`, but `SmidgeonLayout.astro:71` renders `<a href={frontmatter.citation.url}>` — undefined href if omitted.
- **Action:** Either make it `z.string().url()` (required), or guard the `<a>` (`{frontmatter.citation?.url && <a ...>}`).
- **Verify:** A citation smidgeon without a url doesn't render a broken link.

### 6.4 URL-validate `notebooks.interactiveUrl`
- **What:** `content.config.ts:226` `interactiveUrl: z.string()` accepts any string, while `:227` `molabUrl: z.string().url()` is validated. Inconsistent.
- **Action:** Make `interactiveUrl: z.string().url()` (or document why relative paths are allowed).
- **Verify:** Build fails on a malformed `interactiveUrl`.

### 6.5 Drop manual numeric `id` for books/antibooks
- **What:** `content.config.ts:58,71` require a hand-assigned `id: z.number()` in JSON — easy to duplicate/skip. The loader already provides an entry id.
- **Action:** Drop the manual `id` field; use the loader's entry id where an id is needed.
- **Verify:** `bun run build` succeeds; library/antilibrary pages still render correctly.

### 6.6 Add `updated` field to `now` collection
- **What:** `content.config.ts:75-85` — `now` has only `startDate`; every other content type has both `startDate` and `updated`. Editing a now-post leaves no "last tended" date. (The `draft` default-style difference across collections is intentional — leave as is.)
- **Action:** Add `updated: z.coerce.date().optional()` to the `now` schema; render it in `now-[slug].astro` where appropriate.
- **Verify:** An edited now-post shows an "updated" date; build succeeds.

---

## Phase 7 — Consistency & cleanup

### 7.1 Extract `BackLink.astro`
- **What:** The `.back-link` markup (icon + "Back to ...") and ~55-line CSS block are copy-pasted across 9 files: `essays.astro`, `notes.astro`, `music.astro`, `shortfilms.astro`, `notebooks.astro`, `now.astro`, `now-[slug].astro`, `PostLayout.astro`, `SmidgeonLayout.astro`.
- **Action:** Extract `src/components/layouts/BackLink.astro` (props: `href`, `label`) with styles scoped once. Replace all 9 usages. (Pairs with 8.2 — fix the responsive offset here too.)
- **Verify:** Listing/detail pages render identical back-links; single source of truth.

### 7.2 Delete unused `DateToNow.astro`
- **What:** `src/components/layouts/DateToNow.astro` has 0 imports; it's a less-robust duplicate of `RelativeDate.astro` (only handles `YYYY-MM-DD` strings; `RelativeDate` handles ISO/Date and is used in 10 files).
- **Action:** Delete the file.
- **Verify:** `bun run build` still succeeds.

### 7.3 Remove dead patterns/talks cases from `VersionDropdown`
- **What:** `VersionDropdown.astro:11-12` includes `CollectionEntry<"patterns"> | CollectionEntry<"talks">` in the type union; `:30-34` switch cases call `getCollection("patterns")`/`getCollection("talks")`. These collections aren't in `content.config.ts` — the cases are unreachable dead code.
- **Action:** Remove the `patterns`/`talks` cases and union members.
- **Verify:** `bun run build` succeeds; version dropdown still works for active collections.

### 7.4 Consolidate commented-out patterns/talks/podcasts blocks
- **What:** Commented-out blocks scattered across 8+ files (`MainNavLinks`, `index.astro`, `garden.astro`, `[...slug].astro`, `drafts.astro`, `og/[...slug].png.ts`, `generate-links.ts`, `generate-topics.ts`) with `never[] = []` placeholder arrays. Risk of rot.
- **Action:** Consolidate into a single `src/config/enabledCollections.ts` (or similar) that all pages/scripts read, instead of duplicated commented blocks. Remove the inline comments.
- **Verify:** Build succeeds; no behavior change; one place to re-enable a collection.

### 7.5 Remove empty `temp-fonts/` directory
- **What:** `/temp-fonts/` exists at repo root but is empty (leftover from the font-sync workflow).
- **Action:** `rm -rf temp-fonts`; add to `.gitignore` if it's a working dir for the sync script.
- **Verify:** Repo root clean; `bun run sync-fonts` still works.

### 7.6 Extract shared card base styles
- **What:** All cards in `src/components/cards/` share near-identical `.metadata-container`, `.description`, and card base CSS.
- **Action:** Extract shared `.card-base` / `.card-metadata` styles to a shared partial or base `Card.astro`.
- **Verify:** Cards render unchanged; less duplication.

### 7.7 Unify date formatting
- **What:** Three date components (`Dates.astro`, `RelativeDate.astro`, `DateToNow.astro`) plus inline `toLocaleDateString("en-GB", {year, month: "long", day})` in `SmidgeonLayout:36`, `now-[slug]:63`, `drafts:123/146`. Dates render in three different human formats depending on page.
- **Action:** After 7.2 deletes `DateToNow`, add a `formatDate(date)` helper in `utils/date.ts` for absolute dates; use it in the inline calls. Keep `RelativeDate` for "x ago".
- **Verify:** Absolute dates render consistently across pages.

### 7.8 Fix `topics.sort()` mutation
- **What:** `Topics.astro:10` calls `topics.sort()` in place, mutating the caller's array.
- **Action:** `topics.slice().sort()`.
- **Verify:** No behavior change; caller arrays untouched.

### 7.9 Fix `BookCard` hardcoded "View on Google"
- **What:** `BookCard.astro:19` hardcodes "View on Google", but `link` comes from `books.json` (any URL) — mislabels non-Google retailers.
- **Action:** Use a neutral label ("View book") or pass the retailer name from data.
- **Verify:** Library cards label correctly for non-Google links.

---

## Phase 8 — Mobile & responsive

### 8.1 Megamenu clipping on 600–768px viewports
- **What:** `MainNavLinks.astro:620-629` renders a 400px megamenu with `right: -100px`. Just above the 550px mobile-menu cutoff (on cramped ~600px viewports) the desktop nav still shows and the menu can clip/overflow.
- **Action:** Either lower the desktop-nav/mobile-menu breakpoint from 550px to ~640px, or cap `min-width` with `min(400px, calc(100vw - 2rem))`.
- **Verify:** No horizontal overflow/clip between 550–768px widths.

### 8.2 Back-link left-offset collision 1024–1440px
- **What:** `essays.astro:63` uses `left: -2rem` for the back-link, then jumps to `left: 1rem` at 1440px (same in `notes`/`music`/`shortfilms`/`notebooks`/`now`/`PostLayout`/`SmidgeonLayout`). Between 1024–1440px the offset can collide with the page edge.
- **Action:** Use a single responsive value (e.g. `left: 0` on mobile, the negative offset only above a breakpoint where there's room). Best done as part of 7.1 (BackLink extraction).
- **Verify:** Back-link never clips at the page edge across widths.

### 8.3 Topics `max-width: 70%` cramping
- **What:** `Topics.astro:27` caps the topics list at `max-width: 70%`, competing with the dates column — many topics wrap cramped.
- **Action:** Let it flow to 100%, or switch to a wrap layout that doesn't compete with `.metadata-right`.
- **Verify:** Post metadata row reads cleanly with many topics.

---

## Phase 9 — Developer experience

### 9.1 Add `.env.example`
- **What:** No `.env.example` exists. `get-webmentions.ts:9` uses `WEBMENTION_IO_API_KEY`; the Instapaper scripts need 6 vars (`INSTAPAPER_OAUTH_TOKEN`, etc.). The webmentions build silently fetches with `token=undefined` if the key is missing.
- **Action:** Add `.env.example` listing the keys (no values).
- **Verify:** A new contributor can copy `.env.example` → `.env` and fill in.

### 9.2 Guard missing webmention token
- **What:** `get-webmentions.ts:9` silently uses `undefined` if `WEBMENTION_IO_API_KEY` is missing.
- **Action:** `if (!TOKEN) throw new Error("WEBMENTION_IO_API_KEY is required")` (or log + exit 0 gracefully) so the build doesn't silently produce empty data.
- **Verify:** Running the script without the key fails loudly instead of silently.

### 9.3 Add lint/check/format scripts
- **What:** `package.json:5-17` has no lint/check/format scripts despite `.prettierrc` existing. (The Verification section already notes this gap.)
- **Action:** Add `"format": "prettier --write ."`, `"format:check": "prettier --check ."`, and `"check": "astro check"`.
- **Verify:** `bun run check` and `bun run format:check` run cleanly on the existing codebase.

---

## Verification (run after each phase)

```bash
bun run generate-links && bun run generate-topics && bun run fetch-webmentions
bun run build      # must succeed with no new errors
bun run dev        # manually smoke-test: homepage, a post, /garden, /404, /archive, dark mode toggle
```

If lint/typecheck commands exist, run them too (check `package.json` scripts — none are currently defined as `lint`/`typecheck`; `astro check` is the closest).
