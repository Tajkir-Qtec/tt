import { GUEST_TOKEN } from "../design/types";
import type { Layer } from "../design/types";
import { rings } from "../design/ornaments";
import { H, I, linear, lock, O, P, S, T, W, radial, type TemplateDef } from "./kit";
import { J, crane, deckle, indigoBg, sakuraPetals, seigaiha, senbazuru, washiBg, washiFibers } from "./japanese-washi-crane.art";

const RED_C: [string, string] = ["#e8695c", "#8e1c14"];
const INDIGO_C: [string, string] = ["#5b78d0", "#101a3c"];
const GOLD_C: [string, string] = ["#ecd08a", "#8a6420"];
const PINK_C: [string, string] = ["#f9d0d9", "#c0788a"];
const WHITE_C: [string, string] = ["#ffffff", "#c9bfa9"];

const cap = (text: string, y: number, o: Record<string, unknown> = {}) =>
  T(text, y, { fontFamily: "Tenor Sans", fontSize: 22, letterSpacing: 10, uppercase: true, fill: J.red, ...o });
const serif = { fontFamily: "Cormorant Garamond", fill: J.indigo } as const;

const band = (yTop: number, rows: number, red = false): Layer =>
  lock(seigaiha(0, 1000, yTop, 44, rows, red ? [J.red, "#f4eee0"] : [J.indigo, "#ebe4d2"], red ? "#7a1a12" : "#0e1636"));

export default function build(): TemplateDef {
  /* --------------------------------- cover --------------------------------- */
  const sun = lock(S({ shape: "ellipse", x: 330, y: 150, width: 340, height: 340, fill: linear(90, [0, "#dc4a3c"], [1, "#b42a20"]) }));
  const sunGlow = lock(S({ shape: "ellipse", x: 270, y: 90, width: 460, height: 460, fill: radial([0, "rgba(200,55,45,0.16)"], [1, "rgba(200,55,45,0)"]) }));
  const cover = P(
    washiBg,
    [
      ...washiFibers(3, [0, 0, 1000, 1400], 340).map(lock),
      sunGlow,
      sun,
      lock(crane(500, 320, 330, "#ffffff", "#c9bfa9", -6)),
      ...senbazuru(92, -20, 1050, 5, [RED_C, INDIGO_C, GOLD_C, PINK_C]),
      ...senbazuru(908, -20, 1050, 9, [INDIGO_C, PINK_C, RED_C, GOLD_C]),
      lock(sakuraPetals(11, [150, 500, 850, 1150], 22)),
      cap("The wedding of", 545, { fontSize: 22 }),
      T("Aiko & Haruto", 590, { ...serif, fontWeight: 500, fontSize: 104, lineHeight: 1.1, x: 140, width: 720 }),
      lock(S({ x: 440, y: 724, width: 120, height: 3, fill: J.red })),
      T("Saturday, 3 April 2027", 765, { fontFamily: "Tenor Sans", fontSize: 30, letterSpacing: 6, uppercase: true, fill: J.ink }),
      T("Hanami Garden Hall  ·  Kyoto", 822, { ...serif, italic: true, fontSize: 34, fill: J.indigoL }),
      T(GUEST_TOKEN, 890, { fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 42, fill: J.red, lineHeight: 1.1 }),
      lock(S({ x: 460, y: 1030, width: 80, height: 80, fill: J.red, cornerRadius: 10 })),
      lock(O(rings({ color: "#fbeee0", size: 52, strokeWidth: 4 }), { cx: 500, y: 1044 })),
      lock(S({ x: 0, y: 1190, width: 1000, height: 6, fill: J.red })),
      band(1202, 6),
    ],
    "Invitation",
  );

  /* -------------------------------- details -------------------------------- */
  const row = (y: number, time: string, ap: string, title: string, sub: string): Layer[] => [
    T(time, y, { x: 150, width: 230, ...serif, fontWeight: 600, fontSize: 62, lineHeight: 1.05 }),
    T(ap, y + 68, { x: 150, width: 230, fontFamily: "Tenor Sans", fontSize: 20, letterSpacing: 8, fill: J.red }),
    lock(S({ x: 408, y: y + 4, width: 3, height: 104, fill: J.red })),
    T(title, y + 4, { x: 440, width: 420, align: "left", ...serif, fontWeight: 600, fontSize: 44, lineHeight: 1.1 }),
    T(sub, y + 58, { x: 440, width: 420, align: "left", ...serif, italic: true, fontSize: 29, lineHeight: 1.2, fill: J.ink }),
  ];
  const details = P(
    indigoBg,
    [
      ...washiFibers(21, [0, 0, 1000, 1400], 260, "#9fb0ea", 0.28, "#6c80c4").map(lock),
      ...deckle(105, 110, 790, 1010, 4, "#f6f1e4").map(lock),
      ...washiFibers(22, [110, 115, 890, 1115], 190, "#ffffff", 0.7).map(lock),
      lock(sakuraPetals(31, [110, 120, 890, 1110], 12, (x, y) => y > 340 && y < 980 && x > 140 && x < 870)),
      cap("The day", 190, { fontSize: 22 }),
      T("Ceremony & Banquet", 235, { ...serif, fontWeight: 500, fontSize: 82, lineHeight: 1.1 }),
      lock(S({ x: 440, y: 345, width: 120, height: 3, fill: J.red })),
      T("Saturday, 3 April 2027", 372, { fontFamily: "Tenor Sans", fontSize: 26, letterSpacing: 6, uppercase: true, fill: J.ink }),
      ...row(450, "11:00", "AM", "Ceremony", "A shinzen-style vow beneath the cherry trees"),
      ...row(610, "12:30", "PM", "Kaiseki Banquet", "A seasonal multi-course feast and sake toast"),
      ...row(770, "3:00", "PM", "Tea & Farewell", "Matcha, sweets and a small gift of thanks"),
      T("Formal attire  ·  kimono and yukata welcome", 950, { x: 140, width: 720, ...serif, italic: true, fontSize: 31, fill: J.indigoL }),
      T("Hanami Garden Hall, Higashiyama, Kyoto", 1020, { x: 140, width: 720, fontFamily: "Tenor Sans", fontSize: 22, letterSpacing: 3, fill: J.red }),
      lock(crane(800, 118, 190, "#ffffff", "#9a8f7a", -12, true)),
      lock(S({ x: 0, y: 1190, width: 1000, height: 6, fill: "#f4eee0" })),
      band(1202, 6, true),
    ],
    "Details",
  );

  /* ------------------------------ photo page ------------------------------ */
  const photo = P(
    washiBg,
    [
      ...washiFibers(41, [0, 0, 1000, 1400], 340).map(lock),
      lock(S({ shape: "ellipse", x: 236, y: 170, width: 528, height: 528, fill: linear(90, [0, "#dc4a3c"], [1, "#b42a20"]) })),
      I({ x: 258, y: 192, width: 484, height: 484, mask: "ellipse", placeholderFill: "#e6dcc4", borderColor: "#f6f1e4", borderWidth: 6 }),
      lock(crane(170, 330, 190, INDIGO_C[0], INDIGO_C[1], -14)),
      lock(crane(840, 250, 120, GOLD_C[0], GOLD_C[1], 10, true)),
      lock(crane(850, 640, 170, RED_C[0], RED_C[1], 12, true)),
      lock(crane(150, 640, 100, PINK_C[0], PINK_C[1], -8)),
      lock(sakuraPetals(51, [30, 60, 970, 1150], 26, (x, y) => Math.hypot(x - 500, y - 434) < 300 || (y > 720 && y < 1180 && x > 140 && x < 860))),
      cap("With gratitude", 760, { fontSize: 22 }),
      T("Arigatō", 805, { ...serif, fontWeight: 500, italic: true, fontSize: 112, lineHeight: 1.1 }),
      lock(S({ x: 440, y: 945, width: 120, height: 3, fill: J.red })),
      T("Come share the joy of our day beneath the", 975, { x: 100, width: 800, ...serif, fontSize: 33, fill: J.ink }),
      T("blossoms. Your presence is the finest", 1020, { x: 100, width: 800, ...serif, fontSize: 33, fill: J.ink }),
      T("gift we could ask for.", 1065, { x: 100, width: 800, ...serif, fontSize: 33, fill: J.ink }),
      T("Aiko & Haruto", 1125, { ...serif, italic: true, fontSize: 44, fill: J.red }),
      lock(S({ x: 0, y: 1214, width: 1000, height: 6, fill: J.red })),
      band(1226, 5),
    ],
    "Photo",
  );

  void WHITE_C;
  void H;
  return {
    slug: "japanese-washi-crane",
    name: "Japanese Washi Crane",
    tagline: "Minimal Japanese wedding invitation with origami cranes and seigaiha waves",
    description:
      "A serene Japanese wedding invitation on washi paper with a vermilion sun, folded origami cranes, falling cherry blossoms and an indigo seigaiha wave band inspired by kimono patterns. Ideal for Japanese-inspired, minimalist and hanami weddings.",
    categories: ["cultural", "minimal"],
    keywords: ["japanese wedding invitation", "origami crane wedding invite", "washi paper invitation template", "seigaiha kimono pattern card", "cherry blossom minimalist wedding", "indigo and red wedding invitation"],
    palette: ["#f4eee0", "#1b2a5c", "#2f4690", "#c8372d", "#f1b7c5"],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
