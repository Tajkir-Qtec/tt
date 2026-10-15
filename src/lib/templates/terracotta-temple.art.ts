import { assemble, leaf, Path, petal, rad, type OrnamentData, type PartSpec } from "../design/path";
import type { Paint } from "../design/types";

/** Speckled clay grain: many tiny irregular dots (deterministic). */
export function clayGrain(o: { w: number; h: number; color: string; count: number; seed?: number; maxR?: number }): OrnamentData {
  let s = o.seed ?? 5;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const a = new Path();
  const b = new Path();
  for (let i = 0; i < o.count; i++) {
    const r = 0.7 + rnd() * (o.maxR ?? 1.8);
    (i % 3 === 0 ? b : a).circle(rnd() * o.w, rnd() * o.h, r);
  }
  return assemble([{ path: a, fill: o.color, opacity: 0.5 }, { path: b, fill: o.color, opacity: 0.9 }], 0, { w: o.w, h: o.h });
}

/** Moulded terracotta rosette medallion. */
export function reliefRosette(o: { size: number; ink: string; fill: Paint; accent: string }): OrnamentData {
  const S = o.size;
  const c = S / 2;
  const R = S / 2 - 2;
  const outer = new Path().circle(c, c, R);
  const ring = new Path().circle(c, c, R * 0.9);
  const ring2 = new Path().circle(c, c, R * 0.56);
  const pet = new Path();
  const pet2 = new Path();
  const dots = new Path();
  for (let i = 0; i < 16; i++) {
    petal(pet, c, c, rad(-90 + (i * 360) / 16), R * 0.56, R * 0.88, R * 0.085);
    const a = rad(-90 + ((i + 0.5) * 360) / 16);
    dots.circle(c + Math.cos(a) * R * 0.76, c + Math.sin(a) * R * 0.76, R * 0.022);
  }
  for (let i = 0; i < 8; i++) petal(pet2, c, c, rad(-67.5 + (i * 360) / 8), R * 0.2, R * 0.54, R * 0.13);
  return assemble(
    [
      { path: outer, fill: o.fill, stroke: o.ink, strokeWidth: 2.4 },
      { path: ring, stroke: o.ink, strokeWidth: 1.2 },
      { path: pet, stroke: o.ink, strokeWidth: 1.4, fill: o.ink, opacity: 0.2 },
      { path: pet, stroke: o.ink, strokeWidth: 1.4 },
      { path: ring2, stroke: o.ink, strokeWidth: 1.4 },
      { path: dots, fill: o.ink },
      { path: pet2, stroke: o.ink, strokeWidth: 1.4, fill: o.accent },
      { path: new Path().circle(c, c, R * 0.15), fill: o.ink },
      { path: new Path().circle(c, c, R * 0.07), fill: o.accent },
    ],
    0,
    { w: S, h: S },
  );
}

function pointed(p: Path, x: number, y: number, w: number, h: number) {
  const sy = Math.min(h, w * 0.6);
  const cx = x + w / 2;
  p.M(x, y + h).L(x, y + sy);
  p.C(x, y + sy * 0.4, x + w * 0.3, y + sy * 0.14, cx, y);
  p.C(x + w * 0.7, y + sy * 0.14, x + w, y + sy * 0.4, x + w, y + sy);
  p.L(x + w, y + h).Z();
}

/** Five-lobed (cusped) arch recess, classic of Bishnupur panels. */
function foil(p: Path, x: number, y: number, w: number, h: number) {
  const ys = y + h * 0.42;
  const rise = [0, 0.5, 0.9, 0.9, 0.5, 0];
  const top = ys - y;
  const pts = rise.map((r, i): [number, number] => [x + (w * i) / 5, ys - r * top]);
  p.M(x, y + h).L(pts[0][0], pts[0][1]);
  for (let i = 0; i < 5; i++) {
    const [ax, ay] = pts[i];
    const [bx, by] = pts[i + 1];
    const r = Math.hypot(bx - ax, by - ay) / 2;
    p.A(r * 1.02, r * 1.02, 0, 0, 1, bx, by);
    p.include([(ax + bx) / 2, Math.min(ay, by) - r * 0.6]);
  }
  p.L(x + w, y + h).Z();
}

/** A row of cusped-arch niches between fluted pilasters. */
export function arcade(o: { w: number; n: number; h: number; ink: string; fill: Paint; recess: string }): OrnamentData {
  const bw = o.w / o.n;
  const outer = new Path();
  const rec = new Path();
  const pil = new Path();
  const caps = new Path();
  const dots = new Path();
  for (let i = 0; i < o.n; i++) {
    const x = i * bw;
    pointed(outer, x + 10, 8, bw - 20, o.h - 16);
    foil(rec, x + 22, 22, bw - 44, o.h - 38);
    dots.circle(x + bw * 0.5, 15, 2.4);
  }
  for (let i = 0; i <= o.n; i++) {
    const x = i * bw;
    pil.M(x, 0).L(x, o.h);
    pil.M(x - 4, 0).L(x - 4, o.h).M(x + 4, 0).L(x + 4, o.h);
    caps.M(x - 8, 0).L(x + 8, 0).L(x + 8, 8).L(x - 8, 8).Z();
  }
  const rules = new Path().M(0, 1).L(o.w, 1).M(0, o.h - 1).L(o.w, o.h - 1);
  const specs: PartSpec[] = [
    { path: outer, fill: o.fill, stroke: o.ink, strokeWidth: 2 },
    { path: rec, fill: o.recess, stroke: o.ink, strokeWidth: 1.6 },
    { path: pil, stroke: o.ink, strokeWidth: 1.3, opacity: 0.8 },
    { path: caps, fill: o.ink },
    { path: dots, fill: o.ink, opacity: 0.0 },
    { path: rules, stroke: o.ink, strokeWidth: 2.4 },
  ];
  return assemble(specs, 0, { w: o.w, h: o.h });
}

/** A row of small blocks ("dentils") like moulded brick teeth. */
export function dentil(o: { w: number; h: number; ink: string }): OrnamentData {
  const s = o.h;
  const n = Math.floor(o.w / (s * 1.7));
  const gap = (o.w - n * s) / Math.max(1, n - 1);
  const p = new Path();
  const q = new Path();
  for (let i = 0; i < n; i++) {
    const x = i * (s + gap);
    p.poly([[x, 0], [x + s, 0], [x + s, s], [x, s]], true);
    q.poly([[x + s * 0.28, s * 0.28], [x + s * 0.72, s * 0.28], [x + s * 0.72, s * 0.72], [x + s * 0.28, s * 0.72]], true);
  }
  return assemble([{ path: p, stroke: o.ink, strokeWidth: 1.6 }, { path: q, fill: o.ink }], 0, { w: o.w, h: o.h });
}

/** Running scroll of vine, leaves and buds, with rules above and below. */
export function vineBand(o: { w: number; h: number; ink: string; accent: string; cycle?: number }): OrnamentData {
  const n = Math.max(2, Math.round(o.w / (o.cycle ?? 96)));
  const L = o.w / n;
  const cy = o.h / 2;
  const A = o.h * 0.26;
  const vine = new Path();
  const leaves = new Path();
  const buds = new Path();
  const rules = new Path().M(0, 1).L(o.w, 1).M(0, o.h - 1).L(o.w, o.h - 1);
  for (let i = 0; i < n; i++) {
    const x = i * L;
    vine.M(x, cy).C(x + L * 0.3, cy - A * 2.1, x + L * 0.7, cy + A * 2.1, x + L, cy);
    leaf(leaves, [x + L * 0.26, cy - A * 0.9], rad(-48), A * 1.5, A * 0.34);
    leaf(leaves, [x + L * 0.74, cy + A * 0.9], rad(132), A * 1.5, A * 0.34);
    buds.circle(x + L * 0.5, cy, A * 0.3);
    buds.circle(x, cy, A * 0.2);
  }
  return assemble(
    [
      { path: rules, stroke: o.ink, strokeWidth: 1.6 },
      { path: vine, stroke: o.ink, strokeWidth: 2.2 },
      { path: leaves, fill: o.ink },
      { path: buds, fill: o.accent, stroke: o.ink, strokeWidth: 1.2 },
    ],
    0,
    { w: o.w, h: o.h },
  );
}

/** Curved Bengal hut-roof gable with kalasha finial: the classic terracotta temple profile. */
export function gable(o: { w: number; h: number; ink: string; fill: Paint; door: string }): OrnamentData {
  const { w, h } = o;
  const top = 26;
  const base = h;
  const curve = (p: Path, s: number, close: boolean) => {
    const cx = w / 2;
    const px = (x: number) => cx + (x - cx) * s;
    const py = (y: number) => base - (base - y) * s;
    p.M(px(0), py(base)).C(px(w * 0.2), py(base - 6), px(w * 0.42), py(top + (base - top) * 0.45), px(cx), py(top));
    p.C(px(w * 0.58), py(top + (base - top) * 0.45), px(w * 0.8), py(base - 6), px(w), py(base));
    if (close) p.Z();
  };
  const body = new Path();
  curve(body, 1, true);
  const lines = new Path();
  [0.82, 0.64, 0.46].forEach((s) => curve(lines, s, false));
  const fin = new Path();
  fin.M(w / 2, top).L(w / 2, 4);
  const knobs = new Path().circle(w / 2, top - 5, 5).circle(w / 2, top - 14, 3.4);
  const door = new Path();
  pointed(door, w / 2 - 22, base - 70, 44, 70);
  const slab = new Path().M(w * 0.04, base - 1).L(w * 0.96, base - 1);
  return assemble(
    [
      { path: body, fill: o.fill, stroke: o.ink, strokeWidth: 2.6 },
      { path: lines, stroke: o.ink, strokeWidth: 1.3, opacity: 0.7 },
      { path: door, fill: o.door, stroke: o.ink, strokeWidth: 1.8 },
      { path: fin, stroke: o.ink, strokeWidth: 2 },
      { path: knobs, fill: o.ink },
      { path: slab, stroke: o.ink, strokeWidth: 3 },
    ],
    0,
    { w, h: h + 2 },
  );
}
