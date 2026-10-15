import { assemble, Path, petal, rad, type OrnamentData, type PartSpec } from "../design/path";
import type { Paint } from "../design/types";

/* Original saree-border art: kalka (mango) motifs, zari bands and silk weave. */

const gl = (p: Paint): string => (typeof p === "string" ? p : "#d8b25c");
type Tr = (lx: number, ly: number) => [number, number];

const mk = (cx: number, cy: number, s: number, rotDeg: number, flip: boolean): Tr => {
  const c = Math.cos(rad(rotDeg));
  const sn = Math.sin(rad(rotDeg));
  return (lx, ly) => {
    const x = flip ? -lx : lx;
    return [cx + s * (x * c - ly * sn), cy + s * (x * sn + ly * c)];
  };
};

/** Add a kalka (mango / paisley) outline to a path. Local unit shape: bulb at the bottom, tip curling up and right. */
export function addKalka(p: Path, cx: number, cy: number, s: number, rot = 0, flip = false, inset = 1) {
  const t = mk(cx, cy, s * inset, rot, flip);
  const pt = (a: number, b: number) => t(a, b);
  const m = (a: number, b: number) => p.M(...pt(a, b));
  const c = (a: number, b: number, c2: number, d: number, e: number, f: number) => p.C(...pt(a, b), ...pt(c2, d), ...pt(e, f));
  m(0.54, -1.14);
  c(0.2, -1.14, -0.44, -0.8, -0.44, -0.3);
  c(-0.44, 0.0, -0.24, 0.1, 0, 0.1);
  c(0.28, 0.1, 0.46, -0.1, 0.46, -0.34);
  c(0.46, -0.56, 0.28, -0.7, 0.26, -0.86);
  c(0.25, -0.98, 0.38, -1.08, 0.54, -1.14);
  p.Z();
}

/** Layered embossed kalka: gold body, ground-coloured inner, gold core, dots. */
function kalkaParts(specs: PartSpec[], cx: number, cy: number, s: number, rot: number, flip: boolean, gold: Paint, ground: string, line: string) {
  const a = new Path();
  addKalka(a, cx, cy, s, rot, flip);
  specs.push({ path: a, fill: gold, stroke: line, strokeWidth: Math.max(0.8, s * 0.02) });
  const b = new Path();
  addKalka(b, cx, cy - s * 0.02, s, rot, flip, 0.7);
  specs.push({ path: b, fill: ground });
  const c = new Path();
  addKalka(c, cx, cy - s * 0.03, s, rot, flip, 0.5);
  specs.push({ path: c, fill: gold });
  const d = new Path();
  addKalka(d, cx, cy - s * 0.04, s, rot, flip, 0.28);
  specs.push({ path: d, fill: ground });
  const t = mk(cx, cy, s, rot, flip);
  const dots = new Path();
  [[-0.3, -0.5], [-0.24, -0.72], [0.28, -0.45], [0.0, 0.0]].forEach(([x, y]) => {
    const [px, py] = t(x * 0.9, y * 0.95 - 0.03);
    dots.circle(px, py, Math.max(0.9, s * 0.028));
  });
  specs.push({ path: dots, fill: ground, opacity: 0.0 });
}

/** A single large kalka motif. */
export function kalkaMotif(o: { gold: Paint; ground: string; line: string; size?: number }): OrnamentData {
  const S = o.size ?? 300;
  const specs: PartSpec[] = [];
  kalkaParts(specs, S * 0.5, S * 1.1, S, 0, false, o.gold, o.ground, o.line);
  // seed dots inside the ring
  const dots = new Path();
  const t = mk(S * 0.5, S * 1.1, S, 0, false);
  for (let i = 0; i < 5; i++) {
    const [x, y] = t(-0.34 + i * 0.05, -0.55 - i * 0.1 + (i % 2) * 0.02);
    dots.circle(x, y, S * 0.014);
  }
  specs.push({ path: dots, fill: o.gold });
  return assemble(specs, 2);
}

/** Round rosette of kalkas radiating from a lotus centre. */
export function kalkaRosette(o: { gold: Paint; ground: string; line: string; size: number; n?: number }): OrnamentData {
  const R = o.size / 2;
  const n = o.n ?? 12;
  const specs: PartSpec[] = [];
  const ring = new Path();
  ring.circle(R, R, R * 0.98);
  specs.push({ path: ring, fill: o.ground, stroke: gl(o.gold), strokeWidth: 0 });
  const ring2 = new Path().circle(R, R, R * 0.98);
  specs.push({ path: ring2, stroke: "#d8b25c", strokeWidth: 2.2 });
  const ring3 = new Path().circle(R, R, R * 0.9);
  specs.push({ path: ring3, stroke: "#d8b25c", strokeWidth: 0.9, opacity: 0.8 });
  for (let i = 0; i < n; i++) {
    const a = (360 / n) * i;
    const cx = R + Math.sin(rad(a)) * R * 0.3;
    const cy = R - Math.cos(rad(a)) * R * 0.3;
    kalkaParts(specs, cx, cy, R * 0.62, a, i % 2 === 0, o.gold, o.ground, o.line);
  }
  const petals = new Path();
  for (let i = 0; i < 8; i++) petal(petals, R, R, rad(-90 + i * 45), 0, R * 0.3, R * 0.075);
  specs.push({ path: petals, fill: o.ground, stroke: gl(o.gold), strokeWidth: 0 });
  specs.push({ path: petals, fill: o.gold, opacity: 0.95 });
  const core = new Path().circle(R, R, R * 0.07);
  specs.push({ path: core, fill: o.ground });
  return assemble(specs, 0, { w: o.size, h: o.size });
}

/**
 * Saree-border band (horizontal, or vertical when `vertical`): fine zari lines,
 * sawtooth "temple" edge, and alternating mango butis.
 */
export function zariBand(o: { len: number; thick?: number; gold: Paint; ground: string; line: string; vertical?: boolean; step?: number }): OrnamentData {
  const h = o.thick ?? 76;
  const step = o.step ?? 62;
  const n = Math.max(2, Math.round(o.len / step));
  const st = o.len / n;
  const mp = (u: number, v: number): [number, number] => (o.vertical ? [v, u] : [u, v]);
  const specs: PartSpec[] = [];
  const base = new Path().M(...mp(0, 0)).L(...mp(o.len, 0)).L(...mp(o.len, h)).L(...mp(0, h)).Z();
  specs.push({ path: base, fill: o.ground, opacity: 0.0 });
  const lines = new Path();
  [3, h - 3].forEach((v) => lines.M(...mp(0, v)).L(...mp(o.len, v)));
  specs.push({ path: lines, stroke: gl(o.gold), strokeWidth: 3 });
  const lines2 = new Path();
  [9, h - 9].forEach((v) => lines2.M(...mp(0, v)).L(...mp(o.len, v)));
  specs.push({ path: lines2, stroke: gl(o.gold), strokeWidth: 1 });
  specs.push({ path: lines, stroke: gl(o.gold), strokeWidth: 3 });
  const saw = new Path();
  for (let i = 0; i < n * 2; i++) {
    const u0 = (i * st) / 2;
    const u1 = u0 + st / 2;
    saw.M(...mp(u0, 13)).L(...mp((u0 + u1) / 2, 23)).L(...mp(u1, 13)).Z();
    saw.M(...mp(u0, h - 13)).L(...mp((u0 + u1) / 2, h - 23)).L(...mp(u1, h - 13)).Z();
  }
  specs.push({ path: saw, fill: o.gold });
  for (let i = 0; i < n; i++) {
    const u = st * (i + 0.5);
    const flip = i % 2 === 1;
    const ks = h * 0.5;
    if (o.vertical) kalkaParts(specs, h / 2 - ks * 0.46, u, ks, 90, flip, o.gold, o.ground, o.line);
    else kalkaParts(specs, u, h / 2 + ks * 0.46, ks, 0, flip, o.gold, o.ground, o.line);
  }
  const dia = new Path();
  for (let i = 0; i <= n; i++) {
    const [cx, cy] = mp(st * i, h / 2);
    dia.poly([[cx, cy - 7], [cx + 5, cy], [cx, cy + 7], [cx - 5, cy]], true);
  }
  specs.push({ path: dia, fill: o.gold });
  return assemble(specs, 0, o.vertical ? { w: h, h: o.len } : { w: o.len, h });
}

/** Half-drop field of tiny mango butis for silk texture. */
export function butiField(o: { w: number; h: number; cell: number; color: string }): OrnamentData {
  const p = new Path();
  const s = o.cell * 0.3;
  let row = 0;
  for (let y = o.cell * 0.6; y < o.h; y += o.cell * 0.7) {
    for (let x = (row % 2) * (o.cell / 2) + o.cell / 2; x < o.w; x += o.cell) {
      addKalka(p, x, y + s * 0.5, s, row % 2 ? 20 : -20, row % 4 > 1);
    }
    row++;
  }
  return assemble([{ path: p, fill: o.color }], 0, { w: o.w, h: o.h });
}

/** Fine silk weave: faint warp and weft threads. */
export function weave(o: { w: number; h: number; gap?: number; color: string }): OrnamentData {
  const g = o.gap ?? 6;
  const a = new Path();
  const b = new Path();
  for (let x = 0; x <= o.w; x += g) a.M(x, 0).L(x, o.h);
  for (let y = 0; y <= o.h; y += g * 2) b.M(0, y).L(o.w, y);
  return assemble([{ path: a, stroke: o.color, strokeWidth: 1, opacity: 0.6 }, { path: b, stroke: o.color, strokeWidth: 1, opacity: 0.35 }], 0, { w: o.w, h: o.h });
}

/** Mirrored pair of kalkas with a lotus-bud and curling vine between. */
export function mangoPair(o: { gold: Paint; ground: string; line: string; w?: number }): OrnamentData {
  const W = o.w ?? 520;
  const specs: PartSpec[] = [];
  const s = W * 0.3;
  kalkaParts(specs, W * 0.2, s * 1.12, s, 6, false, o.gold, o.ground, o.line);
  kalkaParts(specs, W * 0.8, s * 1.12, s, -6, true, o.gold, o.ground, o.line);
  const vine = new Path().M(W * 0.5, s * 1.2).C(W * 0.42, s * 0.7, W * 0.58, s * 0.5, W * 0.5, s * 0.12);
  specs.push({ path: vine, stroke: gl(o.gold), strokeWidth: 2.4 });
  const bud = new Path();
  petal(bud, W * 0.5, s * 0.34, rad(-90), 0, s * 0.4, s * 0.1);
  petal(bud, W * 0.5, s * 0.34, rad(-90 - 40), 0, s * 0.3, s * 0.08);
  petal(bud, W * 0.5, s * 0.34, rad(-90 + 40), 0, s * 0.3, s * 0.08);
  specs.push({ path: bud, fill: o.gold, stroke: o.line, strokeWidth: 1.2 });
  const dots = new Path();
  [0.38, 0.62].forEach((x) => dots.circle(W * x, s * 0.5, 3.4));
  specs.push({ path: dots, fill: o.gold });
  return assemble(specs, 2);
}
