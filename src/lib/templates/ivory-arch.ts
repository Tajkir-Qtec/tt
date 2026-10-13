import { archFrame, divider, sprig } from "../design/ornaments";
import { centerRotate } from "../design/layers";
import { detailsLayers } from "./details";
import { H, linear, lock, O, P, T, W, type TemplateDef } from "./kit";

const SAGE = "#8a9a7a";
const DEEP = "#35452f";
const BRONZE = "#b08d57";
const INK = "#6c6b5a";

export default function build(): TemplateDef {
  const bg = linear(90, [0, "#f8f3e9"], [1, "#eee6d6"]);
  const sprigData = sprig({ color: SAGE, length: 330, leaves: 6, leafLen: 58, leafW: 15, curve: 24, berryColor: BRONZE });
  const left = centerRotate(O(sprigData, { x: 0, y: 0, width: 330 }), 150, 1228, -55);
  const right = centerRotate(O(sprigData, { x: 0, y: 0, width: 330, flipX: true }), 850, 1228, 55);

  const cover = P(
    bg,
    [
      lock(O(archFrame({ w: 780, h: 1240, stroke: SAGE, strokeWidth: 2.5, lines: 2, gap: 14 }), { x: 110, y: 80, width: 780 })),
      lock(left),
      lock(right),
      T("Dear {to},", 150, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontSize: 34, fill: INK }),
      T("Together with their families", 222, { x: 200, width: 600, fontFamily: "Jost", fontSize: 19, fill: INK, letterSpacing: 6, uppercase: true }),
      T("invite you to celebrate the wedding of", 262, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontSize: 30, fill: INK }),
      T("Amelia", 320, { x: 160, width: 680, fontFamily: "Pinyon Script", fontSize: 170, fill: DEEP }),
      T("&", 488, { x: 160, width: 680, fontFamily: "Cormorant Garamond", italic: true, fontSize: 74, fill: BRONZE }),
      T("James", 545, { x: 160, width: 680, fontFamily: "Pinyon Script", fontSize: 170, fill: DEEP }),
      O(divider({ style: "diamond", w: 380, color: BRONZE }), { cx: W / 2, y: 790, width: 380 }),
      T("Saturday", 850, { x: 200, width: 600, fontFamily: "Jost", fontSize: 21, fill: INK, letterSpacing: 10, uppercase: true }),
      T("14 · 06 · 2027", 884, { x: 200, width: 600, fontFamily: "Cormorant Garamond", fontWeight: 500, fontSize: 78, fill: DEEP }),
      T("at four o'clock in the afternoon", 984, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontSize: 28, fill: INK }),
      T("Rosewood Gardens", 1050, { x: 200, width: 600, fontFamily: "Cormorant Garamond", fontWeight: 600, fontSize: 36, fill: DEEP, letterSpacing: 6, uppercase: true }),
      T("12 Willow Lane, Napa Valley, California", 1100, { x: 200, width: 600, fontFamily: "Jost", fontSize: 20, fill: INK, letterSpacing: 1 }),
    ],
    "Invitation",
  );

  const details = P(
    bg,
    [
      lock(O(archFrame({ w: 780, h: 1240, stroke: SAGE, strokeWidth: 2.5, lines: 2, gap: 14 }), { x: 110, y: 80, width: 780 })),
      ...detailsLayers({
        heading: "The Day",
        headFont: "Pinyon Script",
        headSize: 108,
        headFill: DEEP,
        bodyFont: "Jost",
        bodyFill: INK,
        strongFont: "Cormorant Garamond",
        strongFill: DEEP,
        labelFill: BRONZE,
        accent: BRONZE,
        y0: 170,
        x: 200,
        width: 600,
        gap: 0.97,
      }),
    ],
    "Details",
  );

  return {
    slug: "ivory-arch",
    name: "Ivory Arch",
    tagline: "Soft botanical wedding invitation with an arched frame",
    description:
      "A calm, modern-classic wedding invitation: an ivory card, a fine double-line arch and hand-drawn olive sprigs, set in elegant script and serif lettering.",
    categories: ["floral", "minimal", "modern"],
    keywords: ["botanical wedding invitation", "arch wedding card", "sage green wedding invitation"],
    palette: ["#f8f3e9", SAGE, DEEP, BRONZE],
    width: W,
    height: H,
    pages: [cover, details],
  };
}
