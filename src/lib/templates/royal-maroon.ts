import { archFrame, divider, mandala, paisley, scallops } from "../design/ornaments";
import { centerRotate } from "../design/layers";
import { GOLD, H, I, linear, lock, O, P, radial, S, T, W, type TemplateDef } from "./kit";
import { sections } from "./premium-details";

const MAROON = "#5c0f22";
const DEEP = "#3b0715";
const WINE = "#7b1a31";
const GOLDC = "#d9b36a";
const CREAM = "#f5e6c8";
const MUTED = "#e2c9b4";

const shadow = { color: "#1a0008", blur: 10, offsetX: 0, offsetY: 3, opacity: 0.6 };

function backdrop(watermarkY = 640) {
  const pais = (size: number, x: number, y: number, rot: number, flip: boolean, op = 0.9) =>
    lock(
      centerRotate(
        O(paisley({ color: GOLDC, stroke: GOLDC, fillColor: WINE, strokeWidth: 3, size }), { x, y, width: size * 0.95, flipX: flip, opacity: op }),
        x + size * 0.475,
        y + size * 0.5,
        rot,
      ),
    );
  return [
    lock(S({ x: -150, y: 150, width: 1300, height: 1000, shape: "ellipse", fill: radial([0, "#8c2238"], [0.75, "rgba(59,7,21,0)"]), opacity: 0.6 })),
    lock(O(mandala({ color: GOLDC, accent: GOLDC, size: 760, strokeWidth: 2 }), { cx: 500, y: watermarkY - 380, width: 760, opacity: 0.14 })),
    lock(O(archFrame({ w: 800, h: 1250, stroke: GOLDC, strokeWidth: 3, lines: 3, gap: 12 }), { x: 100, y: 75, width: 800 })),
    lock(O(scallops({ color: GOLDC, w: 1000, r: 20, strokeWidth: 2 }), { x: 0, y: H - 52, width: 1000, opacity: 0.55 })),
    lock(O(scallops({ color: GOLDC, w: 1000, r: 20, strokeWidth: 2 }), { x: 0, y: H - 34, width: 1000, opacity: 0.3 })),
    pais(130, 300, 1150, 12, false),
    pais(130, 580, 1150, -12, true),
    lock(O(mandala({ color: GOLDC, accent: GOLDC, size: 100, strokeWidth: 1.5 }), { cx: 500, y: 1170, width: 100 })),
  ];
}

export default function build(): TemplateDef {
  const bg = linear(90, [0, "#6a1427"], [0.5, MAROON], [1, DEEP]);

  const cover = P(
    bg,
    [
      ...backdrop(),
      lock(O(mandala({ color: GOLDC, accent: GOLDC, size: 120, strokeWidth: 1.6 }), { cx: 500, y: 112, width: 120 })),
      T("॥ शुभ विवाह ॥", 244, { x: 200, width: 600, fontFamily: "Yatra One", fontSize: 44, fill: GOLD, shadow }),
      T("Dear {to},", 318, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontSize: 32, fill: CREAM }),
      T("With the blessings of their families", 372, { x: 180, width: 640, fontFamily: "Jost", fontSize: 16, fill: MUTED, letterSpacing: 6, uppercase: true }),
      T("cordially invite you to the wedding of", 410, { x: 180, width: 640, fontFamily: "Cormorant Garamond", italic: true, fontSize: 28, fill: MUTED }),
      T("Priya", 462, { x: 160, width: 680, fontFamily: "Playfair Display", fontWeight: 500, fontSize: 112, fill: GOLD, shadow }),
      T("weds", 598, { x: 160, width: 680, fontFamily: "Cormorant Garamond", italic: true, fontSize: 40, fill: CREAM }),
      T("Arjun", 648, { x: 160, width: 680, fontFamily: "Playfair Display", fontWeight: 500, fontSize: 112, fill: GOLD, shadow }),
      O(divider({ style: "diamond", w: 400, color: GOLDC }), { cx: 500, y: 810, width: 400 }),
      T("Saturday", 868, { x: 200, width: 600, fontFamily: "Jost", fontSize: 17, fill: GOLDC, letterSpacing: 10, uppercase: true }),
      T("11 · 09 · 2027", 898, { x: 200, width: 600, fontFamily: "Cormorant Garamond", fontWeight: 600, fontSize: 70, fill: CREAM }),
      T("Pheras at eleven o'clock in the morning", 982, { x: 180, width: 640, fontFamily: "Cormorant Garamond", italic: true, fontSize: 26, fill: MUTED }),
      T("Maharani Palace Gardens", 1036, { x: 180, width: 640, fontFamily: "Cinzel", fontWeight: 500, fontSize: 28, fill: GOLD, letterSpacing: 4 }),
      T("Civil Lines, Jaipur, Rajasthan", 1082, { x: 200, width: 600, fontFamily: "Jost", fontSize: 18, fill: MUTED, letterSpacing: 2 }),
    ],
    "Invitation",
  );

  const sec = sections(
    [
      { label: "Mehendi & Sangeet", strong: "Friday 10 September · 6:00 PM", after: 50 },
      { label: "Wedding Ceremony", strong: "Saturday 11 September · 11:00 AM", after: 50 },
      { label: "Grand Reception", strong: "Saturday 11 September · 7:30 PM", after: 54 },
      { label: "Venue", strong: "Maharani Palace Gardens", body: ["Civil Lines, Jaipur, Rajasthan 302006"], after: 50 },
      { label: "Celebration", body: ["Festive lunch & dancing to follow", "Parking within the palace grounds"], after: 50 },
      { label: "Dress Code", body: ["Traditional Indian attire  ·  festive colours"] },
    ],
    {
      x: 160,
      width: 680,
      y0: 362,
      label: { font: "Jost", size: 15, fill: GOLDC, spacing: 8, weight: 500 },
      strong: { font: "Cormorant Garamond", size: 36, fill: CREAM, weight: 500 },
      body: { font: "Jost", size: 20, fill: MUTED, weight: 300, lineHeight: 1.55 },
      sep: (y) => O(divider({ style: "leaf", w: 200, color: GOLDC, strokeWidth: 1.6 }), { cx: W / 2, y, width: 200, opacity: 0.85 }),
    },
  );

  const details = P(
    bg,
    [
      ...backdrop(),
      lock(O(mandala({ color: GOLDC, accent: GOLDC, size: 100, strokeWidth: 1.6 }), { cx: 500, y: 118, width: 100 })),
      T("॥ शुभ आमंत्रण ॥", 232, { x: 200, width: 600, fontFamily: "Yatra One", fontSize: 38, fill: GOLD, shadow }),
      T("The Celebrations", 290, { x: 160, width: 680, fontFamily: "Cormorant Garamond", fontWeight: 500, italic: true, fontSize: 46, fill: CREAM }),
      ...sec.layers,
    ],
    "Details",
  );

  const photo = P(
    bg,
    [
      ...backdrop(560),
      I({ x: 270, y: 200, width: 460, height: 620, mask: "arch", placeholderFill: WINE, borderColor: GOLDC, borderWidth: 3 }),
      T("॥ सदा सुखी रहो ॥", 880, { x: 200, width: 600, fontFamily: "Tiro Devanagari Hindi", fontSize: 40, fill: GOLD, shadow }),
      T("With love, laughter and blessings,\nwe can't wait to celebrate with you.", 958, { x: 160, width: 680, fontFamily: "Cormorant Garamond", italic: true, fontSize: 30, lineHeight: 1.35, fill: CREAM }),
      T("Priya  &  Arjun", 1055, { x: 200, width: 600, fontFamily: "Jost", fontSize: 16, fill: GOLDC, letterSpacing: 9, uppercase: true }),
    ],
    "Blessings",
  );

  return {
    slug: "royal-maroon",
    name: "Royal Maroon",
    tagline: "Maroon and gold Indian wedding invitation with mandala and paisley",
    description:
      "A regal South Asian shaadi invitation in rich maroon and antique gold, with a mandala medallion, paisley motifs, an arched frame and a Devanagari Shubh Vivah header. Perfect for Hindu and Sikh wedding celebrations.",
    categories: ["indian", "luxury", "classic", "dark"],
    keywords: ["indian wedding invitation card", "maroon and gold shaadi invitation", "mandala wedding invitation", "hindu wedding card online", "paisley wedding invite"],
    palette: [MAROON, DEEP, GOLDC, CREAM, WINE],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
