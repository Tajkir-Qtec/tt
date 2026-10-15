import { assemble, Path, rad, type OrnamentData, type PartSpec, type Pt } from "../design/path";
import type { Paint } from "../design/types";

export const RG_D = "#9b5d54";
export const RG_M = "#d79a8b";
export const RG_L = "#f7d7c8";

const GEM: Paint = { kind: "linear", angle: 60, stops: [[0, "#ffffff"], [0.5, "#dfeaf5"], [1, "#b9cde3"]] };

function ellPts(cx: number, cy: number, rx: number, ry: number, rot: number, a0: number, a1: number, n = 48): Pt[] {
  const out: Pt[] = [];
  const cr = Math.cos(rad(rot));
  const sr = Math.sin(rad(rot));
  for (let i = 0; i <= n; i++) {
    const a = rad(a0 + ((a1 - a0) * i) / n);
    const x = Math.cos(a) * rx;
    const y = Math.sin(a) * ry;
    out.push([cx + x * cr - y * sr, cy + x * sr + y * cr]);
  }
  return out;
}

/** Two interlocked rose-gold bands with a faceted diamond. Square box `size`. */
export function ringEmblem(size: number): OrnamentData {
  const u = size / 400;
  const s: PartSpec[] = [];
  const band = (pts: Pt[]) => {
    const p = new Path().poly(pts, false);
    s.push({ path: p, stroke: RG_D, strokeWidth: 19 * u, lineCap: "butt" });
    s.push({ path: new Path().poly(pts, false), stroke: RG_M, strokeWidth: 13 * u, lineCap: "butt" });
    s.push({ path: new Path().poly(pts, false), stroke: RG_L, strokeWidth: 4.5 * u, lineCap: "butt", opacity: 0.9 });
  };
  const A = { cx: 150 * u, cy: 232 * u, rx: 92 * u, ry: 118 * u, rot: -14 };
  const B = { cx: 250 * u, cy: 232 * u, rx: 92 * u, ry: 118 * u, rot: 14 };
  band(ellPts(A.cx, A.cy, A.rx, A.ry, A.rot, 0, 360, 90));
  band(ellPts(B.cx, B.cy, B.rx, B.ry, B.rot, 0, 360, 90));
  // re-draw a segment of A over B so the bands interlock
  band(ellPts(A.cx, A.cy, A.rx, A.ry, A.rot, -62, 28, 40));
  // diamond on top of A
  const dx = A.cx + 6 * u;
  const dy = 104 * u;
  const g = (x: number, y: number): Pt => [dx + x * u, dy + y * u];
  const crown = new Path().poly([g(-46, 0), g(-26, -34), g(26, -34), g(46, 0), g(0, 64)], true);
  s.push({ path: crown, fill: GEM, stroke: "#7e93ab", strokeWidth: 3 * u, lineJoin: "round" });
  const facets = new Path();
  facets.poly([g(-46, 0), g(46, 0)]);
  facets.poly([g(-26, -34), g(-14, 0), g(0, 64)]);
  facets.poly([g(26, -34), g(14, 0), g(0, 64)]);
  facets.poly([g(-26, -34), g(0, 0), g(26, -34)]);
  s.push({ path: facets, stroke: "#7e93ab", strokeWidth: 1.6 * u, opacity: 0.85 });
  // prongs
  s.push({ path: new Path().poly([g(-30, 10), g(-18, 40)]), stroke: RG_D, strokeWidth: 5 * u });
  s.push({ path: new Path().poly([g(30, 10), g(18, 40)]), stroke: RG_D, strokeWidth: 5 * u });
  // sparkles
  const spark = (x: number, y: number, r: number) => {
    const p = new Path().M(x, y - r).Q(x, y, x + r, y).Q(x, y, x, y + r).Q(x, y, x - r, y).Q(x, y, x, y - r).Z();
    s.push({ path: p, fill: "#f2c97a" });
  };
  spark(dx - 80 * u, dy - 40 * u, 16 * u);
  spark(dx + 84 * u, dy - 52 * u, 22 * u);
  spark(dx + 60 * u, dy + 30 * u, 10 * u);
  return assemble(s, 0, { w: size, h: size * 0.86, dx: 0, dy: 0 });
}

/** Fine rose-gold laurel of tiny leaves along a gentle curve (page-space box w x h). */
export function leafGarland(w: number, h: number, color: string, flip = false): OrnamentData {
  const s: PartSpec[] = [];
  const pt = (t: number): Pt => [t * w, h * 0.5 + Math.sin(t * Math.PI * 2) * h * 0.28];
  const stem = new Path().M(...pt(0));
  for (let i = 1; i <= 40; i++) stem.L(...pt(i / 40));
  s.push({ path: stem, stroke: color, strokeWidth: 2 });
  const lv = new Path();
  for (let i = 1; i < 22; i++) {
    const t = i / 22;
    const [x, y] = pt(t);
    const tx = w / 22;
    const a = Math.atan2(pt(t + 0.01)[1] - pt(t - 0.01)[1], pt(t + 0.01)[0] - pt(t - 0.01)[0]);
    for (const sd of [-1, 1]) {
      const an = a + sd * rad(52);
      const L = 24;
      const ex = x + Math.cos(an) * L;
      const ey = y + Math.sin(an) * L;
      const nx = -Math.sin(an) * 6;
      const ny = Math.cos(an) * 6;
      lv.M(x, y).Q(x + (ex - x) * 0.5 + nx, y + (ey - y) * 0.5 + ny, ex, ey).Q(x + (ex - x) * 0.5 - nx, y + (ey - y) * 0.5 - ny, x, y).Z();
    }
    void tx;
  }
  s.push({ path: lv, fill: color, opacity: 0.85 });
  const d = assemble(s, 0, { w, h, dx: 0, dy: 0 });
  return flip ? d : d;
}
