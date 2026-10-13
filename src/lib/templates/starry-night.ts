import { archFrame, crescent, divider, sparkle } from "../design/ornaments";
import type { Pt } from "../design/path";
import { detailsLayers } from "./details";
import { constellation, starField, type Rect } from "./starry-night.art";
import { H, I, linear, lock, O, P, S, SILVER, T, W, type TemplateDef } from "./kit";

const SIL = "#cfd6e6";
const SIL_L = "#eef1fa";
const MIST = "#aab3d0";
const bg = linear(180, [0, "#070b24"], [0.55, "#131646"], [1, "#27205e"]);
const windowFill = linear(180, [0, "rgba(6,9,30,0.78)"], [1, "rgba(24,20,66,0.78)"]);

function constel(pts: Pt[], op = 1) {
  const layers = [lock(O(constellation(pts, SIL), { x: 0, y: 0, width: W, opacity: 0.75 * op }))];
  pts.forEach(([x, y], i) => layers.push(lock(O(sparkle({ color: SIL_L, size: i % 2 ? 20 : 30 }), { cx: x, y: y - (i % 2 ? 10 : 15), width: i % 2 ? 20 : 30, opacity: 0.95 * op }))));
  return layers;
}

function glow(cx: number, cy: number, r: number, a: number) {
  return lock(S({ shape: "ellipse", x: cx - r, y: cy - r, width: r * 2, height: r * 2, fill: { kind: "radial", stops: [[0, `rgba(170,182,255,${a})`], [0.3, `rgba(130,140,240,${a * 0.35})`], [0.7, "rgba(110,120,230,0)"], [1, "rgba(110,120,230,0)"]] } }));
}

const nebula = [
  lock(S({ shape: "ellipse", x: -200, y: 900, width: 800, height: 700, fill: { kind: "radial", stops: [[0, "rgba(120,80,200,0.30)"], [0.7, "rgba(120,80,200,0)"], [1, "rgba(120,80,200,0)"]] } })),
  lock(S({ shape: "ellipse", x: 500, y: -250, width: 800, height: 700, fill: { kind: "radial", stops: [[0, "rgba(70,100,220,0.28)"], [0.7, "rgba(70,100,220,0)"], [1, "rgba(70,100,220,0)"]] } })),
];

const archAvoid: Rect = [190, 300, 810, 1200];

export default function build(): TemplateDef {
  const aw = 600;
  const ah = 880;
  const ax = 200;
  const ay = 310;

  const cover = P(
    bg,
    [
      ...nebula,
      ...starField(11, 52, [archAvoid, [380, 90, 620, 310]]),
      ...constel([[110, 330], [170, 240], [130, 150], [250, 120], [330, 200]]),
      ...constel([[890, 1010], [820, 1110], [905, 1200], [780, 1280], [690, 1240]]),
      glow(500, 200, 230, 0.4),
      lock(O(crescent({ color: SIL_L, size: 150 }), { cx: 500, y: 118, width: 150, rotation: 0 })),
      lock(O(archFrame({ w: aw, h: ah, stroke: SIL, strokeWidth: 2.6, lines: 3, gap: 12, fill: windowFill }), { x: ax, y: ay, width: aw })),
      T("Dear {to},", 62, { x: 250, width: 500, fontFamily: "Cormorant Garamond", italic: true, fontSize: 32, fill: SIL_L }),
      T("Together with their families", 458, { x: 230, width: 540, fontFamily: "Jost", fontWeight: 400, fontSize: 13, fill: MIST, letterSpacing: 6, uppercase: true }),
      T("invite you to celebrate the wedding of", 492, { x: 230, width: 540, fontFamily: "Cormorant Garamond", italic: true, fontSize: 25, fill: SIL }),
      T("Isabella", 552, { x: 220, width: 560, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 118, fill: SILVER, shadow: { color: "#9aa6ff", blur: 22, offsetX: 0, offsetY: 0, opacity: 0.55 } }),
      T("&", 690, { x: 220, width: 560, fontFamily: "Cinzel", fontSize: 38, fill: SIL }),
      T("Sebastian", 730, { x: 220, width: 560, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 106, fill: SILVER, shadow: { color: "#9aa6ff", blur: 22, offsetX: 0, offsetY: 0, opacity: 0.55 } }),
      lock(O(divider({ style: "stars", w: 320, color: SIL }), { cx: W / 2, y: 876, width: 320 })),
      T("Saturday", 932, { x: 230, width: 540, fontFamily: "Jost", fontWeight: 400, fontSize: 16, fill: MIST, letterSpacing: 10, uppercase: true }),
      T("21 · 08 · 2027", 964, { x: 210, width: 580, fontFamily: "Cinzel", fontWeight: 500, fontSize: 48, fill: SILVER }),
      T("at eight o'clock in the evening", 1036, { x: 230, width: 540, fontFamily: "Cormorant Garamond", italic: true, fontSize: 25, fill: SIL }),
      T("The Observatory", 1094, { x: 230, width: 540, fontFamily: "Cinzel", fontWeight: 500, fontSize: 24, fill: SILVER, letterSpacing: 6, uppercase: true }),
      T("Griffith Park · Los Angeles", 1138, { x: 230, width: 540, fontFamily: "Jost", fontWeight: 300, fontSize: 18, fill: MIST, letterSpacing: 3 }),
    ],
    "Invitation",
  );

  const details = P(
    bg,
    [
      ...nebula,
      ...starField(23, 46, [[110, 70, 890, 1330]]),
      lock(O(archFrame({ w: 780, h: 1240, stroke: SIL, strokeWidth: 2.6, lines: 3, gap: 12, fill: windowFill }), { x: 110, y: 80, width: 780 })),
      lock(O(crescent({ color: SIL_L, size: 70 }), { cx: W / 2, y: 175, width: 70 })),
      glow(500, 210, 130, 0.28),
      ...detailsLayers({
        heading: "The Details",
        headFont: "Cormorant Garamond",
        headItalic: true,
        headWeight: 500,
        headSize: 88,
        headFill: SILVER,
        bodyFont: "Jost",
        bodyWeight: 300,
        bodyFill: SIL,
        strongFont: "Cinzel",
        strongWeight: 500,
        strongFill: SILVER,
        strongSize: 36,
        labelFont: "Jost",
        labelWeight: 400,
        labelSize: 16,
        labelSpacing: 9,
        labelFill: MIST,
        accent: SIL,
        divider: "stars",
        y0: 275,
        x: 200,
        width: 600,
        gap: 0.9,
      }),
    ],
    "Details",
  );

  const photo = P(
    bg,
    [
      ...nebula,
      ...starField(41, 50, [[170, 120, 830, 1070], [100, 1080, 900, 1240]]),
      ...constel([[90, 1250], [170, 1310], [270, 1280], [330, 1330]], 0.9),
      ...constel([[900, 150], [820, 230], [880, 330]], 0.9),
      glow(500, 560, 420, 0.22),
      lock(O(archFrame({ w: 640, h: 940, stroke: SIL, strokeWidth: 2.6, lines: 3, gap: 12, fill: windowFill }), { x: 180, y: 120, width: 640 })),
      I({ x: 206, y: 146, width: 588, height: 888, mask: "arch", placeholderFill: "#1b1d55" }),
      T("Written in the stars", 1110, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 64, fill: SILVER, shadow: { color: "#9aa6ff", blur: 18, offsetX: 0, offsetY: 0, opacity: 0.5 } }),
      T("Isabella & Sebastian · 21 · 08 · 2027", 1200, { x: 150, width: 700, fontFamily: "Jost", fontWeight: 400, fontSize: 15, fill: MIST, letterSpacing: 7, uppercase: true }),
    ],
    "Our Story",
  );

  return {
    slug: "starry-night",
    name: "Starry Night",
    tagline: "Celestial midnight-blue wedding invitation with moon and stars",
    description:
      "A dreamy night-sky wedding invitation in midnight blue and indigo, with a glowing crescent moon, silver constellations and an arched window framing the couple's names in silver foil.",
    categories: ["celestial", "luxury", "dark", "modern"],
    keywords: ["celestial wedding invitation", "starry night wedding card", "moon and stars wedding invite", "midnight blue silver wedding"],
    palette: ["#070b24", "#131646", "#27205e", "#cfd6e6", "#aab3d0"],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
