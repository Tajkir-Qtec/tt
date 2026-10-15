import { diamondLattice } from "../design/ornaments";
import { GUEST_TOKEN, type Layer, type Paint } from "../design/types";
import { H, I, GOLD, linear, lock, O, P, radial, S, T, W, type TemplateDef } from "./kit";
import { cartouche, golBranch, mihrab, petalRing, rosette, starRow, vine } from "./persian-gol-turquoise.art";

const TURQ = "#0e8a8f";
const DEEP = "#073f4b";
const NIGHT = "#052c36";
const IVORY = "#f9f1de";
const GOLDC = "#c9a24a";
const LAPIS = "#1d3f8c";
const CORAL = "#c8553d";
const INK = "#0a4a55";

const bg = linear(165, [0, "#0a6e78"], [0.5, "#08525e"], [1, "#053843"]);
const panelFill = linear(180, [0, "#fffaf0"], [0.55, "#f8efd9"], [1, "#efe2c3"]);
const turqPetal = linear(135, [0, "#34bcb9"], [1, "#0b7c85"]);
const goldPetal = linear(135, [0, "#f1d98f"], [1, "#b98a3a"]);
const leafPaint = linear(135, [0, "#16a08f"], [1, "#0a6a6c"]);

const glow = (cx: number, cy: number, r: number, c: string, a: number): Layer =>
  lock(S({ shape: "ellipse", x: cx - r, y: cy - r, width: r * 2, height: r * 2, fill: radial([0, `rgba(${c},${a})`], [1, `rgba(${c},0)`]) }));

function chrome(): Layer[] {
  return [
    glow(500, 380, 560, "60,200,195", 0.3),
    lock(O(diamondLattice({ color: "rgba(233,207,138,0.16)", w: 1000, h: 1400, cell: 70, strokeWidth: 1 }), { x: 0, y: 0, width: 1000 })),
    lock(S({ x: 30, y: 30, width: 940, height: 1340, fill: null, stroke: GOLDC, strokeWidth: 3 })),
    lock(S({ x: 44, y: 44, width: 912, height: 1312, fill: null, stroke: "rgba(233,207,138,0.6)", strokeWidth: 1 })),
  ];
}

function panel(y = 120, h = 1150): Layer[] {
  return [
    lock(O(mihrab({ w: 760, h, fill: "rgba(2,20,26,0.35)", stroke: "rgba(2,20,26,0)", inner: "rgba(0,0,0,0)", sw: 1 }), { x: 124, y: y + 10, width: 760 })),
    lock(O(mihrab({ w: 760, h, fill: panelFill, stroke: GOLDC, inner: GOLDC, sw: 5 }), { x: 120, y, width: 760 })),
  ];
}

const shadow = { color: "#e9cf8a", blur: 6, offsetX: 0, offsetY: 1, opacity: 0.35 };

export default function persianGolTurquoise(): TemplateDef {
  const body = (t: string, y: number, o: Partial<Parameters<typeof T>[2]> = {}) =>
    T(t, y, { x: 200, width: 600, fontFamily: "Cormorant Garamond", fontWeight: 500, fontSize: 26, fill: INK, ...o });
  const cap = (t: string, y: number, o: Partial<Parameters<typeof T>[2]> = {}) =>
    T(t, y, { x: 200, width: 600, fontFamily: "Jost", fontWeight: 400, fontSize: 16, fill: "#8a6a2f", letterSpacing: 7, uppercase: true, ...o });

  const bloom = (cx: number, y: number, w: number, h: number): Layer =>
    lock(O(golBranch(w, h, { leaf: leafPaint, bloom: goldPetal, core: CORAL, stem: "#0a6a6c", line: "#7a5a22" }), { cx, y, width: w }));

  // ---------------- cover
  const cover = P(
    bg,
    [
      ...chrome(),
      ...panel(),
      T(GUEST_TOKEN, 78, { x: 250, width: 500, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 30, fill: "#f3dfa2", letterSpacing: 3 }),
      lock(O(rosette(110, { outer: turqPetal, inner: goldPetal, heart: LAPIS, line: "#7a5a22" }), { cx: 500, y: 190, width: 110 })),
      body("with joy and the blessings of their families", 330, { x: 250, width: 500, italic: true, fontSize: 24 }),
      cap("invite you to the wedding of", 384, { x: 250, width: 500, fontSize: 14, letterSpacing: 6 }),
      T("Soraya", 440, { x: 160, width: 680, fontFamily: "Cormorant Garamond", fontWeight: 500, fontSize: 128, fill: linear(100, [0, "#0a5964"], [1, "#073f4b"]), lineHeight: 1, shadow }),
      T("&", 580, { x: 160, width: 680, fontFamily: "Playfair Display", italic: true, fontSize: 56, fill: GOLD, lineHeight: 1 }),
      T("Kian", 640, { x: 160, width: 680, fontFamily: "Cormorant Garamond", fontWeight: 500, fontSize: 128, fill: linear(100, [0, "#0a5964"], [1, "#073f4b"]), lineHeight: 1, shadow }),
      lock(O(cartouche(520, 128, { fill: linear(180, [0, "#0d8d91"], [1, "#066873"]), stroke: GOLDC, sw: 3 }), { cx: 500, y: 810, width: 520 })),
      T("Friday", 835, { x: 300, width: 400, fontFamily: "Jost", fontSize: 15, fill: "#f3dfa2", letterSpacing: 10, uppercase: true }),
      T("19 · 03 · 2027", 862, { x: 280, width: 440, fontFamily: "Cormorant Garamond", fontWeight: 500, fontSize: 52, fill: IVORY }),
      T("at half past six in the evening", 970, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontSize: 26, fill: INK }),
      T("The Golestan Garden Pavilion", 1018, { x: 180, width: 640, fontFamily: "Cormorant Garamond", fontWeight: 700, fontSize: 28, fill: "#8a6a2f", letterSpacing: 4, uppercase: true }),
      T("Isfahan Road, Shiraz", 1064, { x: 200, width: 600, fontFamily: "Jost", fontWeight: 300, fontSize: 19, fill: INK, letterSpacing: 3 }),
      lock(S({ x: 230, y: 1168, width: 190, height: 1.5, fill: GOLDC })),
      lock(S({ x: 580, y: 1168, width: 190, height: 1.5, fill: GOLDC })),
      bloom(500, 1112, 130, 100),
    ],
    "Invitation",
  );

  // ---------------- details
  const lab = (t: string, y: number) => cap(t, y, { x: 200, width: 600 });
  const big = (t: string, y: number, size = 40) =>
    T(t, y, { x: 200, width: 600, fontFamily: "Cormorant Garamond", fontWeight: 600, fontSize: size, fill: DEEP, lineHeight: 1.15 });
  const sub = (t: string, y: number) => body(t, y, { italic: true, fontSize: 25, fontWeight: 500 });
  const dividerStars = (y: number): Layer =>
    lock(O(starRow(300, 26, { fill: goldPetal, stroke: "#7a5a22" }), { cx: 500, y, width: 300 }));
  const details = P(
    bg,
    [
      ...chrome(),
      ...panel(),
      lock(O(rosette(84, { outer: turqPetal, inner: goldPetal, heart: LAPIS, line: "#7a5a22" }), { cx: 500, y: 192, width: 84 })),
      T("The Celebration", 322, { x: 200, width: 600, fontFamily: "Playfair Display", italic: true, fontSize: 48, fill: DEEP }),
      dividerStars(402),
      lab("Aqd · Ceremony", 448),
      big("5:30 PM", 482),
      sub("beneath the garden arches", 534),
      lab("Reception", 612),
      big("7:00 PM", 644),
      sub("music, poetry and a feast", 696),
      lab("Dinner & Dancing", 774),
      big("8:30 PM", 806),
      dividerStars(886),
      lab("Venue", 944),
      big("The Golestan Garden Pavilion", 976, 34),
      sub("Isfahan Road, Shiraz", 1022),
      lab("Dress", 1082),
      sub("Festive formal – jewel tones welcome", 1112),
      lock(O(vine(450, 56, { stem: "#b98a3a", leaf: leafPaint, dot: CORAL, period: 90 }), { cx: 500, y: 1176, width: 450 })),
    ],
    "Details",
  );

  // ---------------- photo
  const photo = P(
    bg,
    [
      ...chrome(),
      ...panel(),
      lock(O(rosette(76, { outer: turqPetal, inner: goldPetal, heart: LAPIS, line: "#7a5a22" }), { cx: 500, y: 196, width: 76 })),
      lock(O(petalRing(540, { outer: turqPetal, inner: goldPetal, line: "#8a6a2f" }), { cx: 500, y: 300, width: 540 })),
      I({ x: 500 - 187, y: 300 + 270 - 187, width: 374, height: 374, mask: "ellipse", placeholderFill: "#7fb8b5", borderColor: "#f9f1de", borderWidth: 4 }),
      lock(O(vine(300, 44, { stem: "#b98a3a", leaf: leafPaint, dot: CORAL, period: 75 }), { cx: 500, y: 912, width: 300 })),
      T("Wherever you bloom, I will follow, and the garden will be home.", 966, { x: 230, width: 540, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 31, fill: INK, lineHeight: 1.25 }),
      T("Soraya & Kian", 1086, { x: 200, width: 600, fontFamily: "Cormorant Garamond", fontWeight: 700, fontSize: 30, fill: "#8a6a2f", letterSpacing: 8, uppercase: true }),
      T("19 · 03 · 2027", 1134, { x: 200, width: 600, fontFamily: "Jost", fontWeight: 300, fontSize: 18, fill: INK, letterSpacing: 8 }),
    ],
    "Photo",
  );

  return {
    slug: "persian-gol-turquoise",
    name: "Persian Gol Turquoise",
    tagline: "Persian wedding invitation in turquoise and gold with a mihrab arch",
    description:
      "An Iranian-inspired wedding invitation set within a gilded mihrab arch, with a gol-o-bolbol flowering branch, shamseh rosette, toranj cartouche and turquoise-and-gold tilework. Ideal for Persian, Iranian and Central Asian weddings, Nowruz celebrations and aqd ceremonies.",
    categories: ["cultural", "luxury", "floral"],
    keywords: [
      "persian wedding invitation turquoise gold",
      "iranian wedding card mihrab arch",
      "gol o bolbol floral wedding invitation",
      "aqd ceremony digital invitation",
      "turquoise and gold wedding invitation online",
    ],
    palette: [TURQ, DEEP, IVORY, GOLDC, CORAL],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}

// keep helpers referenced for type clarity
export type _P = Paint;
void NIGHT;
void H;
