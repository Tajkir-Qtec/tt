import { crescent, islamicPattern, islamicStar, sparkle, sprig, star } from "../design/ornaments";
import { centerRotate } from "../design/layers";
import { assemble, Path, type OrnamentData, type PartSpec } from "../design/path";
import type { Layer } from "../design/types";
import { lock, O, radial, S } from "./kit";

export const CX = 500;
export const APEX = 150;
export const SPRING = 520;
export const BASE = 1300;
export const HW = 370;

export const CHAMP = "#c2a468";
export const CHAMP_D = "#a98543";
export const SAGE_BAND = "#e5ead6";
export const IVORY_IN = "#fbf8ef";

/** Pointed mihrab arch (page coordinates), open at the bottom unless closed. */
function archAt(inset: number, closed = false, yShift = 0): Path {
  const hw = HW - inset;
  const top = APEX + inset * 1.35 + yShift;
  const spring = SPRING + yShift;
  const rise = spring - top;
  const p = new Path();
  p.M(CX - hw, BASE)
    .L(CX - hw, spring)
    .C(CX - hw, spring - rise * 0.55, CX - hw * 0.3, top + rise * 0.3, CX, top)
    .C(CX + hw * 0.3, top + rise * 0.3, CX + hw, spring - rise * 0.55, CX + hw, spring)
    .L(CX + hw, BASE);
  if (closed) p.Z();
  return p;
}

const PAGE = { w: 1000, h: 1400 };

/** Slim fluted column in page coordinates. */
function column(x: number, top: number, bottom: number): PartSpec[] {
  const w = 44;
  const h = bottom - top;
  const ox = x - w / 2;
  const sx = (v: number) => ox + v;
  const sy = (v: number) => top + v;
  const shaft = new Path().poly(
    [
      [sx(9), sy(26)],
      [sx(35), sy(26)],
      [sx(35), sy(h - 22)],
      [sx(9), sy(h - 22)],
    ],
    true,
  );
  const flutes = new Path();
  [16, 22, 28].forEach((v) => flutes.M(sx(v), sy(32)).L(sx(v), sy(h - 28)));
  const cap = new Path()
    .M(sx(2), sy(0))
    .L(sx(42), sy(0))
    .L(sx(42), sy(8))
    .C(sx(40), sy(18), sx(36), sy(18), sx(35), sy(26))
    .L(sx(9), sy(26))
    .C(sx(8), sy(18), sx(4), sy(18), sx(2), sy(8))
    .Z();
  const capLine = new Path().M(sx(5), sy(12)).L(sx(39), sy(12));
  const base = new Path()
    .M(sx(9), sy(h - 22))
    .C(sx(8), sy(h - 14), sx(2), sy(h - 14), sx(2), sy(h - 8))
    .L(sx(2), sy(h))
    .L(sx(42), sy(h))
    .L(sx(42), sy(h - 8))
    .C(sx(42), sy(h - 14), sx(36), sy(h - 14), sx(35), sy(h - 22))
    .Z();
  return [
    { path: shaft, fill: "#f6f0df", stroke: CHAMP, strokeWidth: 1.4, lineJoin: "miter" },
    { path: flutes, stroke: CHAMP, strokeWidth: 0.9, opacity: 0.7, lineCap: "butt" },
    { path: cap, fill: "#efe5c8", stroke: CHAMP_D, strokeWidth: 1.4 },
    { path: capLine, stroke: CHAMP_D, strokeWidth: 0.9, lineCap: "butt" },
    { path: base, fill: "#efe5c8", stroke: CHAMP_D, strokeWidth: 1.4 },
  ];
}

/** Layered mihrab: arch bands, columns, base and fine outer border (all page coordinates). */
export function mihrabFrame(): Layer[] {
  const outer = archAt(0, true);
  const band = archAt(16, true);
  const inner = archAt(36, true);
  const specs: PartSpec[] = [
    // soft ground shadow
    { path: archAt(-4, true, 7), fill: "#6f7d5b", opacity: 0.1 },
    { path: outer, fill: "#f2ecd9", stroke: CHAMP_D, strokeWidth: 2.6, lineJoin: "miter" },
    { path: band, fill: SAGE_BAND, stroke: CHAMP, strokeWidth: 1.3, lineJoin: "miter" },
    { path: archAt(26, true), stroke: CHAMP, strokeWidth: 0.8, opacity: 0.8, lineJoin: "miter" },
    { path: inner, fill: IVORY_IN, stroke: CHAMP_D, strokeWidth: 1.8, lineJoin: "miter" },
    { path: archAt(46), stroke: CHAMP, strokeWidth: 0.8, opacity: 0.7, lineJoin: "miter" },
  ];
  // base plinth
  const plinth = new Path().M(86, BASE + 2).L(914, BASE + 2).M(96, BASE + 11).L(904, BASE + 11);
  specs.push({ path: plinth, stroke: CHAMP_D, strokeWidth: 1.6, lineCap: "butt" });
  const cols = new Path();
  cols.include([0, 0], [PAGE.w, PAGE.h]);
  const colSpecs = [...column(CX - HW - 16, SPRING - 6, BASE), ...column(CX + HW + 16, SPRING - 6, BASE)];
  return [lock(O(assemble([...specs, ...colSpecs], 0, PAGE), { x: 0, y: 0, width: PAGE.w }))];
}

/** Fine card border + faint lattice that shows only in the arch spandrels. */
export function mihrabGround(): Layer[] {
  const border = new Path();
  const r = 26;
  const x0 = 48,
    y0 = 48,
    x1 = 952,
    y1 = 1352;
  border
    .M(x0 + r, y0)
    .L(x1 - r, y0)
    .A(r, r, 0, 0, 0, x1, y0 + r)
    .L(x1, y1 - r)
    .A(r, r, 0, 0, 0, x1 - r, y1)
    .L(x0 + r, y1)
    .A(r, r, 0, 0, 0, x0, y1 - r)
    .L(x0, y0 + r)
    .A(r, r, 0, 0, 0, x0 + r, y0)
    .Z();
  const inner = new Path();
  const q = 58;
  inner.poly(
    [
      [q + 20, q],
      [1000 - q - 20, q],
      [1000 - q, q + 20],
      [1000 - q, 1400 - q - 20],
      [1000 - q - 20, 1400 - q],
      [q + 20, 1400 - q],
      [q, 1400 - q - 20],
      [q, q + 20],
    ],
    true,
  );
  const lines = assemble(
    [
      { path: border, stroke: CHAMP, strokeWidth: 1.6 },
      { path: inner, stroke: CHAMP, strokeWidth: 0.7, opacity: 0.6, lineJoin: "miter" },
    ],
    0,
    PAGE,
  );
  const stars: Layer[] = [
    [196, 372],
    [804, 372],
  ].map(([x, y]) => lock(O(islamicStar({ color: CHAMP_D, size: 64, strokeWidth: 1.5 }), { cx: x, y: y - 32, width: 64, opacity: 0.55 })));
  return [
    lock(O(islamicPattern({ color: "#8a9a72", w: 1000, h: 1400, cell: 110, strokeWidth: 1.2 }), { x: 0, y: 0, width: 1000, opacity: 0.2 })),
    lock(O(lines, { x: 0, y: 0, width: 1000 })),
  ];
}

/** Soft light inside the arch. */
export function mihrabGlow(cy = 640): Layer {
  return lock(
    S({
      x: 190,
      y: cy - 480,
      width: 620,
      height: 960,
      shape: "ellipse",
      fill: radial([0, "rgba(255,253,244,0.95)"], [0.6, "rgba(255,252,240,0.45)"], [1, "rgba(255,252,240,0)"]),
    }),
  );
}

/** Hanging lantern; chain starts at the arch apex. Local box 78 x 196. */
export function lantern(): OrnamentData {
  const chain = new Path().M(39, 0).L(39, 62);
  const links = new Path();
  [10, 24, 38, 52].forEach((y) => links.circle(39, y, 2.4));
  const ring = new Path().circle(39, 68, 5);
  const cap = new Path().M(15, 106).C(19, 90, 33, 80, 39, 74).C(45, 80, 59, 90, 63, 106).Z();
  const body = new Path()
    .M(18, 106)
    .C(6, 134, 8, 164, 24, 184)
    .L(54, 184)
    .C(70, 164, 72, 134, 60, 106)
    .Z();
  const ribs = new Path()
    .M(39, 106)
    .L(39, 184)
    .M(30, 106)
    .C(22, 134, 24, 164, 31, 184)
    .M(48, 106)
    .C(56, 134, 54, 164, 47, 184);
  const flame = new Path().M(39, 128).C(31, 140, 32, 156, 39, 160).C(46, 156, 47, 140, 39, 128).Z();
  const foot = new Path().M(24, 184).L(54, 184).L(48, 194).L(30, 194).Z();
  const tassel = new Path().M(39, 194).L(39, 206).include([39, 214]);
  const bead = new Path().circle(39, 210, 3.4);
  return assemble(
    [
      { path: chain, stroke: CHAMP_D, strokeWidth: 1.4, lineCap: "butt" },
      { path: links, fill: CHAMP_D },
      { path: ring, stroke: CHAMP_D, strokeWidth: 1.6 },
      { path: body, fill: "#f6e7b8", stroke: CHAMP_D, strokeWidth: 1.6, opacity: 0.95 },
      { path: ribs, stroke: CHAMP_D, strokeWidth: 1, opacity: 0.8, lineCap: "butt" },
      { path: flame, fill: "#e8b94a" },
      { path: cap, fill: "#d2b06a", stroke: CHAMP_D, strokeWidth: 1.4 },
      { path: foot, fill: "#d2b06a", stroke: CHAMP_D, strokeWidth: 1.4 },
      { path: tassel, stroke: CHAMP_D, strokeWidth: 1.4 },
      { path: bead, fill: CHAMP_D },
    ],
    0,
    { w: 78, h: 216 },
  );
}

/** Lantern hanging in the arch (with warm glow). */
export function lanternLayers(): Layer[] {
  return [
    lock(
      S({
        x: 400,
        y: 195,
        width: 200,
        height: 200,
        shape: "ellipse",
        fill: radial([0, "rgba(243,208,120,0.55)"], [0.5, "rgba(243,208,120,0.18)"], [1, "rgba(243,208,120,0)"]),
      }),
    ),
    lock(O(lantern(), { cx: CX, y: APEX + 6, width: 78 })),
  ];
}

/** Star-and-crescent finial for the arch apex (details/photo pages). */
export function finialLayers(): Layer[] {
  return [
    lock(O(islamicStar({ color: CHAMP_D, size: 118, strokeWidth: 1.8 }), { cx: CX, y: 196, width: 118, opacity: 0.95 })),
    lock(O(crescent({ color: CHAMP_D, size: 52 }), { cx: CX - 3, y: 229, width: 52 })),
    lock(O(sparkle({ color: "#e0bb62", size: 18 }), { cx: CX + 22, y: 233, width: 18 })),
    lock(O(star({ color: CHAMP, size: 12, points: 5 }), { cx: CX, y: APEX + 6, width: 12 })),
  ];
}

/** Soft olive sprigs rising from the base of the arch. */
export function baseSprigs(): Layer[] {
  const data = sprig({ color: "#8a9d78", length: 190, leaves: 5, leafLen: 40, leafW: 11, curve: 20, berryColor: CHAMP, opacity: 0.85 });
  const l = centerRotate(O(data, { x: 0, y: 0, width: 190 }), 218, 1205, -62);
  const r = centerRotate(O(data, { x: 0, y: 0, width: 190, flipX: true }), 782, 1205, 62);
  return [lock(l), lock(r)];
}
