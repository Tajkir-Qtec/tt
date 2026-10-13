import { assemble, Path, type OrnamentData, type Pt } from "../design/path";
import type { Layer } from "../design/types";
import { centerRotate } from "../design/layers";
import { lock, O } from "./kit";

/** Deterministic pseudo-random generator (no runtime randomness). */
export function lcg(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
}

const dir = (a: number, r: number): Pt => [Math.cos(a) * r, Math.sin(a) * r];
const deg = (d: number) => (d * Math.PI) / 180;

/** Branch spec: position along the arm (0..1), branch length (fraction of R), angle off the arm (deg). */
type Br = [t: number, len: number, ang: number];

const VARIANTS: { branches: Br[]; ring: number; twig: boolean; tip: boolean }[] = [
  // dendrite: three tiers of feathered branches
  { branches: [[0.34, 0.3, 58], [0.56, 0.27, 56], [0.78, 0.2, 54]], ring: 0.17, twig: true, tip: true },
  // stellar plate: broad hexagonal with short side-plates
  { branches: [[0.5, 0.34, 60], [0.72, 0.18, 60]], ring: 0.3, twig: false, tip: false },
  // fern: many small branches
  { branches: [[0.25, 0.2, 50], [0.42, 0.24, 52], [0.6, 0.22, 54], [0.78, 0.15, 56]], ring: 0.12, twig: true, tip: true },
];

/** A six-fold symmetric snowflake with branching arms, centred in its viewBox. */
export function snowflake(o: { R: number; color: string; sw?: number; variant?: 0 | 1 | 2 }): OrnamentData {
  const { R, color } = o;
  const sw = o.sw ?? Math.max(1.1, R * 0.028);
  const v = VARIANTS[o.variant ?? 0];
  const lines = new Path();
  const dots = new Path();
  for (let k = 0; k < 6; k++) {
    const base = deg(k * 60 - 90);
    const tip = dir(base, R);
    lines.M(0, 0).L(tip[0], tip[1]);
    for (const [t, len, ang] of v.branches) {
      const origin = dir(base, R * t);
      for (const s of [-1, 1]) {
        const e = dir(base + s * deg(ang), R * len);
        const end: Pt = [origin[0] + e[0], origin[1] + e[1]];
        lines.M(origin[0], origin[1]).L(end[0], end[1]);
        if (v.twig) {
          const m: Pt = [origin[0] + e[0] * 0.55, origin[1] + e[1] * 0.55];
          const tw = dir(base + s * deg(8), R * len * 0.38);
          lines.M(m[0], m[1]).L(m[0] + tw[0], m[1] + tw[1]);
        }
      }
    }
    if (v.tip) {
      for (const s of [-1, 1]) {
        const e = dir(base + Math.PI + s * deg(38), R * 0.13);
        lines.M(tip[0], tip[1]).L(tip[0] + e[0], tip[1] + e[1]);
      }
    }
    const rp = dir(base + deg(30), R * v.ring * 1.15);
    const rq = dir(base - deg(30), R * v.ring * 1.15);
    lines.M(rp[0], rp[1]).L(rq[0], rq[1]);
    const dp = dir(base, R * 1.045);
    dots.circle(dp[0], dp[1], Math.max(1.2, R * 0.03));
  }
  lines.include([-R, -R], [R, R]);
  const center = new Path().circle(0, 0, Math.max(1.6, R * 0.035));
  return assemble(
    [
      { path: lines, stroke: color, strokeWidth: sw, lineCap: "round", lineJoin: "round" },
      { path: dots, fill: color },
      { path: center, fill: color },
    ],
    sw + 2,
  );
}

export type Rect = [x0: number, y0: number, x1: number, y1: number];

/** Scattered small/medium snowflakes at fixed seeded positions, avoiding rectangles. */
export function flurry(seed: number, count: number, avoid: Rect[], colors: string[], sizes: [number, number] = [14, 46]): Layer[] {
  const rnd = lcg(seed);
  const out: Layer[] = [];
  let guard = 0;
  while (out.length < count && guard++ < count * 60) {
    const x = 30 + rnd() * 940;
    const y = 30 + rnd() * 1340;
    const R = sizes[0] + Math.pow(rnd(), 1.6) * (sizes[1] - sizes[0]);
    if (avoid.some(([a, b, c, d]) => x + R > a && x - R < c && y + R > b && y - R < d)) continue;
    const variant = Math.floor(rnd() * 3) as 0 | 1 | 2;
    const color = colors[Math.floor(rnd() * colors.length)];
    const opacity = 0.25 + rnd() * 0.55;
    const data = snowflake({ R, color, variant });
    const layer = O(data, { x: x - data.vbW / 2, y: y - data.vbH / 2, opacity });
    out.push(lock(centerRotate(layer, x, y, Math.round(rnd() * 60))));
  }
  return out;
}
