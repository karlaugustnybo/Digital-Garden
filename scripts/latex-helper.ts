#!/usr/bin/env node

/**
 * LaTeX Conversion Helper
 * Assists with manual LaTeX to markdown conversion workflow
 */

import fs from 'fs';
import path from 'path';

// Type definitions
interface Equation {
  type: 'inline' | 'display';
  content: string;
  original: string;
  placeholder: string;
}

interface Figure {
  originalPath: string;
  suggestedPath: string;
  placeholder: string;
}

interface LatexAnalysis {
  equations: Equation[];
  figures: Figure[];
  stats: {
    equationCount: number;
    figureCount: number;
    inlineEquations: number;
    displayEquations: number;
  };
}

class LatexHelper {
  private equationCount: number = 0;
  private imageCount: number = 0;

  /**
   * Extract equations from LaTeX content
   */
  extractEquations(latexContent: string): Equation[] {
    const equations: Equation[] = [];

    // Extract inline math $...$
    const inlineRegex = /\$([^$\n]+)\$/g;
    let match: RegExpExecArray | null;
    while ((match = inlineRegex.exec(latexContent)) !== null) {
      equations.push({
        type: 'inline',
        content: match[1],
        original: match[0],
        placeholder: `__EQUATION_${equations.length + 1}__`
      });
    }

    // Extract display math \[...\] and $$...$$
    const displayRegex = /\\\[([\s\S]*?)\\\]|\$\$([\s\S]*?)\$\$/g;
    while ((match = displayRegex.exec(latexContent)) !== null) {
      const content = match[1] || match[2];
      equations.push({
        type: 'display',
        content: content.trim(),
        original: match[0],
        placeholder: `__EQUATION_${equations.length + 1}__`
      });
    }

    return equations;
  }

  /**
   * Extract figure references
   */
  extractFigures(latexContent: string): Figure[] {
    const figures: Figure[] = [];
    const figureRegex = /\\begin{figure}[\s\S]*?\\includegraphics[\s\S]*?{([^}]+)}[\s\S]*?\\end{figure}/g;

    let match: RegExpExecArray | null;
    while ((match = figureRegex.exec(latexContent)) !== null) {
      const filename = match[1].replace(/\.(eps|ps|pdf)$/i, '.png');
      figures.push({
        originalPath: match[1],
        suggestedPath: `/src/assets/papers/${filename}`,
        placeholder: `![Figure ${figures.length + 1}](/src/assets/papers/${filename})`
      });
    }

    return figures;
  }

  /**
   * Create analysis report
   */
  analyzeLatex(latexContent: string): LatexAnalysis {
    const equations = this.extractEquations(latexContent);
    const figures = this.extractFigures(latexContent);

    return {
      equations,
      figures,
      stats: {
        equationCount: equations.length,
        figureCount: figures.length,
        inlineEquations: equations.filter(eq => eq.type === 'inline').length,
        displayEquations: equations.filter(eq => eq.type === 'display').length
      }
    };
  }

  /**
   * Generate equation checklist
   */
  generateEquationChecklist(equations: Equation[]): void {
    console.log('\n=== Equation Conversion Checklist ===\n');

    equations.forEach((eq, index) => {
      console.log(`${index + 1}. ${eq.type.toUpperCase()} EQUATION`);
      console.log(`   Original: ${eq.original}`);
      console.log(`   LaTeX: ${eq.content}`);
      console.log(`   KaTeX: [TODO: Convert to KaTeX format]`);
      console.log(`   Placeholder: ${eq.placeholder}`);
      console.log('');
    });
  }

  /**
   * Generate figure checklist
   */
  generateFigureChecklist(figures: Figure[]): void {
    console.log('\n=== Figure Processing Checklist ===\n');

    figures.forEach((fig, index) => {
      console.log(`${index + 1}. Figure Processing`);
      console.log(`   Original path: ${fig.originalPath}`);
      console.log(`   Target location: ${fig.suggestedPath}`);
      console.log(`   Actions needed:`);
      console.log(`     - Extract figure from PDF/LaTeX`);
      console.log(`     - Convert to PNG/SVG if needed`);
      console.log(`     - Save to assets folder`);
      console.log(`     - Update path in markdown`);
      console.log('');
    });
  }

  /**
   * Process a LaTeX file
   */
  processFile(latexFilePath: string): void {
    try {
      const content = fs.readFileSync(latexFilePath, 'utf8');
      const analysis = this.analyzeLatex(content);

      console.log(`\n📄 LaTeX Analysis: ${path.basename(latexFilePath)}`);
      console.log(`📊 Found ${analysis.stats.equationCount} equations and ${analysis.stats.figureCount} figures`);
      console.log(`   • ${analysis.stats.inlineEquations} inline equations`);
      console.log(`   • ${analysis.stats.displayEquations} display equations`);

      this.generateEquationChecklist(analysis.equations);
      this.generateFigureChecklist(analysis.figures);

      // Save analysis to file
      const analysisPath = latexFilePath.replace('.tex', '-analysis.json');
      fs.writeFileSync(analysisPath, JSON.stringify(analysis, null, 2));
      console.log(`💾 Analysis saved to: ${analysisPath}`);

    } catch (error) {
      console.error(`❌ Error processing file: ${(error as Error).message}`);
    }
  }

  /**
   * Create new research file template
   */
  createResearchTemplate(title: string, authors: string[] = []): string {
    const template = `---
title: "${title}"
authors: ${JSON.stringify(authors)}
date: "${new Date().toISOString().split('T')[0]}"
source: "Journal/Conference Name"
arxiv_id: "xxxx.xxxxx"
topics: ["topic1", "topic2", "topic3"]
stage: "budding"
type: "research"
abstract: "Brief abstract text here..."
---

## Abstract

[Brief abstract from the paper]

## Introduction

[Introduction content converted from LaTeX]

## Main Content

[Main paper content with equations and figures]

## Conclusion

[Conclusion and future work]

## References

[Bibliography in markdown format]
`;

    const filename = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') + '.mdx';

    const filePath = `src/content/research/${filename}`;

    if (!fs.existsSync('src/content/research')) {
      fs.mkdirSync('src/content/research', { recursive: true });
    }

    fs.writeFileSync(filePath, template);
    console.log(`📝 Research template created: ${filePath}`);

    return filePath;
  }
}

// CLI interface
if (require.main === module) {
  const helper = new LatexHelper();
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
🔧 LaTeX Conversion Helper

Usage:
  node latex-helper.ts analyze <latex-file>     # Analyze LaTeX file for equations/figures
  node latex-helper.ts template "<title>"       # Create research file template
  node latex-helper.ts help                     # Show this help

Examples:
  node latex-helper.ts analyze paper.tex
  node latex-helper.ts template "My Research Paper"
`);
    process.exit(0);
  }

  const command = args[0];

  switch (command) {
    case 'analyze':
      if (!args[1]) {
        console.error('❌ Please provide a LaTeX file path');
        process.exit(1);
      }
      helper.processFile(args[1]);
      break;

    case 'template':
      if (!args[1]) {
        console.error('❌ Please provide a paper title');
        process.exit(1);
      }
      helper.createResearchTemplate(args[1], args.slice(2));
      break;

    case 'help':
      console.log(`
🔧 LaTeX Conversion Helper Commands:

analyze <file>    - Analyze LaTeX file and generate checklists
template <title>  - Create new research file template
help              - Show this help message
`);
      break;

    default:
      console.error(`❌ Unknown command: ${command}`);
      console.log('Run "node latex-helper.ts help" for available commands');
      process.exit(1);
  }
}

export default LatexHelper;