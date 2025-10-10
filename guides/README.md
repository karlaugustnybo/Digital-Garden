# Digital Garden Documentation Guides

This directory contains comprehensive documentation guides for the digital garden's features, implementation details, and maintenance procedures.

## Available Guides

### 📚 **[LaTeX Support Guide](./LATEX_GUIDE.md)**
Mathematical notation implementation and usage for research papers and academic content.

**Topics Covered:**
- KaTeX configuration and setup
- Inline and display math syntax
- Mathematical symbols and notation
- Complex equation examples
- Troubleshooting and best practices

### 📖 **[Research Content Guide](./RESEARCH_CONTENT_GUIDE.md)**
Complete guide to research paper integration and academic features.

**Topics Covered:**
- Research collection schema and frontmatter
- Academic metadata and citations
- Integration with garden systems
- Adding new research papers
- Wiki-style linking for research

### 🔧 **[Reimplementation Guide](./REIMPLEMENT_GUIDE.md)**
Step-by-step instructions for enabling/disabled content types and site features.

**Topics Covered:**
- Temporarily disabled content types (Patterns, Talks, Podcasts)
- Content collection configuration
- Navigation and routing setup
- Selective reimplementation procedures

### 🌐 **[Site Guide](./SITE_GUIDE.md)**
Overview of site structure, features, and general usage.

**Topics Covered:**
- Site architecture and organization
- Content types and their purposes
- Navigation and user experience
- Development workflow

## Quick Reference

### For Content Creators
- **Adding Research Papers**: See [Research Content Guide](./RESEARCH_CONTENT_GUIDE.md#adding-new-research-papers)
- **Using LaTeX**: See [LaTeX Support Guide](./LATEX_GUIDE.md#usage-in-mdx-content)
- **Content Organization**: See [Site Guide](./SITE_GUIDE.md)

### For Developers
- **Site Architecture**: See [Site Guide](./SITE_GUIDE.md#site-structure)
- **Content Collections**: See [Reimplementation Guide](./REIMPLEMENT_GUIDE.md#content-collections)
- **LaTeX Implementation**: See [LaTeX Support Guide](./LATEX_GUIDE.md#implementation-details)

### For Maintenance
- **Updating Features**: See [Reimplementation Guide](./REIMPLEMENT_GUIDE.md)
- **LaTeX Updates**: See [LaTeX Support Guide](./LATEX_GUIDE.md#maintenance)
- **Content Management**: See [Research Content Guide](./RESEARCH_CONTENT_GUIDE.md#maintenance)

## Getting Started

1. **New to the site?** Start with the [Site Guide](./SITE_GUIDE.md)
2. **Adding research content?** Read the [Research Content Guide](./RESEARCH_CONTENT_GUIDE.md)
3. **Need mathematical notation?** Check the [LaTeX Support Guide](./LATEX_GUIDE.md)
4. **Modifying site features?** Consult the [Reimplementation Guide](./REIMPLEMENT_GUIDE.md)

## Documentation Style

All guides follow a consistent structure:
- **Clear overview** and purpose
- **Step-by-step instructions** for complex procedures
- **Code examples** with proper syntax highlighting
- **Troubleshooting sections** for common issues
- **Cross-references** to related documentation
- **Best practices** and maintenance considerations

## Contributing to Documentation

When adding new documentation:
1. Follow the established style and structure
2. Include practical examples and code snippets
3. Add troubleshooting sections for common issues
4. Cross-reference related guides
5. Update this index file

## File Structure

```
guides/
├── README.md                     # This file - guide index
├── LATEX_GUIDE.md               # Mathematical notation documentation
├── RESEARCH_CONTENT_GUIDE.md    # Research paper integration guide
├── REIMPLEMENT_GUIDE.md         # Content type restoration procedures
└── SITE_GUIDE.md               # General site overview and usage
```

## Related Resources

- **Main README**: `../README.md` - Project overview and quick start
- **Content Collections**: `../src/content/config.ts` - Collection definitions
- **Site Configuration**: `../astro.config.mjs` - Astro configuration
- **Global Styles**: `../src/global.css` - Site-wide styling

---

**Last Updated**: 2025-10-10
**Maintainer**: Karl August Krogh Nybo