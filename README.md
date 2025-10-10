# karlaugustnybo.com, Version 3

This is the source code for karlaugust.vercel.app, a digital garden filled with growing notes, essays,
and design patterns.

It's open source to let people poke around and get ideas for their own garden. However, I'd rather
you didn't fork it wholesale in order to build your own garden. First because my code is
questionable at best, and second because I designed it according to my own aesthetic preferences,
and functional needs / desires. Yours won't be the same.

It's also awkward when I stumble on someone else's website that is an exact expression of my own
design taste and identity. Like walking in on someone wearing your clothing. That said, you can do
what you like on the web and I'm not going to make a huge fuss about it.

I strongly encourage you to build your own garden!

## Tech Stack

Built with Astro

MDX with LaTeX support (KaTeX)
Backlinks and wiki-style linking
Research papers with academic features
Tooltip hover previews with Tippy.js
Masonry grids with just CSS
Webmentions with Brid.gy and Webmention.io
Typed collections – essays, notes, research, patterns, talks, podcasts, smidgeons, library, antilibrary, and
now updates

## Notes to Myself

To run locally: `pnpm run dev`
To deploy: `./deploy.sh`

- Runs `git push`
- Runs `pnpm run build`
- Runs `vercel --prod`

Building locally for speed and Astro's image caching.

## Documentation

Comprehensive guides are available in the [`guides/`](./guides/) directory:

- **[📚 LaTeX Support Guide](./guides/LATEX_GUIDE.md)** - Mathematical notation implementation and usage
- **[📖 Research Content Guide](./guides/RESEARCH_CONTENT_GUIDE.md)** - Research paper integration and features
- **[🔧 Reimplementation Guide](./guides/REIMPLEMENT_GUIDE.md)** - Content type management and restoration
- **[🌐 Site Guide](./guides/SITE_GUIDE.md)** - Site overview and general usage

See the [guides index](./guides/README.md) for a complete overview of all available documentation.
