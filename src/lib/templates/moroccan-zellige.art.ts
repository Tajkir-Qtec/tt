import { assemble, Path, type OrnamentData, type PartSpec, type Pt } from "../design/path";
import type { Paint } from "../design/types";

export const COBALT = "#1f4a96";
export const TEAL = "#0e6f74";
export const BRASS = "#b58a3a";
export const BRASS_LT = "#d9b86a";
export const CREAM = "#f6efdf";
export const SAND = "#ecdfc0";

export const BRASS_FOIL: Paint = {
  kind: "linear",
  angle: 100,
  stops: [
    [0, "#8a6424"],
    [0.25, "#e6c97c"],
    [0.5, "#b58a3a"],
    [0.75, "#efd58e"],
    [1, "#94702a"],
  ],
};

const rad = (d: number) => (d * Math.PI) / 180;

export function starPts(cx: number, cy: number, n: number, R: number, r: number, rot = -90): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i < n * 2; i++) {
    const a = rad(rot + (i * 180) / n);
    const rr = i % 2 === 0 ? R : r;
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  return pts;
}

/** Ring of zellige tiles (2 tiles thick) around the whole page. */
export function zelligeFrame(W: number, H: number, c = 50, rows = 2): OrnamentData {
  const nx = Math.round(W / c);
  const ny = Math.round(H / c);
  const bg = new Path();
  const cob = new Path();
  const tea = new Path();
  const inner = new Path();
  const dots = new Path();
  const kiteC = new Path();
  const kiteT = new Path();
  const grid = new Path();
  const inBand = (i: number, j: number) => j < rows || j >= ny - rows || i < rows || i >= nx - rows;
  for (let j = 0; j < ny; j++) {
    for (let i = 0; i < nx; i++) {
      if (!inBand(i, j)) continue;
      const x = i * c;
      const y = j * c;
      const cx = x + c / 2;
      const cy = y + c / 2;
      const alt = (i + j) % 2 === 0;
      bg.poly([[x, y], [x + c, y], [x + c, y + c], [x, y + c]], true);
      (alt ? cob : tea).poly(starPts(cx, cy, 8, c * 0.47, c * 0.3), true);
      inner.poly(starPts(cx, cy, 8, c * 0.25, c * 0.14, -67.5), true);
      dots.circle(cx, cy, c * 0.045);
      if (i < nx - 1 && j < ny - 1 && inBand(i + 1, j + 1) && inBand(i + 1, j) && inBand(i, j + 1)) {
        const vx = x + c;
        const vy = y + c;
        const k = c * 0.17;
        (alt ? kiteT : kiteC).poly([[vx, vy - k], [vx + k, vy], [vx, vy + k], [vx - k, vy]], true);
      }
      grid.poly([[x, y], [x + c, y], [x + c, y + c], [x, y + c]], true);
    }
  }
  const specs: PartSpec[] = [
    { path: bg, fill: SAND, stroke: BRASS, strokeWidth: 0.7, opacity: 1 },
    { path: cob, fill: COBALT, stroke: BRASS_LT, strokeWidth: 0.9 },
    { path: tea, fill: TEAL, stroke: BRASS_LT, strokeWidth: 0.9 },
    { path: inner, fill: CREAM, stroke: BRASS, strokeWidth: 0.6 },
    { path: dots, fill: BRASS },
    { path: kiteC, fill: COBALT, stroke: BRASS_LT, strokeWidth: 0.7 },
    { path: kiteT, fill: TEAL, stroke: BRASS_LT, strokeWidth: 0.7 },
  ];
  // brass keylines at the inner and outer edge of the band
  const t = c * rows;
  specs.push({ path: new Path().poly([[t, t], [W - t, t], [W - t, H - t], [t, H - t]], true), stroke: BRASS, strokeWidth: 5, lineJoin: "miter" });
  specs.push({ path: new Path().poly([[t - 7, t - 7], [W - t + 7, t - 7], [W - t + 7, H - t + 7], [t - 7, H - t + 7]], true), stroke: BRASS_LT, strokeWidth: 1.2, lineJoin: "miter" });
  specs.push({ path: new Path().poly([[2, 2], [W - 2, 2], [W - 2, H - 2], [2, H - 2]], true), stroke: BRASS, strokeWidth: 4, lineJoin: "miter" });
  return assemble(specs, 0, { w: W, h: H });
}

/** Points of a pointed horseshoe arch offset inward by k. */
function horseshoePts(w: number, h: number, k: number): Pt[] {
  const a = w / 2;
  const R0 = 1.1 * a;
  const d0 = 0.04 * a;
  const cy = Math.sqrt(R0 * R0 - d0 * d0);
  const Rk = R0 - k;
  const cLx = a + d0;
  const alpha = Math.acos((cLx - k) / Rk);
  const beta = Math.acos(d0 / Rk);
  const left: Pt[] = [];
  const n = 48;
  const p0 = Math.PI - alpha;
  const p1 = Math.PI + beta;
  for (let i = 0; i <= n; i++) {
    const f = p0 + ((p1 - p0) * i) / n;
    left.push([cLx + Rk * Math.cos(f), cy + Rk * Math.sin(f)]);
  }
  const right: Pt[] = left
    .slice(0, -1)
    .reverse()
    .map(([x, y]) => [w - x, y] as Pt);
  return [[k, h - k], ...left, ...right, [w - k, h - k]];
}

export interface ArchLine {
  k: number;
  stroke: string;
  width: number;
  fill?: Paint | null;
  opacity?: number;
}

/** Moorish horseshoe arch window with nested keylines. */
export function horseshoeArch(w: number, h: number, lines: ArchLine[]): OrnamentData {
  const specs: PartSpec[] = lines.map((l) => ({
    path: new Path().poly(horseshoePts(w, h, l.k), true),
    stroke: l.stroke,
    strokeWidth: l.width,
    fill: l.fill ?? null,
    opacity: l.opacity,
    lineJoin: "round",
  }));
  return assemble(specs, 0, { w, h });
}

/** Layered eight-pointed khatam rosette. */
export function rosette(size: number): OrnamentData {
  const c = size / 2;
  const specs: PartSpec[] = [];
  specs.push({ path: new Path().poly(starPts(c, c, 8, c * 0.98, c * 0.66), true), fill: BRASS_FOIL, stroke: BRASS, strokeWidth: 1.2 });
  specs.push({ path: new Path().poly(starPts(c, c, 8, c * 0.88, c * 0.58), true), fill: COBALT, stroke: BRASS_LT, strokeWidth: 1 });
  specs.push({ path: new Path().poly(starPts(c, c, 8, c * 0.88, c * 0.58, -67.5), true), fill: TEAL, stroke: BRASS_LT, strokeWidth: 1, opacity: 0.95 });
  specs.push({ path: new Path().poly(starPts(c, c, 8, c * 0.56, c * 0.36), true), fill: CREAM, stroke: BRASS, strokeWidth: 1 });
  specs.push({ path: new Path().poly(starPts(c, c, 8, c * 0.4, c * 0.24, -67.5), true), fill: COBALT, stroke: BRASS_LT, strokeWidth: 0.8 });
  specs.push({ path: new Path().circle(c, c, c * 0.12), fill: BRASS_FOIL });
  return assemble(specs, 0, { w: size, h: size });
}

/** Divider: line, three small stars, line. */
export function zelligeDivider(w = 420): OrnamentData {
  const h = 44;
  const cy = h / 2;
  const cx = w / 2;
  const specs: PartSpec[] = [];
  specs.push({ path: new Path().M(0, cy).L(cx - 90, cy), stroke: BRASS, strokeWidth: 1.6 });
  specs.push({ path: new Path().M(cx + 90, cy).L(w, cy), stroke: BRASS, strokeWidth: 1.6 });
  const mid: [number, number, string][] = [[cx - 62, 11, TEAL], [cx, 19, COBALT], [cx + 62, 11, TEAL]];
  for (const [x, R, col] of mid) {
    specs.push({ path: new Path().poly(starPts(x, cy, 8, R, R * 0.62), true), fill: col, stroke: BRASS, strokeWidth: 1 });
    specs.push({ path: new Path().circle(x, cy, R * 0.22), fill: CREAM });
  }
  return assemble(specs, 0, { w, h });
}

/** Soft interlaced star lattice for backgrounds (thin brass linework). */
export function starLattice(w: number, h: number, c = 80): OrnamentData {
  const p = new Path();
  const nx = Math.ceil(w / c) + 1;
  const ny = Math.ceil(h / c) + 1;
  for (let j = 0; j < ny; j++) {
    for (let i = 0; i < nx; i++) {
      const cx = i * c;
      const cy = j * c;
      p.poly(starPts(cx, cy, 8, c * 0.5, c * 0.33), true);
    }
  }
  p.include([0, 0], [w, h]);
  return assemble([{ path: p, stroke: BRASS, strokeWidth: 0.9, opacity: 0.16 }], 0, { w, h });
}
