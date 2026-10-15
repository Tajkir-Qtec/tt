import { assemble, Path, rad, type OrnamentData, type PartSpec, type Pt } from "../design/path";
import type { Paint } from "../design/types";

function pointedArch(p: Path, x: number, y: number, w: number, h: number, bottomOpen = true) {
  const sy = Math.min(h, w * 0.62);
  const cx = x + w / 2;
  p.M(x, y + h).L(x, y + sy);
  p.C(x, y + sy * 0.45, x + w * 0.3, y + sy * 0.2, cx, y);
  p.C(x + w * 0.7, y + sy * 0.2, x + w, y + sy * 0.45, x + w, y + sy);
  p.L(x + w, y + h);
  if (!bottomOpen) p.Z();
}

/**
 * Mihrab panel: gold foil rim, deep inner fill, fine inner lines and a
 * lattice of small stars in the spandrel. All in one ornament.
 */
export function mihrabPanel(o: { w: number; h: number; rim: Paint; inner: Paint; line: string; rimW?: number }): OrnamentData {
  const rw = o.rimW ?? 9;
  const specs: PartSpec[] = [];
  const outer = new Path();
  pointedArch(outer, 0, 0, o.w, o.h, false);
  specs.push({ path: outer, fill: o.rim });
  const inner = new Path();
  pointedArch(inner, rw, rw, o.w - rw * 2, o.h - rw, false);
  specs.push({ path: inner, fill: o.inner });
  for (let i = 0; i < 3; i++) {
    const g = rw + 14 + i * 12;
    const l = new Path();
    pointedArch(l, g, g, o.w - g * 2, o.h - g, true);
    specs.push({ path: l, stroke: o.line, strokeWidth: i === 0 ? 2 : 1.1, opacity: i === 0 ? 0.95 : 0.6 });
  }
  return assemble(specs, 0, { w: o.w, h: o.h });
}

function star8(p: Path, cx: number, cy: number, R: number) {
  const pts: Pt[] = [];
  for (let i = 0; i < 16; i++) {
    const a = rad(-90 + i * 22.5);
    const r = i % 2 === 0 ? R : R * 0.7654;
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  p.poly(pts, true);
}

/** Horizontal strip of eight-pointed stars joined by fine rules and diamonds. */
export function starBand(o: { w: number; color: string; accent: string; cell?: number }): OrnamentData {
  const cell = o.cell ?? 64;
  const n = Math.max(3, Math.round(o.w / cell));
  const step = o.w / n;
  const h = 52;
  const cy = h / 2;
  const stars = new Path();
  const inner = new Path();
  const diamonds = new Path();
  const rules = new Path().M(0, cy - 17).L(o.w, cy - 17).M(0, cy + 17).L(o.w, cy + 17);
  for (let i = 0; i < n; i++) {
    const cx = step * (i + 0.5);
    star8(stars, cx, cy, 22);
    star8(inner, cx, cy, 10);
    const dx = step * (i + 1);
    if (i < n - 1) diamonds.poly([[dx, cy - 7], [dx + 5, cy], [dx, cy + 7], [dx - 5, cy]], true);
  }
  return assemble(
    [
      { path: rules, stroke: o.color, strokeWidth: 1.1, opacity: 0.8 },
      { path: stars, stroke: o.color, strokeWidth: 1.6, lineJoin: "miter" },
      { path: inner, fill: o.accent, lineJoin: "miter" },
      { path: diamonds, fill: o.color },
    ],
    0,
    { w: o.w, h },
  );
}

function dome(p: Path, cx: number, base: number, s: number) {
  p.M(cx - 78 * s, base)
    .C(cx - 96 * s, base - 62 * s, cx - 40 * s, base - 112 * s, cx, base - 150 * s)
    .C(cx + 40 * s, base - 112 * s, cx + 96 * s, base - 62 * s, cx + 78 * s, base)
    .Z();
}

/** Layered mosque skyline: central dome, side domes, two minarets and arched windows. */
export function mosque(o: { w: number; color: string; window: string }): OrnamentData {
  const w = o.w;
  const h = 250;
  const cx = w / 2;
  const body = new Path();
  const fin = new Path();
  const win = new Path();
  const base = h - 70;
  body.M(cx - 230, h).L(cx - 230, base + 30).L(cx + 230, base + 30).L(cx + 230, h).Z();
  body.M(cx - 120, base + 30).L(cx - 120, base).L(cx + 120, base).L(cx + 120, base + 30).Z();
  dome(body, cx, base, 1);
  dome(body, cx - 170, base + 30, 0.55);
  dome(body, cx + 170, base + 30, 0.55);
  [-1, 1].forEach((s) => {
    const mx = cx + s * 290;
    body.M(mx - 14, h).L(mx - 11, 60).L(mx + 11, 60).L(mx + 14, h).Z();
    body.M(mx - 21, 66).L(mx + 21, 66).L(mx + 21, 76).L(mx - 21, 76).Z();
    body.M(mx - 21, 112).L(mx + 21, 112).L(mx + 21, 120).L(mx - 21, 120).Z();
    body.M(mx - 13, 60).C(mx - 13, 36, mx - 4, 20, mx, 4).C(mx + 4, 20, mx + 13, 36, mx + 13, 60).Z();
    fin.M(mx, 4).L(mx, -8);
  });
  fin.M(cx, base - 150).L(cx, base - 188);
  fin.M(cx - 170, base + 30 - 82).L(cx - 170, base + 30 - 104);
  fin.M(cx + 170, base + 30 - 82).L(cx + 170, base + 30 - 104);
  const arch = (x: number, y: number, ww: number, hh: number) => {
    win.M(x, y + hh).L(x, y + ww * 0.8).C(x, y + ww * 0.3, x + ww / 2, y + 2, x + ww / 2, y).C(x + ww / 2, y + 2, x + ww, y + ww * 0.3, x + ww, y + ww * 0.8).L(x + ww, y + hh).Z();
  };
  for (let i = -3; i <= 3; i++) arch(cx + i * 52 - 12, base + 46, 24, 70);
  arch(cx - 15, base - 56, 30, 56);
  body.include([0, 0], [w, h], [cx, base - 192]);
  fin.include([cx, base - 192]);
  return assemble(
    [
      { path: body, fill: o.color },
      { path: fin, stroke: o.color, strokeWidth: 3 },
      { path: win, fill: o.window },
    ],
    0,
    { w, h: h + 40, dy: 40 },
  );
}

/** Quiet geometric corner flourish for frames (drawn for the top-left). */
export function cornerStar(o: { color: string; size: number }): OrnamentData {
  const S = o.size;
  const p = new Path();
  const q = new Path();
  star8(p, S / 2, S / 2, S / 2 - 2);
  star8(q, S / 2, S / 2, S * 0.22);
  const c = new Path().circle(S / 2, S / 2, S * 0.07);
  return assemble([{ path: p, stroke: o.color, strokeWidth: 1.8, lineJoin: "miter" }, { path: q, stroke: o.color, strokeWidth: 1.2, lineJoin: "miter" }, { path: c, fill: o.color }], 0, { w: S, h: S });
}
