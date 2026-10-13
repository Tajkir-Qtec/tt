// Usage: node scripts/montage.mjs out.png a.png b.png ...  (side-by-side)
import { chromium } from "playwright";
import fs from "node:fs";
const [out, ...files] = process.argv.slice(2);
const html = `<body style="margin:0;background:#333;display:flex;gap:12px;padding:12px">${files
  .map((f) => `<img src="data:image/png;base64,${fs.readFileSync(f).toString("base64")}" style="height:900px">`)
  .join("")}</body>`;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 400 * files.length + 40, height: 930 } });
await p.setContent(html);
await p.screenshot({ path: out, fullPage: true });
await b.close();
