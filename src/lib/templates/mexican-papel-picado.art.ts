import { Path, leaf, petal, type PartSpec, type Pt } from "../design/path";
import { starPoints } from "../design/ornaments";
import type { OrnamentLayer } from "../design/types";
import { linear } from "./kit";
import { centerRotate } from "../design/layers";
import { place, rng } from "./summer-party.art";

/** Rotate a layer about the pivot point (px,py) in page coordinates. */
export function pivotRotate<T extends OrnamentLayer>(l: T, px: number, py: number, deg: number): T {
  const a = (deg * Math.PI) / 180;
  const dx = l.x + l.width / 2 - px;
  const dy = l.y + l.height / 2 - py;
  return centerRotate(l, px + dx * Math.cos(a) - dy * Math.sin(a), py + dx * Math.sin(a) + dy * Math.cos(a), deg);
}

export const M = {
  bg: "#0e3748",
  bgDeep: "#092633",
  pink: "#f0307f",
  orange: "#ff8a1f",
  yellow: "#ffd23f",
  teal: "#19b5a5",
  purple: "#8b4fe6",
  green: "#6cc24a",
  red: "#ec3b4b",
  cream: "#fff3dc",
  cobalt: "#1f4fa3",
  cobaltD: "#143779",
  marigold: "#ff9a00",
};

export const FLAG_COLORS = [M.pink, M.orange, M.yellow, M.teal, M.purple, M.green, M.red];

/** Sagging string y at x. */
export const sagY = (x: number, x0: number, x1: number, y0: number, sag: number) => {
  const t = (x - x0) / (x1 - x0);
  return y0 + sag * 4 * t * (1 - t);
};
export const sagSlopeDeg = (x: number, x0: number, x1: number, sag: number) => {
  const t = (x - x0) / (x1 - x0);
  return (Math.atan((sag * 4 * (1 - 2 * t)) / (x1 - x0)) * 180) / Math.PI;
};

/** A papel picado flag at (x,y) top-left. Holes are painted in the background colour. */
export function flagSpecs(x: number, y: number, w: number, h: number, color: string, kind: number, hole = M.bg): PartSpec[] {
  const body = new Path();
  const n = 6;
  const tw = w / n;
  body.M(x, y).L(x + w, y).L(x + w, y + h - 28);
  for (let i = 0; i < n; i++) {
    body.L(x + w - (i + 0.5) * tw, y + h);
    body.L(x + w - (i + 1) * tw, y + h - 28);
  }
  body.Z();
  const fold = new Path().M(x, y).L(x + w, y).L(x + w, y + 14).L(x, y + 14).Z();
  const holes = new Path();
  const dot = new Path();
  // dotted row under the fold
  for (let i = 0; i < 8; i++) holes.circle(x + (w * (i + 0.5)) / 8, y + 28, 3.2);
  // triangles above the fringe
  for (let i = 0; i < n; i++) {
    const cx = x + (i + 0.5) * tw;
    holes.M(cx, y + h - 68).L(cx - tw * 0.26, y + h - 44).L(cx + tw * 0.26, y + h - 44).Z();
  }
  const cx = x + w / 2;
  const cy = y + h * 0.46;
  const s = w / 130;
  if (kind % 4 === 0) {
    holes.circle(cx, cy, 20 * s);
    for (let i = 0; i < 8; i++) petal(holes, cx, cy, (i / 8) * Math.PI * 2, 27 * s, 52 * s, 9 * s, true);
    dot.circle(cx, cy, 8 * s);
    for (const [dx, dy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) holes.circle(cx + dx * 46 * s, cy + dy * 52 * s, 4.5 * s);
  } else if (kind % 4 === 1) {
    for (let k = -1; k <= 1; k++) {
      const yy = cy + k * 46 * s;
      const r = k === 0 ? 24 * s : 17 * s;
      holes.M(cx, yy - r * 1.3).L(cx + r, yy).L(cx, yy + r * 1.3).L(cx - r, yy).Z();
      dot.circle(cx, yy, 5 * s);
      holes.circle(cx - 44 * s, yy, 5 * s).circle(cx + 44 * s, yy, 5 * s);
    }
  } else if (kind % 4 === 2) {
    for (let row = 0; row < 2; row++) {
      const yy = cy - 28 * s + row * 52 * s;
      for (let i = -1; i <= 1; i++) {
        const ax = cx + i * 38 * s + (row ? 0 : 0);
        holes.M(ax - 15 * s, yy + 14 * s).L(ax - 15 * s, yy).A(15 * s, 15 * s, 0, 0, 1, ax + 15 * s, yy).L(ax + 15 * s, yy + 14 * s).Z();
        holes.include([ax, yy - 15 * s]);
      }
    }
    holes.circle(cx, cy + 66 * s, 8 * s);
  } else {
    const st = starPoints(cx, cy, 8, 46 * s, 22 * s);
    holes.poly(st, true);
    dot.circle(cx, cy, 9 * s);
    for (const a of [0, 90, 180, 270]) {
      const rr = (a * Math.PI) / 180;
      holes.circle(cx + Math.cos(rr) * 58 * s, cy + Math.sin(rr) * 58 * s, 5 * s);
    }
  }
  return [
    { path: body, fill: color },
    { path: fold, fill: "#000000", opacity: 0.16 },
    { path: holes, fill: hole },
    { path: dot, fill: color },
  ];
}

/** A string of flags from (x0,y0) to (x1,y0) with sag. Returns layers (string + flags). */
export function bunting(x0: number, x1: number, y0: number, sag: number, count: number, h: number, seed: number, colors = FLAG_COLORS, kindOffset = 0): OrnamentLayer[] {
  const layers: OrnamentLayer[] = [];
  const rnd = rng(seed);
  const string = new Path();
  string.M(x0, y0);
  for (let i = 1; i <= 24; i++) {
    const x = x0 + ((x1 - x0) * i) / 24;
    string.L(x, sagY(x, x0, x1, y0, sag));
  }
  layers.push(place([{ path: string, fill: null, stroke: "#f3e6c8", strokeWidth: 3 }], 3));
  const gap = 6;
  const w = (x1 - x0 - gap * (count + 1)) / count;
  for (let i = 0; i < count; i++) {
    const cx = x0 + gap + w / 2 + i * (w + gap);
    const ty = sagY(cx, x0, x1, y0, sag);
    const ang = sagSlopeDeg(cx, x0, x1, sag);
    const color = colors[(i + Math.floor(rnd() * 2)) % colors.length];
    const fl = place(flagSpecs(cx - w / 2, ty, w, h, colors[i % colors.length] ?? color, i + kindOffset), 2);
    layers.push(pivotRotate(fl, cx, ty, ang));
  }
  return layers;
}

/** Cempasuchil (marigold) flower. */
export function marigoldSpecs(cx: number, cy: number, R: number, rot = 0): PartSpec[] {
  const ring = (n: number, r0: number, r1: number, hw: number, off: number) => {
    const p = new Path();
    for (let i = 0; i < n; i++) petal(p, cx, cy, ((i + off) / n) * Math.PI * 2 + rot, r0 * R, r1 * R, hw * R, false);
    return p;
  };
  const dots = new Path();
  dots.circle(cx, cy, R * 0.12);
  const lines = new Path();
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 + rot;
    lines.M(cx + Math.cos(a) * R * 0.2, cy + Math.sin(a) * R * 0.2).L(cx + Math.cos(a) * R * 0.88, cy + Math.sin(a) * R * 0.88);
  }
  return [
    { path: ring(16, 0.2, 1, 0.2, 0), fill: "#e86a00" },
    { path: ring(13, 0.18, 0.82, 0.19, 0.5), fill: M.marigold },
    { path: ring(10, 0.12, 0.6, 0.19, 0.25), fill: "#ffb81f" },
    { path: lines, fill: null, stroke: "#c25200", strokeWidth: Math.max(1, R * 0.03), opacity: 0.35 },
    { path: ring(7, 0.05, 0.36, 0.17, 0.1), fill: "#ffd54a" },
    { path: dots, fill: "#c25200" },
  ];
}

export function marigold(cx: number, cy: number, R: number, rot = 0): OrnamentLayer {
  return place(marigoldSpecs(cx, cy, R, rot), 2);
}

/** Garland of marigolds along a sagging curve. */
export function garland(x0: number, x1: number, y0: number, sag: number, count: number, R: number, seed: number): OrnamentLayer[] {
  const rnd = rng(seed);
  const cord = new Path();
  const leaves = new Path();
  const specs: PartSpec[] = [];
  cord.M(x0, y0);
  for (let i = 1; i <= 30; i++) {
    const x = x0 + ((x1 - x0) * i) / 30;
    cord.L(x, sagY(x, x0, x1, y0, sag));
  }
  const pts: Pt[] = [];
  for (let i = 0; i < count; i++) {
    const x = x0 + ((x1 - x0) * (i + 0.5)) / count;
    pts.push([x, sagY(x, x0, x1, y0, sag)]);
  }
  pts.forEach(([x, y], i) => {
    leaf(leaves, [x, y], Math.PI / 2 + (i % 2 ? 0.9 : -0.9), R * 1.5, R * 0.5);
  });
  const out: OrnamentLayer[] = [];
  out.push(place([{ path: cord, fill: null, stroke: "#3b7d36", strokeWidth: 5 }, { path: leaves, fill: "#3f9a3d", stroke: "#2a6e2a", strokeWidth: 1 }], 3));
  pts.forEach(([x, y]) => {
    const r = R * (0.88 + rnd() * 0.24);
    specs.push(...marigoldSpecs(x, y, r, rnd() * 6));
  });
  out.push(place(specs, 2));
  return out;
}

/** Talavera tile band. */
export function talaveraBand(x: number, y: number, w: number, rows: number, t: number): OrnamentLayer {
  const cols = Math.round(w / t);
  const sq = new Path();
  const rosette = new Path();
  const corner = new Path();
  const dots = new Path();
  const inner = new Path();
  const ring = new Path();
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const x0 = x + i * t;
      const y0 = y + j * t;
      const cx = x0 + t / 2;
      const cy = y0 + t / 2;
      sq.M(x0, y0).L(x0 + t, y0).L(x0 + t, y0 + t).L(x0, y0 + t).Z();
      inner.M(x0 + 4, y0 + 4).L(x0 + t - 4, y0 + 4).L(x0 + t - 4, y0 + t - 4).L(x0 + 4, y0 + t - 4).Z();
      for (let k = 0; k < 8; k++) petal(rosette, cx, cy, (k / 8) * Math.PI * 2 + Math.PI / 8, t * 0.06, t * 0.34, t * 0.08, true);
      ring.circle(cx, cy, t * 0.2);
      dots.circle(cx, cy, t * 0.07);
      const r = t * 0.26;
      for (const [qx, qy] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) {
        const px = qx === 1 ? x0 : x0 + t;
        const py = qy === 1 ? y0 : y0 + t;
        const sw = qx * qy === 1 ? 1 : 0;
        corner.M(px + qx * r, py).A(r, r, 0, 0, sw, px, py + qy * r).L(px, py).Z();
        corner.include([px + qx * r, py + qy * r]);
      }
    }
  }
  return place(
    [
      { path: sq, fill: "#fbf3df", stroke: M.cobaltD, strokeWidth: 2.5 },
      { path: inner, fill: null, stroke: M.cobalt, strokeWidth: 1.4, opacity: 0.7 },
      { path: corner, fill: M.cobalt },
      { path: rosette, fill: M.cobalt },
      { path: ring, fill: "#fbf3df", stroke: M.orange, strokeWidth: 2.5 },
      { path: dots, fill: M.yellow },
    ],
    2,
  );
}

/** Scatter of loose marigold petals. */
export function petalsScatter(seed: number, area: [number, number, number, number], n: number, skip?: (x: number, y: number) => boolean): OrnamentLayer {
  const rnd = rng(seed);
  const a = new Path();
  const b = new Path();
  for (let i = 0; i < n; i++) {
    const x = area[0] + rnd() * (area[2] - area[0]);
    const y = area[1] + rnd() * (area[3] - area[1]);
    if (skip?.(x, y)) continue;
    petal(rnd() > 0.5 ? a : b, x, y, rnd() * 6.28, 0, 16 + rnd() * 10, 5 + rnd() * 3, false);
  }
  return place([{ path: a, fill: M.orange, opacity: 0.85 }, { path: b, fill: M.yellow, opacity: 0.85 }], 2);
}

export const bgGrad = linear(90, [0, "#0e3a4c"], [1, "#0b2d3c"]);
