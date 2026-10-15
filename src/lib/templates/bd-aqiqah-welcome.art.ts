import { starPoints } from "../design/ornaments";
import { assemble, Path, rad, type OrnamentData, type PartSpec } from "../design/path";
import type { Paint } from "../design/types";

const sc = (specs: PartSpec[], w = 1000, h = 1400): OrnamentData => assemble(specs, 0, { w, h, dx: 0, dy: 0 });

export const MOON_GOLD: Paint = { kind: "linear", angle: 120, stops: [[0, "#f7e3a0"], [0.5, "#d9b050"], [1, "#b88a2e"]] };

function crescentPath(cx: number, cy: number, R: number, tilt: number): Path {
  const r = R * 0.8;
  const d = R * 0.42;
  const px = (R * R - r * r + d * d) / (2 * d);
  const py = Math.sqrt(Math.max(0, R * R - px * px));
  const rot = rad(tilt);
  const rp = (x: number, y: number): [number, number] => [cx + x * Math.cos(rot) - y * Math.sin(rot), cy + x * Math.sin(rot) + y * Math.cos(rot)];
  const a = rp(px, -py);
  const b = rp(px, py);
  const p = new Path().M(a[0], a[1]).A(R, R, 0, 1, 0, b[0], b[1]).A(r, r, 0, 1, 1, a[0], a[1]).Z();
  p.include([cx - R, cy - R], [cx + R, cy + R]);
  return p;
}

/** A hanging nursery mobile: crescent moon centre, stars and beads at different lengths (page space). */
export function mobile(): OrnamentData {
  const s: PartSpec[] = [];
  const str = (x: number, y0: number, y1: number, x1 = x) => s.push({ path: new Path().M(x, y0).L(x1, y1), stroke: "#c9a65a", strokeWidth: 1.8, opacity: 0.9 });
  const star = (cx: number, cy: number, R: number, fill: Paint, rot = -90) =>
    s.push({ path: new Path().poly(starPoints(cx, cy, 5, R, R * 0.46, rot), true), fill, stroke: "#c9a65a", strokeWidth: 1.6, lineJoin: "round" });
  const bead = (x: number, y: number, r: number, c: string) => s.push({ path: new Path().circle(x, y, r), fill: c, stroke: "#ffffff", strokeWidth: 1.2 });
  // moon
  str(410, -4, 160, 424);
  str(540, -4, 134, 484);
  s.push({ path: crescentPath(500, 250, 118, -30), fill: MOON_GOLD, stroke: "#a97f28", strokeWidth: 1.6 });
  s.push({ path: crescentPath(500, 250, 118, -30), stroke: "#fff4c8", strokeWidth: 1, opacity: 0.0 });
  star(572, 262, 26, "#fff4c8", -90);
  // side stars
  const sets: { x: number; len: number; R: number; c: Paint; b?: string }[] = [
    { x: 230, len: 150, R: 38, c: "#f9d3d3", b: "#cfe3ef" },
    { x: 130, len: 260, R: 30, c: "#cfe3ef", b: "#f9d3d3" },
    { x: 770, len: 190, R: 36, c: "#cfe6d4", b: "#f9d3d3" },
    { x: 870, len: 300, R: 30, c: "#f9d3d3", b: "#cfe3ef" },
    { x: 330, len: 60, R: 24, c: "#cfe6d4" },
    { x: 670, len: 80, R: 22, c: "#cfe3ef" },
  ];
  for (const it of sets) {
    str(it.x, -4, it.len);
    if (it.b) bead(it.x, it.len * 0.45, 7, it.b);
    star(it.x, it.len + it.R * 0.9, it.R, it.c);
    s.push({ path: new Path().circle(it.x, it.len + it.R * 0.9, 3), fill: "#c9a65a" });
  }
  // little dots
  for (const [x, y, r] of [[60, 120, 4], [940, 140, 4], [380, 330, 3], [640, 360, 3], [250, 420, 3], [760, 450, 3]]) s.push({ path: new Path().circle(x, y, r), fill: "#e0bd6a", opacity: 0.8 });
  return sc(s, 1000, 520);
}

/** Soft cloud, local box w x w*0.5. */
export function cloud(w: number, fill: Paint = "#ffffff", opacity = 1): OrnamentData {
  const h = w * 0.5;
  const base = h * 0.78;
  const p = new Path();
  p.M(h * 0.2, base).C(-h * 0.02, base, -h * 0.02, h * 0.42, h * 0.3, h * 0.44);
  p.C(h * 0.3, h * 0.1, w * 0.46, h * 0.0, w * 0.5, h * 0.3);
  p.C(w * 0.56, h * 0.12, w * 0.76, h * 0.18, w * 0.74, h * 0.46);
  p.C(w * 1.02, h * 0.42, w * 1.02, base, w - h * 0.2, base).Z();
  return sc([{ path: p, fill, opacity }], w, h);
}

/** Layered rolling hills with tiny stars, 1000 x h. */
export function hills(h: number, tones: string[]): OrnamentData {
  const s: PartSpec[] = [];
  tones.forEach((c, i) => {
    const y = h * (0.1 + 0.28 * i);
    const p = new Path().M(0, y + 40 * (i % 2 ? -1 : 1));
    p.C(220, y - 70, 420, y + 70, 640, y - 10).C(800, y - 60, 900, y + 10, 1000, y - 30).L(1000, h).L(0, h).Z();
    s.push({ path: p, fill: c });
  });
  return sc(s, 1000, h);
}

/** Islamic eight-point star ring used as a faint medallion. */
export function crescentStarBadge(size: number, color: string): OrnamentData {
  const c = size / 2;
  const s: PartSpec[] = [];
  s.push({ path: new Path().circle(c, c, c - 4), stroke: color, strokeWidth: 2 });
  s.push({ path: new Path().circle(c, c, c - 14), stroke: color, strokeWidth: 1, opacity: 0.7 });
  s.push({ path: crescentPath(c - size * 0.04, c, size * 0.3, -20), fill: MOON_GOLD, stroke: "#a97f28", strokeWidth: 1.2 });
  s.push({ path: new Path().poly(starPoints(c + size * 0.17, c - size * 0.02, 5, size * 0.07, size * 0.032, -90), true), fill: MOON_GOLD, stroke: "#a97f28", strokeWidth: 1 });
  return sc(s, size, size);
}
