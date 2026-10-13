import { divider, ticketFrame } from "../design/ornaments";
import { garland, lotusBackdrop, ovalPetalRing, rosette } from "./bengali-alpona.art";
import { GOLD, H, I, linear, lock, O, P, radial, S, T, W, type TemplateDef } from "./kit";
import { sections } from "./premium-details";

const RED = "#8c1322";
const RED_D = "#5f0914";
const IVORY = "#f8eedb";
const GOLDC = "#dcb66b";
const GOLD_D = "#a97a2a";
const INK = "#6d1a22";

const shadow = { color: "#2b0206", blur: 10, offsetX: 0, offsetY: 3, opacity: 0.5 };
const FOIL_D = linear(100, [0, "#8a6224"], [0.3, "#c79a42"], [0.55, "#94682a"], [0.8, "#c99d45"], [1, "#9c7230"]);

/** Dark red ground with soft light, faint lotus backdrop, border and garlands. */
function redGround(): ReturnType<typeof lock>[] {
  return [
    lock(O(lotusBackdrop(IVORY, 960), { cx: W / 2, y: 330, width: 960, opacity: 0.075 })),
    lock(S({ x: -150, y: 250, width: 1300, height: 950, shape: "ellipse", fill: radial([0, "rgba(190,40,52,0.75)"], [0.7, "rgba(140,19,34,0.2)"], [1, "rgba(140,19,34,0)"]) })),
    lock(O(ticketFrame({ w: 888, h: 1288, r: 34, stroke: GOLDC, strokeWidth: 2.4, lines: 2, gap: 11 }), { x: 56, y: 56, width: 888 })),
    lock(O(garland({ color: IVORY, accent: GOLDC }), { x: 60, y: 64, width: 880, flipY: true })),
    lock(O(garland({ color: IVORY, accent: GOLDC }), { x: 60, y: 1400 - 64 - 208, width: 880 })),
  ];
}

export default function build(): TemplateDef {
  const redBg = linear(90, [0, "#7b0e1b"], [0.5, "#951525"], [1, "#690a16"]);
  const creamBg = linear(90, [0, "#f6ead3"], [0.5, "#fbf3e2"], [1, "#f1e2c6"]);
  const x = 190;
  const w = 620;
  const sm = (text: string, y: number, o = {}) =>
    T(text, y, { x, width: w, fontFamily: "Jost", fontSize: 17, fill: GOLDC, letterSpacing: 8, uppercase: true, fontWeight: 500, ...o });

  const cover = P(
    redBg,
    [
      ...redGround(),
      T("শুভ বিবাহ", 226, { x: 160, width: 680, fontFamily: "Tiro Bangla", fontSize: 88, fill: GOLD, lineHeight: 1.3, shadow }),
      T("Dear {to},", 352, { x, width: w, fontFamily: "Cormorant Garamond", italic: true, fontSize: 32, fill: IVORY }),
      sm("Together with their families", 412),
      T("joyfully invite you to the wedding of", 448, { x, width: w, fontFamily: "Cormorant Garamond", italic: true, fontSize: 27, fill: "#ecd9c0" }),
      T("Tanisha", 494, { x: 140, width: 720, fontFamily: "Playfair Display", fontWeight: 500, fontSize: 96, fill: IVORY, shadow }),
      T("&", 606, { x: 140, width: 720, fontFamily: "Cormorant Garamond", italic: true, fontSize: 56, fill: GOLD }),
      T("Arnab", 650, { x: 140, width: 720, fontFamily: "Playfair Display", fontWeight: 500, fontSize: 96, fill: IVORY, shadow }),
      O(divider({ style: "floral", w: 380, color: GOLDC }), { cx: W / 2, y: 806, width: 380 }),
      sm("Sunday", 872, { letterSpacing: 10 }),
      T("05 · 12 · 2027", 906, { x, width: w, fontFamily: "Cormorant Garamond", fontWeight: 500, fontSize: 70, fill: IVORY }),
      T("৫ই ডিসেম্বর ২০২৭  ·  সন্ধ্যা ৭টা", 994, { x, width: w, fontFamily: "Hind Siliguri", fontWeight: 400, fontSize: 26, fill: "#ecd9c0", lineHeight: 1.5 }),
      T("Basanta Bhaban", 1058, { x, width: w, fontFamily: "Cinzel", fontWeight: 500, fontSize: 30, fill: GOLD, letterSpacing: 6, shadow }),
      T("14 Lake Gardens Road, Kolkata", 1108, { x, width: w, fontFamily: "Jost", fontSize: 18, fill: "#ecd9c0", letterSpacing: 2 }),
    ],
    "Invitation",
  );

  const sec = sections(
    [
      { label: "Gaye Holud", strong: "Saturday, 4 Dec · 11:00 AM", after: 56 },
      { label: "Shubho Bibaho", strong: "Sunday, 5 Dec · 7:00 PM", after: 56 },
      { label: "Bou Bhaat", strong: "Monday, 6 Dec · 12:30 PM", after: 54 },
      { label: "Venue", strong: "Basanta Bhaban", body: ["14 Lake Gardens Road", "Kolkata 700045, West Bengal"], after: 46 },
      { label: "Dress Code", body: ["Traditional  ·  saree & panjabi in festive hues"] },
    ],
    {
      x,
      width: w,
      y0: 430,
      label: { font: "Jost", size: 16, fill: GOLD_D, spacing: 8, weight: 500 },
      strong: { font: "Cormorant Garamond", size: 36, fill: RED, weight: 600 },
      body: { font: "Jost", size: 20, fill: INK, weight: 400, lineHeight: 1.55 },
      sep: (y) => O(rosette(RED, GOLD_D, 36), { cx: W / 2, y: y - 6, width: 36, opacity: 0.9 }),
    },
  );

  const details = P(
    creamBg,
    [
      lock(O(lotusBackdrop(RED, 960), { cx: W / 2, y: 330, width: 960, opacity: 0.05 })),
      lock(O(ticketFrame({ w: 888, h: 1288, r: 34, stroke: RED, strokeWidth: 2.2, lines: 2, gap: 11 }), { x: 56, y: 56, width: 888 })),
      lock(O(garland({ color: RED, accent: GOLD_D }), { x: 60, y: 64, width: 880, flipY: true })),
      lock(O(garland({ color: RED, accent: GOLD_D }), { x: 60, y: 1400 - 64 - 208, width: 880 })),
      T("অনুষ্ঠানসূচি", 232, { x: 160, width: 680, fontFamily: "Tiro Bangla", fontSize: 70, fill: RED, lineHeight: 1.3 }),
      T("The Celebrations", 336, { x: 160, width: 680, fontFamily: "Cormorant Garamond", italic: true, fontSize: 32, fill: INK }),
      ...sec.layers,
    ],
    "Details",
  );

  const photo = P(
    redBg,
    [
      ...redGround(),
      lock(O(ovalPetalRing({ rx: 180, ry: 235, color: IVORY, accent: GOLDC }), { cx: W / 2, y: 560 - 235 - 78, width: (180 + 78) * 2 })),
      I({ x: 320, y: 325, width: 360, height: 470, mask: "ellipse", placeholderFill: "#a82234", borderColor: GOLDC, borderWidth: 3 }),
      T("দুটি হৃদয়, একটি পথচলা", 920, { x, width: w, fontFamily: "Tiro Bangla", fontSize: 44, fill: GOLD, lineHeight: 1.4, shadow }),
      T("Your presence and blessings will make our joy complete.", 1020, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontSize: 27, lineHeight: 1.4, fill: IVORY }),
      T("Tanisha & Arnab", 1112, { x, width: w, fontFamily: "Cinzel", fontWeight: 500, fontSize: 30, fill: GOLD, letterSpacing: 7 }),
    ],
    "Blessing",
  );

  return {
    slug: "bengali-alpona",
    name: "Bengali Alpona",
    tagline: "Red and ivory Bengali wedding invitation with alpona motifs",
    description:
      "A warm, festive Bengali wedding invitation inspired by alpona rice-paste art: flowing lotus and vine linework in ivory on auspicious red, finished with gold foil lettering and a Bangla Shubho Bibaho heading.",
    categories: ["indian", "cultural", "floral", "luxury"],
    keywords: ["bengali wedding invitation card", "alpona design wedding card", "red and gold shubho bibaho invitation", "bangla biyer card online"],
    palette: [RED, RED_D, IVORY, GOLDC, "#f6ead3"],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
void FOIL_D;
