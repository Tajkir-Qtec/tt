import { archFrame, corner, divider } from "../design/ornaments";
import { GUEST_TOKEN } from "../design/types";
import type { Layer } from "../design/types";
import { FOIL, glint, laurel, put, rays, ribbon } from "./anniversary-golden-years.art";
import { H, I, linear, lock, O, P, radial, S, T, W, type TemplateDef } from "./kit";

const NAVY = "#0c1527";
const NAVY2 = "#16233d";
const GOLD = "#cfa94f";
const GOLD_L = "#f1dca0";
const IVORY = "#f4ecd9";
const MUTED = "#b4b9c6";

export default function build(): TemplateDef {
  const bg = linear(90, [0, NAVY], [0.45, NAVY2], [1, NAVY]);

  const label = (text: string, y: number, o: Partial<Parameters<typeof T>[2]> = {}) =>
    T(text, y, { x: 150, width: 700, fontFamily: "Jost", fontWeight: 400, fontSize: 20, letterSpacing: 12, uppercase: true, fill: GOLD_L, ...o });
  const div = (y: number, w = 340) => lock(O(divider({ style: "diamond", w, color: GOLD, strokeWidth: 1.8 }), { cx: W / 2, y, width: w }));
  const glow = (cx: number, cy: number, d: number, a: number): Layer =>
    lock(S({ shape: "ellipse", x: cx - d / 2, y: cy - d / 2, width: d, height: d, fill: radial([0, `rgba(80,110,170,${a})`], [1, "rgba(80,110,170,0)"]) }));
  const border = (): Layer[] => [
    lock(S({ x: 36, y: 36, width: 928, height: 1328, fill: null, stroke: GOLD, strokeWidth: 2 })),
    lock(S({ x: 52, y: 52, width: 896, height: 1296, fill: null, stroke: GOLD, strokeWidth: 1, opacity: 0.6 })),
    lock(O(corner({ style: "ornate", size: 130, color: GOLD, strokeWidth: 2 }), { x: 40, y: 40 })),
    lock({ ...O(corner({ style: "ornate", size: 130, color: GOLD, strokeWidth: 2 }), { x: 830, y: 40 }), flipX: true }),
    lock({ ...O(corner({ style: "ornate", size: 130, color: GOLD, strokeWidth: 2 }), { x: 40, y: 1230 }), flipY: true }),
    lock({ ...O(corner({ style: "ornate", size: 130, color: GOLD, strokeWidth: 2 }), { x: 830, y: 1230 }), flipX: true, flipY: true }),
  ];
  const glints = (pts: [number, number, number][]): Layer[] => pts.map(([x, y, s]) => put(glint(FOIL, 60), x, y, s, 0, 0.95));

  /* --------------------------------- cover --------------------------------- */
  const cover = P(
    bg,
    [
      glow(500, 540, 1000, 0.45),
      lock(O(rays(500, 540, 340, 900, 90, GOLD), { x: 0, y: 0, width: 1000, height: 1400, opacity: 0.16 })),
      ...border(),
      T("Celebrating", 112, { x: 100, width: 800, fontFamily: "Great Vibes", fontSize: 92, lineHeight: 1.2, fill: GOLD_L }),
      put(laurel(250, 92, 13), 500, 545, 760),
      T("25", 380, { x: 250, width: 500, fontFamily: "Cinzel", fontWeight: 600, fontSize: 290, lineHeight: 1, letterSpacing: 4, fill: FOIL }),
      put(ribbon(540, 78), 500, 716, 540),
      T("Years Together", 691, { x: 200, width: 600, fontFamily: "Cinzel", fontWeight: 700, fontSize: 31, letterSpacing: 8, uppercase: true, fill: "#2a1f0b" }),
      ...glints([
        [170, 330, 34],
        [840, 400, 44],
        [150, 760, 22],
        [865, 790, 30],
      ]),
      T(GUEST_TOKEN, 868, { x: 250, width: 500, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 34, fill: MUTED }),
      label("A celebration of love for", 920, { fontSize: 16, letterSpacing: 8, fill: MUTED }),
      T("Margaret & Robert", 960, { x: 80, width: 840, fontFamily: "Cormorant Garamond", fontWeight: 500, italic: true, fontSize: 88, fill: IVORY }),
      div(1088),
      T("Saturday, 20 November 2027", 1128, { x: 100, width: 800, fontFamily: "Cormorant Garamond", fontWeight: 600, fontSize: 44, letterSpacing: 3, fill: GOLD_L }),
      label("Seven o'clock in the evening", 1200, { fontSize: 17, letterSpacing: 8 }),
      T("The Grand Pavilion, Westbrook", 1252, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 34, fill: MUTED }),
    ],
    "Invitation",
  );

  /* -------------------------------- details -------------------------------- */
  const row = (head: string, big: string, small: string, y: number): Layer[] => [
    label(head, y, { fontSize: 16, letterSpacing: 10, fill: GOLD }),
    T(big, y + 36, { x: 100, width: 800, fontFamily: "Cormorant Garamond", fontWeight: 500, fontSize: 56, fill: IVORY }),
    T(small, y + 108, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 32, fill: MUTED }),
  ];
  const details = P(
    bg,
    [
      glow(500, 360, 1000, 0.4),
      lock(O(rays(500, 340, 260, 900, 90, GOLD), { x: 0, y: 0, width: 1000, height: 1400, opacity: 0.12 })),
      ...border(),
      put(laurel(120, 44, 11, 26, false), 500, 270, 360),
      T("25", 214, { x: 350, width: 300, fontFamily: "Cinzel", fontWeight: 600, fontSize: 112, lineHeight: 1, fill: FOIL }),
      T("Join the Celebration", 428, { x: 80, width: 840, fontFamily: "Great Vibes", fontSize: 100, lineHeight: 1.2, fill: GOLD_L }),
      div(560),
      ...row("When", "Saturday, 20 November 2027", "Seven o'clock in the evening", 636),
      div(836),
      ...row("Where", "The Grand Pavilion", "12 Harbour Road, Westbrook", 890),
      div(1106),
      label("Dress code", 1160, { fontSize: 16, letterSpacing: 10, fill: GOLD }),
      T("Black tie, with a touch of gold", 1196, { x: 120, width: 760, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 38, fill: IVORY }),
      ...glints([
        [160, 560, 26],
        [840, 600, 30],
        [150, 1000, 20],
      ]),
    ],
    "Details",
  );

  /* ---------------------------- through the years ---------------------------- */
  const portrait = (x: number, y: number, w: number, h: number, year: string, tint: string): Layer[] => [
    lock(O(archFrame({ w: w + 24, h: h + 24, stroke: GOLD, strokeWidth: 2.4, lines: 2, gap: 9 }), { x: x - 12, y: y - 12 })),
    I({ x, y, width: w, height: h, mask: "arch", placeholderFill: tint }),
    T(year, y + h + 38, { x: x - 20, width: w + 40, fontFamily: "Cinzel", fontWeight: 500, fontSize: 30, letterSpacing: 6, fill: GOLD_L }),
  ];
  const years = P(
    bg,
    [
      glow(500, 500, 1000, 0.4),
      ...border(),
      label("Our journey", 130, { fontSize: 18 }),
      T("Through the Years", 170, { x: 60, width: 880, fontFamily: "Great Vibes", fontSize: 108, lineHeight: 1.2, fill: GOLD_L }),
      ...portrait(110, 400, 230, 380, "1997", "#3c4a66"),
      ...portrait(385, 340, 230, 380, "2012", "#4a5676"),
      ...portrait(660, 400, 230, 380, "2027", "#3c4a66"),
      div(930, 340),
      T("Twenty-five years of laughter, love and everything in between", 980, { x: 160, width: 680, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 40, lineHeight: 1.3, fill: IVORY }),
      put(laurel(70, 28, 9, 30, false), 500, 1215, 210),
      T("25", 1180, { x: 400, width: 200, fontFamily: "Cinzel", fontWeight: 600, fontSize: 68, lineHeight: 1, fill: FOIL }),
      ...glints([
        [160, 300, 30],
        [850, 290, 38],
        [120, 1000, 18],
        [880, 1020, 22],
      ]),
    ],
    "Years",
  );

  void H;
  return {
    slug: "anniversary-golden-years",
    name: "Golden Years",
    tagline: "Elegant 25th and 50th anniversary invitation in gold foil and navy",
    description:
      "A classic silver or golden anniversary invitation with a foil-gold laurel wreath, oversized numeral and elegant serif lettering on deep navy. Perfect for 25th, 40th and 50th anniversary parties, with details and photo timeline pages.",
    categories: ["anniversary", "luxury", "classic", "dark"],
    keywords: ["25th anniversary party invitation", "golden anniversary invitation online", "50th wedding anniversary invite template", "gold foil laurel anniversary card", "silver jubilee anniversary invitation"],
    palette: [NAVY, NAVY2, GOLD, GOLD_L, IVORY],
    width: W,
    height: H,
    pages: [cover, details, years],
  };
}
