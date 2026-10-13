import { chromium } from "playwright";
import fs from "node:fs";
const img = (s) => `data:image/jpeg;base64,${fs.readFileSync(`public/templates/${s}-0.jpg`).toString("base64")}`;
const html = `<body style="margin:0;width:1200px;height:630px;background:radial-gradient(80% 90% at 20% 0%,#f3dfe3,transparent),linear-gradient(135deg,#fbf8f3,#efe3c9);font-family:Georgia,serif;position:relative;overflow:hidden">
<div style="position:absolute;left:70px;top:150px;width:560px">
<div style="font:600 22px sans-serif;letter-spacing:.3em;color:#b08d57;text-transform:uppercase">Marriage Cards</div>
<div style="font-size:78px;line-height:1.02;margin-top:18px;color:#1f1a17;font-weight:600">Digital wedding invitations, beautifully made.</div>
<div style="font:24px sans-serif;margin-top:22px;color:#6b6258">Free templates · personal guest links · PDF</div></div>
${["midnight-gold","blush-peony","emerald-nikah"].map((s,i)=>`<img src="${img(s)}" style="position:absolute;width:250px;left:${650+i*170}px;top:${[90,40,110][i]}px;transform:rotate(${[-6,0,6][i]}deg);border-radius:8px;box-shadow:0 20px 50px rgba(50,30,20,.35)">`).join("")}
</body>`;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
await p.setContent(html);
await p.screenshot({ path: "public/og.jpg", type: "jpeg", quality: 88 });
await b.close();
