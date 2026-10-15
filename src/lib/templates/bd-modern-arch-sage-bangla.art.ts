import { assemble, leaf, Path, type OrnamentData, type PartSpec, type Pt } from "../design/path";

const rad = (d: number) => (d * Math.PI) / 180;

/**
 * Fine-line olive branch drawn in absolute page coordinates (fixed canvas) so it can be
 * dropped at (0,0) and still land where intended. `ang` is the growth direction in degrees.
 */
export function oliveBranch(o: {
  ox: number;
  oy: number;
  ang: number;
  len: number;
  bend?: number;
  leafLen?: number;
  ink: string;
  leafFill: string;
  olive?: string;
  mirror?: boolean;
  canvas: { w: number; h: number };
}): OrnamentData {
  const bend = o.bend ?? o.len * 0.12;
  const leafLen = o.leafLen ?? 54;
  const a = rad(o.ang);
  const m = o.mirror ? -1 : 1;
  const v = (u: number) => m * bend * Math.sin((u / o.len) * Math.PI * 0.95);
  const dv = (u: number) => m * bend * Math.cos((u / o.len) * Math.PI * 0.95) * ((Math.PI * 0.95) / o.len);
  const pt = (u: number, vv = v(u)): Pt => [o.ox + Math.cos(a) * u - Math.sin(a) * vv, o.oy + Math.sin(a) * u + Math.cos(a) * vv];
  const tang = (u: number) => a + Math.atan(dv(u));

  const stem = new Path();
  const N = 28;
  for (let i = 0; i <= N; i++) {
    const [x, y] = pt((i / N) * o.len);
    if (i === 0) stem.M(x, y);
    else stem.L(x, y);
  }
  const leaves = new Path();
  const ribs = new Path();
  const stalks = new Path();
  const olives = new Path();
  const n = Math.max(4, Math.floor(o.len / (leafLen * 0.52)));
  for (let i = 0; i < n; i++) {
    const t = (i + 1) / (n + 0.6);
    const u = t * o.len;
    const size = leafLen * (1 - 0.5 * t);
    const side = i % 2 === 0 ? 1 : -1;
    const base = pt(u);
    const ang = tang(u) + side * rad(50);
    leaf(leaves, base, ang, size, size * 0.2);
    ribs.M(base[0], base[1]).L(base[0] + Math.cos(ang) * size * 0.86, base[1] + Math.sin(ang) * size * 0.86);
    if (o.olive && i % 3 === 1 && i > 0) {
      const sa = tang(u) - side * rad(62);
      const e: Pt = [base[0] + Math.cos(sa) * 30, base[1] + Math.sin(sa) * 30];
      stalks.M(base[0], base[1]).L(e[0], e[1]);
      olives.circle(e[0] + Math.cos(sa) * 6, e[1] + Math.sin(sa) * 6, 7.5);
    }
  }
  const tip = pt(o.len);
  leaf(leaves, tip, tang(o.len), leafLen * 0.52, leafLen * 0.12);
  const specs: PartSpec[] = [
    { path: leaves, fill: o.leafFill, stroke: o.ink, strokeWidth: 1.3 },
    { path: ribs, stroke: o.ink, strokeWidth: 0.9, opacity: 0.8 },
    { path: stem, stroke: o.ink, strokeWidth: 1.7 },
    { path: stalks, stroke: o.ink, strokeWidth: 1.2 },
  ];
  if (o.olive) specs.push({ path: olives, fill: o.olive, stroke: o.ink, strokeWidth: 1.1 });
  // keep the whole canvas as the viewbox
  const frame = new Path().M(0, 0).L(o.canvas.w, o.canvas.h);
  specs.push({ path: frame, stroke: null, strokeWidth: 0 });
  return assemble(specs, 0, { w: o.canvas.w, h: o.canvas.h });
}

/** Tiny three-leaf sprig, centred, for dividers and badges. */
export function sprigMini(o: { size: number; ink: string; fill: string }): OrnamentData {
  const s = o.size;
  const stem = new Path().M(s / 2, s).L(s / 2, s * 0.18);
  const leaves = new Path();
  leaf(leaves, [s / 2, s * 0.62], rad(-90 - 48), s * 0.5, s * 0.1);
  leaf(leaves, [s / 2, s * 0.62], rad(-90 + 48), s * 0.5, s * 0.1);
  leaf(leaves, [s / 2, s * 0.4], rad(-90 - 40), s * 0.4, s * 0.085);
  leaf(leaves, [s / 2, s * 0.4], rad(-90 + 40), s * 0.4, s * 0.085);
  leaf(leaves, [s / 2, s * 0.22], rad(-90), s * 0.28, s * 0.075);
  return assemble(
    [
      { path: leaves, fill: o.fill, stroke: o.ink, strokeWidth: 1.2 },
      { path: stem, stroke: o.ink, strokeWidth: 1.4 },
    ],
    0,
    { w: s, h: s },
  );
}

/** Hairline arch outline stack (n arches shrinking by gap), open at the bottom. */
export function archLines(o: { w: number; h: number; n: number; gap: number; ink: string; sw?: number }): OrnamentData {
  const specs: PartSpec[] = [];
  for (let i = 0; i < o.n; i++) {
    const inset = 1 + i * o.gap;
    const w = o.w - inset * 2;
    const r = w / 2;
    const p = new Path();
    p.M(inset, o.h).L(inset, inset + r).A(r, r, 0, 0, 1, inset + w, inset + r).L(inset + w, o.h);
    p.include([inset + r, inset]);
    specs.push({ path: p, stroke: o.ink, strokeWidth: o.sw ?? 1.2, opacity: 1 - i * 0.2 });
  }
  return assemble(specs, 0, { w: o.w, h: o.h });
}

/** Row of small dots with a centre leaf accent, for thin separators. */
export function dotLine(o: { w: number; ink: string }): OrnamentData {
  const p = new Path();
  const n = Math.floor(o.w / 14);
  for (let i = 0; i <= n; i++) {
    const x = (i / n) * o.w;
    const mid = Math.abs(x - o.w / 2) < 8;
    if (!mid) p.circle(x, 8, 1.6);
  }
  const lf = new Path();
  leaf(lf, [o.w / 2 - 12, 8], 0, 24, 5);
  return assemble(
    [
      { path: p, fill: o.ink, opacity: 0.8 },
      { path: lf, fill: o.ink },
    ],
    0,
    { w: o.w, h: 16 },
  );
}
