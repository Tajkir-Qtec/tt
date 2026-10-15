import { GUEST_TOKEN } from "../design/types";
import type { Layer, Paint } from "../design/types";
import { H, I, linear, lock, P, S, T, W, type TemplateDef } from "./kit";
import { balloon, BALLOONS, confetti, dot, heartAt, sparkAt, starAt } from "./birthday-balloons-bold.art";
import { BLUE, BLUE_D, burst, INK, PINK, PINK_D, popper, splitBackdrop } from "./gender-reveal-he-or-she.art";

const CONF = [PINK, BLUE, "#ffffff", "#ffd86b", "#ff9fc8", "#8cc8ff"];
const sh = { color: "#3a2a66", blur: 0, offsetX: 4, offsetY: 6, opacity: 0.35 };

const label = (text: string, y: number, o: Record<string, unknown> = {}) =>
  T(text, y, { x: 150, width: 700, fontFamily: "Poppins", fontWeight: 700, fontSize: 22, letterSpacing: 9, uppercase: true, fill: INK, ...o });

const card = (x: number, y: number, w: number, h: number, r = 40, fill = "#ffffff"): Layer[] => [
  lock(S({ x: x + 8, y: y + 10, width: w, height: h, cornerRadius: r, fill: INK, opacity: 0.9 })),
  lock(S({ x, y, width: w, height: h, cornerRadius: r, fill, stroke: INK, strokeWidth: 4 })),
];

export default function build(): TemplateDef {
  /* --------------------------------- cover --------------------------------- */
  const cover = {
    bg: linear(90, [0, "#ffb3d1"], [1, "#8ec9ff"]),
    layers: [
      ...splitBackdrop(7),
      // giant question marks
      T("?", 430, { x: 0, width: 340, fontFamily: "Abril Fatface", fontSize: 480, lineHeight: 1, fill: "#ffffff", rotation: -12, shadow: { ...sh, offsetX: 8, offsetY: 10 } }),
      T("?", 430, { x: 660, width: 340, fontFamily: "Abril Fatface", fontSize: 480, lineHeight: 1, fill: "#ffffff", rotation: 12, shadow: { ...sh, offsetX: 8, offsetY: 10 } }),
      confetti({ seed: 5, count: 70, colors: CONF, area: [20, 20, 980, 1380], skip: (x, y) => x > 200 && x < 800 && y > 440 && y < 1120 }),
      label("Please join us for a", 70, { fill: "#ffffff", fontSize: 22, shadow: { ...sh, offsetX: 2, offsetY: 3, opacity: 0.4 } }),
      T("Gender", 112, { x: 60, width: 880, fontFamily: "Abril Fatface", fontSize: 150, lineHeight: 1, fill: "#ffffff", shadow: sh }),
      T("Reveal", 252, { x: 60, width: 880, fontFamily: "Abril Fatface", fontSize: 150, lineHeight: 1, fill: "#ffffff", shadow: sh }),
      // badge
      lock(S({ shape: "ellipse", x: 262, y: 478, width: 500, height: 480, fill: INK })),
      lock(S({ shape: "ellipse", x: 250, y: 466, width: 500, height: 480, fill: "#ffffff", stroke: INK, strokeWidth: 5 })),
      lock(S({ shape: "ellipse", x: 272, y: 488, width: 460, height: 436, fill: null, stroke: "#ffc2da", strokeWidth: 3, dash: [3, 12] })),
      T("HE", 512, { x: 250, width: 500, fontFamily: "Abril Fatface", fontSize: 150, lineHeight: 1, fill: linear(90, [0, "#6ab9ff"], [1, BLUE_D]) }),
      T("or", 668, { x: 250, width: 500, fontFamily: "Dancing Script", fontWeight: 700, fontSize: 78, lineHeight: 1, fill: INK }),
      T("SHE", 742, { x: 250, width: 500, fontFamily: "Abril Fatface", fontSize: 150, lineHeight: 1, fill: linear(90, [0, "#ff95c0"], [1, PINK_D]) }),
      starAt(300, 540, 46, "#ffd86b", -14),
      starAt(700, 880, 40, "#ffd86b", 12),
      sparkAt(705, 548, 34, "#ff9fc8"),
      sparkAt(298, 880, 34, "#6ab9ff"),
      // balloons
      balloon(125, 1000, 74, 92, BALLOONS.pink, { tilt: -8, stringTo: [150, 1330], stringBend: 28 }),
      balloon(235, 1090, 62, 77, BALLOONS.pink, { tilt: 6, stringTo: [150, 1330], stringBend: -24 }),
      balloon(70, 1130, 52, 64, BALLOONS.pink, { tilt: -4, stringTo: [150, 1330], stringBend: 18 }),
      balloon(875, 1000, 74, 92, BALLOONS.blue, { tilt: 8, stringTo: [850, 1330], stringBend: -28 }),
      balloon(765, 1090, 62, 77, BALLOONS.blue, { tilt: -6, stringTo: [850, 1330], stringBend: 24 }),
      balloon(930, 1130, 52, 64, BALLOONS.blue, { tilt: 4, stringTo: [850, 1330], stringBend: -18 }),
      // details
      T("Saturday, May 15  ·  4 PM", 985, { x: 200, width: 600, fontFamily: "Poppins", fontWeight: 700, fontSize: 32, fill: INK }),
      T("Ayesha & Rafi are expecting!", 1038, { x: 200, width: 600, fontFamily: "Dancing Script", fontWeight: 700, fontSize: 46, lineHeight: 1.1, fill: INK }),
      T("Rosewood Garden Lawn, 12 Elm Lane", 1100, { x: 200, width: 600, fontFamily: "Poppins", fontWeight: 600, fontSize: 22, fill: INK, opacity: 0.8 }),
      T(GUEST_TOKEN, 1240, { x: 250, width: 500, fontFamily: "Dancing Script", fontWeight: 700, fontSize: 56, lineHeight: 1.1, fill: "#ffffff", shadow: sh }),
    ] as Layer[],
  };

  /* -------------------------------- details -------------------------------- */
  const row = (y: number, head: string, big: string, small: string, c: string, icon: Layer[]): Layer[] => [
    ...card(120, y, 760, 190, 36),
    dot(235, y + 95, 120, INK),
    dot(230, y + 90, 120, c, 1, INK, 4),
    ...icon,
    T(head, y + 24, { x: 330, width: 520, align: "left", fontFamily: "Poppins", fontWeight: 700, fontSize: 19, letterSpacing: 7, uppercase: true, fill: INK, opacity: 0.6 }),
    T(big, y + 52, { x: 330, width: 530, align: "left", fontFamily: "Abril Fatface", fontSize: 48, lineHeight: 1.1, fill: INK }),
    T(small, y + 126, { x: 330, width: 530, align: "left", fontFamily: "Poppins", fontWeight: 500, fontSize: 23, fill: INK, opacity: 0.85 }),
  ];
  const details = {
    bg: "#fff8fc",
    layers: [
      ...splitBackdrop(21, 640, 360, false).map((l) => ({ ...l, opacity: 0.3 })),
      confetti({ seed: 31, count: 60, colors: CONF, area: [20, 20, 980, 1380], skip: (x, y) => x > 100 && x < 900 && y > 130 && y < 1090 }),
      label("Here is the plan", 80, { fontSize: 22 }),
      T("The Details", 118, { x: 80, width: 840, fontFamily: "Abril Fatface", fontSize: 120, lineHeight: 1, fill: INK }),
      ...row(310, "When", "Sat, May 15", "Guests arrive from 3:30 PM", PINK, [T("15", 350, { x: 170, width: 120, fontFamily: "Abril Fatface", fontSize: 62, fill: "#ffffff", lineHeight: 1 })]),
      ...row(530, "Where", "Rosewood Lawn", "12 Elm Lane, Greenfield", BLUE, [dot(230, 600, 44, "#ffffff"), dot(230, 600, 16, BLUE_D), lock(S({ x: 220, y: 622, width: 20, height: 28, fill: "#ffffff", cornerRadius: 4 }))]),
      ...row(750, "Cast your vote", "Team HE or Team SHE", "Wear blue or pink to show your guess", "#ffc23f", [heartAt(230, 840, 62, "#ffffff", 0)]),
      // vote chips
      ...card(120, 980, 360, 90, 45, "#cfe8ff"),
      T("Team HE", 1004, { x: 120, width: 360, fontFamily: "Abril Fatface", fontSize: 44, lineHeight: 1.1, fill: BLUE_D }),
      ...card(520, 980, 360, 90, 45, "#ffd3e5"),
      T("Team SHE", 1004, { x: 520, width: 360, fontFamily: "Abril Fatface", fontSize: 44, lineHeight: 1.1, fill: PINK_D }),
      T("Treats, games and a big pop of colour!", 1085, { x: 100, width: 800, fontFamily: "Dancing Script", fontWeight: 700, fontSize: 48, fill: INK }),
      // cannons
      burst(77, 200, 1255, 18, 90, 130, [PINK, "#ff9fc8", "#ffd86b", "#ffffff"], 34),
      burst(78, 800, 1255, -18, 90, 130, [BLUE, "#8cc8ff", "#ffd86b", "#ffffff"], 34),
      popper(160, 1420, 120, 18, PINK, PINK_D, "#ffd86b"),
      popper(840, 1420, 120, -18, BLUE, BLUE_D, "#ffd86b"),
    ] as Layer[],
  };

  /* ------------------------------ photo page ------------------------------ */
  const photo = {
    bg: linear(90, [0, "#ffd0e3"], [0.5, "#fff8fc"], [1, "#cfe8ff"]),
    layers: [
      confetti({ seed: 41, count: 80, colors: CONF, area: [20, 20, 980, 1380], skip: (x, y) => (x > 170 && x < 830 && y > 200 && y < 1270) || (x > 120 && x < 880 && y < 220) }),
      label("A little surprise is coming", 90, { fontSize: 22 }),
      T("Almost time!", 135, { x: 60, width: 880, fontFamily: "Dancing Script", fontWeight: 700, fontSize: 130, lineHeight: 1.1, fill: INK }),
      // split ring
      dot(505, 700, 640, INK),
      lock(S({ shape: "ellipse", x: 180, y: 370, width: 640, height: 640, fill: linear(90, [0, PINK], [0.499, PINK], [0.5, BLUE], [1, BLUE]), stroke: INK, strokeWidth: 6 })),
      dot(500, 690, 560, "#ffffff"),
      I({ x: 230, y: 420, width: 540, height: 540, mask: "ellipse", placeholderFill: "#ffe3ef" }),
      balloon(110, 520, 66, 82, BALLOONS.pink, { tilt: -10, stringTo: [140, 1000], stringBend: 20 }),
      balloon(890, 520, 66, 82, BALLOONS.blue, { tilt: 10, stringTo: [860, 1000], stringBend: -20 }),
      starAt(500, 372, 58, "#ffd86b", 0),
      sparkAt(250, 300, 38, "#ff9fc8"),
      sparkAt(760, 290, 38, "#6ab9ff"),
      T("Ayesha & Rafi", 1070, { x: 80, width: 840, fontFamily: "Abril Fatface", fontSize: 92, lineHeight: 1.1, fill: INK }),
      T("Our family is growing, and we can't", 1196, { x: 100, width: 800, fontFamily: "Poppins", fontWeight: 600, fontSize: 25, fill: INK }),
      T("wait to find out together with you.", 1232, { x: 100, width: 800, fontFamily: "Poppins", fontWeight: 600, fontSize: 25, fill: INK }),
      heartAt(440, 1320, 38, PINK, -8),
      heartAt(560, 1320, 38, BLUE, 8),
    ] as Layer[],
  };

  const mk = (p: { bg: Paint; layers: Layer[] }, name: string) => P(p.bg, p.layers, name);
  return {
    slug: "gender-reveal-he-or-she",
    name: "He or She Reveal",
    tagline: "Playful pink-vs-blue gender reveal invitation with balloons and confetti cannons",
    description:
      "A playful gender reveal party invitation with a pink and blue split, big question marks, balloons and confetti cannons. Ask guests to vote Team He or Team She for a baby reveal they will remember.",
    categories: ["baby", "party"],
    keywords: ["gender reveal invitation template", "he or she baby reveal party invite", "pink and blue gender reveal card", "team boy or team girl invitation", "baby gender reveal confetti cannon invite"],
    palette: ["#ff7eb0", "#4aa8ff", "#ffffff", "#ffd86b", "#3a2a66"],
    width: W,
    height: H,
    pages: [mk(cover, "Invitation"), mk(details, "Details"), mk(photo, "Photo")],
  };
}

