Convert this LaTeX document to markdown. Keep ALL math exactly as it is - do not change any equations.

**Rules:**
- Section headers: \section{} → ##, \subsection{} → ###
- Bold text: \textbf{} → **text**
- Italic text: \textit{} → *text*
- Lists: \item → -
- Citations: \cite{author2024} → [Author, 2024]
- Figures: Replace with ![description](image.png)
- Tables: Convert to markdown table format
- **IMPORTANT: Keep ALL math unchanged** - both $inline$ and $$display$$ math

**Example:**
If I give you:
```latex
\section{Introduction}
This is a \textbf{test} with the equation $E = mc^2$ and:

$$\int_0^1 x^2 dx = \frac{1}{3}$$
```

You should output:
```markdown
## Introduction
This is a **test** with the equation $E = mc^2$ and:

$$\int_0^1 x^2 dx = \frac{1}{3}$$
```

**Add this frontmatter at the top:**
```yaml
---
title: "Paper Title"
authors: ["Author Name"]
date: "2024-XX-XX"
source: "Journal Name"
arxiv_id: "xxxx.xxxxx"
topics: ["topic1", "topic2"]
stage: "budding"
type: "research"
abstract: "Brief abstract here..."
---
```

**Your LaTeX content:**
[Paste your LaTeX here]