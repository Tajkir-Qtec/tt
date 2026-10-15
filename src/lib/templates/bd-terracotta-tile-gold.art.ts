import { assemble, Path, petal, rad, type OrnamentData, type PartSpec } from "../design/path";
import type { Paint } from "../design/types";

/* Original terracotta-relief art: tiles, multifoil arches, domes, vine bands. */

/** Multi-foil (cusped) arch path: straight sides, scalloped crown. */
export function foilArch(p: Path, x: number, y: number, w: number, h: number, lobes = 9, close = true) {
  const r = w / 2;
  const cy = y + r;
  p.M(x, y + h).L(x, cy);
  const pts: [number, number][] = [];
  for (let i = 0; i <= lobes; i++) {
    const a = Math.PI - (Math.PI * i) / lobes;
    pts.push([x + r + Math.cos(a) * r, cy - Math.sin(a) * r]);
  }
  for (let i = 1; i < pts.length; i++) {
    const chord = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    const rr = chord * 0.56;
    p.A(rr, rr, 0, 0, 1, pts[i][0], pts[i][1]);
  }
  p.include([x, y], [x + w, y]);
  p.L(x + w, y + h);
  if (close) p.Z();
}

export function foilArchFrame(o: { w: number; h: number; lobes?: number; stroke: string; sw?: number; fill?: Paint | null; lines?: number; gap?: number }): OrnamentData {
  const specs: PartSpec[] = [];
  const lines = o.lines ?? 2;
  const gap = o.gap ?? 14;
  const sw = o.sw ?? 3;
  for (let i = 0; i < lines; i++) {
    const p = new Path();
    const ins = i * gap + sw / 2;
    foilArch(p, ins, ins, o.w - ins * 2, o.h - ins * 2, o.lobes ?? 9);
    specs.push({ path: p, fill: i === 0 ? o.fill ?? null : null, stroke: o.stroke, strokeWidth: i === 0 ? sw : sw * 0.5, lineJoin: "round" });
  }
  return assemble(specs, 0, { w: o.w, h: o.h });
}

function rosettePath(p: Path, cx: number, cy: number, r: number, n = 8) {
  for (let i = 0; i < n; i++) petal(p, cx, cy, rad(-90 + (360 / n) * i), r * 0.16, r, r * 0.17, false);
}

/** Embossed terracotta tile field. Alternates rosette tiles and lozenge-vine tiles. */
export function tileField(o: { w: number; h: number; cell: number; color: string }): OrnamentData {
  const c = o.cell;
  const lines = new Path();
  const fine = new Path();
  const dots = new Path();
  const cols = Math.ceil(o.w / c);
  const rows = Math.ceil(o.h / c);
  for (let r = 0; r < rows; r++) {
    for (let k = 0; k < cols; k++) {
      const x = k * c;
      const y = r * c;
      const cx = x + c / 2;
      const cy = y + c / 2;
      lines.M(x + 6, y + 6).L(x + c - 6, y + 6).L(x + c - 6, y + c - 6).L(x + 6, y + c - 6).Z();
      // corner quarter circles
      const q = c * 0.2;
      lines.M(x + 6, y + 6 + q).A(q, q, 0, 0, 0, x + 6 + q, y + 6);
      lines.M(x + c - 6 - q, y + 6).A(q, q, 0, 0, 0, x + c - 6, y + 6 + q);
      lines.M(x + c - 6, y + c - 6 - q).A(q, q, 0, 0, 0, x + c - 6 - q, y + c - 6);
      lines.M(x + 6 + q, y + c - 6).A(q, q, 0, 0, 0, x + 6, y + c - 6 - q);
      if ((r + k) % 2 === 0) {
        rosettePath(fine, cx, cy, c * 0.3, 8);
        dots.circle(cx, cy, c * 0.04);
      } else {
        const d = c * 0.27;
        fine.poly([[cx, cy - d], [cx + d, cy], [cx, cy + d], [cx - d, cy]], true);
        const d2 = d * 0.55;
        fine.poly([[cx, cy - d2], [cx + d2, cy], [cx, cy + d2], [cx - d2, cy]], true);
        dots.circle(cx, cy, c * 0.035);
      }
    }
  }
  return assemble(
    [
      { path: lines, stroke: o.color, strokeWidth: 1.6 },
      { path: fine, stroke: o.color, strokeWidth: 1.4 },
      { path: dots, fill: o.color },
    ],
    0,
    { w: o.w, h: o.h },
  );
}

/** Row of mosque domes (Sixty-Dome style) with finials and an arcade. */
export function domeRow(o: { w: number; fill: Paint; stroke: string; accent: Paint }): OrnamentData {
  const specs: PartSpec[] = [];
  const h = 250;
  const base = h - 60;
  const doms: { x: number; r: number }[] = [
    { x: 0.1, r: 52 },
    { x: 0.25, r: 64 },
    { x: 0.5, r: 96 },
    { x: 0.75, r: 64 },
    { x: 0.9, r: 52 },
  ];
  const arcade = new Path().M(0, base).L(o.w, base).L(o.w, h).L(0, h).Z();
  specs.push({ path: arcade, fill: o.fill, stroke: o.stroke, strokeWidth: 2 });
  doms.forEach(({ x, r }) => {
    const cx = o.w * x;
    const p = new Path();
    // drum
    p.M(cx - r * 0.78, base).L(cx - r * 0.78, base - r * 0.3).L(cx + r * 0.78, base - r * 0.3).L(cx + r * 0.78, base).Z();
    specs.push({ path: p, fill: o.fill, stroke: o.stroke, strokeWidth: 2 });
    const d = new Path();
    d.M(cx - r * 0.82, base - r * 0.3).C(cx - r * 0.9, base - r * 1.3, cx - r * 0.3, base - r * 1.35, cx, base - r * 1.5).C(cx + r * 0.3, base - r * 1.35, cx + r * 0.9, base - r * 1.3, cx + r * 0.82, base - r * 0.3).Z();
    specs.push({ path: d, fill: o.fill, stroke: o.stroke, strokeWidth: 2 });
    const rib = new Path();
    [-0.45, 0, 0.45].forEach((k) => rib.M(cx + r * k * 0.9, base - r * 0.32).Q(cx + r * k * 0.7, base - r * 1.0, cx, base - r * 1.45));
    specs.push({ path: rib, stroke: o.stroke, strokeWidth: 1.2, opacity: 0.6 });
    const fin = new Path().M(cx, base - r * 1.5).L(cx, base - r * 1.78);
    specs.push({ path: fin, stroke: o.stroke, strokeWidth: 2.4 });
    const knob = new Path().circle(cx, base - r * 1.84, 4.5).circle(cx, base - r * 1.62, 3.2);
    specs.push({ path: knob, fill: o.accent, stroke: o.stroke, strokeWidth: 1 });
    // arch niche
    const niche = new Path();
    foilArch(niche, cx - r * 0.3, base - r * 0.3 + 6, r * 0.6, r * 0.3 + 54, 5);
    specs.push({ path: niche, fill: o.stroke, opacity: 0.35 });
  });
  return assemble(specs, 0, { w: o.w, h });
}

/** Horizontal terracotta vine band: scrolling stem, leaves and rosette bosses. */
export function vineBand(o: { len: number; thick?: number; color: string; accent: Paint; sw?: number }): OrnamentData {
  const h = o.thick ?? 78;
  const cy = h / 2;
  const n = Math.max(2, Math.round(o.len / 110));
  const st = o.len / n;
  const stem = new Path();
  const leaves = new Path();
  const bosses = new Path();
  const dots = new Path();
  stem.M(0, cy);
  for (let i = 0; i < n; i++) {
    const x0 = i * st;
    stem.C(x0 + st * 0.25, cy - 32, x0 + st * 0.25, cy - 32, x0 + st * 0.5, cy).C(x0 + st * 0.75, cy + 32, x0 + st * 0.75, cy + 32, x0 + st, cy);
    // leaves on both bulges
    petal(leaves, x0 + st * 0.25, cy - 22, rad(-90 - 30), 0, 28, 8);
    petal(leaves, x0 + st * 0.25, cy - 22, rad(-90 + 30), 0, 24, 7);
    petal(leaves, x0 + st * 0.75, cy + 22, rad(90 - 30), 0, 28, 8);
    petal(leaves, x0 + st * 0.75, cy + 22, rad(90 + 30), 0, 24, 7);
    rosettePath(bosses, x0 + st * 0.5, cy, 15, 8);
    dots.circle(x0 + st * 0.5, cy, 3);
    dots.circle(x0 + st * 0.25, cy - 40, 2);
    dots.circle(x0 + st * 0.75, cy + 40, 2);
  }
  const rail = new Path().M(0, 4).L(o.len, 4).M(0, h - 4).L(o.len, h - 4);
  const bead = new Path();
  for (let x = 6; x < o.len; x += 12) bead.circle(x, 11, 1.6).circle(x, h - 11, 1.6);
  const sw = o.sw ?? 2;
  return assemble(
    [
      { path: rail, stroke: o.color, strokeWidth: sw },
      { path: bead, fill: o.accent },
      { path: stem, stroke: o.color, strokeWidth: sw },
      { path: leaves, fill: o.accent, stroke: o.color, strokeWidth: 1.2 },
      { path: bosses, fill: o.accent, stroke: o.color, strokeWidth: 1.2 },
      { path: dots, fill: o.color },
    ],
    0,
    { w: o.len, h },
  );
}

/** Round relief medallion: concentric rings, layered rosette petals. */
export function medallion(o: { size: number; stroke: string; fill: Paint; accent: Paint; n?: number }): OrnamentData {
  const R = o.size / 2;
  const n = o.n ?? 12;
  const specs: PartSpec[] = [];
  const ring = new Path().circle(R, R, R - 2);
  specs.push({ path: ring, fill: o.fill, stroke: o.stroke, strokeWidth: 2.4 });
  const ring2 = new Path().circle(R, R, R * 0.86);
  specs.push({ path: ring2, stroke: o.stroke, strokeWidth: 1 });
  const dots = new Path();
  for (let i = 0; i < n * 2; i++) dots.circle(R + Math.cos(rad((360 / (n * 2)) * i)) * R * 0.93, R + Math.sin(rad((360 / (n * 2)) * i)) * R * 0.93, 1.8);
  specs.push({ path: dots, fill: o.stroke });
  const outer = new Path();
  for (let i = 0; i < n; i++) petal(outer, R, R, rad(-90 + (360 / n) * i), R * 0.15, R * 0.8, R * 0.15, true);
  specs.push({ path: outer, fill: o.accent, stroke: o.stroke, strokeWidth: 1.6 });
  const inner = new Path();
  for (let i = 0; i < n; i++) petal(inner, R, R, rad(-90 + (360 / n) * (i + 0.5)), R * 0.12, R * 0.5, R * 0.1, true);
  specs.push({ path: inner, fill: o.fill, stroke: o.stroke, strokeWidth: 1.4 });
  const core = new Path().circle(R, R, R * 0.12);
  specs.push({ path: core, fill: o.accent, stroke: o.stroke, strokeWidth: 1.4 });
  return assemble(specs, 0, { w: o.size, h: o.size });
}

/** Tile-style corner square with rosette, for event cards. */
export function tileIcon(o: { size: number; stroke: string; fill: Paint; accent: Paint }): OrnamentData {
  const s = o.size;
  const specs: PartSpec[] = [];
  const sq = new Path().M(2, 2).L(s - 2, 2).L(s - 2, s - 2).L(2, s - 2).Z();
  specs.push({ path: sq, fill: o.fill, stroke: o.stroke, strokeWidth: 2.4 });
  const sq2 = new Path().M(12, 12).L(s - 12, 12).L(s - 12, s - 12).L(12, s - 12).Z();
  specs.push({ path: sq2, stroke: o.stroke, strokeWidth: 1, opacity: 0.8 });
  const r = new Path();
  for (let i = 0; i < 8; i++) petal(r, s / 2, s / 2, rad(-90 + 45 * i), s * 0.05, s * 0.34, s * 0.07, false);
  specs.push({ path: r, fill: o.accent, stroke: o.stroke, strokeWidth: 1.2 });
  const c = new Path().circle(s / 2, s / 2, s * 0.06);
  specs.push({ path: c, fill: o.fill, stroke: o.stroke, strokeWidth: 1.2 });
  return assemble(specs, 0, { w: s, h: s });
}
