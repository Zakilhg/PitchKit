// Builds small WebP versions of the catalog photos plus a placeholder colour
// for each, so cards can show the right colour instantly and load a ~40 KB
// image instead of the original (up to ~900 KB).
//
//   npm run images
//
// Output: ../Server/public/images/opt/<name>-<width>.webp and
//         src/lib/image-colors.json ({ "<file>": "#rrggbb" })
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const imagesDir = path.resolve(root, "../Server/public/images");
const outDir = path.join(imagesDir, "opt");
export const WIDTHS = [480, 960];

const catalog = JSON.parse(await readFile(path.join(root, "src/demo/catalog.json"), "utf8"));
const files = [...new Set(catalog.jerseys.flatMap((jersey) => jersey.images))];

await mkdir(outDir, { recursive: true });
const colors = {};

for (const file of files) {
  const source = path.join(imagesDir, file);
  const base = path.parse(file).name;

  for (const width of WIDTHS) {
    await sharp(source)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 74, effort: 5 })
      .toFile(path.join(outDir, `${base}-${width}.webp`));
  }

  const { dominant } = await sharp(source).stats();
  colors[file] =
    "#" + [dominant.r, dominant.g, dominant.b].map((v) => v.toString(16).padStart(2, "0")).join("");
  process.stdout.write(".");
}

await writeFile(
  path.join(root, "src/lib/image-colors.json"),
  JSON.stringify(colors, null, 2) + "\n",
);
console.log(
  `\n${files.length} photos → ${WIDTHS.join(" / ")}px WebP in ${path.relative(root, outDir)}`,
);
