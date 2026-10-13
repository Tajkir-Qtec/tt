import { assemble, Path, type OrnamentData, type PartSpec } from "../design/path";
import type { Paint } from "../design/types";

export interface WaveOpts {
  w?: number;
  h: number;
  /** y of the wave centre line. */
  base: number;
  amp: number;
  periods: number;
  /** 0..1 horizontal shift (fraction of a period). */
  phase?: number;
  fill: Paint;
  foam?: string;
  foamWidth?: number;
  opacity?: number;
}

/** A smooth wave band filling from the wave line down to the bottom of its box. */
export function waveBand(o: WaveOpts): OrnamentData {
  const w = o.w ?? 1000;
  const half = w / (o.periods * 2);
  let x = -half * 2 * (o.phase ?? 0) - half;
  let up = true;
  const line = new Path();
  const y0 = o.base + o.amp;
  line.M(x, y0);
  while (x < w + half) {
    const nx = x + half;
    const ny = up ? o.base - o.amp : o.base + o.amp;
    const cy = up ? o.base + o.amp : o.base - o.amp;
    line.C(x + half * 0.55, cy, nx - half * 0.55, ny, nx, ny);
    x = nx;
    up = !up;
  }
  const fillPath = new Path();
  // replay line then close along the bottom
  fillPath.M(-half * 3, y0);
  {
    let fx = -half * 2 * (o.phase ?? 0) - half;
    let fu = true;
    fillPath.L(fx, y0);
    while (fx < w + half) {
      const nx = fx + half;
      const ny = fu ? o.base - o.amp : o.base + o.amp;
      const cy = fu ? o.base + o.amp : o.base - o.amp;
      fillPath.C(fx + half * 0.55, cy, nx - half * 0.55, ny, nx, ny);
      fx = nx;
      fu = !fu;
    }
    fillPath.L(fx, o.h).L(-half * 3, o.h).Z();
  }
  const specs: PartSpec[] = [{ path: fillPath, fill: o.fill, opacity: o.opacity }];
  if (o.foam) specs.push({ path: line, stroke: o.foam, strokeWidth: o.foamWidth ?? 2, opacity: 0.85 });
  specs.forEach((s) => s.path.include([0, 0], [w, o.h]));
  // fixed box so every band lines up; overflow beyond the box is clipped by the viewBox
  return assemble(specs, 0, { w, h: o.h });
}

/** Eight-point compass rose with fine rings. */
export function compassRose(size: number, fill: Paint, ring: string): OrnamentData {
  const c = size / 2;
  const long = c * 0.98;
  const mid = c * 0.62;
  const inner = c * 0.17;
  const star = new Path();
  const pts: [number, number][] = [];
  for (let i = 0; i < 16; i++) {
    const a = (i * Math.PI) / 8 - Math.PI / 2;
    const r = i % 4 === 0 ? long : i % 2 === 0 ? mid : inner * (i % 4 === 1 || i % 4 === 3 ? 1 : 1);
    pts.push([c + Math.cos(a) * r, c + Math.sin(a) * r]);
  }
  star.poly(pts, true);
  // light facets: half of each long point
  const facets = new Path();
  for (let i = 0; i < 16; i += 4) {
    const a = (i * Math.PI) / 8 - Math.PI / 2;
    const tip: [number, number] = [c + Math.cos(a) * long, c + Math.sin(a) * long];
    const l: [number, number] = [c + Math.cos(a - Math.PI / 8) * inner, c + Math.sin(a - Math.PI / 8) * inner];
    facets.poly([tip, [c, c], l], true);
  }
  const rings = new Path();
  rings.circle(c, c, c * 0.3);
  const outer = new Path();
  outer.circle(c, c, c * 0.8);
  return assemble(
    [
      { path: outer, stroke: ring, strokeWidth: 1.2, opacity: 0.7 },
      { path: rings, stroke: ring, strokeWidth: 1.2, opacity: 0.8 },
      { path: star, fill },
      { path: facets, fill: "#000000", opacity: 0.18 },
    ],
    0,
    { w: size, h: size },
  );
}

/** Starfish with curved arms and a dotted texture. */
export function starfish(size: number, fill: Paint, dot: string): OrnamentData {
  const c = size / 2;
  const R = c * 0.98;
  const r = c * 0.36;
  const body = new Path();
  const ang = (i: number) => (i * Math.PI) / 5 - Math.PI / 2;
  const P = (i: number, rad: number): [number, number] => [c + Math.cos(ang(i)) * rad, c + Math.sin(ang(i)) * rad];
  const first = P(0, R);
  body.M(first[0], first[1]);
  for (let k = 1; k <= 5; k++) {
    const v = P(2 * k - 1, r);
    const t = P((2 * k) % 10, R);
    // slightly bulged arms: control points near the valleys, pulled outward
    body.Q(v[0] + (c - v[0]) * -0.0, v[1], t[0], t[1]);
  }
  body.Z();
  const dots = new Path();
  for (let k = 0; k < 5; k++) {
    const a = ang(2 * k);
    for (let j = 1; j <= 4; j++) {
      const rr = (R * j) / 4.6 - 2;
      dots.circle(c + Math.cos(a) * rr, c + Math.sin(a) * rr, size * 0.012 + (4 - j) * size * 0.003);
    }
  }
  return assemble([{ path: body, fill }, { path: dots, fill: dot, opacity: 0.7 }], 0, { w: size, h: size });
}

/** Scallop shell with radial ribs. */
export function shell(size: number, fill: Paint, rib: string): OrnamentData {
  const w = size;
  const h = size * 0.92;
  const bx = w / 2;
  const by = h * 0.96;
  const n = 7;
  const outline = new Path();
  outline.M(bx - w * 0.07, by);
  const lobes: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const a = Math.PI * (1.07 + (i / n) * 0.86) * -1 + Math.PI * 2; // sweep from left to right across top
    lobes.push([bx + Math.cos(a) * w * 0.5, by + Math.sin(a) * h * 0.95]);
  }
  // left base to first lobe
  outline.L(lobes[0][0], lobes[0][1]);
  for (let i = 1; i < lobes.length; i++) {
    const [px, py] = lobes[i - 1];
    const [x, y] = lobes[i];
    const mx = (px + x) / 2;
    const my = (py + y) / 2;
    const dx = mx - bx;
    const dy = my - by;
    const d = Math.hypot(dx, dy);
    outline.Q(mx + (dx / d) * w * 0.07, my + (dy / d) * w * 0.07, x, y);
  }
  outline.L(bx + w * 0.07, by).Q(bx, by + h * 0.04, bx - w * 0.07, by).Z();
  const ribs = new Path();
  for (let i = 0; i <= n; i++) ribs.M(bx, by - 2).L(lobes[i][0] * 0.96 + bx * 0.04, lobes[i][1] * 0.96 + by * 0.04);
  const rim = new Path();
  rim.M(bx - w * 0.13, by - h * 0.05).Q(bx, by - h * 0.17, bx + w * 0.13, by - h * 0.05);
  return assemble(
    [
      { path: outline, fill },
      { path: ribs, stroke: rib, strokeWidth: Math.max(1, size * 0.012), opacity: 0.55 },
      { path: rim, stroke: rib, strokeWidth: Math.max(1.2, size * 0.02), opacity: 0.6 },
    ],
    0,
    { w, h: h + 2 },
  );
}
