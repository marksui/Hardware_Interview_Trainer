import { cp, copyFile, mkdir } from "node:fs/promises";

await mkdir("assets", { recursive: true });
await cp("dist/assets", "assets", { recursive: true });
await copyFile("dist/favicon.svg", "favicon.svg");
await copyFile("dist/site.webmanifest", "site.webmanifest");
await copyFile("dist/.nojekyll", ".nojekyll");
