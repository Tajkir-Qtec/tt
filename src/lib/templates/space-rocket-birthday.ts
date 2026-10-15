import { GUEST_TOKEN } from "../design/types";
import type { Layer } from "../design/types";
import { H, I, linear, lock, P, S, T, W, type TemplateDef } from "./kit";
import { sparkAt, starAt } from "./birthday-balloons-bold.art";
import { CORAL, CYAN, GOLD, helmet, orbit, ORANGE, planet, rocket, stars } from "./space-rocket-birthday.art";

const BG = linear(90, [0, "#070b2e"], [0.55, "#1d1470"], [1, "#4a1d8c"]);
const GOLDTXT = linear(90, [0, "#fff1a0"], [0.5, "#ffc93c"], [1, "#ff8a3d"]);

const SATURN = { light: "#ffe7b0", base: "#ffb454", dark: "#c46a2a", bands: [{ y: -0.45, h: 0.18, color: "#ffd88a" }, { y: -0.05, h: 0.22, color: "#e58a3a" }, { y: 0.4, h: 0.16, color: "#ffd88a" }], ring: { color: "#ffe6a8", color2: "#ff9a52", tilt: -18 }, glow: "#ffb454" };
const EARTH = { light: "#9bf0ff", base: "#2f8cff", dark: "#1a2f9a", glow: "#5de0ff", bands: [{ y: -0.5, h: 0.3, color: "#46d68a" }, { y: 0.1, h: 0.22, color: "#46d68a" }], craters: [] };
const MOON = { light: "#fffbe8", base: "#d9d6e6", dark: "#8d88ab", craters: [{ x: -0.3, y: -0.25, r: 0.2 }, { x: 0.35, y: 0.1, r: 0.15 }, { x: -0.1, y: 0.45, r: 0.12 }, { x: 0.25, y: -0.5, r: 0.09 }], glow: "#ffffff" };
const MARS = { light: "#ffb08a", base: "#ff6a4a", dark: "#a82a2a", craters: [{ x: -0.25, y: 0.2, r: 0.18 }, { x: 0.3, y: -0.2, r: 0.12 }], glow: "#ff6a4a" };
const PURPLE = { light: "#e7b8ff", base: "#a35bff", dark: "#4a1d9a", bands: [{ y: -0.3, h: 0.15, color: "#ff8fd0" }, { y: 0.2, h: 0.2, color: "#7a3fe0" }], glow: "#a35bff" };

const label = (text: string, y: number, o: Record<string, unknown> = {}) =>
  T(text, y, { x: 150, width: 700, fontFamily: "Poppins", fontWeight: 700, fontSize: 22, letterSpacing: 9, uppercase: true, fill: CYAN, ...o });

const glass = (x: number, y: number, w: number, h: number, glow: string, r = 36): Layer[] => [
  lock(S({ x, y, width: w, height: h, cornerRadius: r, fill: "#141a6a", opacity: 0.78 })),
  lock(S({ x, y, width: w, height: h, cornerRadius: r, fill: null, stroke: glow, strokeWidth: 4 })),
  lock(S({ x: x + 10, y: y + 10, width: w - 20, height: h - 20, cornerRadius: r - 8, fill: null, stroke: glow, strokeWidth: 1.5, dash: [4, 8], opacity: 0.7 })),
];

export default function build(): TemplateDef {
  /* --------------------------------- cover --------------------------------- */
  const cover = P(
    BG,
    [
      stars(5, 150, [10, 10, 990, 1390], (x, y) => (x > 120 && x < 880 && y > 290 && y < 380) || (x > 90 && x < 910 && y > 1090 && y < 1330)),
      orbit(500, 760, 520, 190, -22, "#8a96ff", 0.4),
      orbit(500, 760, 400, 130, -22, "#8a96ff", 0.3),
      ...planet(150, 1010, 170, SATURN),
      ...planet(860, 520, 85, EARTH),
      ...planet(870, 1010, 60, MOON),
      ...planet(110, 560, 38, MARS),
      ...planet(300, 410, 26, PURPLE),
      ...rocket(565, 690, 205, 28),
      starAt(250, 800, 46, GOLD, 12),
      sparkAt(790, 790, 44, "#ffffff"),
      sparkAt(380, 520, 36, "#ffffff"),
      label("3  ·  2  ·  1", 55, { fontSize: 24, letterSpacing: 14 }),
      T("BLAST OFF!", 90, { x: 40, width: 920, fontFamily: "Bebas Neue", fontSize: 236, lineHeight: 1, letterSpacing: 6, fill: GOLDTXT, shadow: { color: "#ff5d6c", blur: 0, offsetX: 6, offsetY: 8, opacity: 1 } }),
      T("Ayaan's Space Adventure", 318, { x: 60, width: 880, fontFamily: "Fraunces", fontWeight: 600, italic: true, fontSize: 52, lineHeight: 1.1, fill: "#ffffff" }),
      ...glass(100, 1100, 800, 215, CYAN),
      T("AYAAN TURNS 5!", 1114, { x: 100, width: 800, fontFamily: "Bebas Neue", fontSize: 76, letterSpacing: 6, fill: GOLD }),
      T("Saturday, September 11  ·  11 AM", 1195, { x: 100, width: 800, fontFamily: "Poppins", fontWeight: 700, fontSize: 29, fill: "#ffffff" }),
      T("Galaxy Adventure Park, 5 Orbit Lane", 1245, { x: 100, width: 800, fontFamily: "Poppins", fontWeight: 500, fontSize: 24, fill: "#c9d2ff" }),
      T(GUEST_TOKEN, 1335, { x: 200, width: 600, fontFamily: "Fraunces", fontWeight: 600, italic: true, fontSize: 44, lineHeight: 1.1, fill: GOLD }),
    ],
    "Invitation",
  );

  /* -------------------------------- details -------------------------------- */
  const row = (y: number, glow: string, head: string, big: string, small: string, icon: Layer[]): Layer[] => [
    ...glass(100, y, 800, 190, glow),
    ...icon,
    T(head, y + 26, { x: 330, width: 540, align: "left", fontFamily: "Poppins", fontWeight: 700, fontSize: 19, letterSpacing: 7, uppercase: true, fill: glow }),
    T(big, y + 52, { x: 330, width: 540, align: "left", fontFamily: "Bebas Neue", fontSize: 76, letterSpacing: 3, fill: "#ffffff" }),
    T(small, y + 136, { x: 330, width: 540, align: "left", fontFamily: "Poppins", fontWeight: 500, fontSize: 24, fill: "#c9d2ff" }),
  ];
  const details = P(
    BG,
    [
      stars(15, 120, [10, 10, 990, 1390], (x, y) => (x > 150 && x < 850 && y < 260) || (x > 60 && x < 940 && y > 940 && y < 1070) || x > 90 && x < 910 && y > 300 && y < 1090),
      orbit(500, 120, 640, 120, 8, "#8a96ff", 0.35),
      ...planet(915, 85, 40, MARS),
      ...planet(85, 90, 36, MOON),
      label("Mission control", 70, { fontSize: 22 }),
      T("FLIGHT PLAN", 112, { x: 60, width: 880, fontFamily: "Bebas Neue", fontSize: 150, letterSpacing: 6, fill: GOLDTXT, shadow: { color: "#ff5d6c", blur: 0, offsetX: 4, offsetY: 6, opacity: 1 } }),
      ...row(310, GOLD, "Launch date", "SAT, SEPT 11", "Countdown starts at 11:00 AM", planet(215, 405, 52, MOON)),
      ...row(530, CYAN, "Launch pad", "GALAXY PARK", "Galaxy Adventure Park, 5 Orbit Lane", planet(215, 625, 52, EARTH)),
      ...row(750, CORAL, "Crew uniform", "ASTRONAUT SUITS", "Or wear your favourite space colours", planet(215, 845, 52, PURPLE)),
      T("Moon bounce, rocket crafts, star cake", 975, { x: 60, width: 880, fontFamily: "Fraunces", fontWeight: 600, italic: true, fontSize: 40, lineHeight: 1.1, fill: "#ffffff" }),
      T("and a trip around the solar system!", 1030, { x: 60, width: 880, fontFamily: "Fraunces", fontWeight: 600, italic: true, fontSize: 40, lineHeight: 1.1, fill: GOLD }),
      ...planet(160, 1290, 90, SATURN),
      ...rocket(640, 1250, 120, 38),
      starAt(860, 1310, 44, GOLD, 8),
      sparkAt(420, 1230, 36, "#ffffff"),
    ],
    "Details",
  );

  /* ------------------------------ photo page ------------------------------ */
  const hm = helmet(500, 590, 330);
  const photo = P(
    BG,
    [
      stars(25, 140, [10, 10, 990, 1390], (x, y) => (x > 200 && x < 800 && (y < 110 || (y > 990 && y < 1200))) || x > 130 && x < 870 && y > 250 && y < 960),
      orbit(500, 600, 480, 470, 0, "#8a96ff", 0.3),
      ...planet(150, 220, 70, SATURN),
      ...planet(870, 250, 52, EARTH),
      ...planet(120, 1010, 46, MARS),
      ...planet(880, 1000, 62, MOON),
      ...hm.back,
      I({ x: 500 - 215, y: 590 - 190, width: 430, height: 380, mask: "ellipse", placeholderFill: "#3b2a9e" }),
      ...hm.front,
      starAt(160, 560, 38, GOLD, 10),
      sparkAt(850, 520, 40, "#ffffff"),
      label("Our little astronaut", 55, { fontSize: 22 }),
      T("Houston, we have a party!", 1010, { x: 60, width: 880, fontFamily: "Bebas Neue", fontSize: 84, letterSpacing: 3, fill: GOLDTXT, shadow: { color: "#ff5d6c", blur: 0, offsetX: 4, offsetY: 5, opacity: 1 } }),
      T("Ayaan is turning 5 and we need our", 1135, { x: 100, width: 800, fontFamily: "Poppins", fontWeight: 600, fontSize: 26, fill: "#ffffff" }),
      T("favourite space crew on board. Join the mission!", 1173, { x: 80, width: 840, fontFamily: "Poppins", fontWeight: 600, fontSize: 26, fill: "#ffffff" }),
      starAt(440, 1310, 30, GOLD, 0),
      starAt(500, 1310, 40, GOLD, 0),
      starAt(560, 1310, 30, GOLD, 0),
    ],
    "Photo",
  );
  void ORANGE;

  return {
    slug: "space-rocket-birthday",
    name: "Space Rocket",
    tagline: "Blast-off space adventure birthday invitation with rockets, planets and an astronaut helmet",
    description:
      "A cosmic space adventure kids birthday party invitation with a rocket, ringed planets, twinkling stars and an astronaut helmet photo frame. Perfect for a boy's or girl's outer space birthday.",
    categories: ["kids", "birthday", "celestial"],
    keywords: ["space birthday invitation template", "rocket ship birthday party invite", "astronaut kids birthday card", "outer space party invitation", "planets and stars birthday invite"],
    palette: ["#070b2e", "#4a1d8c", "#ffd24a", "#5de0ff", "#ff5d6c"],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
