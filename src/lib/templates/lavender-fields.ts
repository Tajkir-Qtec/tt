import { archFrame, divider, sparkle } from "../design/ornaments";
import type { Layer } from "../design/types";
import { bouquet, FAN, type StalkSpec } from "./lavender-fields.art";
import { H, I, linear, lock, O, P, radial, S, T, W, type TemplateDef } from "./kit";

const VIOLET = "#6a4b96";
const LILAC = "#a98bd0";
const SAGE = "#8fa07c";
const INK = "#5d5470";
const DEEP = "#3f2f63";
const CREAM = "#fbf7f2";

const wash = (cx: number, cy: number, rx: number, ry: number, color: string, a: number): Layer =>
  lock(
    S({
      shape: "ellipse",
      x: cx - rx,
      y: cy - ry,
      width: rx * 2,
      height: ry * 2,
      fill: radial([0, `rgba(${color},${a})`], [0.55, `rgba(${color},${a * 0.45})`], [1, `rgba(${color},0)`]),
    }),
  );

const ECHO: StalkSpec[] = [
  { angle: 192, length: 360, bend: 22, opacity: 0.9 },
  { angle: 207, length: 290, bend: -16, opacity: 0.85, colors: ["#c3a8e0", "#a98bd0", "#d4bdea", "#b79ad8", "#8d6fb8"] },
  { angle: 222, length: 230, bend: 14, opacity: 0.8 },
  { angle: 177, length: 250, bend: -14, opacity: 0.85, colors: ["#7b5aa6", "#8d6fb8", "#6a4b96", "#a98bd0", "#9577c2"] },
];

const bgPaint = linear(160, [0, "#fcf9f4"], [0.55, "#f5eef6"], [1, "#e9dff2"]);

function frame(): Layer[] {
  return [
    lock(S({ x: 56, y: 56, width: 888, height: 1288, fill: null, stroke: "rgba(106,75,150,0.35)", strokeWidth: 1.5, cornerRadius: 4 })),
    lock(S({ x: 70, y: 70, width: 860, height: 1260, fill: null, stroke: "rgba(106,75,150,0.2)", strokeWidth: 1, cornerRadius: 2 })),
  ];
}

function sparkles(): Layer[] {
  const pts: [number, number, number, number][] = [
    [790, 190, 20, 0.8],
    [840, 250, 11, 0.6],
    [230, 1010, 14, 0.5],
    [880, 1090, 16, 0.6],
    [650, 1250, 10, 0.5],
  ];
  return pts.map(([x, y, s, o]) => lock(O(sparkle({ color: LILAC, size: s }), { cx: x, y, width: s, opacity: o })));
}


function detailsPage(): Layer[] {
  const x = 200;
  const width = 600;
  const lab = (t: string, y: number) => T(t, y, { x, width, fontFamily: "Jost", fontWeight: 500, fontSize: 19, fill: VIOLET, letterSpacing: 7, uppercase: true });
  const big = (t: string, y: number, size = 46) => T(t, y, { x, width, fontFamily: "Cormorant Garamond", fontWeight: 500, fontSize: size, fill: DEEP, lineHeight: 1.15 });
  const body = (t: string, y: number) => T(t, y, { x, width, fontFamily: "Jost", fontSize: 23, fill: INK, lineHeight: 1.5 });
  const out: Layer[] = [
    T("The Day", 150, { x, width, fontFamily: "Cormorant Garamond", fontWeight: 500, italic: true, fontSize: 112, fill: linear(100, [0, VIOLET], [1, DEEP]) }),
    O(divider({ style: "diamond", w: 360, color: LILAC }), { cx: W / 2, y: 312, width: 360 }),
  ];
  const ev: [string, string][] = [
    ["Ceremony", "4:30 PM"],
    ["Aperitif in the Fields", "5:30 PM"],
    ["Dinner & Dancing", "7:00 PM"],
  ];
  ev.forEach(([n, t], i) => {
    out.push(lab(n, 392 + i * 118), big(t, 428 + i * 118));
  });
  out.push(O(divider({ style: "dots", w: 300, color: LILAC }), { cx: W / 2, y: 758, width: 300 }));
  out.push(lab("Venue", 830), big("Domaine des Lavandes", 868, 42), body("Route des Plateaux, Valensole\nProvence, France", 926));
  out.push(lab("Attire", 1048), body("Garden formal in soft pastels", 1086));
  out.push(lab("A Gentle Note", 1170), body("Please leave the lavender where it grows", 1208));
  return out;
}

export default function build(): TemplateDef {
  const base = (): Layer[] => [
    wash(120, 1300, 560, 560, "169,139,208", 0.5),
    wash(900, 120, 440, 440, "195,168,224", 0.42),
    wash(780, 760, 340, 340, "143,160,124", 0.12),
  ];

  const cover = P(
    bgPaint,
    [
      ...base(),
      ...frame(),
      ...bouquet(1015, -25, ECHO, 1),
      ...bouquet(75, 1450, FAN, 0.95),
      ...sparkles(),
      T("Dear {to},", 150, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontSize: 36, fill: INK }),
      T("Together with their families", 222, { x: 200, width: 600, fontFamily: "Jost", fontSize: 18, fill: INK, letterSpacing: 7, uppercase: true }),
      T("request the honour of your presence\nat the wedding of", 266, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontSize: 30, fill: INK, lineHeight: 1.25 }),
      T("Eleanor", 370, {
        x: 120, width: 760, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 168,
        fill: linear(100, [0, VIOLET], [1, DEEP]), lineHeight: 1,
      }),
      T("&", 530, { x: 120, width: 760, fontFamily: "Playfair Display", italic: true, fontSize: 60, fill: LILAC }),
      T("Julian", 590, {
        x: 120, width: 760, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 168,
        fill: linear(100, [0, VIOLET], [1, DEEP]), lineHeight: 1,
      }),
      O(divider({ style: "diamond", w: 360, color: LILAC }), { cx: W / 2, y: 800, width: 360 }),
      T("Saturday", 862, { x: 200, width: 600, fontFamily: "Jost", fontSize: 20, fill: INK, letterSpacing: 12, uppercase: true }),
      T("21 · 08 · 2027", 896, { x: 200, width: 600, fontFamily: "Cormorant Garamond", fontWeight: 500, fontSize: 76, fill: DEEP }),
      T("at half past four in the afternoon", 990, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontSize: 28, fill: INK }),
      T("Domaine des Lavandes", 1056, { x: 200, width: 600, fontFamily: "Cormorant Garamond", fontWeight: 600, fontSize: 30, fill: DEEP, letterSpacing: 5, uppercase: true }),
      T("Valensole, Provence, France", 1106, { x: 200, width: 600, fontFamily: "Jost", fontSize: 19, fill: INK, letterSpacing: 2 }),
    ],
    "Invitation",
  );

  const details = P(
    bgPaint,
    [
      ...base(),
      ...frame(),
      ...bouquet(1015, -25, ECHO.slice(0, 3), 0.8),
      ...bouquet(970, 1440, FAN.slice(0, 5), 0.62, true),
      ...detailsPage(),
    ],
    "Details",
  );

  const photo = P(
    bgPaint,
    [
      ...base(),
      ...frame(),
      ...bouquet(60, 1450, FAN, 0.62),
      ...bouquet(1015, -25, ECHO.slice(0, 3), 0.8),
      T("Our Love Story", 130, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 64, fill: DEEP }),
      lock(O(archFrame({ w: 520, h: 740, stroke: LILAC, strokeWidth: 2, lines: 2, gap: 12 }), { cx: W / 2, y: 232, width: 520 })),
      I({ x: 250, y: 252, width: 500, height: 700, mask: "arch", placeholderFill: "#d9c8ec", borderColor: "#ffffff", borderWidth: 6 }),
      T("“In a field of lavender, we found our forever.”", 1015, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontSize: 38, fill: INK, lineHeight: 1.25 }),
      O(divider({ style: "dots", w: 220, color: LILAC }), { cx: W / 2, y: 1130, width: 220 }),
      T("Eleanor & Julian", 1190, { x: 200, width: 600, fontFamily: "Cormorant Garamond", fontWeight: 600, fontSize: 30, fill: DEEP, letterSpacing: 8, uppercase: true }),
      T("21 · 08 · 2027", 1240, { x: 200, width: 600, fontFamily: "Jost", fontSize: 18, fill: INK, letterSpacing: 8 }),
    ],
    "Photo",
  );

  return {
    slug: "lavender-fields",
    name: "Lavender Fields",
    tagline: "Dreamy Provence lavender wedding invitation in lilac and sage",
    description:
      "A romantic Provence-inspired invitation with hand-built lavender stalks, soft watercolor washes and delicate italic serif lettering in lilac, violet, sage and cream.",
    categories: ["floral", "nature", "boho"],
    keywords: ["lavender wedding invitation", "provence wedding card", "lilac purple floral invitation", "french countryside wedding"],
    palette: [CREAM, LILAC, VIOLET, SAGE, DEEP],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
