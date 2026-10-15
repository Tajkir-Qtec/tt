import { divider } from "../design/ornaments";
import { GUEST_TOKEN } from "../design/types";
import type { Layer, Paint } from "../design/types";
import { GOLD, H, I, linear, lock, O, P, S, T, W, type TemplateDef } from "./kit";
import { place, ringSwag, swag } from "./eucalyptus-greenery-wedding.art";

/** Fresh eucalyptus & olive greenery garland on white, with gold script. */

const BG: Paint = linear(180, [0, "#fffefb"], [0.6, "#f9faf4"], [1, "#eef2e8"]);
const INK = "#3d5247";
const SAGE = "#6f8f7e";
const GILT = "#b8903f";
const wash = (cx: number, cy: number, rx: number, ry: number, rgb: string, a: number): Layer =>
  lock(S({ shape: "ellipse", x: cx - rx, y: cy - ry, width: rx * 2, height: ry * 2, fill: { kind: "radial", stops: [[0, `rgba(${rgb},${a})`], [1, `rgba(${rgb},0)`]] } }));
const frame = (): Layer[] => [
  lock(S({ x: 52, y: 52, width: 896, height: 1296, fill: null, stroke: "#cdb270", strokeWidth: 1.8 })),
  lock(S({ x: 64, y: 64, width: 872, height: 1272, fill: null, stroke: "#cdb270", strokeWidth: 0.9, opacity: 0.8 })),
];
const rule = (y: number, w = 220): Layer => lock(O(divider({ style: "leaf", w, color: GILT, strokeWidth: 1.8 }), { cx: W / 2, y }));
const cap = (text: string, y: number, o: Partial<Parameters<typeof T>[2]> = {}) =>
  T(text, y, { fontFamily: "Cinzel", fontSize: 17, letterSpacing: 7, uppercase: true, fill: INK, ...o });

export default function build(): TemplateDef {
  /* --------------------------------- cover --------------------------------- */
  const cover = P(
    BG,
    [
      wash(120, 160, 420, 360, "158,190,168", 0.35),
      wash(900, 1220, 460, 380, "158,190,168", 0.35),
      ...frame(),
      place(swag([-40, 70], [500, 330], [1040, 70], { seed: 3, n: 24 }), 2),
      place(swag([20, 130], [130, 440], [40, 780], { seed: 7, n: 11, scale: 0.9 }), 2),
      place(swag([980, 130], [870, 440], [960, 780], { seed: 11, n: 11, scale: 0.9 }), 2),
      place(swag([-30, 1290], [190, 1230], [360, 1430], { seed: 15, n: 9 }), 2),
      place(swag([1030, 1290], [810, 1230], [640, 1430], { seed: 19, n: 9 }), 2),
      cap("together with their families", 350, { x: 250, width: 500, fontSize: 16 }),
      T("Eleanor", 392, { x: 100, width: 800, fontFamily: "Great Vibes", fontSize: 168, lineHeight: 1.05, fill: GOLD }),
      T("and", 556, { x: 350, width: 300, fontFamily: "Cormorant Garamond", italic: true, fontSize: 44, fill: SAGE }),
      T("Benjamin", 592, { x: 100, width: 800, fontFamily: "Great Vibes", fontSize: 168, lineHeight: 1.05, fill: GOLD }),
      rule(790, 260),
      T("invite you to celebrate their marriage", 818, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontSize: 36, fill: INK }),
      cap("Saturday  ·  8 May 2027", 890, { x: 200, width: 600, fontWeight: 600, fontSize: 22 }),
      T("at four o'clock in the afternoon", 934, { x: 200, width: 600, fontFamily: "Cormorant Garamond", fontSize: 30, fill: INK }),
      cap("The Orangery at Hartwell House", 1010, { x: 150, width: 700, fontWeight: 600, fontSize: 20, letterSpacing: 5, fill: SAGE }),
      T("Aylesbury, Buckinghamshire", 1048, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontSize: 30, fill: INK }),
      T(GUEST_TOKEN, 1108, { x: 250, width: 500, fontFamily: "Great Vibes", fontSize: 60, lineHeight: 1.1, fill: GOLD }),
    ],
    "Invitation",
  );

  /* -------------------------------- schedule -------------------------------- */
  const items: [string, string, string][] = [
    ["3:30 PM", "Guests Arrive", "Welcome drinks and lemonade in the garden"],
    ["4:00 PM", "The Ceremony", "Exchange of vows beneath the greenery arch"],
    ["5:00 PM", "Canapés & Cocktails", "Mingle on the terrace while we take photographs"],
    ["6:30 PM", "Wedding Breakfast", "A seasonal three-course feast, then speeches and dancing"],
  ];
  const rows: Layer[] = [];
  items.forEach(([time, title, desc], i) => {
    const y = 466 + i * 166;
    rows.push(
      cap(time, y, { x: 200, width: 600, fontSize: 20, letterSpacing: 10, fontWeight: 600, fill: SAGE }),
      T(title, y + 34, { x: 100, width: 800, fontFamily: "Great Vibes", fontSize: 66, lineHeight: 1.1, fill: GOLD }),
      T(desc, y + 98, { x: 130, width: 740, fontFamily: "Cormorant Garamond", italic: true, fontSize: 28, fill: INK }),
    );
    if (i < items.length - 1) rows.push(rule(y + 136, 110));
  });
  const details = P(
    BG,
    [
      wash(880, 130, 420, 300, "158,190,168", 0.35),
      wash(130, 1260, 440, 340, "158,190,168", 0.35),
      ...frame(),
      place(swag([-40, 60], [500, 200], [1040, 60], { seed: 21, n: 18, scale: 0.85 }), 2),
      place(swag([-30, 1330], [500, 1250], [1030, 1340], { seed: 25, n: 18, scale: 0.85 }), 2),
      cap("the wedding of Eleanor & Benjamin", 296, { x: 150, width: 700, fontSize: 16, fill: SAGE }),
      T("Order of the Day", 326, { x: 100, width: 800, fontFamily: "Great Vibes", fontSize: 100, lineHeight: 1.05, fill: GOLD }),
      rule(436, 260),
      ...rows,
      cap("Dress code", 1146, { x: 200, width: 600, fontSize: 16, letterSpacing: 10, fill: SAGE }),
      T("Garden party elegance in soft, natural tones", 1180, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontSize: 32, fill: INK }),
    ],
    "Schedule",
  );

  /* --------------------------------- photo --------------------------------- */
  const photo = P(
    BG,
    [
      wash(500, 560, 520, 520, "158,190,168", 0.3),
      ...frame(),
      lock(S({ shape: "ellipse", x: 500 - 252, y: 560 - 312, width: 504, height: 624, fill: null, stroke: "#cdb270", strokeWidth: 2 })),
      I({ x: 500 - 242, y: 560 - 302, width: 484, height: 604, mask: "ellipse", placeholderFill: "#dfe6da" }),
      place(ringSwag(500, 560, 288, 346, { seed: 31, n: 54, from: 100, to: 440, scale: 0.8, spread: 50 }), 2),
      T("Love grows where", 986, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontSize: 44, fill: INK }),
      T("kindness and laughter blossom", 1036, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontSize: 44, fill: INK }),
      rule(1092, 240),
      T("Eleanor & Benjamin", 1126, { x: 100, width: 800, fontFamily: "Great Vibes", fontSize: 86, lineHeight: 1.1, fill: GOLD }),
      cap("8 . 5 . 2027", 1240, { x: 300, width: 400, fontSize: 18, letterSpacing: 9, fill: SAGE }),
    ],
    "Message",
  );

  return {
    slug: "eucalyptus-greenery-wedding",
    name: "Eucalyptus Greenery Wedding",
    tagline: "Fresh eucalyptus and olive greenery wedding invitation with gold script",
    description:
      "A fresh greenery wedding invitation with hand-built eucalyptus, olive and willow garlands swagged across white, finished with gold foil script. Perfect for garden, orangery, spring and summer weddings.",
    categories: ["nature", "floral", "classic"],
    keywords: ["eucalyptus greenery wedding invitation", "olive branch garland wedding invite", "sage green and gold wedding card", "botanical garden wedding invitation template", "white and green wedding invitation online", "spring greenery wedding invite"],
    palette: ["#fffefb", "#8fae9d", "#6f8f7e", "#b8903f", "#3d5247"],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
