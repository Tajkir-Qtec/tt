import { decoFrame, diamondLattice, sparkle } from "../design/ornaments";
import { detailsLayers } from "./details";
import { diamondRule, geoBackdrop, hexFrame } from "./rose-gold-geometric.art";
import { H, I, linear, lock, O, P, ROSE_GOLD, S, T, W, type TemplateDef } from "./kit";

const RG = "#d9a595";
const RG_D = "#b57d70";
const INK = "#cfc4c1";
const BG1 = "#1d1c20";
const WIN = "#151417";

const bg = BG1;

function fade(y: number, h: number, dir: "down" | "up") {
  return lock(
    S({
      x: 0,
      y,
      width: W,
      height: h,
      fill: linear(90, dir === "down" ? [0, "rgba(29,28,32,0)"] : [0, "rgba(29,28,32,1)"], dir === "down" ? [1, "rgba(29,28,32,1)"] : [1, "rgba(29,28,32,0)"]),
    }),
  );
}

function sparkles(items: [number, number, number, number][]) {
  return items.map(([x, y, s, o]) => lock(O(sparkle({ color: RG, size: s }), { cx: x, y: y - s / 2, width: s, opacity: o })));
}

function frame() {
  return [
    lock(O(decoFrame({ w: 900, h: 1300, stroke: RG, strokeWidth: 2.4, lines: 2, gap: 14, cut: 50 }), { x: 50, y: 50, width: 900, opacity: 0.9 })),
  ];
}

export default function build(): TemplateDef {
  // ---------------- cover ----------------
  const wx = 170;
  const wy = 205;
  const ww = 660;
  const wh = 740;
  const cover = P(
    bg,
    [
      lock(O(diamondLattice({ color: RG, w: 900, h: 260, cell: 60, strokeWidth: 1 }), { x: 50, y: 52, width: 900, opacity: 0.16 })),
      lock(O(diamondLattice({ color: RG, w: 900, h: 300, cell: 60, strokeWidth: 1 }), { x: 50, y: 1048, width: 900, opacity: 0.16 })),
      fade(52, 260, "down"),
      fade(1048, 300, "up"),
      lock(O(geoBackdrop({ w: 900, h: 1300, cx: 450, cy: 575, color: RG, strokeWidth: 1.2 }), { x: 50, y: 50, width: 900, opacity: 0.4 })),
      ...frame(),
      // window glow + hexagon
      lock(S({ shape: "ellipse", x: wx - 80, y: wy - 20, width: ww + 160, height: wh + 40, fill: { kind: "radial", stops: [[0, "rgba(217,165,149,0.20)"], [1, "rgba(217,165,149,0)"]] } })),
      lock(O(hexFrame({ w: ww, h: wh, color: RG, fill: WIN, lines: 3, gap: 15, strokeWidth: 2.6 }), { x: wx, y: wy, width: ww })),
      ...sparkles([
        [118, 330, 26, 0.9],
        [884, 330, 18, 0.7],
        [150, 1000, 16, 0.6],
        [860, 1030, 28, 0.9],
        [500, 112, 20, 0.0],
      ]),
      T("Dear {to},", 92, { x: 200, width: 600, fontFamily: "Playfair Display", italic: true, fontSize: 28, fill: RG }),
      T("Together with their families", 142, { x: 200, width: 600, fontFamily: "Montserrat", fontWeight: 400, fontSize: 15, fill: INK, letterSpacing: 8, uppercase: true }),
      T("invite you to the wedding of", 410, { x: 260, width: 480, fontFamily: "Playfair Display", italic: true, fontSize: 24, fill: INK }),
      T("Sophia", 466, { x: 220, width: 560, fontFamily: "Bodoni Moda", italic: true, fontWeight: 500, fontSize: 124, fill: ROSE_GOLD, shadow: { color: "#000000", blur: 12, offsetX: 0, offsetY: 5, opacity: 0.5 } }),
      O(diamondRule({ w: 300, color: RG }), { cx: W / 2, y: 625, width: 300 }),
      T("Alexander", 668, { x: 200, width: 600, fontFamily: "Bodoni Moda", italic: true, fontWeight: 500, fontSize: 102, fill: ROSE_GOLD, shadow: { color: "#000000", blur: 12, offsetX: 0, offsetY: 5, opacity: 0.5 } }),
      T("Saturday", 1000, { x: 260, width: 480, fontFamily: "Montserrat", fontWeight: 500, fontSize: 17, fill: RG, letterSpacing: 10, uppercase: true }),
      T("14 · 09 · 2027", 1030, { x: 150, width: 700, fontFamily: "Montserrat", fontWeight: 300, fontSize: 58, fill: ROSE_GOLD, letterSpacing: 8 }),
      T("at half past five in the evening", 1114, { x: 200, width: 600, fontFamily: "Playfair Display", italic: true, fontSize: 27, fill: INK }),
      T("The Glasshouse", 1182, { x: 200, width: 600, fontFamily: "Montserrat", fontWeight: 500, fontSize: 24, fill: ROSE_GOLD, letterSpacing: 10, uppercase: true }),
      T("Kensington Gardens · London", 1230, { x: 200, width: 600, fontFamily: "Jost", fontWeight: 300, fontSize: 20, fill: INK, letterSpacing: 3 }),
    ],
    "Invitation",
  );

  // ---------------- details ----------------
  const details = P(
    bg,
    [
      lock(O(diamondLattice({ color: RG, w: 900, h: 220, cell: 60, strokeWidth: 1 }), { x: 50, y: 52, width: 900, opacity: 0.14 })),
      fade(52, 220, "down"),
      lock(O(diamondLattice({ color: RG, w: 900, h: 220, cell: 60, strokeWidth: 1 }), { x: 50, y: 1128, width: 900, opacity: 0.14 })),
      fade(1128, 220, "up"),
      ...frame(),
      lock(O(hexFrame({ w: 120, h: 140, color: RG, lines: 2, gap: 10, strokeWidth: 2 }), { cx: W / 2, y: 120, width: 120 })),
      ...detailsLayers({
        heading: "The Details",
        headFont: "Bodoni Moda",
        headItalic: true,
        headWeight: 500,
        headSize: 84,
        headFill: ROSE_GOLD,
        bodyFont: "Jost",
        bodyWeight: 300,
        bodyFill: INK,
        strongFont: "Playfair Display",
        strongWeight: 400,
        strongFill: ROSE_GOLD,
        strongSize: 42,
        labelFont: "Montserrat",
        labelWeight: 500,
        labelSize: 16,
        labelSpacing: 9,
        labelFill: RG,
        accent: RG,
        divider: "diamond",
        y0: 275,
        x: 200,
        width: 600,
        gap: 0.9,
      }),
    ],
    "Details",
  );

  // ---------------- photo ----------------
  const photo = P(
    bg,
    [
      lock(O(geoBackdrop({ w: 900, h: 1300, cx: 450, cy: 600, color: RG, strokeWidth: 1.2 }), { x: 50, y: 50, width: 900, opacity: 0.35 })),
      ...frame(),
      lock(O(hexFrame({ w: 720, h: 900, color: RG, fill: WIN, lines: 2, gap: 16, strokeWidth: 2.4 }), { x: 140, y: 170, width: 720 })),
      I({ x: 240, y: 270, width: 520, height: 700, mask: "ellipse", placeholderFill: "#2f2b2f", borderColor: RG, borderWidth: 2 }),
      ...sparkles([
        [130, 260, 24, 0.9],
        [880, 1010, 24, 0.9],
        [880, 250, 14, 0.6],
      ]),
      T("Two hearts, one story", 1130, { x: 200, width: 600, fontFamily: "Bodoni Moda", italic: true, fontWeight: 500, fontSize: 46, fill: ROSE_GOLD }),
      T("Sophia & Alexander · 14 · 09 · 2027", 1205, { x: 150, width: 700, fontFamily: "Montserrat", fontWeight: 400, fontSize: 15, fill: INK, letterSpacing: 8, uppercase: true }),
    ],
    "Our Story",
  );

  return {
    slug: "rose-gold-geometric",
    name: "Rose Gold Geometry",
    tagline: "Glamorous rose gold wedding invitation on charcoal with geometric linework",
    description:
      "A sleek contemporary wedding invitation in graphite and rose gold foil, framing the couple's names in a fine hexagonal window with intersecting geometric lines and sparkles.",
    categories: ["geometric", "modern", "luxury", "dark"],
    keywords: ["rose gold wedding invitation", "geometric wedding card", "dark modern wedding invitation", "art deco rose gold invite"],
    palette: ["#1d1c20", "#d9a595", "#f0c3b0", "#cfc4c1", "#b57d70"],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
