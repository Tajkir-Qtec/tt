import { sunburst } from "../design/ornaments";
import { Path } from "../design/path";
import { GUEST_TOKEN } from "../design/types";
import type { Layer, Paint } from "../design/types";
import { H, I, linear, lock, O, P, S, T, W, type TemplateDef } from "./kit";
import { confetti, dot, place, sparkAt, starAt } from "./birthday-balloons-bold.art";
import { fern, footprints, hatchling, INK, LEAF_D, LEAF_L, longNeck, ORANGE, ORANGE_D, SUN, trike, volcano } from "./kids-dino-adventure.art";

const SKY = linear(90, [0, "#fff3b0"], [0.4, "#d9f193"], [1, "#9edb6e"]);
const CREAM = "#fffaf0";

interface ExtrudeOpts {
  x: number;
  y: number;
  width: number;
  fontSize: number;
  face: Paint;
  side?: string;
  depth?: number;
  font?: string;
}
/** Chunky extruded display text: stacked dark copies behind a bright face. */
function extrude(text: string, o: ExtrudeOpts): Layer[] {
  const out: Layer[] = [];
  const depth = o.depth ?? 8;
  const font = o.font ?? "Abril Fatface";
  for (let i = depth; i >= 1; i--) out.push(lock(T(text, o.y + i * 1.4, { x: o.x + i * 1.4, width: o.width, fontFamily: font, fontSize: o.fontSize, lineHeight: 1.1, fill: o.side ?? INK })));
  out.push(lock(T(text, o.y, { x: o.x, width: o.width, fontFamily: font, fontSize: o.fontSize, lineHeight: 1.1, fill: o.face })));
  return out;
}

const label = (text: string, y: number, o: Record<string, unknown> = {}) =>
  T(text, y, { x: 100, width: 800, fontFamily: "Poppins", fontWeight: 700, fontSize: 24, letterSpacing: 9, uppercase: true, fill: INK, ...o });

const card = (x: number, y: number, w: number, h: number, fill = CREAM): Layer[] => [
  lock(S({ x: x + 8, y: y + 9, width: w, height: h, cornerRadius: 38, fill: INK })),
  lock(S({ x, y, width: w, height: h, cornerRadius: 38, fill, stroke: INK, strokeWidth: 5 })),
  lock(S({ x: x + 14, y: y + 14, width: w - 28, height: h - 28, cornerRadius: 28, fill: null, stroke: ORANGE, strokeWidth: 2.5, dash: [3, 9] })),
];

function hills(y1: number, y2: number, bottom = H): Layer {
  const a = new Path();
  a.M(0, y1).C(250, y1 - 60, 560, y1 + 24, 1000, y1 - 40).L(1000, bottom).L(0, bottom).Z();
  const b = new Path();
  b.M(0, y2).C(300, y2 - 50, 700, y2 + 30, 1000, y2 - 30).L(1000, bottom).L(0, bottom).Z();
  const grass = new Path();
  for (const [gx, gy] of [[60, y2 + 70], [930, y2 + 50], [880, y2 + 130], [120, y2 + 150]]) grass.M(gx - 12, gy).L(gx - 4, gy - 22).L(gx, gy).L(gx + 6, gy - 18).L(gx + 12, gy);
  return place(
    [
      { path: a, fill: linear(90, [0, "#86d86a"], [1, "#62c356"]) },
      { path: b, fill: linear(90, [0, "#55bb50"], [1, "#35994a"]) },
      { path: grass, stroke: "#2c8744", strokeWidth: 3, opacity: 0.7 },
    ],
    2,
  );
}

const sunLayers = (cx: number, cy: number): Layer[] => [
  lock(O(sunburst({ color: "#ffffff", rays: 18, size: 900, core: 0.1 }), { x: cx - 450, y: cy - 450, opacity: 0.22 })),
  dot(cx, cy, 190, "#fff3a0", 0.55),
  dot(cx, cy, 130, SUN, 1, "#f0a800", 4),
];

export default function build(): TemplateDef {
  /* --------------------------------- cover --------------------------------- */
  const cover = P(
    SKY,
    [
      ...sunLayers(930, 50),
      confetti({ seed: 3, count: 26, colors: ["#ffffff", "#ff8a2a", "#ffd23f", "#2ec4b6"], area: [20, 20, 980, 900], size: 0.9, opacity: 0.8, skip: (x, y) => (x > 60 && x < 940 && y > 50 && y < 400) || (x > 80 && x < 940 && y > 410) }),
      fern(-20, 30, 380, 28, -60),
      fern(-30, 160, 300, 50, -40, "#2f9a52", "#8ae07a", 9),
      fern(1020, 330, 270, 160, 50, "#2f9a52", "#8ae07a", 10),
      label("Roar! You're invited to", 62, { fontSize: 24 }),
      ...extrude("Dino-mite", { x: 40, y: 98, width: 920, fontSize: 176, face: linear(90, [0, "#ffa43a"], [1, "#ff6a1f"]), depth: 9 }),
      ...extrude("Birthday Party", { x: 80, y: 292, width: 840, fontSize: 84, face: "#ffffff", depth: 6 }),
      T("Leo is turning", 424, { x: 90, width: 440, fontFamily: "Poppins", fontWeight: 800, fontSize: 30, letterSpacing: 4, uppercase: true, fill: INK }),
      ...extrude("5", { x: 70, y: 436, width: 500, fontSize: 410, face: linear(90, [0, "#ffd23f"], [1, "#ff8a2a"]), depth: 12 }),
      longNeck(748, 766, 0.85),
      starAt(430, 470, 44, "#ffffff", 12),
      sparkAt(90, 560, 40, "#ffffff"),
      sparkAt(600, 770, 34, "#ffffff"),
      hills(878, 940),
      footprints([[70, 906, 82], [150, 928, -98], [230, 906, 82], [310, 928, -98], [390, 906, 82], [470, 928, -98]], "#1f6b36", 0.4, 0.55),
      ...card(90, 962, 820, 336),
      T("Join Leo's wild adventure!", 990, { x: 120, width: 760, fontFamily: "Abril Fatface", fontSize: 46, lineHeight: 1.1, fill: INK }),
      T("Saturday, 14 August 2027", 1064, { x: 120, width: 760, fontFamily: "Poppins", fontWeight: 700, fontSize: 38, fill: ORANGE_D }),
      T("11 AM to 2 PM", 1116, { x: 120, width: 760, fontFamily: "Poppins", fontWeight: 600, fontSize: 30, fill: INK }),
      T("Sunshine Play Park, Uttara, Dhaka", 1176, { x: 120, width: 760, fontFamily: "Poppins", fontWeight: 600, fontSize: 27, fill: INK, opacity: 0.85 }),
      T("Come dressed as your favourite dino", 1232, { x: 120, width: 760, fontFamily: "Outfit", fontWeight: 600, fontSize: 21, letterSpacing: 3, uppercase: true, fill: ORANGE_D }),
      T(GUEST_TOKEN, 1322, { x: 200, width: 600, fontFamily: "Abril Fatface", fontSize: 48, lineHeight: 1.1, fill: "#fffaf0" }),
    ],
    "Invitation",
  );

  /* -------------------------------- details -------------------------------- */
  const rows: [string, string, string, string][] = [
    [ORANGE, "When", "Saturday, 14 August", "11 AM to 2 PM, 2027"],
    ["#2ec4b6", "Where", "Sunshine Play Park", "Uttara, Dhaka"],
    [SUN, "Wear", "Dino or explorer gear", "Roar-some costumes welcome"],
    ["#ff7aa8", "Eat", "Dino nuggets & cake", "Jungle juice, fruit and surprises"],
  ];
  const rowLayers: Layer[] = [];
  rows.forEach(([color, k, v, sub], i) => {
    const y = 330 + i * 186;
    rowLayers.push(
      ...card(100, y, 800, 160),
      dot(200, y + 80, 104, color, 1, INK, 4),
      footprints([[200, y + 72, i % 2 ? 12 : -12]], INK, 0.9, 0.9),
      T(k, y + 24, { x: 280, width: 580, align: "left", fontFamily: "Poppins", fontWeight: 700, fontSize: 19, letterSpacing: 8, uppercase: true, fill: ORANGE_D }),
      T(v, y + 50, { x: 280, width: 600, align: "left", fontFamily: "Abril Fatface", fontSize: 42, lineHeight: 1.1, fill: INK }),
      T(sub, y + 108, { x: 280, width: 600, align: "left", fontFamily: "Poppins", fontWeight: 500, fontSize: 24, fill: INK, opacity: 0.8 }),
    );
  });
  const details = P(
    SKY,
    [
      ...sunLayers(930, 50),
      fern(-20, 30, 360, 30, -60),
      fern(1020, 360, 320, 160, 50, "#2f9a52", "#8ae07a", 10),
      label("Everything you need to know", 70, { fontSize: 22 }),
      ...extrude("Adventure Time!", { x: 40, y: 112, width: 920, fontSize: 104, face: linear(90, [0, "#ffa43a"], [1, "#ff6a1f"]), depth: 7 }),
      volcano(790, 1222, 300, 160),
      hills(1190, 1240),
      ...rowLayers,
      trike(250, 1252, 0.78),
      hatchling(700, 1345, 0.95),
      fern(980, 1400, 240, -150, 40, "#2f7d3c", "#5fc16a", 8),
    ],
    "Details",
  );

  /* ------------------------------ photo page ------------------------------ */
  const photo = P(
    SKY,
    [
      ...sunLayers(70, 60),
      confetti({ seed: 8, count: 30, colors: ["#ffffff", "#ff8a2a", "#ffd23f", "#2ec4b6", "#ff7aa8"], area: [20, 20, 980, 1000], size: 0.9, opacity: 0.85, skip: (x, y) => x > 150 && x < 850 && y > 250 && y < 960 }),
      label("Meet the birthday explorer", 160, { fontSize: 22 }),
      fern(-30, 380, 340, 20, -50, "#2f9a52", "#8ae07a", 10),
      fern(1030, 400, 340, 160, 50, "#2f9a52", "#8ae07a", 10),
      dot(508, 628, 590, INK),
      dot(500, 620, 590, CREAM, 1, INK, 6),
      I({ x: 220, y: 340, width: 560, height: 560, mask: "ellipse", placeholderFill: "#a9e08a", borderColor: "#ffd23f", borderWidth: 10 }),
      starAt(190, 350, 56, "#ffd23f", -12),
      starAt(820, 880, 48, "#ff8a2a", 14),
      sparkAt(840, 330, 44, "#ffffff"),
      ...extrude("Leo turns 5!", { x: 60, y: 960, width: 880, fontSize: 112, face: linear(90, [0, "#ffa43a"], [1, "#ff6a1f"]), depth: 8 }),
      T("Come stomp, roar and play with us!", 1118, { x: 100, width: 800, fontFamily: "Poppins", fontWeight: 700, fontSize: 30, fill: INK }),
      T("Dino cake  ·  Fossil dig  ·  Jungle games", 1166, { x: 100, width: 800, fontFamily: "Outfit", fontWeight: 600, fontSize: 21, letterSpacing: 4, uppercase: true, fill: ORANGE_D }),
      hills(1222, 1270),
      longNeck(905, 1262, 0.27, undefined, false),
      trike(240, 1290, 0.46, undefined, true),
      hatchling(500, 1388, 0.62),
    ],
    "Photo",
  );

  return {
    slug: "kids-dino-adventure",
    name: "Dino Adventure",
    tagline: "Friendly dinosaurs, jungle ferns and a giant age number for a roaring birthday",
    description:
      "A bright, playful dinosaur birthday party invitation with friendly vector dinosaurs, a hatching egg, jungle ferns and dino footprints in vivid greens and oranges. Perfect for a Dino-mite kids birthday celebration.",
    categories: ["kids", "birthday", "party"],
    keywords: ["dinosaur birthday party invitation template", "kids dino themed birthday invite", "dino-mite birthday invitation card", "jurassic adventure party invitation", "boys birthday dinosaur invitation digital", "toddler dinosaur birthday invite with age number"],
    palette: ["#fff3b0", "#4cc16a", "#ff8a2a", "#ffd23f", "#1f4d2b"],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}

void LEAF_D;
void LEAF_L;
