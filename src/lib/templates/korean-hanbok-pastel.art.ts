import { Path, petal, type PartSpec, type Pt } from "../design/path";
import { archPath } from "../design/ornaments";
import type { Layer, OrnamentLayer, Paint } from "../design/types";
import { linear } from "./kit";
import { ellipsePath, place, rng } from "./summer-party.art";

export const K = {
  cream: "#fbf6ee",
  creamD: "#f3ead9",
  pink: "#f4b9c4",
  rose: "#d97a8e",
  mint: "#bfe3d1",
  butter: "#f7e3a6",
  lavender: "#cfc3ea",
  sky: "#bcd9ee",
  brown: "#6b4a45",
  brownL: "#8f6a60",
  coral: "#df5d58",
  coralD: "#a93a3a",
  coralL: "#f4a093",
  gold: "#c9a24a",
  plum: "#54395a",
  ink: "#3d3250",
};

export const PASTELS = [K.pink, K.butter, K.mint, K.lavender, K.sky];

/** Chaikin-smoothed polyline. */
function smooth(pts: Pt[], iters = 3): Pt[] {
  let p = pts;
  for (let k = 0; k < iters; k++) {
    const n: Pt[] = [p[0]];
    for (let i = 0; i < p.length - 1; i++) {
      const a = p[i];
      const b = p[i + 1];
      n.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]);
    }
    n.push(p[p.length - 1]);
    p = n;
  }
  return p;
}

function taperedBranch(pts: Pt[], w0: number, w1: number, color: string, hi: string): PartSpec[] {
  const sm = smooth(pts);
  const specs: PartSpec[] = [];
  const n = sm.length - 1;
  const groups = 7;
  for (let g = 0; g < groups; g++) {
    const a = Math.floor((g * n) / groups);
    const b = Math.floor(((g + 1) * n) / groups);
    const w = w0 + ((w1 - w0) * (g + 0.5)) / groups;
    const p = new Path();
    p.M(...sm[a]);
    for (let i = a + 1; i <= b; i++) p.L(...sm[i]);
    specs.push({ path: p, fill: null, stroke: color, strokeWidth: w });
    const q = new Path();
    q.M(sm[a][0] - 0.6, sm[a][1] - w * 0.18);
    for (let i = a + 1; i <= b; i++) q.L(sm[i][0] - 0.6, sm[i][1] - w * 0.18);
    specs.push({ path: q, fill: null, stroke: hi, strokeWidth: Math.max(1, w * 0.22), opacity: 0.55 });
  }
  return specs;
}

/** Plum blossom (maehwa): five rounded petals. */
export function blossomSpecs(cx: number, cy: number, R: number, rot = 0, tint = "#fff4f6", edge = "#e79fb0"): PartSpec[] {
  const petals = new Path();
  for (let i = 0; i < 5; i++) {
    const a = rot + (i / 5) * Math.PI * 2 - Math.PI / 2;
    petals.circle(cx + Math.cos(a) * R * 0.58, cy + Math.sin(a) * R * 0.58, R * 0.5);
  }
  const stamens = new Path();
  const tips = new Path();
  for (let i = 0; i < 9; i++) {
    const a = rot + (i / 9) * Math.PI * 2;
    const ex = cx + Math.cos(a) * R * 0.46;
    const ey = cy + Math.sin(a) * R * 0.46;
    stamens.M(cx, cy).L(ex, ey);
    tips.circle(ex, ey, R * 0.05);
  }
  const center = new Path().circle(cx, cy, R * 0.1);
  return [
    { path: petals, fill: tint, stroke: edge, strokeWidth: Math.max(1.2, R * 0.05) },
    { path: stamens, fill: null, stroke: "#d76a86", strokeWidth: Math.max(1, R * 0.03), opacity: 0.85 },
    { path: tips, fill: "#c8546f" },
    { path: center, fill: "#e8b84a" },
  ];
}

/** Branch with blossoms and buds. `branches` are polylines; `flowers` [x,y,R,rot]. */
export function plumBranch(branches: Pt[][], flowers: [number, number, number, number][], buds: [number, number, number][]): OrnamentLayer[] {
  const wood: PartSpec[] = [];
  branches.forEach((b, i) => wood.push(...taperedBranch(b, i === 0 ? 11 : 6, i === 0 ? 5 : 2.5, K.brown, K.brownL)));
  const budP = new Path();
  buds.forEach(([x, y, r]) => budP.circle(x, y, r));
  const budSpec: PartSpec = { path: budP, fill: "#e98ea6", stroke: "#c8546f", strokeWidth: 1.2 };
  const fl: PartSpec[] = [];
  flowers.forEach(([x, y, R, rot]) => fl.push(...blossomSpecs(x, y, R, rot)));
  return [place(wood, 3), place([budSpec], 3), place(fl, 3)];
}

/** Maedeup (Korean decorative knot) with a tassel, hanging from (cx, 0). Knot centre at (cx, ky). */
export function maedeup(cx: number, ky: number, s = 1, color = K.coral, dark = K.coralD, light = K.coralL): OrnamentLayer[] {
  const out: PartSpec[] = [];
  const cord = new Path().M(cx, -20).L(cx, ky - 60 * s);
  out.push({ path: cord, fill: null, stroke: dark, strokeWidth: 7 * s });
  out.push({ path: new Path().M(cx - 1, -20).L(cx - 1, ky - 60 * s), fill: null, stroke: light, strokeWidth: 2.4 * s, opacity: 0.8 });
  // top loop
  const topLoop = ellipsePath(cx, ky - 56 * s, 18 * s, 12 * s);
  out.push({ path: topLoop, fill: null, stroke: dark, strokeWidth: 7 * s });
  // woven petals of the main knot
  [0, 60, 120].forEach((rot) => {
    const e = ellipsePath(cx, ky, 56 * s, 22 * s, rot - 30);
    out.push({ path: e, fill: null, stroke: dark, strokeWidth: 12 * s });
  });
  [0, 60, 120].forEach((rot) => {
    const e = ellipsePath(cx, ky, 56 * s, 22 * s, rot - 30);
    out.push({ path: e, fill: null, stroke: color, strokeWidth: 8 * s });
  });
  [0, 60, 120].forEach((rot) => {
    const e = ellipsePath(cx, ky, 56 * s, 22 * s, rot - 30);
    out.push({ path: e, fill: null, stroke: light, strokeWidth: 2 * s, opacity: 0.75 });
  });
  const hub = new Path().circle(cx, ky, 11 * s);
  out.push({ path: hub, fill: K.gold, stroke: "#8a6a22", strokeWidth: 2 * s });
  // lower small knot
  const ly = ky + 78 * s;
  out.push({ path: new Path().M(cx, ky + 40 * s).L(cx, ly - 14 * s), fill: null, stroke: dark, strokeWidth: 7 * s });
  [-45, 45].forEach((rot) => {
    out.push({ path: ellipsePath(cx, ly, 26 * s, 12 * s, rot), fill: null, stroke: dark, strokeWidth: 10 * s });
  });
  [-45, 45].forEach((rot) => {
    out.push({ path: ellipsePath(cx, ly, 26 * s, 12 * s, rot), fill: null, stroke: color, strokeWidth: 6 * s });
  });
  // tassel
  const top = ly + 20 * s;
  const len = 150 * s;
  const strands = new Path();
  const strandsL = new Path();
  for (let i = -9; i <= 9; i++) {
    const x0 = cx + i * 2.2 * s;
    const x1 = cx + i * 4.4 * s;
    (i % 2 ? strandsL : strands).M(x0, top + 22 * s).Q(x0 + i * 0.6 * s, top + len * 0.6, x1, top + len);
  }
  out.push({ path: strands, fill: null, stroke: color, strokeWidth: 3.2 * s });
  out.push({ path: strandsL, fill: null, stroke: light, strokeWidth: 2.4 * s });
  const cap = new Path().M(cx - 14 * s, top).L(cx + 14 * s, top).L(cx + 17 * s, top + 24 * s).L(cx - 17 * s, top + 24 * s).Z();
  out.push({ path: cap, fill: K.gold, stroke: "#8a6a22", strokeWidth: 1.5 * s });
  const band = new Path().M(cx - 16 * s, top + 8 * s).L(cx + 16 * s, top + 8 * s);
  out.push({ path: band, fill: null, stroke: "#f3dc9a", strokeWidth: 2.5 * s });
  const tie = new Path().M(cx - 17 * s, top + 26 * s).L(cx + 17 * s, top + 26 * s);
  out.push({ path: tie, fill: null, stroke: dark, strokeWidth: 5 * s });
  return [place(out, 3)];
}

/** A skyline of pastel arches standing on the bottom edge, with inner outlines. */
export function archRow(heights: number[], baseY = 1400, gap = 6, colors = PASTELS, x0 = 0, x1 = 1000): OrnamentLayer {
  const n = heights.length;
  const w = (x1 - x0 - gap * (n - 1)) / n;
  const specs: PartSpec[] = [];
  heights.forEach((h, i) => {
    const x = x0 + i * (w + gap);
    specs.push({ path: archPath(x, baseY - h, w, h + 40), fill: colors[i % colors.length] });
  });
  heights.forEach((h, i) => {
    const x = x0 + i * (w + gap);
    specs.push({ path: archPath(x + 14, baseY - h + 14, w - 28, h + 26), fill: null, stroke: "#ffffff", strokeWidth: 2.2, opacity: 0.8 });
  });
  return place(specs, 1);
}

/** Small decorative blossoms scattered in a region. */
export function blossomScatter(seed: number, area: [number, number, number, number], n: number, R = [12, 20], skip?: (x: number, y: number) => boolean): OrnamentLayer {
  const rnd = rng(seed);
  const specs: PartSpec[] = [];
  for (let i = 0; i < n; i++) {
    const x = area[0] + rnd() * (area[2] - area[0]);
    const y = area[1] + rnd() * (area[3] - area[1]);
    if (skip?.(x, y)) continue;
    specs.push(...blossomSpecs(x, y, R[0] + rnd() * (R[1] - R[0]), rnd() * 6, "#fff4f6", "#efb0bf"));
  }
  return place(specs, 2);
}

/** Single falling petals. */
export function falling(seed: number, area: [number, number, number, number], n: number, skip?: (x: number, y: number) => boolean): OrnamentLayer {
  const rnd = rng(seed);
  const p = new Path();
  for (let i = 0; i < n; i++) {
    const x = area[0] + rnd() * (area[2] - area[0]);
    const y = area[1] + rnd() * (area[3] - area[1]);
    if (skip?.(x, y)) continue;
    petal(p, x, y, rnd() * 6.28, 0, 14 + rnd() * 8, 6, false);
  }
  return place([{ path: p, fill: "#f6c9d3", opacity: 0.9 }], 2);
}

/** Fine hanji paper fibres. */
export function hanjiFibers(seed: number, n: number, color = "#e5d8bf"): OrnamentLayer {
  const rnd = rng(seed);
  const p = new Path();
  for (let i = 0; i < n; i++) {
    const x = rnd() * 1000;
    const y = rnd() * 1400;
    const a = rnd() * Math.PI;
    const l = 12 + rnd() * 30;
    p.M(x, y).Q(x + Math.cos(a + 0.6) * l * 0.5, y + Math.sin(a + 0.6) * l * 0.5, x + Math.cos(a) * l, y + Math.sin(a) * l);
  }
  return place([{ path: p, fill: null, stroke: color, strokeWidth: 1.1, opacity: 0.7 }], 2);
}

export const creamBg: Paint = linear(90, [0, "#fdf9f2"], [1, "#f6eddc"]);
export type { Layer };
