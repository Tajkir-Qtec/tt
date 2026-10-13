import { assemble, leaf, Path, petal, type OrnamentData, type PartSpec } from "../design/path";
import { dotRing, paisleyAt, scallopRing } from "./art-utils";

export const BROWN = "#6b3010";
export const ORANGE = "#d9701c";
export const HGOLD = "#c8962e";
export const LEAF = "#2f7a4c";

const rad = (d: number) => (d * Math.PI) / 180;

/** Palm-like henna medallion: concentric paisley ring, petals, lace scallops, dotted rows and a clear centre disc. */
export function hennaMedallion(S = 580): OrnamentData {
  const c = S / 2;
  const R = S / 2 - 4;
  const specs: PartSpec[] = [];
  // warm paper ground
  specs.push({
    path: new Path().circle(c, c, R * 0.985),
    fill: { kind: "radial", stops: [[0, "#fffaf0"], [0.55, "#fbeccb"], [1, "#f1cf93"]] },
  });
  // scalloped outer edge (two weights)
  const sc1 = new Path();
  scallopRing(sc1, c, c, R * 0.985, 54, true);
  specs.push({ path: sc1, stroke: ORANGE, strokeWidth: 3.2 });
  const sc2 = new Path();
  scallopRing(sc2, c, c, R * 0.93, 54, true, rad(3));
  specs.push({ path: sc2, stroke: HGOLD, strokeWidth: 1.4 });
  // dotted rows
  const dots = new Path();
  dotRing(dots, c, c, R * 0.88, 72, 2.3);
  specs.push({ path: dots, fill: BROWN });
  specs.push({ path: new Path().circle(c, c, R * 0.855), stroke: BROWN, strokeWidth: 1.4 });
  // big paisleys
  const N = 12;
  const pa = new Path();
  const pin = new Path();
  const pd = new Path();
  const sprig = new Path();
  const sprigLeaves = new Path();
  for (let i = 0; i < N; i++) {
    const a = rad((i * 360) / N - 90);
    const r0 = R * 0.6;
    const L = R * 0.25;
    const wd = R * 0.082;
    const bx = c + Math.cos(a) * r0;
    const by = c + Math.sin(a) * r0;
    paisleyAt(pa, bx, by, a + rad(7), L, wd, 1);
    paisleyAt(pin, bx + Math.cos(a) * L * 0.12, by + Math.sin(a) * L * 0.12, a + rad(7), L * 0.62, wd * 0.5, 1);
    pd.circle(bx + Math.cos(a + rad(7)) * L * 0.2, by + Math.sin(a + rad(7)) * L * 0.2, 3.4);
    // sprig between paisleys
    const b = a + rad(180 / N) + rad(2);
    const s0: [number, number] = [c + Math.cos(b) * R * 0.6, c + Math.sin(b) * R * 0.6];
    const s1: [number, number] = [c + Math.cos(b) * R * 0.84, c + Math.sin(b) * R * 0.84];
    sprig.M(s0[0], s0[1]).L(s1[0], s1[1]);
    for (const t of [0.35, 0.65]) {
      const mx = s0[0] + (s1[0] - s0[0]) * t;
      const my = s0[1] + (s1[1] - s0[1]) * t;
      leaf(sprigLeaves, [mx, my], b + rad(50), R * 0.085, R * 0.024);
      leaf(sprigLeaves, [mx, my], b - rad(50), R * 0.085, R * 0.024);
    }
    leaf(sprigLeaves, s1, b, R * 0.08, R * 0.022);
  }
  specs.push({ path: sprigLeaves, fill: LEAF, opacity: 0.85 });
  specs.push({ path: sprig, stroke: LEAF, strokeWidth: 1.8 });
  specs.push({ path: pa, stroke: BROWN, strokeWidth: 2.8, fill: "#f3c98b" });
  specs.push({ path: pin, stroke: ORANGE, strokeWidth: 1.8 });
  specs.push({ path: pd, fill: BROWN });
  // lace scallops + rings
  specs.push({ path: new Path().circle(c, c, R * 0.585), stroke: BROWN, strokeWidth: 2.2 });
  const lace = new Path();
  scallopRing(lace, c, c, R * 0.55, 40, true);
  specs.push({ path: lace, stroke: ORANGE, strokeWidth: 1.8 });
  const lacedots = new Path();
  dotRing(lacedots, c, c, R * 0.5, 40, 1.8, rad(4.5));
  specs.push({ path: lacedots, fill: HGOLD });
  // petals
  const pet = new Path();
  const petIn = new Path();
  for (let i = 0; i < 20; i++) {
    const a = rad((i * 360) / 20 - 90);
    petal(pet, c, c, a, R * 0.36, R * 0.485, R * 0.034, true);
    petIn.M(c + Math.cos(a) * R * 0.385, c + Math.sin(a) * R * 0.385).L(c + Math.cos(a) * R * 0.44, c + Math.sin(a) * R * 0.44);
  }
  specs.push({ path: pet, stroke: BROWN, strokeWidth: 2, fill: "#f6d9a8" });
  specs.push({ path: petIn, stroke: ORANGE, strokeWidth: 1.4 });
  // centre disc (clear for names)
  specs.push({ path: new Path().circle(c, c, R * 0.345), fill: "#fffaf0" });
  specs.push({ path: new Path().circle(c, c, R * 0.345), stroke: BROWN, strokeWidth: 2.4 });
  specs.push({ path: new Path().circle(c, c, R * 0.32), stroke: HGOLD, strokeWidth: 1.2 });
  const cd = new Path();
  dotRing(cd, c, c, R * 0.332, 56, 1.1);
  specs.push({ path: cd, fill: ORANGE });
  return assemble(specs, 0, { w: S, h: S });
}

/** Full-width scalloped green band with gold henna lacework. Draw at the top; flipY for the bottom. */
export function laceBand(w = 1000, h = 150): OrnamentData {
  const specs: PartSpec[] = [];
  const n = 20;
  const r = w / n / 2;
  const sy = h - 34; // scallop baseline
  const body = new Path().M(0, 0).L(w, 0).L(w, sy);
  for (let i = 0; i < n; i++) body.A(r, r, 0, 0, 1, w - ((i + 1) * w) / n, sy);
  body.Z();
  specs.push({
    path: body,
    fill: { kind: "linear", angle: 90, stops: [[0, "#0a2f21"], [0.6, "#114a35"], [1, "#17604a"]] },
  });
  const edge = new Path().M(0, sy + 9);
  for (let i = 0; i < n; i++) edge.A(r, r, 0, 0, 0, ((i + 1) * w) / n, sy + 9);
  specs.push({ path: edge, stroke: ORANGE, strokeWidth: 2 });
  const edge2 = new Path().M(0, sy + 17);
  for (let i = 0; i < n; i++) edge2.A(r, r, 0, 0, 0, ((i + 1) * w) / n, sy + 17);
  specs.push({ path: edge2, stroke: HGOLD, strokeWidth: 1, opacity: 0.8 });
  // top lines
  specs.push({ path: new Path().M(0, 14).L(w, 14), stroke: HGOLD, strokeWidth: 1.6, lineCap: "butt" });
  specs.push({ path: new Path().M(0, 20).L(w, 20), stroke: HGOLD, strokeWidth: 0.8, lineCap: "butt", opacity: 0.7 });
  const dr = new Path();
  for (let x = 12; x < w; x += 24) dr.circle(x, 30, 1.7);
  specs.push({ path: dr, fill: "#e8c872" });
  // flowers + paisleys
  const step = 100;
  const fl = new Path();
  const flc = new Path();
  const pa = new Path();
  const pdots = new Path();
  const my = 66;
  for (let x = step / 2; x < w; x += step) {
    for (let k = 0; k < 8; k++) petal(fl, x, my, rad(k * 45), 5, 21, 4.6, true);
    flc.circle(x, my, 4.2);
    const mx = x + step / 2;
    if (mx < w) {
      paisleyAt(pa, mx, 40, Math.PI / 2, 46, 9, 1);
      pdots.circle(mx, 52, 2);
      pdots.circle(mx - 15, my - 6, 1.6).circle(mx + 15, my - 6, 1.6);
    }
  }
  specs.push({ path: fl, stroke: "#e8c872", strokeWidth: 1.5, fill: "rgba(232,200,114,0.12)" });
  specs.push({ path: flc, fill: "#f0d58a" });
  specs.push({ path: pa, stroke: "#e8c872", strokeWidth: 1.5 });
  specs.push({ path: pdots, fill: "#e8c872" });
  // inner scalloped lace row
  const ni = 40;
  const ir = w / ni / 2;
  const inner = new Path().M(0, sy - 16);
  const idots = new Path();
  for (let i = 0; i < ni; i++) {
    inner.A(ir, ir, 0, 0, 0, ((i + 1) * w) / ni, sy - 16);
    idots.circle(((i + 0.5) * w) / ni, sy - 6, 1.6);
  }
  specs.push({ path: inner, stroke: "#e8c872", strokeWidth: 1.3 });
  specs.push({ path: idots, fill: "#e8c872" });
  return assemble(specs, 0, { w, h });
}

/** A henna vine divider: wavy stem, paired leaves, dots and a central blossom. */
export function hennaVine(w = 420, color = BROWN, leafColor = LEAF, accent = ORANGE): OrnamentData {
  const h = 56;
  const cy = h / 2;
  const specs: PartSpec[] = [];
  const stem = new Path();
  const lv = new Path();
  const dts = new Path();
  const gap = 38;
  for (const sgn of [-1, 1]) {
    const start = w / 2 + sgn * gap;
    const end = sgn < 0 ? 4 : w - 4;
    const len = Math.abs(end - start);
    const segs = Math.max(2, Math.round(len / 46));
    const seg = (end - start) / segs;
    stem.M(start, cy);
    for (let i = 0; i < segs; i++) {
      const x0 = start + i * seg;
      const dir = i % 2 === 0 ? -1 : 1;
      stem.Q(x0 + seg / 2, cy + dir * 15, x0 + seg, cy);
      const lx = x0 + seg / 2;
      const ly = cy + dir * 7.5;
      leaf(lv, [lx, ly], dir < 0 ? -Math.PI / 2 + sgn * 0.5 : Math.PI / 2 + sgn * 0.5, 17, 4.4);
      dts.circle(x0 + seg, cy, 1.8);
    }
  }
  specs.push({ path: lv, fill: leafColor, opacity: 0.85 });
  specs.push({ path: stem, stroke: color, strokeWidth: 1.9 });
  specs.push({ path: dts, fill: accent });
  const fl = new Path();
  for (let k = 0; k < 8; k++) petal(fl, w / 2, cy, rad(k * 45), 5, 21, 4.6, true);
  specs.push({ path: fl, stroke: color, strokeWidth: 1.6, fill: "#f6d9a8" });
  specs.push({ path: new Path().circle(w / 2, cy, 4), fill: accent });
  return assemble(specs, 0, { w, h });
}

/** A column of henna paisleys + leaves along a vertical stem, for page edges. */
export function hennaSideVine(h = 900, color = BROWN, leafColor = LEAF, accent = ORANGE): OrnamentData {
  const w = 70;
  const cx = w / 2;
  const stem = new Path();
  const lv = new Path();
  const pa = new Path();
  const dts = new Path();
  const segs = Math.round(h / 90);
  const seg = h / segs;
  stem.M(cx, 0);
  for (let i = 0; i < segs; i++) {
    const y0 = i * seg;
    const dir = i % 2 === 0 ? -1 : 1;
    stem.Q(cx + dir * 14, y0 + seg / 2, cx, y0 + seg);
    const px = cx + dir * 8;
    const py = y0 + seg / 2;
    leaf(lv, [px, py - 14], dir < 0 ? Math.PI + 0.9 : -0.9, 24, 5.5);
    paisleyAt(pa, px, py + 4, dir < 0 ? Math.PI * 0.85 : Math.PI * 0.15, 30, 7.5, dir);
    dts.circle(cx, y0 + seg, 2.2);
  }
  return assemble(
    [
      { path: lv, fill: leafColor, opacity: 0.85 },
      { path: stem, stroke: color, strokeWidth: 2 },
      { path: pa, stroke: color, strokeWidth: 1.8, fill: "#f6d9a8" },
      { path: dts, fill: accent },
    ],
    0,
    { w, h },
  );
}
