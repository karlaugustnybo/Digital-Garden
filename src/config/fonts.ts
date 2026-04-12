export type FontUsage = "site" | "og";

export type FontAsset = {
  id: string;
  family: string;
  weight: number;
  style: "normal" | "italic";
  usedBy: FontUsage[];
  fileName: string;
  sourceUrl: string;
};

export const FONT_ASSETS: FontAsset[] = [
  {
    id: "noto-serif-display-400-normal",
    family: "Noto Serif Display",
    weight: 400,
    style: "normal",
    usedBy: ["site", "og"],
    fileName: "NotoSerifDisplay-Regular.ttf",
    sourceUrl: "https://raw.githubusercontent.com/notofonts/notofonts.github.io/main/fonts/NotoSerifDisplay/unhinted/ttf/NotoSerifDisplay-Regular.ttf",
  },
  {
    id: "noto-sans-400-normal",
    family: "Noto Sans",
    weight: 400,
    style: "normal",
    usedBy: ["site", "og"],
    fileName: "NotoSans-Regular.ttf",
    sourceUrl: "https://raw.githubusercontent.com/notofonts/notofonts.github.io/main/fonts/NotoSans/unhinted/ttf/NotoSans-Regular.ttf",
  },
  {
    id: "baskervville-400-normal",
    family: "Baskervville",
    weight: 400,
    style: "normal",
    usedBy: ["site"],
    fileName: "Baskervville-Regular.woff2",
    sourceUrl: "https://fonts.gstatic.com/s/baskervville/v20/YA9Br0yU4l_XOrogbkun3kQ6vLFYXmpq8sRsYuDrigS4dA.woff2",
  },
  {
    id: "jetbrains-mono-400-normal",
    family: "JetBrains Mono",
    weight: 400,
    style: "normal",
    usedBy: ["site"],
    fileName: "JetBrainsMono-Regular.woff2",
    sourceUrl: "https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxTOlOV.woff2",
  },
];

export const FONT_DIR = "./public/fonts";

export const OG_FONT_SPECS = FONT_ASSETS.filter((asset) => asset.usedBy.includes("og")).map((asset) => ({
  name: asset.family,
  filePath: `${FONT_DIR}/${asset.fileName}`,
  weight: asset.weight,
  style: asset.style,
}));
