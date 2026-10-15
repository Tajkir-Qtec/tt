import { decoFrame, divider } from "../design/ornaments";
import { GUEST_TOKEN } from "../design/types";
import type { Layer, Paint } from "../design/types";
import { GOLD, H, I, linear, lock, O, P, S, T, W, type TemplateDef } from "./kit";
import { glitter } from "./winter-party.art";
import { cluster, glowPaint } from "./moody-dark-florals.art";

/** Moody dark romance wedding: inky navy-plum night, burgundy dahlias, gold ranunculus, foil frame. */

const BG: Paint = linear(160, [0, "#1c0b27"], [0.5, "#0e0a1e"], [1, "#1a0a16"]);
const BG2: Paint = linear(200, [0, "#170a22"], [0.55, "#0d0a1b"], [1, "#1b0a18"]);
const CREAM = "#f3e6d4";
const GILT = "#d9b45f";
const ROSE = "#e6a3b6";
const SH = { color: "#000000", blur: 16, offsetX: 0, offsetY: 3, opacity: 0.6 };

const frame = (): Layer =>
  lock(O(decoFrame({ w: 900, h: 1300, cut: 34, stroke: GILT, strokeWidth: 2.2, lines: 2, gap: 12 }), { x: 50, y: 50, width: 900 }));
const glow = (cx: number, cy: number, r: number, rgb: string, a = 0.5): Layer =>
  lock(S({ shape: "ellipse", x: cx - r, y: cy - r, width: r * 2, height: r * 2, fill: glowPaint(rgb, a) }));
const rule = (y: number, w = 220, style: "diamond" | "stars" | "leaf" = "diamond"): Layer => lock(O(divider({ style, w, color: GILT, strokeWidth: 1.8 }), { cx: W / 2, y }));
const cap = (text: string, y: number, o: Partial<Parameters<typeof T>[2]> = {}) =>
  T(text, y, { fontFamily: "Cinzel", fontSize: 18, letterSpacing: 7, uppercase: true, fill: GILT, ...o });

export default function build(): TemplateDef {
  /* --------------------------------- cover --------------------------------- */
  const cover = P(
    BG,
    [
      glow(150, 170, 520, "150,26,70", 0.55),
      glow(880, 1250, 520, "120,36,110", 0.5),
      glitter({ seed: 4, count: 46, area: [70, 70, 930, 1330], colors: ["#f3dfa2", "#d9b45f", "#ffffff"], minS: 5, maxS: 14, skip: (x, y) => (x < 400 && y < 500) || (x > 640 && y > 880) || (x > 120 && x < 880 && y > 430 && y < 1110) }),
      frame(),
      ...cluster({ ax: 14, ay: 6, scale: 0.92, seed: 3 }),
      ...cluster({ ax: 986, ay: 1394, sx: -1, sy: -1, scale: 0.92, seed: 8 }),
      ...cluster({ ax: 990, ay: 10, sx: -1, scale: 0.42, seed: 5, light: true }),
      ...cluster({ ax: 10, ay: 1390, sy: -1, scale: 0.42, seed: 6, light: true }),
      cap("together with their families", 470, { x: 200, width: 600, fontSize: 15, letterSpacing: 6, fill: ROSE }),
      T("Seraphina", 520, { x: 100, width: 800, fontFamily: "Bodoni Moda", italic: true, fontWeight: 500, fontSize: 124, lineHeight: 1.05, fill: GOLD, shadow: SH }),
      T("&", 640, { x: 400, width: 200, fontFamily: "Pinyon Script", fontSize: 140, lineHeight: 1, fill: GOLD }),
      T("Alexander", 740, { x: 100, width: 800, fontFamily: "Bodoni Moda", italic: true, fontWeight: 500, fontSize: 124, lineHeight: 1.05, fill: GOLD, shadow: SH }),
      rule(910, 280, "stars"),
      T("request the honour of your presence", 946, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontSize: 34, fill: CREAM }),
      cap("Saturday  ·  13 November 2027", 1008, { x: 150, width: 700, fontWeight: 600, fontSize: 22, letterSpacing: 6, fill: CREAM }),
      T(GUEST_TOKEN, 1056, { x: 220, width: 560, fontFamily: "Pinyon Script", fontSize: 58, lineHeight: 1.1, fill: ROSE, shadow: SH }),
    ],
    "Invitation",
  );

  /* -------------------------------- schedule -------------------------------- */
  const items: [string, string, string][] = [
    ["5:00 PM", "The Ceremony", "Candlelit vows beneath the chandelier"],
    ["6:00 PM", "Cocktail Hour", "Champagne, oysters and a string quartet"],
    ["7:30 PM", "The Wedding Dinner", "A five-course feast by candlelight"],
    ["9:30 PM", "Dancing till Midnight", "First dance, band and a late-night cognac bar"],
  ];
  const rows: Layer[] = [];
  items.forEach(([time, title, desc], i) => {
    const y = 440 + i * 172;
    rows.push(
      cap(time, y, { x: 200, width: 600, fontSize: 20, letterSpacing: 10, fontWeight: 600 }),
      T(title, y + 36, { x: 100, width: 800, fontFamily: "Bodoni Moda", italic: true, fontSize: 50, fill: CREAM }),
      T(desc, y + 100, { x: 130, width: 740, fontFamily: "Cormorant Garamond", italic: true, fontSize: 29, fill: ROSE }),
    );
    if (i < items.length - 1) rows.push(rule(y + 146, 110));
  });
  const details = P(
    BG2,
    [
      glow(880, 140, 440, "150,26,70", 0.45),
      glow(120, 1280, 460, "100,40,120", 0.4),
      glitter({ seed: 9, count: 36, area: [70, 70, 930, 1330], colors: ["#f3dfa2", "#d9b45f", "#ffffff"], minS: 5, maxS: 13, skip: (x, y) => x > 90 && x < 910 && y > 90 && y < 1190 }),
      frame(),
      ...cluster({ ax: 990, ay: 10, sx: -1, scale: 0.5, seed: 12, light: true }),
      ...cluster({ ax: 10, ay: 1390, sy: -1, scale: 0.5, seed: 14, light: true }),
      cap("the celebration", 140, { x: 250, width: 500, fontSize: 17, fill: ROSE }),
      T("Order of the Evening", 176, { x: 80, width: 840, fontFamily: "Bodoni Moda", italic: true, fontSize: 70, fill: GOLD, shadow: SH }),
      cap("Seraphina & Alexander  ·  13 November 2027", 290, { x: 100, width: 800, fontSize: 17, letterSpacing: 5, fill: CREAM }),
      rule(346, 260, "stars"),
      ...rows,
      lock(S({ x: 170, y: 1150, width: 660, height: 124, cornerRadius: 22, fill: "rgba(0,0,0,0.28)", stroke: GILT, strokeWidth: 1.6 })),
      cap("Dress code", 1168, { x: 200, width: 600, fontSize: 16, letterSpacing: 10, fill: ROSE }),
      T("Black tie, with a touch of jewel tones", 1204, { x: 190, width: 620, fontFamily: "Cormorant Garamond", italic: true, fontSize: 32, fill: CREAM }),
    ],
    "Schedule",
  );

  /* --------------------------------- photo --------------------------------- */
  const photo = P(
    BG,
    [
      glow(500, 560, 520, "140,30,80", 0.4),
      glitter({ seed: 17, count: 40, area: [70, 70, 930, 1330], colors: ["#f3dfa2", "#d9b45f", "#ffffff"], minS: 5, maxS: 14, skip: (x, y) => x > 120 && x < 880 && y > 90 && y < 1160 }),
      frame(),
      lock(S({ x: 192, y: 112, width: 616, height: 704, cornerRadius: 0, fill: GOLD })),
      I({ x: 200, y: 120, width: 600, height: 688, mask: "rect", placeholderFill: "#2a1630" }),
      ...cluster({ ax: 14, ay: 1394, sy: -1, scale: 0.6, seed: 22 }),
      ...cluster({ ax: 986, ay: 1394, sx: -1, sy: -1, scale: 0.6, seed: 26 }),
      T("To love, and be loved", 850, { x: 160, width: 680, fontFamily: "Bodoni Moda", italic: true, fontSize: 48, fill: CREAM }),
      rule(932, 220, "leaf"),
      T("Seraphina & Alexander", 962, { x: 130, width: 740, fontFamily: "Pinyon Script", fontSize: 76, lineHeight: 1.1, fill: GOLD, shadow: SH }),
      cap("13 . 11 . 2027", 1066, { x: 300, width: 400, fontSize: 18, letterSpacing: 9, fill: ROSE }),
    ],
    "Message",
  );

  return {
    slug: "moody-dark-florals",
    name: "Moody Dark Florals",
    tagline: "Dark romantic wedding invitation with burgundy dahlias and gold",
    description:
      "A dramatic dark-floral wedding invitation with hand-built burgundy dahlias, ranunculus and inky foliage on a navy-plum night, finished with gold foil linework. Made for candlelit evening, autumn and winter weddings.",
    categories: ["dark", "floral", "luxury"],
    keywords: ["dark moody floral wedding invitation", "burgundy dahlia wedding invite", "navy and burgundy gold wedding card", "romantic dark academia wedding invitation", "autumn evening wedding invitation template", "black tie moody wedding invite"],
    palette: ["#0e0a1e", "#6d1637", "#a92d58", "#d9b45f", "#f3e6d4"],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
