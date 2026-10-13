import { decoFrame, divider } from "../design/ornaments";
import { crestAura, crestLayers, type CrestColors } from "./monogram-crest.art";
import { GOLD, H, I, linear, lock, O, P, T, W, type TemplateDef } from "./kit";
import { sections } from "./premium-details";

const NAVY = "#0b1a33";
const NAVY_L = "#14294f";
const GOLDC = "#d2ac5a";
const GOLD_D = "#9a7430";
const IVORY = "#f6efdf";
const MUTED = "#b9c0d2";
const INK = "#2b3652";

const shadow = { color: "#000000", blur: 10, offsetX: 0, offsetY: 3, opacity: 0.5 };
const FOIL_D = linear(100, [0, "#8a6224"], [0.3, "#c79a42"], [0.55, "#94682a"], [0.8, "#c99d45"], [1, "#9c7230"]);

const onNavy: CrestColors = { gold: GOLDC, goldDark: GOLD_D, field: NAVY_L, foil: GOLD, ivory: IVORY };
const onCream: CrestColors = { gold: "#b58b3c", goldDark: "#7a5a20", field: NAVY, foil: GOLD, ivory: IVORY };

export default function build(): TemplateDef {
  const navyBg = linear(90, [0, "#08142b"], [0.5, "#0e2145"], [1, "#07112a"]);
  const creamBg = linear(90, [0, "#f5eedd"], [0.5, "#faf5e8"], [1, "#efe6d0"]);
  const x = 180;
  const w = 640;

  const frame = (stroke: string, lines = 2) =>
    lock(O(decoFrame({ w: 880, h: 1280, cut: 52, stroke, strokeWidth: 3, lines, gap: 12 }), { x: 60, y: 60, width: 880 }));
  const sm = (text: string, y: number, o = {}) =>
    T(text, y, { x, width: w, fontFamily: "Jost", fontSize: 17, fill: GOLDC, letterSpacing: 9, uppercase: true, fontWeight: 500, ...o });

  const cover = P(
    navyBg,
    [
      ...crestAura(500, 340, GOLDC),
      frame(GOLDC),
      ...crestLayers({ cx: 500, cy: 340, s: 1, colors: onNavy, initials: ["A", "V"], ribbonText: "Est. MMXXVII" }),
      T("Dear {to},", 592, { x, width: w, fontFamily: "Cormorant Garamond", italic: true, fontSize: 31, fill: IVORY }),
      T("request the honour of your presence at the marriage of", 640, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontSize: 27, fill: MUTED }),
      T("Alexander", 690, { x: 100, width: 800, fontFamily: "Cinzel", fontWeight: 500, fontSize: 80, fill: GOLD, letterSpacing: 6, shadow }),
      T("&", 790, { x: 100, width: 800, fontFamily: "Bodoni Moda", italic: true, fontSize: 52, fill: IVORY }),
      T("Victoria", 840, { x: 100, width: 800, fontFamily: "Cinzel", fontWeight: 500, fontSize: 80, fill: GOLD, letterSpacing: 6, shadow }),
      O(divider({ style: "double", w: 420, color: GOLDC }), { cx: W / 2, y: 972, width: 420 }),
      sm("Saturday", 1030, { letterSpacing: 11 }),
      T("12 · 06 · 2027", 1064, { x, width: w, fontFamily: "Bodoni Moda", fontWeight: 400, fontSize: 62, fill: IVORY }),
      T("Black tie  ·  seven o'clock in the evening", 1148, { x, width: w, fontFamily: "Cormorant Garamond", italic: true, fontSize: 26, fill: MUTED }),
      T("The Grand Meridian", 1196, { x, width: w, fontFamily: "Cinzel", fontWeight: 500, fontSize: 28, fill: GOLD, letterSpacing: 6, shadow }),
      T("One Regent Terrace, Edinburgh", 1242, { x, width: w, fontFamily: "Jost", fontSize: 18, fill: MUTED, letterSpacing: 2 }),
    ],
    "Invitation",
  );

  const sec = sections(
    [
      { label: "Ceremony", strong: "5:00 PM", after: 52 },
      { label: "Champagne Reception", strong: "6:00 PM", after: 52 },
      { label: "Dinner & Dancing", strong: "7:30 PM", after: 56 },
      { label: "Venue", strong: "The Grand Meridian", body: ["One Regent Terrace", "Edinburgh EH7 5BT, Scotland"], after: 48 },
      { label: "Dress Code", body: ["Black tie  ·  evening gowns and tuxedos"] },
    ],
    {
      x,
      width: w,
      y0: 640,
      label: { font: "Jost", size: 16, fill: "#a07b32", spacing: 9, weight: 500 },
      strong: { font: "Bodoni Moda", size: 38, fill: NAVY, weight: 500 },
      body: { font: "Jost", size: 20, fill: INK, weight: 400, lineHeight: 1.55 },
      sep: (y) => O(divider({ style: "diamond", w: 220, color: "#b58b3c", strokeWidth: 1.6 }), { cx: W / 2, y, width: 220, opacity: 0.9 }),
    },
  );

  const details = P(
    creamBg,
    [
      frame("#b58b3c"),
      ...crestLayers({ cx: 500, cy: 300, s: 0.78, colors: onCream, initials: ["A", "V"] }),
      T("Order of the Day", 466, { x: 100, width: 800, fontFamily: "Cinzel", fontWeight: 500, fontSize: 44, fill: NAVY, letterSpacing: 5 }),
      O(divider({ style: "stars", w: 320, color: "#b58b3c" }), { cx: W / 2, y: 540, width: 320 }),
      ...sec.layers.map((l) => ({ ...l, y: l.y - 36 })),
    ],
    "Details",
  );

  const photo = P(
    navyBg,
    [
      ...crestAura(500, 640, GOLDC, 1100, 0.06),
      frame(GOLDC),
      lock(O(decoFrame({ w: 500, h: 650, cut: 34, stroke: GOLDC, strokeWidth: 2.4, lines: 2, gap: 10 }), { x: 250, y: 215, width: 500 })),
      I({ x: 282, y: 247, width: 436, height: 586, mask: "rect", cornerRadius: 0, placeholderFill: "#1b3563", borderColor: null, borderWidth: 0 }),
      O(divider({ style: "stars", w: 320, color: GOLDC }), { cx: W / 2, y: 905, width: 320 }),
      T("Two lives, one story,", 965, { x, width: w, fontFamily: "Bodoni Moda", italic: true, fontSize: 40, fill: GOLD, shadow }),
      T("begun with a single yes.", 1021, { x, width: w, fontFamily: "Bodoni Moda", italic: true, fontSize: 40, fill: GOLD, shadow }),
      T("Alexander & Victoria", 1125, { x, width: w, fontFamily: "Cinzel", fontWeight: 500, fontSize: 30, fill: IVORY, letterSpacing: 8 }),
      sm("12 · 06 · 2027", 1185, { fontSize: 16 }),
    ],
    "Blessing",
  );

  return {
    slug: "monogram-crest",
    name: "Monogram Crest",
    tagline: "Navy and gold black-tie wedding invitation with a heraldic crest",
    description:
      "A regal, formal wedding invitation in navy, gold foil and ivory: a laurel-wreathed shield with interlaced initials, a crown and ribbon, framed by a classic art-deco border.",
    categories: ["luxury", "classic", "dark", "vintage"],
    keywords: ["black tie wedding invitation", "navy and gold crest wedding card", "monogram wedding invitation online", "royal wedding invitation template"],
    palette: [NAVY, NAVY_L, GOLDC, IVORY, "#faf5e8"],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
void FOIL_D;
