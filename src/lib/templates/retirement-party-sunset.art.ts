import { Path, type PartSpec, type Pt } from "../design/path";
import { GOLD, linear, radial } from "./kit";

export const SKY = linear(90, [0, "#0f1b40"], [0.42, "#2c2a68"], [0.6, "#7b3b71"], [0.72, "#e0714b"], [0.8, "#ffbf5f"], [1, "#ffd98a"]);
export const SKY_DARK = linear(90, [0, "#0f1b40"], [0.55, "#232662"], [0.78, "#6d3770"], [0.9, "#d96a4e"], [1, "#ffb85c"]);

/** Eight-point compass rose in page coordinates. */
export function compass(cx: number, cy: number, R: number, stroke = "#f0cf84"): PartSpec[] {
  const out: PartSpec[] = [];
  const ring = new Path();
  ring.circle(cx, cy, R);
  const ring2 = new Path();
  ring2.circle(cx, cy, R * 0.8);
  out.push({ path: ring, stroke, strokeWidth: 3 });
  out.push({ path: ring2, stroke, strokeWidth: 1.5, opacity: 0.8 });
  const ticks = new Path();
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * Math.PI * 2;
    const r0 = R * (i % 6 === 0 ? 0.8 : 0.9);
    ticks.M(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0).L(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
  }
  out.push({ path: ticks, stroke, strokeWidth: 1.6, opacity: 0.9 });
  const star = (len: number, hw: number, rot: number): Path => {
    const p = new Path();
    for (let i = 0; i < 4; i++) {
      const a = rot + (i * Math.PI) / 2;
      const tip: Pt = [cx + Math.cos(a) * len, cy + Math.sin(a) * len];
      const l: Pt = [cx + Math.cos(a - Math.PI / 4) * hw, cy + Math.sin(a - Math.PI / 4) * hw];
      const r: Pt = [cx + Math.cos(a + Math.PI / 4) * hw, cy + Math.sin(a + Math.PI / 4) * hw];
      p.poly([[cx, cy], l, tip, r], true);
    }
    return p;
  };
  out.push({ path: star(R * 0.62, R * 0.13, Math.PI / 4), fill: "#c8963e", opacity: 0.85 });
  out.push({ path: star(R * 0.98 * 0.86, R * 0.14, -Math.PI / 2), fill: GOLD, stroke: "rgba(60,30,0,0.4)", strokeWidth: 1.2 });
  const half = new Path();
  for (let i = 0; i < 4; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 2;
    const tip: Pt = [cx + Math.cos(a) * R * 0.84, cy + Math.sin(a) * R * 0.84];
    const r: Pt = [cx + Math.cos(a + Math.PI / 4) * R * 0.14, cy + Math.sin(a + Math.PI / 4) * R * 0.14];
    half.poly([[cx, cy], tip, r], true);
  }
  out.push({ path: half, fill: "rgba(60,30,0,0.35)" });
  const c = new Path();
  c.circle(cx, cy, R * 0.06);
  out.push({ path: c, fill: "#fff2c8" });
  return out;
}

/** The setting sun: glowing disc with halo. */
export function sunDisc(cx: number, cy: number, R: number): PartSpec[] {
  const out: PartSpec[] = [];
  for (const [k, op] of [[2.1, 0.12], [1.6, 0.18], [1.25, 0.28]] as [number, number][]) {
    const p = new Path();
    p.circle(cx, cy, R * k);
    out.push({ path: p, fill: "#ffd27a", opacity: op });
  }
  const d = new Path();
  d.circle(cx, cy, R);
  out.push({ path: d, fill: radial([0, "#fffbe0"], [0.55, "#ffe08a"], [1, "#ffb347"]) });
  return out;
}

/** A rolling hill silhouette ending at the page bottom. */
export function hills(baseY: number, amp: number, phase: number, fill: string | ReturnType<typeof linear>, trees = 0): PartSpec[] {
  const p = new Path();
  const N = 24;
  const ys: number[] = [];
  for (let i = 0; i <= N; i++) {
    const x = (i / N) * 1000;
    const y = baseY - amp * (0.55 * Math.sin(i * 0.5 + phase) + 0.45 * Math.sin(i * 0.23 + phase * 1.7));
    ys.push(y);
    if (i === 0) p.M(x, y);
    else p.L(x, y);
  }
  p.L(1000, 1400).L(0, 1400).Z();
  const out: PartSpec[] = [{ path: p, fill }];
  if (trees) {
    const t = new Path();
    for (let k = 0; k < trees; k++) {
      const i = 1 + ((k * 7 + Math.floor(phase * 3)) % (N - 1));
      const x = (i / N) * 1000;
      const y = ys[i] + 6;
      const h = 54 + ((k * 13) % 30);
      t.poly([[x, y - h], [x - h * 0.22, y - h * 0.4], [x - h * 0.13, y - h * 0.4], [x - h * 0.3, y], [x + h * 0.3, y], [x + h * 0.13, y - h * 0.4], [x + h * 0.22, y - h * 0.4]], true);
    }
    out.push({ path: t, fill: typeof fill === "string" ? fill : "#171232" });
  }
  return out;
}

/** A road that winds from the bottom edge toward the horizon at (500, hy). */
export function road(hy: number, bottom = 1400): PartSpec[] {
  const L: Pt[] = [];
  const R: Pt[] = [];
  const C: Pt[] = [];
  const N = 40;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const y = hy + (bottom - hy) * Math.pow(t, 1.5);
    const w = 3 + 150 * Math.pow(t, 1.45);
    const cx = 500 + 120 * Math.sin(t * 4.1 + 0.4) * Math.pow(t, 0.9) - 40 * t;
    L.push([cx - w, y]);
    R.push([cx + w, y]);
    C.push([cx, y]);
  }
  const body = new Path();
  body.poly([...L, ...R.slice().reverse()], true);
  const e1 = new Path().poly(L);
  const e2 = new Path().poly(R);
  const dash = new Path();
  for (let i = 3; i < N; i += 3) {
    const a = C[i];
    const b = C[Math.min(N, i + 1)];
    dash.M(a[0], a[1]).L(b[0], b[1]);
  }
  return [
    { path: body, fill: linear(90, [0, "#f1a85a"], [0.3, "#4a3466"], [1, "#1c1638"]) },
    { path: e1, stroke: "#f0cf84", strokeWidth: 3, opacity: 0.8 },
    { path: e2, stroke: "#f0cf84", strokeWidth: 3, opacity: 0.8 },
    { path: dash, stroke: "#ffe7a8", strokeWidth: 7, lineCap: "butt", opacity: 0.85 },
  ];
}

export function birds(seed: number, n: number, box: [number, number, number, number], color = "#fbe2b4"): PartSpec {
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const p = new Path();
  for (let i = 0; i < n; i++) {
    const x = box[0] + rnd() * (box[2] - box[0]);
    const y = box[1] + rnd() * (box[3] - box[1]);
    const w = 14 + rnd() * 16;
    p.M(x - w, y - w * 0.2).Q(x - w * 0.4, y - w * 0.6, x, y).Q(x + w * 0.4, y - w * 0.6, x + w, y - w * 0.2);
  }
  return { path: p, stroke: color, strokeWidth: 3, opacity: 0.85 };
}

export function stars(seed: number, n: number, box: [number, number, number, number]): PartSpec[] {
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const a = new Path();
  const b = new Path();
  for (let i = 0; i < n; i++) {
    const x = box[0] + rnd() * (box[2] - box[0]);
    const y = box[1] + rnd() * (box[3] - box[1]);
    if (i % 5 === 0) {
      const r = 7 + rnd() * 5;
      b.M(x, y - r).L(x, y + r).M(x - r, y).L(x + r, y);
    } else a.circle(x, y, 1.3 + rnd() * 1.6);
  }
  return [
    { path: a, fill: "#ffffff", opacity: 0.8 },
    { path: b, stroke: "#fff2c8", strokeWidth: 1.6, opacity: 0.8 },
  ];
}
