import { divider, ticketFrame } from "../design/ornaments";
import { glowBlob, stack } from "./eid-iftar-lanterns.art";
import { BRASS, BRASS_L, botanicalScene, candleScene, cornerCluster, glassPair, sprigRow } from "./dinner-party-botanical.art";
import { GOLD, H, I, linear, lock, O, P, S, T, W, type TemplateDef } from "./kit";

const IVORY = "#f1e8d2";
const MUTED = "#9fb5a6";
const bg = linear(180, [0, "#0a1f19"], [0.5, "#0f2e24"], [1, "#0b231c"]);

const frame = () => [
  lock(O(ticketFrame({ w: 920, h: 1320, r: 36, stroke: BRASS, strokeWidth: 1.8, lines: 2, gap: 10 }), { x: 40, y: 40, width: 920 })),
];

export default function build(): TemplateDef {
  const candles = candleScene([
    { cx: 205, baseY: 1318, s: 1.0, h: 120 },
    { cx: 795, baseY: 1318, s: 1.0, h: 120 },
  ]);
  const flameGlows = candles.flames.map(([x, y]) => glowBlob(x, y, 130, "255,190,90", 0.3));

  const cover = P(
    bg,
    [
      glowBlob(500, 300, 520, "60,140,100", 0.22),
      ...frame(),
      lock(O(botanicalScene([...cornerCluster("tl", 0.95), ...cornerCluster("tr", 0.95)]), { x: 0, y: 0, width: W })),
      lock(O(glassPair(500, 440, 1), { x: 0, y: 0, width: W })),
      T("Dear {to},", 480, { x: 250, width: 500, fontFamily: "Cormorant Garamond", italic: true, fontSize: 30, fill: BRASS_L }),
      T("Join us for an intimate evening of", 542, { x: 200, width: 600, fontFamily: "Jost", fontWeight: 300, fontSize: 15, fill: MUTED, letterSpacing: 8, uppercase: true }),
      T("Dinner", 570, { x: 100, width: 800, fontFamily: "Playfair Display", italic: true, fontWeight: 500, fontSize: 142, fill: GOLD }),
      T("& Cocktails", 738, { x: 100, width: 800, fontFamily: "Pinyon Script", fontSize: 86, fill: BRASS_L }),
      lock(O(divider({ style: "leaf", w: 320, color: BRASS }), { cx: W / 2, y: 862, width: 320 })),
      T("Saturday", 922, { x: 250, width: 500, fontFamily: "Jost", fontWeight: 400, fontSize: 16, fill: MUTED, letterSpacing: 10, uppercase: true }),
      T("12 · 12 · 2026", 952, { x: 200, width: 600, fontFamily: "Playfair Display", fontWeight: 500, fontSize: 46, fill: GOLD }),
      T("Cocktails at seven  ·  Dinner at eight", 1020, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontSize: 27, fill: IVORY }),
      T("The Garden Room", 1074, { x: 200, width: 600, fontFamily: "Cinzel", fontWeight: 500, fontSize: 22, fill: BRASS_L, letterSpacing: 7, uppercase: true }),
      T("14 Linden Road  ·  Black tie optional", 1112, { x: 150, width: 700, fontFamily: "Jost", fontWeight: 300, fontSize: 17, fill: MUTED, letterSpacing: 3 }),
      ...flameGlows,
      lock(O(candles.art, { x: 0, y: 0, width: W })),
      lock(O(botanicalScene(sprigRow(500, 1312, 130)), { x: 0, y: 0, width: W })),
    ],
    "Invitation",
  );

  const st = stack(
    [
      { label: "Cocktails", title: "7:00 PM", sub: "Champagne and canapes in the conservatory" },
      { label: "Dinner", title: "8:00 PM", sub: "A four-course seasonal menu with paired wines" },
      { label: "Venue", title: "The Garden Room", sub: "14 Linden Road" },
      { label: "Dress Code", title: "Black tie optional", sub: "Rich jewel tones are most welcome", titleSize: 36 },
    ],
    {
      y0: 450,
      x: 170,
      width: 660,
      labelFont: "Jost",
      labelFill: MUTED,
      labelSize: 16,
      labelSpacing: 9,
      titleFont: "Playfair Display",
      titleFill: GOLD,
      titleWeight: 500,
      titleSize: 42,
      subFont: "Cormorant Garamond",
      subItalic: true,
      subSize: 27,
      subFill: IVORY,
      gap: 36,
      between: (y) => lock(O(divider({ style: "leaf", w: 220, color: BRASS, strokeWidth: 1.6 }), { cx: W / 2, y, width: 220 })),
      betweenGap: 56,
    },
  );
  const details = P(
    bg,
    [
      glowBlob(500, 250, 480, "60,140,100", 0.2),
      ...frame(),
      lock(O(botanicalScene([...cornerCluster("tl", 0.7), ...cornerCluster("br", 0.7)]), { x: 0, y: 0, width: W })),
      lock(O(glassPair(500, 250, 0.42), { x: 0, y: 0, width: W })),
      T("The Evening", 262, { x: 160, width: 680, fontFamily: "Playfair Display", italic: true, fontWeight: 500, fontSize: 82, fill: GOLD }),
      lock(O(divider({ style: "double", w: 360, color: BRASS }), { cx: W / 2, y: 372, width: 360 })),
      ...st.layers,
    ],
    "Details",
  );

  const cand2 = candleScene([
    { cx: 112, baseY: 900, s: 0.85, h: 110 },
    { cx: 888, baseY: 900, s: 0.85, h: 110 },
  ]);
  const photo = P(
    bg,
    [
      glowBlob(500, 560, 520, "60,140,100", 0.22),
      ...frame(),
      lock(O(botanicalScene([...cornerCluster("tr", 0.7), ...cornerCluster("bl", 0.7)]), { x: 0, y: 0, width: W })),
      lock(S({ shape: "rect", x: 212, y: 142, width: 576, height: 736, fill: null, stroke: BRASS, strokeWidth: 2, cornerRadius: 4 })),
      I({ x: 230, y: 160, width: 540, height: 700, mask: "rect", placeholderFill: "#173f31" }),
      T("Raise a glass", 930, { x: 150, width: 700, fontFamily: "Playfair Display", italic: true, fontWeight: 500, fontSize: 68, fill: GOLD }),
      T("to good food, good company and a beautiful night", 1030, { x: 230, width: 540, fontFamily: "Cormorant Garamond", italic: true, fontSize: 29, fill: IVORY, lineHeight: 1.35 }),
      lock(O(divider({ style: "leaf", w: 240, color: BRASS }), { cx: W / 2, y: 1120, width: 240 })),
      T("Sofia & James Laurent", 1176, { x: 200, width: 600, fontFamily: "Cinzel", fontWeight: 500, fontSize: 21, fill: BRASS_L, letterSpacing: 8, uppercase: true }),
      ...cand2.flames.map(([x, y]) => glowBlob(x, y, 110, "255,190,90", 0.28)),
      lock(O(cand2.art, { x: 0, y: 0, width: W })),
    ],
    "Memories",
  );

  return {
    slug: "dinner-party-botanical",
    name: "Botanical Supper",
    tagline: "Dark green and brass dinner party invitation with line botanicals",
    description:
      "An elegant dinner and cocktail party invitation in deep forest green and brass gold, with fine line-art botanicals, clinking wine glasses and candlesticks for a sophisticated evening soiree.",
    categories: ["party", "luxury", "dark", "classic"],
    keywords: ["dinner party invitation template", "cocktail party invitation green and gold", "elegant supper club invite", "botanical line art party invitation", "wine and dine invitation card"],
    palette: ["#0a1f19", "#0f2e24", "#c9a24a", "#e8cd8a", "#f1e8d2"],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
