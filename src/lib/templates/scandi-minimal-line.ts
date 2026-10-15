import { GUEST_TOKEN, type Layer } from "../design/types";
import { I, lock, O, P, radial, S, T, W, H, type TemplateDef } from "./kit";
import { hairSprig, lineBotanical } from "./scandi-minimal-line.art";

const PAPER = "#f6f3ec";
const INK = "#2c2b29";
const GREY = "#8b877f";
const BLUSH = "#ead8cb";
const SAGE = "#cfd5c3";
const CLAY = "#c9a58f";

const bg = "#f6f3ec";

const disc = (cx: number, cy: number, r: number, fill: string, opacity = 1): Layer =>
  lock(S({ shape: "ellipse", x: cx - r, y: cy - r, width: r * 2, height: r * 2, fill, opacity }));

const sans = (t: string, y: number, o: Partial<Parameters<typeof T>[2]> = {}) =>
  T(t, y, { x: 150, width: 700, fontFamily: "Jost", fontWeight: 300, fontSize: 18, fill: GREY, letterSpacing: 10, uppercase: true, ...o });

export default function scandiMinimalLine(): TemplateDef {
  const plant = (cx: number, y: number, w: number, h: number, phase = 0, leaves = 7) =>
    lock(O(lineBotanical({ w, h, stroke: INK, strokeWidth: 2.2, leaves, phase }), { cx, y, width: w }));

  const cover = P(
    bg,
    [
      sans(GUEST_TOKEN, 96, { fontSize: 20, letterSpacing: 8, fill: GREY, uppercase: false, fontFamily: "Jost" }),
      sans("We are getting married", 178, { fontSize: 14, letterSpacing: 12 }),
      T("ELLA", 236, { x: 100, width: 800, fontFamily: "Jost", fontWeight: 200, fontSize: 96, fill: INK, letterSpacing: 34, lineHeight: 1 }),
      T("and", 360, { x: 100, width: 800, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 400, fontSize: 38, fill: CLAY, lineHeight: 1 }),
      T("NOAH", 420, { x: 100, width: 800, fontFamily: "Jost", fontWeight: 200, fontSize: 96, fill: INK, letterSpacing: 34, lineHeight: 1 }),
      disc(520, 880, 215, BLUSH, 0.85),
      disc(430, 1010, 62, SAGE, 0.9),
      plant(500, 600, 330, 640, 0.4, 7),
      lock(O(hairSprig(160, GREY), { cx: 500, y: 1262, width: 160 })),
      sans("14 · 06 · 2027", 1296, { fontSize: 22, letterSpacing: 12, fill: INK, fontWeight: 300 }),
      sans("Nordhavn Hall · Copenhagen", 1336, { fontSize: 12, letterSpacing: 8 }),
    ],
    "Invitation",
  );

  // -------- details
  const rows: [string, string, string][] = [
    ["15:00", "Ceremony", "in the garden"],
    ["16:00", "Drinks", "on the terrace"],
    ["18:00", "Dinner", "long tables, candlelight"],
    ["21:00", "Dancing", "until late"],
  ];
  const rowLayers: Layer[] = [];
  rows.forEach(([time, title, note], i) => {
    const y = 470 + i * 130;
    rowLayers.push(
      lock(S({ x: 150, y: y - 28, width: 700, height: 1, fill: "rgba(44,43,41,0.28)" })),
      T(time, y, { x: 150, width: 200, align: "left", fontFamily: "Jost", fontWeight: 200, fontSize: 56, fill: INK, lineHeight: 1 }),
      T(title, y + 2, { x: 400, width: 450, align: "left", fontFamily: "Jost", fontWeight: 400, fontSize: 22, fill: INK, letterSpacing: 8, uppercase: true }),
      T(note, y + 38, { x: 400, width: 450, align: "left", fontFamily: "Cormorant Garamond", italic: true, fontSize: 26, fill: GREY }),
    );
  });
  rowLayers.push(lock(S({ x: 150, y: 470 + 4 * 130 - 28, width: 700, height: 1, fill: "rgba(44,43,41,0.28)" })));

  const details = P(
    bg,
    [
      disc(820, 200, 125, SAGE, 0.6),
      plant(830, 90, 130, 300, 1.2, 5),
      sans("The day", 190, { x: 150, width: 700, align: "left", fontSize: 14, letterSpacing: 12 }),
      T("Saturday,\n14 June", 232, { x: 150, width: 700, align: "left", fontFamily: "Jost", fontWeight: 200, fontSize: 74, fill: INK, lineHeight: 1.1 }),
      ...rowLayers,
      sans("Venue", 1052, { x: 150, width: 700, align: "left", fontSize: 13, letterSpacing: 12 }),
      T("Nordhavn Hall", 1084, { x: 150, width: 700, align: "left", fontFamily: "Jost", fontWeight: 300, fontSize: 38, fill: INK, letterSpacing: 4 }),
      T("Orientkaj 12, Copenhagen", 1136, { x: 150, width: 700, align: "left", fontFamily: "Cormorant Garamond", italic: true, fontSize: 26, fill: GREY }),
      sans("Attire", 1208, { x: 150, width: 700, align: "left", fontSize: 13, letterSpacing: 12 }),
      T("Soft neutrals, natural fabrics", 1240, { x: 150, width: 700, align: "left", fontFamily: "Cormorant Garamond", italic: true, fontSize: 26, fill: GREY }),
    ],
    "Details",
  );

  // -------- photo
  const photo = P(
    bg,
    [
      disc(800, 250, 190, BLUSH, 0.8),
      lock(S({ x: 178, y: 168, width: 640, height: 800, fill: null, stroke: INK, strokeWidth: 1 })),
      I({ x: 150, y: 140, width: 640, height: 800, mask: "rect", placeholderFill: "#d9d4c8", borderColor: null, borderWidth: 0 }),
      plant(860, 960, 150, 320, 2.2, 5),
      T("Two quiet people,\none loud, happy day.", 1070, { x: 150, width: 700, align: "left", fontFamily: "Cormorant Garamond", italic: true, fontSize: 44, fill: INK, lineHeight: 1.2 }),
      sans("Ella & Noah", 1210, { x: 150, width: 700, align: "left", fontSize: 18, letterSpacing: 14, fill: INK }),
      sans("14 · 06 · 2027", 1250, { x: 150, width: 700, align: "left", fontSize: 14, letterSpacing: 10 }),
    ],
    "Photo",
  );

  return {
    slug: "scandi-minimal-line",
    name: "Scandi Line",
    tagline: "Scandinavian minimalist wedding invitation with a single-line botanical",
    description:
      "A calm Nordic wedding invitation in warm off-white with one continuous line-drawn botanical, soft blush and sage circles and thin, airy sans-serif lettering. Generous whitespace for modern, minimalist and eco-conscious weddings.",
    categories: ["minimal", "modern", "nature"],
    keywords: [
      "scandinavian minimalist wedding invitation",
      "single line botanical wedding card",
      "modern minimal wedding invitation off white",
      "nordic simple wedding invitation online",
      "line art leaf wedding invite",
    ],
    palette: [PAPER, INK, GREY, BLUSH, SAGE],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}

void radial;
