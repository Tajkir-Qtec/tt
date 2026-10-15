import { GUEST_TOKEN } from "../design/types";
import type { Layer } from "../design/types";
import { H, I, lock, P, S, T, W, type TemplateDef } from "./kit";
import { M, bunting, garland, marigold, petalsScatter, talaveraBand } from "./mexican-papel-picado.art";

const BG = M.bg;
const cap = (text: string, y: number, o: Record<string, unknown> = {}) =>
  T(text, y, { fontFamily: "Jost", fontWeight: 500, fontSize: 22, letterSpacing: 8, uppercase: true, fill: M.yellow, ...o });
const name = (text: string, y: number, fill: string, size = 124) =>
  T(text, y, { fontFamily: "Yeseva One", fontSize: size, lineHeight: 1, fill, shadow: { color: "#000000", blur: 0, offsetX: 4, offsetY: 4, opacity: 0.35 } });

export default function build(): TemplateDef {
  const tiles = () => lock(talaveraBand(0, 1240, 1000, 2, 62.5));
  const lights = (): Layer[] => [
    lock(S({ x: 0, y: 1232, width: 1000, height: 8, fill: M.orange })),
    lock(S({ x: 0, y: 1224, width: 1000, height: 4, fill: M.pink })),
  ];

  /* --------------------------------- cover --------------------------------- */
  const cover = P(
    BG,
    [
      petalsScatter(5, [20, 380, 980, 1200], 34, (x, y) => (x > 110 && x < 890 && y > 380 && y < 1190)),
      ...bunting(-10, 1010, 14, 70, 7, 235, 3).map(lock),
      cap("Join us for a fiesta of love", 400, { fontSize: 22 }),
      name("Camila", 440, M.yellow),
      T("&", 560, { fontFamily: "Playfair Display", italic: true, fontSize: 60, lineHeight: 1, fill: M.pink }),
      name("Mateo", 622, M.cream),
      ...garland(40, 960, 790, 70, 25, 30, 7).map(lock),
      T("Saturday, 20 November 2027", 925, { fontFamily: "Jost", fontWeight: 600, fontSize: 32, letterSpacing: 5, uppercase: true, fill: M.cream }),
      T("Hacienda Los Girasoles  ·  Oaxaca, Mexico", 982, { fontFamily: "Playfair Display", italic: true, fontSize: 31, fill: "#ffc78a" }),
      T("Fiesta at sunset with mariachi, mezcal & dancing", 1040, { x: 100, width: 800, fontFamily: "Jost", fontWeight: 400, fontSize: 24, letterSpacing: 1, fill: "#cfe3e8" }),
      T(GUEST_TOKEN, 1118, { fontFamily: "Great Vibes", fontSize: 58, lineHeight: 1.1, fill: "#ff7fb0" }),
      ...lights(),
      tiles(),
    ],
    "Invitation",
  );

  /* -------------------------------- details -------------------------------- */
  const row = (y: number, time: string, ap: string, title: string, sub: string, color: string): Layer[] => [
    lock(S({ x: 100, y, width: 800, height: 170, fill: M.cream, cornerRadius: 22, stroke: color, strokeWidth: 5 })),
    lock(S({ x: 122, y: y + 20, width: 200, height: 130, fill: M.cobalt, cornerRadius: 14, stroke: M.yellow, strokeWidth: 3 })),
    T(time, y + 30, { x: 122, width: 200, fontFamily: "Yeseva One", fontSize: 62, lineHeight: 1.05, fill: "#ffffff" }),
    T(ap, y + 104, { x: 122, width: 200, fontFamily: "Jost", fontWeight: 600, fontSize: 22, letterSpacing: 8, fill: M.yellow }),
    T(title, y + 32, { x: 350, width: 520, align: "left", fontFamily: "Yeseva One", fontSize: 44, lineHeight: 1.1, fill: M.cobaltD }),
    T(sub, y + 92, { x: 350, width: 520, align: "left", fontFamily: "Jost", fontWeight: 500, fontSize: 25, lineHeight: 1.25, fill: "#37505c" }),
  ];
  const details = P(
    BG,
    [
      petalsScatter(9, [20, 340, 980, 1200], 24, (x, y) => x > 90 && x < 910 && y > 380 && y < 1210),
      ...bunting(-10, 1010, 10, 50, 9, 170, 21, undefined, 1).map(lock),
      cap("The plan for the day", 232, { fontSize: 22 }),
      T("La Fiesta", 270, { fontFamily: "Yeseva One", fontSize: 128, lineHeight: 1, fill: M.pink, shadow: { color: "#000000", blur: 0, offsetX: 4, offsetY: 4, opacity: 0.35 } }),
      T("Saturday, 20 November 2027", 418, { fontFamily: "Jost", fontWeight: 600, fontSize: 28, letterSpacing: 5, uppercase: true, fill: M.cream }),
      ...row(490, "5:00", "PM", "Ceremonia", "Vows under the marigold arch in the courtyard", M.pink),
      ...row(690, "7:00", "PM", "Cena & Mariachi", "Oaxacan feast, mezcal toast and live mariachi", M.orange),
      ...row(890, "9:30", "PM", "Baile", "Dance the night away, sparklers at midnight", M.teal),
      T("Dress code: festive & colourful", 1085, { fontFamily: "Playfair Display", italic: true, fontSize: 34, fill: M.yellow }),
      T("The brighter the better!", 1135, { fontFamily: "Jost", fontWeight: 500, fontSize: 24, letterSpacing: 5, uppercase: true, fill: "#cfe3e8" }),
      ...lights(),
      tiles(),
    ],
    "Details",
  );

  /* ------------------------------ photo page ------------------------------ */
  const ringFlowers: Layer[] = [];
  const cx = 500;
  const cy = 650;
  const RR = 270;
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2 + 0.1;
    ringFlowers.push(lock(marigold(cx + Math.cos(a) * RR, cy + Math.sin(a) * RR, 44 + (i % 3) * 5, i)));
  }
  const photo = P(
    BG,
    [
      petalsScatter(13, [20, 300, 980, 1200], 30, (x, y) => Math.hypot(x - cx, y - cy) < 340 || (y > 960 && x > 100 && x < 900)),
      ...bunting(-10, 1010, 10, 50, 9, 170, 33, undefined, 2).map(lock),
      ...ringFlowers,
      lock(S({ shape: "ellipse", x: cx - 232, y: cy - 232, width: 464, height: 464, fill: M.cream })),
      I({ x: cx - 220, y: cy - 220, width: 440, height: 440, mask: "ellipse", placeholderFill: "#2a6070", borderColor: M.yellow, borderWidth: 6 }),
      T("Ven a bailar con nosotros", 1010, { fontFamily: "Yeseva One", fontSize: 54, lineHeight: 1.1, fill: M.yellow }),
      T("Bring your dancing shoes, a big appetite and", 1092, { fontFamily: "Jost", fontWeight: 400, fontSize: 28, fill: M.cream }),
      T("your brightest smile. We cannot wait to", 1132, { fontFamily: "Jost", fontWeight: 400, fontSize: 28, fill: M.cream }),
      T("celebrate with you!", 1172, { fontFamily: "Jost", fontWeight: 400, fontSize: 28, fill: M.cream }),
      ...lights(),
      tiles(),
    ],
    "Photo",
  );

  return {
    slug: "mexican-papel-picado",
    name: "Mexican Papel Picado",
    tagline: "Vivid Mexican fiesta wedding invitation with papel picado banners and marigolds",
    description:
      "A joyful Mexican wedding invitation with cut-paper papel picado banners, a marigold garland and a hand-painted talavera tile border on deep teal. Made for fiesta weddings, destination celebrations and colourful Latin-inspired receptions.",
    categories: ["cultural", "festive"],
    keywords: ["mexican wedding invitation", "papel picado wedding invite", "fiesta wedding card template", "marigold garland invitation", "talavera tile wedding invitation", "colorful latin wedding invite"],
    palette: ["#0e3748", "#f0307f", "#ff8a1f", "#ffd23f", "#1f4fa3"],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
