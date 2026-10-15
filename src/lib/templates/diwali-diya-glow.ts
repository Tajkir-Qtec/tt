import { divider } from "../design/ornaments";
import { glowBlob, sparkleField, stack } from "./eid-iftar-lanterns.art";
import { diyaRow, marigoldToran, petalScatter, rangoli } from "./diwali-diya-glow.art";
import { GOLD, H, I, linear, lock, O, P, T, W, type TemplateDef } from "./kit";

const GOLD_S = "#f0cd78";
const GOLD_L = "#ffe9b0";
const CREAM = "#fbe9d2";
const MUTED = "#d9a9b8";
const bg = linear(180, [0, "#140a38"], [0.5, "#2a0f46"], [1, "#59122e"]);
const pal = { a: "#e8358f", b: "#ff8a1c", c: "#7a3bd6", d: "#ffc83d", e: "#f0cd78" };
const pal2 = { a: "#ff8a1c", b: "#e8358f", c: "#ffc83d", d: "#16a89a", e: "#f0cd78" };

const bottomDiyas = [
  { cx: 120, cy: 1318, s: 0.82 },
  { cx: 262, cy: 1336, s: 0.7 },
  { cx: 400, cy: 1312, s: 0.9 },
  { cx: 560, cy: 1334, s: 0.76 },
  { cx: 700, cy: 1312, s: 0.9 },
  { cx: 842, cy: 1336, s: 0.7 },
  { cx: 925, cy: 1296, s: 0.6 },
];
const glows = (d: { cx: number; cy: number; s: number }[]) => d.map((v) => glowBlob(v.cx - 10, v.cy - 40 * v.s, 120 * v.s, "255,170,60", 0.38));

export default function build(): TemplateDef {
  const spark = (seed: number, n: number, avoid: [number, number, number, number][]) => sparkleField(seed, n, avoid, ["#ffe9b0", "#ffd36a", "#ffc0d6"], [14, 34]);

  const cover = P(
    bg,
    [
      glowBlob(500, 400, 460, "255,120,60", 0.28),
      glowBlob(500, 1300, 520, "255,150,40", 0.3),
      ...spark(3, 40, [[150, 330, 850, 1150], [0, 0, 1000, 230]]),
      lock(O(petalScatter(11, 26, [[90, 130, 910, 1180]]), { x: 0, y: 0, width: W })),
      lock(O(rangoli(190, pal), { cx: 500, y: 206, width: 388 })),
      lock(O(marigoldToran(58, 5), { x: 0, y: 0, width: W })),
      T("Dear {to},", 622, { x: 250, width: 500, fontFamily: "Cormorant Garamond", italic: true, fontSize: 30, fill: GOLD_L }),
      T("शुभ दीपावली", 672, { x: 100, width: 800, fontFamily: "Tiro Devanagari Hindi", fontSize: 112, fill: GOLD, lineHeight: 1.15, shadow: { color: "#ffb347", blur: 26, offsetX: 0, offsetY: 0, opacity: 0.5 } }),
      T("Diwali Party", 826, { x: 200, width: 600, fontFamily: "Cinzel", fontWeight: 500, fontSize: 30, fill: GOLD_S, letterSpacing: 14, uppercase: true }),
      lock(O(divider({ style: "diamond", w: 340, color: GOLD_S }), { cx: W / 2, y: 878, width: 340 })),
      T("An evening of lights, sweets & laughter", 934, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontSize: 31, fill: CREAM }),
      T("Saturday", 1006, { x: 250, width: 500, fontFamily: "Jost", fontWeight: 400, fontSize: 16, fill: MUTED, letterSpacing: 10, uppercase: true }),
      T("08 · 11 · 2026", 1036, { x: 200, width: 600, fontFamily: "Cinzel", fontWeight: 500, fontSize: 44, fill: GOLD }),
      T("Lamps are lit at 7:00 PM", 1098, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontSize: 26, fill: CREAM }),
      T("The Sharma Residence · 18 Lotus Avenue", 1146, { x: 150, width: 700, fontFamily: "Jost", fontWeight: 300, fontSize: 17, fill: MUTED, letterSpacing: 3 }),
      ...glows(bottomDiyas),
      lock(O(diyaRow(bottomDiyas), { x: 0, y: 0, width: W })),
    ],
    "Invitation",
  );

  const st = stack(
    [
      { label: "Diya Lighting", title: "7:00 PM", sub: "Evening prayers and the lighting of lamps" },
      { label: "Feast & Sweets", title: "8:00 PM", sub: "Mithai, chaat and a lavish festive spread" },
      { label: "Venue", title: "The Sharma Residence", sub: "18 Lotus Avenue" },
      { label: "Dress Code", title: "Festive ethnic wear", sub: "Jewel tones, silks and sparkle", titleSize: 34 },
    ],
    {
      y0: 490,
      x: 170,
      width: 660,
      labelFont: "Jost",
      labelFill: MUTED,
      labelSize: 16,
      labelSpacing: 9,
      titleFont: "Cinzel",
      titleFill: GOLD,
      titleSize: 38,
      subFont: "Cormorant Garamond",
      subItalic: true,
      subSize: 26,
      subFill: CREAM,
      gap: 28,
      between: (y) => lock(O(divider({ style: "floral", w: 240, color: GOLD_S, strokeWidth: 1.6 }), { cx: W / 2, y, width: 240 })),
      betweenGap: 50,
    },
  );
  const detDiyas = [
    { cx: 300, cy: 1330, s: 0.7 },
    { cx: 500, cy: 1316, s: 0.85 },
    { cx: 700, cy: 1330, s: 0.7 },
  ];
  const details = P(
    bg,
    [
      glowBlob(500, 120, 420, "255,120,60", 0.26),
      glowBlob(500, 1320, 400, "255,150,40", 0.28),
      ...spark(21, 36, [[100, 20, 900, 1240]]),
      lock(O(marigoldToran(40, 5), { x: 0, y: 0, width: W })),
      lock(O(rangoli(62, pal2), { cx: W / 2, y: 172, width: 132 })),
      T("The Celebration", 322, { x: 160, width: 680, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 84, fill: GOLD }),
      lock(O(divider({ style: "diamond", w: 360, color: GOLD_S }), { cx: W / 2, y: 436, width: 360 })),
      ...st.layers,
      ...glows(detDiyas),
      lock(O(diyaRow(detDiyas), { x: 0, y: 0, width: W })),
    ],
    "Details",
  );

  const photo = P(
    bg,
    [
      glowBlob(500, 560, 520, "255,120,60", 0.3),
      ...spark(37, 40, [[100, 120, 900, 1200]]),
      lock(O(petalScatter(23, 24, [[100, 120, 900, 1200]]), { x: 0, y: 0, width: W })),
      lock(O(marigoldToran(34, 5), { x: 0, y: 0, width: W, opacity: 0.95 })),
      lock(O(rangoli(320, pal2), { cx: 500, y: 276, width: 648 })),
      I({ x: 280, y: 380, width: 440, height: 440, mask: "ellipse", placeholderFill: "#3a1550", borderColor: "#f0cd78", borderWidth: 5 }),
      T("शुभ दीपावली", 966, { x: 100, width: 800, fontFamily: "Tiro Devanagari Hindi", fontSize: 76, fill: GOLD, lineHeight: 1.15 }),
      T("May your home glow with joy, light and sweetness", 1066, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontSize: 31, fill: CREAM, lineHeight: 1.35 }),
      T("The Sharma Family", 1160, { x: 200, width: 600, fontFamily: "Cinzel", fontWeight: 500, fontSize: 22, fill: GOLD_S, letterSpacing: 8, uppercase: true }),
      ...glows(detDiyas),
      lock(O(diyaRow(detDiyas), { x: 0, y: 0, width: W })),
    ],
    "Memories",
  );

  return {
    slug: "diwali-diya-glow",
    name: "Diwali Diya Glow",
    tagline: "Glowing diyas, rangoli and marigold on deep indigo for a Diwali party",
    description:
      "A luminous Diwali party invitation in deep indigo and maroon with glowing clay diyas, a jewel-toned rangoli medallion, marigold torans and golden sparkle, headed by the Hindi greeting शुभ दीपावली.",
    categories: ["festive", "indian", "dark", "luxury"],
    keywords: ["diwali party invitation card", "diya rangoli invitation template", "shubh deepavali invite", "festival of lights party invite", "diwali get together card"],
    palette: ["#140a38", "#59122e", "#f0cd78", "#ff8a1c", "#e8358f"],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
