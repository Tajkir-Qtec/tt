import { Path, type PartSpec, type Pt } from "../design/path";
import type { Layer } from "../design/types";
import { linear } from "./kit";
import { place, rng } from "./birthday-balloons-bold.art";

export const PINK = "#ff7eb0";
export const PINK_D = "#e0457f";
export const BLUE = "#4aa8ff";
export const BLUE_D = "#2377d6";
export const INK = "#3a2a66";

const zig = (p: Path, x0: number, y0: number, x1: number, y1: number, n: number, amp: number) => {
  for (let i = 1; i <= n; i++) {
    const t = i / n;
    const tm = (i - 0.5) / n;
    const bx = x0 + (x1 - x0) * tm;
    const by = y0 + (y1 - y0) * tm;
    const sgn = i % 2 ? 1 : -1;
    p.Q(bx + sgn * amp, by, x0 + (x1 - x0) * t, y0 + (y1 - y0) * t);
  }
};

/** Full-page pink | blue split with a scalloped diagonal seam. */
export function splitBackdrop(seed: number, topX = 580, botX = 420, dots = true): Layer[] {
  const pink = new Path();
  pink.M(0, 0).L(topX, 0);
  zig(pink, topX, 0, botX, 1400, 14, 34);
  pink.L(0, 1400).Z();
  const blue = new Path();
  blue.M(1000, 0).L(topX, 0);
  zig(blue, topX, 0, botX, 1400, 14, 34);
  blue.L(1000, 1400).Z();
  const out: Layer[] = [
    place([{ path: pink, fill: linear(160, [0, "#ffa5cb"], [1, "#ff6fa9"]) }], 0),
    place([{ path: blue, fill: linear(20, [0, "#86c4ff"], [1, "#3f9bf6"]) }], 0),
  ];
  if (dots) {
    const r = rng(seed);
    const pd = new Path();
    const bd = new Path();
    for (let i = 0; i < 90; i++) {
      const x = r() * 1000;
      const y = r() * 1400;
      const seam = topX + (botX - topX) * (y / 1400);
      if (Math.abs(x - seam) < 50) continue;
      (x < seam ? pd : bd).circle(x, y, 5 + r() * 12);
    }
    out.push(place([{ path: pd, fill: "#ffffff" }], 0, { opacity: 0.28 }), place([{ path: bd, fill: "#ffffff" }], 0, { opacity: 0.28 }));
  }
  return out;
}

/** Party popper / confetti cannon pointing up-left or up-right; (cx,cy) = base centre of the cone. */
export function popper(cx: number, cy: number, s: number, deg: number, main: string, dark: string, stripe: string): Layer {
  const a = (deg * Math.PI) / 180;
  const m = (x: number, y: number): Pt => [cx + x * s * Math.cos(a) - y * s * Math.sin(a), cy + x * s * Math.sin(a) + y * s * Math.cos(a)];
  const cone = new Path().poly([m(-0.1, 0), m(0.1, 0), m(0.5, -1.3), m(-0.5, -1.3)], true);
  const rim = new Path().poly([m(-0.56, -1.3), m(0.56, -1.3), m(0.52, -1.43), m(-0.52, -1.43)], true);
  const st1 = new Path().poly([m(-0.16, -0.42), m(0.16, -0.42), m(0.24, -0.6), m(-0.24, -0.6)], true);
  const st2 = new Path().poly([m(-0.28, -0.82), m(0.28, -0.82), m(0.34, -0.98), m(-0.34, -0.98)], true);
  const hi = new Path().poly([m(-0.1, -0.1), m(-0.03, -0.1), m(-0.3, -1.25), m(-0.4, -1.25)], true);
  return place(
    [
      { path: cone, fill: linear(90, [0, dark], [0.45, main], [1, dark]) },
      { path: st1, fill: stripe },
      { path: st2, fill: stripe },
      { path: hi, fill: "#ffffff", opacity: 0.3 },
      { path: rim, fill: stripe, stroke: dark, strokeWidth: 3 },
    ],
    4,
  );
}

/** Radial burst of confetti + curly streamers from an origin, as one layer. */
export function burst(seed: number, ox: number, oy: number, deg: number, spread: number, dist: number, colors: string[], count = 70): Layer {
  const r = rng(seed);
  const fills = new Map<string, Path>();
  const strokes = new Map<string, Path>();
  const f = (c: string) => fills.get(c) ?? fills.set(c, new Path()).get(c)!;
  const k = (c: string) => strokes.get(c) ?? strokes.set(c, new Path()).get(c)!;
  for (let i = 0; i < count; i++) {
    const ang = ((deg + (r() - 0.5) * spread - 90) * Math.PI) / 180;
    const d = (0.18 + Math.pow(r(), 0.8) * 0.82) * dist;
    const x = ox + Math.cos(ang) * d;
    const y = oy + Math.sin(ang) * d + d * d * 0.00022 * 100 * 0.1;
    const c = colors[Math.floor(r() * colors.length)];
    const rot = r() * Math.PI * 2;
    const kind = Math.floor(r() * 4);
    const R = (px: number, py: number): Pt => [x + px * Math.cos(rot) - py * Math.sin(rot), y + px * Math.sin(rot) + py * Math.cos(rot)];
    if (kind === 0) {
      const w = 12 + r() * 12;
      const h = 6 + r() * 4;
      f(c).poly([R(-w / 2, -h / 2), R(w / 2, -h / 2), R(w / 2, h / 2), R(-w / 2, h / 2)], true);
    } else if (kind === 1) {
      f(c).circle(x, y, 4 + r() * 5);
    } else if (kind === 2) {
      const s = 10 + r() * 6;
      f(c).poly([R(0, -s), R(s, s * 0.8), R(-s, s * 0.8)], true);
    } else {
      const l = 18 + r() * 14;
      const a0 = R(-l, 0);
      const b0 = R(-l / 2, -l * 0.5);
      const c0 = R(0, 0);
      const d0 = R(l / 2, l * 0.5);
      const e0 = R(l, 0);
      k(c).M(a0[0], a0[1]).Q(b0[0], b0[1], c0[0], c0[1]).Q(d0[0], d0[1], e0[0], e0[1]);
    }
  }
  const specs: PartSpec[] = [];
  fills.forEach((path, c) => specs.push({ path, fill: c }));
  strokes.forEach((path, c) => specs.push({ path, stroke: c, strokeWidth: 4, lineCap: "round" }));
  return place(specs, 3);
}
