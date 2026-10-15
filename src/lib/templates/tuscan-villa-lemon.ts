import { GUEST_TOKEN } from "../design/types";
import type { Layer } from "../design/types";
import { archPath, divider } from "../design/ornaments";
import { H, I, linear, lock, O, P, S, T, W, type TemplateDef } from "./kit";
import { place } from "./summer-party.art";
import { C, cypressRow, cypresses, hill, lemonSolo, lemonSprig, sunDisc, tileBorder, villa, vineRows } from "./tuscan-villa-lemon.art";

const BG = linear(90, [0, "#fbf3df"], [1, "#f4e4bd"]);
const NAMES = { fontFamily: "Pinyon Script", fill: C.cobaltD, lineHeight: 1.1 } as const;
const cap = (text: string, y: number, o: Record<string, unknown> = {}) =>
  T(text, y, { fontFamily: "Marcellus", fontSize: 22, letterSpacing: 8, uppercase: true, fill: C.terra, ...o });

const frame = (): Layer[] => [
  lock(tileBorder(40, 40, 920, 1320, 40)),
  lock(S({ x: 92, y: 92, width: 816, height: 1216, fill: null, stroke: C.terra, strokeWidth: 2, cornerRadius: 0 })),
];

export default function build(): TemplateDef {
  /* --------------------------------- cover --------------------------------- */
  const AX = 160;
  const AY = 660;
  const AW = 680;
  const AH = 640;
  const archSky = place([{ path: archPath(AX, AY, AW, AH), fill: linear(90, [0, "#f7cf8b"], [0.5, "#fbe5b5"], [1, "#fdf3d6"]) }], 0);
  const hills = place(
    [
      hill(AX, AX + AW, AY + AH, [1010, 985, 965, 990, 1010, 1000, 1020], "#b8b47c"),
      hill(AX, AX + AW, AY + AH, [1060, 1040, 1030, 1050, 1035, 1055, 1045], "#8f9c4a"),
      hill(AX, AX + AW, AY + AH, [1130, 1115, 1120, 1150, 1130, 1110, 1135], C.olive),
      vineRows(AX, AX + AW, 1140, 1285, 8, C.oliveL, 0.55),
      hill(AX, AX + AW, AY + AH, [1275, 1262, 1270, 1275, 1268, 1275, 1270], C.oliveD),
    ],
    0,
  );
  const archLine = place([{ path: archPath(AX, AY, AW, AH), fill: null, stroke: C.terra, strokeWidth: 6 }, { path: archPath(AX + 14, AY + 14, AW - 28, AH - 28), fill: null, stroke: "#e2b24a", strokeWidth: 2 }], 4);

  const cover = P(
    BG,
    [
      ...frame(),
      lock(lemonSprig(140, 104, 80, 270, 7, 3, 0.85)),
      lock(lemonSprig(860, 104, 100, 270, 11, 3, 0.85)),
      cap("Together with their families", 118, { fontSize: 21, letterSpacing: 6 }),
      T("Isabella", 150, { ...NAMES, fontSize: 138 }),
      T("&", 290, { fontFamily: "Cormorant Garamond", italic: true, fontSize: 56, fill: C.terra, lineHeight: 1 }),
      T("Lorenzo", 316, { ...NAMES, fontSize: 138 }),
      T("Saturday, 12 June 2027", 480, { fontFamily: "Cormorant Garamond", fontWeight: 600, fontSize: 40, letterSpacing: 3, uppercase: true, fill: C.terraD }),
      T("Villa Bellavista  ·  Chianti, Tuscany", 534, { fontFamily: "Cormorant Garamond", italic: true, fontSize: 30, fill: C.ink }),
      T(GUEST_TOKEN, 584, { fontFamily: "Pinyon Script", fontSize: 44, fill: C.olive, lineHeight: 1.1 }),
      archSky,
      ...sunDisc(500, 840, 62),
      hills,
      lock(cypresses([[236, 1070, 210, 24], [276, 1085, 170, 20], [740, 1075, 200, 23], [782, 1085, 150, 18], [350, 1110, 120, 15]])),
      lock(villa(530, 1105, 1.05)),
      lock(cypresses([[640, 1135, 105, 14], [222, 1255, 120, 16], [778, 1255, 135, 17]])),
      lock(lemonSolo(500, 1235, 30, -14)),
      lock(lemonSolo(560, 1252, 25, 20)),
      archLine,
    ],
    "Invitation",
  );

  /* -------------------------------- details -------------------------------- */
  const row = (y: number, time: string, title: string, sub: string): Layer[] => [
    T(time, y, { x: 130, width: 250, fontFamily: "Cormorant Garamond", fontWeight: 600, fontSize: 64, lineHeight: 1.05, fill: C.cobalt }),
    T("PM", y + 70, { x: 130, width: 250, fontFamily: "Marcellus", fontSize: 20, letterSpacing: 8, fill: C.terra }),
    lock(S({ x: 396, y: y + 4, width: 3, height: 112, fill: C.lemonD })),
    T(title, y + 6, { x: 430, width: 450, align: "left", fontFamily: "Cormorant Garamond", fontWeight: 700, fontSize: 44, lineHeight: 1.1, fill: C.terraD }),
    T(sub, y + 62, { x: 430, width: 450, align: "left", fontFamily: "Cormorant Garamond", italic: true, fontSize: 29, lineHeight: 1.2, fill: C.ink }),
  ];
  const details = P(
    BG,
    [
      ...frame(),
      cap("Il Programma", 150, { fontSize: 22 }),
      T("The Celebration", 190, { ...NAMES, fontSize: 112 }),
      lock(O(divider({ style: "leaf", w: 380, color: C.terra, strokeWidth: 2 }), { cx: 500, y: 340 })),
      T("Saturday, 12 June 2027", 380, { fontFamily: "Cormorant Garamond", fontWeight: 600, fontSize: 36, letterSpacing: 3, uppercase: true, fill: C.cobaltD }),
      ...row(480, "4:00", "Ceremony", "Vows beneath the cypress arch, in the villa garden"),
      ...row(650, "5:30", "Aperitivo", "Prosecco, limoncello and antipasti in the lemon grove"),
      ...row(820, "7:30", "Cena", "A long-table dinner on the terrace, music till late"),
      lock(cypressRow(110, 890, 1300, 5, 60, 120)),
      T("Garden formal  ·  linen, lemon and terracotta tones", 1010, { x: 140, width: 720, fontFamily: "Marcellus", fontSize: 22, letterSpacing: 2, fill: C.olive }),
      T("Villa Bellavista, Via dei Cipressi", 1058, { x: 140, width: 720, fontFamily: "Cormorant Garamond", fontWeight: 600, fontSize: 36, fill: C.terraD }),
      T("Castellina in Chianti, Tuscany", 1104, { x: 140, width: 720, fontFamily: "Cormorant Garamond", italic: true, fontSize: 30, fill: C.ink }),
    ],
    "Details",
  );

  /* ------------------------------ photo page ------------------------------ */
  const photo = P(
    BG,
    [
      ...frame(),
      cap("Our story", 132, { fontSize: 22 }),
      I({ x: 270, y: 190, width: 460, height: 600, mask: "arch", placeholderFill: "#ecd6a4", borderColor: C.terra, borderWidth: 5 }),
      lock(lemonSprig(150, 210, 84, 300, 31, 3, 0.85)),
      lock(lemonSprig(850, 210, 96, 300, 41, 3, 0.85)),
      T("Con Amore", 830, { ...NAMES, fontSize: 118 }),
      T("Come raise a glass with us beneath the Tuscan sun,", 975, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontSize: 32, lineHeight: 1.3, fill: C.ink }),
      T("where good wine, golden light and the people we", 1015, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontSize: 32, lineHeight: 1.3, fill: C.ink }),
      T("love will make our day unforgettable.", 1055, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontSize: 32, lineHeight: 1.3, fill: C.ink }),
      lock(O(divider({ style: "leaf", w: 320, color: C.terra, strokeWidth: 2 }), { cx: 500, y: 1110 })),
      T("Isabella & Lorenzo", 1150, { ...NAMES, fontSize: 64, fill: C.cobalt }),
      lock(cypressRow(110, 890, 1296, 9, 40, 90)),
    ],
    "Photo",
  );

  void H;
  void W;
  return {
    slug: "tuscan-villa-lemon",
    name: "Tuscan Villa Lemon",
    tagline: "Italian villa wedding invitation with cypress hills, lemons and majolica tiles",
    description:
      "A sun-washed Tuscan wedding invitation with a terracotta-roofed villa, rolling cypress hills, hand-drawn lemon branches and a cobalt majolica tile border. Perfect for Italian destination weddings, vineyard celebrations and Mediterranean garden parties.",
    categories: ["classic", "nature", "beach"],
    keywords: ["tuscan wedding invitation", "italian villa wedding invite", "lemon wedding invitation template", "majolica tile border card", "cypress vineyard wedding card", "mediterranean destination wedding invitation"],
    palette: ["#f8efd9", "#c25b34", "#6a7a32", "#f5cf3a", "#24539b"],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
