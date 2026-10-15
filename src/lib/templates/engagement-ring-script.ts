import { archFrame, divider } from "../design/ornaments";
import { GUEST_TOKEN } from "../design/types";
import type { Layer } from "../design/types";
import { CHAMPAGNE_GOLD, heartShape, put, shine, solitaire, swash } from "./engagement-ring-script.art";
import { H, I, linear, lock, O, P, radial, S, T, W, type TemplateDef } from "./kit";

const BLUSH = "#f8e1de";
const BLUSH_D = "#efc3c0";
const ROSE = "#c98189";
const CHAMP = "#c49a5a";
const CHAMP_L = "#ecd7a6";
const INK = "#6a4a50";
const SOFT = "#8f7176";

export default function build(): TemplateDef {
  const bg = linear(75, [0, "#fdf0ec"], [0.5, BLUSH], [1, "#f3d3cf"]);

  const label = (text: string, y: number, o: Partial<Parameters<typeof T>[2]> = {}) =>
    T(text, y, { x: 150, width: 700, fontFamily: "Jost", fontWeight: 400, fontSize: 19, letterSpacing: 9, uppercase: true, fill: CHAMP, ...o });
  const div = (y: number, w = 340) => lock(O(swash(CHAMP, w), { cx: W / 2, y, width: w }));

  const bokeh = (pts: [number, number, number, number][]): Layer[] =>
    pts.map(([x, y, d, a]) =>
      lock(S({ shape: "ellipse", x: x - d / 2, y: y - d / 2, width: d, height: d, fill: radial([0, `rgba(255,244,214,${a})`], [0.7, `rgba(246,224,170,${a * 0.5})`], [1, "rgba(246,224,170,0)"]) })),
    );
  const glints = (pts: [number, number, number, string?][]): Layer[] => pts.map(([x, y, s, c]) => put(shine(c ?? CHAMP, 60), x, y, s, 0, 0.95));

  const frame = (x: number, y: number, w: number, h: number): Layer[] => [
    lock(O(archFrame({ w, h, stroke: CHAMP, strokeWidth: 2.4, lines: 2, gap: 14, fill: "rgba(255,255,255,0.35)" }), { x, y })),
  ];

  /* --------------------------------- cover --------------------------------- */
  const cover = P(
    bg,
    [
      ...bokeh([
        [140, 200, 340, 0.8],
        [880, 360, 260, 0.7],
        [90, 900, 300, 0.6],
        [900, 1180, 380, 0.8],
        [500, 1380, 320, 0.5],
      ]),
      ...frame(70, 70, 860, 1260),
      label("Engagement Party", 150, { fontSize: 18 }),
      put(solitaire(), 500, 392, 262),
      ...glints([
        [300, 270, 34],
        [710, 250, 44],
        [690, 380, 22, ROSE],
        [290, 440, 20, ROSE],
        [730, 470, 26],
      ]),
      T(GUEST_TOKEN, 600, { x: 250, width: 500, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 34, fill: SOFT }),
      T("She said yes!", 628, { x: 100, width: 800, fontFamily: "Great Vibes", fontSize: 150, lineHeight: 1.2, fill: ROSE }),
      label("Join us to celebrate the engagement of", 826, { fontSize: 15, letterSpacing: 6, fill: SOFT }),
      T("Olivia & Noah", 860, { x: 100, width: 800, fontFamily: "Playfair Display", italic: true, fontWeight: 400, fontSize: 80, fill: INK }),
      div(982),
      T("Saturday, 12 June 2027", 1038, { x: 100, width: 800, fontFamily: "Cormorant Garamond", fontWeight: 600, fontSize: 48, letterSpacing: 2, fill: INK }),
      label("Seven o'clock in the evening", 1106, { fontSize: 18, letterSpacing: 7, fill: CHAMP }),
      T("The Glasshouse at Willowbrook", 1164, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 36, fill: SOFT }),
      put(heartShape(CHAMPAGNE_GOLD, 60), 500, 1248, 26),
      ...glints([
        [170, 1180, 26],
        [840, 1090, 22, ROSE],
        [135, 840, 20, ROSE],
        [870, 830, 30],
      ]),
    ],
    "Invitation",
  );

  /* -------------------------------- details -------------------------------- */
  const row = (head: string, big: string, small: string, y: number): Layer[] => [
    label(head, y, { fontSize: 16, letterSpacing: 9 }),
    T(big, y + 36, { x: 120, width: 760, fontFamily: "Playfair Display", fontWeight: 400, fontSize: 48, fill: INK }),
    T(small, y + 104, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 32, fill: SOFT }),
  ];
  const details = P(
    bg,
    [
      ...bokeh([
        [860, 160, 340, 0.8],
        [120, 700, 300, 0.6],
        [880, 1100, 340, 0.7],
        [180, 1330, 300, 0.7],
      ]),
      ...frame(70, 70, 860, 1260),
      put(solitaire(), 500, 222, 140),
      ...glints([
        [410, 190, 24],
        [600, 150, 30],
        [585, 270, 16, ROSE],
      ]),
      T("The Celebration", 345, { x: 80, width: 840, fontFamily: "Great Vibes", fontSize: 108, lineHeight: 1.2, fill: ROSE }),
      div(480, 320),
      ...row("When", "Saturday, 12 June 2027", "Seven o'clock in the evening", 550),
      div(764, 240),
      ...row("Where", "The Glasshouse at Willowbrook", "Cocktails, canapés & a champagne toast", 820),
      div(1034, 240),
      label("Dress code", 1090, { fontSize: 16 }),
      T("Cocktail attire in blush & champagne", 1126, { x: 140, width: 720, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 36, fill: INK }),
      put(heartShape(CHAMPAGNE_GOLD, 60), 500, 1236, 26),
      ...glints([
        [180, 1190, 22],
        [830, 1200, 26, ROSE],
      ]),
    ],
    "Details",
  );

  /* ------------------------------- story / photos ----------------------------- */
  const story = P(
    bg,
    [
      ...bokeh([
        [140, 260, 320, 0.7],
        [880, 700, 320, 0.7],
        [260, 1250, 360, 0.7],
      ]),
      T("Our Love Story", 90, { x: 60, width: 880, fontFamily: "Great Vibes", fontSize: 110, lineHeight: 1.2, fill: ROSE }),
      // large oval portrait with double gold keyline
      lock(S({ shape: "ellipse", x: 205, y: 270, width: 590, height: 740, fill: "#ffffff", stroke: CHAMP, strokeWidth: 2.4 })),
      lock(S({ shape: "ellipse", x: 187, y: 252, width: 626, height: 776, fill: null, stroke: CHAMP_L, strokeWidth: 2 })),
      I({ x: 220, y: 285, width: 560, height: 710, mask: "ellipse", placeholderFill: BLUSH_D }),
      // two small round portraits tucked to the lower corners
      lock(S({ shape: "ellipse", x: 100, y: 840, width: 250, height: 250, fill: "#ffffff", stroke: CHAMP, strokeWidth: 2.4 })),
      I({ x: 112, y: 852, width: 226, height: 226, mask: "ellipse", placeholderFill: CHAMP_L }),
      lock(S({ shape: "ellipse", x: 650, y: 840, width: 250, height: 250, fill: "#ffffff", stroke: CHAMP, strokeWidth: 2.4 })),
      I({ x: 662, y: 852, width: 226, height: 226, mask: "ellipse", placeholderFill: BLUSH_D }),
      put(heartShape(CHAMPAGNE_GOLD, 60), 500, 1082, 44),
      ...glints([
        [150, 330, 34],
        [860, 300, 44],
        [820, 560, 22, ROSE],
        [120, 650, 24, ROSE],
      ]),
      T("Two hearts, one beautiful beginning", 1152, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 40, lineHeight: 1.3, fill: INK }),
      div(1262, 320),
      label("Olivia & Noah", 1304, { fontSize: 22, letterSpacing: 10, fill: CHAMP }),
    ],
    "Story",
  );

  void H;
  void divider;
  return {
    slug: "engagement-ring-script",
    name: "She Said Yes",
    tagline: "Romantic blush and champagne engagement party invitation with a diamond ring",
    description:
      "A romantic engagement party invitation with a hand-drawn solitaire ring, sparkling champagne-gold glints and elegant script on a blush backdrop. Ideal for engagement parties and ring ceremonies, with details and photo pages.",
    categories: ["engagement", "party", "luxury", "classic"],
    keywords: ["she said yes engagement party invitation", "diamond ring engagement invite online", "blush and champagne gold engagement card", "engagement ceremony digital invitation", "romantic script engagement announcement"],
    palette: [BLUSH, BLUSH_D, ROSE, CHAMP, INK],
    width: W,
    height: H,
    pages: [cover, details, story],
  };
}
