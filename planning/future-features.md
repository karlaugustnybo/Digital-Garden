# Future Features (deferred)

Ideas worth doing later, parked here so they're not lost. Each depends on other work or is a larger effort that's out of scope for the current round.

---

## 1. Book notes linked from the library

**Status:** deferred by user (2026-07-02).

### Why later
`books.json` is currently pure metadata (title, subtitle, author, cover, link). Turning the library into a first-class part of the garden means writing actual notes/highlights per book and connecting them bidirectionally to essays and notes via wiki-links. That's real content work, not just code.

### Plan (when picked up)
- **New collection:** `books-notes` (or extend `books` from a JSON collection to a per-book MDX file collection). Each book gets `src/content/library/<slug>.mdx` with: rating, date read, highlights, takeaways, and standard frontmatter (topics, growthStage, draft, startDate).
- **Schema:** add to `src/content.config.ts` alongside the existing `books`/`antibooks` JSON collections (keep the JSON list as a quick "books I own" shelf; the MDX notes are the deeper layer).
- **Pages:** `src/pages/library/[...slug].astro` for individual book-note pages; update `library.astro` to link each `BookCard` to its note page when one exists.
- **Bidirectional linking:** enable book notes in the wiki-link graph — add `library` to `generate-links.ts` (`getAllPostData`) and to the content graph (`content-graph-plan.md`). An essay that references `[[thinking-fast-and-slow]]` should backlink from the book's note page.
- **Cards:** `BookCard.astro` gains a "has notes" indicator and a growth-stage icon.
- **Reuse:** the versioning, backlinks, and webmention plumbing from `PostLayout` apply directly.

### Out of scope until then
Bibliography graph (below) depends on this.

---

## 2. Bibliography graph

**Status:** deferred (depends on book notes above).

### Why later
Connects books ↔ essays ↔ notes into a citation network. Only meaningful once book notes exist and are in the link graph.

### Plan (when picked up)
- Reuse the content graph infrastructure from `content-graph-plan.md`.
- Add an edge type: `citation` (book → essay that cites it) alongside the existing `wikilink` edges.
- A book node's `degree` then reflects how often it's cited across the garden — a "most-referenced books" ranking falls out for free.
- Consider a dedicated `/library` graph view that isolates the book subgraph.

---

## 3. Newsletter / subscribe

**Status:** deferred by user (2026-07-02).

### Why later
RSS/Atom feeds already exist (`rss.xml.ts`, `atom.xml.ts`, `smidgeons.xml.ts`). A newsletter is the push-channel equivalent for people who don't use RSS readers, but it introduces a third-party service and ongoing maintenance.

### Plan (when picked up)
- **Service:** pick a privacy-respecting, lightweight provider (e.g. Buttondown, EmailOctopus, or Listmonk self-hosted). Avoid Mailchimp/big-tech.
- **Scope:** most natural fit is the **smidgeons stream** (the "tiny thoughts / links" firehose) — a weekly/monthly digest of new smidgeons.
- **Integration:** add a small subscribe form to the footer or the `/smidgeons` page. Embed via the provider's hosted form (no PII flows through the garden's own server) or a single endpoint if self-hosting.
- **No analytics pixels** from the provider beyond open-count; aligns with the "extremely light / privacy-oriented" stance from the main plan.

### Out of scope until then
Building/maintaining a list or sending cadence tooling.
