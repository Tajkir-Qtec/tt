import { centerRotate } from "../design/layers";
import { Path, leaf, petal, type PartSpec, type Pt } from "../design/path";
import type { Layer, OrnamentLayer, Paint } from "../design/types";
import { linear, lock, O, radial, S, T, W } from "./kit";
import { ellipsePath, place, rng } from "./birthday-balloons-bold.art";

export { ellipsePath, place, rng };

export const rad = (d: number) => (d * Math.PI) / 180;
export const polar = (cx: number, cy: number, r: number, aDeg: number): Pt => [cx + Math.cos(rad(aDeg)) * r, cy + Math.sin(rad(aDeg)) * r];

/** Rotate an ornament layer about its own centre. */
export const tilt = <T extends Layer>(l: T, deg: number): T => ({ ...l, rotation: deg });
export const rotAbout = <T extends Layer>(l: T, cx: number, cy: number, deg: number): T => centerRotate(l, cx, cy, deg);

/* -------------------------------- water & waves ------------------------------- */

export function waveShape(y: number, amp: number, wl: number, phase: number, bottom: number, x0 = -10, x1 = W + 10): Path {
  const p = new Path();
  const yy = (x: number) => y + Math.sin(((x - x0) / wl) * Math.PI * 2 + phase) * amp;
  p.M(x0, yy(x0));
  for (let x = x0 + 8; x <= x1; x += 8) p.L(x, yy(x));
  p.L(x1, bottom).L(x0, bottom).Z();
  return p;
}
export function waveLine(y: number, amp: number, wl: number, phase: number, x0 = -10, x1 = W + 10): Path {
  const p = new Path();
  const yy = (x: number) => y + Math.sin(((x - x0) / wl) * Math.PI * 2 + phase) * amp;
  p.M(x0, yy(x0));
  for (let x = x0 + 8; x <= x1; x += 8) p.L(x, yy(x));
  return p;
}

function blob(p: Path, cx: number, cy: number, r: number, r2: number, rnd: () => number, n = 7) {
  const pts: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + rnd() * 0.5;
    const k = 0.65 + rnd() * 0.5;
    pts.push([cx + Math.cos(a) * r * k, cy + Math.sin(a) * r2 * k]);
  }
  const mid = (a: Pt, b: Pt): Pt => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const m0 = mid(pts[n - 1], pts[0]);
  p.M(m0[0], m0[1]);
  for (let i = 0; i < n; i++) {
    const m = mid(pts[i], pts[(i + 1) % n]);
    p.Q(pts[i][0], pts[i][1], m[0], m[1]);
  }
  p.Z();
}

/** Light caustic network as seen on a pool floor. */
export function caustics(seed: number, area: [number, number, number, number], count: number, size = 1, skip?: (x: number, y: number) => boolean): OrnamentLayer {
  const r = rng(seed);
  const fine = new Path();
  const glow = new Path();
  let n = 0;
  let guard = 0;
  while (n < count && guard++ < count * 20) {
    const x = area[0] + r() * (area[2] - area[0]);
    const y = area[1] + r() * (area[3] - area[1]);
    if (skip?.(x, y)) continue;
    n++;
    const rr = (34 + r() * 46) * size;
    blob(fine, x, y, rr, rr * (0.55 + r() * 0.3), r, 6 + Math.floor(r() * 3));
    if (r() > 0.55) blob(glow, x + 6, y + 4, rr * 0.8, rr * 0.5, r, 6);
  }
  return place(
    [
      { path: glow, stroke: "#ffffff", strokeWidth: 12 * size, opacity: 0.08 },
      { path: fine, stroke: "#ffffff", strokeWidth: 2.6 * size, opacity: 0.42 },
    ],
    2,
  );
}

export function ripples(cx: number, cy: number, rx: number, ry: number, rings: number, color = "#ffffff", op = 0.6, sw = 3): OrnamentLayer {
  const specs: PartSpec[] = [];
  for (let i = 0; i < rings; i++) {
    const k = 1 + i * 0.42;
    specs.push({ path: ellipsePath(cx, cy, rx * k, ry * k), stroke: color, strokeWidth: sw, opacity: op * (1 - i / (rings + 0.8)) });
  }
  return place(specs, 2);
}

/* ------------------------------- pool toys ----------------------------------- */

export function sunglasses(cx: number, cy: number, w: number, frame = "#1c1b3a", lens: Paint = linear(90, [0, "#34e0d6"], [1, "#ff4f9a"])): OrnamentLayer {
  const lw = w * 0.42;
  const lh = w * 0.3;
  const gap = w * 0.08;
  const lensPath = (mx: number) => {
    const l = mx - lw / 2;
    const r = mx + lw / 2;
    const t = cy - lh / 2;
    const b = cy + lh / 2;
    const p = new Path();
    p.M(l, t).L(r, t).C(r, t + lh * 0.95, r - lw * 0.18, b, mx, b).C(l + lw * 0.18, b, l, t + lh * 0.95, l, t).Z();
    return p;
  };
  const lx = cx - gap / 2 - lw / 2;
  const rx = cx + gap / 2 + lw / 2;
  const L = lensPath(lx);
  const R = lensPath(rx);
  const bridge = new Path().M(lx + lw / 2, cy - lh * 0.28).Q(cx, cy - lh * 0.62, rx - lw / 2, cy - lh * 0.28);
  const armL = new Path().M(lx - lw / 2, cy - lh * 0.4).L(lx - lw / 2 - w * 0.1, cy - lh * 0.3);
  const armR = new Path().M(rx + lw / 2, cy - lh * 0.4).L(rx + lw / 2 + w * 0.1, cy - lh * 0.3);
  const glint = (mx: number) =>
    new Path().poly(
      [
        [mx - lw * 0.32, cy - lh * 0.38],
        [mx - lw * 0.1, cy - lh * 0.38],
        [mx - lw * 0.28, cy + lh * 0.12],
        [mx - lw * 0.42, cy + lh * 0.12],
      ],
      true,
    );
  return place(
    [
      { path: armL, stroke: frame, strokeWidth: w * 0.035 },
      { path: armR, stroke: frame, strokeWidth: w * 0.035 },
      { path: L, fill: lens, stroke: frame, strokeWidth: w * 0.04 },
      { path: R, fill: lens, stroke: frame, strokeWidth: w * 0.04 },
      { path: bridge, stroke: frame, strokeWidth: w * 0.04 },
      { path: glint(lx), fill: "#ffffff", opacity: 0.45 },
      { path: glint(rx), fill: "#ffffff", opacity: 0.45 },
    ],
    3,
  );
}

/** Flamingo pool float (side view), `s` = scale, (cx,cy) = body centre. */
export function flamingo(cx: number, cy: number, s: number, body = "#ff6fa4", dark = "#e0407f", light = "#ffb3cf"): OrnamentLayer {
  const X = (x: number) => cx + x * s;
  const Y = (y: number) => cy + y * s;
  const bodyP = ellipsePath(X(0), Y(0), 135 * s, 56 * s, -3);
  const neck = new Path().M(X(100), Y(-22)).C(X(172), Y(-62), X(30), Y(-118), X(96), Y(-186));
  const neckHi = new Path().M(X(92), Y(-30)).C(X(150), Y(-62), X(40), Y(-112), X(88), Y(-170));
  const head = new Path().circle(X(108), Y(-206), 21 * s);
  const beak = new Path().poly([[X(124), Y(-222)], [X(170), Y(-194)], [X(127), Y(-190)]], true);
  const beakTip = new Path().poly([[X(150), Y(-206)], [X(170), Y(-194)], [X(152), Y(-192)]], true);
  const eye = new Path().circle(X(113), Y(-212), 4.2 * s);
  const tail = new Path();
  leaf(tail, [X(-120), Y(-12)], rad(200), 80 * s, 20 * s);
  leaf(tail, [X(-118), Y(-4)], rad(180), 84 * s, 18 * s);
  const wing = new Path();
  leaf(wing, [X(60), Y(-8)], rad(172), 130 * s, 26 * s, true);
  const belly = ellipsePath(X(8), Y(30), 105 * s, 18 * s, -2);
  const water = new Path();
  water.M(X(-150), Y(46)).Q(X(-70), Y(70), X(0), Y(58)).Q(X(80), Y(70), X(150), Y(46));
  return place(
    [
      { path: ellipsePath(X(0), Y(60), 150 * s, 18 * s), fill: "#0a7f9c", opacity: 0.18 },
      { path: tail, fill: dark },
      { path: neck, stroke: dark, strokeWidth: 30 * s },
      { path: neck, stroke: body, strokeWidth: 24 * s },
      { path: neckHi, stroke: light, strokeWidth: 5 * s, opacity: 0.7 },
      { path: bodyP, fill: linear(90, [0, light], [0.35, body], [1, dark]) },
      { path: belly, fill: dark, opacity: 0.25 },
      { path: wing, fill: dark, opacity: 0.55 },
      { path: head, fill: body },
      { path: beak, fill: "#ffb347" },
      { path: beakTip, fill: "#2a1a3a" },
      { path: eye, fill: "#2a1a3a" },
      { path: ellipsePath(X(-40), Y(-30), 46 * s, 7 * s, -6), fill: "#ffffff", opacity: 0.55 },
      { path: water, stroke: "#ffffff", strokeWidth: 4 * s, opacity: 0.8 },
    ],
    4,
  );
}

/** Top-down donut float. */
export function donutFloat(cx: number, cy: number, R: number, icing = "#ff7eb6", icingDark = "#ff4f9a", seed = 5): OrnamentLayer {
  const r = rng(seed);
  const dough = new Path().circle(cx, cy, R * 0.72);
  const wob = new Path();
  const N = 36;
  for (let i = 0; i <= N; i++) {
    const a = (i / N) * Math.PI * 2;
    const k = 1 + Math.sin(a * 7) * 0.035;
    const [x, y] = [cx + Math.cos(a) * R * 0.69 * k, cy + Math.sin(a) * R * 0.69 * k];
    if (i === 0) wob.M(x, y);
    else wob.L(x, y);
  }
  wob.Z();
  const hole = new Path().circle(cx, cy, R * 0.34);
  const colors = ["#ffffff", "#ffe14a", "#38d6c8", "#7c5cff", "#ff8a3d"];
  const spr = new Map<string, Path>();
  for (let i = 0; i < 34; i++) {
    const a = r() * 360;
    const rr = R * (0.5 + r() * 0.36);
    const [x, y] = polar(cx, cy, rr, a);
    const ang = r() * Math.PI;
    const c = colors[i % colors.length];
    const p = spr.get(c) ?? spr.set(c, new Path()).get(c)!;
    p.M(x - Math.cos(ang) * 8, y - Math.sin(ang) * 8).L(x + Math.cos(ang) * 8, y + Math.sin(ang) * 8);
  }
  const hi = new Path();
  const a0 = rad(200);
  const a1 = rad(260);
  hi.M(cx + Math.cos(a0) * R * 0.88, cy + Math.sin(a0) * R * 0.88).A(R * 0.88, R * 0.88, 0, 0, 1, cx + Math.cos(a1) * R * 0.88, cy + Math.sin(a1) * R * 0.88);
  hi.include([cx - R, cy - R], [cx + R, cy + R]);
  const specs: PartSpec[] = [
    { path: new Path().circle(cx + 10, cy + 16, R * 0.72), stroke: "#066b86", strokeWidth: R * 0.58, opacity: 0.16 },
    { path: dough, stroke: "#e8b36a", strokeWidth: R * 0.62 },
    { path: dough, stroke: "#f5cf8e", strokeWidth: R * 0.5, opacity: 0.6 },
    { path: wob, stroke: icingDark, strokeWidth: R * 0.5 },
    { path: wob, stroke: icing, strokeWidth: R * 0.44 },
    { path: hole, fill: "#16b8d4", opacity: 0.0 },
  ];
  spr.forEach((p, c) => specs.push({ path: p, stroke: c, strokeWidth: 5.5 }));
  specs.push({ path: hi, stroke: "#ffffff", strokeWidth: 7, opacity: 0.7 });
  return place(specs, 3);
}

/** Red/white lifebuoy ring. */
export function lifebuoy(cx: number, cy: number, R: number, colors: [string, string] = ["#ff4a4a", "#ffffff"]): OrnamentLayer {
  const specs: PartSpec[] = [{ path: new Path().circle(cx + 8, cy + 14, R), stroke: "#066b86", strokeWidth: R * 0.42, opacity: 0.16 }];
  const n = 8;
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * 360;
    const a1 = ((i + 1) / n) * 360;
    const p = new Path();
    const s = polar(cx, cy, R, a0);
    const e = polar(cx, cy, R, a1);
    p.M(s[0], s[1]).A(R, R, 0, 0, 1, e[0], e[1]);
    p.include([cx - R, cy - R], [cx + R, cy + R]);
    specs.push({ path: p, stroke: colors[i % 2], strokeWidth: R * 0.42, lineCap: "butt" });
  }
  specs.push({ path: new Path().circle(cx, cy, R * 1.17), stroke: "#2a1a3a", strokeWidth: 2.5, opacity: 0.25 });
  specs.push({ path: new Path().circle(cx, cy, R * 0.83), stroke: "#2a1a3a", strokeWidth: 2.5, opacity: 0.25 });
  const hi = new Path();
  const a0 = rad(215);
  const a1 = rad(255);
  hi.M(cx + Math.cos(a0) * R * 1.05, cy + Math.sin(a0) * R * 1.05).A(R * 1.05, R * 1.05, 0, 0, 1, cx + Math.cos(a1) * R * 1.05, cy + Math.sin(a1) * R * 1.05);
  hi.include([cx - R, cy - R], [cx + R, cy + R]);
  specs.push({ path: hi, stroke: "#ffffff", strokeWidth: 6, opacity: 0.75 });
  return place(specs, 3);
}

export function beachBall(cx: number, cy: number, R: number): OrnamentLayer {
  const cols = ["#ff4a6e", "#ffffff", "#ffd23f", "#2d9cff", "#ffffff", "#2fd58b"];
  const specs: PartSpec[] = [];
  for (let i = 0; i < 6; i++) {
    const p = new Path();
    const a0 = i * 60 - 90;
    const s = polar(cx, cy, R, a0);
    const e = polar(cx, cy, R, a0 + 60);
    p.M(cx, cy).L(s[0], s[1]).A(R, R, 0, 0, 1, e[0], e[1]).Z();
    p.include([cx - R, cy - R], [cx + R, cy + R]);
    specs.push({ path: p, fill: cols[i] });
  }
  specs.push({ path: new Path().circle(cx, cy, R), stroke: "#2a1a3a", strokeWidth: 2.5, opacity: 0.25 });
  specs.push({ path: new Path().circle(cx, cy - R, R * 0.12), fill: "#ffffff" });
  specs.push({ path: ellipsePath(cx - R * 0.38, cy - R * 0.45, R * 0.3, R * 0.12, -40), fill: "#ffffff", opacity: 0.6 });
  return place(specs, 3);
}

export function sun(cx: number, cy: number, R: number, rays = 14, core: Paint = linear(90, [0, "#fff3a0"], [1, "#ffb41f"]), rayColor = "#ffcf3d"): OrnamentLayer {
  const rp = new Path();
  for (let i = 0; i < rays; i++) {
    const a = (i / rays) * 360;
    const a0 = rad(a - 5);
    const a1 = rad(a + 5);
    const tip = polar(cx, cy, R * 1.55, a);
    rp.M(cx + Math.cos(a0) * R * 1.15, cy + Math.sin(a0) * R * 1.15).L(tip[0], tip[1]).L(cx + Math.cos(a1) * R * 1.15, cy + Math.sin(a1) * R * 1.15).Z();
  }
  return place([{ path: rp, fill: rayColor }, { path: new Path().circle(cx, cy, R), fill: core }], 2);
}

/* ------------------------------ tropical flora ------------------------------- */

export function frond(fill: Path, rach: Path | null, bx: number, by: number, angDeg: number, len: number, bend: number, leafLen: number, leafW: number, count = 14) {
  const a = rad(angDeg);
  const dx = Math.cos(a);
  const dy = Math.sin(a);
  const side = dx >= -0.001 ? 1 : -1;
  const nx = -dy * side;
  const ny = dx * side;
  const P0: Pt = [bx, by];
  const C: Pt = [bx + dx * len * 0.55 + nx * bend, by + dy * len * 0.55 + ny * bend];
  const P1: Pt = [bx + dx * len + nx * bend * 0.9, by + dy * len + ny * bend * 0.9];
  const B = (t: number): Pt => [(1 - t) * (1 - t) * P0[0] + 2 * (1 - t) * t * C[0] + t * t * P1[0], (1 - t) * (1 - t) * P0[1] + 2 * (1 - t) * t * C[1] + t * t * P1[1]];
  const tang = (t: number) => Math.atan2(2 * (1 - t) * (C[1] - P0[1]) + 2 * t * (P1[1] - C[1]), 2 * (1 - t) * (C[0] - P0[0]) + 2 * t * (P1[0] - C[0]));
  if (rach) rach.M(P0[0], P0[1]).Q(C[0], C[1], P1[0], P1[1]);
  for (let i = 0; i < count; i++) {
    const t = 0.12 + (0.86 * i) / (count - 1);
    const k = 0.4 + 0.6 * Math.sin(Math.PI * Math.min(1, t * 0.92 + 0.06));
    const p = B(t);
    const ta = tang(t);
    const spread = 1.05 - 0.4 * t;
    leaf(fill, p, ta + spread, leafLen * k, leafW * k);
    leaf(fill, p, ta - spread, leafLen * k, leafW * k);
  }
  leaf(fill, B(0.97), tang(0.97), leafLen * 0.5, leafW * 0.5);
}

/** Specs for a coconut palm silhouette (trunk + fronds), base at (bx,by). */
export function palmSpecs(bx: number, by: number, tx: number, ty: number, color: Paint, scale = 1, trunkW = 22, fronds = 9, seed = 3, leafColor?: Paint): PartSpec[] {
  const r = rng(seed);
  const cx = bx + (tx - bx) * 0.15;
  const cy = by + (ty - by) * 0.55;
  const B = (t: number): Pt => [(1 - t) * (1 - t) * bx + 2 * (1 - t) * t * cx + t * t * tx, (1 - t) * (1 - t) * by + 2 * (1 - t) * t * cy + t * t * ty];
  const left: Pt[] = [];
  const right: Pt[] = [];
  const N = 20;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const p = B(t);
    const q = B(Math.min(1, t + 0.01));
    const p0 = B(Math.max(0, t - 0.01));
    const ang = Math.atan2(q[1] - p0[1], q[0] - p0[0]);
    const w = (trunkW * (1 - 0.45 * t) * scale) / 2;
    left.push([p[0] + Math.sin(ang) * w, p[1] - Math.cos(ang) * w]);
    right.push([p[0] - Math.sin(ang) * w, p[1] + Math.cos(ang) * w]);
  }
  const trunk = new Path().poly([...left, ...right.reverse()], true);
  const fill = new Path();
  const rach = new Path();
  const angles = [-175, -150, -125, -100, -78, -52, -28, -5, 20, 160].slice(0, fronds + 1);
  angles.forEach((ang, i) => {
    const L = (150 + r() * 40) * scale;
    frond(fill, rach, tx, ty, ang, L, (30 + r() * 30) * scale, 62 * scale, 9 * scale, 13);
    void i;
  });
  const nut = new Path().circle(tx - 6 * scale, ty + 10 * scale, 9 * scale).circle(tx + 10 * scale, ty + 14 * scale, 9 * scale);
  return [
    { path: trunk, fill: color },
    { path: rach, stroke: typeof color === "string" ? color : "#000000", strokeWidth: 3.5 * scale },
    { path: fill, fill: leafColor ?? color },
    { path: nut, fill: color },
  ];
}

/** Big drooping palm leaf for corners, fully shaded (two-tone). */
export function palmLeafArt(bx: number, by: number, angDeg: number, len: number, bend: number, light: string, dark: string, leafLen = 110, leafW = 15, count = 16): OrnamentLayer {
  const a = new Path();
  const b = new Path();
  const rach = new Path();
  frond(a, rach, bx, by, angDeg, len, bend, leafLen, leafW, count);
  frond(b, null, bx + 2, by + 3, angDeg + 1, len * 0.98, bend, leafLen * 0.82, leafW * 0.6, count);
  return place(
    [
      { path: a, fill: dark },
      { path: b, fill: light, opacity: 0.8 },
      { path: rach, stroke: dark, strokeWidth: 5 },
    ],
    3,
  );
}

export interface HibiscusColors {
  light: string;
  base: string;
  dark: string;
  throat: string;
}
export const HIBISCUS: Record<string, HibiscusColors> = {
  red: { light: "#ff8a6a", base: "#f0314f", dark: "#a8102f", throat: "#6e0a26" },
  coral: { light: "#ffc29a", base: "#ff6f5e", dark: "#d93a4a", throat: "#9a1c3a" },
  yellow: { light: "#fff1a0", base: "#ffc928", dark: "#f08a12", throat: "#d4410f" },
  pink: { light: "#ffc7e0", base: "#ff5fa8", dark: "#d02a7c", throat: "#7b1052" },
};

export function hibiscus(cx: number, cy: number, R: number, rot: number, c: HibiscusColors): OrnamentLayer {
  const petals = new Path();
  const throat = new Path();
  const veins = new Path();
  for (let i = 0; i < 5; i++) {
    const a = rad(rot + i * 72);
    petal(petals, cx, cy, a, R * 0.08, R, R * 0.4, false);
    petal(throat, cx, cy, a, R * 0.04, R * 0.56, R * 0.15, true);
    const v0 = polar(cx, cy, R * 0.15, rot + i * 72);
    const v1 = polar(cx, cy, R * 0.82, rot + i * 72);
    veins.M(v0[0], v0[1]).L(v1[0], v1[1]);
    for (const off of [-14, 14]) {
      const w0 = polar(cx, cy, R * 0.2, rot + i * 72 + off);
      const w1 = polar(cx, cy, R * 0.66, rot + i * 72 + off * 1.3);
      veins.M(w0[0], w0[1]).L(w1[0], w1[1]);
    }
  }
  const sa = rot + 36;
  const st = polar(cx, cy, R * 0.86, sa);
  const mid = polar(cx, cy, R * 0.5, sa + 14);
  const stem = new Path().M(cx, cy).Q(mid[0], mid[1], st[0], st[1]);
  const pollen = new Path();
  for (let i = 0; i < 6; i++) {
    const q = polar(st[0], st[1], 11, i * 60 + 20);
    pollen.circle(q[0], q[1], 5.2);
  }
  const tip = new Path();
  for (let i = 0; i < 5; i++) {
    const q = polar(st[0], st[1], 17 + i * 0, sa + 180 + i * 30 - 60);
    tip.circle(q[0], q[1], 4);
  }
  return place(
    [
      { path: petals, fill: radial([0, c.dark], [0.35, c.base], [1, c.light]) },
      { path: petals, stroke: c.dark, strokeWidth: 2, opacity: 0.35 },
      { path: veins, stroke: c.dark, strokeWidth: 2.4, opacity: 0.4 },
      { path: throat, fill: c.throat, opacity: 0.85 },
      { path: new Path().circle(cx, cy, R * 0.09), fill: c.light, opacity: 0.8 },
      { path: stem, stroke: "#ffe9a8", strokeWidth: 7 },
      { path: stem, stroke: c.light, strokeWidth: 3, opacity: 0.8 },
      { path: pollen, fill: "#ffcf2e" },
      { path: tip, fill: "#ffe680" },
    ],
    3,
  );
}

/** Plumeria (frangipani) in white/yellow. */
export function plumeria(cx: number, cy: number, R: number, rot: number, edge = "#ff9ab5"): OrnamentLayer {
  const p = new Path();
  const seam = new Path();
  for (let i = 0; i < 5; i++) {
    const a = rad(rot + i * 72);
    petal(p, cx, cy, a, R * 0.04, R, R * 0.44, false);
    const s0 = polar(cx, cy, R * 0.12, rot + i * 72 + 10);
    const s1 = polar(cx, cy, R * 0.8, rot + i * 72 + 22);
    seam.M(s0[0], s0[1]).L(s1[0], s1[1]);
  }
  return place(
    [
      { path: p, fill: radial([0, "#ffd23f"], [0.3, "#fff6c9"], [1, "#ffffff"]) },
      { path: p, stroke: edge, strokeWidth: 3, opacity: 0.55 },
      { path: seam, stroke: edge, strokeWidth: 2.2, opacity: 0.5 },
      { path: new Path().circle(cx, cy, R * 0.1), fill: "#ffb81f" },
    ],
    3,
  );
}

/* -------------------------------- light & fire -------------------------------- */

export function flameSpecs(cx: number, by: number, s: number, lean = 0): PartSpec[] {
  const f = (w: number, h: number, l: number): Path => {
    const p = new Path();
    p.M(cx - w * s, by)
      .C(cx - w * 1.25 * s, by - h * 0.4 * s, cx - w * 0.25 * s + l * s * 0.3, by - h * 0.6 * s, cx + l * s, by - h * s)
      .C(cx + w * 0.45 * s + l * s * 0.5, by - h * 0.6 * s, cx + w * 1.3 * s, by - h * 0.4 * s, cx + w * s, by)
      .Q(cx, by + w * 0.45 * s, cx - w * s, by)
      .Z();
    return p;
  };
  return [
    { path: f(1, 2.1, lean), fill: linear(90, [0, "#ff3d2e"], [0.55, "#ff8a1f"], [1, "#ffb21f"]) },
    { path: f(0.62, 1.5, lean * 0.7), fill: linear(90, [0, "#ff9a1f"], [1, "#ffe066"]) },
    { path: f(0.3, 0.9, lean * 0.4), fill: linear(90, [0, "#ffe680"], [1, "#fffbe0"]) },
  ];
}

/** A soft radial glow (ellipse) as a locked shape layer. */
export function glow(cx: number, cy: number, r: number, color: string, op = 0.4): Layer {
  return lock(S({ shape: "ellipse", x: cx - r, y: cy - r, width: r * 2, height: r * 2, fill: radial([0, color], [1, color + "00"]), opacity: op }));
}

/** Catenary string of lights. Returns the wire+bulbs ornament and glow layers. */
export function stringLights(x0: number, y0: number, x1: number, y1: number, sag: number, n: number, colors: string[], wire = "#2a1a3a", glowOp = 0.35, bulb = 11): Layer[] {
  const pt = (t: number): Pt => [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t + Math.sin(Math.PI * t) * sag];
  const w = new Path();
  w.M(x0, y0);
  for (let i = 1; i <= 40; i++) {
    const q = pt(i / 40);
    w.L(q[0], q[1]);
  }
  const out: Layer[] = [];
  const specs: PartSpec[] = [{ path: w, stroke: wire, strokeWidth: 2.6 }];
  const byCol = new Map<string, Path>();
  const caps = new Path();
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n;
    const [x, y] = pt(t);
    const c = colors[i % colors.length];
    const p = byCol.get(c) ?? byCol.set(c, new Path()).get(c)!;
    p.M(x, y + 6).C(x - bulb * 0.9, y + 6 + bulb * 0.4, x - bulb * 0.8, y + 6 + bulb * 1.9, x, y + 6 + bulb * 2).C(x + bulb * 0.8, y + 6 + bulb * 1.9, x + bulb * 0.9, y + 6 + bulb * 0.4, x, y + 6).Z();
    caps.poly([[x - 3.6, y], [x + 3.6, y], [x + 3.6, y + 7], [x - 3.6, y + 7]], true);
    out.push(glow(x, y + 6 + bulb, bulb * 3.2, c, glowOp));
  }
  specs.push({ path: caps, fill: wire });
  byCol.forEach((p, c) => specs.push({ path: p, fill: c }));
  out.push(place(specs, 3));
  return out;
}

export function bambooTorch(cx: number, topY: number, h: number, w: number, withFlame = true): Layer[] {
  const out: Layer[] = [];
  const segs = 5;
  const sh = h / segs;
  const body = new Path();
  const nodes = new Path();
  const shade = new Path();
  for (let i = 0; i < segs; i++) {
    const y = topY + i * sh;
    const ww = w * (1 - i * 0.02);
    body.poly([[cx - ww / 2, y + 3], [cx + ww / 2, y + 3], [cx + ww / 2, y + sh], [cx - ww / 2, y + sh]], true);
    nodes.M(cx - ww / 2 - 3, y + sh - 2).L(cx + ww / 2 + 3, y + sh - 2);
    shade.poly([[cx + ww * 0.15, y + 3], [cx + ww / 2, y + 3], [cx + ww / 2, y + sh], [cx + ww * 0.15, y + sh]], true);
  }
  const cup = new Path();
  cup.M(cx - w * 0.78, topY - 14).L(cx + w * 0.78, topY - 14).L(cx + w * 0.5, topY + 16).L(cx - w * 0.5, topY + 16).Z();
  const rim = ellipsePath(cx, topY - 14, w * 0.78, 8);
  out.push(
    place(
      [
        { path: body, fill: linear(0, [0, "#b88a4a"], [0.45, "#e3bd76"], [1, "#8a5f2c"]) },
        { path: shade, fill: "#5a3a14", opacity: 0.22 },
        { path: nodes, stroke: "#6b4518", strokeWidth: 6 },
        { path: cup, fill: linear(0, [0, "#3a2410"], [0.5, "#6b4518"], [1, "#2a1808"]) },
        { path: rim, fill: "#1a0e05" },
      ],
      3,
    ),
  );
  if (withFlame) {
    out.unshift(glow(cx, topY - 60, 130, "#ffb21f", 0.5));
    out.push(place(flameSpecs(cx, topY - 8, 34, 0.12), 2));
  }
  return out;
}

export function logsAndFire(cx: number, by: number, s: number): Layer[] {
  const out: Layer[] = [glow(cx, by - 70 * s, 260 * s, "#ff8a1f", 0.55)];
  const flames = [
    ...flameSpecs(cx - 55 * s, by - 6 * s, 30 * s, -0.25),
    ...flameSpecs(cx + 52 * s, by - 6 * s, 28 * s, 0.25),
    ...flameSpecs(cx, by - 4 * s, 46 * s, 0.1),
  ];
  const log = (x: number, y: number, len: number, ang: number): Path => {
    const p = new Path();
    const a = rad(ang);
    const dx = Math.cos(a) * len / 2;
    const dy = Math.sin(a) * len / 2;
    p.M(x - dx, y - dy).L(x + dx, y + dy);
    return p;
  };
  out.push(place(flames, 2));
  const logs: PartSpec[] = [
    { path: log(cx, by + 14 * s, 190 * s, 14), stroke: "#2a1608", strokeWidth: 30 * s },
    { path: log(cx, by + 14 * s, 190 * s, -14), stroke: "#3a2010", strokeWidth: 30 * s },
    { path: log(cx, by + 12 * s, 190 * s, -14), stroke: "#6b3d1c", strokeWidth: 8 * s, opacity: 0.6 },
    { path: log(cx, by + 12 * s, 190 * s, 14), stroke: "#8a4d22", strokeWidth: 6 * s, opacity: 0.5 },
  ];
  const ends = new Path();
  ends.circle(cx - 92 * s, by - 8 * s, 14 * s).circle(cx + 92 * s, by - 8 * s, 14 * s);
  logs.push({ path: ends, fill: "#d9a45a" });
  out.push(place(logs, 2));
  const sparks = new Path();
  const r = rng(7);
  for (let i = 0; i < 16; i++) sparks.circle(cx + (r() - 0.5) * 200 * s, by - 90 * s - r() * 230 * s, 1.8 + r() * 2.4);
  out.push(place([{ path: sparks, fill: "#ffd37a" }], 2));
  return out;
}

/* -------------------------------- picnic & BBQ -------------------------------- */

/** Gingham check as one ornament: two translucent stripe sets. */
export function gingham(x: number, y: number, w: number, h: number, cell: number, color: string, op = 0.5): OrnamentLayer {
  const hp = new Path();
  const vp = new Path();
  for (let yy = 0; yy < h; yy += cell * 2) hp.poly([[x, y + yy], [x + w, y + yy], [x + w, Math.min(y + h, y + yy + cell)], [x, Math.min(y + h, y + yy + cell)]], true);
  for (let xx = 0; xx < w; xx += cell * 2) vp.poly([[x + xx, y], [x + Math.min(w, xx + cell), y], [x + Math.min(w, xx + cell), y + h], [x + xx, y + h]], true);
  return place([{ path: hp, fill: color, opacity: op }, { path: vp, fill: color, opacity: op }], 0);
}

export function scallopEdge(x: number, y: number, w: number, r: number, fill: Paint, stroke?: string): OrnamentLayer {
  const n = Math.round(w / (r * 2));
  const rr = w / n / 2;
  const p = new Path();
  p.M(x, y);
  for (let i = 0; i < n; i++) {
    p.A(rr, rr, 0, 0, 0, x + (i + 1) * rr * 2, y);
  }
  p.L(x + w, y - 40).L(x, y - 40).Z();
  p.include([x, y + rr], [x + w, y - 40]);
  return place([{ path: p, fill, stroke: stroke ?? null, strokeWidth: stroke ? 3 : 0 }], 2);
}

export function lemonade(cx: number, by: number, s: number): OrnamentLayer {
  const X = (v: number) => cx + v * s;
  const Y = (v: number) => by + v * s;
  const glass = new Path().poly([[X(-62), Y(-190)], [X(62), Y(-190)], [X(48), Y(0)], [X(-48), Y(0)]], true);
  const liquid = new Path().poly([[X(-59), Y(-158)], [X(59), Y(-158)], [X(46), Y(-4)], [X(-46), Y(-4)]], true);
  const straw = new Path().M(X(20), Y(-100)).L(X(58), Y(-250)).L(X(76), Y(-246));
  const ice = new Path();
  [[-25, -120, 30], [14, -92, 28], [-12, -60, 26]].forEach(([a, b, c]) => {
    ice.poly([[X(a), Y(b)], [X(a + c), Y(b - 4)], [X(a + c + 3), Y(b + c)], [X(a + 2), Y(b + c + 3)]], true);
  });
  const lemon = new Path().circle(X(-62), Y(-190), 40 * s);
  const lemonIn = new Path().circle(X(-62), Y(-190), 32 * s);
  const segs = new Path();
  for (let i = 0; i < 8; i++) {
    const q = polar(X(-62), Y(-190), 31 * s, i * 45);
    segs.M(X(-62), Y(-190)).L(q[0], q[1]);
  }
  return place(
    [
      { path: ellipsePath(cx, by + 4 * s, 70 * s, 9 * s), fill: "#3a2a22", opacity: 0.16 },
      { path: glass, fill: "#ffffff", opacity: 0.35 },
      { path: liquid, fill: linear(90, [0, "#fff0a0"], [1, "#ffd23f"]) },
      { path: straw, stroke: "#e5412d", strokeWidth: 9 * s },
      { path: ice, fill: "#ffffff", opacity: 0.6 },
      { path: glass, stroke: "#3a2a22", strokeWidth: 4 * s },
      { path: lemon, fill: "#ffd23f", stroke: "#3a2a22", strokeWidth: 4 * s },
      { path: lemonIn, fill: "#fff3b0" },
      { path: segs, stroke: "#ffd23f", strokeWidth: 3 * s },
      { path: new Path().poly([[X(-48), Y(-170)], [X(-38), Y(-170)], [X(-30), Y(-20)], [X(-38), Y(-20)]], true), fill: "#ffffff", opacity: 0.45 },
    ],
    4,
  );
}

/** Kettle BBQ grill with smoke. */
export function grill(cx: number, by: number, s: number): OrnamentLayer {
  const X = (v: number) => cx + v * s;
  const Y = (v: number) => by + v * s;
  const bowl = new Path();
  bowl.M(X(-110), Y(-150)).C(X(-110), Y(-60), X(-60), Y(-30), X(0), Y(-30)).C(X(60), Y(-30), X(110), Y(-60), X(110), Y(-150)).Z();
  const lid = new Path();
  lid.M(X(-118), Y(-158)).C(X(-118), Y(-280), X(-60), Y(-310), X(0), Y(-310)).C(X(60), Y(-310), X(118), Y(-280), X(118), Y(-158)).Z();
  const legs = new Path();
  legs.M(X(-50), Y(-52)).L(X(-86), by).M(X(50), Y(-52)).L(X(86), by).M(X(0), Y(-30)).L(X(0), by + 0);
  const handle = new Path().M(X(-30), Y(-296)).L(X(30), Y(-296));
  const knob = new Path().circle(X(0), Y(-318), 10 * s);
  const smoke = new Path();
  smoke.M(X(-20), Y(-330)).C(X(-60), Y(-380), X(20), Y(-410), X(-14), Y(-460));
  const smoke2 = new Path();
  smoke2.M(X(30), Y(-340)).C(X(70), Y(-390), X(0), Y(-430), X(36), Y(-490));
  const wheel = new Path().circle(X(-86), by - 6 * s, 16 * s);
  return place(
    [
      { path: smoke, stroke: "#ffffff", strokeWidth: 9 * s, opacity: 0.7 },
      { path: smoke2, stroke: "#ffffff", strokeWidth: 7 * s, opacity: 0.55 },
      { path: legs, stroke: "#3a2a22", strokeWidth: 9 * s },
      { path: wheel, fill: "#3a2a22" },
      { path: bowl, fill: linear(90, [0, "#4a4a56"], [1, "#22222a"]) },
      { path: lid, fill: linear(60, [0, "#e5412d"], [0.55, "#c42d1c"], [1, "#8a1b10"]) },
      { path: new Path().M(X(-118), Y(-158)).L(X(118), Y(-158)), stroke: "#3a2a22", strokeWidth: 6 * s },
      { path: handle, stroke: "#3a2a22", strokeWidth: 8 * s },
      { path: knob, fill: "#3a2a22" },
      { path: ellipsePath(X(-62), Y(-250), 12 * s, 38 * s, 30), fill: "#ffffff", opacity: 0.35 },
    ],
    3,
  );
}

export function burger(cx: number, cy: number, w: number): OrnamentLayer {
  const X = (v: number) => cx + v * w;
  const Y = (v: number) => cy + v * w;
  const top = new Path();
  top.M(X(-0.5), Y(-0.04)).C(X(-0.52), Y(-0.34), X(-0.2), Y(-0.42), X(0), Y(-0.42)).C(X(0.2), Y(-0.42), X(0.52), Y(-0.34), X(0.5), Y(-0.04)).Z();
  const seeds = new Path();
  [[-0.25, -0.26], [-0.08, -0.32], [0.12, -0.3], [0.28, -0.22], [-0.02, -0.18], [-0.34, -0.14], [0.18, -0.14]].forEach(([a, b], i) => {
    seeds.circle(X(a), Y(b), 0.014 * w * 4 + (i % 2));
  });
  const lettuce = new Path();
  lettuce.M(X(-0.54), Y(-0.04));
  for (let i = 0; i <= 12; i++) lettuce.L(X(-0.54 + (i / 12) * 1.08), Y(-0.01 + (i % 2 ? 0.05 : 0.0)));
  lettuce.L(X(0.54), Y(-0.04)).Z();
  const cheese = new Path().poly([[X(-0.5), Y(0.03)], [X(0.5), Y(0.03)], [X(0.4), Y(0.1)], [X(0.22), Y(0.06)], [X(0.12), Y(0.16)], [X(0.02), Y(0.06)], [X(-0.5), Y(0.06)]], true);
  const patty = new Path();
  patty.M(X(-0.5), Y(0.06)).L(X(0.5), Y(0.06)).L(X(0.5), Y(0.15)).Q(X(0.5), Y(0.2), X(0.44), Y(0.2)).L(X(-0.44), Y(0.2)).Q(X(-0.5), Y(0.2), X(-0.5), Y(0.15)).Z();
  const bot = new Path();
  bot.M(X(-0.48), Y(0.2)).L(X(0.48), Y(0.2)).L(X(0.46), Y(0.28)).Q(X(0.44), Y(0.34), X(0.36), Y(0.34)).L(X(-0.36), Y(0.34)).Q(X(-0.44), Y(0.34), X(-0.46), Y(0.28)).Z();
  return place(
    [
      { path: bot, fill: "#e8a34a", stroke: "#3a2a22", strokeWidth: 3.5 },
      { path: patty, fill: "#6b3a1e", stroke: "#3a2a22", strokeWidth: 3.5 },
      { path: cheese, fill: "#ffc933", stroke: "#3a2a22", strokeWidth: 3 },
      { path: lettuce, fill: "#7cc242", stroke: "#3a2a22", strokeWidth: 3 },
      { path: top, fill: linear(90, [0, "#f6b95a"], [1, "#e08e2e"]), stroke: "#3a2a22", strokeWidth: 3.5 },
      { path: seeds, fill: "#fff3d0" },
    ],
    4,
  );
}

export function watermelon(cx: number, cy: number, R: number): OrnamentLayer {
  const out = new Path();
  out.M(cx - R, cy).A(R, R, 0, 0, 0, cx + R, cy).Z();
  out.include([cx - R, cy], [cx + R, cy + R]);
  const mid = new Path();
  mid.M(cx - R * 0.93, cy).A(R * 0.93, R * 0.93, 0, 0, 0, cx + R * 0.93, cy).Z();
  mid.include([cx - R, cy], [cx + R, cy + R]);
  const red = new Path();
  red.M(cx - R * 0.82, cy).A(R * 0.82, R * 0.82, 0, 0, 0, cx + R * 0.82, cy).Z();
  red.include([cx - R, cy], [cx + R, cy + R]);
  const seeds = new Path();
  [[-0.45, 0.2], [-0.15, 0.4], [0.2, 0.26], [0.48, 0.14], [0.02, 0.12], [-0.3, 0.55], [0.35, 0.5]].forEach(([a, b]) => {
    seeds.circle(cx + a * R, cy + b * R, 5.5);
  });
  return place(
    [
      { path: out, fill: "#2f8f4e", stroke: "#3a2a22", strokeWidth: 4 },
      { path: mid, fill: "#e8f5d0" },
      { path: red, fill: radial([0, "#ff4a5e"], [1, "#e5232f"]) },
      { path: seeds, fill: "#2a1a22" },
    ],
    4,
  );
}

/** Bunting of pennant triangles hung between two points. */
export function pennants(x0: number, y0: number, x1: number, y1: number, sag: number, colors: string[], n: number, flag = 60, stringColor = "#3a2a22"): OrnamentLayer {
  const pt = (t: number): Pt => [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t + Math.sin(Math.PI * t) * sag];
  const str = new Path();
  str.M(x0, y0);
  for (let i = 1; i <= 24; i++) {
    const q = pt(i / 24);
    str.L(q[0], q[1]);
  }
  const byColor = new Map<string, Path>();
  for (let i = 0; i < n; i++) {
    const t0 = (i + 0.14) / n;
    const t1 = (i + 0.86) / n;
    const p0 = pt(t0);
    const p1 = pt(t1);
    const m = pt((t0 + t1) / 2);
    const c = colors[i % colors.length];
    const path = byColor.get(c) ?? byColor.set(c, new Path()).get(c)!;
    path.poly([p0, p1, [m[0], m[1] + flag]], true);
  }
  const specs: PartSpec[] = [{ path: str, stroke: stringColor, strokeWidth: 3 }];
  byColor.forEach((path, c) => specs.push({ path, fill: c, stroke: stringColor, strokeWidth: 2.5 }));
  return place(specs, 4);
}

/** Many small stars scattered (night sky). */
export function starfield(seed: number, count: number, area: [number, number, number, number], color = "#ffffff"): OrnamentLayer {
  const r = rng(seed);
  const dots = new Path();
  const sp = new Path();
  for (let i = 0; i < count; i++) {
    const x = area[0] + r() * (area[2] - area[0]);
    const y = area[1] + r() * (area[3] - area[1]);
    if (r() > 0.88) {
      const s = 7 + r() * 6;
      sp.M(x, y - s).Q(x, y, x + s, y).Q(x, y, x, y + s).Q(x, y, x - s, y).Q(x, y, x, y - s).Z();
    } else dots.circle(x, y, 0.9 + r() * 1.6);
  }
  return place([{ path: dots, fill: color, opacity: 0.85 }, { path: sp, fill: color }], 2);
}

export { linear, radial };

/* ---------------------------------- type helpers ---------------------------------- */

export interface ExtrudeOpts {
  x: number;
  y: number;
  width: number;
  fontSize: number;
  font: string;
  face: Paint;
  side?: string;
  depth?: number;
  step?: number;
  lh?: number;
  letterSpacing?: number;
  weight?: number;
  align?: "left" | "center" | "right";
  stroke?: string;
}

/** Chunky extruded text: stacked dark copies behind a bright face. */
export function extrude(text: string, o: ExtrudeOpts): Layer[] {
  const out: Layer[] = [];
  const depth = o.depth ?? 10;
  const step = o.step ?? 1.5;
  const base = { width: o.width, fontFamily: o.font, fontSize: o.fontSize, lineHeight: o.lh ?? 1, letterSpacing: o.letterSpacing ?? 0, fontWeight: o.weight ?? 400, align: o.align ?? ("center" as const) };
  for (let i = depth; i >= 1; i--) out.push(lock(T(text, o.y + i * step, { ...base, x: o.x + i * step, fill: o.side ?? "#0b3a6b" })));
  out.push(lock(T(text, o.y, { ...base, x: o.x, fill: o.face })));
  return out;
}

/** Offset-shadow "sticker" panel. */
export function sticker(x: number, y: number, w: number, h: number, fill: Paint, o: { shadow?: string; stroke?: string; r?: number; off?: number; sw?: number; op?: number } = {}): Layer[] {
  const off = o.off ?? 9;
  const r = o.r ?? 36;
  return [
    lock(S({ x: x + off, y: y + off, width: w, height: h, cornerRadius: r, fill: o.shadow ?? "#0b3a6b" })),
    lock(S({ x, y, width: w, height: h, cornerRadius: r, fill, stroke: o.stroke ?? o.shadow ?? "#0b3a6b", strokeWidth: o.sw ?? 5, opacity: o.op ?? 1 })),
  ];
}

export const dotL = (cx: number, cy: number, s: number, fill: Paint | null, op = 1, stroke?: string, sw = 0): Layer =>
  lock(S({ shape: "ellipse", x: cx - s / 2, y: cy - s / 2, width: s, height: s, fill, stroke: stroke ?? null, strokeWidth: sw, opacity: op }));
