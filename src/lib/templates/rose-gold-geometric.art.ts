import { assemble, Path, type OrnamentData, type PartSpec, type Pt } from "../design/path";
import type { Paint } from "../design/types";

/** Pointy-top hexagon points inside a w x h box, optionally inset by d. */
export function hexPoints(w: number, h: number, d = 0, k = 0.24): Pt[] {
  const fx = (w - 2 * d) / w;
  const fy = (h - 2 * d) / h;
  const base: Pt[] = [
    [w / 2, 0],
    [w, h * k],
    [w, h * (1 - k)],
    [w / 2, h],
    [0, h * (1 - k)],
    [0, h * k],
  ];
  return base.map(([x, y]) => [w / 2 + (x - w / 2) * fx, h / 2 + (y - h / 2) * fy] as Pt);
}

/** Nested hexagon outlines with small diamonds at the six vertices. */
export function hexFrame(o: { w: number; h: number; color: string; fill?: Paint | null; lines?: number; gap?: number; strokeWidth?: number }): OrnamentData {
  const specs: PartSpec[] = [];
  const lines = o.lines ?? 3;
  const gap = o.gap ?? 14;
  const sw = o.strokeWidth ?? 2;
  for (let i = 0; i < lines; i++) {
    const d = sw + i * gap;
    specs.push({
      path: new Path().poly(hexPoints(o.w, o.h, d), true),
      stroke: o.color,
      strokeWidth: i === 0 ? sw : i === 1 ? sw * 0.5 : sw * 0.35,
      fill: i === 0 ? o.fill ?? null : null,
      lineJoin: "miter",
    });
  }
  const dia = new Path();
  for (const [x, y] of hexPoints(o.w, o.h, sw)) {
    const r = 7;
    dia.poly(
      [
        [x, y - r],
        [x + r, y],
        [x, y + r],
        [x - r, y],
      ],
      true,
    );
  }
  specs.push({ path: dia, fill: o.color });
  return assemble(specs, 0, { w: o.w, h: o.h });
}

/** Page-sized network of thin intersecting lines and nested rhombi centred on (cx, cy). */
export function geoBackdrop(o: { w: number; h: number; cx: number; cy: number; color: string; strokeWidth?: number }): OrnamentData {
  const { w, h, cx, cy } = o;
  const sw = o.strokeWidth ?? 1.2;
  const rhombus = (a: number, b: number) =>
    new Path().poly(
      [
        [cx, cy - b],
        [cx + a, cy],
        [cx, cy + b],
        [cx - a, cy],
      ],
      true,
    );
  const big = rhombus(w * 0.5 - 40, h * 0.5 - 40);
  const mid = rhombus(w * 0.5 - 150, h * 0.5 - 200);
  const cross = new Path();
  // diagonals from each page corner toward the centre
  cross.M(0, 0).L(cx, cy).M(w, 0).L(cx, cy).M(0, h).L(cx, cy).M(w, h).L(cx, cy);
  // vertical spine and horizontal axis
  cross.M(cx, 0).L(cx, h).M(0, cy).L(w, cy);
  // parallel diagonals offset from the main ones for a woven look
  for (const off of [-110, 110]) {
    cross.M(0, off).L(cx - Math.abs(off) * 0.5, cy).M(w, off).L(cx + Math.abs(off) * 0.5, cy);
  }
  return assemble(
    [
      { path: cross, stroke: o.color, strokeWidth: sw * 0.55, lineCap: "butt", opacity: 0.55 },
      { path: big, stroke: o.color, strokeWidth: sw, lineJoin: "miter" },
      { path: mid, stroke: o.color, strokeWidth: sw * 0.7, lineJoin: "miter", opacity: 0.8 },
    ],
    0,
    { w, h },
  );
}

/** A row of small linked diamonds (a fine geometric rule). */
export function diamondRule(o: { w: number; color: string; n?: number }): OrnamentData {
  const n = o.n ?? 5;
  const H = 30;
  const cy = H / 2;
  const p = new Path();
  const f = new Path();
  const step = 26;
  const total = (n - 1) * step;
  for (let i = 0; i < n; i++) {
    const x = o.w / 2 - total / 2 + i * step;
    const r = i === (n - 1) / 2 ? 9 : 5.5;
    const pts: Pt[] = [
      [x, cy - r],
      [x + r, cy],
      [x, cy + r],
      [x - r, cy],
    ];
    if (i === (n - 1) / 2) f.poly(pts, true);
    else p.poly(pts, true);
  }
  const l = new Path();
  l.M(0, cy).L(o.w / 2 - total / 2 - 22, cy).M(o.w / 2 + total / 2 + 22, cy).L(o.w, cy);
  return assemble(
    [
      { path: l, stroke: o.color, strokeWidth: 1.2, lineCap: "butt" },
      { path: p, stroke: o.color, strokeWidth: 1.4, lineJoin: "miter" },
      { path: f, fill: o.color },
    ],
    0,
    { w: o.w, h: H },
  );
}
