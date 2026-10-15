import { Path, type PartSpec, type Pt } from "../design/path";
import type { OrnamentLayer, Paint } from "../design/types";
import { linear } from "./kit";
import { ellipsePath, place, rng } from "./birthday-balloons-bold.art";

export { ellipsePath, place, rng };
export { dot, heartAt, sparkAt, starAt } from "./birthday-balloons-bold.art";

/** Shared procedural artwork for the winter / holiday party templates. */

export const rad = (d: number) => (d * Math.PI) / 180;
export const polar = (cx: number, cy: number, r: number, deg: number): Pt => [cx + Math.cos(rad(deg)) * r, cy + Math.sin(rad(deg)) * r];

type Area = [number, number, number, number];

/* ------------------------------- snow & glitter ------------------------------- */

export function flake(p: Path, cx: number, cy: number, R: number, rot = 0) {
  for (let i = 0; i < 6; i++) {
    const a = rad(rot + i * 60);
    const dx = Math.cos(a);
    const dy = Math.sin(a);
    p.M(cx, cy).L(cx + dx * R, cy + dy * R);
    for (const [t, l] of [
      [0.48, 0.34],
      [0.74, 0.22],
    ] as const) {
      const bx = cx + dx * R * t;
      const by = cy + dy * R * t;
      for (const s of [-1, 1]) {
        const b = a + s * rad(55);
        p.M(bx, by).L(bx + Math.cos(b) * R * l, by + Math.sin(b) * R * l);
      }
    }
  }
}

export interface SnowOpts {
  seed: number;
  count: number;
  area: Area;
  minR?: number;
  maxR?: number;
  color?: string;
  dots?: number;
  opacity?: number;
  skip?: (x: number, y: number) => boolean;
}

/** Depth-layered snowflakes and soft snow dots as ONE ornament. */
export function snowfield(o: SnowOpts): OrnamentLayer {
  const r = rng(o.seed);
  const min = o.minR ?? 8;
  const max = o.maxR ?? 30;
  const color = o.color ?? "#ffffff";
  const tiers = [
    { p: new Path(), sw: 1.6, op: 0.5 },
    { p: new Path(), sw: 2.4, op: 0.8 },
    { p: new Path(), sw: 3.2, op: 1 },
  ];
  const dots = new Path();
  let placed = 0;
  let guard = 0;
  const pick = (): Pt | null => {
    const x = o.area[0] + r() * (o.area[2] - o.area[0]);
    const y = o.area[1] + r() * (o.area[3] - o.area[1]);
    return o.skip?.(x, y) ? null : [x, y];
  };
  while (placed < o.count && guard++ < o.count * 30) {
    const q = pick();
    if (!q) continue;
    placed++;
    const u = r();
    flake(tiers[u < 0.4 ? 0 : u < 0.75 ? 1 : 2].p, q[0], q[1], min + (max - min) * u, r() * 60);
  }
  const nd = o.dots ?? Math.round(o.count * 1.6);
  placed = 0;
  guard = 0;
  while (placed < nd && guard++ < nd * 30) {
    const q = pick();
    if (!q) continue;
    placed++;
    dots.circle(q[0], q[1], 1.8 + r() * 3.4);
  }
  const specs: PartSpec[] = [];
  for (const t of tiers) if (t.p.pts.length) specs.push({ path: t.p, stroke: color, strokeWidth: t.sw, opacity: t.op });
  if (dots.pts.length) specs.push({ path: dots, fill: color, opacity: 0.8 });
  return place(specs, 2, { opacity: o.opacity ?? 1 });
}

export function sparkPath(p: Path, cx: number, cy: number, s: number, fat = 0.1) {
  const f = s * fat;
  p.M(cx, cy - s).Q(cx + f, cy - f, cx + s, cy).Q(cx + f, cy + f, cx, cy + s).Q(cx - f, cy + f, cx - s, cy).Q(cx - f, cy - f, cx, cy - s).Z();
}

export interface GlitterOpts {
  seed: number;
  count: number;
  area: Area;
  colors: string[];
  minS?: number;
  maxS?: number;
  opacity?: number;
  skip?: (x: number, y: number) => boolean;
}

/** Four-point glitter sparkles and tiny bokeh dots as ONE ornament. */
export function glitter(o: GlitterOpts): OrnamentLayer {
  const r = rng(o.seed);
  const by = new Map<string, Path>();
  const dots = new Map<string, Path>();
  const g = (m: Map<string, Path>, c: string) => m.get(c) ?? m.set(c, new Path()).get(c)!;
  let placed = 0;
  let guard = 0;
  while (placed < o.count && guard++ < o.count * 30) {
    const x = o.area[0] + r() * (o.area[2] - o.area[0]);
    const y = o.area[1] + r() * (o.area[3] - o.area[1]);
    if (o.skip?.(x, y)) continue;
    placed++;
    const c = o.colors[Math.floor(r() * o.colors.length)];
    const u = r();
    if (u < 0.3) g(dots, c).circle(x, y, 2 + r() * 3);
    else sparkPath(g(by, c), x, y, (o.minS ?? 6) + (o.maxS ?? 20) * u * u);
  }
  const specs: PartSpec[] = [];
  by.forEach((path, c) => specs.push({ path, fill: c }));
  dots.forEach((path, c) => specs.push({ path, fill: c, opacity: 0.75 }));
  return place(specs, 2, { opacity: o.opacity ?? 1 });
}

/** Rolling snow drift filling from a wavy line down to `bottom`. */
export function drift(x0: number, x1: number, y: number, amp: number, seed: number, fill: Paint, bottom = 1400, seg = 170): PartSpec {
  const r = rng(seed);
  const p = new Path().M(x0, bottom).L(x0, y);
  let x = x0;
  while (x < x1) {
    const nx = Math.min(x1, x + seg * (0.8 + r() * 0.5));
    const ny = y + (r() * 2 - 1) * amp * 0.5;
    p.Q((x + nx) / 2, y - amp * (0.4 + r() * 0.8), nx, ny);
    x = nx;
  }
  p.L(x1, bottom).Z();
  return { path: p, fill };
}

/* ------------------------------------ pines ------------------------------------ */

export interface PineOpts {
  cx: number;
  baseY: number;
  h: number;
  w: number;
  tiers?: number;
  fill: Paint;
  shade: string;
  snow?: string;
  trunk?: string;
  shadeOpacity?: number;
}

/** A tiered, scalloped fir tree with a shaded side and snow caps. */
export function pine(o: PineOpts): PartSpec[] {
  const n = o.tiers ?? 5;
  const specs: PartSpec[] = [];
  const trunkH = o.h * 0.07;
  const trunkW = o.w * 0.09;
  const bodyH = o.h - trunkH;
  const top = o.baseY - o.h;
  const bodyBottom = top + bodyH;
  specs.push({ path: new Path().poly([[o.cx - trunkW, bodyBottom - 4], [o.cx + trunkW, bodyBottom - 4], [o.cx + trunkW, o.baseY], [o.cx - trunkW, o.baseY]], true), fill: o.trunk ?? "#4a3326" });
  const step = bodyH / (n + 0.7);
  for (let i = n - 1; i >= 0; i--) {
    const yTop = top + i * step;
    const yBot = yTop + step * 1.7;
    const hw = (o.w / 2) * (0.34 + (0.66 * (i + 1)) / n);
    const th = yBot - yTop;
    const k = 3;
    const t = new Path().M(o.cx, yTop).L(o.cx + hw, yBot);
    for (let j = 0; j < k; j++) {
      const xa = o.cx + hw - (2 * hw * j) / k;
      const xb = o.cx + hw - (2 * hw * (j + 1)) / k;
      t.Q((xa + xb) / 2, yBot + hw * 0.16, xb, yBot - (j === k - 1 ? 0 : hw * 0.02));
    }
    t.Z();
    t.include([o.cx - hw, yBot + hw * 0.1]);
    specs.push({ path: t, fill: o.fill });
    specs.push({ path: new Path().poly([[o.cx, yTop], [o.cx + hw, yBot], [o.cx, yBot]], true), fill: o.shade, opacity: o.shadeOpacity ?? 0.35 });
    if (o.snow) {
      const ym = yTop + th * 0.52;
      const s = new Path().M(o.cx, yTop).L(o.cx + hw * 0.52, ym);
      s.Q(o.cx + hw * 0.4, ym + th * 0.15, o.cx + hw * 0.2, ym + th * 0.03)
        .Q(o.cx + hw * 0.05, ym + th * 0.17, o.cx - hw * 0.14, ym + th * 0.03)
        .Q(o.cx - hw * 0.32, ym + th * 0.14, o.cx - hw * 0.52, ym)
        .Z();
      specs.push({ path: s, fill: o.snow });
    }
  }
  return specs;
}

/* -------------------------------- fir branches --------------------------------- */

export interface FirOpts {
  len: number;
  angle: number;
  curve?: number;
  needle?: number;
  step?: number;
  dark: string;
  light: string;
  stem?: string;
}

/** A feathery evergreen branch (spine + two layers of needles). */
export function fir(x: number, y: number, o: FirOpts): PartSpec[] {
  const a = rad(o.angle);
  const dx = Math.cos(a);
  const dy = Math.sin(a);
  const nx = -dy;
  const ny = dx;
  const curve = o.curve ?? 0.1;
  const sp = (t: number): Pt => [x + dx * o.len * t + nx * o.len * curve * Math.sin(Math.PI * t * 0.9), y + dy * o.len * t + ny * o.len * curve * Math.sin(Math.PI * t * 0.9)];
  const stem = new Path().M(...sp(0));
  for (let i = 1; i <= 14; i++) stem.L(...sp(i / 14));
  const dark = new Path();
  const light = new Path();
  const steps = Math.max(4, Math.round(o.len / (o.step ?? 11)));
  const nd = o.needle ?? 26;
  for (let k = 1; k <= steps; k++) {
    const t = k / steps;
    const [px, py] = sp(t);
    const [qx, qy] = sp(Math.min(1, t + 0.02));
    const ta = Math.atan2(qy - py, qx - px) || a;
    const nl = nd * (1 - 0.55 * t);
    for (const s of [-1, 1]) {
      const d = ta + s * rad(62);
      dark.M(px, py).L(px + Math.cos(d) * nl, py + Math.sin(d) * nl);
      const [lx, ly] = sp(Math.max(0, t - 0.5 / steps));
      const l = ta + s * rad(46);
      light.M(lx, ly).L(lx + Math.cos(l) * nl * 0.8, ly + Math.sin(l) * nl * 0.8);
    }
  }
  const [ex, ey] = sp(1);
  dark.M(ex, ey).L(ex + dx * nd * 0.5, ey + dy * nd * 0.5);
  return [
    { path: stem, stroke: o.stem ?? "#4a2f1d", strokeWidth: 3.5 },
    { path: dark, stroke: o.dark, strokeWidth: 4.4 },
    { path: light, stroke: o.light, strokeWidth: 3.2 },
  ];
}

/** Holly leaf (spiky) pointing along `deg`. */
export function hollyLeaf(cx: number, cy: number, len: number, wid: number, deg: number, fill: Paint, vein: string): PartSpec[] {
  const a = rad(deg);
  const at = (t: number, s: number): Pt => [cx + Math.cos(a) * len * t - Math.sin(a) * wid * s, cy + Math.sin(a) * len * t + Math.cos(a) * wid * s];
  const right: Pt[] = [];
  const left: Pt[] = [];
  const N = 8;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const w = Math.pow(Math.sin(Math.PI * Math.min(1, t * 0.96 + 0.02)), 0.8) * (i % 2 ? 1.15 : 0.7);
    right.push(at(t, w));
    left.push(at(t, -w));
  }
  const p = new Path().poly([...right, ...left.reverse()], true);
  const v = new Path().M(...at(0, 0)).L(...at(0.92, 0));
  return [
    { path: p, fill },
    { path: v, stroke: vein, strokeWidth: 2.2, opacity: 0.7 },
  ];
}

export function berries(cx: number, cy: number, r: number, n: number, seed: number, base = "#c4162a", hi = "#ff8a8a"): PartSpec[] {
  const rn = rng(seed);
  const b = new Path();
  const h = new Path();
  for (let i = 0; i < n; i++) {
    const a = rn() * Math.PI * 2;
    const d = i === 0 ? 0 : r * (0.9 + rn() * 0.6);
    const x = cx + Math.cos(a) * d;
    const y = cy + Math.sin(a) * d;
    b.circle(x, y, r);
    h.circle(x - r * 0.3, y - r * 0.32, r * 0.26);
  }
  return [
    { path: b, fill: base },
    { path: h, fill: hi, opacity: 0.85 },
  ];
}

export function holly(cx: number, cy: number, s: number, rot: number): PartSpec[] {
  const out: PartSpec[] = [];
  const dk = linear(90, [0, "#46a866"], [1, "#1d6e3d"]);
  for (const d of [rot - 28, rot + 28, rot + 180]) {
    const rr = d - rot === 180 ? 0.8 : 1;
    out.push(...hollyLeaf(cx, cy, s * rr, s * 0.34, d, dk, "#8fd4a0"));
  }
  out.push(...berries(cx, cy, s * 0.11, 3, Math.round(cx + cy)));
  return out;
}

/* ------------------------------ wreath, bow, baubles ----------------------------- */

export function firWreath(cx: number, cy: number, R: number, o: { n?: number; dark: string; light: string; needle?: number }): PartSpec[] {
  const n = o.n ?? 20;
  const out: PartSpec[] = [{ path: new Path().circle(cx, cy, R), stroke: "#0a3322", strokeWidth: R * 0.2 }];
  const darks = [o.dark, "#0c3a24", "#17562f", "#1f6e3c"];
  const lights = [o.light, "#2a7d4b", "#3b9b5e", "#5fbf80"];
  const offs = [0, 18, -18, 6];
  for (let pass = 0; pass < 4; pass++) {
    const rr = R + offs[pass];
    for (let i = 0; i < n; i++) {
      const th = (i * 360) / n + pass * 7 + (pass % 2) * 4;
      const [x, y] = polar(cx, cy, rr, th);
      const L = ((2 * Math.PI * rr) / n) * 2.4;
      out.push(...fir(x, y, { len: L, angle: th + 93, curve: L / (8 * rr), needle: (o.needle ?? 30) * (pass === 1 ? 1.15 : 1), step: 10, dark: darks[pass], light: lights[pass] }));
    }
  }
  return out;
}

export function bow(cx: number, cy: number, s: number, c: { light: string; base: string; dark: string }): PartSpec[] {
  const out: PartSpec[] = [];
  const tail = (m: number) => {
    const p = new Path();
    p.M(cx + m * s * 0.05, cy + s * 0.1)
      .Q(cx + m * s * 0.35, cy + s * 0.7, cx + m * s * 0.75, cy + s * 1.35)
      .L(cx + m * s * 0.5, cy + s * 1.2)
      .L(cx + m * s * 0.36, cy + s * 1.42)
      .Q(cx + m * s * 0.22, cy + s * 0.75, cx - m * s * 0.12, cy + s * 0.2)
      .Z();
    return p;
  };
  out.push({ path: tail(-1), fill: c.dark }, { path: tail(1), fill: c.base });
  const loop = (m: number) => {
    const p = new Path();
    p.M(cx, cy)
      .C(cx + m * s * 0.35, cy - s * 0.85, cx + m * s * 1.35, cy - s * 0.8, cx + m * s * 1.25, cy + s * 0.05)
      .C(cx + m * s * 1.2, cy + s * 0.7, cx + m * s * 0.4, cy + s * 0.55, cx, cy)
      .Z();
    return p;
  };
  const inner = (m: number) => {
    const p = new Path();
    p.M(cx + m * s * 0.12, cy - s * 0.04)
      .C(cx + m * s * 0.4, cy - s * 0.55, cx + m * s * 0.95, cy - s * 0.52, cx + m * s * 0.95, cy + s * 0.02)
      .C(cx + m * s * 0.9, cy + s * 0.4, cx + m * s * 0.4, cy + s * 0.34, cx + m * s * 0.12, cy - s * 0.04)
      .Z();
    return p;
  };
  for (const m of [-1, 1]) {
    out.push({ path: loop(m), fill: linear(90, [0, c.light], [0.5, c.base], [1, c.dark]) });
    out.push({ path: inner(m), fill: c.dark, opacity: 0.45 });
  }
  const kn = new Path().poly([[cx - s * 0.2, cy - s * 0.2], [cx + s * 0.2, cy - s * 0.2], [cx + s * 0.22, cy + s * 0.22], [cx - s * 0.22, cy + s * 0.22]], true);
  out.push({ path: kn, fill: linear(90, [0, c.light], [1, c.base]) });
  out.push({ path: new Path().M(cx - s * 0.12, cy - s * 0.14).L(cx - s * 0.1, cy + s * 0.16), stroke: "#ffffff", strokeWidth: 3, opacity: 0.5 });
  return out;
}

export interface BaubleC {
  light: string;
  base: string;
  dark: string;
}
export const BAUBLES: Record<string, BaubleC> = {
  red: { light: "#ff8a86", base: "#d11f2f", dark: "#7f0b1b" },
  gold: { light: "#fff1b8", base: "#e0b24c", dark: "#8a6422" },
  green: { light: "#7bd09a", base: "#1f7a49", dark: "#0b3d24" },
  cream: { light: "#ffffff", base: "#f0e3c8", dark: "#bfa87c" },
  navy: { light: "#8fb2ea", base: "#294d93", dark: "#0f2250" },
  silver: { light: "#ffffff", base: "#c4ccd8", dark: "#7a8596" },
};

function chord(cx: number, cy: number, r: number, y0: number, y1: number): Path {
  const pts: Pt[] = [];
  const hw = (y: number) => Math.sqrt(Math.max(0, r * r - (y - cy) * (y - cy)));
  for (let i = 0; i <= 8; i++) {
    const y = y0 + ((y1 - y0) * i) / 8;
    pts.push([cx - hw(y), y]);
  }
  for (let i = 8; i >= 0; i--) {
    const y = y0 + ((y1 - y0) * i) / 8;
    pts.push([cx + hw(y), y]);
  }
  return new Path().poly(pts, true);
}

/** Glossy Christmas bauble with cap; `hang` = y the string is tied to (omit for none). */
export function bauble(cx: number, cy: number, r: number, c: BaubleC, o: { hang?: number; band?: string; dots?: string; star?: boolean } = {}): OrnamentLayer {
  const specs: PartSpec[] = [];
  const gold = "#d6ac4a";
  if (o.hang != null) specs.push({ path: new Path().M(cx, o.hang).L(cx, cy - r - 17), stroke: gold, strokeWidth: 2.4, opacity: 0.9 });
  specs.push({ path: ellipsePath(cx, cy - r - 20, 6, 7), stroke: gold, strokeWidth: 2.4 });
  specs.push({ path: new Path().circle(cx, cy, r), fill: linear(55, [0, c.light], [0.5, c.base], [1, c.dark]) });
  if (o.band) specs.push({ path: chord(cx, cy, r * 0.99, cy - r * 0.16, cy + r * 0.2), fill: o.band });
  if (o.band) specs.push({ path: chord(cx, cy, r * 0.99, cy - r * 0.04, cy + r * 0.06), fill: "#ffffff", opacity: 0.35 });
  if (o.dots) {
    const d = new Path();
    for (let row = -1; row <= 1; row++) for (let k = -2; k <= 2; k++) if ((k + row) % 2 === 0) d.circle(cx + k * r * 0.3 + (row % 2 ? 0 : 0), cy + row * r * 0.52 + r * 0.02, r * 0.07);
    specs.push({ path: d, fill: o.dots, opacity: 0.8 });
  }
  specs.push({ path: new Path().poly([[cx - r * 0.2, cy - r - 14], [cx + r * 0.2, cy - r - 14], [cx + r * 0.22, cy - r + 3], [cx - r * 0.22, cy - r + 3]], true), fill: gold });
  specs.push({ path: ellipsePath(cx - r * 0.38, cy - r * 0.42, r * 0.3, r * 0.1, 125), fill: "#ffffff", opacity: 0.6 });
  specs.push({ path: new Path().circle(cx - r * 0.12, cy - r * 0.72, r * 0.06), fill: "#ffffff", opacity: 0.7 });
  specs.push({ path: ellipsePath(cx + r * 0.42, cy + r * 0.45, r * 0.26, r * 0.08, 125), fill: c.light, opacity: 0.3 });
  return place(specs, 3);
}

/* ------------------------------------ fireworks ---------------------------------- */

export function burst(cx: number, cy: number, R: number, n: number, o: { color: string; accent?: string; core?: number; rot?: number }): PartSpec[] {
  const r0 = R * (o.core ?? 0.14);
  const long = new Path();
  const dotsA = new Path();
  const dotsB = new Path();
  const trail = new Path();
  for (let i = 0; i < n; i++) {
    const a = (o.rot ?? 0) + (i * 360) / n;
    const isLong = i % 2 === 0;
    const L = R * (isLong ? 1 : 0.72);
    const b = rad(a);
    const [tx, ty] = polar(cx, cy, L, a);
    const w = isLong ? 3.2 : 2.4;
    const sx = Math.cos(b + Math.PI / 2) * w;
    const sy = Math.sin(b + Math.PI / 2) * w;
    const [bx, by] = polar(cx, cy, r0, a);
    long.poly([[bx + sx, by + sy], [tx, ty], [bx - sx, by - sy]], true);
    (isLong ? dotsA : dotsB).circle(tx, ty, isLong ? 5.5 : 4);
    const [mx, my] = polar(cx, cy, R * 0.52, a + 180 / n);
    dotsB.circle(mx, my, 2.6);
    const [t0x, t0y] = polar(cx, cy, R * 0.84, a + 180 / n);
    const [t1x, t1y] = polar(cx, cy, R * 0.92, a + 180 / n);
    trail.M(t0x, t0y).L(t1x, t1y);
  }
  const specs: PartSpec[] = [
    { path: long, fill: o.color },
    { path: dotsA, fill: o.accent ?? "#ffffff" },
    { path: dotsB, fill: o.color, opacity: 0.85 },
    { path: trail, stroke: o.color, strokeWidth: 3, opacity: 0.7 },
    { path: new Path().circle(cx, cy, r0 * 0.62), fill: o.color },
    { path: new Path().circle(cx, cy, r0 * 0.3), fill: o.accent ?? "#ffffff", opacity: 0.9 },
  ];
  return specs;
}

/** Champagne flute tilted by `tilt` degrees about its base. */
export function flute(cx: number, topY: number, h: number, tilt: number, o: { liquid: Paint; seed: number; glass?: string }): PartSpec[] {
  const baseY = topY + h;
  const t = rad(tilt);
  const tp = (x: number, y: number): Pt => {
    const dx = cx + x - cx;
    const dy = topY + y - baseY;
    return [cx + dx * Math.cos(t) - dy * Math.sin(t), baseY + dx * Math.sin(t) + dy * Math.cos(t)];
  };
  const bowlH = h * 0.5;
  const tw = h * 0.085;
  const hw = (y: number) => tw * (1 - 0.86 * Math.pow(y / bowlH, 2.3)) + h * 0.012;
  const bowl = (y0: number, inset: number): Path => {
    const pts: Pt[] = [];
    const N = 18;
    for (let i = 0; i <= N; i++) {
      const y = y0 + ((bowlH - y0) * i) / N;
      pts.push(tp(-(hw(y) - inset), y));
    }
    for (let i = N; i >= 0; i--) {
      const y = y0 + ((bowlH - y0) * i) / N;
      pts.push(tp(hw(y) - inset, y));
    }
    return new Path().poly(pts, true);
  };
  const glass = o.glass ?? "#ffffff";
  const rn = rng(o.seed);
  const bub = new Path();
  for (let i = 0; i < 9; i++) {
    const y = h * 0.14 + rn() * (bowlH - h * 0.2);
    const [bx, by] = tp((rn() * 2 - 1) * hw(y) * 0.55, y);
    bub.circle(bx, by, 2 + rn() * 3);
  }
  const specs: PartSpec[] = [
    { path: bowl(0, 0), fill: glass, opacity: 0.12 },
    { path: bowl(h * 0.11, h * 0.012), fill: o.liquid },
    { path: bub, stroke: "#ffffff", strokeWidth: 1.6, opacity: 0.8 },
    { path: bowl(0, 0), stroke: glass, strokeWidth: 3, opacity: 0.75 },
  ];
  const stem = new Path().poly([tp(-h * 0.014, bowlH - 2), tp(h * 0.014, bowlH - 2), tp(h * 0.01, h * 0.9), tp(-h * 0.01, h * 0.9)], true);
  specs.push({ path: stem, fill: glass, opacity: 0.55 });
  const base = new Path();
  base.M(...tp(-h * 0.13, h)).Q(...tp(0, h * 0.89), ...tp(h * 0.13, h)).Z();
  specs.push({ path: base, fill: glass, opacity: 0.55 });
  specs.push({ path: new Path().M(...tp(-tw * 0.62, h * 0.04)).Q(...tp(-tw * 0.7, h * 0.22), ...tp(-tw * 0.36, h * 0.4)), stroke: "#ffffff", strokeWidth: 3, opacity: 0.8 });
  return specs;
}

/** Clock ticks and hands (hour/minute/second angles in degrees from 12 o'clock, clockwise). */
export function clockHands(cx: number, cy: number, R: number, o: { gold: string; light: string; hour: number; min: number; sec: number; accent: string }): PartSpec[] {
  const out: PartSpec[] = [];
  const ticks = new Path();
  const big = new Path();
  for (let i = 0; i < 60; i++) {
    const a = i * 6 - 90;
    const five = i % 5 === 0;
    const [x0, y0] = polar(cx, cy, R * (five ? 0.84 : 0.9), a);
    const [x1, y1] = polar(cx, cy, R * 0.96, a);
    (five ? big : ticks).M(x0, y0).L(x1, y1);
  }
  out.push({ path: ticks, stroke: o.light, strokeWidth: 2, opacity: 0.7 });
  out.push({ path: big, stroke: o.gold, strokeWidth: 5 });
  const hand = (deg: number, len: number, w: number, tail: number, fill: string) => {
    const a = deg - 90;
    const [tx, ty] = polar(cx, cy, len, a);
    const [px, py] = polar(cx, cy, len * 0.22, a);
    const [bx, by] = polar(cx, cy, -tail, a);
    const nx = Math.cos(rad(a + 90)) * w;
    const ny = Math.sin(rad(a + 90)) * w;
    return { path: new Path().poly([[tx, ty], [px + nx, py + ny], [bx, by], [px - nx, py - ny]], true), fill } as PartSpec;
  };
  out.push(hand(o.hour, R * 0.5, 11, 14, o.gold));
  out.push(hand(o.min, R * 0.76, 8, 16, o.light));
  const sa = o.sec - 90;
  const [sx, sy] = polar(cx, cy, R * 0.82, sa);
  const [tx, ty] = polar(cx, cy, -R * 0.2, sa);
  out.push({ path: new Path().M(tx, ty).L(sx, sy), stroke: o.accent, strokeWidth: 3.2 });
  out.push({ path: new Path().circle(cx, cy, 13), fill: o.gold });
  out.push({ path: new Path().circle(cx, cy, 6), fill: "#0a0a0a" });
  return out;
}

/* ------------------------------ cabin: plaid, knit, mug ---------------------------- */

const rectPoly = (p: Path, x: number, y: number, w: number, h: number) => p.poly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], true);

/** Buffalo-check plaid: base colour + translucent dark bands in both directions. */
export function plaid(x: number, y: number, w: number, h: number, o: { base: string; dark: string; cell: number; line?: string; band?: number }): OrnamentLayer {
  const specs: PartSpec[] = [{ path: rectPoly(new Path(), x, y, w, h), fill: o.base }];
  const v = new Path();
  const hz = new Path();
  const pin = new Path();
  for (let cx = x; cx < x + w; cx += o.cell * 2) {
    rectPoly(v, cx, y, Math.min(o.cell, x + w - cx), h);
    pin.M(cx + o.cell / 2, y).L(cx + o.cell / 2, y + h);
  }
  for (let cy = y; cy < y + h; cy += o.cell * 2) {
    rectPoly(hz, x, cy, w, Math.min(o.cell, y + h - cy));
    pin.M(x, cy + o.cell / 2).L(x + w, cy + o.cell / 2);
  }
  specs.push({ path: v, fill: o.dark, opacity: o.band ?? 0.5 });
  specs.push({ path: hz, fill: o.dark, opacity: o.band ?? 0.5 });
  if (o.line) specs.push({ path: pin, stroke: o.line, strokeWidth: 2, opacity: 0.28 });
  return place(specs, 0);
}

/** Row of knitted V stitches. pattern(row,col) picks a colour index. */
export function knitBand(x: number, y: number, w: number, rows: number, sz: number, colors: string[], pattern: (r: number, c: number) => number, hi = "#ffffff"): OrnamentLayer {
  const cols = Math.floor(w / sz);
  const by = new Map<number, Path>();
  const hl = new Path();
  const g = (k: number) => by.get(k) ?? by.set(k, new Path()).get(k)!;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cx = x + sz * (c + 0.5);
      const top = y + r * sz * 1.05;
      const bot = top + sz * 0.95;
      const p = g(pattern(r, c));
      p.M(cx - sz * 0.42, top + sz * 0.05).L(cx, bot);
      p.M(cx + sz * 0.42, top + sz * 0.05).L(cx, bot);
      hl.M(cx - sz * 0.3, top + sz * 0.2).L(cx - sz * 0.08, bot - sz * 0.22);
      hl.M(cx + sz * 0.3, top + sz * 0.2).L(cx + sz * 0.08, bot - sz * 0.22);
    }
  }
  const specs: PartSpec[] = [];
  by.forEach((path, k) => specs.push({ path, stroke: colors[k], strokeWidth: sz * 0.4 }));
  specs.push({ path: hl, stroke: hi, strokeWidth: sz * 0.09, opacity: 0.3 });
  return place(specs, 1);
}

export function rrect(p: Path, cx: number, cy: number, w: number, h: number, r: number, deg = 0) {
  const t = rad(deg);
  const q = (x: number, y: number): Pt => [cx + x * Math.cos(t) - y * Math.sin(t), cy + x * Math.sin(t) + y * Math.cos(t)];
  const hw = w / 2;
  const hh = h / 2;
  p.M(...q(-hw + r, -hh))
    .L(...q(hw - r, -hh))
    .Q(...q(hw, -hh), ...q(hw, -hh + r))
    .L(...q(hw, hh - r))
    .Q(...q(hw, hh), ...q(hw - r, hh))
    .L(...q(-hw + r, hh))
    .Q(...q(-hw, hh), ...q(-hw, hh - r))
    .L(...q(-hw, -hh + r))
    .Q(...q(-hw, -hh), ...q(-hw + r, -hh))
    .Z();
}

export function marshmallow(cx: number, cy: number, s: number, deg: number): PartSpec[] {
  const a = new Path();
  rrect(a, cx, cy, s, s * 0.9, s * 0.3, deg);
  const b = new Path();
  rrect(b, cx + s * 0.04, cy + s * 0.07, s * 0.92, s * 0.78, s * 0.28, deg);
  const hl = new Path();
  rrect(hl, cx - s * 0.16, cy - s * 0.2, s * 0.34, s * 0.12, s * 0.06, deg);
  return [
    { path: a, fill: "#fff8ec" },
    { path: b, fill: "#ecd9b8", opacity: 0.55 },
    { path: hl, fill: "#ffffff", opacity: 0.9 },
  ];
}

export interface MugOpts {
  body: Paint;
  bodyDark: string;
  rim: string;
  cocoa: string;
  band?: string;
  bandDark?: string;
  handle: string;
  marsh?: boolean;
  steam?: boolean;
  candy?: boolean;
}

/** Hot-cocoa mug: tapered body, handle, cocoa, marshmallows, decorative band, steam. */
export function mug(cx: number, cy: number, w: number, h: number, o: MugOpts): PartSpec[] {
  const out: PartSpec[] = [];
  const top = cy - h / 2;
  const bot = cy + h / 2;
  const bw = w * 0.86;
  const r = h * 0.14;
  out.push({ path: new Path().M(cx + w / 2 - 6, top + h * 0.2).C(cx + w / 2 + w * 0.5, top + h * 0.08, cx + w / 2 + w * 0.46, top + h * 0.78, cx + bw / 2 - 8, top + h * 0.74), stroke: o.handle, strokeWidth: h * 0.11 });
  out.push({ path: new Path().M(cx + w / 2 + 4, top + h * 0.2).C(cx + w / 2 + w * 0.42, top + h * 0.12, cx + w / 2 + w * 0.4, top + h * 0.7, cx + bw / 2 - 4, top + h * 0.68), stroke: "#ffffff", strokeWidth: 3, opacity: 0.3 });
  const body = new Path().M(cx - w / 2, top).L(cx + w / 2, top).L(cx + bw / 2, bot - r).Q(cx + bw / 2, bot, cx + bw / 2 - r, bot).L(cx - bw / 2 + r, bot).Q(cx - bw / 2, bot, cx - bw / 2, bot - r).Z();
  out.push({ path: body, fill: o.body });
  const wAt = (y: number) => w / 2 + ((bw - w) / 2) * ((y - top) / h);
  if (o.band) {
    const y1 = top + h * 0.36;
    const y2 = top + h * 0.64;
    out.push({ path: new Path().poly([[cx - wAt(y1), y1], [cx + wAt(y1), y1], [cx + wAt(y2), y2], [cx - wAt(y2), y2]], true), fill: o.band });
    const z = new Path();
    const n = 9;
    const ym = (y1 + y2) / 2;
    for (let i = 0; i < n; i++) {
      const xa = cx - wAt(ym) + (2 * wAt(ym) * i) / n;
      const xb = cx - wAt(ym) + (2 * wAt(ym) * (i + 1)) / n;
      z.poly([[xa, ym - 10], [(xa + xb) / 2, ym + 10], [xb, ym - 10]], false);
    }
    out.push({ path: z, stroke: o.bandDark ?? o.bodyDark, strokeWidth: 4.5 });
  }
  out.push({ path: new Path().poly([[cx - w / 2 + w * 0.08, top + h * 0.08], [cx - w / 2 + w * 0.17, top + h * 0.08], [cx - bw / 2 + w * 0.17, bot - h * 0.2], [cx - bw / 2 + w * 0.08, bot - h * 0.2]], true), fill: "#ffffff", opacity: 0.18 });
  out.push({ path: new Path().poly([[cx + w * 0.3, top], [cx + w / 2, top], [cx + bw / 2, bot - r], [cx + bw * 0.28, bot - r * 0.3]], true), fill: o.bodyDark, opacity: 0.22 });
  const ry = h * 0.095;
  out.push({ path: ellipsePath(cx, top, w / 2, ry), fill: o.rim });
  out.push({ path: ellipsePath(cx, top + 2, w / 2 - 9, ry - 6), fill: o.cocoa });
  out.push({ path: ellipsePath(cx - w * 0.14, top - 1, w * 0.18, ry * 0.28, 0), fill: "#ffffff", opacity: 0.18 });
  if (o.marsh) {
    out.push(...marshmallow(cx - w * 0.17, top - h * 0.02, w * 0.25, -12));
    out.push(...marshmallow(cx + w * 0.14, top - h * 0.045, w * 0.23, 10));
    out.push(...marshmallow(cx - w * 0.01, top + h * 0.02, w * 0.21, 3));
  }
  if (o.candy) {
    const c = new Path().M(cx + w * 0.22, top + h * 0.05).L(cx + w * 0.3, top - h * 0.38).Q(cx + w * 0.3, top - h * 0.5, cx + w * 0.4, top - h * 0.46);
    out.push({ path: c, stroke: "#ffffff", strokeWidth: 12 });
    const st = new Path();
    for (let i = 0; i < 6; i++) st.M(cx + w * (0.235 + i * 0.012), top + h * (0.0 - i * 0.065)).L(cx + w * (0.275 + i * 0.012), top + h * (-0.03 - i * 0.065));
    out.push({ path: st, stroke: "#d32f3f", strokeWidth: 5 });
  }
  if (o.steam) {
    const s = new Path();
    for (const k of [-0.22, 0, 0.22]) {
      const x = cx + w * k;
      const y = top - h * 0.12;
      s.M(x, y).Q(x - 14, y - h * 0.08, x, y - h * 0.15).Q(x + 14, y - h * 0.22, x, y - h * 0.3);
    }
    out.push({ path: s, stroke: "#ffffff", strokeWidth: 6, opacity: 0.5 });
  }
  return out;
}

export function pinecone(cx: number, cy: number, w: number, h: number, deg: number, c: { a: string; b: string; tip: string }): PartSpec[] {
  const t = rad(deg);
  const q = (x: number, y: number): Pt => [cx + x * Math.cos(t) - y * Math.sin(t), cy + x * Math.sin(t) + y * Math.cos(t)];
  const out: PartSpec[] = [{ path: ellipsePath(cx, cy, w / 2, h / 2, deg), fill: c.b }];
  const A = new Path();
  const B = new Path();
  const rows = 7;
  for (let r = 0; r < rows; r++) {
    const y = -h / 2 + (h * (r + 0.7)) / (rows + 0.2);
    const half = (w / 2) * Math.sqrt(Math.max(0.05, 1 - Math.pow(y / (h / 2), 2)));
    const n = Math.max(2, Math.round((half * 2) / (w * 0.26)));
    const sw = (half * 2) / n;
    for (let k = 0; k < n; k++) {
      const x = -half + sw * (k + 0.5 + (r % 2 ? 0.5 : 0)) - (r % 2 ? sw * 0.5 : 0);
      const p = r % 2 ? A : B;
      p.M(...q(x - sw * 0.55, y - h * 0.05)).Q(...q(x, y - h * 0.09), ...q(x + sw * 0.55, y - h * 0.05)).Q(...q(x + sw * 0.5, y + h * 0.1), ...q(x, y + h * 0.13)).Q(...q(x - sw * 0.5, y + h * 0.1), ...q(x - sw * 0.55, y - h * 0.05)).Z();
    }
  }
  out.push({ path: A, fill: c.a }, { path: B, fill: c.tip, opacity: 0.95 });
  return out;
}
