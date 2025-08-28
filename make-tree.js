const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, ".");
const OUT_FILE = path.join(ROOT, "tree.txt");

// Папки и расширения, которые исключаем
const EXCLUDE_DIRS = new Set([
  "node_modules",
  "dist",
  "build",
  ".git",
  ".vscode",
  "library",
  "temp",
  "profiles",
  "settings",
  "raw_resources"
]);

const EXCLUDE_EXT = [".meta"]; // 👈 вот тут .meta файлы

function walk(dir, prefix = "") {
  let output = "";
  const items = fs.readdirSync(dir, { withFileTypes: true })
    .filter(d => {
      if (EXCLUDE_DIRS.has(d.name)) return false;
      if (!d.isDirectory() && EXCLUDE_EXT.includes(path.extname(d.name))) return false;
      return true;
    })
    .sort((a, b) => {
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (!a.isDirectory() && b.isDirectory()) return 1;
      return a.name.localeCompare(b.name);
    });

  items.forEach((item, index) => {
    const isLast = index === items.length - 1;
    const branch = isLast ? "└── " : "├── ";
    output += prefix + branch + item.name + "\n";
    if (item.isDirectory()) {
      const indent = isLast ? "    " : "│   ";
      output += walk(path.join(dir, item.name), prefix + indent);
    }
  });

  return output;
}

function generateTree() {
  let tree = "# Project tree\n\n";
  tree += "```\n";
  tree += walk(ROOT);
  tree += "```\n";
  fs.writeFileSync(OUT_FILE, tree, "utf8");
  console.log("Saved tree to", OUT_FILE);
}

generateTree();
