import { archFrame } from "../design/ornaments";
import { GUEST_TOKEN } from "../design/types";
import { H, I, linear, lock, O, P, radial, S, T, W, type TemplateDef } from "./kit";
import { budDivider, lilyPad, reeds, ripples, riverBand, riverLines, shaplaSide, shaplaTop } from "./shapla-river-blush.art";

const SAGE = "#8fa58a";
const SAGE_D = "#52684f";
const SAGE_L = "#cfdccb";
const BLUSH = "#f1cfc8";
const BLUSH_D = "#c98f8a";
const IVORY = "#fcf8f1";
const INK = "#3f4b3d";
const ROSE = "#b4736f";
const HEART = "#e6bb62";

const PETALS = ["#f4d3cc", "#f9e3de", "#fdf0ec", "#ffffff"];

function wash(): ReturnType<typeof lock>[] {
  return [
    lock(S({ x: -260, y: -240, width: 900, height: 760, shape: "ellipse", fill: radial([0, "rgba(160,184,153,0.55)"], [0.6, "rgba(160,184,153,0.2)"], [1, "rgba(160,184,153,0)"]) })),
    lock(S({ x: 520, y: 260, width: 800, height: 820, shape: "ellipse", fill: radial([0, "rgba(240,190,182,0.6)"], [0.6, "rgba(240,190,182,0.22)"], [1, "rgba(240,190,182,0)"]) })),
    lock(S({ x: -300, y: 760, width: 800, height: 700, shape: "ellipse", fill: radial([0, "rgba(196,214,190,0.55)"], [1, "rgba(196,214,190,0)"]) })),
  ];
}

function river(y0: number, tint = 1): ReturnType<typeof lock>[] {
  const h = H - y0;
  return [
    lock(O(riverBand({ w: 1000, h: h, amp: 16, waves: 4, fill: `rgba(207,220,203,${0.55 * tint})`, crest: "rgba(255,255,255,0.9)", crestWidth: 2 }), { x: 0, y: y0, width: 1000, height: h })),
    lock(O(riverBand({ w: 1000, h: h - 70, amp: 14, waves: 5, phase: 1, fill: `rgba(241,207,200,${0.6 * tint})`, crest: "rgba(255,255,255,0.85)", crestWidth: 2 }), { x: 0, y: y0 + 70, width: 1000, height: h - 70 })),
    lock(O(riverBand({ w: 1000, h: h - 150, amp: 12, waves: 6, fill: `rgba(143,165,138,${0.55 * tint})`, crest: "rgba(255,255,255,0.8)", crestWidth: 2 }), { x: 0, y: y0 + 150, width: 1000, height: h - 150 })),
  ];
}

const bg = linear(90, [0, "#fdf9f3"], [0.55, "#faf0ea"], [1, "#f4e6df"]);

export default function build(): TemplateDef {
  const side = (w: number) => shaplaSide({ w, stroke: ROSE, fills: ["#f6d9d3", "#fae6e1", "#fdf1ee", "#ffffff"], heart: HEART });
  const top = (s: number) => shaplaTop({ size: s, stroke: ROSE, layers: PETALS, heart: HEART });
  const pad = (s: number) => lilyPad({ size: s, fill: "#a9bda3", stroke: SAGE_D });

  const cover = P(
    bg,
    [
      ...wash(),
      ...river(1130),
      lock(O(reeds({ w: 220, h: 340, color: SAGE, accent: SAGE_D, seed: 3 }), { x: 30, y: 800, width: 220, height: 340, opacity: 0.55 })),
      lock(O(reeds({ w: 200, h: 300, color: SAGE, accent: SAGE_D, seed: 11 }), { x: 770, y: 840, width: 200, height: 300, opacity: 0.55 })),
      T("সাদর আমন্ত্রণ", 96, { x: 200, width: 600, fontFamily: "Tiro Bangla", fontSize: 30, fill: SAGE_D, letterSpacing: 4 }),
      T(GUEST_TOKEN, 148, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontSize: 34, fill: ROSE }),
      lock(O(ripples({ w: 640, h: 120, color: SAGE_D, rings: 4, strokeWidth: 1.4 }), { cx: W / 2, y: 540, width: 640, height: 120, opacity: 0.5 })),
      lock(O(pad(250), { x: 130, y: 520, width: 250, height: 82, opacity: 0.9 })),
      lock(O(pad(210), { x: 655, y: 545, width: 210, height: 68, opacity: 0.85 })),
      O(side(470), { cx: W / 2, y: 232, width: 470 }),
      T("Anika", 676, { x: 100, width: 800, fontFamily: "Cormorant Garamond", fontWeight: 300, fontSize: 118, fill: INK, letterSpacing: 6 }),
      T("&", 800, { x: 100, width: 800, fontFamily: "Great Vibes", fontSize: 70, fill: ROSE }),
      T("Rafi", 862, { x: 100, width: 800, fontFamily: "Cormorant Garamond", fontWeight: 300, fontSize: 118, fill: INK, letterSpacing: 6 }),
      T("অনিকা ও রাফি", 1004, { x: 200, width: 600, fontFamily: "Tiro Bangla", fontSize: 40, fill: SAGE_D }),
      O(budDivider({ w: 340, color: SAGE_D, accent: BLUSH }), { cx: W / 2, y: 1068, width: 340 }),
      T("Saturday  ·  18 December 2027", 1114 - 4, { x: 150, width: 700, fontFamily: "Jost", fontWeight: 400, fontSize: 18, fill: INK, letterSpacing: 6, uppercase: true }),
      T("Riverside Garden  ·  Ashulia, Dhaka", 1300, { x: 150, width: 700, fontFamily: "Jost", fontWeight: 400, fontSize: 18, fill: "#ffffff", letterSpacing: 5, uppercase: true }),
    ],
    "Cover",
  );

  const ev = (y: number, bn: string, en: string, date: string, time: string) => [
    T(bn, y, { x: 160, width: 680, fontFamily: "Tiro Bangla", fontSize: 54, fill: SAGE_D }),
    T(en, y + 76, { x: 160, width: 680, fontFamily: "Jost", fontWeight: 500, fontSize: 16, fill: ROSE, letterSpacing: 9, uppercase: true }),
    T(date, y + 112, { x: 160, width: 680, fontFamily: "Cormorant Garamond", fontWeight: 500, fontSize: 40, fill: INK }),
    T(time, y + 170, { x: 160, width: 680, fontFamily: "Hind Siliguri", fontSize: 24, fill: "#5e6b5b", lineHeight: 1.4 }),
  ];

  const details = P(
    bg,
    [
      ...wash(),
      ...river(1230, 0.9),
      lock(O(top(150), { cx: W / 2, y: 78, width: 150, height: 150 })),
      T("অনুষ্ঠানসূচি", 252, { x: 160, width: 680, fontFamily: "Tiro Bangla", fontSize: 68, fill: SAGE_D, lineHeight: 1.3 }),
      T("The Celebrations", 352, { x: 160, width: 680, fontFamily: "Cormorant Garamond", italic: true, fontSize: 32, fill: ROSE }),
      ...ev(446, "গায়ে হলুদ", "Gaye Holud", "Friday, 17 December 2027", "বিকাল ৪:০০টা  ·  4:00 PM"),
      O(budDivider({ w: 300, color: SAGE_D, accent: BLUSH }), { cx: W / 2, y: 696, width: 300 }),
      ...ev(758, "শুভ বিবাহ", "The Wedding", "Saturday, 18 December 2027", "বিকাল ৫:০০টা  ·  5:00 PM"),
      O(budDivider({ w: 300, color: SAGE_D, accent: BLUSH }), { cx: W / 2, y: 1008, width: 300 }),
      T("স্থান", 1068, { x: 160, width: 680, fontFamily: "Tiro Bangla", fontSize: 40, fill: SAGE_D }),
      T("Riverside Garden, Ashulia, Dhaka", 1128, { x: 160, width: 680, fontFamily: "Cormorant Garamond", fontWeight: 500, fontSize: 34, fill: INK }),
      T("নদীতীর গার্ডেন, আশুলিয়া, ঢাকা", 1176, { x: 160, width: 680, fontFamily: "Hind Siliguri", fontSize: 22, fill: "#5e6b5b" }),
    ],
    "Details",
  );

  const photo = P(
    bg,
    [
      ...wash(),
      ...river(1190, 1),
      lock(O(archFrame({ w: 500, h: 640, stroke: SAGE_D, strokeWidth: 2, lines: 2, gap: 14 }), { cx: W / 2, y: 130, width: 500 })),
      I({ x: 282, y: 162, width: 436, height: 600, mask: "arch", placeholderFill: "#dfe8dc", borderColor: "#ffffff", borderWidth: 4 }),
      lock(O(ripples({ w: 560, h: 90, color: SAGE_D, rings: 3, strokeWidth: 1.4 }), { cx: W / 2, y: 740, width: 560, height: 90, opacity: 0.5 })),
      lock(O(pad(190), { x: 120, y: 726, width: 190, height: 62, opacity: 0.92 })),
      lock(O(pad(150), { x: 720, y: 748, width: 150, height: 50, opacity: 0.9 })),
      O(side(250), { cx: 300, y: 600, width: 250 }),
      O(side(190), { cx: 720, y: 640, width: 190 }),
      T("দুটি নদী মিলেছে এক স্রোতে", 842, { x: 120, width: 760, fontFamily: "Tiro Bangla", fontSize: 50, fill: SAGE_D, lineHeight: 1.4 }),
      T("Two rivers, one current.", 934, { x: 160, width: 680, fontFamily: "Cormorant Garamond", italic: true, fontSize: 30, fill: ROSE }),
      T("With your blessings, our journey begins.", 976, { x: 160, width: 680, fontFamily: "Cormorant Garamond", italic: true, fontSize: 30, fill: ROSE }),
      O(budDivider({ w: 300, color: SAGE_D, accent: BLUSH }), { cx: W / 2, y: 1040, width: 300 }),
      T("Anika & Rafi", 1100, { x: 160, width: 680, fontFamily: "Cormorant Garamond", fontWeight: 500, fontSize: 40, fill: INK, letterSpacing: 8, uppercase: true }),
    ],
    "Blessing",
  );

  void riverLines;
  return {
    slug: "shapla-river-blush",
    name: "Shapla River Blush",
    tagline: "Soft blush and sage Bangladeshi wedding invitation with shapla and river waves",
    description:
      "A romantic, modern Bangladeshi wedding invitation in blush, sage and ivory, with a watercolor-soft shapla (water lily), lily pads and flowing river waves, plus bilingual Bangla and English details.",
    categories: ["bengali", "floral", "modern", "minimal", "nature"],
    keywords: [
      "shapla bangladeshi wedding invitation",
      "blush and sage bangla wedding card",
      "water lily river wedding invitation",
      "modern bengali biyer card online",
      "romantic bangla shubho bibaho card",
    ],
    palette: [BLUSH, SAGE, SAGE_D, IVORY, ROSE],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
