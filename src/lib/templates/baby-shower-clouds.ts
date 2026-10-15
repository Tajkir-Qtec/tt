import { archFrame, divider } from "../design/ornaments";
import { GUEST_TOKEN } from "../design/types";
import type { Layer } from "../design/types";
import { cloud, miniHeart, mobileStrings, put, sleepyMoon, softStar, twinkle } from "./baby-shower-clouds.art";
import { H, I, linear, lock, O, P, radial, S, T, W, type TemplateDef } from "./kit";

const CREAM = "#fbf7ee";
const SKY = "#e2ecf0";
const BLUE = "#9db9cb";
const BLUE_L = "#cfe0ea";
const SAGE = "#a3bca0";
const SAGE_L = "#d3e1ce";
const INK = "#3f5160";
const SOFT = "#74858f";
const GOLD = "#d4b270";
const GOLD_L = "#f1e0b2";
const WOOD = "#c9b08a";

export default function build(): TemplateDef {
  const sky = linear(90, [0, SKY], [0.55, "#f1f4ef"], [1, CREAM]);
  const calm = linear(90, [0, "#eaf1f2"], [1, CREAM]);

  const label = (text: string, y: number, o: Partial<Parameters<typeof T>[2]> = {}) =>
    T(text, y, { x: 150, width: 700, fontFamily: "Jost", fontWeight: 400, fontSize: 20, letterSpacing: 9, uppercase: true, fill: SOFT, ...o });

  const div = (y: number, w = 300, color = GOLD) => lock(O(divider({ style: "stars", w, color, strokeWidth: 1.8 }), { cx: W / 2, y, width: w }));

  /** A bank of clouds along the bottom edge in three tints, overlapping for depth. */
  const cloudBank = (baseY: number): Layer[] => [
    put(cloud("#e6eff4", BLUE_L, "#b9cfdc"), 120, baseY + 20, 520),
    put(cloud("#e5eee0", SAGE_L, "#b7cbb2"), 880, baseY + 10, 540),
    put(cloud("#ffffff", "#eef3f4", "#cfdde4"), 500, baseY + 62, 640),
    put(cloud("#ffffff", "#f1f5f5", "#d6e2e7"), -40, baseY + 110, 380),
    put(cloud("#ffffff", "#f1f5f5", "#d6e2e7"), 1040, baseY + 120, 400),
  ];

  const sparkles = (pts: [number, number, number, string?][]): Layer[] => pts.map(([x, y, s, c]) => put(twinkle(c ?? GOLD, 60), x, y, s, 0, 0.9));

  /* --------------------------------- cover --------------------------------- */
  const hangs = [
    { x: 215, y: 300 },
    { x: 355, y: 400 },
    { x: 500, y: 330 },
    { x: 645, y: 300 },
    { x: 785, y: 392 },
  ];
  const cover = P(
    sky,
    [
      lock(S({ shape: "ellipse", x: 60, y: -320, width: 880, height: 880, fill: radial([0, "rgba(255,255,255,0.8)"], [0.6, "rgba(255,255,255,0.35)"], [1, "rgba(255,255,255,0)"]) })),
      ...sparkles([
        [90, 190, 30],
        [905, 215, 36],
        [110, 420, 20, BLUE],
        [890, 470, 24, BLUE],
        [60, 330, 14, SAGE],
        [945, 330, 14, SAGE],
      ]),
      lock(O(mobileStrings({ color: WOOD, bead: GOLD, bar: WOOD, hangs, barY: 118, x0: 170, x1: 830, height: 470 }), { x: 0, y: 0, width: 1000, height: 470 })),
      put(cloud("#ffffff", BLUE_L, "#b3cada"), 215, 330, 190),
      put(softStar("#f6e3ae", "#dcb96d", 100), 355, 440, 88, 8),
      put(sleepyMoon("#f6e5b8", "#e0bd78", "#8a7449", 150), 500, 385, 118, -8),
      put(softStar("#cfe0cb", "#9bb897", 100), 645, 340, 66, -10),
      put(cloud("#ffffff", SAGE_L, "#b2c8ae"), 785, 432, 150),
      T(GUEST_TOKEN, 508, { x: 250, width: 500, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 34, fill: SOFT }),
      label("You are invited to a", 568, { fontSize: 19 }),
      T("Baby Shower", 598, { x: 40, width: 920, fontFamily: "Great Vibes", fontSize: 178, lineHeight: 1.15, fill: INK }),
      div(826),
      label("in honour of the parents-to-be", 882, { fontSize: 17, letterSpacing: 7 }),
      T("Emma & Liam", 922, { x: 100, width: 800, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 82, fill: INK }),
      T("Saturday, 13 March 2027  ·  2:00 PM", 1030, { x: 100, width: 800, fontFamily: "Jost", fontWeight: 500, fontSize: 25, letterSpacing: 4, fill: INK }),
      T("The Maple Garden Room", 1082, { x: 150, width: 700, fontFamily: "Cormorant Garamond", fontWeight: 500, fontSize: 36, fill: SOFT }),
      ...cloudBank(1262),
    ],
    "Invitation",
  );

  /* -------------------------------- details -------------------------------- */
  const row = (head: string, big: string, small: string, y: number): Layer[] => [
    label(head, y, { fontSize: 16, letterSpacing: 8, fill: GOLD }),
    T(big, y + 34, { x: 120, width: 760, fontFamily: "Cormorant Garamond", fontWeight: 500, fontSize: 56, fill: INK }),
    T(small, y + 106, { x: 160, width: 680, fontFamily: "Jost", fontWeight: 300, fontSize: 24, lineHeight: 1.5, letterSpacing: 1, fill: SOFT }),
  ];
  const details = P(
    calm,
    [
      lock(S({ shape: "ellipse", x: -240, y: -300, width: 700, height: 700, fill: BLUE_L, opacity: 0.45 })),
      lock(S({ shape: "ellipse", x: 620, y: -200, width: 560, height: 560, fill: SAGE_L, opacity: 0.45 })),
      put(cloud("#ffffff", BLUE_L, "#b3cada"), 150, 120, 300),
      put(cloud("#ffffff", SAGE_L, "#b2c8ae"), 860, 150, 260),
      put(sleepyMoon("#f6e5b8", "#e0bd78", "#8a7449", 150), 500, 150, 96, 14),
      ...sparkles([
        [340, 90, 24],
        [680, 70, 18, BLUE],
        [410, 215, 14, SAGE],
        [600, 225, 20],
      ]),
      T("Come Celebrate", 270, { x: 80, width: 840, fontFamily: "Great Vibes", fontSize: 110, lineHeight: 1.15, fill: INK }),
      T("A little one is on the way", 408, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 34, fill: SOFT }),
      // card
      lock(S({ x: 126, y: 490, width: 748, height: 640, cornerRadius: 36, fill: "#5a7080", opacity: 0.05 })),
      lock(S({ x: 120, y: 480, width: 760, height: 640, cornerRadius: 36, fill: "#ffffff", opacity: 0.88, stroke: "#dfe8ea", strokeWidth: 1.5 })),
      lock(S({ x: 140, y: 500, width: 720, height: 600, cornerRadius: 26, fill: null, stroke: GOLD_L, strokeWidth: 1.6 })),
      ...row("When", "Saturday, 13 March", "Two o'clock in the afternoon", 540),
      div(724, 240),
      ...row("Where", "The Maple Garden Room", "48 Willow Lane, Brookfield", 796),
      div(994, 240),
      T("Soft colours, cosy layers  ·  Games, sweet treats & wishes", 1042, { x: 170, width: 660, fontFamily: "Jost", fontWeight: 400, fontSize: 21, lineHeight: 1.5, letterSpacing: 1, fill: SOFT }),
      ...cloudBank(1280),
    ],
    "Details",
  );

  /* ------------------------------ wishes / photo ----------------------------- */
  const photo = P(
    sky,
    [
      lock(S({ shape: "ellipse", x: 100, y: 60, width: 800, height: 800, fill: radial([0, "rgba(255,255,255,0.85)"], [0.65, "rgba(255,255,255,0.4)"], [1, "rgba(255,255,255,0)"]) })),
      T("Sweet Dreams", 80, { x: 80, width: 840, fontFamily: "Great Vibes", fontSize: 112, lineHeight: 1.15, fill: INK }),
      ...sparkles([
        [130, 130, 26],
        [870, 150, 30],
        [90, 520, 16, BLUE],
        [915, 600, 20, SAGE],
      ]),
      // arched photo window
      lock(O(archFrame({ w: 496, h: 650, fill: "#ffffff", stroke: GOLD_L, strokeWidth: 2 }), { x: 252, y: 262 })),
      I({ x: 270, y: 280, width: 460, height: 614, mask: "arch", placeholderFill: BLUE_L, borderColor: GOLD, borderWidth: 3 }),
      put(softStar("#f6e3ae", "#dcb96d", 100), 220, 330, 64, -12),
      put(miniHeart("#e8b4a8", 60), 790, 860, 44, 12),
      put(sleepyMoon("#f6e5b8", "#e0bd78", "#8a7449", 150), 790, 300, 92, 16),
      put(softStar("#cfe0cb", "#9bb897", 100), 210, 830, 50, 10),
      T("Wrapped in love, cloud nine and a whole lot of cuddles", 944, { x: 190, width: 620, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 38, lineHeight: 1.3, fill: SOFT }),
      div(1088, 280),
      label("Emma & Liam", 1130, { fontSize: 24, letterSpacing: 10, fill: INK }),
      ...cloudBank(1290),
    ],
    "Wishes",
  );

  void H;
  return {
    slug: "baby-shower-clouds",
    name: "Baby Shower Clouds",
    tagline: "Dreamy cloud-and-moon baby shower invitation in sage and dusty blue",
    description:
      "A gender-neutral baby shower invitation with a hand-drawn hanging mobile of clouds, stars and a sleepy crescent moon in soft sage, cream and dusty blue. Includes details and photo pages, perfect for sharing online.",
    categories: ["baby", "party", "nature", "minimal"],
    keywords: ["gender neutral baby shower invitation", "cloud baby shower invite online", "baby mobile moon and stars invitation", "sage and blue baby shower card", "digital baby shower invitation"],
    palette: [CREAM, BLUE_L, SAGE_L, GOLD, INK],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
