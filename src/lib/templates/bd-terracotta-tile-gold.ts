import { divider } from "../design/ornaments";
import { GUEST_TOKEN } from "../design/types";
import { domeRow, foilArchFrame, medallion, tileField, tileIcon, vineBand } from "./bd-terracotta-tile-gold.art";
import { GOLD, H, I, linear, lock, O, P, radial, S, T, W, type TemplateDef } from "./kit";

const TERRA = "#b0522f";
const TERRA_D = "#6f2a14";
const TERRA_DD = "#4a1a0b";
const TERRA_L = "#d98c60";
const CREAM = "#f6e4c6";
const SAND = "#ecd0a4";
const GOLDC = "#e1b45f";
const GOLD_D = "#a9772a";

const terraBg = linear(90, [0, "#a74a28"], [0.5, "#bd5d38"], [1, "#9a421f"]);
const creamFill = linear(90, [0, "#f2dcb8"], [0.5, "#fbefd8"], [1, "#efd6ae"]);
const clayFill = linear(90, [0, "#8c3a1e"], [1, "#6c2812"]);
const shadow = { color: "#2a0d04", blur: 12, offsetX: 0, offsetY: 4, opacity: 0.45 };

function tileGround(dark = TERRA_D, light = "#e8a77c") {
  return [
    lock(O(tileField({ w: W, h: H, cell: 125, color: light }), { x: 1.5, y: 1.5, width: W, opacity: 0.2 })),
    lock(O(tileField({ w: W, h: H, cell: 125, color: dark }), { x: 0, y: 0, width: W, opacity: 0.42 })),
    lock(S({ x: -200, y: 200, width: 1400, height: 1000, shape: "ellipse", fill: radial([0, "rgba(232,140,96,0.42)"], [0.7, "rgba(176,82,47,0.1)"], [1, "rgba(176,82,47,0)"]) })),
  ];
}

const label = (text: string, y: number, o = {}) =>
  T(text, y, { x: 200, width: 600, fontFamily: "Jost", fontSize: 16, fill: GOLD_D, letterSpacing: 8, uppercase: true, fontWeight: 500, ...o });

export default function bdTerracottaTileGold(): TemplateDef {
  const vine = (len: number, color = TERRA_D, accent: string | typeof GOLD = GOLD) => vineBand({ len, color, accent, thick: 78 });

  // ---------- cover ----------
  const cover = P(
    terraBg,
    [
      ...tileGround(),
      lock(O(domeRow({ w: 1100, fill: clayFill, stroke: "#2f1006", accent: GOLD }), { x: -50, y: 40, width: 1100 })),
      lock(S({ x: 0, y: 270, width: W, height: 8, fill: GOLD })),
      lock(O(foilArchFrame({ w: 760, h: 950, lobes: 11, stroke: GOLDC, sw: 4, fill: creamFill, lines: 3, gap: 13 }), { x: 120, y: 310, width: 760 })),
      lock(S({ x: 0, y: 1290, width: W, height: 110, fill: clayFill })),
      lock(S({ x: 0, y: 1290, width: W, height: 6, fill: GOLD })),
      lock(O(vine(928, "#f1cd86"), { x: 36, y: 1308, width: 928, opacity: 0.6 })),
      O(medallion({ size: 150, stroke: TERRA_DD, fill: CREAM, accent: GOLD, n: 12 }), { cx: W / 2, y: 392, width: 120 }),
      T("শুভ বিবাহ", 530, { x: 160, width: 680, fontFamily: "Tiro Bangla", fontSize: 94, fill: TERRA_D, lineHeight: 1.3 }),
      label("The wedding of", 668, { fontSize: 15 }),
      T(GUEST_TOKEN, 704, { x: 220, width: 560, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 30, fill: TERRA }),
      T("Samia", 742, { x: 160, width: 680, fontFamily: "Fraunces", fontWeight: 400, fontSize: 84, fill: TERRA_DD }),
      T("&", 836, { x: 160, width: 680, fontFamily: "Cormorant Garamond", italic: true, fontSize: 50, fill: GOLD_D }),
      T("Rakib", 862, { x: 160, width: 680, fontFamily: "Fraunces", fontWeight: 400, fontSize: 84, fill: TERRA_DD }),
      T("সামিয়া  ও  রাকিব", 970, { x: 200, width: 600, fontFamily: "Tiro Bangla", fontSize: 36, fill: TERRA, lineHeight: 1.4 }),
      O(divider({ style: "diamond", w: 360, color: GOLD_D }), { cx: W / 2, y: 1034, width: 360 }),
      T("শুক্রবার, ২২ জানুয়ারি ২০২৭  ·  সন্ধ্যা ৬টা ৩০", 1088, { x: 160, width: 680, fontFamily: "Hind Siliguri", fontWeight: 500, fontSize: 26, fill: TERRA_DD, lineHeight: 1.4 }),
      T("খানজাহান গার্ডেন রিসোর্ট, বাগেরহাট", 1130, { x: 160, width: 680, fontFamily: "Hind Siliguri", fontSize: 22, fill: TERRA_D, lineHeight: 1.4 }),
    ],
    "Invitation",
  );

  // ---------- schedule ----------
  const events = [
    { bn: "গায়ে হলুদ", en: "Gaye Holud", whenBn: "বৃহস্পতিবার, ২১ জানুয়ারি  ·  বিকেল ৫টা", whenEn: "Thursday, 21 January  ·  5:00 PM" },
    { bn: "শুভ বিবাহ", en: "The Wedding", whenBn: "শুক্রবার, ২২ জানুয়ারি  ·  সন্ধ্যা ৬টা ৩০", whenEn: "Friday, 22 January  ·  6:30 PM" },
    { bn: "বউভাত", en: "Reception", whenBn: "শনিবার, ২৩ জানুয়ারি  ·  সন্ধ্যা ৭টা", whenEn: "Saturday, 23 January  ·  7:00 PM" },
  ];
  const ev: (ReturnType<typeof T> | ReturnType<typeof O> | ReturnType<typeof S>)[] = [];
  events.forEach((e, i) => {
    const y = 372 + i * 240;
    ev.push(lock(S({ x: 100, y, width: 800, height: 210, fill: creamFill, stroke: GOLDC, strokeWidth: 3, cornerRadius: 6 })));
    ev.push(lock(S({ x: 110, y: y + 10, width: 780, height: 190, fill: null, stroke: GOLD_D, strokeWidth: 1.2, cornerRadius: 3 })));
    ev.push(O(tileIcon({ size: 140, stroke: TERRA_DD, fill: TERRA, accent: GOLD }), { x: 138, y: y + 35, width: 140 }));
    ev.push(T(e.bn, y + 30, { x: 316, width: 540, align: "left", fontFamily: "Tiro Bangla", fontSize: 50, fill: TERRA_D, lineHeight: 1.3 }));
    ev.push(label(e.en, y + 100, { x: 316, width: 540, align: "left", fontSize: 13, letterSpacing: 7 }));
    ev.push(T(e.whenBn, y + 128, { x: 316, width: 560, align: "left", fontFamily: "Hind Siliguri", fontSize: 23, fontWeight: 500, fill: TERRA_DD }));
    ev.push(T(e.whenEn, y + 164, { x: 316, width: 560, align: "left", fontFamily: "Cormorant Garamond", italic: true, fontSize: 25, fill: TERRA_D }));
  });

  const details = P(
    terraBg,
    [
      ...tileGround(),
      lock(O(domeRow({ w: 1100, fill: clayFill, stroke: "#2f1006", accent: GOLD }), { x: -50, y: 0, width: 1100, opacity: 1 })),
      lock(S({ x: 0, y: 228, width: W, height: 8, fill: GOLD })),
      T("অনুষ্ঠানসূচি", 252, { x: 160, width: 680, fontFamily: "Tiro Bangla", fontSize: 62, fill: "#f7dc9a", lineHeight: 1.3, shadow }),
      ...ev,
      lock(S({ x: 0, y: 1130, width: W, height: 270, fill: clayFill })),
      lock(S({ x: 0, y: 1130, width: W, height: 6, fill: GOLD })),
      lock(O(vine(928, "#f1cd86"), { x: 36, y: 1150, width: 928, opacity: 0.55 })),
      label("স্থান  ·  Venue", 1244, { color: GOLDC, fill: GOLDC, fontFamily: "Hind Siliguri", fontSize: 20, letterSpacing: 4, uppercase: false }),
      T("খানজাহান গার্ডেন রিসোর্ট", 1276, { x: 160, width: 680, fontFamily: "Tiro Bangla", fontSize: 38, fill: CREAM, lineHeight: 1.3 }),
      T("Khan Jahan Garden Resort, Bagerhat", 1332, { x: 160, width: 680, fontFamily: "Cormorant Garamond", fontSize: 26, fontWeight: 500, fill: SAND }),
    ],
    "Schedule",
  );
  // ---------- blessing ----------
  const photo = P(
    terraBg,
    [
      ...tileGround(),
      lock(O(foilArchFrame({ w: 640, h: 800, lobes: 9, stroke: GOLDC, sw: 4, fill: creamFill, lines: 3, gap: 13 }), { x: 180, y: 90, width: 640 })),
      I({ x: 220, y: 200, width: 560, height: 650, mask: "arch", placeholderFill: "#c9764d", borderColor: GOLD_D, borderWidth: 3 }),
      O(medallion({ size: 150, stroke: TERRA_DD, fill: CREAM, accent: GOLD, n: 12 }), { cx: W / 2, y: 124, width: 78 }),
      T("দুটি জীবন, এক গল্প", 936, { x: 140, width: 720, fontFamily: "Tiro Bangla", fontSize: 58, fill: "#f5d890", lineHeight: 1.35, shadow }),
      T("আপনাদের উপস্থিতি ও দোয়া আমাদের নতুন পথচলার শ্রেষ্ঠ পাথেয়", 1024, { x: 140, width: 720, fontFamily: "Hind Siliguri", fontSize: 26, fill: CREAM, lineHeight: 1.55 }),
      T("Join us as two stories become one.", 1108, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontSize: 28, lineHeight: 1.4, fill: SAND }),
      lock(S({ x: 0, y: 1210, width: W, height: 190, fill: clayFill })),
      lock(S({ x: 0, y: 1210, width: W, height: 6, fill: GOLD })),
      lock(O(vine(928, "#f1cd86"), { x: 36, y: 1226, width: 928, opacity: 0.55 })),
      T("Samia & Rakib", 1322, { x: 200, width: 600, fontFamily: "Cinzel", fontWeight: 500, fontSize: 28, fill: GOLD, letterSpacing: 6 }),
    ],
    "Blessing",
  );

  return {
    slug: "bd-terracotta-tile-gold",
    name: "Terracotta Tile Gold",
    tagline: "Modern Bangladeshi wedding card inspired by Bagerhat mosque terracotta relief",
    description:
      "A warm terracotta and gold Bangladeshi wedding invitation inspired by the Sixty Dome Mosque and Kantajew temple tile reliefs, with embossed rosette tiles, a multifoil arch, domes and Bangla Shubho Bibaho typography.",
    categories: ["bengali", "cultural", "modern", "luxury", "geometric"],
    keywords: [
      "terracotta wedding invitation bangladesh",
      "bagerhat mosque tile inspired wedding card",
      "terracotta and gold bangla biyer card",
      "multifoil arch heritage wedding invitation",
      "modern bangladeshi wedding card online",
    ],
    palette: [TERRA, TERRA_D, GOLDC, CREAM, SAND],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
