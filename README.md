# Karl August's Digital Garden

A personal website and digital garden built with Astro, featuring growing notes, essays, research papers, shortfilms and music, focused on machine learning, AI safety, and the creative arts.

**Live at:** [karlaugust.vercel.app](https://karlaugust.vercel.app)

## Overview

This is my digital garden — a space where ideas grow, evolve, and interconnect. It's a living collection of thoughts, research, and creative explorations that I cultivate over time. The garden metaphor reflects my approach to knowledge: nothing is ever truly finished, everything is always growing.

## Architecture & Tech Stack

### Core Framework
- **Astro 5** - Modern static site generator with island architecture
- **JavaScript/TypeScript** - Primary development language
- **React** - Used sparingly for interactive components
- **MDX** - Rich content with embedded React components

### Content & Features
- **MDX with LaTeX support** - Mathematical notation via KaTeX
- **Wiki-style linking** - `[[internal links]]` with bidirectional backlinks
- **Research papers** - Academic features with citations, DOIs, and metadata
- **Growth stages** - Content maturity indicators (seedling → budding → evergreen)
- **Content versioning** - Folder-based versioning with automatic canonical URLs
- **Dynamic OG images** - Generated using Satori and Sharp
- **Webmentions** - Social interactions via webmention.io + Brid.gy
- **Tooltip previews** - Hover previews with Tippy.js
- **Masonry grids** - Pure CSS responsive layouts

### Dependencies
- **D3.js** - Data visualizations (when needed)
- **Motion** - Smooth animations and transitions
- **Astro Icon** - Icon optimization and management
- **Partytown** - Third-party script isolation for performance

## Content Collections

### Active Collections ✅
- **Essays** - Opinionated, longform narrative writing with an agenda
- **Notes** - Loose, unopinionated notes on various topics
- **Research** - Academic papers, preprints, and technical reports with full metadata
- **Smidgeons** - A stream of interesting links, papers, and tiny thoughts
- **Now** - Current status and activities updates
- **Library/Antilibrary** - Books I've read and books I want to read
- **Shortfilms** - A collection of short films
- **Pages** - Static content pages (about, hire me, etc.)

### Temporarily Disabled Collections 🚫 (moved to `src/content/disabled/`)
- **Patterns** - Design pattern catalogue (disabled 2025-10-05)
- **Talks** - Conference presentations (disabled 2025-10-05)
- **Podcasts** - Interview appearances (disabled 2025-10-05)

*See the [Reimplementation Guide](./guides/REIMPLEMENT_GUIDE.md) for instructions on re-enabling these content types.*

## Key Features

### Wiki-Style Linking
- Automatic bidirectional linking between content
- Hover previews with rich content snippets
- Support for aliases and redirects
- Visual backlink indicators

### Content Growth System
- **Seedling** - New, rough ideas and initial thoughts
- **Budding** - Developing concepts with more structure
- **Evergreen** - Mature, well-developed content
- Automatic growth stage tracking and filtering

### Research Features (WIP)
- Academic paper formatting with full metadata
- DOI and arXiv integration
- Citation management
- Author and venue tracking
- Publication status workflow

### Performance & UX
- Optimized image processing with Sharp
- View transitions for smooth navigation
- Minimal JavaScript loading
- Mobile-first responsive design
- Fast static site generation


### Quick Start
```bash
# Clone the repository
git clone https://github.com/HourGlassDk/Digital-Garden.git
cd Digital-Garden

# Install dependencies
bun install

# Start development server
bun run dev
```

### Available Scripts
```bash
bun run dev          # Start development server with content processing
bun run build        # Production build with webmention fetching
bun run preview      # Preview production build locally
bun run generate-links  # Process wiki-style internal links
bun run fetch-webmentions  # Update webmentions from API
bun run smidgeon     # Create new smidgeon entry
bun run date         # Get current date for content
```

### Build Process
The development and build processes include several automated steps:
1. **Link Generation** - Processes wiki-style `[[internal links]]` and creates backlinks
2. **Topic Generation** - Auto-generates topic index from content frontmatter
3. **Webmention Fetching** - Retrieves social interactions from webmention.io
4. **Static Site Generation** - Builds the final optimized site

## Content Management

### Creating New Content
Content is organized in collections under `src/content/`. Each collection has its own schema defined in `src/content/config.ts`.

### Frontmatter Structure
Most content types share common fields:
```yaml
title: "Content Title"
description: "Brief description"
startDate: 2024-01-01
updated: 2024-01-15
topics: ["topic1", "topic2"]
growthStage: "budding"  # seedling, budding, evergreen
draft: false  # Hide from production
```

### Wiki Links
Use double brackets for internal linking:
```md
Check out my [[machine-learning]] notes for more details.
```

### Mathematical Content
LaTeX support is built-in:
```md
$$
E = mc^2
$$
```

## Project Structure

```
src/
├── assets/              # Static assets and icons
├── components/          # Reusable Astro/React components
│   ├── animated-icons/  # Animated SVG icons
│   ├── cards/           # Card layouts for different content types
│   ├── layouts/         # Component-level layouts (navbar, footer, etc.)
│   ├── mdx/             # MDX-specific components
│   └── search/          # Search functionality components
├── content/             # Content collections
│   ├── essays/          # Longform essays
│   ├── notes/           # Knowledge notes
│   ├── research/        # Academic papers
│   ├── smidgeons/       # Micro-content
│   ├── shortfilms/      # Short films collection
│   ├── now/             # Now page updates
│   ├── disabled/        # Archived collections
│   ├── data/            # Static data files
│   ├── books.json       # Library data
│   └── antibooks.json   # Antilibrary data
├── layouts/             # Page-level Astro layouts
├── pages/               # Route pages and API endpoints
├── plugins/             # Remark/Rehype plugins
├── scripts/             # Build and utility scripts
├── styles/              # Global styles
├── types/               # TypeScript type definitions
└── utils/               # Shared utility functions
```

## Deployment

### Manual Deployment
```bash
# Deploy to production
./deploy.sh
```

The deploy script:
1. Pushes changes to git
2. Runs production build
3. Deploys to Vercel

### Environment Variables
Create `.env.local` for development:
```env
WEBMENTION_IO_API_KEY=your_api_key
```

## Documentation

Comprehensive guides are available in the [`guides/`](./guides/) directory:

- **[📚 LaTeX Support Guide](./guides/LATEX_GUIDE.md)** - Mathematical notation implementation
- **[📖 Research Content Guide](./guides/RESEARCH_CONTENT_GUIDE.md)** - Academic paper features
- **[🔧 Reimplementation Guide](./guides/REIMPLEMENT_GUIDE.md)** - Content type restoration
- **[🌐 Site Guide](./guides/SITE_GUIDE.md)** - Complete site overview

See the [guides index](./guides/README.md) for all documentation.

## Philosophy & Credits

### Digital Gardening Approach
- **Growing over finalizing** - Content evolves and matures over time
- **Connection over isolation** - Ideas link and reference each other
- **Process over product** - The journey of thinking is as important as the result
- **Personal over universal** - This reflects my unique perspective and interests

### Major Credit: Maggie Appleton
This digital garden builds heavily upon the incredible work of **Maggie Appleton** ([maggieappleton.com](https://maggieappleton.com)), whose open-source digital garden codebase has been a foundational inspiration and starting point. Maggie's pioneering work in digital gardening, wiki-style linking, and growth stage concepts has fundamentally shaped the architecture and philosophy of this implementation.

While I have significantly extended, modified, and adapted her codebase to fit my specific needs — adding research paper functionality, LaTeX support, and various custom features — the core DNA of this system traces back to Maggie's innovative approach to personal knowledge management on the web.

Her commitment to open source and digital gardening as a practice has created an incredible foundation that others can build upon, and I'm deeply grateful for her willingness to share her work so generously.

If you're interested in digital gardening, I highly recommend exploring Maggie's work and writing on the subject.

## Contributing

While this is a personal project, I'm open to:
- Bug reports and issues
- Performance optimization suggestions
- Accessibility improvements
- Security vulnerability disclosures

Please note that content contributions are not accepted as this represents my personal knowledge garden.

## License

This project is open source. See the [LICENSE](./LICENSE) file for details.

---

**Built with ❤️ and Astro**
