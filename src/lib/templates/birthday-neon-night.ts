import { GUEST_TOKEN } from "../design/types";
import type { Layer, TextLayer } from "../design/types";
import { sunburst } from "../design/ornaments";
import { H, I, linear, lock, O, P, S, T, W, type TemplateDef } from "./kit";
import { discoBall, floorGrid, glowSpark, hline, neon, rectPath } from "./birthday-neon-night.art";
import { confetti } from "./birthday-balloons-bold.art";

const PINK = "#ff3fcf";
const CYAN = "#37efff";
const VIOLET = "#9d6bff";
const WHITE = "#fff4ff";
const BG = linear(90, [0, "#1f0d4d"], [0.55, "#150837"], [1, "#0b0420"]);

type Glow = { color: string; blur?: number; op?: number };
const glow = (g: Glow): TextLayer["shadow"] => ({ color: g.color, blur: g.blur ?? 28, offsetX: 0, offsetY: 0, opacity: g.op ?? 0.95 });

const neonText = (text: string, y: number, size: number, color: string, o: Record<string, unknown> = {}, g: Glow = { color }) =>
  T(text, y, { x: 40, width: 920, fontFamily: "Bebas Neue", fontSize: size, lineHeight: 1, fill: WHITE, shadow: glow(g), ...o });

const label = (text: string, y: number, color = CYAN, o: Record<string, unknown> = {}) =>
  T(text, y, { x: 100, width: 800, fontFamily: "Outfit", fontWeight: 600, fontSize: 22, letterSpacing: 11, uppercase: true, fill: color, shadow: glow({ color, blur: 12, op: 0.8 }), ...o });

const rays = (y: number): Layer =>
  lock(O(sunburst({ color: "#b86bff", rays: 26, size: 1700, core: 0.05 }), { x: 500 - 850, y: y - 850, opacity: 0.1 }));

export default function build(): TemplateDef {
  const stars = (seed: number, n: number, skip: (x: number, y: number) => boolean) =>
    confetti({ seed, count: n, colors: [PINK, CYAN, "#ffffff", VIOLET], area: [20, 20, 980, 1180], skip, size: 0.55, opacity: 0.8 });

  const floor = (): Layer[] => [
    lock(S({ x: 0, y: 1190, width: 1000, height: 210, fill: linear(90, [0, "#2b0a5a"], [1, "#0b0420"]) })),
    ...floorGrid(500, 1190, 1190, 1400, PINK, 20, 6),
    hline(-40, 1040, 1190, CYAN, 3),
  ];

  /* --------------------------------- cover --------------------------------- */
  const cover = P(
    BG,
    [
      rays(260),
      stars(3, 60, (x, y) => (x > 330 && x < 670 && y < 440) || (x > 60 && x < 940 && y > 440 && y < 1140)),
      ...discoBall(500, 245, 150, -20),
      ...glowSpark(190, 210, 56, PINK),
      ...glowSpark(820, 330, 70, CYAN),
      ...glowSpark(140, 520, 34, CYAN),
      ...glowSpark(880, 120, 36, PINK),
      T("Alex's", 368, { x: 100, width: 800, fontFamily: "Sacramento", fontSize: 130, lineHeight: 1, fill: WHITE, shadow: glow({ color: CYAN, blur: 24 }) }),
      neonText("BIRTHDAY", 470, 250, PINK, { fontSize: 250 }, { color: PINK, blur: 34 }),
      neonText("BASH", 665, 300, CYAN, { fontSize: 300 }, { color: CYAN, blur: 36 }),
      lock(neon(rectPath(150, 985, 700, 78, 39), PINK, 3)),
      T("SAT  ·  NOV 22  ·  10 PM", 1000, { x: 150, width: 700, fontFamily: "Outfit", fontWeight: 600, fontSize: 38, letterSpacing: 5, fill: WHITE, shadow: glow({ color: PINK, blur: 14, op: 0.7 }) }),
      label("Club Aurora  ·  88 Neon Street", 1082, WHITE, { fontSize: 22, letterSpacing: 6 }),
      T(GUEST_TOKEN, 1115, { x: 250, width: 500, fontFamily: "Sacramento", fontSize: 54, lineHeight: 1, fill: WHITE, shadow: glow({ color: CYAN, blur: 16, op: 0.8 }) }),
      ...floor(),
    ],
    "Invitation",
  );

  /* -------------------------------- details -------------------------------- */
  const row = (y: number, time: string, ap: string, title: string, note: string, color: string): Layer[] => [
    lock(neon(rectPath(120, y, 760, 150, 22), color, 2.4)),
    T(time, y + 24, { x: 150, width: 200, align: "left", fontFamily: "Bebas Neue", fontSize: 84, lineHeight: 1, fill: WHITE, shadow: glow({ color, blur: 22 }) }),
    T(ap, y + 104, { x: 152, width: 200, align: "left", fontFamily: "Outfit", fontWeight: 600, fontSize: 22, letterSpacing: 8, fill: color }),
    lock(S({ x: 350, y: y + 28, width: 2, height: 94, fill: color, opacity: 0.7 })),
    T(title, y + 32, { x: 385, width: 480, align: "left", fontFamily: "Bebas Neue", fontSize: 60, letterSpacing: 2, lineHeight: 1, fill: WHITE }),
    T(note, y + 98, { x: 385, width: 480, align: "left", fontFamily: "Outfit", fontWeight: 400, fontSize: 24, fill: "#cdbff0" }),
  ];

  const details = P(
    BG,
    [
      rays(200),
      stars(5, 50, (x, y) => (x > 90 && x < 910 && y > 330 && y < 1140) || (x > 150 && x < 850 && y < 330)),
      ...discoBall(500, 90, 70, -30),
      ...glowSpark(160, 160, 40, PINK),
      ...glowSpark(850, 210, 46, CYAN),
      label("The plan for the night", 200, CYAN),
      neonText("TONIGHT'S SET", 240, 150, PINK, { fontSize: 150 }, { color: PINK, blur: 30 }),
      ...row(420, "10", "PM", "DOORS OPEN", "welcome drinks & glow wristbands", CYAN),
      ...row(600, "11", "PM", "DJ SET", "dance floor takes over", PINK),
      ...row(780, "1", "AM", "AFTER PARTY", "late-night bites & karaoke", VIOLET),
      label("Dress code", 975, CYAN, { fontSize: 18 }),
      neonText("NEON & BLACK", 1005, 90, CYAN, { fontSize: 90 }, { color: CYAN, blur: 22, op: 0.8 }),
      T("Club Aurora  ·  88 Neon Street  ·  21+", 1105, { x: 100, width: 800, fontFamily: "Outfit", fontWeight: 500, fontSize: 22, letterSpacing: 5, uppercase: true, fill: "#cdbff0" }),
      ...floor(),
    ],
    "Details",
  );

  /* ------------------------------ photo page ------------------------------ */
  const photo = P(
    BG,
    [
      rays(620),
      stars(9, 50, (x, y) => (x > 90 && x < 910 && y > 230 && y < 1140) || (x > 150 && x < 850 && y < 230)),
      ...discoBall(500, 90, 70, -30),
      ...glowSpark(150, 330, 44, CYAN),
      ...glowSpark(860, 1000, 50, PINK),
      label("Last year's glow", 205, PINK),
      neonText("THE NIGHT", 240, 120, CYAN, { fontSize: 120 }, { color: CYAN, blur: 28 }),
      lock(neon(rectPath(165, 380, 670, 590, 28), PINK, 4)),
      I({ x: 185, y: 400, width: 630, height: 550, mask: "rounded", cornerRadius: 18, placeholderFill: "#3a1d7a" }),
      hline(205, 795, 1005, CYAN, 2),
      T("Capture the night. Wear something that sparkles.", 1035, { x: 150, width: 700, fontFamily: "Outfit", fontWeight: 500, fontSize: 28, lineHeight: 1.3, fill: WHITE }),
      neonText("SEE YOU ON THE DANCE FLOOR", 1100, 54, PINK, { fontSize: 54, letterSpacing: 4 }, { color: PINK, blur: 18, op: 0.8 }),
      ...floor(),
    ],
    "Photo",
  );

  return {
    slug: "birthday-neon-night",
    name: "Neon Night",
    tagline: "Glowing neon birthday party invitation with a disco ball",
    description:
      "A club-poster style birthday invitation with a faceted disco ball, neon pink and cyan glowing type and a synthwave dance floor on deep indigo. Made for a night-out birthday bash.",
    categories: ["birthday", "party", "dark", "modern"],
    keywords: ["neon birthday invitation template", "disco birthday party invitation", "night out birthday invite", "club party invitation card", "21st birthday neon invitation"],
    palette: ["#150837", "#ff3fcf", "#37efff", "#9d6bff", "#fff4ff"],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
