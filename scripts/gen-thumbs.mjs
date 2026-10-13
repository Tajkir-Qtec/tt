// Renders every template page to public/templates/<slug>-<n>.jpg (needs the dev server running).
import { chromium } from "playwright";
import fs from "node:fs";
const base = process.env.BASE ?? "http://localhost:3000";
const only = process.argv[2];
const slugs = fs
  .readdirSync("src/lib/templates")
  .filter((f) => f.endsWith(".ts") && !/(\.art|index|kit|details|premium-details)\.ts$/.test(f))
  .map((f) => f.replace(/\.ts$/, ""))
  .filter((s) => !only || s === only);
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1100, height: 1500 }, deviceScaleFactor: 1 });
const p = await ctx.newPage();
for (const slug of slugs) {
  for (let i = 0; i < 6; i++) {
    await p.goto(`${base}/dev/preview?t=${slug}&p=${i}&s=0.6`);
    const ok = await p.waitForSelector("#stage-host[data-ready], #err", { timeout: 40000 }).catch(() => null);
    if (!ok || (await p.$("#err"))) break;
    const empty = await p.evaluate(() => document.body.innerText.includes("Cannot read"));
    if (empty) break;
    await p.waitForTimeout(250);
    const el = await p.$("#stage-host");
    await el.screenshot({ path: `public/templates/${slug}-${i}.jpg`, type: "jpeg", quality: 84 });
    console.log("saved", slug, i);
  }
}
await browser.close();
