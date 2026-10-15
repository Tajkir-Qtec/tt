import { divider } from "../design/ornaments";
import { GUEST_TOKEN } from "../design/types";
import { H, I, linear, lock, O, P, radial, S, T, W, type TemplateDef } from "./kit";
import { arcade, clayGrain, dentil, gable, reliefRosette, vineBand } from "./terracotta-temple.art";

const CLAY = "#b6532f";
const CLAY_L = "#c9673f";
const CLAY_D = "#6b2713";
const CLAY_DD = "#43170a";
const CREAM = "#f4e4c9";
const SAND = "#e8c99c";
const GOLDT = "#e2b36b";

const sandFoil = linear(100, [0, "#d8b07c"], [0.35, "#f6e3c0"], [0.65, "#d9b27e"], [1, "#f1d9b0"]);
const darkBg = linear(90, [0, "#7a2f17"], [0.5, "#8d3a1d"], [1, "#5c2210"]);
const midBg = linear(90, [0, "#a64a2a"], [0.5, "#b9562f"], [1, "#964020"]);
const lightBg = linear(90, [0, "#f1dfc2"], [0.5, "#f7ead2"], [1, "#ecd8b8"]);

/** Stepped relief frame: two outlines, dentil top/bottom and corner rosettes. */
function frame(ink: string, bgFill: string, accent: string) {
  const rect = (inset: number, sw: number) => lock(S({ x: inset, y: inset, width: W - inset * 2, height: H - inset * 2, shape: "rect", fill: null, stroke: ink, strokeWidth: sw }));
  const ros = (cx: number, cy: number) => lock(O(reliefRosette({ size: 92, ink, fill: bgFill, accent }), { cx, y: cy - 46, width: 92 }));
  return [
    rect(34, 3.2),
    rect(46, 1.4),
    lock(O(dentil({ w: 700, h: 11, ink }), { cx: W / 2, y: 58, width: 700 })),
    lock(O(dentil({ w: 700, h: 11, ink }), { cx: W / 2, y: H - 69, width: 700 })),
    ros(82, 82),
    ros(W - 82, 82),
    ros(82, H - 82),
    ros(W - 82, H - 82),
  ];
}

export default function build(): TemplateDef {
  const cover = P(
    darkBg,
    [
      lock(S({ x: -100, y: 250, width: 1200, height: 900, shape: "ellipse", fill: radial([0, "rgba(214,110,62,0.5)"], [0.6, "rgba(190,90,50,0.15)"], [1, "rgba(190,90,50,0)"]) })),
      lock(O(clayGrain({ w: 1000, h: 1400, color: "#2a0d05", count: 900, seed: 3 }), { x: 0, y: 0, width: 1000, height: 1400, opacity: 0.22 })),
      ...frame(CREAM, "#7d3219", GOLDT),
      O(gable({ w: 280, h: 150, ink: CREAM, fill: "#9b4423", door: CLAY_DD }), { cx: W / 2, y: 130, width: 280 }),
      T("শুভ বিবাহ", 296, { x: 140, width: 720, fontFamily: "Tiro Bangla", fontSize: 108, fill: sandFoil, lineHeight: 1.3, shadow: { color: "#2a0d05", blur: 8, offsetX: 0, offsetY: 3, opacity: 0.6 } }),
      lock(O(vineBand({ w: 560, h: 54, ink: SAND, accent: "#7d3219" }), { cx: W / 2, y: 442, width: 560 })),
      T("সাদর আমন্ত্রণ", 530, { x: 200, width: 600, fontFamily: "Tiro Bangla", fontSize: 30, fill: SAND, letterSpacing: 4 }),
      T(GUEST_TOKEN, 584, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontSize: 36, fill: CREAM }),
      T("Ishita", 650, { x: 100, width: 800, fontFamily: "Cormorant Garamond", fontWeight: 600, fontSize: 112, fill: CREAM, letterSpacing: 4 }),
      O(reliefRosette({ size: 70, ink: SAND, fill: "#7d3219", accent: GOLDT }), { cx: W / 2, y: 786, width: 70 }),
      T("Debasish", 864, { x: 100, width: 800, fontFamily: "Cormorant Garamond", fontWeight: 600, fontSize: 112, fill: CREAM, letterSpacing: 4 }),
      T("ঈশিতা ও দেবাশিস", 1002, { x: 160, width: 680, fontFamily: "Tiro Bangla", fontSize: 44, fill: SAND }),
      lock(O(vineBand({ w: 560, h: 54, ink: SAND, accent: "#7d3219" }), { cx: W / 2, y: 1090, width: 560 })),
      T("রবিবার  ·  ২৪শে জানুয়ারি ২০২৭", 1170, { x: 140, width: 720, fontFamily: "Tiro Bangla", fontSize: 38, fill: CREAM }),
      T("Sunday, 24 January 2027  ·  Bishnupur, Bankura", 1226, { x: 100, width: 800, fontFamily: "Jost", fontSize: 16, fill: SAND, letterSpacing: 5, uppercase: true }),
    ],
    "Cover",
  );

  const tablet = (y: number, bn: string, en: string, date: string, time: string) => [
    lock(S({ x: 150, y, width: 700, height: 200, shape: "rect", fill: linear(100, [0, "#bd5a34"], [1, "#9c4524"]), stroke: CLAY_DD, strokeWidth: 2.4, cornerRadius: 6 })),
    lock(S({ x: 160, y: y + 10, width: 680, height: 180, shape: "rect", fill: null, stroke: SAND, strokeWidth: 1.4, cornerRadius: 3 })),
    lock(O(reliefRosette({ size: 92, ink: CREAM, fill: "#9c4524", accent: GOLDT }), { cx: 232, y: y + 54, width: 92 })),
    lock(O(reliefRosette({ size: 92, ink: CREAM, fill: "#9c4524", accent: GOLDT }), { cx: 768, y: y + 54, width: 92 })),
    T(bn, y + 18, { x: 290, width: 420, fontFamily: "Tiro Bangla", fontSize: 46, fill: CREAM, lineHeight: 1.3 }),
    T(en, y + 82, { x: 290, width: 420, fontFamily: "Jost", fontWeight: 500, fontSize: 14, fill: GOLDT, letterSpacing: 8, uppercase: true }),
    T(date, y + 110, { x: 290, width: 420, fontFamily: "Cormorant Garamond", fontWeight: 600, fontSize: 31, fill: CREAM }),
    T(time, y + 152, { x: 290, width: 420, fontFamily: "Hind Siliguri", fontSize: 21, fill: SAND }),
  ];

  const details = P(
    lightBg,
    [
      lock(O(clayGrain({ w: 1000, h: 1400, color: "#6b2713", count: 700, seed: 9 }), { x: 0, y: 0, width: 1000, height: 1400, opacity: 0.16 })),
      ...frame(CLAY_D, "#f4e4c9", CLAY),
      lock(O(arcade({ w: 700, n: 5, h: 120, ink: CLAY_DD, fill: linear(100, [0, "#c4623a"], [1, "#a14826"]), recess: "#43170a" }), { cx: W / 2, y: 112, width: 700 })),
      T("অনুষ্ঠানসূচি", 262, { x: 160, width: 680, fontFamily: "Tiro Bangla", fontSize: 68, fill: CLAY_D, lineHeight: 1.3 }),
      T("The Celebrations", 358, { x: 160, width: 680, fontFamily: "Cormorant Garamond", italic: true, fontSize: 32, fill: CLAY }),
      ...tablet(430, "গায়ে হলুদ", "Gaye Holud", "Saturday, 23 January 2027", "সকাল ১১:০০টা  ·  11:00 AM"),
      ...tablet(654, "শুভ বিবাহ", "The Wedding", "Sunday, 24 January 2027", "সন্ধ্যা ৭:৩০টা  ·  7:30 PM"),
      ...tablet(878, "বৌভাত", "Bou Bhaat", "Monday, 25 January 2027", "দুপুর ১২:৩০টা  ·  12:30 PM"),
      T("মল্লভূম ভবন, বিষ্ণুপুর, বাঁকুড়া", 1120, { x: 140, width: 720, fontFamily: "Tiro Bangla", fontSize: 38, fill: CLAY_D }),
      T("Mallabhum Bhaban, Bishnupur, Bankura, West Bengal", 1180, { x: 100, width: 800, fontFamily: "Jost", fontSize: 16, fill: CLAY, letterSpacing: 4, uppercase: true }),
      lock(O(vineBand({ w: 480, h: 46, ink: CLAY_D, accent: "#f4e4c9" }), { cx: W / 2, y: 1224, width: 480 })),
    ],
    "Details",
  );

  const px = 270;
  const py = 262;
  const photo = P(
    midBg,
    [
      lock(S({ x: -100, y: 200, width: 1200, height: 900, shape: "ellipse", fill: radial([0, "rgba(232,140,90,0.45)"], [1, "rgba(232,140,90,0)"]) })),
      lock(O(clayGrain({ w: 1000, h: 1400, color: "#3a1208", count: 800, seed: 21 }), { x: 0, y: 0, width: 1000, height: 1400, opacity: 0.2 })),
      ...frame(CREAM, "#a64a2a", GOLDT),
      lock(O(vineBand({ w: 600, h: 54, ink: SAND, accent: "#a64a2a" }), { cx: W / 2, y: 118, width: 600 })),
      lock(S({ x: px - 30, y: py - 30, width: 520, height: 600, shape: "rect", fill: "#7d3219", stroke: SAND, strokeWidth: 2.4 })),
      lock(S({ x: px - 20, y: py - 20, width: 500, height: 580, shape: "rect", fill: null, stroke: SAND, strokeWidth: 1.2 })),
      I({ x: px, y: py, width: 460, height: 540, mask: "rect", placeholderFill: "#c9673f", borderColor: CREAM, borderWidth: 4 }),
      lock(O(reliefRosette({ size: 84, ink: SAND, fill: "#7d3219", accent: GOLDT }), { cx: px - 30, y: py - 30 - 42, width: 84 })),
      lock(O(reliefRosette({ size: 84, ink: SAND, fill: "#7d3219", accent: GOLDT }), { cx: px + 490, y: py - 30 - 42, width: 84 })),
      lock(O(reliefRosette({ size: 84, ink: SAND, fill: "#7d3219", accent: GOLDT }), { cx: px - 30, y: py + 570 - 42, width: 84 })),
      lock(O(reliefRosette({ size: 84, ink: SAND, fill: "#7d3219", accent: GOLDT }), { cx: px + 490, y: py + 570 - 42, width: 84 })),
      lock(S({ x: 140, y: 910, width: 720, height: 310, shape: "rect", fill: CREAM, stroke: CLAY_DD, strokeWidth: 2.4, cornerRadius: 6 })),
      lock(S({ x: 152, y: 922, width: 696, height: 286, shape: "rect", fill: null, stroke: CLAY, strokeWidth: 1.4, cornerRadius: 3 })),
      T("শুভ হোক পথচলা", 940, { x: 180, width: 640, fontFamily: "Tiro Bangla", fontSize: 62, fill: CLAY_D, lineHeight: 1.3 }),
      T("দুই পরিবারের মিলনে, আশীর্বাদে ভরে উঠুক নতুন জীবন", 1036, { x: 190, width: 620, fontFamily: "Hind Siliguri", fontSize: 24, fill: CLAY_D, lineHeight: 1.5 }),
      lock(O(divider({ style: "floral", w: 260, color: CLAY }), { cx: W / 2, y: 1112, width: 260 })),
      T("Ishita & Debasish", 1150, { x: 180, width: 640, fontFamily: "Cinzel", fontWeight: 600, fontSize: 28, fill: CLAY_D, letterSpacing: 7 }),
    ],
    "Blessing",
  );

  return {
    slug: "terracotta-temple",
    name: "Terracotta Temple",
    tagline: "Bishnupur terracotta temple-panel inspired Bengali wedding invitation",
    description:
      "A Bengali wedding invitation inspired by Bishnupur terracotta temple panels: cusped-arch friezes, moulded rosettes, vine borders and a curved hut-roof gable in earthy clay red, in both dark and light page tones.",
    categories: ["bengali", "cultural", "vintage", "classic", "indian"],
    keywords: [
      "terracotta bengali wedding invitation",
      "bishnupur temple inspired wedding card",
      "west bengal shubho bibaho card clay red",
      "earthy bengali biyer card design",
      "bou bhaat gaye holud invitation bengali",
    ],
    palette: [CLAY, CLAY_D, CLAY_DD, CREAM, SAND],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
