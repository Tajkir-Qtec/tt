import { assemble, leaf, Path, petal, type OrnamentData, type PartSpec } from "../design/path";

const rad = (d: number) => (d * Math.PI) / 180;

/** Conch-shell bangle (shakha): ivory band, carved ridges and a ring of tiny carved dots. */
export function shakhaRing(o: { r: number; thick: number }): OrnamentData {
  const { r, thick } = o;
  const c = r + thick / 2 + 2;
  const circ = (rr: number) => new Path().circle(c, c, rr);
  const specs: PartSpec[] = [
    { path: circ(r), stroke: "#e6d6bb", strokeWidth: thick + 3 },
    { path: circ(r), stroke: "#fbf4e6", strokeWidth: thick },
    { path: circ(r - thick * 0.28), stroke: "#ffffff", strokeWidth: thick * 0.22, opacity: 0.9 },
    { path: circ(r + thick * 0.3), stroke: "#d8c6a4", strokeWidth: 1.4 },
    { path: circ(r - thick * 0.3), stroke: "#d8c6a4", strokeWidth: 1.4 },
    { path: circ(r + thick / 2), stroke: "#bfa87e", strokeWidth: 1.2 },
    { path: circ(r - thick / 2), stroke: "#bfa87e", strokeWidth: 1.2 },
  ];
  const dots = new Path();
  const n = Math.max(24, Math.round((2 * Math.PI * r) / 17));
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    dots.circle(c + Math.cos(a) * r, c + Math.sin(a) * r, thick * 0.07);
  }
  specs.push({ path: dots, fill: "#cdb88f" });
  return assemble(specs, 0, { w: c * 2, h: c * 2 });
}

/** Red coral bangle (pola) with gold edge wires. */
export function polaRing(o: { r: number; thick: number }): OrnamentData {
  const { r, thick } = o;
  const c = r + thick / 2 + 2;
  const circ = (rr: number) => new Path().circle(c, c, rr);
  const specs: PartSpec[] = [
    { path: circ(r), stroke: "#7d0b18", strokeWidth: thick + 3 },
    { path: circ(r), stroke: "#cf1a2e", strokeWidth: thick },
    { path: circ(r - thick * 0.2), stroke: "#ef5a62", strokeWidth: thick * 0.2, opacity: 0.8 },
    { path: circ(r + thick / 2), stroke: "#e8c46c", strokeWidth: 2 },
    { path: circ(r - thick / 2), stroke: "#e8c46c", strokeWidth: 2 },
  ];
  return assemble(specs, 0, { w: c * 2, h: c * 2 });
}

/** Sindoor bindi with a halo of alpona petals and dots. */
export function bindi(o: { size: number; ink: string; red: string }): OrnamentData {
  const c = o.size / 2;
  const s = o.size / 120;
  const petals = new Path();
  for (let i = 0; i < 16; i++) petal(petals, c, c, rad(i * 22.5), 34 * s, 56 * s, 5 * s);
  const dots = new Path();
  for (let i = 0; i < 16; i++) {
    const a = rad(i * 22.5 + 11.25);
    dots.circle(c + Math.cos(a) * 52 * s, c + Math.sin(a) * 52 * s, 2.4 * s);
  }
  return assemble(
    [
      { path: petals, stroke: o.ink, strokeWidth: 1.4 },
      { path: dots, fill: o.ink },
      { path: new Path().circle(c, c, 30 * s), stroke: o.ink, strokeWidth: 1.4 },
      { path: new Path().circle(c, c, 21 * s), fill: o.red },
    ],
    0,
    { w: o.size, h: o.size },
  );
}

/** Ring of outward petals, with dots in between, for framing a medallion. */
export function petalRing(o: { r: number; n: number; len: number; ink: string; fillInk?: string }): OrnamentData {
  const c = o.r + o.len + 6;
  const p = new Path();
  const d = new Path();
  for (let i = 0; i < o.n; i++) {
    const a = rad((i / o.n) * 360 - 90);
    petal(p, c, c, a, o.r, o.r + o.len, o.len * 0.2);
    const b = rad(((i + 0.5) / o.n) * 360 - 90);
    d.circle(c + Math.cos(b) * (o.r + o.len * 0.35), c + Math.sin(b) * (o.r + o.len * 0.35), 2.4);
  }
  const ring = new Path().circle(c, c, o.r);
  const specs: PartSpec[] = [
    { path: p, stroke: o.ink, strokeWidth: 1.4, fill: o.fillInk ?? null, opacity: 1 },
    { path: d, fill: o.ink },
    { path: ring, stroke: o.ink, strokeWidth: 1.4 },
  ];
  return assemble(specs, 0, { w: c * 2, h: c * 2 });
}

/** Horizontal alpona band: mirrored lotus buds along a running vine with leaves and dots. */
export function alponaBand(o: { w: number; h?: number; ink: string; accent: string }): OrnamentData {
  const h = o.h ?? 110;
  const cy = h / 2;
  const unit = 128;
  const n = Math.max(1, Math.round(o.w / unit));
  const uw = o.w / n;
  const lotus = new Path();
  const inner = new Path();
  const vine = new Path();
  const leaves = new Path();
  const dots = new Path();
  for (let i = 0; i < n; i++) {
    const cx = i * uw + uw / 2;
    for (const dir of [-1, 1]) {
      const base = cy + dir * 7;
      const ang0 = dir < 0 ? -90 : 90;
      [
        [0, 40],
        [-36, 32],
        [36, 32],
        [-68, 24],
        [68, 24],
      ].forEach(([da, len]) => petal(lotus, cx, base, rad(ang0 + da), 4, len, len * 0.2));
      petal(inner, cx, base, rad(ang0), 8, 26, 4.5);
    }
    dots.circle(cx, cy, 4.2);
    // vine to the next unit
    const x0 = cx + 18;
    const x1 = cx + uw - 18;
    const m = (x0 + x1) / 2;
    vine.M(x0, cy).C(x0 + 12, cy - 22, m - 10, cy - 22, m, cy).C(m + 10, cy + 22, x1 - 12, cy + 22, x1, cy);
    leaf(leaves, [m - 20, cy - 15], rad(-150), 20, 5.5);
    leaf(leaves, [m + 20, cy + 15], rad(30), 20, 5.5);
    dots.circle(m, cy, 3);
  }
  const line = new Path().M(0, 3).L(o.w, 3).M(0, h - 3).L(o.w, h - 3);
  return assemble(
    [
      { path: line, stroke: o.ink, strokeWidth: 1.2, opacity: 0.8 },
      { path: lotus, stroke: o.ink, strokeWidth: 1.4 },
      { path: inner, fill: o.accent, opacity: 0.95 },
      { path: vine, stroke: o.ink, strokeWidth: 1.4 },
      { path: leaves, fill: o.ink, opacity: 0.9 },
      { path: dots, fill: o.ink },
    ],
    0,
    { w: o.w, h },
  );
}

/** Cluster of three rings (pola / shakha / pola) as a tiny badge icon, built from circles only. */
export function bangleBadge(o: { size: number }): OrnamentData {
  const c = o.size / 2;
  const s = o.size / 100;
  const circ = (rr: number) => new Path().circle(c, c, rr * s);
  return assemble(
    [
      { path: circ(40), stroke: "#cf1a2e", strokeWidth: 9 * s },
      { path: circ(40), stroke: "#e8c46c", strokeWidth: 1.2 },
      { path: circ(28), stroke: "#fbf4e6", strokeWidth: 12 * s },
      { path: circ(28), stroke: "#bfa87e", strokeWidth: 1 },
      { path: circ(17), stroke: "#cf1a2e", strokeWidth: 7 * s },
    ],
    0,
    { w: o.size, h: o.size },
  );
}
