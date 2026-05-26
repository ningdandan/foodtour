import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const targetArg = process.argv[2] || "src/data";
const targetDir = path.resolve(process.cwd(), targetArg);

async function walk(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) return walk(fullPath);
      if (entry.isFile() && /\.png$/i.test(entry.name)) return [fullPath];
      return [];
    }),
  );
  return nested.flat();
}

async function compressOne(filePath) {
  const original = await fs.readFile(filePath);
  const compressed = await sharp(original)
    .png({
      compressionLevel: 9,
      effort: 10,
      palette: true,
      quality: 80,
    })
    .toBuffer();

  if (compressed.length >= original.length) {
    return { filePath, before: original.length, after: original.length, changed: false };
  }

  await fs.writeFile(filePath, compressed);
  return { filePath, before: original.length, after: compressed.length, changed: true };
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function main() {
  const stat = await fs.stat(targetDir).catch(() => null);
  if (!stat || !stat.isDirectory()) {
    console.error(`Directory not found: ${targetDir}`);
    process.exit(1);
  }

  const pngFiles = await walk(targetDir);
  if (pngFiles.length === 0) {
    console.log(`No PNG files found under: ${targetArg}`);
    return;
  }

  let totalBefore = 0;
  let totalAfter = 0;
  let changedCount = 0;

  for (const filePath of pngFiles) {
    const result = await compressOne(filePath);
    totalBefore += result.before;
    totalAfter += result.after;
    if (result.changed) {
      changedCount += 1;
      const saved = result.before - result.after;
      console.log(`Optimized: ${path.relative(process.cwd(), filePath)} (-${formatBytes(saved)})`);
    } else {
      console.log(`Skipped:   ${path.relative(process.cwd(), filePath)} (already optimal)`);
    }
  }

  const savedTotal = totalBefore - totalAfter;
  const ratio = totalBefore > 0 ? ((savedTotal / totalBefore) * 100).toFixed(2) : "0.00";
  console.log("");
  console.log(`Done. ${changedCount}/${pngFiles.length} files optimized.`);
  console.log(`Total: ${formatBytes(totalBefore)} -> ${formatBytes(totalAfter)} (saved ${formatBytes(savedTotal)}, ${ratio}%)`);
}

main().catch((error) => {
  console.error("PNG compression failed.");
  console.error(error);
  process.exit(1);
});
