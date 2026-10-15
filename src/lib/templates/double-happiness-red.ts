import { ticketFrame } from "../design/ornaments";
import { GUEST_TOKEN } from "../design/types";
import type { Layer } from "../design/types";
import { centerRotate } from "../design/layers";
import { cloud, coinPattern, doubleHappiness, GOLD_S, lozengeDivider, peony } from "./double-happiness-red.art";
import { wDetails } from "./wedding-details";
import { GOLD, H, I, linear, lock, O, P, radial, S, T, W, type TemplateDef } from "./kit";

const CREAM = "#fbe9c8";
const SOFT = "#f0cf9b";
const bg = linear(100, [0, "#8c0f1e"], [0.5, "#b3131f"], [1, "#7a0b18"]);
const foil = { color: "#3a0006", blur: 8, offsetX: 0, offsetY: 3, opacity: 0.55 };

function base(): Layer[] {
  return [
    lock(S({ shape: "ellipse", x: -150, y: 150, width: 1300, height: 1100, fill: radial([0, "rgba(232,70,60,0.35)"], [0.6, "rgba(190,30,40,0.12)"], [1, "rgba(120,10,24,0)"]) })),
    lock(O(coinPattern(W, H, 44), { x: 0, y: 0, width: W })),
    lock(O(ticketFrame({ w: 920, h: 1320, r: 46, stroke: GOLD_S, strokeWidth: 4, lines: 2, gap: 12 }), { x: 40, y: 40, width: 920 })),
  ];
}

const peonyAt = (cx: number, cy: number, size: number, rot: number, seed: number): Layer =>
  lock(centerRotate(O(peony(size, seed), { x: 0, y: 0, width: size }), cx, cy, rot));

const cloudAt = (cx: number, y: number, w: number): Layer => lock(O(cloud(w), { cx, y, width: w }));

export default function doubleHappinessRed(): TemplateDef {
  const emblemRing: Layer[] = [
    lock(S({ shape: "ellipse", x: 300, y: 118, width: 400, height: 400, fill: radial([0, "#c01a26"], [0.7, "#8e0f1d"], [1, "#6c0813"]), stroke: GOLD_S, strokeWidth: 6 })),
    lock(S({ shape: "ellipse", x: 318, y: 136, width: 364, height: 364, fill: null, stroke: GOLD_S, strokeWidth: 1.5 })),
    lock(S({ shape: "ellipse", x: 332, y: 150, width: 336, height: 336, fill: null, stroke: "#e6c46e", strokeWidth: 1, dash: [2, 9] })),
  ];

  const cover = P(
    bg,
    [
      ...base(),
      peonyAt(110, 120, 330, -20, 1),
      peonyAt(900, 1290, 360, 25, 2),
      peonyAt(910, 118, 220, 30, 3),
      peonyAt(95, 1295, 230, -30, 4),
      cloudAt(168, 392, 200),
      cloudAt(832, 392, 200),
      ...emblemRing,
      lock(O(doubleHappiness(5.5), { cx: W / 2, y: 232, width: 252 })),
      T("TOGETHER WITH THEIR FAMILIES", 556, { x: 150, width: 700, fontFamily: "Jost", fontSize: 17, letterSpacing: 8, fill: SOFT }),
      T("joyfully invite you to celebrate the wedding of", 594, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontSize: 29, fill: CREAM }),
      T("Wei Ming", 640, { x: 150, width: 700, fontFamily: "Playfair Display", fontWeight: 500, fontSize: 92, fill: GOLD, shadow: foil }),
      T("&", 758, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontSize: 56, fill: SOFT }),
      T("Mei Lin", 806, { x: 150, width: 700, fontFamily: "Playfair Display", fontWeight: 500, fontSize: 92, fill: GOLD, shadow: foil }),
      O(lozengeDivider(380), { cx: W / 2, y: 940, width: 380 }),
      T("SATURDAY", 990, { x: 250, width: 500, fontFamily: "Jost", fontSize: 18, letterSpacing: 12, fill: SOFT }),
      T("14 · 06 · 2027", 1022, { x: 200, width: 600, fontFamily: "Cormorant Garamond", fontWeight: 500, fontSize: 64, fill: CREAM }),
      T("at six o'clock in the evening", 1100, { x: 250, width: 500, fontFamily: "Cormorant Garamond", italic: true, fontSize: 27, fill: SOFT }),
      T("JADE PAVILION BANQUET HALL", 1146, { x: 200, width: 600, fontFamily: "Cinzel", fontWeight: 600, fontSize: 24, letterSpacing: 4, fill: GOLD }),
      T("88 Lotus Garden Road, San Francisco", 1188, { x: 250, width: 500, fontFamily: "Jost", fontSize: 17, letterSpacing: 2, fill: SOFT }),
      T(GUEST_TOKEN, 1236, { x: 300, width: 400, fontFamily: "Cormorant Garamond", italic: true, fontSize: 30, letterSpacing: 2, fill: GOLD }),
    ],
    "Invitation",
  );

  const details = P(
    bg,
    [
      ...base(),
      peonyAt(100, 100, 250, -20, 1),
      peonyAt(905, 1300, 280, 25, 2),
      cloudAt(500, 1262, 220),
      lock(S({ shape: "ellipse", x: 420, y: 90, width: 160, height: 160, fill: radial([0, "#c01a26"], [1, "#7c0c1a"]), stroke: GOLD_S, strokeWidth: 3 })),
      lock(O(doubleHappiness(5.5), { cx: W / 2, y: 140, width: 118 })),
      ...wDetails({
        heading: "The Celebration",
        headFont: "Playfair Display",
        headSize: 72,
        headFill: GOLD,
        headWeight: 500,
        labelFont: "Jost",
        labelFill: SOFT,
        strongFont: "Cormorant Garamond",
        strongFill: CREAM,
        strongWeight: 600,
        bodyFont: "Cormorant Garamond",
        bodyFill: SOFT,
        accent: GOLD_S,
        divider: "diamond",
        events: [
          ["Tea Ceremony", "4:00 PM"],
          ["Wedding Ceremony", "5:30 PM"],
          ["Banquet", "6:30 PM"],
        ],
        venue: "Jade Pavilion Banquet Hall",
        address: "88 Lotus Garden Road\nSan Francisco, California",
        dress: ["Dress Code", "Formal  ·  Red and gold welcome"],
        closing: ["With Joy", "May our happiness be doubled with you"],
        y0: 290,
        x: 150,
        width: 700,
        gap: 0.86,
      }),
    ],
    "Details",
  );

  const photo = P(
    bg,
    [
      ...base(),
      peonyAt(100, 100, 270, -20, 1),
      peonyAt(905, 120, 220, 30, 3),
      peonyAt(905, 1300, 290, 25, 2),
      peonyAt(95, 1290, 220, -30, 4),
      lock(S({ shape: "ellipse", x: 222, y: 128, width: 556, height: 556, fill: null, stroke: GOLD_S, strokeWidth: 5 })),
      lock(S({ shape: "ellipse", x: 236, y: 142, width: 528, height: 528, fill: null, stroke: GOLD_S, strokeWidth: 1.5 })),
      I({ x: 250, y: 156, width: 500, height: 500, mask: "ellipse", placeholderFill: "#6f0b17", borderColor: "#e6c46e", borderWidth: 3, name: "Photo" }),
      T("Wei Ming & Mei Lin", 730, { x: 120, width: 760, fontFamily: "Playfair Display", fontWeight: 500, fontSize: 64, fill: GOLD, shadow: foil }),
      O(lozengeDivider(360), { cx: W / 2, y: 830, width: 360 }),
      T("Two families, one joyful celebration.", 880, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontSize: 36, fill: CREAM }),
      T("We are so happy to share this day with you.", 940, { x: 150, width: 700, fontFamily: "Cormorant Garamond", fontSize: 26, fill: SOFT }),
      lock(O(doubleHappiness(6.5), { cx: W / 2, y: 1010, width: 150 })),
      T("14 · 06 · 2027", 1176, { x: 200, width: 600, fontFamily: "Jost", fontSize: 21, letterSpacing: 10, fill: GOLD }),
      cloudAt(500, 1236, 240),
    ],
    "Our Story",
  );

  return {
    slug: "double-happiness-red",
    name: "Double Happiness Red",
    tagline: "Red and gold Chinese wedding invitation with double happiness emblem",
    description:
      "A festive Chinese wedding invitation in lucky red and gold, centred on a hand-built double happiness (xi xi) emblem, gold ruyi clouds and blooming peonies with foil lettering. Perfect for Chinese, tea ceremony, banquet and East Asian weddings.",
    categories: ["cultural", "luxury", "floral", "classic"],
    keywords: ["chinese wedding invitation red and gold", "double happiness wedding card", "peony chinese wedding invite", "tea ceremony banquet invitation", "lunar red gold wedding invitation"],
    palette: ["#8c0f1e", "#b3131f", "#e6c46e", "#fbe9c8", "#f4b3a6"],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
