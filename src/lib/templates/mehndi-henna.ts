import { archFrame } from "../design/ornaments";
import { eventsLayers } from "./art-utils";
import { HGOLD, hennaMedallion, hennaSideVine, hennaVine, laceBand, ORANGE } from "./mehndi-henna.art";
import { H, I, linear, lock, O, P, radial, S, T, W, type TemplateDef } from "./kit";

const GREEN = "#0f3d2b";
const INK = "#5b4a35";
const SAFFRON = "#b34d12";

export default function build(): TemplateDef {
  const bg = linear(90, [0, "#fdf5e4"], [0.5, "#fbefd6"], [1, "#f6e4c0"]);
  const glow = (cy: number, d: number) =>
    lock(
      S({
        shape: "ellipse",
        x: W / 2 - d / 2,
        y: cy - d / 2,
        width: d,
        height: d,
        fill: radial([0, "rgba(232,150,50,0.38)"], [0.6, "rgba(232,150,50,0.12)"], [1, "rgba(232,150,50,0)"]),
      }),
    );
  const bands = () => [
    lock(O(laceBand(1000, 150), { x: 0, y: 0, width: 1000 })),
    lock(O(laceBand(1000, 150), { x: 0, y: H - 150, width: 1000, flipY: true })),
  ];

  const cover = P(
    bg,
    [
      glow(660, 880),
      ...bands(),
      T("Dear {to},", 178, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontSize: 32, fill: INK }),
      T("मेहंदी की रात", 222, { x: 150, width: 700, fontFamily: "Tiro Devanagari Hindi", fontSize: 92, fill: SAFFRON, lineHeight: 1.1 }),
      T("Mehndi Night  ·  You are invited", 340, { x: 150, width: 700, fontFamily: "Jost", fontWeight: 500, fontSize: 19, fill: GREEN, letterSpacing: 6, uppercase: true }),
      lock(O(hennaMedallion(600), { cx: W / 2, y: 385, width: 600 })),
      T("Priya", 603, { x: 380, width: 240, fontFamily: "Playfair Display", italic: true, fontSize: 50, fill: GREEN, lineHeight: 1 }),
      T("&", 664, { x: 380, width: 240, fontFamily: "Cormorant Garamond", italic: true, fontSize: 38, fill: ORANGE, lineHeight: 1 }),
      T("Arjun", 704, { x: 380, width: 240, fontFamily: "Playfair Display", italic: true, fontSize: 50, fill: GREEN, lineHeight: 1 }),
      T("Friday, 12 March 2027", 1012, { x: 150, width: 700, fontFamily: "Cormorant Garamond", fontWeight: 600, fontSize: 44, fill: GREEN }),
      T("from five o'clock in the evening", 1068, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontSize: 28, fill: INK }),
      O(hennaVine(360), { cx: W / 2, y: 1112, width: 360 }),
      T("The Marigold Courtyard  ·  Jaipur", 1170, { x: 150, width: 700, fontFamily: "Jost", fontWeight: 500, fontSize: 20, fill: SAFFRON, letterSpacing: 5, uppercase: true }),
    ],
    "Invitation",
  );

  const details = P(
    bg,
    [
      glow(700, 900),
      ...bands(),
      lock(O(hennaSideVine(760), { x: 78, y: 320, width: 70 })),
      lock(O(hennaSideVine(760), { x: W - 148, y: 320, width: 70, flipX: true })),
      ...eventsLayers({
        eyebrow: "Join us for",
        heading: "The Celebration",
        headFont: "Playfair Display",
        headItalic: true,
        headSize: 64,
        headFill: GREEN,
        labelFont: "Jost",
        labelFill: SAFFRON,
        strongFont: "Cormorant Garamond",
        strongFill: GREEN,
        strongWeight: 600,
        bodyFont: "Cormorant Garamond",
        bodyFill: INK,
        bodyItalic: true,
        events: [
          { name: "Welcome Drinks", time: "4:30 PM", note: "Chai, lassi and fresh marigold garlands" },
          { name: "Henna Artists Arrive", time: "5:00 PM", note: "Intricate designs for the bride and her circle" },
          { name: "Music, Dholki & Dinner", time: "7:30 PM", note: "Songs, dance and a feast under the lanterns" },
        ],
        venueName: "The Marigold Courtyard",
        address: "14 Haveli Marg, Civil Lines\nJaipur, Rajasthan 302006",
        extras: [["Dress Code", "Festive colours — greens, yellows and oranges"]],
        divider: hennaVine(420),
        dividerW: 380,
        dividerH: 50,
        y0: 200,
        x: 200,
        width: 600,
        eventGap: 132,
        timeSize: 46,
      }),
    ],
    "Details",
  );

  const blessing = P(
    bg,
    [
      glow(630, 900),
      ...bands(),
      lock(O(hennaSideVine(660), { x: 96, y: 310, width: 70 })),
      lock(O(hennaSideVine(660), { x: W - 166, y: 310, width: 70, flipX: true })),
      T("शुभ आशीर्वाद", 188, { x: 150, width: 700, fontFamily: "Tiro Devanagari Hindi", fontSize: 54, fill: SAFFRON }),
      lock(O(archFrame({ w: 560, h: 680, stroke: ORANGE, strokeWidth: 3, lines: 3, gap: 13 }), { x: 220, y: 290, width: 560 })),
      I({ x: 258, y: 328, width: 484, height: 604, mask: "arch", placeholderFill: "#f0cf98", borderColor: HGOLD, borderWidth: 2 }),
      O(hennaVine(380), { cx: W / 2, y: 1000, width: 380 }),
      T("May your days be as bright as henna,\nand your love as lasting.", 1062, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontSize: 34, fill: GREEN, lineHeight: 1.3 }),
      T("Priya  &  Arjun", 1162, { x: 150, width: 700, fontFamily: "Jost", fontWeight: 500, fontSize: 19, fill: SAFFRON, letterSpacing: 8, uppercase: true }),
    ],
    "Blessing",
  );

  return {
    slug: "mehndi-henna",
    name: "Mehndi Henna",
    tagline: "Henna-night invitation with paisley lacework in green and saffron",
    description:
      "A vibrant yet refined mehndi invitation featuring a hand-decorated henna medallion, scalloped lace bands and a Devanagari header, in deep green, saffron, gold and cream.",
    categories: ["indian", "cultural", "luxury"],
    keywords: ["mehndi night invitation card", "henna ceremony invitation", "indian pre-wedding invite"],
    palette: ["#fbf1dc", GREEN, "#d9701c", "#c8962e", "#6b3010"],
    width: W,
    height: H,
    pages: [cover, details, blessing],
  };
}
