import { corner, divider } from "../design/ornaments";
import { GUEST_TOKEN } from "../design/types";
import { alponaBand, bangleBadge, bindi, petalRing, polaRing, shakhaRing } from "./bd-shankha-pola-red.art";
import { GOLD, H, I, linear, lock, O, P, radial, S, T, W, type TemplateDef } from "./kit";

const RED = "#a8111f";
const RED_D = "#5a0810";
const RED_M = "#c4182b";
const IVORY = "#fbf1e0";
const IVORY_D = "#efe0c4";
const GOLDC = "#e6c677";
const GOLD_D = "#a9812f";
const INK = "#3a0a10";

const bgRed = radial([0, "#c01a2d"], [0.6, "#8e0e1b"], [1, "#4f060e"]);
const bgIvory = linear(90, [0, "#fdf6e8"], [1, "#f5e7cc"]);

/** concentric pola / shakha / pola medallion centred at (cx, cy) */
function bangleStack(cx: number, cy: number, k = 1) {
  const ring = (data: ReturnType<typeof polaRing>) => lock(O(data, { x: cx - data.vbW / 2, y: cy - data.vbH / 2 }));
  return [
    ring(polaRing({ r: 246 * k, thick: 24 * k })),
    ring(shakhaRing({ r: 206 * k, thick: 40 * k })),
    ring(polaRing({ r: 168 * k, thick: 24 * k })),
  ];
}

export default function bdShankhaPolaRed(): TemplateDef {
  const frame = (ink: string, op = 1) => [
    lock(S({ x: 26, y: 26, width: 948, height: 1348, shape: "rect", fill: null, stroke: ink, strokeWidth: 1.8, opacity: op })),
    lock(S({ x: 40, y: 40, width: 920, height: 1320, shape: "rect", fill: null, stroke: ink, strokeWidth: 0.8, opacity: op * 0.7 })),
    lock(O(corner({ style: "ornate", size: 110, color: ink, strokeWidth: 1.6 }), { x: 46, y: 46, opacity: op })),
    lock(O(corner({ style: "ornate", size: 110, color: ink, strokeWidth: 1.6 }), { x: 844, y: 46, opacity: op, flipX: true })),
    lock(O(corner({ style: "ornate", size: 110, color: ink, strokeWidth: 1.6 }), { x: 46, y: 1244, opacity: op, flipY: true })),
    lock(O(corner({ style: "ornate", size: 110, color: ink, strokeWidth: 1.6 }), { x: 844, y: 1244, opacity: op, flipX: true, flipY: true })),
  ];
  const cap = (text: string, y: number, o = {}) =>
    T(text, y, { x: 200, width: 600, fontFamily: "Jost", fontSize: 15, letterSpacing: 8, fontWeight: 500, fill: GOLDC, uppercase: true, ...o });

  // ---------- cover ----------
  const mcx = W / 2;
  const mcy = 522;
  const cover = P(
    bgRed,
    [
      lock(S({ x: 60, y: 60, width: 880, height: 1280, shape: "ellipse", fill: radial([0, "rgba(255,120,110,0.28)"], [1, "rgba(255,120,110,0)"]) })),
      ...frame(GOLDC, 0.9),
      lock(O(bindi({ size: 104, ink: GOLDC, red: "#ff3b3b" }), { cx: W / 2, y: 62 })),
      T("॥ ওঁ শ্রী গণেশায় নমঃ ॥", 158, { x: 250, width: 500, fontFamily: "Tiro Bangla", fontSize: 26, fill: GOLDC }),
      lock(S({ x: mcx - 292, y: mcy - 292, width: 584, height: 584, shape: "ellipse", fill: RED_D, stroke: GOLDC, strokeWidth: 1.6 })),
      lock(O(petalRing({ r: 294, n: 36, len: 22, ink: GOLDC }), { cx: mcx, y: mcy - 322 })),
      ...bangleStack(mcx, mcy),
      lock(S({ x: mcx - 154, y: mcy - 154, width: 308, height: 308, shape: "ellipse", fill: radial([0, "#fffaf0"], [1, IVORY_D]), stroke: GOLD_D, strokeWidth: 1.6 })),
      lock(S({ x: mcx - 140, y: mcy - 140, width: 280, height: 280, shape: "ellipse", fill: null, stroke: RED, strokeWidth: 0.9, dash: [2, 7] })),
      T("শুভ বিবাহ", mcy - 82, { x: mcx - 150, width: 300, fontFamily: "Tiro Bangla", fontSize: 76, fill: RED, lineHeight: 1.3 }),
      T("WEDDING INVITATION", mcy + 40, { x: mcx - 150, width: 300, fontFamily: "Jost", fontSize: 14, letterSpacing: 5, fontWeight: 500, fill: GOLD_D }),
      O(divider({ style: "diamond", w: 170, color: RED, strokeWidth: 1.4 }), { cx: mcx, y: mcy + 66, width: 170 }),
      T(GUEST_TOKEN, 856, { x: 240, width: 520, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 32, fill: GOLDC }),
      T("Ankita  &  Soumyajit", 900, { x: 100, width: 800, fontFamily: "Cormorant Garamond", fontWeight: 500, fontSize: 82, fill: IVORY, lineHeight: 1.2 }),
      T("অঙ্কিতা  ও  সৌম্যজিৎ", 1000, { x: 150, width: 700, fontFamily: "Tiro Bangla", fontSize: 44, fill: GOLD, lineHeight: 1.3 }),
      T("শনিবার, ৩০ জানুয়ারি ২০২৭  ·  শুভলগ্ন সন্ধ্যা ৭টা ১৫", 1084, { x: 120, width: 760, fontFamily: "Hind Siliguri", fontSize: 24, fontWeight: 500, fill: IVORY }),
      T("মধুছন্দা ব্যাংকোয়েট, সল্টলেক, কলকাতা", 1130, { x: 120, width: 760, fontFamily: "Hind Siliguri", fontSize: 22, fill: "#f0cfc6" }),
      lock(O(alponaBand({ w: 700, h: 110, ink: GOLDC, accent: "#ffffff" }), { cx: W / 2, y: 1200 })),
    ],
    "Invitation",
  );

  // ---------- details ----------
  const events = [
    { bn: "আইবুড়ো ভাত", en: "Aiburo Bhaat", d: "বৃহস্পতিবার", n: "২৮", t: "দুপুর ১টা" },
    { bn: "গায়ে হলুদ", en: "Gaye Holud", d: "শুক্রবার", n: "২৯", t: "সকাল ১০টা ৩০" },
    { bn: "শুভ বিবাহ", en: "Wedding Ceremony", d: "শনিবার", n: "৩০", t: "সন্ধ্যা ৭টা ১৫" },
    { bn: "বউভাত", en: "Reception", d: "রবিবার", n: "৩১", t: "সন্ধ্যা ৭টা" },
  ];
  const rows: ReturnType<typeof T>[] = [];
  const marks: ReturnType<typeof O>[] = [];
  const seps: ReturnType<typeof S>[] = [];
  events.forEach((e, i) => {
    const y = 338 + i * 196;
    marks.push(lock(O(bangleBadge({ size: 112 }), { x: 130, y: y + 18 })));
    rows.push(T(e.bn, y + 4, { x: 290, width: 580, align: "left", fontFamily: "Tiro Bangla", fontSize: 50, fill: RED, lineHeight: 1.3 }));
    rows.push(T(e.en, y + 76, { x: 292, width: 580, align: "left", fontFamily: "Jost", fontSize: 14, letterSpacing: 6, fontWeight: 500, fill: GOLD_D, uppercase: true }));
    rows.push(T(e.d, y + 104, { x: 290, width: 580, align: "left", fontFamily: "Hind Siliguri", fontSize: 25, fontWeight: 500, fill: INK }));
    rows.push(T(e.t, y + 138, { x: 290, width: 580, align: "left", fontFamily: "Hind Siliguri", fontSize: 22, fill: RED_M }));
    rows.push(T(e.n, y + 10, { x: 690, width: 180, fontFamily: "Tiro Bangla", fontSize: 92, fill: RED, lineHeight: 1.2 }));
    rows.push(T("জানুয়ারি ২০২৭", y + 126, { x: 670, width: 220, fontFamily: "Hind Siliguri", fontSize: 20, fontWeight: 500, fill: GOLD_D }));
    seps.push(lock(S({ x: 650, y: y + 20, width: 1.4, height: 130, fill: GOLDC, opacity: 0.9 })));
    if (i < 3) seps.push(lock(S({ x: 130, y: y + 184, width: 740, height: 1.4, fill: GOLDC, opacity: 0.8 })));
  });
  const details = P(
    bgIvory,
    [
      lock(S({ x: 0, y: 0, width: W, height: 150, fill: RED })),
      lock(S({ x: 0, y: 1250, width: W, height: 150, fill: RED })),
      lock(O(alponaBand({ w: 760, h: 110, ink: GOLDC, accent: IVORY }), { cx: W / 2, y: 20 })),
      lock(O(alponaBand({ w: 760, h: 110, ink: GOLDC, accent: IVORY }), { cx: W / 2, y: 1270 })),
      lock(S({ x: 30, y: 168, width: 940, height: 1064, shape: "rect", fill: null, stroke: GOLD_D, strokeWidth: 1.4 })),
      lock(S({ x: 42, y: 180, width: 916, height: 1040, shape: "rect", fill: null, stroke: RED, strokeWidth: 0.8, opacity: 0.6 })),
      T("অনুষ্ঠানসূচি", 190, { x: 200, width: 600, fontFamily: "Tiro Bangla", fontSize: 68, fill: RED, lineHeight: 1.3 }),
      cap("Celebration schedule", 282, { fill: GOLD_D }),
      O(divider({ style: "diamond", w: 340, color: RED, strokeWidth: 1.5 }), { cx: W / 2, y: 304, width: 340 }),
      ...seps,
      ...marks,
      ...rows,
      T("মধুছন্দা ব্যাংকোয়েট, সল্টলেক, কলকাতা", 1146, { x: 160, width: 680, fontFamily: "Tiro Bangla", fontSize: 32, fill: INK, lineHeight: 1.3 }),
    ],
    "Schedule",
  );

  // ---------- photo ----------
  const pcx = W / 2;
  const pcy = 520;
  const photo = P(
    bgRed,
    [
      lock(S({ x: 60, y: 60, width: 880, height: 1280, shape: "ellipse", fill: radial([0, "rgba(255,120,110,0.26)"], [1, "rgba(255,120,110,0)"]) })),
      ...frame(GOLDC, 0.9),
      lock(O(bindi({ size: 84, ink: GOLDC, red: "#ff3b3b" }), { cx: W / 2, y: 76 })),
      lock(S({ x: pcx - 292, y: pcy - 292, width: 584, height: 584, shape: "ellipse", fill: RED_D, stroke: GOLDC, strokeWidth: 1.6 })),
      lock(O(petalRing({ r: 294, n: 36, len: 22, ink: GOLDC }), { cx: pcx, y: pcy - 322 })),
      ...bangleStack(pcx, pcy),
      I({ x: pcx - 152, y: pcy - 152, width: 304, height: 304, mask: "ellipse", placeholderFill: "#f1ddc2", borderColor: GOLDC, borderWidth: 3 }),
      T("শাঁখা-পলার মিলনে", 884, { x: 100, width: 800, fontFamily: "Tiro Bangla", fontSize: 62, fill: GOLD, lineHeight: 1.35 }),
      T("শাঁখা, পলা আর সিঁদুরের আশীর্বাদে শুরু হোক আমাদের নতুন পথচলা। আপনাদের উপস্থিতিই আমাদের সবচেয়ে বড় উপহার।", 984, { x: 150, width: 700, fontFamily: "Hind Siliguri", fontSize: 24, fill: IVORY, lineHeight: 1.6 }),
      T("With your blessings, our forever begins.", 1112, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontSize: 28, fill: "#f0cfc6" }),
      T("Ankita & Soumyajit", 1168, { x: 200, width: 600, fontFamily: "Cinzel", fontWeight: 500, fontSize: 26, letterSpacing: 6, fill: GOLD }),
      lock(O(alponaBand({ w: 560, h: 90, ink: GOLDC, accent: "#ffffff" }), { cx: W / 2, y: 1230 })),
    ],
    "Blessing",
  );

  return {
    slug: "bd-shankha-pola-red",
    name: "Shankha Pola Bridal Red",
    tagline: "Red and ivory Bengali wedding card with conch and coral bangles, sindoor and alpona",
    description:
      "A traditional Hindu Bengali wedding invitation in sindoor red and ivory, built around shankha-pola bangles, a sindoor bindi and hand-drawn alpona bands. Bilingual Bangla and English with gold foil linework for aiburo bhaat, gaye holud, biye and bou bhaat.",
    categories: ["bengali", "ceremony", "classic", "luxury"],
    keywords: [
      "shankha pola bengali wedding invitation",
      "hindu bengali biyer card red and white",
      "sindoor alpona wedding card design",
      "bangla shubho bibaho invitation with bangles",
      "bou bhaat gaye holud schedule card",
    ],
    palette: [RED, RED_D, IVORY, GOLDC, GOLD_D],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
