# Research Lab Design & Implementation Plan

## Executive Summary

This plan outlines the creation of a dedicated **Research Lab** within the digital garden. Unlike the previous hybrid approach, this focuses exclusively on building a robust academic portal designed for high-quality technical documentation, research papers, and mathematical analysis. The architecture shifts from complex API integrations (Overleaf) to a streamlined, high-performance static implementation using MDX and KaTeX.

## 1. Technical Architecture

The Research Lab will be built on a simplified, robust stack focused on performance and typographic quality.

### Core Technology Stack
- **Framework**: Astro (Content Collections)
- **Format**: MDX (Markdown + JSX)
- **Math Engine**: KaTeX (via `remark-math` and `rehype-katex`)
- **Styling**: Custom CSS variables with specific academic focus

### Mathematical Rendering Strategy
Instead of complex server-side rendering or external APIs, we will utilize a local, build-time strategy using the Unified ecosystem. This ensures zero layout shift and maximum performance.

**Configuration Implementation:**
We will adopt the configuration defined in the new LaTeX guide:

1.  **Parser**: `remark-math` to interpret LaTeX syntax in Markdown.
2.  **Renderer**: `rehype-katex` to convert syntax to HTML/CSS.
3.  **Styling**: Local CSS overrides + CDN fallback for the KaTeX stylesheet.

```javascript
// astro.config.mjs integration
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export default defineConfig({
  integrations: [
    mdx({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
  ],
});
```

## 2. Design System: The "Lab" Aesthetic

The Research Lab will possess a distinct visual identity separate from the main garden's "organic" feel. It will lean towards an "Institutional/Academic" aesthetic.

### Visual Identity
- **Typography**:
  - *Body*: High-readability serif (e.g., Charter, Merriweather, or similar) for long-form reading.
  - *Headings*: Clean geometric sans-serif.
  - *Math*: KaTeX default fonts (Computer Modern) for consistency with standard LaTeX papers.
  - *Code*: JetBrains Mono or Fira Code.
- **Color Palette**:
  - Background: White or very light gray (`#f8f9fa`) to mimic paper.
  - Text: High contrast dark gray (`#1a1a1a`) rather than pure black.
  - Accents: `var(--color-academic-blue)` (oklch(60% 0.1 250)) for links and interactive elements.

### Layout Components

#### 1. `ResearchLayout.astro`
The master layout for all research content.
- **Sidebar**: Table of Contents (sticky).
- **Header**: Breadcrumbs (e.g., Lab > ML Safety > Alignment).
- **Footer**: Citation generator and export tools.
- **Assets**: Automatically injects the KaTeX CSS.

```html
<!-- Head injection for ResearchLayout -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/katex@0.15.2/dist/katex.min.css"
/>
```

#### 2. `ProseWrapper`
A container component specifically restricted to an optimal reading width (65-75 characters) to ensure academic readability.

## 3. Content Structure & Schema

We will define a specific Content Collection for research to enforce schema validation.

### Schema Definition (`src/content/config.ts`)

```typescript
const researchCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    abstract: z.string(), // Supports LaTeX
    publishedDate: z.date(),
    status: z.enum(["draft", "review", "published"]),
    tags: z.array(z.string()),
    citations: z.array(z.string()).optional(), // DOI or links
    math: z.boolean().default(true), // Toggles KaTeX CSS loading
  }),
});
```

### Content Types

1.  **Papers**: Full-length articles with abstracts, distinct sections, and bibliographies.
2.  **Notes**: Shorter technical derivations or concept explanations.
3.  **Datasets**: Descriptions of data used, visualized with tables or charts.

## 4. Feature Specification

### LaTeX Support (Simplified)
Based on the guide, the lab will support standard LaTeX syntax within MDX files.

*   **Inline Math**: Wrapped in single dollar signs (e.g., `$E=mc^2$`).
*   **Block Math**: Wrapped in double dollar signs (e.g., `$$...$$`).
*   **Environment Support**: `aligned`, `matrix`, `cases` for complex multi-line equations.

### Citation Management
- **Frontmatter Citations**: Store reference data in frontmatter.
- **Auto-Bibliography**: A component that reads the frontmatter citations and renders a formatted bibliography at the bottom of the page.

### Asset Handling
- **Figures**: Using standard Markdown image syntax but styled with captions (`<figcaption>`).
- **Tables**: Standard Markdown tables styled for academic presentation (borders only on top/bottom/header).

## 5. Implementation Roadmap

### Phase 1: Infrastructure (Week 1)
1.  **Package Installation**: Install `remark-math`, `rehype-katex`, `katex`.
2.  **Config Update**: Modify `astro.config.mjs` to inject the plugins.
3.  **Global CSS**: Add specific overrides for `.katex-display` and `.katex` to match the theme colors (as detailed in the guide).
4.  **Test Page**: Create a "Math Test" page with the exact examples from the LaTeX Support Guide to verify rendering.

### Phase 2: Layout & Components (Week 2)
1.  **Create `ResearchLayout.astro`**: Implement the sidebar and CSS injection.
2.  **Typography Tuning**: Adjust font sizes and line heights specifically for mixed text/math content.
3.  **Mobile Optimization**: Ensure `katex-display` elements scroll horizontally on small screens without breaking the layout.

### Phase 3: Content Migration (Week 3)
1.  **Schema Setup**: Define the `research` content collection.
2.  **Content Creation**: Port existing notes into the new `/research` directory.
3.  **Validation**: Verify that all special characters (underscores in math mode, etc.) are properly escaped or handled as per the "Best Practices" section of the guide.

## 6. Maintenance & Troubleshooting

### Common Issues Resolution
- **Parsing Errors**: Adopt the strict practice of checking for unescaped characters in MDX (like `_` outside of math mode).
- **Performance**: Monitor bundle size; ensures KaTeX CSS is only loaded on pages where `math: true` in frontmatter.
- **Updates**: Regular `pnpm update katex` cycles to ensure symbol support remains current.

This simplified plan removes the complexity of external APIs and focuses on a high-fidelity, high-performance local writing environment that produces professional-grade academic output.