import { archFrame, divider } from "../design/ornaments";
import { Path } from "../design/path";
import { GUEST_TOKEN } from "../design/types";
import type { Layer } from "../design/types";
import { H, I, linear, lock, O, P, T, W, type TemplateDef } from "./kit";
import { place, sparkAt } from "./birthday-balloons-bold.art";
import { bat, CREAM, deadTree, fog, LILAC, manor, manorGlow, moon, moonHalo, ORANGE, ORANGE_L, pumpkin, pumpkinGlow, web } from "./halloween-moonlit-manor.art";

const SKY = linear(90, [0, "#12051f"], [0.38, "#2a0c4e"], [0.62, "#55196f"], [0.8, "#2a0c3a"], [1, "#0d0414"]);
const FIRE = linear(90, [0, "#ffc766"], [1, "#ff6a00"]);
const GLOW = { color: "#ff7a1a", blur: 30, offsetX: 0, offsetY: 0, opacity: 0.6 };

const rule = (y: number, w = 360) => lock(O(divider({ style: "stars", w, color: ORANGE, strokeWidth: 1.6 }), { cx: W / 2, y: y - 20 }));

function stars(seed: number, n: number, area: [number, number, number, number], skip?: (x: number, y: number) => boolean): Layer[] {
  let s = seed;
  const r = () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296;
  const out: Layer[] = [];
  let guard = 0;
  while (out.length < n && guard++ < n * 20) {
    const x = area[0] + r() * (area[2] - area[0]);
    const y = area[1] + r() * (area[3] - area[1]);
    const sz = 8 + r() * 16;
    if (skip?.(x, y)) continue;
    out.push(sparkAt(x, y, sz, r() > 0.75 ? ORANGE_L : CREAM, 0.35 + r() * 0.55));
  }
  return out;
}

function ground(y0: number, bottom = H): Layer {
  const p = new Path();
  p.M(0, y0).C(260, y0 - 34, 480, y0 + 22, 720, y0 - 6).C(840, y0 - 20, 940, y0 - 4, 1000, y0 - 16).L(1000, bottom).L(0, bottom).Z();
  return place([{ path: p, fill: linear(90, [0, "#0a0511"], [1, "#150a21"]) }], 2);
}

const label = (text: string, y: number, o: Record<string, unknown> = {}) =>
  T(text, y, { x: 100, width: 800, fontFamily: "Cinzel", fontWeight: 500, fontSize: 22, letterSpacing: 11, uppercase: true, fill: ORANGE_L, ...o });

export default function build(): TemplateDef {
  /* --------------------------------- cover --------------------------------- */
  const cover = P(
    SKY,
    [
      ...stars(7, 46, [30, 30, 970, 880], (x, y) => y < 360 && x > 80 && x < 920),
      web(0, 0, 250, 1, 1),
      web(1000, 0, 250, -1, 1, false),
      T("You dare not miss the", 66, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 36, fill: LILAC }),
      T("Halloween", 108, { x: 20, width: 960, fontFamily: "Cinzel Decorative", fontWeight: 900, fontSize: 124, lineHeight: 1.1, fill: FIRE, shadow: GLOW }),
      T("Party at Moonlit Manor", 244, { x: 100, width: 800, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 600, fontSize: 52, fill: CREAM }),
      ...moonHalo(500, 590, 228),
      moon(500, 590, 228),
      bat(300, 430, 54, -14),
      bat(380, 500, 30, 12),
      bat(716, 440, 62, 10),
      bat(808, 540, 34, -10),
      bat(600, 372, 26, 4),
      bat(170, 600, 26, -6, "#1a0b2c"),
      deadTree(130, 922, 400),
      ...manorGlow(520, 922, 0.98),
      manor(520, 922, 0.98),
      ...manorGlow(520, 922, 0.98, false),
      ground(918),
      ...fog(500, 930, 1000, 90, 0.12),
      pumpkinGlow(190, 980, 52),
      pumpkin(190, 980, 52),
      pumpkin(262, 972, 34, false),
      pumpkinGlow(840, 984, 58),
      pumpkin(840, 984, 58),
      pumpkin(764, 970, 30, false),
      rule(988, 360),
      T("Saturday, 30 October 2027", 1020, { x: 100, width: 800, fontFamily: "Cinzel", fontWeight: 600, fontSize: 38, letterSpacing: 2, fill: CREAM }),
      T("Eight o'clock until midnight", 1078, { x: 100, width: 800, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 36, fill: ORANGE_L }),
      T("The Old Manor House, Banani, Dhaka", 1138, { x: 100, width: 800, fontFamily: "Poppins", fontWeight: 400, fontSize: 25, fill: CREAM, opacity: 0.88 }),
      T("Costumes required  ·  Mischief encouraged", 1196, { x: 100, width: 800, fontFamily: "Cinzel", fontWeight: 500, fontSize: 19, letterSpacing: 5, uppercase: true, fill: ORANGE }),
      T(GUEST_TOKEN, 1274, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 600, fontSize: 48, fill: LILAC }),
    ],
    "Invitation",
  );

  /* -------------------------------- details -------------------------------- */
  const rows: [string, string, string][] = [
    ["When", "Saturday, 30 October 2027", "The doors creak open at eight"],
    ["Where", "The Old Manor House", "Banani, Dhaka"],
    ["Wear", "Costumes Required", "Spooky, stylish or silly, all welcome"],
    ["Feast", "Potions & Treats", "Cauldron punch, sweets and spooky bites"],
  ];
  const rowLayers: Layer[] = [];
  rows.forEach(([k, v, sub], i) => {
    const y = 425 + i * 166;
    rowLayers.push(
      T(k, y, { x: 150, width: 700, fontFamily: "Cinzel", fontWeight: 500, fontSize: 21, letterSpacing: 14, uppercase: true, fill: ORANGE }),
      T(v, y + 36, { x: 80, width: 840, fontFamily: "Cinzel", fontWeight: 600, fontSize: 46, fill: CREAM }),
      T(sub, y + 92, { x: 100, width: 800, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 31, fill: LILAC }),
    );
    if (i < rows.length - 1) rowLayers.push(rule(y + 148, 200));
  });
  const details = P(
    SKY,
    [
      ...stars(19, 40, [30, 30, 970, 1100], (x, y) => x > 60 && x < 940 && y > 380),
      web(0, 0, 230, 1, 1),
      web(1000, 0, 230, -1, 1, false),
      ...moonHalo(500, 150, 80),
      moon(500, 150, 80),
      bat(300, 130, 40, -12),
      bat(716, 150, 44, 10),
      bat(370, 215, 22, 8),
      T("Haunting Hours", 250, { x: 20, width: 960, fontFamily: "Cinzel Decorative", fontWeight: 700, fontSize: 78, lineHeight: 1.1, fill: FIRE, shadow: GLOW }),
      T("Everything you need to know", 346, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 32, fill: CREAM, opacity: 0.85 }),
      ...rowLayers,
      ...manorGlow(500, 1400, 0.56),
      manor(500, 1400, 0.56),
      ...manorGlow(500, 1400, 0.56, false),
      ground(1384),
      ...fog(500, 1380, 1000, 80, 0.12),
      pumpkinGlow(110, 1420, 46),
      pumpkin(110, 1420, 46),
      pumpkinGlow(900, 1420, 52),
      pumpkin(900, 1420, 52),
      pumpkin(180, 1412, 28, false),
    ],
    "Details",
  );

  /* ------------------------------ photo page ------------------------------ */
  const photo = P(
    SKY,
    [
      ...stars(31, 44, [30, 30, 970, 1000], (x, y) => x > 220 && x < 780 && y > 230 && y < 900),
      web(0, 0, 230, 1, 1),
      web(1000, 0, 230, -1, 1, false),
      ...moonHalo(500, 560, 330),
      moon(500, 560, 330),
      label("Beware of good company", 100, { fontSize: 22 }),
      lock(O(archFrame({ w: 560, h: 700, stroke: ORANGE, strokeWidth: 3, lines: 2, gap: 12 }), { x: 220, y: 215 })),
      I({ x: 250, y: 245, width: 500, height: 640, mask: "arch", placeholderFill: "#3a1560", borderColor: ORANGE_L, borderWidth: 5 }),
      bat(150, 330, 48, -16),
      bat(860, 400, 52, 12),
      bat(800, 270, 26, -6),
      bat(210, 480, 24, 8),
      deadTree(110, 1060, 420),
      deadTree(900, 1060, 380, true),
      ground(1060),
      ...fog(500, 1070, 1000, 90, 0.12),
      pumpkinGlow(150, 1120, 50),
      pumpkin(150, 1120, 50),
      pumpkinGlow(860, 1124, 46),
      pumpkin(860, 1124, 46),
      T("Wickedly good fun", 960, { x: 20, width: 960, fontFamily: "Cinzel Decorative", fontWeight: 700, fontSize: 66, lineHeight: 1.1, fill: FIRE, shadow: GLOW }),
      T("Dress to thrill, come for the spooks,", 1130, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 36, fill: CREAM }),
      T("stay for the sweets.", 1180, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 36, fill: CREAM }),
      rule(1262, 360),
      T("Moonlit Manor  ·  30 October", 1290, { x: 100, width: 800, fontFamily: "Cinzel", fontWeight: 500, fontSize: 22, letterSpacing: 9, uppercase: true, fill: ORANGE_L }),
    ],
    "Photo",
  );

  return {
    slug: "halloween-moonlit-manor",
    name: "Halloween Moonlit Manor",
    tagline: "Stylish Halloween party invitation with a haunted manor under a full moon",
    description:
      "A moody yet elegant Halloween party invitation with a haunted-house silhouette, a glowing full moon, flying bats and jack-o'-lanterns in purple, orange and black. Perfect for costume parties, spooky soirees and trick-or-treat nights.",
    categories: ["holiday", "party", "dark", "seasonal"],
    keywords: ["halloween party invitation template", "haunted house halloween invite", "elegant spooky costume party invitation", "full moon bats halloween card", "adult halloween party digital invitation", "purple and orange halloween invite"],
    palette: ["#12051f", "#55196f", "#ff7a1a", "#ffb347", "#f7ead2"],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
