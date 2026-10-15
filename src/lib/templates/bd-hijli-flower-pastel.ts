import { archFrame } from "../design/ornaments";
import { GUEST_TOKEN } from "../design/types";
import { blob, cluster, garland, sprigDivider, strand, type FlowerPalette } from "./bd-hijli-flower-pastel.art";
import { H, I, linear, lock, O, P, S, T, W, type TemplateDef } from "./kit";

const PLUM = "#4a3566";
const LAV = "#cdbfe8";
const LAV_D = "#8c76c4";
const MINT = "#cfe9dc";
const MINT_D = "#5fa585";
const PEACH = "#fbd3bf";
const PEACH_D = "#e98f6c";
const CREAM = "#fffaf4";
const HALDI = "#f4c14f";

const pal: FlowerPalette = {
  petal: linear(90, [0, "#ffffff"], [1, "#f6f0ff"]),
  petalStroke: "#a994d6",
  center: HALDI,
  leaf: "#a8dcc0",
  leafStroke: "#5fa585",
  string: "#a99ac8",
  marigold: linear(90, [0, "#ffd988"], [1, "#f8b25c"]),
  marigoldStroke: "#d98a2c",
  bud: "#fff4fb",
};

const bg = linear(90, [0, "#e6dcf6"], [0.5, "#f8f0ec"], [1, "#fde2d2"]);

const label = (text: string, y: number, o = {}) =>
  T(text, y, { x: 180, width: 640, fontFamily: "Jost", fontSize: 16, fill: LAV_D, letterSpacing: 8, uppercase: true, fontWeight: 500, ...o });

/** Hanging flower curtain across the top of the page. */
function curtain(base: number, spread: number, y0 = 20): ReturnType<typeof O>[] {
  const out: ReturnType<typeof O>[] = [];
  const sag = 60;
  for (let i = 0; i < 11; i++) {
    const cx = 54 + i * 89.2;
    const t = cx / 1000;
    const ys = y0 + 50 + 4 * sag * t * (1 - t) - 4;
    const endY = base + Math.abs(cx - 500) * spread + (i % 2) * 36;
    out.push(
      lock(O(strand({ len: endY - ys, pal, seed: 11 + i * 7, marigoldEvery: i % 3 === 0 ? 3 : undefined }), { x: cx - 44, y: ys, width: 88 })),
    );
  }
  out.push(lock(O(garland({ w: 1000, sag, pal, seed: 5, marigoldEvery: 4 }), { x: 0, y: y0, width: 1000 })));
  return out;
}

export default function bdHijliFlowerPastel(): TemplateDef {
  const blobs = () => [
    lock(O(blob({ size: 640, color: MINT, seed: 3 }), { x: -190, y: -150, width: 640, opacity: 0.75 })),
    lock(O(blob({ size: 560, color: LAV, seed: 8 }), { x: 640, y: -80, width: 560, opacity: 0.7 })),
    lock(O(blob({ size: 620, color: PEACH, seed: 12 }), { x: -220, y: 960, width: 620, opacity: 0.8 })),
    lock(O(blob({ size: 560, color: MINT, seed: 6 }), { x: 650, y: 1020, width: 560, opacity: 0.7 })),
  ];

  // ---------- cover ----------
  const cover = P(
    bg,
    [
      ...blobs(),
      lock(O(archFrame({ w: 700, h: 1010, stroke: LAV_D, strokeWidth: 3, fill: linear(90, [0, "#fffdf9"], [1, "#fdf5ef"]), lines: 2, gap: 14 }), { x: 150, y: 330, width: 700 })),
      ...curtain(350, 0.3),
      lock(O(cluster({ w: 480, h: 220, pal, seed: 21, count: 9, size: 32, marigolds: 3 }), { x: -10, y: 1200, width: 480 })),
      lock(O(cluster({ w: 480, h: 220, pal, seed: 33, count: 9, size: 32, marigolds: 3 }), { x: 530, y: 1200, width: 480, flipX: true })),
      label("Pre-wedding celebration", 448, { fontSize: 15 }),
      T("গায়ে হলুদ", 478, { x: 200, width: 600, fontFamily: "Tiro Bangla", fontSize: 92, fill: PLUM, lineHeight: 1.3 }),
      label("The Holud of", 612, { fontSize: 15, fill: PEACH_D }),
      T(GUEST_TOKEN, 646, { x: 220, width: 560, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 30, fill: LAV_D }),
      T("Anika", 680, { x: 160, width: 680, fontFamily: "Great Vibes", fontSize: 118, fill: PLUM, lineHeight: 1.1 }),
      T("&", 806, { x: 160, width: 680, fontFamily: "Cormorant Garamond", italic: true, fontSize: 44, fill: PEACH_D }),
      T("Shams", 830, { x: 160, width: 680, fontFamily: "Great Vibes", fontSize: 118, fill: PLUM, lineHeight: 1.1 }),
      T("আনিকা  ও  শামস", 978, { x: 200, width: 600, fontFamily: "Tiro Bangla", fontSize: 34, fill: LAV_D, lineHeight: 1.4 }),
      O(sprigDivider({ w: 380, leaf: MINT, stroke: MINT_D, flower: "#ffffff", flowerStroke: LAV_D, center: HALDI }), { cx: W / 2, y: 1030, width: 380 }),
      T("বৃহস্পতিবার, ১৮ নভেম্বর ২০২৭  ·  বিকেল ৪টা", 1092, { x: 150, width: 700, fontFamily: "Hind Siliguri", fontWeight: 500, fontSize: 26, fill: PLUM, lineHeight: 1.4 }),
      T("লেকশোর গার্ডেন, গুলশান, ঢাকা", 1132, { x: 150, width: 700, fontFamily: "Hind Siliguri", fontSize: 22, fill: PLUM, lineHeight: 1.4 }),
      T("পোশাক: হলুদ ও প্যাস্টেল", 1168, { x: 150, width: 700, fontFamily: "Hind Siliguri", fontSize: 20, fill: PEACH_D, lineHeight: 1.4 }),
    ],
    "Invitation",
  );

  // ---------- schedule ----------
  const events = [
    { bn: "মেহেদি সন্ধ্যা", en: "Mehendi Night", whenBn: "বুধবার, ১৭ নভেম্বর  ·  সন্ধ্যা ৭টা", whenEn: "Wednesday, 17 November  ·  7:00 PM", fill: "#e9e0f7", edge: LAV_D },
    { bn: "গায়ে হলুদ", en: "Gaye Holud", whenBn: "বৃহস্পতিবার, ১৮ নভেম্বর  ·  বিকেল ৪টা", whenEn: "Thursday, 18 November  ·  4:00 PM", fill: "#fde6c8", edge: "#e0a040" },
    { bn: "শুভ বিবাহ", en: "The Wedding", whenBn: "শুক্রবার, ১৯ নভেম্বর  ·  সন্ধ্যা ৬টা", whenEn: "Friday, 19 November  ·  6:00 PM", fill: "#dcf0e6", edge: MINT_D },
  ];
  const evs: (ReturnType<typeof T> | ReturnType<typeof S>)[] = [];
  events.forEach((e, i) => {
    const y = 370 + i * 230;
    evs.push(lock(S({ x: 120, y, width: 760, height: 200, fill: e.fill, stroke: e.edge, strokeWidth: 2, cornerRadius: 56 })));
    evs.push(lock(S({ x: 132, y: y + 12, width: 736, height: 176, fill: null, stroke: "#ffffff", strokeWidth: 2, cornerRadius: 46, dash: [2, 8] })));
    evs.push(T(e.bn, y + 26, { x: 200, width: 600, fontFamily: "Tiro Bangla", fontSize: 48, fill: PLUM, lineHeight: 1.3 }));
    evs.push(label(e.en, y + 92, { fontSize: 13, letterSpacing: 7, fill: e.edge }));
    evs.push(T(e.whenBn, y + 118, { x: 150, width: 700, fontFamily: "Hind Siliguri", fontSize: 24, fontWeight: 500, fill: PLUM }));
    evs.push(T(e.whenEn, y + 154, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontSize: 25, fill: PLUM }));
  });

  const details = P(
    bg,
    [
      ...blobs(),
      ...curtain(130, 0.12),
      T("অনুষ্ঠানসূচি", 262, { x: 160, width: 680, fontFamily: "Tiro Bangla", fontSize: 70, fill: PLUM, lineHeight: 1.3 }),
      ...evs,
      lock(O(cluster({ w: 1000, h: 170, pal, seed: 41, count: 15, size: 28, marigolds: 4 }), { x: 0, y: 1260, width: 1000 })),
      label("স্থান  ·  Venue", 1076, { fontFamily: "Hind Siliguri", fontSize: 20, letterSpacing: 4, uppercase: false }),
      T("লেকশোর গার্ডেন, গুলশান, ঢাকা", 1112, { x: 160, width: 680, fontFamily: "Tiro Bangla", fontSize: 36, fill: PLUM, lineHeight: 1.3 }),
      T("Lakeshore Garden, Gulshan, Dhaka  ·  Dress code: yellow & pastels", 1166, { x: 100, width: 800, fontFamily: "Cormorant Garamond", fontSize: 25, fontWeight: 500, fill: PLUM }),
    ],
    "Schedule",
  );

  // ---------- blessing ----------
  const photo = P(
    bg,
    [
      ...blobs(),
      lock(O(archFrame({ w: 560, h: 760, stroke: LAV_D, strokeWidth: 3, fill: "#ffffff", lines: 2, gap: 14 }), { x: 220, y: 150, width: 560 })),
      I({ x: 252, y: 182, width: 496, height: 696, mask: "arch", placeholderFill: "#e7defa", borderColor: "#ffffff", borderWidth: 5 }),
      lock(O(strand({ len: 760, pal, seed: 61, marigoldEvery: 3 }), { x: 130, y: 0, width: 88 })),
      lock(O(strand({ len: 690, pal, seed: 71, marigoldEvery: 3 }), { x: 782, y: 0, width: 88 })),
      lock(O(strand({ len: 520, pal, seed: 73 }), { x: 70, y: 0, width: 88 })),
      lock(O(strand({ len: 560, pal, seed: 79 }), { x: 842, y: 0, width: 88 })),
      T("এক সুতোয় গাঁথা দুটি মন", 960, { x: 120, width: 760, fontFamily: "Tiro Bangla", fontSize: 54, fill: PLUM, lineHeight: 1.35 }),
      T("আপনাদের উপস্থিতি আমাদের উৎসবকে রাঙিয়ে দেবে", 1046, { x: 140, width: 720, fontFamily: "Hind Siliguri", fontSize: 26, fill: PLUM, lineHeight: 1.55 }),
      T("Come, celebrate in yellow and flowers with us.", 1114, { x: 180, width: 640, fontFamily: "Cormorant Garamond", italic: true, fontSize: 28, lineHeight: 1.4, fill: LAV_D }),
      lock(O(cluster({ w: 1000, h: 170, pal, seed: 83, count: 15, size: 28, marigolds: 4 }), { x: 0, y: 1250, width: 1000 })),
      T("Anika & Shams", 1196, { x: 200, width: 600, fontFamily: "Cinzel", fontWeight: 500, fontSize: 26, fill: PLUM, letterSpacing: 6 }),
    ],
    "Blessing",
  );

  return {
    slug: "bd-hijli-flower-pastel",
    name: "Beli Garland Pastel",
    tagline: "Soft pastel Gaye Holud card with beli jasmine garlands and flower curtains",
    description:
      "A dreamy lavender, mint and peach Bangladeshi Gaye Holud and bridal shower invitation with hanging beli jasmine and marigold garlands, a floral curtain, an arched panel and Bangla typography.",
    categories: ["bengali", "floral", "modern", "cultural", "engagement"],
    keywords: [
      "pastel gaye holud invitation card",
      "beli jasmine garland wedding invitation",
      "bangladeshi bridal shower card",
      "mehendi and holud invitation bangla",
      "lavender mint peach wedding card online",
    ],
    palette: [LAV, MINT, PEACH, PLUM, CREAM],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
