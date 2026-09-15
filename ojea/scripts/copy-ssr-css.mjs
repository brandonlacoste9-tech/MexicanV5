import { cpSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";

const src = "node_modules/.nitro/vite/services/ssr/assets";
const dest = "dist/assets";
if (!existsSync(src)) process.exit(0);
mkdirSync(dest, { recursive: true });
for (const file of readdirSync(src).filter((name) => name.endsWith(".css"))) {
  cpSync(join(src, file), join(dest, file));
}
