import { assemble, leaf, Path, petal, rad, type OrnamentData, type PartSpec, type Pt } from "../design/path";
import type { Paint } from "../design/types";

/* Original pastel floral art: beli (jasmine) garlands, flower strands, marigold accents. */

export interface FlowerPalette {
  petal: Paint;
  petalStroke: string;
  center: string;
  leaf: string;
  leafStroke: string;
  string: string;
  marigold: Paint;
  marigoldStroke: string;
  bud?: string;
}

const rnd = (seed: number) => {
  let s = seed >>> 0 || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
};

interface Bag {
  strings: Path;
  leaves: Path;
  buds: Path;
  beli: Path;
  beliVein: Path;
  mari: Path;
  mari2: Path;
  centers: Path;
  mcenters: Path;
}
const bag = (): Bag => ({
  strings: new Path(),
  leaves: new Path(),
  buds: new Path(),
  beli: new Path(),
  beliVein: new Path(),
  mari: new Path(),
  mari2: new Path(),
  centers: new Path(),
  mcenters: new Path(),
});

function addBeli(b: Bag, cx: number, cy: number, r: number, rot: number) {
  for (let i = 0; i < 7; i++) {
    const a = rad(rot + (360 / 7) * i);
    petal(b.beli, cx, cy, a, r * 0.12, r, r * 0.3, false);
    b.beliVein.M(cx + Math.cos(a) * r * 0.2, cy + Math.sin(a) * r * 0.2).L(cx + Math.cos(a) * r * 0.62, cy + Math.sin(a) * r * 0.62);
  }
  b.centers.circle(cx, cy, r * 0.13);
}

function addMarigold(b: Bag, cx: number, cy: number, r: number, rot: number) {
  for (let i = 0; i < 14; i++) petal(b.mari, cx, cy, rad(rot + (360 / 14) * i), r * 0.1, r, r * 0.16, false);
  for (let i = 0; i < 9; i++) petal(b.mari2, cx, cy, rad(rot + 10 + (360 / 9) * i), r * 0.08, r * 0.62, r * 0.14, false);
  b.mcenters.circle(cx, cy, r * 0.1);
}

function specsFrom(b: Bag, pal: FlowerPalette, sw = 1.4): PartSpec[] {
  return [
    { path: b.strings, stroke: pal.string, strokeWidth: 1.6 },
    { path: b.leaves, fill: pal.leaf, stroke: pal.leafStroke, strokeWidth: 1 },
    { path: b.buds, fill: pal.bud ?? "#ffffff", stroke: pal.petalStroke, strokeWidth: 1.1 },
    { path: b.mari, fill: pal.marigold, stroke: pal.marigoldStroke, strokeWidth: sw },
    { path: b.mari2, fill: pal.marigold, stroke: pal.marigoldStroke, strokeWidth: sw * 0.8 },
    { path: b.mcenters, fill: pal.marigoldStroke },
    { path: b.beli, fill: pal.petal, stroke: pal.petalStroke, strokeWidth: sw },
    { path: b.beliVein, stroke: pal.petalStroke, strokeWidth: 0.8, opacity: 0.6 },
    { path: b.centers, fill: pal.center },
  ];
}

/** Hanging garland swag (quadratic curve) strung with beli, buds, leaves and the odd marigold. */
export function garland(o: { w: number; sag: number; pal: FlowerPalette; seed?: number; size?: number; marigoldEvery?: number }): OrnamentData {
  const r = rnd(o.seed ?? 3);
  const b = bag();
  const A: Pt = [0, 30];
  const C: Pt = [o.w / 2, 30 + o.sag * 2];
  const B: Pt = [o.w, 30];
  const at = (t: number): Pt => {
    const u = 1 - t;
    return [u * u * A[0] + 2 * u * t * C[0] + t * t * B[0], u * u * A[1] + 2 * u * t * C[1] + t * t * B[1]];
  };
  const tang = (t: number) => Math.atan2(2 * (1 - t) * (C[1] - A[1]) + 2 * t * (B[1] - C[1]), 2 * (1 - t) * (C[0] - A[0]) + 2 * t * (B[0] - C[0]));
  b.strings.M(A[0], A[1]).Q(C[0], C[1], B[0], B[1]);
  const size = o.size ?? 26;
  // walk along curve at roughly constant spacing
  let prev = at(0);
  let acc = 0;
  let idx = 0;
  const steps = 600;
  const items: { t: number; kind: number }[] = [];
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const p = at(t);
    acc += Math.hypot(p[0] - prev[0], p[1] - prev[1]);
    prev = p;
    if (acc >= size * 1.55) {
      acc = 0;
      items.push({ t, kind: idx });
      idx++;
    }
  }
  items.forEach(({ t, kind }) => {
    const p = at(t);
    const a = tang(t);
    // leaves on both sides
    leaf(b.leaves, p, a + Math.PI / 2 - 0.5, size * 1.1, size * 0.22);
    leaf(b.leaves, p, a - Math.PI / 2 + 0.5, size * 1.1, size * 0.22);
    // bud between flowers
    const q = at(Math.min(1, t + 0.5 / steps * size));
    leaf(b.buds, [q[0], q[1]], a + (kind % 2 ? 0.35 : -0.35) + Math.PI / 2, size * 0.8, size * 0.2);
  });
  items.forEach(({ t, kind }) => {
    const p = at(t);
    const mari = o.marigoldEvery && kind % o.marigoldEvery === o.marigoldEvery - 1;
    if (mari) addMarigold(b, p[0], p[1], size * 0.95, r() * 40);
    else addBeli(b, p[0], p[1], size * (0.85 + r() * 0.3), r() * 50);
  });
  return assemble(specsFrom(b, o.pal), 0, { w: o.w, h: 30 + o.sag + size * 2 });
}

/** Vertical hanging flower strand ending in a tassel of buds. */
export function strand(o: { len: number; pal: FlowerPalette; seed?: number; size?: number; marigoldEvery?: number }): OrnamentData {
  const r = rnd(o.seed ?? 5);
  const b = bag();
  const size = o.size ?? 22;
  const cx = size * 2;
  b.strings.M(cx, 0).L(cx, o.len);
  const n = Math.floor((o.len - size * 3) / (size * 1.7));
  for (let i = 0; i < n; i++) {
    const y = size + i * size * 1.7;
    leaf(b.leaves, [cx, y], rad(-35 + 180), size * 1.0, size * 0.2);
    leaf(b.leaves, [cx, y], rad(35), size * 1.0, size * 0.2);
    leaf(b.buds, [cx, y + size * 0.85], rad(90 + (i % 2 ? 22 : -22)), size * 0.75, size * 0.17);
  }
  for (let i = 0; i < n; i++) {
    const y = size + i * size * 1.7;
    const mari = o.marigoldEvery && i % o.marigoldEvery === o.marigoldEvery - 1;
    if (mari) addMarigold(b, cx, y, size * 0.95, r() * 30);
    else addBeli(b, cx, y, size * (0.82 + r() * 0.26), r() * 50);
  }
  // tassel
  const ty = o.len - size * 1.9;
  for (let k = -2; k <= 2; k++) {
    const a = rad(90 + k * 17);
    petal(b.buds, cx, ty, a, 0, size * (2 - Math.abs(k) * 0.2), size * 0.2, true);
  }
  b.centers.circle(cx, ty, size * 0.2);
  return assemble(specsFrom(b, o.pal), 0, { w: size * 4, h: o.len });
}

/** Loose scatter cluster of beli and marigold with leaves; good for corners. */
export function cluster(o: { w: number; h: number; pal: FlowerPalette; seed?: number; count?: number; size?: number; marigolds?: number }): OrnamentData {
  const r = rnd(o.seed ?? 9);
  const b = bag();
  const n = o.count ?? 9;
  const size = o.size ?? 30;
  const pts: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1 || 1);
    const x = size + t * (o.w - size * 2) + (r() - 0.5) * size;
    const y = o.h * (0.5 + 0.3 * Math.sin(t * Math.PI * 1.2 + 0.4)) + (r() - 0.5) * size;
    pts.push([x, y]);
  }
  pts.forEach(([x, y]) => {
    leaf(b.leaves, [x, y], rad(r() * 360), size * 1.5, size * 0.28);
    leaf(b.leaves, [x, y], rad(r() * 360), size * 1.3, size * 0.25);
  });
  pts.forEach(([x, y]) => leaf(b.buds, [x, y], rad(r() * 360), size * 1.0, size * 0.22));
  pts.forEach(([x, y], i) => {
    if (o.marigolds && i % o.marigolds === o.marigolds - 1) addMarigold(b, x, y, size * 0.95, r() * 30);
    else addBeli(b, x, y, size * (0.8 + r() * 0.3), r() * 50);
  });
  return assemble(specsFrom(b, o.pal), 0, { w: o.w, h: o.h });
}

/** Organic soft blob (fill only). */
export function blob(o: { size: number; color: Paint; seed?: number; lobes?: number }): OrnamentData {
  const r = rnd(o.seed ?? 4);
  const n = o.lobes ?? 7;
  const c = o.size / 2;
  const pts: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const a = (Math.PI * 2 * i) / n;
    const rr = c * (0.72 + r() * 0.26);
    pts.push([c + Math.cos(a) * rr, c + Math.sin(a) * rr]);
  }
  const p = new Path();
  const mid = (a: Pt, b: Pt): Pt => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const m0 = mid(pts[n - 1], pts[0]);
  p.M(m0[0], m0[1]);
  for (let i = 0; i < n; i++) {
    const m = mid(pts[i], pts[(i + 1) % n]);
    p.Q(pts[i][0], pts[i][1], m[0], m[1]);
  }
  p.Z();
  return assemble([{ path: p, fill: o.color }], 0, { w: o.size, h: o.size });
}

/** Little leafy sprig for dividers. */
export function sprigDivider(o: { w: number; leaf: string; stroke: string; flower: Paint; flowerStroke: string; center: string }): OrnamentData {
  const b = bag();
  const h = 50;
  const cy = h / 2;
  const mid = o.w / 2;
  const specs: PartSpec[] = [];
  const line = new Path().M(10, cy).L(mid - 44, cy).M(mid + 44, cy).L(o.w - 10, cy);
  specs.push({ path: line, stroke: o.stroke, strokeWidth: 1.4 });
  [-1, 1].forEach((s) => {
    for (let i = 0; i < 3; i++) {
      leaf(b.leaves, [mid + s * (50 + i * 28), cy], rad(s > 0 ? -28 : 180 + 28), 24, 5);
      leaf(b.leaves, [mid + s * (50 + i * 28), cy], rad(s > 0 ? 28 : 180 - 28), 24, 5);
    }
  });
  specs.push({ path: b.leaves, fill: o.leaf, stroke: o.stroke, strokeWidth: 0.8 });
  addBeli(b, mid, cy, 22, 10);
  specs.push({ path: b.beli, fill: o.flower, stroke: o.flowerStroke, strokeWidth: 1.4 });
  specs.push({ path: b.centers, fill: o.center });
  return assemble(specs, 2);
}
