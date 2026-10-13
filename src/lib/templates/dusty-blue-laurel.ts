import { ticketFrame, wreath } from "../design/ornaments";
import { centerRotate } from "../design/layers";
import type { Layer } from "../design/types";
import { detailsLayers } from "./details";
import { H, I, linear, lock, O, P, radial, S, SILVER, T, W, type TemplateDef } from "./kit";

const SLATE = "#5d7a96";
const DUSTY = "#8ba3bb";
const MIST = "#dfe7ef";
const NAVY = "#2f4257";
const GREY = "#7a8793";
const PAPER = "#fbfcfd";

const bg = () => linear(90, [0, "#fcfdfe"], [0.6, PAPER], [1, "#eef2f6"]);

const rule = (cx: number, y: number, w: number) => lock(S({ x: cx - w / 2, y, width: w, height: 1.6, fill: SILVER }));

function frame(): Layer[] {
  return [
    lock(O(ticketFrame({ w: 880, h: 1300, r: 46, stroke: DUSTY, strokeWidth: 2.4, lines: 2, gap: 12 }), { x: 60, y: 50, width: 880 })),
  ];
}

function wreathArt(cx: number, cy: number, radius: number, leafLen: number): Layer[] {
  const size = radius * 2 + leafLen * 2 + 20;
  const main = wreath({ color: SLATE, radius, leaves: 12, leafLen, leafW: leafLen * 0.27, gap: 26, berryColor: "#b9c4cf", stemWidth: 2.6 });
  const under = wreath({ color: "#aebfd0", radius: radius + 6, leaves: 12, leafLen: leafLen * 0.82, leafW: leafLen * 0.22, gap: 40, stemWidth: 1.6, opacity: 0.6 });
  const wash = S({
    shape: "ellipse",
    x: cx - radius * 1.5,
    y: cy - radius * 1.5,
    width: radius * 3,
    height: radius * 3,
    fill: radial([0, "rgba(168,190,212,0.32)"], [0.6, "rgba(168,190,212,0.12)"], [1, "rgba(168,190,212,0)"]),
  });
  return [
    lock(wash),
    lock(centerRotate(O(under, { x: 0, y: 0, width: (radius + 6) * 2 + leafLen * 0.82 * 2 + 20 }), cx, cy, 8)),
    lock(O(main, { x: cx - size / 2, y: cy - size / 2, width: size })),
  ];
}

export default function build(): TemplateDef {
  const cover: Layer[] = [
    ...frame(),
    ...wreathArt(500, 530, 184, 62),
    T("Dear {to},", 128, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontSize: 32, fill: GREY }),
    T("Together with their families", 196, { x: 200, width: 600, fontFamily: "Montserrat", fontSize: 14, fill: SLATE, letterSpacing: 7, uppercase: true, fontWeight: 500 }),
    T("request the pleasure of your company", 228, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontSize: 27, fill: GREY }),
    T("O", 462, { x: 335, width: 140, fontFamily: "Playfair Display", fontSize: 96, fill: NAVY }),
    T("&", 478, { x: 440, width: 120, fontFamily: "Cormorant Garamond", italic: true, fontSize: 56, fill: DUSTY }),
    T("W", 462, { x: 525, width: 140, fontFamily: "Playfair Display", fontSize: 96, fill: NAVY }),
    T("EST. 2027", 580, { x: 400, width: 200, fontFamily: "Montserrat", fontSize: 12, fill: GREY, letterSpacing: 6, fontWeight: 500 }),
    T("Olivia", 796, { x: 150, width: 700, fontFamily: "Playfair Display", fontSize: 76, fill: NAVY, letterSpacing: 2 }),
    T("and", 892, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontSize: 34, fill: DUSTY }),
    T("William", 932, { x: 150, width: 700, fontFamily: "Playfair Display", fontSize: 76, fill: NAVY, letterSpacing: 2 }),
    rule(500, 1068, 120),
    T("Saturday  ·  September 18, 2027", 1096, { x: 150, width: 700, fontFamily: "Montserrat", fontSize: 18, fill: SLATE, letterSpacing: 6, uppercase: true, fontWeight: 500 }),
    T("at five o'clock in the evening", 1138, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontSize: 28, fill: GREY }),
    T("The Harbour House  ·  Newport, Rhode Island", 1190, { x: 150, width: 700, fontFamily: "Cormorant Garamond", fontWeight: 600, fontSize: 21, fill: NAVY, letterSpacing: 2, uppercase: true }),
  ];

  const details: Layer[] = [
    ...frame(),
    ...detailsLayers({
      heading: "Order of the Day",
      headFont: "Playfair Display",
      headSize: 62,
      headFill: NAVY,
      bodyFont: "Montserrat",
      bodyFill: GREY,
      bodyWeight: 400,
      strongFont: "Cormorant Garamond",
      strongWeight: 600,
      strongFill: NAVY,
      labelFont: "Montserrat",
      labelFill: SLATE,
      labelSize: 15,
      labelSpacing: 7,
      accent: DUSTY,
      divider: "diamond",
      y0: 180,
      x: 200,
      width: 600,
      gap: 0.98,
    }),
  ];

  const photo: Layer[] = [
    ...frame(),
    T("Our Story", 150, { x: 200, width: 600, fontFamily: "Playfair Display", fontSize: 64, fill: NAVY }),
    ...wreathArt(500, 640, 232, 62),
    I({ x: 290, y: 430, width: 420, height: 420, mask: "ellipse", placeholderFill: MIST }),
    T("“Whatever our souls are made of,", 996, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontSize: 34, fill: GREY }),
    T("his and mine are the same.”", 1038, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontSize: 34, fill: GREY }),
    rule(500, 1118, 100),
    T("Olivia & William  ·  18.09.2027", 1148, { x: 200, width: 600, fontFamily: "Montserrat", fontSize: 14, fill: SLATE, letterSpacing: 7, uppercase: true, fontWeight: 500 }),
  ];

  return {
    slug: "dusty-blue-laurel",
    name: "Dusty Blue Laurel",
    tagline: "Classic dusty blue wedding invitation with a laurel wreath monogram",
    description:
      "A calm, traditional-but-fresh wedding invitation in dusty slate blue and silver-grey: a hand-built laurel wreath around your initials, a fine inverted-corner border and Playfair serif lettering.",
    categories: ["classic", "luxury", "minimal"],
    keywords: ["dusty blue wedding invitation", "laurel wreath monogram wedding card", "navy and silver classic invitation"],
    palette: [PAPER, MIST, DUSTY, SLATE, NAVY],
    width: W,
    height: H,
    pages: [P(bg(), cover, "Invitation"), P(bg(), details, "Details"), P(bg(), photo, "Photo")],
  };
}
