import { divider } from "../design/ornaments";
import { GUEST_TOKEN } from "../design/types";
import type { Layer, Paint } from "../design/types";
import { type PartSpec } from "../design/path";
import { H, I, lock, O, P, radial, S, GOLD, T, W, type TemplateDef } from "./kit";
import { BAUBLES, berries, bauble, bow, fir, firWreath, glitter, holly, place, polar, sparkAt } from "./winter-party.art";

/** Classic Christmas party: deep green & burgundy, fir wreath, glossy baubles, gold foil linework. */

const GREEN: Paint = radial([0, "#18633f"], [0.55, "#0b3a27"], [1, "#04170f"]);
const RED: Paint = radial([0, "#a51a28"], [0.6, "#6e0f1b"], [1, "#3a060d"]);
const G = "#d9b660";
const IVORY = "#fbf1dc";
const FIR_D = "#14653d";
const FIR_L = "#46b06f";
const BOW = { light: "#ff6a5f", base: "#c8182b", dark: "#7a0b1a" };
const SH = { color: "#000000", blur: 14, offsetX: 0, offsetY: 3, opacity: 0.45 };

/** A fan of fir branches growing out of a corner. mx/my = ±1 mirror the corner. */
function cornerFir(x: number, y: number, mx: number, my: number, scale = 1, hollyAt = true): Layer {
  const ang = (a: number) => (mx < 0 ? 180 - a : a) * (my < 0 ? -1 : 1);
  const specs: PartSpec[] = [];
  for (const [len, a, c] of [
    [300, 14, 0.1],
    [330, 38, -0.08],
    [270, 62, 0.1],
    [200, 84, -0.06],
  ] as const) {
    specs.push(...fir(x, y, { len: len * scale, angle: ang(a), curve: c * (mx * my), needle: 30 * scale, dark: FIR_D, light: FIR_L }));
  }
  for (const [len, a] of [
    [230, 26],
    [210, 52],
  ] as const) specs.push(...fir(x, y, { len: len * scale, angle: ang(a), curve: 0.08 * mx * my, needle: 24 * scale, dark: "#1d7a49", light: "#5cc183" }));
  if (hollyAt) {
    const hx = x + mx * 120 * scale;
    const hy = y + my * 120 * scale;
    specs.push(...holly(hx, hy, 80 * scale, mx < 0 ? 40 : 140));
    specs.push(...berries(x + mx * 190 * scale, y + my * 60 * scale, 9 * scale, 4, 7 + Math.round(x)));
  }
  return place(specs, 2);
}

const frame = (stroke: string = G): Layer[] => [
  lock(S({ x: 34, y: 34, width: 932, height: 1332, fill: null, stroke, strokeWidth: 3 })),
  lock(S({ x: 50, y: 50, width: 900, height: 1300, fill: null, stroke, strokeWidth: 1.4, opacity: 0.8 })),
];

const wreathLayers = (cx: number, cy: number, R: number, withBow = true, bowAt: "top" | "bottom" = "top"): Layer[] => {
  const out: Layer[] = [lock(place(firWreath(cx, cy, R, { n: 20, dark: FIR_D, light: FIR_L, needle: 30 }), 2))];
  // berries and holly sprigs
  const sp: PartSpec[] = [];
  for (const a of [150, 28]) {
    const [hx, hy] = polar(cx, cy, R, a);
    sp.push(...holly(hx, hy, 74, a > 90 ? 120 : 60));
  }
  const [bx, by] = polar(cx, cy, R, 90);
  sp.push(...berries(bx, by + 4, 10, 6, 91));
  const [b2x, b2y] = polar(cx, cy, R, 210);
  sp.push(...berries(b2x, b2y, 9, 4, 21));
  const [b3x, b3y] = polar(cx, cy, R, -35);
  sp.push(...berries(b3x, b3y, 9, 5, 33));
  out.push(lock(place(sp, 2)));
  // baubles
  const [p1x, p1y] = polar(cx, cy, R, 52);
  out.push(bauble(p1x, p1y, R * 0.17, BAUBLES.red, { band: "#e6c26a", dots: "#ffffff" }));
  out.push(bauble(p1x + R * 0.2, p1y - R * 0.12, R * 0.12, BAUBLES.gold));
  out.push(bauble(p1x - R * 0.17, p1y + R * 0.21, R * 0.1, BAUBLES.cream));
  const [p2x, p2y] = polar(cx, cy, R, 218);
  out.push(bauble(p2x, p2y, R * 0.13, BAUBLES.gold, { band: "#c8182b" }));
  out.push(bauble(p2x - R * 0.12, p2y - R * 0.18, R * 0.09, BAUBLES.red));
  const [p3x, p3y] = polar(cx, cy, R, 322);
  out.push(bauble(p3x, p3y, R * 0.11, BAUBLES.cream, { dots: "#c8182b" }));
  if (withBow) {
    const [wx, wy] = polar(cx, cy, R, bowAt === "top" ? -90 : 90);
    out.push(lock(place(bow(wx, wy - 4, R * 0.3, BOW), 2)));
  }
  return out;
};

const rule = (y: number, w = 220): Layer => lock(O(divider({ style: "diamond", w, color: G, strokeWidth: 2 }), { cx: W / 2, y }));

export default function build(): TemplateDef {
  /* --------------------------------- cover --------------------------------- */
  const cover = P(
    GREEN,
    [
      glitter({ seed: 5, count: 60, area: [60, 60, 940, 1340], colors: ["#f3dfa2", "#e9cf8a", "#ffffff"], minS: 5, maxS: 15, skip: (x, y) => (x > 150 && x < 850 && y > 850 && y < 1320) || (x < 330 && y < 330) || (x > 670 && y < 330) || (x > 250 && x < 750 && y > 270 && y < 830) || (y > 1230 && (x < 330 || x > 670)) }),
      ...frame(),
      cornerFir(46, 46, 1, 1),
      cornerFir(954, 46, -1, 1),
      cornerFir(46, 1354, 1, -1, 0.8, false),
      cornerFir(954, 1354, -1, -1, 0.8, false),
      bauble(128, 258, 36, BAUBLES.red, { hang: 46, band: "#e6c26a" }),
      bauble(224, 182, 27, BAUBLES.gold, { hang: 46 }),
      bauble(874, 262, 36, BAUBLES.gold, { hang: 46, dots: "#8a6422" }),
      bauble(780, 186, 27, BAUBLES.red, { hang: 46 }),
      T("You are invited to a", 92, { x: 280, width: 440, fontFamily: "Cinzel", fontSize: 20, letterSpacing: 7, uppercase: true, fill: GOLD }),
      ...wreathLayers(500, 568, 212),
      T("Merry", 452, { x: 330, width: 340, fontFamily: "Pinyon Script", fontSize: 56, lineHeight: 1, fill: IVORY }),
      T("Christmas", 496, { x: 280, width: 440, fontFamily: "Pinyon Script", fontSize: 96, lineHeight: 1, fill: GOLD, shadow: SH }),
      T("Party", 604, { x: 330, width: 340, fontFamily: "Cinzel", fontWeight: 600, fontSize: 34, letterSpacing: 18, uppercase: true, fill: IVORY }),
      lock(O(divider({ style: "stars", w: 190, color: G, strokeWidth: 2 }), { cx: W / 2, y: 662 })),
      T("Saturday, 18 December 2027", 884, { x: 120, width: 760, fontFamily: "Cormorant Garamond", fontWeight: 600, fontSize: 46, fill: IVORY }),
      T("Seven o'clock in the evening", 944, { x: 120, width: 760, fontFamily: "Cormorant Garamond", italic: true, fontSize: 32, fill: G }),
      rule(1000, 260),
      T("The Holloway Manor", 1034, { x: 120, width: 760, fontFamily: "Cinzel", fontWeight: 600, fontSize: 36, letterSpacing: 4, fill: IVORY }),
      T("Hawthorn Lane, Kingsbridge", 1086, { x: 120, width: 760, fontFamily: "Cormorant Garamond", fontSize: 30, fill: IVORY, opacity: 0.85 }),
      T("Festive black tie  ·  Red, green & gold", 1140, { x: 160, width: 680, fontFamily: "Cinzel", fontSize: 17, letterSpacing: 5, uppercase: true, fill: G }),
      T(GUEST_TOKEN, 1186, { x: 250, width: 500, fontFamily: "Pinyon Script", fontSize: 62, lineHeight: 1.1, fill: IVORY, shadow: SH }),
      T("Carols  ·  Mulled wine  ·  Gingerbread", 1296, { x: 220, width: 560, fontFamily: "Cinzel", fontSize: 16, letterSpacing: 5, uppercase: true, fill: G }),
    ],
    "Invitation",
  );

  /* -------------------------------- schedule -------------------------------- */
  const items: [string, string, string][] = [
    ["7:00 PM", "Mulled Wine & Welcome", "Warm spiced cider, mince pies and a crackling fire"],
    ["8:00 PM", "The Christmas Dinner", "A traditional three-course feast with all the trimmings"],
    ["9:30 PM", "Carols by Candlelight", "Join the village choir for your favourite carols"],
    ["10:30 PM", "Secret Santa & Dancing", "Bring a wrapped gift to swap, then dance the night away"],
  ];
  const rows: Layer[] = [];
  items.forEach(([time, title, desc], i) => {
    const y = 452 + i * 176;
    rows.push(
      T(time, y, { x: 200, width: 600, fontFamily: "Cinzel", fontWeight: 600, fontSize: 24, letterSpacing: 9, fill: GOLD }),
      T(title, y + 40, { x: 100, width: 800, fontFamily: "Cormorant Garamond", fontWeight: 600, fontSize: 50, fill: IVORY }),
      T(desc, y + 100, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontSize: 28, fill: "#f6d9c6" }),
    );
    if (i < items.length - 1) rows.push(lock(O(divider({ style: "diamond", w: 120, color: G, strokeWidth: 1.8 }), { cx: W / 2, y: y + 134 })));
  });
  const details = P(
    RED,
    [
      glitter({ seed: 9, count: 50, area: [60, 60, 940, 1340], colors: ["#f3dfa2", "#e9cf8a", "#ffffff"], minS: 5, maxS: 14, skip: (x, y) => x > 100 && x < 900 && y > 130 && y < 1300 }),
      ...frame(),
      bauble(112, 150, 30, BAUBLES.gold, { hang: 46, band: "#c8182b" }),
      bauble(196, 100, 22, BAUBLES.cream, { hang: 46 }),
      bauble(888, 150, 30, BAUBLES.green, { hang: 46, band: "#e6c26a" }),
      bauble(804, 100, 22, BAUBLES.gold, { hang: 46 }),
      lock(place([...fir(500, 112, { len: 180, angle: 180, curve: -0.05, needle: 26, dark: FIR_D, light: FIR_L }), ...fir(500, 112, { len: 180, angle: 0, curve: 0.05, needle: 26, dark: FIR_D, light: FIR_L }), ...holly(500, 112, 78, 0), ...berries(500, 118, 10, 5, 3)], 2)),
      T("Order of the Evening", 196, { x: 80, width: 840, fontFamily: "Pinyon Script", fontSize: 96, lineHeight: 1, fill: GOLD, shadow: SH }),
      T("Christmas Party 2027", 316, { x: 200, width: 600, fontFamily: "Cinzel", fontSize: 21, letterSpacing: 10, uppercase: true, fill: IVORY }),
      lock(O(divider({ style: "stars", w: 280, color: G, strokeWidth: 2 }), { cx: W / 2, y: 366 })),
      ...rows,
      lock(S({ x: 150, y: 1136, width: 700, height: 150, cornerRadius: 24, fill: "#000000", opacity: 0.18 })),
      lock(S({ x: 150, y: 1136, width: 700, height: 150, cornerRadius: 24, fill: null, stroke: G, strokeWidth: 2 })),
      T("Dress code", 1160, { x: 200, width: 600, fontFamily: "Cinzel", fontSize: 17, letterSpacing: 10, uppercase: true, fill: G }),
      T("Festive black tie, in reds, greens & a touch of gold", 1198, { x: 170, width: 660, fontFamily: "Cormorant Garamond", italic: true, fontSize: 32, lineHeight: 1.2, fill: IVORY }),
      cornerFir(46, 1354, 1, -1, 0.55, false),
      cornerFir(954, 1354, -1, -1, 0.55, false),
    ],
    "Schedule",
  );

  /* --------------------------------- photo --------------------------------- */
  const photo = P(
    GREEN,
    [
      glitter({ seed: 17, count: 60, area: [60, 60, 940, 1340], colors: ["#f3dfa2", "#e9cf8a", "#ffffff"], minS: 5, maxS: 15, skip: (x, y) => (x > 220 && x < 780 && y > 300 && y < 880) || (x > 100 && x < 900 && y > 90 && y < 260) || (x > 100 && x < 900 && y > 880 && y < 1260) }),
      ...frame(),
      cornerFir(46, 46, 1, 1, 0.62),
      cornerFir(954, 46, -1, 1, 0.62),
      cornerFir(46, 1354, 1, -1, 0.8, false),
      cornerFir(954, 1354, -1, -1, 0.8, false),
      T("Merry & Bright", 112, { x: 100, width: 800, fontFamily: "Pinyon Script", fontSize: 92, lineHeight: 1, fill: GOLD, shadow: SH }),
      ...wreathLayers(500, 590, 232, true, "bottom"),
      lock(S({ shape: "ellipse", x: 500 - 154, y: 590 - 154, width: 308, height: 308, fill: GOLD })),
      I({ x: 500 - 146, y: 590 - 146, width: 292, height: 292, mask: "ellipse", placeholderFill: "#e9d9b8" }),
      T("May your evening be filled with warmth,", 944, { x: 100, width: 800, fontFamily: "Cormorant Garamond", italic: true, fontSize: 42, fill: IVORY }),
      T("laughter and wonderful company.", 998, { x: 100, width: 800, fontFamily: "Cormorant Garamond", italic: true, fontSize: 42, fill: IVORY }),
      lock(O(divider({ style: "stars", w: 280, color: G, strokeWidth: 2 }), { cx: W / 2, y: 1072 })),
      T("With love,", 1108, { x: 200, width: 600, fontFamily: "Cinzel", fontSize: 18, letterSpacing: 10, uppercase: true, fill: G }),
      T("The Whitmore Family", 1146, { x: 100, width: 800, fontFamily: "Pinyon Script", fontSize: 76, lineHeight: 1.1, fill: GOLD, shadow: SH }),
      sparkAt(150, 1010, 30, "#f3dfa2"),
      sparkAt(850, 1060, 26, "#f3dfa2"),
    ],
    "Message",
  );

  return {
    slug: "christmas-party-classic",
    name: "Christmas Party Classic",
    tagline: "Elegant red, green and gold Christmas party invitation with a fir wreath",
    description:
      "A classic Christmas party invitation with a hand-built fir wreath, glossy baubles, holly and berries on deep green with gold foil linework. Ideal for Christmas dinners, office holiday parties and festive family gatherings.",
    categories: ["party", "holiday", "winter", "festive", "classic", "luxury"],
    keywords: ["christmas party invitation template", "elegant christmas dinner invitation", "red green gold holiday party invite", "christmas wreath invitation card", "office christmas party invitation", "festive christmas open house invite"],
    palette: ["#0b3a27", "#a51a28", "#d9b660", "#fbf1dc", "#14653d"],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
