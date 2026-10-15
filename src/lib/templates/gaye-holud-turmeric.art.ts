import { assemble, leaf, Path, petal, rad, type OrnamentData, type PartSpec, type Pt } from "../design/path";

export function quadPts(p0: Pt, c: Pt, p1: Pt, n = 120): Pt[] {
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    const u = 1 - t;
    return [u * u * p0[0] + 2 * u * t * c[0] + t * t * p1[0], u * u * p0[1] + 2 * u * t * c[1] + t * t * p1[1]] as Pt;
  });
}

export function ellipsePts(cx: number, cy: number, rx: number, ry: number, n = 200): Pt[] {
  return Array.from({ length: n + 1 }, (_, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry] as Pt;
  });
}

export function swayPts(x: number, y0: number, len: number, amp = 6, n = 120): Pt[] {
  return Array.from({ length: n + 1 }, (_, i) => [x + Math.sin((i / n) * len * 0.018) * amp, y0 + (i / n) * len] as Pt);
}

const VARIANTS: string[][] = [
  ["#f08c00", "#ffb300", "#ffd54a"],
  ["#ff9f1a", "#ffc233", "#ffe27a"],
  ["#e87400", "#ffa21f", "#ffcb5c"],
];

/** A string of marigold blooms with leaves along a polyline (all coordinates in the ornament's own box). */
export function marigoldString(o: { pts: Pt[]; w: number; h: number; r?: number; spacing?: number; tassel?: boolean; leaves?: boolean; closed?: boolean }): OrnamentData {
  const r = o.r ?? 28;
  const spacing = o.spacing ?? r * 1.8;
  const cum: number[] = [0];
  for (let i = 1; i < o.pts.length; i++) cum.push(cum[i - 1] + Math.hypot(o.pts[i][0] - o.pts[i - 1][0], o.pts[i][1] - o.pts[i - 1][1]));
  const total = cum[cum.length - 1];
  const at = (s: number): { p: Pt; a: number } => {
    let i = 1;
    while (i < cum.length - 1 && cum[i] < s) i++;
    const t = (s - cum[i - 1]) / Math.max(1e-6, cum[i] - cum[i - 1]);
    const a = o.pts[i - 1];
    const b = o.pts[i];
    return { p: [a[0] + (b[0] - a[0]) * Math.min(1, Math.max(0, t)), a[1] + (b[1] - a[1]) * Math.min(1, Math.max(0, t))], a: Math.atan2(b[1] - a[1], b[0] - a[0]) };
  };

  const thread = new Path();
  o.pts.forEach(([x, y], i) => (i === 0 ? thread.M(x, y) : thread.L(x, y)));
  const leaves = new Path();
  const leafLines = new Path();
  const rings: Path[][] = VARIANTS.map(() => [new Path(), new Path(), new Path()]);
  const centers = new Path();
  const single = total < 1;
  const n = single ? 1 : o.closed ? Math.round(total / spacing) : Math.floor((total - r * 1.6) / spacing) + 1;
  const step = o.closed ? total / n : spacing;
  const start = single || o.closed ? 0 : r * 0.9 + (total - r * 1.8 - (n - 1) * spacing) / 2;
  const bloom = (cx: number, cy: number, rr: number, k: number) => {
    const v = k % 3;
    const rot = (k * 37) % 360;
    const [a, b, c] = rings[v];
    for (let i = 0; i < 13; i++) petal(a, cx, cy, rad(rot + (i * 360) / 13), rr * 0.2, rr, rr * 0.27, false);
    for (let i = 0; i < 10; i++) petal(b, cx, cy, rad(rot + 14 + (i * 360) / 10), rr * 0.14, rr * 0.74, rr * 0.25, false);
    for (let i = 0; i < 7; i++) petal(c, cx, cy, rad(rot + 30 + (i * 360) / 7), rr * 0.08, rr * 0.46, rr * 0.2, false);
    centers.circle(cx, cy, rr * 0.09);
  };
  for (let k = 0; k < n; k++) {
    const { p } = at(start + k * step);
    bloom(p[0], p[1], r, k);
    if (o.leaves !== false && (o.closed || k < n - 1)) {
      const m = at(start + k * step + step / 2);
      leaf(leaves, m.p, m.a + rad(72), r * 1.05, r * 0.3);
      leaf(leaves, m.p, m.a - rad(72), r * 1.05, r * 0.3);
      leafLines.M(m.p[0], m.p[1]).L(m.p[0] + Math.cos(m.a + rad(72)) * r * 0.8, m.p[1] + Math.sin(m.a + rad(72)) * r * 0.8);
      leafLines.M(m.p[0], m.p[1]).L(m.p[0] + Math.cos(m.a - rad(72)) * r * 0.8, m.p[1] + Math.sin(m.a - rad(72)) * r * 0.8);
    }
  }
  if (o.tassel) {
    const e = o.pts[o.pts.length - 1];
    leaf(leaves, [e[0], e[1] - r * 0.3], rad(90 + 28), r * 1.5, r * 0.34);
    leaf(leaves, [e[0], e[1] - r * 0.3], rad(90 - 28), r * 1.5, r * 0.34);
    bloom(e[0], e[1] + r * 0.2, r * 1.3, 2);
  }
  const specs: PartSpec[] = [
    { path: thread, stroke: "#6b4a12", strokeWidth: 2.2 },
    { path: leaves, fill: "#2f7d3a", stroke: "#1e5a2a", strokeWidth: 1 },
    { path: leafLines, stroke: "#a8d98b", strokeWidth: 1, opacity: 0.8 },
  ];
  for (let ring = 0; ring < 3; ring++) {
    for (let v = 0; v < 3; v++) specs.push({ path: rings[v][ring], fill: VARIANTS[v][ring], stroke: "rgba(140,64,0,0.5)", strokeWidth: 0.9 });
  }
  specs.push({ path: centers, fill: "#c4570a" });
  return assemble(specs, 0, { w: o.w, h: o.h });
}

/** A single marigold bloom, size x size. */
export function singleMarigold(size = 100): OrnamentData {
  const r = size / 2 - 2;
  return marigoldString({ pts: [[size / 2, size / 2], [size / 2 + 0.01, size / 2]], w: size, h: size, r, spacing: size, leaves: false });
}

/** Concentric dotted halo rings (turmeric paste rangoli) behind the title. */
export function halo(color: string, size = 700): OrnamentData {
  const c = size / 2;
  const specs: PartSpec[] = [];
  const dots = new Path();
  [0.98, 0.86].forEach((f, k) => {
    const n = k === 0 ? 96 : 72;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      dots.circle(c + Math.cos(a) * c * f, c + Math.sin(a) * c * f, k === 0 ? 3.2 : 2.4);
    }
  });
  const ring = new Path().circle(c, c, c * 0.92).circle(c, c, c * 0.74);
  const petals = new Path();
  for (let i = 0; i < 36; i++) petal(petals, c, c, rad(i * 10), c * 0.74, c * 0.9, c * 0.04);
  specs.push({ path: ring, stroke: color, strokeWidth: 1.6 }, { path: petals, stroke: color, strokeWidth: 1.4 }, { path: dots, fill: color });
  return assemble(specs, 0, { w: size, h: size });
}
