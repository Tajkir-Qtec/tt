import { decoFrame, divider } from "../design/ornaments";
import { GUEST_TOKEN } from "../design/types";
import { jamdaniBand, weaveTexture } from "./bangla-biye-gold.art";
import { GOLD, H, I, linear, lock, O, P, radial, S, T, W, type TemplateDef } from "./kit";

const MAROON = "#5a1226";
const MAROON_D = "#2f0713";
const GREEN = "#0d3f31";
const GREEN_D = "#06241c";
const GOLDC = "#dcb868";
const GOLD_D = "#b18a3c";
const IVORY = "#f7ecd6";

const shadow = { color: "#000000", blur: 12, offsetX: 0, offsetY: 4, opacity: 0.5 };
const maroonBg = radial([0, "#7a1a34"], [0.65, "#561026"], [1, "#32071a"]);
const greenBg = radial([0, "#14594a"], [0.65, "#0c3d30"], [1, "#05221a"]);

function frame(ground: string, texture: string, bandGround: string): ReturnType<typeof lock>[] {
  return [
    lock(O(weaveTexture({ w: W, h: H, cell: 64, color: texture }), { x: 0, y: 0, width: W, opacity: 0.07 })),
    lock(O(decoFrame({ w: 912, h: 1312, cut: 44, stroke: GOLDC, strokeWidth: 3, lines: 2, gap: 12 }), { x: 44, y: 44, width: 912 })),
    lock(O(jamdaniBand({ len: 768, h: 56, ground: bandGround, motif: GOLD, line: GOLD_D }), { x: 116, y: 80, width: 768 })),
    lock(O(jamdaniBand({ len: 768, h: 56, ground: bandGround, motif: GOLD, line: GOLD_D }), { x: 116, y: 1400 - 80 - 56, width: 768 })),
  ];
  void ground;
}

export default function banglaBiyeGold(): TemplateDef {
  const small = (text: string, y: number, o = {}) =>
    T(text, y, { x: 200, width: 600, fontFamily: "Jost", fontSize: 17, fill: GOLDC, letterSpacing: 9, uppercase: true, fontWeight: 500, ...o });

  const cover = P(
    maroonBg,
    [
      ...frame(MAROON, GOLDC, MAROON_D),
      small("Wedding Invitation", 160),
      T("বিয়ে", 214, { x: 150, width: 700, fontFamily: "Tiro Bangla", fontSize: 300, fill: GOLD, lineHeight: 1.25, shadow }),
      O(divider({ style: "diamond", w: 460, color: GOLDC }), { cx: W / 2, y: 560, width: 460 }),
      T("আমাদের বিয়েতে আপনাকে সাদর আমন্ত্রণ", 616, { x: 120, width: 760, fontFamily: "Hind Siliguri", fontSize: 28, fill: IVORY, lineHeight: 1.4 }),
      T(GUEST_TOKEN, 672, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 38, fill: GOLDC }),
      T("Nusrat & Tanvir", 748, { x: 80, width: 840, fontFamily: "Playfair Display", fontWeight: 500, fontSize: 82, fill: IVORY, shadow }),
      T("নুসরাত  ও  তানভীর", 862, { x: 160, width: 680, fontFamily: "Tiro Bangla", fontSize: 46, fill: GOLD, lineHeight: 1.4 }),
      O(divider({ style: "floral", w: 300, color: GOLDC }), { cx: W / 2, y: 946, width: 300 }),
      T("শুক্রবার, ২৪ ডিসেম্বর ২০২৭  ·  সন্ধ্যা ৭টা", 1012, { x: 120, width: 760, fontFamily: "Hind Siliguri", fontWeight: 500, fontSize: 30, fill: IVORY, lineHeight: 1.4 }),
      small("Friday · 24 December 2027 · 7:00 PM", 1064, { fontSize: 16, letterSpacing: 6, x: 120, width: 760 }),
      T("গ্র্যান্ড লেকশোর ব্যাংকুয়েট, গুলশান, ঢাকা", 1116, { x: 120, width: 760, fontFamily: "Hind Siliguri", fontSize: 24, fill: "#e9d5b0", lineHeight: 1.4 }),
      T("The Grand Lakeshore Banquet, Gulshan, Dhaka", 1160, { x: 120, width: 760, fontFamily: "Cormorant Garamond", italic: true, fontSize: 25, fill: "#e9d5b0" }),
    ],
    "Invitation",
  );

  // ---------- schedule ----------
  const rows = [
    { d: "২২", mBn: "ডিসেম্বর", en: "Wed · Dec", name: "গায়ে হলুদ", label: "Gaye Holud", time: "সন্ধ্যা ৬টা", timeEn: "Wednesday  ·  6:00 PM" },
    { d: "২৪", mBn: "ডিসেম্বর", en: "Fri · Dec", name: "বিয়ে", label: "Wedding Ceremony", time: "সন্ধ্যা ৭টা", timeEn: "Friday  ·  7:00 PM" },
    { d: "২৫", mBn: "ডিসেম্বর", en: "Sat · Dec", name: "বউভাত", label: "Reception", time: "দুপুর ১টা", timeEn: "Saturday  ·  1:00 PM" },
  ];
  const rowLayers: ReturnType<typeof T>[] = [];
  const rules: ReturnType<typeof S>[] = [];
  rows.forEach((r, i) => {
    const y = 338 + i * 224;
    rowLayers.push(T(r.d, y - 6, { x: 90, width: 250, fontFamily: "Tiro Bangla", fontSize: 128, fill: GOLD, lineHeight: 1.1, shadow }));
    rowLayers.push(T(r.mBn, y + 142, { x: 90, width: 250, fontFamily: "Hind Siliguri", fontSize: 24, fontWeight: 500, fill: IVORY }));
    rowLayers.push(T(r.en, y + 176, { x: 90, width: 250, fontFamily: "Jost", fontSize: 14, letterSpacing: 5, uppercase: true, fill: GOLDC, fontWeight: 500 }));
    rowLayers.push(T(r.name, y + 8, { x: 380, width: 520, align: "left", fontFamily: "Tiro Bangla", fontSize: 62, fill: IVORY, lineHeight: 1.25 }));
    rowLayers.push(T(r.label, y + 92, { x: 380, width: 520, align: "left", fontFamily: "Jost", fontSize: 16, letterSpacing: 7, uppercase: true, fill: GOLDC, fontWeight: 500 }));
    rowLayers.push(T(r.time, y + 126, { x: 380, width: 520, align: "left", fontFamily: "Hind Siliguri", fontSize: 28, fontWeight: 500, fill: IVORY }));
    rowLayers.push(T(r.timeEn, y + 168, { x: 380, width: 520, align: "left", fontFamily: "Cormorant Garamond", italic: true, fontSize: 26, fill: "#d9c9a6" }));
    if (i < rows.length - 1) rules.push(S({ x: 110, y: y + 208, width: 780, height: 1.5, fill: GOLD, opacity: 0.55 }));
    rules.push(S({ x: 352, y: y + 6, width: 1.5, height: 190, fill: GOLD, opacity: 0.55 }));
  });

  const details = P(
    greenBg,
    [
      ...frame(GREEN, GOLDC, GREEN_D),
      T("অনুষ্ঠানমালা", 160, { x: 160, width: 680, fontFamily: "Tiro Bangla", fontSize: 80, fill: GOLD, lineHeight: 1.3, shadow }),
      small("The Celebrations", 266),
      ...rules,
      ...rowLayers,
      O(divider({ style: "diamond", w: 460, color: GOLDC }), { cx: W / 2, y: 1022, width: 460 }),
      small("স্থান  ·  Venue", 1068, { fontFamily: "Hind Siliguri", uppercase: false, letterSpacing: 5, fontSize: 20 }),
      T("গ্র্যান্ড লেকশোর ব্যাংকুয়েট", 1104, { x: 120, width: 760, fontFamily: "Tiro Bangla", fontSize: 42, fill: IVORY, lineHeight: 1.3 }),
      T("Road 12, Gulshan 2, Dhaka 1212", 1162, { x: 120, width: 760, fontFamily: "Cormorant Garamond", fontWeight: 500, fontSize: 28, fill: "#e4d3ad", letterSpacing: 1 }),
    ],
    "Schedule",
  );

  // ---------- blessing ----------
  const band = (len: number, vertical: boolean) => jamdaniBand({ len, h: 50, ground: MAROON_D, motif: GOLD, line: GOLD_D, vertical });
  const photo = P(
    maroonBg,
    [
      ...frame(MAROON, GOLDC, MAROON_D),
      lock(O(band(536, false), { x: 232, y: 176, width: 536 })),
      lock(O(band(536, false), { x: 232, y: 784, width: 536 })),
      lock(O(band(558, true), { x: 232, y: 226, height: 558 })),
      lock(O(band(558, true), { x: 718, y: 226, height: 558 })),
      I({ x: 282, y: 226, width: 436, height: 558, mask: "rect", placeholderFill: "#7d2338", borderColor: GOLDC, borderWidth: 3 }),
      T("ভালোবাসায় শুরু হোক পথচলা", 884, { x: 100, width: 800, fontFamily: "Tiro Bangla", fontSize: 56, fill: GOLD, lineHeight: 1.35, shadow }),
      T("আপনাদের দোয়া ও শুভকামনাই আমাদের সবচেয়ে বড় উপহার", 982, { x: 140, width: 720, fontFamily: "Hind Siliguri", fontSize: 26, fill: IVORY, lineHeight: 1.55 }),
      O(divider({ style: "floral", w: 300, color: GOLDC }), { cx: W / 2, y: 1078, width: 300 }),
      T("With your love and blessings, our journey begins.", 1130, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontSize: 28, fill: "#e9d5b0" }),
      small("Nusrat & Tanvir", 1190, { fontFamily: "Cinzel", fontSize: 26, letterSpacing: 7, fill: GOLDC }),
    ],
    "Blessing",
  );

  return {
    slug: "bangla-biye-gold",
    name: "Bangla Biye Gold",
    tagline: "Maroon, bottle-green and gold Bangladeshi wedding card with jamdani borders",
    description:
      "A typography-forward Bangladeshi wedding invitation in deep maroon and bottle green with gold foil lettering, jamdani and katan inspired woven borders, and a bold Bangla বিয়ে heading.",
    categories: ["bengali", "luxury", "cultural", "dark"],
    keywords: [
      "bangladeshi wedding invitation card",
      "bangla biyer card maroon and gold",
      "jamdani border wedding invitation",
      "bangla biye nimontron card online",
      "gaye holud and biye invitation set",
    ],
    palette: [MAROON, GREEN, GOLDC, IVORY, MAROON_D],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
