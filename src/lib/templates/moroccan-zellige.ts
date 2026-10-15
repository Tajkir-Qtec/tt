import { archFrame } from "../design/ornaments";
import { GUEST_TOKEN } from "../design/types";
import type { Layer } from "../design/types";
import { BRASS, BRASS_FOIL, COBALT, CREAM, horseshoeArch, rosette, starLattice, TEAL, zelligeDivider, zelligeFrame } from "./moroccan-zellige.art";
import { wDetails } from "./wedding-details";
import { H, I, linear, lock, O, P, radial, S, T, W, type TemplateDef } from "./kit";

const INK = "#3a4a5f";
const NAVY = "#14305e";
const bg = linear(90, [0, "#f3ead6"], [0.5, "#f8f2e4"], [1, "#f1e7d0"]);

const IVORY = linear(90, [0, "#fdfaf1"], [0.5, "#fffdf7"], [1, "#fbf6e8"]);

function base(): Layer[] {
  return [
    lock(O(starLattice(W, H, 80), { x: 0, y: 0, width: W })),
    lock(S({ shape: "ellipse", x: -200, y: 200, width: 1400, height: 1000, fill: radial([0, "rgba(14,111,116,0.10)"], [1, "rgba(14,111,116,0)"]) })),
    lock(O(zelligeFrame(W, H, 50, 2), { x: 0, y: 0, width: W })),
  ];
}

const arch = (): Layer[] => [
  lock(
    O(
      horseshoeArch(660, 1100, [
        { k: 0, stroke: BRASS, width: 6, fill: IVORY },
        { k: 11, stroke: COBALT, width: 9 },
        { k: 21, stroke: TEAL, width: 3 },
        { k: 29, stroke: "#d9b86a", width: 1.4 },
      ]),
      { x: 170, y: 150, width: 660 },
    ),
  ),
];

export default function moroccanZellige(): TemplateDef {
  const cover = P(
    bg,
    [
      ...base(),
      ...arch(),
      lock(O(rosette(116), { cx: W / 2, y: 196, width: 116 })),
      T("TOGETHER WITH THEIR FAMILIES", 346, { x: 220, width: 560, fontFamily: "Jost", fontSize: 16, letterSpacing: 7, fill: TEAL }),
      T("invite you to the wedding celebration of", 384, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontSize: 27, fill: INK }),
      T("Layla", 424, { x: 200, width: 600, fontFamily: "Great Vibes", fontSize: 160, fill: NAVY }),
      T("&", 590, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontSize: 58, fill: BRASS }),
      T("Omar", 626, { x: 200, width: 600, fontFamily: "Great Vibes", fontSize: 160, fill: NAVY }),
      O(zelligeDivider(380), { cx: W / 2, y: 806, width: 380 }),
      T("SATURDAY", 872, { x: 200, width: 600, fontFamily: "Jost", fontSize: 18, letterSpacing: 12, fill: TEAL }),
      T("14 · 06 · 2027", 904, { x: 200, width: 600, fontFamily: "Cinzel", fontWeight: 500, fontSize: 54, fill: BRASS_FOIL }),
      T("at seven o'clock in the evening", 978, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontSize: 26, fill: INK }),
      T("DAR AL BAHIA GARDENS", 1026, { x: 200, width: 600, fontFamily: "Cinzel", fontWeight: 600, fontSize: 28, letterSpacing: 4, fill: COBALT }),
      T("Palmeraie District, Marrakech", 1070, { x: 200, width: 600, fontFamily: "Jost", fontSize: 18, letterSpacing: 2, fill: INK }),
      T(GUEST_TOKEN, 1126, { x: 280, width: 440, fontFamily: "Cormorant Garamond", italic: true, fontSize: 30, letterSpacing: 1, fill: TEAL }),
    ],
    "Invitation",
  );

  const details = P(
    bg,
    [
      ...base(),
      ...arch(),
      lock(O(rosette(80), { cx: W / 2, y: 192, width: 80 })),
      ...wDetails({
        heading: "The Celebration",
        headFont: "Great Vibes",
        headSize: 92,
        headFill: NAVY,
        labelFont: "Jost",
        labelFill: TEAL,
        strongFont: "Cinzel",
        strongFill: COBALT,
        strongWeight: 500,
        bodyFont: "Cormorant Garamond",
        bodyFill: INK,
        accent: BRASS,
        divider: "diamond",
        events: [
          ["Ceremony", "7:00 PM"],
          ["Mint Tea Reception", "8:00 PM"],
          ["Dinner & Dancing", "9:00 PM"],
        ],
        venue: "Dar Al Bahia Gardens",
        address: "Palmeraie District\nMarrakech, Morocco",
        dress: ["Dress Code", "Festive  ·  Jewel tones"],
        closing: ["With Joy", "Share this beautiful evening with us"],
        y0: 304,
        x: 230,
        width: 540,
        gap: 0.81,
      }),
    ],
    "Details",
  );

  const photo = P(
    bg,
    [
      ...base(),
      ...arch(),
      lock(O(rosette(88), { cx: W / 2, y: 196, width: 88 })),
      lock(O(archFrame({ w: 470, h: 570, stroke: BRASS, strokeWidth: 4, lines: 3, gap: 9 }), { x: 265, y: 308, width: 470 })),
      I({ x: 290, y: 333, width: 420, height: 520, mask: "arch", placeholderFill: "#e3dcc6", name: "Photo" }),
      T("Layla & Omar", 910, { x: 180, width: 640, fontFamily: "Great Vibes", fontSize: 78, fill: NAVY }),
      T("Two hearts, one beautiful journey.", 1010, { x: 220, width: 560, fontFamily: "Cormorant Garamond", italic: true, fontSize: 29, fill: INK }),
      T("14 · 06 · 2027", 1062, { x: 220, width: 560, fontFamily: "Cinzel", fontSize: 22, letterSpacing: 10, fill: TEAL }),
      O(zelligeDivider(320), { cx: W / 2, y: 1130, width: 320 }),
    ],
    "Our Story",
  );

  return {
    slug: "moroccan-zellige",
    name: "Moroccan Zellige",
    tagline: "Moroccan zellige tile and horseshoe arch wedding invitation",
    description:
      "An exotic Moroccan and Andalusian wedding invitation framed by a hand-built zellige tile border in teal, cobalt and brass, with a Moorish horseshoe arch window and eight-pointed khatam rosettes on cream. Ideal for destination, Marrakech, Arabic, Mediterranean and cultural weddings.",
    categories: ["cultural", "geometric", "luxury", "islamic"],
    keywords: ["moroccan wedding invitation", "zellige tile wedding card", "marrakech destination wedding invite", "moorish arch wedding invitation", "teal and gold arabic wedding card"],
    palette: [CREAM, TEAL, COBALT, BRASS, "#14305e"],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
