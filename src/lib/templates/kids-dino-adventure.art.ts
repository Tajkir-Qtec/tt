import { Path, leaf, type PartSpec, type Pt } from "../design/path";
import type { OrnamentLayer } from "../design/types";
import { linear } from "./kit";
import { ellipsePath, place } from "./birthday-balloons-bold.art";

export const INK = "#1f4d2b";
export const ORANGE = "#ff8a2a";
export const ORANGE_D = "#e5611a";
export const SUN = "#ffd23f";
export const LEAF_L = "#6fd36a";
export const LEAF_D = "#2f9a52";

const rad = (d: number) => (d * Math.PI) / 180;
const quad = (p0: Pt, p1: Pt, p2: Pt, t: number): Pt => [(1 - t) * (1 - t) * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0], (1 - t) * (1 - t) * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1]];

export interface DinoColors {
  base: string;
  dark: string;
  light: string;
  belly: string;
  accent: string;
}
export const GREEN_DINO: DinoColors = { base: "#4cc16a", dark: "#2f9a52", light: "#8ee08a", belly: "#e3f7b0", accent: ORANGE };
export const TEAL_DINO: DinoColors = { base: "#2ec4b6", dark: "#1a998d", light: "#7fe3d8", belly: "#e8fbd0", accent: "#ffb703" };

/** Coordinate mapper: local dino space -> page. */
function mapper(cx: number, cy: number, s: number, flip: boolean) {
  const fx = flip ? -1 : 1;
  return (x: number, y: number): Pt => [cx + fx * s * x, cy + s * y];
}

/** A tapering tube along a quadratic curve built from short round-capped strokes. */
function tube(specs: PartSpec[], p0: Pt, p1: Pt, p2: Pt, w0: number, w1: number, color: string, n = 26, opacity?: number) {
  for (let i = 0; i < n; i++) {
    const a = quad(p0, p1, p2, i / n);
    const b = quad(p0, p1, p2, (i + 1) / n);
    const w = w0 + (w1 - w0) * ((i + 0.5) / n);
    specs.push({ path: new Path().M(a[0], a[1]).L(b[0], b[1]), stroke: color, strokeWidth: w, opacity });
  }
}

function eye(specs: PartSpec[], m: (x: number, y: number) => Pt, x: number, y: number, r: number, s: number, look = -0.25) {
  const c = m(x, y);
  specs.push({ path: ellipsePath(c[0], c[1], r * s, r * s), fill: "#ffffff", stroke: INK, strokeWidth: 2.5 });
  const pu = m(x + look * r, y + 0.1 * r);
  specs.push({ path: ellipsePath(pu[0], pu[1], r * 0.55 * s, r * 0.55 * s), fill: INK });
  const hl = m(x + look * r - 0.18 * r, y - 0.2 * r);
  specs.push({ path: ellipsePath(hl[0], hl[1], r * 0.2 * s, r * 0.2 * s), fill: "#ffffff" });
}

/** Friendly long-neck dino (faces left unless flipped). (cx,cy) = body centre. Feet end about cy+160*s. */
export function longNeck(cx: number, cy: number, s: number, c: DinoColors = GREEN_DINO, flip = false): OrnamentLayer {
  const m = mapper(cx, cy, s, flip);
  const specs: PartSpec[] = [];
  const leg = (x: number, y0: number, y1: number, color: string, foot: string) => {
    const a = m(x, y0);
    const b = m(x, y1);
    specs.push({ path: new Path().M(a[0], a[1]).L(b[0], b[1]), stroke: color, strokeWidth: 54 * s });
    const f = m(x + (flip ? 8 : -8), y1 + 6);
    specs.push({ path: ellipsePath(f[0], f[1], 34 * s, 14 * s), fill: foot });
  };
  // far legs
  leg(-70, 70, 150, c.dark, "#1f7a40");
  leg(98, 70, 150, c.dark, "#1f7a40");
  // back plates
  const plates = new Path();
  for (let x = -100; x <= 110; x += 42) {
    const y = -88 * Math.sqrt(Math.max(0, 1 - (x / 148) ** 2));
    const t = (x / 148) * 14;
    const p1 = m(x - 17, y + 8);
    const p2 = m(x + t, y - 40);
    const p3 = m(x + 17, y + 8);
    plates.poly([p1, p2, p3], true);
  }
  specs.push({ path: plates, fill: c.accent, stroke: ORANGE_D, strokeWidth: 2, lineJoin: "round" });
  // tail
  const t0 = m(110, 10);
  const t1 = m(240, 70);
  const t2 = m(330, -20);
  tube(specs, t0, t1, t2, 104 * s, 12 * s, c.base, 30);
  // body
  const b = m(0, 0);
  specs.push({ path: ellipsePath(b[0], b[1], 152 * s, 96 * s), fill: linear(90, [0, c.light], [0.45, c.base], [1, c.dark]) });
  const bb = m(0, 52);
  specs.push({ path: ellipsePath(bb[0], bb[1], 120 * s, 40 * s), fill: c.belly, opacity: 0.9 });
  // belly stripes
  const stripes = new Path();
  for (let i = -3; i <= 3; i++) {
    const a = m(i * 30, 36);
    const d = m(i * 30 + 4, 64);
    stripes.M(a[0], a[1]).L(d[0], d[1]);
  }
  specs.push({ path: stripes, stroke: "#c4e68a", strokeWidth: 2.4 * s, opacity: 0.9 });
  // spots
  for (const [x, y, r] of [[-20, -40, 16], [38, -52, 12], [70, -14, 15], [-64, -12, 11], [10, -8, 10]] as const) {
    const p = m(x, y);
    specs.push({ path: ellipsePath(p[0], p[1], r * s, r * s), fill: c.dark, opacity: 0.45 });
  }
  // neck
  const n0 = m(-96, -34);
  const n1 = m(-215, -90);
  const n2 = m(-180, -290);
  tube(specs, n0, n1, n2, 92 * s, 52 * s, c.base, 30);
  // neck belly strip
  const nb0 = m(-112, -20);
  const nb1 = m(-228, -80);
  const nb2 = m(-198, -280);
  tube(specs, nb0, nb1, nb2, 26 * s, 14 * s, c.belly, 24, 0.9);
  // near legs
  leg(-20, 70, 158, c.base, c.dark);
  leg(-120, 60, 158, c.base, c.dark);
  // head
  const hc = m(-182, -318);
  specs.push({ path: ellipsePath(hc[0], hc[1], 58 * s, 44 * s, flip ? 12 : -12), fill: linear(90, [0, c.light], [1, c.base]) });
  const sn = m(-232, -308);
  specs.push({ path: ellipsePath(sn[0], sn[1], 30 * s, 26 * s, flip ? 12 : -12), fill: c.base });
  const nos = m(-244, -318);
  specs.push({ path: ellipsePath(nos[0], nos[1], 3.4 * s, 4.5 * s), fill: INK, opacity: 0.8 });
  eye(specs, m, -192, -334, 16, s);
  // cheek and smile
  const ck = m(-206, -298);
  specs.push({ path: ellipsePath(ck[0], ck[1], 12 * s, 8 * s), fill: "#ff8fa3", opacity: 0.7 });
  const sm0 = m(-250, -296);
  const sm1 = m(-226, -276);
  const sm2 = m(-188, -296);
  specs.push({ path: new Path().M(sm0[0], sm0[1]).Q(sm1[0], sm1[1], sm2[0], sm2[1]), stroke: INK, strokeWidth: 3.4, opacity: 0.85 });
  // head crest
  const crest = new Path();
  for (const [x, y, ang] of [[-168, -356, -20], [-150, -344, 10]] as const) {
    const p1 = m(x - 8, y + 4);
    const p2 = m(x + (ang / 2), y - 24);
    const p3 = m(x + 10, y + 6);
    crest.poly([p1, p2, p3], true);
  }
  specs.push({ path: crest, fill: c.accent });
  return place(specs, 4);
}

/** Triceratops, faces right unless flipped. (cx,cy) = body centre; feet end about cy+130*s. */
export function trike(cx: number, cy: number, s: number, c: DinoColors = TEAL_DINO, flip = false): OrnamentLayer {
  const m = mapper(cx, cy, s, flip);
  const specs: PartSpec[] = [];
  const leg = (x: number, y1: number, color: string, foot: string) => {
    const a = m(x, 40);
    const b = m(x, y1);
    specs.push({ path: new Path().M(a[0], a[1]).L(b[0], b[1]), stroke: color, strokeWidth: 44 * s });
    const f = m(x + 6, y1 + 6);
    specs.push({ path: ellipsePath(f[0], f[1], 28 * s, 12 * s), fill: foot });
  };
  leg(-80, 118, c.dark, "#14776e");
  leg(70, 118, c.dark, "#14776e");
  tube(specs, m(-110, 0), m(-210, 20), m(-250, 80), 80 * s, 10 * s, c.base, 22);
  const b = m(0, 0);
  specs.push({ path: ellipsePath(b[0], b[1], 135 * s, 84 * s), fill: linear(90, [0, c.light], [0.45, c.base], [1, c.dark]) });
  const bb = m(10, 44);
  specs.push({ path: ellipsePath(bb[0], bb[1], 100 * s, 32 * s), fill: c.belly, opacity: 0.9 });
  for (const [x, y, r] of [[-30, -34, 14], [20, -48, 11], [-76, -10, 10], [50, -6, 13]] as const) {
    const p = m(x, y);
    specs.push({ path: ellipsePath(p[0], p[1], r * s, r * s), fill: c.accent, opacity: 0.85 });
  }
  leg(-26, 124, c.base, c.dark);
  leg(116, 124, c.base, c.dark);
  // frill
  const fr = m(112, -8);
  const frill = new Path();
  const fN = 12;
  for (let i = 0; i < fN; i++) {
    const a = rad(-215 + (i * 250) / (fN - 1));
    const p = m(112 + Math.cos(a) * 82, -8 + Math.sin(a) * 82);
    frill.circle(p[0], p[1], 15 * s);
  }
  specs.push({ path: frill, fill: c.accent });
  specs.push({ path: ellipsePath(fr[0], fr[1], 74 * s, 74 * s), fill: linear(90, [0, "#ffcf70"], [1, c.accent]), stroke: "#e08a00", strokeWidth: 2 });
  const fd = new Path();
  for (let i = 0; i < 6; i++) {
    const a = rad(-205 + i * 42);
    const p = m(112 + Math.cos(a) * 50, -8 + Math.sin(a) * 50);
    fd.circle(p[0], p[1], 6 * s);
  }
  specs.push({ path: fd, fill: "#ffffff", opacity: 0.55 });
  // head
  const hd = m(176, 24);
  specs.push({ path: ellipsePath(hd[0], hd[1], 66 * s, 52 * s, flip ? 8 : -8), fill: linear(90, [0, c.light], [1, c.base]) });
  const bk = m(228, 44);
  specs.push({ path: ellipsePath(bk[0], bk[1], 24 * s, 22 * s), fill: "#ffe6b0", stroke: "#e8b86a", strokeWidth: 2 });
  // horns
  const horns = new Path();
  for (const [x0, y0, x1, y1] of [[160, -18, 150, -96], [190, -18, 220, -88]] as const) {
    const a = m(x0 - 11, y0 + 6);
    const t = m(x1, y1);
    const d = m(x0 + 11, y0 + 6);
    horns.poly([a, t, d], true);
  }
  const nh = m(220, 8);
  const nh0 = m(208, 12);
  const nh1 = m(240, -26);
  const nh2 = m(232, 16);
  horns.poly([nh0, nh1, nh2], true);
  void nh;
  specs.push({ path: horns, fill: "#fff3d6", stroke: "#e8b86a", strokeWidth: 2 });
  eye(specs, m, 186, 8, 14, s, 0.25);
  const ck = m(196, 40);
  specs.push({ path: ellipsePath(ck[0], ck[1], 11 * s, 7 * s), fill: "#ff8fa3", opacity: 0.7 });
  const sm0 = m(206, 52);
  const sm1 = m(226, 66);
  const sm2 = m(246, 52);
  specs.push({ path: new Path().M(sm0[0], sm0[1]).Q(sm1[0], sm1[1], sm2[0], sm2[1]), stroke: INK, strokeWidth: 3, opacity: 0.85 });
  return place(specs, 4);
}

/** A cracked egg with a baby dino peeking out. (cx, baseY) = bottom centre. */
export function hatchling(cx: number, baseY: number, s = 1, c: DinoColors = GREEN_DINO): OrnamentLayer {
  const specs: PartSpec[] = [];
  const y = (v: number) => baseY - v * s;
  const x = (v: number) => cx + v * s;
  // baby head and body peeking
  specs.push({ path: ellipsePath(x(0), y(72), 52 * s, 46 * s), fill: linear(90, [0, c.light], [1, c.base]) });
  const hc = new Path();
  for (const dx of [-24, 0, 24]) hc.poly([[x(dx - 9), y(112)], [x(dx), y(138)], [x(dx + 9), y(112)]], true);
  specs.push({ path: hc, fill: c.accent });
  eye(specs, (px, py) => [x(px), y(-py)], -18, -78, 11, s, 0);
  eye(specs, (px, py) => [x(px), y(-py)], 20, -78, 11, s, 0);
  const sm = new Path().M(x(-12), y(52)).Q(x(0), y(40), x(12), y(52));
  specs.push({ path: sm, stroke: INK, strokeWidth: 3, opacity: 0.85 });
  for (const dx of [-32, 32]) specs.push({ path: ellipsePath(x(dx), y(58), 8 * s, 5 * s), fill: "#ff8fa3", opacity: 0.7 });
  // lower shell with zig-zag edge
  const shell = new Path();
  shell.M(x(-72), y(46));
  const zz: Pt[] = [];
  const n = 8;
  for (let i = 0; i <= n; i++) zz.push([x(-72 + (144 * i) / n), y(i % 2 ? 66 : 38)]);
  zz.forEach(([px, py]) => shell.L(px, py));
  shell.C(x(84), y(-4), x(46), y(-10), x(0), y(-10)).C(x(-46), y(-10), x(-84), y(-4), x(-72), y(46)).Z();
  specs.push({ path: shell, fill: linear(60, [0, "#fffdf2"], [0.6, "#f7ecc8"], [1, "#e2cf9a"]), stroke: "#c9b277", strokeWidth: 2.4 });
  for (const [dx, dy, r] of [[-34, 14, 9], [24, 22, 11], [-6, 4, 7], [46, 6, 6]] as const) specs.push({ path: ellipsePath(x(dx), y(dy), r * s, r * s), fill: c.base, opacity: 0.5 });
  // flying shell shards
  specs.push({ path: new Path().poly([[x(-92), y(100)], [x(-66), y(116)], [x(-72), y(90)]], true), fill: "#fff6d8", stroke: "#c9b277", strokeWidth: 2 });
  specs.push({ path: new Path().poly([[x(82), y(104)], [x(104), y(88)], [x(70), y(84)]], true), fill: "#fff6d8", stroke: "#c9b277", strokeWidth: 2 });
  return place(specs, 4);
}

/** A three-toed dino footprint. */
export function footprints(pts: [number, number, number][], color: string, opacity = 0.35, s = 1): OrnamentLayer {
  const p = new Path();
  for (const [px, py, ang] of pts) {
    const a = rad(ang);
    const m = (x: number, y: number): Pt => [px + (x * Math.cos(a) - y * Math.sin(a)) * s, py + (x * Math.sin(a) + y * Math.cos(a)) * s];
    const c = m(0, 14);
    p.M(m(-16, 10)[0], m(-16, 10)[1]).C(m(-18, 34)[0], m(-18, 34)[1], m(18, 34)[0], m(18, 34)[1], m(16, 10)[0], m(16, 10)[1]).C(m(10, -2)[0], m(10, -2)[1], m(-10, -2)[0], m(-10, -2)[1], m(-16, 10)[0], m(-16, 10)[1]).Z();
    for (const [tx, ty, ta] of [[-24, -12, -25], [0, -24, 0], [24, -12, 25]] as const) {
      const t = m(tx, ty);
      const aa = a + rad(ta);
      const rx = 7 * s;
      const ry = 14 * s;
      const dx = Math.cos(aa) * rx;
      const dy = Math.sin(aa) * rx;
      p.M(t[0] - dx, t[1] - dy).A(rx, ry, (aa * 180) / Math.PI, 1, 0, t[0] + dx, t[1] + dy).A(rx, ry, (aa * 180) / Math.PI, 1, 0, t[0] - dx, t[1] - dy).Z();
      p.include([t[0] - ry, t[1] - ry], [t[0] + ry, t[1] + ry]);
    }
    void c;
  }
  return place([{ path: p, fill: color, opacity }], 2);
}

/** Fern frond / palm leaf along a curve. */
export function fern(bx: number, by: number, len: number, angDeg: number, bend: number, c1 = LEAF_D, c2 = LEAF_L, n = 11): OrnamentLayer {
  const a = rad(angDeg);
  const p0: Pt = [bx, by];
  const p2: Pt = [bx + Math.cos(a) * len, by + Math.sin(a) * len];
  const mid: Pt = [(p0[0] + p2[0]) / 2 + Math.cos(a + Math.PI / 2) * bend, (p0[1] + p2[1]) / 2 + Math.sin(a + Math.PI / 2) * bend];
  const stem = new Path().M(p0[0], p0[1]).Q(mid[0], mid[1], p2[0], p2[1]);
  const lA = new Path();
  const lB = new Path();
  for (let i = 1; i <= n; i++) {
    const t = i / (n + 1);
    const q = quad(p0, mid, p2, t);
    const q2 = quad(p0, mid, p2, t + 0.03);
    const ang = Math.atan2(q2[1] - q[1], q2[0] - q[0]);
    const size = len * 0.34 * (1 - t * 0.72);
    leaf(lA, q, ang + rad(62), size, size * 0.26);
    leaf(lB, q, ang - rad(62), size, size * 0.26);
  }
  const tip = quad(p0, mid, p2, 1);
  const tq = quad(p0, mid, p2, 0.97);
  leaf(lA, tip, Math.atan2(tip[1] - tq[1], tip[0] - tq[0]), len * 0.1, len * 0.03);
  return place(
    [
      { path: stem, stroke: c1, strokeWidth: 4 },
      { path: lA, fill: c1 },
      { path: lB, fill: c2 },
    ],
    3,
  );
}

/** Volcano with lava and smoke. (cx, baseY) = base centre. */
export function volcano(cx: number, baseY: number, w: number, h: number): OrnamentLayer {
  const specs: PartSpec[] = [];
  const topW = w * 0.2;
  const body = new Path();
  body.M(cx - w / 2, baseY).C(cx - w * 0.3, baseY - h * 0.3, cx - topW * 1.2, baseY - h * 0.8, cx - topW, baseY - h).L(cx + topW, baseY - h).C(cx + topW * 1.2, baseY - h * 0.8, cx + w * 0.3, baseY - h * 0.3, cx + w / 2, baseY).Z();
  specs.push({ path: body, fill: linear(90, [0, "#9a6b4f"], [1, "#6e4a38"]) });
  const shade = new Path();
  shade.M(cx + w * 0.05, baseY).C(cx + w * 0.1, baseY - h * 0.5, cx + topW * 0.7, baseY - h * 0.8, cx + topW, baseY - h).C(cx + topW * 1.2, baseY - h * 0.8, cx + w * 0.3, baseY - h * 0.3, cx + w / 2, baseY).Z();
  specs.push({ path: shade, fill: "#3b2a22", opacity: 0.22 });
  const lava = new Path();
  lava.M(cx - topW, baseY - h).C(cx - topW * 0.6, baseY - h - 22, cx + topW * 0.6, baseY - h - 22, cx + topW, baseY - h).C(cx + topW * 0.6, baseY - h + 20, cx + topW * 0.4, baseY - h + 8, cx + topW * 0.3, baseY - h + 40).C(cx + topW * 0.1, baseY - h + 60, cx - topW * 0.2, baseY - h + 24, cx - topW * 0.4, baseY - h + 50).C(cx - topW * 0.7, baseY - h + 70, cx - topW, baseY - h + 20, cx - topW, baseY - h).Z();
  lava.include([cx, baseY - h - 22]);
  specs.push({ path: lava, fill: linear(90, [0, "#ffd23f"], [1, "#ff5a1f"]) });
  const smoke = new Path();
  smoke.circle(cx - 8, baseY - h - 46, 26).circle(cx + 24, baseY - h - 78, 32).circle(cx - 6, baseY - h - 116, 24);
  specs.push({ path: smoke, fill: "#ffffff", opacity: 0.6 });
  return place(specs, 3);
}
