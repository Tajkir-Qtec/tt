import { archFrame, banner, blossom, corner, divider, flower, sprig, ticketFrame } from "../design/ornaments";
import { centerRotate } from "../design/layers";
import { detailsLayers } from "./details";
import { H, I, linear, lock, O, P, S, T, W, type TemplateDef } from "./kit";

const INK = "#5a3d28"; // sepia ink
const INK_L = "#7b5a40";
const ROSE = "#b9847a"; // antique rose
const ROSE_D = "#8f5a52";
const OLIVE = "#7b7d55";
const CREAM = "#f6ecd6";
const LINE = "#8a6445";

const paper = linear(155, [0, "#f2e6cb"], [0.5, "#ecdcb8"], [1, "#e4cfa5"]);

/** Aged-paper depth: edge vignette, corner stains, and a deterministic scatter of foxing spots. */
function aging(seed: number) {
  const out = [
    lock(S({ x: 0, y: 0, width: W, height: H, shape: "rect", fill: { kind: "radial", stops: [[0, "rgba(120,80,40,0)"], [0.5, "rgba(120,80,40,0)"], [0.8, "rgba(110,70,32,0.12)"], [1, "rgba(90,55,25,0.30)"]] } })),
    lock(S({ shape: "ellipse", x: -260, y: -260, width: 640, height: 640, fill: { kind: "radial", stops: [[0, "rgba(140,95,50,0.28)"], [1, "rgba(140,95,50,0)"]] } })),
    lock(S({ shape: "ellipse", x: 620, y: 1020, width: 700, height: 700, fill: { kind: "radial", stops: [[0, "rgba(140,95,50,0.30)"], [1, "rgba(140,95,50,0)"]] } })),
  ];
  let s = seed;
  const rnd = () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
  for (let i = 0; i < 34; i++) {
    const x = rnd() * W;
    const y = rnd() * H;
    const r = 3 + rnd() * 9;
    out.push(lock(S({ shape: "ellipse", x, y, width: r * 2, height: r * 2 * (0.7 + rnd() * 0.5), fill: { kind: "radial", stops: [[0, "rgba(125,85,45,0.20)"], [1, "rgba(125,85,45,0)"]] } })));
  }
  return out;
}

function border() {
  const f = ticketFrame({ w: 880, h: 1280, r: 46, stroke: LINE, strokeWidth: 3, lines: 3, gap: 12 });
  const c = corner({ style: "flourish", size: 150, color: INK_L, strokeWidth: 2.6 });
  const pos = [
    { x: 90, y: 90, flipX: false, flipY: false },
    { x: 760, y: 90, flipX: true, flipY: false },
    { x: 90, y: 1160, flipX: false, flipY: true },
    { x: 760, y: 1160, flipX: true, flipY: true },
  ];
  return [
    lock(O(f, { x: 60, y: 60, width: 880 })),
    ...pos.map((p) => lock(O(c, { x: p.x, y: p.y, width: 150, flipX: p.flipX, flipY: p.flipY, opacity: 0.9 }))),
  ];
}

/** Floral spray: central bloom flanked by olive sprigs and small blossoms. */
function spray(cx: number, cy: number, scale = 1) {
  const sp = sprig({ color: OLIVE, length: 280, leaves: 6, leafLen: 56, leafW: 14, curve: 26, berryColor: ROSE_D, stemWidth: 3 });
  const bloom = flower({ color: ROSE, ringColors: ["#c99a90", "#b9847a", "#a8706a", "#966058"], stroke: "#7a4a44", strokeWidth: 1.2, radius: 66, rings: 4, petals: 9, center: "#e4c38a", opacity: 0.95 });
  const bud = blossom({ color: "#cfa99d", center: "#e4c38a", radius: 26 });
  const left = centerRotate(O(sp, { x: 0, y: 0, width: 280 * scale, flipX: true }), cx - 150 * scale, cy + 6 * scale, -8);
  const right = centerRotate(O(sp, { x: 0, y: 0, width: 280 * scale }), cx + 150 * scale, cy + 6 * scale, 8);
  return [
    lock(left),
    lock(right),
    lock(O(bud, { cx: cx - 250 * scale, y: cy - 44 * scale, width: 52 * scale })),
    lock(O(bud, { cx: cx + 250 * scale, y: cy - 44 * scale, width: 52 * scale })),
    lock(O(bloom, { cx, y: cy - 70 * scale, width: 140 * scale })),
  ];
}

export default function build(): TemplateDef {
  const cover = P(
    paper,
    [
      ...aging(7),
      ...border(),
      lock(O(banner({ color: ROSE_D, w: 520, h: 92, stroke: "#6e4039" }), { cx: W / 2, y: 150, width: 520 })),
      T("Save the Date", 160, { x: 250, width: 500, fontFamily: "Pinyon Script", fontSize: 54, fill: CREAM, shadow: { color: "#3a1f1a", blur: 3, offsetX: 0, offsetY: 2, opacity: 0.5 } }),
      T("Dear {to},", 272, { x: 200, width: 600, fontFamily: "Italianno", fontSize: 50, fill: ROSE_D }),
      T("Request the honour of your presence", 340, { x: 150, width: 700, fontFamily: "EB Garamond", fontWeight: 500, fontSize: 19, fill: INK_L, letterSpacing: 6, uppercase: true }),
      T("at the marriage of", 376, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontSize: 30, fill: INK_L }),
      T("Eleanor", 425, { x: 160, width: 680, fontFamily: "Pinyon Script", fontSize: 150, fill: INK, shadow: { color: "#8a6445", blur: 2, offsetX: 1, offsetY: 2, opacity: 0.35 } }),
      T("&", 582, { x: 160, width: 680, fontFamily: "EB Garamond", italic: true, fontSize: 56, fill: ROSE_D }),
      T("Theodore", 625, { x: 160, width: 680, fontFamily: "Pinyon Script", fontSize: 150, fill: INK, shadow: { color: "#8a6445", blur: 2, offsetX: 1, offsetY: 2, opacity: 0.35 } }),
      lock(O(divider({ style: "floral", w: 400, color: ROSE_D }), { cx: W / 2, y: 812, width: 400 })),
      T("Saturday", 870, { x: 200, width: 600, fontFamily: "Old Standard TT", fontSize: 20, fill: INK_L, letterSpacing: 10, uppercase: true }),
      T("June 12, 2027", 905, { x: 150, width: 700, fontFamily: "Old Standard TT", fontSize: 58, fill: INK }),
      T("at three o'clock in the afternoon", 985, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontSize: 29, fill: INK_L }),
      T("Hawthorn Manor", 1042, { x: 200, width: 600, fontFamily: "EB Garamond", fontWeight: 600, fontSize: 30, fill: INK, letterSpacing: 7, uppercase: true }),
      T("Kingsbridge · Devon · England", 1088, { x: 200, width: 600, fontFamily: "EB Garamond", fontSize: 21, fill: INK_L, letterSpacing: 3 }),
      ...spray(500, 1222, 1.0),
    ],
    "Invitation",
  );

  const details = P(
    paper,
    [
      ...aging(21),
      ...border(),
      ...detailsLayers({
        heading: "Order of the Day",
        headFont: "Pinyon Script",
        headSize: 86,
        headFill: INK,
        bodyFont: "EB Garamond",
        bodyFill: INK_L,
        strongFont: "Old Standard TT",
        strongWeight: 400,
        strongFill: INK,
        strongSize: 40,
        labelFont: "EB Garamond",
        labelWeight: 600,
        labelSize: 18,
        labelFill: ROSE_D,
        accent: ROSE_D,
        divider: "floral",
        y0: 150,
        x: 200,
        width: 600,
        gap: 0.9,
      }),
      ...spray(500, 1232, 0.85),
    ],
    "Details",
  );

  const photo = P(
    paper,
    [
      ...aging(35),
      ...border(),
      lock(O(archFrame({ w: 560, h: 780, stroke: LINE, strokeWidth: 3, lines: 3, gap: 12 }), { cx: W / 2, y: 170, width: 560 })),
      I({ x: 242, y: 196, width: 516, height: 728, mask: "arch", placeholderFill: "#dcc79f" }),
      T("With love & gratitude", 985, { x: 150, width: 700, fontFamily: "Pinyon Script", fontSize: 76, fill: INK }),
      T("Eleanor & Theodore · 12 · 06 · 2027", 1082, { x: 150, width: 700, fontFamily: "EB Garamond", fontWeight: 500, fontSize: 19, fill: INK_L, letterSpacing: 6, uppercase: true }),
      ...spray(500, 1222, 1.0),
    ],
    "Thank You",
  );

  return {
    slug: "vintage-parchment",
    name: "Vintage Parchment",
    tagline: "Antique parchment wedding invitation with sepia ink and blossoms",
    description:
      "A romantic vintage wedding invitation on aged cream parchment with sepia engraving, an ornate layered border, a ribbon banner and muted antique rose and olive florals.",
    categories: ["vintage", "classic", "floral"],
    keywords: ["vintage wedding invitation", "parchment wedding card", "antique floral wedding invite", "sepia old world wedding"],
    palette: ["#ecdcb8", INK, ROSE, OLIVE, ROSE_D],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
