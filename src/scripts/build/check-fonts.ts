import fs from "fs/promises";
import path from "path";
import { createHash } from "crypto";
import { FONT_ASSETS, FONT_DIR, OG_FONT_SPECS } from "../../config/fonts";

const MANIFEST_PATH = path.join(FONT_DIR, "fonts-manifest.json");
const EXPECTED_SITE_FAMILIES = new Set(["Noto Serif Display", "Baskervville", "JetBrains Mono", "Noto Sans"]);

function sha256(buffer: Buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function fail(message: string): never {
  throw new Error(message);
}

async function readText(filePath: string) {
  return fs.readFile(filePath, "utf-8");
}

async function run() {
  let manifestRaw: string;
  try {
    manifestRaw = await readText(MANIFEST_PATH);
  } catch {
    fail(`Missing ${MANIFEST_PATH}. Run \`bun run sync-fonts\`.`);
  }

  const manifest = JSON.parse(manifestRaw) as {
    assets: Array<{ id: string; fileName: string; sha256: string }>;
  };

  const expectedIds = new Set(FONT_ASSETS.map((asset) => asset.id));
  const manifestIds = new Set(manifest.assets.map((asset) => asset.id));

  for (const expectedId of expectedIds) {
    if (!manifestIds.has(expectedId)) {
      fail(`Manifest missing font asset id: ${expectedId}`);
    }
  }

  for (const manifestId of manifestIds) {
    if (!expectedIds.has(manifestId)) {
      fail(`Manifest contains unexpected font asset id: ${manifestId}`);
    }
  }

  for (const asset of FONT_ASSETS) {
    const filePath = path.join(FONT_DIR, asset.fileName);
    let buffer: Buffer;
    try {
      buffer = await fs.readFile(filePath);
    } catch {
      fail(`Missing font file: ${filePath}. Run \`bun run sync-fonts\`.`);
    }

    const assetHash = sha256(buffer);
    const manifestEntry = manifest.assets.find((entry) => entry.id === asset.id);
    if (!manifestEntry) {
      fail(`No manifest entry for ${asset.id}`);
    }
    if (assetHash !== manifestEntry.sha256) {
      fail(`Checksum mismatch for ${filePath}. Run \`bun run sync-fonts\`.`);
    }
  }

  const existingEntries = await fs.readdir(FONT_DIR, { withFileTypes: true });
  const managedFileNames = new Set(FONT_ASSETS.map((asset) => asset.fileName));
  for (const entry of existingEntries) {
    if (!entry.isFile()) {
      continue;
    }
    if (/\.(ttf|otf|woff|woff2)$/i.test(entry.name) && !managedFileNames.has(entry.name)) {
      fail(`Stale unmanaged font file detected: ${path.join(FONT_DIR, entry.name)}`);
    }
  }

  const globalCssPath = "./src/global.css";
  const globalCss = await readText(globalCssPath);
  for (const family of EXPECTED_SITE_FAMILIES) {
    if (!globalCss.includes(`\"${family}\"`) && !globalCss.includes(`'${family}'`)) {
      fail(`Expected family ${family} not found in ${globalCssPath}`);
    }
  }

  const ogPagePaths = ["./src/pages/og.png.ts", "./src/pages/og/[...slug].png.ts"];
  for (const ogPath of ogPagePaths) {
    const source = await readText(ogPath);
    if (!source.includes("OG_FONT_SPECS")) {
      fail(`OG route does not use OG_FONT_SPECS: ${ogPath}`);
    }
  }

  const configuredOgFamilies = new Set(
    FONT_ASSETS.filter((asset) => asset.usedBy.includes("og")).map((asset) => asset.family),
  );
  for (const ogFont of OG_FONT_SPECS) {
    if (!configuredOgFamilies.has(ogFont.name)) {
      fail(`OG font family ${ogFont.name} missing from FONT_ASSETS with usedBy: og`);
    }
  }

  console.log("Font checks passed");
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
