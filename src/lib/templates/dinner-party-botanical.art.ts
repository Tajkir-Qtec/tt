import { leaf, Path, rad, type OrnamentData, type PartSpec, type Pt } from "../design/path";
import { scene } from "./eid-iftar-lanterns.art";

export const BRASS = "#c9a24a";
export const BRASS_L = "#e8cd8a";

const bez = (p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt => {
  const u = 1 - t;
  return [
    u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
    u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
  ];
};
const bezTan = (p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): number => {
  const u = 1 - t;
  return Math.atan2(
    3 * u * u * (p1[1] - p0[1]) + 6 * u * t * (p2[1] - p1[1]) + 3 * t * t * (p3[1] - p2[1]),
    3 * u * u * (p1[0] - p0[0]) + 6 * u * t * (p2[0] - p1[0]) + 3 * t * t * (p3[0] - p2[0]),
  );
};

interface SprayOpts {
  origin: Pt;
  angle: number; // degrees
  length: number;
  bend: number; // degrees of curvature
  leafLen: number;
  leafW: number;
  n: number;
  round?: boolean;
  alternate?: boolean;
  color: string;
  fill?: string;
  sw?: number;
  subs?: number;
  berries?: boolean;
  depth?: number;
}

/** Fine line-art botanical branch (outlined leaves with veins, thin stem, optional offshoots and berries). */
export function sprayParts(o: SprayOpts, acc?: { stems: Path; leaves: Path; veins: Path; berries: Path }): PartSpec[] {
  const a = rad(o.angle);
  const b = rad(o.bend);
  const [x0, y0] = o.origin;
  const L = o.length;
  const p0: Pt = [x0, y0];
  const p1: Pt = [x0 + Math.cos(a) * L * 0.33, y0 + Math.sin(a) * L * 0.33];
  const p2: Pt = [x0 + Math.cos(a + b * 0.6) * L * 0.68, y0 + Math.sin(a + b * 0.6) * L * 0.68];
  const p3: Pt = [x0 + Math.cos(a + b) * L, y0 + Math.sin(a + b) * L];
  const top = !acc;
  const A = acc ?? { stems: new Path(), leaves: new Path(), veins: new Path(), berries: new Path() };
  for (let i = 0; i <= 36; i++) {
    const [x, y] = bez(p0, p1, p2, p3, i / 36);
    if (i === 0) A.stems.M(x, y);
    else A.stems.L(x, y);
  }
  const drawLeaf = (base: Pt, ang: number, len: number, w: number) => {
    leaf(A.leaves, base, ang, len, w, o.round);
    A.veins.M(base[0], base[1]).L(base[0] + Math.cos(ang) * len * 0.82, base[1] + Math.sin(ang) * len * 0.82);
  };
  for (let i = 0; i < o.n; i++) {
    const t = 0.14 + (0.8 * i) / Math.max(1, o.n - 1);
    const sc = 1 - 0.5 * t;
    const base = bez(p0, p1, p2, p3, t);
    const ang = bezTan(p0, p1, p2, p3, t);
    const spread = rad(o.round ? 52 : 40);
    if (o.alternate) drawLeaf(base, ang + spread * (i % 2 ? 1 : -1), o.leafLen * sc, o.leafW * sc);
    else {
      drawLeaf(base, ang + spread, o.leafLen * sc, o.leafW * sc);
      drawLeaf(base, ang - spread, o.leafLen * sc, o.leafW * sc);
    }
  }
  drawLeaf(p3, bezTan(p0, p1, p2, p3, 1), o.leafLen * 0.55, o.leafW * 0.55);
  const depth = o.depth ?? 0;
  const subs = o.subs ?? 0;
  for (let k = 0; k < subs; k++) {
    const t = 0.3 + (0.45 * k) / Math.max(1, subs);
    const side = k % 2 ? 1 : -1;
    const base = bez(p0, p1, p2, p3, t);
    const ang = (bezTan(p0, p1, p2, p3, t) * 180) / Math.PI + side * 42;
    sprayParts(
      { ...o, origin: base, angle: ang, length: L * (0.46 - 0.04 * k), bend: -side * 24, leafLen: o.leafLen * 0.82, leafW: o.leafW * 0.82, n: Math.max(3, o.n - 3), subs: 0, depth: depth + 1 },
      A,
    );
    if (o.berries) {
      const [bx, by] = bez(p0, p1, p2, p3, t + 0.05);
      const ba = bezTan(p0, p1, p2, p3, t) - side * 1.2;
      A.stems.M(bx, by).L(bx + Math.cos(ba) * 30, by + Math.sin(ba) * 30);
      A.berries.circle(bx + Math.cos(ba) * 34, by + Math.sin(ba) * 34, 4);
    }
  }
  if (!top) return [];
  const sw = o.sw ?? 1.8;
  return [
    { path: A.stems, stroke: o.color, strokeWidth: sw },
    { path: A.leaves, stroke: o.color, strokeWidth: sw * 0.75, fill: o.fill ?? null },
    { path: A.veins, stroke: o.color, strokeWidth: sw * 0.45, opacity: 0.8 },
    { path: A.berries, fill: o.color },
  ];
}

export type Corner = "tl" | "tr" | "bl" | "br";

/** A lush corner cluster of three botanical branches growing in from the page corner. */
export function cornerCluster(c: Corner, scale = 1, color = BRASS, fill = "rgba(201,162,74,0.10)"): PartSpec[] {
  const flipX = c === "tr" || c === "br";
  const flipY = c === "bl" || c === "br";
  const ox = flipX ? 1000 - 14 : 14;
  const oy = flipY ? 1400 - 14 : 14;
  const ang = (deg: number) => (flipX ? 180 - deg : deg) * (flipY ? -1 : 1);
  const bend = (b: number) => (flipX !== flipY ? -b : b);
  const s = scale;
  return [
    ...sprayParts({ origin: [ox, oy], angle: ang(46), length: 500 * s, bend: bend(22), leafLen: 66 * s, leafW: 17 * s, n: 8, color, fill, subs: 2 }),
    ...sprayParts({ origin: [ox, oy], angle: ang(10), length: 380 * s, bend: bend(-20), leafLen: 48 * s, leafW: 13 * s, n: 8, alternate: true, color, fill, berries: true, subs: 2 }),
    ...sprayParts({ origin: [ox, oy], angle: ang(80), length: 330 * s, bend: bend(-16), leafLen: 54 * s, leafW: 22 * s, n: 6, round: true, alternate: true, color, fill }),
  ];
}

/** A horizontal garland sprig, centred at (cx, cy). */
export function sprigRow(cx: number, cy: number, half: number, color = BRASS, fill = "rgba(201,162,74,0.10)"): PartSpec[] {
  return [
    ...sprayParts({ origin: [cx - 8, cy], angle: 180, length: half, bend: -10, leafLen: 38, leafW: 11, n: 7, alternate: true, color, fill, sw: 1.5 }),
    ...sprayParts({ origin: [cx + 8, cy], angle: 0, length: half, bend: 10, leafLen: 38, leafW: 11, n: 7, alternate: true, color, fill, sw: 1.5 }),
  ];
}

export function botanicalScene(specs: PartSpec[]): OrnamentData {
  return scene(specs);
}

/* ---------------- wine glasses & candlesticks ------------------------ */

type TF = (x: number, y: number) => Pt;
const makeTF = (px: number, py: number, deg: number, s: number): TF => {
  const r = rad(deg);
  const c = Math.cos(r);
  const sn = Math.sin(r);
  return (x, y) => [px + (x * c - y * sn) * s, py + (x * sn + y * c) * s];
};
class TP {
  constructor(
    public p: Path,
    private tf: TF,
  ) {}
  M(x: number, y: number) {
    this.p.M(...this.tf(x, y));
    return this;
  }
  L(x: number, y: number) {
    this.p.L(...this.tf(x, y));
    return this;
  }
  C(a: number, b: number, c: number, d: number, e: number, f: number) {
    this.p.C(...this.tf(a, b), ...this.tf(c, d), ...this.tf(e, f));
    return this;
  }
  Q(a: number, b: number, c: number, d: number) {
    this.p.Q(...this.tf(a, b), ...this.tf(c, d));
    return this;
  }
  Z() {
    this.p.Z();
    return this;
  }
}

/** Wine glass, origin at the centre of its foot, rotated `deg` and scaled `s`. */
export function wineGlassParts(px: number, py: number, deg: number, s: number, color = BRASS, wine = "rgba(201,162,74,0.38)"): PartSpec[] {
  const tf = makeTF(px, py, deg, s);
  const out: PartSpec[] = [];
  const foot = new TP(new Path(), tf).M(-52, 0).C(-30, -9, 30, -9, 52, 0).C(30, 5, -30, 5, -52, 0);
  out.push({ path: foot.p, stroke: color, strokeWidth: 2.4 });
  const stem = new TP(new Path(), tf).M(0, -6).L(0, -140);
  out.push({ path: stem.p, stroke: color, strokeWidth: 2.4 });
  const bowl = new TP(new Path(), tf).M(-58, -300).C(-68, -230, -48, -160, 0, -148).C(48, -160, 68, -230, 58, -300);
  out.push({ path: bowl.p, stroke: color, strokeWidth: 2.4 });
  const rim = new TP(new Path(), tf).M(-58, -300).C(-30, -290, 30, -290, 58, -300).C(30, -310, -30, -310, -58, -300);
  out.push({ path: rim.p, stroke: color, strokeWidth: 2 });
  const w = new TP(new Path(), tf).M(-65, -236).C(-62, -190, -40, -158, 0, -148).C(40, -158, 62, -190, 65, -236).Q(0, -224, -65, -236).Z();
  out.push({ path: w.p, fill: wine, stroke: null });
  const hi = new TP(new Path(), tf).M(-44, -284).C(-50, -250, -42, -206, -22, -180);
  out.push({ path: hi.p, stroke: color, strokeWidth: 1.4, opacity: 0.7 });
  const bub = new Path();
  [[-12, -190, 3], [10, -204, 2.4], [-2, -220, 2], [20, -180, 2]].forEach(([x, y, r]) => bub.circle(...tf(x, y), r * s));
  out.push({ path: bub, fill: BRASS_L, opacity: 0.8 });
  return out;
}

/** Two glasses clinking, tops meeting at (cx, topY + ...). */
export function glassPair(cx: number, baseY: number, s = 1): OrnamentData {
  const spread = 160 * s;
  return scene([
    ...wineGlassParts(cx - spread, baseY, 20, s),
    ...wineGlassParts(cx + spread, baseY, -20, s),
    ...burst(cx, baseY - 292 * s * Math.cos(rad(20)) - 20 * s, s),
  ]);
}

function burst(cx: number, cy: number, s: number): PartSpec[] {
  const p = new Path();
  for (const [dx, dy, l] of [[0, -1, 34], [-0.8, -0.6, 26], [0.8, -0.6, 26], [-1, 0.1, 18], [1, 0.1, 18]] as [number, number, number][]) {
    p.M(cx + dx * 14 * s, cy + dy * 14 * s).L(cx + dx * (14 + l) * s, cy + dy * (14 + l) * s);
  }
  return [{ path: p, stroke: BRASS_L, strokeWidth: 2 }];
}

/** Candlestick with candle, origin at base centre. Returns parts and the flame centre. */
export function candleParts(px: number, py: number, s: number, candleH: number, color = BRASS): { parts: PartSpec[]; flame: Pt } {
  const tf = makeTF(px, py, 0, s);
  const out: PartSpec[] = [];
  const fillSoft = "rgba(201,162,74,0.14)";
  const base = new TP(new Path(), tf).M(-44, 0).L(44, 0).C(44, -10, 32, -14, 22, -18).L(-22, -18).C(-32, -14, -44, -10, -44, 0).Z();
  out.push({ path: base.p, stroke: color, strokeWidth: 2.2, fill: fillSoft });
  const beads = new Path();
  const ell = (cx: number, cy: number, rx: number, ry: number) => {
    const a = tf(cx - rx, cy);
    const b = tf(cx + rx, cy);
    beads.M(...a).A(rx * s, ry * s, 0, 1, 0, ...b).A(rx * s, ry * s, 0, 1, 0, ...a).Z();
    beads.include(tf(cx, cy - ry), tf(cx, cy + ry));
  };
  ell(0, -34, 17, 13);
  ell(0, -80, 11, 9);
  out.push({ path: beads, stroke: color, strokeWidth: 2, fill: fillSoft });
  const necks = new TP(new Path(), tf).M(-5, -46).L(-5, -71).M(5, -46).L(5, -71).M(-4, -89).L(-4, -108).M(4, -89).L(4, -108);
  out.push({ path: necks.p, stroke: color, strokeWidth: 2 });
  const cup = new TP(new Path(), tf).M(-28, -136).C(-26, -118, -12, -112, -6, -106).L(6, -106).C(12, -112, 26, -118, 28, -136).Z().M(-32, -136).L(32, -136);
  out.push({ path: cup.p, stroke: color, strokeWidth: 2.2, fill: fillSoft });
  const top = -136 - candleH;
  const candle = new TP(new Path(), tf).M(-12, -136).L(-12, top).L(12, top).L(12, -136);
  out.push({ path: candle.p, stroke: "#efe3c0", strokeWidth: 2, fill: "rgba(239,227,192,0.16)" });
  const drip = new TP(new Path(), tf).M(-12, top + 8).C(-4, top + 14, -2, top + 24, -8, top + 34).M(6, top + 4).C(10, top + 14, 12, top + 20, 12, top + 26);
  out.push({ path: drip.p, stroke: "#efe3c0", strokeWidth: 1.4, opacity: 0.8 });
  const wick = new TP(new Path(), tf).M(0, top).L(0, top - 8);
  out.push({ path: wick.p, stroke: "#efe3c0", strokeWidth: 1.6 });
  const flame = new TP(new Path(), tf).M(0, top - 6).C(-12, top - 18, -8, top - 40, 0, top - 62).C(8, top - 40, 12, top - 18, 0, top - 6).Z();
  out.push({ path: flame.p, fill: { kind: "radial", stops: [[0, "#fff8d8"], [0.5, "#ffd472"], [1, "#e89a2a"]] }, stroke: null });
  return { parts: out, flame: tf(0, top - 32) };
}

export function candleScene(items: { cx: number; baseY: number; s: number; h: number }[]): { art: OrnamentData; flames: Pt[] } {
  const parts: PartSpec[] = [];
  const flames: Pt[] = [];
  for (const it of items) {
    const r = candleParts(it.cx, it.baseY, it.s, it.h);
    parts.push(...r.parts);
    flames.push(r.flame);
  }
  return { art: scene(parts), flames };
}
