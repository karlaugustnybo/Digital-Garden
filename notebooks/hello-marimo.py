# /// script
# requires-python = ">=3.12"
# dependencies = ["marimo"]
# ///
"""
---
title: Hello Marimo
description: A simple demonstration of Marimo notebooks in the Digital Garden
topics:
  - programming
  - python
growthStage: seedling
---
"""

import marimo

__generated_with = "0.19.2"
app = marimo.App(width="medium")


@app.cell
def _(mo):
    mo.md("""
    # Hello, Marimo!

    This is a simple Marimo notebook integrated into the Digital Garden.
    
    Marimo notebooks can be:
    - **Static** - read as regular content with syntax highlighting
    - **Interactive** - run Python code directly in your browser via WebAssembly
    """)
    return


@app.cell
def _(mo):
    # A simple interactive counter
    counter = mo.ui.slider(1, 10, value=5, label="Count: ")
    mo.md(f"""
    ## Interactive Example
    
    Move the slider to change the count:
    
    {counter}
    
    Result: {"🎉 " * counter.value}
    """)
    return (counter,)


@app.cell
def _(mo):
    mo.md(r"""
    ## Math Support
    
    LaTeX is fully supported:
    
    The quadratic formula: $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$
    
    Euler's identity: $e^{i\pi} + 1 = 0$
    """)
    return


@app.cell
def _():
    import marimo as mo
    return (mo,)


if __name__ == "__main__":
    app.run()
