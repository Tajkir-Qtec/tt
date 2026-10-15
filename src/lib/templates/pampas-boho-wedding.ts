import { divider } from "../design/ornaments";
import { GUEST_TOKEN } from "../design/types";
import type { Layer, Paint } from "../design/types";
import { H, I, linear, lock, O, P, S, T, W, type TemplateDef } from "./kit";
import { bouquet, rays, speckle, sunArch } from "./pampas-boho-wedding.art";

/** Boho pampas-grass wedding: sun arch, dried palm spears, neutral sand and terracotta. */

const BG: Paint = linear(165, [0, "#f8f1e6"], [0.55, "#f1e4d1"], [1, "#e8d4ba"]);
const TERRA = "#b9603f";
const CLAY = "#8f4a31";
const BROWN = "#5b3a2b";
const SAND = "#d8b896";
const SOFT: Paint = linear(90, [0, "#a45232"], [0.5, "#d98f6c"], [1, "#a45232"]);

const rule = (y: number, w = 200, c = TERRA): Layer => lock(O(divider({ style: "dots", w, color: c, strokeWidth: 2 }), { cx: W / 2, y }));

const cap = (text: string, y: number, o: Partial<Parameters<typeof T>[2]> = {}) =>
  T(text, y, { fontFamily: "Jost", fontSize: 17, letterSpacing: 5, uppercase: true, fill: BROWN, ...o });

export default function build(): TemplateDef {
  /* --------------------------------- cover --------------------------------- */
  const cover = P(
    BG,
    [
      speckle(3, 70, [0, 0, W, H], "#b88a60"),
      lock(S({ shape: "ellipse", x: 390, y: 140, width: 220, height: 220, fill: linear(90, [0, "#e9a98a"], [1, "#d98f6c"]) })),
      rays(500, 250, 130, 200, 22, TERRA, 2.2, 190, 350, 0.65),
      sunArch(170, 230, 660, 1300, [TERRA, "#d99b7c", "#ecc9ae", "#fbf5ea"], 32, TERRA),
      ...bouquet(80, 1450, 1, false, 7),
      ...bouquet(920, 1450, 1, true, 13),
      cap("together with their families", 462, { x: 290, width: 420, fontSize: 15, letterSpacing: 4 }),
      rule(500, 150),
      T("AMARA", 548, { x: 292, width: 416, fontFamily: "Italiana", fontSize: 84, letterSpacing: 12, fill: CLAY }),
      T("&", 646, { x: 392, width: 216, fontFamily: "Allura", fontSize: 92, lineHeight: 1, fill: TERRA }),
      T("JULIAN", 744, { x: 292, width: 416, fontFamily: "Italiana", fontSize: 84, letterSpacing: 12, fill: CLAY }),
      T("are getting married", 862, { x: 292, width: 416, fontFamily: "Cormorant Garamond", italic: true, fontSize: 36, fill: BROWN }),
      cap("Saturday  ·  20 November 2027", 912, { x: 282, width: 436, fontSize: 18, letterSpacing: 4, fontWeight: 500 }),
      T(GUEST_TOKEN, 956, { x: 292, width: 416, fontFamily: "Allura", fontSize: 50, lineHeight: 1.1, fill: TERRA }),
      cap("Sunset Ridge Ranch", 1120, { x: 250, width: 500, fontFamily: "Cormorant Garamond", fontSize: 28, letterSpacing: 4, fontWeight: 600, fill: CLAY }),
      T("Joshua Tree, California", 1166, { x: 250, width: 500, fontFamily: "Cormorant Garamond", italic: true, fontSize: 28, fill: BROWN }),
    ],
    "Invitation",
  );

  /* -------------------------------- schedule -------------------------------- */
  const items: [string, string, string][] = [
    ["4:00 PM", "The Ceremony", "Vows beneath the sun arch, followed by a desert toast"],
    ["5:00 PM", "Golden Hour Cocktails", "Signature drinks, small bites and lawn games"],
    ["6:30 PM", "Dinner Under the Stars", "A long communal table and shared family-style plates"],
    ["8:30 PM", "First Dance & Dancing", "Bonfire, live acoustic set and late-night desserts"],
  ];
  const rows: Layer[] = [];
  items.forEach(([time, title, desc], i) => {
    const y = 420 + i * 182;
    rows.push(
      cap(time, y, { x: 200, width: 600, fontSize: 20, letterSpacing: 9, fontWeight: 500, fill: TERRA }),
      T(title, y + 38, { x: 100, width: 800, fontFamily: "Cormorant Garamond", fontWeight: 600, fontSize: 50, fill: CLAY }),
      T(desc, y + 100, { x: 140, width: 720, fontFamily: "Cormorant Garamond", italic: true, fontSize: 28, fill: BROWN }),
    );
    if (i < items.length - 1) rows.push(rule(y + 146, 90));
  });
  const details = P(
    BG,
    [
      speckle(11, 60, [0, 0, W, H], "#b88a60"),
      ...bouquet(40, 1450, 0.62, false, 21),
      ...bouquet(960, 1450, 0.62, true, 27),
      lock(S({ shape: "ellipse", x: 440, y: 80, width: 120, height: 120, fill: linear(90, [0, "#e9a98a"], [1, "#d98f6c"]) })),
      rays(500, 140, 74, 118, 18, TERRA, 2, 190, 350, 0.6),
      T("The Day", 214, { x: 100, width: 800, fontFamily: "Allura", fontSize: 108, lineHeight: 1, fill: CLAY }),
      cap("Amara & Julian  ·  20 November 2027", 340, { x: 140, width: 720, fontSize: 18, letterSpacing: 6 }),
      rule(384, 160),
      ...rows,
      cap("Dress code", 1160, { x: 200, width: 600, fontSize: 16, letterSpacing: 9, fill: TERRA }),
      T("Earthy tones, linen and flowing fabrics", 1196, { x: 180, width: 640, fontFamily: "Cormorant Garamond", italic: true, fontSize: 32, fill: BROWN }),
    ],
    "Schedule",
  );

  /* --------------------------------- photo --------------------------------- */
  const photo = P(
    BG,
    [
      speckle(19, 70, [0, 0, W, H], "#b88a60"),
      lock(S({ shape: "ellipse", x: 440, y: 70, width: 120, height: 120, fill: linear(90, [0, "#e9a98a"], [1, "#d98f6c"]) })),
      rays(500, 130, 74, 118, 18, TERRA, 2, 190, 350, 0.6),
      sunArch(190, 130, 620, 880, [TERRA, "#d99b7c", "#ecc9ae"], 24),
      I({ x: 238, y: 178, width: 524, height: 832, mask: "arch", placeholderFill: "#e6d3bb" }),
      ...bouquet(70, 1440, 0.9, false, 33),
      ...bouquet(930, 1440, 0.9, true, 39),
      T("Two hearts, one wild", 1056, { x: 210, width: 580, fontFamily: "Cormorant Garamond", italic: true, fontSize: 42, fill: BROWN }),
      T("and beautiful adventure", 1104, { x: 210, width: 580, fontFamily: "Cormorant Garamond", italic: true, fontSize: 42, fill: BROWN }),
      rule(1176, 150),
      T("Amara & Julian", 1196, { x: 250, width: 500, fontFamily: "Allura", fontSize: 76, lineHeight: 1.1, fill: CLAY }),
      cap("20 . 11 . 2027", 1290, { x: 300, width: 400, fontSize: 18, letterSpacing: 8, fontWeight: 500 }),
    ],
    "Message",
  );

  return {
    slug: "pampas-boho-wedding",
    name: "Pampas Boho Wedding",
    tagline: "Boho pampas grass wedding invitation with a terracotta sun arch",
    description:
      "A modern boho wedding invitation with hand-built pampas plumes, dried palm spears and a layered terracotta sun arch on warm sand. Perfect for desert, beach and outdoor weddings with a neutral earthy palette.",
    categories: ["boho", "modern", "nature"],
    keywords: ["boho pampas grass wedding invitation", "terracotta sun arch wedding invite", "neutral beige boho wedding card", "dried palm desert wedding invitation", "modern boho wedding invitation template", "pampas wedding invite online"],
    palette: ["#f3e6d3", "#b9603f", "#d99b7c", "#d8b896", "#5b3a2b"],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
