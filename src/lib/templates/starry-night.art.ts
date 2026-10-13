import { sparkle, star } from "../design/ornaments";
import { assemble, Path, type OrnamentData, type Pt } from "../design/path";
import type { Layer } from "../design/types";
import { lock, O } from "./kit";

/** Deterministic pseudo-random generator (no runtime randomness). */
function lcg(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
}

export type Rect = [x0: number, y0: number, x1: number, y1: number];

/** A scatter of small stars and sparkles at fixed (seeded) positions, avoiding the given rectangles. */
export function starField(seed: number, count: number, avoid: Rect[], colors = ["#f4f6fc", "#dfe5f5", "#c4cde6"]): Layer[] {
  const rnd = lcg(seed);
  const out: Layer[] = [];
  let guard = 0;
  while (out.length < count && guard++ < count * 40) {
    const x = 40 + rnd() * 920;
    const y = 40 + rnd() * 1320;
    if (avoid.some(([a, b, c, d]) => x > a && x < c && y > b && y < d)) continue;
    const big = rnd() < 0.3;
    const size = big ? 14 + rnd() * 18 : 5 + rnd() * 8;
    const opacity = 0.3 + rnd() * 0.7;
    const color = colors[Math.floor(rnd() * colors.length)];
    const data = big ? sparkle({ color, size }) : star({ color, size, points: 5, inner: 0.45 });
    out.push(lock(O(data, { cx: x, y: y - size / 2, width: size, opacity })));
  }
  return out;
}

/** Thin silver constellation: lines between nodes, small ring-dots at the nodes. */
export function constellation(points: Pt[], color: string, w = 1000, h = 1400): OrnamentData {
  const lines = new Path();
  points.forEach(([x, y], i) => (i === 0 ? lines.M(x, y) : lines.L(x, y)));
  lines.include([0, 0], [w, h]);
  const dots = new Path();
  points.forEach(([x, y]) => dots.circle(x, y, 3.2));
  return assemble(
    [
      { path: lines, stroke: color, strokeWidth: 1.1, lineCap: "round", lineJoin: "round", opacity: 0.7 },
      { path: dots, fill: color },
    ],
    0,
    { w, h },
  );
}
