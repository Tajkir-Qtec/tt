import { archFrame, divider, star } from "../design/ornaments";
import type { Layer } from "../design/types";
import { cornerStuds, goldFrame, marbleVeins } from "./marble-gold.art";
import { wDetails } from "./wedding-details";
import { GOLD, H, I, linear, lock, O, P, radial, S, T, W, type TemplateDef } from "./kit";

const INK = "#2f3036";
const SOFT = "#5d5f68";
const GILT = "#b08a3c";

function marbleBase(seed: number, density = 1): Layer[] {
  const cloud = (x: number, y: number, w: number, h: number, rgb: string, a: number, rot = 0) =>
    lock(
      S({
        shape: "ellipse",
        x,
        y,
        width: w,
        height: h,
        rotation: rot,
        fill: radial([0, `rgba(${rgb},${a})`], [0.55, `rgba(${rgb},${a * 0.25})`], [1, `rgba(${rgb},0)`]),
      }),
    );
  return [
    cloud(-200, -150, 900, 700, "150,156,168", 0.22, 20),
    cloud(450, 500, 800, 600, "170,175,186", 0.2, -25),
    cloud(-150, 950, 800, 650, "140,146,160", 0.2, 15),
    cloud(380, -100, 700, 400, "255,255,255", 0.7, 0),
    lock(O(marbleVeins(seed, density), { x: 0, y: 0, width: W, height: H })),
  ];
}

const calm = () =>
  lock(
    S({
      shape: "ellipse",
      x: 40,
      y: 80,
      width: 920,
      height: 1240,
      fill: radial([0, "rgba(252,252,251,0.92)"], [0.62, "rgba(250,250,249,0.78)"], [1, "rgba(250,250,249,0)"]),
    }),
  );

const frame = (): Layer[] => [lock(O(goldFrame(46, 15, 46), { x: 0, y: 0, width: W })), lock(O(cornerStuds(46, 15), { x: 0, y: 0, width: W }))];

export default function build(): TemplateDef {
  const bg = linear(115, [0, "#fbfbfa"], [0.45, "#eeeff1"], [1, "#e4e5e9"]);
  const foilShadow = { color: "#6b5220", blur: 6, offsetX: 0, offsetY: 3, opacity: 0.25 };

  const cover = P(
    bg,
    [
      ...marbleBase(7),
      calm(),
      ...frame(),
      T("Dear {to},", 172, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontSize: 34, fill: SOFT }),
      T("Together with their families", 244, { x: 200, width: 600, fontFamily: "Cinzel", fontSize: 18, letterSpacing: 7, uppercase: true, fill: SOFT }),
      T("request the honour of your presence\nat the marriage of", 290, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontSize: 30, lineHeight: 1.3, fill: SOFT }),
      O(star({ color: GILT, size: 22, points: 4, inner: 0.35 }), { cx: W / 2, y: 377, width: 22 }),
      T("Isabella", 417, { x: 120, width: 760, fontFamily: "Bodoni Moda", fontWeight: 500, fontSize: 124, fill: GOLD, letterSpacing: 2, shadow: foilShadow }),
      T("&", 567, { x: 120, width: 760, fontFamily: "Cormorant Garamond", italic: true, fontSize: 72, fill: GILT }),
      T("Alexander", 642, { x: 120, width: 760, fontFamily: "Bodoni Moda", fontWeight: 500, fontSize: 124, fill: GOLD, letterSpacing: 2, shadow: foilShadow }),
      O(divider({ style: "diamond", w: 400, color: GILT }), { cx: W / 2, y: 832, width: 400 }),
      T("Saturday", 900, { x: 200, width: 600, fontFamily: "Cinzel", fontSize: 21, letterSpacing: 12, uppercase: true, fill: SOFT }),
      T("20 · 11 · 2027", 938, { x: 200, width: 600, fontFamily: "Bodoni Moda", fontWeight: 500, fontSize: 70, fill: INK }),
      T("at half past five in the evening", 1032, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontSize: 30, fill: SOFT }),
      T("The Aurelian Hall", 1098, { x: 200, width: 600, fontFamily: "Cinzel", fontWeight: 600, fontSize: 34, letterSpacing: 6, uppercase: true, fill: INK }),
      T("48 Marlowe Terrace, Lake Como, Italy", 1150, { x: 200, width: 600, fontFamily: "Cormorant Garamond", fontWeight: 500, fontSize: 25, letterSpacing: 2, fill: SOFT }),
    ],
    "Invitation",
  );

  const details = P(
    bg,
    [
      ...marbleBase(21, 0.8),
      calm(),
      ...frame(),
      ...wDetails({
        heading: "The Celebration",
        headFont: "Bodoni Moda",
        headSize: 72,
        headFill: GOLD,
        headWeight: 500,
        labelFont: "Cinzel",
        labelFill: GILT,
        strongFont: "Bodoni Moda",
        strongFill: INK,
        bodyFont: "Cormorant Garamond",
        bodyFill: SOFT,
        accent: GILT,
        divider: "diamond",
        events: [
          ["Ceremony", "5:30 PM"],
          ["Champagne Reception", "6:30 PM"],
          ["Dinner & Dancing", "8:00 PM"],
        ],
        venue: "The Aurelian Hall",
        address: "48 Marlowe Terrace, Lake Como\nItaly 22021",
        dress: ["Dress Code", "Black tie  ·  Evening gowns"],
        closing: ["Your Presence", "is the only gift we wish for"],
        y0: 185,
        gap: 0.95,
      }),
    ],
    "Details",
  );

  const photo = P(
    bg,
    [
      ...marbleBase(33, 0.9),
      calm(),
      ...frame(),
      lock(O(archFrame({ w: 520, h: 700, stroke: "#c9a452", strokeWidth: 2.5, lines: 2, gap: 12 }), { x: 240, y: 160, width: 520 })),
      I({ x: 262, y: 200, width: 476, height: 650, mask: "arch", placeholderFill: "#e6e3dd", borderColor: "#c9a452", borderWidth: 3, name: "Photo" }),
      T("Isabella & Alexander", 905, { x: 150, width: 700, fontFamily: "Bodoni Moda", fontWeight: 500, fontSize: 56, fill: GOLD }),
      O(divider({ style: "diamond", w: 340, color: GILT }), { cx: W / 2, y: 990, width: 340 }),
      T("Two souls, one beautiful beginning.", 1060, { x: 180, width: 640, fontFamily: "Cormorant Garamond", italic: true, fontSize: 36, fill: INK }),
      T("We cannot wait to celebrate\nthis day with the people we love most.", 1125, { x: 180, width: 640, fontFamily: "Cormorant Garamond", fontSize: 26, lineHeight: 1.45, fill: SOFT }),
      T("20 · 11 · 2027", 1230, { x: 200, width: 600, fontFamily: "Cinzel", fontSize: 22, letterSpacing: 10, fill: GILT }),
    ],
    "Our Story",
  );

  return {
    slug: "marble-gold",
    name: "Marble & Gold",
    tagline: "Luxury white marble wedding invitation with gold foil veins",
    description:
      "A refined white-marble invitation with hand-drawn gold veining, a thick chamfered gold border and foil lettering in Bodoni and Cinzel. Grey, ivory and metallic gold.",
    categories: ["luxury", "classic", "modern"],
    keywords: ["white marble wedding invitation", "gold foil wedding card", "luxury black tie invitation", "marble and gold wedding invite"],
    palette: ["#fbfbfa", "#e4e5e9", "#b08a3c", "#2f3036", "#c9a452"],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
