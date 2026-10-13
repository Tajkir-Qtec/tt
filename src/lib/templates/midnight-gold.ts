import { corner, decoFrame, divider, star, sunburst } from "../design/ornaments";
import { GOLD, H, I, linear, lock, O, P, radial, S, T, W, type TemplateDef } from "./kit";
import { sections } from "./premium-details";

const NAVY = "#0a1128";
const INK = "#050816";
const GOLDC = "#cfa95e";
const CREAM = "#efe3c8";
const MUTED = "#a9b0c4";

const shadow = { color: "#000000", blur: 12, offsetX: 0, offsetY: 4, opacity: 0.55 };

function backdrop(sunY = 130, sunOpacity = 0.09) {
  const layers = [
    lock(O(sunburst({ color: GOLDC, rays: 40, size: 1500, core: 0.2 }), { cx: 500, y: -880, width: 1500, opacity: sunOpacity })),
    lock(S({ x: -100, y: sunY - 330, width: 1200, height: 700, shape: "ellipse", fill: radial([0, "#1b2a5c"], [0.8, "rgba(10,17,40,0)"]), opacity: 0.65 })),
    lock(O(decoFrame({ w: 820, h: 1220, cut: 56, stroke: GOLDC, strokeWidth: 3, lines: 3, gap: 12 }), { x: 90, y: 90, width: 820 })),
  ];
  const c = corner({ style: "fan", size: 150, color: GOLDC, strokeWidth: 2.4 });
  const o = 120;
  layers.push(
    lock(O(c, { x: o, y: o, width: 150 })),
    lock(O(c, { x: W - o - 150, y: o, width: 150, flipX: true })),
    lock(O(c, { x: o, y: H - o - 150, width: 150, flipY: true })),
    lock(O(c, { x: W - o - 150, y: H - o - 150, width: 150, flipX: true, flipY: true })),
  );
  return layers;
}

export default function build(): TemplateDef {
  const bg = linear(90, [0, "#0d1736"], [0.5, NAVY], [1, INK]);
  const lbl = (text: string, y: number, o: object = {}) =>
    T(text, y, { x: 200, width: 600, fontFamily: "Jost", fontSize: 17, fill: MUTED, letterSpacing: 8, uppercase: true, fontWeight: 400, ...o });

  const cover = P(
    bg,
    [
      ...backdrop(),
      lock(O(star({ color: GOLDC, points: 4, size: 34, inner: 0.22 }), { cx: 500, y: 190, width: 34 })),
      T("Dear {to},", 258, { x: 200, width: 600, fontFamily: "Bodoni Moda", italic: true, fontSize: 30, fill: CREAM }),
      lbl("Together with their families", 322),
      T("request the pleasure of your company at the wedding of", 362, { x: 180, width: 640, fontFamily: "Bodoni Moda", italic: true, fontSize: 22, fill: MUTED }),
      T("Isabella", 440, { x: 120, width: 760, fontFamily: "Bodoni Moda", fontWeight: 500, fontSize: 118, fill: GOLD, shadow }),
      lock(S({ x: 250, y: 648, width: 150, height: 1.6, fill: GOLDC })),
      lock(S({ x: 600, y: 648, width: 150, height: 1.6, fill: GOLDC })),
      T("&", 612, { x: 400, width: 200, fontFamily: "Bodoni Moda", italic: true, fontSize: 64, fill: CREAM, lineHeight: 1 }),
      T("Alexander", 690, { x: 100, width: 800, fontFamily: "Bodoni Moda", fontWeight: 500, fontSize: 118, fill: GOLD, shadow }),
      O(divider({ style: "diamond", w: 440, color: GOLDC }), { cx: 500, y: 865, width: 440 }),
      lbl("Saturday", 940, { fill: GOLDC, fontSize: 18 }),
      T("21 · 05 · 2027", 974, { x: 200, width: 600, fontFamily: "Bodoni Moda", fontWeight: 500, fontSize: 66, fill: GOLD, shadow }),
      T("Half past six in the evening", 1058, { x: 200, width: 600, fontFamily: "Bodoni Moda", italic: true, fontSize: 25, fill: CREAM }),
      T("The Grand Aurelian", 1124, { x: 200, width: 600, fontFamily: "Cinzel", fontWeight: 500, fontSize: 30, fill: CREAM, letterSpacing: 7 }),
      lbl("One Park Avenue  ·  New York", 1172, { letterSpacing: 5, fontSize: 16 }),
    ],
    "Invitation",
  );

  const sec = sections(
    [
      { label: "Ceremony", strong: "6:30 PM", after: 52 },
      { label: "Cocktails & Canapés", strong: "7:30 PM", after: 52 },
      { label: "Dinner & Dancing", strong: "9:00 PM", after: 64 },
      { label: "Venue", strong: "The Grand Aurelian", body: ["One Park Avenue", "New York, NY 10016"], after: 54 },
      { label: "Celebration", body: ["Celebration to follow", "Valet parking at the entrance"], after: 54 },
      { label: "Dress Code", body: ["Black tie  ·  gold & midnight tones"] },
    ],
    {
      x: 180,
      width: 640,
      y0: 380,
      label: { font: "Jost", size: 16, fill: GOLDC, spacing: 9, weight: 400 },
      strong: { font: "Bodoni Moda", size: 40, fill: CREAM, weight: 400 },
      body: { font: "Jost", size: 20, fill: MUTED, weight: 300, lineHeight: 1.55 },
      sep: (y) => O(divider({ style: "stars", w: 220, color: GOLDC, strokeWidth: 1.6 }), { cx: W / 2, y, width: 220, opacity: 0.85 }),
    },
  );

  const details = P(
    bg,
    [
      ...backdrop(),
      lock(O(star({ color: GOLDC, points: 4, size: 34, inner: 0.22 }), { cx: 500, y: 200, width: 34 })),
      T("The Evening", 262, { x: 160, width: 680, fontFamily: "Bodoni Moda", fontWeight: 500, fontSize: 64, fill: GOLD, shadow }),
      ...sec.layers,
    ],
    "Details",
  );

  const photo = P(
    bg,
    [
      ...backdrop(560, 0.07),
      I({ x: 250, y: 200, width: 500, height: 680, mask: "arch", placeholderFill: "#16214a", borderColor: GOLDC, borderWidth: 3 }),
      lock(O(star({ color: GOLDC, points: 4, size: 34, inner: 0.22 }), { cx: 500, y: 915, width: 34 })),
      T("Two hearts,\none beautiful beginning.", 970, { x: 160, width: 680, fontFamily: "Bodoni Moda", italic: true, fontSize: 46, lineHeight: 1.2, fill: GOLD, shadow }),
      lbl("Isabella  &  Alexander  ·  21.05.2027", 1100, { fill: CREAM, fontSize: 16, letterSpacing: 7 }),
    ],
    "Memory",
  );

  return {
    slug: "midnight-gold",
    name: "Midnight Gold",
    tagline: "Art Deco wedding invitation in midnight navy and metallic gold",
    description:
      "A glamorous Art Deco wedding invitation with metallic gold lettering, chamfered borders, fan corners and a soft sunburst on deep midnight navy. Great for black-tie and Great Gatsby style celebrations.",
    categories: ["luxury", "modern", "geometric", "dark"],
    keywords: ["art deco wedding invitation", "navy and gold wedding invitation", "great gatsby wedding card", "black tie wedding invite online"],
    palette: [NAVY, INK, GOLDC, CREAM, MUTED],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
