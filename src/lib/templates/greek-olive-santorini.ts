import { archFrame, divider } from "../design/ornaments";
import { GUEST_TOKEN, type Layer } from "../design/types";
import { H, I, lock, linear, O, P, radial, S, T, W, type TemplateDef } from "./kit";
import { meander, oliveBranch, village } from "./greek-olive-santorini.art";

const AEGEAN = "#1c5fa8";
const DEEP = "#0f3a6e";
const SEA = "#2f86c8";
const WHITE = "#ffffff";
const SKY = "#e3f0fa";
const OLIVE = "#6f8344";
const GOLDC = "#c8a24d";

const bg = linear(180, [0, "#cfe5f6"], [0.45, "#f1f8fd"], [1, "#ffffff"]);

const domeBlue = linear(160, [0, "#3b8fd6"], [1, "#154f92"]);

const sun = (): Layer => lock(S({ shape: "ellipse", x: 640, y: 120, width: 300, height: 300, fill: radial([0, "rgba(255,244,214,0.95)"], [0.55, "rgba(255,236,190,0.35)"], [1, "rgba(255,236,190,0)"]) }));

const sea = (y: number): Layer => lock(S({ x: 0, y, width: W, height: H - y, fill: linear(180, [0, "#58a8e0"], [1, "#1a5ca5"]) }));

const vil = (y: number, h: number, withSea = true): Layer[] => [
  
  lock(O(village(W, h, { white: "#ffffff", shade: "#d7e5f3", back: "#dce9f5", backShade: "#c4d8ec", blue: domeBlue, door: "#1d5aa0" }), { x: 0, y, width: W })),
];

const olive = (x: number, y: number, w: number, h: number, flip = false, rot = 0): Layer =>
  lock(O(oliveBranch(w, h, { leafA: linear(120, [0, "#8aa05a"], [1, "#55692f"]), leafB: linear(120, [0, "#c3cfa4"], [1, "#8d9f66"]), olive: "#3e4a2a", stem: "#5d6d3a" }), { x, y, width: w, height: h, flipX: flip, rotation: rot }));

const key = (y: number, x = 70, w = 860): Layer => lock(O(meander(w, 30, AEGEAN, 2.4), { x, y, width: w }));

const frame = (): Layer[] => [
  lock(S({ x: 30, y: 30, width: 940, height: 1340, fill: null, stroke: AEGEAN, strokeWidth: 2 })),
  lock(S({ x: 42, y: 42, width: 916, height: 1316, fill: null, stroke: "rgba(28,95,168,0.4)", strokeWidth: 1 })),
];

export default function greekOliveSantorini(): TemplateDef {
  const cap = (t: string, y: number, o: Partial<Parameters<typeof T>[2]> = {}) =>
    T(t, y, { x: 200, width: 600, fontFamily: "Cinzel", fontWeight: 500, fontSize: 16, fill: AEGEAN, letterSpacing: 8, uppercase: true, ...o });
  const serif = (t: string, y: number, o: Partial<Parameters<typeof T>[2]> = {}) =>
    T(t, y, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 28, fill: DEEP, ...o });

  const archY = 160;
  const archH = 860;
  const cover = P(
    bg,
    [
      sun(),
      ...frame(),
      key(62),
      T(GUEST_TOKEN, 116, { x: 250, width: 500, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 28, fill: AEGEAN, letterSpacing: 2 }),
      lock(O(archFrame({ w: 700, h: archH, stroke: AEGEAN, strokeWidth: 3, fill: "rgba(255,255,255,0.88)", lines: 2, gap: 14 }), { x: 150, y: archY, width: 700 })),
      cap("with their families", 278, { fontSize: 14, letterSpacing: 9 }),
      serif("invite you to celebrate the marriage of", 316, { fontSize: 27 }),
      T("Eleni", 380, { x: 160, width: 680, fontFamily: "Cinzel", fontWeight: 500, fontSize: 96, fill: linear(100, [0, DEEP], [1, AEGEAN]), letterSpacing: 6, lineHeight: 1 }),
      T("&", 506, { x: 160, width: 680, fontFamily: "Playfair Display", italic: true, fontSize: 52, fill: OLIVE, lineHeight: 1 }),
      T("Nikos", 566, { x: 160, width: 680, fontFamily: "Cinzel", fontWeight: 500, fontSize: 96, fill: linear(100, [0, DEEP], [1, AEGEAN]), letterSpacing: 6, lineHeight: 1 }),
      lock(O(divider({ style: "leaf", w: 280, color: OLIVE }), { cx: 500, y: 700, width: 280 })),
      cap("Saturday", 760, { fontSize: 15 }),
      T("20 · 09 · 2027", 790, { x: 200, width: 600, fontFamily: "Cinzel", fontWeight: 500, fontSize: 50, fill: DEEP, letterSpacing: 3 }),
      serif("as the sun sets over the caldera", 868, { fontSize: 26 }),
      cap("Villa Thalassa · Oia, Santorini", 920, { x: 170, width: 660, fontSize: 15, letterSpacing: 6 }),
      olive(24, 590, 230, 400, false, 0),
      olive(746, 590, 230, 400, true, 0),
      ...vil(1000, 400),
    ],
    "Invitation",
  );

  // ---- details: three arched windows
  const col = (cx: number, label: string, time: string, note: string, i: number): Layer[] => [
    lock(O(archFrame({ w: 240, h: 430, stroke: AEGEAN, strokeWidth: 2.5, fill: "rgba(255,255,255,0.9)", lines: 2, gap: 10 }), { x: cx - 120, y: 330, width: 240 })),
    cap(label, 470, { x: cx - 105, width: 210, fontSize: 13, letterSpacing: 6 }),
    T(time, 508, { x: cx - 110, width: 220, fontFamily: "Cinzel", fontWeight: 500, fontSize: 44, fill: DEEP, lineHeight: 1 }),
    T("PM", 560, { x: cx - 110, width: 220, fontFamily: "Cinzel", fontWeight: 500, fontSize: 16, fill: AEGEAN, letterSpacing: 8 }),
    lock(S({ x: cx - 20, y: 604, width: 40, height: 1.5, fill: OLIVE })),
    serif(note, 628, { x: cx - 100, width: 200, fontSize: 22, lineHeight: 1.2 }),
    lock(O(oliveBranch(70, 70, { leafA: "#6f8344", leafB: "#aebd8a", olive: "#3e4a2a", stem: "#5d6d3a", leaves: 5 }), { cx, y: 392 + i * 0, width: 54 })),
  ];
  const details = P(
    bg,
    [
      sun(),
      ...frame(),
      key(62),
      T("The Celebration", 150, { x: 150, width: 700, fontFamily: "Cinzel", fontWeight: 500, fontSize: 56, fill: DEEP, letterSpacing: 3 }),
      lock(O(divider({ style: "leaf", w: 280, color: OLIVE }), { cx: 500, y: 232, width: 280 })),
      serif("Saturday, the twentieth of September", 270, { x: 100, width: 800, fontSize: 30 }),
      ...col(210, "Ceremony", "6:30", "on the terrace, as the sun lowers", 0),
      ...col(500, "Toasts", "7:30", "wine, olives and blessings", 1),
      ...col(790, "Dinner", "8:30", "a long table under the stars", 2),
      cap("Venue", 830, { fontSize: 14 }),
      T("Villa Thalassa", 862, { x: 150, width: 700, fontFamily: "Cinzel", fontWeight: 500, fontSize: 40, fill: DEEP, letterSpacing: 4 }),
      serif("Oia, Santorini, Greece", 920),
      cap("Attire", 988, { fontSize: 14 }),
      serif("Summer formal – whites and soft blues", 1020),
      ...vil(1130, 270, true),
    ],
    "Details",
  );

  // ---- photo
  const photo = P(
    bg,
    [
      sun(),
      ...frame(),
      key(62),
      lock(O(archFrame({ w: 560, h: 720, stroke: AEGEAN, strokeWidth: 3, fill: WHITE, lines: 3, gap: 12 }), { x: 220, y: 140, width: 560 })),
      I({ x: 248, y: 168, width: 504, height: 664, mask: "arch", placeholderFill: "#9cc4e4", borderColor: null, borderWidth: 0 }),
      olive(8, 580, 200, 330, false, 0),
      olive(792, 580, 200, 330, true, 0),
      T("Like the sea and the sky,\nwe found each other.", 900, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 40, fill: DEEP, lineHeight: 1.2 }),
      cap("Eleni & Nikos", 1030, { fontSize: 20, letterSpacing: 10 }),
      serif("20 · 09 · 2027", 1076, { fontSize: 26 }),
      ...vil(1170, 230, true),
    ],
    "Photo",
  );

  return {
    slug: "greek-olive-santorini",
    name: "Greek Olive Santorini",
    tagline: "Greek island wedding invitation in white and Aegean blue with olive branches",
    description:
      "A sun-washed Greek island wedding invitation with a whitewashed Santorini village, blue domes, arched windows, a Greek key meander border and hand-drawn olive branches. Perfect for Santorini, Mykonos and Mediterranean destination weddings.",
    categories: ["beach", "classic", "nature"],
    keywords: [
      "greek wedding invitation santorini",
      "aegean blue and white wedding invite",
      "olive branch destination wedding card",
      "greek key meander wedding invitation",
      "mediterranean island wedding invitation online",
    ],
    palette: [AEGEAN, DEEP, SKY, OLIVE, GOLDC],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}

void SEA;
void sea;
