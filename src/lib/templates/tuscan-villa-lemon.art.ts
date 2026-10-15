import { Path, leaf, type PartSpec, type Pt } from "../design/path";
import type { Layer, OrnamentLayer, Paint } from "../design/types";
import { S, linear, radial, lock } from "./kit";
import { place, rng } from "./summer-party.art";

export const C = {
  cream: "#f8efd9",
  plaster: "#ecd6a4",
  ochre: "#dfb675",
  terra: "#c25b34",
  terraD: "#923b1e",
  terraL: "#e08457",
  olive: "#6a7a32",
  oliveD: "#43521f",
  oliveL: "#9aa856",
  lemon: "#f5cf3a",
  lemonD: "#d9a31a",
  cobalt: "#24539b",
  cobaltD: "#163a74",
  ink: "#3a2a1c",
};

const LEMON: Paint = linear(135, [0, "#fdeb7c"], [0.55, "#f5cf3a"], [1, "#d89f16"]);

/** Ring of ceramic majolica tiles around a rectangle. */
export function tileBorder(x: number, y: number, w: number, h: number, t = 40): OrnamentLayer {
  const cols = Math.round(w / t);
  const rows = Math.round(h / t);
  const cells: Pt[] = [];
  for (let i = 0; i < cols; i++) {
    cells.push([x + i * t, y]);
    cells.push([x + i * t, y + (rows - 1) * t]);
  }
  for (let j = 1; j < rows - 1; j++) {
    cells.push([x, y + j * t]);
    cells.push([x + (cols - 1) * t, y + j * t]);
  }
  const sq = new Path();
  const inner = new Path();
  const flowers = new Path();
  const dots = new Path();
  const diamonds = new Path();
  cells.forEach(([cx, cy]) => {
    sq.M(cx, cy).L(cx + t, cy).L(cx + t, cy + t).L(cx, cy + t).Z();
    inner.M(cx + 4, cy + 4).L(cx + t - 4, cy + 4).L(cx + t - 4, cy + t - 4).L(cx + 4, cy + t - 4).Z();
    const mx = cx + t / 2;
    const my = cy + t / 2;
    const alt = (Math.round((cx - x) / t) + Math.round((cy - y) / t)) % 2 === 0;
    if (alt) {
      const r = t * 0.15;
      const d = t * 0.15;
      flowers.circle(mx - d, my, r).circle(mx + d, my, r).circle(mx, my - d, r).circle(mx, my + d, r);
      dots.circle(mx, my, t * 0.08);
    } else {
      const R = t * 0.3;
      diamonds.M(mx, my - R).L(mx + R, my).L(mx, my + R).L(mx - R, my).Z();
      dots.circle(mx, my, t * 0.07);
    }
  });
  return place(
    [
      { path: sq, fill: "#fbf4e2", stroke: C.cobaltD, strokeWidth: 2 },
      { path: inner, fill: null, stroke: C.cobalt, strokeWidth: 1.4, opacity: 0.8 },
      { path: diamonds, fill: C.terra },
      { path: flowers, fill: C.cobalt },
      { path: dots, fill: C.lemon },
    ],
    2,
  );
}

/** Tall Italian cypress. Returns specs. */
export function cypressSpecs(cx: number, baseY: number, h: number, w: number, dark = C.oliveD, light = C.olive): PartSpec[] {
  const full = new Path();
  full.M(cx, baseY).C(cx - w, baseY - h * 0.25, cx - w * 0.7, baseY - h * 0.8, cx, baseY - h).C(cx + w * 0.7, baseY - h * 0.8, cx + w, baseY - h * 0.25, cx, baseY).Z();
  const shade = new Path();
  shade.M(cx + w * 0.05, baseY - h).C(cx + w * 0.7, baseY - h * 0.8, cx + w, baseY - h * 0.25, cx, baseY).L(cx + w * 0.12, baseY - h * 0.5).Z();
  const veins = new Path();
  for (let i = 1; i < 7; i++) {
    const yy = baseY - (h * i) / 7.5;
    const ww = w * Math.sin((i / 7.5) * Math.PI * 0.95 + 0.25) * 0.75;
    veins.M(cx - ww * 0.6, yy + 6).Q(cx, yy - 6, cx + ww * 0.6, yy + 6);
  }
  const trunk = new Path();
  trunk.M(cx - 3, baseY - 2).L(cx + 3, baseY - 2).L(cx + 2, baseY + 12).L(cx - 2, baseY + 12).Z();
  return [
    { path: trunk, fill: "#4a3320" },
    { path: full, fill: light },
    { path: shade, fill: dark },
    { path: veins, fill: null, stroke: dark, strokeWidth: 1.6, opacity: 0.45 },
  ];
}

export function cypresses(list: [number, number, number, number][], dark?: string, light?: string): OrnamentLayer {
  const specs: PartSpec[] = [];
  for (const [cx, by, h, w] of list) specs.push(...cypressSpecs(cx, by, h, w, dark, light));
  return place(specs, 2);
}

export function lemonSpec(cx: number, cy: number, r: number, rot: number): PartSpec[] {
  const a = (rot * Math.PI) / 180;
  const co = Math.cos(a);
  const si = Math.sin(a);
  const P = (x: number, y: number): Pt => [cx + (x * co - y * si) * r, cy + (x * si + y * co) * r];
  const p = new Path();
  const c = (a1: Pt, a2: Pt, a3: Pt) => p.C(a1[0], a1[1], a2[0], a2[1], a3[0], a3[1]);
  p.M(...P(-1.34, 0));
  c(P(-1.08, -0.15), P(-0.95, -0.92), P(-0.1, -0.94));
  c(P(0.7, -0.96), P(1.02, -0.2), P(1.34, 0));
  c(P(1.02, 0.2), P(0.7, 0.96), P(-0.1, 0.94));
  c(P(-0.95, 0.92), P(-1.08, 0.15), P(-1.34, 0));
  p.Z();
  const hl = new Path();
  const q0 = P(-0.6, -0.55);
  const q1 = P(0, -0.8);
  const q2 = P(0.5, -0.5);
  hl.M(q0[0], q0[1]).Q(q1[0], q1[1], q2[0], q2[1]);
  return [
    { path: p, fill: LEMON, stroke: C.lemonD, strokeWidth: 1.5 },
    { path: hl, fill: null, stroke: "#fff8c4", strokeWidth: Math.max(2, r * 0.08), opacity: 0.8 },
  ];
}

/** A hanging lemon branch from (ox,oy) heading in direction angDeg (0 = right, 90 = down). */
export function lemonSprig(ox: number, oy: number, angDeg: number, len: number, seed: number, lemons = 3, leafScale = 1): OrnamentLayer {
  const rnd = rng(seed);
  const a = (angDeg * Math.PI) / 180;
  const dx = Math.cos(a);
  const dy = Math.sin(a);
  const nx = -dy;
  const ny = dx;
  const bend = len * 0.16;
  const pt = (t: number): Pt => [ox + dx * len * t + nx * bend * Math.sin(Math.PI * t), oy + dy * len * t + ny * bend * Math.sin(Math.PI * t)];
  const stem = new Path();
  stem.M(...pt(0));
  for (let i = 1; i <= 14; i++) stem.L(...pt(i / 14));
  const lA = new Path();
  const lB = new Path();
  const n = 9;
  for (let i = 1; i <= n; i++) {
    const t = i / (n + 0.5);
    const b = pt(t);
    const side = i % 2 ? 1 : -1;
    const ang = a + side * (0.85 + rnd() * 0.3);
    const ll = (62 + rnd() * 22) * leafScale * (1 - t * 0.25);
    leaf(i % 3 ? lA : lB, b, ang, ll, 17 * leafScale, false);
  }
  leaf(lA, pt(1), a, 70 * leafScale, 17 * leafScale);
  const specs: PartSpec[] = [
    { path: stem, fill: null, stroke: "#5a4122", strokeWidth: 5 },
    { path: lB, fill: C.oliveD },
    { path: lA, fill: C.olive, stroke: C.oliveD, strokeWidth: 1 },
  ];
  const stalks = new Path();
  const ts = [0.38, 0.62, 0.86].slice(0, lemons);
  const fruit: PartSpec[] = [];
  ts.forEach((t, i) => {
    const b = pt(t);
    const r = 34 + rnd() * 8;
    const hang = 46 + rnd() * 14;
    const lx = b[0] + (i - 1) * 6;
    const ly = b[1] + hang + r * 0.7;
    stalks.M(b[0], b[1]).L(lx, ly - r * 1.2);
    fruit.push(...lemonSpec(lx, ly, r, 90 + (rnd() - 0.5) * 30));
  });
  specs.push({ path: stalks, fill: null, stroke: "#5a4122", strokeWidth: 3.5 }, ...fruit);
  return place(specs, 3);
}

/** Smooth hill silhouette across [x0,x1] through control heights, closed to `bottom`. */
export function hill(x0: number, x1: number, bottom: number, ys: number[], fill: Paint, extra: Partial<PartSpec> = {}): PartSpec {
  const p = new Path();
  const n = ys.length;
  const xs = ys.map((_, i) => x0 + ((x1 - x0) * i) / (n - 1));
  p.M(x0, bottom).L(x0, ys[0]);
  for (let i = 1; i < n; i++) {
    const mx = (xs[i - 1] + xs[i]) / 2;
    p.C(mx, ys[i - 1], mx, ys[i], xs[i], ys[i]);
  }
  p.L(x1, bottom).Z();
  return { path: p, fill, ...extra };
}

/** Curved vineyard rows. */
export function vineRows(x0: number, x1: number, yA: number, yB: number, rows: number, color: string, op = 0.5): PartSpec {
  const p = new Path();
  for (let i = 0; i < rows; i++) {
    const t = i / (rows - 1);
    const y = yA + (yB - yA) * t * t;
    const amp = 6 + t * 22;
    p.M(x0, y).C(x0 + (x1 - x0) * 0.3, y - amp, x0 + (x1 - x0) * 0.65, y + amp, x1, y - amp * 0.4);
  }
  return { path: p, fill: null, stroke: color, strokeWidth: 3, opacity: op };
}

/** Terracotta-roofed villa with a tower. (cx, baseY) bottom centre. */
export function villa(cx: number, baseY: number, s = 1): OrnamentLayer {
  const X = (v: number) => cx + v * s;
  const Y = (v: number) => baseY + v * s;
  const specs: PartSpec[] = [];
  const rect = (x0: number, y0: number, x1: number, y1: number) => new Path().M(X(x0), Y(y0)).L(X(x1), Y(y0)).L(X(x1), Y(y1)).L(X(x0), Y(y1)).Z();
  specs.push({ path: rect(-150, -96, 70, 0), fill: linear(90, [0, "#f2dfae"], [1, "#e1bd7e"]) });
  specs.push({ path: rect(70, -190, 140, 0), fill: linear(90, [0, "#efd6a0"], [1, "#d9ae6c"]) });
  const roof = new Path();
  roof.M(X(-168), Y(-94)).L(X(-120), Y(-142)).L(X(52), Y(-142)).L(X(88), Y(-94)).Z();
  specs.push({ path: roof, fill: linear(90, [0, C.terraL], [1, C.terraD]) });
  const tiles = new Path();
  for (let i = 1; i < 4; i++) {
    const yy = -94 - i * 12;
    tiles.M(X(-168 + i * 12), Y(yy)).L(X(88 - i * 9), Y(yy));
  }
  specs.push({ path: tiles, fill: null, stroke: C.terraD, strokeWidth: 1.6 * s, opacity: 0.55 });
  const tr = new Path();
  tr.M(X(60), Y(-186)).L(X(105), Y(-246)).L(X(150), Y(-186)).Z();
  specs.push({ path: tr, fill: linear(90, [0, C.terraL], [1, C.terraD]) });
  const trs = new Path();
  trs.M(X(105), Y(-246)).L(X(150), Y(-186)).L(X(105), Y(-186)).Z();
  specs.push({ path: trs, fill: C.terraD, opacity: 0.45 });
  const win = new Path();
  const shutL = new Path();
  const shutR = new Path();
  const arch = (p: Path, x: number, y: number, w: number, h: number) => {
    p.M(X(x), Y(y)).L(X(x), Y(y - h + w / 2)).Q(X(x), Y(y - h), X(x + w / 2), Y(y - h)).Q(X(x + w), Y(y - h), X(x + w), Y(y - h + w / 2)).L(X(x + w), Y(y)).Z();
  };
  [-122, -78, -34].forEach((x) => {
    arch(win, x, -22, 26, 52);
    shutL.M(X(x - 11), Y(-22)).L(X(x - 11), Y(-70)).L(X(x - 1), Y(-70)).L(X(x - 1), Y(-22)).Z();
    shutR.M(X(x + 27), Y(-22)).L(X(x + 27), Y(-70)).L(X(x + 37), Y(-70)).L(X(x + 37), Y(-22)).Z();
  });
  arch(win, 94, -26, 30, 56);
  arch(win, 92, -118, 20, 40);
  arch(win, 118, -118, 20, 40);
  specs.push({ path: shutL, fill: C.olive }, { path: shutR, fill: C.olive }, { path: win, fill: "#4a3a2a" });
  const door = new Path();
  arch(door, 8, 0, 40, 70);
  specs.push({ path: door, fill: "#6b3d22", stroke: C.terraD, strokeWidth: 2 * s });
  return place(specs, 2);
}

/** Soft glowing sun disc. */
export function sunDisc(cx: number, cy: number, r: number): Layer[] {
  return [
    lock(S({ shape: "ellipse", x: cx - r * 2.6, y: cy - r * 2.6, width: r * 5.2, height: r * 5.2, fill: radial([0, "rgba(255,226,140,0.75)"], [1, "rgba(255,226,140,0)"]) })),
    lock(S({ shape: "ellipse", x: cx - r, y: cy - r, width: r * 2, height: r * 2, fill: linear(90, [0, "#fff2b0"], [1, "#f6b838"]) })),
  ];
}

/** Small decorative lemon on its own with leaves. */
export function lemonSolo(cx: number, cy: number, r: number, rot = -20): OrnamentLayer {
  const leafP = new Path();
  leaf(leafP, [cx - r * 0.4, cy - r * 0.8], -2.3, r * 1.6, r * 0.5);
  leaf(leafP, [cx - r * 0.4, cy - r * 0.8], -0.9, r * 1.6, r * 0.5);
  return place([{ path: leafP, fill: C.olive, stroke: C.oliveD, strokeWidth: 1 }, ...lemonSpec(cx, cy, r, rot)], 3);
}

/** Row of cypress trees between x0..x1. */
export function cypressRow(x0: number, x1: number, baseY: number, seed: number, minH = 110, maxH = 200): OrnamentLayer {
  const rnd = rng(seed);
  const list: [number, number, number, number][] = [];
  let x = x0 + 20;
  while (x < x1 - 20) {
    const h = minH + rnd() * (maxH - minH);
    list.push([x, baseY, h, 14 + h * 0.07]);
    x += 34 + rnd() * 26;
  }
  return cypresses(list);
}
