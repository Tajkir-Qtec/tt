import { assemble, leaf, Path, petal, rad, type OrnamentData, type PartSpec, type Pt } from "../design/path";
import type { Paint } from "../design/types";

/** Shapla (water lily) seen from above: layered pointed petals with a stamen heart. */
export function shaplaTop(o: { size: number; stroke: string; layers: string[]; heart: string; strokeWidth?: number }): OrnamentData {
  const S = o.size;
  const c = S / 2;
  const R = S / 2 - 3;
  const sw = o.strokeWidth ?? 1.6;
  const specs: PartSpec[] = [];
  const L = [
    { n: 10, len: 1, hw: 0.17, off: 0 },
    { n: 10, len: 0.82, hw: 0.16, off: 18 },
    { n: 8, len: 0.62, hw: 0.15, off: 0 },
    { n: 8, len: 0.42, hw: 0.12, off: 22.5 },
  ];
  L.forEach((l, i) => {
    const p = new Path();
    const rib = new Path();
    for (let k = 0; k < l.n; k++) {
      const a = rad(-90 + l.off + (k * 360) / l.n);
      petal(p, c, c, a, R * 0.05, R * l.len, R * l.hw);
      rib.M(c + Math.cos(a) * R * 0.1, c + Math.sin(a) * R * 0.1).L(c + Math.cos(a) * R * l.len * 0.8, c + Math.sin(a) * R * l.len * 0.8);
    }
    specs.push({ path: p, fill: o.layers[i % o.layers.length], stroke: o.stroke, strokeWidth: sw });
    specs.push({ path: rib, stroke: o.stroke, strokeWidth: sw * 0.5, opacity: 0.45 });
  });
  const dots = new Path();
  for (let k = 0; k < 28; k++) {
    const a = rad((k * 360) / 28);
    dots.circle(c + Math.cos(a) * R * 0.15, c + Math.sin(a) * R * 0.15, R * 0.016);
  }
  specs.push({ path: new Path().circle(c, c, R * 0.1), fill: o.heart, opacity: 0.55 });
  specs.push({ path: dots, fill: o.heart });
  specs.push({ path: new Path().circle(c, c, R * 0.035), fill: o.heart });
  return assemble(specs, 0, { w: S, h: S });
}

/** Shapla in profile: a cup of pointed petals rising from a base point. */
export function shaplaSide(o: { w: number; stroke: string; fills: string[]; heart: string; strokeWidth?: number }): OrnamentData {
  const R = o.w / 2;
  const H = Math.round(R * 1.2 + 16);
  const bx = R;
  const by = H - 10;
  const sw = o.strokeWidth ?? 1.8;
  const specs: PartSpec[] = [];
  const groups: { angles: number[]; len: number; hw: number }[] = [
    { angles: [-74, 74], len: 0.8, hw: 0.2 },
    { angles: [-50, 50], len: 0.98, hw: 0.21 },
    { angles: [-26, 26], len: 1.12, hw: 0.21 },
    { angles: [0], len: 1.2, hw: 0.22 },
  ];
  groups.forEach((g, gi) => {
    const p = new Path();
    const rib = new Path();
    g.angles.forEach((a) => {
      const ang = rad(-90 + a);
      petal(p, bx, by, ang, 6, R * g.len, R * g.hw);
      rib.M(bx + Math.cos(ang) * 14, by + Math.sin(ang) * 14).L(bx + Math.cos(ang) * R * g.len * 0.78, by + Math.sin(ang) * R * g.len * 0.78);
    });
    specs.push({ path: p, fill: o.fills[Math.min(gi, o.fills.length - 1)], stroke: o.stroke, strokeWidth: sw });
    specs.push({ path: rib, stroke: o.stroke, strokeWidth: sw * 0.5, opacity: 0.4 });
  });
  const dots = new Path();
  for (let k = -3; k <= 3; k++) dots.circle(bx + k * 6, by - 6 - Math.abs(k) * 1.5, 2.2);
  specs.push({ path: dots, fill: o.heart });
  return assemble(specs, 0, { w: o.w, h: H });
}

/** Round lily pad with a notch and radiating veins. Squash with a smaller layer height for perspective. */
export function lilyPad(o: { size: number; fill: string; stroke: string; rot?: number }): OrnamentData {
  const S = o.size;
  const c = S / 2;
  const R = S / 2 - 2;
  const rot = o.rot ?? 20;
  const pt = (a: number, r = R): Pt => [c + Math.cos(rad(a)) * r, c + Math.sin(rad(a)) * r];
  const a0 = pt(rot + 11);
  const a1 = pt(rot + 11 + 338);
  const body = new Path().M(c, c).L(a0[0], a0[1]).A(R, R, 0, 1, 1, a1[0], a1[1]).Z();
  body.include([c - R, c - R], [c + R, c + R]);
  const veins = new Path();
  for (let k = 0; k < 20; k++) {
    const a = rot + 11 + 12 + k * (314 / 19);
    const p = pt(a, R * 0.94);
    veins.M(c, c).L(p[0], p[1]);
  }
  return assemble(
    [
      { path: body, fill: o.fill, stroke: o.stroke, strokeWidth: 1.4 },
      { path: veins, stroke: o.stroke, strokeWidth: 0.9, opacity: 0.5 },
    ],
    0,
    { w: S, h: S },
  );
}

/** Flattened concentric ripples (river rings). */
export function ripples(o: { w: number; h: number; color: string; rings?: number; strokeWidth?: number }): OrnamentData {
  const n = o.rings ?? 4;
  const specs: PartSpec[] = [];
  for (let i = 0; i < n; i++) {
    const t = (i + 1) / n;
    const rx = (o.w / 2) * t - 2;
    const ry = (o.h / 2) * t - 2;
    const cx = o.w / 2;
    const cy = o.h / 2;
    const p = new Path().M(cx - rx, cy).A(rx, ry, 0, 1, 0, cx + rx, cy).A(rx, ry, 0, 1, 0, cx - rx, cy).Z();
    p.include([cx, cy - ry], [cx, cy + ry]);
    specs.push({ path: p, stroke: o.color, strokeWidth: o.strokeWidth ?? 1.6, opacity: 1 - i * (0.7 / n) });
  }
  return assemble(specs, 0, { w: o.w, h: o.h });
}

/** Rows of gentle river waves (stroke only). */
export function riverLines(o: { w: number; h: number; color: string; rows: number; amp?: number; half?: number; strokeWidth?: number }): OrnamentData {
  const specs: PartSpec[] = [];
  const amp = o.amp ?? 10;
  const n = Math.max(2, Math.round(o.w / (o.half ?? 70)));
  const hw = o.w / n;
  for (let r = 0; r < o.rows; r++) {
    const y = o.rows === 1 ? o.h / 2 : (r * (o.h - amp * 2)) / (o.rows - 1) + amp;
    const p = new Path().M(0, y);
    for (let i = 0; i < n; i++) {
      const dir = (i + r) % 2 === 0 ? -1 : 1;
      p.Q(i * hw + hw / 2, y + dir * amp * 2, (i + 1) * hw, y);
    }
    specs.push({ path: p, stroke: o.color, strokeWidth: o.strokeWidth ?? 1.6, opacity: 1 - (r / Math.max(1, o.rows)) * 0.55 });
  }
  return assemble(specs, 0, { w: o.w, h: o.h });
}

/** Closed river band: a wavy crest line, filled below. */
export function riverBand(o: { w: number; h: number; amp: number; waves: number; phase?: number; fill: Paint; crest?: string; crestWidth?: number }): OrnamentData {
  const n = o.waves * 2;
  const hw = o.w / n;
  const top = o.amp + 2;
  const p = new Path().M(0, top);
  const ph = o.phase ?? 0;
  for (let i = 0; i < n; i++) {
    const dir = (i + ph) % 2 === 0 ? -1 : 1;
    p.Q(i * hw + hw / 2, top + dir * o.amp * 2, (i + 1) * hw, top);
  }
  const crest = new Path().M(0, top);
  for (let i = 0; i < n; i++) {
    const dir = (i + ph) % 2 === 0 ? -1 : 1;
    crest.Q(i * hw + hw / 2, top + dir * o.amp * 2, (i + 1) * hw, top);
  }
  p.L(o.w, o.h).L(0, o.h).Z();
  const specs: PartSpec[] = [{ path: p, fill: o.fill }];
  if (o.crest) specs.push({ path: crest, stroke: o.crest, strokeWidth: o.crestWidth ?? 2 });
  return assemble(specs, 0, { w: o.w, h: o.h });
}

/** A handful of slender grass / reed blades rising from the bottom. */
export function reeds(o: { w: number; h: number; color: string; accent: string; seed?: number }): OrnamentData {
  const blades = new Path();
  const alt = new Path();
  let s = o.seed ?? 7;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const n = 9;
  for (let i = 0; i < n; i++) {
    const bx = o.w * (0.15 + 0.7 * (i / (n - 1))) + (rnd() - 0.5) * 18;
    const lean = ((i / (n - 1)) - 0.5) * 34 + (rnd() - 0.5) * 10;
    const len = o.h * (0.55 + rnd() * 0.45) * (1 - Math.abs(i / (n - 1) - 0.5) * 0.5);
    leaf(i % 3 === 0 ? alt : blades, [bx, o.h], rad(-90 + lean), len, 3 + rnd() * 3);
  }
  return assemble([{ path: blades, fill: o.color }, { path: alt, fill: o.accent }], 0, { w: o.w, h: o.h });
}

/** Tiny stacked dots divider with a centered shapla bud. */
export function budDivider(o: { w: number; color: string; accent: string }): OrnamentData {
  const w = o.w;
  const h = 40;
  const c = w / 2;
  const line = new Path().M(0, h / 2).L(c - 34, h / 2).M(c + 34, h / 2).L(w, h / 2);
  const bud = new Path();
  [-52, 0, 52].forEach((a) => petal(bud, c, h / 2 + 12, rad(-90 + a), 2, a === 0 ? 24 : 18, 6));
  const dots = new Path().circle(c - 46, h / 2, 2.2).circle(c + 46, h / 2, 2.2);
  return assemble(
    [
      { path: line, stroke: o.color, strokeWidth: 1.2 },
      { path: bud, fill: o.accent, stroke: o.color, strokeWidth: 1.3 },
      { path: dots, fill: o.color },
    ],
    0,
    { w, h },
  );
}
