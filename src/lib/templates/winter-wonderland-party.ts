import { GUEST_TOKEN } from "../design/types";
import type { Layer, Paint } from "../design/types";
import { H, I, linear, lock, O, P, S, SILVER, T, W, type TemplateDef } from "./kit";
import { Path, type PartSpec } from "../design/path";
import { drift, flake, glitter, pine, place, rng, snowfield, sparkAt } from "./winter-party.art";
import { divider } from "../design/ornaments";

/** Winter Wonderland party: twilight sky, layered frosted pine forest, glitter and frosted-glass panels. */

const SKY: Paint = linear(90, [0, "#07163a"], [0.4, "#1a4a8c"], [0.72, "#7fb4e4"], [1, "#e6f4ff"]);
const NIGHT: Paint = linear(90, [0, "#08183c"], [0.55, "#1b4b8e"], [1, "#4a86c5"]);
const ICE = "#cfe9ff";
const SHADOW = { color: "#06204a", blur: 18, offsetX: 0, offsetY: 4, opacity: 0.55 };

function forest(seed: number, baseY: number, hMin: number, hMax: number, fill: Paint, shade: string, snow: string, x0 = -30, x1 = 1030, gap = 80, skip?: (x: number) => boolean): Layer {
  const r = rng(seed);
  const specs: PartSpec[] = [];
  for (let x = x0; x < x1; x += gap * (0.75 + r() * 0.5)) {
    if (skip?.(x)) continue;
    const h = hMin + r() * (hMax - hMin);
    specs.push(...pine({ cx: x, baseY: baseY + r() * 14, h, w: h * 0.5, tiers: 4 + Math.floor(r() * 2), fill, shade, snow }));
  }
  return place(specs, 2);
}

function bigFlake(cx: number, cy: number, R: number, color: string, sw: number, op = 1): Layer {
  const p = new Path();
  flake(p, cx, cy, R, 0);
  const hex = new Path();
  for (let i = 0; i < 6; i++) {
    const a = (i * 60 + 30) * (Math.PI / 180);
    const x = cx + Math.cos(a) * R * 0.2;
    const y = cy + Math.sin(a) * R * 0.2;
    if (i === 0) hex.M(x, y);
    else hex.L(x, y);
  }
  hex.Z();
  const tips = new Path();
  for (let i = 0; i < 6; i++) tips.circle(cx + Math.cos((i * 60 * Math.PI) / 180) * R * 1.02, cy + Math.sin((i * 60 * Math.PI) / 180) * R * 1.02, sw * 0.95);
  return place(
    [
      { path: p, stroke: color, strokeWidth: sw },
      { path: hex, stroke: color, strokeWidth: sw * 0.8 },
      { path: tips, fill: color },
    ],
    2,
    { opacity: op },
  );
}

const glass = (x: number, y: number, w: number, h: number, r = 30, fillOp = 0.13): Layer[] => [
  lock(S({ x, y, width: w, height: h, cornerRadius: r, fill: "#ffffff", opacity: fillOp })),
  lock(S({ x: x + 6, y: y + 6, width: w - 12, height: h - 12, cornerRadius: r - 5, fill: null, stroke: "#ffffff", strokeWidth: 1.6, opacity: 0.55 })),
  lock(S({ x, y, width: w, height: h, cornerRadius: r, fill: null, stroke: "#e6f4ff", strokeWidth: 2.5, opacity: 0.85 })),
];

const glow = (cx: number, cy: number, base: number, k = 1): Layer[] =>
  [
    [1, 0.012],
    [0.92, 0.014],
    [0.84, 0.016],
    [0.76, 0.018],
    [0.68, 0.02],
    [0.6, 0.022],
    [0.52, 0.024],
    [0.44, 0.026],
    [0.36, 0.028],
    [0.28, 0.03],
  ].map(([s, o]) => lock(S({ shape: "ellipse", x: cx - (base * s) / 2, y: cy - (base * s) / 2, width: base * s, height: base * s, fill: "#ffffff", opacity: o * k })));

const label = (text: string, y: number, o: Record<string, unknown> = {}) =>
  T(text, y, { x: 120, width: 760, fontFamily: "Josefin Sans", fontWeight: 600, fontSize: 22, letterSpacing: 10, uppercase: true, fill: ICE, ...o });

export default function build(): TemplateDef {
  const ground = (y: number, seed: number): Layer[] => [
    lock(place([drift(-20, 1020, y - 44, 38, seed + 1, "#dcecfa")], 0)),
    lock(place([drift(-20, 1020, y, 44, seed, linear(90, [0, "#ffffff"], [1, "#c6e0f6"]))], 0)),
  ];

  /* --------------------------------- cover --------------------------------- */
  const cover = P(
    SKY,
    [
      ...glow(500, 330, 980),
      glitter({ seed: 3, count: 70, area: [30, 30, 970, 900], colors: ["#ffffff", "#d7ecff", "#a8d4ff"], minS: 6, maxS: 20, skip: (x, y) => (x > 120 && x < 880 && y > 40 && y < 580) || (x > 140 && x < 860 && y > 560 && y < 930) }),
      snowfield({ seed: 8, count: 38, area: [10, 10, 990, 1000], minR: 8, maxR: 30, skip: (x, y) => (x > 120 && x < 880 && y > 40 && y < 580) || (x > 140 && x < 860 && y > 560 && y < 930) }),
      bigFlake(112, 150, 46, "#ffffff", 3.4, 0.9),
      bigFlake(896, 205, 38, "#ffffff", 3, 0.85),
      forest(21, 1150, 150, 215, linear(90, [0, "#a5c9ea"], [1, "#86b2dc"]), "#5b8cc0", "#ffffff"),
      forest(34, 1222, 220, 300, linear(90, [0, "#4a7fba"], [1, "#2a5a98"]), "#143b73", "#f3faff", -30, 1030, 120, (x) => x > 380 && x < 620),
      ...ground(1290, 5),
      lock(place([...pine({ cx: 70, baseY: 1340, h: 600, w: 330, tiers: 6, fill: linear(90, [0, "#1c4a7e"], [1, "#0e2f5c"]), shade: "#06193a", snow: "#ffffff" }), ...pine({ cx: 215, baseY: 1345, h: 340, w: 190, tiers: 5, fill: linear(90, [0, "#245a92"], [1, "#133868"]), shade: "#06193a", snow: "#f5fbff" })], 2)),
      lock(place([...pine({ cx: 935, baseY: 1340, h: 540, w: 300, tiers: 6, fill: linear(90, [0, "#1c4a7e"], [1, "#0e2f5c"]), shade: "#06193a", snow: "#ffffff" }), ...pine({ cx: 790, baseY: 1345, h: 300, w: 170, tiers: 5, fill: linear(90, [0, "#245a92"], [1, "#133868"]), shade: "#06193a", snow: "#f5fbff" })], 2)),
      snowfield({ seed: 41, count: 22, area: [10, 700, 990, 1390], minR: 9, maxR: 26, skip: (x, y) => (x > 120 && x < 880 && y > 40 && y < 580) || (x > 140 && x < 860 && y > 560 && y < 930) }),
      label("You're invited to a", 62, { fontSize: 22 }),
      T("Winter", 84, { x: 40, width: 920, fontFamily: "Great Vibes", fontSize: 250, lineHeight: 1, fill: "#ffffff", shadow: SHADOW }),
      T("Wonderland", 334, { x: 40, width: 920, fontFamily: "Cinzel", fontWeight: 600, fontSize: 78, letterSpacing: 14, fill: SILVER, shadow: SHADOW }),
      lock(S({ x: 120, y: 445, width: 170, height: 2, fill: "#ffffff", opacity: 0.8 })),
      lock(S({ x: 710, y: 445, width: 170, height: 2, fill: "#ffffff", opacity: 0.8 })),
      T("Holiday party", 428, { x: 280, width: 440, fontFamily: "Josefin Sans", fontWeight: 600, fontSize: 25, letterSpacing: 9, uppercase: true, fill: "#ffffff" }),
      ...glass(150, 574, 700, 330),
      T("Saturday", 604, { x: 200, width: 600, fontFamily: "Josefin Sans", fontWeight: 600, fontSize: 21, letterSpacing: 12, uppercase: true, fill: ICE }),
      T("18 December 2027", 640, { x: 170, width: 660, fontFamily: "Playfair Display", italic: true, fontSize: 56, fill: "#ffffff" }),
      T("6:00 PM  till late", 718, { x: 200, width: 600, fontFamily: "Josefin Sans", fontWeight: 400, fontSize: 28, letterSpacing: 4, fill: "#ffffff" }),
      lock(O(divider({ style: "stars", w: 280, color: "#cfe9ff", strokeWidth: 2 }), { cx: W / 2, y: 774 })),
      T("The Glass Pavilion", 806, { x: 180, width: 640, fontFamily: "Cormorant Garamond", fontWeight: 600, fontSize: 44, fill: "#ffffff" }),
      T("Aspen Lodge, Whistler Valley", 862, { x: 180, width: 640, fontFamily: "Josefin Sans", fontWeight: 300, fontSize: 22, letterSpacing: 3, fill: ICE }),
      sparkAt(172, 592, 30, "#ffffff"),
      sparkAt(834, 886, 26, "#ffffff"),
      T(GUEST_TOKEN, 492, { x: 250, width: 500, fontFamily: "Great Vibes", fontSize: 58, lineHeight: 1.1, fill: "#ffffff", shadow: SHADOW }),
      T("Cocoa  ·  Ice sculptures  ·  Dancing", 1322, { x: 230, width: 540, fontFamily: "Josefin Sans", fontWeight: 600, fontSize: 17, letterSpacing: 3, uppercase: true, fill: "#2a5a98" }),
    ],
    "Invitation",
  );

  /* -------------------------------- schedule -------------------------------- */
  const items: [string, string, string][] = [
    ["6:00 PM", "Frosted Arrivals", "Sparkling welcome drinks and a snow-globe photo corner"],
    ["7:00 PM", "The Winter Feast", "A candle-lit buffet beneath the fairy-light pines"],
    ["8:30 PM", "Snowflake Social", "Games, karaoke and the great ice sculpture reveal"],
    ["10:00 PM", "Fireside Dancing", "DJ sets, a hot cocoa bar and a glittering dance floor"],
    ["11:30 PM", "Last Snowfall", "Sparklers on the terrace and warm goodbye toasts"],
  ];
  const rows: Layer[] = [];
  items.forEach(([time, title, desc], i) => {
    const y = 350 + i * 166;
    rows.push(
      T(time, y + 6, { x: 60, width: 200, align: "right", fontFamily: "Josefin Sans", fontWeight: 600, fontSize: 27, letterSpacing: 2, fill: "#ffffff" }),
      bigFlake(318, y + 24, 24, "#ffffff", 3, 1),
      T(title, y - 8, { x: 372, width: 560, align: "left", fontFamily: "Playfair Display", fontWeight: 500, fontSize: 40, fill: "#ffffff" }),
      T(desc, y + 50, { x: 372, width: 540, align: "left", fontFamily: "Josefin Sans", fontWeight: 300, fontSize: 22, lineHeight: 1.3, fill: ICE }),
    );
  });
  const details = P(
    NIGHT,
    [
      ...glow(500, 150, 900, 0.8),
      glitter({ seed: 14, count: 50, area: [20, 20, 980, 1380], colors: ["#ffffff", "#d7ecff"], minS: 5, maxS: 16, skip: (x, y) => (x > 60 && x < 940 && y > 300 && y < 1150) || (x > 130 && x < 870 && y < 300) }),
      snowfield({ seed: 19, count: 26, area: [10, 10, 990, 1390], minR: 8, maxR: 26, skip: (x, y) => (x > 40 && x < 960 && y > 300 && y < 1160) || (x > 130 && x < 870 && y < 300) }),
      label("The evening ahead", 80, { fontSize: 21 }),
      T("Winter Wonderland", 128, { x: 60, width: 880, fontFamily: "Great Vibes", fontSize: 112, lineHeight: 1, fill: "#ffffff", shadow: SHADOW }),
      lock(O(divider({ style: "stars", w: 360, color: "#cfe9ff", strokeWidth: 2 }), { cx: W / 2, y: 268 })),
      lock(S({ x: 317, y: 374, width: 2, height: 4 * 166 + 6, fill: "#ffffff", opacity: 0.35 })),
      ...rows,
      ...glass(100, 1198, 800, 100, 26),
      T("Dress code", 1212, { x: 120, width: 760, fontFamily: "Josefin Sans", fontWeight: 600, fontSize: 18, letterSpacing: 10, uppercase: true, fill: ICE }),
      T("Winter whites, silver & icy blues", 1244, { x: 120, width: 760, fontFamily: "Playfair Display", italic: true, fontSize: 34, fill: "#ffffff" }),
      ...ground(1372, 61),
      lock(place(pine({ cx: 60, baseY: 1380, h: 190, w: 100, tiers: 4, fill: linear(90, [0, "#1c4a7e"], [1, "#0e2f5c"]), shade: "#06193a", snow: "#ffffff" }), 2)),
      lock(place(pine({ cx: 945, baseY: 1380, h: 170, w: 90, tiers: 4, fill: linear(90, [0, "#1c4a7e"], [1, "#0e2f5c"]), shade: "#06193a", snow: "#ffffff" }), 2)),
    ],
    "Schedule",
  );

  /* --------------------------------- photo --------------------------------- */
  const photo = P(
    SKY,
    [
      ...glow(500, 600, 1100, 0.9),
      glitter({ seed: 27, count: 70, area: [20, 20, 980, 1000], colors: ["#ffffff", "#d7ecff", "#a8d4ff"], minS: 6, maxS: 18, skip: (x, y) => (x > 220 && x < 780 && y > 250 && y < 960) || (x > 150 && x < 850 && y < 230) }),
      snowfield({ seed: 33, count: 30, area: [10, 10, 990, 1100], minR: 8, maxR: 28, skip: (x, y) => (x > 220 && x < 780 && y > 250 && y < 960) || (x > 150 && x < 850 && y < 230) }),
      forest(52, 1285, 140, 200, linear(90, [0, "#a5c9ea"], [1, "#86b2dc"]), "#5b8cc0", "#ffffff"),
      forest(63, 1340, 200, 280, linear(90, [0, "#4a7fba"], [1, "#2a5a98"]), "#143b73", "#f3faff", -30, 1030, 110),
      ...ground(1368, 77),
      T("Let it snow", 70, { x: 80, width: 840, fontFamily: "Great Vibes", fontSize: 130, lineHeight: 1, fill: "#ffffff", shadow: SHADOW }),
      I({ x: 256, y: 276, width: 488, height: 628, mask: "arch", placeholderFill: "#a9cdee", borderColor: "#f2faff", borderWidth: 8 }),
      bigFlake(180, 330, 52, "#ffffff", 3.6, 0.95),
      bigFlake(826, 640, 60, "#ffffff", 3.8, 0.95),
      bigFlake(186, 820, 34, "#ffffff", 3, 0.85),
      sparkAt(790, 300, 40, "#ffffff"),
      sparkAt(210, 560, 30, "#ffffff"),
      T("Come in from the cold", 960, { x: 100, width: 800, fontFamily: "Playfair Display", italic: true, fontSize: 50, fill: "#123a72" }),
      T("and warm up with us. Bring your brightest sparkle,", 1030, { x: 100, width: 800, fontFamily: "Josefin Sans", fontWeight: 400, fontSize: 25, fill: "#123a72" }),
      T("a hungry heart and your dancing shoes.", 1068, { x: 100, width: 800, fontFamily: "Josefin Sans", fontWeight: 400, fontSize: 25, fill: "#123a72" }),
      T("Hosted by Olivia & Noah Bennett", 1350, { x: 100, width: 800, fontFamily: "Josefin Sans", fontWeight: 600, fontSize: 21, letterSpacing: 6, uppercase: true, fill: "#2a5a98" }),
    ],
    "Message",
  );

  return {
    slug: "winter-wonderland-party",
    name: "Winter Wonderland Party",
    tagline: "Icy twilight winter party invitation with frosted pines and glitter",
    description:
      "A sparkling winter wonderland party invitation with a twilight sky, layered snow-covered pine forest, frosted-glass details panel and falling snowflakes. Perfect for holiday parties, winter birthdays and snowy celebrations.",
    categories: ["party", "winter", "holiday", "seasonal", "celestial"],
    keywords: ["winter wonderland party invitation", "snowflake holiday party invite template", "frozen themed winter birthday invitation", "icy blue winter party card", "snowy pine forest invitation", "winter white party invitation"],
    palette: ["#07163a", "#1a4a8c", "#7fb4e4", "#e6f4ff", "#ffffff"],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
