import { starPoints } from "../design/ornaments";
import { Path, type PartSpec, type Pt } from "../design/path";
import type { Layer } from "../design/types";
import { linear } from "./kit";
import { ellipsePath, place, rng } from "./birthday-balloons-bold.art";

export const INK = "#14141c";
export const RED = "#e8222e";
export const BLUE = "#1f5fe0";
export const NAVY = "#14246b";
export const YEL = "#ffd60a";
export const SKIN = "#ffc89a";

/** Comic halftone: grid of dots whose radius follows `fade(x,y)` (0..1). */
export function halftone(area: [number, number, number, number], gap: number, maxR: number, color: string, fade: (x: number, y: number) => number, op = 1): Layer {
  const p = new Path();
  let row = 0;
  for (let y = area[1]; y <= area[3]; y += gap * 0.866, row++) {
    for (let x = area[0] + (row % 2 ? gap / 2 : 0); x <= area[2]; x += gap) {
      const f = fade(x, y);
      if (f < 0.08) continue;
      p.circle(x, y, maxR * Math.min(1, f));
    }
  }
  return place([{ path: p, fill: color }], 0, { opacity: op });
}

/** Spiky comic explosion polygon. */
export function burstPath(cx: number, cy: number, R: number, r: number, n: number, seed: number, rot = 0): Path {
  const rnd = rng(seed);
  const pts: Pt[] = [];
  for (let i = 0; i < n * 2; i++) {
    const outer = i % 2 === 0;
    const a = ((i / (n * 2)) * 360 + rot - 90) * (Math.PI / 180);
    const rr = outer ? R * (0.88 + rnd() * 0.24) : r * (0.9 + rnd() * 0.2);
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.86]);
  }
  return new Path().poly(pts, true);
}

/** Layered burst: black shadow, outline, colour face, light inner. */
export function burst(cx: number, cy: number, R: number, face: string, inner: string, seed: number, n = 14, rot = 0): Layer {
  return place(
    [
      { path: burstPath(cx + R * 0.05, cy + R * 0.06, R, R * 0.7, n, seed, rot), fill: INK },
      { path: burstPath(cx, cy, R, R * 0.7, n, seed, rot), fill: face, stroke: INK, strokeWidth: 6, lineJoin: "miter" },
      { path: burstPath(cx, cy, R * 0.8, R * 0.56, n, seed + 1, rot), fill: inner, opacity: 0.55 },
    ],
    6,
  );
}

/** Speech bubble with tail. Tail tip at (tx,ty). */
export function bubble(cx: number, cy: number, rx: number, ry: number, tx: number, ty: number, fill = "#ffffff"): Layer {
  const tail = new Path().poly([[cx - rx * 0.35, cy + ry * 0.8], [cx + rx * 0.05, cy + ry * 0.95], [tx, ty]], true);
  return place(
    [
      { path: ellipsePath(cx + 7, cy + 8, rx, ry), fill: INK },
      { path: tail, fill, stroke: INK, strokeWidth: 6, lineJoin: "round" },
      { path: ellipsePath(cx, cy, rx, ry), fill, stroke: INK, strokeWidth: 6 },
      { path: new Path().poly([[cx - rx * 0.33, cy + ry * 0.86], [cx + rx * 0.03, cy + ry * 0.93]]), stroke: fill, strokeWidth: 9 },
    ],
    6,
  );
}

/** City skyline with lit windows across the page, base at y = base. */
export function skyline(seed: number, base: number, maxH: number, front: string, back: string): Layer[] {
  const rnd = rng(seed);
  const mk = (color: string, hMul: number, w0: number, off: number, windows: boolean, outline: boolean) => {
    const bld = new Path();
    const win = new Path();
    let x = off;
    while (x < 1000) {
      const w = w0 + rnd() * w0;
      const h = (0.35 + rnd() * 0.65) * maxH * hMul;
      bld.poly([[x, base], [x, base - h], [x + w, base - h], [x + w, base]], true);
      if (windows) {
        for (let wy = base - h + 22; wy < base - 20; wy += 30) for (let wx = x + 12; wx < x + w - 14; wx += 24) if (rnd() > 0.45) win.poly([[wx, wy], [wx + 10, wy], [wx + 10, wy + 14], [wx, wy + 14]], true);
      }
      x += w;
    }
    const specs: PartSpec[] = [{ path: bld, fill: color, stroke: outline ? INK : null, strokeWidth: outline ? 5 : 0 }];
    if (windows) specs.push({ path: win, fill: YEL });
    return place(specs, 4);
  };
  return [mk(back, 0.72, 60, -20, false, false), mk(front, 1, 70, -10, true, true)];
}

/** Standing caped hero, fists on hips. (cx, feetY) = bottom centre; s = height/2. */
export function hero(cx: number, feetY: number, s: number): Layer[] {
  const X = (x: number, y: number): Pt => [cx + x * s, feetY + y * s];
  const stroke = { stroke: INK, strokeWidth: 6, lineJoin: "round" as const };
  const out: Layer[] = [];

  // cape
  const cape = new Path();
  let a = X(-0.5, -1.5);
  cape.M(a[0], a[1]);
  let c1 = X(-1.2, -1.2);
  let c2 = X(-1.55, -0.5);
  let e = X(-1.45, -0.05);
  cape.C(c1[0], c1[1], c2[0], c2[1], e[0], e[1]);
  // wavy hem
  const hem: Pt[] = [X(-1.1, -0.28), X(-0.7, -0.02), X(-0.25, -0.3), X(0.2, -0.04), X(0.7, -0.3), X(1.15, -0.02)];
  hem.forEach((p, i) => {
    const prev = i === 0 ? e : hem[i - 1];
    const mid: Pt = [(prev[0] + p[0]) / 2, (prev[1] + p[1]) / 2 + (i % 2 ? 0.07 * s : -0.07 * s)];
    cape.Q(mid[0], mid[1], p[0], p[1]);
  });
  e = X(1.45, -0.1);
  cape.Q(X(1.3, -0.05)[0], X(1.3, -0.05)[1], e[0], e[1]);
  c1 = X(1.6, -0.6);
  c2 = X(1.2, -1.25);
  a = X(0.5, -1.5);
  cape.C(c1[0], c1[1], c2[0], c2[1], a[0], a[1]).Z();
  const folds = new Path();
  for (const [x0, x1] of [[-0.9, -1.0], [-0.5, -0.6], [0.55, 0.65], [0.95, 1.05]]) {
    const p0 = X(x0, -1.1);
    const p1 = X(x1, -0.2);
    folds.M(p0[0], p0[1]).L(p1[0], p1[1]);
  }
  out.push(place([{ path: cape, fill: linear(90, [0, "#ff4a55"], [1, "#b3121c"]), ...stroke }, { path: folds, stroke: "#8a0f17", strokeWidth: 5, lineCap: "round" }], 6));

  // legs + boots
  const legs: PartSpec[] = [];
  for (const sg of [-1, 1]) {
    legs.push({ path: new Path().poly([X(sg * 0.04, -1.02), X(sg * 0.42, -1.02), X(sg * 0.38, -0.2), X(sg * 0.1, -0.2)], true), fill: BLUE, ...stroke });
    legs.push({ path: new Path().poly([X(sg * 0.08, -0.34), X(sg * 0.4, -0.34), X(sg * 0.46, 0), X(sg * 0.02, 0)], true), fill: RED, ...stroke });
  }
  out.push(place(legs, 6));

  // arms (behind torso): upper + fore, fists on hips
  const arms: PartSpec[] = [];
  for (const sg of [-1, 1]) {
    const arm = new Path();
    const s0 = X(sg * 0.5, -1.42);
    const el = X(sg * 0.98, -1.2);
    const hp = X(sg * 0.46, -0.93);
    arm.M(s0[0], s0[1]).L(el[0], el[1]).L(hp[0], hp[1]);
    arms.push({ path: arm, stroke: INK, strokeWidth: 0.22 * s + 12, lineCap: "round", lineJoin: "round" });
    arms.push({ path: arm, stroke: BLUE, strokeWidth: 0.22 * s, lineCap: "round", lineJoin: "round" });
    const fist = new Path().circle(hp[0], hp[1], 0.12 * s);
    arms.push({ path: fist, fill: RED, ...stroke });
  }
  out.push(place(arms, 8));

  // torso, belt
  const torso = new Path().poly([X(-0.6, -1.52), X(0.6, -1.52), X(0.4, -0.98), X(-0.4, -0.98)], true);
  const belt = new Path().poly([X(-0.42, -1.04), X(0.42, -1.04), X(0.4, -0.9), X(-0.4, -0.9)], true);
  const buckle = new Path().poly([X(-0.09, -1.03), X(0.09, -1.03), X(0.09, -0.91), X(-0.09, -0.91)], true);
  // emblem: yellow shield with red star
  const sh = new Path();
  sh.M(...(X(-0.19, -1.42) as Pt)).L(...(X(0.19, -1.42) as Pt)).L(...(X(0.17, -1.2) as Pt)).L(...(X(0, -1.08) as Pt)).L(...(X(-0.17, -1.2) as Pt)).Z();
  const star = new Path().poly(starPoints(cx, feetY - 1.28 * s, 5, 0.09 * s, 0.04 * s), true);
  out.push(
    place(
      [
        { path: torso, fill: linear(90, [0, "#2f78ff"], [1, "#1646b8"]), ...stroke },
        { path: belt, fill: YEL, ...stroke },
        { path: buckle, fill: RED, stroke: INK, strokeWidth: 3 },
        { path: sh, fill: YEL, stroke: INK, strokeWidth: 4, lineJoin: "round" },
        { path: star, fill: RED },
      ],
      6,
    ),
  );

  // head
  const hc = X(0, -1.8);
  const head = ellipsePath(hc[0], hc[1], 0.27 * s, 0.3 * s);
  const cowl = new Path();
  const l0 = X(-0.27, -1.78);
  cowl.M(l0[0], l0[1]);
  cowl.A(0.27 * s, 0.3 * s, 0, 0, 1, X(0.27, -1.78)[0], X(0.27, -1.78)[1]);
  cowl.L(...(X(0.34, -1.98) as Pt)).L(...(X(0.18, -1.9) as Pt)).L(...(X(0, -1.86) as Pt)).L(...(X(-0.18, -1.9) as Pt)).L(...(X(-0.34, -1.98) as Pt)).Z();
  cowl.include(X(0, -2.1), X(-0.34, -1.98), X(0.34, -1.98));
  const band = new Path().poly([X(-0.28, -1.86), X(0.28, -1.86), X(0.26, -1.7), X(-0.26, -1.7)], true);
  const eyeL = new Path().poly([X(-0.19, -1.8), X(-0.04, -1.78), X(-0.07, -1.73), X(-0.2, -1.76)], true);
  const eyeR = new Path().poly([X(0.19, -1.8), X(0.04, -1.78), X(0.07, -1.73), X(0.2, -1.76)], true);
  const smile = new Path();
  smile.M(...(X(-0.1, -1.62) as Pt)).Q(...(X(0, -1.56) as Pt), ...(X(0.1, -1.62) as Pt));
  out.push(
    place(
      [
        { path: head, fill: SKIN, ...stroke },
        { path: cowl, fill: RED, ...stroke },
        { path: band, fill: INK },
        { path: eyeL, fill: "#ffffff" },
        { path: eyeR, fill: "#ffffff" },
        { path: smile, stroke: INK, strokeWidth: 5, lineCap: "round" },
      ],
      8,
    ),
  );
  return out;
}

