import { banner } from "../design/ornaments";
import { GUEST_TOKEN } from "../design/types";
import type { Layer, Paint } from "../design/types";
import { Path, type PartSpec } from "../design/path";
import { H, I, linear, lock, O, P, S, T, W, type TemplateDef } from "./kit";
import { berries, fir, glitter, holly, knitBand, mug, pinecone, place, plaid } from "./winter-party.art";

/** Cozy cabin winter brunch: buffalo plaid, hot-cocoa mugs, knit scarf bands, pine boughs and playful script. */

const CREAM = "#fbf3e2";
const RED = "#b3262d";
const DARK = "#2b1a12";
const BROWN = "#6b4226";
const GREEN = "#2f5d46";
const PAPER: Paint = linear(90, [0, "#fbf3e2"], [1, "#f1e0c0"]);
const SH = { color: "#1a0d0b", blur: 10, offsetX: 0, offsetY: 3, opacity: 0.55 };
const PINE_D = "#2f5d46";
const PINE_L = "#5f9b78";

const plaidBg = (h: number, y = 0) => plaid(0, y, W, h, { base: RED, dark: "#14090a", cell: 62, line: "#ffd9d2", band: 0.5 });

/** Scalloped cream edge hiding the bottom of a plaid band ending at y. */
function scallop(y: number, fill: string, r = 34): Layer {
  const p = new Path();
  for (let x = -r; x < W + r; x += r * 1.9) p.circle(x + r, y + r * 0.35, r);
  const q = new Path().poly([[-r, y + r * 0.4], [W + 2 * r, y + r * 0.4], [W + 2 * r, y + r * 3], [-r, y + r * 3]], true);
  return place([{ path: p, fill }, { path: q, fill }], 0);
}

function stitch(y: number, x0 = 0, x1 = W, color = CREAM, op = 0.8, w = 14, gap = 12): Layer {
  const p = new Path();
  for (let x = x0; x < x1; x += w + gap) p.M(x, y).L(Math.min(x + w, x1), y);
  return place([{ path: p, stroke: color, strokeWidth: 3, opacity: op }], 1);
}

function bough(x: number, y: number, mx: number, my: number, scale = 1, extras = true): Layer {
  const ang = (a: number) => (mx < 0 ? 180 - a : a) * (my < 0 ? -1 : 1);
  const specs: PartSpec[] = [];
  for (const [len, a, c] of [
    [300, 12, 0.1],
    [330, 38, -0.08],
    [270, 62, 0.1],
    [210, 84, -0.06],
  ] as const) specs.push(...fir(x, y, { len: len * scale, angle: ang(a), curve: c * mx * my, needle: 30 * scale, dark: PINE_D, light: PINE_L }));
  if (extras) {
    specs.push(...pinecone(x + mx * 150 * scale, y + my * 110 * scale, 54 * scale, 84 * scale, mx * my > 0 ? -40 * mx : 40 * mx, { a: "#8a5a35", b: "#5a3a22", tip: "#a8754a" }));
    specs.push(...holly(x + mx * 70 * scale, y + my * 175 * scale, 70 * scale, mx < 0 ? 70 : 110));
    specs.push(...berries(x + mx * 235 * scale, y + my * 50 * scale, 8 * scale, 4, 5 + Math.round(x)));
  }
  return place(specs, 2);
}

const LEFT_MUG = { body: linear(90, [0, "#e04048"], [1, "#a51f27"]) as Paint, bodyDark: "#5a0b11", rim: "#fff6e6", cocoa: "#4a2a1c", band: "#fff6e6", bandDark: RED, handle: "#a51f27", marsh: true, steam: true };
const RIGHT_MUG = { body: linear(90, [0, "#4f8d6c"], [1, "#2a5a43"]) as Paint, bodyDark: "#0f2a1d", rim: "#fff6e6", cocoa: "#4a2a1c", band: CREAM, bandDark: GREEN, handle: "#2a5a43", marsh: true, steam: true, candy: true };

const label = (text: string, y: number, o: Record<string, unknown> = {}) =>
  T(text, y, { x: 120, width: 760, fontFamily: "Poppins", fontWeight: 600, fontSize: 20, letterSpacing: 7, uppercase: true, fill: BROWN, ...o });

function scarf(x: number, y: number, w: number, rows: number, sz = 22, a = RED, b = CREAM, c = GREEN): Layer {
  return knitBand(x, y, w, rows, sz, [a, b, c], (r, col) => {
    if (r === 0 || r === rows - 1) return 0;
    const m = col % 8;
    return m === 3 || m === 4 ? 2 : r % 2 ? 1 : (col + r) % 2 ? 1 : 0;
  });
}

export default function build(): TemplateDef {
  const sparkles = (seed: number, skip: (x: number, y: number) => boolean, area: [number, number, number, number] = [20, 20, 980, 1380]) =>
    glitter({ seed, count: 26, area, colors: ["#e8c98a", "#ffffff"], minS: 5, maxS: 12, skip, opacity: 0.8 });

  /* --------------------------------- cover --------------------------------- */
  const cover = P(
    PAPER,
    [
      plaidBg(520),
      scallop(494, "#f9efd9"),
      stitch(468, 30, 970),
      bough(0, 0, 1, 1, 0.8),
      bough(W, 0, -1, 1, 0.8),
      lock(S({ x: 290, y: 58, width: 420, height: 50, cornerRadius: 25, fill: DARK, opacity: 0.88 })),
      T("You're invited to a", 70, { x: 290, width: 420, fontFamily: "Poppins", fontWeight: 600, fontSize: 19, letterSpacing: 6, uppercase: true, fill: CREAM }),
      lock(O(banner({ color: CREAM, w: 800, h: 170, stroke: DARK }), { cx: W / 2, y: 140 })),
      T("Cozy Cabin", 160, { x: 160, width: 680, fontFamily: "Satisfy", fontSize: 118, lineHeight: 1.1, fill: RED }),
      T("Winter Brunch & Hot Cocoa Party", 346, { x: 80, width: 840, fontFamily: "Abril Fatface", fontSize: 44, lineHeight: 1.1, fill: CREAM, shadow: SH }),
      lock(place(mug(318, 558, 220, 196, LEFT_MUG), 2)),
      lock(place(mug(682, 566, 212, 188, RIGHT_MUG), 2)),
      lock(place([...fir(500, 650, { len: 140, angle: 200, curve: 0.1, needle: 24, dark: PINE_D, light: PINE_L }), ...fir(500, 650, { len: 140, angle: -20, curve: -0.1, needle: 24, dark: PINE_D, light: PINE_L }), ...pinecone(500, 640, 56, 86, 20, { a: "#8a5a35", b: "#5a3a22", tip: "#a8754a" }), ...berries(540, 668, 8, 4, 12)], 2)),
      T("Saturday, 18 December 2027", 722, { x: 80, width: 840, fontFamily: "Fraunces", fontWeight: 600, fontSize: 46, fill: DARK }),
      T("10:30 AM  till  2:00 PM", 784, { x: 120, width: 760, fontFamily: "Poppins", fontWeight: 600, fontSize: 28, letterSpacing: 3, fill: RED }),
      scarf(250, 846, 500, 2, 20),
      T("The Pinecrest Cabin", 912, { x: 120, width: 760, fontFamily: "Satisfy", fontSize: 70, lineHeight: 1.1, fill: GREEN }),
      T("412 Larch Hollow Road, Cedar Ridge", 996, { x: 120, width: 760, fontFamily: "Poppins", fontSize: 24, fill: BROWN }),
      label("Flannels & fuzzy socks encouraged", 1046, { fontSize: 17, letterSpacing: 5, fill: RED }),
      T(GUEST_TOKEN, 1096, { x: 250, width: 500, fontFamily: "Satisfy", fontSize: 58, lineHeight: 1.1, fill: DARK }),
      T("Pancakes  ·  Cocoa bar  ·  Board games  ·  Bonfire", 1262, { x: 150, width: 700, fontFamily: "Poppins", fontWeight: 600, fontSize: 16, letterSpacing: 4, uppercase: true, fill: BROWN }),
      plaidBg(70, 1330),
      stitch(1316, 30, 970, RED, 0.7),
      bough(0, 1400, 1, -1, 0.62, false),
      bough(W, 1400, -1, -1, 0.62, false),
      sparkles(5, (x, y) => (x > 100 && x < 900 && y > 300 && y < 1300) || y < 520),
    ],
    "Invitation",
  );

  /* -------------------------------- schedule -------------------------------- */
  const items: [string, string, string][] = [
    ["10:30 AM", "Cocoa Bar Opens", "Build your mug with marshmallows, candy canes and whipped cream"],
    ["11:00 AM", "Cabin Brunch", "Fluffy pancakes, crispy bacon, baked eggs and fresh fruit"],
    ["12:30 PM", "Games by the Fire", "Card games, puzzles and s'mores at the bonfire"],
    ["1:30 PM", "Snowy Trail Walk", "Bundle up and wander the pine trails behind the cabin"],
  ];
  const rows: Layer[] = [];
  items.forEach(([time, title, desc], i) => {
    const y = 392 + i * 170;
    rows.push(
      lock(S({ x: 130, y: y + 6, width: 200, height: 56, cornerRadius: 28, fill: RED })),
      T(time, y + 17, { x: 130, width: 200, fontFamily: "Poppins", fontWeight: 700, fontSize: 24, fill: CREAM }),
      T(title, y - 4, { x: 366, width: 500, align: "left", fontFamily: "Satisfy", fontSize: 54, lineHeight: 1.1, fill: CREAM }),
      T(desc, y + 62, { x: 366, width: 500, align: "left", fontFamily: "Poppins", fontWeight: 300, fontSize: 21, lineHeight: 1.35, fill: "#eadcc0" }),
    );
    if (i < items.length - 1) rows.push(lock(S({ x: 130, y: y + 142, width: 740, height: 2, fill: CREAM, opacity: 0.22 })));
  });
  const details = P(
    PAPER,
    [
      plaidBg(130),
      scallop(104, "#f9efd9"),
      stitch(80, 30, 970),
      bough(0, 0, 1, 1, 0.5, false),
      bough(W, 0, -1, 1, 0.5, false),
      T("What's Cooking", 160, { x: 80, width: 840, fontFamily: "Satisfy", fontSize: 108, lineHeight: 1.1, fill: RED }),
      label("The cabin schedule", 296, { fontSize: 18 }),
      lock(S({ x: 100, y: 352, width: 800, height: 726, cornerRadius: 24, fill: "#2f2019", stroke: "#a8754a", strokeWidth: 14 })),
      lock(S({ x: 116, y: 368, width: 768, height: 694, cornerRadius: 14, fill: null, stroke: CREAM, strokeWidth: 1.4, opacity: 0.4, dash: [10, 8] })),
      ...rows,
      scarf(150, 1120, 700, 3, 22),
      T("Dress code:  flannels, fuzzy socks & your coziest sweater", 1218, { x: 100, width: 800, fontFamily: "Poppins", fontWeight: 600, fontSize: 19, letterSpacing: 2, fill: BROWN }),
      lock(place(mug(214, 1306, 104, 92, { ...LEFT_MUG, steam: false }), 2)),
      lock(place(mug(786, 1308, 100, 90, { ...RIGHT_MUG, steam: false, candy: false }), 2)),
      T("see you by the fire", 1284, { x: 300, width: 400, fontFamily: "Satisfy", fontSize: 44, lineHeight: 1.1, fill: GREEN }),
      sparkles(9, (x, y) => y < 340 || (x > 80 && x < 920 && y > 340 && y < 1100)),
    ],
    "Schedule",
  );

  /* --------------------------------- photo --------------------------------- */
  const tape = (x: number, y: number, rot: number): Layer => lock({ ...S({ x, y, width: 130, height: 40, fill: "#e8c98a", opacity: 0.8 }), rotation: rot });
  const photo = P(
    PAPER,
    [
      plaidBg(H),
      lock(S({ x: 0, y: 0, width: W, height: H, fill: "#14090a", opacity: 0.18 })),
      bough(0, 0, 1, 1, 0.75),
      bough(W, 0, -1, 1, 0.75),
      lock(S({ x: 205, y: 262, width: 620, height: 760, cornerRadius: 8, fill: "#000000", opacity: 0.28 })),
      lock(S({ x: 190, y: 248, width: 620, height: 760, cornerRadius: 8, fill: "#fffaf0" })),
      I({ x: 226, y: 284, width: 548, height: 548, mask: "rect", placeholderFill: "#d9c3a0" }),
      tape(230, 232, -7),
      tape(640, 236, 8),
      T("cozy season is here", 862, { x: 200, width: 600, fontFamily: "Satisfy", fontSize: 58, lineHeight: 1.1, fill: RED }),
      T("pine, plaid & cocoa", 934, { x: 200, width: 600, fontFamily: "Poppins", fontWeight: 600, fontSize: 18, letterSpacing: 6, uppercase: true, fill: BROWN }),
      lock(S({ x: 130, y: 1066, width: 740, height: 200, cornerRadius: 28, fill: "#fbf3e2", stroke: DARK, strokeWidth: 3 })),
      lock(S({ x: 144, y: 1080, width: 712, height: 172, cornerRadius: 18, fill: null, stroke: RED, strokeWidth: 1.5, dash: [8, 7] })),
      T("Come warm up with us!", 1092, { x: 150, width: 700, fontFamily: "Satisfy", fontSize: 58, lineHeight: 1.1, fill: GREEN }),
      T("Bring your appetite, a cozy sweater", 1172, { x: 150, width: 700, fontFamily: "Poppins", fontSize: 22, fill: DARK }),
      T("and your best cabin stories.", 1204, { x: 150, width: 700, fontFamily: "Poppins", fontSize: 22, fill: DARK }),
      T("Hosted by the Larsen family", 1304, { x: 150, width: 700, fontFamily: "Poppins", fontWeight: 600, fontSize: 18, letterSpacing: 6, uppercase: true, fill: CREAM, shadow: SH }),
      lock(place(mug(120, 1160, 130, 116, { ...RIGHT_MUG, candy: false }), 2)),
      lock(place(mug(884, 1160, 130, 116, { ...LEFT_MUG, steam: true }), 2)),
      sparkles(14, (x, y) => (x > 150 && x < 850 && y > 200 && y < 1280) || y < 300, [20, 20, 980, 1380]),
    ],
    "Message",
  );

  return {
    slug: "cozy-cabin-winter-brunch",
    name: "Cozy Cabin Winter Brunch",
    tagline: "Playful buffalo-plaid hot cocoa and winter brunch party invitation",
    description:
      "A warm, playful cabin-style winter brunch and hot cocoa party invitation with buffalo plaid, steaming mugs with marshmallows, knit scarf patterns and pine boughs. Perfect for winter birthdays, holiday brunches and cozy get-togethers.",
    categories: ["party", "winter", "holiday", "seasonal", "nature", "kids"],
    keywords: ["hot cocoa party invitation", "cozy cabin winter brunch invite", "buffalo plaid christmas brunch invitation", "winter birthday party invitation plaid", "cabin themed holiday party invite", "pajama and cocoa party invitation"],
    palette: ["#b3262d", "#2b1a12", "#2f5d46", "#fbf3e2", "#6b4226"],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
