import { assemble, Path, type OrnamentData, type PartSpec, type Pt } from "../design/path";
import type { Paint } from "../design/types";

/** Jamdani / katan inspired woven band: diamond medallions between zig-zag teeth rows. */
export function jamdaniBand(o: { len: number; h?: number; ground: Paint | null; motif: Paint; line: string; vertical?: boolean; unit?: number }): OrnamentData {
  const H = o.h ?? 64;
  const n = Math.max(2, Math.round(o.len / (o.unit ?? 64)));
  const u = o.len / n;
  const m = (a: number, b: number): Pt => (o.vertical ? [b, a] : [a, b]);
  const poly = (p: Path, pts: [number, number][], close = true) => p.poly(pts.map(([a, b]) => m(a, b)), close);
  const cy = H / 2;

  const ground = new Path();
  poly(ground, [[0, 0], [o.len, 0], [o.len, H], [0, H]]);

  const rules = new Path();
  [3, 9, H - 9, H - 3].forEach((b) => {
    const [x0, y0] = m(0, b);
    const [x1, y1] = m(o.len, b);
    rules.M(x0, y0).L(x1, y1);
  });

  const teeth = new Path();
  const big = new Path();
  const bigIn = new Path();
  const small = new Path();
  const dots = new Path();
  for (let i = 0; i < n; i++) {
    const a0 = i * u;
    const ac = a0 + u / 2;
    // teeth along both edges
    poly(teeth, [[a0, 10], [ac, 10], [a0 + u / 4, 17]]);
    poly(teeth, [[ac, 10], [a0 + u, 10], [a0 + u * 0.75, 17]]);
    poly(teeth, [[a0, H - 10], [ac, H - 10], [a0 + u / 4, H - 17]]);
    poly(teeth, [[ac, H - 10], [a0 + u, H - 10], [a0 + u * 0.75, H - 17]]);
    // central diamond
    const rw = u * 0.44;
    const rh = (H - 40) / 2;
    poly(big, [[ac, cy - rh], [ac + rw, cy], [ac, cy + rh], [ac - rw, cy]]);
    poly(bigIn, [[ac, cy - rh * 0.55], [ac + rw * 0.55, cy], [ac, cy + rh * 0.55], [ac - rw * 0.55, cy]]);
    // little diamond between big ones
    const bc = a0 + u;
    poly(small, [[bc, cy - 5], [bc + 5, cy], [bc, cy + 5], [bc - 5, cy]]);
    // dots in the diamond corners
    [[ac, cy - rh - 3], [ac, cy + rh + 3]].forEach(([a, b]) => {
      const q = m(a, b);
      poly(dots, [[a - 1.6, b], [a, b - 1.6], [a + 1.6, b], [a, b + 1.6]]);
      void q;
    });
  }
  const specs: PartSpec[] = [];
  if (o.ground) specs.push({ path: ground, fill: o.ground });
  specs.push({ path: rules, stroke: o.line, strokeWidth: 1.2, lineCap: "butt" });
  specs.push({ path: teeth, fill: o.motif });
  specs.push({ path: big, stroke: o.line, strokeWidth: 1.8, lineJoin: "miter" });
  specs.push({ path: bigIn, fill: o.motif, lineJoin: "miter" });
  specs.push({ path: small, fill: o.motif });
  specs.push({ path: dots, fill: o.motif });
  return assemble(specs, 0, o.vertical ? { w: H, h: o.len } : { w: o.len, h: H });
}

/** Fine woven buti texture: tiny diamond with four dots, offset rows. */
export function weaveTexture(o: { w: number; h: number; cell?: number; color: string }): OrnamentData {
  const c = o.cell ?? 60;
  const d = new Path();
  const dots = new Path();
  const rows = Math.ceil(o.h / (c / 2)) + 1;
  const cols = Math.ceil(o.w / c) + 1;
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const x = i * c + (j % 2 ? c / 2 : 0);
      const y = j * (c / 2);
      d.poly([[x, y - 8], [x + 6, y], [x, y + 8], [x - 6, y]], true);
      dots.poly([[x + c / 4 - 1.6, y], [x + c / 4, y - 1.6], [x + c / 4 + 1.6, y], [x + c / 4, y + 1.6]], true);
    }
  }
  return assemble([{ path: d, fill: o.color }, { path: dots, fill: o.color }], 0, { w: o.w, h: o.h });
}

/** Large paisley-like kalka bud (katan motif), pointing up. 160 x 240 viewbox. */
export function kalka(o: { stroke: string; fill: Paint | null; accent: string }): OrnamentData {
  const body = new Path()
    .M(80, 6)
    .C(110, 40, 152, 90, 146, 156)
    .C(140, 214, 98, 236, 70, 228)
    .C(30, 218, 10, 180, 22, 142)
    .C(30, 118, 52, 112, 60, 130)
    .C(66, 146, 50, 158, 42, 150)
    .C(52, 190, 100, 192, 108, 152)
    .C(116, 106, 84, 70, 80, 6)
    .Z();
  const inner = new Path().M(80, 44).C(98, 74, 118, 104, 112, 146).M(80, 70).C(92, 96, 100, 116, 96, 140);
  const pearls = new Path();
  [[80, 22], [100, 56], [122, 96], [134, 140]].forEach(([x, y]) => pearls.circle(x, y, 2.6));
  return assemble(
    [
      { path: body, fill: o.fill, stroke: o.stroke, strokeWidth: 2.4 },
      { path: inner, stroke: o.stroke, strokeWidth: 1.4 },
      { path: pearls, fill: o.accent },
    ],
    2,
    { w: 160, h: 240 },
  );
}
