import { GUEST_TOKEN } from "../design/types";
import type { Layer } from "../design/types";
import { wDetails } from "./wedding-details";
import { beams, CH, CHAMP, chevronBand, decoDivider, fan, scalePattern, steppedFrame } from "./art-deco-champagne.art";
import { H, I, linear, lock, O, P, radial, S, T, W, type TemplateDef } from "./kit";

const IVORY = "#f4ead0";
const MUTE = "#b9aa83";
const BG = linear(90, [0, "#08080a"], [0.5, "#121013"], [1, "#0a0a0c"]);
const foil = { color: "#000000", blur: 10, offsetX: 0, offsetY: 4, opacity: 0.6 };

function base(): Layer[] {
  return [
    lock(O(scalePattern(W, H, 36), { x: 0, y: 0, width: W })),
    lock(S({ shape: "ellipse", x: -100, y: -200, width: 1200, height: 1000, fill: radial([0, "rgba(216,193,138,0.16)"], [0.6, "rgba(216,193,138,0.04)"], [1, "rgba(216,193,138,0)"]) })),
    lock(O(steppedFrame(920, 1320, 16, 3, 11), { x: 40, y: 40, width: 920 })),
  ];
}
const studs = (): Layer[] =>
  [[80, 80], [920, 80], [80, 1320], [920, 1320]].map(([x, y]) =>
    lock(S({ shape: "rect", x: x - 6, y: y - 6, width: 12, height: 12, rotation: 45, fill: CHAMP })),
  );

export default function artDecoChampagne(): TemplateDef {
  const cover = P(
    BG,
    [
      ...base(),
      lock(O(beams(W, 560, 500, 560, 30), { x: 0, y: 0, width: W })),
      ...studs(),
      lock(O(fan(250, 15), { cx: W / 2, y: 78, width: 508 })),
      T("TOGETHER WITH THEIR FAMILIES", 372, { x: 150, width: 700, fontFamily: "Jost", fontSize: 18, letterSpacing: 9, fill: CH }),
      T("request the pleasure of your company\nat the wedding of", 414, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontSize: 30, lineHeight: 1.25, fill: IVORY }),
      T("Eleanor", 500, { x: 80, width: 840, fontFamily: "Limelight", fontSize: 128, fill: CHAMP, shadow: foil }),
      T("&", 650, { x: 80, width: 840, fontFamily: "Cormorant Garamond", italic: true, fontSize: 70, fill: CH }),
      T("Theodore", 714, { x: 80, width: 840, fontFamily: "Limelight", fontSize: 128, fill: CHAMP, shadow: foil }),
      O(decoDivider(440), { cx: W / 2, y: 886, width: 440 }),
      T("SATURDAY", 948, { x: 200, width: 600, fontFamily: "Jost", fontSize: 20, letterSpacing: 14, fill: CH }),
      T("14 · 06 · 2027", 984, { x: 150, width: 700, fontFamily: "Cinzel", fontWeight: 500, fontSize: 62, letterSpacing: 4, fill: IVORY }),
      T("at seven o'clock in the evening", 1072, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontSize: 28, fill: MUTE }),
      T("THE GRAND RIVIERA BALLROOM", 1124, { x: 120, width: 760, fontFamily: "Cinzel", fontWeight: 600, fontSize: 28, letterSpacing: 5, fill: CHAMP }),
      T("One Mercer Avenue, New York", 1168, { x: 200, width: 600, fontFamily: "Jost", fontWeight: 300, fontSize: 20, letterSpacing: 3, fill: MUTE }),
      T(GUEST_TOKEN, 1222, { x: 250, width: 500, fontFamily: "Cormorant Garamond", italic: true, fontSize: 30, letterSpacing: 2, fill: CHAMP }),
      lock(O(chevronBand(560, 40, 14), { cx: W / 2, y: 1272, width: 560 })),
    ],
    "Invitation",
  );

  const details = P(
    BG,
    [
      ...base(),
      ...studs(),
      lock(O(fan(120, 11), { cx: W / 2, y: 84, width: 248 })),
      ...wDetails({
        heading: "The Celebration",
        headFont: "Limelight",
        headSize: 72,
        headFill: CHAMP,
        labelFont: "Jost",
        labelFill: CH,
        labelSpacing: 10,
        strongFont: "Cinzel",
        strongFill: IVORY,
        bodyFont: "Cormorant Garamond",
        bodyFill: MUTE,
        accent: CH,
        divider: "diamond",
        events: [
          ["Ceremony", "7:00 PM"],
          ["Champagne Toast", "8:00 PM"],
          ["Dinner & Dancing", "9:00 PM"],
        ],
        venue: "The Riviera Ballroom",
        address: "One Mercer Avenue, New York\nNew York 10012",
        dress: ["Dress Code", "Black tie  ·  Gatsby glamour"],
        closing: ["Your Presence", "is the only gift we wish for"],
        y0: 240,
        x: 160,
        width: 680,
      }),
    ],
    "Details",
  );

  const photo = P(
    BG,
    [
      ...base(),
      ...studs(),
      lock(O(steppedFrame(580, 700, 22, 3, 12), { cx: W / 2, y: 120, width: 580 })),
      I({ x: 250, y: 162, width: 500, height: 616, mask: "rect", placeholderFill: "#2a2620", name: "Photo" }),
      O(decoDivider(380), { cx: W / 2, y: 868, width: 380 }),
      T("Eleanor & Theodore", 950, { x: 100, width: 800, fontFamily: "Limelight", fontSize: 62, fill: CHAMP, shadow: foil }),
      T("Two hearts, one grand beginning.", 1042, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontSize: 38, fill: IVORY }),
      T("We cannot wait to celebrate\nthis glittering night with you.", 1104, { x: 150, width: 700, fontFamily: "Cormorant Garamond", fontSize: 27, lineHeight: 1.45, fill: MUTE }),
      T("14 · 06 · 2027", 1204, { x: 200, width: 600, fontFamily: "Cinzel", fontSize: 22, letterSpacing: 10, fill: CH }),
      lock(O(chevronBand(560, 40, 14), { cx: W / 2, y: 1262, width: 560 })),
    ],
    "Our Story",
  );

  return {
    slug: "art-deco-champagne",
    name: "Art Deco Champagne",
    tagline: "Great Gatsby black and champagne Art Deco wedding invitation",
    description:
      "A glamorous 1920s Art Deco wedding invitation in black and champagne gold: radiating sunburst fan, stepped geometric frames, fish-scale pattern and high-contrast Limelight and Cinzel lettering. Ideal for black-tie, Great Gatsby and roaring twenties weddings.",
    categories: ["luxury", "geometric", "dark", "vintage"],
    keywords: ["great gatsby wedding invitation", "art deco wedding invitation black and gold", "roaring twenties wedding card", "champagne gold black tie invitation", "1920s themed wedding invite"],
    palette: ["#08080a", "#121013", "#d8c18a", "#f3e6bf", "#f4ead0"],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
