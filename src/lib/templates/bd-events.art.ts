import { assemble, leaf, Path, petal, rad, type OrnamentData, type PartSpec, type Pt } from "../design/path";
import type { Paint } from "../design/types";

/* Shared procedural art for the Bangladeshi wedding-event series (mehendi, reception, walima, letter). */

export function rng(seed: number) {
  let s = (seed >>> 0) || 1;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Local-frame path writer: origin (x,y), rotation a (radians), scale s. Local "up" is -v. */
export class Tx {
  constructor(
    public p: Path,
    public x = 0,
    public y = 0,
    public a = 0,
    public s = 1,
    public fx = false,
  ) {}
  pt(u: number, v: number): Pt {
    if (this.fx) u = -u;
    const c = Math.cos(this.a);
    const sn = Math.sin(this.a);
    return [this.x + this.s * (c * u - sn * v), this.y + this.s * (sn * u + c * v)];
  }
  M(u: number, v: number) {
    const [a, b] = this.pt(u, v);
    this.p.M(a, b);
    return this;
  }
  L(u: number, v: number) {
    const [a, b] = this.pt(u, v);
    this.p.L(a, b);
    return this;
  }
  C(a1: number, b1: number, a2: number, b2: number, u: number, v: number) {
    const p1 = this.pt(a1, b1);
    const p2 = this.pt(a2, b2);
    const p3 = this.pt(u, v);
    this.p.C(p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]);
    return this;
  }
  Z() {
    this.p.Z();
    return this;
  }
  circle(u: number, v: number, r: number) {
    const [a, b] = this.pt(u, v);
    this.p.circle(a, b, r * this.s);
    return this;
  }
}

/* ------------------------------------------------------------------ */
/* Mehndi motifs                                                        */
/* ------------------------------------------------------------------ */

/** Boteh (paisley) outline in a Tx frame, unit height 1. */
function botehOutline(t: Tx, k = 1) {
  t.M(0, 0)
    .C(-0.52 * k, -0.04, -0.64 * k, -0.56, -0.24 * k, -0.82)
    .C(-0.06 * k, -0.94, 0.16 * k, -1.02, 0.38 * k, -0.9)
    .C(0.2 * k, -0.9, 0.18 * k, -0.74, 0.3 * k, -0.58)
    .C(0.54 * k, -0.3, 0.48 * k, -0.02, 0, 0)
    .Z();
}

export function botehSpecs(
  x: number,
  y: number,
  size: number,
  rot: number,
  o: { fill?: Paint | null; stroke: string; sw?: number; accent?: string; flip?: boolean; detail?: boolean },
): PartSpec[] {
  const sw = o.sw ?? 2;
  const body = new Path();
  botehOutline(new Tx(body, x, y, rot, size, o.flip));
  const specs: PartSpec[] = [{ path: body, fill: o.fill ?? null, stroke: o.stroke, strokeWidth: sw }];
  if (o.detail !== false) {
    const inner = new Path();
    botehOutline(new Tx(inner, x, y - size * 0.07, rot, size * 0.66, o.flip), 0.9);
    specs.push({ path: inner, stroke: o.stroke, strokeWidth: sw * 0.7, fill: null });
    const dots = new Path();
    const t = new Tx(dots, x, y, rot, size, o.flip);
    t.circle(-0.12, -0.5, 0.035).circle(-0.12, -0.38, 0.03).circle(-0.12, -0.28, 0.025);
    specs.push({ path: dots, fill: o.accent ?? o.stroke });
  }
  return specs;
}

/** Decorated hand (palm facing viewer, right hand, thumb on the left). 400 x 600 viewbox. */
export function hand(o: { skin: Paint; henna: string; bangle: Paint; bangleEdge: string; shade?: string }): OrnamentData {
  const specs: PartSpec[] = [];
  type F = { bx: number; by: number; ang: number; len: number; w: number };
  const fingers: F[] = [
    { bx: 124, by: 318, ang: rad(-6), len: 176, w: 50 },
    { bx: 175, by: 312, ang: rad(-1.5), len: 198, w: 52 },
    { bx: 227, by: 314, ang: rad(3.5), len: 180, w: 50 },
    { bx: 277, by: 322, ang: rad(9), len: 142, w: 44 },
  ];
  const thumb: F = { bx: 104, by: 440, ang: rad(-44), len: 176, w: 58 };
  const capsule = (p: Path, f: F, len = f.len, off = 0) => {
    const dx = Math.sin(f.ang);
    const dy = -Math.cos(f.ang);
    const nx = Math.cos(f.ang);
    const ny = Math.sin(f.ang);
    const b: Pt = [f.bx + dx * off, f.by + dy * off];
    const hw = f.w / 2;
    const bl: Pt = [b[0] - nx * hw, b[1] - ny * hw];
    const br: Pt = [b[0] + nx * hw, b[1] + ny * hw];
    const tl: Pt = [bl[0] + dx * (len - hw), bl[1] + dy * (len - hw)];
    const tr: Pt = [br[0] + dx * (len - hw), br[1] + dy * (len - hw)];
    p.M(bl[0], bl[1]).L(tl[0], tl[1]).A(hw, hw, 0, 0, 1, tr[0], tr[1]).L(br[0], br[1]).Z();
    p.include([tl[0] + dx * hw, tl[1] + dy * hw]);
  };
  const sil = new Path();
  sil
    .M(92, 306)
    .L(308, 306)
    .C(316, 410, 306, 476, 266, 526)
    .L(264, 600)
    .L(136, 600)
    .L(134, 526)
    .C(94, 476, 86, 410, 92, 306)
    .Z();
  const parts: Path[] = [sil, new Path().circle(112, 420, 56)];
  [...fingers, thumb].forEach((f) => {
    const q = new Path();
    capsule(q, f);
    parts.push(q);
  });
  parts.forEach((pp) => specs.push({ path: pp, fill: o.skin }));
  // soft palm shade
  if (o.shade) {
    const sh = new Path();
    sh.M(300, 330).C(312, 420, 300, 480, 262, 526).L(250, 526).C(284, 470, 296, 410, 286, 330).Z();
    specs.push({ path: sh, fill: o.shade, opacity: 0.35 });
  }
  const line = new Path();
  const dots = new Path();
  const solid = new Path();
  // palm medallion
  const cx = 200;
  const cy = 424;
  line.circle(cx, cy, 66).circle(cx, cy, 50).circle(cx, cy, 20);
  for (let i = 0; i < 12; i++) {
    petal(line, cx, cy, rad(-90 + i * 30), 22, 48, 8);
    petal(line, cx, cy, rad(-75 + i * 30), 52, 80, 6.5);
  }
  for (let i = 0; i < 24; i++) {
    const a = rad(i * 15);
    dots.circle(cx + Math.cos(a) * 91, cy + Math.sin(a) * 91, 2.2);
  }
  solid.circle(cx, cy, 8);
  // vine to wrist
  line.M(200, 500).C(186, 520, 214, 540, 200, 566);
  [
    [-1, 514],
    [1, 530],
    [-1, 546],
  ].forEach(([side, yy]) => leaf(line, [200 + (side === -1 ? -3 : 3), yy], rad(side === -1 ? 200 : -20), 24, 6));
  // fingers: centreline, diamonds, fingertip dip
  const addFinger = (f: F, tipDip: number, step: number) => {
    const dx = Math.sin(f.ang);
    const dy = -Math.cos(f.ang);
    const nx = Math.cos(f.ang);
    const ny = Math.sin(f.ang);
    const at = (d: number, s = 0): Pt => [f.bx + dx * d + nx * s, f.by + dy * d + ny * s];
    const a = at(12);
    const b = at(f.len - tipDip - 10);
    line.M(a[0], a[1]).L(b[0], b[1]);
    for (let d = 26; d < f.len - tipDip - 14; d += step) {
      const hw = f.w * 0.3;
      const p0 = at(d - step * 0.32);
      const p1 = at(d, hw);
      const p2 = at(d + step * 0.32);
      const p3 = at(d, -hw);
      line.poly([p0, p1, p2, p3], true);
      const c = at(d);
      dots.circle(c[0], c[1], 1.8);
    }
    capsule(solid, f, tipDip, f.len - tipDip);
  };
  fingers.forEach((f, i) => addFinger(f, 34 - i * 2, 26));
  addFinger(thumb, 34, 26);
  specs.push({ path: line, stroke: o.henna, strokeWidth: 2.2, lineJoin: "round" });
  specs.push({ path: dots, fill: o.henna });
  specs.push({ path: solid, fill: o.henna, opacity: 0.92 });
  // bangles
  [548, 574].forEach((yy, i) => {
    const b = new Path();
    b.M(130, yy).L(270, yy).L(272, yy + 18).L(128, yy + 18).Z();
    specs.push({ path: b, fill: o.bangle, stroke: o.bangleEdge, strokeWidth: 1.4 });
    const bd = new Path();
    for (let x = 142; x < 262; x += 14) bd.circle(x, yy + 9, i === 0 ? 2.2 : 1.6);
    specs.push({ path: bd, fill: o.bangleEdge, opacity: 0.8 });
  });
  return assemble(specs, 2, { w: 400, h: 600 });
}

/** Round mehndi medallion: rings, petals, boteh ring, dots. S x S. */
export function mehndiMedallion(o: { size: number; color: string; accent: string; fill?: Paint | null; sw?: number }): OrnamentData {
  const S = o.size;
  const c = S / 2;
  const sw = o.sw ?? 2.4;
  const specs: PartSpec[] = [];
  const R = S / 2 - 6;
  const ring = (r: number, w: number, fill?: Paint | null) =>
    specs.push({ path: new Path().circle(c, c, r), stroke: o.color, strokeWidth: w, fill: fill ?? null });
  ring(R, sw * 1.3, o.fill ?? null);
  ring(R * 0.97 - 6, sw * 0.5);
  // boteh ring
  const n = 12;
  for (let i = 0; i < n; i++) {
    const th = (i * 2 * Math.PI) / n;
    const r0 = R * 0.62;
    specs.push(
      ...botehSpecs(c + Math.sin(th) * r0, c - Math.cos(th) * r0, R * 0.3, th, { stroke: o.color, sw: sw * 0.8, accent: o.accent, detail: i % 1 === 0 }),
    );
  }
  ring(R * 0.62, sw * 0.5);
  // petal rows
  const pet = new Path();
  for (let i = 0; i < 16; i++) petal(pet, c, c, rad(-90 + i * 22.5), R * 0.14, R * 0.46, R * 0.075);
  specs.push({ path: pet, stroke: o.color, strokeWidth: sw * 0.8 });
  const pet2 = new Path();
  for (let i = 0; i < 8; i++) petal(pet2, c, c, rad(-90 + i * 45), R * 0.04, R * 0.2, R * 0.06);
  specs.push({ path: pet2, fill: o.accent, stroke: o.color, strokeWidth: sw * 0.6 });
  const dots = new Path();
  for (let i = 0; i < 48; i++) {
    const a = rad(i * 7.5);
    dots.circle(c + Math.cos(a) * R * 0.915, c + Math.sin(a) * R * 0.915, i % 2 ? 1.5 : 2.4);
  }
  specs.push({ path: dots, fill: o.color });
  return assemble(specs, 0, { w: S, h: S });
}

/** Horizontal row of boteh with dots and a rule. */
export function botehBand(o: { len: number; stroke: string; fill: Paint; accent: string; size?: number }): OrnamentData {
  const size = o.size ?? 64;
  const step = size * 0.95;
  const n = Math.max(2, Math.floor(o.len / step));
  const gap = o.len / n;
  const specs: PartSpec[] = [];
  const base = size + 8;
  const rule = new Path().M(0, base + 8).L(o.len, base + 8);
  specs.push({ path: rule, stroke: o.stroke, strokeWidth: 1.6 });
  const dots = new Path();
  for (let i = 0; i < n; i++) {
    const x = gap * (i + 0.5);
    const flip = i % 2 === 1;
    specs.push(...botehSpecs(x, base, size, flip ? rad(8) : rad(-8), { fill: i % 2 ? o.fill : null, stroke: o.stroke, sw: 2, accent: o.accent, flip }));
    dots.circle(x + gap / 2, base - size * 0.35, 3);
    dots.circle(x + gap / 2, base - size * 0.6, 2);
  }
  specs.push({ path: dots, fill: o.accent });
  return assemble(specs, 2, { w: o.len, h: base + 14 });
}

/** Wavy vine with alternating leaves and berries. */
export function vineBand(o: { len: number; stroke: string; leafFill: string; accent: string; amp?: number; step?: number }): OrnamentData {
  const amp = o.amp ?? 12;
  const step = o.step ?? 60;
  const n = Math.max(2, Math.round(o.len / step));
  const sx = o.len / n;
  const h = amp * 2 + 70;
  const mid = h / 2;
  const vine = new Path().M(0, mid);
  const leaves = new Path();
  const berries = new Path();
  for (let i = 0; i < n; i++) {
    const dir = i % 2 === 0 ? -1 : 1;
    vine.Q(sx * (i + 0.5), mid + dir * amp * 2, sx * (i + 1), mid);
    const x = sx * (i + 0.5);
    const y = mid + dir * amp;
    leaf(leaves, [x, y], rad(dir === -1 ? -80 : 80), 30, 8);
    leaf(leaves, [x - sx * 0.2, y], rad(dir === -1 ? -140 : 140), 22, 6);
    leaf(leaves, [x + sx * 0.2, y], rad(dir === -1 ? -40 : 40), 22, 6);
    berries.circle(x, y + dir * 36, 3.2);
  }
  return assemble(
    [
      { path: vine, stroke: o.stroke, strokeWidth: 2.4 },
      { path: leaves, fill: o.leafFill, stroke: o.stroke, strokeWidth: 1 },
      { path: berries, fill: o.accent },
    ],
    0,
    { w: o.len, h },
  );
}

/* ------------------------------------------------------------------ */
/* Reception: chandelier                                                */
/* ------------------------------------------------------------------ */

function drop(p: Path, x: number, y: number, r: number) {
  p.M(x, y)
    .C(x + r * 1.1, y + r * 1.3, x + r * 0.9, y + r * 2.6, x, y + r * 3)
    .C(x - r * 0.9, y + r * 2.6, x - r * 1.1, y + r * 1.3, x, y)
    .Z();
}

export function chandelier(o: { stroke: string; metal: Paint; crystal: string; flame: string; glow?: string }): OrnamentData {
  const cx = 300;
  const specs: PartSpec[] = [];
  const arms = new Path();
  const cups = new Path();
  const candles = new Path();
  const flames = new Path();
  const crystals = new Path();
  const chains = new Path();
  // chain and canopy
  chains.M(cx, 0).L(cx, 74);
  const canopy = new Path().M(cx - 22, 74).L(cx + 22, 74).L(cx + 12, 90).L(cx - 12, 90).Z();
  // stem beads
  const stem = new Path().M(cx, 90).L(cx, 330);
  const beads = new Path();
  const rs = [9, 13, 17, 21, 24, 21, 17, 13, 9];
  rs.forEach((r, i) => beads.circle(cx, 112 + i * 24, r));
  const tiers = [
    { y: 128, dx: 96 },
    { y: 196, dx: 176 },
    { y: 268, dx: 262 },
  ];
  tiers.forEach(({ y, dx }) => {
    [-1, 1].forEach((sd) => {
      const ex = cx + sd * dx;
      const ey = y + 18;
      const bz = (t: number): Pt => {
        const p0: Pt = [cx, y];
        const p1: Pt = [cx + sd * dx * 0.1, y + 82];
        const p2: Pt = [ex, y + 96];
        const p3: Pt = [ex, ey];
        const u = 1 - t;
        return [
          u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
          u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
        ];
      };
      arms.M(cx, y).C(cx + sd * dx * 0.1, y + 82, ex, y + 96, ex, ey);
      // scroll curl at the stem
      arms.M(cx, y + 18).C(cx + sd * 40, y + 30, cx + sd * 44, y + 62, cx + sd * 22, y + 60);
      // cup, candle, flame
      cups.M(ex - 15, ey).L(ex + 15, ey).L(ex + 9, ey + 14).L(ex - 9, ey + 14).Z();
      candles.M(ex - 5, ey).L(ex + 5, ey).L(ex + 5, ey - 36).L(ex - 5, ey - 36).Z();
      flames.M(ex, ey - 62).C(ex + 9, ey - 50, ex + 7, ey - 40, ex, ey - 38).C(ex - 7, ey - 40, ex - 9, ey - 50, ex, ey - 62).Z();
      // hanging crystals
      [0.22, 0.4, 0.58, 0.76].forEach((t, k) => {
        const [px, py] = bz(t);
        const L = 12 + (k % 2) * 12;
        chains.M(px, py).L(px, py + L);
        drop(crystals, px, py + L, 5.4);
      });
    });
  });
  // bottom finial
  chains.M(cx, 330).L(cx, 350);
  drop(crystals, cx, 350, 13);
  [-1, 1].forEach((sd) => {
    chains.M(cx, 300).L(cx + sd * 34, 330);
    drop(crystals, cx + sd * 34, 330, 7);
  });
  if (o.glow) {
    const gl = new Path();
    tiers.forEach(({ y, dx }) =>
      [-1, 1].forEach((sd) => {
        gl.circle(cx + sd * dx, y - 28, 26);
      }),
    );
    specs.push({ path: gl, fill: o.glow, opacity: 0.16 });
  }
  specs.push({ path: chains, stroke: o.stroke, strokeWidth: 1.4 });
  specs.push({ path: stem, stroke: o.stroke, strokeWidth: 3 });
  specs.push({ path: arms, stroke: o.stroke, strokeWidth: 3.2 });
  specs.push({ path: canopy, fill: o.metal, stroke: o.stroke, strokeWidth: 1.2 });
  specs.push({ path: beads, fill: o.metal, stroke: o.stroke, strokeWidth: 1.2 });
  specs.push({ path: cups, fill: o.metal, stroke: o.stroke, strokeWidth: 1.2 });
  specs.push({ path: candles, fill: "#fbf3df", stroke: o.stroke, strokeWidth: 1 });
  specs.push({ path: flames, fill: o.flame });
  specs.push({ path: crystals, fill: o.crystal, stroke: o.stroke, strokeWidth: 1 });
  return assemble(specs, 6);
}

/** Concentric stepped-arch lines (deco window) in a w x h box. */
export function archSteps(o: { w: number; h: number; stroke: string; n?: number; gap?: number; sw?: number }): OrnamentData {
  const n = o.n ?? 5;
  const gap = o.gap ?? 12;
  const specs: PartSpec[] = [];
  for (let i = 0; i < n; i++) {
    const inset = i * gap + 1;
    const w = o.w - inset * 2;
    const h = o.h - inset;
    const r = w / 2;
    const p = new Path();
    p.M(inset, o.h).L(inset, inset + r).A(r, r, 0, 0, 1, inset + w, inset + r).L(inset + w, o.h);
    p.include([inset + r, inset]);
    specs.push({ path: p, stroke: o.stroke, strokeWidth: (o.sw ?? 2) * (1 - i * 0.12), opacity: 1 - i * 0.08 });
    void h;
  }
  return assemble(specs, 0, { w: o.w, h: o.h });
}

/** Rays + bubbles style sprinkle: scattered champagne bubbles. */
export function bubbles(o: { w: number; h: number; n: number; color: string; seed?: number; max?: number }): OrnamentData {
  const r = rng(o.seed ?? 7);
  const ring = new Path();
  const fillP = new Path();
  for (let i = 0; i < o.n; i++) {
    const x = r() * o.w;
    const y = r() * o.h;
    const rr = 2 + Math.pow(r(), 2.2) * (o.max ?? 12);
    if (r() > 0.4) ring.circle(x, y, rr);
    else fillP.circle(x, y, rr * 0.45);
  }
  return assemble(
    [
      { path: ring, stroke: o.color, strokeWidth: 1.2 },
      { path: fillP, fill: o.color },
    ],
    0,
    { w: o.w, h: o.h },
  );
}

/* ------------------------------------------------------------------ */
/* Walima: khatam star + floral geometry                                */
/* ------------------------------------------------------------------ */

export function khatam(o: { size: number; stroke: string; fill?: Paint | null; accent: string; petalFill?: Paint | null; sw?: number }): OrnamentData {
  const S = o.size;
  const c = S / 2;
  const R = S / 2 - 4;
  const sw = o.sw ?? 2.4;
  const specs: PartSpec[] = [];
  // petals between star points (floral)
  const pet = new Path();
  for (let i = 0; i < 8; i++) petal(pet, c, c, rad(-90 + i * 45 + 22.5), R * 0.5, R, R * 0.12);
  specs.push({ path: pet, fill: o.petalFill ?? null, stroke: o.stroke, strokeWidth: sw * 0.8 });
  const star = new Path();
  const pts: Pt[] = [];
  for (let i = 0; i < 16; i++) {
    const a = rad(-90 + i * 22.5);
    const r = i % 2 === 0 ? R * 0.82 : R * 0.82 * 0.7654;
    pts.push([c + Math.cos(a) * r, c + Math.sin(a) * r]);
  }
  star.poly(pts, true);
  specs.push({ path: star, fill: o.fill ?? null, stroke: o.stroke, strokeWidth: sw, lineJoin: "miter" });
  const star2 = new Path();
  star2.poly(pts.map(([x, y]) => [c + (x - c) * 0.58, c + (y - c) * 0.58] as Pt), true);
  specs.push({ path: star2, stroke: o.stroke, strokeWidth: sw * 0.6, lineJoin: "miter" });
  const inner = new Path();
  for (let i = 0; i < 8; i++) petal(inner, c, c, rad(-90 + i * 45), R * 0.04, R * 0.3, R * 0.07);
  specs.push({ path: inner, fill: o.accent, stroke: o.stroke, strokeWidth: sw * 0.5 });
  const dots = new Path();
  for (let i = 0; i < 8; i++) {
    const a = rad(-90 + i * 45 + 22.5);
    dots.circle(c + Math.cos(a) * R * 0.5, c + Math.sin(a) * R * 0.5, 3);
    const b = rad(-90 + i * 45);
    dots.circle(c + Math.cos(b) * R * 0.9, c + Math.sin(b) * R * 0.9, 2.2);
  }
  specs.push({ path: dots, fill: o.stroke });
  return assemble(specs, 0, { w: S, h: S });
}

/** Row of small crescents and dots. */
export function crescentRow(o: { len: number; color: string; size?: number }): OrnamentData {
  const s = o.size ?? 22;
  const n = Math.max(2, Math.floor(o.len / (s * 2.4)));
  const gap = o.len / n;
  const p = new Path();
  const d = new Path();
  for (let i = 0; i < n; i++) {
    const x = gap * (i + 0.5);
    const R = s / 2;
    const r = R * 0.8;
    const dd = R * 0.38;
    const xx = (R * R - r * r + dd * dd) / (2 * dd);
    const yy = Math.sqrt(Math.max(0, R * R - xx * xx));
    p.M(x + xx - R * 0.3, s / 2 - yy).A(R, R, 0, 1, 0, x + xx - R * 0.3, s / 2 + yy).A(r, r, 0, 1, 1, x + xx - R * 0.3, s / 2 - yy).Z();
    d.circle(x + gap / 2, s / 2, 2);
  }
  p.include([0, 0], [o.len, s]);
  return assemble([{ path: p, fill: o.color }, { path: d, fill: o.color }], 0, { w: o.len, h: s });
}

/* ------------------------------------------------------------------ */
/* Letter: paper texture, stamp seal, postage stamp                     */
/* ------------------------------------------------------------------ */

export function speckle(o: { w: number; h: number; n: number; color: string; seed?: number; fibres?: number }): OrnamentData {
  const r = rng(o.seed ?? 3);
  const dots = new Path();
  for (let i = 0; i < o.n; i++) dots.circle(r() * o.w, r() * o.h, 0.5 + r() * 1.3);
  const fib = new Path();
  for (let i = 0; i < (o.fibres ?? 90); i++) {
    const x = r() * o.w;
    const y = r() * o.h;
    const a = r() * Math.PI * 2;
    const L = 8 + r() * 22;
    fib.M(x, y).Q(x + Math.cos(a) * L * 0.5 + (r() - 0.5) * 8, y + Math.sin(a) * L * 0.5 + (r() - 0.5) * 8, x + Math.cos(a) * L, y + Math.sin(a) * L);
  }
  dots.include([0, 0], [o.w, o.h]);
  return assemble([{ path: dots, fill: o.color, opacity: 0.55 }, { path: fib, stroke: o.color, strokeWidth: 0.7, opacity: 0.35 }], 0, { w: o.w, h: o.h });
}

/** Broken ring arcs, like an ink stamp that has been pressed unevenly. */
function brokenRing(p: Path, cx: number, cy: number, r: number, seed: number, gaps = 5) {
  const rnd = rng(seed);
  const cuts: [number, number][] = [];
  for (let i = 0; i < gaps; i++) {
    const a = (i / gaps) * 360 + rnd() * 40;
    cuts.push([a, a + 3 + rnd() * 7]);
  }
  cuts.sort((a, b) => a[0] - b[0]);
  for (let i = 0; i < cuts.length; i++) {
    const a0 = cuts[i][1];
    const a1 = i + 1 < cuts.length ? cuts[i + 1][0] : cuts[0][0] + 360;
    const P0: Pt = [cx + Math.cos(rad(a0)) * r, cy + Math.sin(rad(a0)) * r];
    const P1: Pt = [cx + Math.cos(rad(a1)) * r, cy + Math.sin(rad(a1)) * r];
    p.M(P0[0], P0[1]).A(r, r, 0, a1 - a0 > 180 ? 1 : 0, 1, P1[0], P1[1]);
  }
  p.include([cx - r, cy - r], [cx + r, cy + r]);
}

export function stampSeal(o: { size: number; color: string; seed?: number }): OrnamentData {
  const S = o.size;
  const c = S / 2;
  const R = S / 2 - 4;
  const specs: PartSpec[] = [];
  const outer = new Path();
  brokenRing(outer, c, c, R, (o.seed ?? 11) + 1, 4);
  specs.push({ path: outer, stroke: o.color, strokeWidth: 5 });
  const second = new Path();
  brokenRing(second, c, c, R - 11, (o.seed ?? 11) + 2, 5);
  specs.push({ path: second, stroke: o.color, strokeWidth: 1.8 });
  const ticks = new Path();
  for (let i = 0; i < 40; i++) {
    const a = rad(i * 9);
    ticks.M(c + Math.cos(a) * (R - 18), c + Math.sin(a) * (R - 18)).L(c + Math.cos(a) * (R - 26), c + Math.sin(a) * (R - 26));
  }
  specs.push({ path: ticks, stroke: o.color, strokeWidth: 2, opacity: 0.9 });
  const inner = new Path();
  brokenRing(inner, c, c, R - 32, (o.seed ?? 11) + 3, 3);
  specs.push({ path: inner, stroke: o.color, strokeWidth: 2.4 });
  // small diamonds on the band between the ticks and the inner ring
  const sd = new Path();
  for (let i = 0; i < 4; i++) {
    const a = rad(i * 90);
    const x = c + Math.cos(a) * (R - 6);
    const y = c + Math.sin(a) * (R - 6);
    sd.poly([[x, y - 5], [x + 5, y], [x, y + 5], [x - 5, y]], true);
  }
  specs.push({ path: sd, fill: o.color });
  return assemble(specs, 0, { w: S, h: S });
}

/** Postage-stamp outline with perforated (scalloped) edges. */
export function perfOutline(o: { w: number; h: number; stroke: string; r?: number; fill?: Paint | null }): OrnamentData {
  const r = o.r ?? 5;
  const step = 14;
  const nx = Math.floor(o.w / step);
  const ny = Math.floor(o.h / step);
  const sx = o.w / nx;
  const sy = o.h / ny;
  const p = new Path().M(0, 0);
  for (let i = 0; i < nx; i++) p.L(sx * (i + 0.5) - r, 0).A(r, r, 0, 0, 0, sx * (i + 0.5) + r, 0).L(sx * (i + 1), 0);
  for (let i = 0; i < ny; i++) p.L(o.w, sy * (i + 0.5) - r).A(r, r, 0, 0, 0, o.w, sy * (i + 0.5) + r).L(o.w, sy * (i + 1));
  for (let i = 0; i < nx; i++) p.L(o.w - sx * (i + 0.5) + r, o.h).A(r, r, 0, 0, 0, o.w - sx * (i + 0.5) - r, o.h).L(o.w - sx * (i + 1), o.h);
  for (let i = 0; i < ny; i++) p.L(0, o.h - sy * (i + 0.5) + r).A(r, r, 0, 0, 0, 0, o.h - sy * (i + 0.5) - r).L(0, o.h - sy * (i + 1));
  p.Z();
  p.include([0, 0], [o.w, o.h]);
  return assemble([{ path: p, fill: o.fill ?? null, stroke: o.stroke, strokeWidth: 1.6 }], 0, { w: o.w, h: o.h });
}

/** Wavy cancellation lines plus a ring, like a postmark. */
export function postmark(o: { size: number; color: string }): OrnamentData {
  const S = o.size;
  const c = S / 2;
  const R = S * 0.3;
  const ring = new Path().circle(c * 0.62, c, R);
  const ring2 = new Path().circle(c * 0.62, c, R - 7);
  const waves = new Path();
  for (let k = 0; k < 5; k++) {
    const y = c - 40 + k * 20;
    waves.M(c * 0.62 + R * 0.3, y);
    for (let i = 0; i < 5; i++) waves.Q(c * 0.62 + R * 0.3 + i * 34 + 8.5, y + (i % 2 ? 7 : -7), c * 0.62 + R * 0.3 + (i + 1) * 34, y);
  }
  waves.include([0, 0], [S, S]);
  return assemble(
    [
      { path: ring, stroke: o.color, strokeWidth: 2.4 },
      { path: ring2, stroke: o.color, strokeWidth: 1 },
      { path: waves, stroke: o.color, strokeWidth: 2.2 },
    ],
    0,
    { w: S, h: S },
  );
}

/** Airmail-envelope stripe border band (red and blue slanted bars). */
export function airmailBand(o: { w: number; h: number; red: string; blue: string; bar?: number; gap?: number }): OrnamentData {
  const bar = o.bar ?? 34;
  const gap = o.gap ?? 22;
  const slant = o.h;
  const reds = new Path();
  const blues = new Path();
  let i = 0;
  for (let x = -slant; x < o.w + slant; x += bar + gap) {
    const target = i % 2 === 0 ? reds : blues;
    target.poly(
      [
        [Math.max(0, x), 0],
        [Math.min(o.w, x + bar), 0],
        [Math.min(o.w, x + bar - slant), o.h],
        [Math.max(0, x - slant), o.h],
      ],
      true,
    );
    i++;
  }
  reds.include([0, 0], [o.w, o.h]);
  return assemble([{ path: reds, fill: o.red }, { path: blues, fill: o.blue }], 0, { w: o.w, h: o.h });
}
