import { archFrame, decoFrame, divider, sunburst } from "../design/ornaments";
import { GUEST_TOKEN } from "../design/types";
import type { Layer } from "../design/types";
import { H, I, lock, O, P, radial, T, W, type TemplateDef } from "./kit";
import { confetti, sparkAt, starAt } from "./birthday-balloons-bold.art";
import { diploma, FOIL, GOLD_L, GOLD_M, mortarboard } from "./graduation-cap-gold.art";

const BG = radial([0, "#22397f"], [0.6, "#13204f"], [1, "#0a1330"]);
const CREAM = "#f6ecd2";
const CONF = ["#e9cf8a", "#d9b45f", "#f6ecd2", "#b88a3e", "#6f86d6", "#ffffff"];

const frame = (): Layer[] => [
  lock(O(decoFrame({ w: 924, h: 1324, cut: 54, stroke: GOLD_M, strokeWidth: 3, lines: 2, gap: 14 }), { x: 38, y: 38 })),
];

const label = (text: string, y: number, o: Record<string, unknown> = {}) =>
  T(text, y, { x: 120, width: 760, fontFamily: "Cinzel", fontWeight: 500, fontSize: 24, letterSpacing: 12, uppercase: true, fill: GOLD_M, ...o });

const rule = (y: number, w = 340) => lock(O(divider({ style: "diamond", w, color: GOLD_M, strokeWidth: 1.6 }), { cx: W / 2, y: y - 20 }));

export default function build(): TemplateDef {
  const rays = (cy: number) => lock(O(sunburst({ color: GOLD_L, rays: 40, size: 1500, core: 0.08 }), { x: 500 - 750, y: cy - 750, opacity: 0.055 }));

  /* --------------------------------- cover --------------------------------- */
  const cover = P(
    BG,
    [
      rays(400),
      confetti({ seed: 5, count: 90, colors: CONF, area: [60, 60, 940, 1340], size: 1.05, opacity: 0.9, skip: (x, y) => x > 70 && x < 930 && y > 600 && y < 1340 }),
      ...frame(),
      label("Class of 2027", 112, { fontSize: 25 }),
      rule(166, 300),
      mortarboard(500, 372, 1.15),
      starAt(250, 300, 34, GOLD_L, 0, 0.9),
      sparkAt(770, 250, 40, GOLD_L, 0.9),
      sparkAt(210, 470, 26, "#ffffff", 0.7),
      sparkAt(830, 520, 24, "#ffffff", 0.7),
      T("You are invited to the", 640, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 36, fill: CREAM }),
      T("Graduation", 684, { x: 60, width: 880, fontFamily: "Playfair Display", fontWeight: 800, fontSize: 142, lineHeight: 1.1, fill: FOIL }),
      T("Party", 850, { x: 150, width: 700, fontFamily: "Cinzel", fontWeight: 600, fontSize: 48, letterSpacing: 30, uppercase: true, fill: CREAM }),
      T("celebrating", 922, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 30, fill: GOLD_L }),
      T("Tahmina Rahman", 972, { x: 60, width: 880, fontFamily: "Great Vibes", fontSize: 112, lineHeight: 1.2, fill: FOIL }),
      rule(1120, 380),
      T("Saturday, 12 June 2027  ·  6 PM", 1148, { x: 100, width: 800, fontFamily: "Cinzel", fontWeight: 500, fontSize: 30, letterSpacing: 4, fill: CREAM }),
      T("The Grand Pavilion, Gulshan, Dhaka", 1200, { x: 100, width: 800, fontFamily: "Cormorant Garamond", fontWeight: 500, fontSize: 32, fill: GOLD_L }),
      T(GUEST_TOKEN, 1262, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 600, fontSize: 36, fill: "#ffffff", opacity: 0.9 }),
    ],
    "Invitation",
  );

  /* -------------------------------- details -------------------------------- */
  const rows: [string, string, string][] = [
    ["Date", "Saturday, 12 June 2027", "Join us for an unforgettable evening"],
    ["Time", "Six in the Evening", "Photos, toasts and dinner to follow"],
    ["Venue", "The Grand Pavilion", "Road 11, Gulshan 2, Dhaka"],
    ["Dress Code", "Smart Celebration", "Navy and gold are welcome"],
  ];
  const rowLayers: Layer[] = [];
  rows.forEach(([k, v, sub], i) => {
    const y = 350 + i * 190;
    rowLayers.push(
      T(k, y, { x: 150, width: 700, fontFamily: "Cinzel", fontWeight: 500, fontSize: 21, letterSpacing: 12, uppercase: true, fill: GOLD_M }),
      T(v, y + 38, { x: 100, width: 800, fontFamily: "Playfair Display", fontWeight: 600, fontSize: 52, fill: CREAM }),
      T(sub, y + 108, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 29, fill: GOLD_L, opacity: 0.9 }),
    );
    if (i < rows.length - 1) rowLayers.push(rule(y + 160, 220));
  });
  const details = P(
    BG,
    [
      rays(700),
      confetti({ seed: 9, count: 36, colors: CONF, area: [60, 60, 940, 1340], opacity: 0.8, skip: (x, y) => x > 80 && x < 920 && y > 200 && y < 1330 }),
      ...frame(),
      mortarboard(500, 150, 0.36),
      T("The Celebration", 232, { x: 80, width: 840, fontFamily: "Playfair Display", fontWeight: 700, fontSize: 82, fill: FOIL }),
      ...rowLayers,
      diploma(500, 1190, 380, 74, -2),
      T("Dinner  ·  Dessert  ·  Dancing", 1286, { x: 120, width: 760, fontFamily: "Cinzel", fontWeight: 500, fontSize: 22, letterSpacing: 8, uppercase: true, fill: GOLD_L }),
    ],
    "Details",
  );

  /* ------------------------------ photo page ------------------------------ */
  const photo = P(
    BG,
    [
      rays(640),
      confetti({ seed: 21, count: 70, colors: CONF, area: [60, 60, 940, 1340], opacity: 0.9, skip: (x, y) => x > 150 && x < 850 && y > 70 && y < 1300 }),
      ...frame(),
      label("Proud of you", 112, { fontSize: 24 }),
      rule(166, 300),
      lock(O(archFrame({ w: 560, h: 720, stroke: GOLD_M, strokeWidth: 2.5, lines: 2, gap: 10 }), { x: 220, y: 190 })),
      I({ x: 250, y: 220, width: 500, height: 660, mask: "arch", placeholderFill: "#2a3f86", borderColor: GOLD_M, borderWidth: 6 }),
      starAt(205, 330, 36, GOLD_L, 0, 0.95),
      sparkAt(800, 300, 44, GOLD_L),
      sparkAt(215, 760, 28, "#ffffff", 0.8),
      starAt(795, 790, 30, GOLD_L, 12, 0.9),
      T("Congratulations,", 944, { x: 100, width: 800, fontFamily: "Great Vibes", fontSize: 76, lineHeight: 1.15, fill: FOIL }),
      T("Tahmina!", 1026, { x: 100, width: 800, fontFamily: "Great Vibes", fontSize: 76, lineHeight: 1.15, fill: FOIL }),
      T("Four years of late nights, big dreams and bigger hearts.\nCome raise a glass to the next chapter.", 1128, { x: 130, width: 740, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 32, lineHeight: 1.35, fill: CREAM }),
      diploma(500, 1272, 240, 46, 0),
    ],
    "Photo",
  );

  return {
    slug: "graduation-cap-gold",
    name: "Graduation Cap Gold",
    tagline: "Navy and gold graduation party invitation with mortarboard and diploma",
    description:
      "An elegant navy and gold graduation party invitation featuring a mortarboard with a golden tassel, a ribboned diploma and glittering foil confetti. Ideal for high school, college and university graduation celebrations.",
    categories: ["graduation", "party"],
    keywords: ["graduation party invitation template", "navy and gold graduation invite", "class of 2027 graduation announcement", "mortarboard diploma invitation card", "college graduation celebration invitation", "digital graduation invite with guest name"],
    palette: ["#0a1330", "#14224f", "#d9b45f", "#f2dc9b", "#f6ecd2"],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
