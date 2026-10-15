import { assemble, leaf, Path, petal, rad, type OrnamentData, type PartSpec, type Pt } from "../design/path";

/**
 * Round alpona medallion: gold petal halo, interlocking scallop chain, a solid
 * ring carrying painted kolka leaves and dots, and an empty central disc for
 * lettering or a photo. Colours are inverted by swapping ringFill / ringInk.
 */
export function alponaMedallion(o: { size: number; accent: string; ringFill: string; ringInk: string; paper: string; core?: number }): OrnamentData {
  const S = o.size;
  const c = S / 2;
  const R = S / 2 - 3;
  const core = o.core ?? 0.58;
  const pt = (a: number, r: number): Pt => [c + Math.cos(a) * r, c + Math.sin(a) * r];
  const specs: PartSpec[] = [];

  // 1. petal halo
  const halo = new Path();
  const haloIn = new Path();
  for (let i = 0; i < 32; i++) {
    const a = rad(-90 + (i * 360) / 32);
    petal(halo, c, c, a, R * 0.86, R, R * 0.04);
    petal(haloIn, c, c, a, R * 0.88, R * 0.95, R * 0.015);
  }
  specs.push({ path: halo, stroke: o.accent, strokeWidth: 1.6 });
  specs.push({ path: haloIn, fill: o.accent, opacity: 0.85 });

  // 2. scallop chain (outward arcs) + interlocking inward arcs
  const n = 40;
  const sc = new Path();
  const sc2 = new Path();
  const rA = R * 0.85;
  for (let i = 0; i <= n; i++) {
    const [x, y] = pt(rad(-90 + (i * 360) / n), rA);
    if (i === 0) {
      sc.M(x, y);
      const [x2, y2] = pt(rad(-90 + 4.5), rA * 0.94);
      sc2.M(x2, y2);
    } else {
      const chord = 2 * rA * Math.sin(Math.PI / n);
      sc.A(chord * 0.58, chord * 0.58, 0, 0, 1, x, y);
      const [x2, y2] = pt(rad(-90 + 4.5 + (i * 360) / n), rA * 0.94);
      sc2.A(chord * 0.58, chord * 0.58, 0, 0, 0, x2, y2);
    }
  }
  sc.Z();
  sc.include([c - R, c - R], [c + R, c + R]);
  specs.push({ path: sc, stroke: o.accent, strokeWidth: 2 });
  specs.push({ path: sc2, stroke: o.accent, strokeWidth: 1.2, opacity: 0.8 });

  // 3. ring
  specs.push({ path: new Path().circle(c, c, R * 0.8), fill: o.ringFill, stroke: o.accent, strokeWidth: 2.4 });
  specs.push({ path: new Path().circle(c, c, R * 0.775), stroke: o.accent, strokeWidth: 0.9, opacity: 0.8 });

  // 4. painted kolka leaves, dots, and a small chain on the ring
  const kol = new Path();
  const kolIn = new Path();
  const dots = new Path();
  const tiny = new Path();
  const lens = new Path();
  const m = 14;
  for (let i = 0; i < m; i++) {
    const a = rad(-90 + (i * 360) / m);
    const b = pt(a, R * 0.76);
    leaf(kol, b, a + Math.PI, R * 0.17, R * 0.05, true);
    const b2 = pt(a, R * 0.745);
    leaf(kolIn, b2, a + Math.PI, R * 0.09, R * 0.022, true);
    const am = a + Math.PI / m;
    for (let k = -1; k <= 1; k++) {
      const p = pt(am + k * 0.045, R * (0.7 - Math.abs(k) * 0.03));
      dots.circle(p[0], p[1], R * 0.012 + (k === 0 ? R * 0.006 : 0));
    }
    // outer arch of lens
    const q = pt(am, R * 0.64);
    tiny.circle(q[0], q[1], R * 0.016);
  }
  const lensN = 28;
  for (let i = 0; i < lensN; i++) {
    const a0 = rad(-90 + (i * 360) / lensN);
    const a1 = rad(-90 + ((i + 1) * 360) / lensN);
    const p0 = pt(a0, R * 0.615);
    const p1 = pt(a1, R * 0.615);
    lens.M(p0[0], p0[1]).A(R * 0.03, R * 0.03, 0, 0, 1, p1[0], p1[1]);
  }
  lens.include([c - R * 0.64, c - R * 0.64], [c + R * 0.64, c + R * 0.64]);
  specs.push({ path: kol, fill: o.ringInk });
  specs.push({ path: kolIn, fill: o.ringFill });
  specs.push({ path: dots, fill: o.ringInk });
  specs.push({ path: tiny, fill: o.accent });
  specs.push({ path: lens, stroke: o.ringInk, strokeWidth: 1.2 });

  // 5. inner disc
  specs.push({ path: new Path().circle(c, c, R * core), fill: o.paper, stroke: o.accent, strokeWidth: 2.6 });
  specs.push({ path: new Path().circle(c, c, R * (core - 0.025)), stroke: o.accent, strokeWidth: 0.9 });
  const rim = new Path();
  for (let i = 0; i < 60; i++) {
    const p = pt(rad((i * 360) / 60), R * (core - 0.055));
    rim.circle(p[0], p[1], 1.5);
  }
  specs.push({ path: rim, fill: o.accent });
  return assemble(specs, 0, { w: S, h: S });
}

/** Quarter-arc corner flourish for the top-left corner; flip for others. */
export function cornerAlpona(o: { size: number; ink: string; accent: string }): OrnamentData {
  const S = o.size;
  const arcs = new Path();
  const dots = new Path();
  const leaves = new Path();
  const outline = new Path();
  [0.34, 0.56, 0.78].forEach((f) => {
    const r = S * f;
    arcs.M(r, 0).A(r, r, 0, 0, 1, 0, r);
  });
  for (let i = 1; i < 10; i++) {
    const a = rad((i * 90) / 10);
    dots.circle(Math.cos(a) * S * 0.9, Math.sin(a) * S * 0.9, 2.4);
  }
  for (let i = 0; i < 6; i++) {
    const a = rad(8 + i * 14.8);
    dots.circle(Math.cos(a) * S * 0.67, Math.sin(a) * S * 0.67, 1.8);
  }
  leaf(leaves, [S * 0.2, S * 0.2], rad(45), S * 0.3, S * 0.032, true);
  [20, 70].forEach((deg) => leaf(outline, [S * 0.2 * Math.cos(rad(deg)), S * 0.2 * Math.sin(rad(deg))], rad(deg), S * 0.3, S * 0.045, true));
  const bud = new Path().circle(S * 0.1, S * 0.1, 5);
  arcs.include([0, 0], [S, S]);
  return assemble(
    [
      { path: arcs, stroke: o.ink, strokeWidth: 2.2 },
      { path: outline, stroke: o.ink, strokeWidth: 1.6 },
      { path: leaves, fill: o.ink },
      { path: dots, fill: o.accent },
      { path: bud, fill: o.accent },
    ],
    0,
    { w: S, h: S },
  );
}

/** Chain of interlocking eyes with dots: a running alpona border. */
export function loopBand(o: { w: number; h: number; ink: string; accent: string }): OrnamentData {
  const n = Math.max(3, Math.round(o.w / (o.h * 1.9)));
  const L = o.w / n;
  const cy = o.h / 2;
  const r = o.h * 0.42;
  const a = new Path();
  const b = new Path();
  const dots = new Path();
  const leaves = new Path();
  for (let i = 0; i < n; i++) {
    const x = i * L;
    a.M(x, cy).A(L / 2, r, 0, 0, 1, x + L, cy);
    b.M(x, cy).A(L / 2, r, 0, 0, 0, x + L, cy);
    dots.circle(x + L / 2, cy, 3.2);
    dots.circle(x + L / 2, cy - r * 0.55, 1.6);
    dots.circle(x + L / 2, cy + r * 0.55, 1.6);
    leaf(leaves, [x + L, cy], rad(-90), r * 0.9, 3.4);
    leaf(leaves, [x + L, cy], rad(90), r * 0.9, 3.4);
  }
  a.include([0, cy - r], [o.w, cy + r]);
  return assemble(
    [
      { path: a, stroke: o.ink, strokeWidth: 2 },
      { path: b, stroke: o.ink, strokeWidth: 2 },
      { path: leaves, fill: o.ink, opacity: 0.85 },
      { path: dots, fill: o.accent },
    ],
    0,
    { w: o.w, h: o.h },
  );
}
