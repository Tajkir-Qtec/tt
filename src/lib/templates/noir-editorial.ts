import { centerRotate } from "../design/layers";
import { H, I, linear, lock, P, S, T, W, type TemplateDef } from "./kit";

const PAPER = "#eee9df";
const INK = "#121110";
const GREY = "#7b756b";
const RED = "#a3231f";
const SOFT = "#d9d2c5";

const hair = (x: number, y: number, w: number, c = INK, h = 1.5, o = 1) =>
  lock(S({ x, y, width: w, height: h, fill: c, opacity: o }));

const label = (text: string, x: number, y: number, w: number, o: Record<string, unknown> = {}) =>
  T(text, y, { x, width: w, align: "left", fontFamily: "Jost", fontWeight: 500, fontSize: 15, letterSpacing: 7, uppercase: true, fill: GREY, ...o });

const vertical = (text: string, cx: number, cy: number, w: number, deg = -90, o: Record<string, unknown> = {}) =>
  lock(
    centerRotate(
      T(text, 0, { x: 0, width: w, fontFamily: "Jost", fontWeight: 500, fontSize: 14, letterSpacing: 8, uppercase: true, fill: GREY, ...o }),
      cx,
      cy,
      deg,
    ),
  );

export default function build(): TemplateDef {
  const bg = linear(90, [0, "#f1ece3"], [1, "#e8e2d6"]);
  const names = { fontFamily: "Playfair Display", italic: true, fontWeight: 500, fill: INK, letterSpacing: -6, lineHeight: 0.95 } as const;

  const cover = P(
    bg,
    [
      // masthead
      label("The Wedding Issue", 90, 84, 400, { fill: INK }),
      label("Vol. 01 — MMXXVII", 510, 84, 400, { align: "right" }),
      hair(90, 124, 820),
      hair(90, 132, 820, INK, 0.8),
      T("For {to}", 156, { x: 90, width: 500, align: "left", fontFamily: "Playfair Display", italic: true, fontSize: 28, fill: RED }),

      // names
      T("Elena", 215, { x: 70, width: 860, align: "left", fontSize: 232, ...names }),
      T("&", 265, { x: 690, width: 220, align: "right", fontFamily: "Playfair Display", italic: true, fontSize: 150, fill: RED, lineHeight: 1 }),
      T("Marcus", 415, { x: 40, width: 880, align: "right", fontSize: 232, ...names }),

      // photo + side details
      I({ x: 90, y: 740, width: 390, height: 500, mask: "rect", placeholderFill: "#1d1b19", name: "Photo" }),
      lock(S({ x: 90, y: 740, width: 390, height: 500, fill: linear(90, [0, "rgba(0,0,0,0)"], [1, "rgba(0,0,0,0.35)"]), opacity: 0.0 })),
      label("Fig. 01 — The Couple", 90, 1256, 390, { fontSize: 12, letterSpacing: 5 }),

      label("Save the date", 540, 742, 370),
      T("14.06", 770, { x: 530, width: 400, align: "left", fontFamily: "Bodoni Moda", fontWeight: 500, fontSize: 152, fill: INK, letterSpacing: -4 }),
      T("Saturday, June 2027", 946, { x: 540, width: 370, align: "left", fontFamily: "Playfair Display", italic: true, fontSize: 30, fill: INK }),
      hair(540, 1010, 370, INK, 1),
      label("Ceremony", 540, 1036, 370, { fontSize: 13 }),
      T("Four o'clock in the afternoon", 1062, { x: 540, width: 370, align: "left", fontFamily: "Playfair Display", fontSize: 24, lineHeight: 1.25, fill: INK }),
      hair(540, 1140, 370, INK, 1),
      label("Venue", 540, 1166, 370, { fontSize: 13 }),
      T("Villa Serbelloni, Lake Como\nItaly", 1192, { x: 540, width: 370, align: "left", fontFamily: "Playfair Display", fontSize: 24, lineHeight: 1.25, fill: INK }),

      hair(90, 1306, 820),
      label("Invitation to follow", 90, 1326, 400, { fontSize: 12, letterSpacing: 6 }),
      label("elena-marcus.com", 510, 1326, 400, { align: "right", fontSize: 12, letterSpacing: 6 }),
      vertical("Elena & Marcus — Wedding Invitation", 958, 740, 520, -90, { fontSize: 12, letterSpacing: 7 }),
    ],
    "Cover",
  );

  /* ------------------------------- details ------------------------------- */
  const row = (n: string, title: string, time: string, y: number) => [
    hair(90, y, 790, INK, 1, 0.6),
    T(n, y + 24, { x: 90, width: 90, align: "left", fontFamily: "Bodoni Moda", italic: true, fontSize: 30, fill: RED }),
    T(title, y + 22, { x: 190, width: 450, align: "left", fontFamily: "Playfair Display", fontWeight: 500, fontSize: 44, fill: INK }),
    T(time, y + 28, { x: 600, width: 280, align: "right", fontFamily: "Jost", fontWeight: 400, fontSize: 24, letterSpacing: 5, fill: INK }),
  ];

  const details = P(
    bg,
    [
      label("Programme", 90, 84, 400, { fill: INK }),
      label("14 June 2027", 510, 84, 400, { align: "right" }),
      hair(90, 124, 820),
      hair(90, 132, 820, INK, 0.8),
      T("The", 170, { x: 90, width: 700, align: "left", fontFamily: "Playfair Display", italic: true, fontSize: 70, fill: RED }),
      T("Day.", 205, { x: 80, width: 800, align: "left", fontFamily: "Playfair Display", italic: true, fontWeight: 500, fontSize: 250, letterSpacing: -6, lineHeight: 1, fill: INK }),

      ...row("i.", "Ceremony", "4:00 PM", 520),
      ...row("ii.", "Cocktails", "5:00 PM", 620),
      ...row("iii.", "Dinner", "6:30 PM", 720),
      ...row("iv.", "Dancing", "9:00 PM", 820),
      hair(90, 920, 790, INK, 1, 0.6),

      label("Venue", 90, 980, 380),
      T("Villa Serbelloni", 1010, { x: 90, width: 400, align: "left", fontFamily: "Playfair Display", fontWeight: 500, fontSize: 38, fill: INK }),
      T("Via Roma 1, Bellagio\nLake Como, Italy", 1064, { x: 90, width: 400, align: "left", fontFamily: "Jost", fontSize: 21, lineHeight: 1.55, fill: GREY }),

      label("Dress code", 540, 980, 340),
      T("Black tie,\nmonochrome", 1010, { x: 540, width: 340, align: "left", fontFamily: "Playfair Display", italic: true, fontSize: 38, lineHeight: 1.12, fill: INK }),

      lock(S({ x: 90, y: 1190, width: 820, height: 110, fill: INK })),
      T("Afterwards", 1214, { x: 120, width: 200, align: "left", fontFamily: "Jost", fontWeight: 500, fontSize: 15, letterSpacing: 8, fill: "#c9c2b5" }),
      T("Celebration to follow", 1236, { x: 120, width: 480, align: "left", fontFamily: "Playfair Display", italic: true, fontSize: 30, fill: PAPER }),
      T("Parking at the villa", 1226, { x: 560, width: 320, align: "right", fontFamily: "Jost", fontSize: 18, letterSpacing: 2, fill: PAPER }),
      T("Shuttles from Bellagio", 1256, { x: 560, width: 320, align: "right", fontFamily: "Jost", fontSize: 18, letterSpacing: 2, fill: "#c9c2b5" }),
      vertical("Elena & Marcus — MMXXVII", 958, 360, 520, -90, { fontSize: 12, letterSpacing: 7 }),
    ],
    "Programme",
  );

  /* ------------------------------- photo page ------------------------------- */
  const photo = P(
    bg,
    [
      lock(S({ x: 0, y: 0, width: W, height: H, fill: "#141312" })),
      I({ x: 90, y: 90, width: 820, height: 930, mask: "rect", placeholderFill: "#2a2725", name: "Photo" }),
      T("Two", 1050, { x: 90, width: 400, align: "left", fontFamily: "Playfair Display", italic: true, fontSize: 70, fill: "#a3231f" }),
      T("become one.", 1135, { x: 90, width: 820, align: "left", fontFamily: "Playfair Display", italic: true, fontWeight: 500, fontSize: 130, letterSpacing: -4, lineHeight: 1, fill: PAPER }),
      hair(90, 1310, 820, "#eee9df", 1, 0.5),
      label("Elena & Marcus", 90, 1330, 400, { fill: "#a9a296", fontSize: 12 }),
      label("14.06.2027", 510, 1330, 400, { align: "right", fill: "#a9a296", fontSize: 12 }),
    ],
    "Portrait",
  );

  return {
    slug: "noir-editorial",
    name: "Noir Editorial",
    tagline: "Black and ivory fashion-magazine wedding invitation",
    description:
      "A high-fashion editorial wedding invitation in black, ivory and a single red accent, with oversized italic Playfair names, hairline rules and a magazine-cover photo layout.",
    categories: ["minimal", "modern", "luxury", "dark"],
    keywords: ["editorial wedding invitation", "black and white wedding invitation", "magazine cover wedding card", "modern minimalist wedding invitation"],
    palette: ["#eee9df", INK, RED, GREY],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
