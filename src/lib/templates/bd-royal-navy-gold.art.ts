import { assemble, Path, rad, type OrnamentData, type PartSpec, type Pt } from "../design/path";
import type { Paint } from "../design/types";

/** Centre x and radius of the circular arc forming the left half of a pointed (two-centred) arch. */
function archGeom(w: number, sp: number) {
  const cx0 = (w * w / 4 + sp * sp) / w;
  const R = cx0;
  const thA = Math.atan2(-sp, w / 2 - cx0); // apex angle, in (-PI, -PI/2)
  return { cx0, R, thA };
}

function archPt(g: { cx0: number; R: number; thA: number }, sp: number, t: number): Pt {
  const th = -Math.PI + t * (g.thA + Math.PI);
  return [g.cx0 + g.R * Math.cos(th), sp + g.R * Math.sin(th)];
}

/**
 * Closed Mughal arch outline. `sp` is the height of the pointed head; below it the
 * sides run straight down. With `cusps` > 0 the head is scalloped into a multifoil arch.
 */
export function archPathM(x: number, y: number, w: number, h: number, sp: number, cusps = 0): Path {
  const g = archGeom(w, sp);
  const p = new Path();
  p.M(x, y + h).L(x, y + sp);
  if (cusps <= 0) {
    p.A(g.R, g.R, 0, 0, 1, x + w / 2, y);
    p.A(g.R, g.R, 0, 0, 1, x + w, y + sp);
  } else {
    const pts: Pt[] = [];
    for (let i = 0; i <= cusps; i++) pts.push(archPt(g, sp, i / cusps));
    for (let i = 1; i <= cusps; i++) {
      const [ax, ay] = pts[i - 1];
      const [bx, by] = pts[i];
      const chord = Math.hypot(bx - ax, by - ay);
      p.A(chord * 0.6, chord * 0.6, 0, 0, 1, x + bx, y + by);
    }
    for (let i = cusps - 1; i >= 0; i--) {
      const [ax, ay] = pts[i + 1];
      const [bx, by] = pts[i];
      const chord = Math.hypot(bx - ax, by - ay);
      p.A(chord * 0.6, chord * 0.6, 0, 0, 1, x + w - bx, y + by);
    }
  }
  p.L(x + w, y + h).Z();
  p.include([x, y], [x + w, y + h]);
  return p;
}

/** Triple-layer arch frame: plain outer arch, multifoil arch, hairline inner arch. */
export function mughalArch(o: {
  w: number;
  h: number;
  stroke: Paint;
  fill?: Paint | null;
  cusps?: number;
  sw?: number;
  lines?: boolean;
  sp?: number;
  outerFill?: Paint | null;
}): OrnamentData {
  const sw = o.sw ?? 3;
  const sp = o.sp ?? o.h * 0.46;
  const cusps = o.cusps ?? 7;
  const specs: PartSpec[] = [];
  const stroke = o.stroke as string;
  if (o.lines !== false) {
    specs.push({ path: archPathM(sw / 2, sw / 2, o.w - sw, o.h - sw, sp, 0), stroke, strokeWidth: sw, fill: o.outerFill ?? null, lineJoin: "miter" });
    specs.push({ path: archPathM(14, 14, o.w - 28, o.h - 14, sp - 8, 0), stroke, strokeWidth: sw * 0.4, lineJoin: "miter" });
  }
  const g = o.lines === false ? sw / 2 : 28;
  specs.push({ path: archPathM(g, g, o.w - g * 2, o.h - g, sp - g * 0.6, cusps), stroke, strokeWidth: sw * 0.75, fill: o.fill ?? null, lineJoin: "miter" });
  return assemble(specs, 0, { w: o.w, h: o.h });
}

/** A small eight-pointed khatam star with a centre dot (used as finial and spacer). */
export function khatam(o: { stroke: string; fill?: Paint | null; size?: number; sw?: number }): OrnamentData {
  const S = o.size ?? 120;
  const c = S / 2;
  const sw = o.sw ?? 2;
  const star = (r: number, rot: number) => {
    const pts: Pt[] = [];
    for (let i = 0; i < 16; i++) {
      const a = rad(rot + i * 22.5);
      const rr = i % 2 === 0 ? r : r * 0.62;
      pts.push([c + Math.cos(a) * rr, c + Math.sin(a) * rr]);
    }
    return new Path().poly(pts, true);
  };
  const specs: PartSpec[] = [
    { path: star(c - 2, -90), stroke: o.stroke, strokeWidth: sw, fill: o.fill ?? null, lineJoin: "miter" },
    { path: star(c * 0.55, -67.5), stroke: o.stroke, strokeWidth: sw * 0.6, lineJoin: "miter" },
    { path: new Path().circle(c, c, c * 0.1), fill: o.stroke },
  ];
  return assemble(specs, 0, { w: S, h: S });
}

/** Hex-star jaali lattice: interlaced six-pointed stars in a honeycomb grid. */
export function jaaliHex(o: { w: number; h: number; color: string; cell?: number; sw?: number }): OrnamentData {
  const cell = o.cell ?? 80;
  const sw = o.sw ?? 1.2;
  const lines = new Path();
  const dots = new Path();
  const dx = cell;
  const dy = cell * 0.866;
  const rows = Math.ceil(o.h / dy) + 2;
  const cols = Math.ceil(o.w / dx) + 2;
  for (let j = -1; j < rows; j++) {
    for (let i = -1; i < cols; i++) {
      const cx = i * dx + (j % 2 ? dx / 2 : 0);
      const cy = j * dy;
      const r = cell * 0.5;
      // hexagram: two triangles
      const tri = (rot: number) => {
        const pts: Pt[] = [];
        for (let k = 0; k < 3; k++) pts.push([cx + Math.cos(rad(rot + k * 120)) * r, cy + Math.sin(rad(rot + k * 120)) * r]);
        lines.poly(pts, true);
      };
      tri(-90);
      tri(90);
      dots.circle(cx, cy, 1.8);
    }
  }
  return assemble(
    [
      { path: lines, stroke: o.color, strokeWidth: sw, lineJoin: "miter" },
      { path: dots, fill: o.color },
    ],
    0,
    { w: o.w, h: o.h },
  );
}

/** Row of small gold domes (chhatri skyline) used along the top of a panel. */
export function chhatriRow(o: { w: number; color: string; fill?: Paint | null; n?: number; sw?: number }): OrnamentData {
  const n = o.n ?? 9;
  const unit = o.w / n;
  const H = unit * 1.3;
  const p = new Path();
  const fin = new Path();
  for (let i = 0; i < n; i++) {
    const x = i * unit;
    const r = unit * 0.36;
    const cx = x + unit / 2;
    p.M(cx - r, H).L(cx - r, H - r * 0.9).C(cx - r, H - r * 1.9, cx - r * 0.2, H - r * 2.0, cx, H - r * 2.7).C(cx + r * 0.2, H - r * 2.0, cx + r, H - r * 1.9, cx + r, H - r * 0.9).L(cx + r, H).Z();
    fin.M(cx, H - r * 2.7).L(cx, H - r * 3.2);
    fin.circle(cx, H - r * 3.3, 1.8);
  }
  return assemble(
    [
      { path: p, stroke: o.color, strokeWidth: o.sw ?? 1.8, fill: o.fill ?? null, lineJoin: "miter" },
      { path: fin, stroke: o.color, strokeWidth: 1.4 },
    ],
    0,
    { w: o.w, h: H + 4, dx: 0, dy: 0 },
  );
}
