import { centerRotate, makeOrnament } from "../design/layers";
import { assemble, leaf, Path, rad, type OrnamentData, type PartSpec, type Pt } from "../design/path";
import type { Layer, Paint } from "../design/types";
import { lock } from "./kit";

export function put(data: OrnamentData, cx: number, cy: number, w: number, rot = 0, opacity = 1): Layer {
  const h = (w * data.vbH) / data.vbW;
  const l = makeOrnament(data, { x: cx - w / 2, y: cy - h / 2, width: w, height: h, opacity });
  return lock(rot ? centerRotate(l, cx, cy, rot) : l);
}

export const FOIL: Paint = {
  kind: "linear",
  angle: 95,
  stops: [
    [0, "#8f6b2c"],
    [0.18, "#f4e1a6"],
    [0.4, "#c19a48"],
    [0.62, "#fbeebd"],
    [0.82, "#c9a152"],
    [1, "#8f6b2c"],
  ],
};
export const FOIL_DEEP: Paint = {
  kind: "linear",
  angle: 75,
  stops: [
    [0, "#7a5a22"],
    [0.4, "#b88e3f"],
    [0.7, "#e2c47c"],
    [1, "#8a6727"],
  ],
};

/** Laurel wreath in foil gold: two curved stems with paired leaves, open at the top. */
export function laurel(R = 270, leafLen = 92, leaves = 13, gapDeg = 26, berries = true): OrnamentData {
  const stems = new Path();
  const inner = new Path();
  const outer = new Path();
  const dots = new Path();
  for (const side of [-1, 1]) {
    const total = 180 - gapDeg / 2;
    const polar = (t: number): Pt => {
      const a = rad(90 + side * total * t);
      return [Math.cos(a) * R, Math.sin(a) * R];
    };
    const tangent = (t: number) => rad(90 + side * total * t) + (side === 1 ? Math.PI / 2 : -Math.PI / 2);
    for (let i = 0; i <= 70; i++) {
      const [x, y] = polar(i / 70);
      if (i === 0) stems.M(x, y);
      else stems.L(x, y);
    }
    for (let i = 0; i < leaves; i++) {
      const t = 0.03 + (0.93 * i) / (leaves - 1);
      const k = 1 - 0.38 * t;
      const base = polar(t);
      const ang = tangent(t);
      leaf(outer, base, ang + rad(42), leafLen * k, leafLen * 0.2 * k);
      leaf(inner, base, ang - rad(42), leafLen * k * 0.92, leafLen * 0.19 * k);
      if (berries && i % 3 === 1) {
        const a = ang + rad(70);
        dots.circle(base[0] + Math.cos(a) * leafLen * 0.34 * k, base[1] + Math.sin(a) * leafLen * 0.34 * k, 5);
      }
    }
    const tip = polar(1);
    leaf(outer, tip, tangent(1), leafLen * 0.55, leafLen * 0.13);
  }
  const size = R * 2 + leafLen * 2 + 30;
  const specs: PartSpec[] = [
    { path: stems, stroke: "#b8913f", strokeWidth: 3.2 },
    { path: inner, fill: FOIL_DEEP },
    { path: outer, fill: FOIL },
  ];
  if (berries) specs.push({ path: dots, fill: FOIL });
  return assemble(specs, 0, { w: size, h: size, dx: size / 2, dy: size / 2 });
}

/** Thin radiating lines (a sunburst) in a fixed page-sized viewbox. */
export function rays(cx: number, cy: number, r0: number, r1: number, count: number, color: string, w = 1000, h = 1400): OrnamentData {
  const p = new Path();
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    p.M(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0).L(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
  }
  p.include([0, 0], [w, h]);
  return assemble([{ path: p, stroke: color, strokeWidth: 1.3, lineCap: "butt" }], 0, { w, h });
}

export function glint(color: Paint, size = 60): OrnamentData {
  const c = size / 2;
  const p = new Path();
  p.M(c, 0).Q(c, c, size, c).Q(c, c, c, size).Q(c, c, 0, c).Q(c, c, c, 0).Z();
  return assemble([{ path: p, fill: color }], 0, { w: size, h: size });
}

/** Foil ribbon banner with swallow-tail ends. */
export function ribbon(w = 560, h = 78): OrnamentData {
  const t = 52;
  const main = new Path().poly(
    [
      [t, 0],
      [w - t, 0],
      [w - t, h],
      [t, h],
    ],
    true,
  );
  const l = new Path().poly(
    [
      [t + 2, h * 0.16],
      [0, h * 0.16],
      [t * 0.42, h * 0.58],
      [0, h],
      [t + 2, h],
    ],
    true,
  );
  const r = new Path().poly(
    [
      [w - t - 2, h * 0.16],
      [w, h * 0.16],
      [w - t * 0.42, h * 0.58],
      [w, h],
      [w - t - 2, h],
    ],
    true,
  );
  const fold = new Path().poly([[t, h], [t + 2, h], [t + 2, h * 0.16]], true);
  const line = new Path().M(t + 12, 8).L(w - t - 12, 8).M(t + 12, h - 8).L(w - t - 12, h - 8);
  return assemble(
    [
      { path: l, fill: FOIL_DEEP },
      { path: r, fill: FOIL_DEEP },
      { path: main, fill: FOIL },
      { path: fold, fill: "#7a5a22" },
      { path: line, stroke: "#8f6b2c", strokeWidth: 1.2, opacity: 0.7 },
    ],
    0,
    { w, h: h + 2 },
  );
}
