import { banner, sunburst } from "../design/ornaments";
import { GUEST_TOKEN } from "../design/types";
import type { Layer, Paint } from "../design/types";
import { H, I, linear, lock, O, P, S, T, W, type TemplateDef } from "./kit";
import { balloon, BALLOONS, bunting, confetti, dot, heartAt, sparkAt, starAt } from "./birthday-balloons-bold.art";

const NAVY = "#2a1a66";
const SUN = linear(90, [0, "#ffe35c"], [1, "#ffb43c"]);
const CONF = ["#ff3d6a", "#2d9cff", "#2fd58b", "#8b5cf6", "#ffffff", "#ff8a1f", "#ff6fb5", "#19c9c0"];

/** Chunky extruded text: stacked dark copies behind a bright face. */
interface ExtrudeOpts {
  x: number;
  y: number;
  width: number;
  fontSize: number;
  font: string;
  faceFill: Paint;
  side?: string;
  depth?: number;
  lh?: number;
}
function extrude(text: string, o: ExtrudeOpts): Layer[] {
  const out: Layer[] = [];
  const depth = o.depth ?? 14;
  for (let i = depth; i >= 1; i--) {
    out.push(
      lock(T(text, o.y + i * 1.5, { x: o.x + i * 1.5, width: o.width, fontFamily: o.font, fontSize: o.fontSize, lineHeight: o.lh ?? 1, fill: o.side ?? NAVY })),
    );
  }
  out.push(lock(T(text, o.y, { x: o.x, width: o.width, fontFamily: o.font, fontSize: o.fontSize, lineHeight: o.lh ?? 1, fill: o.faceFill })));
  return out;
}

const label = (text: string, y: number, o: Record<string, unknown> = {}) =>
  T(text, y, { x: 150, width: 700, fontFamily: "Poppins", fontWeight: 700, fontSize: 22, letterSpacing: 9, uppercase: true, fill: NAVY, ...o });

export default function build(): TemplateDef {
  const rays = lock(O(sunburst({ color: "#ffffff", rays: 22, size: 1500, core: 0.06 }), { x: 500 - 750, y: 560 - 750, opacity: 0.3 }));
  const sticker = (x: number, y: number, w: number, h: number, fill: string, r = 36): Layer[] => [
    lock(S({ x: x + 9, y: y + 10, width: w, height: h, cornerRadius: r, fill: NAVY })),
    lock(S({ x, y, width: w, height: h, cornerRadius: r, fill, stroke: NAVY, strokeWidth: 5 })),
  ];

  /* --------------------------------- cover --------------------------------- */
  const cover = P(
    SUN,
    [
      rays,
      confetti({ seed: 11, count: 120, colors: CONF, area: [20, 20, 980, 1380], skip: (x, y) => (x > 280 && x < 720 && y > 40 && y < 250) || (x > 170 && x < 830 && y > 830 && y < 1290) }),
      // left balloon cluster
      balloon(120, 470, 82, 100, BALLOONS.blue, { tilt: -8, stringTo: [150, 1040], stringBend: 36 }),
      balloon(235, 640, 72, 88, BALLOONS.green, { tilt: 6, stringTo: [150, 1040], stringBend: -30 }),
      balloon(95, 700, 66, 82, BALLOONS.purple, { tilt: -4, stringTo: [150, 1040], stringBend: 24 }),
      // right cluster
      balloon(885, 430, 80, 98, BALLOONS.red, { tilt: 9, stringTo: [850, 1040], stringBend: -34 }),
      balloon(775, 640, 74, 90, BALLOONS.orange, { tilt: -7, stringTo: [850, 1040], stringBend: 30 }),
      balloon(905, 700, 66, 82, BALLOONS.teal, { tilt: 5, stringTo: [850, 1040], stringBend: -20 }),
      // tie point bows
      lock(S({ shape: "ellipse", x: 134, y: 1030, width: 32, height: 22, fill: "#ff3d6a", stroke: NAVY, strokeWidth: 3 })),
      lock(S({ shape: "ellipse", x: 834, y: 1030, width: 32, height: 22, fill: "#ff3d6a", stroke: NAVY, strokeWidth: 3 })),
      label("You're invited to a", 62, { fontSize: 20 }),
      ...extrude("Let's Party!", { x: 40, y: 92, width: 920, fontSize: 136, font: "Abril Fatface", depth: 6, faceFill: "#ffffff", side: NAVY, lh: 1.1 }),
      ...extrude("7", { x: 200, y: 200, width: 600, fontSize: 680, font: "Abril Fatface", depth: 16, faceFill: linear(90, [0, "#ff7aa8"], [1, "#ff2f6d"]), side: NAVY, lh: 1 }),
      starAt(350, 330, 54, "#ffffff", -12),
      sparkAt(690, 300, 46, "#ffffff"),
      sparkAt(700, 700, 30, "#ffffff", 0.9),
      // banner
      lock(O(banner({ color: "#2d9cff", w: 780, h: 112, stroke: NAVY }), { cx: W / 2, y: 830 })),
      T("Emma's Birthday Bash", 858, { x: 200, width: 600, fontFamily: "Abril Fatface", fontSize: 44, lineHeight: 1.1, fill: "#ffffff" }),
      T("Saturday, June 14  ·  2 PM", 985, { x: 180, width: 640, fontFamily: "Poppins", fontWeight: 700, fontSize: 36, fill: NAVY }),
      T("Sunny Park Pavilion", 1047, { x: 180, width: 640, fontFamily: "Poppins", fontWeight: 600, fontSize: 28, fill: NAVY }),
      T("48 Maple Street, Riverdale", 1091, { x: 180, width: 640, fontFamily: "Poppins", fontWeight: 500, fontSize: 22, fill: NAVY, opacity: 0.75 }),
      T("Cake  ·  Games  ·  Piñata  ·  Fun", 1165, { x: 180, width: 640, fontFamily: "Outfit", fontWeight: 600, fontSize: 22, letterSpacing: 4, uppercase: true, fill: "#d9264f" }),
      T(GUEST_TOKEN, 1235, { x: 220, width: 560, fontFamily: "Abril Fatface", fontSize: 46, lineHeight: 1.1, fill: NAVY }),
    ],
    "Invitation",
  );

  /* -------------------------------- details -------------------------------- */
  const card = (y: number, fill: string, head: string, big: string, small: string, icon: Layer[]): Layer[] => [
    ...sticker(130, y, 740, 200, fill),
    ...icon,
    T(head, y + 28, { x: 315, width: 520, align: "left", fontFamily: "Poppins", fontWeight: 700, fontSize: 19, letterSpacing: 7, uppercase: true, fill: NAVY, opacity: 0.7 }),
    T(big, y + 58, { x: 315, width: 540, align: "left", fontFamily: "Abril Fatface", fontSize: 54, lineHeight: 1.1, fill: NAVY }),
    T(small, y + 134, { x: 315, width: 540, align: "left", fontFamily: "Poppins", fontWeight: 500, fontSize: 24, fill: NAVY, opacity: 0.85 }),
  ];
  const badge = (cx: number, cy: number, color: string, inner: Layer[]): Layer[] => [dot(cx + 5, cy + 6, 118, NAVY), dot(cx, cy, 118, color, 1, NAVY, 5), ...inner];

  const details = P(
    SUN,
    [
      rays,
      confetti({ seed: 23, count: 70, colors: CONF, area: [20, 150, 980, 1380], skip: (x, y) => (x > 100 && x < 900 && y < 310) || x > 110 && x < 900 && y > 280 && y < 1130 }),
      bunting(-20, 28, 1020, 28, 54, ["#ff3d6a", "#2d9cff", "#ffd23f", "#2fd58b", "#8b5cf6", "#ff8a1f"], 14, 62),
      T("The Details", 150, { x: 100, width: 800, fontFamily: "Abril Fatface", fontSize: 108, lineHeight: 1.1, fill: NAVY }),
      T("Everything you need to know", 282, { x: 150, width: 700, fontFamily: "Poppins", fontWeight: 600, fontSize: 24, fill: NAVY, opacity: 0.8 }),
      ...card(360, "#ffffff", "When", "Sat, June 14", "Doors open at 2:00 PM", badge(228, 460, "#ff6fb5", [starAt(228, 460, 62, "#ffffff", 0)])),
      ...card(600, "#9ee6ff", "Where", "Sunny Park", "48 Maple Street, Riverdale", badge(228, 700, "#2fd58b", [dot(228, 692, 40, "#ffffff"), dot(228, 692, 16, "#2fd58b"), lock(S({ x: 218, y: 716, width: 20, height: 26, fill: "#ffffff", cornerRadius: 4 }))])),
      ...card(840, "#ffffff", "Dress code", "Bright & Comfy", "Wear your favourite colours", badge(228, 940, "#8b5cf6", [heartAt(228, 940, 62, "#ffffff")])),
      T("Pizza, cake, games & a piñata!", 1118, { x: 100, width: 800, fontFamily: "Abril Fatface", fontSize: 50, lineHeight: 1.1, fill: "#d9264f" }),
      T("Come hungry and ready to play", 1190, { x: 150, width: 700, fontFamily: "Poppins", fontWeight: 600, fontSize: 26, fill: NAVY }),
      balloon(110, 1290, 52, 64, BALLOONS.red, { tilt: -8 }),
      balloon(180, 1320, 46, 57, BALLOONS.blue, { tilt: 6 }),
      balloon(890, 1290, 52, 64, BALLOONS.green, { tilt: 8 }),
      balloon(820, 1320, 46, 57, BALLOONS.purple, { tilt: -6 }),
    ],
    "Details",
  );

  /* ------------------------------ photo page ------------------------------ */
  const photo = P(
    SUN,
    [
      lock(O(sunburst({ color: "#ffffff", rays: 22, size: 1500, core: 0.06 }), { x: 500 - 750, y: 640 - 750, opacity: 0.3 })),
      confetti({ seed: 37, count: 80, colors: CONF, area: [20, 20, 980, 1380], skip: (x, y) => x > 150 && x < 850 && y > 150 && y < 1120 }),
      bunting(-20, 28, 1020, 28, 54, ["#2d9cff", "#ff3d6a", "#2fd58b", "#ffd23f", "#8b5cf6", "#ff8a1f"], 14, 62),
      label("Meet the birthday star", 170, { fontSize: 22 }),
      dot(505, 700, 600, NAVY),
      dot(500, 690, 600, "#ffffff", 1, NAVY, 6),
      I({ x: 220, y: 410, width: 560, height: 560, mask: "ellipse", placeholderFill: "#ffb6d3" }),
      balloon(150, 470, 74, 91, BALLOONS.pink, { tilt: -10, stringTo: [175, 900], stringBend: 22 }),
      balloon(860, 480, 74, 91, BALLOONS.blue, { tilt: 10, stringTo: [825, 900], stringBend: -22 }),
      balloon(110, 700, 60, 74, BALLOONS.yellow, { tilt: 4, stringTo: [105, 990], stringBend: 16 }),
      balloon(895, 720, 60, 74, BALLOONS.green, { tilt: -4, stringTo: [895, 990], stringBend: -16 }),
      starAt(500, 372, 60, "#ff3d6a", 0),
      sparkAt(240, 300, 40, "#ffffff"),
      sparkAt(780, 280, 34, "#ffffff"),
      T("Emma turns 7!", 1060, { x: 80, width: 840, fontFamily: "Abril Fatface", fontSize: 98, lineHeight: 1.1, fill: NAVY }),
      T("Join us for pizza, cake, games and a", 1190, { x: 150, width: 700, fontFamily: "Poppins", fontWeight: 600, fontSize: 26, fill: NAVY }),
      T("giant piñata. It wouldn't be a party without you!", 1228, { x: 100, width: 800, fontFamily: "Poppins", fontWeight: 600, fontSize: 26, fill: NAVY }),
      heartAt(500, 1320, 40, "#ff3d6a", 0),
    ],
    "Photo",
  );

  return {
    slug: "birthday-balloons-bold",
    name: "Balloons Bold",
    tagline: "Bright kids' birthday invitation with balloons and a giant age number",
    description:
      "A bold, colourful kids and teen birthday party invitation with glossy balloons, confetti, bunting and a huge extruded age number. Perfect for a 'Let's Party!' celebration.",
    categories: ["birthday", "party", "festive"],
    keywords: ["kids birthday invitation template", "balloon birthday party invitation", "colorful birthday invite with age number", "7th birthday party invitation", "teen birthday invitation card"],
    palette: ["#ffd84a", "#ff3d6a", "#2d9cff", "#2fd58b", "#2a1a66"],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
