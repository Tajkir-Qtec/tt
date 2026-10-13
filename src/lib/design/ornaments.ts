import { assemble, leaf, Path, petal, rad, type OrnamentData, type PartSpec, type Pt } from "./path";
import type { Paint } from "./types";

/* ------------------------------------------------------------------ */
/* Organic: branches, wreaths, flowers                                  */
/* ------------------------------------------------------------------ */

interface BranchOpts {
  leaves: number;
  leafLen: number;
  leafW: number;
  spread: number; // degrees from tangent
  round?: boolean;
  alternate?: boolean;
  taper?: number; // 0..1 how much leaves shrink toward the tip
  startAt?: number; // t of first leaf
  endAt?: number;
  tipLeaf?: boolean;
}

function branch(
  leafPath: Path,
  pointAt: (t: number) => Pt,
  tangentAt: (t: number) => number,
  o: BranchOpts,
  berryPath?: Path,
  berryR = 0,
) {
  const n = o.leaves;
  const t0 = o.startAt ?? 0.12;
  const t1 = o.endAt ?? 0.92;
  const taper = o.taper ?? 0.5;
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? t0 : t0 + ((t1 - t0) * i) / (n - 1);
    const scale = 1 - taper * t;
    const base = pointAt(t);
    const ang = tangentAt(t);
    if (o.alternate) {
      const side = i % 2 === 0 ? 1 : -1;
      leaf(leafPath, base, ang + rad(o.spread) * side, o.leafLen * scale, o.leafW * scale, o.round);
    } else {
      leaf(leafPath, base, ang + rad(o.spread), o.leafLen * scale, o.leafW * scale, o.round);
      leaf(leafPath, base, ang - rad(o.spread), o.leafLen * scale, o.leafW * scale, o.round);
    }
    if (berryPath && i % 2 === 1) {
      const bp = pointAt(Math.min(1, t + 0.04));
      const a = tangentAt(t) + rad(o.spread + 25) * (i % 4 === 1 ? 1 : -1);
      berryPath.circle(bp[0] + Math.cos(a) * o.leafLen * 0.55 * scale, bp[1] + Math.sin(a) * o.leafLen * 0.55 * scale, berryR);
    }
  }
  if (o.tipLeaf !== false) {
    const tip = pointAt(1);
    leaf(leafPath, tip, tangentAt(1), o.leafLen * (1 - taper) * 1.05, o.leafW * (1 - taper) * 1.05, o.round);
  }
}

export interface SprigOpts {
  color: string;
  length?: number;
  leaves?: number;
  leafLen?: number;
  leafW?: number;
  curve?: number;
  spread?: number;
  round?: boolean;
  alternate?: boolean;
  stemWidth?: number;
  berryColor?: string | null;
  opacity?: number;
  taper?: number;
}

/** A curved branch with leaves along its length, growing left→right. */
export function sprig(o: SprigOpts): OrnamentData {
  const L = o.length ?? 420;
  const curve = o.curve ?? 40;
  const P0: Pt = [0, 0];
  const P1: Pt = [L / 2, -curve * 2];
  const P2: Pt = [L, 0];
  const pointAt = (t: number): Pt => {
    const u = 1 - t;
    return [u * u * P0[0] + 2 * u * t * P1[0] + t * t * P2[0], u * u * P0[1] + 2 * u * t * P1[1] + t * t * P2[1]];
  };
  const tangentAt = (t: number) => {
    const dx = 2 * (1 - t) * (P1[0] - P0[0]) + 2 * t * (P2[0] - P1[0]);
    const dy = 2 * (1 - t) * (P1[1] - P0[1]) + 2 * t * (P2[1] - P1[1]);
    return Math.atan2(dy, dx);
  };
  const stem = new Path();
  for (let i = 0; i <= 30; i++) {
    const [x, y] = pointAt(i / 30);
    if (i === 0) stem.M(x, y);
    else stem.L(x, y);
  }
  const leaves = new Path();
  const berries = o.berryColor ? new Path() : undefined;
  branch(
    leaves,
    pointAt,
    tangentAt,
    {
      leaves: o.leaves ?? 7,
      leafLen: o.leafLen ?? 62,
      leafW: o.leafW ?? 17,
      spread: o.spread ?? 42,
      round: o.round,
      alternate: o.alternate,
      taper: o.taper ?? 0.45,
    },
    berries,
    (o.leafLen ?? 62) * 0.1,
  );
  const specs: PartSpec[] = [
    { path: stem, stroke: o.color, strokeWidth: o.stemWidth ?? 3, opacity: o.opacity },
    { path: leaves, fill: o.color, opacity: o.opacity },
  ];
  if (berries) specs.push({ path: berries, fill: o.berryColor, opacity: o.opacity });
  return assemble(specs, 4);
}

export interface WreathOpts {
  color: string;
  radius?: number;
  leaves?: number;
  leafLen?: number;
  leafW?: number;
  round?: boolean;
  gap?: number; // degrees open at the top
  stemWidth?: number;
  berryColor?: string | null;
  opacity?: number;
}

/** Two branches rising from the bottom and meeting near the top, forming a laurel wreath. */
export function wreath(o: WreathOpts): OrnamentData {
  const R = o.radius ?? 260;
  const gap = o.gap ?? 28;
  const stems = new Path();
  const leaves = new Path();
  const berries = o.berryColor ? new Path() : undefined;
  for (const side of [-1, 1]) {
    // angle measured from bottom (0) up to (180 - gap)
    const total = 180 - gap / 2;
    const polar = (t: number): Pt => {
      const a = rad(90 + side * total * t); // 90° = bottom in SVG space
      return [Math.cos(a) * R, Math.sin(a) * R];
    };
    const tangent = (t: number) => {
      const a = rad(90 + side * total * t);
      return a + (side === 1 ? Math.PI / 2 : -Math.PI / 2);
    };
    for (let i = 0; i <= 60; i++) {
      const [x, y] = polar(i / 60);
      if (i === 0) stems.M(x, y);
      else stems.L(x, y);
    }
    branch(
      leaves,
      polar,
      tangent,
      {
        leaves: o.leaves ?? 11,
        leafLen: o.leafLen ?? 66,
        leafW: o.leafW ?? 18,
        spread: 40,
        round: o.round,
        taper: 0.35,
        startAt: 0.04,
        endAt: 0.94,
      },
      berries,
      (o.leafLen ?? 66) * 0.09,
    );
  }
  const specs: PartSpec[] = [
    { path: stems, stroke: o.color, strokeWidth: o.stemWidth ?? 3, opacity: o.opacity },
    { path: leaves, fill: o.color, opacity: o.opacity },
  ];
  if (berries) specs.push({ path: berries, fill: o.berryColor, opacity: o.opacity });
  const size = R * 2 + (o.leafLen ?? 66) * 2 + 20;
  return assemble(specs, 0, { w: size, h: size, dx: size / 2, dy: size / 2 });
}

export interface FlowerOpts {
  color: string;
  /** Optional per-ring colors, outermost first. */
  ringColors?: string[];
  stroke?: string | null;
  radius?: number;
  rings?: number;
  petals?: number;
  strokeWidth?: number;
  center?: string | null;
  opacity?: number;
}

/** A layered bloom (peony / rose style) built from overlapping petals. */
export function flower(o: FlowerOpts): OrnamentData {
  const R = o.radius ?? 150;
  const rings = o.rings ?? 4;
  const specs: PartSpec[] = [];
  for (let k = 0; k < rings; k++) {
    const f = 1 - k / (rings + 0.6);
    const count = Math.max(5, (o.petals ?? 9) - Math.floor(k * 1.2));
    const p = new Path();
    const r1 = R * f;
    for (let i = 0; i < count; i++) {
      const a = ((i + (k % 2 ? 0.5 : 0)) / count) * Math.PI * 2;
      petal(p, 0, 0, a, r1 * 0.12, r1, ((r1 * Math.PI) / count) * 0.72, false);
    }
    specs.push({
      path: p,
      fill: o.ringColors?.[k] ?? o.color,
      stroke: o.stroke ?? null,
      strokeWidth: o.strokeWidth ?? 1.4,
      opacity: o.opacity ?? 0.9,
    });
  }
  if (o.center) {
    const c = new Path();
    c.circle(0, 0, R * 0.07);
    specs.push({ path: c, fill: o.center });
  }
  const size = R * 2 + 12;
  return assemble(specs, 0, { w: size, h: size, dx: size / 2, dy: size / 2 });
}

/** Simple five-petal blossom — good for small accents along a border. */
export function blossom(o: { color: string; center: string; radius?: number; opacity?: number }): OrnamentData {
  const R = o.radius ?? 60;
  const p = new Path();
  for (let i = 0; i < 5; i++) petal(p, 0, 0, rad(-90 + i * 72), R * 0.1, R, R * 0.36, false);
  const c = new Path();
  c.circle(0, 0, R * 0.14);
  const size = R * 2 + 6;
  return assemble([{ path: p, fill: o.color, opacity: o.opacity ?? 0.95 }, { path: c, fill: o.center }], 0, {
    w: size,
    h: size,
    dx: size / 2,
    dy: size / 2,
  });
}

/** Paisley (boteh) motif. */
export function paisley(o: { color: string; stroke?: string | null; fillColor?: string | null; strokeWidth?: number; size?: number }): OrnamentData {
  const S = o.size ?? 160;
  const p = new Path();
  // body: teardrop curling to the upper right
  p.M(0, 0)
    .C(-0.55 * S, -0.1 * S, -0.62 * S, -0.85 * S, -0.1 * S, -1.05 * S)
    .C(0.3 * S, -1.2 * S, 0.62 * S, -0.95 * S, 0.6 * S, -0.62 * S)
    .C(0.58 * S, -0.4 * S, 0.34 * S, -0.34 * S, 0.24 * S, -0.5 * S)
    .C(0.16 * S, -0.62 * S, 0.3 * S, -0.72 * S, 0.34 * S, -0.62 * S)
    .C(0.4 * S, -0.5 * S, 0.2 * S, -0.46 * S, 0.12 * S, -0.56 * S)
    .C(0.06 * S, -0.66 * S, 0.2 * S, -0.92 * S, -0.1 * S, -0.88 * S)
    .C(-0.38 * S, -0.84 * S, -0.34 * S, -0.3 * S, 0, 0)
    .Z();
  const inner = new Path();
  inner
    .M(-0.1 * S, -0.1 * S)
    .C(-0.3 * S, -0.3 * S, -0.3 * S, -0.7 * S, -0.1 * S, -0.78 * S);
  const dots = new Path();
  [0.18, 0.3, 0.42].forEach((t, i) => dots.circle(-0.34 * S + i * 0.0, -0.2 * S - t * S * 0.9, S * 0.018));
  const specs: PartSpec[] = [
    { path: p, fill: o.fillColor ?? null, stroke: o.stroke ?? o.color, strokeWidth: o.strokeWidth ?? 3 },
    { path: inner, stroke: o.stroke ?? o.color, strokeWidth: (o.strokeWidth ?? 3) * 0.8 },
    { path: dots, fill: o.stroke ?? o.color },
  ];
  return assemble(specs, 4);
}

/* ------------------------------------------------------------------ */
/* Geometric: arches, frames, corners, dividers                         */
/* ------------------------------------------------------------------ */

export function archPath(x: number, y: number, w: number, h: number, closed = true): Path {
  const r = w / 2;
  const p = new Path();
  p.M(x, y + h).L(x, y + r).A(r, r, 0, 0, 1, x + w, y + r).L(x + w, y + h);
  p.include([x + r, y]);
  if (closed) p.Z();
  return p;
}

export interface ArchOpts {
  w: number;
  h: number;
  stroke?: string | null;
  strokeWidth?: number;
  fill?: Paint | null;
  /** Additional concentric outlines inside the first, each inset by `gap`. */
  lines?: number;
  gap?: number;
  closed?: boolean;
}

export function archFrame(o: ArchOpts): OrnamentData {
  const sw = o.strokeWidth ?? 3;
  const specs: PartSpec[] = [];
  const lines = o.lines ?? 1;
  const gap = o.gap ?? 16;
  for (let i = 0; i < lines; i++) {
    const inset = i * gap + sw / 2;
    const w = o.w - inset * 2;
    const h = o.h - inset * 2 + (o.closed === false ? inset : 0);
    specs.push({
      path: archPath(inset, inset, w, h, o.closed !== false),
      fill: i === 0 ? o.fill ?? null : null,
      stroke: o.stroke ?? null,
      strokeWidth: i === 0 ? sw : sw * 0.55,
      lineJoin: "miter",
    });
  }
  return assemble(specs, 0, { w: o.w, h: o.h });
}

/** Rectangle with concave "inverted" corners — the classic invitation border. */
export function ticketFrame(o: { w: number; h: number; r?: number; stroke: string; strokeWidth?: number; inset?: number; lines?: number; gap?: number; fill?: Paint | null }): OrnamentData {
  const specs: PartSpec[] = [];
  const lines = o.lines ?? 1;
  for (let i = 0; i < lines; i++) {
    const inset = (o.inset ?? 0) + i * (o.gap ?? 14) + (o.strokeWidth ?? 2) / 2;
    const r = (o.r ?? 40) - i * 6;
    const x0 = inset;
    const y0 = inset;
    const x1 = o.w - inset;
    const y1 = o.h - inset;
    const p = new Path();
    p.M(x0 + r, y0)
      .L(x1 - r, y0)
      .A(r, r, 0, 0, 0, x1, y0 + r)
      .L(x1, y1 - r)
      .A(r, r, 0, 0, 0, x1 - r, y1)
      .L(x0 + r, y1)
      .A(r, r, 0, 0, 0, x0, y1 - r)
      .L(x0, y0 + r)
      .A(r, r, 0, 0, 0, x0 + r, y0)
      .Z();
    specs.push({ path: p, stroke: o.stroke, strokeWidth: i === 0 ? o.strokeWidth ?? 2 : (o.strokeWidth ?? 2) * 0.6, fill: i === 0 ? o.fill ?? null : null });
  }
  return assemble(specs, 0, { w: o.w, h: o.h });
}

/** Rectangle with chamfered (cut) corners and optional inner line — Art Deco border. */
export function decoFrame(o: { w: number; h: number; cut?: number; stroke: Paint; strokeWidth?: number; lines?: number; gap?: number; fill?: Paint | null }): OrnamentData {
  const specs: PartSpec[] = [];
  const lines = o.lines ?? 2;
  const cut0 = o.cut ?? 46;
  for (let i = 0; i < lines; i++) {
    const inset = i * (o.gap ?? 16) + (o.strokeWidth ?? 3) / 2;
    const c = Math.max(8, cut0 - i * (o.gap ?? 16) * 0.4);
    const x0 = inset;
    const y0 = inset;
    const x1 = o.w - inset;
    const y1 = o.h - inset;
    const p = new Path();
    p.poly(
      [
        [x0 + c, y0],
        [x1 - c, y0],
        [x1, y0 + c],
        [x1, y1 - c],
        [x1 - c, y1],
        [x0 + c, y1],
        [x0, y1 - c],
        [x0, y0 + c],
      ],
      true,
    );
    const stroke = typeof o.stroke === "string" ? o.stroke : null;
    specs.push({
      path: p,
      stroke,
      strokeWidth: i === 0 ? o.strokeWidth ?? 3 : (o.strokeWidth ?? 3) * 0.55,
      fill: i === 0 ? o.fill ?? null : null,
      lineJoin: "miter",
    });
  }
  return assemble(specs, 0, { w: o.w, h: o.h });
}

export type CornerStyle = "fan" | "flourish" | "bracket" | "ornate";

/** A corner ornament drawn for the top-left; use flipX/flipY on the layer for other corners. */
export function corner(o: { style: CornerStyle; size?: number; color: string; strokeWidth?: number }): OrnamentData {
  const S = o.size ?? 200;
  const sw = o.strokeWidth ?? 2.5;
  const specs: PartSpec[] = [];
  if (o.style === "fan") {
    const p = new Path();
    [0.34, 0.62, 0.9].forEach((k) => {
      p.M(S * k, 0).A(S * k, S * k, 0, 0, 1, 0, S * k);
    });
    p.include([S, 0], [0, S]);
    const rays = new Path();
    [0, 22.5, 45, 67.5, 90].forEach((deg) => {
      const a = rad(deg);
      rays.M(Math.cos(a) * S * 0.34, Math.sin(a) * S * 0.34).L(Math.cos(a) * S * 0.9, Math.sin(a) * S * 0.9);
    });
    const edge = new Path();
    edge.M(S, 0).L(S * 1.0, 0).M(0, S).L(0, S);
    specs.push({ path: p, stroke: o.color, strokeWidth: sw, lineCap: "butt" });
    specs.push({ path: rays, stroke: o.color, strokeWidth: sw * 0.6, lineCap: "butt" });
    const dots = new Path();
    dots.circle(S * 0.12, S * 0.12, sw * 1.8);
    specs.push({ path: dots, fill: o.color });
  } else if (o.style === "bracket") {
    const p = new Path();
    p.M(S, 0).L(0, 0).L(0, S);
    const q = new Path();
    q.M(S * 0.72, S * 0.12).L(S * 0.12, S * 0.12).L(S * 0.12, S * 0.72);
    const d = new Path();
    d.circle(S * 0.12, S * 0.12, sw * 2.2);
    specs.push({ path: p, stroke: o.color, strokeWidth: sw * 1.4, lineJoin: "miter", lineCap: "butt" });
    specs.push({ path: q, stroke: o.color, strokeWidth: sw * 0.55, lineJoin: "miter", lineCap: "butt" });
    specs.push({ path: d, fill: o.color });
  } else if (o.style === "flourish") {
    // Two arms that end in curls, joined at a small diamond.
    const arm = (flip: boolean) => {
      const m = (x: number, y: number): Pt => (flip ? [y, x] : [x, y]);
      const p = new Path();
      const a = m(S * 0.1, S * 0.1);
      p.M(a[0], a[1]);
      const c1 = m(S * 0.35, S * 0.0);
      const c2 = m(S * 0.55, S * 0.2);
      const e = m(S * 0.78, S * 0.1);
      p.C(c1[0], c1[1], c2[0], c2[1], e[0], e[1]);
      const k1 = m(S * 0.92, S * 0.04);
      const k2 = m(S * 1.0, S * 0.22);
      const k3 = m(S * 0.88, S * 0.28);
      p.C(k1[0], k1[1], k2[0], k2[1], k3[0], k3[1]);
      const k4 = m(S * 0.8, S * 0.3);
      const k5 = m(S * 0.76, S * 0.2);
      const k6 = m(S * 0.84, S * 0.19);
      p.C(k4[0], k4[1], k5[0], k5[1], k6[0], k6[1]);
      return p;
    };
    specs.push({ path: arm(false), stroke: o.color, strokeWidth: sw });
    specs.push({ path: arm(true), stroke: o.color, strokeWidth: sw });
    const dia = new Path();
    dia.poly(
      [
        [S * 0.1, S * 0.02],
        [S * 0.18, S * 0.1],
        [S * 0.1, S * 0.18],
        [S * 0.02, S * 0.1],
      ],
      true,
    );
    specs.push({ path: dia, fill: o.color });
    const l = new Path();
    l.M(S * 0.1, S * 0.3).C(S * 0.1, S * 0.4, S * 0.2, S * 0.5, S * 0.2, S * 0.62);
    l.M(S * 0.3, S * 0.1).C(S * 0.4, S * 0.1, S * 0.5, S * 0.2, S * 0.62, S * 0.2);
    specs.push({ path: l, stroke: o.color, strokeWidth: sw * 0.7 });
  } else {
    // ornate: scroll with leaf
    const p = new Path();
    p.M(S, S * 0.04).C(S * 0.5, S * 0.04, S * 0.04, S * 0.04, S * 0.04, S * 0.5).L(S * 0.04, S);
    const q = new Path();
    q.M(S * 0.18, S * 0.18).C(S * 0.4, S * 0.1, S * 0.5, S * 0.3, S * 0.36, S * 0.36).C(S * 0.28, S * 0.4, S * 0.24, S * 0.32, S * 0.3, S * 0.3);
    const lf = new Path();
    leaf(lf, [S * 0.2, S * 0.2], rad(45), S * 0.3, S * 0.07);
    const dots = new Path();
    dots.circle(S * 0.7, S * 0.04, sw * 1.2).circle(S * 0.04, S * 0.7, sw * 1.2);
    specs.push({ path: p, stroke: o.color, strokeWidth: sw });
    specs.push({ path: q, stroke: o.color, strokeWidth: sw * 0.8 });
    specs.push({ path: lf, fill: o.color });
    specs.push({ path: dots, fill: o.color });
  }
  return assemble(specs, 2);
}

export type DividerStyle = "diamond" | "leaf" | "wave" | "dots" | "stars" | "floral" | "double";

export function divider(o: { style: DividerStyle; w?: number; color: string; strokeWidth?: number }): OrnamentData {
  const W = o.w ?? 420;
  const H = 40;
  const cy = H / 2;
  const sw = o.strokeWidth ?? 2;
  const specs: PartSpec[] = [];
  const gap = 34;
  const line = new Path();
  if (o.style === "wave") {
    const wave = new Path();
    const periods = Math.max(3, Math.round(W / 60));
    const seg = W / (periods * 2);
    wave.M(0, cy);
    for (let i = 0; i < periods * 2; i++) {
      const dir = i % 2 === 0 ? -1 : 1;
      wave.Q(seg * i + seg / 2, cy + dir * 11, seg * (i + 1), cy);
    }
    specs.push({ path: wave, stroke: o.color, strokeWidth: sw });
    return assemble(specs, 2, { w: W, h: H, dx: 0, dy: 0 });
  }
  if (o.style === "dots") {
    const dots = new Path();
    const n = 7;
    for (let i = 0; i < n; i++) {
      const t = i - (n - 1) / 2;
      dots.circle(W / 2 + t * 30, cy, i === (n - 1) / 2 ? 5 : 3);
    }
    specs.push({ path: dots, fill: o.color });
    const l = new Path();
    l.M(0, cy).L(W / 2 - 130, cy).M(W / 2 + 130, cy).L(W, cy);
    specs.push({ path: l, stroke: o.color, strokeWidth: sw * 0.6, lineCap: "butt" });
    return assemble(specs, 0, { w: W, h: H });
  }
  line.M(0, cy).L(W / 2 - gap, cy).M(W / 2 + gap, cy).L(W, cy);
  specs.push({ path: line, stroke: o.color, strokeWidth: sw * 0.6, lineCap: "butt" });
  const mid = new Path();
  if (o.style === "diamond") {
    mid.poly(
      [
        [W / 2, cy - 9],
        [W / 2 + 9, cy],
        [W / 2, cy + 9],
        [W / 2 - 9, cy],
      ],
      true,
    );
    const small = new Path();
    small.circle(W / 2 - 22, cy, 2.2).circle(W / 2 + 22, cy, 2.2);
    specs.push({ path: mid, fill: o.color });
    specs.push({ path: small, fill: o.color });
  } else if (o.style === "double") {
    const l2 = new Path();
    l2.M(0, cy + 6).L(W / 2 - gap, cy + 6).M(W / 2 + gap, cy + 6).L(W, cy + 6);
    specs.push({ path: l2, stroke: o.color, strokeWidth: sw * 0.4, lineCap: "butt" });
    mid.poly(
      [
        [W / 2, cy - 12],
        [W / 2 + 12, cy + 3],
        [W / 2, cy + 18],
        [W / 2 - 12, cy + 3],
      ],
      true,
    );
    specs.push({ path: mid, stroke: o.color, strokeWidth: sw * 0.9 });
  } else if (o.style === "leaf") {
    leaf(mid, [W / 2 - 4, cy], rad(180), 26, 6.5);
    leaf(mid, [W / 2 + 4, cy], rad(0), 26, 6.5);
    leaf(mid, [W / 2, cy - 3], rad(-90), 14, 4);
    specs.push({ path: mid, fill: o.color });
  } else if (o.style === "stars") {
    mid.M(W / 2, cy - 14).Q(W / 2, cy, W / 2 + 14, cy).Q(W / 2, cy, W / 2, cy + 14).Q(W / 2, cy, W / 2 - 14, cy).Q(W / 2, cy, W / 2, cy - 14).Z();
    const s = new Path();
    s.circle(W / 2 - 30, cy, 2.4).circle(W / 2 + 30, cy, 2.4);
    specs.push({ path: mid, fill: o.color });
    specs.push({ path: s, fill: o.color });
  } else {
    for (let i = 0; i < 5; i++) petal(mid, W / 2, cy, rad(-90 + i * 72), 2, 15, 5.5, false);
    const c = new Path();
    c.circle(W / 2, cy, 2.6);
    specs.push({ path: mid, fill: o.color });
    specs.push({ path: c, fill: "#ffffff", opacity: 0.9 });
  }
  return assemble(specs, 0, { w: W, h: H });
}

/* ------------------------------------------------------------------ */
/* Symbols & patterns                                                    */
/* ------------------------------------------------------------------ */

export function starPoints(cx: number, cy: number, n: number, R: number, r: number, rotation = -90): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i < n * 2; i++) {
    const a = rad(rotation + (i * 180) / n);
    const rr = i % 2 === 0 ? R : r;
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  return pts;
}

export function star(o: { color: string; points?: number; size?: number; inner?: number; fill?: boolean; strokeWidth?: number }): OrnamentData {
  const S = o.size ?? 100;
  const p = new Path().poly(starPoints(S / 2, S / 2, o.points ?? 5, S / 2, (S / 2) * (o.inner ?? 0.42)), true);
  return assemble(
    [o.fill === false ? { path: p, stroke: o.color, strokeWidth: o.strokeWidth ?? 2.5, lineJoin: "miter" } : { path: p, fill: o.color, lineJoin: "miter" }],
    2,
  );
}

export function sparkle(o: { color: string; size?: number }): OrnamentData {
  const S = o.size ?? 100;
  const c = S / 2;
  const p = new Path();
  p.M(c, 0).Q(c, c, S, c).Q(c, c, c, S).Q(c, c, 0, c).Q(c, c, c, 0).Z();
  return assemble([{ path: p, fill: o.color }], 0, { w: S, h: S });
}

export function crescent(o: { color: string; size?: number }): OrnamentData {
  const R = (o.size ?? 120) / 2;
  const r = R * 0.8;
  const d = R * 0.38;
  const x = (R * R - r * r + d * d) / (2 * d);
  const y = Math.sqrt(Math.max(0, R * R - x * x));
  const p = new Path();
  p.M(x, -y).A(R, R, 0, 1, 0, x, y).A(r, r, 0, 1, 1, x, -y).Z();
  p.include([-R, -R], [R, R]);
  return assemble([{ path: p, fill: o.color }], 2);
}

export function heart(o: { color: string; size?: number; fill?: boolean; strokeWidth?: number }): OrnamentData {
  const S = o.size ?? 100;
  const p = new Path();
  p.M(S / 2, S * 0.92)
    .C(S * 0.05, S * 0.58, -S * 0.05, S * 0.18, S * 0.25, S * 0.08)
    .C(S * 0.4, S * 0.03, S * 0.5, S * 0.14, S / 2, S * 0.24)
    .C(S * 0.5, S * 0.14, S * 0.6, S * 0.03, S * 0.75, S * 0.08)
    .C(S * 1.05, S * 0.18, S * 0.95, S * 0.58, S / 2, S * 0.92)
    .Z();
  return assemble(
    [o.fill === false ? { path: p, stroke: o.color, strokeWidth: o.strokeWidth ?? 3 } : { path: p, fill: o.color }],
    3,
  );
}

export function rings(o: { color: string; size?: number; strokeWidth?: number }): OrnamentData {
  const S = o.size ?? 140;
  const r = S * 0.3;
  const sw = o.strokeWidth ?? 4;
  const a = new Path().circle(S * 0.38, S * 0.5, r);
  const b = new Path().circle(S * 0.62, S * 0.5, r);
  return assemble(
    [
      { path: a, stroke: o.color, strokeWidth: sw },
      { path: b, stroke: o.color, strokeWidth: sw },
    ],
    2,
  );
}

export function sunburst(o: { color: string; rays?: number; size?: number; core?: number }): OrnamentData {
  const S = o.size ?? 400;
  const R = S / 2;
  const n = o.rays ?? 24;
  const p = new Path();
  for (let i = 0; i < n; i++) {
    const a = ((i + 0.5) / n) * Math.PI * 2;
    const w = (Math.PI / n) * 0.55;
    const r0 = R * (o.core ?? 0.42);
    p.poly(
      [
        [Math.cos(a - w * 0.35) * r0, Math.sin(a - w * 0.35) * r0],
        [Math.cos(a - w * 0.1) * R, Math.sin(a - w * 0.1) * R],
        [Math.cos(a + w * 0.1) * R, Math.sin(a + w * 0.1) * R],
        [Math.cos(a + w * 0.35) * r0, Math.sin(a + w * 0.35) * r0],
      ],
      true,
    );
  }
  const c = new Path().circle(0, 0, R * (o.core ?? 0.42) * 0.82);
  return assemble([{ path: p, fill: o.color }, { path: c, fill: o.color }], 0, { w: S, h: S, dx: R, dy: R });
}

/** Concentric half-circle bands (boho "rainbow"). */
export function rainbow(o: { colors: string[]; size?: number; band?: number }): OrnamentData {
  const S = o.size ?? 500;
  const band = o.band ?? S / (o.colors.length * 2 + 2);
  const specs: PartSpec[] = o.colors.map((color, i) => {
    const r = S / 2 - band / 2 - i * band;
    const p = new Path();
    p.M(S / 2 - r, S / 2).A(r, r, 0, 0, 1, S / 2 + r, S / 2);
    p.include([S / 2, S / 2 - r]);
    return { path: p, stroke: color, strokeWidth: band, lineCap: "butt" };
  });
  return assemble(specs, 0, { w: S, h: S / 2 });
}

export function ringsDots(o: { color: string; size?: number; dots?: number; strokeWidth?: number }): OrnamentData {
  const S = o.size ?? 300;
  const R = S / 2 - 6;
  const sw = o.strokeWidth ?? 2.5;
  const c1 = new Path().circle(S / 2, S / 2, R);
  const c2 = new Path().circle(S / 2, S / 2, R - 14);
  const dots = new Path();
  const n = o.dots ?? 48;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    dots.circle(S / 2 + Math.cos(a) * (R - 7), S / 2 + Math.sin(a) * (R - 7), 1.6);
  }
  return assemble(
    [
      { path: c1, stroke: o.color, strokeWidth: sw },
      { path: c2, stroke: o.color, strokeWidth: sw * 0.5 },
      { path: dots, fill: o.color },
    ],
    0,
    { w: S, h: S },
  );
}

/** Eight-pointed star (two overlapping squares) with an inner echo. */
export function islamicStar(o: { color: string; size?: number; strokeWidth?: number; fill?: Paint | null; echo?: boolean }): OrnamentData {
  const S = o.size ?? 260;
  const R = S / 2 - 4;
  const sw = o.strokeWidth ?? 2.5;
  const pts = (rr: number): Pt[] => {
    const out: Pt[] = [];
    for (let i = 0; i < 16; i++) {
      const a = rad(-90 + i * 22.5);
      const r = i % 2 === 0 ? rr : rr * 0.7654;
      out.push([S / 2 + Math.cos(a) * r, S / 2 + Math.sin(a) * r]);
    }
    return out;
  };
  const specs: PartSpec[] = [
    { path: new Path().poly(pts(R), true), stroke: o.color, strokeWidth: sw, fill: o.fill ?? null, lineJoin: "miter" },
  ];
  if (o.echo !== false) {
    specs.push({ path: new Path().poly(pts(R * 0.62), true), stroke: o.color, strokeWidth: sw * 0.6, lineJoin: "miter" });
    specs.push({ path: new Path().circle(S / 2, S / 2, R * 0.12), fill: o.color });
  }
  return assemble(specs, 0, { w: S, h: S });
}

/** Full-bleed geometric lattice of eight-pointed stars. Use at low opacity as a background. */
export function islamicPattern(o: { color: string; w: number; h: number; cell?: number; strokeWidth?: number }): OrnamentData {
  const cell = o.cell ?? 110;
  const R = cell / 2;
  const sw = o.strokeWidth ?? 1.4;
  const big = new Path();
  const small = new Path();
  const diamonds = new Path();
  const cols = Math.ceil(o.w / cell) + 1;
  const rows = Math.ceil(o.h / cell) + 1;
  const star8 = (cx: number, cy: number, rr: number, p: Path) => {
    const pts: Pt[] = [];
    for (let i = 0; i < 16; i++) {
      const a = rad(-90 + i * 22.5);
      const r = i % 2 === 0 ? rr : rr * 0.7654;
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
    p.poly(pts, true);
  };
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const cx = i * cell;
      const cy = j * cell;
      star8(cx, cy, R, big);
      star8(cx, cy, R * 0.5, small);
      // diamond in the gap between four stars
      const gx = cx + cell / 2;
      const gy = cy + cell / 2;
      diamonds.poly(
        [
          [gx, gy - R * 0.32],
          [gx + R * 0.32, gy],
          [gx, gy + R * 0.32],
          [gx - R * 0.32, gy],
        ],
        true,
      );
    }
  }
  return assemble(
    [
      { path: big, stroke: o.color, strokeWidth: sw, lineJoin: "miter" },
      { path: small, stroke: o.color, strokeWidth: sw * 0.7, lineJoin: "miter" },
      { path: diamonds, stroke: o.color, strokeWidth: sw * 0.7, lineJoin: "miter" },
    ],
    0,
    { w: o.w, h: o.h, dx: 0, dy: 0 },
  );
}

/** Lotus / mandala medallion. */
export function mandala(o: { color: string; accent?: string; size?: number; strokeWidth?: number; filled?: boolean }): OrnamentData {
  const S = o.size ?? 420;
  const R = S / 2 - 6;
  const sw = o.strokeWidth ?? 2;
  const c = S / 2;
  const specs: PartSpec[] = [];
  const outerCircle = new Path().circle(c, c, R);
  specs.push({ path: outerCircle, stroke: o.color, strokeWidth: sw });

  const ringA = new Path();
  for (let i = 0; i < 24; i++) petal(ringA, c, c, rad((i * 360) / 24 - 90), R * 0.7, R * 0.97, R * 0.065, true);
  specs.push({ path: ringA, stroke: o.color, strokeWidth: sw * 0.8, fill: o.filled ? o.color : null, opacity: o.filled ? 0.9 : 1 });

  const dots = new Path();
  for (let i = 0; i < 48; i++) {
    const a = rad((i * 360) / 48);
    dots.circle(c + Math.cos(a) * R * 0.64, c + Math.sin(a) * R * 0.64, sw * 0.9);
  }
  specs.push({ path: dots, fill: o.accent ?? o.color });

  const ringB = new Path();
  for (let i = 0; i < 12; i++) petal(ringB, c, c, rad((i * 360) / 12 - 75), R * 0.3, R * 0.58, R * 0.12, false);
  specs.push({ path: ringB, stroke: o.color, strokeWidth: sw, fill: o.filled ? o.accent ?? o.color : null, opacity: o.filled ? 0.85 : 1 });

  const ringC = new Path();
  for (let i = 0; i < 8; i++) petal(ringC, c, c, rad((i * 360) / 8 - 90), R * 0.08, R * 0.34, R * 0.07, true);
  specs.push({ path: ringC, stroke: o.color, strokeWidth: sw * 0.9, fill: o.filled ? o.color : null });

  specs.push({ path: new Path().circle(c, c, R * 0.07), fill: o.accent ?? o.color });
  return assemble(specs, 0, { w: S, h: S });
}

/** A scalloped band along the top or bottom edge. */
export function scallops(o: { color: string; w: number; r?: number; fill?: boolean; strokeWidth?: number }): OrnamentData {
  const r = o.r ?? 28;
  const n = Math.ceil(o.w / (r * 2));
  const p = new Path();
  p.M(0, 0);
  for (let i = 0; i < n; i++) p.A(r, r, 0, 0, 0, (i + 1) * r * 2, 0);
  p.include([0, r], [n * r * 2, 0]);
  if (o.fill) p.L(n * r * 2, -r).L(0, -r).Z();
  return assemble([o.fill ? { path: p, fill: o.color } : { path: p, stroke: o.color, strokeWidth: o.strokeWidth ?? 2.5 }], 0);
}

/** Overlapping diamond lattice (fine line pattern). */
export function diamondLattice(o: { color: string; w: number; h: number; cell?: number; strokeWidth?: number }): OrnamentData {
  const cell = o.cell ?? 70;
  const p = new Path();
  for (let x = -o.h; x <= o.w + o.h; x += cell) {
    p.M(x, 0).L(x + o.h, o.h);
    p.M(x, o.h).L(x + o.h, 0);
  }
  return assemble([{ path: p, stroke: o.color, strokeWidth: o.strokeWidth ?? 1.2, lineCap: "butt" }], 0, { w: o.w, h: o.h });
}

/** Hand-drawn style ribbon banner (for short text like "Save the date"). */
export function banner(o: { color: string; w?: number; h?: number; stroke?: string | null }): OrnamentData {
  const W = o.w ?? 560;
  const H = o.h ?? 90;
  const t = 56;
  const p = new Path();
  p.poly(
    [
      [t, 0],
      [W - t, 0],
      [W - t, H],
      [t, H],
    ],
    true,
  );
  const l = new Path().poly(
    [
      [t, H * 0.14],
      [0, H * 0.14],
      [t * 0.4, H * 0.5],
      [0, H * 0.86],
      [t, H * 0.86],
    ],
    true,
  );
  const r = new Path().poly(
    [
      [W - t, H * 0.14],
      [W, H * 0.14],
      [W - t * 0.4, H * 0.5],
      [W, H * 0.86],
      [W - t, H * 0.86],
    ],
    true,
  );
  return assemble(
    [
      { path: l, fill: o.color, stroke: o.stroke ?? null, strokeWidth: 1.5, opacity: 0.8, lineJoin: "miter" },
      { path: r, fill: o.color, stroke: o.stroke ?? null, strokeWidth: 1.5, opacity: 0.8, lineJoin: "miter" },
      { path: p, fill: o.color, stroke: o.stroke ?? null, strokeWidth: 1.5, lineJoin: "miter" },
    ],
    0,
    { w: W, h: H },
  );
}
