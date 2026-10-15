import { rainbow } from "../design/ornaments";
import { GUEST_TOKEN } from "../design/types";
import type { Layer } from "../design/types";
import { H, I, linear, lock, O, P, S, T, W, type TemplateDef } from "./kit";
import { dot, heartAt, sparkAt, starAt } from "./birthday-balloons-bold.art";
import { cloud, glitter, INK, PASTELS, PINK, unicorn } from "./unicorn-rainbow-birthday.art";

const BG = linear(90, [0, "#cdd9ff"], [0.5, "#f1dcff"], [1, "#ffe2ef"]);
const RAINBOW = linear(0, [0, "#ff7eb6"], [0.25, "#ffb36b"], [0.5, "#9be3b4"], [0.75, "#6fc3ff"], [1, "#a98bff"]);
const GLIT = ["#ffffff", "#ffffff", "#fff3a8", "#ffc2e0", "#bfe3ff"];

const arc = (cx: number, y: number, size: number, op = 1): Layer =>
  lock(O(rainbow({ colors: PASTELS, size, band: size / 15 }), { x: cx - size / 2, y, opacity: op }));

const label = (text: string, y: number, o: Record<string, unknown> = {}) =>
  T(text, y, { x: 150, width: 700, fontFamily: "Poppins", fontWeight: 700, fontSize: 22, letterSpacing: 9, uppercase: true, fill: INK, ...o });

const pill = (x: number, y: number, w: number, h: number, accent: string): Layer[] => [
  lock(S({ x: x + 6, y: y + 8, width: w, height: h, cornerRadius: h / 2, fill: "#b9a2ff", opacity: 0.55 })),
  lock(S({ x, y, width: w, height: h, cornerRadius: h / 2, fill: "#ffffff", stroke: accent, strokeWidth: 5 })),
];

export default function build(): TemplateDef {
  /* --------------------------------- cover --------------------------------- */
  const cover = P(
    BG,
    [
      glitter(3, 90, [10, 10, 990, 1390], GLIT, (x, y) => x > 300 && x < 700 && y > 560 && y < 900),
      arc(500, 330, 940),
      cloud(110, 820, 280),
      cloud(895, 780, 300),
      cloud(250, 1000, 190, "#ffffff", 0.85),
      cloud(790, 990, 200, "#ffffff", 0.85),
      ...unicorn(500, 770, 225),
      starAt(205, 520, 56, "#ffd24a", -12),
      starAt(800, 560, 46, "#ff8fc0", 14),
      sparkAt(150, 300, 40, "#ffffff"),
      sparkAt(850, 320, 44, "#ffffff"),
      label("Come to my magical", 52, { fontSize: 21 }),
      T("Unicorn", 82, { x: 40, width: 920, fontFamily: "Abril Fatface", fontSize: 150, lineHeight: 1.05, fill: RAINBOW, shadow: { color: "#ffffff", blur: 0, offsetX: 5, offsetY: 6, opacity: 0.9 } }),
      T("Birthday Party", 232, { x: 100, width: 800, fontFamily: "Dancing Script", fontWeight: 700, fontSize: 76, lineHeight: 1.1, fill: INK }),
      ...pill(130, 1085, 740, 130, "#ff8fc0"),
      T("Zara turns 6!", 1098, { x: 150, width: 700, fontFamily: "Abril Fatface", fontSize: 62, lineHeight: 1.1, fill: PINK }),
      T("Sunday, April 11  ·  3 PM", 1170, { x: 150, width: 700, fontFamily: "Poppins", fontWeight: 700, fontSize: 28, fill: INK }),
      T("Rainbow Hall, 21 Meadow Road", 1245, { x: 150, width: 700, fontFamily: "Poppins", fontWeight: 600, fontSize: 24, fill: INK, opacity: 0.8 }),
      T(GUEST_TOKEN, 1305, { x: 220, width: 560, fontFamily: "Dancing Script", fontWeight: 700, fontSize: 50, lineHeight: 1.1, fill: INK }),
    ],
    "Invitation",
  );

  /* -------------------------------- details -------------------------------- */
  const row = (y: number, c: string, head: string, big: string, small: string, icon: Layer[]): Layer[] => [
    ...pill(110, y, 780, 190, c),
    dot(230, y + 95, 120, c, 1, "#ffffff", 6),
    ...icon,
    T(head, y + 28, { x: 320, width: 540, align: "left", fontFamily: "Poppins", fontWeight: 700, fontSize: 19, letterSpacing: 7, uppercase: true, fill: INK, opacity: 0.65 }),
    T(big, y + 56, { x: 320, width: 540, align: "left", fontFamily: "Abril Fatface", fontSize: 50, lineHeight: 1.1, fill: INK }),
    T(small, y + 130, { x: 320, width: 540, align: "left", fontFamily: "Poppins", fontWeight: 500, fontSize: 24, fill: INK, opacity: 0.85 }),
  ];
  const details = P(
    BG,
    [
      glitter(9, 70, [10, 10, 990, 1390], GLIT, (x, y) => x > 90 && x < 910 && y > 140 && y < 1130),
      cloud(120, 90, 230, "#ffffff", 0.9),
      cloud(880, 70, 250, "#ffffff", 0.9),
      T("The Details", 150, { x: 80, width: 840, fontFamily: "Abril Fatface", fontSize: 112, lineHeight: 1.1, fill: INK, shadow: { color: "#ffffff", blur: 0, offsetX: 4, offsetY: 5, opacity: 0.9 } }),
      ...row(330, "#ff8fc0", "When", "Sun, April 11", "Magic begins at 3:00 PM", [starAt(230, 425, 66, "#ffffff", 0)]),
      ...row(550, "#7cc4ff", "Where", "Rainbow Hall", "21 Meadow Road, Brookfield", [sparkAt(230, 645, 78, "#ffffff")]),
      ...row(770, "#b69cff", "Dress code", "Sparkle & Shine", "Wear your most magical outfit", [heartAt(230, 865, 62, "#ffffff", 0)]),
      T("Unicorn crafts, cake & glitter games!", 1005, { x: 80, width: 840, fontFamily: "Dancing Script", fontWeight: 700, fontSize: 54, lineHeight: 1.1, fill: PINK }),
      arc(500, 1065, 560, 0.9),
      cloud(150, 1300, 260),
      cloud(850, 1300, 260),
      ...unicorn(500, 1290, 100),
    ],
    "Details",
  );

  /* ------------------------------ photo page ------------------------------ */
  const photo = P(
    BG,
    [
      glitter(15, 90, [10, 10, 990, 1390], GLIT, (x, y) => x > 250 && x < 750 && y > 150 && y < 800),
      arc(500, 190, 760, 0.9),
      cloud(110, 960, 270),
      cloud(890, 980, 270),
      ...unicorn(500, 600, 235, { photo: true }),
      I({ x: 500 - 205, y: 600 - 205, width: 410, height: 410, mask: "ellipse", placeholderFill: "#e9dcff" }),
      starAt(170, 330, 50, "#ffd24a", -10),
      starAt(830, 350, 40, "#ff8fc0", 12),
      sparkAt(230, 880, 40, "#ffffff"),
      sparkAt(780, 890, 40, "#ffffff"),
      T("Zara is turning 6!", 1060, { x: 60, width: 880, fontFamily: "Abril Fatface", fontSize: 88, lineHeight: 1.1, fill: PINK, shadow: { color: "#ffffff", blur: 0, offsetX: 4, offsetY: 5, opacity: 0.9 } }),
      T("Join us for rainbows, cake and sparkles.", 1190, { x: 100, width: 800, fontFamily: "Poppins", fontWeight: 600, fontSize: 26, fill: INK }),
      T("It will not be magical without you!", 1230, { x: 100, width: 800, fontFamily: "Poppins", fontWeight: 600, fontSize: 26, fill: INK }),
      heartAt(500, 1320, 42, "#ff8fc0", 0),
    ],
    "Photo",
  );

  return {
    slug: "unicorn-rainbow-birthday",
    name: "Unicorn Rainbow",
    tagline: "Magical unicorn birthday invitation with a pastel rainbow mane and glitter",
    description:
      "A dreamy unicorn birthday party invitation with a pastel rainbow mane, golden horn, fluffy clouds and sparkling glitter. Ideal for a girl's magical rainbow birthday celebration.",
    categories: ["kids", "birthday"],
    keywords: ["unicorn birthday invitation template", "rainbow unicorn party invite", "magical girl birthday invitation", "pastel unicorn kids party card", "glitter unicorn birthday invite"],
    palette: ["#cdd9ff", "#ff9ec7", "#ffc59b", "#9ad7ff", "#5a3a9e"],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
