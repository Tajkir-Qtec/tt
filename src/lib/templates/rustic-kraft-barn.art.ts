import { leaf, Path, petal, type PartSpec, type Pt } from "../design/path";
import type { Layer } from "../design/types";
import { place, rng } from "./birthday-balloons-bold.art";

export { place, rng };

/** Rustic barn artwork: kraft fibres, twine, string lights, wooden planks, wildflower bunches. */

const rad = (d: number) => (d * Math.PI) / 180;

function ell(p: Path, cx: number, cy: number, rx: number, ry: number, rotDeg: number) {
  const t = rad(rotDeg);
  const dx = Math.cos(t) * rx;
  const dy = Math.sin(t) * rx;
  p.M(cx - dx, cy - dy).A(rx, ry, rotDeg, 1, 0, cx + dx, cy + dy).A(rx, ry, rotDeg, 1, 0, cx - dx, cy - dy).Z();
  const m = Math.max(rx, ry);
  p.include([cx - m, cy - m], [cx + m, cy + m]);
}

/** Short kraft-paper fibres scattered over an area. */
export function fibers(seed: number, n: number, area: [number, number, number, number], tones: [string, string]): Layer {
  const r = rng(seed);
  const a = new Path();
  const b = new Path();
  for (let i = 0; i < n; i++) {
    const x = area[0] + r() * (area[2] - area[0]);
    const y = area[1] + r() * (area[3] - area[1]);
    const ang = r() * Math.PI * 2;
    const l = 8 + r() * 20;
    const p = r() < 0.5 ? a : b;
    p.M(x, y).Q(x + Math.cos(ang + 0.6) * l * 0.5, y + Math.sin(ang + 0.6) * l * 0.5, x + Math.cos(ang) * l, y + Math.sin(ang) * l);
  }
  return place([
    { path: a, stroke: tones[0], strokeWidth: 1, opacity: 0.35 },
    { path: b, stroke: tones[1], strokeWidth: 1, opacity: 0.3 },
  ], 2);
}

export const quad = (P0: Pt, C: Pt, P2: Pt, t: number): Pt => {
  const u = 1 - t;
  return [u * u * P0[0] + 2 * u * t * C[0] + t * t * P2[0], u * u * P0[1] + 2 * u * t * C[1] + t * t * P2[1]];
};

/** t at which the quadratic is at horizontal position x. */
export function tAtX(P0: Pt, C: Pt, P2: Pt, x: number): number {
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 30; i++) {
    const m = (lo + hi) / 2;
    if (quad(P0, C, P2, m)[0] < x) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}

/** A twisted jute rope along a quadratic curve. */
export function twine(P0: Pt, C: Pt, P2: Pt, sw = 5, hatch = 7): PartSpec[] {
  const base = new Path();
  const h = new Path();
  const N = 70;
  for (let i = 0; i <= N; i++) {
    const [x, y] = quad(P0, C, P2, i / N);
    if (i === 0) base.M(x, y);
    else base.L(x, y);
  }
  const len = Math.hypot(P2[0] - P0[0], P2[1] - P0[1]) * 1.1;
  const M = Math.floor(len / hatch);
  for (let i = 0; i < M; i++) {
    const t = i / M;
    const [x, y] = quad(P0, C, P2, t);
    const [x2, y2] = quad(P0, C, P2, Math.min(1, t + 0.004));
    const a = Math.atan2(y2 - y, x2 - x);
    const nx = -Math.sin(a + 0.5);
    const ny = Math.cos(a + 0.5);
    h.M(x - nx * sw * 0.5, y - ny * sw * 0.5).L(x + nx * sw * 0.5, y + ny * sw * 0.5);
  }
  return [
    { path: base, stroke: "#5b3d1f", strokeWidth: sw + 2, opacity: 0.35 },
    { path: base, stroke: "#dcc08c", strokeWidth: sw },
    { path: h, stroke: "#8c6a3a", strokeWidth: 1.4, opacity: 0.85 },
  ];
}

/** String lights: twine with warm glowing bulbs hanging from it. */
export function stringLights(P0: Pt, C: Pt, P2: Pt, n: number, seed: number): PartSpec[] {
  const r = rng(seed);
  const halo1 = new Path();
  const halo2 = new Path();
  const halo3 = new Path();
  const bulb = new Path();
  const core = new Path();
  const sock = new Path();
  const cord = new Path();
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n;
    const [x, y] = quad(P0, C, P2, t);
    const drop = 20 + r() * 12;
    cord.M(x, y).L(x, y + drop);
    sock.M(x - 5, y + drop).L(x + 5, y + drop).L(x + 4, y + drop + 11).L(x - 4, y + drop + 11).Z();
    const by = y + drop + 24;
    halo1.circle(x, by, 56);
    halo2.circle(x, by, 36);
    halo3.circle(x, by, 22);
    ell(bulb, x, by, 11, 14, 0);
    ell(core, x, by + 1, 5, 7, 0);
  }
  return [
    ...twine(P0, C, P2, 5),
    { path: cord, stroke: "#3b2b1c", strokeWidth: 2 },
    { path: halo1, fill: "#ffcf6e", opacity: 0.08 },
    { path: halo2, fill: "#ffcf6e", opacity: 0.14 },
    { path: halo3, fill: "#ffd98a", opacity: 0.28 },
    { path: sock, fill: "#3b2b1c" },
    { path: bulb, fill: "#ffe7a0", stroke: "#e8b04a", strokeWidth: 1.2 },
    { path: core, fill: "#fffbe8" },
  ];
}

export interface PlankTone {
  a: string;
  b: string;
  grain: string;
  light: string;
}
export const WOOD_DARK: PlankTone = { a: "#8d5d37", b: "#6a4126", grain: "#2f1a0c", light: "#c28f5c" };
export const WOOD_MID: PlankTone = { a: "#a8764a", b: "#82552f", grain: "#3d2512", light: "#d9a875" };

/** A weathered wooden plank (x, y, w, h) with grain, knots and nails. */
export function plank(x: number, y: number, w: number, h: number, seed: number, tone: PlankTone = WOOD_DARK): PartSpec[] {
  const r = rng(seed);
  const jit = () => (r() - 0.5) * 3.2;
  const body = new Path();
  const pts: Pt[] = [];
  const nx = Math.max(6, Math.round(w / 60));
  for (let i = 0; i <= nx; i++) pts.push([x + (w * i) / nx, y + jit()]);
  pts.push([x + w + jit(), y + h * 0.5]);
  for (let i = nx; i >= 0; i--) pts.push([x + (w * i) / nx, y + h + jit()]);
  pts.push([x + jit(), y + h * 0.5]);
  body.poly(pts, true);
  const shadow = new Path();
  shadow.poly(pts.map(([px, py]) => [px + 5, py + 11] as Pt), true);
  const grain = new Path();
  const hi = new Path();
  const lines = Math.max(6, Math.round(h / 9));
  for (let i = 0; i < lines; i++) {
    const gy = y + 5 + r() * (h - 10);
    const amp = 1 + r() * 3;
    const ph = r() * 6;
    const fr = 0.006 + r() * 0.01;
    const x0 = x + r() * w * 0.2;
    const x1 = x + w - r() * w * 0.2;
    const path = r() < 0.7 ? grain : hi;
    for (let k = 0; k <= 24; k++) {
      const px = x0 + ((x1 - x0) * k) / 24;
      const py = gy + Math.sin(px * fr + ph) * amp;
      if (k === 0) path.M(px, py);
      else path.L(px, py);
    }
  }
  const knots = new Path();
  const kn = Math.round(w / 420) + 1;
  for (let i = 0; i < kn; i++) {
    const kx = x + w * (0.15 + r() * 0.7);
    const ky = y + h * (0.3 + r() * 0.4);
    for (let k = 1; k <= 3; k++) ell(knots, kx, ky, 7 * k, 3.4 * k, 0);
  }
  const edge = new Path();
  edge.M(x + 12, y + 2).L(x + 12, y + h - 2).M(x + w - 12, y + 2).L(x + w - 12, y + h - 2);
  const nails = new Path();
  const nh = new Path();
  for (const nxx of [x + 26, x + w - 26]) {
    nails.circle(nxx, y + h / 2, 5.5);
    nh.circle(nxx - 1.5, y + h / 2 - 1.5, 1.8);
  }
  return [
    { path: shadow, fill: "#000000", opacity: 0.28 },
    { path: body, fill: { kind: "linear", angle: 90, stops: [[0, tone.a], [1, tone.b]] }, stroke: tone.grain, strokeWidth: 1.4 },
    { path: hi, stroke: tone.light, strokeWidth: 1.1, opacity: 0.28 },
    { path: grain, stroke: tone.grain, strokeWidth: 1.2, opacity: 0.32 },
    { path: knots, stroke: tone.grain, strokeWidth: 1, opacity: 0.45 },
    { path: edge, stroke: tone.grain, strokeWidth: 1, opacity: 0.2 },
    { path: nails, fill: "#2a1d12" },
    { path: nh, fill: "#d9c8a8", opacity: 0.8 },
  ];
}

/** Deckled paper sheet with a soft shadow. */
export function paper(x: number, y: number, w: number, h: number, seed: number, fill = "#fbf3e2"): PartSpec[] {
  const r = rng(seed);
  const pts: Pt[] = [];
  const step = 16;
  const j = () => (r() - 0.5) * 3.6;
  for (let px = 0; px <= w; px += step) pts.push([x + px, y + j()]);
  for (let py = 0; py <= h; py += step) pts.push([x + w + j(), y + py]);
  for (let px = w; px >= 0; px -= step) pts.push([x + px, y + h + j()]);
  for (let py = h; py >= 0; py -= step) pts.push([x + j(), y + py]);
  const body = new Path().poly(pts, true);
  const sh = new Path().poly(pts.map(([a, b]) => [a + 6, b + 12] as Pt), true);
  const sh2 = new Path().poly(pts.map(([a, b]) => [a + 2, b + 4] as Pt), true);
  return [
    { path: sh, fill: "#2a1808", opacity: 0.22 },
    { path: sh2, fill: "#2a1808", opacity: 0.2 },
    { path: body, fill: { kind: "linear", angle: 100, stops: [[0, fill], [1, "#f1e4c8"]] }, stroke: "#d9c7a0", strokeWidth: 1 },
  ];
}

/* ------------------------------- wildflowers ------------------------------- */

function wheat(bx: number, by: number, angle: number, len: number, seed: number, bend = 0.1): PartSpec[] {
  const r = rng(seed);
  const a = rad(angle - 90);
  const tip: Pt = [bx + Math.cos(a) * len, by + Math.sin(a) * len];
  const ctrl: Pt = [(bx + tip[0]) / 2 - Math.sin(a) * len * bend, (by + tip[1]) / 2 + Math.cos(a) * len * bend];
  const at = (t: number) => quad([bx, by], ctrl, tip, t);
  const ta = (t: number) => Math.atan2(2 * (1 - t) * (ctrl[1] - by) + 2 * t * (tip[1] - ctrl[1]), 2 * (1 - t) * (ctrl[0] - bx) + 2 * t * (tip[0] - ctrl[0]));
  const st = new Path();
  for (let i = 0; i <= 14; i++) {
    const [x, y] = at(i / 14);
    if (i === 0) st.M(x, y);
    else st.L(x, y);
  }
  const g = new Path();
  const awn = new Path();
  const n = 8;
  for (let i = 0; i < n; i++) {
    const t = 0.7 + (0.28 * i) / n;
    const p = at(t);
    for (const s of [-1, 1]) {
      const an = ta(t) + s * rad(22);
      leaf(g, p, an, 24, 5.4, true);
      awn.M(p[0] + Math.cos(an) * 22, p[1] + Math.sin(an) * 22).L(p[0] + Math.cos(an) * 46, p[1] + Math.sin(an) * 46 + r() * 2);
    }
  }
  leaf(g, tip, ta(1), 26, 5, true);
  awn.M(tip[0], tip[1]).L(tip[0] + Math.cos(ta(1)) * 40, tip[1] + Math.sin(ta(1)) * 40);
  return [
    { path: st, stroke: "#b8a25c", strokeWidth: 2.6 },
    { path: awn, stroke: "#d4b765", strokeWidth: 1 },
    { path: g, fill: "#dcbc66", stroke: "#a98a3a", strokeWidth: 0.8 },
  ];
}

function lavender(bx: number, by: number, angle: number, len: number, seed: number): PartSpec[] {
  const r = rng(seed);
  const a = rad(angle - 90);
  const tip: Pt = [bx + Math.cos(a) * len, by + Math.sin(a) * len];
  const ctrl: Pt = [(bx + tip[0]) / 2 - Math.sin(a) * len * 0.08, (by + tip[1]) / 2 + Math.cos(a) * len * 0.08];
  const at = (t: number) => quad([bx, by], ctrl, tip, t);
  const st = new Path();
  for (let i = 0; i <= 12; i++) {
    const [x, y] = at(i / 12);
    if (i === 0) st.M(x, y);
    else st.L(x, y);
  }
  const A = new Path();
  const B = new Path();
  const C = new Path();
  const m = 14;
  for (let i = 0; i < m; i++) {
    const t = 0.55 + (0.45 * i) / m;
    const [x, y] = at(t);
    const sz = 9 * (1 - (i / m) * 0.45);
    for (const s of [-1, 1]) {
      const px = x + s * (5 + r() * 3);
      const py = y + (r() - 0.5) * 4;
      ell([A, B, C][(i + (s > 0 ? 1 : 0)) % 3], px, py, sz * 0.55, sz, s * 24);
    }
  }
  return [
    { path: st, stroke: "#7d8a5e", strokeWidth: 2.2 },
    { path: C, fill: "#6d4fa8", stroke: "#4f3680", strokeWidth: 0.6 },
    { path: B, fill: "#8b6fc4", stroke: "#4f3680", strokeWidth: 0.6 },
    { path: A, fill: "#ab93dc", stroke: "#4f3680", strokeWidth: 0.6 },
  ];
}

function gyp(bx: number, by: number, angle: number, len: number, seed: number): PartSpec[] {
  const r = rng(seed);
  const stems = new Path();
  const dots = new Path();
  const branch = (x: number, y: number, a: number, l: number, depth: number) => {
    const x2 = x + Math.cos(a) * l;
    const y2 = y + Math.sin(a) * l;
    stems.M(x, y).Q((x + x2) / 2 + (r() - 0.5) * 8, (y + y2) / 2 + (r() - 0.5) * 8, x2, y2);
    if (depth === 0) {
      dots.circle(x2, y2, 3.6 + r() * 2);
      return;
    }
    const k = depth === 2 ? 3 : 3;
    for (let i = 0; i < k; i++) branch(x2, y2, a + (i - 1) * 0.55 + (r() - 0.5) * 0.3, l * (0.5 + r() * 0.2), depth - 1);
  };
  branch(bx, by, rad(angle - 90), len * 0.5, 2);
  return [
    { path: stems, stroke: "#8c9a78", strokeWidth: 1.3 },
    { path: dots, fill: "#ffffff", stroke: "#d8d2c0", strokeWidth: 0.8 },
  ];
}

function daisy(cx: number, cy: number, R: number, seed: number): PartSpec[] {
  const r = rng(seed);
  const pet = new Path();
  const n = 14;
  const off = r() * 30;
  for (let i = 0; i < n; i++) petal(pet, cx, cy, rad(off + (360 / n) * i), R * 0.22, R, R * 0.13, false);
  const c = new Path().circle(cx, cy, R * 0.27);
  const ring = new Path().circle(cx, cy, R * 0.15);
  return [
    { path: pet, fill: "#fffdf6", stroke: "#cfc6ad", strokeWidth: 1 },
    { path: c, fill: "#f0b43a", stroke: "#b87a1c", strokeWidth: 1 },
    { path: ring, fill: "#d98f1c", opacity: 0.8 },
  ];
}

function grass(bx: number, by: number, angle: number, len: number, color: string): PartSpec[] {
  const p = new Path();
  leaf(p, [bx, by], rad(angle - 90), len, len * 0.016);
  return [{ path: p, fill: color, stroke: "#3f5a33", strokeWidth: 0.6 }];
}

function bow(cx: number, cy: number, s: number): PartSpec[] {
  const loops = new Path();
  const tails = new Path();
  for (const m of [-1, 1]) {
    loops.M(cx, cy).C(cx + m * 30 * s, cy - 36 * s, cx + m * 68 * s, cy - 22 * s, cx + m * 60 * s, cy + 2 * s).C(cx + m * 56 * s, cy + 22 * s, cx + m * 22 * s, cy + 16 * s, cx, cy);
    tails.M(cx, cy).C(cx + m * 10 * s, cy + 30 * s, cx + m * 34 * s, cy + 52 * s, cx + m * 28 * s, cy + 86 * s);
  }
  const knot = new Path().circle(cx, cy, 8 * s);
  return [
    { path: tails, stroke: "#5b3d1f", strokeWidth: 6 * s + 2, opacity: 0.3 },
    { path: tails, stroke: "#dcc08c", strokeWidth: 5 * s },
    { path: loops, stroke: "#5b3d1f", strokeWidth: 6 * s + 2, opacity: 0.3 },
    { path: loops, stroke: "#dcc08c", strokeWidth: 5 * s },
    { path: knot, fill: "#c9a96e", stroke: "#8c6a3a", strokeWidth: 1.4 },
  ];
}

/** A hand-tied wildflower bunch (daisies, lavender, wheat, baby's breath, grasses) rooted at (cx, by). */
export function bunch(cx: number, by: number, scale: number, mirror: boolean, seed: number): Layer[] {
  const m = mirror ? -1 : 1;
  const s = scale * 0.74;
  const ang = (a: number) => a * 0.7 - 16;
  const r = rng(seed);
  const back: PartSpec[] = [];
  const mid: PartSpec[] = [];
  const front: PartSpec[] = [];
  for (let i = 0; i < 9; i++) back.push(...grass(cx + (r() - 0.5) * 40 * s, by, m * (-52 + i * 8 + r() * 6), (330 + r() * 160) * s, i % 2 ? "#6f8f55" : "#8aa56a"));
  const wl: [number, number][] = [[-30, 640], [-6, 700], [20, 620], [44, 560]];
  wl.forEach(([an, l], i) => back.push(...wheat(cx, by, m * ang(an), l * s, seed + i, 0.08 * m)));
  [[-44, 520], [-18, 560], [8, 500], [34, 470]].forEach(([an, l], i) => mid.push(...gyp(cx, by, m * ang(an), l * s, seed + 20 + i)));
  [[-36, 600], [-12, 640], [14, 590], [38, 520]].forEach(([an, l], i) => mid.push(...lavender(cx, by, m * ang(an), l * s, seed + 30 + i)));
  const dz: [number, number][] = [[-40, 400], [-22, 470], [-6, 410], [10, 500], [26, 430], [44, 380], [60, 330]];
  dz.forEach(([an, l], i) => {
    const a = rad(m * ang(an) - 90);
    const hx = cx + Math.cos(a) * l * s;
    const hy = by + Math.sin(a) * l * s;
    const st = new Path();
    st.M(cx, by).Q((cx + hx) / 2 - Math.sin(a) * 18 * s, (by + hy) / 2 + Math.cos(a) * 18 * s, hx, hy);
    front.push({ path: st, stroke: "#5f7f45", strokeWidth: 2.6 * s });
    front.push(...daisy(hx, hy, (34 + (i % 3) * 6) * s, seed + 50 + i));
  });
  // twine wrap + bow
  const wy = by - 130 * s;
  const wrap = new Path();
  for (let k = 0; k < 4; k++) wrap.M(cx - 34 * s, wy + k * 8 * s - 4 * s).Q(cx, wy + k * 8 * s + 6 * s, cx + 34 * s, wy + k * 8 * s - 4 * s);
  front.push({ path: wrap, stroke: "#5b3d1f", strokeWidth: 6, opacity: 0.3 }, { path: wrap, stroke: "#dcc08c", strokeWidth: 4.4 });
  front.push(...bow(cx, wy + 8 * s, 0.9 * s));
  return [place(back, 2), place(mid, 2), place(front, 2)];
}
