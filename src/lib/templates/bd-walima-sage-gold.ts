import { archFrame, crescent, divider, islamicPattern, sparkle, star } from "../design/ornaments";
import { GUEST_TOKEN } from "../design/types";
import { crescentRow, khatam } from "./bd-events.art";
import { GOLD, H, I, linear, lock, O, P, radial, S, T, W, type TemplateDef } from "./kit";

const SAGE = "#a9baa0";
const SAGE_M = "#7f9a76";
const SAGE_D = "#4a6247";
const SAGE_DD = "#2c3f2d";
const IVORY = "#f8f3e4";
const IVORY_D = "#ece4cc";
const GOLDC = "#c9a45a";
const GOLD_D = "#8e6c27";

const sageBg = linear(90, [0, "#b4c4aa"], [0.5, "#9bb092"], [1, "#8ba482"]);
const ivoryBg = linear(90, [0, "#f4ecd6"], [0.5, "#fbf7ea"], [1, "#f1e8cf"]);
const ivoryFill = linear(90, [0, "#f3ead2"], [0.5, "#fcf9ee"], [1, "#f1e8cf"]);
const goldText = linear(100, [0, "#8a6a2f"], [0.3, "#c9a45a"], [0.6, "#a8822f"], [1, "#d8b86a"]);

function sageGround() {
  return [
    lock(O(islamicPattern({ color: IVORY, w: 1000, h: 1400, cell: 120, strokeWidth: 1.6 }), { x: 0, y: 0, width: 1000, opacity: 0.2 })),
    lock(S({ x: -150, y: 0, width: 1300, height: 1300, shape: "ellipse", fill: radial([0, "rgba(248,243,228,0.38)"], [0.7, "rgba(248,243,228,0.06)"], [1, "rgba(248,243,228,0)"]) })),
  ];
}


export default function bdWalimaSageGold(): TemplateDef {
  const label = (text: string, y: number, o = {}) =>
    T(text, y, { x: 200, width: 600, fontFamily: "Jost", fontSize: 16, fill: GOLD_D, letterSpacing: 8, uppercase: true, fontWeight: 500, ...o });

  // ---------------- cover ----------------
  const cover = P(
    sageBg,
    [
      ...sageGround(),
      lock(O(archFrame({ w: 760, h: 1210, stroke: GOLDC, strokeWidth: 3.4, fill: ivoryFill, lines: 2, gap: 14 }), { x: 120, y: 100, width: 760 })),
      lock(O(archFrame({ w: 700, h: 1150, stroke: SAGE_M, strokeWidth: 1.4, lines: 1 }), { x: 150, y: 130, width: 700 })),
      O(crescent({ color: GOLDC, size: 64 }), { cx: W / 2 - 22, y: 168, width: 60, rotation: -20 }),
      O(star({ color: GOLDC, points: 5, size: 30, fill: true }), { cx: W / 2 + 28, y: 180, width: 26 }),
      T("بسم الله الرحمن الرحيم", 262, { x: 220, width: 560, fontFamily: "Amiri", fontSize: 46, fill: goldText, lineHeight: 1.5 }),
      O(khatam({ size: 240, stroke: GOLD_D, fill: "rgba(169,186,160,0.35)", accent: GOLDC, petalFill: "rgba(169,186,160,0.55)", sw: 2.4 }), { cx: W / 2, y: 352, width: 240 }),
      T("ওয়ালিমা", 604, { x: 160, width: 680, fontFamily: "Tiro Bangla", fontSize: 98, fill: SAGE_D, lineHeight: 1.3 }),
      label("Walima celebration", 740, { letterSpacing: 10 }),
      T(GUEST_TOKEN, 782, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 32, fill: GOLD_D }),
      T("Samiha", 830, { x: 160, width: 680, fontFamily: "Playfair Display", fontWeight: 500, fontSize: 66, fill: SAGE_DD }),
      T("&", 910, { x: 160, width: 680, fontFamily: "Cormorant Garamond", italic: true, fontSize: 50, fill: GOLD_D }),
      T("Rayhan", 944, { x: 160, width: 680, fontFamily: "Playfair Display", fontWeight: 500, fontSize: 66, fill: SAGE_DD }),
      T("সামিহা  ও  রায়হান", 1038, { x: 200, width: 600, fontFamily: "Tiro Bangla", fontSize: 34, fill: SAGE_D, lineHeight: 1.3 }),
      O(divider({ style: "diamond", w: 380, color: GOLDC }), { cx: W / 2, y: 1104, width: 380 }),
      T("রবিবার, ২১ নভেম্বর ২০২৭  ·  দুপুর ১২টা ৩০", 1142, { x: 170, width: 660, fontFamily: "Hind Siliguri", fontSize: 26, fontWeight: 500, fill: SAGE_DD }),
      T("Al-Amin Convention Centre, Uttara, Dhaka", 1190, { x: 170, width: 660, fontFamily: "Cormorant Garamond", fontWeight: 600, fontSize: 27, fill: GOLD_D, letterSpacing: 1 }),
      lock(O(crescentRow({ len: 420, color: GOLDC, size: 20 }), { cx: W / 2, y: 1246, width: 420 })),
    ],
    "Cover",
  );

  // ---------------- details ----------------
  const rows = [
    { en: "Date", bn: "রবিবার, ২১ নভেম্বর ২০২৭", sub: "Sunday, 21 November 2027" },
    { en: "Time", bn: "দুপুর ১২টা ৩০ থেকে বিকেল ৪টা", sub: "12:30 PM to 4:00 PM" },
    { en: "Venue", bn: "আল-আমিন কনভেনশন সেন্টার", sub: "সেক্টর ৭, উত্তরা, ঢাকা  ·  Sector 7, Uttara, Dhaka" },
    { en: "Attire", bn: "শালীন ও ঐতিহ্যবাহী পোশাক", sub: "Modest, traditional attire" },
  ];
  const cards: (ReturnType<typeof T> | ReturnType<typeof S> | ReturnType<typeof O>)[] = [];
  rows.forEach((r, i) => {
    const y = 380 + i * 176;
    cards.push(lock(S({ x: 100, y, width: 800, height: 150, fill: "rgba(255,255,255,0.55)", stroke: GOLDC, strokeWidth: 1.6, cornerRadius: 6 })));
    cards.push(O(khatam({ size: 110, stroke: GOLD_D, fill: "rgba(169,186,160,0.4)", accent: GOLDC, petalFill: "rgba(169,186,160,0.6)", sw: 2 }), { x: 130, y: y + 20, width: 110 }));
    cards.push(T(r.en, y + 22, { x: 280, width: 580, align: "left", fontFamily: "Jost", fontSize: 14, letterSpacing: 7, uppercase: true, fontWeight: 500, fill: GOLD_D }));
    cards.push(T(r.bn, y + 46, { x: 280, width: 590, align: "left", fontFamily: "Tiro Bangla", fontSize: 36, fill: SAGE_D, lineHeight: 1.3 }));
    cards.push(T(r.sub, y + 106, { x: 280, width: 590, align: "left", fontFamily: "Cormorant Garamond", italic: true, fontSize: 24, fill: "#5d5a46" }));
  });
  const details = P(
    ivoryBg,
    [
      lock(O(islamicPattern({ color: SAGE_M, w: 1000, h: 1400, cell: 120, strokeWidth: 1.4 }), { x: 0, y: 0, width: 1000, opacity: 0.1 })),
      lock(S({ x: 0, y: 0, width: W, height: 290, fill: sageBg })),
      lock(O(islamicPattern({ color: IVORY, w: 1000, h: 290, cell: 100, strokeWidth: 1.4 }), { x: 0, y: 0, width: 1000, opacity: 0.2 })),
      lock(S({ x: 0, y: 290, width: W, height: 4, fill: GOLD })),
      T("بسم الله الرحمن الرحيم", 56, { x: 220, width: 560, fontFamily: "Amiri", fontSize: 40, fill: IVORY, lineHeight: 1.5 }),
      T("ওয়ালিমার আমন্ত্রণ", 124, { x: 100, width: 800, fontFamily: "Tiro Bangla", fontSize: 72, fill: IVORY, lineHeight: 1.3 }),
      label("You are warmly invited", 224, { fill: IVORY }),
      ...cards,
      O(divider({ style: "diamond", w: 400, color: GOLD_D }), { cx: W / 2, y: 1100, width: 400 }),
      T("আপনাদের উপস্থিতি ও দোয়া আমাদের নতুন জীবনের পাথেয়", 1140, { x: 150, width: 700, fontFamily: "Hind Siliguri", fontSize: 25, fill: SAGE_DD, lineHeight: 1.6 }),
      T("Samiha & Rayhan, with their families", 1224, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontSize: 26, fill: GOLD_D }),
      lock(O(crescentRow({ len: 420, color: GOLDC, size: 20 }), { cx: W / 2, y: 1300, width: 420 })),
    ],
    "Details",
  );

  // ---------------- photo ----------------
  const photo = P(
    sageBg,
    [
      ...sageGround(),
      lock(O(khatam({ size: 760, stroke: IVORY, fill: "rgba(248,243,228,0.12)", accent: IVORY, petalFill: "rgba(248,243,228,0.1)", sw: 2.6 }), { cx: W / 2, y: 60, width: 760, opacity: 0.55 })),
      lock(O(archFrame({ w: 520, h: 680, stroke: GOLDC, strokeWidth: 3, fill: ivoryFill, lines: 2, gap: 12 }), { cx: W / 2, y: 180, width: 520 })),
      I({ x: 256, y: 224, width: 488, height: 636, mask: "arch", placeholderFill: "#7f9a76", borderColor: IVORY, borderWidth: 3 }),
      O(sparkle({ color: IVORY, size: 50 }), { cx: 130, y: 280, width: 40 }),
      O(sparkle({ color: IVORY, size: 50 }), { cx: 872, y: 660, width: 40 }),
      T("بارك الله لكما وبارك عليكما", 920, { x: 150, width: 700, fontFamily: "Amiri", fontSize: 50, fill: SAGE_DD, lineHeight: 1.5 }),
      T("وجمع بينكما في خير", 996, { x: 150, width: 700, fontFamily: "Amiri", fontSize: 40, fill: SAGE_D, lineHeight: 1.5 }),
      O(divider({ style: "diamond", w: 340, color: IVORY }), { cx: W / 2, y: 1086, width: 340 }),
      T("আল্লাহ আপনাদের দাম্পত্যজীবন সুখী ও বরকতময় করুন", 1140, { x: 150, width: 700, fontFamily: "Hind Siliguri", fontSize: 27, fill: SAGE_DD, lineHeight: 1.55 }),
      lock(O(crescentRow({ len: 420, color: IVORY, size: 20 }), { cx: W / 2, y: 1318, width: 420 })),
      T("SAMIHA  &  RAYHAN", 1232, { x: 200, width: 600, fontFamily: "Cinzel", fontWeight: 500, fontSize: 28, fill: IVORY, letterSpacing: 8 }),
    ],
    "Photo",
  );

  return {
    slug: "bd-walima-sage-gold",
    name: "Walima Sage Gold",
    tagline: "Dignified Bangladeshi walima invitation in sage green, ivory and gold",
    description:
      "A calm, dignified walima invitation in sage green, ivory and gold with an Arabic bismillah header, crescent and a floral khatam star. Bangla and English wording for the walima feast that follows a Bangladeshi nikah.",
    categories: ["bengali", "islamic", "ceremony", "floral", "classic"],
    keywords: [
      "walima invitation card bangladesh",
      "ওয়ালিমা অনুষ্ঠানের আমন্ত্রণ কার্ড",
      "sage green and gold islamic wedding walima card",
      "bismillah crescent walima invite bangla",
      "muslim wedding reception card with khatam star",
    ],
    palette: [SAGE, SAGE_D, IVORY, GOLDC, SAGE_DD],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
