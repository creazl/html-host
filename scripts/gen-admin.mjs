// Generate src/admin.ts from public/admin.html (inline the panel HTML as a TS string).
// Run: node scripts/gen-admin.mjs
import { readFileSync, writeFileSync } from "node:fs";

const html = readFileSync(new URL("../public/admin.html", import.meta.url), "utf-8");
writeFileSync(
  new URL("../src/admin.ts", import.meta.url),
  "export const ADMIN_HTML = " + JSON.stringify(html) + ";\n"
);
console.log("Generated src/admin.ts from public/admin.html");
