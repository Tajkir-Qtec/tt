import { sunburst } from "../design/ornaments";
import { Path } from "../design/path";
import { GUEST_TOKEN } from "../design/types";
import type { Layer, Paint } from "../design/types";
import { H, I, linear, lock, O, P, S, T, W, type TemplateDef } from "./kit";
import { place } from "./birthday-balloons-bold.art";
import { bubble, burst, halftone, hero, INK, NAVY, RED, skyline, YEL } from "./superhero-comic-birthday.art";

const BG = linear(90, [0, "#ffe13a"], [1, "#ffc400"]);
const CREAM = "#fff6c8";

interface ExOpts {
  x: number;
  y: number;
  width: number;
  size: number;
  face: Paint;
  depth?: number;
  font?: string;
  ls?: number;
  rot?: number;
}
/** Chunky comic type: stacked black copies behind a bright face. */
function extrude(text: string, o: ExOpts): Layer[] {
  const out: Layer[] = [];
  const d = o.depth ?? 9;
  const base = { width: o.width, fontFamily: o.font ?? "Bebas Neue", fontSize: o.size, lineHeight: 1, letterSpacing: o.ls ?? 2, rotation: o.rot ?? 0 };
  for (let i = d; i >= 1; i--) out.push(lock(T(text, o.y + i, { ...base, x: o.x + i, fill: INK })));
  out.push(T(text, o.y, { ...base, x: o.x, fill: o.face }));
  return out;
}

const box = (x: number, y: number, w: number, h: number, fill = "#ffffff", rot = 0, r = 6): Layer[] => [
  lock(S({ x: x + 9, y: y + 10, width: w, height: h, cornerRadius: r, fill: INK, rotation: rot })),
  lock(S({ x, y, width: w, height: h, cornerRadius: r, fill, stroke: INK, strokeWidth: 6, rotation: rot })),
];

const ribbon = (x: number, y: number, w: number, h: number, fill: string): Layer => {
  const sk = h * 0.28;
  const sh = new Path().poly([[x + sk + 8, y + 9], [x + w + 8, y + 9], [x + w - sk + 8, y + h + 9], [x + 8, y + h + 9]], true);
  const face = new Path().poly([[x + sk, y], [x + w, y], [x + w - sk, y + h], [x, y + h]], true);
  return place([{ path: sh, fill: INK }, { path: face, fill, stroke: INK, strokeWidth: 6, lineJoin: "miter" }], 8);
};


const rays = (cy: number, op = 0.5) => lock(O(sunburst({ color: "#fff3a0", rays: 26, size: 1700, core: 0.04 }), { x: 500 - 850, y: cy - 850, opacity: op }));
const dotsA = (): Layer => halftone([0, 0, 1000, 1400], 34, 11, RED, (x, y) => 1.15 - Math.hypot(x - 500, y - 700) / 650, 0.55);

export default function build(): TemplateDef {
  /* --------------------------------- cover --------------------------------- */
  const cover = P(
    BG,
    [
      rays(720),
      dotsA(),
      ...skyline(4, 1085, 300, NAVY, "#3c56b8"),
      burst(185, 640, 190, RED, "#ff8a3d", 3, 13, 8),
      burst(825, 580, 150, "#2f78ff", "#7cc4ff", 8, 12, -6),
      T("POW!", 592, { x: 35, width: 300, fontFamily: "Bebas Neue", fontSize: 112, letterSpacing: 3, fill: "#ffffff", rotation: -10, shadow: { color: INK, blur: 0, offsetX: 5, offsetY: 6, opacity: 1 } }),
      T("ZAP!", 540, { x: 675, width: 300, fontFamily: "Bebas Neue", fontSize: 86, letterSpacing: 3, fill: YEL, rotation: 8, shadow: { color: INK, blur: 0, offsetX: 4, offsetY: 5, opacity: 1 } }),
      ...hero(500, 1100, 290),
      ...box(250, 50, 500, 58, "#ffffff", -2),
      T("You're invited to a", 62, { x: 250, width: 500, fontFamily: "Bebas Neue", fontSize: 40, letterSpacing: 6, fill: INK, rotation: -2 }),
      ...extrude("SUPERHERO", { x: 30, y: 128, width: 940, size: 255, face: linear(90, [0, "#ff5a5f"], [1, RED]), depth: 11, ls: 4 }),
      ribbon(190, 392, 620, 92, "#1f5fe0"),
      T("BIRTHDAY BASH", 396, { x: 190, width: 620, fontFamily: "Bebas Neue", fontSize: 78, letterSpacing: 8, fill: "#ffffff" }),
      ...box(90, 1125, 820, 205, "#ffffff", 0),
      T("RAYAN TURNS 7!", 1136, { x: 90, width: 820, fontFamily: "Bebas Neue", fontSize: 76, letterSpacing: 5, fill: RED }),
      T("Saturday, July 10  ·  4 PM", 1215, { x: 90, width: 820, fontFamily: "Poppins", fontWeight: 800, fontSize: 31, fill: INK }),
      T("Hero HQ Play Arena, 8 Park Avenue", 1265, { x: 90, width: 820, fontFamily: "Poppins", fontWeight: 600, fontSize: 24, fill: INK, opacity: 0.8 }),
      T(GUEST_TOKEN, 1346, { x: 220, width: 560, fontFamily: "Bebas Neue", fontSize: 40, letterSpacing: 5, fill: NAVY, shadow: { color: "#ffffff", blur: 0, offsetX: 2, offsetY: 3, opacity: 0.9 } }),
    ],
    "Invitation",
  );

  /* -------------------------------- details -------------------------------- */
  const panel = (y: number, rot: number, color: string, tag: string, big: string, small: string, hl: Paint): Layer[] => [
    ...box(110, y, 780, 215, "#ffffff", rot),
    lock(S({ x: 110, y, width: 150, height: 215, cornerRadius: 6, fill: color, stroke: INK, strokeWidth: 6, rotation: rot })),
    T(tag, y + 76, { x: 110, width: 150, fontFamily: "Bebas Neue", fontSize: 54, letterSpacing: 3, fill: hl, rotation: rot, shadow: { color: INK, blur: 0, offsetX: 3, offsetY: 4, opacity: 1 } }),
    T(big, y + 34, { x: 290, width: 580, align: "left", fontFamily: "Bebas Neue", fontSize: 80, letterSpacing: 2, fill: INK, rotation: rot }),
    T(small, y + 128, { x: 290, width: 580, align: "left", fontFamily: "Poppins", fontWeight: 600, fontSize: 25, fill: INK, opacity: 0.85, rotation: rot }),
  ];
  const details = P(
    BG,
    [
      rays(400, 0.45),
      halftone([0, 0, 1000, 1400], 34, 11, RED, (x, y) => (y < 240 ? 1.1 - y / 260 : y > 1100 ? (y - 1100) / 250 : 0), 0.55),
      ...box(250, 55, 500, 56, "#ffffff", 0),
      T("Top secret", 66, { x: 250, width: 500, fontFamily: "Bebas Neue", fontSize: 40, letterSpacing: 8, fill: RED }),
      ...extrude("MISSION BRIEFING", { x: 40, y: 135, width: 920, size: 150, face: "#ffffff", depth: 9, ls: 3 }),
      ...panel(340, -1.2, RED, "WHEN", "SAT, JULY 10", "Mission starts at 4:00 PM sharp", YEL),
      ...panel(600, 1, "#1f5fe0", "WHERE", "HERO HQ PLAY ARENA", "8 Park Avenue, Brookfield", YEL),
      ...panel(860, -1, "#16a05a", "GEAR", "COME AS A HERO", "Capes and masks are welcome!", "#ffffff"),
      burst(820, 1215, 110, RED, "#ff8a3d", 21, 12, 10),
      T("BAM!", 1176, { x: 720, width: 200, fontFamily: "Bebas Neue", fontSize: 70, letterSpacing: 2, fill: "#ffffff", rotation: 8, shadow: { color: INK, blur: 0, offsetX: 4, offsetY: 4, opacity: 1 } }),
      T("Pizza, cake, games & a", 1155, { x: 60, width: 640, fontFamily: "Bebas Neue", fontSize: 58, letterSpacing: 3, fill: INK }),
      T("hero training course!", 1215, { x: 60, width: 640, fontFamily: "Bebas Neue", fontSize: 58, letterSpacing: 3, fill: RED }),
      ...skyline(9, 1400, 120, NAVY, "#3c56b8"),
    ],
    "Details",
  );

  /* ------------------------------ photo page ------------------------------ */
  const photo = P(
    BG,
    [
      rays(620, 0.5),
      dotsA(),
      burst(500, 600, 470, RED, "#ff8a3d", 33, 16, 4),
      ...box(205, 215, 590, 590, "#ffffff", -2),
      I({ x: 225, y: 235, width: 550, height: 550, rotation: -2, placeholderFill: "#ffe9a8" }),
      lock(S({ x: 225, y: 235, width: 550, height: 550, rotation: -2, fill: null, stroke: INK, strokeWidth: 5 })),
      ...box(220, 90, 560, 90, "#ffffff", -1.5),
      T("MEET OUR HERO", 100, { x: 220, width: 560, fontFamily: "Bebas Neue", fontSize: 76, letterSpacing: 6, fill: RED, rotation: -1.5 }),
      burst(830, 270, 100, "#2f78ff", "#7cc4ff", 12, 12, 6),
      T("7", 205, { x: 750, width: 160, fontFamily: "Bebas Neue", fontSize: 140, fill: "#ffffff", rotation: 6, shadow: { color: INK, blur: 0, offsetX: 5, offsetY: 6, opacity: 1 } }),
      bubble(500, 975, 320, 80, 400, 1085),
      T("Join the hero squad!", 940, { x: 200, width: 600, fontFamily: "Bebas Neue", fontSize: 64, letterSpacing: 4, fill: INK }),
      ...hero(215, 1400, 105),
      ...hero(785, 1400, 105).slice(0),
      T("Rayan needs YOU to help save the day", 1138, { x: 120, width: 760, fontFamily: "Poppins", fontWeight: 700, fontSize: 26, fill: INK }),
      T("with cake, games and heroic fun!", 1176, { x: 120, width: 760, fontFamily: "Poppins", fontWeight: 700, fontSize: 26, fill: INK }),
    ],
    "Photo",
  );
  void CREAM;
  void H;

  return {
    slug: "superhero-comic-birthday",
    name: "Superhero Comic",
    tagline: "Comic-book superhero birthday invitation with halftone dots and POW bursts",
    description:
      "A bold comic-book superhero birthday party invitation with halftone dots, POW and ZAP bursts, a caped hero and a city skyline. Perfect for a boy's or girl's superhero themed birthday.",
    categories: ["kids", "birthday"],
    keywords: ["superhero birthday invitation template", "comic book birthday party invite", "caped hero kids party card", "pow zap superhero invitation", "boys superhero birthday invite"],
    palette: ["#ffd60a", "#e8222e", "#1f5fe0", "#14246b", "#14141c"],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
