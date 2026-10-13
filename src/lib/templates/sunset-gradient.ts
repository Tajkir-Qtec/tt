import { divider, ringsDots, sparkle } from "../design/ornaments";
import { H, I, linear, lock, O, P, radial, S, T, W, type TemplateDef } from "./kit";

const WHITE = "#ffffff";
const PEACH = "#ffb98f";
const CORAL = "#ff7a7a";
const LILAC = "#a96ad9";
const INDIGO = "#1f1763";

const glow = (cx: number, cy: number, d: number, rgb: string, a: number) =>
  lock(S({ shape: "ellipse", x: cx - d / 2, y: cy - d / 2, width: d, height: d, fill: radial([0, `rgba(${rgb},${a})`], [0.55, `rgba(${rgb},${a * 0.35})`], [1, `rgba(${rgb},0)`]) }));

const ring = (cx: number, cy: number, d: number, o = 0.4, w = 1.5) =>
  lock(S({ shape: "ellipse", x: cx - d / 2, y: cy - d / 2, width: d, height: d, fill: null, stroke: WHITE, strokeWidth: w, opacity: o }));

const glass = (x: number, y: number, w: number, h: number, r = 40) => [
  lock(S({ x: x + 8, y: y + 20, width: w, height: h, cornerRadius: r, fill: "rgba(31,23,99,0.22)", opacity: 0.35 })),
  lock(S({ x, y, width: w, height: h, cornerRadius: r, fill: "rgba(255,255,255,0.15)", stroke: "rgba(255,255,255,0.6)", strokeWidth: 1.5 })),
];

const caps = (text: string, y: number, o: Record<string, unknown> = {}) =>
  T(text, y, { x: 130, width: 740, fontFamily: "Outfit", fontWeight: 500, fontSize: 18, letterSpacing: 9, uppercase: true, fill: WHITE, ...o });

const serif = (text: string, y: number, o: Record<string, unknown> = {}) =>
  T(text, y, { x: 130, width: 740, fontFamily: "Playfair Display", italic: true, fontSize: 30, fill: WHITE, ...o });

export default function build(): TemplateDef {
  const bg = linear(165, [0, "#ffc59f"], [0.26, CORAL], [0.55, LILAC], [0.82, "#4a2f9a"], [1, INDIGO]);
  const bg2 = linear(195, [0, "#2a1e78"], [0.38, "#7a4dc4"], [0.7, "#f07a8c"], [1, "#ffb98f"]);

  const orbs = [
    glow(840, 60, 700, "255,226,190", 0.55),
    glow(120, 760, 620, "255,120,160", 0.55),
    glow(860, 1180, 760, "120,90,255", 0.65),
    glow(200, 1320, 480, "255,170,130", 0.45),
  ];

  const cover = P(
    bg,
    [
      ...orbs,
      lock(O(ringsDots({ color: WHITE, size: 260, dots: 60, strokeWidth: 2 }), { x: 90, y: 90, width: 260, opacity: 0.55 })),
      ring(500, 540, 700, 0.4),
      ring(500, 540, 820, 0.22),
      lock(O(sparkle({ color: WHITE, size: 60 }), { x: 840, y: 330, width: 56, opacity: 0.9 })),
      lock(O(sparkle({ color: WHITE, size: 40 }), { x: 150, y: 640, width: 34, opacity: 0.75 })),

      caps("Wedding Invitation", 116, { x: 300, width: 600, align: "right", fontSize: 16, letterSpacing: 11, fontWeight: 600, shadow: { color: "#6a2a8a", blur: 12, offsetX: 0, offsetY: 2, opacity: 0.6 } }),
      T("For {to}", 160, { x: 300, width: 600, align: "right", fontFamily: "Playfair Display", italic: true, fontSize: 30, fill: WHITE, shadow: { color: "#6a2a8a", blur: 12, offsetX: 0, offsetY: 2, opacity: 0.6 } }),

      T("ZARA", 262, { x: 100, width: 800, fontFamily: "Outfit", fontWeight: 600, fontSize: 200, letterSpacing: 14, fill: WHITE, lineHeight: 1, shadow: { color: "#7a2a8a", blur: 40, offsetX: 0, offsetY: 14, opacity: 0.35 } }),
      T("&", 450, { x: 100, width: 800, fontFamily: "Playfair Display", italic: true, fontSize: 120, fill: "#ffe3c8", lineHeight: 1 }),
      T("NOAH", 566, { x: 100, width: 800, fontFamily: "Outfit", fontWeight: 600, fontSize: 200, letterSpacing: 14, fill: WHITE, lineHeight: 1, shadow: { color: "#2a1a80", blur: 40, offsetX: 0, offsetY: 14, opacity: 0.4 } }),

      ...glass(120, 880, 760, 380),
      caps("Saturday", 930, { fontSize: 17, letterSpacing: 12 }),
      T("06 · 11 · 2027", 966, { x: 130, width: 740, fontFamily: "Outfit", fontWeight: 300, fontSize: 76, letterSpacing: 6, fill: WHITE }),
      serif("at half past six in the evening", 1068, { fontSize: 30 }),
      lock(O(divider({ style: "dots", w: 200, color: WHITE }), { cx: W / 2, y: 1128, width: 200, opacity: 0.8 })),
      caps("The Glass Pavilion", 1166, { fontSize: 22, letterSpacing: 8 }),
      T("Marina Bay · Singapore", 1204, { x: 130, width: 740, fontFamily: "Outfit", fontWeight: 300, fontSize: 21, letterSpacing: 4, fill: "rgba(255,255,255,0.9)" }),
    ],
    "Invitation",
  );

  /* ------------------------------- details ------------------------------- */
  const row = (name: string, time: string, y: number) => [
    lock(S({ x: 180, y, width: 640, height: 1.2, fill: WHITE, opacity: 0.35 })),
    T(name, y + 34, { x: 180, width: 380, align: "left", fontFamily: "Outfit", fontWeight: 500, fontSize: 20, letterSpacing: 8, uppercase: true, fill: WHITE }),
    T(time, y + 20, { x: 520, width: 300, align: "right", fontFamily: "Playfair Display", italic: true, fontSize: 44, fill: WHITE }),
  ];
  const small = (text: string, y: number) => T(text, y, { x: 180, width: 640, fontFamily: "Outfit", fontWeight: 500, fontSize: 16, letterSpacing: 10, uppercase: true, fill: "#ffe3c8" });

  const details = P(
    bg2,
    [
      glow(150, 150, 700, "255,140,150", 0.5),
      glow(860, 1250, 800, "255,222,190", 0.5),
      glow(900, 500, 500, "150,110,255", 0.5),
      ring(860, 1250, 640, 0.35),
      ring(860, 1250, 780, 0.2),
      T("the", 84, { x: 100, width: 800, fontFamily: "Playfair Display", italic: true, fontSize: 56, fill: "#ffe3c8" }),
      T("DETAILS", 134, { x: 100, width: 800, fontFamily: "Outfit", fontWeight: 600, fontSize: 120, letterSpacing: 14, fill: WHITE, lineHeight: 1 }),
      ...glass(110, 310, 780, 960),
      ...row("Ceremony", "6:30 PM", 360),
      ...row("Cocktails", "7:30 PM", 452),
      ...row("Dinner", "8:30 PM", 544),
      ...row("Party", "10:00 PM", 636),
      lock(S({ x: 180, y: 728, width: 640, height: 1.2, fill: WHITE, opacity: 0.35 })),
      small("Venue", 770),
      T("The Glass Pavilion", 812, { x: 180, width: 640, fontFamily: "Playfair Display", italic: true, fontSize: 44, fill: WHITE }),
      T("18 Bayfront Avenue, Marina Bay\nSingapore 018971", 878, { x: 180, width: 640, fontFamily: "Outfit", fontWeight: 300, fontSize: 23, lineHeight: 1.5, letterSpacing: 1, fill: WHITE }),
      small("Celebration", 990),
      T("Celebration under the stars", 1032, { x: 180, width: 640, fontFamily: "Outfit", fontWeight: 400, fontSize: 24, fill: WHITE }),
      T("Valet parking at the pavilion", 1078, { x: 180, width: 640, fontFamily: "Outfit", fontWeight: 300, fontSize: 21, letterSpacing: 1, fill: "rgba(255,255,255,0.9)" }),
      small("Dress code", 1150),
      T("Cocktail - sunset hues encouraged", 1188, { x: 180, width: 640, fontFamily: "Outfit", fontWeight: 300, fontSize: 23, fill: WHITE }),
    ],
    "Details",
  );

  /* ------------------------------- photo ------------------------------- */
  const photo = P(
    bg,
    [
      ...orbs,
      ring(500, 560, 780, 0.45),
      ring(500, 560, 900, 0.22),
      lock(O(ringsDots({ color: WHITE, size: 300, dots: 72, strokeWidth: 2 }), { x: 350, y: 410, width: 300, opacity: 0 })),
      I({ x: 200, y: 160, width: 600, height: 800, mask: "arch", placeholderFill: "rgba(255,255,255,0.2)", name: "Photo" }),
      T("forever", 1012, { x: 100, width: 800, fontFamily: "Playfair Display", italic: true, fontSize: 110, fill: "#ffe3c8", lineHeight: 1 }),
      T("STARTS NOW", 1140, { x: 100, width: 800, fontFamily: "Outfit", fontWeight: 600, fontSize: 84, letterSpacing: 14, fill: WHITE, lineHeight: 1 }),
      caps("Zara & Noah · 06.11.2027", 1270, { fontSize: 16, letterSpacing: 11 }),
    ],
    "Portrait",
  );

  return {
    slug: "sunset-gradient",
    name: "Sunset Gradient",
    tagline: "Glowing sunset gradient wedding invitation with glass panels",
    description:
      "An ultra-modern wedding invitation that melts from peach and coral into lilac and indigo, with soft glowing orbs, fine white rings and a frosted-glass details panel.",
    categories: ["modern", "minimal", "geometric"],
    keywords: ["gradient wedding invitation", "modern sunset wedding invitation", "glassmorphism wedding card", "instagram wedding invitation"],
    palette: [PEACH, CORAL, LILAC, INDIGO, WHITE],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}

void H;
