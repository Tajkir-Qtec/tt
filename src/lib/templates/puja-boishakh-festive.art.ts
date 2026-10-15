import { assemble, leaf, Path, petal, rad, type OrnamentData, type PartSpec, type Pt } from "../design/path";

/** Horizontal alpona band (vine, lotus flowers, leaves, dots) drawn upright; use flipY for a bottom edge. */
export function alponaBand(o: { color: string; w?: number; h?: number; sw?: number }): OrnamentData {
  const w = o.w ?? 1000;
  const h = o.h ?? 100;
  const sw = o.sw ?? 2.2;
  const mid = h / 2;
  const lines = new Path();
  lines.M(0, 4).L(w, 4).M(0, h - 4).L(w, h - 4);
  lines.include([0, 0], [w, h]);
  const wave = new Path();
  wave.M(0, mid);
  const n = 2 * Math.round(w / 100);
  const seg = w / n;
  for (let i = 0; i < n; i++) wave.Q(i * seg + seg / 2, mid + (i % 2 ? 15 : -15), (i + 1) * seg, mid);
  const flowers = new Path();
  const leaves = new Path();
  const dots = new Path();
  const bigDots = new Path();
  for (let i = 0; i < n; i++) {
    const x = i * seg + seg / 2;
    const dir = i % 2 ? 1 : -1;
    leaf(leaves, [x, mid + dir * 7], rad(dir * 90), 17, 5.2);
    bigDots.circle(x, mid - dir * 12, 2.4);
  }
  for (let i = 0; i < n / 2; i++) {
    const cx = (2 * i + 1) * seg;
    for (let k = 0; k < 8; k++) petal(flowers, cx, mid, rad(k * 45 - 90), 5, 26, 5.2, true);
    dots.circle(cx, mid, 3.2);
  }
  for (let x = 12; x < w - 6; x += 24) {
    dots.circle(x, 14, 1.6);
    dots.circle(x, h - 14, 1.6);
  }
  const specs: PartSpec[] = [
    { path: lines, stroke: o.color, strokeWidth: sw * 0.75, lineCap: "butt" },
    { path: wave, stroke: o.color, strokeWidth: sw },
    { path: flowers, stroke: o.color, strokeWidth: sw * 0.8 },
    { path: leaves, fill: o.color },
    { path: dots, fill: o.color },
    { path: bigDots, fill: o.color },
  ];
  return assemble(specs, 0, { w, h, dx: 0, dy: 0 });
}

/** Alpona rosette: concentric lotus rings, loops and dots. */
export function alponaRosette(o: { color: string; size?: number; sw?: number; fill?: string | null }): OrnamentData {
  const S = o.size ?? 400;
  const R = S / 2 - 4;
  const c = S / 2;
  const sw = o.sw ?? 2.2;
  const specs: PartSpec[] = [];
  specs.push({ path: new Path().circle(c, c, R), stroke: o.color, strokeWidth: sw });
  specs.push({ path: new Path().circle(c, c, R * 0.93), stroke: o.color, strokeWidth: sw * 0.5 });
  const loops = new Path();
  for (let i = 0; i < 16; i++) petal(loops, c, c, rad((i * 360) / 16 - 90), R * 0.6, R * 0.9, R * 0.07, false);
  specs.push({ path: loops, stroke: o.color, strokeWidth: sw * 0.9 });
  const dots = new Path();
  for (let i = 0; i < 32; i++) {
    const a = rad((i * 360) / 32);
    dots.circle(c + Math.cos(a) * R * 0.545, c + Math.sin(a) * R * 0.545, R * 0.012);
  }
  specs.push({ path: dots, fill: o.color });
  specs.push({ path: new Path().circle(c, c, R * 0.5), stroke: o.color, strokeWidth: sw * 0.7 });
  const big = new Path();
  for (let i = 0; i < 8; i++) petal(big, c, c, rad((i * 360) / 8 - 90), R * 0.1, R * 0.47, R * 0.11, true);
  specs.push({ path: big, stroke: o.color, strokeWidth: sw * 0.9, fill: o.fill ?? null });
  const small = new Path();
  for (let i = 0; i < 8; i++) petal(small, c, c, rad((i * 360) / 8 - 67.5), R * 0.08, R * 0.3, R * 0.06, true);
  specs.push({ path: small, fill: o.color });
  specs.push({ path: new Path().circle(c, c, R * 0.07), fill: o.color });
  return assemble(specs, 0, { w: S, h: S, dx: 0, dy: 0 });
}

/** Filled lotus (padma) with layered petals, drawn centred at the bottom. */
export function lotus(o: { a: string; b: string; line?: string; size?: number }): OrnamentData {
  const S = o.size ?? 300;
  const cx = S / 2;
  const by = S * 0.62;
  const layers: { n: number; spread: number; len: number; hw: number; fill: string }[] = [
    { n: 5, spread: 150, len: 0.5, hw: 0.17, fill: o.b },
    { n: 5, spread: 110, len: 0.6, hw: 0.17, fill: o.a },
    { n: 3, spread: 60, len: 0.66, hw: 0.17, fill: o.b },
    { n: 1, spread: 0, len: 0.72, hw: 0.16, fill: o.a },
  ];
  const specs: PartSpec[] = [];
  for (const L of layers) {
    const p = new Path();
    for (let i = 0; i < L.n; i++) {
      const t = L.n === 1 ? 0 : i / (L.n - 1) - 0.5;
      petal(p, cx, by, rad(-90 + t * L.spread), 0, S * L.len, S * L.hw, true);
    }
    specs.push({ path: p, fill: L.fill, stroke: o.line ?? null, strokeWidth: 1.6 });
  }
  const base = new Path().M(cx - S * 0.24, by + 4).Q(cx, by + S * 0.1, cx + S * 0.24, by + 4);
  specs.push({ path: base, stroke: o.line ?? o.b, strokeWidth: 2 });
  return assemble(specs, 2, { w: S, h: S * 0.7, dx: 0, dy: 0 });
}

/** Dhunuchi (incense burner) line illustration with smoke. */
export function dhunuchi(o: { color: string; sw?: number; glow?: string }): OrnamentData {
  const sw = o.sw ?? 2.4;
  const specs: PartSpec[] = [];
  const rim = new Path().M(18, 108).L(182, 108);
  const bowl = new Path().M(30, 108).C(38, 160, 78, 186, 100, 186).C(122, 186, 162, 160, 170, 108);
  specs.push({ path: bowl, stroke: o.color, strokeWidth: sw });
  specs.push({ path: rim, stroke: o.color, strokeWidth: sw * 1.3 });
  const bands = new Path();
  bands.M(44, 140).C(70, 150, 130, 150, 156, 140);
  bands.M(58, 160).C(80, 168, 120, 168, 142, 160);
  specs.push({ path: bands, stroke: o.color, strokeWidth: sw * 0.55 });
  const dots = new Path();
  for (let i = 0; i < 7; i++) dots.circle(52 + i * 16, 124 + Math.sin((i / 6) * Math.PI) * 8, 2);
  specs.push({ path: dots, fill: o.color });
  const stem = new Path().M(100, 186).L(100, 206).M(80, 206).L(120, 206).M(70, 230).L(86, 206).M(130, 230).L(114, 206).M(62, 230).L(138, 230);
  specs.push({ path: stem, stroke: o.color, strokeWidth: sw });
  const handle = new Path().M(170, 124).C(206, 126, 232, 140, 250, 168);
  specs.push({ path: handle, stroke: o.color, strokeWidth: sw * 1.2 });
  specs.push({ path: new Path().circle(254, 174, 6), fill: o.color });
  const coals = new Path().M(44, 108).C(60, 90, 80, 100, 100, 88).C(120, 100, 140, 90, 156, 108);
  specs.push({ path: coals, stroke: o.glow ?? o.color, strokeWidth: sw * 1.1 });
  const smoke = new Path();
  smoke.M(100, 86).C(64, 62, 138, 44, 100, 12).C(70, -14, 126, -34, 100, -66);
  const smoke2 = new Path();
  smoke2.M(76, 92).C(46, 64, 100, 46, 70, 22);
  const smoke3 = new Path();
  smoke3.M(126, 92).C(160, 66, 112, 48, 142, 20).C(156, 4, 138, -10, 146, -30);
  specs.push({ path: smoke, stroke: o.color, strokeWidth: sw * 0.9, opacity: 0.85 });
  specs.push({ path: smoke2, stroke: o.color, strokeWidth: sw * 0.7, opacity: 0.6 });
  specs.push({ path: smoke3, stroke: o.color, strokeWidth: sw * 0.7, opacity: 0.6 });
  return assemble(specs, 6);
}

/** Dhak (festival drum) line illustration. */
export function dhak(o: { color: string; sw?: number; pom?: string }): OrnamentData {
  const sw = o.sw ?? 2.4;
  const specs: PartSpec[] = [];
  const topC = (t: number): Pt => bezPt([68, 52], [130, 22], [230, 22], [292, 52], t);
  const botC = (t: number): Pt => bezPt([68, 148], [130, 178], [230, 178], [292, 148], t);
  const body = new Path();
  body.M(68, 52).C(130, 22, 230, 22, 292, 52);
  body.M(68, 148).C(130, 178, 230, 178, 292, 148);
  specs.push({ path: body, stroke: o.color, strokeWidth: sw * 1.2 });
  for (const [x, rx] of [[64, 14], [296, 14]] as [number, number][]) {
    const e = new Path().circle(x, 100, rx);
    specs.push({ path: scaleY(e, x, 100, 50 / rx), stroke: o.color, strokeWidth: sw });
  }
  const lace = new Path();
  const n = 12;
  for (let i = 0; i < n; i++) {
    const a = topC(i / n);
    const b = botC((i + 1) / n);
    const c = botC(i / n);
    const d = topC((i + 1) / n);
    lace.M(a[0], a[1]).L(b[0], b[1]);
    lace.M(c[0], c[1]).L(d[0], d[1]);
  }
  specs.push({ path: lace, stroke: o.color, strokeWidth: sw * 0.55, lineCap: "butt" });
  const strap = new Path().M(110, 34).C(140, -26, 220, -26, 250, 34);
  specs.push({ path: strap, stroke: o.color, strokeWidth: sw });
  const poms = new Path();
  poms.circle(110, 36, 7).circle(250, 36, 7);
  specs.push({ path: poms, fill: o.pom ?? o.color });
  const tassel = new Path();
  for (const x of [110, 250]) for (const dx of [-5, 0, 5]) tassel.M(x, 43).L(x + dx * 1.6, 66);
  specs.push({ path: tassel, stroke: o.pom ?? o.color, strokeWidth: sw * 0.6 });
  // sticks
  const sticks = new Path();
  sticks.M(110, 196).C(150, 176, 200, 182, 246, 196);
  specs.push({ path: sticks, stroke: o.color, strokeWidth: sw * 0.8 });
  const knobs = new Path().circle(110, 196, 5).circle(246, 196, 5);
  specs.push({ path: knobs, fill: o.color });
  return assemble(specs, 6);
}

function bezPt(p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt {
  const u = 1 - t;
  return [
    u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
    u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
  ];
}

/** Vertically scale a circle path into an ellipse (re-built since Path has no transform). */
function scaleY(_p: Path, cx: number, cy: number, k: number): Path {
  const rx = 14;
  const ry = rx * k;
  const e = new Path();
  e.M(cx - rx, cy).A(rx, ry, 0, 1, 0, cx + rx, cy).A(rx, ry, 0, 1, 0, cx - rx, cy).Z();
  e.include([cx, cy - ry], [cx, cy + ry]);
  return e;
}
