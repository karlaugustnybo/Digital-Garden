# Research Content Integration Guide

This guide explains how research papers are integrated into the digital garden, including their structure, features, and how they differ from other content types.

## Overview

The research content type provides academic paper functionality with proper mathematical notation support, citation generation, and research-specific metadata. Research papers are fully integrated into the digital garden's wiki-style linking system.

## Research Collection Schema

Research papers are stored as MDX files in `src/content/research/` with the following frontmatter schema:

### Required Fields

```yaml
---
title: "Paper Title"
description: "Brief description of the research"
abstract: "Abstract text (can include LaTeX)"
authors: ["Author 1", "Author 2"]
type: "paper"  # or "preprint", "draft", "talk", "poster", "thesis", "technical-report"
status: "published"  # or "submitted", "in-review", "draft"
published: 2024-06-20  # Publication date
updated: 2024-09-15    # Last updated date
researchArea: ["Machine Learning", "AI Safety", "Interpretability"]
---
```

### Optional Fields

```yaml
---
# Publication Information
venues: ["NeurIPS Workshop", "ICLR"]
arxiv: "https://arxiv.org/abs/..."
doi: "10.1000/..."
pdf: "https://example.com/paper.pdf"

# Additional Resources
code: "https://github.com/..."
data: "https://github.com/..."
slides: "https://docs.google.com/..."
video: "https://youtube.com/..."

# Metadata
methodology: ["Experimental", "Statistical Analysis", "Visualization"]
keywords: ["Neural Networks", "Interpretability", "Activation Patterns"]
featured: false
toc: true  # Table of contents
draft: false
---
```

## File Structure

### Research Content Location
```
src/content/research/
├── ai-alignment-survey.mdx
├── neural-interpretability.mdx
└── [other-research-papers].mdx
```

### Research Layout
Research papers use `src/layouts/ResearchLayout.astro` which provides:
- Academic paper styling
- Citation generation (APA and BibTeX)
- Mathematical notation rendering
- Paper metadata display
- Download and external links

## Integration with Garden Systems

### 1. Content Collections

Research is defined in `src/content/config.ts`:

```typescript
export const researchCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // ... other fields as defined above
  }),
});
```

### 2. Dynamic Routing

Research papers are integrated into the main dynamic route system in `src/pages/[...slug].astro`:

```typescript
// Research papers don't support versioning, so keep the original mapping
...research.map((entry) => ({
  params: { slug: entry.id.replace(/\.mdx$/, "") },
  props: { entry, type: "research" } as const,
})),
```

### 3. Content Type Detection

A type guard function identifies research content:

```typescript
function isResearchFrontmatter(data: any): data is CollectionEntry<"research">["data"] {
  return data.type && ["paper", "preprint", "draft", "talk", "poster", "thesis", "technical-report"].includes(data.type);
}
```

### 4. Layout Selection

Research papers are routed to `ResearchLayout.astro`:

```typescript
) : isResearchFrontmatter(frontmatter) ? (
  <ResearchLayout
    frontmatter={frontmatter}
    headings={headings}
    entry={entry as CollectionEntry<"research">}
  >
    <Content components={components} />
  </ResearchLayout>
) : (
```

## Wiki-Style Linking Integration

### 1. Link Generation

Research papers are included in the link generation system via `src/scripts/build/generate-links.ts`:

```typescript
const researchFiles = getFilesFromDir(path.join(CONTENT_PATH, "research"));
const researchData = getDataForBacklinks(researchFiles, path.join(CONTENT_PATH, "research"));
```

### 2. Growth Stage Mapping

Research papers use status-based growth stages:

```typescript
// Research content doesn't have growthStage or aliases, use defaults
if (filePath.includes("research")) {
  finalAliases = [];
  finalGrowthStage = data.status === "published" ? "evergreen" :
                    data.status === "submitted" ? "budding" : "seedling";
}
```

### 3. Topic Generation

Research papers contribute to the topic system in `src/scripts/build/generate-topics.ts`:

```typescript
const contentDirs = [
  "src/content/essays",
  "src/content/notes",
  "src/content/research",  // Research included here
  "src/content/now",
  "src/content/smidgeons"
];
```

## Research-Specific Features

### 1. Mathematical Notation

Research papers support full LaTeX mathematical notation:

```mdx
For a given input $x$, we extract activation patterns from layer $l$ as:

$$A^l(x) = \sigma(W^l \cdot h^{l-1} + b^l)$$

where $W^l \in \mathbb{R}^{d_l \times d_{l-1}}$ and $b^l \in \mathbb{R}^{d_l}$ are the weight matrix and bias...
```

### 2. Citation Generation

Automatic citation generation in APA and BibTeX formats:

```typescript
const generateAPA = (paper: CollectionEntry<"research">) => {
  const authors = paper.data.authors.join(", ");
  const year = new Date(paper.data.published || paper.data.updated).getFullYear();
  const title = paper.data.title;
  const venue = paper.data.venues?.join(", ") || "";

  return `${authors} (${year}). ${title}. ${venue}`;
};

const generateBibTeX = (paper: CollectionEntry<"research">) => {
  // BibTeX format generation
};
```

### 3. Paper Actions

Download and external links for papers:

- PDF Download
- arXiv Link
- DOI Link
- Code Repository
- Dataset
- Slides
- Video

### 4. Research Areas

Topic badges for research classification:

```astro
{frontmatter.researchArea && frontmatter.researchArea.length > 0 && (
  <div class="paper-topics">
    <h3>Research Areas</h3>
    <div class="topic-badges">
      {frontmatter.researchArea.map((area) => (
        <Badge variant="primary" size="sm">{area}</Badge>
      ))}
    </div>
  </div>
)}
```

## Research Index Page

The main research page (`src/pages/research.astro`) displays:

- Filterable list of research papers
- Search functionality
- Status-based filtering
- Research area filtering
- Featured paper highlighting

## Adding New Research Papers

### 1. Create MDX File

Add a new file to `src/content/research/`:

```bash
# Example: new-paper.mdx
touch src/content/research/new-paper.mdx
```

### 2. Add Frontmatter

```yaml
---
title: "Your New Paper Title"
description: "Brief description of your research"
abstract: "Detailed abstract with LaTeX support: $E = mc^2$"
authors: ["Your Name", "Co-author Name"]
venues: ["Conference Name"]
published: 2024-10-10
updated: 2024-10-10
type: "paper"
status: "published"
researchArea: ["Machine Learning", "AI Safety"]
methodology: ["Experimental", "Statistical Analysis"]
keywords: ["Neural Networks", "Deep Learning"]
featured: false
toc: true
draft: false
arxiv: "https://arxiv.org/abs/..."
doi: "10.1000/..."
pdf: "https://example.com/paper.pdf"
code: "https://github.com/..."
data: "https://github.com/..."
---
```

### 3. Add Content

Write your paper content using MDX with LaTeX support:

```mdx
# Introduction

This paper presents a novel approach to solving $X$ using $Y$.

## Methodology

Our approach uses the following equation:

$$\text{objective} = \sum_{i=1}^{n} f(x_i) + \lambda \cdot \text{regularization}$$

## Results

We evaluated on $\mathbb{R}^{d}$ dimensional space...
```

### 4. Test Integration

Run the development server and verify:

   ```bash
   bun run dev
   ```
Check that:
- Paper appears on research index page
- Individual paper page renders correctly
- LaTeX equations display properly
- Citations generate correctly
- Wiki-style links work
- Navigation includes the paper

## Differences from Other Content Types

### 1. No Versioning
Research papers don't support versioning unlike essays and notes.

### 2. Academic Metadata
Research papers have additional academic-specific metadata:
- Venues and publication information
- Author lists
- Citation formats
- Research area classification

### 3. Specialized Layout
Research papers use a specialized academic paper layout with:
- Citation generation
- Mathematical notation support
- Paper-specific actions (download, external links)
- Academic styling

### 4. Status-Based Growth Stages
Instead of manual growth stages, research papers use status:
- `published` → "evergreen"
- `submitted` → "budding"
- `draft` → "seedling"

## Best Practices

### 1. Content Organization
- Use clear section headings
- Include abstract for all papers
- Use proper mathematical notation
- Add relevant research areas

### 2. Metadata Quality
- Include all publication information
- Add external links when available
- Use appropriate status values
- Select relevant research areas

### 3. Cross-Referencing
- Use wiki-style links to connect to other content
- Reference related papers and notes
- Link to relevant essays and patterns

### 4. Mathematical Content
- Follow the LaTeX guide for proper notation
- Test equations render correctly
- Use consistent notation throughout
- Include definitions for specialized symbols

## Troubleshooting

### Common Issues

1. **Paper not appearing**: Check frontmatter is valid and `draft: false`
2. **LaTeX not rendering**: Verify LaTeX syntax follows the guide
3. **Links not working**: Ensure paper is included in link generation
4. **Citations incorrect**: Check author format and publication data

### Debug Steps

1. **Check Content Collection**: Verify paper is recognized by Astro
2. **Validate Frontmatter**: Ensure all required fields are present
3. **Test LaTeX Rendering**: Check mathematical expressions render
4. **Verify Integration**: Confirm paper appears in searches and links

## Future Enhancements

Potential improvements to research content:

1. **Bibliography Management**: Integration with BibTeX files
2. **Citation Analytics**: Track paper citations and mentions
3. **Collaboration Features**: Multiple author editing capabilities
4. **Advanced Filtering**: More sophisticated search and filtering
5. **Export Options**: PDF generation and citation export
6. **Review System**: Peer review and feedback mechanisms

## Related Documentation

- [LaTeX Support Guide](./LATEX_GUIDE.md) - Mathematical notation details
- [Reimplementation Guide](./REIMPLEMENT_GUIDE.md) - Content type management
- [REIMPLEMENT_GUIDE.md](./REIMPLEMENT_GUIDE.md) - General site structure

## Conclusion

The research content integration provides a robust foundation for academic papers within the digital garden. It combines the flexibility of MDX content with specialized academic features while maintaining full integration with the garden's wiki-style linking and content management systems.