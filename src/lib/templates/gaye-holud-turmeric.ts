import { divider } from "../design/ornaments";
import { GUEST_TOKEN } from "../design/types";
import { ellipsePts, halo, marigoldString, quadPts, singleMarigold, swayPts } from "./gaye-holud-turmeric.art";
import { H, I, linear, lock, O, P, radial, S, T, W, type TemplateDef } from "./kit";

const MAROON = "#6a1f0a";
const GREEN = "#1f5a2e";
const TURM = "#e29a0e";
const CREAM = "#fff3c9";
const SUN = "#ffc83a";

const cardShadow = { color: "#ffffff", blur: 0, offsetX: 0, offsetY: 2, opacity: 0.55 };
const bgCover = linear(90, [0, "#ffcf45"], [0.45, "#ffe58a"], [1, "#ffc233"]);
const bgSoft = linear(90, [0, "#ffe27a"], [0.5, "#fff4cf"], [1, "#ffdb62"]);

const swagTop = (sag = 140) => O(marigoldString({ pts: quadPts([0, 50], [550, 50 + sag * 2], [1100, 50]), w: 1100, h: 90 + sag, r: 26 }), { x: -50, y: 0, width: 1100 });
const swagBottom = () => O(marigoldString({ pts: quadPts([0, 110], [550, 110 - 150], [1100, 110]), w: 1100, h: 150, r: 26 }), { x: -50, y: 1400 - 150, width: 1100 });
const strand = (cx: number, len: number, tassel = true) => O(marigoldString({ pts: swayPts(35, -10, len), w: 70, h: len + 70, r: 26, tassel }), { x: cx - 35, y: 0, width: 70 });
const curtains = (lens: [number, number, number], both = true) => [
  lock(strand(26, lens[0])),
  lock(strand(92, lens[1])),
  lock(strand(158, lens[2])),
  ...(both ? [lock(strand(974, lens[0])), lock(strand(908, lens[1])), lock(strand(842, lens[2]))] : []),
];

export default function gayeHoludTurmeric(): TemplateDef {
  const caps = (text: string, y: number, o = {}) =>
    T(text, y, { x: 190, width: 620, fontFamily: "Jost", fontSize: 17, fill: MAROON, letterSpacing: 9, uppercase: true, fontWeight: 500, ...o });

  const glow = () =>
    lock(S({ x: -100, y: 150, width: 1200, height: 1100, shape: "ellipse", fill: radial([0, "rgba(255,255,255,0.65)"], [0.6, "rgba(255,244,200,0.25)"], [1, "rgba(255,230,140,0)"]) }));

  const cover = P(
    bgCover,
    [
      glow(),
      lock(O(halo("#d98a12", 760), { cx: W / 2, y: 330, width: 760, opacity: 0.35 })),
      ...curtains([700, 520, 360]),
      lock(swagBottom()),
      lock(swagTop(130)),
      T("গায়ে হলুদ", 262, { x: 190, width: 620, fontFamily: "Tiro Bangla", fontSize: 124, fill: MAROON, lineHeight: 1.3, shadow: cardShadow }),
      caps("The Holud Celebration", 452, { fontSize: 16 }),
      T("আপনাকে হলুদ সন্ধ্যায় সাদর আমন্ত্রণ", 508, { x: 190, width: 620, fontFamily: "Hind Siliguri", fontSize: 27, fill: GREEN, lineHeight: 1.4, fontWeight: 500 }),
      T(GUEST_TOKEN, 562, { x: 220, width: 560, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 600, fontSize: 38, fill: "#a64a0b" }),
      T("Tasnim", 628, { x: 190, width: 620, fontFamily: "Playfair Display", fontWeight: 500, fontSize: 88, fill: MAROON, shadow: cardShadow }),
      T("&", 732, { x: 190, width: 620, fontFamily: "Cormorant Garamond", italic: true, fontSize: 54, fill: GREEN }),
      T("Rafi", 768, { x: 190, width: 620, fontFamily: "Playfair Display", fontWeight: 500, fontSize: 88, fill: MAROON, shadow: cardShadow }),
      T("তাসনিম  ও  রাফি", 886, { x: 190, width: 620, fontFamily: "Tiro Bangla", fontSize: 44, fill: GREEN, lineHeight: 1.4 }),
      O(divider({ style: "floral", w: 300, color: MAROON }), { cx: W / 2, y: 958, width: 300 }),
      T("বৃহস্পতিবার, ৯ ডিসেম্বর ২০২৭  ·  বিকেল ৪টা", 1020, { x: 170, width: 660, fontFamily: "Hind Siliguri", fontWeight: 600, fontSize: 27, fill: MAROON, lineHeight: 1.4 }),
      caps("Thursday · 9 December 2027 · 4:00 PM", 1070, { fontSize: 15, letterSpacing: 6, x: 150, width: 700 }),
      T("লেকভিউ গার্ডেন, ধানমন্ডি, ঢাকা", 1112, { x: 190, width: 620, fontFamily: "Hind Siliguri", fontSize: 25, fill: GREEN, fontWeight: 500, lineHeight: 1.4 }),
      T("Lakeview Garden, Dhanmondi, Dhaka", 1156, { x: 190, width: 620, fontFamily: "Cormorant Garamond", italic: true, fontSize: 26, fill: MAROON }),
    ],
    "Invitation",
  );

  // ---------- details ----------
  const items = [
    { t: "বিকেল ৪টা", te: "4:00 PM", bn: "হলুদ ছোঁয়ানো", en: "The holud ceremony" },
    { t: "সন্ধ্যা ৬টা", te: "6:00 PM", bn: "গান ও নাচ", en: "Music & dance" },
    { t: "রাত ৮টা", te: "8:00 PM", bn: "নৈশভোজ", en: "Dinner together" },
  ];
  const tl: ReturnType<typeof T>[] = [];
  const dots: ReturnType<typeof O>[] = [];
  items.forEach((it, i) => {
    const y = 482 + i * 168;
    tl.push(T(it.t, y + 4, { x: 170, width: 260, align: "right", fontFamily: "Hind Siliguri", fontSize: 30, fontWeight: 600, fill: MAROON, lineHeight: 1.3 }));
    tl.push(T(it.te, y + 52, { x: 170, width: 260, align: "right", fontFamily: "Jost", fontSize: 15, letterSpacing: 5, fill: "#a64a0b", fontWeight: 500 }));
    tl.push(T(it.bn, y - 2, { x: 534, width: 310, align: "left", fontFamily: "Tiro Bangla", fontSize: 42, fill: GREEN, lineHeight: 1.3 }));
    tl.push(T(it.en, y + 62, { x: 534, width: 310, align: "left", fontFamily: "Cormorant Garamond", italic: true, fontSize: 26, fill: MAROON }));
    dots.push(O(singleMarigold(64), { cx: 474, y: y + 4, width: 64 }));
  });

  const details = P(
    bgSoft,
    [
      glow(),
      lock(strand(26, 1060)),
      lock(strand(92, 760)),
      lock(strand(974, 1060)),
      lock(strand(908, 760)),
      lock(swagBottom()),
      lock(swagTop(110)),
      T("আয়োজন", 236, { x: 190, width: 620, fontFamily: "Tiro Bangla", fontSize: 96, fill: MAROON, lineHeight: 1.3, shadow: cardShadow }),
      caps("Holud Evening Programme", 372),
      lock(S({ x: 473, y: 520, width: 2.4, height: 332, fill: TURM, opacity: 0.8 })),
      ...tl,
      ...dots,
      lock(S({ x: 190, y: 1002, width: 620, height: 232, shape: "rect", cornerRadius: 28, fill: "rgba(255,255,255,0.55)", stroke: TURM, strokeWidth: 2 })),
      caps("স্থান  ·  Venue", 1026, { fontFamily: "Hind Siliguri", uppercase: false, letterSpacing: 4, fontSize: 20, fill: "#a64a0b" }),
      T("লেকভিউ গার্ডেন, ধানমন্ডি", 1062, { x: 200, width: 600, fontFamily: "Tiro Bangla", fontSize: 40, fill: GREEN, lineHeight: 1.3 }),
      T("Lakeview Garden, Road 8, Dhanmondi, Dhaka", 1122, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontSize: 26, fill: MAROON }),
      T("পোশাক: হলুদ ও সবুজের ছোঁয়া", 1172, { x: 200, width: 600, fontFamily: "Hind Siliguri", fontSize: 24, fill: MAROON, fontWeight: 500 }),
    ],
    "Programme",
  );

  // ---------- blessing ----------
  const photo = P(
    bgCover,
    [
      glow(),
      ...curtains([760, 560, 380]),
      lock(swagBottom()),
      lock(O(marigoldString({ pts: ellipsePts(242, 292, 202, 252), w: 484, h: 584, r: 26, closed: true }), { cx: W / 2, y: 228, width: 484 })),
      I({ x: 330, y: 300, width: 340, height: 440, mask: "ellipse", placeholderFill: "#f6c85a", borderColor: MAROON, borderWidth: 3 }),
      T("হলুদের ছোঁয়ায় রঙিন হোক জীবন", 842, { x: 190, width: 620, fontFamily: "Tiro Bangla", fontSize: 50, fill: MAROON, lineHeight: 1.35, shadow: cardShadow }),
      T("আপনাদের উপস্থিতি আমাদের আনন্দকে আরও রঙিন করবে", 984, { x: 200, width: 600, fontFamily: "Hind Siliguri", fontSize: 25, fill: GREEN, lineHeight: 1.55, fontWeight: 500 }),
      T("Join us, and let the turmeric bring joy and colour.", 1068, { x: 190, width: 620, fontFamily: "Cormorant Garamond", italic: true, fontSize: 27, fill: MAROON }),
      T("Tasnim & Rafi", 1138, { x: 190, width: 620, fontFamily: "Cinzel", fontWeight: 600, fontSize: 28, letterSpacing: 7, fill: MAROON }),
    ],
    "Blessing",
  );
  void CREAM;
  void SUN;

  return {
    slug: "gaye-holud-turmeric",
    name: "Gaye Holud Turmeric",
    tagline: "Bright marigold garland Gaye Holud invitation in Bangla",
    description:
      "A joyful Gaye Holud invitation in marigold yellow and turmeric gold with hanging genda phool garlands, green leaf accents and a bold Bangla গায়ে হলুদ heading, perfect for a holud night or haldi ceremony.",
    categories: ["bengali", "indian", "festive", "floral", "party"],
    keywords: [
      "gaye holud invitation card",
      "bangla gaye holud card with marigold garland",
      "haldi ceremony invitation yellow bengali",
      "holud shondha nimontron card online",
      "marigold garland holud invitation",
    ],
    palette: ["#ffc83a", "#e29a0e", MAROON, GREEN, "#fff3c9"],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
