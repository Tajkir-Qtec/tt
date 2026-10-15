import { GUEST_TOKEN } from "../design/types";
import type { Layer } from "../design/types";
import { GOLD, H, I, linear, lock, O, P, radial, S, T, W, type TemplateDef } from "./kit";
import { archFrame, decoFrame, divider, heart } from "../design/ornaments";
import { BLUSH, candle, cluster, glow, pg, petals, REDS, rose } from "./valentines-dinner-rose.art";

const BG = radial([0, "#8c1a33"], [0.55, "#5a0d20"], [1, "#2a050f"]);
const BLUSHC = "#f6cbd3";
const CREAM = "#fdeee6";

const bgLayers = (): Layer[] => [
  lock(S({ x: 0, y: 0, width: W, height: H, fill: linear(90, [0, "rgba(255,150,150,0.0)"], [1, "rgba(0,0,0,0.35)"]) })),
  lock(O(decoFrame({ w: 920, h: 1320, cut: 46, stroke: "#d8b565", strokeWidth: 3, lines: 2, gap: 14 }), { x: 40, y: 40 })),
];

export default function build(): TemplateDef {
  /* --------------------------------- cover --------------------------------- */
  const cover = P(
    BG,
    [
      ...bgLayers(),
      pg(cluster(500, 262, 1.4)),
      pg([petals(4, 26, [90, 380, 910, 780], "#d9405f", 18)]),
      T("an evening of candlelight & roses", 478, { fontFamily: "Cormorant Garamond", italic: true, fontSize: 32, fill: BLUSHC, letterSpacing: 2 }),
      T("Valentine's", 520, { x: 60, width: 880, fontFamily: "Great Vibes", fontSize: 200, lineHeight: 1.2, fill: GOLD, shadow: { color: "#000000", blur: 16, offsetX: 0, offsetY: 6, opacity: 0.45 } }),
      T("Dinner", 770, { fontFamily: "Cinzel", fontWeight: 500, fontSize: 84, letterSpacing: 34, uppercase: true, fill: CREAM }),
      lock(O(divider({ style: "floral", w: 420, color: "#e9cf8a", strokeWidth: 2 }), { cx: 500, y: 880 })),
      T("Sunday  ·  14 February 2027", 940, { fontFamily: "Cormorant Garamond", fontWeight: 600, fontSize: 42, letterSpacing: 3, fill: CREAM }),
      T("Seven thirty in the evening", 996, { fontFamily: "Cormorant Garamond", italic: true, fontSize: 32, fill: BLUSHC }),
      T("The Rosewater Room  ·  Gulshan, Dhaka", 1048, { fontFamily: "Cinzel", fontSize: 22, letterSpacing: 5, uppercase: true, fill: "#e9cf8a" }),
      T(GUEST_TOKEN, 1110, { fontFamily: "Great Vibes", fontSize: 58, lineHeight: 1.1, fill: BLUSHC }),
      ...candle(150, 1330, 150, 34),
      ...candle(850, 1330, 150, 34),
      pg(rose(500, 1320, 74, BLUSH, 0.4)),
    ],
    "Invitation",
  );

  /* -------------------------------- details -------------------------------- */
  const course = (y: number, time: string, title: string, sub: string): Layer[] => [
    T(time, y, { x: 90, width: 260, align: "right", fontFamily: "Great Vibes", fontSize: 66, lineHeight: 1.1, fill: GOLD }),
    lock(O(heart({ color: "#e9cf8a", size: 36 }), { cx: 400, y: y + 20 })),
    T(title, y + 4, { x: 440, width: 480, align: "left", fontFamily: "Cinzel", fontWeight: 600, fontSize: 31, letterSpacing: 3, uppercase: true, fill: CREAM }),
    T(sub, y + 50, { x: 440, width: 480, align: "left", fontFamily: "Cormorant Garamond", italic: true, fontSize: 29, fill: BLUSHC }),
  ];
  const details = P(
    BG,
    [
      ...bgLayers(),
      pg([...rose(120, 80, 70, BLUSH, 1), ...rose(880, 80, 70, BLUSH, 2)]),
      T("The evening", 150, { fontFamily: "Great Vibes", fontSize: 130, lineHeight: 1.2, fill: GOLD }),
      T("a menu of moments", 318, { fontFamily: "Cinzel", fontSize: 24, letterSpacing: 10, uppercase: true, fill: BLUSHC }),
      lock(O(divider({ style: "diamond", w: 460, color: "#e9cf8a", strokeWidth: 2 }), { cx: 500, y: 380 })),
      ...course(450, "7:30", "Welcome", "Champagne and a single red rose"),
      ...course(600, "8:00", "Candlelit Dinner", "Five courses, plated for two"),
      ...course(750, "9:30", "Sweet Finish", "Chocolate, berries and slow music"),
      ...course(900, "10:30", "Last Dance", "Take home a rose, and the memory"),
      lock(S({ x: 140, y: 1040, width: 720, height: 2, fill: GOLD })),
      T("Dress in red, blush or black", 1075, { fontFamily: "Cormorant Garamond", fontWeight: 600, fontSize: 38, fill: CREAM }),
      T("Couples and sweethearts welcome", 1130, { fontFamily: "Cormorant Garamond", italic: true, fontSize: 32, fill: BLUSHC }),
      ...candle(170, 1330, 120, 28),
      ...candle(830, 1330, 120, 28),
      pg(rose(500, 1330, 56, REDS, 0.3)),
    ],
    "Details",
  );

  /* ------------------------------ photo page ------------------------------ */
  const photo = P(
    BG,
    [
      ...bgLayers(),
      glow(500, 640, 420, "rgba(255,120,140,0.28)"),
      pg(cluster(500, 130, 0.95)),
      T("Be my valentine", 320, { fontFamily: "Great Vibes", fontSize: 108, lineHeight: 1.2, fill: GOLD }),
      I({ x: 290, y: 490, width: 420, height: 560, mask: "arch", placeholderFill: "#a13050" }),
      lock(O(archFrame({ w: 460, h: 600, stroke: "#e9cf8a", strokeWidth: 4, lines: 2, gap: 12 }), { x: 270, y: 470 })),
      T("Every love story deserves a table by candlelight.", 1130, { x: 140, width: 720, fontFamily: "Cormorant Garamond", italic: true, fontSize: 36, lineHeight: 1.3, fill: CREAM }),
      T("Come, share the evening with us.", 1240, { fontFamily: "Great Vibes", fontSize: 58, lineHeight: 1.2, fill: BLUSHC }),
      pg([petals(9, 9, [70, 450, 250, 1060], "#d9405f", 18), petals(5, 9, [750, 450, 930, 1060], "#d9405f", 18)]),
    ],
    "Photo",
  );

  return {
    slug: "valentines-dinner-rose",
    name: "Valentine's Dinner Rose",
    tagline: "Romantic red and blush Valentine's dinner invitation with roses and candlelight",
    description:
      "A romantic Valentine's Day dinner invitation in deep burgundy and blush, with hand-built layered roses, glowing candles, gold foil script and a three-page menu of moments. Perfect for couples' dinners, date nights and anniversary-style evenings.",
    categories: ["holiday", "party", "engagement"],
    keywords: ["valentines day dinner invitation", "romantic candlelight dinner invite", "red rose valentine party card", "date night invitation template", "burgundy and gold valentine invite", "online valentines dinner party invitation"],
    palette: ["#5a0d20", "#c42a4c", "#f6cbd3", "#e9cf8a", "#fdeee6"],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
