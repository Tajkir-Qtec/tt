import { Path, type PartSpec, type Pt } from "../design/path";
import type { Layer, OrnamentLayer } from "../design/types";
import { linear, radial } from "./kit";
import { ellipsePath, place } from "./birthday-balloons-bold.art";

export const INK = "#0b0612";
export const ORANGE = "#ff7a1a";
export const ORANGE_L = "#ffb347";
export const LILAC = "#cdb8f0";
export const CREAM = "#f7ead2";

/** Radial glow that fades to fully transparent. */
export function glow(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  const c = `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
  return radial([0, `rgba(${c},${a})`], [0.4, `rgba(${c},${a * 0.45})`], [1, `rgba(${c},0)`]);
}

/** A soft glow as its own layer (gradients are sized per layer, so each glow must be separate). */
export function glowDisc(cx: number, cy: number, r: number, hex: string, a: number): OrnamentLayer {
  return place([{ path: ellipsePath(cx, cy, r, r), fill: glow(hex, a) }], 0);
}

export function moonHalo(cx: number, cy: number, r: number): Layer[] {
  return [glowDisc(cx, cy, r * 2, "#ffb347", 0.3), glowDisc(cx, cy, r * 1.4, "#ffe2b0", 0.4)];
}

export function pumpkinGlow(cx: number, baseY: number, r: number): Layer {
  return glowDisc(cx, baseY - r * 0.78, r * 1.7, ORANGE, 0.5);
}

const rad = (d: number) => (d * Math.PI) / 180;
const quad = (p0: Pt, p1: Pt, p2: Pt, t: number): Pt => [(1 - t) * (1 - t) * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0], (1 - t) * (1 - t) * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1]];

/** Full moon with halo, craters and a soft limb. */
export function moon(cx: number, cy: number, r: number): OrnamentLayer {
  const specs: PartSpec[] = [];
  specs.push({ path: ellipsePath(cx, cy, r, r), fill: linear(60, [0, "#fff6dc"], [0.55, "#ffe3a8"], [1, "#f2b66b"]) });
  for (const [dx, dy, rr, op] of [[-0.35, -0.3, 0.2, 0.16], [0.28, -0.42, 0.12, 0.14], [0.38, 0.1, 0.22, 0.15], [-0.15, 0.38, 0.16, 0.14], [-0.5, 0.18, 0.09, 0.15], [0.05, -0.05, 0.08, 0.1]] as const) {
    specs.push({ path: ellipsePath(cx + dx * r, cy + dy * r, rr * r, rr * r), fill: "#c98a4a", opacity: op });
  }
  return place(specs, 2);
}

/** Stylised bat. w = half wingspan. */
export function bat(cx: number, cy: number, w: number, rotDeg = 0, color = INK): OrnamentLayer {
  const a = rad(rotDeg);
  const m = (x: number, y: number): Pt => {
    const px = x * w;
    const py = y * w;
    return [cx + px * Math.cos(a) - py * Math.sin(a), cy + px * Math.sin(a) + py * Math.cos(a)];
  };
  const p = new Path();
  for (const sg of [1, -1]) {
    const q = (x: number, y: number) => m(x * sg, y);
    const s0 = q(0.05, -0.05);
    const c1 = q(0.25, -0.55);
    const c2 = q(0.72, -0.6);
    const t = q(1.0, -0.28);
    p.M(s0[0], s0[1]).C(c1[0], c1[1], c2[0], c2[1], t[0], t[1]);
    const pts: [number, number, number, number][] = [
      [0.93, -0.08, 0.82, 0.06],
      [0.74, -0.04, 0.64, 0.14],
      [0.52, 0.02, 0.4, 0.15],
      [0.28, 0.07, 0.14, 0.14],
    ];
    for (const [cx1, cy1, x1, y1] of pts) {
      const c = q(cx1, cy1);
      const e = q(x1, y1);
      p.Q(c[0], c[1], e[0], e[1]);
    }
    const z = q(0, 0.1);
    p.L(z[0], z[1]).Z();
  }
  const body = new Path();
  const bc = m(0, 0.04);
  body.M(bc[0], bc[1]);
  const bb = ellipsePath(bc[0], bc[1], 0.1 * w, 0.2 * w, rotDeg + 90);
  const head = ellipsePath(m(0, -0.17)[0], m(0, -0.17)[1], 0.085 * w, 0.085 * w);
  const ears = new Path();
  for (const sg of [1, -1]) {
    const e1 = m(0.02 * sg, -0.22);
    const e2 = m(0.08 * sg, -0.36);
    const e3 = m(0.09 * sg, -0.2);
    ears.poly([e1, e2, e3], true);
  }
  return place([{ path: p, fill: color }, { path: bb, fill: color }, { path: head, fill: color }, { path: ears, fill: color }], 2);
}

/** Bare twisted tree silhouette. (x, baseY) = trunk base; h = height. */
export function deadTree(x: number, baseY: number, h: number, flip = false, color = INK): OrnamentLayer {
  const fx = flip ? -1 : 1;
  const P = (dx: number, dy: number): Pt => [x + fx * dx, baseY - dy];
  const specs: PartSpec[] = [];
  const seg = (p0: Pt, p1: Pt, p2: Pt, w0: number, w1: number, n: number) => {
    for (let i = 0; i < n; i++) {
      const a = quad(p0, p1, p2, i / n);
      const b = quad(p0, p1, p2, (i + 1) / n);
      specs.push({ path: new Path().M(a[0], a[1]).L(b[0], b[1]), stroke: color, strokeWidth: w0 + (w1 - w0) * ((i + 0.5) / n) });
    }
  };
  const k = h / 400;
  seg(P(0, 0), P(-30 * k, 120 * k), P(10 * k, 260 * k), 44 * k, 20 * k, 16);
  const branch = (from: Pt, c: Pt, to: Pt, w: number, depth: number) => {
    seg(from, c, to, w, w * 0.55, 8);
    if (depth > 0) {
      const mid = quad(from, c, to, 0.55);
      const dx = to[0] - from[0];
      const dy = to[1] - from[1];
      const len = Math.hypot(dx, dy);
      const nx = (-dy / len) * (depth % 2 ? 1 : -1);
      const ny = (dx / len) * (depth % 2 ? 1 : -1);
      const tw: Pt = [mid[0] + dx * 0.4 + nx * len * 0.35, mid[1] + dy * 0.4 + ny * len * 0.35];
      branch(mid, [mid[0] + dx * 0.15 + nx * len * 0.2, mid[1] + dy * 0.15 + ny * len * 0.1], tw, w * 0.5, depth - 1);
      branch(to, [to[0] + dx * 0.2 + nx * -len * 0.1, to[1] + dy * 0.3], [to[0] + dx * 0.45 - nx * len * 0.25, to[1] + dy * 0.55 - ny * len * 0.25], w * 0.4, depth - 1);
    }
  };
  const top = P(10 * k, 260 * k);
  branch(P(-8 * k, 150 * k), P(-80 * k, 190 * k), P(-120 * k, 270 * k), 18 * k, 2);
  branch(P(0, 200 * k), P(60 * k, 250 * k), P(110 * k, 340 * k), 16 * k, 2);
  branch(top, P(-10 * k, 320 * k), P(-40 * k, h), 14 * k, 2);
  branch(top, P(50 * k, 300 * k), P(70 * k, 380 * k), 11 * k, 1);
  // roots
  const roots = new Path();
  roots.M(...P(-18 * k, 14 * k)).Q(...P(-50 * k, 6 * k), ...P(-78 * k, 0)).M(...P(14 * k, 12 * k)).Q(...P(46 * k, 4 * k), ...P(74 * k, 0));
  specs.push({ path: roots, stroke: color, strokeWidth: 12 * k });
  return place(specs, 2);
}

/** Haunted manor silhouette with glowing windows and an iron fence. (cx, baseY) = ground centre. */
export function manor(cx: number, baseY: number, s = 1, color = INK): OrnamentLayer {
  const specs: PartSpec[] = [];
  const X = (v: number) => cx + v * s;
  const Y = (v: number) => baseY + v * s;
  const poly = (pts: [number, number][]) => new Path().poly(pts.map(([a, b]) => [X(a), Y(b)] as Pt), true);
  const dark = { fill: color, stroke: "#5a2f8a", strokeWidth: 1.6, opacity: 1 };
  // far glow behind the house
  // chimney
  specs.push({ path: poly([[62, -350], [96, -350], [96, -230], [62, -230]]), ...dark });
  // main body and roof
  specs.push({ path: poly([[-150, -190], [150, -190], [150, 0], [-150, 0]]), ...dark });
  specs.push({ path: poly([[-182, -186], [0, -330], [182, -186]]), ...dark });
  // left tower
  specs.push({ path: poly([[-252, -300], [-170, -300], [-170, 0], [-252, 0]]), ...dark });
  specs.push({ path: poly([[-268, -296], [-211, -420], [-154, -296]]), ...dark });
  // right tower (tall) with spire
  specs.push({ path: poly([[172, -360], [250, -360], [250, 0], [172, 0]]), ...dark });
  specs.push({ path: poly([[158, -356], [211, -500], [264, -356]]), ...dark });
  specs.push({ path: new Path().M(X(211), Y(-500)).L(X(211), Y(-548)), stroke: color, strokeWidth: 3 * s });
  specs.push({ path: poly([[211, -548], [236, -540], [211, -532]]), fill: color });
  // right low wing
  specs.push({ path: poly([[250, -126], [336, -126], [336, 0], [250, 0]]), ...dark });
  specs.push({ path: poly([[240, -122], [293, -186], [346, -122]]), ...dark });
  // left low wing
  specs.push({ path: poly([[-336, -110], [-252, -110], [-252, 0], [-336, 0]]), ...dark });
  specs.push({ path: poly([[-346, -106], [-294, -160], [-242, -106]]), ...dark });
  // porch
  specs.push({ path: poly([[-48, -84], [0, -118], [48, -84]]), ...dark });
  // roof trim highlights
  const trim = new Path();
  for (const [a, b, c, d] of [[-182, -186, 0, -330], [0, -330, 182, -186], [-268, -296, -211, -420], [-211, -420, -154, -296], [158, -356, 211, -500], [211, -500, 264, -356]] as const) trim.M(X(a), Y(b)).L(X(c), Y(d));
  specs.push({ path: trim, stroke: "#8a55c8", strokeWidth: 1.8, opacity: 0.55 });
  // windows
  const winFill = linear(90, [0, "#ffd470"], [1, "#ff7a1a"]);
  const win = (wx: number, wy: number, w: number, h: number, g = true) => {
    const p = new Path();
    const l = X(wx - w / 2);
    const r = X(wx + w / 2);
    const top = Y(wy - h);
    const bot = Y(wy);
    const rr = (w / 2) * s;
    p.M(l, bot).L(l, top + rr).A(rr, rr, 0, 0, 1, r, top + rr).L(r, bot).Z();
    p.include([X(wx), top]);
    void g;
    specs.push({ path: p, fill: winFill });
    const bars = new Path();
    bars.M(X(wx), top + 2).L(X(wx), bot).M(l, Y(wy - h * 0.42)).L(r, Y(wy - h * 0.42));
    specs.push({ path: bars, stroke: color, strokeWidth: 2.2 * s });
  };
  win(-72, -96, 38, 74);
  win(72, -140, 38, 74, false);
  win(-211, -230, 30, 58);
  win(211, -170, 30, 58, false);
  win(211, -280, 30, 58);
  win(-294, -50, 28, 44, false);
  win(293, -48, 28, 44);
  // round attic window
  specs.push({ path: ellipsePath(X(0), Y(-250), 22 * s, 22 * s), fill: winFill });
  specs.push({ path: new Path().M(X(0), Y(-272)).L(X(0), Y(-228)).M(X(-22), Y(-250)).L(X(22), Y(-250)), stroke: color, strokeWidth: 2.4 * s });
  // door
  const door = new Path();
  door.M(X(-26), Y(0)).L(X(-26), Y(-56)).A(26 * s, 26 * s, 0, 0, 1, X(26), Y(-56)).L(X(26), Y(0)).Z();
  door.include([X(0), Y(-82)]);
  specs.push({ path: door, fill: linear(90, [0, "#ffb347"], [1, "#d04a00"]), opacity: 0.9 });
  specs.push({ path: new Path().M(X(0), Y(-80)).L(X(0), Y(0)), stroke: color, strokeWidth: 2.4 * s });
  // fence
  const fence = new Path();
  for (let v = -400; v <= 400; v += 20) {
    if (Math.abs(v) < 40) continue;
    fence.M(X(v), Y(0)).L(X(v), Y(-62));
    fence.M(X(v - 5), Y(-62)).L(X(v), Y(-76)).L(X(v + 5), Y(-62));
  }
  fence.M(X(-400), Y(-30)).L(X(-40), Y(-30)).M(X(40), Y(-30)).L(X(400), Y(-30));
  specs.push({ path: fence, stroke: color, strokeWidth: 3.2 * s, lineJoin: "miter" });
  return place(specs, 3);
}

/** Jack-o'-lantern with glowing carved face. (cx, baseY) = bottom centre. */
export function pumpkin(cx: number, baseY: number, r: number, face = true): OrnamentLayer {
  const specs: PartSpec[] = [];
  const cy = baseY - r * 0.78;
  const lobes: [number, number, number][] = [[-0.52, 0.62, 0.9], [0.52, 0.62, 0.9], [-0.28, 0.76, 0.98], [0.28, 0.76, 0.98], [0, 0.8, 1]];
  lobes.forEach(([dx, rx, ry], i) => {
    const cols = ["#c9480b", "#c9480b", "#e8620f", "#e8620f", "#ff7a1a"];
    specs.push({ path: ellipsePath(cx + dx * r, cy, rx * r, ry * r * 0.85), fill: cols[i], stroke: "#8f2f05", strokeWidth: 2 });
  });
  const ridges = new Path();
  for (const dx of [-0.26, 0.26]) ridges.M(cx + dx * r, cy - r * 0.8).Q(cx + dx * r * 1.1, cy, cx + dx * r, cy + r * 0.8);
  specs.push({ path: ridges, stroke: "#8f2f05", strokeWidth: 2, opacity: 0.5 });
  const stem = new Path();
  stem.poly([[cx - r * 0.1, cy - r * 0.78], [cx + r * 0.12, cy - r * 0.78], [cx + r * 0.2, cy - r * 1.12], [cx + r * 0.02, cy - r * 1.04]], true);
  specs.push({ path: stem, fill: "#4a5a1f", stroke: "#2f3a12", strokeWidth: 2 });
  if (face) {
    const g = linear(90, [0, "#fff0a0"], [1, "#ff9a1a"]);
    const eyeL = new Path().poly([[cx - r * 0.5, cy - r * 0.08], [cx - r * 0.18, cy - r * 0.08], [cx - r * 0.34, cy - r * 0.4]], true);
    const eyeR = new Path().poly([[cx + r * 0.5, cy - r * 0.08], [cx + r * 0.18, cy - r * 0.08], [cx + r * 0.34, cy - r * 0.4]], true);
    const nose = new Path().poly([[cx - r * 0.07, cy + r * 0.04], [cx + r * 0.07, cy + r * 0.04], [cx, cy + r * 0.17]], true);
    const mouth = new Path();
    const mw = r * 0.62;
    mouth.M(cx - mw, cy + r * 0.26);
    const n = 6;
    for (let i = 1; i <= n; i++) {
      const x = cx - mw + (2 * mw * i) / n;
      const y = cy + r * 0.26 + Math.sin((i / n) * Math.PI) * r * 0.2 + (i % 2 ? r * 0.12 : 0);
      mouth.L(x, y);
    }
    mouth.L(cx + mw, cy + r * 0.26).Q(cx, cy + r * 0.52, cx - mw, cy + r * 0.26).Z();
    mouth.include([cx, cy + r * 0.5]);
    specs.push({ path: eyeL, fill: g });
    specs.push({ path: eyeR, fill: g });
    specs.push({ path: nose, fill: g });
    specs.push({ path: mouth, fill: g });
  }
  return place(specs, 3);
}

/** Spider web filling a page corner; (cx, cy) = the corner, dirX/dirY = +1/-1 toward the page interior. */
export function web(cx: number, cy: number, R: number, dirX: 1 | -1, dirY: 1 | -1, spider = true): OrnamentLayer {
  const specs: PartSpec[] = [];
  const spokes = 6;
  const P = (ang: number, r: number): Pt => [cx + dirX * Math.cos(rad(ang)) * r, cy + dirY * Math.sin(rad(ang)) * r];
  const lines = new Path();
  for (let i = 0; i <= spokes; i++) {
    const a = P((90 * i) / spokes, R);
    lines.M(cx, cy).L(a[0], a[1]);
  }
  specs.push({ path: lines, stroke: "#ffffff", strokeWidth: 1.6, opacity: 0.4 });
  const arcs = new Path();
  for (let k = 1; k <= 7; k++) {
    const r = (R * k) / 7;
    for (let i = 0; i < spokes; i++) {
      const a = P((90 * i) / spokes, r);
      const b = P((90 * (i + 1)) / spokes, r);
      const c = P((90 * (i + 0.5)) / spokes, r * 0.84);
      if (i === 0) arcs.M(a[0], a[1]);
      arcs.Q(c[0], c[1], b[0], b[1]);
    }
  }
  specs.push({ path: arcs, stroke: "#ffffff", strokeWidth: 1.4, opacity: 0.32 });
  if (spider) {
    const sx = cx + dirX * R * 0.5;
    const sy = cy + dirY * R * 0.98;
    const thread = new Path().M(sx, cy + dirY * R * 0.28).L(sx, sy);
    specs.push({ path: thread, stroke: "#ffffff", strokeWidth: 1.4, opacity: 0.5 });
    const legs = new Path();
    for (const sg of [1, -1]) for (const k of [0, 1, 2, 3]) {
      const ang = (k - 1.5) * 0.5;
      legs.M(sx, sy + 12).Q(sx + sg * (20 + k * 2), sy + 12 + ang * 30 - 8, sx + sg * (26 + k * 3), sy + 12 + (k - 1.2) * 14);
    }
    specs.push({ path: legs, stroke: INK, strokeWidth: 2.6, opacity: 0.9 });
    specs.push({ path: ellipsePath(sx, sy + 14, 12, 15), fill: INK });
    specs.push({ path: ellipsePath(sx, sy, 7, 7), fill: INK });
    specs.push({ path: ellipsePath(sx - 2.4, sy - 1, 1.6, 1.6), fill: "#ff3b3b" });
    specs.push({ path: ellipsePath(sx + 2.4, sy - 1, 1.6, 1.6), fill: "#ff3b3b" });
  }
  return place(specs, 3);
}

/** Low drifting fog bank made of soft round puffs (one layer per puff). */
export function fog(cx: number, cy: number, w: number, h: number, op = 0.14): Layer[] {
  const out: Layer[] = [];
  const n = Math.max(3, Math.round(w / 230));
  for (let i = 0; i < n; i++) {
    const x = cx - w / 2 + (w * (i + 0.5)) / n;
    const r = h * (1.7 + (i % 2) * 0.6);
    out.push(glowDisc(x, cy + (i % 2 ? -h * 0.1 : h * 0.1), r, "#cdb8f0", op * 2.6));
  }
  return out;
}

/** Soft warm glow behind the manor and its lit windows (draw after the silhouette for window bloom). */
export function manorGlow(cx: number, baseY: number, s = 1, back = true): Layer[] {
  const X = (v: number) => cx + v * s;
  const Y = (v: number) => baseY + v * s;
  const out: Layer[] = [];
  if (back) out.push(glowDisc(X(0), Y(-190), 330 * s, "#8a4ac0", 0.5));
  else for (const [wx, wy, , h] of [[-72, -96, 38, 74], [-211, -230, 30, 58], [211, -280, 30, 58], [293, -48, 28, 44]] as const) out.push(glowDisc(X(wx), Y(wy - h / 2), h * 1.1 * s, ORANGE, 0.5));
  return out;
}
