import { Path, type PartSpec, type Pt } from "../design/path";
import type { OrnamentLayer } from "../design/types";
import { linear } from "./kit";
import { ellipsePath, place, rng } from "./birthday-balloons-bold.art";

const rad = (d: number) => (d * Math.PI) / 180;

/** A champagne flute. (cx, by) = centre of its foot; `h` total height; tilt in degrees about the foot. */
export function flute(cx: number, by: number, h: number, tilt: number, seed = 1): OrnamentLayer {
  const t = rad(tilt);
  const P = (x: number, y: number): Pt => [cx + x * Math.cos(t) - (y - 0) * Math.sin(t), by + x * Math.sin(t) + y * Math.cos(t)];
  // local coords: x across, y upward negative from foot
  const rw = h * 0.115; // rim half-width
  const bowlTop = -h;
  const bowlBot = -h * 0.42;
  const sw = h * 0.012;
  const bowl = new Path();
  const pts = (arr: [number, number][]) => arr.map(([x, y]) => P(x, y));
  const [r0, c1, c2, b0, c3, c4, l0] = pts([
    [rw, bowlTop],
    [rw * 1.05, -h * 0.78],
    [rw * 0.85, bowlBot - h * 0.06],
    [0, bowlBot],
    [-rw * 0.85, bowlBot - h * 0.06],
    [-rw * 1.05, -h * 0.78],
    [-rw, bowlTop],
  ]);
  bowl.M(r0[0], r0[1]).C(c1[0], c1[1], c2[0], c2[1], b0[0], b0[1]).C(c3[0], c3[1], c4[0], c4[1], l0[0], l0[1]).Z();
  // liquid (below the fill line)
  const lvl = -h * 0.9;
  const lw = rw * 1.0;
  const liquid = new Path();
  const [q0, q1, q2, q3, q4, q5] = pts([
    [lw, lvl],
    [rw * 1.0, -h * 0.74],
    [rw * 0.84, bowlBot - h * 0.06],
    [0, bowlBot],
    [-rw * 0.84, bowlBot - h * 0.06],
    [-rw * 1.0, -h * 0.74],
  ]);
  const ql = P(-lw, lvl);
  liquid.M(q0[0], q0[1]).C(q1[0], q1[1], q2[0], q2[1], q3[0], q3[1]).C(q4[0], q4[1], q5[0], q5[1], ql[0], ql[1]).Z();
  const stem = new Path();
  const s0 = P(0, bowlBot);
  const s1 = P(0, -h * 0.04);
  stem.M(s0[0], s0[1]).L(s1[0], s1[1]);
  const foot = new Path();
  const f0 = P(-h * 0.14, 0);
  const f1 = P(h * 0.14, 0);
  const fc = P(0, -h * 0.045);
  foot.M(f0[0], f0[1]).Q(fc[0], fc[1], f1[0], f1[1]);
  const footLine = new Path();
  footLine.M(f0[0], f0[1]).L(f1[0], f1[1]);
  const rim = new Path();
  rim.M(r0[0], r0[1]).L(l0[0], l0[1]);
  const shine = new Path();
  const sh0 = P(-rw * 0.7, -h * 0.86);
  const sh1 = P(-rw * 0.62, -h * 0.62);
  const shc = P(-rw * 0.8, -h * 0.74);
  shine.M(sh0[0], sh0[1]).Q(shc[0], shc[1], sh1[0], sh1[1]);
  const r = rng(seed);
  const bubbles = new Path();
  for (let i = 0; i < 16; i++) {
    const bx = (r() - 0.5) * rw * 1.2 * (1 - Math.max(0, (i / 16) * 0.2));
    const by2 = -h * (0.5 + r() * 0.38);
    const [px, py] = P(bx, by2);
    bubbles.circle(px, py, 1.6 + r() * 2.6);
  }
  const specs: PartSpec[] = [
    { path: liquid, fill: linear(90, [0, "#fbe9ac"], [1, "#d9a93f"]), opacity: 0.95 },
    { path: bubbles, fill: "#fff6d0", opacity: 0.85 },
    { path: bowl, stroke: "#f3dfa2", strokeWidth: 3.4 },
    { path: stem, stroke: "#e9cf8a", strokeWidth: 4 },
    { path: foot, stroke: "#e9cf8a", strokeWidth: 4 },
    { path: footLine, stroke: "#e9cf8a", strokeWidth: 3 },
    { path: shine, stroke: "#ffffff", strokeWidth: 3, opacity: 0.55 },
    { path: rim, stroke: "#f3dfa2", strokeWidth: 3 },
  ];
  void sw;
  return place(specs, 4);
}

/** Art-deco fan: concentric arcs + radiating lines, opening upward from (cx, cy). */
export function decoFan(cx: number, cy: number, R: number, color: string, rays = 15, arcs = 3, sw = 2.4): OrnamentLayer {
  const specs: PartSpec[] = [];
  const spokes = new Path();
  for (let i = 0; i <= rays; i++) {
    const a = Math.PI + (Math.PI * i) / rays;
    spokes.M(cx + Math.cos(a) * R * 0.28, cy + Math.sin(a) * R * 0.28).L(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
  }
  specs.push({ path: spokes, stroke: color, strokeWidth: sw * 0.55, opacity: 0.85 });
  for (let k = 0; k < arcs; k++) {
    const rr = R * (0.28 + (0.72 * (k + 1)) / arcs);
    const p = new Path();
    p.M(cx - rr, cy).A(rr, rr, 0, 0, 1, cx + rr, cy);
    p.include([cx, cy - rr]);
    specs.push({ path: p, stroke: color, strokeWidth: k === arcs - 1 ? sw * 1.5 : sw });
  }
  const base = new Path();
  base.M(cx - R, cy).L(cx + R, cy);
  specs.push({ path: base, stroke: color, strokeWidth: sw });
  return place(specs, 3);
}

/** Tiny rising bubbles / glitter field in page coords. */
export function glitter(seed: number, n: number, area: [number, number, number, number], colors: string[], skip?: (x: number, y: number) => boolean): OrnamentLayer {
  const r = rng(seed);
  const byColor = new Map<string, Path>();
  let placed = 0;
  let guard = 0;
  while (placed < n && guard++ < n * 30) {
    const x = area[0] + r() * (area[2] - area[0]);
    const y = area[1] + r() * (area[3] - area[1]);
    if (skip?.(x, y)) continue;
    placed++;
    const c = colors[Math.floor(r() * colors.length)];
    const p = byColor.get(c) ?? byColor.set(c, new Path()).get(c)!;
    if (r() < 0.6) p.circle(x, y, 1.4 + r() * 2.6);
    else {
      const s = 5 + r() * 9;
      p.M(x, y - s).Q(x, y, x + s, y).Q(x, y, x, y + s).Q(x, y, x - s, y).Q(x, y, x, y - s).Z();
    }
  }
  const specs: PartSpec[] = [];
  byColor.forEach((path, c) => specs.push({ path, fill: c }));
  return place(specs, 2);
}

export { ellipsePath };
