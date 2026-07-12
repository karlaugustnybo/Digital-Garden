# Interactive Content Graph Plan

## Why

The garden already computes a bidirectional **wiki-link graph** at build time (`src/scripts/build/generate-links.ts` → `src/links.json`, with `inboundLinks` / `outboundLinks`). Today this powers inline backlinks. Visualizing it as a force-directed graph turns the "garden" metaphor into something you can actually *see* and navigate — a signature feature for a site about interconnected ideas.

**D3 is already a dependency** (`d3-array`, `d3-axis`, `d3-format`, `d3-scale`, `d3-selection`, `d3-shape`, `d3-time-format` in `package.json`). We'll add `d3-force` (the only missing piece for a force layout).

---

## Architecture

```
build time:  generate-links.ts  ──►  src/links.json  (nodes + edges, already exists)
                                          │
page:        /graph  ─────────►  fetch /links.json (or inline) ──►  d3-force render
```

The graph page is a single client-rendered Astro page. No server, no external data — it reuses the existing link graph plus content collection metadata (title, type, growth stage, topics) for node styling.

---

## Data model

### Extend the build output
`src/links.json` currently stores slug → { inboundLinks, outboundLinks, title, growthStage, ... }. For the graph we want a clean node/edge list. Two options:

**Option A (recommended) — generate a separate graph dataset:**
- Add a step (extend `generate-links.ts` or a new `generate-graph-data.ts`) that emits `src/content/data/graph.json`:
  ```json
  {
    "nodes": [
      { "id": "ai-dark-forest", "title": "AI Dark Forest", "type": "note",
        "growthStage": "evergreen", "topics": ["ai-safety"], "degree": 7,
        "url": "/ai-dark-forest" }
    ],
    "edges": [
      { "source": "ai-dark-forest", "target": "llm-agency", "type": "wikilink" }
    ]
  }
  ```
- `degree` = inbound + outbound count → drives node radius.
- Only include non-draft, latest-version nodes (same filters as the existing link builder).

**Option B — derive on the page** from `links.json` directly. Less work but couples the view to the current `links.json` shape.

Recommend **A** — keeps the graph stable and decoupled.

### Scope of nodes
After the main plan's **1.4 (complete the link graph)** lands, all collections (essays, notes, notebooks, smidgeons, research, music, shortfilms, now) will be in the graph. Build this feature *after* 1.4 so the graph is complete.

---

## Implementation steps

### 1. Add `d3-force`
```bash
bun add d3-force
bun add -D @types/d3-force
```

### 2. Emit graph data at build time
- In `src/scripts/build/generate-links.ts` (or a new sibling script added to the `build` npm script), after computing the link map, write `src/content/data/graph.json` in the node/edge shape above.
- Compute `degree` per node, `type` from the collection, `growthStage`/`topics` from frontmatter, `url` via `getCanonicalUrlFromEntry`.

### 3. Create the page
- `src/pages/graph.astro` — full-bleed canvas, imports `Layout.astro` with a minimal chrome (hide footer optional).
- Loads `graph.json` (import it directly as JSON — Astro supports JSON imports; no fetch needed).
- Renders an `<svg>` sized to the viewport, runs `d3-force` in a client `<script>`.

### 4. The force simulation
A standard d3-force setup:
- `forceSimulation` with `forceLink` (id accessor = `id`), `forceManyBody` (charge, repulsion ~ -200 scaled), `forceCenter`, `forceCollide` (radius from degree).
- Run a few hundred ticks at build/runtime to settle, or just let it animate on load (cheap for <200 nodes; this garden is small).

### 5. Node & edge styling (encode meaning)
- **Node radius** ∝ `degree` (min 4px, max ~22px).
- **Node fill** by `type`: essays (green), notes (brown), smidgeons (light tan), research (purple), etc. — reuse the existing color tokens in `global.css`.
- **Node stroke** by `growthStage`: seedling = dashed thin, budding = solid medium, evergreen = solid thick.
- **Edges**: thin translucent lines; thicker/highlighted on hover of a node (show only that node's neighborhood).
- **Labels**: show title on hover (use the existing `Tooltip.astro` / Tippy.js, or a d3-tipped approach). Avoid always-on labels — they overlap.

### 6. Interaction
- **Hover a node** → highlight its neighborhood (dim non-neighbors, emphasize edges + labels).
- **Click a node** → navigate to its `url` (respect view transitions — use `astro:transitions` client API so the page transition is smooth).
- **Drag** → fix a node (d3 drag behavior with `fx`/`fy`).
- **Legend** → small panel mapping color → type and stroke → growth stage.
- Optional filter chips (reuse topic/type logic from `GardenFilters.astro`) to filter visible nodes.

### 7. Accessibility & perf
- Provide a fallback: a `<noscript>` list of all nodes by degree (most-connected first), so the info isn't locked behind JS.
- `prefers-reduced-motion` → render a pre-settled static layout instead of animating.
- Lazy-load the page (don't include in critical path) — it's a destination, not the homepage.

---

## Layout options to consider

- **Free force layout** (default) — organic, matches "garden" metaphor.
- **Grouped by topic** — `forceCluster`/`forceManyBody` with cluster centers per topic; nice but can get cramped.
- **Radial by type** — collections as concentric rings.

Ship the free layout first; add a toggle if it's worth it.

---

## Verification

```bash
bun run build          # emits graph.json + builds /graph
bun run dev            # open /graph → nodes render, settle, hover highlights, click navigates
```
- Confirm node count matches non-draft content count.
- Confirm a known wiki-link pair shows an edge between them.
- Confirm navigation from a node uses a view transition (no full reload).
- Confirm `prefers-reduced-motion: reduce` disables animation.
- Confirm `<noscript>` fallback lists all nodes.

## Dependencies on other plans
- Requires **main plan 1.4** (complete the link graph) to ship first, otherwise only essays/notes/notebooks appear.
- Optional: tie into **main plan 2.7** (keyboard shortcut `g` could go to garden; consider `G` → graph, or add `/graph` to the shortcuts help).
