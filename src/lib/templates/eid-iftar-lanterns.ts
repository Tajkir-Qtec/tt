import { divider, islamicPattern, islamicStar } from "../design/ornaments";
import { glowBlob, hangingCrescent, lanternCenter, lanternScene, skyline, sparkleField, stack } from "./eid-iftar-lanterns.art";
import { H, I, linear, lock, O, P, S, T, W, GOLD, type TemplateDef } from "./kit";

const GOLD_S = "#e2c273";
const GOLD_L = "#f6e2a6";
const CREAM = "#f3ead2";
const MUTED = "#a9b4d6";
const bg = linear(180, [0, "#050a22"], [0.5, "#0c1745"], [1, "#16225c"]);

const hangers = [
  { cx: 120, len: 130, s: 0.95 },
  { cx: 262, len: 50, s: 0.8, tint: "teal" as const },
  { cx: 738, len: 50, s: 0.8, tint: "rose" as const },
  { cx: 880, len: 130, s: 0.95 },
];

export default function build(): TemplateDef {
  const sky = (seed: number, avoid: [number, number, number, number][]) =>
    sparkleField(seed, 46, avoid, ["#f7f0d6", "#e8d9a0", "#c9d2f0"]);

  const cover = P(
    bg,
    [
      glowBlob(500, 120, 380, "90,110,230", 0.28),
      glowBlob(500, 1150, 420, "230,170,70", 0.22),
      ...sky(7, [[330, 80, 670, 330], [60, 40, 940, 400], [140, 400, 860, 1130]]),
      ...hangers.map((h) => { const [cx, cy] = lanternCenter(h); return glowBlob(cx, cy, 150 * h.s, "255,190,90", 0.33); }),
      lock(O(lanternScene(hangers), { x: 0, y: 0, width: W })),
      lock(O(hangingCrescent(500, 0, 110, 92), { x: 0, y: 0, width: W })),
      T("Dear {to},", 408, { x: 250, width: 500, fontFamily: "Cormorant Garamond", italic: true, fontSize: 30, fill: GOLD_L }),
      T("عيد مبارك", 450, { x: 150, width: 700, fontFamily: "Reem Kufi", fontWeight: 500, fontSize: 124, fill: GOLD, lineHeight: 1.2, shadow: { color: "#ffcf6a", blur: 28, offsetX: 0, offsetY: 0, opacity: 0.45 } }),
      T("Eid Mubarak", 624, { x: 200, width: 600, fontFamily: "Cinzel", fontWeight: 400, fontSize: 25, fill: GOLD_S, letterSpacing: 14, uppercase: true }),
      lock(O(divider({ style: "diamond", w: 360, color: GOLD_S }), { cx: W / 2, y: 680, width: 360 })),
      T("Iftar & Eid Gathering", 742, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 64, fill: GOLD }),
      T("An evening of light, dates and togetherness", 824, { x: 180, width: 640, fontFamily: "Cormorant Garamond", italic: true, fontSize: 27, fill: CREAM }),
      T("Tuesday", 894, { x: 250, width: 500, fontFamily: "Jost", fontWeight: 400, fontSize: 16, fill: MUTED, letterSpacing: 10, uppercase: true }),
      T("09 · 03 · 2027", 924, { x: 200, width: 600, fontFamily: "Cinzel", fontWeight: 500, fontSize: 46, fill: GOLD }),
      T("Iftar at sunset  ·  6:15 PM", 992, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontSize: 27, fill: CREAM }),
      T("The Rahman Residence", 1046, { x: 200, width: 600, fontFamily: "Cinzel", fontWeight: 500, fontSize: 22, fill: GOLD_S, letterSpacing: 6, uppercase: true }),
      T("24 Garden Court · Dhaka", 1082, { x: 200, width: 600, fontFamily: "Jost", fontWeight: 300, fontSize: 17, fill: MUTED, letterSpacing: 3 }),
      lock(O(skyline("#1a2a6e", "#ffd88a", "far", 330), { x: 0, y: H - 300, width: W, opacity: 0.55 })),
      lock(O(skyline("#070d2b", "#ffd88a", "near", 250), { x: 0, y: H - 185, width: W })),
    ],
    "Invitation",
  );

  const items = [
    { cx: 70, len: 20, s: 0.8, tint: "teal" as const },
    { cx: 930, len: 20, s: 0.8, tint: "rose" as const },
    { cx: 70, len: 330, s: 0.65 },
    { cx: 930, len: 330, s: 0.65 },
  ];
  const st = stack(
    [
      { label: "Iftar", title: "Sunset · 6:15 PM", sub: "Break the fast with dates, water and dua" },
      { label: "Dinner & Dessert", title: "7:00 PM", sub: "A shared table of home-cooked favourites" },
      { label: "Venue", title: "The Rahman Residence", sub: "24 Garden Court, Dhaka" },
      { label: "Dress Code", title: "Festive & modest", sub: "New clothes, bright colours, warm smiles", titleSize: 34 },
    ],
    {
      y0: 410,
      x: 170,
      width: 660,
      labelFont: "Jost",
      labelFill: MUTED,
      labelSize: 16,
      labelSpacing: 9,
      titleFont: "Cinzel",
      titleFill: GOLD,
      titleSize: 36,
      subFont: "Cormorant Garamond",
      subItalic: true,
      subSize: 26,
      subFill: CREAM,
      gap: 38,
      between: (y) => lock(O(divider({ style: "stars", w: 260, color: GOLD_S, strokeWidth: 1.6 }), { cx: W / 2, y, width: 260 })),
      betweenGap: 58,
    },
  );
  const details = P(
    bg,
    [
      glowBlob(500, 200, 420, "90,110,230", 0.25),
      lock(O(islamicPattern({ color: "#8fa0e0", w: 1000, h: 1400, cell: 120, strokeWidth: 1.2 }), { x: 0, y: 0, width: W, opacity: 0.07 })),
      ...sky(19, [[100, 20, 900, 1380]]),
      ...items.map((h) => { const [cx, cy] = lanternCenter(h); return glowBlob(cx, cy, 130 * h.s, "255,190,90", 0.3); }),
      lock(O(lanternScene(items), { x: 0, y: 0, width: W })),
      lock(O(islamicStar({ color: GOLD_S, size: 110, strokeWidth: 2 }), { cx: W / 2, y: 76, width: 110 })),
      T("The Gathering", 214, { x: 160, width: 680, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 92, fill: GOLD }),
      lock(O(divider({ style: "diamond", w: 360, color: GOLD_S }), { cx: W / 2, y: 330, width: 360 })),
      ...st.layers,
      T("Hosted by the Rahman Family", 1290, { x: 200, width: 600, fontFamily: "Jost", fontWeight: 300, fontSize: 16, fill: MUTED, letterSpacing: 6, uppercase: true }),
    ],
    "Details",
  );

  const photo = P(
    bg,
    [
      glowBlob(500, 600, 520, "90,110,230", 0.22),
      ...sky(31, [[120, 60, 880, 1120]]),
      lock(O(hangingCrescent(500, 0, 30, 70), { x: 0, y: 0, width: W })),
      lock(O(islamicStar({ color: GOLD_S, size: 700, strokeWidth: 2.2, echo: false }), { cx: W / 2, y: 210, width: 700, opacity: 0.55 })),
      I({ x: 250, y: 310, width: 500, height: 500, mask: "ellipse", placeholderFill: "#1a2563", borderColor: "#e2c273", borderWidth: 4 }),
      T("تقبل الله منا ومنكم", 930, { x: 150, width: 700, fontFamily: "Amiri", fontWeight: 400, fontSize: 52, fill: GOLD, lineHeight: 1.3 }),
      T("May this blessed day bring light, peace and joy to every home", 1022, { x: 220, width: 560, fontFamily: "Cormorant Garamond", italic: true, fontSize: 30, fill: CREAM, lineHeight: 1.35 }),
      lock(O(divider({ style: "stars", w: 260, color: GOLD_S, strokeWidth: 1.6 }), { cx: W / 2, y: 1130, width: 260 })),
      T("The Rahman Family", 1186, { x: 200, width: 600, fontFamily: "Cinzel", fontWeight: 500, fontSize: 22, fill: GOLD_S, letterSpacing: 8, uppercase: true }),
      lock(O(skyline("#070d2b", "#ffd88a", "near", 250), { x: 0, y: H - 100, width: W })),
    ],
    "Memories",
  );

  return {
    slug: "eid-iftar-lanterns",
    name: "Eid Lanterns",
    tagline: "Midnight-navy and gold Eid & iftar invitation with glowing fanoos lanterns",
    description:
      "A dignified Eid Mubarak and iftar gathering invitation in deep navy and gold, with hanging fanoos lanterns, a golden crescent, Arabic calligraphy and a softly lit mosque skyline.",
    categories: ["festive", "islamic", "dark", "luxury"],
    keywords: ["eid mubarak invitation card", "iftar party invitation", "ramadan lantern invitation template", "eid gathering invite navy gold", "fanoos lantern eid card"],
    palette: ["#050a22", "#16225c", "#e2c273", "#f3ead2", "#a9b4d6"],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
