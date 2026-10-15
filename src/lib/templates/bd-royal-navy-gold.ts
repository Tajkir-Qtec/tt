import { divider, islamicStar } from "../design/ornaments";
import { GUEST_TOKEN } from "../design/types";
import { chhatriRow, jaaliHex, khatam, mughalArch } from "./bd-royal-navy-gold.art";
import { GOLD, H, I, linear, lock, O, P, radial, S, T, W, type TemplateDef } from "./kit";

const NAVY_D = "#060d24";
const NAVY = "#0d1a45";
const NAVY_L = "#17296a";
const IVORY = "#f6edd8";
const MUTE = "#c3bba4";
const GOLDC = "#dcb865";
const GOLD_D = "#a98334";

const bgNavy = radial([0, "#1a2e72"], [0.55, "#0e1c4b"], [1, "#050b1f"]);
const panelFill = linear(90, [0, "#0a1740"], [0.5, "#142563"], [1, "#0a1740"]);
const glow = (x: number, y: number, w: number, h: number, a: number) =>
  lock(S({ x, y, width: w, height: h, shape: "ellipse", fill: radial([0, `rgba(86,120,214,${a})`], [1, "rgba(86,120,214,0)"]) }));

export default function bdRoyalNavyGold(): TemplateDef {
  const frame = () => [
    lock(S({ x: 30, y: 30, width: 940, height: 1340, shape: "rect", fill: null, stroke: GOLDC, strokeWidth: 1.6 })),
    lock(S({ x: 42, y: 42, width: 916, height: 1316, shape: "rect", fill: null, stroke: GOLDC, strokeWidth: 0.7, opacity: 0.6 })),
  ];
  const jaali = (op = 0.14) => lock(O(jaaliHex({ w: W, h: H, color: GOLDC, cell: 84, sw: 1.1 }), { x: 0, y: 0, width: W, opacity: op }));
  const cap = (text: string, y: number, o = {}) =>
    T(text, y, { x: 200, width: 600, fontFamily: "Jost", fontSize: 15, letterSpacing: 8, fontWeight: 500, fill: GOLDC, uppercase: true, ...o });

  // ---------- cover ----------
  const cover = P(
    bgNavy,
    [
      jaali(0.16),
      ...frame(),
      glow(100, 160, 800, 700, 0.35),
      lock(O(khatam({ stroke: GOLDC, fill: NAVY, size: 96, sw: 2.2 }), { cx: W / 2, y: 90, width: 96 })),
      lock(O(mughalArch({ w: 780, h: 1120, stroke: GOLDC, fill: panelFill, outerFill: NAVY_D, cusps: 9, sw: 4, sp: 560 }), { x: 110, y: 190, width: 780 })),
      lock(O(islamicStar({ color: GOLDC, size: 70, strokeWidth: 1.6 }), { cx: 105, y: 150, width: 70, opacity: 0.8 })),
      lock(O(islamicStar({ color: GOLDC, size: 70, strokeWidth: 1.6 }), { cx: 895, y: 150, width: 70, opacity: 0.8 })),
      lock(O(chhatriRow({ w: 420, color: GOLDC, fill: NAVY_D, n: 7, sw: 1.6 }), { cx: W / 2, y: 1196, width: 420, opacity: 0.85 })),
      T("শুভ বিবাহ", 384, { x: 240, width: 520, fontFamily: "Tiro Bangla", fontSize: 92, fill: GOLD, lineHeight: 1.3 }),
      cap("The wedding of", 524, { fontSize: 14 }),
      T(GUEST_TOKEN, 566, { x: 240, width: 520, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 32, fill: GOLDC }),
      T("Farhana", 610, { x: 200, width: 600, fontFamily: "Playfair Display", fontWeight: 500, fontSize: 88, fill: IVORY, lineHeight: 1.2 }),
      T("&", 728, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontSize: 56, fill: GOLDC }),
      T("Imran", 756, { x: 200, width: 600, fontFamily: "Playfair Display", fontWeight: 500, fontSize: 88, fill: IVORY, lineHeight: 1.2 }),
      O(divider({ style: "diamond", w: 360, color: GOLDC, strokeWidth: 1.6 }), { cx: W / 2, y: 894, width: 360 }),
      T("ফারহানা  ও  ইমরান", 948, { x: 200, width: 600, fontFamily: "Tiro Bangla", fontSize: 40, fill: GOLD, lineHeight: 1.3 }),
      T("শুক্রবার, ৩ ডিসেম্বর ২০২৭  ·  সন্ধ্যা ৭টা", 1016, { x: 180, width: 640, fontFamily: "Hind Siliguri", fontSize: 24, fontWeight: 500, fill: IVORY }),
      T("Friday, 3rd December 2027  ·  7:00 PM", 1058, { x: 180, width: 640, fontFamily: "Cormorant Garamond", italic: true, fontSize: 26, fill: MUTE }),
      T("নবাববাড়ি ব্যাংকুয়েট হল, ধানমন্ডি, ঢাকা", 1112, { x: 180, width: 640, fontFamily: "Hind Siliguri", fontSize: 22, fill: IVORY }),
      T("Nawabbari Banquet Hall, Dhanmondi, Dhaka", 1148, { x: 180, width: 640, fontFamily: "Cormorant Garamond", fontSize: 22, fontWeight: 500, fill: MUTE, letterSpacing: 1 }),
    ],
    "Invitation",
  );

  // ---------- details: four niches ----------
  const events = [
    { bn: "গায়ে হলুদ", en: "Gaye Holud", d: "বৃহস্পতিবার", d2: "২ ডিসেম্বর", t: "বিকেল ৫টা" },
    { bn: "আকদ", en: "Akd Ceremony", d: "শুক্রবার", d2: "৩ ডিসেম্বর", t: "বিকেল ৪টা" },
    { bn: "বিবাহ ভোজ", en: "Wedding Banquet", d: "শুক্রবার", d2: "৩ ডিসেম্বর", t: "সন্ধ্যা ৭টা" },
    { bn: "বউভাত", en: "Reception", d: "শনিবার", d2: "৪ ডিসেম্বর", t: "সন্ধ্যা ৭টা ৩০" },
  ];
  const nicheLayers: ReturnType<typeof T>[] = [];
  const niches: ReturnType<typeof O>[] = [];
  events.forEach((e, i) => {
    const x = i % 2 === 0 ? 112 : 528;
    const y = i < 2 ? 360 : 770;
    niches.push(lock(O(mughalArch({ w: 360, h: 380, stroke: GOLDC, fill: panelFill, outerFill: NAVY_D, cusps: 5, sw: 2.6, sp: 150 }), { x, y, width: 360 })));
    const cx = x + 40;
    const w = 280;
    nicheLayers.push(T(e.bn, y + 178, { x: cx, width: w, fontFamily: "Tiro Bangla", fontSize: 38, fill: GOLD, lineHeight: 1.25 }));
    nicheLayers.push(cap(e.en, y + 236, { x: cx, width: w, fontSize: 12, letterSpacing: 5 }));
    nicheLayers.push(T(e.d, y + 268, { x: cx, width: w, fontFamily: "Hind Siliguri", fontSize: 21, fill: IVORY }));
    nicheLayers.push(T(e.d2, y + 298, { x: cx, width: w, fontFamily: "Hind Siliguri", fontSize: 24, fontWeight: 500, fill: IVORY }));
    nicheLayers.push(T(e.t, y + 334, { x: cx, width: w, fontFamily: "Hind Siliguri", fontSize: 20, fill: GOLDC }));
  });
  const details = P(
    bgNavy,
    [
      jaali(0.14),
      ...frame(),
      lock(O(chhatriRow({ w: 700, color: GOLDC, fill: NAVY_D, n: 11, sw: 1.8 }), { cx: W / 2, y: 88, width: 700 })),
      T("অনুষ্ঠানসূচি", 182, { x: 200, width: 600, fontFamily: "Tiro Bangla", fontSize: 78, fill: GOLD, lineHeight: 1.3 }),
      cap("Celebration schedule", 282),
      O(divider({ style: "diamond", w: 360, color: GOLDC, strokeWidth: 1.6 }), { cx: W / 2, y: 312, width: 360 }),
      ...niches,
      ...nicheLayers,
      O(khatam({ stroke: GOLDC, fill: NAVY, size: 52, sw: 1.6 }), { cx: W / 2, y: 1184, width: 52 }),
      T("নবাববাড়ি ব্যাংকুয়েট হল", 1252, { x: 200, width: 600, fontFamily: "Tiro Bangla", fontSize: 36, fill: IVORY, lineHeight: 1.3 }),
      T("১২ মিরপুর রোড, ধানমন্ডি, ঢাকা  ·  Dress code: Formal", 1304, { x: 120, width: 760, fontFamily: "Hind Siliguri", fontSize: 18, fill: MUTE }),
    ],
    "Schedule",
  );

  // ---------- photo ----------
  const photo = P(
    bgNavy,
    [
      jaali(0.15),
      ...frame(),
      glow(80, 120, 840, 760, 0.35),
      lock(O(khatam({ stroke: GOLDC, fill: NAVY, size: 80, sw: 2 }), { cx: W / 2, y: 82, width: 80 })),
      lock(O(mughalArch({ w: 640, h: 800, stroke: GOLDC, fill: panelFill, outerFill: NAVY_D, cusps: 9, sw: 4, sp: 400 }), { x: 180, y: 178, width: 640 })),
      I({ x: 262, y: 262, width: 476, height: 690, mask: "arch", placeholderFill: NAVY_L, borderColor: GOLDC, borderWidth: 3 }),
      T("দুটি হৃদয়, একটি পথ", 1022, { x: 100, width: 800, fontFamily: "Tiro Bangla", fontSize: 58, fill: GOLD, lineHeight: 1.35 }),
      T("আপনাদের দোয়া ও উপস্থিতি আমাদের নতুন যাত্রার শ্রেষ্ঠ উপহার।", 1112, { x: 160, width: 680, fontFamily: "Hind Siliguri", fontSize: 24, fill: IVORY, lineHeight: 1.55 }),
      T("With your blessings, our journey begins.", 1196, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontSize: 28, fill: MUTE }),
      T("Farhana & Imran", 1262, { x: 200, width: 600, fontFamily: "Cinzel", fontWeight: 500, fontSize: 28, letterSpacing: 6, fill: GOLD }),
    ],
    "Blessing",
  );

  return {
    slug: "bd-royal-navy-gold",
    name: "Royal Navy Mughal Gold",
    tagline: "Navy and gold Mughal arch wedding card with jaali lattice, in Bangla and English",
    description:
      "A regal bilingual Bangladeshi wedding invitation in deep navy and foil gold, framed by a multifoil Mughal arch and jaali lattice inspired by Old Dhaka's heritage. Perfect for grand banquet hall weddings and walima-style receptions.",
    categories: ["bengali", "luxury", "classic", "dark", "ceremony"],
    keywords: [
      "navy blue gold wedding invitation bangladesh",
      "mughal arch bangla wedding card",
      "royal bangladeshi biyer card with jaali",
      "bilingual bangla english wedding invitation",
      "old dhaka heritage wedding card design",
    ],
    palette: [NAVY, NAVY_L, GOLDC, IVORY, GOLD_D],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
