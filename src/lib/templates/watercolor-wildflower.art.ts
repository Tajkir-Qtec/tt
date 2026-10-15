import { assemble, leaf, Path, petal, type OrnamentData, type PartSpec } from "../design/path";

function lcg(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
}

const GREENS = ["#8fb08a", "#a9c7a0", "#7aa088", "#b9d1ab", "#97b79c"];
const PINKS = ["#f2b5c4", "#f6c9d0", "#e99bb2", "#f9d9dc"];
const LILACS = ["#c3b2e2", "#d6c9ec", "#b09ad6"];
const CREAMS = ["#fffaf0", "#fdf1dc", "#ffffff"];
const BUTTER = ["#f8e29b", "#f4d27a"];
const CORAL = ["#f4a58f", "#f2b8a0", "#ee9078"];
const SKY = ["#a9cbe6", "#bcd8ee"];

const pick = <T,>(r: () => number, a: T[]) => a[Math.floor(r() * a.length)];

function daisy(specs: PartSpec[], r: () => number, cx: number, cy: number, size: number, cols: string[], centre: string) {
  const n = 9 + Math.floor(r() * 4);
  const rot = r() * 6.28;
  // soft bleed behind
  specs.push({ path: new Path().circle(cx, cy, size * 1.05), fill: pick(r, cols), opacity: 0.16 });
  for (let layer = 0; layer < 2; layer++) {
    for (let i = 0; i < n; i++) {
      const a = rot + (i / n) * 6.283 + layer * (3.14 / n);
      const p = new Path();
      petal(p, cx, cy, a, size * 0.18, size * (layer ? 0.82 : 1), size * (layer ? 0.15 : 0.2), false);
      specs.push({ path: p, fill: pick(r, cols), opacity: layer ? 0.55 : 0.5 });
    }
  }
  specs.push({ path: new Path().circle(cx, cy, size * 0.2), fill: centre, opacity: 0.92 });
  specs.push({ path: new Path().circle(cx + size * 0.04, cy - size * 0.03, size * 0.09), fill: "#e0a43c", opacity: 0.8 });
}

function cosmos(specs: PartSpec[], r: () => number, cx: number, cy: number, size: number, cols: string[]) {
  const n = 7 + Math.floor(r() * 2);
  const rot = r() * 6.28;
  specs.push({ path: new Path().circle(cx, cy, size * 1.1), fill: cols[0], opacity: 0.15 });
  for (let i = 0; i < n; i++) {
    const a = rot + (i / n) * 6.283;
    const p = new Path();
    petal(p, cx, cy, a, size * 0.12, size, size * 0.3, false);
    specs.push({ path: p, fill: pick(r, cols), opacity: 0.5 });
    const q = new Path();
    petal(q, cx, cy, a + 0.08, size * 0.12, size * 0.72, size * 0.2, false);
    specs.push({ path: q, fill: cols[cols.length - 1], opacity: 0.32 });
  }
  specs.push({ path: new Path().circle(cx, cy, size * 0.14), fill: "#e9b44c", opacity: 0.95 });
}

function poppy(specs: PartSpec[], r: () => number, cx: number, cy: number, size: number, cols: string[]) {
  const rot = r() * 6.28;
  specs.push({ path: new Path().circle(cx, cy, size * 1.1), fill: cols[0], opacity: 0.16 });
  for (let i = 0; i < 5; i++) {
    const a = rot + (i / 5) * 6.283;
    const p = new Path();
    petal(p, cx, cy, a, size * 0.05, size, size * 0.52, false);
    specs.push({ path: p, fill: pick(r, cols), opacity: 0.46 });
  }
  specs.push({ path: new Path().circle(cx, cy, size * 0.2), fill: "#5a4466", opacity: 0.8 });
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * 6.283;
    specs.push({ path: new Path().circle(cx + Math.cos(a) * size * 0.3, cy + Math.sin(a) * size * 0.3, size * 0.035), fill: "#4a3556", opacity: 0.8 });
  }
}

function lavender(specs: PartSpec[], r: () => number, bx: number, by: number, tx: number, ty: number, cols: string[]) {
  const len = Math.hypot(tx - bx, ty - by);
  const n = Math.max(7, Math.floor(len / 13));
  const ang = Math.atan2(ty - by, tx - bx);
  for (let i = 0; i < n; i++) {
    const t = 0.35 + (i / n) * 0.65;
    const px = bx + (tx - bx) * t;
    const py = by + (ty - by) * t;
    const s = 8 * (1 - (i / n) * 0.45) + 3;
    for (const side of [-1, 1]) {
      const p = new Path();
      const a = ang + side * 0.8;
      leaf(p, [px, py], a, s * 2.1, s * 0.55, true);
      specs.push({ path: p, fill: pick(r, cols), opacity: 0.62 });
    }
  }
  const p = new Path();
  leaf(p, [tx, ty], ang, 16, 4, true);
  specs.push({ path: p, fill: cols[0], opacity: 0.7 });
}

function baby(specs: PartSpec[], r: () => number, cx: number, cy: number, size: number) {
  for (let b = 0; b < 5; b++) {
    const a = -1.57 + (b - 2) * 0.55;
    const ex = cx + Math.cos(a) * size;
    const ey = cy + Math.sin(a) * size;
    specs.push({ path: new Path().M(cx, cy).Q((cx + ex) / 2 + 6, (cy + ey) / 2, ex, ey), stroke: "#9bb895", strokeWidth: 1.1, opacity: 0.7 });
    for (let k = 0; k < 3; k++) {
      const bx = ex + (r() - 0.5) * 14;
      const by = ey + (r() - 0.5) * 14;
      specs.push({ path: new Path().circle(bx, by, 3.2 + r() * 2.4), fill: "#ffffff", stroke: "#e6dcc8", strokeWidth: 0.7, opacity: 0.95 });
    }
  }
}

export interface MeadowOpts {
  seed: number;
  w: number;
  h: number;
  count: number;
  /** extra height towards the sides (0..1), keeps the centre low for text */
  edgeLift?: number;
  base?: number;
  spread?: [number, number];
}

/** A cluster of watercolor wildflower stems growing up from the bottom edge. */
export function meadow(o: MeadowOpts): OrnamentData {
  const r = lcg(o.seed);
  const specs: PartSpec[] = [];
  const lift = o.edgeLift ?? 0.6;
  const [x0, x1] = o.spread ?? [-10, o.w + 10];
  const stems: { x: number; y: number; kind: number; sz: number }[] = [];

  // back-to-front: draw foliage first
  for (let i = 0; i < o.count; i++) {
    const bx = x0 + (x1 - x0) * ((i + r() * 0.8) / o.count);
    const e = Math.abs(bx - o.w / 2) / (o.w / 2);
    const top = o.h - ((o.base ?? 130) + r() * 150 + e * lift * o.h * 0.5);
    const tx = bx + (r() - 0.5) * 80 + (o.w / 2 - bx) * -0.05;
    const ty = Math.max(24, top);
    const stem = new Path().M(bx, o.h + 10).C(bx + (r() - 0.5) * 60, o.h * 0.75, tx + (r() - 0.5) * 50, (o.h + ty) / 2, tx, ty);
    specs.push({ path: stem, stroke: pick(r, GREENS), strokeWidth: 2 + r() * 1.4, opacity: 0.78 });
    // leaves along the stem
    const nl = 3 + Math.floor((o.h - ty) / 70);
    for (let k = 0; k < nl; k++) {
      const t = 0.15 + (k / nl) * 0.7;
      const px = bx + (tx - bx) * t;
      const py = o.h + 10 + (ty - o.h - 10) * t;
      const side = k % 2 ? 1 : -1;
      const p = new Path();
      leaf(p, [px, py], -1.57 + side * (0.7 + r() * 0.5), 34 + r() * 36, 7 + r() * 6, false);
      specs.push({ path: p, fill: pick(r, GREENS), opacity: 0.5 });
    }
    stems.push({ x: tx, y: ty, kind: Math.floor(r() * 9), sz: 26 + r() * 20 });
    if (r() < 0.18) {
      // grass blade
      const gb = new Path().M(bx + 8, o.h + 10).Q(bx + 30, o.h - 90, bx + 20 + r() * 40, o.h - 150 - r() * 60);
      specs.push({ path: gb, stroke: pick(r, GREENS), strokeWidth: 1.6, opacity: 0.7 });
    }
  }
  for (const s of stems) {
    switch (s.kind) {
      case 0:
      case 1:
        daisy(specs, r, s.x, s.y, s.sz, pick(r, [CREAMS, PINKS]), pick(r, BUTTER));
        break;
      case 2:
      case 3:
        cosmos(specs, r, s.x, s.y, s.sz * 0.95, pick(r, [PINKS, LILACS]));
        break;
      case 4:
        poppy(specs, r, s.x, s.y, s.sz * 0.95, CORAL);
        break;
      case 5:
      case 6:
        lavender(specs, r, s.x - 6, s.y + 90, s.x, s.y - 20, LILACS);
        break;
      case 7:
        baby(specs, r, s.x, s.y + 20, s.sz * 1.2);
        break;
      default:
        daisy(specs, r, s.x, s.y, s.sz * 0.85, SKY, "#f6e7a6");
    }
  }
  return assemble(specs, 0, { w: o.w, h: o.h });
}

/** Tiny scatter of petals / flecks across a page area, for atmosphere. */
export function flecks(seed: number, w: number, h: number, n = 40): OrnamentData {
  const r = lcg(seed);
  const specs: PartSpec[] = [];
  const cols = [...PINKS, ...LILACS, ...BUTTER, "#ffffff"];
  for (let i = 0; i < n; i++) {
    const p = new Path();
    petal(p, r() * w, r() * h, r() * 6.28, 0, 9 + r() * 12, 4 + r() * 3, true);
    specs.push({ path: p, fill: pick(r, cols), opacity: 0.35 + r() * 0.3 });
  }
  specs.push({ path: new Path().M(0, 0).L(1, 1), stroke: null, strokeWidth: 0 });
  return assemble(specs, 0, { w, h });
}
