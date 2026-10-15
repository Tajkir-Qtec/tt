import { Path, type PartSpec, type Pt } from "../design/path";
import type { Layer } from "../design/types";
import { linear, radial } from "./kit";
import { ellipsePath, place, rng } from "./birthday-balloons-bold.art";

export const NIGHT = "#0b1038";
export const INK = "#ffffff";
export const GOLD = "#ffd24a";
export const ORANGE = "#ff8a3d";
export const CORAL = "#ff5d6c";
export const CYAN = "#5de0ff";

/** Star field: tiny dots + 4-point twinkles, one layer. */
export function stars(seed: number, count: number, area: [number, number, number, number], skip?: (x: number, y: number) => boolean, op = 1): Layer {
  const r = rng(seed);
  const white = new Path();
  const warm = new Path();
  const cool = new Path();
  let n = 0;
  let g = 0;
  while (n < count && g++ < count * 30) {
    const x = area[0] + r() * (area[2] - area[0]);
    const y = area[1] + r() * (area[3] - area[1]);
    if (skip?.(x, y)) continue;
    n++;
    const t = r();
    const p = t < 0.6 ? white : t < 0.8 ? warm : cool;
    if (r() < 0.78) p.circle(x, y, 1.2 + r() * 2.6);
    else {
      const R = 7 + r() * 14;
      const k = 0.2;
      p.poly([[x, y - R], [x + R * k, y - R * k], [x + R, y], [x + R * k, y + R * k], [x, y + R], [x - R * k, y + R * k], [x - R, y], [x - R * k, y - R * k]], true);
    }
  }
  return place([{ path: white, fill: "#ffffff" }, { path: warm, fill: "#ffe9a8" }, { path: cool, fill: "#b8e6ff" }], 2, { opacity: op });
}

function slice(cx: number, cy: number, r: number, y1: number, y2: number): Path {
  const pts: Pt[] = [];
  const n = 16;
  const xAt = (y: number) => Math.sqrt(Math.max(0, r * r - (y - cy) * (y - cy)));
  for (let i = 0; i <= n; i++) {
    const y = y1 + ((y2 - y1) * i) / n;
    pts.push([cx - xAt(y), y]);
  }
  for (let i = n; i >= 0; i--) {
    const y = y1 + ((y2 - y1) * i) / n;
    pts.push([cx + xAt(y), y]);
  }
  return new Path().poly(pts, true);
}

export interface PlanetOpts {
  light: string;
  base: string;
  dark: string;
  bands?: { y: number; h: number; color: string }[];
  craters?: { x: number; y: number; r: number }[];
  ring?: { color: string; color2: string; tilt: number };
  glow?: string;
}

/** Shaded planet with optional bands, craters and a tilted ring. Returns layers. */
export function planet(cx: number, cy: number, r: number, o: PlanetOpts): Layer[] {
  const out: Layer[] = [];
  const ringPts = (a0: number, a1: number, rx: number, ry: number): Pt[] => {
    const t = (o.ring!.tilt * Math.PI) / 180;
    const pts: Pt[] = [];
    for (let i = 0; i <= 48; i++) {
      const a = a0 + ((a1 - a0) * i) / 48;
      const x = Math.cos(a) * rx;
      const y = Math.sin(a) * ry;
      pts.push([cx + x * Math.cos(t) - y * Math.sin(t), cy + x * Math.sin(t) + y * Math.cos(t)]);
    }
    return pts;
  };
  if (o.glow) out.push(place([{ path: ellipsePath(cx, cy, r * 1.35, r * 1.35), fill: radial([0, o.glow], [1, "rgba(255,255,255,0)"]) }], 0, { opacity: 0.35 }));
  if (o.ring) {
    const back = new Path().poly(ringPts(Math.PI, Math.PI * 2, r * 1.95, r * 0.5));
    const back2 = new Path().poly(ringPts(Math.PI, Math.PI * 2, r * 1.65, r * 0.4));
    out.push(place([{ path: back, stroke: o.ring.color, strokeWidth: r * 0.17 }, { path: back2, stroke: o.ring.color2, strokeWidth: r * 0.1 }], 4));
  }
  const specs: PartSpec[] = [{ path: ellipsePath(cx, cy, r, r), fill: radial([0, o.light], [0.55, o.base], [1, o.dark]) }];
  for (const b of o.bands ?? []) {
    const y1 = cy + b.y * r;
    const y2 = y1 + b.h * r;
    specs.push({ path: slice(cx, cy, r, Math.max(cy - r + 1, y1), Math.min(cy + r - 1, y2)), fill: b.color, opacity: 0.75 });
  }
  for (const c of o.craters ?? []) {
    specs.push({ path: ellipsePath(cx + c.x * r, cy + c.y * r, c.r * r, c.r * r * 0.85), fill: o.dark, opacity: 0.45 });
    specs.push({ path: ellipsePath(cx + c.x * r - c.r * r * 0.12, cy + c.y * r - c.r * r * 0.12, c.r * r * 0.75, c.r * r * 0.62), fill: o.light, opacity: 0.35 });
  }
  // terminator shadow (lower right)
  specs.push({ path: ellipsePath(cx + r * 0.35, cy + r * 0.3, r * 0.95, r * 0.95), fill: "#0b1038", opacity: 0.0 });
  out.push(place(specs, 3));
  if (o.ring) {
    const front = new Path().poly(ringPts(0, Math.PI, r * 1.95, r * 0.5));
    const front2 = new Path().poly(ringPts(0, Math.PI, r * 1.65, r * 0.4));
    out.push(place([{ path: front, stroke: o.ring.color, strokeWidth: r * 0.17 }, { path: front2, stroke: o.ring.color2, strokeWidth: r * 0.1 }], 4));
  }
  return out;
}

/** Cartoon rocket. (cx,cy) = centre of body, s = half body height. */
export function rocket(cx: number, cy: number, s: number, deg: number, o: { flame?: boolean } = {}): Layer[] {
  const a = (deg * Math.PI) / 180;
  const m = (x: number, y: number): Pt => [cx + (x * Math.cos(a) - y * Math.sin(a)) * s, cy + (x * Math.sin(a) + y * Math.cos(a)) * s];
  const st = { stroke: "#1a1f5c", strokeWidth: 5, lineJoin: "round" as const };
  const out: Layer[] = [];
  if (o.flame !== false) {
    const f1 = new Path();
    f1.M(...m(-0.3, 1.0));
    f1.C(...m(-0.5, 1.7), ...m(-0.12, 2.0), ...m(0, 2.5));
    f1.C(...m(0.12, 2.0), ...m(0.5, 1.7), ...m(0.3, 1.0));
    f1.Z();
    const f2 = new Path();
    f2.M(...m(-0.18, 1.0));
    f2.C(...m(-0.3, 1.5), ...m(-0.06, 1.7), ...m(0, 2.05));
    f2.C(...m(0.06, 1.7), ...m(0.3, 1.5), ...m(0.18, 1.0));
    f2.Z();
    const f3 = new Path();
    f3.M(...m(-0.08, 1.0));
    f3.C(...m(-0.12, 1.3), ...m(-0.02, 1.4), ...m(0, 1.6));
    f3.C(...m(0.02, 1.4), ...m(0.12, 1.3), ...m(0.08, 1.0));
    f3.Z();
    out.push(place([{ path: f1, fill: linear(90, [0, "#ff9a3d"], [1, "#ff3d5a"]), opacity: 0.95 }, { path: f2, fill: GOLD }, { path: f3, fill: "#ffffff" }], 3));
  }
  // fins
  const fins: PartSpec[] = [];
  for (const sg of [-1, 1]) {
    const fin = new Path();
    fin.M(...m(sg * 0.42, 0.25));
    fin.C(...m(sg * 0.8, 0.45), ...m(sg * 0.95, 0.8), ...m(sg * 0.9, 1.1));
    fin.L(...m(sg * 0.4, 0.95));
    fin.Z();
    fins.push({ path: fin, fill: linear(90, [0, "#ff6b78"], [1, "#d93a4a"]), ...st });
  }
  // center fin
  fins.push({ path: new Path().poly([m(-0.1, 0.7), m(0.1, 0.7), m(0.08, 1.12), m(-0.08, 1.12)], true), fill: "#d93a4a", ...st });
  out.push(place(fins, 6));
  // body
  const body = new Path();
  body.M(...m(0, -1.55));
  body.C(...m(0.5, -1.15), ...m(0.55, -0.4), ...m(0.45, 0.4));
  body.L(...m(0.4, 1.0));
  body.L(...m(-0.4, 1.0));
  body.L(...m(-0.45, 0.4));
  body.C(...m(-0.55, -0.4), ...m(-0.5, -1.15), ...m(0, -1.55));
  body.Z();
  const nose = new Path();
  nose.M(...m(0, -1.55));
  nose.C(...m(0.22, -1.38), ...m(0.36, -1.1), ...m(0.42, -0.85));
  nose.L(...m(-0.42, -0.85));
  nose.C(...m(-0.36, -1.1), ...m(-0.22, -1.38), ...m(0, -1.55));
  nose.Z();
  const noz = new Path().poly([m(-0.3, 1.0), m(0.3, 1.0), m(0.22, 1.15), m(-0.22, 1.15)], true);
  const band = new Path().poly([m(-0.5, 0.45), m(0.5, 0.45), m(0.47, 0.6), m(-0.47, 0.6)], true);
  const hi = new Path().poly([m(-0.33, -0.7), m(-0.25, -0.7), m(-0.3, 0.3), m(-0.38, 0.3)], true);
  out.push(
    place(
      [
        { path: noz, fill: "#6a72a8", ...st },
        { path: body, fill: linear(0, [0, "#cfd6ff"], [0.4, "#ffffff"], [1, "#9fa8e6"]), ...st },
        { path: nose, fill: linear(0, [0, "#ff6b78"], [0.5, "#ff9aa3"], [1, "#d93a4a"]), ...st },
        { path: band, fill: "#3b6cff", stroke: "#1a1f5c", strokeWidth: 4 },
        { path: hi, fill: "#ffffff", opacity: 0.55 },
      ],
      6,
    ),
  );
  // porthole
  const wc = m(0, -0.35);
  out.push(
    place(
      [
        { path: ellipsePath(wc[0], wc[1], 0.27 * s, 0.27 * s), fill: "#8aa0ff", ...st },
        { path: ellipsePath(wc[0], wc[1], 0.2 * s, 0.2 * s), fill: radial([0, "#8fe7ff"], [1, "#2a56d8"]) },
        { path: ellipsePath(wc[0] - 0.07 * s, wc[1] - 0.08 * s, 0.06 * s, 0.035 * s, -40), fill: "#ffffff", opacity: 0.85 },
      ],
      6,
    ),
  );
  return out;
}

/** Astronaut helmet ring: white shell with dark visor (an image goes on top of the visor). */
export function helmet(cx: number, cy: number, r: number): { back: Layer[]; front: Layer[] } {
  const shell = ellipsePath(cx, cy, r, r);
  const visor = ellipsePath(cx, cy + r * 0.02, r * 0.78, r * 0.7);
  const back: Layer[] = [
    // neck ring
    place([{ path: new Path().poly([[cx - r * 0.7, cy + r * 0.82], [cx + r * 0.7, cy + r * 0.82], [cx + r * 0.78, cy + r * 1.12], [cx - r * 0.78, cy + r * 1.12]], true), fill: linear(0, [0, "#9aa4e0"], [0.5, "#ffffff"], [1, "#9aa4e0"]), stroke: "#1a1f5c", strokeWidth: 5, lineJoin: "round" }], 6),
    place([{ path: shell, fill: radial([0, "#ffffff"], [0.7, "#e6eaff"], [1, "#9ea9e8"]), stroke: "#1a1f5c", strokeWidth: 6 }], 8),
    // ear caps
    place([{ path: ellipsePath(cx - r * 1.0, cy, r * 0.13, r * 0.26), fill: CORAL, stroke: "#1a1f5c", strokeWidth: 5 }, { path: ellipsePath(cx + r * 1.0, cy, r * 0.13, r * 0.26), fill: CORAL, stroke: "#1a1f5c", strokeWidth: 5 }], 6),
    place([{ path: visor, fill: linear(60, [0, "#3b2a9e"], [0.5, "#16206e"], [1, "#0b1038"]), stroke: "#1a1f5c", strokeWidth: 8 }, { path: ellipsePath(cx, cy + r * 0.02, r * 0.84, r * 0.76), fill: null, stroke: "#c9d2ff", strokeWidth: 8 }], 10),
  ];
  const g1 = new Path();
  g1.M(cx - r * 0.55, cy - r * 0.18).Q(cx - r * 0.52, cy - r * 0.45, cx - r * 0.2, cy - r * 0.56);
  const g2 = new Path();
  g2.M(cx + r * 0.42, cy + r * 0.38).Q(cx + r * 0.5, cy + r * 0.28, cx + r * 0.56, cy + r * 0.1);
  const front: Layer[] = [place([{ path: g1, stroke: "#ffffff", strokeWidth: 12, lineCap: "round", opacity: 0.8 }, { path: g2, stroke: "#ffffff", strokeWidth: 9, lineCap: "round", opacity: 0.55 }], 8)];
  return { back, front };
}

/** Dashed orbit ellipse decoration. */
export function orbit(cx: number, cy: number, rx: number, ry: number, rot: number, color = "#7f8cff", op = 0.45): Layer {
  const t = (rot * Math.PI) / 180;
  const pts: Pt[] = [];
  const dash = new Path();
  const N = 120;
  for (let i = 0; i < N; i++) {
    if (i % 3 === 2) continue;
    const a0 = (i / N) * Math.PI * 2;
    const a1 = ((i + 1) / N) * Math.PI * 2;
    const P = (a: number): Pt => [cx + Math.cos(a) * rx * Math.cos(t) - Math.sin(a) * ry * Math.sin(t), cy + Math.cos(a) * rx * Math.sin(t) + Math.sin(a) * ry * Math.cos(t)];
    const p0 = P(a0);
    const p1 = P(a1);
    dash.M(p0[0], p0[1]).L(p1[0], p1[1]);
  }
  void pts;
  return place([{ path: dash, stroke: color, strokeWidth: 3 }], 4, { opacity: op });
}
