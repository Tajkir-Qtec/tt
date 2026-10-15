import { divider, ticketFrame } from "../design/ornaments";
import { GUEST_TOKEN } from "../design/types";
import { butiField, kalkaMotif, kalkaRosette, mangoPair, weave, zariBand } from "./bd-rajshahi-silk-maroon.art";
import { GOLD, H, I, linear, lock, O, P, radial, S, T, W, type TemplateDef } from "./kit";

const MAROON = "#6a0f1c";
const MAROON_D = "#430912";
const MAROON_L = "#8f1a2b";
const IVORY = "#f8ecd4";
const CREAM = "#f3e2bf";
const GOLDC = "#e2b960";
const GOLD_D = "#a97a2a";
const LINE = "#4a2a08";

const maroonBg = linear(90, [0, "#5b0b18"], [0.5, "#7a1423"], [1, "#4f0a15"]);
const shadow = { color: "#1f0207", blur: 10, offsetX: 0, offsetY: 3, opacity: 0.5 };

const band = (len: number, ground: string, vertical = false, thick = 76) => zariBand({ len, gold: GOLD, ground, line: LINE, vertical, thick });
const label = (text: string, y: number, o = {}) =>
  T(text, y, { x: 200, width: 600, fontFamily: "Jost", fontSize: 16, fill: GOLDC, letterSpacing: 8, uppercase: true, fontWeight: 500, ...o });

function silkGround(ground: string) {
  return [
    lock(O(weave({ w: W, h: H, gap: 5, color: "#ffffff" }), { x: 0, y: 0, width: W, opacity: 0.035 })),
    lock(O(butiField({ w: W, h: H, cell: 120, color: GOLDC }), { x: 0, y: 0, width: W, opacity: 0.11 })),
    lock(S({ x: -200, y: 260, width: 1400, height: 900, shape: "ellipse", fill: radial([0, "rgba(176,36,52,0.5)"], [0.7, "rgba(120,16,32,0.12)"], [1, "rgba(120,16,32,0)"]) })),
    // zari borders around the edge
    lock(S({ x: 36, y: 36, width: 928, height: 1328, fill: null, stroke: GOLDC, strokeWidth: 2 })),
    lock(O(band(928, ground), { x: 36, y: 36, width: 928 })),
    lock(O(band(928, ground), { x: 36, y: 1400 - 36 - 76, width: 928, flipY: true })),
    lock(O(band(1176, ground, true), { x: 36, y: 112, height: 1176 })),
    lock(O(band(1176, ground, true), { x: 1000 - 36 - 76, y: 112, height: 1176, flipX: true })),
  ];
}

export default function bdRajshahiSilkMaroon(): TemplateDef {
  // ---------- cover ----------
  const cover = P(
    maroonBg,
    [
      ...silkGround(MAROON),
      lock(O(ticketFrame({ w: 700, h: 1090, r: 40, stroke: GOLDC, strokeWidth: 2.4, lines: 2, gap: 9 }), { x: 150, y: 154, width: 700 })),
      lock(S({ x: 372, y: 100, width: 256, height: 256, shape: "ellipse", fill: MAROON })),
      O(kalkaRosette({ gold: GOLD, ground: MAROON_D, line: LINE, size: 236, n: 12 }), { cx: W / 2, y: 110, width: 236 }),
      T("শুভ বিবাহ", 372, { x: 160, width: 680, fontFamily: "Tiro Bangla", fontSize: 96, fill: GOLD, lineHeight: 1.3, shadow }),
      label("The wedding of", 508),
      T(GUEST_TOKEN, 546, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 32, fill: "#f0d18a" }),
      T("Tahmina", 590, { x: 160, width: 680, fontFamily: "Playfair Display", fontWeight: 500, fontSize: 90, fill: IVORY }),
      T("&", 692, { x: 160, width: 680, fontFamily: "Cormorant Garamond", italic: true, fontSize: 54, fill: GOLDC }),
      T("Farhan", 724, { x: 160, width: 680, fontFamily: "Playfair Display", fontWeight: 500, fontSize: 90, fill: IVORY }),
      T("তাহমিনা  ও  ফারহান", 840, { x: 200, width: 600, fontFamily: "Tiro Bangla", fontSize: 38, fill: GOLDC, lineHeight: 1.4 }),
      O(divider({ style: "diamond", w: 380, color: GOLDC }), { cx: W / 2, y: 918, width: 380 }),
      T("শুক্রবার, ৩ ডিসেম্বর ২০২৭  ·  সন্ধ্যা ৬টা", 976, { x: 150, width: 700, fontFamily: "Hind Siliguri", fontWeight: 500, fontSize: 27, fill: IVORY, lineHeight: 1.4 }),
      T("পদ্মা গার্ডেন কমিউনিটি সেন্টার, সাহেব বাজার, রাজশাহী", 1022, { x: 130, width: 740, fontFamily: "Hind Siliguri", fontSize: 22, fill: "#ecd3a0", lineHeight: 1.4 }),
      O(mangoPair({ gold: GOLD, ground: MAROON, line: LINE, w: 420 }), { cx: W / 2, y: 1086, width: 330 }),
    ],
    "Invitation",
  );

  // ---------- schedule ----------
  const events = [
    { bn: "গায়ে হলুদ", en: "Gaye Holud", whenBn: "বৃহস্পতিবার, ২ ডিসেম্বর  ·  সন্ধ্যা ৬টা", whenEn: "Thursday, 2 December  ·  6:00 PM" },
    { bn: "শুভ বিবাহ", en: "The Wedding", whenBn: "শুক্রবার, ৩ ডিসেম্বর  ·  সন্ধ্যা ৬টা", whenEn: "Friday, 3 December  ·  6:00 PM" },
    { bn: "বউভাত", en: "Reception", whenBn: "শনিবার, ৪ ডিসেম্বর  ·  সন্ধ্যা ৭টা", whenEn: "Saturday, 4 December  ·  7:00 PM" },
  ];
  const ev: ReturnType<typeof T>[] = [];
  const sep: ReturnType<typeof O>[] = [];
  events.forEach((e, i) => {
    const y = 358 + i * 232;
    ev.push(T(e.bn, y, { x: 200, width: 600, fontFamily: "Tiro Bangla", fontSize: 52, fill: MAROON, lineHeight: 1.3 }));
    ev.push(label(e.en, y + 72, { fontSize: 14, letterSpacing: 7, fill: GOLD_D }));
    ev.push(T(e.whenBn, y + 102, { x: 150, width: 700, fontFamily: "Hind Siliguri", fontSize: 25, fontWeight: 500, fill: MAROON_D }));
    ev.push(T(e.whenEn, y + 142, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontSize: 27, fill: MAROON_D }));
    if (i < events.length - 1) sep.push(O(kalkaMotif({ gold: GOLD, ground: CREAM, line: LINE, size: 100 }), { cx: W / 2, y: y + 170, width: 34 }));
  });

  const details = P(
    linear(90, [0, "#f1dfb9"], [0.5, "#faf0da"], [1, "#efdcb4"]),
    [
      lock(O(weave({ w: W, h: H, gap: 5, color: "#8a5a1a" }), { x: 0, y: 0, width: W, opacity: 0.05 })),
      lock(S({ x: 0, y: 0, width: W, height: 300, fill: maroonBg })),
      lock(O(butiField({ w: W, h: 300, cell: 110, color: GOLDC }), { x: 0, y: 0, width: W, opacity: 0.14 })),
      lock(S({ x: 0, y: 300, width: W, height: 5, fill: GOLD })),
      lock(O(band(928, MAROON), { x: 36, y: 36, width: 928 })),
      lock(O(band(928, CREAM), { x: 36, y: 1400 - 36 - 76, width: 928, flipY: true })),
      lock(S({ x: 36, y: 1400 - 38 - 4, width: 928, height: 2, fill: null, stroke: GOLD_D, strokeWidth: 0 })),
      T("অনুষ্ঠানসূচি", 138, { x: 160, width: 680, fontFamily: "Tiro Bangla", fontSize: 76, fill: GOLD, lineHeight: 1.3, shadow }),
      label("Celebration schedule", 238, { fill: "#f4dcae", fontSize: 16 }),
      ...ev,
      ...sep,
      O(divider({ style: "diamond", w: 400, color: GOLD_D }), { cx: W / 2, y: 1050, width: 400 }),
      label("স্থান  ·  Venue", 1098, { fontFamily: "Hind Siliguri", fontSize: 20, letterSpacing: 4, uppercase: false, fill: GOLD_D }),
      T("পদ্মা গার্ডেন কমিউনিটি সেন্টার", 1136, { x: 150, width: 700, fontFamily: "Tiro Bangla", fontSize: 38, fill: MAROON, lineHeight: 1.3 }),
      T("Padma Garden Community Centre, Shaheb Bazar, Rajshahi", 1192, { x: 120, width: 760, fontFamily: "Cormorant Garamond", fontSize: 26, fontWeight: 500, fill: MAROON_D }),
    ],
    "Schedule",
  );

  // ---------- blessing ----------
  const photo = P(
    maroonBg,
    [
      ...silkGround(MAROON),
      lock(O(kalkaRosette({ gold: GOLD, ground: MAROON_D, line: LINE, size: 560, n: 16 }), { cx: W / 2, y: 160, width: 560, opacity: 0.0 })),
      lock(S({ x: 262, y: 152, width: 476, height: 600, shape: "ellipse", fill: null, stroke: GOLDC, strokeWidth: 2.4 })),
      lock(S({ x: 250, y: 140, width: 500, height: 624, shape: "ellipse", fill: null, stroke: GOLDC, strokeWidth: 1 })),
      I({ x: 280, y: 170, width: 440, height: 564, mask: "ellipse", placeholderFill: "#9a2236", borderColor: GOLDC, borderWidth: 4 }),
      lock(O(kalkaMotif({ gold: GOLD, ground: MAROON_D, line: LINE, size: 230 }), { x: 150, y: 470, width: 150, rotation: -8 })),
      lock(O(kalkaMotif({ gold: GOLD, ground: MAROON_D, line: LINE, size: 230 }), { x: 700, y: 470, width: 150, rotation: 8, flipX: true })),
      T("দুটি মন, একটি জীবন", 812, { x: 140, width: 720, fontFamily: "Tiro Bangla", fontSize: 58, fill: GOLD, lineHeight: 1.35, shadow }),
      T("আপনাদের আশীর্বাদ ও উপস্থিতিই আমাদের সবচেয়ে বড় উপহার", 910, { x: 150, width: 700, fontFamily: "Hind Siliguri", fontSize: 27, fill: "#f2dfc6", lineHeight: 1.55 }),
      T("Your blessings and presence are the finest gift of all.", 1000, { x: 180, width: 640, fontFamily: "Cormorant Garamond", italic: true, fontSize: 28, lineHeight: 1.4, fill: IVORY }),
      O(mangoPair({ gold: GOLD, ground: MAROON, line: LINE, w: 420 }), { cx: W / 2, y: 1062, width: 270 }),
      T("Tahmina & Farhan", 1214, { x: 200, width: 600, fontFamily: "Cinzel", fontWeight: 500, fontSize: 28, fill: GOLD, letterSpacing: 6 }),
    ],
    "Blessing",
  );

  return {
    slug: "bd-rajshahi-silk-maroon",
    name: "Rajshahi Silk Maroon",
    tagline: "Maroon and gold zari wedding card inspired by Rajshahi silk saree borders",
    description:
      "A rich maroon Bangladeshi wedding invitation woven like a Rajshahi silk saree, with gold zari borders, kalka mango motifs and a lotus rosette above a Bangla Shubho Bibaho heading.",
    categories: ["bengali", "luxury", "cultural", "classic", "ceremony"],
    keywords: [
      "rajshahi silk saree inspired wedding card",
      "maroon and gold bangladeshi wedding invitation",
      "kalka mango motif biyer card",
      "zari border bangla wedding invitation",
      "luxury bengali muslim wedding card online",
    ],
    palette: [MAROON, MAROON_D, GOLDC, IVORY, CREAM],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
