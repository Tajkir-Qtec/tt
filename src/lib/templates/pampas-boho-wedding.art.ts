import { Path, type PartSpec, type Pt } from "../design/path";
import type { Layer } from "../design/types";
import { place, rng, ellipsePath } from "./birthday-balloons-bold.art";

export { place, rng, ellipsePath };

/** Procedural boho artwork: pampas plumes, dried palm fronds, sun arches. */

const rad = (d: number) => (d * Math.PI) / 180;

export interface PampasOpts {
  len: number;
  /** degrees away from straight up (positive leans right) */
  lean: number;
  width: number;
  seed: number;
  /** curvature of the stem, px sideways at the tip */
  bow?: number;
  tones?: [string, string, string];
}

/** One feathery pampas plume on a bowed stem. */
export function pampas(bx: number, by: number, o: PampasOpts): PartSpec[] {
  const r = rng(o.seed);
  const tones = o.tones ?? ["#f2e1c2", "#dcb98e", "#bf8a66"];
  const a = rad(o.lean - 90);
  const tip: Pt = [bx + Math.cos(a) * o.len, by + Math.sin(a) * o.len];
  const bow = o.bow ?? o.len * 0.08;
  const ctrl: Pt = [(bx + tip[0]) / 2 + bow * Math.cos(a + Math.PI / 2) * 2, (by + tip[1]) / 2 + bow * Math.sin(a + Math.PI / 2) * 2];
  const at = (t: number): Pt => {
    const u = 1 - t;
    return [u * u * bx + 2 * u * t * ctrl[0] + t * t * tip[0], u * u * by + 2 * u * t * ctrl[1] + t * t * tip[1]];
  };
  const tan = (t: number): Pt => {
    const dx = 2 * (1 - t) * (ctrl[0] - bx) + 2 * t * (tip[0] - ctrl[0]);
    const dy = 2 * (1 - t) * (ctrl[1] - by) + 2 * t * (tip[1] - ctrl[1]);
    const m = Math.hypot(dx, dy) || 1;
    return [dx / m, dy / m];
  };
  const stem = new Path();
  for (let i = 0; i <= 24; i++) {
    const [x, y] = at(i / 24);
    if (i === 0) stem.M(x, y);
    else stem.L(x, y);
  }
  const body = new Path();
  const strokes = [new Path(), new Path(), new Path()];
  const t0 = 0.4;
  const halfW = (t: number) => {
    const k = (t - t0) / (1 - t0);
    return o.width * Math.pow(Math.sin(Math.PI * Math.pow(Math.max(k, 0.001), 0.62)), 0.9) + 1.5;
  };
  const left: Pt[] = [];
  const right: Pt[] = [];
  for (let i = 0; i <= 18; i++) {
    const t = t0 + ((1 - t0) * i) / 18;
    const [x, y] = at(t);
    const [tx, ty] = tan(t);
    const w = halfW(t) * 0.8;
    left.push([x - ty * w, y + tx * w]);
    right.push([x + ty * w, y - tx * w]);
  }
  body.poly([...left, ...right.reverse()], true);
  const steps = 80;
  for (let i = 0; i <= steps; i++) {
    const t = t0 - 0.03 + ((1 - t0 + 0.03) * i) / steps;
    const [x, y] = at(t);
    const [tx, ty] = tan(t);
    const nx = -ty;
    const ny = tx;
    const w = halfW(Math.min(t, 1));
    for (const side of [-1, 1]) {
      for (let k = 0; k < 2; k++) {
        const ang = rad(18 + r() * 40);
        const l = (w / Math.sin(ang)) * (0.55 + r() * 0.55);
        const dx = tx * Math.cos(ang) + nx * side * Math.sin(ang);
        const dy = ty * Math.cos(ang) + ny * side * Math.sin(ang);
        const ex = x + dx * l;
        const ey = y + dy * l;
        const cx = x + dx * l * 0.5 + tx * l * 0.28;
        const cy = y + dy * l * 0.5 + ty * l * 0.28;
        const pick = r();
        strokes[pick < 0.5 ? 0 : pick < 0.82 ? 1 : 2].M(x, y).Q(cx, cy, ex, ey);
      }
    }
  }
  return [
    { path: stem, stroke: "#b88a62", strokeWidth: 3.4 },
    { path: body, fill: tones[1], opacity: 0.1 },
    { path: strokes[2], stroke: tones[2], strokeWidth: 1.1, opacity: 0.75 },
    { path: strokes[1], stroke: tones[1], strokeWidth: 1.5, opacity: 0.95 },
    { path: strokes[0], stroke: tones[0], strokeWidth: 1.7, opacity: 0.97 },
  ];
}

/** A tapered, gently drooping blade (palm leaflet). */
function blade(p: Path, base: Pt, ang: number, len: number, wd: number, droop: number) {
  const n = 12;
  const L: Pt[] = [];
  const R: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = base[0] + Math.cos(ang) * len * t;
    const y = base[1] + Math.sin(ang) * len * t + droop * t * t;
    const w = wd * Math.sin(Math.PI * Math.pow(t, 0.7)) * (1 - t * 0.2);
    const nx = -Math.sin(ang);
    const ny = Math.cos(ang);
    L.push([x + nx * w, y + ny * w]);
    R.push([x - nx * w, y - ny * w]);
  }
  p.poly([...L, ...R.reverse()], true);
}

export interface FrondOpts {
  len: number;
  /** degrees from straight up */
  lean: number;
  bend?: number;
  leafLen: number;
  leafW?: number;
  color: string;
  color2?: string;
  seed: number;
}

/** A dried palm spear: a bowed rib with long leaflets sweeping forward on both sides. */
export function frond(bx: number, by: number, o: FrondOpts): PartSpec[] {
  const r = rng(o.seed);
  const a = rad(o.lean - 90);
  const bend = o.bend ?? 60;
  const tip: Pt = [bx + Math.cos(a) * o.len, by + Math.sin(a) * o.len];
  const ctrl: Pt = [(bx + tip[0]) / 2 + Math.cos(a + Math.PI / 2) * bend, (by + tip[1]) / 2 + Math.sin(a + Math.PI / 2) * bend];
  const at = (t: number): Pt => {
    const u = 1 - t;
    return [u * u * bx + 2 * u * t * ctrl[0] + t * t * tip[0], u * u * by + 2 * u * t * ctrl[1] + t * t * tip[1]];
  };
  const tanA = (t: number) => {
    const dx = 2 * (1 - t) * (ctrl[0] - bx) + 2 * t * (tip[0] - ctrl[0]);
    const dy = 2 * (1 - t) * (ctrl[1] - by) + 2 * t * (tip[1] - ctrl[1]);
    return Math.atan2(dy, dx);
  };
  const rib = new Path();
  for (let i = 0; i <= 24; i++) {
    const [x, y] = at(i / 24);
    if (i === 0) rib.M(x, y);
    else rib.L(x, y);
  }
  const A = new Path();
  const B = new Path();
  const n = 22;
  for (let i = 0; i < n; i++) {
    const t = 0.16 + (0.84 * i) / n;
    const [x, y] = at(t);
    const ta = tanA(t);
    const prof = Math.sin(Math.PI * Math.min(1, t * 1.02)) ** 0.5 * (1 - t * 0.55);
    for (const side of [-1, 1]) {
      const ang = ta + side * rad(34 + r() * 14);
      const l = o.leafLen * (0.45 + prof * 0.75) * (0.9 + r() * 0.2);
      blade(i % 2 ? A : B, [x, y], ang, l, (o.leafW ?? 7) * (0.8 + r() * 0.4), l * 0.18);
    }
  }
  // terminal leaflet
  blade(A, tip, tanA(1), o.leafLen * 0.5, (o.leafW ?? 7) * 0.9, 4);
  return [
    { path: B, fill: o.color2 ?? o.color, opacity: 0.92 },
    { path: A, fill: o.color, opacity: 0.96 },
    { path: rib, stroke: o.color, strokeWidth: 3 },
  ];
}

/** Concentric sun-arch bands (outermost first) as one ornament. */
export function archBand(p: Path, x: number, y: number, w: number, h: number) {
  const rr = w / 2;
  p.M(x, y + h).L(x, y + rr).A(rr, rr, 0, 0, 1, x + w, y + rr).L(x + w, y + h).Z();
  p.include([x, y], [x + w, y + h]);
}

export function sunArch(x: number, y: number, w: number, h: number, colors: string[], step: number, line?: string): Layer {
  const specs: PartSpec[] = [];
  colors.forEach((c, i) => {
    const p = new Path();
    archBand(p, x + i * step, y + i * step, w - i * 2 * step, h - i * step);
    specs.push({ path: p, fill: c });
  });
  if (line) {
    const p = new Path();
    const i = colors.length - 1;
    archBand(p, x + i * step + 12, y + i * step + 12, w - i * 2 * step - 24, h - i * step - 12);
    specs.push({ path: p, stroke: line, strokeWidth: 1.6, opacity: 0.8 });
  }
  return place(specs, 2);
}

/** Radiating hairline rays around a point (sun rays). */
export function rays(cx: number, cy: number, r0: number, r1: number, n: number, color: string, sw = 2, from = 180, to = 360, opacity = 0.7): Layer {
  const p = new Path();
  for (let i = 0; i <= n; i++) {
    const a = rad(from + ((to - from) * i) / n);
    const l = i % 2 ? r1 * 0.86 : r1;
    p.M(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0).L(cx + Math.cos(a) * l, cy + Math.sin(a) * l);
  }
  return place([{ path: p, stroke: color, strokeWidth: sw, opacity }], 2);
}

/** Paper speckle (tiny flecks) for a handmade-paper feel. */
export function speckle(seed: number, n: number, area: [number, number, number, number], color: string, skip?: (x: number, y: number) => boolean): Layer {
  const r = rng(seed);
  const p = new Path();
  let c = 0;
  let g = 0;
  while (c < n && g++ < n * 20) {
    const x = area[0] + r() * (area[2] - area[0]);
    const y = area[1] + r() * (area[3] - area[1]);
    if (skip?.(x, y)) continue;
    c++;
    p.circle(x, y, 0.8 + r() * 1.6);
  }
  return place([{ path: p, fill: color, opacity: 0.35 }], 2);
}

/** A little pampas + frond bouquet growing from (cx, by). */
export function bouquet(cx: number, by: number, scale: number, mirror: boolean, seed: number): Layer[] {
  const m = mirror ? 1 : -1; // positive lean = outward
  const fr: PartSpec[] = [
    ...frond(cx, by, { len: 760 * scale, lean: m * -4, bend: m * 80 * scale, leafLen: 190 * scale, color: "#c4714f", color2: "#a95a3b", seed: seed + 1 }),
    ...frond(cx, by, { len: 700 * scale, lean: m * 14, bend: m * 40 * scale, leafLen: 160 * scale, color: "#dcb892", color2: "#c99f78", seed: seed + 2 }),
    ...frond(cx, by, { len: 560 * scale, lean: m * 34, bend: m * 40 * scale, leafLen: 140 * scale, color: "#e7cdb0", color2: "#d4b090", seed: seed + 3 }),
  ];
  const pm: PartSpec[] = [];
  const cfg: [number, number, number, number][] = [
    [640, 2, 92, 0],
    [700, 12, 100, 1],
    [610, 24, 86, 2],
    [540, 36, 78, 3],
    [560, -12, 80, 4],
    [470, 22, 70, 5],
    [420, -4, 64, 6],
  ];
  for (const [len, lean, w, k] of cfg) pm.push(...pampas(cx + (k - 3) * 6 * scale, by, { len: len * scale, lean: m * lean, width: w * scale, seed: seed * 10 + k, bow: m * (k % 2 ? 22 : -18) * scale }));
  return [place(fr, 2), place(pm, 2)];
}
