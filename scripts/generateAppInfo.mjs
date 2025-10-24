import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packagePath = path.join(__dirname, "../package.json");

const pkg = JSON.parse(await readFile(packagePath, "utf8"));

console.log(
  `App info sync skipped – ${pkg.name}@${pkg.version} no longer writes to data/app-info.ts.`,
);
