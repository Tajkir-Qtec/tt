import { centerRotate, makeOrnament } from "../design/layers";
import { assemble, Path, type OrnamentData, type PartSpec, type Pt } from "../design/path";
import type { Layer, Paint } from "../design/types";
import { lock } from "./kit";

export function put(data: OrnamentData, cx: number, cy: number, w: number, rot = 0, opacity = 1): Layer {
  const h = (w * data.vbH) / data.vbW;
  const l = makeOrnament(data, { x: cx - w / 2, y: cy - h / 2, width: w, height: h, opacity });
  return lock(rot ? centerRotate(l, cx, cy, rot) : l);
}

const lin = (angle: number, ...stops: [number, string][]): Paint => ({ kind: "linear", angle, stops });

export const CHAMPAGNE_GOLD: Paint = lin(100, [0, "#b98a45"], [0.25, "#f4e1b0"], [0.5, "#c99c55"], [0.75, "#f6e7c0"], [1, "#b68443"]);

/** Reverse-wound circle (a hole when combined with `circle`). */
function hole(p: Path, cx: number, cy: number, r: number) {
  p.M(cx - r, cy).A(r, r, 0, 1, 1, cx + r, cy).A(r, r, 0, 1, 1, cx - r, cy).Z();
  p.include([cx, cy - r], [cx, cy + r]);
}

/** A solitaire engagement ring (face-on band, faceted diamond, gold prongs). */
export function solitaire(): OrnamentData {
  const cx = 200;
  const cy = 330;
  const R = 130;
  const r = 104;
  const specs: PartSpec[] = [];

  // soft ground shadow
  const sh = new Path().circle(cx + 6, cy + 14, R + 2);
  hole(sh, cx + 6, cy + 14, r - 2);
  specs.push({ path: sh, fill: "#b07a5a", opacity: 0.16 });

  // band
  const band = new Path().circle(cx, cy, R);
  hole(band, cx, cy, r);
  specs.push({ path: band, fill: CHAMPAGNE_GOLD });
  // inner edge + outer rim lines, highlight arcs
  specs.push({ path: new Path().circle(cx, cy, r + 1), stroke: "#9a6d31", strokeWidth: 2.2, opacity: 0.55 });
  specs.push({ path: new Path().circle(cx, cy, R - 1), stroke: "#fff6dc", strokeWidth: 2, opacity: 0.7 });
  const arc = (rr: number, a0: number, a1: number): Path => {
    const p = new Path();
    p.M(cx + Math.cos(a0) * rr, cy + Math.sin(a0) * rr).A(rr, rr, 0, 0, 1, cx + Math.cos(a1) * rr, cy + Math.sin(a1) * rr);
    p.include([cx - rr, cy - rr], [cx + rr, cy + rr]);
    return p;
  };
  specs.push({ path: arc((R + r) / 2, Math.PI * 0.62, Math.PI * 0.92), stroke: "#ffffff", strokeWidth: 5, opacity: 0.8 });
  specs.push({ path: arc((R + r) / 2, Math.PI * 0.05, Math.PI * 0.3), stroke: "#8a5f2a", strokeWidth: 5, opacity: 0.3 });

  // basket (setting) and prongs
  const top = cy - R; // 200
  const basket = new Path().poly(
    [
      [cx - 54, top - 38],
      [cx + 54, top - 38],
      [cx + 30, top + 6],
      [cx - 30, top + 6],
    ],
    true,
  );
  specs.push({ path: basket, fill: CHAMPAGNE_GOLD, stroke: "#9a6d31", strokeWidth: 1.4 });
  specs.push({ path: new Path().M(cx - 30, top - 20).L(cx + 30, top - 20), stroke: "#fff6dc", strokeWidth: 2, opacity: 0.7 });

  // diamond
  const gy = top - 44; // girdle y
  const ty = gy - 50; // table y
  const cu: Pt = [cx, gy + 76];
  const A: Pt = [cx - 78, gy];
  const B: Pt = [cx - 39, gy];
  const C: Pt = [cx, gy];
  const D: Pt = [cx + 39, gy];
  const E: Pt = [cx + 78, gy];
  const T0: Pt = [cx - 46, ty];
  const T1: Pt = [cx + 46, ty];
  const facets: [Pt[], string][] = [
    [[A, T0, B], "#cfdcf5"],
    [[T0, B, C], "#f6f9ff"],
    [[T0, T1, C], "#e4ecfb"],
    [[T1, C, D], "#ffffff"],
    [[T1, D, E], "#bfd0ee"],
    [[A, B, cu], "#a9bfe6"],
    [[B, C, cu], "#e9f0ff"],
    [[C, D, cu], "#c4d4f1"],
    [[D, E, cu], "#92abd9"],
  ];
  for (const [pts, fill] of facets) specs.push({ path: new Path().poly(pts, true), fill, stroke: "#ffffff", strokeWidth: 1.4, lineJoin: "miter" });
  specs.push({ path: new Path().poly([A, T0, T1, E, cu], true), stroke: "#8ea7d4", strokeWidth: 1.6, lineJoin: "miter" });
  // prong claws over the girdle
  for (const [x, flip] of [[A[0] - 2, -1], [E[0] + 2, 1]] as [number, number][]) {
    specs.push({
      path: new Path().poly(
        [
          [x, gy - 12],
          [x + flip * 8, gy + 2],
          [x + flip * 6, top - 30],
          [x - flip * 2, top - 30],
        ],
        true,
      ),
      fill: CHAMPAGNE_GOLD,
      stroke: "#9a6d31",
      strokeWidth: 1,
    });
  }
  // light rays from the stone
  const rays = new Path();
  for (const [dx, dy, l] of [[-1, -0.2, 22], [1, -0.2, 22]] as [number, number, number][]) {
    const sx = cx + dx * 100;
    const sy = ty + 30 + dy * 74;
    rays.M(sx, sy).L(sx + dx * l, sy + dy * l);
  }
  specs.push({ path: rays, stroke: "#e2b866", strokeWidth: 3, opacity: 0.9 });
  return assemble(specs, 4);
}

/** Four-point shine, optionally with a small cross glint. */
export function shine(color: string, size = 60): OrnamentData {
  const c = size / 2;
  const p = new Path();
  p.M(c, 0).Q(c, c, size, c).Q(c, c, c, size).Q(c, c, 0, c).Q(c, c, c, 0).Z();
  return assemble([{ path: p, fill: color }], 0, { w: size, h: size });
}

export function heartShape(fill: Paint, size = 60, stroke?: string): OrnamentData {
  const S = size;
  const p = new Path();
  p.M(S / 2, S * 0.92)
    .C(S * 0.05, S * 0.58, -S * 0.05, S * 0.18, S * 0.25, S * 0.08)
    .C(S * 0.4, S * 0.03, S * 0.5, S * 0.14, S / 2, S * 0.24)
    .C(S * 0.5, S * 0.14, S * 0.6, S * 0.03, S * 0.75, S * 0.08)
    .C(S * 1.05, S * 0.18, S * 0.95, S * 0.58, S / 2, S * 0.92)
    .Z();
  return assemble([{ path: p, fill, stroke: stroke ?? null, strokeWidth: stroke ? 2 : 0 }], 3);
}

/** A thin hand-drawn ribbon-like flourish used as a dividing line (a swash with a heart at the centre). */
export function swash(color: string, w = 360): OrnamentData {
  const h = 40;
  const c = w / 2;
  const p = new Path();
  p.M(0, h / 2).C(w * 0.1, h * 0.1, w * 0.2, h * 0.9, w * 0.3, h / 2).C(w * 0.36, h * 0.28, w * 0.42, h * 0.4, c - 18, h / 2);
  p.M(w, h / 2).C(w * 0.9, h * 0.1, w * 0.8, h * 0.9, w * 0.7, h / 2).C(w * 0.64, h * 0.28, w * 0.58, h * 0.4, c + 18, h / 2);
  p.include([0, 0], [w, h]);
  const S = 22;
  const hp = new Path();
  const ox = c - S / 2;
  const oy = h / 2 - S / 2 - 2;
  hp.M(ox + S / 2, oy + S * 0.92)
    .C(ox + S * 0.05, oy + S * 0.58, ox - S * 0.05, oy + S * 0.18, ox + S * 0.25, oy + S * 0.08)
    .C(ox + S * 0.4, oy + S * 0.03, ox + S * 0.5, oy + S * 0.14, ox + S / 2, oy + S * 0.24)
    .C(ox + S * 0.5, oy + S * 0.14, ox + S * 0.6, oy + S * 0.03, ox + S * 0.75, oy + S * 0.08)
    .C(ox + S * 1.05, oy + S * 0.18, ox + S * 0.95, oy + S * 0.58, ox + S / 2, oy + S * 0.92)
    .Z();
  return assemble([{ path: p, stroke: color, strokeWidth: 2 }, { path: hp, fill: color }], 0, { w, h });
}
