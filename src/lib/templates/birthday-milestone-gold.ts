import { decoFrame, divider, sparkle } from "../design/ornaments";
import { GUEST_TOKEN } from "../design/types";
import type { Layer } from "../design/types";
import { GOLD, H, I, linear, lock, O, P, radial, S, T, W, type TemplateDef } from "./kit";
import { decoFan, flute, glitter } from "./birthday-milestone-gold.art";

const INK = "#0a0a0e";
const CHAMP = "#f3dfa2";
const GOLDC = "#d9b96a";
const SOFT = "#bdb4a0";

const BG = linear(90, [0, "#07070a"], [0.5, "#15130f"], [1, "#07070a"]);
const sp = (cx: number, cy: number, s: number, color = CHAMP, op = 1): Layer => lock(O(sparkle({ color, size: s }), { x: cx - s / 2, y: cy - s / 2, opacity: op }));

const frame = (): Layer[] => [
  lock(O(decoFrame({ w: 900, h: 1300, cut: 54, stroke: GOLDC, strokeWidth: 3, lines: 3, gap: 14 }), { x: 50, y: 50 })),
];

/** gold-foil headline with soft dark offset for depth */
const foil = (text: string, y: number, size: number, o: Record<string, unknown> = {}): Layer[] => [
  lock(T(text, y + 5, { x: 100, width: 800, fontFamily: "Bodoni Moda", fontWeight: 700, fontSize: size, lineHeight: 1.05, fill: "#000000", opacity: 0.55, ...o })),
  lock(T(text, y, { x: 100, width: 800, fontFamily: "Bodoni Moda", fontWeight: 700, fontSize: size, lineHeight: 1.05, fill: GOLD, ...o })),
];

const cap = (text: string, y: number, o: Record<string, unknown> = {}) =>
  T(text, y, { x: 150, width: 700, fontFamily: "Cinzel", fontWeight: 500, fontSize: 22, letterSpacing: 9, fill: GOLDC, uppercase: true, ...o });

const rule = (y: number, w = 300): Layer => lock(O(divider({ style: "diamond", w, color: GOLDC, strokeWidth: 2 }), { cx: W / 2, y }));

export default function build(): TemplateDef {
  const halo = lock(S({ shape: "ellipse", x: -100, y: 120, width: 1200, height: 800, fill: radial([0, "#3b2f17"], [1, "#0d0c0b"]), opacity: 1 }));

  /* --------------------------------- cover --------------------------------- */
  const cover = P(
    BG,
    [
      halo,
      glitter(5, 70, [90, 90, 910, 1310], [CHAMP, GOLDC, "#fff6d0"], (x, y) => (x > 130 && x < 870 && y > 150 && y < 1010) || (x > 250 && x < 750 && y > 1235)),
      ...frame(),
      lock(decoFan(W / 2, 215, 150, GOLDC, 15, 3)),
      cap("Please join us to celebrate", 245, { fontSize: 20, letterSpacing: 8 }),
      ...foil("40", 250, 430),
      sp(215, 430, 44),
      sp(790, 520, 56),
      sp(760, 340, 26, "#fff6d0"),
      sp(240, 600, 26, GOLDC),
      T("James Anderson", 700, { x: 120, width: 760, fontFamily: "Cinzel", fontWeight: 500, fontSize: 52, letterSpacing: 4, fill: "#f7f0dc" }),
      T("turns forty", 768, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 48, fill: CHAMP }),
      rule(842, 320),
      T("Saturday, 21 November", 875, { x: 150, width: 700, fontFamily: "Cinzel", fontWeight: 500, fontSize: 30, letterSpacing: 5, fill: "#f7f0dc" }),
      T("Eight o'clock in the evening", 922, { x: 150, width: 700, fontFamily: "Cormorant Garamond", fontWeight: 500, fontSize: 28, fill: SOFT }),
      T("The Grand Ballroom, Savoy Hotel", 965, { x: 120, width: 760, fontFamily: "Cormorant Garamond", fontWeight: 600, fontSize: 30, letterSpacing: 1, fill: CHAMP }),
      lock(flute(432, 1215, 205, 12, 3)),
      lock(flute(568, 1215, 205, -12, 9)),
      sp(500, 1050, 44, "#fff6d0"),
      sp(468, 1080, 20, CHAMP),
      sp(538, 1085, 18, GOLDC),
      T(GUEST_TOKEN, 1262, { x: 250, width: 500, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 36, fill: CHAMP }),
    ],
    "Invitation",
  );

  /* -------------------------------- details -------------------------------- */
  const slot = (time: string, title: string, note: string, y: number): Layer[] => [
    T(time, y, { x: 130, width: 250, align: "right", fontFamily: "Bodoni Moda", fontWeight: 600, fontSize: 40, fill: GOLD }),
    lock(S({ x: 410, y: y - 6, width: 2, height: 112, fill: GOLDC, opacity: 0.6 })),
    lock(S({ shape: "ellipse", x: 404, y: y + 12, width: 14, height: 14, fill: GOLDC })),
    T(title, y - 2, { x: 445, width: 450, align: "left", fontFamily: "Cinzel", fontWeight: 500, fontSize: 28, letterSpacing: 3, fill: "#f7f0dc", uppercase: true }),
    T(note, y + 44, { x: 445, width: 450, align: "left", fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 28, fill: SOFT }),
  ];

  const details = P(
    BG,
    [
      halo,
      glitter(8, 55, [90, 90, 910, 1310], [CHAMP, GOLDC, "#fff6d0"], (x, y) => x > 120 && x < 880 && y > 120 && y < 1280),
      ...frame(),
      lock(decoFan(W / 2, 215, 120, GOLDC, 11, 3)),
      cap("An evening of elegance", 240, { fontSize: 20 }),
      ...foil("The Evening", 285, 96, { fontWeight: 600 }),
      rule(420, 320),
      ...slot("8:00", "Champagne Reception", "bubbles, canapés & old friends", 490),
      ...slot("9:00", "Dinner & Toasts", "a four-course tasting menu", 650),
      ...slot("10:30", "Dancing", "live jazz band & late-night dessert", 810),
      lock(S({ x: 150, y: 985, width: 700, height: 2, fill: GOLDC, opacity: 0.5 })),
      cap("Dress code", 1020, { fontSize: 19 }),
      T("Black Tie", 1056, { x: 150, width: 700, fontFamily: "Bodoni Moda", fontWeight: 600, fontSize: 56, fill: "#f7f0dc" }),
      T("Add a touch of gold if you like", 1130, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 30, fill: CHAMP }),
      T("Savoy Hotel · 12 Park Lane", 1215, { x: 150, width: 700, fontFamily: "Cinzel", fontWeight: 500, fontSize: 20, letterSpacing: 6, uppercase: true, fill: GOLDC }),
      sp(150, 285, 30),
      sp(850, 330, 22, GOLDC),
    ],
    "Details",
  );

  /* ------------------------------ photo page ------------------------------ */
  const photo = P(
    BG,
    [
      halo,
      glitter(13, 60, [90, 90, 910, 1310], [CHAMP, GOLDC, "#fff6d0"], (x, y) => (x > 170 && x < 830 && y > 190 && y < 1090) || (y > 1060 && x > 130 && x < 870 && y < 1230) || (y < 230 && x > 150 && x < 850)),
      ...frame(),
      cap("Forty years in the making", 125, { fontSize: 21 }),
      ...foil("Cheers!", 160, 90, { fontWeight: 600 }),
      lock(O(decoFrame({ w: 600, h: 720, cut: 60, stroke: GOLDC, strokeWidth: 4, lines: 2, gap: 14 }), { x: 200, y: 340 })),
      I({ x: 248, y: 388, width: 504, height: 624, mask: "rect", placeholderFill: "#3a3123" }),
      sp(200, 340, 60, "#fff6d0"),
      sp(800, 1060, 46, CHAMP),
      lock(decoFan(W / 2, 1318, 80, GOLDC, 9, 2)),
      T("Four decades of laughter, love and good company", 1095, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 34, lineHeight: 1.25, fill: CHAMP }),
      T("Help us raise a glass", 1170, { x: 150, width: 700, fontFamily: "Cinzel", fontWeight: 500, fontSize: 22, letterSpacing: 7, uppercase: true, fill: GOLDC }),
    ],
    "Memories",
  );

  return {
    slug: "birthday-milestone-gold",
    name: "Milestone Gold",
    tagline: "Black and champagne-gold milestone birthday invitation with a foil number",
    description:
      "An elegant adult milestone birthday invitation in black and champagne gold, with a big gold-foil number, Art Deco frame and clinking champagne flutes. Ideal for a 30th, 40th, 50th or 60th celebration.",
    categories: ["birthday", "luxury", "dark", "party"],
    keywords: ["40th birthday invitation template", "black and gold birthday invitation", "milestone birthday party invite", "champagne birthday invitation", "art deco birthday invitation"],
    palette: ["#07070a", "#15130f", "#d9b96a", "#f3dfa2", "#f7f0dc"],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
