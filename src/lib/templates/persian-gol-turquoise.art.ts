import { assemble, leaf, petal, Path, type OrnamentData, type PartSpec } from "../design/path";
import type { Paint } from "../design/types";

/** Pointed mihrab arch outline. */
export function mihrabPath(x: number, y: number, w: number, h: number): Path {
  const p = new Path();
  p.M(x, y + h)
    .L(x, y + h * 0.4)
    .C(x, y + h * 0.2, x + w * 0.34, y + h * 0.1, x + w / 2, y)
    .C(x + w * 0.66, y + h * 0.1, x + w, y + h * 0.2, x + w, y + h * 0.4)
    .L(x + w, y + h)
    .Z();
  return p;
}

/** Mihrab panel with a gold outline and two fine inner lines. */
export function mihrab(o: { w: number; h: number; fill: Paint; stroke: string; inner?: string; sw?: number }): OrnamentData {
  const sw = o.sw ?? 4;
  const specs: PartSpec[] = [];
  specs.push({ path: mihrabPath(sw, sw, o.w - sw * 2, o.h - sw * 2), fill: o.fill, stroke: o.stroke, strokeWidth: sw, lineJoin: "round" });
  const g = 16;
  const ic = o.inner ?? o.stroke;
  specs.push({ path: mihrabPath(sw + g, sw + g * 1.1, o.w - (sw + g) * 2, o.h - sw - g * 1.1 - g), stroke: ic, strokeWidth: 1.4 });
  specs.push({ path: mihrabPath(sw + g + 7, sw + g * 1.1 + 8, o.w - (sw + g + 7) * 2, o.h - sw - g * 1.1 - g - 8), stroke: ic, strokeWidth: 0.8, opacity: 0.6 });
  return assemble(specs, 0, { w: o.w, h: o.h });
}

/** Layered rosette (shamseh-style flower): outer petals, inner petals, heart. */
export function rosette(size: number, o: { outer: Paint; inner: Paint; heart: string; line: string; petals?: number }): OrnamentData {
  const c = size / 2;
  const n = o.petals ?? 12;
  const a = new Path();
  const b = new Path();
  const d = new Path();
  const ring = new Path();
  for (let i = 0; i < n; i++) {
    const ang = (i * 2 * Math.PI) / n - Math.PI / 2;
    petal(a, c, c, ang, size * 0.1, size * 0.5, size * 0.085, true);
    petal(b, c, c, ang + Math.PI / n, size * 0.08, size * 0.34, size * 0.07, true);
    petal(d, c, c, ang, size * 0.06, size * 0.2, size * 0.04, true);
    const dx = c + Math.cos(ang + Math.PI / n) * size * 0.44;
    const dy = c + Math.sin(ang + Math.PI / n) * size * 0.44;
    ring.circle(dx, dy, size * 0.012);
  }
  const heart = new Path().circle(c, c, size * 0.075);
  const hr = new Path().circle(c, c, size * 0.11);
  const specs: PartSpec[] = [
    { path: a, fill: o.outer, stroke: o.line, strokeWidth: 1.2 },
    { path: b, fill: o.inner, stroke: o.line, strokeWidth: 1 },
    { path: d, fill: o.outer, stroke: o.line, strokeWidth: 0.8 },
    { path: ring, fill: o.line },
    { path: hr, fill: o.line },
    { path: heart, fill: o.heart },
  ];
  specs.forEach((s) => s.path.include([0, 0], [size, size]));
  return assemble(specs, 0, { w: size, h: size });
}

/** Gol-o-bolbol style flowering branch: three blossoms, buds and leaves. */
export function golBranch(w: number, h: number, o: { leaf: Paint; bloom: Paint; core: Paint; stem: string; line: string }): OrnamentData {
  const stem = new Path();
  const leaves = new Path();
  const blooms = new Path();
  const cores = new Path();
  const dots = new Path();
  const cx = w / 2;
  stem.M(cx, h).C(cx - w * 0.04, h * 0.75, cx + w * 0.06, h * 0.55, cx, h * 0.34);
  stem.M(cx - w * 0.01, h * 0.8).C(cx - w * 0.2, h * 0.72, cx - w * 0.3, h * 0.55, cx - w * 0.34, h * 0.38);
  stem.M(cx + w * 0.005, h * 0.7).C(cx + w * 0.2, h * 0.62, cx + w * 0.3, h * 0.5, cx + w * 0.34, h * 0.36);
  leaf(leaves, [cx - w * 0.005, h * 0.9], -2.5, h * 0.2, h * 0.045);
  leaf(leaves, [cx + w * 0.005, h * 0.88], -0.65, h * 0.2, h * 0.045);
  leaf(leaves, [cx - w * 0.2, h * 0.72], -2.2, h * 0.18, h * 0.04);
  leaf(leaves, [cx + w * 0.2, h * 0.62], -0.9, h * 0.18, h * 0.04);
  leaf(leaves, [cx, h * 0.62], -1.9, h * 0.16, h * 0.035);
  leaf(leaves, [cx, h * 0.56], -1.25, h * 0.16, h * 0.035);
  const flower = (fx: number, fy: number, r: number, n: number, rot: number) => {
    for (let i = 0; i < n; i++) petal(blooms, fx, fy, rot + (i * 2 * Math.PI) / n, r * 0.18, r, r * 0.26, false);
    cores.circle(fx, fy, r * 0.22);
    for (let i = 0; i < n; i++) {
      const ang = rot + (i * 2 * Math.PI) / n + Math.PI / n;
      dots.circle(fx + Math.cos(ang) * r * 0.5, fy + Math.sin(ang) * r * 0.5, r * 0.045);
    }
  };
  flower(cx, h * 0.24, h * 0.2, 6, -Math.PI / 2);
  flower(cx - w * 0.34, h * 0.3, h * 0.12, 5, -Math.PI / 2 - 0.2);
  flower(cx + w * 0.34, h * 0.28, h * 0.12, 5, -Math.PI / 2 + 0.2);
  leaf(leaves, [cx - w * 0.17, h * 0.5], -2.1, h * 0.1, h * 0.03, true);
  leaf(leaves, [cx + w * 0.17, h * 0.45], -1.05, h * 0.1, h * 0.03, true);
  const specs: PartSpec[] = [
    { path: stem, stroke: o.stem, strokeWidth: 2.4 },
    { path: leaves, fill: o.leaf, stroke: o.line, strokeWidth: 0.8 },
    { path: blooms, fill: o.bloom, stroke: o.line, strokeWidth: 1 },
    { path: cores, fill: o.core, stroke: o.line, strokeWidth: 0.8 },
    { path: dots, fill: o.line },
  ];
  specs.forEach((s) => s.path.include([0, 0], [w, h]));
  return assemble(specs, 0, { w, h });
}

/** Horizontal scrolling vine with leaves and tiny dots. */
export function vine(w: number, h: number, o: { stem: string; leaf: Paint; dot: string; period?: number }): OrnamentData {
  const per = o.period ?? 120;
  const stem = new Path();
  const leaves = new Path();
  const dots = new Path();
  const mid = h / 2;
  const amp = h * 0.22;
  let x = 0;
  let up = true;
  stem.M(0, mid);
  while (x < w - 1) {
    const nx = Math.min(w, x + per / 2);
    stem.C(x + per * 0.17, up ? mid - amp * 1.9 : mid + amp * 1.9, nx - per * 0.17, up ? mid - amp * 1.9 : mid + amp * 1.9, nx, mid);
    const midx = (x + nx) / 2;
    const sgn = up ? -1 : 1;
    const by = mid + sgn * amp * 1.4;
    leaf(leaves, [midx, by], sgn < 0 ? -2.4 : 2.4, h * 0.3, h * 0.07);
    leaf(leaves, [midx, by], sgn < 0 ? -0.74 : 0.74, h * 0.3, h * 0.07);
    dots.circle(nx, mid, h * 0.045);
    x = nx;
    up = !up;
  }
  const specs: PartSpec[] = [
    { path: stem, stroke: o.stem, strokeWidth: 2 },
    { path: leaves, fill: o.leaf },
    { path: dots, fill: o.dot },
  ];
  specs.forEach((s) => s.path.include([0, 0], [w, h]));
  return assemble(specs, 0, { w, h });
}

/** Cartouche with pointed, concave-shouldered ends. */
export function cartouche(w: number, h: number, o: { fill: Paint; stroke: string; sw?: number; lines?: boolean }): OrnamentData {
  const sw = o.sw ?? 3;
  const mk = (ins: number) => {
    const x0 = ins;
    const x1 = w - ins;
    const y0 = ins * 0.8;
    const y1 = h - ins * 0.8;
    const m = h / 2;
    const s = (h - ins * 1.6) * 0.8;
    const p = new Path();
    p.M(x0, m)
      .C(x0 + s * 0.4, m, x0 + s * 0.35, y0, x0 + s, y0)
      .L(x1 - s, y0)
      .C(x1 - s * 0.35, y0, x1 - s * 0.4, m, x1, m)
      .C(x1 - s * 0.4, m, x1 - s * 0.35, y1, x1 - s, y1)
      .L(x0 + s, y1)
      .C(x0 + s * 0.35, y1, x0 + s * 0.4, m, x0, m)
      .Z();
    return p;
  };
  const specs: PartSpec[] = [{ path: mk(sw), fill: o.fill, stroke: o.stroke, strokeWidth: sw }];
  if (o.lines !== false) specs.push({ path: mk(sw + 9), stroke: o.stroke, strokeWidth: 1, opacity: 0.8 });
  return assemble(specs, 0, { w, h });
}

/** Ring of petals framing a round photo. */
export function petalRing(size: number, o: { outer: Paint; inner: Paint; line: string; n?: number }): OrnamentData {
  const c = size / 2;
  const n = o.n ?? 24;
  const a = new Path();
  const b = new Path();
  const beads = new Path();
  for (let i = 0; i < n; i++) {
    const ang = (i * 2 * Math.PI) / n;
    petal(a, c, c, ang, size * 0.4, size * 0.5, size * 0.03, true);
    petal(b, c, c, ang + Math.PI / n, size * 0.41, size * 0.465, size * 0.02, true);
    beads.circle(c + Math.cos(ang + Math.PI / n) * size * 0.485, c + Math.sin(ang + Math.PI / n) * size * 0.485, size * 0.006);
  }
  const r1 = new Path().circle(c, c, size * 0.398);
  const r2 = new Path().circle(c, c, size * 0.384);
  const specs: PartSpec[] = [
    { path: a, fill: o.outer, stroke: o.line, strokeWidth: 0.8 },
    { path: b, fill: o.inner },
    { path: beads, fill: o.line },
    { path: r1, stroke: o.line, strokeWidth: 2 },
    { path: r2, stroke: o.line, strokeWidth: 0.8 },
  ];
  specs.forEach((s) => s.path.include([0, 0], [size, size]));
  return assemble(specs, 0, { w: size, h: size });
}

/** Row of eight-pointed stars (khatam) for tiled bands. */
export function starRow(w: number, h: number, o: { fill: Paint; stroke: string; gap?: number }): OrnamentData {
  const n = Math.max(1, Math.round(w / (h * (o.gap ?? 1.35))));
  const step = w / n;
  const R = h / 2;
  const a = new Path();
  const dots = new Path();
  for (let i = 0; i < n; i++) {
    const cx = step * (i + 0.5);
    const cy = h / 2;
    const pts: [number, number][] = [];
    for (let k = 0; k < 16; k++) {
      const ang = (k * Math.PI) / 8 - Math.PI / 2;
      const r = k % 2 === 0 ? R : R * 0.62;
      pts.push([cx + Math.cos(ang) * r, cy + Math.sin(ang) * r]);
    }
    a.poly(pts, true);
    dots.circle(cx, cy, R * 0.16);
    if (i < n - 1) dots.circle(cx + step / 2, cy, R * 0.1);
  }
  const specs: PartSpec[] = [
    { path: a, fill: o.fill, stroke: o.stroke, strokeWidth: 1.2 },
    { path: dots, fill: o.stroke },
  ];
  specs.forEach((s) => s.path.include([0, 0], [w, h]));
  return assemble(specs, 0, { w, h });
}
