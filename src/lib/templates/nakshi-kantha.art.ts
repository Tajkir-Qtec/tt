import { assemble, Path, rad, type OrnamentData, type PartSpec, type Pt } from "../design/path";

/* Nakshi kantha embroidery art: everything is built from running-stitch segments. */

function bz(a: Pt, b: Pt, c: Pt, d: Pt, n = 14): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const u = 1 - t;
    out.push([
      u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0],
      u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1],
    ]);
  }
  return out;
}

export const circlePts = (cx: number, cy: number, r: number, n = 96): Pt[] =>
  Array.from({ length: n + 1 }, (_, i) => [cx + Math.cos((i / n) * Math.PI * 2) * r, cy + Math.sin((i / n) * Math.PI * 2) * r] as Pt);

export function petalPts(cx: number, cy: number, ang: number, r0: number, r1: number, hw: number): Pt[] {
  const dx = Math.cos(ang);
  const dy = Math.sin(ang);
  const nx = -dy;
  const ny = dx;
  const pt = (r: number, s: number): Pt => [cx + dx * r + nx * s, cy + dy * r + ny * s];
  const len = r1 - r0;
  const b = pt(r0, 0);
  const tip = pt(r1, 0);
  return [
    ...bz(b, pt(r0 + len * 0.3, hw * 1.25), pt(r0 + len * 0.78, hw * 0.7), tip, 10),
    ...bz(tip, pt(r0 + len * 0.78, -hw * 0.7), pt(r0 + len * 0.3, -hw * 1.25), b, 10).slice(1),
  ];
}

export function roundRectPts(x: number, y: number, w: number, h: number, r: number): Pt[] {
  const pts: Pt[] = [];
  const arc = (cx: number, cy: number, a0: number) => {
    for (let i = 0; i <= 8; i++) {
      const a = rad(a0 + (i * 90) / 8);
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
  };
  arc(x + w - r, y + r, -90);
  arc(x + w - r, y + h - r, 0);
  arc(x + r, y + h - r, 90);
  arc(x + r, y + r, 180);
  pts.push(pts[0]);
  return pts;
}

class Art {
  private parts = new Map<string, { path: Path; spec: Omit<PartSpec, "path"> }>();
  ox = 0;
  oy = 0;
  sc = 1;
  at(ox: number, oy: number, sc = 1) {
    this.ox = ox;
    this.oy = oy;
    this.sc = sc;
    return this;
  }
  private m(p: Pt): Pt {
    return [this.ox + p[0] * this.sc, this.oy + p[1] * this.sc];
  }
  private get(key: string, spec: Omit<PartSpec, "path">) {
    let e = this.parts.get(key);
    if (!e) {
      e = { path: new Path(), spec };
      this.parts.set(key, e);
    }
    return e.path;
  }
  /** Running stitch along a polyline. */
  stitch(color: string, pts: Pt[], o: { len?: number; gap?: number; sw?: number } = {}) {
    const len = o.len ?? 9;
    const gap = o.gap ?? 6;
    const sw = o.sw ?? 3.4;
    const p = this.get(`s:${color}:${sw}`, { stroke: color, strokeWidth: sw, lineCap: "round", lineJoin: "round" });
    const q = pts.map((x) => this.m(x));
    let on = true;
    let rem = len;
    let [cx, cy] = q[0];
    p.M(cx, cy);
    for (let i = 1; i < q.length; i++) {
      const [nx, ny] = q[i];
      let seg = Math.hypot(nx - cx, ny - cy);
      if (seg < 1e-6) continue;
      const ux = (nx - cx) / seg;
      const uy = (ny - cy) / seg;
      while (seg > 1e-6) {
        const step = Math.min(seg, rem);
        cx += ux * step;
        cy += uy * step;
        seg -= step;
        rem -= step;
        if (on) p.L(cx, cy);
        if (rem <= 1e-6) {
          on = !on;
          rem = on ? len : gap;
          if (on) p.M(cx, cy);
        }
      }
    }
  }
  /** Solid thread line. */
  line(color: string, pts: Pt[], sw = 2.6, opacity?: number) {
    const p = this.get(`l:${color}:${sw}:${opacity ?? 1}`, { stroke: color, strokeWidth: sw, opacity, lineCap: "round", lineJoin: "round" });
    pts.map((x) => this.m(x)).forEach(([x, y], i) => (i === 0 ? p.M(x, y) : p.L(x, y)));
  }
  dot(color: string, x: number, y: number, r = 3.4) {
    const p = this.get(`d:${color}`, { fill: color });
    const [mx, my] = this.m([x, y]);
    p.circle(mx, my, r * Math.max(0.6, this.sc));
  }
  fill(color: string, pts: Pt[], opacity = 1) {
    const p = this.get(`f:${color}:${opacity}`, { fill: color, opacity });
    pts.map((x) => this.m(x)).forEach(([x, y], i) => (i === 0 ? p.M(x, y) : p.L(x, y)));
    p.Z();
  }
  out(w: number, h: number): OrnamentData {
    const specs: PartSpec[] = [...this.parts.values()].map((e) => ({ path: e.path, ...e.spec }));
    // fills first, then threads, then dots
    const order = (s: PartSpec) => (s.fill && !s.stroke ? (s.strokeWidth ? 2 : 0) : 1);
    specs.sort((a, b) => order(a) - order(b));
    return assemble(specs, 0, { w, h });
  }
}

export interface Threads {
  indigo: string;
  madder: string;
  turmeric: string;
}

/** Padma (lotus) mandala medallion, 320 x 320. */
export function padma(c: Threads): OrnamentData {
  const a = new Art();
  const cx = 160;
  const cy = 160;
  a.dot(c.turmeric, cx, cy, 11);
  a.stitch(c.madder, circlePts(cx, cy, 22, 40), { len: 4, gap: 4, sw: 3 });
  for (let i = 0; i < 8; i++) {
    const ang = rad(-90 + i * 45);
    a.stitch(c.madder, petalPts(cx, cy, ang, 24, 68, 17), { len: 8, gap: 5 });
    a.line(c.turmeric, [[cx + Math.cos(ang) * 34, cy + Math.sin(ang) * 34], [cx + Math.cos(ang) * 58, cy + Math.sin(ang) * 58]], 3.2);
  }
  for (let i = 0; i < 16; i++) {
    const ang = rad(-90 + 11.25 + i * 22.5);
    a.stitch(c.indigo, petalPts(cx, cy, ang, 52, 106, 14), { len: 9, gap: 6 });
    a.dot(c.turmeric, cx + Math.cos(ang) * 116, cy + Math.sin(ang) * 116, 3);
  }
  a.stitch(c.turmeric, circlePts(cx, cy, 120, 120), { len: 7, gap: 5 });
  const zig: Pt[] = [];
  for (let i = 0; i <= 64; i++) {
    const ang = (i / 64) * Math.PI * 2;
    const r = i % 2 ? 133 : 124;
    zig.push([cx + Math.cos(ang) * r, cy + Math.sin(ang) * r]);
  }
  a.line(c.madder, zig, 2.6);
  for (let i = 0; i < 32; i++) {
    const ang = rad(-90 + i * 11.25);
    a.stitch(c.indigo, petalPts(cx, cy, ang, 136, 156, 6.5), { len: 5, gap: 3, sw: 3 });
  }
  return a.out(320, 320);
}

/** Fish (machh), 230 x 110. */
export function fish(c: { body: string; accent: string; fin: string }): OrnamentData {
  const a = new Art();
  const body: Pt[] = [...bz([10, 55], [50, 4], [120, 4], [168, 55], 18), ...bz([168, 55], [120, 106], [50, 106], [10, 55], 18).slice(1)];
  a.stitch(c.body, body, { len: 10, gap: 6, sw: 3.6 });
  a.stitch(c.fin, [[166, 55], [218, 10], [200, 55], [218, 100], [166, 55]], { len: 9, gap: 5, sw: 3.4 });
  a.stitch(c.fin, [[70, 14], [92, -2], [118, 12]], { len: 8, gap: 5, sw: 3 });
  a.stitch(c.fin, [[70, 96], [92, 110], [118, 98]], { len: 8, gap: 5, sw: 3 });
  for (let r = 0; r < 3; r++) {
    for (let k = 0; k < 4 - (r === 1 ? 0 : 1); k++) {
      const x = 78 + k * 21 + (r === 1 ? 0 : 10);
      const y = 36 + r * 19;
      a.line(c.accent, [[x - 8, y - 6], [x, y], [x - 8, y + 6]], 2.4);
    }
  }
  a.stitch(c.accent, bz([46, 20], [38, 40], [38, 70], [46, 90], 8), { len: 6, gap: 4, sw: 2.8 });
  a.dot(c.accent, 30, 48, 4.2);
  return a.out(230, 112);
}

/** Boat on the river with a canopy, 320 x 190. */
export function nouka(c: Threads): OrnamentData {
  const a = new Art();
  const hull: Pt[] = [
    ...bz([6, 62], [40, 78], [90, 84], [160, 84], 12),
    ...bz([160, 84], [230, 84], [280, 78], [314, 62], 12).slice(1),
    ...bz([314, 62], [296, 124], [240, 146], [160, 146], 14).slice(1),
    ...bz([160, 146], [80, 146], [24, 124], [6, 62], 14).slice(1),
  ];
  a.stitch(c.madder, hull, { len: 10, gap: 6, sw: 3.8 });
  a.stitch(c.indigo, bz([26, 104], [70, 118], [250, 118], [294, 104], 18), { len: 8, gap: 5, sw: 3 });
  a.stitch(c.turmeric, bz([46, 124], [90, 134], [230, 134], [274, 124], 18), { len: 6, gap: 5, sw: 3 });
  // canopy (chhoi)
  const canopy: Pt[] = [...bz([100, 84], [100, 22], [220, 22], [220, 84], 16)];
  a.stitch(c.indigo, canopy, { len: 9, gap: 5, sw: 3.6 });
  for (let i = 0; i < 5; i++) {
    const x = 124 + i * 18;
    a.line(c.turmeric, [[x, 78], [x + 3, 42 + Math.abs(i - 2) * 6]], 2.6);
  }
  a.stitch(c.madder, [[160, 34], [160, 6]], { len: 5, gap: 3, sw: 3 });
  a.fill(c.turmeric, [[160, 6], [186, 14], [160, 22]]);
  // oars
  a.line(c.indigo, [[40, 70], [10, 128]], 3);
  a.line(c.indigo, [[280, 70], [310, 128]], 3);
  // waves
  for (let w = 0; w < 3; w++) {
    const pts: Pt[] = [];
    for (let i = 0; i <= 60; i++) pts.push([i * 5.3, 166 + w * 12 + Math.sin(i * 0.52 + w) * 5]);
    a.stitch(w === 1 ? c.madder : c.indigo, pts, { len: 8, gap: 5, sw: 3 });
  }
  return a.out(320, 190);
}

/** Running-stitch vine with leaves and buds, horizontal. */
export function vine(c: Threads, len = 700): OrnamentData {
  const a = new Art();
  const cy = 40;
  const pts: Pt[] = [];
  const n = Math.round(len / 4);
  for (let i = 0; i <= n; i++) pts.push([(i / n) * len, cy + Math.sin((i / n) * Math.PI * 2 * (len / 170)) * 16]);
  a.stitch(c.indigo, pts, { len: 10, gap: 6, sw: 3.6 });
  const leaves = Math.floor(len / 85);
  for (let i = 0; i < leaves; i++) {
    const x = 42 + i * 85;
    const y = cy + Math.sin((x / len) * Math.PI * 2 * (len / 170)) * 16;
    const up = i % 2 === 0 ? -1 : 1;
    const ang = rad(up < 0 ? -62 : 62);
    a.stitch(i % 3 === 1 ? c.turmeric : c.madder, petalPts(x, y, ang, 4, 38, 8.5), { len: 7, gap: 4, sw: 3.2 });
    a.dot(c.turmeric, x + Math.cos(ang) * 46, y + Math.sin(ang) * 46, 3.2);
  }
  return a.out(len, 80);
}

/** Frame of concentric stitched rings with corner rosettes. */
export function kanthaFrame(c: Threads, w: number, h: number): OrnamentData {
  const a = new Art();
  a.stitch(c.indigo, roundRectPts(6, 6, w - 12, h - 12, 30), { len: 14, gap: 8, sw: 4.4 });
  a.stitch(c.madder, roundRectPts(24, 24, w - 48, h - 48, 22), { len: 5, gap: 5, sw: 3.2 });
  // zigzag run on straight sections
  const zz = (x0: number, y0: number, x1: number, y1: number) => {
    const L = Math.hypot(x1 - x0, y1 - y0);
    const n = Math.floor(L / 14);
    const ux = (x1 - x0) / L;
    const uy = (y1 - y0) / L;
    const pts: Pt[] = [];
    for (let i = 0; i <= n; i++) pts.push([x0 + ux * (L * i) / n - uy * (i % 2 ? 5 : -5), y0 + uy * (L * i) / n + ux * (i % 2 ? 5 : -5)]);
    a.line(c.turmeric, pts, 2.6);
  };
  const m = 44;
  const k = 96;
  zz(m + k, m, w - m - k, m);
  zz(m + k, h - m, w - m - k, h - m);
  zz(m, m + k, m, h - m - k);
  zz(w - m, m + k, w - m, h - m - k);
  const corner = (cx: number, cy: number) => {
    for (let i = 0; i < 8; i++) a.stitch(i % 2 ? c.indigo : c.madder, petalPts(cx, cy, rad(-90 + i * 45), 6, 30, 7), { len: 6, gap: 4, sw: 3 });
    a.dot(c.turmeric, cx, cy, 5);
    a.stitch(c.turmeric, circlePts(cx, cy, 40, 40), { len: 4, gap: 5, sw: 2.8 });
  };
  corner(m + 18, m + 18);
  corner(w - m - 18, m + 18);
  corner(m + 18, h - m - 18);
  corner(w - m - 18, h - m - 18);
  return a.out(w, h);
}

/** Stitched wavy river divider. */
export function riverLine(c: Threads, len = 420): OrnamentData {
  const a = new Art();
  [0, 1].forEach((k) => {
    const pts: Pt[] = [];
    for (let i = 0; i <= 80; i++) pts.push([(i / 80) * len, 12 + k * 14 + Math.sin(i * 0.6 + k * 1.4) * 5]);
    a.stitch(k ? c.madder : c.indigo, pts, { len: 8, gap: 5, sw: 3 });
  });
  a.dot(c.turmeric, len / 2, 20, 5);
  return a.out(len, 36);
}

/** Ring of alternating stitched petals around an oval photo (rx, ry = photo half-sizes). */
export function petalRing(c: Threads, rx: number, ry: number): OrnamentData {
  const pad = 70;
  const cx = rx + pad;
  const cy = ry + pad;
  const a = new Art();
  const n = 30;
  const onEllipse = (t: number, grow: number): Pt => {
    const nx = Math.cos(t) / rx;
    const ny = Math.sin(t) / ry;
    const k = Math.hypot(nx, ny);
    return [cx + Math.cos(t) * rx + (nx / k) * grow, cy + Math.sin(t) * ry + (ny / k) * grow];
  };
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2;
    const [bx, by] = onEllipse(t, 12);
    const ang = Math.atan2(Math.sin(t) / ry, Math.cos(t) / rx);
    const col = i % 3 === 0 ? c.madder : i % 3 === 1 ? c.indigo : c.madder;
    a.stitch(col, petalPts(bx, by, ang, 0, 44, 10.5), { len: 7, gap: 4, sw: 3.2 });
    const [dx, dy] = onEllipse(t + Math.PI / n, 62);
    a.dot(c.turmeric, dx, dy, 3.2);
  }
  const ring: Pt[] = [];
  for (let i = 0; i <= 140; i++) ring.push(onEllipse((i / 140) * Math.PI * 2, 5));
  a.stitch(c.turmeric, ring, { len: 7, gap: 4, sw: 3.4 });
  return a.out((rx + pad) * 2, (ry + pad) * 2);
}

/** Small kantha flower icon, size x size. */
export function kanthaFlower(c: Threads, size = 90): OrnamentData {
  const a = new Art();
  const s = size / 90;
  a.at(0, 0, s);
  for (let i = 0; i < 8; i++) a.stitch(i % 2 ? c.indigo : c.madder, petalPts(45, 45, rad(-90 + i * 45), 6, 40, 9), { len: 6, gap: 4, sw: 3 });
  a.dot(c.turmeric, 45, 45, 6);
  return a.out(size, size);
}

/** Faint cotton-cloth thread texture. */
export function cloth(w: number, h: number, color: string): OrnamentData {
  const a = new Art();
  let seed = 7;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  for (let i = 0; i < 520; i++) {
    const x = rnd() * w;
    const y = rnd() * h;
    const l = 14 + rnd() * 40;
    a.line(color, [[x, y], [x + l, y + (rnd() - 0.5) * 2]], 1.4);
  }
  return a.out(w, h);
}
