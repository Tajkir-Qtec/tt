import { assemble, Path, type OrnamentData, type PartSpec, type Pt } from "../design/path";
import type { Paint } from "../design/types";

export const CHAMP: Paint = {
  kind: "linear",
  angle: 100,
  stops: [
    [0, "#8d7647"],
    [0.22, "#f3e6bf"],
    [0.46, "#c2a465"],
    [0.72, "#fbf1d3"],
    [1, "#9a8250"],
  ],
};
export const CH = "#d8c18a";

const rad = (d: number) => (d * Math.PI) / 180;
function arcPts(cx: number, cy: number, r: number, a0: number, a1: number, n = 48): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const a = rad(a0 + ((a1 - a0) * i) / n);
    out.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  return out;
}

/** Upper half sunburst fan, base on the bottom edge. Width 2R, height R + pad. */
export function fan(R: number, rays = 15, core = 0.2): OrnamentData {
  const pad = 4;
  const cx = R + pad;
  const cy = R + pad;
  const a0 = 180;
  const a1 = 360;
  const specs: PartSpec[] = [];
  const step = 180 / rays;
  for (let i = 0; i < rays; i += 2) {
    const p = new Path();
    const lo = a0 + i * step;
    const hi = lo + step;
    p.M(cx + Math.cos(rad(lo)) * R * core, cy + Math.sin(rad(lo)) * R * core);
    arcPts(cx, cy, R * 0.97, lo, hi, 8).forEach(([x, y]) => p.L(x, y));
    p.L(cx + Math.cos(rad(hi)) * R * core, cy + Math.sin(rad(hi)) * R * core);
    p.Z();
    specs.push({ path: p, fill: CHAMP, opacity: 0.92 });
  }
  for (let i = 0; i <= rays; i++) {
    const a = rad(a0 + i * step);
    const p = new Path().M(cx + Math.cos(a) * R * core, cy + Math.sin(a) * R * core).L(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
    specs.push({ path: p, stroke: CH, strokeWidth: 1.4, opacity: 0.9 });
  }
  for (const [k, w] of [[1, 3], [0.97, 1.2], [0.62, 1.4], [core, 2.2]] as [number, number][]) {
    const p = new Path();
    arcPts(cx, cy, R * k, a0, a1, 64).forEach(([x, y], i) => (i ? p.L(x, y) : p.M(x, y)));
    specs.push({ path: p, stroke: CH, strokeWidth: w });
  }
  specs.push({ path: new Path().M(cx - R, cy).L(cx + R, cy), stroke: CH, strokeWidth: 3 });
  const c = new Path();
  arcPts(cx, cy, R * core * 0.86, a0, a1, 32).forEach(([x, y], i) => (i ? c.L(x, y) : c.M(x, y)));
  c.Z();
  specs.push({ path: c, fill: "#0c0c0e", stroke: CH, strokeWidth: 1.2 });
  return assemble(specs, 0, { w: R * 2 + pad * 2, h: R + pad * 2 });
}

/** Rectangle with stepped (staircase) corners, `lines` nested. */
export function steppedFrame(w: number, h: number, step = 14, lines = 3, gap = 12): OrnamentData {
  const specs: PartSpec[] = [];
  for (let i = 0; i < lines; i++) {
    const o = 2 + i * gap;
    const st = Math.max(5, step - i * 3);
    const x0 = o,
      y0 = o,
      x1 = w - o,
      y1 = h - o;
    const pts: Pt[] = [
      [x0 + 2 * st, y0],
      [x1 - 2 * st, y0],
      [x1 - 2 * st, y0 + st],
      [x1 - st, y0 + st],
      [x1 - st, y0 + 2 * st],
      [x1, y0 + 2 * st],
      [x1, y1 - 2 * st],
      [x1 - st, y1 - 2 * st],
      [x1 - st, y1 - st],
      [x1 - 2 * st, y1 - st],
      [x1 - 2 * st, y1],
      [x0 + 2 * st, y1],
      [x0 + 2 * st, y1 - st],
      [x0 + st, y1 - st],
      [x0 + st, y1 - 2 * st],
      [x0, y1 - 2 * st],
      [x0, y0 + 2 * st],
      [x0 + st, y0 + 2 * st],
      [x0 + st, y0 + st],
      [x0 + 2 * st, y0 + st],
    ];
    specs.push({ path: new Path().poly(pts, true), stroke: CH, strokeWidth: i === 0 ? 3.2 : i === 1 ? 1.6 : 1, lineJoin: "miter" });
  }
  return assemble(specs, 0, { w, h });
}

/** Row of nested chevrons (deco border band). */
export function chevronBand(w: number, h = 46, n = 20): OrnamentData {
  const specs: PartSpec[] = [];
  const cw = w / n;
  for (let i = 0; i < n; i++) {
    const x = i * cw;
    for (let k = 0; k < 3; k++) {
      const inset = k * 7;
      const p = new Path();
      p.poly([[x + inset, h], [x + cw / 2, inset + 2], [x + cw - inset, h]]);
      specs.push({ path: p, stroke: CH, strokeWidth: k === 0 ? 1.8 : 1.1, opacity: 1 - k * 0.15, lineJoin: "miter" });
    }
    if (i % 2 === 0) {
      const p = new Path();
      p.poly([[x + cw * 0.3, h], [x + cw / 2, 22], [x + cw * 0.7, h]], true);
      specs.push({ path: p, fill: CHAMP, opacity: 0.85 });
    }
  }
  return assemble(specs, 0, { w, h: h + 2 });
}

/** Horizontal deco divider: lines and a stepped diamond. */
export function decoDivider(w = 420): OrnamentData {
  const h = 40;
  const cx = w / 2;
  const cy = h / 2;
  const specs: PartSpec[] = [];
  specs.push({ path: new Path().M(0, cy).L(cx - 40, cy), stroke: CH, strokeWidth: 1.5 });
  specs.push({ path: new Path().M(cx + 40, cy).L(w, cy), stroke: CH, strokeWidth: 1.5 });
  for (const dy of [-6, 6]) {
    specs.push({ path: new Path().M(14, cy + dy).L(cx - 52, cy + dy), stroke: CH, strokeWidth: 0.9, opacity: 0.7 });
    specs.push({ path: new Path().M(cx + 52, cy + dy).L(w - 14, cy + dy), stroke: CH, strokeWidth: 0.9, opacity: 0.7 });
  }
  for (const [r, f] of [[18, true], [26, false], [32, false]] as [number, boolean][]) {
    const p = new Path().poly([[cx, cy - r], [cx + r, cy], [cx, cy + r], [cx - r, cy]], true);
    specs.push(f ? { path: p, fill: CHAMP, stroke: CH, strokeWidth: 1 } : { path: p, stroke: CH, strokeWidth: r === 26 ? 1.4 : 0.8, lineJoin: "miter" });
  }
  return assemble(specs, 0, { w, h });
}

/** Faint radiating beams. */
export function beams(w: number, h: number, ox: number, oy: number, n = 28): OrnamentData {
  const specs: PartSpec[] = [];
  const R = Math.hypot(w, h);
  for (let i = 0; i < n; i++) {
    const a0 = rad(180 + (i * 180) / n);
    const a1 = rad(180 + ((i + 0.5) * 180) / n);
    const p = new Path().M(ox, oy).L(ox + Math.cos(a0) * R, oy + Math.sin(a0) * R).L(ox + Math.cos(a1) * R, oy + Math.sin(a1) * R).Z();
    specs.push({ path: p, fill: "#d8c18a", opacity: 0.045 });
  }
  return assemble(specs, 0, { w, h });
}

/** Scale (fish-scale) pattern, classic deco. */
export function scalePattern(w: number, h: number, r = 34): OrnamentData {
  const rows = Math.ceil(h / (r * 0.5)) + 1;
  const cols = Math.ceil(w / (r * 2)) + 1;
  const p = new Path();
  for (let j = 0; j < rows; j++) {
    for (let i = -1; i < cols; i++) {
      const cx = i * r * 2 + (j % 2 ? r : 0);
      const cy = j * r * 0.5;
      arcPts(cx, cy, r, 0, 180, 14).forEach(([x, y], k) => (k ? p.L(x, y) : p.M(x, y)));
    }
  }
  p.include([0, 0], [w, h]);
  return assemble([{ path: p, stroke: CH, strokeWidth: 0.9, opacity: 0.1 }], 0, { w, h });
}
