import fs from "fs/promises";
import path from "path";
import { createHash } from "crypto";
import { FONT_ASSETS, FONT_DIR } from "../../config/fonts";

const MANIFEST_PATH = path.join(FONT_DIR, "fonts-manifest.json");

function sha256(buffer: Buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

async function downloadFont(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status} ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function run() {
  await fs.mkdir(FONT_DIR, { recursive: true });

  const managedFileNames = new Set(FONT_ASSETS.map((asset) => asset.fileName));
  const manifestAssets: Array<{
    id: string;
    family: string;
    weight: number;
    style: "normal" | "italic";
    usedBy: Array<"site" | "og">;
    fileName: string;
    sourceUrl: string;
    size: number;
    sha256: string;
  }> = [];

  for (const asset of FONT_ASSETS) {
    const outPath = path.join(FONT_DIR, asset.fileName);
    const fontBuffer = await downloadFont(asset.sourceUrl);
    await fs.writeFile(outPath, fontBuffer);

    manifestAssets.push({
      ...asset,
      size: fontBuffer.length,
      sha256: sha256(fontBuffer),
    });

    console.log(`Synced ${asset.fileName}`);
  }

  const existingEntries = await fs.readdir(FONT_DIR, { withFileTypes: true });
  for (const entry of existingEntries) {
    if (!entry.isFile()) {
      continue;
    }

    const isFontFile = /\.(ttf|otf|woff|woff2)$/i.test(entry.name);
    if (!isFontFile) {
      continue;
    }

    if (!managedFileNames.has(entry.name)) {
      await fs.unlink(path.join(FONT_DIR, entry.name));
      console.log(`Removed stale font ${entry.name}`);
    }
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    assets: manifestAssets,
  };

  await fs.writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`Updated manifest ${MANIFEST_PATH}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
