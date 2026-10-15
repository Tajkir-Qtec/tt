import { assemble, leaf, Path, petal, rad, type OrnamentData, type PartSpec, type Pt } from "../design/path";
import type { Paint } from "../design/types";

/* Shared Bengali art helpers (also imported by the other bangla-* templates). */

export function addRosette(p: Path, cx: number, cy: number, r: number, n = 8, rot = -90, inner = 0.14, hw = 0.2) {
  for (let i = 0; i < n; i++) petal(p, cx, cy, rad(rot + (i * 360) / n), r * inner, r, r * hw);
}

/** Full lotus bloom with layered petals and a bowl. 300 x 250 viewbox. */
export function lotusBloom(o: { stroke: string; fill: Paint; accent: string; sw?: number; veins?: boolean }): OrnamentData {
  const cx = 150;
  const by = 214;
  const sw = o.sw ?? 2.4;
  const rows: [number, number][][] = [
    [[-80, 112], [80, 112]],
    [[-55, 150], [55, 150]],
    [[-28, 178], [28, 178]],
    [[0, 198]],
  ];
  const specs: PartSpec[] = [];
  const tips = new Path();
  rows.forEach((row) =>
    row.forEach(([a, len]) => {
      const p = new Path();
      petal(p, cx, by, rad(-90 + a), 10, len, len * 0.17);
      specs.push({ path: p, fill: o.fill, stroke: o.stroke, strokeWidth: sw });
      if (o.veins !== false) {
        const v = new Path();
        const ang = rad(-90 + a);
        v.M(cx + Math.cos(ang) * 28, by + Math.sin(ang) * 28).L(cx + Math.cos(ang) * len * 0.72, by + Math.sin(ang) * len * 0.72);
        specs.push({ path: v, stroke: o.stroke, strokeWidth: sw * 0.5, opacity: 0.7 });
      }
      tips.circle(cx + Math.cos(rad(-90 + a)) * (len + 9), by + Math.sin(rad(-90 + a)) * (len + 9), 2.6);
    }),
  );
  const bowl = new Path().M(cx - 96, by - 8).C(cx - 70, by + 36, cx + 70, by + 36, cx + 96, by - 8).C(cx + 50, by - 22, cx - 50, by - 22, cx - 96, by - 8).Z();
  specs.push({ path: bowl, fill: o.fill, stroke: o.stroke, strokeWidth: sw });
  const bowl2 = new Path().M(cx - 56, by + 6).C(cx - 30, by + 22, cx + 30, by + 22, cx + 56, by + 6);
  specs.push({ path: bowl2, stroke: o.stroke, strokeWidth: sw * 0.55 });
  specs.push({ path: tips, fill: o.accent });
  return assemble(specs, 0, { w: 300, h: 250 });
}

/** Sola-shola "topor" crown: fan of tiered petals over a patterned band. 300 x 230 viewbox. */
export function topor(o: { stroke: string; fill: Paint; accent: string }): OrnamentData {
  const cx = 150;
  const py = 175;
  const specs: PartSpec[] = [];
  const addRow = (n: number, spread: number, len: number, hw: number, r0: number, op = 1) => {
    for (let i = 0; i < n; i++) {
      const a = n === 1 ? 0 : -spread + (2 * spread * i) / (n - 1);
      const p = new Path();
      petal(p, cx, py, rad(-90 + a), r0, len * (1 - Math.abs(a) / 400), hw);
      specs.push({ path: p, fill: o.fill, stroke: o.stroke, strokeWidth: 2, opacity: op });
    }
  };
  addRow(11, 82, 150, 15, 10);
  addRow(9, 66, 118, 14, 10);
  addRow(7, 50, 88, 12, 10);
  addRow(5, 34, 60, 10, 10);
  const spire = new Path();
  petal(spire, cx, py, rad(-90), 10, 168, 16);
  specs.push({ path: spire, fill: o.fill, stroke: o.stroke, strokeWidth: 2.2 });
  const dots = new Path();
  dots.circle(cx, py - 184, 4.5);
  for (let i = 0; i < 11; i++) {
    const a = rad(-90 - 82 + (164 * i) / 10);
    dots.circle(cx + Math.cos(a) * 160, py + Math.sin(a) * 160, 2.4);
  }
  specs.push({ path: dots, fill: o.accent });
  // band
  const band = new Path().M(cx - 112, py - 4).L(cx + 112, py - 4).L(cx + 100, py + 40).L(cx - 100, py + 40).Z();
  specs.push({ path: band, fill: o.accent, stroke: o.stroke, strokeWidth: 2.2 });
  const dia = new Path();
  for (let i = -4; i <= 4; i++) {
    const x = cx + i * 22;
    dia.poly([[x, py + 6], [x + 9, py + 18], [x, py + 30], [x - 9, py + 18]], true);
  }
  specs.push({ path: dia, stroke: o.stroke, strokeWidth: 1.4 });
  const dd = new Path();
  for (let i = -4; i <= 3; i++) dd.circle(cx + i * 22 + 11, py + 18, 2);
  specs.push({ path: dd, fill: o.stroke });
  return assemble(specs, 0, { w: 300, h: 230 });
}

/** Conch shell (shankha), tip pointing up-left, 200 x 330 viewbox. */
export function shankha(o: { stroke: string; fill: Paint; accent: string; sw?: number }): OrnamentData {
  const sw = o.sw ?? 2.4;
  const specs: PartSpec[] = [];
  const body = new Path()
    .M(78, 6)
    .C(112, 50, 172, 100, 176, 190)
    .C(180, 262, 128, 318, 74, 306)
    .C(26, 296, 14, 238, 38, 186)
    .C(52, 154, 76, 124, 80, 84)
    .C(82, 54, 78, 30, 78, 6)
    .Z();
  specs.push({ path: body, fill: o.fill, stroke: o.stroke, strokeWidth: sw });
  const spire = new Path();
  [[34, 14], [58, 22], [84, 30]].forEach(([y, hw]) => spire.M(78 - hw * 0.5, y + 6).C(78 - hw * 0.1, y - 4, 78 + hw, y - 2, 78 + hw * 1.5, y + 10));
  specs.push({ path: spire, stroke: o.stroke, strokeWidth: sw * 0.6 });
  const ridges = new Path();
  for (let i = 0; i < 6; i++) {
    const y = 100 + i * 34;
    ridges.M(52 + i * 3, y + 40).C(80, y - 6, 140, y + 8, 168 - i * 2, y + 64 - i * 6);
  }
  specs.push({ path: ridges, stroke: o.stroke, strokeWidth: sw * 0.55, opacity: 0.85 });
  const mouth = new Path().M(40, 262).C(52, 300, 110, 322, 152, 280).C(120, 296, 76, 288, 40, 262).Z();
  specs.push({ path: mouth, fill: o.accent, stroke: o.stroke, strokeWidth: sw * 0.7 });
  const dots = new Path();
  [[96, 70], [104, 100]].forEach(([x, y]) => dots.circle(x, y, 2.4));
  specs.push({ path: dots, fill: o.stroke });
  return assemble(specs, 0, { w: 200, h: 330 });
}

/** Horizontal alpona chain band: rosette nodes joined by leafy lenses. */
export function alponaBand(o: { len: number; color: string; accent: string; step?: number; h?: number; fillOp?: number }): OrnamentData {
  const H = o.h ?? 74;
  const cy = H / 2;
  const n = Math.max(2, Math.round(o.len / (o.step ?? 100)));
  const step = o.len / n;
  const ros = new Path();
  const cores = new Path();
  const arcs = new Path();
  const leaves = new Path();
  const dots = new Path();
  for (let i = 0; i < n; i++) {
    const x = step / 2 + i * step;
    addRosette(ros, x, cy, 25, 8);
    cores.circle(x, cy, 3.4);
    const xa = x + 28;
    const xb = x + step - 28;
    const mid = (xa + xb) / 2;
    arcs.M(xa, cy).Q(mid, cy - 34, xb, cy);
    arcs.M(xa, cy).Q(mid, cy + 34, xb, cy);
    leaf(leaves, [mid - 14, cy], 0, 28, 5.5);
    dots.circle(mid, cy - 30, 2.2).circle(mid, cy + 30, 2.2);
  }
  const rule = new Path().M(0, 3).L(o.len, 3).M(0, H - 3).L(o.len, H - 3);
  const rd = new Path();
  for (let x = step / 4; x < o.len; x += step / 2) rd.circle(x, 3, 1.6).circle(x, H - 3, 1.6);
  return assemble(
    [
      { path: rule, stroke: o.color, strokeWidth: 1.3, opacity: 0.8 },
      { path: rd, fill: o.accent },
      { path: ros, fill: o.color, opacity: o.fillOp ?? 0.22 },
      { path: ros, stroke: o.color, strokeWidth: 1.7 },
      { path: arcs, stroke: o.color, strokeWidth: 1.7 },
      { path: leaves, fill: o.color },
      { path: dots, fill: o.accent },
      { path: cores, fill: o.accent },
    ],
    0,
    { w: o.len, h: H },
  );
}

/** Faint lattice of rosettes joined by diamonds: a full-page alpona texture. */
export function rosetteLattice(o: { w: number; h: number; cell?: number; color: string }): OrnamentData {
  const cell = o.cell ?? 130;
  const p = new Path();
  const d = new Path();
  const c = new Path();
  for (let j = 0; j <= Math.ceil(o.h / cell); j++) {
    for (let i = 0; i <= Math.ceil(o.w / cell); i++) {
      const cx = i * cell;
      const cy = j * cell;
      addRosette(p, cx, cy, cell * 0.34, 8);
      c.circle(cx, cy, 3);
      const gx = cx + cell / 2;
      const gy = cy + cell / 2;
      d.poly([[gx, gy - 14], [gx + 14, gy], [gx, gy + 14], [gx - 14, gy]], true);
      c.circle(gx, gy, 2);
    }
  }
  return assemble(
    [
      { path: p, stroke: o.color, strokeWidth: 1.3 },
      { path: d, stroke: o.color, strokeWidth: 1.2 },
      { path: c, fill: o.color },
    ],
    0,
    { w: o.w, h: o.h },
  );
}

/** Garland of small petals + dots following an arch outline (outside it). */
export function archRing(o: { w: number; h: number; color: string; accent: string; gap?: number; len?: number; pad?: number }): OrnamentData {
  const pad = o.pad ?? 40;
  const r = o.w / 2;
  const gap = o.gap ?? 28;
  const len = o.len ?? 18;
  const big = new Path();
  const small = new Path();
  const dots = new Path();
  const place = (x: number, y: number, nx: number, ny: number, k: number) => {
    const ang = Math.atan2(ny, nx);
    const px = pad + x;
    const py = pad + y;
    petal(big, px, py, ang, 4, len + 4, 5.2);
    petal(small, px, py, ang, 6, len - 4, 2.2);
    const a2 = Math.atan2(ny, nx);
    void k;
    void a2;
  };
  // left vertical (bottom to arc start)
  let k = 0;
  for (let y = o.h - 10; y > r; y -= gap) place(0, y, -1, 0, k++);
  const arcLen = Math.PI * r;
  const na = Math.max(8, Math.round(arcLen / gap));
  for (let i = 0; i <= na; i++) {
    const a = Math.PI + (Math.PI * i) / na;
    place(r + Math.cos(a) * r, r + Math.sin(a) * r, Math.cos(a), Math.sin(a), k++);
  }
  for (let y = r + gap; y < o.h - 4; y += gap) place(o.w, y, 1, 0, k++);
  // dots between
  const pts: Pt[] = [];
  for (let y = o.h - 10 - gap / 2; y > r; y -= gap) pts.push([-(len + 8), y]);
  for (let i = 0; i < na; i++) {
    const a = Math.PI + (Math.PI * (i + 0.5)) / na;
    pts.push([r + Math.cos(a) * (r + len + 8), r + Math.sin(a) * (r + len + 8)]);
  }
  for (let y = r + gap * 1.5; y < o.h - 4; y += gap) pts.push([o.w + len + 8, y]);
  pts.forEach(([x, y]) => dots.circle(pad + x, pad + y, 2.1));
  const outline = new Path().M(pad, pad + o.h).L(pad, pad + r).A(r, r, 0, 0, 1, pad + o.w, pad + r).L(pad + o.w, pad + o.h);
  outline.include([pad + r, pad]);
  return assemble(
    [
      { path: big, fill: o.color, opacity: 0.2 },
      { path: big, stroke: o.color, strokeWidth: 1.6 },
      { path: small, fill: o.accent },
      { path: dots, fill: o.accent },
    ],
    0,
    { w: o.w + pad * 2, h: o.h + pad * 2 },
  );
}

/** Small alpona rosette. */
export function rosetteSmall(color: string, accent: string, size = 60): OrnamentData {
  const c = size / 2;
  const p = new Path();
  const q = new Path();
  addRosette(p, c, c, c - 2, 8);
  addRosette(q, c, c, c * 0.5, 8, -67.5, 0.1, 0.16);
  return assemble(
    [
      { path: p, fill: color, opacity: 0.22 },
      { path: p, stroke: color, strokeWidth: 1.5 },
      { path: q, fill: accent },
      { path: new Path().circle(c, c, 2.6), fill: color },
    ],
    0,
    { w: size, h: size },
  );
}
