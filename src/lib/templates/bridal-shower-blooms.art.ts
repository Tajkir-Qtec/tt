import { centerRotate, makeOrnament } from "../design/layers";
import { flower } from "../design/ornaments";
import { assemble, leaf, Path, rad, type OrnamentData, type PartSpec } from "../design/path";
import type { Layer, Paint } from "../design/types";
import { lock } from "./kit";

export function put(data: OrnamentData, cx: number, cy: number, w: number, rot = 0, opacity = 1): Layer {
  const h = (w * data.vbH) / data.vbW;
  const l = makeOrnament(data, { x: cx - w / 2, y: cy - h / 2, width: w, height: h, opacity });
  return lock(rot ? centerRotate(l, cx, cy, rot) : l);
}

const lin = (angle: number, ...stops: [number, string][]): Paint => ({ kind: "linear", angle, stops });
const rad2 = (...stops: [number, string][]): Paint => ({ kind: "radial", stops });

/** A whole lemon with highlight, dimples and a small leaf. */
export function lemon(opts: { leafColor?: string; withLeaf?: boolean } = {}): OrnamentData {
  const body = new Path();
  body
    .M(0, 62)
    .C(14, 60, 26, 54, 40, 40)
    .C(70, 0, 150, 0, 178, 40)
    .C(190, 54, 200, 60, 214, 62)
    .C(200, 64, 190, 70, 178, 84)
    .C(150, 124, 70, 124, 40, 84)
    .C(26, 70, 14, 64, 0, 62)
    .Z();
  const shade = new Path().M(48, 96).C(80, 118, 140, 118, 172, 90);
  const hi = new Path().M(58, 30).C(78, 14, 112, 10, 138, 16);
  const hi2 = new Path().M(146, 20).C(154, 22, 160, 26, 164, 30);
  const dimples = new Path();
  for (const [x, y] of [[70, 50], [118, 40], [150, 70], [92, 86], [130, 96], [52, 66]]) dimples.circle(x, y, 1.6);
  const specs: PartSpec[] = [];
  if (opts.withLeaf) {
    const lf = new Path();
    leaf(lf, [112, 6], rad(-62), 70, 16);
    leaf(lf, [112, 6], rad(-12), 54, 12);
    specs.push({ path: lf, fill: lin(60, [0, "#8db576"], [1, "#4f7d4f"]) });
  }
  specs.push(
    { path: body, fill: lin(70, [0, "#fbe66e"], [0.55, "#f4cc3a"], [1, "#e3a91c"]) },
    { path: shade, stroke: "#d9981a", strokeWidth: 7, opacity: 0.4 },
    { path: hi, stroke: "#fff7c2", strokeWidth: 6, opacity: 0.85 },
    { path: hi2, stroke: "#fff7c2", strokeWidth: 6, opacity: 0.7 },
    { path: dimples, fill: "#d9981a", opacity: 0.45 },
  );
  return assemble(specs, 4);
}

/** Cross-section lemon slice. */
export function lemonSlice(opts: { rind?: string; flesh?: string; segments?: number } = {}): OrnamentData {
  const R = 100;
  const n = opts.segments ?? 9;
  const rind = new Path().circle(0, 0, R);
  const pith = new Path().circle(0, 0, R * 0.9);
  const wedges = new Path();
  const gap = rad(3.4);
  const r0 = R * 0.12;
  const r1 = R * 0.8;
  for (let i = 0; i < n; i++) {
    const a0 = rad(-90 + (360 * i) / n) + gap;
    const a1 = rad(-90 + (360 * (i + 1)) / n) - gap;
    const am = (a0 + a1) / 2;
    const half = (a1 - a0) / 2;
    const P = (r: number, a: number): [number, number] => [Math.cos(a) * r, Math.sin(a) * r];
    const s0 = P(r0 + 4, a0);
    const e0 = P(r1 - 6, a0 + 0.02);
    const e1 = P(r1 - 6, a1 - 0.02);
    const s1 = P(r0 + 4, a1);
    const cTop = P((r1 + 6) / Math.cos(half), am);
    const cIn = P(r0 * 0.4, am);
    wedges.M(s0[0], s0[1]).L(e0[0], e0[1]).Q(cTop[0], cTop[1], e1[0], e1[1]).L(s1[0], s1[1]).Q(cIn[0], cIn[1], s0[0], s0[1]).Z();
  }
  const sheen = new Path();
  for (let i = 0; i < n; i++) {
    const am = rad(-90 + (360 * (i + 0.5)) / n);
    sheen.M(Math.cos(am) * R * 0.3, Math.sin(am) * R * 0.3).L(Math.cos(am) * R * 0.62, Math.sin(am) * R * 0.62);
  }
  return assemble(
    [
      { path: rind, fill: opts.rind ?? lin(60, [0, "#f9de58"], [1, "#e9b023"]) },
      { path: pith, fill: "#fff8dc" },
      { path: wedges, fill: opts.flesh ? opts.flesh : rad2([0, "#fdf0a0"], [1, "#f6d44d"]) },
      { path: sheen, stroke: "#fffbe0", strokeWidth: 2.4, opacity: 0.8 },
    ],
    2,
    { w: R * 2 + 4, h: R * 2 + 4, dx: R + 2, dy: R + 2 },
  );
}

/** A lush peony with layered petals, plus a cup centre. */
export function peony(c: { outer: string; mid: string; inner: string; core: string; edge: string }, radius = 150): OrnamentData {
  const base = flower({
    color: c.outer,
    ringColors: [c.outer, c.mid, c.mid, c.inner, c.inner],
    stroke: c.edge,
    strokeWidth: 1.2,
    radius,
    rings: 5,
    petals: 10,
    opacity: 1,
    center: null,
  });
  const core = new Path();
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    core.circle(Math.cos(a) * radius * 0.07, Math.sin(a) * radius * 0.07, radius * 0.045);
  }
  core.circle(0, 0, radius * 0.05);
  const size = radius * 2 + 12;
  const coreData = assemble([{ path: core, fill: c.core }], 0, { w: size, h: size, dx: size / 2, dy: size / 2 });
  return { vbW: base.vbW, vbH: base.vbH, parts: [...base.parts, ...coreData.parts] };
}

/** Leaf spray radiating from the centre (use behind blooms). */
export function foliage(dark: string, light: string, spread = 360, count = 9, len = 170, seed = 1): OrnamentData {
  const a = new Path();
  const b = new Path();
  const stems = new Path();
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0.5 : i / (count - 1);
    const ang = rad(-90 - spread / 2 + spread * t + Math.sin(i * 12.9898 * seed) * 8);
    const L = len * (0.78 + 0.22 * Math.abs(Math.sin(i * 3.7 + seed)));
    const target = i % 2 ? a : b;
    leaf(target, [0, 0], ang, L, L * 0.17, i % 3 === 0);
    stems.M(0, 0).L(Math.cos(ang) * L * 0.9, Math.sin(ang) * L * 0.9);
  }
  const size = len * 2.4;
  return assemble(
    [
      { path: a, fill: dark },
      { path: b, fill: light },
      { path: stems, stroke: "#ffffff", strokeWidth: 1.4, opacity: 0.35 },
    ],
    0,
    { w: size, h: size, dx: size / 2, dy: size / 2 },
  );
}

/** Champagne coupe with sparkling wine and bubbles. */
export function coupe(glass = "#d6e4ea"): OrnamentData {
  const bowl = new Path();
  bowl.M(0, 0).L(160, 0).C(160, 70, 118, 118, 80, 118).C(42, 118, 0, 70, 0, 0).Z();
  const wine = new Path();
  wine.M(12, 18).L(148, 18).C(146, 66, 112, 104, 80, 104).C(48, 104, 14, 66, 12, 18).Z();
  const rim = new Path().M(0, 0).L(160, 0);
  const stem = new Path().M(80, 118).L(80, 250);
  const foot = new Path().M(34, 258).C(50, 248, 110, 248, 126, 258).C(110, 264, 50, 264, 34, 258).Z();
  const hi = new Path().M(18, 12).C(18, 44, 32, 70, 46, 82);
  const bub = new Path();
  for (const [x, y, r] of [[60, 70, 3.4], [92, 52, 2.6], [78, 88, 2.2], [110, 74, 3], [70, 40, 2.2], [100, 32, 2.4], [52, 52, 1.8]]) bub.circle(x, y, r);
  return assemble(
    [
      { path: bowl, fill: lin(90, [0, "#ffffff"], [1, glass]), opacity: 0.85 },
      { path: wine, fill: lin(90, [0, "#fbeab4"], [1, "#eec96c"]) },
      { path: bub, fill: "#fffbe6" },
      { path: bowl, stroke: "#9db5c0", strokeWidth: 2.4 },
      { path: rim, stroke: "#9db5c0", strokeWidth: 3 },
      { path: hi, stroke: "#ffffff", strokeWidth: 4, opacity: 0.9 },
      { path: stem, stroke: "#9db5c0", strokeWidth: 5 },
      { path: foot, fill: lin(90, [0, "#ffffff"], [1, glass]), stroke: "#9db5c0", strokeWidth: 2.4 },
    ],
    4,
  );
}

/** A handful of bubbles (outline circles with a highlight dot). */
export function bubbles(color: string, size = 160): OrnamentData {
  const c = new Path();
  const d = new Path();
  const items: [number, number, number][] = [
    [0.2, 0.8, 0.1],
    [0.5, 0.55, 0.14],
    [0.78, 0.3, 0.09],
    [0.3, 0.3, 0.07],
    [0.85, 0.8, 0.06],
  ];
  for (const [x, y, r] of items) {
    c.circle(x * size, y * size, r * size);
    d.circle((x - r * 0.35) * size, (y - r * 0.35) * size, r * size * 0.18);
  }
  return assemble([{ path: c, stroke: color, strokeWidth: 2.2 }, { path: d, fill: color }], 3, { w: size, h: size });
}

export function sparkle4(color: string, size = 60): OrnamentData {
  const c = size / 2;
  const p = new Path();
  p.M(c, 0).Q(c, c, size, c).Q(c, c, c, size).Q(c, c, 0, c).Q(c, c, c, 0).Z();
  return assemble([{ path: p, fill: color }], 0, { w: size, h: size });
}
