import { archFrame, divider } from "../design/ornaments";
import type { Layer } from "../design/types";
import { berryBranch, cluster, placeLeaves } from "./autumn-rust.art";
import { H, I, linear, lock, O, P, radial, S, T, W, type TemplateDef } from "./kit";

const BURG = "#5b1a2b";
const BURG_D = "#3a0f1b";
const RUST = "#b4572e";
const MUSTARD = "#d6a23a";
const OLIVE = "#6d7440";
const CREAM = "#f6eddc";
const INK = "#6a4a40";

const burgBg = linear(160, [0, "#6b2133"], [0.55, "#5b1a2b"], [1, "#3a0f1b"]);
const creamBg = linear(160, [0, "#faf3e4"], [1, "#efe2c8"]);
const goldLine = "#c9a25a";

const glow = (cx: number, cy: number, r: number, c: string, a: number): Layer =>
  lock(S({ shape: "ellipse", x: cx - r, y: cy - r, width: r * 2, height: r * 2, fill: radial([0, `rgba(${c},${a})`], [0.5, `rgba(${c},${a * 0.4})`], [1, `rgba(${c},0)`]) }));

/** Foliage for the top-right and bottom-left corners. */
function foliage(scale = 1, branch = true): Layer[] {
  const out: Layer[] = [];
  if (branch) {
    const bl = Math.round(440 * scale);
    const b1 = berryBranch(bl, 3);
    out.push(lock(O(b1, { x: W - bl + 10, y: -8, width: bl })));
    const b2 = berryBranch(bl, 7);
    out.push(lock(O(b2, { x: -10, y: H - bl * 0.62 + 8, width: bl, flipX: true, flipY: true })));
  }
  out.push(...placeLeaves(cluster(W - 80 * scale, 105 * scale, scale, 1, 0)));
  out.push(...placeLeaves(cluster(80 * scale, H - 105 * scale, scale, -1, 180)));
  return out;
}

function detailsPage(): Layer[] {
  const x = 200;
  const width = 600;
  const lab = (t: string, y: number) => T(t, y, { x, width, fontFamily: "Jost", fontWeight: 500, fontSize: 18, fill: RUST, letterSpacing: 8, uppercase: true });
  const big = (t: string, y: number, size = 48) => T(t, y, { x, width, fontFamily: "Fraunces", fontWeight: 400, fontSize: size, fill: BURG, lineHeight: 1.15 });
  const body = (t: string, y: number) => T(t, y, { x, width, fontFamily: "Jost", fontSize: 23, fill: INK, lineHeight: 1.5 });
  const out: Layer[] = [
    T("The Day", 175, { x, width, fontFamily: "DM Serif Display", fontSize: 96, fill: BURG }),
    O(divider({ style: "diamond", w: 360, color: RUST }), { cx: W / 2, y: 312, width: 360 }),
  ];
  const ev: [string, string][] = [
    ["Ceremony", "4:00 PM"],
    ["Harvest Cocktails", "5:00 PM"],
    ["Dinner & Dancing", "6:30 PM"],
  ];
  ev.forEach(([n, t], i) => out.push(lab(n, 400 + i * 112), big(t, 436 + i * 112)));
  out.push(O(divider({ style: "dots", w: 300, color: MUSTARD }), { cx: W / 2, y: 754, width: 300 }));
  out.push(lab("Venue", 820), big("Hollow Oak Farm", 856, 44), body("48 Orchard Ridge Road\nWoodstock, Vermont", 912));
  out.push(lab("Attire", 1022), body("Autumn formal – jewel tones and earthy hues", 1058));
  return out;
}

export default function build(): TemplateDef {
  const archW = 740;
  const archH = 1140;
  const cover = P(
    burgBg,
    [
      glow(500, 700, 620, "168,80,60", 0.28),
      lock(O(archFrame({ w: archW, h: archH, stroke: goldLine, strokeWidth: 3, lines: 2, gap: 12, fill: creamBg }), { x: 130, y: 130, width: archW })),
      ...foliage(0.84),
      T("Dear {to},", 310, { x: 200, width: 600, fontFamily: "Fraunces", italic: true, fontWeight: 300, fontSize: 34, fill: INK }),
      T("Together with their families", 372, { x: 200, width: 600, fontFamily: "Jost", fontSize: 17, fill: RUST, letterSpacing: 7, uppercase: true }),
      T("invite you to celebrate the wedding of", 410, { x: 200, width: 600, fontFamily: "Playfair Display", italic: true, fontSize: 27, fill: INK }),
      T("Harper", 470, { x: 170, width: 660, fontFamily: "DM Serif Display", fontSize: 148, fill: linear(100, [0, "#7a2538"], [1, BURG_D]), lineHeight: 1 }),
      T("&", 628, { x: 170, width: 660, fontFamily: "Playfair Display", italic: true, fontSize: 60, fill: RUST, lineHeight: 1 }),
      T("Oliver", 690, { x: 170, width: 660, fontFamily: "DM Serif Display", fontSize: 148, fill: linear(100, [0, "#7a2538"], [1, BURG_D]), lineHeight: 1 }),
      O(divider({ style: "diamond", w: 360, color: RUST }), { cx: W / 2, y: 880, width: 360 }),
      T("Saturday", 940, { x: 200, width: 600, fontFamily: "Jost", fontSize: 19, fill: RUST, letterSpacing: 12, uppercase: true }),
      T("23 · 10 · 2027", 972, { x: 200, width: 600, fontFamily: "Fraunces", fontWeight: 400, fontSize: 66, fill: BURG }),
      T("at four o'clock in the afternoon", 1056, { x: 200, width: 600, fontFamily: "Fraunces", italic: true, fontWeight: 300, fontSize: 26, fill: INK }),
      T("Hollow Oak Farm", 1112, { x: 200, width: 600, fontFamily: "Fraunces", fontWeight: 600, fontSize: 30, fill: BURG, letterSpacing: 6, uppercase: true }),
      T("Woodstock, Vermont", 1158, { x: 200, width: 600, fontFamily: "Jost", fontSize: 19, fill: INK, letterSpacing: 3 }),
    ],
    "Invitation",
  );

  const details = P(
    creamBg,
    [
      glow(900, 100, 420, "214,162,58", 0.22),
      glow(100, 1300, 420, "180,87,46", 0.18),
      lock(S({ x: 52, y: 52, width: 896, height: 1296, fill: null, stroke: RUST, strokeWidth: 2.5 })),
      lock(S({ x: 66, y: 66, width: 868, height: 1268, fill: null, stroke: "rgba(180,87,46,0.45)", strokeWidth: 1 })),
      ...foliage(0.66, true),
      ...detailsPage(),
    ],
    "Details",
  );

  const photo = P(
    burgBg,
    [
      glow(500, 600, 620, "168,80,60", 0.28),
      lock(S({ x: 52, y: 52, width: 896, height: 1296, fill: null, stroke: "rgba(236,208,138,0.7)", strokeWidth: 1.5 })),
      lock(S({ x: 64, y: 64, width: 872, height: 1272, fill: null, stroke: "rgba(236,208,138,0.3)", strokeWidth: 1 })),
      ...foliage(0.66, true),
      T("Our Story", 150, { x: 200, width: 600, fontFamily: "DM Serif Display", fontSize: 76, fill: CREAM }),
      lock(O(archFrame({ w: 560, h: 780, stroke: goldLine, strokeWidth: 2.5, lines: 2, gap: 12 }), { cx: W / 2, y: 262, width: 560 })),
      I({ x: 230, y: 282, width: 540, height: 740, mask: "arch", placeholderFill: "#e6d2b4", borderColor: CREAM, borderWidth: 6 }),
      T("“Every leaf a promise, every season ours.”", 1085, { x: 150, width: 700, fontFamily: "Fraunces", italic: true, fontWeight: 300, fontSize: 36, fill: CREAM, lineHeight: 1.25 }),
      T("Harper & Oliver", 1170, { x: 150, width: 700, fontFamily: "Fraunces", fontWeight: 500, fontSize: 28, fill: MUSTARD, letterSpacing: 8, uppercase: true }),
      T("23 · 10 · 2027", 1214, { x: 200, width: 600, fontFamily: "Jost", fontWeight: 300, fontSize: 18, fill: "#e8d6bd", letterSpacing: 8 }),
    ],
    "Photo",
  );

  return {
    slug: "autumn-rust",
    name: "Autumn Rust",
    tagline: "Warm autumn wedding invitation in burgundy, rust and mustard",
    description:
      "A cozy fall invitation with hand-built oak and maple leaves, a berry branch and a cream arched window on deep burgundy, set in warm serif lettering with rust and mustard accents.",
    categories: ["seasonal", "nature", "vintage"],
    keywords: ["autumn wedding invitation", "fall leaves burgundy invitation", "rustic harvest wedding card", "rust and mustard wedding"],
    palette: [BURG, RUST, MUSTARD, OLIVE, CREAM],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
