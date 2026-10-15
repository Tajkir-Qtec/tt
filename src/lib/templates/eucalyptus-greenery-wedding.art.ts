import { leaf, Path, type PartSpec, type Pt } from "../design/path";
import { GOLD } from "./kit";
import { place, rng } from "./birthday-balloons-bold.art";

export { place, rng };

/** Eucalyptus, olive and willow garlands built from procedural vectors. */

const rad = (d: number) => (d * Math.PI) / 180;
const EUC = ["#8fae9d", "#adc4b4", "#78998a", "#c3d4c6"];
const EUC_EDGE = "#628576";

function addEllipse(p: Path, cx: number, cy: number, rx: number, ry: number, rotDeg: number) {
  const t = rad(rotDeg);
  const dx = Math.cos(t) * rx;
  const dy = Math.sin(t) * rx;
  p.M(cx - dx, cy - dy).A(rx, ry, rotDeg, 1, 0, cx + dx, cy + dy).A(rx, ry, rotDeg, 1, 0, cx - dx, cy - dy).Z();
  const m = Math.max(rx, ry);
  p.include([cx - m, cy - m], [cx + m, cy + m]);
}

type Kind = "euc" | "olive" | "willow" | "gold";

export interface StemOpts {
  len: number;
  /** degrees, 0 = right, 90 = down */
  angle: number;
  curve?: number;
  kind: Kind;
  scale?: number;
}

/** One leafy stem. Returned specs are drawn in order (stem, leaves, details). */
export function stem(bx: number, by: number, o: StemOpts, r: () => number): PartSpec[] {
  const s = o.scale ?? 1;
  const a = rad(o.angle);
  const tip: Pt = [bx + Math.cos(a) * o.len, by + Math.sin(a) * o.len];
  const k = (o.curve ?? 0.12) * o.len;
  const ctrl: Pt = [(bx + tip[0]) / 2 - Math.sin(a) * k, (by + tip[1]) / 2 + Math.cos(a) * k];
  const at = (t: number): Pt => {
    const u = 1 - t;
    return [u * u * bx + 2 * u * t * ctrl[0] + t * t * tip[0], u * u * by + 2 * u * t * ctrl[1] + t * t * tip[1]];
  };
  const ta = (t: number) => Math.atan2(2 * (1 - t) * (ctrl[1] - by) + 2 * t * (tip[1] - ctrl[1]), 2 * (1 - t) * (ctrl[0] - bx) + 2 * t * (tip[0] - ctrl[0]));
  const st = new Path();
  for (let i = 0; i <= 14; i++) {
    const [x, y] = at(i / 14);
    if (i === 0) st.M(x, y);
    else st.L(x, y);
  }
  const specs: PartSpec[] = [{ path: st, stroke: o.kind === "gold" ? "#b8903f" : "#6b7f62", strokeWidth: 2.4 * Math.max(0.7, s) }];

  if (o.kind === "euc") {
    const tones = [new Path(), new Path()];
    const veins = new Path();
    const t0 = [EUC[Math.floor(r() * 4)], EUC[Math.floor(r() * 4)]];
    const m = 7;
    const dmax = 36 * s;
    for (let i = 0; i < m; i++) {
      const t = 0.14 + (0.78 * i) / m;
      const [x, y] = at(t);
      const d = dmax * (1 - 0.5 * t) * (0.88 + r() * 0.24);
      for (const side of [-1, 1]) {
        const an = ta(t) + side * rad(52 + r() * 14);
        const cx = x + Math.cos(an) * d * 0.55;
        const cy = y + Math.sin(an) * d * 0.55;
        addEllipse(tones[(i + (side > 0 ? 1 : 0)) % 2], cx, cy, d * 0.52, d * 0.47, (an * 180) / Math.PI);
        veins.M(x, y).L(x + Math.cos(an) * d * 1.04, y + Math.sin(an) * d * 1.04);
      }
    }
    const [tx, ty] = tip;
    const td = dmax * 0.5;
    const ea = ta(1);
    addEllipse(tones[0], tx + Math.cos(ea) * td * 0.5, ty + Math.sin(ea) * td * 0.5, td * 0.52, td * 0.44, (ea * 180) / Math.PI);
    specs.push({ path: tones[1], fill: t0[1], stroke: EUC_EDGE, strokeWidth: 0.9 });
    specs.push({ path: tones[0], fill: t0[0], stroke: EUC_EDGE, strokeWidth: 0.9 });
    specs.push({ path: veins, stroke: "#ffffff", strokeWidth: 0.9, opacity: 0.45 });
  } else if (o.kind === "olive" || o.kind === "willow") {
    const A = new Path();
    const B = new Path();
    const fr = new Path();
    const willow = o.kind === "willow";
    const m = willow ? 9 : 8;
    for (let i = 0; i < m; i++) {
      const t = 0.1 + (0.86 * i) / m;
      const p = at(t);
      for (const side of [-1, 1]) {
        const l = (willow ? 74 : 56) * s * (1 - t * 0.4) * (0.88 + r() * 0.24);
        const an = ta(t) + side * rad(willow ? 28 + r() * 14 : 42 + r() * 18);
        leaf(side > 0 ? A : B, p, an, l, l * (willow ? 0.09 : 0.13));
        if (!willow && r() < 0.16) fr.circle(p[0] + Math.cos(an) * 12 * s, p[1] + Math.sin(an) * 12 * s + 6, 5.2 * s);
      }
    }
    leaf(A, tip, ta(1), (willow ? 60 : 46) * s, (willow ? 5 : 6) * s);
    specs.push({ path: B, fill: willow ? "#8fa88c" : "#7b9170", stroke: "#566a4f", strokeWidth: 0.7 });
    specs.push({ path: A, fill: willow ? "#a9c0a3" : "#a6b99a", stroke: "#566a4f", strokeWidth: 0.7 });
    if (fr.pts.length) specs.push({ path: fr, fill: "#4a3b58", stroke: "#2b2036", strokeWidth: 0.8 });
  } else {
    const G = new Path();
    const D = new Path();
    const m = 7;
    for (let i = 0; i < m; i++) {
      const t = 0.12 + (0.84 * i) / m;
      const p = at(t);
      for (const side of [-1, 1]) {
        const l = 40 * s * (1 - t * 0.4) * (0.9 + r() * 0.2);
        leaf(G, p, ta(t) + side * rad(40 + r() * 16), l, l * 0.17);
      }
      if (i % 2 === 0) D.circle(p[0] + (r() - 0.5) * 12, p[1] + (r() - 0.5) * 12, 3.4 * s);
    }
    leaf(G, tip, ta(1), 34 * s, 5.5 * s);
    specs.push({ path: G, fill: GOLD, stroke: "#9a7433", strokeWidth: 0.6 });
    specs.push({ path: D, fill: GOLD });
  }
  return specs;
}

export interface SwagOpts {
  seed: number;
  n: number;
  scale?: number;
  /** relative weights for euc / olive / willow / gold */
  mix?: [number, number, number, number];
  spread?: number;
}

/** A garland along a quadratic curve P0 -> P2 (control C). Foliage billows forward and back. */
export function swag(P0: Pt, C: Pt, P2: Pt, o: SwagOpts): PartSpec[] {
  const r = rng(o.seed);
  const s = o.scale ?? 1;
  const mix = o.mix ?? [0.5, 0.26, 0.16, 0.08];
  const at = (t: number): Pt => {
    const u = 1 - t;
    return [u * u * P0[0] + 2 * u * t * C[0] + t * t * P2[0], u * u * P0[1] + 2 * u * t * C[1] + t * t * P2[1]];
  };
  const tan = (t: number) => Math.atan2(2 * (1 - t) * (C[1] - P0[1]) + 2 * t * (P2[1] - C[1]), 2 * (1 - t) * (C[0] - P0[0]) + 2 * t * (P2[0] - C[0]));
  const out: PartSpec[] = [];
  // a ribbon of stems so the garland has a body
  const base = new Path();
  for (let i = 0; i <= 40; i++) {
    const [x, y] = at(i / 40);
    if (i === 0) base.M(x, y);
    else base.L(x, y);
  }
  out.push({ path: base, stroke: "#6b7f62", strokeWidth: 4.2 * s });
  for (let i = 0; i < o.n; i++) {
    const t = (i + r() * 0.8) / o.n;
    const [x, y] = at(Math.min(1, t));
    const tg = (tan(t) * 180) / Math.PI;
    const dir = i % 2 ? 0 : 180;
    const off = (r() - 0.5) * (o.spread ?? 90);
    const u = r();
    const kind: Kind = u < mix[0] ? "euc" : u < mix[0] + mix[1] ? "olive" : u < mix[0] + mix[1] + mix[2] ? "willow" : "gold";
    out.push(...stem(x, y, { len: (kind === "willow" ? 230 : 190 + r() * 80) * s, angle: tg + dir + off, curve: (r() - 0.5) * 0.3, kind, scale: s }, r));
  }
  return out;
}

/** A garland around an ellipse (wreath), foliage sweeping clockwise. */
export function ringSwag(cx: number, cy: number, rx: number, ry: number, o: SwagOpts & { from?: number; to?: number }): PartSpec[] {
  const r = rng(o.seed);
  const s = o.scale ?? 1;
  const mix = o.mix ?? [0.5, 0.26, 0.16, 0.08];
  const from = o.from ?? 0;
  const to = o.to ?? 360;
  const out: PartSpec[] = [];
  const base = new Path();
  for (let i = 0; i <= 90; i++) {
    const a = rad(from + ((to - from) * i) / 90);
    const x = cx + Math.cos(a) * rx;
    const y = cy + Math.sin(a) * ry;
    if (i === 0) base.M(x, y);
    else base.L(x, y);
  }
  out.push({ path: base, stroke: "#6b7f62", strokeWidth: 4 * s });
  for (let i = 0; i < o.n; i++) {
    const deg = from + ((to - from) * (i + r() * 0.7)) / o.n;
    const a = rad(deg);
    const x = cx + Math.cos(a) * rx;
    const y = cy + Math.sin(a) * ry;
    const tg = (Math.atan2(Math.cos(a) * ry, -Math.sin(a) * rx) * 180) / Math.PI;
    const u = r();
    const kind: Kind = u < mix[0] ? "euc" : u < mix[0] + mix[1] ? "olive" : u < mix[0] + mix[1] + mix[2] ? "willow" : "gold";
    const dir = i % 2 ? 0 : 180;
    out.push(...stem(x, y, { len: (kind === "willow" ? 170 : 120 + r() * 60) * s, angle: tg + dir + (r() - 0.5) * (o.spread ?? 70), curve: (r() - 0.5) * 0.3, kind, scale: s }, r));
  }
  return out;
}
