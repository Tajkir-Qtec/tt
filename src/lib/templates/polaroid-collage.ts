import { heart, sparkle, star } from "../design/ornaments";
import { assemble, Path } from "../design/path";
import { centerRotate } from "../design/layers";
import type { Layer } from "../design/types";
import { H, I, linear, lock, O, P, S, T, W, type TemplateDef } from "./kit";

const PAPER = "#fbf6ee";
const INK = "#3f3d4a";
const SOFT = "#7a7684";
const CORAL = "#e47f6e";
const BLUSH = "#f3c9c4";
const BUTTER = "#f7e0a1";
const SKY = "#b5d3e2";
const SAGE = "#c4d7bd";

/** Rotate a layer (any type) about an external pivot by `deg` (layers rotate about their top-left). */
function rotAbout<L extends Layer>(l: L, px: number, py: number, deg: number): L {
  const a = (deg * Math.PI) / 180;
  const dx = l.x - px;
  const dy = l.y - py;
  return { ...l, x: px + dx * Math.cos(a) - dy * Math.sin(a), y: py + dx * Math.sin(a) + dy * Math.cos(a), rotation: l.rotation + deg };
}

/** Washi tape: semi-transparent coloured strip with fine stripes, centred on (cx,cy), tilted by `tilt`. */
function tape(cx: number, cy: number, w: number, tilt: number, color: string, kind: "stripe" | "dots" | "plain" = "stripe"): Layer[] {
  const h = 46;
  const out: Layer[] = [
    S({ x: cx - w / 2, y: cy - h / 2 + 3, width: w, height: h, fill: "#4a3a2a", opacity: 0.07, cornerRadius: 1 }),
    S({ x: cx - w / 2, y: cy - h / 2, width: w, height: h, fill: linear(90, [0, color], [1, color]), opacity: 0.82, cornerRadius: 1 }),
  ];
  if (kind === "stripe") {
    for (let sx = 9; sx < w - 8; sx += 18) out.push(S({ x: cx - w / 2 + sx, y: cy - h / 2, width: 6, height: h, fill: "#ffffff", opacity: 0.38 }));
  } else if (kind === "dots") {
    for (let sx = 14; sx < w - 8; sx += 24)
      for (const dy of [12, 34]) out.push(S({ shape: "ellipse", x: cx - w / 2 + sx - 3 + (dy > 20 ? 12 : 0), y: cy - h / 2 + dy - 3, width: 6, height: 6, fill: "#ffffff", opacity: 0.55 }));
  }
  // torn / zig-zag ends
  out.push(S({ x: cx - w / 2, y: cy - h / 2, width: 3, height: h, fill: "#ffffff", opacity: 0.25 }));
  out.push(S({ x: cx + w / 2 - 3, y: cy - h / 2, width: 3, height: h, fill: "#ffffff", opacity: 0.25 }));
  return out.map((l) => rotAbout(lock(l), cx, cy, tilt));
}

interface Pol {
  cx: number;
  cy: number;
  w: number;
  rot: number;
  tint: string;
  caption?: string;
  tape?: { color: string; tilt: number; kind?: "stripe" | "dots" | "plain"; dx?: number };
  photo?: boolean;
}

/** One Polaroid: layered soft shadow, white frame, image placeholder with a camera marker, caption and washi tape. */
function polaroid(p: Pol): Layer[] {
  const m = Math.round(p.w * 0.07);
  const pw = p.w - 2 * m;
  const ph = Math.round(pw * 0.98);
  const bottom = Math.round(p.w * 0.27);
  const h = m + ph + bottom;
  const x = p.cx - p.w / 2;
  const y = p.cy - h / 2;
  const local: Layer[] = [];
  // soft shadow built from stacked, growing rects
  [
    [22, 0.035],
    [14, 0.045],
    [8, 0.06],
    [3, 0.09],
  ].forEach(([g, o]) => local.push(lock(S({ x: x - g / 2 + 2, y: y - g / 2 + 12, width: p.w + g, height: h + g, cornerRadius: 4 + g / 3, fill: "#5a4535", opacity: o }))));
  local.push(lock(S({ x, y, width: p.w, height: h, cornerRadius: 3, fill: linear(100, [0, "#ffffff"], [1, "#f6f1e7"]), stroke: "#ebe4d6", strokeWidth: 1 })));
  local.push(I({ x: x + m, y: y + m, width: pw, height: ph, mask: "rect", placeholderFill: p.tint }));
  // camera glyph marker (only meaningful while the photo is empty; sits beneath the real photo once one is set)
  if (p.photo !== false) {
    const gx = x + m + pw / 2;
    const gy = y + m + ph / 2;
    const gs = Math.min(pw, 360) / 360;
    local.push(
      lock(S({ x: gx - 34 * gs, y: gy - 22 * gs, width: 68 * gs, height: 46 * gs, cornerRadius: 9 * gs, fill: null, stroke: "#ffffff", strokeWidth: 3.2, opacity: 0.85 })),
      lock(S({ x: gx - 12 * gs, y: gy - 31 * gs, width: 24 * gs, height: 10 * gs, cornerRadius: 3 * gs, fill: null, stroke: "#ffffff", strokeWidth: 3.2, opacity: 0.85 })),
      lock(S({ shape: "ellipse", x: gx - 14 * gs, y: gy - 12 * gs, width: 28 * gs, height: 28 * gs, fill: null, stroke: "#ffffff", strokeWidth: 3.2, opacity: 0.85 })),
      lock(S({ shape: "ellipse", x: gx + 20 * gs, y: gy - 14 * gs, width: 5 * gs, height: 5 * gs, fill: "#ffffff", opacity: 0.85 })),
    );
  }
  if (p.caption) {
    const fs = Math.round(p.w * 0.095);
    local.push(T(p.caption, y + m + ph + (bottom - fs * 1.2) / 2 + 3, { x: x + m, width: pw, fontFamily: "Dancing Script", fontWeight: 500, fontSize: fs, fill: INK, opacity: 0.85 }));
  } else {
    const ly = y + m + ph + bottom * 0.45;
    local.push(lock(S({ x: x + m + pw * 0.18, y: ly, width: pw * 0.64, height: 2.4, fill: "#d9d0c2", cornerRadius: 1.2 })));
    local.push(lock(S({ x: x + m + pw * 0.3, y: ly + 15, width: pw * 0.4, height: 2.4, fill: "#e6dfd2", cornerRadius: 1.2 })));
  }
  const out = local.map((l) => rotAbout(l, p.cx, p.cy, p.rot));
  if (p.tape) {
    const tc = rotAbout(S({ x: p.cx + (p.tape.dx ?? 0), y: y - 6, width: 0, height: 0 }), p.cx, p.cy, p.rot);
    out.push(...tape(tc.x, tc.y, Math.round(p.w * 0.42), p.rot + p.tape.tilt, p.tape.color, p.tape.kind));
  }
  return out;
}

function squiggle(color: string, w = 300): ReturnType<typeof assemble> {
  const p = new Path();
  const n = 8;
  const seg = w / n;
  p.M(0, 8);
  for (let i = 0; i < n; i++) p.Q(seg * i + seg / 2, i % 2 === 0 ? -2 : 18, seg * (i + 1), 8);
  p.include([0, 0], [w, 16]);
  return assemble([{ path: p, stroke: color, strokeWidth: 3.2, lineCap: "round" }], 3);
}

const heartAt = (cx: number, cy: number, s: number, color: string, rot = 0, op = 1): Layer =>
  lock(centerRotate(O(heart({ color, size: s }), { x: cx - s / 2, y: cy - s / 2, opacity: op }), cx, cy, rot));
const sparkAt = (cx: number, cy: number, s: number, color: string, op = 1): Layer => lock(O(sparkle({ color, size: s }), { x: cx - s / 2, y: cy - s / 2, opacity: op }));
const starAt = (cx: number, cy: number, s: number, color: string, rot = 0, op = 1): Layer =>
  lock(centerRotate(O(star({ color, size: s, points: 5, inner: 0.46 }), { x: cx - s / 2, y: cy - s / 2, opacity: op }), cx, cy, rot));
const ringAt = (cx: number, cy: number, s: number, color: string, op = 0.8): Layer =>
  lock(S({ shape: "ellipse", x: cx - s / 2, y: cy - s / 2, width: s, height: s, fill: null, stroke: color, strokeWidth: 3, opacity: op }));
const dotAt = (cx: number, cy: number, s: number, color: string, op = 0.7): Layer => lock(S({ shape: "ellipse", x: cx - s / 2, y: cy - s / 2, width: s, height: s, fill: color, opacity: op }));

export default function build(): TemplateDef {
  const bg = linear(90, [0, "#fdf9f2"], [1, "#f6eee1"]);
  const label = (text: string, y: number, o: Partial<Parameters<typeof T>[2]> = {}) =>
    T(text, y, { x: 200, width: 600, fontFamily: "Poppins", fontWeight: 500, fontSize: 17, fill: CORAL, letterSpacing: 8, uppercase: true, ...o });

  /* --------------------------------- cover --------------------------------- */
  const cover = P(
    bg,
    [
      // soft pastel blobs for depth
      lock(S({ shape: "ellipse", x: -160, y: -120, width: 560, height: 560, fill: `${BLUSH}`, opacity: 0.35 })),
      lock(S({ shape: "ellipse", x: 650, y: 1020, width: 560, height: 560, fill: SKY, opacity: 0.3 })),
      label("You're invited", 96),
      ...polaroid({ cx: 300, cy: 490, w: 360, rot: -7, tint: BLUSH, caption: "us, 2023", tape: { color: BUTTER, tilt: -4, kind: "stripe" } }),
      ...polaroid({ cx: 705, cy: 500, w: 340, rot: 6, tint: SKY, caption: "the proposal", tape: { color: SAGE, tilt: 5, kind: "dots", dx: 10 } }),
      ...polaroid({ cx: 502, cy: 450, w: 226, rot: -2.5, tint: BUTTER, caption: "forever", tape: { color: BLUSH, tilt: 3, kind: "stripe" } }),
      heartAt(120, 255, 44, CORAL, -14),
      sparkAt(880, 230, 40, "#e9b94a"),
      sparkAt(838, 232, 20, CORAL, 0.8),
      starAt(112, 700, 34, "#e9b94a", 12),
      heartAt(895, 700, 34, "#e99a8c", 16),
      ringAt(900, 300, 16, SKY, 0.9),
      dotAt(100, 330, 9, CORAL),
      T("Dear {to},", 750, { x: 200, width: 600, fontFamily: "Dancing Script", fontWeight: 500, fontSize: 38, fill: SOFT }),
      T("Olivia & Noah", 800, { x: 70, width: 860, fontFamily: "Sacramento", fontSize: 158, lineHeight: 1.15, fill: INK }),
      lock(O(squiggle(CORAL, 260), { cx: W / 2, y: 992, width: 260 })),
      label("are getting married", 1030, { fontSize: 19, fill: SOFT, letterSpacing: 9 }),
      T("12 · 06 · 2027", 1080, { x: 150, width: 700, fontFamily: "DM Sans", fontWeight: 500, fontSize: 62, letterSpacing: 5, fill: INK }),
      T("Saturday at four o'clock", 1160, { x: 200, width: 600, fontFamily: "Dancing Script", fontWeight: 500, fontSize: 36, fill: CORAL }),
      T("Fig & Willow Farm", 1218, { x: 150, width: 700, fontFamily: "Poppins", fontWeight: 600, fontSize: 24, letterSpacing: 5, uppercase: true, fill: INK }),
      T("Hudson Valley, New York", 1258, { x: 200, width: 600, fontFamily: "Poppins", fontWeight: 400, fontSize: 18, letterSpacing: 2, fill: SOFT }),
    ],
    "Invitation",
  );

  /* -------------------------------- details -------------------------------- */
  const card = (cx: number, cy: number, w: number, h: number, rot: number, fill: string, tint?: string): Layer[] =>
    [
      lock(S({ x: cx - w / 2 - 6, y: cy - h / 2 + 8, width: w + 12, height: h + 8, cornerRadius: 8, fill: "#5a4535", opacity: 0.045 })),
      lock(S({ x: cx - w / 2 - 2, y: cy - h / 2 + 4, width: w + 4, height: h + 3, cornerRadius: 6, fill: "#5a4535", opacity: 0.07 })),
      lock(S({ x: cx - w / 2, y: cy - h / 2, width: w, height: h, cornerRadius: 5, fill, stroke: tint ?? "#ebe4d6", strokeWidth: 1.2 })),
    ].map((l) => rotAbout(l, cx, cy, rot));

  const event = (name: string, time: string, note: string, cy: number, rot: number, accent: string): Layer[] => {
    const cx = W / 2;
    const w = 640;
    const h = 160;
    const parts: Layer[] = [
      ...card(cx, cy, w, h, rot, "#ffffff"),
      lock(S({ x: cx - w / 2 + 28, y: cy - h / 2 + 28, width: 6, height: h - 56, cornerRadius: 3, fill: accent })),
      T(name, cy - 56, { x: cx - w / 2 + 70, width: w - 140, align: "left", fontFamily: "Poppins", fontWeight: 500, fontSize: 16, letterSpacing: 7, uppercase: true, fill: CORAL }),
      T(time, cy - 30, { x: cx - w / 2 + 70, width: w - 140, align: "left", fontFamily: "DM Sans", fontWeight: 500, fontSize: 54, fill: INK }),
      T(note, cy + 34, { x: cx - w / 2 + 70, width: w - 140, align: "left", fontFamily: "Dancing Script", fontWeight: 500, fontSize: 28, fill: SOFT }),
    ];
    return parts.map((l, i) => (i < 3 ? l : rotAbout(l, cx, cy, rot)));
  };

  const note = (cx: number, cy: number, w: number, h: number, rot: number, fill: string, head: string, big: string, small: string, tapeColor: string): Layer[] => {
    const base = card(cx, cy, w, h, rot, fill, "#e7dfd0");
    const texts = [
      T(head, cy - h / 2 + 52, { x: cx - w / 2 + 20, width: w - 40, fontFamily: "Poppins", fontWeight: 500, fontSize: 15, letterSpacing: 7, uppercase: true, fill: CORAL }),
      T(big, cy - h / 2 + 96, { x: cx - w / 2 + 20, width: w - 40, fontFamily: "Dancing Script", fontWeight: 600, fontSize: 40, lineHeight: 1.1, fill: INK }),
      T(small, cy - h / 2 + 162, { x: cx - w / 2 + 36, width: w - 72, fontFamily: "DM Sans", fontWeight: 400, fontSize: 21, lineHeight: 1.45, fill: SOFT }),
    ].map((l) => rotAbout(l, cx, cy, rot));
    const tc = rotAbout(S({ x: cx, y: cy - h / 2 - 4, width: 0, height: 0 }), cx, cy, rot);
    return [...base, ...texts, ...tape(tc.x, tc.y, 150, rot - 5, tapeColor, "stripe")];
  };

  const details = P(
    bg,
    [
      lock(S({ shape: "ellipse", x: 660, y: -180, width: 620, height: 620, fill: BUTTER, opacity: 0.3 })),
      lock(S({ shape: "ellipse", x: -230, y: 1000, width: 620, height: 620, fill: BLUSH, opacity: 0.32 })),
      T("The Plan", 96, { x: 150, width: 700, fontFamily: "Sacramento", fontSize: 120, lineHeight: 1.1, fill: INK }),
      lock(O(squiggle(CORAL, 220), { cx: W / 2, y: 236, width: 220 })),
      ...event("Ceremony", "4:00 PM", "vows under the old fig tree", 360, -1.2, BLUSH),
      ...event("Cocktails", "5:00 PM", "lawn games & lemonade", 540, 1, SKY),
      ...event("Dinner & Dancing", "6:30 PM", "long tables, string lights, good music", 720, -0.8, BUTTER),
      ...note(300, 1000, 380, 290, -2.5, "#fffaf0", "Where", "Fig & Willow Farm", "214 Orchard Lane\nHudson Valley, NY 12534", BUTTER),
      ...note(710, 1010, 380, 290, 2.2, "#fff3f1", "What to wear", "Colourful & cosy", "Garden party chic. Flats are best for the lawn!", SKY),
      T("see you on the dance floor", 1262, { x: 150, width: 700, fontFamily: "Dancing Script", fontWeight: 500, fontSize: 40, fill: CORAL }),
      heartAt(110, 190, 34, CORAL, -12),
      sparkAt(890, 150, 34, "#e9b94a"),
      starAt(890, 845, 28, "#e9b94a", 14),
      heartAt(110, 835, 26, "#e99a8c", 10),
      sparkAt(130, 1262, 26, "#e9b94a"),
      heartAt(870, 1268, 28, CORAL, 12),
    ],
    "Details",
  );

  /* ------------------------------- photo wall ------------------------------- */
  const wall = P(
    bg,
    [
      lock(S({ shape: "ellipse", x: -200, y: -160, width: 560, height: 560, fill: SKY, opacity: 0.28 })),
      lock(S({ shape: "ellipse", x: 700, y: 980, width: 560, height: 560, fill: BLUSH, opacity: 0.34 })),
      T("Our Little Story", 66, { x: 100, width: 800, fontFamily: "Sacramento", fontSize: 80, lineHeight: 1.1, fill: INK }),
      ...polaroid({ cx: 290, cy: 350, w: 290, rot: -5, tint: BLUSH, caption: "first hello", tape: { color: BUTTER, tilt: -3 } }),
      ...polaroid({ cx: 710, cy: 345, w: 290, rot: 4.5, tint: SKY, caption: "road trips", tape: { color: SAGE, tilt: 4, kind: "dots" } }),
      ...polaroid({ cx: 500, cy: 690, w: 310, rot: -1.5, tint: BUTTER, caption: "we said yes!", tape: { color: BLUSH, tilt: 2 } }),
      ...polaroid({ cx: 300, cy: 1040, w: 270, rot: 4, tint: SAGE, caption: "home sweet home", tape: { color: SKY, tilt: -4, kind: "dots" } }),
      ...polaroid({ cx: 700, cy: 1035, w: 270, rot: -4.5, tint: BLUSH, caption: "next chapter", tape: { color: BUTTER, tilt: 3 } }),
      heartAt(500, 985, 40, CORAL, 0),
      sparkAt(880, 560, 32, "#e9b94a"),
      sparkAt(110, 600, 26, CORAL, 0.8),
      starAt(118, 850, 30, "#e9b94a", -12),
      heartAt(895, 860, 28, "#e99a8c", 14),
      T("Our favourite love story", 1236, { x: 150, width: 700, fontFamily: "Dancing Script", fontWeight: 500, fontSize: 42, lineHeight: 1.15, fill: INK }),
    ],
    "Photo wall",
  );

  return {
    slug: "polaroid-collage",
    name: "Polaroid Collage",
    tagline: "Playful photo wedding invitation with Polaroids and washi tape",
    description:
      "A warm, photo-forward invitation: tilted Polaroid frames with soft shadows, striped washi tape and doodle hearts in blush, butter and sky pastels, with hand-lettered script names.",
    categories: ["modern", "minimal", "boho"],
    keywords: ["polaroid wedding invitation", "photo collage wedding card", "playful pastel wedding invite", "washi tape wedding invitation"],
    palette: ["#fbf6ee", "#f3c9c4", "#f7e0a1", "#b5d3e2", "#3f3d4a"],
    width: W,
    height: H,
    pages: [cover, details, wall],
  };
}
