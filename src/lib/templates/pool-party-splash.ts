import { GUEST_TOKEN } from "../design/types";
import type { Layer } from "../design/types";
import { H, I, linear, lock, O, P, S, T, W, type TemplateDef } from "./kit";
import { sunburst } from "../design/ornaments";
import { beachBall, caustics, donutFloat, dotL, extrude, flamingo, lifebuoy, ripples, rotAbout, starfield, sticker, sunglasses, waveLine } from "./summer-party.art";
import { place } from "./summer-party.art";

const NAVY = "#0b3a6b";
const POOL = linear(90, [0, "#8ff3ee"], [0.35, "#22cfe0"], [1, "#0a8cc0"]);
const PINK = "#ff4f9a";
const SUN = "#ffd23f";

const pill = (text: string, y: number, o: Record<string, unknown> = {}) =>
  T(text, y, { x: 150, width: 700, fontFamily: "Poppins", fontWeight: 700, fontSize: 22, letterSpacing: 9, uppercase: true, fill: NAVY, ...o });

/** Wavy water-surface lines that gently cross the page. */
function surface(y: number, color = "#ffffff", op = 0.5) {
  return place(
    [
      { path: waveLine(y, 9, 180, 0), stroke: color, strokeWidth: 3.5, opacity: op },
      { path: waveLine(y + 26, 9, 220, 2), stroke: color, strokeWidth: 2.5, opacity: op * 0.7 },
    ],
    3,
  );
}

export default function build(): TemplateDef {
  const rays = lock(O(sunburst({ color: "#ffffff", rays: 18, size: 1700, core: 0.05 }), { x: 500 - 850, y: 120 - 850, opacity: 0.16 }));
  const sparkles = (seed: number, skip: (x: number, y: number) => boolean) => starfield(seed, 40, [20, 20, 980, 1380], "#ffffff");
  void sparkles;

  /* --------------------------------- cover --------------------------------- */
  const cover = P(
    POOL,
    [
      rays,
      caustics(11, [0, 0, 1000, 1400], 80, 0.85),
      surface(1010),
      surface(240),
      pill("You're invited to a", 52, { fontSize: 21 }),
      lock(rotAbout(sunglasses(500, 170, 330), 500, 170, -5)),
      ...extrude("Pool", { x: 40, y: 175, width: 920, fontSize: 250, font: "Abril Fatface", face: "#ffffff", side: NAVY, depth: 9, step: 1.6 }),
      ...extrude("Party", { x: 40, y: 395, width: 920, fontSize: 250, font: "Abril Fatface", face: SUN, side: NAVY, depth: 9, step: 1.6 }),
      // toys
      ripples(255, 925, 190, 44, 3),
      flamingo(255, 865, 1.08),
      ripples(770, 870, 150, 60, 3),
      donutFloat(770, 850, 128, "#ff7eb6", "#ff4f9a", 9),
      lifebuoy(548, 800, 58),
      beachBall(905, 690, 52),
      // info card
      ...sticker(100, 1030, 800, 262, "#ffffff", { shadow: NAVY, r: 46 }),
      T("Saturday, July 17, 2027", 1054, { x: 120, width: 760, fontFamily: "Abril Fatface", fontSize: 54, lineHeight: 1.1, fill: NAVY }),
      T("3 PM  till  sunset", 1122, { x: 120, width: 760, fontFamily: "Poppins", fontWeight: 700, fontSize: 30, letterSpacing: 6, uppercase: true, fill: PINK }),
      lock(S({ x: 330, y: 1176, width: 340, height: 4, cornerRadius: 2, fill: "#22cfe0" })),
      T("The Chowdhury Poolside", 1194, { x: 120, width: 760, fontFamily: "Poppins", fontWeight: 600, fontSize: 30, fill: NAVY }),
      T("14 Lakeview Drive, Bayside", 1238, { x: 120, width: 760, fontFamily: "Poppins", fontWeight: 500, fontSize: 24, fill: NAVY, opacity: 0.75 }),
      T(GUEST_TOKEN, 1330, { x: 200, width: 600, fontFamily: "Abril Fatface", fontSize: 40, lineHeight: 1.1, fill: "#ffffff", shadow: { color: NAVY, blur: 0, offsetX: 3, offsetY: 3, opacity: 1 } }),
    ],
    "Invitation",
  );

  /* -------------------------------- details -------------------------------- */
  const row = (y: number, time: string, ap: string, title: string, sub: string, color: string): Layer[] => [
    ...sticker(90, y, 820, 164, "#ffffff", { shadow: NAVY, r: 40 }),
    ...sticker(116, y + 22, 200, 120, color, { shadow: NAVY, r: 30, off: 5, sw: 4 }),
    T(time, y + 36, { x: 116, width: 200, fontFamily: "Abril Fatface", fontSize: 60, lineHeight: 1.1, fill: NAVY }),
    T(ap, y + 102, { x: 116, width: 200, fontFamily: "Poppins", fontWeight: 700, fontSize: 20, letterSpacing: 6, uppercase: true, fill: NAVY, opacity: 0.8 }),
    T(title, y + 38, { x: 350, width: 540, align: "left", fontFamily: "Abril Fatface", fontSize: 42, lineHeight: 1.1, fill: NAVY }),
    T(sub, y + 98, { x: 350, width: 540, align: "left", fontFamily: "Poppins", fontWeight: 500, fontSize: 23, fill: NAVY, opacity: 0.78 }),
  ];
  const details = P(
    POOL,
    [
      lock(O(sunburst({ color: "#ffffff", rays: 18, size: 1700, core: 0.05 }), { x: 500 - 850, y: 0 - 850, opacity: 0.14 })),
      caustics(23, [0, 0, 1000, 1400], 70, 0.85),
      surface(1330),
      pill("The Plan", 70, { fontSize: 22 }),
      ...extrude("Splash Schedule", { x: 40, y: 110, width: 920, fontSize: 92, font: "Abril Fatface", face: "#ffffff", side: NAVY, depth: 6, step: 1.6 }),
      lifebuoy(100, 1290, 56),
      beachBall(900, 1290, 46),
      ...row(300, "3:00", "PM", "Dive In & Splash", "Pool opens, music and mocktails", SUN),
      ...row(496, "4:00", "PM", "Cannonball Contest", "Biggest splash wins a prize", "#ff9ac6"),
      ...row(692, "5:00", "PM", "Float Race", "Grab a flamingo and paddle", "#9cf2e8"),
      ...row(888, "6:30", "PM", "BBQ & Cake", "Grill, ice cream and cake by the water", SUN),
      T("Bring: swimsuit  ·  towel  ·  sunscreen", 1122, { x: 80, width: 840, fontFamily: "Poppins", fontWeight: 700, fontSize: 24, letterSpacing: 2, uppercase: true, fill: "#ffffff", shadow: { color: NAVY, blur: 0, offsetX: 2, offsetY: 2, opacity: 1 } }),
      T("Dress code: Bright & Poolside", 1176, { x: 100, width: 800, fontFamily: "Abril Fatface", fontSize: 44, lineHeight: 1.1, fill: SUN, shadow: { color: NAVY, blur: 0, offsetX: 3, offsetY: 3, opacity: 1 } }),
    ],
    "Details",
  );

  /* ------------------------------ photo page ------------------------------ */
  const photo = P(
    POOL,
    [
      lock(O(sunburst({ color: "#ffffff", rays: 18, size: 1700, core: 0.05 }), { x: 500 - 850, y: 600 - 850, opacity: 0.16 })),
      caustics(37, [0, 0, 1000, 1400], 75, 0.85, (x, y) => x > 250 && x < 750 && y > 330 && y < 880),
      pill("Dive in with us", 80, { fontSize: 24 }),
      ...extrude("Make a Splash!", { x: 40, y: 125, width: 920, fontSize: 104, font: "Abril Fatface", face: "#ffffff", side: NAVY, depth: 6, step: 1.6 }),
      I({ x: 280, y: 380, width: 440, height: 440, mask: "ellipse", placeholderFill: "#ffb6d3" }),
      lifebuoy(500, 600, 250),
      ripples(185, 1010, 130, 28, 2),
      flamingo(185, 975, 0.6),
      donutFloat(815, 985, 72, "#ff7eb6", "#ff4f9a", 4),
      sunglasses(500, 985, 240),
      T("Grab your shades, your floaties and your", 1085, { x: 100, width: 800, fontFamily: "Poppins", fontWeight: 600, fontSize: 27, fill: "#ffffff", shadow: { color: NAVY, blur: 0, offsetX: 2, offsetY: 2, opacity: 0.9 } }),
      T("best splash. It wouldn't be a pool party", 1125, { x: 100, width: 800, fontFamily: "Poppins", fontWeight: 600, fontSize: 27, fill: "#ffffff", shadow: { color: NAVY, blur: 0, offsetX: 2, offsetY: 2, opacity: 0.9 } }),
      T("without you.", 1165, { x: 100, width: 800, fontFamily: "Poppins", fontWeight: 600, fontSize: 27, fill: "#ffffff", shadow: { color: NAVY, blur: 0, offsetX: 2, offsetY: 2, opacity: 0.9 } }),
      T("See you at the pool!", 1230, { x: 100, width: 800, fontFamily: "Abril Fatface", fontSize: 62, lineHeight: 1.1, fill: SUN, shadow: { color: NAVY, blur: 0, offsetX: 3, offsetY: 3, opacity: 1 } }),
      surface(1340),
    ],
    "Photo",
  );

  return {
    slug: "pool-party-splash",
    name: "Pool Party Splash",
    tagline: "Bright turquoise pool party invitation with floaties and sunglasses",
    description:
      "A fun summer pool party invitation with shimmering turquoise water, flamingo and donut floats, a lifebuoy photo frame and bold splash typography. Ideal for birthday pool parties, swim parties and summer get-togethers.",
    categories: ["party", "summer", "birthday", "beach", "festive"],
    keywords: ["pool party invitation template", "summer pool birthday invite", "flamingo float party invitation", "splash bash swim party card", "turquoise water party invite", "online pool party invitation"],
    palette: ["#22cfe0", "#0a8cc0", "#ffd23f", "#ff4f9a", "#0b3a6b"],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
