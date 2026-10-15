import { archFrame, divider, sunburst } from "../design/ornaments";
import { glowBlob, stack } from "./eid-iftar-lanterns.art";
import { alponaBand, alponaRosette, dhak, dhunuchi, lotus } from "./puja-boishakh-festive.art";
import { H, I, linear, lock, O, P, S, T, W, type TemplateDef } from "./kit";

const RED = "#c1121f";
const RED_D = "#8f0d17";
const INK = "#4a1418";
const CREAM = "#fdf5e4";
const GOLD = "#d9a441";
const cream = linear(180, [0, "#fffaf0"], [1, "#fbefd6"]);
const redBg = linear(180, [0, "#a60f1b"], [0.5, "#c1121f"], [1, "#8f0d17"]);

const frame = (stroke: string, w = 5) => [
  lock(S({ shape: "rect", x: 34, y: 34, width: 932, height: 1332, fill: null, stroke, strokeWidth: w })),
  lock(S({ shape: "rect", x: 52, y: 52, width: 896, height: 1296, fill: null, stroke, strokeWidth: 1.6 })),
];

export default function build(): TemplateDef {
  const sunDisc = lock(S({ shape: "ellipse", x: 300, y: 300, width: 400, height: 400, fill: { kind: "radial", stops: [[0, "#e0222d"], [0.7, "#c1121f"], [1, "#9b0c17"]] }, stroke: null }));
  const cover = P(
    cream,
    [
      ...frame(RED),
      lock(O(alponaBand({ color: RED, w: 860, h: 100 }), { x: 70, y: 72, width: 860 })),
      lock(O(alponaBand({ color: RED, w: 860, h: 100 }), { x: 70, y: 1228, width: 860 })),
      T("Dear {to},", 196, { x: 250, width: 500, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 30, fill: RED_D }),
      lock(O(sunburst({ color: RED, rays: 36, size: 540, core: 0.78 }), { cx: 500, y: 230, width: 540, opacity: 0.9 })),
      lock(S({ shape: "ellipse", x: 285, y: 285, width: 430, height: 430, fill: "#fffaf0", stroke: null })),
      sunDisc,
      lock(O(alponaRosette({ color: "#fdf5e4", size: 360, sw: 1.8 }), { cx: 500, y: 320, width: 360, opacity: 0.22 })),
      lock(S({ shape: "ellipse", x: 316, y: 316, width: 368, height: 368, fill: null, stroke: "#fdf5e4", strokeWidth: 1.8 })),
      T("শুভ নববর্ষ", 430, { x: 300, width: 400, fontFamily: "Tiro Bangla", fontSize: 84, fill: "#fffaf0", lineHeight: 1.2, shadow: { color: "#5a0008", blur: 10, offsetX: 0, offsetY: 3, opacity: 0.5 } }),
      T("১৪৩৪", 548, { x: 350, width: 300, fontFamily: "Tiro Bangla", fontSize: 50, fill: "#ffe3a0", lineHeight: 1.2 }),
      lock(O(divider({ style: "diamond", w: 200, color: "#fdf5e4", strokeWidth: 1.6 }), { cx: 500, y: 616, width: 200 })),
      T("Pohela Boishakh", 770, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 600, fontSize: 78, fill: RED }),
      T("Shubho Noboborsho Celebration", 868, { x: 150, width: 700, fontFamily: "Cinzel", fontWeight: 500, fontSize: 22, fill: INK, letterSpacing: 8, uppercase: true }),
      lock(O(divider({ style: "leaf", w: 300, color: RED }), { cx: W / 2, y: 918, width: 300 })),
      T("An afternoon of music, panta-ilish and festivity", 976, { x: 130, width: 740, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 29, fill: INK }),
      T("Wednesday", 1040, { x: 250, width: 500, fontFamily: "Jost", fontWeight: 500, fontSize: 16, fill: RED_D, letterSpacing: 10, uppercase: true }),
      T("14 · 04 · 2027", 1068, { x: 200, width: 600, fontFamily: "Cinzel", fontWeight: 600, fontSize: 44, fill: RED }),
      T("From eleven in the morning", 1130, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontSize: 27, fill: INK }),
      T("Shapla Community Hall · Dhanmondi, Dhaka", 1176, { x: 150, width: 700, fontFamily: "Jost", fontWeight: 400, fontSize: 17, fill: RED_D, letterSpacing: 3 }),
    ],
    "Invitation",
  );

  const st = stack(
    [
      { label: "Songs & Dance", title: "11:00 AM", sub: "Rabindra sangeet, folk music and dance" },
      { label: "Boishakhi Feast", title: "1:00 PM", sub: "Panta bhat, ilish, bhorta and mishti" },
      { label: "Mela & Adda", title: "3:00 PM", sub: "Fair stalls, games and conversation" },
      { label: "Dress Code", title: "Red & white", sub: "Sarees, panjabis and Boishakhi colours", titleSize: 36 },
    ],
    {
      y0: 420,
      x: 170,
      width: 660,
      labelFont: "Jost",
      labelFill: "#ffd9a8",
      labelSize: 16,
      labelSpacing: 9,
      labelWeight: 500,
      titleFont: "Cinzel",
      titleFill: "#fffaf0",
      titleWeight: 600,
      titleSize: 40,
      subFont: "Cormorant Garamond",
      subItalic: true,
      subWeight: 500,
      subSize: 27,
      subFill: "#fde6d0",
      gap: 30,
      between: (y) => lock(O(divider({ style: "floral", w: 220, color: "#ffd9a8", strokeWidth: 1.6 }), { cx: W / 2, y, width: 220 })),
      betweenGap: 52,
    },
  );
  const details = P(
    redBg,
    [
      glowBlob(500, 300, 420, "255,120,90", 0.3),
      ...frame("#fdf5e4"),
      lock(O(alponaBand({ color: "#fdf5e4", w: 860, h: 100 }), { x: 70, y: 72, width: 860 })),
      lock(O(alponaBand({ color: "#fdf5e4", w: 860, h: 100 }), { x: 70, y: 1228, width: 860 })),
      T("অনুষ্ঠানসূচি", 214, { x: 200, width: 600, fontFamily: "Tiro Bangla", fontSize: 76, fill: "#fffaf0", lineHeight: 1.2 }),
      T("The Celebration", 318, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 52, fill: "#ffd9a8" }),
      lock(O(divider({ style: "diamond", w: 340, color: "#fdf5e4" }), { cx: W / 2, y: 384, width: 340 })),
      ...st.layers,
      lock(O(dhak({ color: "#fdf5e4", pom: "#ffd9a8", sw: 3 }), { cx: 190, y: 190, width: 190 })),
      lock(O(dhunuchi({ color: "#fdf5e4", glow: "#ffd9a8", sw: 3.4 }), { cx: 815, y: 170, width: 130 })),
    ],
    "Details",
  );

  const photo = P(
    cream,
    [
      ...frame(RED),
      lock(O(alponaBand({ color: RED, w: 860, h: 100 }), { x: 70, y: 72, width: 860 })),
      lock(O(alponaBand({ color: RED, w: 860, h: 100 }), { x: 70, y: 1228, width: 860 })),
      lock(O(archFrame({ w: 520, h: 700, stroke: RED, strokeWidth: 4, lines: 3, gap: 12, fill: "#fff6e6" }), { cx: 500, y: 214, width: 520 })),
      I({ x: 260, y: 250, width: 480, height: 640, mask: "arch", placeholderFill: "#f3d6c2" }),
      lock(O(lotus({ a: RED, b: "#e04450", line: "#fdf5e4", size: 240 }), { cx: 500, y: 830, width: 240 })),
      lock(O(dhak({ color: RED, pom: GOLD, sw: 3 }), { cx: 130, y: 500, width: 150 })),
      lock(O(dhunuchi({ color: RED, glow: GOLD, sw: 3.4 }), { cx: 872, y: 470, width: 110 })),
      T("শুভ নববর্ষ", 1018, { x: 200, width: 600, fontFamily: "Tiro Bangla", fontSize: 62, fill: RED, lineHeight: 1.2 }),
      T("May the new year bring joy, health and prosperity", 1102, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 29, fill: INK, lineHeight: 1.35 }),
      T("The Chowdhury Family", 1160, { x: 200, width: 600, fontFamily: "Cinzel", fontWeight: 500, fontSize: 20, fill: RED_D, letterSpacing: 8, uppercase: true }),
    ],
    "Greetings",
  );

  return {
    slug: "puja-boishakh-festive",
    name: "Boishakhi Alpona",
    tagline: "Red-and-white alpona Pohela Boishakh and Bengali festive invitation",
    description:
      "A festive Pohela Boishakh and Shubho Noboborsho invitation in traditional red and white with a rising-sun medallion, alpona borders, lotus, dhak and dhunuchi motifs and Bengali calligraphy.",
    categories: ["festive", "bengali", "cultural", "classic"],
    keywords: ["pohela boishakh invitation card", "shubho noboborsho invite template", "bengali new year party invitation", "red and white alpona invitation", "bengali festive gathering card"],
    palette: ["#c1121f", "#8f0d17", "#fdf5e4", "#d9a441", "#4a1418"],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
