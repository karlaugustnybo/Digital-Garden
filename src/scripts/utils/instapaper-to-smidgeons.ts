#!/usr/bin/env bun
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import * as crypto from "node:crypto";
import * as readline from "node:readline";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const INSTAPAPER_API_BASE = "https://www.instapaper.com/api/1";
const OAUTH_VERSION = "1.0";
const OAUTH_SIGNATURE_METHOD = "HMAC-SHA1";

// Load environment variables from .env file in project root
const projectRoot = path.resolve(__dirname, "../../..");
const envPath = path.join(projectRoot, ".env");

try {
  const envContent = await fs.readFile(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed === "" || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let value = trimmed.slice(eqIdx + 1).trim();
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    if (key) process.env[key] = value;
  }
} catch {
  // .env may not exist, that's fine
}

interface OAuthToken {
  token: string;
  tokenSecret: string;
}

interface InstapaperTag {
  id: number;
  name: string;
}

interface InstapaperBookmark {
  bookmark_id: number;
  url: string;
  title: string;
  description?: string;
  time: number;
  private_source?: string;
  tags: InstapaperTag[];
}

function percentEncode(str: string): string {
  return encodeURIComponent(str).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
}

function generateNonce(): string {
  return crypto.randomBytes(16).toString("hex");
}

function generateTimestamp(): string {
  return Math.floor(Date.now() / 1000).toString();
}

function buildOAuthSignature(
  method: string,
  url: string,
  params: Record<string, string>,
  consumerSecret: string,
  tokenSecret = ""
): string {
  const sortedKeys = Object.keys(params).sort();
  const normalizedParams = sortedKeys.map((k) => `${percentEncode(k)}=${percentEncode(params[k])}`).join("&");
  const baseString = `${method.toUpperCase()}&${percentEncode(url)}&${percentEncode(normalizedParams)}`;
  const signingKey = `${percentEncode(consumerSecret)}&${percentEncode(tokenSecret)}`;
  return crypto.createHmac("sha1", signingKey).update(baseString).digest("base64");
}

function buildAuthorizationHeader(
  oauthParams: Record<string, string>
): string {
  const parts = Object.entries(oauthParams).map(([k, v]) => `${percentEncode(k)}="${percentEncode(v)}"`);
  return `OAuth ${parts.join(", ")}`;
}

async function fetchOAuthToken(
  consumerKey: string,
  consumerSecret: string,
  username: string,
  password: string
): Promise<OAuthToken> {
  const url = `${INSTAPAPER_API_BASE}/oauth/access_token`;
  const timestamp = generateTimestamp();
  const nonce = generateNonce();

  const oauthParams: Record<string, string> = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: nonce,
    oauth_signature_method: OAUTH_SIGNATURE_METHOD,
    oauth_timestamp: timestamp,
    oauth_version: OAUTH_VERSION,
  };

  const bodyParams: Record<string, string> = {
    x_auth_username: username,
    x_auth_password: password,
    x_auth_mode: "client_auth",
  };

  // Signature must include both OAuth and body params
  const allParams = { ...oauthParams, ...bodyParams };
  oauthParams.oauth_signature = buildOAuthSignature("POST", url, allParams, consumerSecret);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: buildAuthorizationHeader(oauthParams),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(bodyParams).toString(),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to get OAuth token: ${response.status} ${text}`);
  }

  const text = await response.text();
  const parsed = new URLSearchParams(text);
  const token = parsed.get("oauth_token");
  const tokenSecret = parsed.get("oauth_token_secret");

  if (!token || !tokenSecret) {
    throw new Error(`Unexpected OAuth response format: ${text}`);
  }

  return { token, tokenSecret };
}

async function fetchBookmarks(token: OAuthToken, consumerKey: string, consumerSecret: string, folderId: string): Promise<InstapaperBookmark[]> {
  const url = `${INSTAPAPER_API_BASE}/bookmarks/list`;
  const timestamp = generateTimestamp();
  const nonce = generateNonce();

  const bodyParams: Record<string, string> = {
    folder_id: folderId,
    limit: "500",
  };

  const oauthParams: Record<string, string> = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: nonce,
    oauth_signature_method: OAUTH_SIGNATURE_METHOD,
    oauth_timestamp: timestamp,
    oauth_token: token.token,
    oauth_version: OAUTH_VERSION,
  };

  const allParams = { ...oauthParams, ...bodyParams };
  oauthParams.oauth_signature = buildOAuthSignature("POST", url, allParams, consumerSecret, token.tokenSecret);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: buildAuthorizationHeader(oauthParams),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(bodyParams).toString(),
  });

  const rawText = await response.text();

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${rawText}`);
  }

  // Instapaper returns bookmarks as a JSON array with "type" fields
  const data = JSON.parse(rawText) as Array<{
    type: string;
    bookmark_id?: number;
    url?: string;
    title?: string;
    description?: string;
    time?: number;
    private_source?: string;
    tags?: InstapaperTag[];
    error_code?: number;
    message?: string;
  }>;

  const errorItem = data.find((item) => item.type === "error");
  if (errorItem) {
    throw new Error(`API error ${errorItem.error_code}: ${errorItem.message}`);
  }

  const bookmarks = data
    .filter((item) => item.type === "bookmark")
    .map((item) => ({
      bookmark_id: item.bookmark_id!,
      url: item.url!,
      title: item.title || "Untitled",
      description: item.description,
      time: item.time || Math.floor(Date.now() / 1000),
      private_source: item.private_source,
      tags: item.tags || [],
    }));

  return bookmarks;
}

async function fetchAllBookmarks(token: OAuthToken, consumerKey: string, consumerSecret: string): Promise<InstapaperBookmark[]> {
  const folders = ["unread", "archive", "starred"];
  const allBookmarks = new Map<number, InstapaperBookmark>();

  // Fetch all three folders in parallel
  const results = await Promise.allSettled(
    folders.map((folderId) => fetchBookmarks(token, consumerKey, consumerSecret, folderId))
  );

  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    if (result.status === "fulfilled") {
      for (const b of result.value) {
        allBookmarks.set(b.bookmark_id, b); // deduplicate by bookmark_id
      }
    } else {
      console.warn(`  Warning: Could not fetch folder '${folders[i]}': ${result.reason.message}`);
    }
  }

  return Array.from(allBookmarks.values());
}


async function getExistingBookmarkUrls(smidgeonsDir: string): Promise<Set<string>> {
  const existingUrls = new Set<string>();
  const instapaperDir = path.join(smidgeonsDir, "instapaper");

  try {
    const entries = await fs.readdir(instapaperDir, { withFileTypes: true });
    // Only check .mdx files
    const files = entries.filter((e) => e.isFile() && e.name.endsWith(".mdx"));
    // Read all files in parallel
    const contents = await Promise.all(
      files.map((f) => fs.readFile(path.join(instapaperDir, f.name), "utf-8"))
    );
    for (const content of contents) {
      // Fast regex search: url: "..."
      const match = content.match(/url:\s*"([^"]+)"/);
      if (match?.[1]) {
        existingUrls.add(match[1]);
      }
    }
  } catch {
    // instapaper/ directory might not exist yet
  }
  return existingUrls;
}

async function saveOAuthTokenToEnv(token: OAuthToken): Promise<void> {
  let envContent = "";
  try {
    envContent = await fs.readFile(envPath, "utf-8");
  } catch {
    // .env doesn't exist yet
  }

  const lines = envContent.split("\n");
  const newLines: string[] = [];
  let hasToken = false;
  let hasTokenSecret = false;

  for (const line of lines) {
    if (line.startsWith("INSTAPAPER_OAUTH_TOKEN=")) {
      newLines.push(`INSTAPAPER_OAUTH_TOKEN="${token.token}"`);
      hasToken = true;
    } else if (line.startsWith("INSTAPAPER_OAUTH_TOKEN_SECRET=")) {
      newLines.push(`INSTAPAPER_OAUTH_TOKEN_SECRET="${token.tokenSecret}"`);
      hasTokenSecret = true;
    } else {
      newLines.push(line);
    }
  }

  const additions: string[] = [];
  if (!hasToken) {
    additions.push(`INSTAPAPER_OAUTH_TOKEN="${token.token}"`);
  }
  if (!hasTokenSecret) {
    additions.push(`INSTAPAPER_OAUTH_TOKEN_SECRET="${token.tokenSecret}"`);
  }

  if (additions.length > 0) {
    // Ensure there's a blank line before new entries if file has content and doesn't end with newline
    const finalLines = newLines.length > 0 && newLines[newLines.length - 1].trim() !== ""
      ? [...newLines, "", ...additions]
      : [...newLines, ...additions];
    await fs.writeFile(envPath, finalLines.join("\n") + "\n");
  } else {
    await fs.writeFile(envPath, newLines.join("\n"));
  }

  // Also update process.env so the rest of the run can use it
  process.env.INSTAPAPER_OAUTH_TOKEN = token.token;
  process.env.INSTAPAPER_OAUTH_TOKEN_SECRET = token.tokenSecret;

  console.log("  Saved OAuth token to .env for future runs.");
}

function loadSavedOAuthToken(): OAuthToken | null {
  const token = process.env.INSTAPAPER_OAUTH_TOKEN;
  const tokenSecret = process.env.INSTAPAPER_OAUTH_TOKEN_SECRET;
  if (token && tokenSecret) {
    return { token, tokenSecret };
  }
  return null;
}

function sanitizeTitle(title: string): string {
  return title
    .replace(/[<>&"]/g, "")
    .trim();
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function makeFilename(bookmark: InstapaperBookmark): string {
  const dateObj = new Date(bookmark.time * 1000);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const slug = slugify(bookmark.title).slice(0, 80);
  return `${year}-${month}-${slug}.mdx`;
}

function makeFrontmatter(bookmark: InstapaperBookmark): string {
  const dateStr = new Date(bookmark.time * 1000).toISOString();
  const title = sanitizeTitle(bookmark.title);
  const yamlTitle = title.replace(/"/g, '\\"');
  const yamlUrl = bookmark.url.replace(/"/g, '\\"');

  const frontmatter = `---
title: "${yamlTitle}"
startDate: ${dateStr}
type: "smidgeon"
topics: ["What I'm reading"]
draft: true
external:
  url: "${yamlUrl}"
  title: "${yamlTitle}"
  author: ""
---
`;
  return frontmatter;
}

function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  const consumerKey = process.env.INSTAPAPER_CONSUMER_KEY;
  const consumerSecret = process.env.INSTAPAPER_CONSUMER_SECRET;

  if (!consumerKey || !consumerSecret) {
    console.error("Error: INSTAPAPER_CONSUMER_KEY and INSTAPAPER_CONSUMER_SECRET must be set in .env or environment.");
    process.exit(1);
  }

  console.log("Instapaper → Smidgeons");
  console.log("-----------------------");

  let oauthToken: OAuthToken | null = loadSavedOAuthToken();

  if (oauthToken) {
    console.log("Using saved OAuth token from .env");
  } else {
    console.log("No saved OAuth token found. Authenticating...");

    let username = process.env.INSTAPAPER_USERNAME;
    let password = process.env.INSTAPAPER_PASSWORD;

    if (!username) {
      username = await prompt("Instapaper email/username: ");
    }
    if (!password) {
      password = await prompt("Instapaper password (leave blank if none): ");
    }

    console.log("\nAuthenticating with Instapaper...");
    oauthToken = await fetchOAuthToken(consumerKey, consumerSecret, username, password);
    console.log("Authenticated successfully!");

    await saveOAuthTokenToEnv(oauthToken);
  }

  console.log("\nFetching all bookmarks (unread, archive, starred)...");
  let bookmarks = await fetchAllBookmarks(oauthToken, consumerKey, consumerSecret);
  console.log(`Found ${bookmarks.length} bookmark(s) in total.\n`);

  if (bookmarks.length === 0) {
    console.log("No bookmarks found.");
    return;
  }

  // Filter to only articles tagged "Digital Garden" in Instapaper
  const beforeFilter = bookmarks.length;
  const TARGET_TAG = "Digital Garden";
  bookmarks = bookmarks.filter((b) =>
    b.tags.some((t) => t.name === TARGET_TAG)
  );
  console.log(`Filtered by Instapaper tag "${TARGET_TAG}"`);
  console.log(`  ${beforeFilter} => ${bookmarks.length} bookmark(s) matched.\n`);

  const smidgeonsDir = path.resolve(__dirname, "../../content/smidgeons");
  const instapaperDir = path.join(smidgeonsDir, "instapaper");
  await fs.mkdir(instapaperDir, { recursive: true });
  const existingUrls = await getExistingBookmarkUrls(smidgeonsDir);

  const newBookmarks = bookmarks.filter((b) => !existingUrls.has(b.url));
  const skippedCount = bookmarks.length - newBookmarks.length;

  if (skippedCount > 0) {
    console.log(`${skippedCount} bookmark(s) already exist as smidgeons, skipping.\n`);
  }

  if (newBookmarks.length === 0) {
    console.log("No new bookmarks to convert.");
    return;
  }

  console.log(`Creating ${newBookmarks.length} new smidgeon(s)...\n`);

  for (const bookmark of newBookmarks) {
    const filename = makeFilename(bookmark);
    const filePath = path.join(instapaperDir, filename);

    let finalPath = filePath;
    let collisionCount = 1;
    while (await fs.access(finalPath).then(() => true).catch(() => false)) {
      const base = filename.replace(/\.mdx$/, "");
      finalPath = path.join(instapaperDir, `${base}-${collisionCount}.mdx`);
      collisionCount++;
    }

    const frontmatter = makeFrontmatter(bookmark);
    await fs.writeFile(finalPath, frontmatter);
    console.log(`  ✓ ${path.basename(finalPath)} — ${bookmark.title.slice(0, 60)}`);
  }

  console.log(`\nDone! Created ${newBookmarks.length} new smidgeon(s) in src/content/smidgeons/instapaper/`);
}

main().catch((err) => {
  console.error("\nError:", err.message || err);
  process.exit(1);
});
