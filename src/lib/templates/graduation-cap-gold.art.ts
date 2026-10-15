import { centerRotate } from "../design/layers";
import { Path, type PartSpec } from "../design/path";
import type { Layer, OrnamentLayer, Paint } from "../design/types";
import { linear } from "./kit";
import { ellipsePath, place } from "./birthday-balloons-bold.art";

export const NAVY_D = "#0a1330";
export const NAVY = "#14224f";
export const GOLD_L = "#f2dc9b";
export const GOLD_M = "#d9b45f";
export const GOLD_D = "#9a7433";
export const FOIL: Paint = linear(100, [0, "#8a6a2f"], [0.25, "#f0d68f"], [0.5, "#b88a3e"], [0.75, "#f6e3a6"], [1, "#9a7433"]);

/** Mortarboard with tassel. (cx,cy) = centre of the board's top face; s = scale (1 = 460 wide). */
export function mortarboard(cx: number, cy: number, s = 1): OrnamentLayer {
  const u = (n: number) => n * s;
  const specs: PartSpec[] = [];
  // skull cap
  const base = new Path();
  base.M(cx - u(130), cy + u(20)).L(cx - u(130), cy + u(110)).C(cx - u(130), cy + u(185), cx + u(130), cy + u(185), cx + u(130), cy + u(110)).L(cx + u(130), cy + u(20)).Z();
  base.include([cx - u(130), cy + u(160)], [cx + u(130), cy + u(160)]);
  specs.push({ path: base, fill: linear(0, [0, "#1c2d6b"], [0.5, "#2a3f86"], [1, "#101b45"]) });
  // gold band on the cap
  const band = new Path();
  band.M(cx - u(130), cy + u(112)).C(cx - u(130), cy + u(185), cx + u(130), cy + u(185), cx + u(130), cy + u(112));
  specs.push({ path: band, stroke: GOLD_M, strokeWidth: u(4), opacity: 0.9 });
  // shadow of board on cap
  const sh = new Path();
  sh.M(cx - u(130), cy + u(60)).L(cx, cy + u(100)).L(cx + u(130), cy + u(60)).L(cx + u(130), cy + u(20)).L(cx - u(130), cy + u(20)).Z();
  specs.push({ path: sh, fill: "#050b22", opacity: 0.45 });
  // board thickness
  const side = new Path();
  side.poly([[cx - u(230), cy], [cx, cy + u(82)], [cx + u(230), cy], [cx + u(230), cy + u(20)], [cx, cy + u(104)], [cx - u(230), cy + u(20)]], true);
  specs.push({ path: side, fill: "#070e2b" });
  // board top
  const top = new Path();
  top.poly([[cx - u(230), cy], [cx, cy - u(82)], [cx + u(230), cy], [cx, cy + u(82)]], true);
  specs.push({ path: top, fill: linear(60, [0, "#34499a"], [0.55, "#1a2a66"], [1, "#0f1a48"]), stroke: GOLD_M, strokeWidth: u(3), lineJoin: "miter" });
  // light facet
  const facet = new Path();
  facet.poly([[cx - u(230), cy], [cx, cy - u(82)], [cx + u(90), cy - u(40)], [cx - u(60), cy + u(34)]], true);
  specs.push({ path: facet, fill: "#ffffff", opacity: 0.07 });
  // fine inner line
  const inner = new Path();
  inner.poly([[cx - u(196), cy], [cx, cy - u(70)], [cx + u(196), cy], [cx, cy + u(70)]], true);
  specs.push({ path: inner, stroke: GOLD_L, strokeWidth: u(1.2), opacity: 0.45, lineJoin: "miter" });
  // cord and tassel
  const tx = cx + u(178);
  const cord = new Path();
  cord.M(cx, cy).Q(cx + u(95), cy - u(2), tx, cy + u(16)).L(tx, cy + u(112));
  specs.push({ path: cord, stroke: GOLD_M, strokeWidth: u(5.5) });
  specs.push({ path: cord, stroke: GOLD_L, strokeWidth: u(1.6), opacity: 0.7 });
  const knot = new Path().circle(tx, cy + u(118), u(11));
  specs.push({ path: knot, fill: linear(60, [0, GOLD_L], [1, GOLD_D]) });
  const tas = new Path();
  tas.M(tx - u(12), cy + u(124)).L(tx + u(12), cy + u(124)).L(tx + u(20), cy + u(205)).Q(tx, cy + u(216), tx - u(20), cy + u(205)).Z();
  specs.push({ path: tas, fill: linear(0, [0, GOLD_D], [0.4, GOLD_L], [1, GOLD_D]) });
  const strands = new Path();
  for (let i = -3; i <= 3; i++) strands.M(tx + u(i * 3), cy + u(128)).L(tx + u(i * 5.5), cy + u(208));
  specs.push({ path: strands, stroke: GOLD_D, strokeWidth: u(1.2), opacity: 0.7 });
  // button
  const btn = ellipsePath(cx, cy - u(2), u(15), u(8));
  specs.push({ path: btn, fill: linear(90, [0, GOLD_L], [1, GOLD_D]) });
  return place(specs, 4);
}

/** Rolled diploma with ribbon bow, drawn horizontally; (cx,cy) = centre. */
export function diploma(cx: number, cy: number, w: number, h: number, tilt = 0): Layer {
  const x0 = cx - w / 2;
  const x1 = cx + w / 2;
  const er = h * 0.2;
  const specs: PartSpec[] = [];
  const paper = new Path();
  paper.poly([[x0 + er * 0.2, cy - h / 2], [x1 - er * 0.2, cy - h / 2], [x1 - er * 0.2, cy + h / 2], [x0 + er * 0.2, cy + h / 2]], true);
  specs.push({ path: paper, fill: linear(90, [0, "#fffaf0"], [0.5, "#f1e4c4"], [1, "#d3bd8c"]) });
  // paper edge shading
  const sh = new Path();
  sh.poly([[x0 + er, cy + h * 0.2], [x1 - er, cy + h * 0.2], [x1 - er, cy + h / 2], [x0 + er, cy + h / 2]], true);
  specs.push({ path: sh, fill: "#a88a4e", opacity: 0.18 });
  // text lines on the paper
  const lines = new Path();
  for (let i = 0; i < 3; i++) lines.M(x0 + w * 0.18, cy - h * 0.2 + i * h * 0.17).L(x0 + w * (i === 1 ? 0.4 : 0.44), cy - h * 0.2 + i * h * 0.17);
  for (let i = 0; i < 3; i++) lines.M(x1 - w * (i === 1 ? 0.4 : 0.44), cy - h * 0.2 + i * h * 0.17).L(x1 - w * 0.18, cy - h * 0.2 + i * h * 0.17);
  specs.push({ path: lines, stroke: GOLD_D, strokeWidth: 2, opacity: 0.55 });
  // rolled ends
  for (const [ex, dir] of [[x0, -1], [x1, 1]] as const) {
    const e = ellipsePath(ex + (dir * er) / 5, cy, er, h / 2);
    specs.push({ path: e, fill: linear(dir > 0 ? 180 : 0, [0, "#efe0b8"], [1, "#c7ae78"]) });
    const e2 = ellipsePath(ex + (dir * er) / 5, cy, er * 0.62, h * 0.34);
    specs.push({ path: e2, stroke: "#9a7f45", strokeWidth: 2, opacity: 0.7 });
    const e3 = ellipsePath(ex + (dir * er) / 5, cy, er * 0.26, h * 0.15);
    specs.push({ path: e3, stroke: "#9a7f45", strokeWidth: 2, opacity: 0.7 });
  }
  // ribbon band
  const rb = new Path();
  rb.poly([[cx - 20, cy - h / 2 - 2], [cx + 20, cy - h / 2 - 2], [cx + 20, cy + h / 2 + 2], [cx - 20, cy + h / 2 + 2]], true);
  specs.push({ path: rb, fill: linear(0, [0, "#7d1522"], [0.5, "#c0303f"], [1, "#7d1522"]) });
  // bow
  const bow = new Path();
  bow.M(cx, cy).C(cx - 36, cy - 50, cx - 84, cy - 34, cx - 76, cy + 2).C(cx - 70, cy + 28, cx - 30, cy + 20, cx, cy).Z();
  bow.M(cx, cy).C(cx + 36, cy - 50, cx + 84, cy - 34, cx + 76, cy + 2).C(cx + 70, cy + 28, cx + 30, cy + 20, cx, cy).Z();
  specs.push({ path: bow, fill: linear(90, [0, "#d94557"], [1, "#8d1a28"]) });
  const tails = new Path();
  tails.M(cx - 6, cy + 4).L(cx - 44, cy + 70).L(cx - 26, cy + 64).L(cx - 14, cy + 80).L(cx + 4, cy + 8).Z();
  tails.M(cx + 6, cy + 4).L(cx + 44, cy + 70).L(cx + 26, cy + 64).L(cx + 14, cy + 80).L(cx - 4, cy + 8).Z();
  specs.push({ path: tails, fill: "#a82233" });
  const kn = new Path().circle(cx, cy + 3, 13);
  specs.push({ path: kn, fill: linear(90, [0, "#e25a6a"], [1, "#8d1a28"]) });
  const l = place(specs, 3);
  return tilt ? centerRotate(l, l.x + l.width / 2, l.y + l.height / 2, tilt) : l;
}
