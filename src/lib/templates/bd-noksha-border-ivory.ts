import { archFrame, divider, paisley } from "../design/ornaments";
import { GUEST_TOKEN } from "../design/types";
import { cornerTile, spireRow, templeBig, weaveBorder } from "./bd-noksha-border-ivory.art";
import { GOLD, H, I, linear, lock, O, P, radial, S, T, W, type TemplateDef } from "./kit";

const RED = "#a9141f";
const BLACK = "#1c1514";
const IVORY = "#f7eedb";
const IVORY_D = "#ecdcbb";
const GOLDC = "#c39a3c";
const GOLD_D = "#8f6c22";
const MUTE = "#6a5648";

const bgIvory = radial([0, "#fbf5e6"], [0.7, "#f6ecd7"], [1, "#eddcb8"]);
const D = 84;
const wv = { red: RED, black: BLACK, ivory: IVORY, gold: GOLDC };

function border() {
  return [
    lock(O(weaveBorder({ len: W, depth: D, ...wv }), { x: 0, y: 0 })),
    lock(O(weaveBorder({ len: W, depth: D, ...wv }), { x: 0, y: H - D, flipY: true })),
    lock(O(weaveBorder({ len: H - 2 * D, depth: D, vertical: true, ...wv }), { x: 0, y: D })),
    lock(O(weaveBorder({ len: H - 2 * D, depth: D, vertical: true, ...wv }), { x: W - D, y: D, flipX: true })),
    ...[
      [0, 0],
      [W - D, 0],
      [0, H - D],
      [W - D, H - D],
    ].map(([x, y]) => lock(O(cornerTile({ size: D, ...wv }), { x, y }))),
    lock(S({ x: D + 14, y: D + 14, width: W - 2 * D - 28, height: H - 2 * D - 28, shape: "rect", fill: null, stroke: GOLD_D, strokeWidth: 1.4 })),
    lock(S({ x: D + 22, y: D + 22, width: W - 2 * D - 44, height: H - 2 * D - 44, shape: "rect", fill: null, stroke: RED, strokeWidth: 0.8, opacity: 0.7 })),
  ];
}

const kalka = (x: number, y: number, size: number, flip = false, op = 1) =>
  lock(O(paisley({ color: RED, stroke: BLACK, fillColor: RED, strokeWidth: 1.6, size }), { x, y, flipX: flip, opacity: op }));

export default function bdNokshaBorderIvory(): TemplateDef {
  const cap = (text: string, y: number, o = {}) =>
    T(text, y, { x: 200, width: 600, fontFamily: "Jost", fontSize: 15, letterSpacing: 8, fontWeight: 500, fill: GOLD_D, uppercase: true, ...o });
  const temple = (w: number, cx: number, y: number) => lock(O(templeBig({ w, red: RED, black: BLACK, ivory: IVORY, gold: GOLDC, line: 2 }), { cx, y }));

  // ---------- cover ----------
  const cover = P(
    bgIvory,
    [
      ...border(),
      temple(300, W / 2, 152),
      lock(O(spireRow({ w: 360, red: RED, black: BLACK, gold: GOLDC }), { cx: W / 2, y: 520 })),
      T("শুভ বিবাহ", 568, { x: 200, width: 600, fontFamily: "Tiro Bangla", fontSize: 104, fill: RED, lineHeight: 1.3 }),
      cap("The wedding of", 716, { fontSize: 14 }),
      kalka(150, 760, 92),
      kalka(758, 760, 92, true),
      T("শ্রাবন্তী", 748, { x: 250, width: 500, fontFamily: "Tiro Bangla", fontSize: 70, fill: BLACK, lineHeight: 1.3 }),
      T("ও", 828, { x: 250, width: 500, fontFamily: "Tiro Bangla", fontSize: 38, fill: GOLD_D, lineHeight: 1.3 }),
      T("অর্ণব", 862, { x: 250, width: 500, fontFamily: "Tiro Bangla", fontSize: 70, fill: BLACK, lineHeight: 1.3 }),
      O(divider({ style: "diamond", w: 320, color: RED, strokeWidth: 1.6 }), { cx: W / 2, y: 972, width: 320 }),
      T(GUEST_TOKEN, 1018, { x: 240, width: 520, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 32, fill: GOLD_D }),
      T("শুক্রবার, ১২ ফেব্রুয়ারি ২০২৭  ·  সন্ধ্যা ৬টা ৩০", 1066, { x: 160, width: 680, fontFamily: "Hind Siliguri", fontSize: 24, fontWeight: 500, fill: BLACK }),
      T("কালীবাড়ি সদন, শ্যামবাজার, কলকাতা", 1112, { x: 160, width: 680, fontFamily: "Hind Siliguri", fontSize: 22, fill: MUTE }),
      lock(O(spireRow({ w: 260, red: RED, black: BLACK, gold: GOLDC }), { cx: W / 2, y: 1190 })),
    ],
    "Invitation",
  );

  // ---------- details ----------
  const events = [
    { bn: "গায়ে হলুদ", en: "Gaye Holud", d: "বৃহস্পতিবার, ১১ ফেব্রুয়ারি", t: "সকাল ১০টা" },
    { bn: "শুভ বিবাহ", en: "Wedding", d: "শুক্রবার, ১২ ফেব্রুয়ারি", t: "সন্ধ্যা ৬টা ৩০" },
    { bn: "বউভাত", en: "Reception", d: "শনিবার, ১৩ ফেব্রুয়ারি", t: "সন্ধ্যা ৭টা" },
  ];
  const blocks: ReturnType<typeof T>[] = [];
  const seps: ReturnType<typeof O>[] = [];
  events.forEach((e, i) => {
    const y = 458 + i * 228;
    blocks.push(T(e.bn, y, { x: 200, width: 600, fontFamily: "Tiro Bangla", fontSize: 62, fill: RED, lineHeight: 1.3 }));
    blocks.push(cap(e.en, y + 80, { fontSize: 13 }));
    blocks.push(T(e.d, y + 108, { x: 160, width: 680, fontFamily: "Hind Siliguri", fontSize: 26, fontWeight: 500, fill: BLACK }));
    blocks.push(T(e.t, y + 146, { x: 160, width: 680, fontFamily: "Hind Siliguri", fontSize: 23, fill: MUTE }));
    if (i < 2) seps.push(lock(O(spireRow({ w: 200, red: RED, black: BLACK, gold: GOLDC }), { cx: W / 2, y: y + 178 })));
  });
  const details = P(
    bgIvory,
    [
      ...border(),
      temple(150, W / 2, 148),
      T("অনুষ্ঠানসূচি", 330, { x: 200, width: 600, fontFamily: "Tiro Bangla", fontSize: 70, fill: BLACK, lineHeight: 1.3 }),
      O(divider({ style: "diamond", w: 320, color: RED, strokeWidth: 1.6 }), { cx: W / 2, y: 420, width: 320 }),
      ...seps,
      ...blocks,
      T("কালীবাড়ি সদন, শ্যামবাজার, কলকাতা", 1176, { x: 160, width: 680, fontFamily: "Hind Siliguri", fontSize: 22, fill: MUTE }),
    ],
    "Schedule",
  );

  // ---------- photo ----------
  const photo = P(
    bgIvory,
    [
      ...border(),
      lock(O(archFrame({ w: 600, h: 790, fill: BLACK, stroke: null, strokeWidth: 0 }), { x: 200, y: 150 })),
      lock(O(archFrame({ w: 572, h: 762, fill: null, stroke: GOLDC, strokeWidth: 1.4 }), { x: 214, y: 164 })),
      I({ x: 230, y: 180, width: 540, height: 730, mask: "arch", placeholderFill: IVORY_D, borderColor: RED, borderWidth: 6 }),
      kalka(150, 972, 84),
      kalka(766, 972, 84, true),
      T("দুটি মন, এক বন্ধন", 986, { x: 120, width: 760, fontFamily: "Tiro Bangla", fontSize: 62, fill: RED, lineHeight: 1.35 }),
      T("আপনাদের শুভেচ্ছা ও আশীর্বাদ আমাদের নতুন জীবনের সবচেয়ে বড় সম্বল।", 1082, { x: 170, width: 660, fontFamily: "Hind Siliguri", fontSize: 24, fill: BLACK, lineHeight: 1.6 }),
      lock(O(spireRow({ w: 240, red: RED, black: BLACK, gold: GOLDC }), { cx: W / 2, y: 1190 })),
      T("Shrabanti & Arnab", 1236, { x: 200, width: 600, fontFamily: "Cinzel", fontWeight: 500, fontSize: 24, letterSpacing: 6, fill: GOLD_D }),
    ],
    "Blessing",
  );

  return {
    slug: "bd-noksha-border-ivory",
    name: "Noksha Pare Ivory Temple",
    tagline: "Ivory Bengali wedding card with red and black woven saree border and terracotta temple",
    description:
      "A heritage Bengali wedding invitation inspired by the noksha-pare saree border and Bishnupur terracotta temples. Woven red and black border, kalka paisleys and a hand-drawn temple on ivory, with elegant Bangla typography.",
    categories: ["bengali", "classic", "cultural", "vintage", "ceremony"],
    keywords: [
      "noksha pare bengali wedding invitation",
      "saree border wedding card bangla",
      "terracotta temple biyer card design",
      "red black ivory traditional bengali invitation",
      "kolkata bengali shubho bibaho card",
    ],
    palette: [RED, BLACK, IVORY, GOLDC, MUTE],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
