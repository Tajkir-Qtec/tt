import { assemble, leaf, Path, type OrnamentData, type PartSpec, type Pt } from "../design/path";

function lcg(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
}

const BARK = ["#3f2b22", "#4a3228", "#583b2e"];
const TINTS = ["#fffafb", "#fff1f4", "#fde6ec", "#f9d3de"];

const bez = (p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt => {
  const u = 1 - t;
  return [
    u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
    u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
  ];
};
const tan = (p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number) => {
  const a = bez(p0, p1, p2, p3, Math.max(0, t - 0.01));
  const b = bez(p0, p1, p2, p3, Math.min(1, t + 0.01));
  return Math.atan2(b[1] - a[1], b[0] - a[0]);
};

export interface BranchDef {
  pts: [Pt, Pt, Pt, Pt];
  width: number;
  /** +1: twigs prefer to droop downwards, -1: reach upwards, 0 none */
  droop?: number;
  twigs?: number;
}

interface Blossom {
  x: number;
  y: number;
  r: number;
  rot: number;
  squash: number;
  tint: string;
}

export interface SakuraOpts {
  seed: number;
  branches: BranchDef[];
  petals: number;
  /** rectangles where falling petals must not land */
  avoid?: [number, number, number, number][];
  petalScale?: number;
}

/** One five-petal blossom with notched tips, inner blush and stamens. */
function drawBlossom(specs: PartSpec[], rnd: () => number, b: Blossom) {
  const R = b.r;
  const cos = Math.cos(b.rot);
  const sin = Math.sin(b.rot);
  const tf = (px: number, py: number): Pt => {
    const sy = py * b.squash;
    return [b.x + px * cos - sy * sin, b.y + px * sin + sy * cos];
  };
  const petalAt = (path: Path, ang: number, k: number) => {
    const ca = Math.cos(ang);
    const sa = Math.sin(ang);
    const q = (x: number, y: number): Pt => {
      const px = x * k * R;
      const py = y * k * R;
      return tf(px * ca - py * sa, px * sa + py * ca);
    };
    const a = q(0, 0);
    const c1 = q(-0.64, -0.2);
    const c2 = q(-0.6, -0.98);
    const tl = q(-0.18, -1.0);
    const nt = q(0, -0.84);
    const tr = q(0.18, -1.0);
    const d1 = q(0.6, -0.98);
    const d2 = q(0.64, -0.2);
    path.M(a[0], a[1]).C(c1[0], c1[1], c2[0], c2[1], tl[0], tl[1]);
    path.Q(...q(-0.08, -0.98), nt[0], nt[1]);
    path.Q(...q(0.08, -0.98), tr[0], tr[1]);
    path.C(d1[0], d1[1], d2[0], d2[1], a[0], a[1]).Z();
  };
  const outer = new Path();
  const inner = new Path();
  const veins = new Path();
  for (let i = 0; i < 5; i++) {
    const ang = (i * 72 * Math.PI) / 180 + (rnd() - 0.5) * 0.12;
    petalAt(outer, ang, 1);
    petalAt(inner, ang, 0.42);
    const v0 = tf(Math.sin(ang) * R * 0.04, -Math.cos(ang) * R * 0.04);
    const v1 = tf(Math.sin(ang) * R * 0.78, -Math.cos(ang) * R * 0.78);
    veins.M(v0[0], v0[1]).L(v1[0], v1[1]);
  }
  specs.push({ path: outer, fill: b.tint, stroke: "#efb4c4", strokeWidth: 0.8, opacity: 0.98 });
  specs.push({ path: inner, fill: "#f2a0b6", opacity: 0.38 });
  specs.push({ path: veins, stroke: "#df8aa0", strokeWidth: 0.8, opacity: 0.55 });
  const stamens = new Path();
  const dots = new Path();
  const n = 9;
  for (let i = 0; i < n; i++) {
    const a = rnd() * Math.PI * 2;
    const l = R * (0.3 + rnd() * 0.22);
    const s = tf(0, 0);
    const e = tf(Math.cos(a) * l, Math.sin(a) * l);
    stamens.M(s[0], s[1]).L(e[0], e[1]);
    dots.circle(e[0], e[1], Math.max(1.1, R * 0.045));
  }
  const c = new Path();
  const ctr = tf(0, 0);
  c.circle(ctr[0], ctr[1], R * 0.1);
  specs.push({ path: stamens, stroke: "#c9496a", strokeWidth: 0.9, opacity: 0.85 });
  specs.push({ path: dots, fill: "#b83a5c", opacity: 0.9 });
  specs.push({ path: c, fill: "#d9567a" });
}

/** A loose falling petal. */
function drawPetal(specs: PartSpec[], x: number, y: number, size: number, rot: number, tint: string, opacity: number) {
  const cos = Math.cos(rot);
  const sin = Math.sin(rot);
  const q = (px: number, py: number): Pt => [x + px * cos - py * sin, y + px * sin + py * cos];
  const p = new Path();
  const a = q(0, 0);
  const c1 = q(-0.7 * size, -0.2 * size);
  const c2 = q(-0.6 * size, -1.0 * size);
  const tl = q(-0.18 * size, -1.0 * size);
  const nt = q(0, -0.84 * size);
  const tr = q(0.18 * size, -1.0 * size);
  const d1 = q(0.6 * size, -1.0 * size);
  const d2 = q(0.7 * size, -0.2 * size);
  p.M(a[0], a[1]).C(c1[0], c1[1], c2[0], c2[1], tl[0], tl[1]).L(nt[0], nt[1]).L(tr[0], tr[1]).C(d1[0], d1[1], d2[0], d2[1], a[0], a[1]).Z();
  specs.push({ path: p, fill: tint, stroke: "#eaa6b8", strokeWidth: 0.6, opacity });
}

/** Branch(es) with tapered bark, twigs, blossom clusters, buds and falling petals. */
export function sakuraScene(o: SakuraOpts): OrnamentData {
  const rnd = lcg(o.seed);
  const bark: PartSpec[] = [];
  const buds: PartSpec[] = [];
  const blossoms: Blossom[] = [];
  const pick = <T,>(a: T[]) => a[Math.floor(rnd() * a.length)];

  const cluster = (at: Pt, ang: number, big: boolean) => {
    const base = big ? 30 : 24;
    blossoms.push({ x: at[0], y: at[1], r: base + rnd() * 10, rot: rnd() * 6.28, squash: 0.8 + rnd() * 0.2, tint: pick(TINTS) });
    const extra = rnd() < 0.5 ? 1 : 2;
    for (let i = 0; i < extra; i++) {
      const a = ang + (rnd() - 0.5) * 2.4;
      const d = 24 + rnd() * 26;
      blossoms.push({
        x: at[0] + Math.cos(a) * d,
        y: at[1] + Math.sin(a) * d,
        r: 17 + rnd() * 12,
        rot: rnd() * 6.28,
        squash: 0.75 + rnd() * 0.25,
        tint: pick(TINTS),
      });
    }
    // buds
    for (let i = 0; i < 2; i++) {
      const a = ang + (rnd() - 0.5) * 3.2;
      const d = 36 + rnd() * 20;
      const bp = new Path();
      leaf(bp, [at[0] + Math.cos(a) * d, at[1] + Math.sin(a) * d], a, 14 + rnd() * 6, 4.5, true);
      buds.push({ path: bp, fill: "#ea8fa7", stroke: "#c75a7a", strokeWidth: 0.6, opacity: 0.95 });
    }
  };

  const grow = (p0: Pt, p1: Pt, p2: Pt, p3: Pt, w0: number, w1: number, depth: number, droop: number, twigs: number, color: string) => {
    const n = 26;
    for (let i = 0; i < n; i++) {
      const a = bez(p0, p1, p2, p3, i / n);
      const b = bez(p0, p1, p2, p3, (i + 1) / n);
      const p = new Path().M(a[0], a[1]).L(b[0], b[1]);
      const w = w0 + (w1 - w0) * ((i + 0.5) / n);
      bark.push({ path: p, stroke: color, strokeWidth: w, lineCap: "round" });
    }
    const len = Math.hypot(p3[0] - p0[0], p3[1] - p0[1]);
    if (depth > 0) {
      for (let k = 0; k < twigs; k++) {
        const t = 0.16 + (0.72 * (k + rnd() * 0.6)) / Math.max(1, twigs);
        const origin = bez(p0, p1, p2, p3, t);
        const th = tan(p0, p1, p2, p3, t);
        let side = k % 2 === 0 ? 1 : -1;
        const cand = th + side * (0.45 + rnd() * 0.55);
        const down = Math.sin(cand) > 0;
        if (droop !== 0 && rnd() < 0.7 && down !== droop > 0) side = -side;
        const ang = th + side * (0.45 + rnd() * 0.6) + (droop > 0 ? 0.12 : -0.12);
        const L = len * (0.28 + rnd() * 0.22) * (1 - t * 0.35);
        const bend = (rnd() - 0.5) * 0.9;
        const e: Pt = [origin[0] + Math.cos(ang) * L, origin[1] + Math.sin(ang) * L];
        const c1: Pt = [origin[0] + Math.cos(ang) * L * 0.35, origin[1] + Math.sin(ang) * L * 0.35];
        const c2: Pt = [origin[0] + Math.cos(ang + bend) * L * 0.75, origin[1] + Math.sin(ang + bend) * L * 0.75];
        const wt = Math.max(1.4, (w0 + (w1 - w0) * t) * 0.58);
        grow(origin, c1, c2, e, wt, Math.max(0.9, wt * 0.35), depth - 1, droop, depth > 1 ? 2 + Math.floor(rnd() * 2) : 0, color);
      }
    } else {
      // twig tip: blossom cluster; a couple of blossoms along the twig too
      const end = bez(p0, p1, p2, p3, 1);
      cluster(end, tan(p0, p1, p2, p3, 0.95), rnd() < 0.5);
      if (rnd() < 0.55) {
        const m = bez(p0, p1, p2, p3, 0.55);
        const a = tan(p0, p1, p2, p3, 0.55) + (rnd() < 0.5 ? 1.5 : -1.5);
        blossoms.push({ x: m[0] + Math.cos(a) * 14, y: m[1] + Math.sin(a) * 14, r: 18 + rnd() * 8, rot: rnd() * 6.28, squash: 0.8, tint: pick(TINTS) });
      }
    }
  };

  for (const b of o.branches) {
    grow(b.pts[0], b.pts[1], b.pts[2], b.pts[3], b.width, b.width * 0.4, 2, b.droop ?? 1, b.twigs ?? 5, pick(BARK));
    // main branch end cluster
    cluster(b.pts[3], tan(...b.pts, 0.95), true);
  }

  const specs: PartSpec[] = [...bark, ...buds];
  // far blossoms slightly translucent for depth, drawn first
  blossoms.forEach((b, i) => {
    const before = specs.length;
    drawBlossom(specs, rnd, b);
    if (i % 4 === 3) for (let k = before; k < specs.length; k++) specs[k] = { ...specs[k], opacity: (specs[k].opacity ?? 1) * 0.72 };
  });

  const avoid = o.avoid ?? [];
  let placed = 0;
  let guard = 0;
  const ps = o.petalScale ?? 1;
  while (placed < o.petals && guard++ < o.petals * 60) {
    const x = 30 + rnd() * 940;
    const y = 30 + rnd() * 1340;
    if (avoid.some(([a, b, c, d]) => x > a && x < c && y > b && y < d)) continue;
    const size = (9 + rnd() * 13) * ps;
    drawPetal(specs, x, y, size, rnd() * 6.28, pick(TINTS), 0.35 + rnd() * 0.55);
    placed++;
  }
  return assemble(specs, 0, { w: 1000, h: 1400 });
}
