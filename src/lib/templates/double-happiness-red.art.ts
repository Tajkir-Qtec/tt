import { assemble, leaf, Path, petal, type OrnamentData, type PartSpec, type Pt } from "../design/path";

export const GOLD_S = "#e6c46e";
export const GOLD_D = "#8a6420";
export const GOLD_L = "#fbe9a8";

const rad = (d: number) => (d * Math.PI) / 180;

/** One simplified 喜 glyph as polylines (local box ~ 100 x 160). */
const HALF: Pt[][] = [
  [[34, 8], [66, 8]],
  [[50, 8], [50, 74]],
  [[14, 32], [86, 32]],
  [[30, 50], [70, 50], [70, 74], [30, 74], [30, 50]],
  [[10, 92], [90, 92]],
  [[22, 56], [12, 82]],
  [[78, 56], [88, 82]],
  [[26, 112], [74, 112], [74, 160], [26, 160], [26, 112]],
];

function glyphPath(dx: number, dy: number, ox: number): Path {
  const p = new Path();
  for (const g of [0, 1]) {
    for (const s of HALF) {
      s.forEach(([x, y], i) => (i ? p.L(x + g * ox + dx, y + dy) : p.M(x + g * ox + dx, y + dy)));
    }
  }
  return p;
}

/** Double-happiness emblem: two 喜 glyphs built from round-capped strokes, with foil depth. */
export function doubleHappiness(sw = 10): OrnamentData {
  const ox = 100;
  const specs: PartSpec[] = [
    { path: glyphPath(2.5, 3.5, ox), stroke: GOLD_D, strokeWidth: sw + 2, lineJoin: "round", lineCap: "round", opacity: 0.9 },
    { path: glyphPath(0, 0, ox), stroke: GOLD_S, strokeWidth: sw, lineJoin: "round", lineCap: "round" },
    { path: glyphPath(-1.2, -1.4, ox), stroke: GOLD_L, strokeWidth: sw * 0.28, lineJoin: "round", lineCap: "round", opacity: 0.9 },
  ];
  return assemble(specs, 4);
}

/** Layered peony with leaves. Square, size x size. */
export function peony(size: number, seed = 1): OrnamentData {
  const c = size / 2;
  const R = size * 0.34;
  const specs: PartSpec[] = [];
  // leaves
  const leafCols = ["#1f5c46", "#2a7358", "#17493a"];
  for (let i = 0; i < 6; i++) {
    const a = rad(-90 + i * 60 + seed * 17);
    const p = new Path();
    leaf(p, [c + Math.cos(a) * R * 0.5, c + Math.sin(a) * R * 0.5], a, size * 0.46, size * 0.085, false);
    specs.push({ path: p, fill: leafCols[i % 3], stroke: GOLD_S, strokeWidth: 1.4, opacity: 0.96 });
    const v = new Path().M(c + Math.cos(a) * R * 0.5, c + Math.sin(a) * R * 0.5).L(c + Math.cos(a) * size * 0.44, c + Math.sin(a) * size * 0.44);
    specs.push({ path: v, stroke: GOLD_S, strokeWidth: 1, opacity: 0.7 });
  }
  const rings: { n: number; rot: number; r1: number; hw: number; fill: string; op: number }[] = [
    { n: 9, rot: 0, r1: 1.0, hw: 0.4, fill: "#f9d6c8", op: 0.98 },
    { n: 8, rot: 20, r1: 0.82, hw: 0.36, fill: "#f4b3a6", op: 0.98 },
    { n: 7, rot: 8, r1: 0.62, hw: 0.32, fill: "#ec8f8c", op: 0.98 },
    { n: 5, rot: 30, r1: 0.4, hw: 0.28, fill: "#d9636a", op: 0.98 },
  ];
  for (const ring of rings) {
    for (let i = 0; i < ring.n; i++) {
      const a = rad(ring.rot + (i * 360) / ring.n + seed * 7);
      const p = new Path();
      petal(p, c, c, a, R * 0.1, R * ring.r1, R * ring.hw, false);
      specs.push({ path: p, fill: ring.fill, stroke: GOLD_S, strokeWidth: 1.3, opacity: ring.op });
      // petal vein
      const v = new Path().M(c + Math.cos(a) * R * ring.r1 * 0.25, c + Math.sin(a) * R * ring.r1 * 0.25).Q(
        c + Math.cos(a + 0.12) * R * ring.r1 * 0.6,
        c + Math.sin(a + 0.12) * R * ring.r1 * 0.6,
        c + Math.cos(a) * R * ring.r1 * 0.88,
        c + Math.sin(a) * R * ring.r1 * 0.88,
      );
      specs.push({ path: v, stroke: "#c4565c", strokeWidth: 0.9, opacity: 0.55 });
    }
  }
  specs.push({ path: new Path().circle(c, c, R * 0.12), fill: GOLD_S, stroke: GOLD_D, strokeWidth: 1 });
  for (let i = 0; i < 10; i++) {
    const a = rad(i * 36);
    specs.push({ path: new Path().circle(c + Math.cos(a) * R * 0.2, c + Math.sin(a) * R * 0.2, R * 0.025), fill: GOLD_L });
  }
  return assemble(specs, 0, { w: size, h: size });
}

function spiral(p: Path, cx: number, cy: number, r0: number, dir: 1 | -1, turns = 1.6): void {
  const n = 60;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const a = t * turns * Math.PI * 2;
    const r = r0 * (1 - t * 0.9);
    const x = cx + dir * Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    if (i) p.L(x, y);
    else p.M(x, y);
  }
}

/** Auspicious ruyi / xiangyun cloud in gold linework. Width w, height ~0.5w. */
export function cloud(w: number, stroke = GOLD_S): OrnamentData {
  const u = w / 9;
  const base = u * 3.2;
  const cx = w / 2;
  const specs: PartSpec[] = [];
  const arc = (ccx: number, r: number, width: number, op = 1) => {
    const p = new Path();
    for (let i = 0; i <= 40; i++) {
      const a = Math.PI + (i / 40) * Math.PI;
      const x = ccx + Math.cos(a) * r;
      const y = base + Math.sin(a) * r;
      if (i) p.L(x, y);
      else p.M(x, y);
    }
    specs.push({ path: p, stroke, strokeWidth: width, opacity: op });
  };
  // main lobes
  arc(cx, u * 2.6, 2.6);
  arc(cx, u * 2.0, 1.5, 0.8);
  arc(cx, u * 1.4, 1.2, 0.6);
  for (const s of [-1, 1]) {
    const lc = cx + s * u * 3.5;
    arc(lc, u * 1.6, 2.4);
    arc(lc, u * 1.1, 1.3, 0.7);
    // end curl
    const ex = lc + s * u * 1.6;
    const rc = u * 0.95;
    const curl = new Path();
    spiral(curl, ex + s * rc, base, rc, s === 1 ? -1 : 1, 1.7);
    // move curl so it starts at the lobe end point
    specs.push({ path: curl, stroke, strokeWidth: 2.2 });
  }
  return assemble(specs, 3);
}

/** Row of soft sparks / dots divider with a gold lozenge in the middle. */
export function lozengeDivider(w = 420): OrnamentData {
  const h = 30;
  const cy = h / 2;
  const cx = w / 2;
  const specs: PartSpec[] = [];
  specs.push({ path: new Path().M(0, cy).L(cx - 40, cy), stroke: GOLD_S, strokeWidth: 1.5 });
  specs.push({ path: new Path().M(cx + 40, cy).L(w, cy), stroke: GOLD_S, strokeWidth: 1.5 });
  for (const r of [14, 9]) {
    specs.push({ path: new Path().poly([[cx, cy - r], [cx + r, cy], [cx, cy + r], [cx - r, cy]], true), stroke: GOLD_S, strokeWidth: r === 14 ? 1.5 : 0, fill: r === 9 ? GOLD_S : null });
  }
  specs.push({ path: new Path().circle(cx - 30, cy, 2.6), fill: GOLD_S });
  specs.push({ path: new Path().circle(cx + 30, cy, 2.6), fill: GOLD_S });
  return assemble(specs, 0, { w, h });
}

/** Subtle repeated lattice (hexagon-ish coin pattern) for the red background. */
export function coinPattern(w: number, h: number, r = 44): OrnamentData {
  const p = new Path();
  const dx = r * 1.6;
  const dy = r * 1.6;
  for (let j = -1; j * dy < h + dy; j++) {
    for (let i = -1; i * dx < w + dx; i++) {
      const cx = i * dx + (j % 2 ? dx / 2 : 0);
      const cy = j * dy;
      p.circle(cx, cy, r * 0.5);
      p.circle(cx, cy, r * 0.5 * 0.55);
    }
  }
  p.include([0, 0], [w, h]);
  return assemble([{ path: p, stroke: GOLD_S, strokeWidth: 1, opacity: 0.1 }], 0, { w, h });
}
