# LaTeX Support Guide

This guide explains how LaTeX mathematical notation is implemented and used in the digital garden for research papers and academic content.

## Overview

The site supports LaTeX mathematical notation using KaTeX rendering, enabling proper display of mathematical equations, symbols, and formulas in MDX content. This is primarily used for research papers but can be used in any MDX content.

## Implementation Details

### Packages Used

- **remark-math**: Parses LaTeX math syntax in Markdown
- **rehype-katex**: Renders parsed LaTeX as KaTeX HTML
- **katex**: The KaTeX library for fast math rendering

### Configuration Files

#### 1. Astro Configuration (`astro.config.mjs`)

```javascript
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

// In MDX integration:
mdx({
  remarkPlugins: [remarkMath, remarkWikiLink],
  rehypePlugins: [rehypeKatex],
  shikiConfig: {
    theme: "night-owl",
    wrap: true,
  },
}),
```

#### 2. Layout CSS Import (`src/layouts/Layout.astro`)

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/katex@0.15.2/dist/katex.min.css"
/>
```

#### 3. Global Styling (`src/global.css`)

```css
/* KaTeX text color styling */
.katex-display {
  color: var(--color-black) !important;
}

.katex {
  color: var(--color-black) !important;
}

.katex .base {
  color: var(--color-black) !important;
}
```

## Usage in MDX Content

### Inline Math

Use single dollar signs `$...$` for inline mathematical expressions:

```mdx
The famous mass-energy equivalence formula: $E = mc^2$

The quadratic formula: $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$

Euler's identity: $e^{i\pi} + 1 = 0$
```

### Display Math

Use double dollar signs `$$...$$` for displayed equations on their own line:

```mdx
The Gaussian integral:

$$ \int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi} $$

The definition of the Riemann zeta function:

$$ \zeta(s) = \sum_{n=1}^{\infty} \frac{1}{n^s} $$
```

### Mathematical Symbols and Notation

#### Greek Letters
```mdx
$\alpha$, $\beta$, $\gamma$, $\delta$, $\epsilon$, $\pi$
```

#### Operators
```mdx
$\sum$, $\prod$, $\int$, $\partial$, $\nabla$
```

#### Relations
```mdx
$\leq$, $\geq$, $\approx$, $\sim$, $\propto$
```

#### Logical Symbols
```mdx
$\forall$, $\exists$, $\neg$, $\wedge$, $\vee$
```

#### Sets and Spaces
```mdx
$\mathbb{R}$, $\mathbb{N}$, $\mathbb{Z}$, $\mathbb{Q}$, $\mathbb{C}$
```

#### Common Functions
```mdx
$\text{UMAP}(A^l(X), n_{components}=2)$

$\text{DBSCAN}(A^l_{red}, \epsilon, \text{min\_samples})$
```

### Complex Equations

#### Multi-line Equations
```mdx
Maxwell's equations in differential form:

$$
\begin{aligned}
\nabla \cdot \mathbf{E} &= \frac{\rho}{\varepsilon_0} \\
\nabla \cdot \mathbf{B} &= 0 \\
\nabla \times \mathbf{E} &= -\frac{\partial \mathbf{B}}{\partial t} \\
\nabla \times \mathbf{B} &= \mu_0\left(\mathbf{J} + \varepsilon_0 \frac{\partial \mathbf{E}}{\partial t}\right)
\end{aligned}
$$
```

#### Complex Mathematical Expressions
```mdx
The UMAP algorithm minimizes the cross-entropy between fuzzy simplicial sets:

$$\mathcal{L}_{\text{UMAP}} = \sum_{ij} \left[ y_{ij} \log\left(\frac{y_{ij}}{x_{ij}}\right) + (1-y_{ij}) \log\left(\frac{1-y_{ij}}{1-x_{ij}}\right) \right]$$
```

## Examples from Research Content

### Neural Network Equations

```mdx
For a given input $x$, we extract activation patterns from layer $l$ as:

$$A^l(x) = \sigma(W^l \cdot h^{l-1} + b^l)$$

where $W^l \in \mathbb{R}^{d_l \times d_{l-1}}$ and $b^l \in \mathbb{R}^{d_l}$ are the weight matrix and bias of layer $l$, and $\sigma$ is the activation function. The resulting activation vector $A^l(x) \in \mathbb{R}^{d_l}$ captures the neural response patterns for that specific input.
```

### Clustering Algorithms

```mdx
We use density-based clustering to identify recurring activation patterns:

$$\mathcal{C} = \text{DBSCAN}(A^l_{red}, \epsilon, \text{min\_samples})$$

DBSCAN identifies clusters based on point density, where a point $p$ is a core point if:

$$|N_\epsilon(p)| \geq \text{min\_samples}$$

where $N_\epsilon(p) = \{q \mid \text{dist}(p,q) \leq \epsilon\}$ is the $\epsilon$-neighborhood of point $p$.
```

## Best Practices

### 1. Escape Special Characters
In MDX, some characters need to be escaped:

```mdx
# Use \_ instead of _ for underscores in math mode
$\text{min\_samples}$

# Use \text{} for regular text within math mode
$\text{UMAP}$ instead of $UMAP$
```

### 2. Use Appropriate Delimiters
- **Inline math**: `$...$` for short expressions within text
- **Display math**: `$$...$$` for standalone equations

### 3. Keep Readability in Mind
- Break down complex equations into multiple lines when possible
- Use `\text{}` for descriptive text within equations
- Ensure mathematical notation is consistent throughout the document

### 4. Test Rendering
Always test your LaTeX expressions by running the development server:

```bash
bun run dev
```

Check that equations render correctly and are properly formatted.

## Troubleshooting

### Common Issues

1. **MDX Parsing Errors**: Ensure all LaTeX commands are properly escaped
2. **Missing Symbols**: Check if the symbol is supported by KaTeX
3. **Formatting Issues**: Verify proper use of math mode delimiters

### Error Messages

- "Could not parse expression with acorn": Usually indicates improper escaping in LaTeX
- "Unexpected token": Check for unmatched brackets or incorrect syntax

### Debugging Tips

1. **Start Simple**: Test with basic equations first, then add complexity
2. **Check Syntax**: Validate LaTeX syntax in external tools if needed
3. **Browser Console**: Check for JavaScript errors during rendering

## Research Content Integration

The LaTeX support is particularly important for the **Research** content type. Research papers use the `ResearchLayout.astro` layout which automatically includes:

- Mathematical notation rendering
- Academic paper styling
- Citation generation
- Proper typography for technical content

### Research Collection Schema

Research content supports LaTeX in the following fields:

- **Abstract**: Can include mathematical expressions
- **Content**: Full MDX content with LaTeX support
- **Methodology sections**: Technical descriptions with equations

## Adding LaTeX to New Content Types

To add LaTeX support to other content types:

1. Ensure the content uses MDX format
2. Use the `ProseWrapper` component for consistent styling
3. Include mathematical expressions using the syntax described above
4. Test rendering with the development server

## Performance Considerations

- KaTeX is faster than MathJax but still requires client-side rendering
- Complex equations may impact initial page load time
- Consider lazy loading for pages with extensive mathematical content
- The KaTeX CSS is loaded from CDN for better caching

## Maintenance

### Updating KaTeX

To update the KaTeX version:

1. Update the CDN link in `Layout.astro`
2. Update the local package: `bun update katex`
3. Test all mathematical content for compatibility

### Adding New Mathematical Symbols

If you need symbols not supported by KaTeX:

1. Check KaTeX documentation for supported functions
2. Consider custom definitions if needed
3. Test thoroughly across different content types

## Resources

- [KaTeX Documentation](https://katex.org/docs/)
- [remark-math GitHub](https://github.com/remarkjs/remark-math)
- [rehype-katex GitHub](https://github.com/remarkjs/remark-rehype-katex)
- [LaTeX Mathematical Symbols](https://en.wikibooks.org/wiki/LaTeX/Mathematics)

## Conclusion

This LaTeX implementation provides robust mathematical notation support for academic and technical content in the digital garden. It's particularly valuable for research papers but can enhance any content requiring mathematical precision.

The setup follows Astro best practices and is easily maintainable and extensible for future needs.