import { mandala } from "../design/ornaments";
import { assemble, leaf, Path, petal, rad, type OrnamentData, type PartSpec, type Pt } from "../design/path";

type Bez = [Pt, Pt, Pt, Pt];

function bez([p0, p1, p2, p3]: Bez, t: number): Pt {
  const u = 1 - t;
  return [
    u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
    u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
  ];
}
function bezTan([p0, p1, p2, p3]: Bez, t: number): number {
  const u = 1 - t;
  const dx = 3 * u * u * (p1[0] - p0[0]) + 6 * u * t * (p2[0] - p1[0]) + 3 * t * t * (p3[0] - p2[0]);
  const dy = 3 * u * u * (p1[1] - p0[1]) + 6 * u * t * (p2[1] - p1[1]) + 3 * t * t * (p3[1] - p2[1]);
  return Math.atan2(dy, dx);
}

/**
 * Alpona garland: a half-lotus rising from a base line at the centre, with a
 * symmetrical flowing vine, filled leaves, spiral tendrils and dotted curves
 * to either side. Drawn with the lotus pointing up; use flipY for the top edge.
 */
export function garland(o: { color: string; accent: string; w?: number }): OrnamentData {
  const W = 1000;
  const CXg = W / 2;
  const BY = 176; // base line
  const H = 236;
  const stem = new Path();
  const leaves = new Path();
  const leafOutline = new Path();
  const dots = new Path();
  const accentDots = new Path();
  const spiral = new Path();

  // flowing stem, right side, in offsets from (CXg, BY)
  const segs: Bez[] = [
    [[64, 0], [112, -38], [168, -38], [214, -4]],
    [[214, -4], [258, 30], [316, 32], [358, 0]],
    [[358, 0], [388, -22], [420, -30], [446, -14]],
  ];
  for (const s of [1, -1]) {
    const m = (p: Pt): Pt => [CXg + s * p[0], BY + p[1]];
    segs.forEach((seg, si) => {
      const b = seg.map(m) as Bez;
      stem.M(b[0][0], b[0][1]).C(b[1][0], b[1][1], b[2][0], b[2][1], b[3][0], b[3][1]);
      // dotted curve parallel to the stem (below), and an accent dot row above
      const steps = 11;
      for (let i = 1; i < steps; i++) {
        const t = i / steps;
        const [x, y] = bez(b, t);
        const a = bezTan(b, t) + Math.PI / 2;
        let nx = Math.cos(a);
        let ny = Math.sin(a);
        if (ny < 0) {
          nx = -nx;
          ny = -ny;
        }
        dots.circle(x + nx * 15, y + ny * 15, 1.9);
      }
      // leaf pairs at segment midpoints
      const [lx, ly] = bez(b, 0.5);
      const ta = bezTan(b, 0.5);
      const len = 46 - si * 6;
      const wd = 11 - si;
      leaf(leaves, [lx, ly], ta - rad(50), len, wd);
      leaf(leafOutline, [lx, ly], ta + rad(50), len * 0.85, wd * 0.9);
      const [ex, ey] = bez(b, 1);
      accentDots.circle(ex, ey, 3.2);
    });
    // spiral tendril at the vine end
    const e = m([446, -14]);
    spiral.M(e[0], e[1]);
    const c = (dx: number, dy: number): Pt => [e[0] + s * dx, e[1] + dy];
    const a1 = c(22, 4),
      a2 = c(30, 30),
      a3 = c(10, 36);
    spiral.C(a1[0], a1[1], a2[0], a2[1], a3[0], a3[1]);
    const b1 = c(-4, 40),
      b2 = c(-8, 20),
      b3 = c(6, 20);
    spiral.C(b1[0], b1[1], b2[0], b2[1], b3[0], b3[1]);
    accentDots.circle(c(6, 20)[0], c(6, 20)[1], 2.6);
    // small bud at the first crest
    const bud = m([164, -44]);
    leaf(leaves, [bud[0], bud[1] + 4], rad(-90), 24, 6.5);
  }

  // half lotus
  const outer = new Path();
  const inner = new Path();
  const petals: [number, number, number][] = [
    [0, 100, 23],
    [27, 90, 21],
    [-27, 90, 21],
    [53, 72, 19],
    [-53, 72, 19],
    [78, 50, 15],
    [-78, 50, 15],
  ];
  petals.forEach(([a, len, hw]) => petal(outer, CXg, BY, rad(-90 + a), 8, len, hw));
  [[0, 62, 12], [30, 54, 11], [-30, 54, 11]].forEach(([a, len, hw]) => petal(inner, CXg, BY, rad(-90 + a), 8, len, hw));
  const bowl = new Path()
    .M(CXg - 70, BY + 2)
    .C(CXg - 44, BY + 26, CXg + 44, BY + 26, CXg + 70, BY + 2);
  const bowlIn = new Path().M(CXg - 44, BY + 6).C(CXg - 24, BY + 18, CXg + 24, BY + 18, CXg + 44, BY + 6);
  const tipDots = new Path();
  petals.forEach(([a, len]) => {
    const r = rad(-90 + a);
    tipDots.circle(CXg + Math.cos(r) * (len + 11), BY + Math.sin(r) * (len + 11), 2.4);
  });
  const seed = new Path().circle(CXg, BY - 22, 5);

  const specs: PartSpec[] = [
    { path: stem, stroke: o.color, strokeWidth: 3, lineCap: "round" },
    { path: spiral, stroke: o.color, strokeWidth: 2.6 },
    { path: leaves, fill: o.color, opacity: 0.95 },
    { path: leafOutline, stroke: o.color, strokeWidth: 1.5 },
    { path: dots, fill: o.color, opacity: 0.9 },
    { path: accentDots, fill: o.accent },
    { path: outer, fill: o.color, opacity: 0.2 },
    { path: outer, stroke: o.color, strokeWidth: 2.6 },
    { path: inner, fill: o.color, opacity: 0.9 },
    { path: bowl, stroke: o.color, strokeWidth: 2.6 },
    { path: bowlIn, stroke: o.color, strokeWidth: 1.6 },
    { path: tipDots, fill: o.accent },
    { path: seed, fill: o.accent },
  ];
  return assemble(specs, 0, { w: W, h: H });
}

/** Large faint lotus mandala used behind the text. */
export function lotusBackdrop(color: string, size = 940): OrnamentData {
  return mandala({ color, accent: color, size, strokeWidth: 1.6 });
}

/** Ring of alpona petals + dotted rings around an oval photo (rx, ry = photo half sizes). */
export function ovalPetalRing(o: { rx: number; ry: number; color: string; accent: string }): OrnamentData {
  const pad = 78;
  const cx = o.rx + pad;
  const cy = o.ry + pad;
  const W = (o.rx + pad) * 2;
  const H = (o.ry + pad) * 2;
  const outerP = new Path();
  const innerP = new Path();
  const dots = new Path();
  const accent = new Path();
  const ring = new Path();
  const n = 34;
  const pt = (t: number, grow: number): Pt => {
    const nx = Math.cos(t) / o.rx;
    const ny = Math.sin(t) / o.ry;
    const k = Math.hypot(nx, ny);
    return [cx + Math.cos(t) * o.rx + (nx / k) * grow, cy + Math.sin(t) * o.ry + (ny / k) * grow];
  };
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2;
    const [bx, by] = pt(t, 14);
    const nx = Math.cos(t) / o.rx;
    const ny = Math.sin(t) / o.ry;
    const ang = Math.atan2(ny, nx);
    petal(outerP, bx, by, ang, 0, 46, 9.5);
    petal(innerP, bx, by, ang, 0, 26, 5);
    const [dx, dy] = pt(t + Math.PI / n, 66);
    accent.circle(dx, dy, 2.6);
  }
  for (let i = 0; i < n * 2; i++) {
    const t = (i / (n * 2)) * Math.PI * 2;
    const [dx, dy] = pt(t, 9);
    dots.circle(dx, dy, 1.5);
  }
  const steps = 120;
  for (let i = 0; i <= steps; i++) {
    const [x, y] = pt((i / steps) * Math.PI * 2, 2);
    if (i === 0) ring.M(x, y);
    else ring.L(x, y);
  }
  ring.Z();
  return assemble(
    [
      { path: outerP, fill: o.color, opacity: 0.16 },
      { path: outerP, stroke: o.color, strokeWidth: 2.2 },
      { path: innerP, fill: o.color, opacity: 0.85 },
      { path: dots, fill: o.accent },
      { path: accent, fill: o.accent },
      { path: ring, stroke: o.accent, strokeWidth: 2.4 },
    ],
    0,
    { w: W, h: H },
  );
}

/** Small alpona rosette (used as a separator). */
export function rosette(color: string, accent: string, size = 70): OrnamentData {
  const c = size / 2;
  const p = new Path();
  const q = new Path();
  for (let i = 0; i < 8; i++) {
    petal(p, c, c, rad(i * 45 - 90), 5, c - 3, c * 0.2);
    petal(q, c, c, rad(i * 45 - 67.5), 5, c * 0.55, c * 0.1);
  }
  const d = new Path().circle(c, c, 3.4);
  return assemble(
    [
      { path: p, stroke: color, strokeWidth: 1.6, fill: color, opacity: 0.25 },
      { path: p, stroke: color, strokeWidth: 1.6 },
      { path: q, fill: accent },
      { path: d, fill: color },
    ],
    0,
    { w: size, h: size },
  );
}
