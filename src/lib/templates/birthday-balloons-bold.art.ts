import { assemble, Path, type PartSpec, type Pt } from "../design/path";
import { centerRotate } from "../design/layers";
import { heart, sparkle, star } from "../design/ornaments";
import type { Layer, OrnamentLayer, Paint } from "../design/types";
import { linear, lock, O, S, W } from "./kit";

/** Seeded RNG so artwork is stable between renders. */
export function rng(seed: number) {
  let s = seed >>> 0;
  return () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296;
}

/** Place path specs (page coordinates) as one locked ornament layer sized to their bounds. */
export function place(specs: PartSpec[], pad = 2, o: { opacity?: number } = {}): OrnamentLayer {
  const d = assemble(specs, pad);
  let a = Infinity;
  let b = Infinity;
  for (const s of specs) {
    const [x0, y0] = s.path.bounds();
    const sw = (s.stroke ? s.strokeWidth ?? 0 : 0) / 2;
    a = Math.min(a, x0 - sw);
    b = Math.min(b, y0 - sw);
  }
  return lock(O(d, { x: a - pad, y: b - pad, ...o }));
}

export function ellipsePath(cx: number, cy: number, rx: number, ry: number, rotDeg = 0): Path {
  const t = (rotDeg * Math.PI) / 180;
  const dx = Math.cos(t) * rx;
  const dy = Math.sin(t) * rx;
  const p = new Path();
  p.M(cx - dx, cy - dy).A(rx, ry, rotDeg, 1, 0, cx + dx, cy + dy).A(rx, ry, rotDeg, 1, 0, cx - dx, cy - dy).Z();
  const m = Math.max(rx, ry);
  p.include([cx - m, cy - m], [cx + m, cy + m]);
  return p;
}

export interface BalloonColors {
  light: string;
  base: string;
  dark: string;
}

export const BALLOONS: Record<string, BalloonColors> = {
  red: { light: "#ff8aa0", base: "#ff3d6a", dark: "#c71f4d" },
  blue: { light: "#8ed3ff", base: "#2d9cff", dark: "#1a64c8" },
  green: { light: "#9bf0c4", base: "#2fd58b", dark: "#16995f" },
  purple: { light: "#c7a9ff", base: "#8b5cf6", dark: "#5a30c4" },
  orange: { light: "#ffc27a", base: "#ff8a1f", dark: "#d4600a" },
  yellow: { light: "#fff2a0", base: "#ffd23f", dark: "#e3a512" },
  pink: { light: "#ffc2e0", base: "#ff6fb5", dark: "#d93d8a" },
  teal: { light: "#9cf2ee", base: "#19c9c0", dark: "#0c8f89" },
};

/** A glossy balloon with knot, highlights and a curly string. (cx,cy) = body centre. */
export function balloon(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  c: BalloonColors,
  o: { tilt?: number; stringTo?: Pt; stringColor?: string; stringBend?: number } = {},
): OrnamentLayer {
  const tilt = ((o.tilt ?? 0) * Math.PI) / 180;
  const P = (x: number, y: number): Pt => {
    const dx = x - cx;
    const dy = y - cy;
    return [cx + dx * Math.cos(tilt) - dy * Math.sin(tilt), cy + dx * Math.sin(tilt) + dy * Math.cos(tilt)];
  };
  const body = new Path();
  const m = P(cx, cy - ry);
  body.M(m[0], m[1]);
  let a = P(cx + rx * 1.02, cy - ry);
  let b = P(cx + rx * 1.12, cy + ry * 0.4);
  const e = P(cx, cy + ry);
  body.C(a[0], a[1], b[0], b[1], e[0], e[1]);
  a = P(cx - rx * 1.12, cy + ry * 0.4);
  b = P(cx - rx * 1.02, cy - ry);
  body.C(a[0], a[1], b[0], b[1], m[0], m[1]).Z();
  body.include(P(cx - rx, cy), P(cx + rx, cy));
  const knot = new Path();
  const k0 = P(cx, cy + ry - 3);
  const k1 = P(cx - 11, cy + ry + 15);
  const k2 = P(cx + 11, cy + ry + 15);
  const kc = P(cx, cy + ry + 11);
  knot.M(k0[0], k0[1]).L(k1[0], k1[1]).Q(kc[0], kc[1], k2[0], k2[1]).Z();
  const specs: PartSpec[] = [];
  if (o.stringTo) {
    const s0 = P(cx, cy + ry + 14);
    const [ex, ey] = o.stringTo;
    const bend = o.stringBend ?? 40;
    const mx = (s0[0] + ex) / 2;
    const my = (s0[1] + ey) / 2;
    const str = new Path();
    str.M(s0[0], s0[1]).Q(s0[0] + bend, my - 20, mx, my).Q(mx - bend, my + 40, ex, ey);
    specs.push({ path: str, stroke: o.stringColor ?? "#2a1a66", strokeWidth: 2.6, opacity: 0.75 });
  }
  specs.push({ path: body, fill: linear(55, [0, c.light], [0.5, c.base], [1, c.dark]) });
  specs.push({ path: knot, fill: c.dark });
  const hl = P(cx - rx * 0.46, cy - ry * 0.42);
  specs.push({ path: ellipsePath(hl[0], hl[1], ry * 0.3, rx * 0.13, 118 + (o.tilt ?? 0)), fill: "#ffffff", opacity: 0.6 });
  const hl2 = P(cx - rx * 0.2, cy - ry * 0.78);
  specs.push({ path: ellipsePath(hl2[0], hl2[1], rx * 0.07, rx * 0.07, 0), fill: "#ffffff", opacity: 0.7 });
  const sh = P(cx + rx * 0.5, cy + ry * 0.45);
  specs.push({ path: ellipsePath(sh[0], sh[1], ry * 0.32, rx * 0.12, 125 + (o.tilt ?? 0)), fill: c.light, opacity: 0.28 });
  return place(specs, 3);
}

export interface ConfettiOpts {
  seed: number;
  count: number;
  colors: string[];
  area: [number, number, number, number]; // x0,y0,x1,y1
  skip?: (x: number, y: number) => boolean;
  size?: number;
  opacity?: number;
}

/** Scatter of confetti (rectangles, dots, triangles, squiggles, mini stars) as ONE ornament layer. */
export function confetti(o: ConfettiOpts): OrnamentLayer {
  const r = rng(o.seed);
  const fills = new Map<string, Path>();
  const strokes = new Map<string, Path>();
  const f = (c: string) => fills.get(c) ?? fills.set(c, new Path()).get(c)!;
  const sk = (c: string) => strokes.get(c) ?? strokes.set(c, new Path()).get(c)!;
  const sz = o.size ?? 1;
  let placed = 0;
  let guard = 0;
  while (placed < o.count && guard++ < o.count * 20) {
    const x = o.area[0] + r() * (o.area[2] - o.area[0]);
    const y = o.area[1] + r() * (o.area[3] - o.area[1]);
    if (o.skip?.(x, y)) continue;
    placed++;
    const col = o.colors[Math.floor(r() * o.colors.length)];
    const kind = Math.floor(r() * 5);
    const ang = r() * Math.PI * 2;
    const rot = (px: number, py: number): Pt => [x + px * Math.cos(ang) - py * Math.sin(ang), y + px * Math.sin(ang) + py * Math.cos(ang)];
    if (kind === 0) {
      const w = (10 + r() * 12) * sz;
      const h = (5 + r() * 4) * sz;
      f(col).poly([rot(-w / 2, -h / 2), rot(w / 2, -h / 2), rot(w / 2, h / 2), rot(-w / 2, h / 2)], true);
    } else if (kind === 1) {
      f(col).circle(x, y, (4 + r() * 4) * sz);
    } else if (kind === 2) {
      const s = (9 + r() * 6) * sz;
      f(col).poly([rot(0, -s), rot(s * 0.9, s * 0.7), rot(-s * 0.9, s * 0.7)], true);
    } else if (kind === 3) {
      const l = (14 + r() * 8) * sz;
      const p = sk(col);
      const a = rot(-l, 0);
      const b = rot(-l / 2, -l * 0.45);
      const c = rot(0, 0);
      const d = rot(l / 2, l * 0.45);
      const e = rot(l, 0);
      p.M(a[0], a[1]).Q(b[0], b[1], c[0], c[1]).Q(d[0], d[1], e[0], e[1]);
    } else {
      const s = (7 + r() * 5) * sz;
      const pts: Pt[] = [];
      for (let i = 0; i < 8; i++) {
        const rr = i % 2 ? s * 0.4 : s;
        pts.push(rot(Math.cos((i * Math.PI) / 4) * rr, Math.sin((i * Math.PI) / 4) * rr));
      }
      f(col).poly(pts, true);
    }
  }
  const specs: PartSpec[] = [];
  fills.forEach((path, c) => specs.push({ path, fill: c }));
  strokes.forEach((path, c) => specs.push({ path, stroke: c, strokeWidth: 3.2 * sz }));
  return place(specs, 2, { opacity: o.opacity ?? 1 });
}

/** Triangular bunting hung on a sagging string from (x0,y0) to (x1,y1). */
export function bunting(x0: number, y0: number, x1: number, y1: number, sag: number, colors: string[], n: number, flag = 62, stringColor = "#2a1a66"): OrnamentLayer {
  const pt = (t: number): Pt => [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t + Math.sin(Math.PI * t) * sag];
  const str = new Path();
  str.M(x0, y0);
  for (let i = 1; i <= 24; i++) {
    const q = pt(i / 24);
    str.L(q[0], q[1]);
  }
  const byColor = new Map<string, Path>();
  for (let i = 0; i < n; i++) {
    const t0 = (i + 0.18) / n;
    const t1 = (i + 0.82) / n;
    const p0 = pt(t0);
    const p1 = pt(t1);
    const mid = pt((t0 + t1) / 2);
    const c = colors[i % colors.length];
    const path = byColor.get(c) ?? byColor.set(c, new Path()).get(c)!;
    path.poly([p0, p1, [mid[0], mid[1] + flag]], true);
  }
  const specs: PartSpec[] = [{ path: str, stroke: stringColor, strokeWidth: 3 }];
  byColor.forEach((path, c) => specs.push({ path, fill: c }));
  return place(specs, 4);
}

export const starAt = (cx: number, cy: number, s: number, color: string, rot = 0, op = 1, inner = 0.46): Layer =>
  lock(centerRotate(O(star({ color, size: s, points: 5, inner }), { x: cx - s / 2, y: cy - s / 2, opacity: op }), cx, cy, rot));
export const sparkAt = (cx: number, cy: number, s: number, color: string, op = 1): Layer => lock(O(sparkle({ color, size: s }), { x: cx - s / 2, y: cy - s / 2, opacity: op }));
export const heartAt = (cx: number, cy: number, s: number, color: string, rot = 0, op = 1): Layer =>
  lock(centerRotate(O(heart({ color, size: s }), { x: cx - s / 2, y: cy - s / 2, opacity: op }), cx, cy, rot));
export const dot = (cx: number, cy: number, s: number, fill: Paint | null, op = 1, stroke?: string, sw = 0): Layer =>
  lock(S({ shape: "ellipse", x: cx - s / 2, y: cy - s / 2, width: s, height: s, fill, stroke: stroke ?? null, strokeWidth: sw, opacity: op }));

export { W };
