import { assemble, leaf, Path, type OrnamentData, type PartSpec, type Pt } from "../design/path";

function lcg(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
}

export const GREENS = {
  abyss: "#0a2e22",
  deep: "#0f4030",
  forest: "#17583f",
  jungle: "#21714d",
  fern: "#34905f",
  mint: "#6cb98a",
};

export type Green = keyof typeof GREENS;

export interface FrondSpec {
  at: Pt;
  /** direction in degrees (0 = right, 90 = down) */
  angle: number;
  length: number;
  /** total bend of the midrib in degrees (positive curls clockwise on screen) */
  bend: number;
  color: string;
  color2?: string;
  opacity?: number;
  leaflets?: number;
  leafletLen?: number;
}

export interface MonsteraSpec {
  at: Pt;
  angle: number;
  size: number;
  color: string;
  vein: string;
  opacity?: number;
  stem?: number;
}

const rad = (d: number) => (d * Math.PI) / 180;

/** A palm frond: curved midrib with many tapered, drooping leaflets. */
export function frond(specs: PartSpec[], f: FrondSpec) {
  const n = 60;
  const pts: Pt[] = [];
  let [x, y] = f.at;
  let h = rad(f.angle);
  const step = f.length / n;
  const heads: number[] = [];
  for (let i = 0; i <= n; i++) {
    pts.push([x, y]);
    heads.push(h);
    const s = i / n;
    h += rad(f.bend) * (1 / n) * (0.5 + s);
    x += Math.cos(h) * step;
    y += Math.sin(h) * step;
  }
  const Lmax = f.leafletLen ?? f.length * 0.34;
  const count = f.leaflets ?? 34;
  const left = new Path();
  const right = new Path();
  for (let i = 0; i < count; i++) {
    const s = 0.06 + (0.93 * i) / (count - 1);
    const idx = Math.min(n, Math.round(s * n));
    const [bx, by] = pts[idx];
    const th = heads[idx];
    const env = 0.22 + 0.78 * Math.sin(Math.PI * Math.pow(s, 0.72));
    const len = Lmax * env * (1 - 0.25 * s);
    const spread = rad(66 - 26 * s);
    // gravity: pull leaflet directions toward straight down (angle PI/2)
    const droop = (a: number) => {
      const dx = Math.cos(a) + 0.0;
      const dy = Math.sin(a) + 0.32;
      return Math.atan2(dy, dx);
    };
    leaf(left, [bx, by], droop(th - spread), len, len * 0.085);
    leaf(right, [bx, by], droop(th + spread), len, len * 0.085);
  }
  // terminal leaflet
  const tip = pts[n];
  leaf(left, tip, heads[n], Lmax * 0.45, Lmax * 0.04);
  const mid = new Path().M(pts[0][0], pts[0][1]);
  for (let i = 1; i <= n; i += 2) mid.L(pts[i][0], pts[i][1]);
  mid.include(...pts);
  const op = f.opacity ?? 1;
  specs.push({ path: left, fill: f.color, opacity: op });
  specs.push({ path: right, fill: f.color2 ?? f.color, opacity: op * 0.92 });
  specs.push({ path: mid, stroke: f.color2 ?? "#7fc79a", strokeWidth: Math.max(2, f.length * 0.006), opacity: op * 0.7 });
}

/** A monstera leaf: heart-shaped blade made of rounded lobes separated by slits, with veins. */
export function monstera(specs: PartSpec[], m: MonsteraSpec) {
  const a0 = rad(m.angle);
  const ux = Math.cos(a0);
  const uy = Math.sin(a0);
  const S = m.size;
  const stemLen = m.stem ?? S * 0.42;
  const base: Pt = [m.at[0], m.at[1]];
  const att: Pt = [base[0] + ux * stemLen, base[1] + uy * stemLen];
  const op = m.opacity ?? 1;
  // stem
  const stem = new Path().M(base[0], base[1]).Q(base[0] + ux * stemLen * 0.5 - uy * 14, base[1] + uy * stemLen * 0.5 + ux * 14, att[0], att[1]);
  specs.push({ path: stem, stroke: m.color, strokeWidth: Math.max(4, S * 0.022), opacity: op });

  const body = new Path();
  const veins = new Path();
  const at = (t: number, s: number): Pt => [att[0] + ux * S * t - uy * S * s, att[1] + uy * S * t + ux * S * s];
  const lobes = 6;
  for (const side of [-1, 1]) {
    for (let k = 0; k < lobes; k++) {
      const t = 0.06 + (0.74 * k) / (lobes - 1);
      const env = 0.55 + 0.45 * Math.sin(Math.PI * Math.min(1, 0.25 + t * 0.95));
      const ang = a0 + side * rad(88 - 40 * t);
      const len = S * 0.5 * env * (1 - 0.1 * t);
      const o = at(t, 0);
      leaf(body, o, ang, len, len * 0.24, true);
      const tipx = o[0] + Math.cos(ang) * len * 0.88;
      const tipy = o[1] + Math.sin(ang) * len * 0.88;
      veins.M(o[0], o[1]).Q((o[0] + tipx) / 2 + uy * side * 3, (o[1] + tipy) / 2 - ux * side * 3, tipx, tipy);
    }
    // heart base lobe sweeping back around the stem
    const bo = at(0.02, 0);
    const ang = a0 + side * rad(150);
    leaf(body, bo, ang, S * 0.4, S * 0.17, true);
    veins.M(bo[0], bo[1]).L(bo[0] + Math.cos(ang) * S * 0.28, bo[1] + Math.sin(ang) * S * 0.28);
  }
  // core + tip lobe
  leaf(body, at(0.02, 0), a0, S * 0.98, S * 0.2, true);
  const mid = new Path().M(att[0], att[1]).L(at(0.95, 0)[0], at(0.95, 0)[1]);
  const holes = new Path();
  for (const side of [-1, 1]) for (const t of [0.3, 0.55]) {
    const c = at(t, side * 0.1);
    leaf(holes, c, a0 + side * rad(80), S * 0.09, S * 0.025, true);
  }
  specs.push({ path: body, fill: m.color, opacity: op });
  specs.push({ path: holes, fill: GREENS.abyss, opacity: op * 0.5 });
  specs.push({ path: veins, stroke: m.vein, strokeWidth: Math.max(1.4, S * 0.008), opacity: op * 0.55 });
  specs.push({ path: mid, stroke: m.vein, strokeWidth: Math.max(2, S * 0.014), opacity: op * 0.7 });
}

export interface JungleOpts {
  seed: number;
  /** corner clusters: each is a list of builders applied in order (back to front) */
  build: (add: { frond: (f: FrondSpec) => void; monstera: (m: MonsteraSpec) => void; rnd: () => number }) => void;
}

/** Whole-page foliage ornament (1000 x 1400, page coordinates). */
export function jungle(o: JungleOpts): OrnamentData {
  const specs: PartSpec[] = [];
  const rnd = lcg(o.seed);
  o.build({ frond: (f) => frond(specs, f), monstera: (m) => monstera(specs, m), rnd });
  return assemble(specs, 0, { w: 1000, h: 1400 });
}
