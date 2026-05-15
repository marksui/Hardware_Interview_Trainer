import { copyFile, mkdir } from "node:fs/promises";

await mkdir("assets", { recursive: true });
await mkdir("data", { recursive: true });
await copyFile("dist/assets/index.js", "assets/index.js");
await copyFile("dist/assets/index.css", "assets/index.css");
await copyFile("dist/data/verilogInterviewReview.json", "data/verilogInterviewReview.json");
await copyFile("dist/favicon.svg", "favicon.svg");
await copyFile("dist/site.webmanifest", "site.webmanifest");
await copyFile("dist/.nojekyll", ".nojekyll");
