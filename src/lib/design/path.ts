import type { OrnamentPart, Paint } from "./types";

export type Pt = [number, number];

export const rad = (deg: number) => (deg * Math.PI) / 180;
export const r2 = (n: number) => Math.round(n * 100) / 100;

/** Tiny SVG path builder that tracks real curve bounds (by sampling). */
export class Path {
  private segs: { c: string; p: number[] }[] = [];
  private cur: Pt = [0, 0];
  private start: Pt = [0, 0];
  pts: Pt[] = [];

  M(x: number, y: number) {
    this.segs.push({ c: "M", p: [x, y] });
    this.cur = [x, y];
    this.start = [x, y];
    this.pts.push([x, y]);
    return this;
  }
  L(x: number, y: number) {
    this.segs.push({ c: "L", p: [x, y] });
    this.cur = [x, y];
    this.pts.push([x, y]);
    return this;
  }
  Q(cx: number, cy: number, x: number, y: number) {
    const [x0, y0] = this.cur;
    for (let i = 1; i <= 8; i++) {
      const t = i / 8;
      const u = 1 - t;
      this.pts.push([u * u * x0 + 2 * u * t * cx + t * t * x, u * u * y0 + 2 * u * t * cy + t * t * y]);
    }
    this.segs.push({ c: "Q", p: [cx, cy, x, y] });
    this.cur = [x, y];
    return this;
  }
  C(c1x: number, c1y: number, c2x: number, c2y: number, x: number, y: number) {
    const [x0, y0] = this.cur;
    for (let i = 1; i <= 10; i++) {
      const t = i / 10;
      const u = 1 - t;
      this.pts.push([
        u * u * u * x0 + 3 * u * u * t * c1x + 3 * u * t * t * c2x + t * t * t * x,
        u * u * u * y0 + 3 * u * u * t * c1y + 3 * u * t * t * c2y + t * t * t * y,
      ]);
    }
    this.segs.push({ c: "C", p: [c1x, c1y, c2x, c2y, x, y] });
    this.cur = [x, y];
    return this;
  }
  /** Arc. Bounds only account for the end point; pass bounds with `include`. */
  A(rx: number, ry: number, rot: number, large: 0 | 1, sweep: 0 | 1, x: number, y: number) {
    this.segs.push({ c: "A", p: [rx, ry, rot, large, sweep, x, y] });
    this.cur = [x, y];
    this.pts.push([x, y]);
    return this;
  }
  Z() {
    this.segs.push({ c: "Z", p: [] });
    this.cur = this.start;
    return this;
  }
  include(...pts: Pt[]) {
    this.pts.push(...pts);
    return this;
  }
  /** Circle as two arcs (full bounds included). */
  circle(cx: number, cy: number, r: number) {
    this.M(cx - r, cy).A(r, r, 0, 1, 0, cx + r, cy).A(r, r, 0, 1, 0, cx - r, cy).Z();
    this.include([cx, cy - r], [cx, cy + r]);
    return this;
  }
  /** Polyline through points. */
  poly(points: Pt[], close = false) {
    points.forEach(([x, y], i) => (i === 0 ? this.M(x, y) : this.L(x, y)));
    if (close) this.Z();
    return this;
  }
  bounds(): [number, number, number, number] {
    if (!this.pts.length) return [0, 0, 0, 0];
    let a = Infinity,
      b = Infinity,
      c = -Infinity,
      d = -Infinity;
    for (const [x, y] of this.pts) {
      if (x < a) a = x;
      if (y < b) b = y;
      if (x > c) c = x;
      if (y > d) d = y;
    }
    return [a, b, c, d];
  }
  toString(dx = 0, dy = 0) {
    return this.segs
      .map(({ c, p }) => {
        if (c === "Z") return "Z";
        if (c === "A") {
          const [rx, ry, rot, large, sweep, x, y] = p;
          return `A${r2(rx)} ${r2(ry)} ${rot} ${large} ${sweep} ${r2(x + dx)} ${r2(y + dy)}`;
        }
        const out: string[] = [];
        for (let i = 0; i < p.length; i += 2) out.push(`${r2(p[i] + dx)} ${r2(p[i + 1] + dy)}`);
        return c + out.join(" ");
      })
      .join("");
  }
}

export interface PartSpec {
  path: Path;
  fill?: Paint | null;
  stroke?: string | null;
  strokeWidth?: number;
  opacity?: number;
  lineCap?: "butt" | "round" | "square";
  lineJoin?: "miter" | "round" | "bevel";
}

export interface OrnamentData {
  vbW: number;
  vbH: number;
  parts: OrnamentPart[];
}

/** Combine parts, crop to their union bounds (plus padding) and normalise to the origin. */
export function assemble(specs: PartSpec[], pad = 0, fixed?: { w: number; h: number; dx?: number; dy?: number }): OrnamentData {
  let dx = 0;
  let dy = 0;
  let w: number;
  let h: number;
  if (fixed) {
    dx = fixed.dx ?? 0;
    dy = fixed.dy ?? 0;
    w = fixed.w;
    h = fixed.h;
  } else {
    let a = Infinity,
      b = Infinity,
      c = -Infinity,
      d = -Infinity;
    for (const s of specs) {
      const [x0, y0, x1, y1] = s.path.bounds();
      const sw = (s.stroke ? s.strokeWidth ?? 0 : 0) / 2;
      a = Math.min(a, x0 - sw);
      b = Math.min(b, y0 - sw);
      c = Math.max(c, x1 + sw);
      d = Math.max(d, y1 + sw);
    }
    dx = -a + pad;
    dy = -b + pad;
    w = c - a + pad * 2;
    h = d - b + pad * 2;
  }
  return {
    vbW: r2(w),
    vbH: r2(h),
    parts: specs.map((s) => ({
      d: s.path.toString(dx, dy),
      fill: s.fill ?? null,
      stroke: s.stroke ?? null,
      strokeWidth: s.strokeWidth ?? 0,
      opacity: s.opacity,
      lineCap: s.lineCap ?? "round",
      lineJoin: s.lineJoin ?? "round",
    })),
  };
}

/** A pointed leaf from `base` along `angle` (radians). `round` makes it fuller (eucalyptus-style). */
export function leaf(p: Path, base: Pt, angle: number, len: number, width: number, round = false) {
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  const nx = -dy;
  const ny = dx;
  const at = (t: number, s: number): Pt => [base[0] + dx * len * t + nx * width * s, base[1] + dy * len * t + ny * width * s];
  const tip = at(1, 0);
  const a1 = round ? at(0.05, 1.45) : at(0.25, 1.15);
  const a2 = round ? at(0.95, 1.2) : at(0.72, 0.95);
  const b1 = round ? at(0.95, -1.2) : at(0.72, -0.95);
  const b2 = round ? at(0.05, -1.45) : at(0.25, -1.15);
  p.M(base[0], base[1]).C(a1[0], a1[1], a2[0], a2[1], tip[0], tip[1]).C(b1[0], b1[1], b2[0], b2[1], base[0], base[1]).Z();
}

/** A rounded petal pointing outward from the origin-relative polar position. */
export function petal(p: Path, cx: number, cy: number, angle: number, r0: number, r1: number, halfW: number, pointed = true) {
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  const nx = -dy;
  const ny = dx;
  const pt = (r: number, s: number): Pt => [cx + dx * r + nx * s, cy + dy * r + ny * s];
  const len = r1 - r0;
  const b = pt(r0, 0);
  const tip = pt(r1, 0);
  if (pointed) {
    const c1 = pt(r0 + len * 0.3, halfW * 1.25);
    const c2 = pt(r0 + len * 0.78, halfW * 0.7);
    const d1 = pt(r0 + len * 0.78, -halfW * 0.7);
    const d2 = pt(r0 + len * 0.3, -halfW * 1.25);
    p.M(b[0], b[1]).C(c1[0], c1[1], c2[0], c2[1], tip[0], tip[1]).C(d1[0], d1[1], d2[0], d2[1], b[0], b[1]).Z();
  } else {
    const c1 = pt(r0 + len * 0.1, halfW * 1.5);
    const c2 = pt(r0 + len * 1.05, halfW * 1.4);
    const d1 = pt(r0 + len * 1.05, -halfW * 1.4);
    const d2 = pt(r0 + len * 0.1, -halfW * 1.5);
    p.M(b[0], b[1]).C(c1[0], c1[1], c2[0], c2[1], tip[0], tip[1]).C(d1[0], d1[1], d2[0], d2[1], b[0], b[1]).Z();
  }
}
