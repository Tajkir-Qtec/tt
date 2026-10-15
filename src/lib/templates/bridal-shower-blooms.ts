import { divider } from "../design/ornaments";
import { GUEST_TOKEN } from "../design/types";
import type { Layer } from "../design/types";
import { bubbles, coupe, foliage, lemon, lemonSlice, peony, put, sparkle4 } from "./bridal-shower-blooms.art";
import { H, I, linear, lock, O, P, radial, S, T, W, type TemplateDef } from "./kit";

const CREAM = "#fffaf0";
const LEMON = "#f3c93a";
const LEMON_L = "#fbeaa0";
const BLUSH = "#f7cfd4";
const ROSE = "#e8879f";
const ROSE_D = "#c9526f";
const LEAF = "#5f8a58";
const LEAF_L = "#8db576";
const INK = "#2f4a3c";
const SOFT = "#6f7f73";
const CHAMP = "#d9b872";

const PEONY_PINK = { outer: "#f8c9d2", mid: "#f2a2b4", inner: "#e57a96", core: "#f4c24a", edge: "#fbe0e5" };
const PEONY_BLUSH = { outer: "#fde6e8", mid: "#f8cdd4", inner: "#f0a9b8", core: "#f4c24a", edge: "#fff3f4" };

export default function build(): TemplateDef {
  const bg = linear(120, [0, "#fffdf6"], [0.6, CREAM], [1, "#fdf1e0"]);

  const label = (text: string, y: number, o: Partial<Parameters<typeof T>[2]> = {}) =>
    T(text, y, { x: 150, width: 700, fontFamily: "Jost", fontWeight: 500, fontSize: 19, letterSpacing: 9, uppercase: true, fill: ROSE_D, ...o });
  const div = (y: number, w = 320, color = CHAMP) => lock(O(divider({ style: "diamond", w, color, strokeWidth: 1.8 }), { cx: W / 2, y, width: w }));

  /** Blooming cluster with foliage, anchored to a corner (rot flips direction). */
  const cluster = (cx: number, cy: number, s: number, rot: number): Layer[] => [
    put(foliage(LEAF, LEAF_L, 330, 9, 270, 2), cx, cy, 720 * s, rot),
    put(peony(PEONY_PINK, 150), cx + 10 * s, cy + 10 * s, 330 * s, rot * 0.3),
    put(peony(PEONY_BLUSH, 120), cx + 215 * s * Math.cos((rot * Math.PI) / 180 + 0.4) , cy - 60 * s, 215 * s, 20),
    put(lemon({ withLeaf: true }), cx + 110 * s, cy + 230 * s, 220 * s, -18 + rot * 0.5),
    put(lemonSlice(), cx - 120 * s, cy + 215 * s, 130 * s, 12),
  ];

  const fizz = (cx: number, cy: number, s = 1): Layer[] => [
    put(coupe(), cx - 70 * s, cy, 150 * s, -16),
    put(coupe(), cx + 70 * s, cy + 6 * s, 150 * s, 16),
    put(bubbles(CHAMP, 160), cx, cy - 120 * s, 120 * s),
    put(sparkle4(CHAMP, 60), cx + 6 * s, cy - 58 * s, 40 * s),
    put(sparkle4(LEMON, 60), cx - 100 * s, cy - 100 * s, 24 * s),
    put(sparkle4(ROSE, 60), cx + 110 * s, cy - 96 * s, 22 * s),
  ];

  /* --------------------------------- cover --------------------------------- */
  const cover = P(
    bg,
    [
      lock(S({ shape: "ellipse", x: 120, y: 360, width: 760, height: 760, fill: radial([0, "rgba(251,234,160,0.5)"], [1, "rgba(251,234,160,0)"]) })),
      ...cluster(120, 130, 1, -20),
      ...fizz(830, 250, 1),
      T(GUEST_TOKEN, 482, { x: 250, width: 500, fontFamily: "Playfair Display", italic: true, fontWeight: 400, fontSize: 30, fill: SOFT }),
      label("Join us for a", 546, { fontSize: 20 }),
      T("Bridal Brunch", 590, { x: 30, width: 940, fontFamily: "Parisienne", fontSize: 122, lineHeight: 1.2, fill: INK }),
      T("champagne  &  blooms", 770, { x: 150, width: 700, fontFamily: "Cormorant Garamond", fontWeight: 600, fontSize: 30, letterSpacing: 10, uppercase: true, fill: LEAF }),
      div(830),
      label("honouring the bride-to-be", 880, { fontSize: 17, letterSpacing: 7, fill: SOFT }),
      T("Charlotte Hayes", 918, { x: 100, width: 800, fontFamily: "Playfair Display", italic: true, fontWeight: 500, fontSize: 76, fill: ROSE_D }),
      T("Sunday, 18 April 2027  ·  11:00 AM", 1040, { x: 100, width: 800, fontFamily: "Jost", fontWeight: 500, fontSize: 25, letterSpacing: 4, fill: INK }),
      T("The Rosewood Conservatory", 1090, { x: 150, width: 700, fontFamily: "Cormorant Garamond", fontWeight: 600, fontSize: 36, fill: SOFT }),
      ...cluster(930, 1330, 0.9, 160),
      put(lemonSlice(), 90, 1250, 120, -10),
      put(sparkle4(CHAMP, 60), 220, 1180, 28),
      put(sparkle4(ROSE, 60), 140, 1330, 20),
    ],
    "Invitation",
  );

  /* -------------------------------- details -------------------------------- */
  const item = (time: string, title: string, note: string, y: number, slice: number): Layer[] => [
    put(lemonSlice(), 215, y + 56, 104, slice),
    T(time, y + 4, { x: 300, width: 520, align: "left", fontFamily: "Jost", fontWeight: 500, fontSize: 18, letterSpacing: 7, uppercase: true, fill: ROSE_D }),
    T(title, y + 34, { x: 300, width: 560, align: "left", fontFamily: "Playfair Display", fontWeight: 500, fontSize: 44, fill: INK }),
    T(note, y + 98, { x: 300, width: 560, align: "left", fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 30, fill: SOFT }),
  ];
  const details = P(
    bg,
    [
      lock(S({ shape: "ellipse", x: -200, y: 1000, width: 700, height: 700, fill: radial([0, "rgba(247,207,212,0.55)"], [1, "rgba(247,207,212,0)"]) })),
      put(foliage(LEAF, LEAF_L, 300, 8, 240, 4), 60, 40, 560, -30),
      put(peony(PEONY_PINK, 150), 40, 40, 250, 0),
      put(peony(PEONY_BLUSH, 120), 230, 22, 150, 10),
      put(lemon({ withLeaf: true }), 880, 90, 170, 25),
      put(lemonSlice(), 770, 40, 90, 0),
      put(sparkle4(CHAMP, 60), 640, 110, 26),
      T("The Brunch Plan", 170, { x: 80, width: 840, fontFamily: "Parisienne", fontSize: 96, lineHeight: 1.2, fill: INK }),
      div(310),
      ...item("11:00 AM", "Welcome Mimosas", "bubbly & citrus on arrival", 400, 0),
      ...item("12:00 PM", "Garden Brunch", "pastries, fruit & fresh blooms", 590, 20),
      ...item("1:30 PM", "Games & Gifts", "sweet wishes for the bride", 780, -15),
      lock(S({ x: 130, y: 1000, width: 740, height: 190, cornerRadius: 28, fill: "#ffffff", opacity: 0.75, stroke: "#f3dfb0", strokeWidth: 1.6 })),
      label("Where", 1034, { fontSize: 16, letterSpacing: 8 }),
      T("The Rosewood Conservatory", 1068, { x: 140, width: 720, fontFamily: "Playfair Display", fontWeight: 500, fontSize: 40, fill: INK }),
      T("Sunny florals & pastels, please", 1130, { x: 140, width: 720, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 30, fill: SOFT }),
      put(foliage(LEAF, LEAF_L, 300, 8, 240, 6), 960, 1380, 560, 150),
      put(peony(PEONY_PINK, 150), 960, 1370, 250, 0),
      put(peony(PEONY_BLUSH, 120), 790, 1385, 150, 10),
      put(lemonSlice(), 100, 1330, 110, 10),
      put(sparkle4(LEMON, 60), 240, 1290, 26),
    ],
    "Details",
  );

  /* ------------------------------- photo / toast ------------------------------ */
  const ringSlices: Layer[] = [];
  const cx = 500;
  const cy = 640;
  const rr = 292;
  for (let i = 0; i < 12; i++) {
    const a = ((i + 0.5) / 12) * Math.PI * 2 - Math.PI / 2;
    ringSlices.push(put(i % 3 === 1 ? peony(i % 2 ? PEONY_PINK : PEONY_BLUSH, 80) : lemonSlice(), cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, i % 3 === 1 ? 118 : 100, i * 31));
  }
  const toast = P(
    bg,
    [
      lock(S({ shape: "ellipse", x: 80, y: 220, width: 840, height: 840, fill: radial([0, "rgba(251,234,160,0.55)"], [1, "rgba(251,234,160,0)"]) })),
      T("Sip, Sip, Hooray!", 110, { x: 40, width: 920, fontFamily: "Parisienne", fontSize: 96, lineHeight: 1.2, fill: INK }),
      lock(S({ shape: "ellipse", x: cx - 245, y: cy - 245, width: 490, height: 490, fill: "#ffffff" })),
      I({ x: cx - 232, y: cy - 232, width: 464, height: 464, mask: "ellipse", placeholderFill: BLUSH, borderColor: CHAMP, borderWidth: 3 }),
      ...ringSlices,
      put(sparkle4(CHAMP, 60), 150, 330, 30),
      put(sparkle4(ROSE, 60), 860, 960, 26),
      put(sparkle4(LEMON, 60), 130, 990, 22),
      T("Fresh blooms, citrus & bubbly\nfor the bride-to-be", 1030, { x: 190, width: 620, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 38, lineHeight: 1.3, fill: SOFT }),
      div(1136, 280),
      label("Charlotte Hayes", 1176, { fontSize: 24, letterSpacing: 10, fill: INK }),
      put(foliage(LEAF, LEAF_L, 300, 8, 240, 8), 40, 1380, 560, 20),
      put(peony(PEONY_PINK, 150), 40, 1380, 250, 0),
      put(lemon({ withLeaf: true }), 230, 1330, 150, -10),
      put(foliage(LEAF, LEAF_L, 300, 8, 240, 9), 960, 1380, 560, -20),
      put(peony(PEONY_BLUSH, 120), 960, 1380, 240, 0),
      put(lemon({ withLeaf: true }), 770, 1335, 150, 190),
    ],
    "Toast",
  );

  void H;
  return {
    slug: "bridal-shower-blooms",
    name: "Bridal Brunch Blooms",
    tagline: "Fresh lemon, peony and champagne bridal shower invitation",
    description:
      "A bright, chic bridal shower and bachelorette brunch invitation with hand-drawn lemons, peonies and champagne coupes on warm cream. Script headline, brunch schedule and photo pages included.",
    categories: ["party", "floral", "modern", "seasonal"],
    keywords: ["bridal shower brunch invitation", "lemon and peony bridal shower invite", "champagne brunch bachelorette invitation", "citrus floral bridal shower card online", "digital bridal shower invitation template"],
    palette: [CREAM, LEMON, BLUSH, ROSE, LEAF],
    width: W,
    height: H,
    pages: [cover, details, toast],
  };
}
