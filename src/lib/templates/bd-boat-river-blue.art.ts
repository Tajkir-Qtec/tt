import { assemble, leaf, Path, petal, rad, type OrnamentData, type PartSpec, type Pt } from "../design/path";
import type { Paint } from "../design/types";

/* Original vector art for the "river boat blue" Bangladeshi template. */

const rnd = (seed: number) => {
  let s = seed >>> 0 || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
};

const cub = (a: Pt, c1: Pt, c2: Pt, b: Pt, t: number): Pt => {
  const u = 1 - t;
  return [
    u * u * u * a[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * b[0],
    u * u * u * a[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * b[1],
  ];
};

function ellipse(p: Path, cx: number, cy: number, rx: number, ry: number) {
  const k = 0.5523;
  p.M(cx - rx, cy)
    .C(cx - rx, cy - ry * k, cx - rx * k, cy - ry, cx, cy - ry)
    .C(cx + rx * k, cy - ry, cx + rx, cy - ry * k, cx + rx, cy)
    .C(cx + rx, cy + ry * k, cx + rx * k, cy + ry, cx, cy + ry)
    .C(cx - rx * k, cy + ry, cx - rx, cy + ry * k, cx - rx, cy)
    .Z();
}

/** Broken wavy water lines in two opacity tiers. */
export function waves(o: { w: number; h: number; rows: number; amp?: number; wl?: number; color: string; sw?: number; seed?: number }): OrnamentData {
  const r = rnd(o.seed ?? 7);
  const amp = o.amp ?? 5;
  const wl = o.wl ?? 46;
  const a = new Path();
  const b = new Path();
  const gap = (o.h - 10) / Math.max(1, o.rows - 1);
  for (let row = 0; row < o.rows; row++) {
    const y = 5 + row * gap;
    const path = row % 2 ? a : b;
    let x = r() * wl;
    while (x + wl < o.w - 4) {
      const len = wl * (0.8 + r() * 0.8);
      const n = Math.max(1, Math.round(len / wl));
      path.M(x, y);
      for (let i = 0; i < n; i++) {
        const x0 = x + (i * len) / n;
        const seg = len / n;
        path.Q(x0 + seg * 0.25, y - amp, x0 + seg * 0.5, y).Q(x0 + seg * 0.75, y + amp, x0 + seg, y);
      }
      x += len + wl * (0.5 + r() * 1.4);
    }
  }
  const specs: PartSpec[] = [
    { path: a, stroke: o.color, strokeWidth: o.sw ?? 1.8, opacity: 0.55 },
    { path: b, stroke: o.color, strokeWidth: (o.sw ?? 1.8) * 1.15, opacity: 1 },
  ];
  return assemble(specs, 0, { w: o.w, h: o.h });
}

/** Flock of distant birds. */
export function birds(color: string): OrnamentData {
  const p = new Path();
  const flock: [number, number, number][] = [
    [0, 30, 1],
    [70, 0, 0.8],
    [120, 46, 0.65],
    [190, 18, 0.9],
    [250, 54, 0.55],
    [40, 78, 0.6],
  ];
  flock.forEach(([x, y, s]) => {
    p.M(x, y).Q(x + 12 * s, y - 14 * s, x + 24 * s, y + 2 * s).Q(x + 36 * s, y - 14 * s, x + 48 * s, y);
  });
  return assemble([{ path: p, stroke: color, strokeWidth: 2.4 }], 3);
}

/** Soft puffy cloud (fill only). */
export function cloud(color: string): OrnamentData {
  const p = new Path();
  const bubbles: [number, number, number][] = [
    [70, 70, 40],
    [130, 50, 50],
    [200, 62, 44],
    [255, 78, 32],
    [40, 90, 24],
    [150, 88, 40],
  ];
  bubbles.forEach(([x, y, r]) => p.circle(x, y, r));
  const base = new Path();
  ellipse(base, 150, 100, 140, 16);
  return assemble([{ path: p, fill: color }, { path: base, fill: color }], 0, { w: 300, h: 120 });
}

/** Traditional Bengali country boat (nouka) with patchwork sail. 520 x 260. */
export function nouka(o: { hull: string; stripe: string; sails: [string, string, string]; canopy: string; line: string; pennant: string }): OrnamentData {
  const specs: PartSpec[] = [];
  // sail patches (billowing main sail)
  const A: Pt = [254, 18];
  const C1: Pt = [224, 52];
  const C2: Pt = [150, 112];
  const B: Pt = [104, 160];
  const cuts = [0, 0.26, 0.5, 0.75, 1];
  for (let i = 0; i < cuts.length - 1; i++) {
    const pts: Pt[] = [];
    for (let k = 0; k <= 6; k++) pts.push(cub(A, C1, C2, B, cuts[i] + ((cuts[i + 1] - cuts[i]) * k) / 6));
    const last = pts[pts.length - 1];
    const first = pts[0];
    const p = new Path().poly(pts).L(254, last[1]).L(254, first[1]).Z();
    specs.push({ path: p, fill: o.sails[i % 3], stroke: o.line, strokeWidth: 1.4 });
  }
  const sailLines = new Path();
  for (let i = 1; i < 4; i++) {
    const t = i / 4;
    const pt = cub(A, C1, C2, B, t);
    sailLines.M(pt[0] + 6, pt[1] + 4).L(252, pt[1] + 4);
  }
  specs.push({ path: sailLines, stroke: o.line, strokeWidth: 0.9, opacity: 0.55 });
  // jib sail
  const jib = new Path().M(262, 30).C(290, 70, 320, 118, 346, 160).L(262, 160).Z();
  specs.push({ path: jib, fill: o.sails[1], stroke: o.line, strokeWidth: 1.4 });
  const jibLines = new Path().M(262, 78).L(300, 78).M(262, 112).L(328, 112);
  specs.push({ path: jibLines, stroke: o.line, strokeWidth: 0.9, opacity: 0.55 });
  // mast + pennant
  specs.push({ path: new Path().M(258, 178).L(258, 8), stroke: o.line, strokeWidth: 4.5 });
  specs.push({ path: new Path().M(260, 8).L(292, 16).L(260, 26).Z(), fill: o.pennant });
  // canopy (chhoi)
  const can = new Path().M(376, 180).C(376, 108, 474, 108, 474, 180).Z();
  specs.push({ path: can, fill: o.canopy, stroke: o.line, strokeWidth: 2 });
  const weave = new Path();
  for (let x = 388; x <= 462; x += 12) {
    const dx = (x - 425) / 49;
    const y = 180 - 62 * Math.sqrt(Math.max(0, 1 - dx * dx)) * 0.95;
    weave.M(x, 180).L(x, y + 6);
  }
  weave.M(380, 150).L(470, 150).M(392, 128).L(458, 128);
  specs.push({ path: weave, stroke: o.line, strokeWidth: 1, opacity: 0.6 });
  // hull
  const hull = new Path()
    .M(14, 118)
    .Q(90, 172, 260, 174)
    .Q(430, 172, 506, 94)
    .Q(476, 226, 260, 230)
    .Q(52, 226, 14, 118)
    .Z();
  specs.push({ path: hull, fill: o.hull, stroke: o.line, strokeWidth: 2 });
  const band = new Path().M(22, 134).Q(96, 184, 260, 186).Q(420, 184, 494, 112);
  specs.push({ path: band, stroke: o.stripe, strokeWidth: 4 });
  const plank = new Path().M(42, 160).Q(120, 206, 260, 208).Q(400, 206, 470, 144);
  specs.push({ path: plank, stroke: o.stripe, strokeWidth: 1.4, opacity: 0.7 });
  const dots = new Path();
  for (let i = 0; i < 9; i++) {
    const t = (i + 0.5) / 9;
    const x = 54 + t * 400;
    const y = 190 + Math.sin(t * Math.PI) * 14 - 2;
    dots.circle(x, y + 8 - Math.abs(t - 0.5) * 30, 2.2);
  }
  specs.push({ path: dots, fill: o.stripe, opacity: 0.85 });
  // rudder oar
  specs.push({ path: new Path().M(492, 120).L(512, 214), stroke: o.line, strokeWidth: 4 });
  specs.push({ path: new Path().M(506, 190).L(526, 196).L(518, 232).L(508, 220).Z(), fill: o.hull, stroke: o.line, strokeWidth: 1.6 });
  return assemble(specs, 0, { w: 536, h: 260 });
}

/** Shapla (water lily) on its pad. 320 x 210. */
export function shapla(o: { petal: Paint; petalBack: Paint; stroke: string; pad: string; padStroke: string; stamen: string }): OrnamentData {
  const cx = 160;
  const by = 160;
  const specs: PartSpec[] = [];
  const pad = new Path();
  ellipse(pad, cx, 182, 150, 24);
  specs.push({ path: pad, fill: o.pad, stroke: o.padStroke, strokeWidth: 2 });
  const notch = new Path().M(cx, 182).L(cx + 150, 176);
  specs.push({ path: notch, stroke: o.padStroke, strokeWidth: 1.2, opacity: 0.8 });
  const pad2 = new Path().M(cx - 100, 182).L(cx - 20, 184).M(cx + 40, 192).L(cx + 110, 188);
  specs.push({ path: pad2, stroke: o.padStroke, strokeWidth: 1, opacity: 0.6 });
  const back: [number, number][] = [[-74, 104], [-38, 124], [0, 134], [38, 124], [74, 104]];
  back.forEach(([a, len]) => {
    const p = new Path();
    petal(p, cx, by, rad(-90 + a), 6, len, len * 0.15);
    specs.push({ path: p, fill: o.petalBack, stroke: o.stroke, strokeWidth: 2 });
    const v = new Path().M(cx + Math.cos(rad(-90 + a)) * 30, by + Math.sin(rad(-90 + a)) * 30).L(cx + Math.cos(rad(-90 + a)) * len * 0.7, by + Math.sin(rad(-90 + a)) * len * 0.7);
    specs.push({ path: v, stroke: o.stroke, strokeWidth: 0.9, opacity: 0.5 });
  });
  const stam = new Path();
  const tips = new Path();
  for (let i = -5; i <= 5; i++) {
    const a = rad(-90 + i * 8);
    const l = 44 - Math.abs(i) * 2;
    stam.M(cx, by + 2).L(cx + Math.cos(a) * l, by + Math.sin(a) * l);
    tips.circle(cx + Math.cos(a) * l, by + Math.sin(a) * l, 3);
  }
  specs.push({ path: stam, stroke: o.stamen, strokeWidth: 1.4 });
  specs.push({ path: tips, fill: o.stamen });
  const front: [number, number][] = [[-96, 92], [-62, 108], [-26, 116], [26, 116], [62, 108], [96, 92]];
  front.forEach(([a, len]) => {
    const p = new Path();
    petal(p, cx, by + 6, rad(-90 + a), 6, len, len * 0.17);
    specs.push({ path: p, fill: o.petal, stroke: o.stroke, strokeWidth: 2 });
    const v = new Path().M(cx + Math.cos(rad(-90 + a)) * 30, by + 6 + Math.sin(rad(-90 + a)) * 30).L(cx + Math.cos(rad(-90 + a)) * len * 0.7, by + 6 + Math.sin(rad(-90 + a)) * len * 0.7);
    specs.push({ path: v, stroke: o.stroke, strokeWidth: 0.9, opacity: 0.5 });
  });
  return assemble(specs, 0, { w: 320, h: 210 });
}

/** A clump of kaash grass with feathery white plumes. 280 x 560. */
export function kaash(o: { stalk: string; plume: string; blade: string; seed?: number; count?: number }): OrnamentData {
  const r = rnd(o.seed ?? 11);
  const n = o.count ?? 8;
  const stalks = new Path();
  const plumes = new Path();
  const fluff = new Path();
  const blades = new Path();
  const baseY = 560;
  for (let i = 0; i < n; i++) {
    const bx = 70 + (i / (n - 1)) * 130 + (r() - 0.5) * 24;
    const hgt = 330 + r() * 200 - Math.abs(i - n / 2) * 12;
    const dx = (i - (n - 1) / 2) * 24 + (r() - 0.5) * 30;
    const A: Pt = [bx, baseY];
    const Cc: Pt = [bx + dx * 0.15, baseY - hgt * 0.6];
    const B: Pt = [bx + dx, baseY - hgt];
    stalks.M(A[0], A[1]).Q(Cc[0], Cc[1], B[0], B[1]);
    const at = (t: number): Pt => {
      const u = 1 - t;
      return [u * u * A[0] + 2 * u * t * Cc[0] + t * t * B[0], u * u * A[1] + 2 * u * t * Cc[1] + t * t * B[1]];
    };
    const tan = (t: number): number => {
      const dxx = 2 * (1 - t) * (Cc[0] - A[0]) + 2 * t * (B[0] - Cc[0]);
      const dyy = 2 * (1 - t) * (Cc[1] - A[1]) + 2 * t * (B[1] - Cc[1]);
      return Math.atan2(dyy, dxx);
    };
    const pl = hgt * 0.34;
    const steps = Math.round(pl / 5);
    for (let k = 0; k < steps; k++) {
      const t = 0.62 + (0.38 * k) / steps;
      const P = at(t);
      const ang = tan(t);
      const taper = 1 - (k / steps) * 0.78;
      for (const s of [-1, 1]) {
        const a2 = ang + s * rad(24 + r() * 22);
        const len = (30 + r() * 20) * taper;
        const e: Pt = [P[0] + Math.cos(a2) * len, P[1] + Math.sin(a2) * len];
        plumes.M(P[0], P[1]).Q(P[0] + Math.cos(a2) * len * 0.5 + (r() - 0.5) * 6, P[1] + Math.sin(a2) * len * 0.5, e[0], e[1]);
      }
    }
    const mid = at(0.84);
    leaf(fluff, mid, tan(0.84) + Math.PI, -pl * 0.9, 13);
    leaf(fluff, at(0.7), tan(0.7) + Math.PI, -pl * 0.55, 9);
  }
  for (let i = 0; i < 9; i++) {
    const bx = 56 + i * 20 + (r() - 0.5) * 10;
    leaf(blades, [bx, baseY], rad(-90 + (i - 4) * 9), 120 + r() * 60, 5);
  }
  const specs: PartSpec[] = [
    { path: blades, fill: o.blade, opacity: 0.9 },
    { path: stalks, stroke: o.stalk, strokeWidth: 2 },
    { path: fluff, fill: o.plume, opacity: 0.4 },
    { path: plumes, stroke: o.plume, strokeWidth: 1.7 },
  ];
  return assemble(specs, 0, { w: 280, h: 560 });
}

/** Small decorative rosette-of-waves emblem for dividers. */
export function waveDivider(color: string, w = 360): OrnamentData {
  const p = new Path();
  const n = 9;
  const step = w / n;
  for (let row = 0; row < 3; row++) {
    const y = 6 + row * 9;
    const inset = row * 36;
    p.M(inset, y);
    const m = Math.max(1, Math.round((w - inset * 2) / step));
    const s = (w - inset * 2) / m;
    for (let i = 0; i < m; i++) p.Q(inset + i * s + s * 0.25, y - 6, inset + i * s + s * 0.5, y).Q(inset + i * s + s * 0.75, y + 6, inset + (i + 1) * s, y);
  }
  return assemble([{ path: p, stroke: color, strokeWidth: 1.6 }], 3);
}
