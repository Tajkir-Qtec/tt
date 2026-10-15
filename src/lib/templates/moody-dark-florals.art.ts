import { leaf, Path, petal, type PartSpec, type Pt } from "../design/path";
import type { Layer } from "../design/types";
import { place, rng } from "./birthday-balloons-bold.art";

export { place, rng };

/** Dark & moody florals: dahlias, ranunculus, inky foliage and berries, all procedural vectors. */

const rad = (d: number) => (d * Math.PI) / 180;

export interface Bloom {
  /** ring / band colours, outermost first */
  tones: string[];
  edge: string;
  rib?: string;
}

export const BURGUNDY: Bloom = { tones: ["#33081a", "#4f0e29", "#6d1637", "#8c1f47", "#a92d58", "#c4476f"], edge: "#1f030f", rib: "#e98aa8" };
export const PLUM: Bloom = { tones: ["#241030", "#371a49", "#4d245f", "#663076", "#84438f", "#a362ad"], edge: "#14081c", rib: "#d9a7e3" };
export const WINE: Bloom = { tones: ["#4a0c20", "#661330", "#861c40", "#a62a52", "#c44a6b", "#e07890"], edge: "#2a0511" };
export const GOLDEN: Bloom = { tones: ["#9a6a1c", "#bd8a30", "#d6a548", "#e8be6c", "#f3d38f", "#fbe8b8"], edge: "#6e4a10" };
export const BLUSH: Bloom = { tones: ["#8a3638", "#b05650", "#cb766a", "#df9684", "#eeb5a3", "#f8d6c6"], edge: "#6a2326" };

/** Soft contact shadow under a bloom. */
export function shade(cx: number, cy: number, R: number): PartSpec[] {
  return [1.14, 1.07, 1.0].map((k) => {
    const p = new Path();
    p.circle(cx + R * 0.05, cy + R * 0.09, R * k);
    return { path: p, fill: "#000000", opacity: 0.16 };
  });
}

/** A many-ringed dahlia. */
export function dahlia(cx: number, cy: number, R: number, b: Bloom, seed = 1, rings = 6): PartSpec[] {
  const r = rng(seed);
  const specs: PartSpec[] = [];
  const rot0 = r() * 360;
  for (let i = 0; i < rings; i++) {
    const frac = 1 - (i / rings) * 0.86;
    const Rr = R * frac;
    const n = Math.max(8, Math.round(20 - i * 2));
    const body = new Path();
    const ribs = new Path();
    const off = rot0 + i * (180 / n) + r() * 8;
    for (let k = 0; k < n; k++) {
      const a = rad(off + (360 / n) * k);
      const rr = Rr * (0.93 + r() * 0.1);
      petal(body, cx, cy, a, Rr * 0.12, rr, ((Math.PI * Rr * 0.62) / n) * 1.05, true);
      ribs.M(cx + Math.cos(a) * Rr * 0.3, cy + Math.sin(a) * Rr * 0.3).L(cx + Math.cos(a) * rr * 0.8, cy + Math.sin(a) * rr * 0.8);
    }
    specs.push({ path: body, fill: b.tones[Math.min(i, b.tones.length - 1)], stroke: b.edge, strokeWidth: 1.2 });
    if (b.rib) specs.push({ path: ribs, stroke: b.rib, strokeWidth: 1, opacity: 0.22 });
  }
  const c = new Path();
  c.circle(cx, cy, R * 0.05);
  specs.push({ path: c, fill: "#e9c978" });
  return specs;
}

/** A dense spiral ranunculus. */
export function ranunculus(cx: number, cy: number, R: number, b: Bloom, seed = 1): PartSpec[] {
  const r = rng(seed);
  const N = 74;
  const bands = b.tones.length;
  const paths = b.tones.map(() => new Path());
  const rot = r() * 6;
  for (let k = N - 1; k >= 0; k--) {
    const t = (k + 1) / N;
    const rk = R * (0.12 + 0.88 * Math.sqrt(t));
    const a = rot + k * 2.39996;
    const band = Math.min(bands - 1, Math.floor((1 - t) * bands * 0.999));
    petal(paths[band], cx, cy, a, rk * 0.1, rk, rk * 0.36, false);
  }
  const specs: PartSpec[] = paths.map((p, i) => ({ path: p, fill: b.tones[i], stroke: b.edge, strokeWidth: 1.1, opacity: 1 }));
  // soft inner swirl
  const sw = new Path();
  for (let i = 0; i < 3; i++) {
    const rr = R * (0.1 + i * 0.07);
    sw.M(cx + rr, cy).A(rr, rr, 0, 1, 1, cx - rr * 0.6, cy + rr * 0.7);
    sw.include([cx - rr, cy - rr], [cx + rr, cy + rr]);
  }
  specs.push({ path: sw, stroke: b.edge, strokeWidth: 1.2, opacity: 0.4 });
  return specs;
}

export interface SprayOpts {
  len: number;
  angle: number;
  curve?: number;
  leafLen: number;
  seed: number;
  colors?: [string, string];
  gold?: boolean;
}

/** Foliage spray: bowed stem, alternate leaves, optional gold outlines. */
export function spray(bx: number, by: number, o: SprayOpts): PartSpec[] {
  const r = rng(o.seed);
  const a = rad(o.angle);
  const tip: Pt = [bx + Math.cos(a) * o.len, by + Math.sin(a) * o.len];
  const k = o.curve ?? 0.18;
  const ctrl: Pt = [(bx + tip[0]) / 2 - Math.sin(a) * o.len * k, (by + tip[1]) / 2 + Math.cos(a) * o.len * k];
  const at = (t: number): Pt => {
    const u = 1 - t;
    return [u * u * bx + 2 * u * t * ctrl[0] + t * t * tip[0], u * u * by + 2 * u * t * ctrl[1] + t * t * tip[1]];
  };
  const ta = (t: number) => Math.atan2(2 * (1 - t) * (ctrl[1] - by) + 2 * t * (tip[1] - ctrl[1]), 2 * (1 - t) * (ctrl[0] - bx) + 2 * t * (tip[0] - ctrl[0]));
  const stem = new Path();
  for (let i = 0; i <= 20; i++) {
    const [x, y] = at(i / 20);
    if (i === 0) stem.M(x, y);
    else stem.L(x, y);
  }
  const c = o.colors ?? ["#17322d", "#24473c"];
  const A = new Path();
  const B = new Path();
  const outline = new Path();
  const n = 9;
  for (let i = 0; i < n; i++) {
    const t = 0.12 + (0.88 * i) / n;
    const p = at(t);
    for (const side of [-1, 1]) {
      const l = o.leafLen * (1 - t * 0.55) * (0.85 + r() * 0.3);
      const ang = ta(t) + side * rad(42 + r() * 16);
      leaf(i % 2 ? A : B, p, ang, l, l * 0.22);
      if (o.gold) leaf(outline, p, ang, l, l * 0.22);
    }
  }
  leaf(A, tip, ta(1), o.leafLen * 0.55, o.leafLen * 0.12);
  const specs: PartSpec[] = [
    { path: stem, stroke: c[0], strokeWidth: 3.2 },
    { path: B, fill: c[0], stroke: "#0a1613", strokeWidth: 1 },
    { path: A, fill: c[1], stroke: "#0a1613", strokeWidth: 1 },
  ];
  if (o.gold) specs.push({ path: outline, stroke: "#d9b45f", strokeWidth: 1.1, opacity: 0.55 });
  return specs;
}

/** A cluster of glossy berries. */
export function berries(cx: number, cy: number, r0: number, n: number, seed: number, color = "#5a1230", hi = "#d86a8a"): PartSpec[] {
  const r = rng(seed);
  const a = new Path();
  const h = new Path();
  const s = new Path();
  for (let i = 0; i < n; i++) {
    const ang = r() * Math.PI * 2;
    const d = r() * r0 * 2.2;
    const x = cx + Math.cos(ang) * d;
    const y = cy + Math.sin(ang) * d;
    const rr = r0 * (0.7 + r() * 0.5);
    s.M(cx, cy).L(x, y);
    a.circle(x, y, rr);
    h.circle(x - rr * 0.3, y - rr * 0.3, rr * 0.25);
  }
  return [
    { path: s, stroke: "#1f3b34", strokeWidth: 1.8 },
    { path: a, fill: color, stroke: "#240411", strokeWidth: 1 },
    { path: h, fill: hi, opacity: 0.7 },
  ];
}

export interface ClusterOpts {
  ax: number;
  ay: number;
  /** mirror flags */
  sx?: 1 | -1;
  sy?: 1 | -1;
  scale?: number;
  seed?: number;
  /** drop the biggest blooms for a lighter accent */
  light?: boolean;
}

/** A lush corner cluster anchored at (ax, ay), growing inwards. Returns locked layers, back to front. */
export function cluster(o: ClusterOpts): Layer[] {
  const sx = o.sx ?? 1;
  const sy = o.sy ?? 1;
  const s = o.scale ?? 1;
  const sd = o.seed ?? 1;
  const X = (x: number) => o.ax + sx * x * s;
  const Y = (y: number) => o.ay + sy * y * s;
  const A = (deg: number) => {
    const d = sx < 0 ? 180 - deg : deg;
    return sy < 0 ? -d : d;
  };
  const out: Layer[] = [];
  const fol: PartSpec[] = [];
  const sprays: [number, number, number, number, number, boolean][] = [
    [30, 60, 520, 12, 130, true],
    [70, 40, 470, -14, 120, false],
    [10, 110, 430, 24, 112, false],
    [60, 90, 390, -30, 110, true],
    [90, 20, 360, 8, 104, false],
    [15, 20, 330, 40, 98, true],
  ];
  sprays.forEach(([ox, oy, len, ang, ll, gold], i) => {
    fol.push(...spray(X(ox), Y(oy), { len: len * s, angle: A(ang + 28), leafLen: ll * s, seed: sd * 7 + i, gold, colors: i % 3 === 2 ? ["#2c1a3b", "#3d2552"] : ["#17322d", "#24473c"] }));
  });
  out.push(place(fol, 2));
  const fl: PartSpec[] = [];
  if (!o.light) {
    fl.push(...shade(X(360), Y(110), 108 * s), ...dahlia(X(360), Y(110), 108 * s, PLUM, sd + 1, 6));
    fl.push(...shade(X(150), Y(165), 158 * s), ...dahlia(X(150), Y(165), 158 * s, BURGUNDY, sd + 2, 6));
    fl.push(...shade(X(275), Y(330), 90 * s), ...ranunculus(X(275), Y(330), 90 * s, GOLDEN, sd + 3));
    fl.push(...shade(X(95), Y(380), 66 * s), ...ranunculus(X(95), Y(380), 66 * s, BLUSH, sd + 4));
    fl.push(...shade(X(440), Y(250), 58 * s), ...ranunculus(X(440), Y(250), 58 * s, WINE, sd + 5));
    fl.push(...berries(X(520), Y(130), 11 * s, 6, sd + 6));
    fl.push(...berries(X(70), Y(520), 10 * s, 5, sd + 7));
  } else {
    fl.push(...shade(X(170), Y(150), 100 * s), ...dahlia(X(170), Y(150), 100 * s, BURGUNDY, sd + 2, 6));
    fl.push(...shade(X(290), Y(250), 62 * s), ...ranunculus(X(290), Y(250), 62 * s, GOLDEN, sd + 3));
    fl.push(...shade(X(95), Y(270), 48 * s), ...ranunculus(X(95), Y(270), 48 * s, BLUSH, sd + 4));
    fl.push(...berries(X(340), Y(110), 9 * s, 5, sd + 6));
  }
  // draw each bloom as its own layer so overlap order is natural
  out.push(place(fl, 2));
  return out;
}

/** Soft coloured glow (ellipse with radial falloff) */
export const glowPaint = (rgb: string, a = 0.5) => ({ kind: "radial" as const, stops: [[0, `rgba(${rgb},${a})`], [1, `rgba(${rgb},0)`]] as [number, string][] });
