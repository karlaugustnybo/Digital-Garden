# Upstream Recommendations — 2026-07-01

Maggie's latest HEAD is `3be9dbb` (2026-06-19). Your HEAD is `4bc25be` (2026-04-12).  
The two repos **no longer share a common Git ancestor**, so changes must be ported manually (content-based comparison).

## 1. Fixes worth applying now

These are small, low-risk, and solve real view-transition / accessibility / build bugs.

### A. View-transition lifecycle helper
Maggie extracted a tiny helper that every client-side component should use to avoid listener leaks after Astro view transitions.

- **New upstream file:** `src/utils/viewTransitionLifecycle.ts`
- **What it does:** runs an init function on first load and after each view-transition navigation, and calls a returned cleanup function before the next swap.
- **Why it matters:** your MobileMenu, Accordion, GardenFilters, Tooltip, TweetEmbed, etc. all attach event listeners and will leak or double-fire after view-transition navigation.
- **Action:** create `src/utils/viewTransitionLifecycle.ts` with the upstream contents, then migrate client scripts from `document.addEventListener("DOMContentLoaded", ...)` and manual cleanup to `onPageLifecycle(...)`.

### B. Accordion accessibility fix
Upstream changed `aria-label="open disclosure"` to `aria-expanded="false"` and toggles it in JS.

- **File:** `src/components/mdx/Accordion.astro`
- **Action:** add `aria-expanded` to the button and toggle it when opening/closing. This is an easy accessibility win.

### C. GrowthStage label interactivity
Upstream made the growth-stage label a `<button>` with focus styles so it is keyboard-accessible.

- **File:** `src/components/layouts/GrowthStage.astro`
- **Action:** replace the `<p>` wrapper with a styled `<button>` and keep the Tooltip. Add `:focus-visible` styles.

### D. MobileMenu motion + leak fix
Upstream completely rewrote `MobileMenu.astro`:
- Uses `transform: translateX(100%)` instead of `right: -100%` (better performance).
- Waits for the close transition to finish before navigating.
- Uses `astro:transitions/client` + the lifecycle helper.
- Adds `prefers-reduced-motion` support.
- **File:** `src/components/layouts/navbar/MobileMenu.astro`

### E. Garden filter fixes
Several recent commits clean up the topic filter popover:
- `#39` custom popovers with live counts
- `#44` scroll arrow buttons for the filter row
- `#45` fix topic-filter clicks blocked by incomplete popover cleanup
- **Files:** `src/components/search/GardenFilters.astro`, `src/components/search/GardenHits.astro`

## 2. Medium-effort improvements to consider

These are larger but valuable.

### F. VersionDropdown view-transition fix
Upstream commit `023ac16` fixes the version dropdown not working after view-transition navigation. If you use content versioning, this is important.

- **File:** `src/components/layouts/VersionDropdown.astro`

### G. Sort-before-slice on the home page
Upstream commit `23efb19` fixes `index.astro` slicing before sorting. Check `src/pages/index.astro` if you show latest posts.

### H. RSS feed refactor
Upstream commit `79d4d05` extracts a `prepareBodyContent` helper and `SANITIZE_OPTIONS` in `rss.xml.js`/`rss.xml.ts`. Your local file is `src/pages/rss.xml.ts`; upstream is `.js`. The refactor removes duplicate body parsing.

### I. ScrollyTalkSection component
Upstream replaced `TalkSlide.astro` slides with a `ScrollyTalkSection.astro` scrollytelling component. If you plan to give talks or want scroll-driven presentations, this is worth copying.

- **New upstream file:** `src/components/mdx/ScrollyTalkSection.astro`

## 3. Probably skip / specific to Maggie

These are tied to her content, branding, or agentic workflow setup.

- `.github/aw/**` agentic workflows (planner, implementer, draft-research, code-quality-improver)
- Her essays, notes, now posts, books, images, podcasts, talks, patterns content
- `public/images/**` covers and book images
- `AGENTS.md` and `.cursor/rules` (you already have `CLAUDE.md`)
- `src/components/unique/**` one-off visualizations for her posts (`GarminData`, `InvisiblesFeature`, `MysteriousVoid`, `XTimeline`, etc.)
- `public/fonts/Canela*` — fonts you are not using
- `public/robots.txt` change that allows all crawlers (she flipped from blocking AI crawlers to allowing them on 2026-05-05)

## 4. How to keep comparing

Run the script I added:

```bash
./scripts/comparison/compare-upstream.sh
```

It will:
1. Fetch `upstream/main`.
2. Export both trees.
3. Write a report to `scripts/comparison/reports/YYYY-MM-DD/summary.md`.
4. Save `diffs/` for `package.json`, `astro.config.mjs`, `tsconfig.json`, `deploy.sh`.

You already have the `upstream` remote configured:

```bash
git remote -v
# upstream  https://github.com/MaggieAppleton/maggieappleton.com-V3.git
```

If you want a quick look at a single upstream file:

```bash
git show upstream/main:src/components/mdx/Accordion.astro
```

## 5. Suggested order of work

1. Add `src/utils/viewTransitionLifecycle.ts`.
2. Migrate `MobileMenu.astro` to the new lifecycle + animation pattern.
3. Apply the `Accordion` and `GrowthStage` accessibility fixes.
4. Review `GardenFilters.astro` / `GardenHits.astro` popover cleanup.
5. Decide whether you want the `ScrollyTalkSection` component.
6. Run `bun run build` and `bun run dev` after each step to catch regressions.
