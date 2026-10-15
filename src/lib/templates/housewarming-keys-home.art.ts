import { Path, leaf, type PartSpec, type Pt } from "../design/path";
import type { OrnamentLayer } from "../design/types";
import { linear } from "./kit";
import { ellipsePath, place } from "./birthday-balloons-bold.art";

export const CREAM = "#fbf3e4";
export const PAPER = "#f6ead6";
export const TERRA = "#c4603c";
export const TERRA_D = "#8f3f22";
export const SAGE = "#9db39a";
export const SAGE_D = "#6f8f6e";
export const GREEN = "#3f5a46";
export const MUSTARD = "#e0a94c";
export const BROWN = "#3b2f2a";

const rad = (d: number) => (d * Math.PI) / 180;

/** Potted plant pot, (cx, baseY) = bottom centre. */
export function potSpecs(cx: number, baseY: number, w: number, h: number, color = TERRA): PartSpec[] {
  const rimH = h * 0.24;
  const body = new Path();
  body.poly([[cx - w / 2 + 3, baseY - h + rimH], [cx + w / 2 - 3, baseY - h + rimH], [cx + w * 0.34, baseY], [cx - w * 0.34, baseY]], true);
  const rim = new Path();
  rim.poly([[cx - w / 2, baseY - h], [cx + w / 2, baseY - h], [cx + w / 2, baseY - h + rimH], [cx - w / 2, baseY - h + rimH]], true);
  const hl = new Path();
  hl.poly([[cx - w * 0.3, baseY - h + rimH + 4], [cx - w * 0.18, baseY - h + rimH + 4], [cx - w * 0.14, baseY - 4], [cx - w * 0.22, baseY - 4]], true);
  return [
    { path: body, fill: linear(0, [0, color], [0.5, "#e07b55"], [1, TERRA_D]) },
    { path: rim, fill: linear(0, [0, TERRA_D], [0.45, "#e8886a"], [1, TERRA_D]) },
    { path: hl, fill: "#ffffff", opacity: 0.16 },
  ];
}

/** Tall snake plant in a pot. */
export function snakePlant(cx: number, baseY: number, s = 1): OrnamentLayer {
  const specs: PartSpec[] = [];
  const potH = 78 * s;
  const leaves: [number, number, number][] = [
    [-122, 150, 15], [-58, 155, 15], [-108, 205, 17], [-72, 215, 17], [-90, 260, 19], [-98, 190, 15], [-82, 175, 15], [-132, 110, 13], [-48, 118, 13],
  ];
  const dark = new Path();
  const mid = new Path();
  const stripe = new Path();
  for (const [a, l, w] of leaves) {
    leaf(dark, [cx + (a + 90) * 0.25 * s, baseY - potH + 8], rad(a), l * s, w * s);
    leaf(mid, [cx + (a + 90) * 0.25 * s, baseY - potH + 8], rad(a), l * s * 0.96, w * s * 0.55);
    leaf(stripe, [cx + (a + 90) * 0.25 * s, baseY - potH + 8], rad(a), l * s * 0.8, w * s * 0.18);
  }
  specs.push({ path: dark, fill: linear(90, [0, "#2f4a38"], [1, "#4d7a56"]), stroke: "#2a4232", strokeWidth: 1.2 });
  specs.push({ path: mid, fill: "#6a9a68", opacity: 0.85 });
  specs.push({ path: stripe, fill: "#d9e6a8", opacity: 0.75 });
  specs.push(...potSpecs(cx, baseY, 92 * s, potH));
  return place(specs, 3);
}

/** Bushy round-leaf plant in a pot. */
export function bushPlant(cx: number, baseY: number, s = 1, c1 = "#4f7a55", c2 = "#7fa77a"): OrnamentLayer {
  const specs: PartSpec[] = [];
  const potH = 70 * s;
  const by = baseY - potH + 6;
  const back = new Path();
  const front = new Path();
  const stems = new Path();
  const angs = [-160, -140, -120, -100, -80, -60, -40, -20];
  angs.forEach((a, i) => {
    const l = (96 + ((i * 37) % 40)) * s;
    const ex = cx + Math.cos(rad(a)) * l * 0.86;
    const ey = by + Math.sin(rad(a)) * l * 0.86;
    stems.M(cx, by).L(ex, ey);
    leaf(i % 2 ? front : back, [cx + Math.cos(rad(a)) * l * 0.55, by + Math.sin(rad(a)) * l * 0.55], rad(a), l * 0.62, 24 * s, true);
  });
  specs.push({ path: stems, stroke: "#365a40", strokeWidth: 3 * s });
  specs.push({ path: back, fill: c1, stroke: "#2f4d37", strokeWidth: 1 });
  specs.push({ path: front, fill: c2, stroke: "#365a40", strokeWidth: 1 });
  specs.push(...potSpecs(cx, baseY, 86 * s, potH, "#b55a38"));
  return place(specs, 3);
}

const quad = (p0: Pt, p1: Pt, p2: Pt, t: number): Pt => [(1 - t) * (1 - t) * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0], (1 - t) * (1 - t) * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1]];

/** Hanging planter on a macrame hanger with trailing vines. (cx,topY) = hook. */
export function hangingPlant(cx: number, topY: number, s = 1): OrnamentLayer {
  const specs: PartSpec[] = [];
  const potY = topY + 150 * s;
  const cord = new Path();
  for (const dx of [-34, 0, 34]) cord.M(cx, topY).L(cx + dx * s, potY);
  specs.push({ path: cord, stroke: "#c9b08a", strokeWidth: 2.4 });
  const hook = new Path().circle(cx, topY - 6, 6);
  specs.push({ path: hook, stroke: "#8a7a62", strokeWidth: 3 });
  const vines = new Path();
  const leaves = new Path();
  const rim: [number, number, number][] = [[-30, -50, 170], [-8, 18, 230], [18, -24, 200], [34, 56, 150]];
  rim.forEach(([x0, dx, L]) => {
    const p0: Pt = [cx + x0 * s, potY + 20 * s];
    const p2: Pt = [p0[0] + dx * s, p0[1] + L * s];
    const p1: Pt = [p0[0] + dx * 0.1 * s - 20 * s, p0[1] + L * 0.5 * s];
    vines.M(p0[0], p0[1]).Q(p1[0], p1[1], p2[0], p2[1]);
    for (let i = 1; i <= 7; i++) {
      const t = i / 8;
      const a = quad(p0, p1, p2, t);
      const b = quad(p0, p1, p2, t + 0.02);
      const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
      leaf(leaves, a, ang + rad(i % 2 ? 62 : -62), 26 * s, 9 * s, true);
    }
  });
  specs.push({ path: vines, stroke: "#3f5a46", strokeWidth: 2.4 });
  specs.push({ path: leaves, fill: linear(90, [0, "#6a9a68"], [1, "#3f6a4a"]) });
  const pot = new Path();
  pot.M(cx - 46 * s, potY + 4 * s).L(cx + 46 * s, potY + 4 * s).C(cx + 44 * s, potY + 56 * s, cx - 44 * s, potY + 56 * s, cx - 46 * s, potY + 4 * s).Z();
  pot.include([cx, potY + 52 * s]);
  specs.push({ path: pot, fill: linear(0, [0, "#e9d9bb"], [0.5, "#fbf3e4"], [1, "#d6c29c"]) });
  const band = new Path().M(cx - 45 * s, potY + 22 * s).C(cx - 20 * s, potY + 34 * s, cx + 20 * s, potY + 34 * s, cx + 45 * s, potY + 22 * s);
  specs.push({ path: band, stroke: TERRA, strokeWidth: 5 * s });
  return place(specs, 3);
}

/** Brass key; (cx,cy) = bow centre, `len` = shaft length, `ang` = rotation in degrees (0 = hanging down). */
export function keySpecs(cx: number, cy: number, len: number, ang: number, color = "#c99a3a", hi = "#f3d98a"): PartSpec[] {
  const a = rad(ang);
  const m = (x: number, y: number): Pt => [cx + x * Math.cos(a) - y * Math.sin(a), cy + x * Math.sin(a) + y * Math.cos(a)];
  const bow = new Path();
  const c = m(0, 0);
  bow.circle(c[0], c[1], 19);
  const shaft = new Path();
  const s0 = m(0, 19);
  const s1 = m(0, len);
  shaft.M(s0[0], s0[1]).L(s1[0], s1[1]);
  const teeth = new Path();
  for (const [y, w] of [[len - 4, 20], [len - 20, 15]] as const) {
    const t0 = m(0, y);
    const t1 = m(w, y);
    teeth.M(t0[0], t0[1]).L(t1[0], t1[1]);
  }
  const hiBow = new Path();
  const hc = m(-2, -2);
  hiBow.circle(hc[0], hc[1], 19);
  const hiShaft = new Path();
  const h0 = m(-2, 24);
  const h1 = m(-2, len - 28);
  hiShaft.M(h0[0], h0[1]).L(h1[0], h1[1]);
  return [
    { path: shaft, stroke: color, strokeWidth: 10 },
    { path: teeth, stroke: color, strokeWidth: 9, lineCap: "butt" },
    { path: bow, stroke: color, strokeWidth: 11 },
    { path: hiBow, stroke: hi, strokeWidth: 2.4, opacity: 0.85 },
    { path: hiShaft, stroke: hi, strokeWidth: 2.4, opacity: 0.85 },
  ];
}

/** A bunch of keys on a ring with a round tag; (cx,cy) = ring centre. Returns the layer and the tag centre. */
export function keyBunch(cx: number, cy: number, s = 1): OrnamentLayer {
  const specs: PartSpec[] = [];
  const nail = new Path().circle(cx, cy - 56 * s, 7);
  specs.push({ path: nail, fill: "#6b5a48" });
  const ring = ellipsePath(cx, cy, 36 * s, 36 * s);
  specs.push({ path: ring, stroke: "#8f979c", strokeWidth: 4 });
  const loop = new Path();
  loop.M(cx, cy - 36 * s).L(cx, cy - 52 * s);
  specs.push({ path: loop, stroke: "#8f979c", strokeWidth: 3 });
  specs.push(...keySpecs(cx - 22 * s, cy + 24 * s, 150 * s, 14, "#b98a30"));
  specs.push(...keySpecs(cx + 20 * s, cy + 26 * s, 170 * s, -12, "#c99a3a"));
  // tag
  const tc: Pt = [cx, cy + 36 * s];
  const cord = new Path();
  cord.M(tc[0], tc[1]).Q(cx + 6, cy + 90 * s, cx + 2, cy + 128 * s);
  specs.push({ path: cord, stroke: TERRA_D, strokeWidth: 2.5 });
  const tag = new Path();
  const ty = cy + 128 * s;
  tag.poly([[cx - 40 * s, ty + 18 * s], [cx - 20 * s, ty - 4 * s], [cx + 20 * s, ty - 4 * s], [cx + 40 * s, ty + 18 * s], [cx + 40 * s, ty + 78 * s], [cx - 40 * s, ty + 78 * s]], true);
  specs.push({ path: tag, fill: linear(60, [0, "#e07b55"], [1, TERRA_D]), stroke: "#7a3a20", strokeWidth: 2.5 });
  specs.push({ path: new Path().circle(cx, ty + 6 * s, 5), fill: CREAM });
  const inner = new Path();
  inner.poly([[cx - 32 * s, ty + 22 * s], [cx - 16 * s, ty + 4 * s], [cx + 16 * s, ty + 4 * s], [cx + 32 * s, ty + 22 * s], [cx + 32 * s, ty + 70 * s], [cx - 32 * s, ty + 70 * s]], true);
  specs.push({ path: inner, stroke: CREAM, strokeWidth: 1.4, opacity: 0.6 });
  return place(specs, 3);
}

/** The house illustration. (hx, gy) = ground centre of the front door. Width about 480, height about 420. */
export function house(hx: number, gy: number): OrnamentLayer {
  const specs: PartSpec[] = [];
  const poly = (pts: Pt[]) => new Path().poly(pts, true);
  // soft ground shadow
  specs.push({ path: ellipsePath(hx, gy + 6, 250, 14), fill: "#3f5a46", opacity: 0.22 });
  // chimney (behind roof)
  specs.push({ path: poly([[hx + 106, gy - 392], [hx + 156, gy - 392], [hx + 156, gy - 280], [hx + 106, gy - 280]]), fill: linear(0, [0, "#b4532f"], [1, "#8f3f22"]) });
  specs.push({ path: poly([[hx + 98, gy - 404], [hx + 164, gy - 404], [hx + 164, gy - 388], [hx + 98, gy - 388]]), fill: "#7d351c" });
  const brick = new Path();
  for (let r = 0; r < 4; r++) brick.M(hx + 106, gy - 372 + r * 22).L(hx + 156, gy - 372 + r * 22);
  specs.push({ path: brick, stroke: "#6d2d17", strokeWidth: 1.4, opacity: 0.5 });
  const smoke = new Path();
  smoke.M(hx + 131, gy - 412).C(hx + 100, gy - 436, hx + 168, gy - 452, hx + 134, gy - 476);
  specs.push({ path: smoke, stroke: "#ffffff", strokeWidth: 6, opacity: 0.7 });
  // body
  specs.push({ path: poly([[hx - 190, gy - 232], [hx + 190, gy - 232], [hx + 190, gy], [hx - 190, gy]]), fill: linear(90, [0, "#fff7e8"], [1, "#efdcbc"]) });
  specs.push({ path: poly([[hx + 150, gy - 232], [hx + 190, gy - 232], [hx + 190, gy], [hx + 150, gy]]), fill: "#a8814e", opacity: 0.14 });
  const clap = new Path();
  for (let y = gy - 200; y < gy - 4; y += 26) clap.M(hx - 190, y).L(hx + 190, y);
  specs.push({ path: clap, stroke: "#a8814e", strokeWidth: 1.2, opacity: 0.22 });
  // roof
  specs.push({ path: poly([[hx - 244, gy - 226], [hx, gy - 412], [hx + 244, gy - 226]]), fill: linear(90, [0, "#d0714b"], [1, "#a94b2b"]) });
  specs.push({ path: poly([[hx - 244, gy - 226], [hx, gy - 412], [hx, gy - 226]]), fill: "#ffffff", opacity: 0.08 });
  const shingle = new Path();
  for (const h of [38, 76, 114, 150]) {
    const hw = 244 * (1 - h / 186);
    shingle.M(hx - hw, gy - 226 - h).L(hx + hw, gy - 226 - h);
  }
  specs.push({ path: shingle, stroke: TERRA_D, strokeWidth: 2, opacity: 0.35 });
  specs.push({ path: poly([[hx - 248, gy - 228], [hx + 248, gy - 228], [hx + 240, gy - 210], [hx - 240, gy - 210]]), fill: TERRA_D });
  specs.push({ path: poly([[hx - 240, gy - 210], [hx + 240, gy - 210], [hx + 240, gy - 200], [hx - 240, gy - 200]]), fill: "#3b2f2a", opacity: 0.18 });
  // attic window
  specs.push({ path: ellipsePath(hx, gy - 300, 33, 33), fill: CREAM, stroke: "#7a5a45", strokeWidth: 3 });
  specs.push({ path: ellipsePath(hx, gy - 300, 25, 25), fill: linear(90, [0, "#ffe9b0"], [1, "#ffb95e"]) });
  const cross = new Path();
  cross.M(hx - 25, gy - 300).L(hx + 25, gy - 300).M(hx, gy - 325).L(hx, gy - 275);
  specs.push({ path: cross, stroke: "#7a5a45", strokeWidth: 3 });
  // windows with shutters and flower boxes
  for (const side of [-1, 1]) {
    const x0 = side < 0 ? hx - 158 : hx + 84;
    const x1 = x0 + 74;
    const y0 = gy - 190;
    const y1 = gy - 98;
    for (const sx of [x0 - 20, x1 + 2]) {
      specs.push({ path: poly([[sx, y0 - 2], [sx + 18, y0 - 2], [sx + 18, y1 + 2], [sx, y1 + 2]]), fill: SAGE_D });
      const sl = new Path();
      for (let y = y0 + 8; y < y1; y += 9) sl.M(sx + 3, y).L(sx + 15, y);
      specs.push({ path: sl, stroke: "#4f6f50", strokeWidth: 1.5 });
    }
    specs.push({ path: poly([[x0 - 4, y0 - 4], [x1 + 4, y0 - 4], [x1 + 4, y1 + 4], [x0 - 4, y1 + 4]]), fill: "#fffaf0", stroke: "#7a5a45", strokeWidth: 2 });
    specs.push({ path: poly([[x0 + 4, y0 + 4], [x1 - 4, y0 + 4], [x1 - 4, y1 - 4], [x0 + 4, y1 - 4]]), fill: linear(90, [0, "#ffeab4"], [1, "#ffbd62"]) });
    // silhouette of a plant on the sill inside
    const inPlant = new Path();
    leaf(inPlant, [x0 + 24, y1 - 4], rad(-100), 46, 9);
    leaf(inPlant, [x0 + 24, y1 - 4], rad(-65), 40, 9);
    leaf(inPlant, [x0 + 24, y1 - 4], rad(-125), 34, 8);
    specs.push({ path: inPlant, fill: "#9a5a30", opacity: 0.45 });
    const mull = new Path();
    mull.M((x0 + x1) / 2, y0 + 4).L((x0 + x1) / 2, y1 - 4).M(x0 + 4, (y0 + y1) / 2 - 6).L(x1 - 4, (y0 + y1) / 2 - 6);
    specs.push({ path: mull, stroke: "#fffaf0", strokeWidth: 4 });
    specs.push({ path: poly([[x0 - 10, y1 + 4], [x1 + 10, y1 + 4], [x1 + 8, y1 + 22], [x0 - 8, y1 + 22]]), fill: linear(90, [0, "#d0714b"], [1, TERRA_D]) });
    const bloom = new Path();
    const foliage = new Path();
    for (let i = 0; i < 6; i++) {
      foliage.circle(x0 - 2 + i * 15.5, y1 + 2, 9);
      bloom.circle(x0 + 3 + i * 15.5, y1 - 5, 4.2);
    }
    specs.push({ path: foliage, fill: "#4f7a55" });
    specs.push({ path: bloom, fill: side < 0 ? "#f7b6a0" : MUSTARD });
  }
  // door surround + door
  const door = (x: number, w: number, top: number) => {
    const r = w / 2;
    const p = new Path();
    p.M(x - r, gy).L(x - r, top + r).A(r, r, 0, 0, 1, x + r, top + r).L(x + r, gy).Z();
    p.include([x, top]);
    return p;
  };
  specs.push({ path: door(hx, 118, gy - 168), fill: "#fffaf0", stroke: "#7a5a45", strokeWidth: 2 });
  specs.push({ path: door(hx, 92, gy - 150), fill: linear(0, [0, "#86a684"], [0.5, "#7e9c7c"], [1, "#5f8062"]) });
  specs.push({ path: door(hx, 62, gy - 128), stroke: "#d6e4cf", strokeWidth: 1.6, opacity: 0.55 });
  const dp = new Path();
  dp.M(hx - 31, gy - 86).L(hx + 31, gy - 86).M(hx, gy - 128).L(hx, gy - 14);
  specs.push({ path: dp, stroke: "#d6e4cf", strokeWidth: 1.6, opacity: 0.55 });
  specs.push({ path: new Path().circle(hx + 27, gy - 62, 6), fill: MUSTARD, stroke: "#9a7433", strokeWidth: 1.5 });
  // lanterns either side of the door
  for (const lx of [hx - 70, hx + 70]) {
    specs.push({ path: ellipsePath(lx, gy - 128, 22, 22), fill: "#ffd98a", opacity: 0.28 });
    specs.push({ path: poly([[lx - 7, gy - 140], [lx + 7, gy - 140], [lx + 7, gy - 116], [lx - 7, gy - 116]]), fill: linear(90, [0, "#fff0b8"], [1, "#ffc062"]), stroke: BROWN, strokeWidth: 2 });
    specs.push({ path: poly([[lx - 9, gy - 145], [lx + 9, gy - 145], [lx + 5, gy - 140], [lx - 5, gy - 140]]), fill: BROWN });
  }
  // steps and path
  specs.push({ path: poly([[hx - 72, gy], [hx + 72, gy], [hx + 72, gy + 14], [hx - 72, gy + 14]]), fill: "#d9c7a6" });
  specs.push({ path: poly([[hx - 86, gy + 14], [hx + 86, gy + 14], [hx + 86, gy + 28], [hx - 86, gy + 28]]), fill: "#c9b48e" });
  specs.push({ path: poly([[hx - 66, gy + 28], [hx + 66, gy + 28], [hx + 112, gy + 118], [hx - 112, gy + 118]]), fill: linear(90, [0, "#ead9bb"], [1, "#f3e6cc"]) });
  const stones = new Path();
  for (const [y, w] of [[58, 80], [88, 96]] as const) stones.M(hx - w, y + gy).L(hx + w, y + gy);
  specs.push({ path: stones, stroke: "#c9b48e", strokeWidth: 2.4 });
  return place(specs, 3);
}

/** Icons (single colour, ~48px box centred on cx,cy). */
export function icon(kind: "clock" | "pin" | "gift" | "leaf", cx: number, cy: number, color: string, bg = "#ffffff"): OrnamentLayer {
  const specs: PartSpec[] = [];
  if (kind === "clock") {
    specs.push({ path: new Path().circle(cx, cy, 21), stroke: color, strokeWidth: 4 });
    specs.push({ path: new Path().M(cx, cy - 12).L(cx, cy).L(cx + 10, cy + 6), stroke: color, strokeWidth: 4 });
  } else if (kind === "pin") {
    const p = new Path();
    p.M(cx, cy + 26).C(cx - 34, cy - 4, cx - 24, cy - 28, cx, cy - 28).C(cx + 24, cy - 28, cx + 34, cy - 4, cx, cy + 26).Z();
    specs.push({ path: p, fill: color });
    specs.push({ path: new Path().circle(cx, cy - 8, 8), fill: bg });
  } else if (kind === "gift") {
    const b = new Path().poly([[cx - 22, cy - 6], [cx + 22, cy - 6], [cx + 22, cy + 24], [cx - 22, cy + 24]], true);
    specs.push({ path: b, stroke: color, strokeWidth: 4 });
    specs.push({ path: new Path().poly([[cx - 26, cy - 18], [cx + 26, cy - 18], [cx + 26, cy - 6], [cx - 26, cy - 6]], true), stroke: color, strokeWidth: 4 });
    specs.push({ path: new Path().M(cx, cy - 18).L(cx, cy + 24), stroke: color, strokeWidth: 4 });
    specs.push({ path: new Path().M(cx, cy - 20).C(cx - 22, cy - 40, cx - 26, cy - 20, cx, cy - 20).C(cx + 22, cy - 40, cx + 26, cy - 20, cx, cy - 20), stroke: color, strokeWidth: 4 });
  } else {
    const p = new Path();
    leaf(p, [cx - 14, cy + 22], rad(-50), 56, 14, true);
    specs.push({ path: p, fill: color });
    specs.push({ path: new Path().M(cx - 18, cy + 26).L(cx + 8, cy - 4), stroke: "#ffffff", strokeWidth: 2.4 });
  }
  return place(specs, 3);
}
