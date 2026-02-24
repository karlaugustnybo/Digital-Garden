import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";

const parser = new MarkdownIt();

/** Strip markdown formatting to produce plain text for descriptions */
export function stripMarkdown(text: string): string {
    return text
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links → text only
        .replace(/[*_`~]/g, ""); // formatting characters
}

/** Convert relative URLs to absolute */
export function makeAbsolute(url: string, siteUrl: string): string {
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    if (url.startsWith("/")) return siteUrl + url;
    return siteUrl + "/" + url;
}

/** Fix <img> tags with relative src to absolute URLs */
export function fixImagePaths(html: string, siteUrl: string): string {
    return html.replace(
        /<img([^>]*)\ssrc="([^"]*)"([^>]*)>/g,
        (_match, before, src, after) => {
            return `<img${before} src="${makeAbsolute(src, siteUrl)}"${after}>`;
        },
    );
}

/** Strip MDX component tags, converting image components to standard HTML */
export function stripMDXComponents(text: string, siteUrl: string): string {
    return (
        text
            // ResourceBook → link + author
            .replace(
                /<ResourceBook[\s\S]*?url="([^"]*)"[\s\S]*?title="([^"]*)"[\s\S]*?author="([^"]*)"[\s\S]*?image=\{([^}]*)\}[\s\S]*?>([\\s\S]*?)<\/ResourceBook>/g,
                (_match, url, title, author, _image, content) => {
                    const clean = content.trim();
                    return `<a href="${url}"><strong>${title}</strong></a> by ${author}${clean ? `\n\n${clean}` : ""}`;
                },
            )
            // BasicImage → <img>
            .replace(
                /<BasicImage[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/>/g,
                (_match, src, alt) =>
                    `<img src="${makeAbsolute(src, siteUrl)}" alt="${alt}" />`,
            )
            // RemoteImage → <img>
            .replace(
                /<RemoteImage[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/>/g,
                (_match, src, alt) =>
                    `<img src="${makeAbsolute(src, siteUrl)}" alt="${alt}" />`,
            )
            // Remove Spacer components
            .replace(/<Spacer[^>]*\/>/g, "")
            // Remove other self-closing MDX tags
            .replace(/<([A-Z][A-Za-z]*)[^>]*\/>/g, "")
            // Remove other MDX tags with content
            .replace(/<([A-Z][A-Za-z]*)[\s\S]*?<\/\1>/g, "")
    );
}

/** Remove import statements from MDX body content */
export function stripImports(body: string): string {
    return body
        .split("\n")
        .filter((line) => !line.startsWith("import"))
        .join("\n");
}

/** Full content processing pipeline: imports → MDX → markdown → images → sanitize */
export function processContentForFeed(
    body: string | undefined,
    siteUrl: string,
): string {
    if (!body) return "";
    const withoutImports = stripImports(body);
    const withoutMDX = stripMDXComponents(withoutImports, siteUrl);
    const rendered = parser.render(withoutMDX);
    const absoluteImages = fixImagePaths(rendered, siteUrl);
    return sanitizeHtml(absoluteImages, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
        allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            img: ["src", "alt"],
        },
    });
}

/** Build the description string for a smidgeon post */
export function buildSmidgeonDescription(post: any): string {
    const firstLine =
        post.body
            ?.split("\n")
            .filter(
                (line: string) => !line.startsWith("import") && line.trim() !== "",
            )[0] || "";

    if (post.data.external) {
        return `${post.data.external.title} by ${post.data.external.author || "Unknown"}`;
    }
    if (post.data.citation) {
        return `${post.data.citation.title} by ${post.data.citation.authors.join(", ")}`;
    }
    return stripMarkdown(firstLine || "");
}

/** Build the HTML content for a smidgeon post (with link prefix) */
export function buildSmidgeonContent(post: any, siteUrl: string): string {
    const prefix = post.data.external
        ? `<a href="${post.data.external.url}">${post.data.external.title}</a>\n\n`
        : post.data.citation
            ? `<a href="${post.data.citation.url}">${post.data.citation.title}</a>\n\n`
            : "";

    const processed = processContentForFeed(post.body, siteUrl);
    return prefix + processed;
}
