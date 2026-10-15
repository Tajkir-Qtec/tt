import { assemble, leaf, petal, Path, type PartSpec } from "../design/path";
import type { Layer } from "../design/types";
import { linear, O, S, radial } from "./kit";

/** Full-page ornament: draw in page coordinates (1000 x 1400). */
export function pg(specs: PartSpec[], o: Record<string, unknown> = {}) {
  return O(assemble(specs, 0, { w: 1000, h: 1400 }), { x: 0, y: 0, width: 1000, height: 1400, locked: true, ...o });
}

export type RoseCols = [string, string][];
export const REDS: RoseCols = [
  ["#7a1228", "#3f0613"],
  ["#c42a4c", "#7e1230"],
  ["#e0506d", "#a01c3d"],
  ["#f07b92", "#c23352"],
];
export const BLUSH: RoseCols = [
  ["#e7a2b2", "#c06c82"],
  ["#f4c2cd", "#d98aa0"],
  ["#fbdbe2", "#eeaebd"],
  ["#fff0f2", "#f7ccd6"],
];

/** A layered spiral rose in page coordinates. */
export function rose(cx: number, cy: number, R: number, cols: RoseCols = REDS, rot = 0): PartSpec[] {
  const specs: PartSpec[] = [];
  const base = new Path();
  base.circle(cx, cy, R * 0.9);
  specs.push({ path: base, fill: linear(90, [0, cols[0][0]], [1, cols[0][1]]), stroke: "rgba(0,0,0,0.25)", strokeWidth: 2 });
  const counts = [6, 5, 5, 4, 3];
  const radii = [0.98, 0.82, 0.62, 0.44, 0.26];
  for (let k = 0; k < counts.length; k++) {
    const c = cols[Math.min(k, cols.length - 1)];
    const p = new Path();
    const r1 = R * radii[k];
    const n = counts[k];
    for (let i = 0; i < n; i++) {
      const a = rot + (i / n) * Math.PI * 2 + k * 0.62;
      petal(p, cx, cy, a, r1 * 0.12, r1, ((r1 * Math.PI) / n) * 0.74, false);
    }
    specs.push({ path: p, fill: linear(60 + k * 25, [0, c[0]], [1, c[1]]), stroke: "rgba(60,0,15,0.35)", strokeWidth: 1.8 });
  }
  const s = new Path();
  const turns = 2.1;
  for (let i = 0; i <= 60; i++) {
    const t = i / 60;
    const a = rot + t * turns * Math.PI * 2;
    const r = R * 0.3 * (1 - t) + 2;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    if (i === 0) s.M(x, y);
    else s.L(x, y);
  }
  specs.push({ path: s, stroke: "rgba(70,0,20,0.45)", strokeWidth: 2.4 });
  const hl = new Path();
  hl.M(cx - R * 0.55, cy - R * 0.5).Q(cx - R * 0.2, cy - R * 0.85, cx + R * 0.25, cy - R * 0.7);
  specs.push({ path: hl, stroke: "rgba(255,255,255,0.28)", strokeWidth: 3 });
  return specs;
}

export function leafSpecs(cx: number, cy: number, angles: number[], len: number, wd: number, dark = "#1f4a35", light = "#3f7a55"): PartSpec[] {
  const p = new Path();
  const v = new Path();
  for (const a of angles) {
    const ang = (a * Math.PI) / 180;
    leaf(p, [cx, cy], ang, len, wd);
    v.M(cx, cy).L(cx + Math.cos(ang) * len * 0.92, cy + Math.sin(ang) * len * 0.92);
  }
  return [
    { path: p, fill: linear(45, [0, light], [1, dark]), stroke: "rgba(0,0,0,0.22)", strokeWidth: 1.5 },
    { path: v, stroke: "rgba(220,255,225,0.35)", strokeWidth: 1.6 },
  ];
}

/** A bouquet-like cluster of roses with leaves, centred on (cx, cy). */
export function cluster(cx: number, cy: number, s: number, cols: RoseCols = REDS, alt: RoseCols = BLUSH): PartSpec[] {
  const out: PartSpec[] = [];
  out.push(...leafSpecs(cx, cy + 20 * s, [-200, -165, -135, -105, -75, -45, -15, 20, 160], 190 * s, 26 * s));
  out.push(...leafSpecs(cx, cy + 30 * s, [-182, -150, -118, -62, -30, 2], 150 * s, 20 * s, "#2b6045", "#5a9a73"));
  out.push(...rose(cx - 128 * s, cy + 48 * s, 68 * s, alt, 0.6));
  out.push(...rose(cx + 128 * s, cy + 48 * s, 68 * s, alt, 1.3));
  out.push(...rose(cx, cy, 96 * s, cols, 0.2));
  out.push(...rose(cx - 62 * s, cy + 92 * s, 44 * s, cols, 2));
  out.push(...rose(cx + 70 * s, cy + 96 * s, 40 * s, cols, 1));
  return out;
}

/** Soft glow disc using a radial gradient. */
export function glow(cx: number, cy: number, r: number, color: string, op = 1): Layer {
  return S({ shape: "ellipse", x: cx - r, y: cy - r, width: r * 2, height: r * 2, fill: radial([0, color], [1, color.replace(/[\d.]+\)$/, "0)")]), opacity: op, locked: true });
}

/** A taper candle with flame and glow. Returns layers. */
export function candle(cx: number, baseY: number, h: number, w: number, body = "#f6e7d0"): Layer[] {
  const flameY = baseY - h;
  const flame = new Path();
  flame.M(cx, flameY - 74).C(cx + 30, flameY - 36, cx + 22, flameY - 4, cx, flameY - 2).C(cx - 22, flameY - 4, cx - 30, flameY - 36, cx, flameY - 74).Z();
  const inner = new Path();
  inner.M(cx, flameY - 48).C(cx + 12, flameY - 28, cx + 9, flameY - 8, cx, flameY - 6).C(cx - 9, flameY - 8, cx - 12, flameY - 28, cx, flameY - 48).Z();
  const wick = new Path();
  wick.M(cx, flameY - 4).L(cx, flameY + 8);
  const drip = new Path();
  drip.M(cx + w / 2 - 2, flameY + 2).L(cx + w / 2 - 2, flameY + 46).Q(cx + w / 2 - 12, flameY + 62, cx + w / 2 - 20, flameY + 46).L(cx + w / 2 - 20, flameY + 8).Z();
  return [
    glow(cx, flameY - 40, 190, "rgba(255,196,110,0.55)"),
    S({ x: cx - w / 2, y: flameY, width: w, height: h, cornerRadius: 6, fill: linear(0, [0, "#d9c3a4"], [0.35, body], [0.7, "#fff7ea"], [1, "#cdb391"]), locked: true }),
    S({ shape: "ellipse", x: cx - w / 2, y: flameY - 7, width: w, height: 16, fill: "#fff3dc", locked: true }),
    pg([
      { path: drip, fill: "#fff7ea", opacity: 0.9 },
      { path: wick, stroke: "#3a2a1a", strokeWidth: 3 },
      { path: flame, fill: linear(90, [0, "#ffe8a0"], [0.6, "#ffb347"], [1, "#ff7a2a"]) },
      { path: inner, fill: "#fffbe8" },
    ]),
  ];
}

/** Scattered falling petals. */
export function petals(seed: number, n: number, box: [number, number, number, number], color: string, size = 16): PartSpec {
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const p = new Path();
  for (let i = 0; i < n; i++) {
    const x = box[0] + rnd() * (box[2] - box[0]);
    const y = box[1] + rnd() * (box[3] - box[1]);
    petal(p, x, y, rnd() * Math.PI * 2, 2, size * (0.7 + rnd() * 0.7), size * 0.4, false);
  }
  return { path: p, fill: color, opacity: 0.75 };
}
