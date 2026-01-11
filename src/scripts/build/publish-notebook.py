#!/usr/bin/env python3
# /// script
# requires-python = ">=3.12"
# dependencies = ["marimo", "pyyaml", "beautifulsoup4"]
# ///
"""
Marimo Notebook Publisher

Converts Marimo Python notebooks to:
1. Static MDX for Astro content collection
2. WASM HTML bundle for interactive browser execution

Usage:
    uv run scripts/publish-notebook.py notebooks/my-notebook.py

Output:
    - src/content/notebooks/{slug}.mdx
    - public/interactive/{slug}/
"""

import subprocess
import sys
import re
import os
from pathlib import Path
from datetime import datetime
import yaml
import json
from bs4 import BeautifulSoup


def extract_metadata_from_notebook(notebook_path: Path) -> dict:
    """
    Extract metadata from the first markdown cell or docstring in a Marimo notebook.
    Looks for YAML frontmatter within mo.md() calls or in module docstrings.
    """
    content = notebook_path.read_text()
    
    # Default metadata
    slug = notebook_path.stem
    metadata = {
        "title": slug.replace("-", " ").title(),
        "description": f"Interactive notebook: {slug}",
        "type": "notebook",
        "startDate": datetime.now().strftime("%Y-%m-%d"),
        "updated": datetime.now().strftime("%Y-%m-%d"),
        "topics": [],
        "growthStage": "seedling",
        "draft": False,
        "toc": True,
        "sourceFile": f"notebooks/{notebook_path.name}",
        "interactiveUrl": f"/interactive/{slug}/index.html",
        "wasmCompatible": True,
        "molabUrl": None,
    }
    
    # Try multiple patterns for metadata extraction
    yaml_content = None
    
    # Pattern 1: YAML in module docstring (triple-quoted string after imports)
    docstring_pattern = r'^\s*"""\s*\n---\s*\n(.*?)\n---'
    match = re.search(docstring_pattern, content, re.MULTILINE | re.DOTALL)
    if match:
        print("    Found metadata in docstring")
        yaml_content = match.group(1)
    else:
        print("    No metadata docstring found")
    
    # Pattern 2: YAML in mo.md() call
    if not yaml_content:
        momd_pattern = r'mo\.md\s*\(\s*[rf]*"""---\s*\n(.*?)\n---'
        match = re.search(momd_pattern, content, re.DOTALL)
        if match:
            yaml_content = match.group(1)
    
    if yaml_content:
        try:
            parsed = yaml.safe_load(yaml_content)
            if isinstance(parsed, dict):
                # Merge with defaults
                for key, value in parsed.items():
                    if key in metadata:
                        metadata[key] = value
                    # Map common aliases
                    elif key == "date":
                        metadata["startDate"] = value
                    elif key == "molab_url":
                        metadata["molabUrl"] = value
        except yaml.YAMLError as e:
            print(f"Warning: Could not parse YAML frontmatter: {e}")
    
    return metadata


def run_marimo_export_md(notebook_path: Path) -> str:
    """Run marimo export md and return the markdown content."""
    result = subprocess.run(
        ["marimo", "export", "md", str(notebook_path)],
        capture_output=True,
        text=True,
        input="n\n",  # Answer 'no' to sandbox prompt
    )
    
    if result.returncode != 0:
        print(f"Error exporting markdown: {result.stderr}")
        sys.exit(1)
    
    return result.stdout


def extract_preload_assets(html_path: Path) -> list[str]:
    """
    Parses the generated index.html to find modulepreload links and scripts.
    Returns a list of relative paths (e.g. "assets/index-....js")
    """
    if not html_path.exists():
        return []
        
    try:
        with open(html_path, 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f, 'html.parser')
            
        assets = []
        
        # Get modulepreloads
        for link in soup.find_all('link', rel='modulepreload'):
            href = link.get('href')
            if href and href.startswith('./'):
                assets.append(href[2:]) # Remove ./ prefix
                
        # Get main module script
        for script in soup.find_all('script', type='module'):
            src = script.get('src')
            if src and src.startswith('./'):
                assets.append(src[2:])
                
        # Get CSS
        for link in soup.find_all('link', rel='stylesheet'):
            href = link.get('href')
            if href and href.startswith('./'):
                assets.append(href[2:])
                
        return assets
    except Exception as e:
        print(f"Warning: Failed to extract assets from {html_path}: {e}")
        return []


def inject_site_favicons(html_path: Path):
    """
    Replaces Marimo's default favicon with the site's favicon set.
    """
    if not html_path.exists():
        return
        
    try:
        with open(html_path, 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f, 'html.parser')
            
        # Remove existing icons
        for link in soup.find_all('link', rel=lambda x: x and 'icon' in x.lower()):
            link.decompose()
            
        # Add site favicons
        head = soup.head
        if head:
            favicons = [
                {'rel': 'apple-touch-icon', 'sizes': '180x180', 'href': '/images/favicon/apple-touch-icon.png'},
                {'rel': 'icon', 'type': 'image/png', 'sizes': '96x96', 'href': '/images/favicon/favicon-96x96.png'},
                {'rel': 'icon', 'href': '/images/favicon/favicon.ico'},
                {'rel': 'icon', 'type': 'image/svg+xml', 'href': '/images/favicon/favicon.svg'},
            ]
            
            for favicon in favicons:
                tag = soup.new_tag('link', **favicon)
                head.append(tag)
                
            with open(html_path, 'w', encoding='utf-8') as f:
                f.write(str(soup))
                
            print("    ✅ Injected site favicons")
            
    except Exception as e:
        print(f"Warning: Failed to inject favicons into {html_path}: {e}")


def run_marimo_export_wasm(notebook_path: Path, output_dir: Path) -> bool:
    """Run marimo export html-wasm to create interactive bundle."""
    output_dir.mkdir(parents=True, exist_ok=True)
    
    result = subprocess.run(
        [
            "marimo", "export", "html-wasm",
            "--mode", "run",
            "-o", str(output_dir),
            str(notebook_path),
        ],
        capture_output=True,
        text=True,
        input="n\n",  # Answer 'no' to sandbox prompt
    )
    
    if result.returncode != 0:
        print(f"Error exporting WASM: {result.stderr}")
        # Don't exit - WASM export may fail for some packages
        print("Warning: WASM export failed. Setting wasmCompatible to false.")
        return False
    
    return True


def transform_markdown_to_mdx(markdown: str, metadata: dict, preload_assets: list[str] = None) -> str:
    """
    Transform marimo markdown export to valid MDX for Astro.
    
    - Strips marimo's own frontmatter
    - Removes docstring metadata blocks
    - Adds Astro-compatible frontmatter
    - Preserves LaTeX notation
    - Converts wiki-links if present
    """
    lines = markdown.split("\n")
    
    # Skip marimo's frontmatter if present
    content_lines = []
    in_frontmatter = False
    frontmatter_count = 0
    
    for line in lines:
        if line.strip() == "---":
            frontmatter_count += 1
            if frontmatter_count <= 2:
                continue
        elif frontmatter_count < 2:
            continue
        content_lines.append(line)
    
    content = "\n".join(content_lines).strip()
    
    # Remove docstring metadata block that may have leaked through
    # Pattern: starts with "title:" or other frontmatter-like content and ends with '"""'
    content = re.sub(
        r'^title:.*?---\s*"""',
        '',
        content,
        flags=re.MULTILINE | re.DOTALL
    )
    content = content.strip()
    
    # Generate Astro frontmatter
    frontmatter_lines = ["---"]
    for key, value in metadata.items():
        if isinstance(value, bool):
            frontmatter_lines.append(f"{key}: {str(value).lower()}")
        elif isinstance(value, list):
            if value:
                frontmatter_lines.append(f"{key}:")
                for item in value:
                    frontmatter_lines.append(f"  - {item}")
            else:
                frontmatter_lines.append(f"{key}: []")
        elif isinstance(value, str) and ("\n" in value or ":" in value or '"' in value):
            # Multi-line or special chars need quoting
            escaped = value.replace('"', '\\"')
            frontmatter_lines.append(f'{key}: "{escaped}"')
        else:
            frontmatter_lines.append(f"{key}: {value}")
    
    # Add preloadAssets
    if preload_assets:
        frontmatter_lines.append("preloadAssets:")
        for asset in preload_assets:
            frontmatter_lines.append(f"  - {asset}")
    else:
        frontmatter_lines.append("preloadAssets: []")

    frontmatter_lines.append("---")
    
    frontmatter = "\n".join(frontmatter_lines)
    
    # Add import for NotebookBanner component
    imports = """
import NotebookBanner from "../../components/notebooks/NotebookBanner.astro";
"""
    
    # Add banner at the top of content
    molab_url = metadata.get("molab_url") or metadata.get("molabUrl")
    molab_jsx = "null" if molab_url is None else f'"{molab_url}"'
    # Use the passed preload_assets argument, defaulting to metadata if not provided
    assets_to_use = preload_assets if preload_assets is not None else metadata.get("preloadAssets", [])
    # Serialize to JSON array for prop
    preload_jsx = json.dumps(assets_to_use)
    banner = f'<NotebookBanner interactiveUrl="{metadata["interactiveUrl"]}" molabUrl={{{molab_jsx}}} preloadAssets={{{preload_jsx}}} />'
    
    return f"{frontmatter}\n{imports}\n{banner}\n\n{content}"


def main():
    if len(sys.argv) < 2:
        print("Usage: uv run scripts/publish-notebook.py <notebook.py>")
        sys.exit(1)
    
    notebook_path = Path(sys.argv[1])
    
    if not notebook_path.exists():
        print(f"Error: Notebook not found: {notebook_path}")
        sys.exit(1)
    
    slug = notebook_path.stem
    project_root = Path(__file__).parent.parent.parent.parent
    
    print(f"📓 Publishing notebook: {notebook_path.name}")
    
    # 1. Extract metadata
    print("  → Extracting metadata...")
    metadata = extract_metadata_from_notebook(notebook_path)
    
    # 2. Export markdown
    print("  → Exporting markdown...")
    markdown = run_marimo_export_md(notebook_path)
    
    # 3. Export WASM
    print("  → Exporting WASM bundle...")
    wasm_output_dir = project_root / "public" / "interactive" / slug
    wasm_success = run_marimo_export_wasm(notebook_path, wasm_output_dir)
    
    if wasm_success:
        # Inject favicons
        inject_site_favicons(wasm_output_dir / "index.html")
    
    if not wasm_success:
        metadata["wasmCompatible"] = False
    
    # 4. Transform to MDX
    print("  → Generating MDX...")
    preload_assets = []
    if wasm_success:
        preload_assets = extract_preload_assets(wasm_output_dir / "index.html")
        print(f"    Found {len(preload_assets)} assets to preload")

    mdx_content = transform_markdown_to_mdx(markdown, metadata, preload_assets)
    
    # 5. Write MDX file
    mdx_output = project_root / "src" / "content" / "notebooks" / f"{slug}.mdx"
    mdx_output.parent.mkdir(parents=True, exist_ok=True)
    mdx_output.write_text(mdx_content)
    
    print(f"✅ Published notebook:")
    print(f"   MDX:  {mdx_output.relative_to(project_root)}")
    if wasm_success:
        print(f"   WASM: {wasm_output_dir.relative_to(project_root)}/")
    else:
        print(f"   WASM: (skipped - not compatible)")


if __name__ == "__main__":
    main()
