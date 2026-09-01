const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const LIMIT = 200;
const EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx"]);
const SKIP_DIRS = new Set(["node_modules", ".next", ".git", ".vercel", "build", "dist"]);
const violations = [];

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && SKIP_DIRS.has(entry.name)) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }
    if (!EXTENSIONS.has(path.extname(entry.name))) continue;
    const lineCount = fs.readFileSync(fullPath, "utf8").split(/\r?\n/).length;
    if (lineCount > LIMIT) violations.push({ file: path.relative(ROOT, fullPath), lineCount });
  }
}

walk(ROOT);

if (violations.length) {
  violations.sort((a, b) => b.lineCount - a.lineCount);
  console.error(`\n${LIMIT} satır sınırını aşan kaynak dosyaları:`);
  for (const item of violations) console.error(`- ${item.lineCount}: ${item.file}`);
  process.exit(1);
}

console.log(`Kaynak dosyası satır kontrolü temiz: tüm .ts/.tsx/.js/.jsx dosyaları <= ${LIMIT} satır.`);
