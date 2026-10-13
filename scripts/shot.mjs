// Usage: node scripts/shot.mjs <slug> [page=0] [scale=0.8] [to=]
import { chromium } from "playwright";
const [slug, page = "0", scale = "0.8", to = ""] = process.argv.slice(2);
const base = process.env.BASE ?? "http://localhost:3000";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1100, height: 1500 }, deviceScaleFactor: 1 });
const p = await ctx.newPage();
p.on("console", (m) => m.type() === "error" && console.log("console error:", m.text()));
p.on("pageerror", (e) => console.log("page error:", e.message));
await p.goto(`${base}/dev/preview?t=${slug}&p=${page}&s=${scale}&to=${encodeURIComponent(to)}`);
await p.waitForSelector("#stage-host[data-ready]", { timeout: 30000 });
await p.waitForTimeout(400);
const el = await p.$("#stage-host");
const out = process.env.OUT ?? `.shots/${slug}-${page}.png`;
await el.screenshot({ path: out });
console.log("saved", out);
await browser.close();
