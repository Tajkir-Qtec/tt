import { archFrame } from "../design/ornaments";
import { GUEST_TOKEN } from "../design/types";
import { archLines, dotLine, oliveBranch, sprigMini } from "./bd-modern-arch-sage-bangla.art";
import { H, I, linear, lock, O, P, S, T, W, type TemplateDef } from "./kit";

const SAGE = "#a9bb9a";
const SAGE_M = "#bccaae";
const SAGE_L = "#cfdac3";
const SAGE_XL = "#e4ebd9";
const CREAM = "#f9f5e8";
const OLIVE = "#566640";
const OLIVE_D = "#2f3b1e";
const TAN = "#9a8650";
const OLIVE_FRUIT = "#6e7d4c";

const bgSage = linear(90, [0, "#b6c6a8"], [1, "#9db08d"]);
const bgCream = linear(90, [0, "#fbf8ee"], [1, "#f4efdf"]);

const branch = (o: Omit<Parameters<typeof oliveBranch>[0], "canvas" | "ink" | "leafFill">, fill = SAGE_L, ink = OLIVE) =>
  lock(O(oliveBranch({ ...o, ink, leafFill: fill, canvas: { w: W, h: H } }), { x: 0, y: 0 }));

const thin = (text: string, y: number, o = {}) =>
  T(text, y, { x: 180, width: 640, fontFamily: "Hind Siliguri", fontWeight: 300, fontSize: 26, letterSpacing: 4, fill: OLIVE, ...o });
const cap = (text: string, y: number, o = {}) =>
  T(text, y, { x: 200, width: 600, fontFamily: "Jost", fontSize: 14, letterSpacing: 8, fontWeight: 400, fill: OLIVE, uppercase: true, ...o });

export default function bdModernArchSageBangla(): TemplateDef {
  // ---------- cover ----------
  const cover = P(
    bgSage,
    [
      lock(O(archFrame({ w: 880, h: 1270, fill: SAGE_M, stroke: null, strokeWidth: 0 }), { x: 60, y: 70 })),
      lock(O(archFrame({ w: 780, h: 1215, fill: SAGE_XL, stroke: null, strokeWidth: 0 }), { x: 110, y: 125 })),
      lock(O(archFrame({ w: 680, h: 1160, fill: CREAM, stroke: null, strokeWidth: 0 }), { x: 160, y: 180 })),
      lock(O(archLines({ w: 630, h: 1135, n: 2, gap: 12, ink: OLIVE, sw: 1.2 }), { x: 185, y: 205 })),
      lock(S({ x: 60, y: 1340, width: 880, height: 1.4, fill: OLIVE, opacity: 0.5 })),
      lock(O(sprigMini({ size: 64, ink: OLIVE, fill: SAGE_L }), { cx: W / 2, y: 260 })),
      thin("বিবাহের আমন্ত্রণ", 340, { fontSize: 24, letterSpacing: 7 }),
      T("আরিফা", 396, { x: 200, width: 600, fontFamily: "Hind Siliguri", fontWeight: 300, fontSize: 104, fill: OLIVE_D, lineHeight: 1.3 }),
      T("ও", 528, { x: 200, width: 600, fontFamily: "Tiro Bangla", fontSize: 40, fill: TAN, lineHeight: 1.3 }),
      T("নাহিদ", 568, { x: 200, width: 600, fontFamily: "Hind Siliguri", fontWeight: 300, fontSize: 104, fill: OLIVE_D, lineHeight: 1.3 }),
      cap("Arifa  &  Nahid", 722, { fontSize: 20, letterSpacing: 12, fontWeight: 300 }),
      lock(O(dotLine({ w: 300, ink: OLIVE }), { cx: W / 2, y: 774 })),
      T(GUEST_TOKEN, 806, { x: 240, width: 520, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 32, fill: TAN }),
      thin("শুক্রবার", 872, { fontSize: 22, letterSpacing: 8 }),
      T("১৯ নভেম্বর ২০২৭", 910, { x: 200, width: 600, fontFamily: "Hind Siliguri", fontWeight: 300, fontSize: 52, fill: OLIVE_D, lineHeight: 1.3 }),
      thin("সন্ধ্যা ৭টা", 988, { fontSize: 24, letterSpacing: 4 }),
      thin("লেকশোর গার্ডেন, গুলশান, ঢাকা", 1058, { fontSize: 25, letterSpacing: 1, fontWeight: 400 }),
      cap("Lakeshore Garden  ·  Gulshan", 1100, { fontSize: 14, letterSpacing: 5, fill: TAN }),
      branch({ ox: 180, oy: 1306, ang: -84, len: 560, bend: 52, leafLen: 62, olive: OLIVE_FRUIT }),
      branch({ ox: 824, oy: 1306, ang: -98, len: 330, bend: 36, leafLen: 56, mirror: true }, SAGE_M),
    ],
    "Invitation",
  );

  // ---------- details ----------
  const events = [
    { n: "১৮", d: "বৃহস্পতিবার", bn: "গায়ে হলুদ", en: "Gaye Holud", t: "বিকেল ৪টা", v: "ফুলবাড়ী ভিলা, ধানমন্ডি" },
    { n: "১৯", d: "শুক্রবার", bn: "বিবাহ অনুষ্ঠান", en: "Wedding Ceremony", t: "সন্ধ্যা ৭টা", v: "লেকশোর গার্ডেন, গুলশান" },
    { n: "২০", d: "শনিবার", bn: "ওয়ালিমা", en: "Walima Reception", t: "দুপুর ১টা", v: "লেকশোর গার্ডেন, গুলশান" },
  ];
  const rows: ReturnType<typeof T>[] = [];
  const marks: ReturnType<typeof S>[] = [];
  events.forEach((e, i) => {
    const y = 540 + i * 196;
    rows.push(T(e.n, y - 6, { x: 130, width: 220, fontFamily: "Hind Siliguri", fontWeight: 300, fontSize: 96, fill: OLIVE_D, lineHeight: 1.2 }));
    rows.push(T(`${e.d}  ·  নভেম্বর`, y + 112, { x: 110, width: 260, fontFamily: "Hind Siliguri", fontWeight: 400, fontSize: 18, letterSpacing: 1, fill: TAN }));
    marks.push(lock(S({ x: 392, y: y + 4, width: 1.4, height: 132, fill: OLIVE, opacity: 0.5 })));
    rows.push(T(e.bn, y - 2, { x: 430, width: 440, align: "left", fontFamily: "Hind Siliguri", fontWeight: 400, fontSize: 40, fill: OLIVE_D, lineHeight: 1.3 }));
    rows.push(T(e.en, y + 56, { x: 432, width: 440, align: "left", fontFamily: "Jost", fontSize: 14, letterSpacing: 7, fontWeight: 400, fill: TAN, uppercase: true }));
    rows.push(T(e.t, y + 88, { x: 430, width: 440, align: "left", fontFamily: "Hind Siliguri", fontWeight: 400, fontSize: 24, fill: OLIVE }));
    rows.push(T(e.v, y + 122, { x: 430, width: 440, align: "left", fontFamily: "Hind Siliguri", fontWeight: 300, fontSize: 20, fill: OLIVE }));
    if (i < 2) marks.push(lock(S({ x: 130, y: y + 166, width: 740, height: 1, fill: OLIVE, opacity: 0.25 })));
  });
  const details = P(
    bgCream,
    [
      lock(O(archFrame({ w: 560, h: 400, fill: SAGE_L, stroke: null, strokeWidth: 0 }), { x: 220, y: 70 })),
      lock(O(archLines({ w: 520, h: 380, n: 2, gap: 11, ink: OLIVE, sw: 1.2 }), { x: 240, y: 90 })),
      lock(O(sprigMini({ size: 56, ink: OLIVE, fill: SAGE_XL }), { cx: W / 2, y: 150 })),
      T("অনুষ্ঠানসূচি", 232, { x: 260, width: 480, fontFamily: "Hind Siliguri", fontWeight: 300, fontSize: 70, fill: OLIVE_D, lineHeight: 1.3 }),
      cap("Event schedule", 340, { x: 260, width: 480 }),
      lock(O(dotLine({ w: 220, ink: OLIVE }), { cx: W / 2, y: 380 })),
      ...marks,
      ...rows,
      lock(S({ x: 130, y: 1160, width: 740, height: 150, shape: "rect", fill: SAGE_L, cornerRadius: 75 })),
      T("লেকশোর গার্ডেন, প্লট ১২, রোড ৫০, গুলশান ২, ঢাকা", 1196, { x: 160, width: 680, fontFamily: "Hind Siliguri", fontWeight: 400, fontSize: 24, fill: OLIVE_D }),
      T("পোশাক: হালকা প্যাস্টেল বা সাদা", 1244, { x: 160, width: 680, fontFamily: "Hind Siliguri", fontWeight: 300, fontSize: 22, fill: OLIVE }),
      branch({ ox: 60, oy: 1340, ang: -50, len: 260, bend: 26, leafLen: 44 }, SAGE_L),
      branch({ ox: 940, oy: 1340, ang: -130, len: 260, bend: 26, leafLen: 44, mirror: true }, SAGE_L),
    ],
    "Schedule",
  );

  // ---------- photo ----------
  const photo = P(
    bgSage,
    [
      lock(O(archFrame({ w: 720, h: 960, fill: SAGE_M, stroke: null, strokeWidth: 0 }), { x: 140, y: 90 })),
      lock(O(archLines({ w: 660, h: 940, n: 3, gap: 12, ink: CREAM, sw: 1.4 }), { x: 170, y: 110 })),
      I({ x: 210, y: 150, width: 580, height: 840, mask: "arch", placeholderFill: SAGE_XL, borderColor: CREAM, borderWidth: 8 }),
      branch({ ox: 120, oy: 1090, ang: -80, len: 600, bend: 60, leafLen: 62, olive: OLIVE_FRUIT }, SAGE_XL, OLIVE_D),
      branch({ ox: 884, oy: 1090, ang: -104, len: 300, bend: 34, leafLen: 54, mirror: true }, SAGE_XL, OLIVE_D),
      T("দুটি জীবন, একটি গল্প", 1090, { x: 100, width: 800, fontFamily: "Hind Siliguri", fontWeight: 300, fontSize: 60, fill: OLIVE_D, lineHeight: 1.3 }),
      T("আপনাদের দোয়া ও ভালোবাসায় শুরু হোক আমাদের নতুন পথচলা।", 1180, { x: 160, width: 680, fontFamily: "Hind Siliguri", fontWeight: 400, fontSize: 24, fill: OLIVE_D, lineHeight: 1.6 }),
      T("Arifa & Nahid", 1288, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 36, fill: CREAM }),
    ],
    "Blessing",
  );

  return {
    slug: "bd-modern-arch-sage-bangla",
    name: "Modern Sage Arch Bangla",
    tagline: "Contemporary sage and cream arch wedding card with thin Bangla type and olive line art",
    description:
      "A minimal, modern Bangladeshi wedding invitation with nested sage and cream arches, light-weight Bangla typography and fine olive-branch line art. Ideal for garden weddings, akd and walima celebrations in Dhaka, Chattogram and Sylhet.",
    categories: ["bengali", "modern", "minimal", "floral", "nature"],
    keywords: [
      "modern bangla wedding invitation sage green",
      "arch wedding card bangladesh minimalist",
      "olive branch biyer card design",
      "sage and cream bangla invitation",
      "contemporary bangladeshi wedding card",
    ],
    palette: [SAGE, SAGE_L, CREAM, OLIVE, TAN],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
