import { GUEST_TOKEN } from "../design/types";
import type { Layer } from "../design/types";
import { GOLD, H, I, linear, lock, O, P, S, T, W, type TemplateDef } from "./kit";
import { sunburst } from "../design/ornaments";
import { bambooTorch, dotL, glow, HIBISCUS, hibiscus, palmLeafArt, place, plumeria, rng, starfield, sun, waveLine, waveShape } from "./summer-party.art";
import { Path } from "../design/path";

const CREAM = "#fff3dc";
const GOLDC = "#f2c75c";
const TEAL = "#0b3b3a";
const SKY = linear(90, [0, "#2a0f52"], [0.28, "#7b2a86"], [0.52, "#e0457b"], [0.72, "#ff7a45"], [1, "#ffc15a"]);
const LEAF_D = "#0c4a33";
const LEAF_L = "#2f9a5c";

const shadow = { color: "#2a0f3a", blur: 0, offsetX: 3, offsetY: 3, opacity: 0.7 };

const panel = (x: number, y: number, w: number, h: number, op = 0.72): Layer[] => [
  lock(S({ x, y, width: w, height: h, cornerRadius: 30, fill: TEAL, opacity: op })),
  lock(S({ x, y, width: w, height: h, cornerRadius: 30, fill: null, stroke: GOLDC, strokeWidth: 3 })),
  lock(S({ x: x + 11, y: y + 11, width: w - 22, height: h - 22, cornerRadius: 22, fill: null, stroke: GOLDC, strokeWidth: 1.2, opacity: 0.6 })),
];

const label = (text: string, y: number, o: Record<string, unknown> = {}) =>
  T(text, y, { x: 150, width: 700, fontFamily: "Poppins", fontWeight: 600, fontSize: 22, letterSpacing: 10, uppercase: true, fill: CREAM, ...o });

/** Sunset sea: layered dark waves with a glittering sun path. */
function sea(top: number, sunX: number): Layer[] {
  const bands: Layer[] = [];
  const cols = ["#4a1a6b", "#3a1560", "#2b0f50", "#1f0a3d"];
  cols.forEach((c, i) => {
    bands.push(place([{ path: waveShape(top + i * 42, 7 - i, 160 + i * 40, i * 1.7, 1400), fill: c }], 2));
  });
  const r = rng(5);
  const glints = new Path();
  for (let i = 0; i < 16; i++) {
    const y = top + 16 + i * 17;
    const half = 12 + i * 8 + r() * 24;
    const cx = sunX + (r() - 0.5) * 20;
    glints.M(cx - half, y).L(cx + half, y);
  }
  bands.push(place([{ path: glints, stroke: "#ffd27a", strokeWidth: 4, opacity: 0.7 }], 3));
  return bands;
}

export default function build(): TemplateDef {
  const rays = lock(O(sunburst({ color: "#ffd27a", rays: 24, size: 1900, core: 0.04 }), { x: 500 - 950, y: 800 - 950, opacity: 0.12 }));
  const frame = (seed: number, strong = true): Layer[] => [
    lock(palmLeafArt(-30, -30, 38, 560, 110, LEAF_L, LEAF_D, 120, 16, 17)),
    lock(palmLeafArt(1030, -30, 142, 560, 110, LEAF_L, LEAF_D, 120, 16, 17)),
    lock(palmLeafArt(-40, 30, 62, 400, 60, "#3fb070", "#0f5a3a", 100, 14, 14)),
    lock(palmLeafArt(1040, 30, 118, 400, 60, "#3fb070", "#0f5a3a", 100, 14, 14)),
    ...(strong ? [] : []),
    starfield(seed, 70, [0, 150, 1000, 600]),
  ];

  /* --------------------------------- cover --------------------------------- */
  const cover = P(
    SKY,
    [
      starfield(3, 80, [0, 0, 1000, 520]),
      rays,
      lock(sun(500, 815, 130, 18, linear(90, [0, "#fff6b0"], [0.5, "#ffd24a"], [1, "#ff9a3c"]), "#ffd24a")),
      ...sea(840, 500),
      // foliage frame
      lock(palmLeafArt(-30, -30, 38, 560, 110, LEAF_L, LEAF_D, 120, 16, 17)),
      lock(palmLeafArt(1030, -30, 142, 560, 110, LEAF_L, LEAF_D, 120, 16, 17)),
      lock(palmLeafArt(-40, 30, 62, 400, 60, "#3fb070", "#0f5a3a", 100, 14, 14)),
      lock(palmLeafArt(1040, 30, 118, 400, 60, "#3fb070", "#0f5a3a", 100, 14, 14)),
      hibiscus(120, 150, 78, 20, HIBISCUS.red),
      plumeria(100, 335, 46, 10),
      hibiscus(895, 215, 64, 50, HIBISCUS.yellow),
      label("You're invited to a", 74, { fontSize: 22 }),
      T("Aloha", 112, { x: 80, width: 840, fontFamily: "Parisienne", fontSize: 250, lineHeight: 1.05, fill: CREAM, shadow }),
      T("LUAU", 372, { x: 100, width: 800, fontFamily: "Gloock", fontSize: 150, letterSpacing: 26, lineHeight: 1, fill: GOLD, shadow }),
      label("Tropical night party", 556, { fontSize: 20, fill: "#ffd9a0" }),
      // torches
      ...bambooTorch(112, 770, 430, 34),
      ...bambooTorch(888, 770, 430, 34),
      // foreground foliage
      lock(palmLeafArt(-30, 1430, -52, 520, -70, LEAF_L, LEAF_D, 120, 16, 15)),
      lock(palmLeafArt(1030, 1430, -128, 520, -70, LEAF_L, LEAF_D, 120, 16, 15)),
      // details panel
      ...panel(190, 960, 620, 300, 0.9),
      T("Saturday, August 14, 2027", 986, { x: 200, width: 600, fontFamily: "Gloock", fontSize: 44, lineHeight: 1.1, fill: CREAM }),
      T("6:30 PM till late", 1048, { x: 200, width: 600, fontFamily: "Poppins", fontWeight: 600, fontSize: 24, letterSpacing: 5, uppercase: true, fill: GOLDC }),
      lock(S({ x: 330, y: 1098, width: 340, height: 2, fill: GOLDC, opacity: 0.7 })),
      T("Rahman Beach House", 1116, { x: 200, width: 600, fontFamily: "Gloock", fontSize: 34, lineHeight: 1.1, fill: CREAM }),
      T("32 Palm Cove Road, Cox's Bazar", 1164, { x: 200, width: 600, fontFamily: "Poppins", fontWeight: 500, fontSize: 21, fill: CREAM, opacity: 0.85 }),
      T(GUEST_TOKEN, 1206, { x: 220, width: 560, fontFamily: "Parisienne", fontSize: 42, lineHeight: 1.1, fill: GOLD }),
      hibiscus(150, 1290, 92, 8, HIBISCUS.coral),
      hibiscus(868, 1296, 100, 40, HIBISCUS.red),
      plumeria(248, 1352, 44, 0),
    ],
    "Invitation",
  );

  /* -------------------------------- details -------------------------------- */
  const item = (y: number, title: string, sub: string, n: string): Layer[] => [
    dotL(220, y + 42, 76, "#ff5e62", 1, GOLDC, 3),
    T(n, y + 20, { x: 182, width: 76, fontFamily: "Gloock", fontSize: 40, lineHeight: 1.1, fill: CREAM }),
    T(title, y + 6, { x: 280, width: 560, align: "left", fontFamily: "Gloock", fontSize: 38, lineHeight: 1.1, fill: CREAM }),
    T(sub, y + 56, { x: 280, width: 560, align: "left", fontFamily: "Poppins", fontWeight: 400, fontSize: 22, fill: CREAM, opacity: 0.82 }),
  ];
  const details = P(
    SKY,
    [
      starfield(8, 90, [0, 0, 1000, 600]),
      lock(O(sunburst({ color: "#ffd27a", rays: 24, size: 1900, core: 0.04 }), { x: 500 - 950, y: 1100 - 950, opacity: 0.1 })),
      ...sea(1200, 500),
      lock(palmLeafArt(-30, -30, 38, 520, 100, LEAF_L, LEAF_D, 115, 15, 16)),
      lock(palmLeafArt(1030, -30, 142, 520, 100, LEAF_L, LEAF_D, 115, 15, 16)),
      hibiscus(100, 130, 70, 25, HIBISCUS.coral),
      hibiscus(905, 140, 66, 60, HIBISCUS.red),
      label("Hawaiian Night", 82, { fontSize: 22 }),
      T("The Luau Plan", 150, { x: 100, width: 800, fontFamily: "Parisienne", fontSize: 100, lineHeight: 1.1, fill: CREAM, shadow }),
      ...panel(110, 320, 780, 640, 0.88),
      ...item(352, "Lei Welcome", "Flower garlands and tropical mocktails", "1"),
      ...item(484, "Hula & Ukulele", "Live island music at golden hour", "2"),
      ...item(616, "Fire Dance", "Torches lit as the sun sets", "3"),
      ...item(748, "Island Feast", "Grilled fish, pineapple, coconut sweets", "4"),
      lock(S({ x: 280, y: 872, width: 440, height: 2, fill: GOLDC, opacity: 0.6 })),
      T("Dress code: Floral shirts, sarongs & flower crowns", 896, { x: 150, width: 700, fontFamily: "Poppins", fontWeight: 500, fontSize: 22, fill: GOLDC, lineHeight: 1.3 }),
      T("Come barefoot, leave sandy", 1040, { x: 160, width: 680, fontFamily: "Parisienne", fontSize: 64, lineHeight: 1.1, fill: CREAM, shadow }),
      T("Mahalo for celebrating with us", 1130, { x: 160, width: 680, fontFamily: "Poppins", fontWeight: 500, fontSize: 22, letterSpacing: 4, uppercase: true, fill: "#4a1458" }),
      lock(palmLeafArt(-30, 1430, -58, 380, -60, LEAF_L, LEAF_D, 115, 15, 15)),
      lock(palmLeafArt(1030, 1430, -122, 380, -60, LEAF_L, LEAF_D, 115, 15, 15)),
      hibiscus(130, 1310, 78, 0, HIBISCUS.red),
      hibiscus(880, 1315, 82, 30, HIBISCUS.yellow),
      plumeria(500, 1345, 36, 5),
    ],
    "Details",
  );

  /* ------------------------------ photo page ------------------------------ */
  const photo = P(
    SKY,
    [
      starfield(21, 90, [0, 0, 1000, 600]),
      lock(O(sunburst({ color: "#ffd27a", rays: 24, size: 1900, core: 0.04 }), { x: 500 - 950, y: 640 - 950, opacity: 0.12 })),
      ...sea(1160, 500),
      lock(palmLeafArt(-30, -30, 38, 520, 100, LEAF_L, LEAF_D, 115, 15, 16)),
      lock(palmLeafArt(1030, -30, 142, 520, 100, LEAF_L, LEAF_D, 115, 15, 16)),
      label("Island memories", 90, { fontSize: 22 }),
      T("Join the fun", 130, { x: 100, width: 800, fontFamily: "Parisienne", fontSize: 118, lineHeight: 1.1, fill: CREAM, shadow }),
      lock(S({ shape: "ellipse", x: 244, y: 364, width: 512, height: 512, fill: GOLD })),
      lock(S({ shape: "ellipse", x: 256, y: 376, width: 488, height: 488, fill: TEAL })),
      I({ x: 266, y: 386, width: 468, height: 468, mask: "ellipse", placeholderFill: "#ffb28a" }),
      hibiscus(262, 420, 100, 15, HIBISCUS.red),
      hibiscus(745, 396, 82, 50, HIBISCUS.coral),
      plumeria(312, 540, 50, 20),
      hibiscus(738, 840, 108, 10, HIBISCUS.yellow),
      hibiscus(268, 842, 84, 40, HIBISCUS.coral),
      plumeria(660, 905, 42, 0),
      glow(500, 640, 360, "#ff9a3c", 0.12),
      T("Dance under the palms, share a coconut", 962, { x: 120, width: 760, fontFamily: "Poppins", fontWeight: 500, fontSize: 26, fill: CREAM, lineHeight: 1.4 }),
      T("and watch the sun slip into the sea.", 1002, { x: 120, width: 760, fontFamily: "Poppins", fontWeight: 500, fontSize: 26, fill: CREAM, lineHeight: 1.4 }),
      T("See you at the luau!", 1056, { x: 100, width: 800, fontFamily: "Parisienne", fontSize: 88, lineHeight: 1.1, fill: CREAM, shadow: { color: "#4a1458", blur: 0, offsetX: 3, offsetY: 3, opacity: 0.9 } }),
      lock(palmLeafArt(-30, 1430, -58, 380, -60, LEAF_L, LEAF_D, 115, 15, 15)),
      lock(palmLeafArt(1030, 1430, -122, 380, -60, LEAF_L, LEAF_D, 115, 15, 15)),
      hibiscus(500, 1330, 62, 12, HIBISCUS.red),
    ],
    "Photo",
  );
  void frame;
  void waveLine;

  return {
    slug: "tropical-luau-hibiscus",
    name: "Tropical Luau Hibiscus",
    tagline: "Hawaiian luau invitation with hibiscus, palm leaves and a sunset sea",
    description:
      "A tropical luau party invitation with glowing sunset gradients, hibiscus and plumeria flowers, palm leaf framing and bamboo tiki torches. Perfect for Hawaiian-themed summer parties, birthdays and beach celebrations.",
    categories: ["party", "summer", "beach", "festive", "nature", "birthday"],
    keywords: ["luau party invitation template", "hawaiian hibiscus invitation card", "tropical tiki torch party invite", "aloha summer party invitation", "sunset beach luau birthday invite", "palm leaf tropical invitation"],
    palette: ["#2a0f52", "#e0457b", "#ff7a45", "#f2c75c", "#0c4a33"],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
