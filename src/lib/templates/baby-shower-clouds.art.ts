import { centerRotate, makeOrnament } from "../design/layers";
import { assemble, Path, rad, type OrnamentData, type Pt } from "../design/path";
import { starPoints } from "../design/ornaments";
import type { Layer, Paint } from "../design/types";
import { lock } from "./kit";

/** Place ornament data centred on (cx,cy) at the given width, optionally rotated. Locked (decorative). */
export function put(data: OrnamentData, cx: number, cy: number, w: number, rot = 0, opacity = 1): Layer {
  const h = (w * data.vbH) / data.vbW;
  const l = makeOrnament(data, { x: cx - w / 2, y: cy - h / 2, width: w, height: h, opacity });
  return lock(rot ? centerRotate(l, cx, cy, rot) : l);
}

const vgrad = (a: string, b: string): Paint => ({ kind: "linear", angle: 90, stops: [[0, a], [1, b]] });

/** Fluffy cloud with a soft under-shadow. */
export function cloud(top: string, bottom: string, shade: string): OrnamentData {
  const build = (dy: number) => {
    const p = new Path();
    const cs: [number, number, number][] = [
      [92, 160, 58],
      [172, 108, 78],
      [262, 122, 64],
      [330, 160, 52],
    ];
    for (const [x, y, r] of cs) p.circle(x, y + dy, r);
    // base block, same winding as circle() (counter-clockwise on screen)
    p.poly(
      [
        [92, 118 + dy],
        [92, 218 + dy],
        [330, 218 + dy],
        [330, 118 + dy],
      ],
      true,
    );
    return p;
  };
  return assemble(
    [
      { path: build(12), fill: shade },
      { path: build(0), fill: vgrad(top, bottom) },
    ],
    2,
  );
}

/** Soft rounded five-point star. */
export function softStar(c1: string, c2: string, size = 100, inner = 0.5): OrnamentData {
  const pts = starPoints(size / 2, size / 2, 5, size / 2, (size / 2) * inner);
  const n = pts.length;
  const mid = (a: Pt, b: Pt): Pt => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const p = new Path();
  const m0 = mid(pts[n - 1], pts[0]);
  p.M(m0[0], m0[1]);
  for (let i = 0; i < n; i++) {
    const m = mid(pts[i], pts[(i + 1) % n]);
    p.Q(pts[i][0], pts[i][1], m[0], m[1]);
  }
  p.Z();
  return assemble([{ path: p, fill: { kind: "linear", angle: 60, stops: [[0, c1], [1, c2]] } }], 2);
}

/** Crescent moon with a gradient and a sleepy face. */
export function sleepyMoon(c1: string, c2: string, face: string, size = 160): OrnamentData {
  const R = size / 2;
  const r = R * 0.8;
  const d = R * 0.42;
  const x = (R * R - r * r + d * d) / (2 * d);
  const y = Math.sqrt(Math.max(0, R * R - x * x));
  const p = new Path();
  p.M(x, -y).A(R, R, 0, 1, 0, x, y).A(r, r, 0, 1, 1, x, -y).Z();
  p.include([-R, -R], [R, R]);
  // face: closed eye + tiny smile + cheek, on the thick part of the crescent (left side)
  const eye = new Path().M(-R * 0.62, -R * 0.1).Q(-R * 0.5, R * 0.06, -R * 0.38, -R * 0.1);
  const smile = new Path().M(-R * 0.58, R * 0.3).Q(-R * 0.5, R * 0.4, -R * 0.4, R * 0.3);
  const cheek = new Path().circle(-R * 0.66, R * 0.16, R * 0.06);
  return assemble(
    [
      { path: p, fill: { kind: "linear", angle: 45, stops: [[0, c1], [1, c2]] } },
      { path: eye, stroke: face, strokeWidth: 2.6 },
      { path: smile, stroke: face, strokeWidth: 2.6 },
      { path: cheek, fill: "#f2b9a8", opacity: 0.8 },
    ],
    3,
  );
}

/** Tiny heart for accents. */
export function miniHeart(color: string, size = 60): OrnamentData {
  const S = size;
  const p = new Path();
  p.M(S / 2, S * 0.92)
    .C(S * 0.05, S * 0.58, -S * 0.05, S * 0.18, S * 0.25, S * 0.08)
    .C(S * 0.4, S * 0.03, S * 0.5, S * 0.14, S / 2, S * 0.24)
    .C(S * 0.5, S * 0.14, S * 0.6, S * 0.03, S * 0.75, S * 0.08)
    .C(S * 1.05, S * 0.18, S * 0.95, S * 0.58, S / 2, S * 0.92)
    .Z();
  return assemble([{ path: p, fill: color }], 2);
}

/** Four-point twinkle. */
export function twinkle(color: string, size = 60): OrnamentData {
  const c = size / 2;
  const p = new Path();
  p.M(c, 0).Q(c, c, size, c).Q(c, c, c, size).Q(c, c, 0, c).Q(c, c, c, 0).Z();
  return assemble([{ path: p, fill: color }], 0, { w: size, h: size });
}

/** Hanging mobile: strings, beads, bar - drawn in page coordinates (place at 0,0 with width 1000). */
export function mobileStrings(opts: { color: string; bead: string; bar: Paint; hangs: { x: number; y: number }[]; barY: number; x0: number; x1: number; height: number }): OrnamentData {
  const strings = new Path();
  const beads = new Path();
  const bar = new Path();
  const cx = (opts.x0 + opts.x1) / 2;
  // stem
  strings.M(cx, 0).L(cx, opts.barY - 6);
  beads.circle(cx, 52, 9);
  // soft arch bar with end caps
  bar.M(opts.x0, opts.barY + 6).Q(cx, opts.barY - 14, opts.x1, opts.barY + 6);
  beads.circle(opts.x0, opts.barY + 6, 8);
  beads.circle(opts.x1, opts.barY + 6, 8);
  for (const h of opts.hangs) {
    const t = (h.x - opts.x0) / (opts.x1 - opts.x0);
    const by = opts.barY + 6 - 20 * (1 - Math.pow(2 * t - 1, 2)) * 0.5 + 0; // matches quadratic dip approx
    const startY = (1 - t) * (1 - t) * (opts.barY + 6) + 2 * (1 - t) * t * (opts.barY - 14) + t * t * (opts.barY + 6);
    void by;
    strings.M(h.x, startY).L(h.x, h.y);
    for (let yy = startY + 34; yy < h.y - 30; yy += 34) beads.circle(h.x, yy, 3.6);
    beads.circle(h.x, startY, 4.5);
  }
  strings.include([0, 0], [1000, opts.height]);
  return assemble(
    [
      { path: strings, stroke: opts.color, strokeWidth: 2.2 },
      { path: bar, stroke: opts.color, strokeWidth: 7 },
      { path: beads, fill: opts.bead },
    ],
    0,
    { w: 1000, h: opts.height },
  );
}

export { rad };
