import { GUEST_TOKEN } from "../design/types";
import type { Layer } from "../design/types";
import { H, I, linear, lock, O, P, S, T, W, type TemplateDef } from "./kit";
import { sunburst } from "../design/ornaments";
import { Path } from "../design/path";
import { glow, logsAndFire, palmSpecs, place, rng, starfield, stringLights, sun, waveLine, waveShape } from "./summer-party.art";

const CREAM = "#fff1dc";
const GOLDL = "#ffd27a";
const PLUM = "#1c0b2e";
const SKY = linear(90, [0, "#170a38"], [0.22, "#4a1b6e"], [0.42, "#b03a7a"], [0.58, "#ff6b57"], [0.72, "#ffa24a"], [0.8, "#ffd27a"], [1, "#ffd27a"]);
const SAND = linear(90, [0, "#3a1a3a"], [1, "#150a22"]);
const BULBS = ["#ffd27a", "#ffb347", "#fff0b8", "#ff9f6b"];

const sh = { color: "#2a0f3a", blur: 0, offsetX: 2, offsetY: 2, opacity: 0.55 };

const label = (text: string, y: number, o: Record<string, unknown> = {}) =>
  T(text, y, { x: 150, width: 700, fontFamily: "Josefin Sans", fontWeight: 600, fontSize: 22, letterSpacing: 12, uppercase: true, fill: CREAM, ...o });

/** Sea band from `top` down to the shoreline, sun glitter at x = sunX. */
function sea(top: number, shore: number, sunX: number, glitter = true): Layer[] {
  const out: Layer[] = [];
  out.push(place([{ path: waveShape(top, 0.5, 400, 0, shore + 40), fill: linear(90, [0, "#d1486f"], [0.25, "#7a2a7e"], [1, "#2a1250"]) }], 2));
  if (glitter) {
    const r = rng(9);
    const g = new Path();
    for (let i = 0; i < 18; i++) {
      const y = top + 10 + i * ((shore - top - 20) / 18);
      const half = 10 + i * 9 + r() * 26;
      const cx = sunX + (r() - 0.5) * 24;
      g.M(cx - half, y).L(cx + half, y);
    }
    out.push(place([{ path: g, stroke: GOLDL, strokeWidth: 4, opacity: 0.75 }], 3));
  }
  // gentle wave lines
  const w = new Path();
  for (let i = 0; i < 4; i++) {
    const y = top + 30 + i * ((shore - top) / 4.4);
    const l = waveLine(y, 3, 120 + i * 20, i * 1.3, -10, 1010);
    w.M(-10, y);
    for (let x = 0; x <= 1010; x += 10) w.L(x, y + Math.sin((x / (120 + i * 20)) * Math.PI * 2 + i * 1.3) * 3);
    void l;
  }
  out.push(place([{ path: w, stroke: "#ffffff", strokeWidth: 2, opacity: 0.16 }], 3));
  return out;
}

function shore(y: number): Layer[] {
  return [
    place([{ path: waveShape(y, 7, 200, 1, 1420), fill: SAND }], 2),
    place(
      [
        { path: waveLine(y - 6, 7, 200, 1), stroke: "#ffe6c0", strokeWidth: 5, opacity: 0.8 },
        { path: waveLine(y - 20, 6, 170, 3), stroke: "#ffffff", strokeWidth: 2.5, opacity: 0.35 },
      ],
      3,
    ),
  ];
}

const palm = (bx: number, by: number, tx: number, ty: number, s = 1, w = 22, seed = 3): Layer =>
  place(palmSpecs(bx, by, tx, ty, PLUM, s, w, 9, seed), 3);

const archPanel = (x: number, y: number, w: number, h: number, op = 0.55): Layer[] => {
  const r = w / 2;
  const build = (inset: number) => {
    const p = new Path();
    p.M(x + inset, y + h - inset).L(x + inset, y + r).A(r - inset, r - inset, 0, 0, 1, x + w - inset, y + r).L(x + w - inset, y + h - inset).Z();
    p.include([x, y], [x + w, y + h]);
    return p;
  };
  return [
    place([{ path: build(0), fill: "#240f3e", opacity: op }], 2),
    place([{ path: build(0), stroke: CREAM, strokeWidth: 3, opacity: 0.9 }, { path: build(14), stroke: GOLDL, strokeWidth: 1.5, opacity: 0.7 }], 3),
  ];
};

export default function build(): TemplateDef {
  /* --------------------------------- cover --------------------------------- */
  const cover = P(
    SKY,
    [
      starfield(4, 70, [0, 0, 1000, 480]),
      lock(O(sunburst({ color: GOLDL, rays: 26, size: 2000, core: 0.03 }), { x: 500 - 1000, y: 770 - 1000, opacity: 0.1 })),
      lock(sun(500, 790, 125, 20, linear(90, [0, "#fff6c0"], [1, "#ffcf5a"]), "#ffd27a")),
      ...sea(780, 1040, 500),
      ...shore(1040),
      palm(60, 1200, 120, 700, 1.0, 24, 3),
      palm(-20, 1200, 40, 900, 0.7, 18, 8),
      palm(950, 1200, 880, 680, 1.05, 24, 5),
      palm(1030, 1200, 970, 880, 0.7, 18, 11),
      ...stringLights(-20, 40, 1020, 40, 110, 14, BULBS, "#2a0f3a", 0.4, 12),
      label("Join us for a", 178, { fontSize: 22 }),
      T("Sunset", 206, { x: 80, width: 840, fontFamily: "Sacramento", fontSize: 250, lineHeight: 1.05, fill: CREAM, shadow: sh }),
      T("Beach Bonfire", 468, { x: 100, width: 800, fontFamily: "Josefin Sans", fontWeight: 600, fontSize: 70, letterSpacing: 14, uppercase: true, fill: "#fff6e6", shadow: sh }),
      lock(S({ x: 380, y: 570, width: 240, height: 2, fill: CREAM, opacity: 0.8 })),
      ...logsAndFire(500, 1075, 0.72),
      T("Saturday, August 7, 2027", 1118, { x: 100, width: 800, fontFamily: "Cormorant Garamond", fontWeight: 600, fontSize: 56, lineHeight: 1.1, fill: CREAM }),
      T("Sundown at 6:00 PM", 1188, { x: 100, width: 800, fontFamily: "Josefin Sans", fontWeight: 600, fontSize: 24, letterSpacing: 8, uppercase: true, fill: GOLDL }),
      T("Inani Beach, Cox's Bazar", 1240, { x: 100, width: 800, fontFamily: "Cormorant Garamond", fontWeight: 500, fontSize: 36, fill: CREAM, opacity: 0.92 }),
      T(GUEST_TOKEN, 1318, { x: 200, width: 600, fontFamily: "Sacramento", fontSize: 56, lineHeight: 1.1, fill: GOLDL }),
    ],
    "Invitation",
  );

  /* -------------------------------- details -------------------------------- */
  const item = (y: number, time: string, title: string, sub: string): Layer[] => [
    T(time, y + 8, { x: 220, width: 170, align: "left", fontFamily: "Sacramento", fontSize: 52, lineHeight: 1.1, fill: GOLDL }),
    lock(S({ x: 402, y: y + 10, width: 2, height: 80, fill: CREAM, opacity: 0.45 })),
    T(title, y + 6, { x: 430, width: 390, align: "left", fontFamily: "Cormorant Garamond", fontWeight: 700, fontSize: 38, lineHeight: 1.1, fill: CREAM }),
    T(sub, y + 54, { x: 430, width: 390, align: "left", fontFamily: "Josefin Sans", fontWeight: 400, fontSize: 19, letterSpacing: 1, fill: CREAM, opacity: 0.8 }),
  ];
  const details = P(
    SKY,
    [
      starfield(14, 80, [0, 0, 1000, 520]),
      lock(O(sunburst({ color: GOLDL, rays: 26, size: 2000, core: 0.03 }), { x: 500 - 1000, y: 1100 - 1000, opacity: 0.1 })),
      ...stringLights(-20, 30, 1020, 30, 90, 14, BULBS, "#2a0f3a", 0.4, 12),
      palm(40, 1400, 120, 1050, 1.0, 22, 3),
      palm(960, 1400, 880, 1020, 1.05, 22, 5),
      label("The evening", 150, { fontSize: 22 }),
      T("Tonight's Plan", 176, { x: 80, width: 840, fontFamily: "Sacramento", fontSize: 150, lineHeight: 1.05, fill: CREAM, shadow: sh }),
      ...archPanel(150, 360, 700, 720),
      ...item(520, "6:00", "Golden Hour", "Welcome drinks on the sand"),
      ...item(644, "7:00", "Light the Fire", "Seafood BBQ by the bonfire"),
      ...item(768, "8:30", "Music & S'mores", "Guitars, songs and marshmallows"),
      ...item(892, "10:00", "Stargazing", "Blankets, lanterns and wishes"),
      T("Barefoot is encouraged", 1008, { x: 170, width: 660, fontFamily: "Sacramento", fontSize: 54, lineHeight: 1.1, fill: GOLDL }),
      ...shore(1210),
      ...logsAndFire(500, 1262, 0.6),
      T("Bring a warm layer  ·  Wear something breezy", 1316, { x: 100, width: 800, fontFamily: "Josefin Sans", fontWeight: 600, fontSize: 18, letterSpacing: 4, uppercase: true, fill: CREAM, opacity: 0.9 }),
    ],
    "Details",
  );

  /* ------------------------------ photo page ------------------------------ */
  const photo = P(
    SKY,
    [
      starfield(31, 80, [0, 0, 1000, 480]),
      lock(O(sunburst({ color: GOLDL, rays: 26, size: 2000, core: 0.03 }), { x: 500 - 1000, y: 700 - 1000, opacity: 0.1 })),
      ...stringLights(-20, 30, 1020, 30, 90, 14, BULBS, "#2a0f3a", 0.4, 12),
      palm(30, 1220, 100, 760, 0.95, 22, 3),
      palm(970, 1220, 900, 720, 1.0, 22, 5),
      label("Memories by the fire", 150, { fontSize: 20 }),
      archFill(262, 222, 476, 640, GOLDL),
      archFill(276, 236, 448, 612, "#240f3e"),
      I({ x: 284, y: 244, width: 432, height: 596, mask: "arch", placeholderFill: "#f4a36a" }),
      T("Come as you are", 900, { x: 100, width: 800, fontFamily: "Sacramento", fontSize: 108, lineHeight: 1.1, fill: "#2a0f3a" }),
      T("Bring a blanket, a guitar and your good vibes.", 1020, { x: 140, width: 720, fontFamily: "Cormorant Garamond", fontWeight: 700, fontSize: 38, lineHeight: 1.25, fill: "#2a0f3a" }),
      ...shore(1130),
      ...logsAndFire(500, 1210, 0.6),
      T("See you at sundown", 1286, { x: 100, width: 800, fontFamily: "Sacramento", fontSize: 76, lineHeight: 1.1, fill: GOLDL }),
      glow(500, 700, 420, "#ff9a3c", 0.1),
    ],
    "Photo",
  );

  return {
    slug: "beach-bonfire-sunset",
    name: "Beach Bonfire Sunset",
    tagline: "Boho sunset beach bonfire invitation with palm silhouettes and string lights",
    description:
      "An evening beach party invitation with a glowing sunset gradient, rolling waves, palm silhouettes, warm string lights and a crackling bonfire in boho script. Perfect for beach bonfires, sundowner parties and summer night gatherings.",
    categories: ["party", "summer", "beach", "boho", "nature", "festive"],
    keywords: ["beach bonfire party invitation", "sunset beach party invite template", "boho summer evening invitation", "palm tree silhouette party card", "string lights beach birthday invitation", "sundowner party invitation"],
    palette: ["#170a38", "#b03a7a", "#ff6b57", "#ffd27a", "#1c0b2e"],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}

function archFill(x: number, y: number, w: number, h: number, fill: string): Layer {
  const r = w / 2;
  const p = new Path();
  p.M(x, y + h).L(x, y + r).A(r, r, 0, 0, 1, x + w, y + r).L(x + w, y + h).Z();
  p.include([x, y], [x + w, y + h]);
  return place([{ path: p, fill }], 1);
}
