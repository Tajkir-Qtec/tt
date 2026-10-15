import { Path, leaf, petal, type PartSpec } from "../design/path";
import { linear } from "./kit";
import { leafSpecs, rose, type RoseCols } from "./valentines-dinner-rose.art";

export const PEONY: RoseCols = [
  ["#f3a9bb", "#d9758f"],
  ["#f8c4d0", "#e590a6"],
  ["#fcdbe3", "#f0a9bb"],
  ["#fff0f3", "#f8cbd6"],
];
export const PEACH: RoseCols = [
  ["#f9c3a4", "#e8946e"],
  ["#fcd7bf", "#f0ac8a"],
  ["#fee6d6", "#f8c4a8"],
  ["#fff3ea", "#fcd9c4"],
];
export const LILAC: RoseCols = [
  ["#c9b3e6", "#9c80c8"],
  ["#dccbf1", "#b79ddb"],
  ["#ebe0f8", "#ccb8e8"],
  ["#f7f1fd", "#e0d3f3"],
];

class Xf {
  constructor(public p: Path, public cx: number, public cy: number, public s: number) {}
  X = (x: number) => this.cx + x * this.s;
  Y = (y: number) => this.cy + y * this.s;
  M(x: number, y: number) { this.p.M(this.X(x), this.Y(y)); return this; }
  L(x: number, y: number) { this.p.L(this.X(x), this.Y(y)); return this; }
  C(a: number, b: number, c: number, d: number, e: number, f: number) { this.p.C(this.X(a), this.Y(b), this.X(c), this.Y(d), this.X(e), this.Y(f)); return this; }
  Q(a: number, b: number, c: number, d: number) { this.p.Q(this.X(a), this.Y(b), this.X(c), this.Y(d)); return this; }
  Z() { this.p.Z(); return this; }
  ell(x: number, y: number, rx: number, ry: number) {
    this.M(x - rx, y);
    this.p.A(rx * this.s, ry * this.s, 0, 1, 0, this.X(x + rx), this.Y(y)).A(rx * this.s, ry * this.s, 0, 1, 0, this.X(x - rx), this.Y(y)).Z();
    this.p.include([this.X(x), this.Y(y - ry)], [this.X(x), this.Y(y + ry)]);
    return this;
  }
}

/** Porcelain teacup on a saucer with a floral band and rising steam. cx is centre, cy is the saucer top. */
export function teacup(cx: number, cy: number, s: number, accent = "#d9758f", tea = "#c98a5a"): PartSpec[] {
  const out: PartSpec[] = [];
  const shadow = new Path();
  new Xf(shadow, cx, cy, s).ell(0, 36, 205, 22);
  out.push({ path: shadow, fill: "rgba(120,60,80,0.18)" });
  const saucer = new Path();
  new Xf(saucer, cx, cy, s).ell(0, 18, 200, 34);
  out.push({ path: saucer, fill: linear(90, [0, "#ffffff"], [1, "#e8d9de"]), stroke: accent, strokeWidth: 3 });
  const saucerIn = new Path();
  new Xf(saucerIn, cx, cy, s).ell(0, 14, 128, 20);
  out.push({ path: saucerIn, fill: "#f4e9ee", stroke: accent, strokeWidth: 1.6, opacity: 0.9 });
  const handle = new Path();
  new Xf(handle, cx, cy, s).M(112, -100).C(205, -112, 205, -22, 96, -34);
  out.push({ path: handle, stroke: accent, strokeWidth: 22 * s });
  out.push({ path: handle, stroke: "#ffffff", strokeWidth: 15 * s });
  const body = new Path();
  new Xf(body, cx, cy, s).M(-124, -118).C(-124, -30, -80, 12, 0, 12).C(80, 12, 124, -30, 124, -118).Z();
  out.push({ path: body, fill: linear(0, [0, "#ecdde3"], [0.3, "#ffffff"], [0.75, "#fbf3f6"], [1, "#e6d3da"]), stroke: accent, strokeWidth: 3 });
  const band = new Path();
  new Xf(band, cx, cy, s).M(-118, -70).C(-90, -48, 90, -48, 118, -70);
  out.push({ path: band, stroke: accent, strokeWidth: 3 });
  const band2 = new Path();
  new Xf(band2, cx, cy, s).M(-110, -56).C(-85, -36, 85, -36, 110, -56);
  out.push({ path: band2, stroke: accent, strokeWidth: 1.6, opacity: 0.8 });
  // painted blooms
  for (const [dx, dy] of [[-62, -22], [0, -8], [62, -22]]) {
    const p = new Path();
    for (let i = 0; i < 5; i++) petal(p, cx + dx * s, cy + dy * s, (i / 5) * Math.PI * 2 - 1.57, 1, 17 * s, 7 * s, false);
    out.push({ path: p, fill: "#f6b5c4" });
    const c = new Path();
    c.circle(cx + dx * s, cy + dy * s, 4 * s);
    out.push({ path: c, fill: "#f5c96a" });
  }
  const rim = new Path();
  new Xf(rim, cx, cy, s).ell(0, -118, 124, 24);
  out.push({ path: rim, fill: "#ffffff", stroke: accent, strokeWidth: 3 });
  const rimIn = new Path();
  new Xf(rimIn, cx, cy, s).ell(0, -116, 112, 19);
  out.push({ path: rimIn, fill: linear(90, [0, "#e1b087"], [1, tea]) });
  const glint = new Path();
  new Xf(glint, cx, cy, s).M(-70, -120).Q(-30, -131, 20, -127);
  out.push({ path: glint, stroke: "rgba(255,255,255,0.6)", strokeWidth: 4, opacity: 0.8 });
  // steam
  for (const [dx, h] of [[-40, 70], [8, 90], [52, 64]]) {
    const st = new Path();
    const x0 = cx + dx * s;
    const y0 = cy - 150 * s;
    st.M(x0, y0).C(x0 - 26 * s, y0 - h * 0.3 * s, x0 + 26 * s, y0 - h * 0.6 * s, x0, y0 - h * s);
    out.push({ path: st, stroke: "rgba(150,110,130,0.45)", strokeWidth: 6 * s });
  }
  return out;
}

export function daisy(cx: number, cy: number, r: number, petalColor = "#ffffff", center = "#f5c24a", rot = 0): PartSpec[] {
  const p = new Path();
  const n = 12;
  for (let i = 0; i < n; i++) petal(p, cx, cy, rot + (i / n) * Math.PI * 2, r * 0.18, r, r * 0.13, false);
  const c = new Path();
  c.circle(cx, cy, r * 0.2);
  const dots = new Path();
  dots.circle(cx - r * 0.06, cy - r * 0.06, r * 0.05);
  return [
    { path: p, fill: petalColor, stroke: "rgba(150,90,110,0.35)", strokeWidth: 1.6 },
    { path: c, fill: linear(45, [0, "#ffd96a"], [1, center]) },
    { path: dots, fill: "rgba(255,255,255,0.7)" },
  ];
}

export function tulip(cx: number, baseY: number, h: number, color = "#f08aa6", light = "#fbc3d1", lean = 0): PartSpec[] {
  const s = h / 200;
  const stem = new Path();
  stem.M(cx, baseY).C(cx + lean * 0.4 * s, baseY - 70 * s, cx + lean * s, baseY - 120 * s, cx + lean * s, baseY - 140 * s);
  const lf = new Path();
  leaf(lf, [cx, baseY], -Math.PI / 2 - 0.45, 120 * s, 16 * s);
  leaf(lf, [cx, baseY], -Math.PI / 2 + 0.45, 105 * s, 14 * s);
  const tx = cx + lean * s;
  const ty = baseY - 135 * s;
  const cup = new Path();
  cup.M(tx - 34 * s, ty).C(tx - 44 * s, ty - 50 * s, tx - 30 * s, ty - 90 * s, tx - 14 * s, ty - 104 * s).L(tx, ty - 70 * s).L(tx + 14 * s, ty - 104 * s).C(tx + 30 * s, ty - 90 * s, tx + 44 * s, ty - 50 * s, tx + 34 * s, ty).C(tx + 16 * s, ty + 16 * s, tx - 16 * s, ty + 16 * s, tx - 34 * s, ty).Z();
  const front = new Path();
  front.M(tx - 20 * s, ty + 4 * s).C(tx - 28 * s, ty - 40 * s, tx - 10 * s, ty - 84 * s, tx, ty - 98 * s).C(tx + 10 * s, ty - 84 * s, tx + 28 * s, ty - 40 * s, tx + 20 * s, ty + 4 * s).C(tx + 8 * s, ty + 12 * s, tx - 8 * s, ty + 12 * s, tx - 20 * s, ty + 4 * s).Z();
  return [
    { path: stem, stroke: "#4d8a66", strokeWidth: 7 * s },
    { path: lf, fill: linear(45, [0, "#7fb895"], [1, "#3f7b5a"]), stroke: "rgba(0,0,0,0.15)", strokeWidth: 1.2 },
    { path: cup, fill: linear(90, [0, light], [1, color]), stroke: "rgba(120,30,60,0.3)", strokeWidth: 1.6 },
    { path: front, fill: linear(90, [0, "#ffffff"], [1, light]), opacity: 0.55 },
  ];
}

/** Soft pastel floral cluster: peonies, daisies and leaves. */
export function bloomCluster(cx: number, cy: number, s: number, flip = 1): PartSpec[] {
  const out: PartSpec[] = [];
  const a = (deg: number) => (flip === 1 ? deg : 180 - deg);
  out.push(...leafSpecs(cx, cy, [a(-170), a(-140), a(-110), a(-80), a(-30), a(10), a(40), a(160)], 200 * s, 26 * s, "#4d8a66", "#8cc3a2"));
  out.push(...leafSpecs(cx, cy, [a(-155), a(-95), a(-50), a(25), a(60)], 150 * s, 18 * s, "#6fa586", "#b5dcc3"));
  out.push(...rose(cx + 120 * s * flip, cy + 60 * s, 70 * s, PEACH, 0.4));
  out.push(...rose(cx - 20 * s * flip, cy + 120 * s, 62 * s, LILAC, 1.1));
  out.push(...rose(cx, cy, 108 * s, PEONY, 0.2));
  out.push(...daisy(cx + 140 * s * flip, cy - 70 * s, 46 * s, "#ffffff", "#f5c24a", 0.3));
  out.push(...daisy(cx - 110 * s * flip, cy - 40 * s, 38 * s, "#fff4f7", "#f5a24a", 0.1));
  out.push(...daisy(cx + 60 * s * flip, cy + 150 * s, 34 * s, "#ffffff", "#f5c24a", 0.7));
  return out;
}

/** Ring of flowers around a circle (for round photo frames). */
export function bloomWreath(cx: number, cy: number, R: number, seed = 3): PartSpec[] {
  const out: PartSpec[] = [];
  const n = 14;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    out.push(...leafSpecs(cx + Math.cos(a) * R, cy + Math.sin(a) * R, [(a * 180) / Math.PI + 90 + 35, (a * 180) / Math.PI - 90 - 35], 70, 12, "#4d8a66", "#8cc3a2"));
  }
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2 + 0.05 * seed;
    const x = cx + Math.cos(a) * R;
    const y = cy + Math.sin(a) * R;
    if (i % 3 === 0) out.push(...rose(x, y, 46, i % 2 ? PEONY : PEACH, i));
    else if (i % 3 === 1) out.push(...daisy(x, y, 30, "#ffffff", "#f5c24a", i));
    else out.push(...rose(x, y, 30, LILAC, i));
  }
  return out;
}

/** A satin ribbon banner with swallow-tail ends. */
export function ribbon(x: number, y: number, w: number, h: number, color = "#d9758f", dark = "#b4566f"): PartSpec[] {
  const t = h * 0.55;
  const main = new Path();
  main.poly([[x + t, y], [x + w - t, y], [x + w - t, y + h], [x + t, y + h]], true);
  const l = new Path();
  l.poly([[x + t + 4, y + h * 0.16], [x - 6, y + h * 0.16], [x + t * 0.45, y + h * 0.58], [x - 6, y + h], [x + t + 4, y + h]], true);
  const r = new Path();
  r.poly([[x + w - t - 4, y + h * 0.16], [x + w + 6, y + h * 0.16], [x + w - t * 0.45, y + h * 0.58], [x + w + 6, y + h], [x + w - t - 4, y + h]], true);
  const fl = new Path();
  fl.poly([[x + t, y + h], [x + t + 4, y + h * 1.14], [x + t + 4, y + h]], true);
  const fr = new Path();
  fr.poly([[x + w - t, y + h], [x + w - t - 4, y + h * 1.14], [x + w - t - 4, y + h]], true);
  const hl = new Path();
  hl.M(x + t, y + 8).L(x + w - t, y + 8);
  return [
    { path: l, fill: dark },
    { path: r, fill: dark },
    { path: main, fill: linear(90, [0, color], [1, dark]) },
    { path: hl, stroke: "rgba(255,255,255,0.35)", strokeWidth: 2 },
  ];
}

/** Scattered small confetti-blossoms. */
export function dots(seed: number, n: number, box: [number, number, number, number], colors: string[], r = 7): PartSpec[] {
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const buckets = colors.map(() => new Path());
  for (let i = 0; i < n; i++) {
    const x = box[0] + rnd() * (box[2] - box[0]);
    const y = box[1] + rnd() * (box[3] - box[1]);
    buckets[i % colors.length].circle(x, y, r * (0.5 + rnd()));
  }
  return buckets.map((p, i) => ({ path: p, fill: colors[i], opacity: 0.7 }));
}
