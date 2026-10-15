import { assemble, Path, type OrnamentData, type PartSpec, type Pt } from "../design/path";

export interface LineBotanicalOpts {
  w: number;
  h: number;
  stroke: string;
  strokeWidth?: number;
  leaves?: number;
  /** Lateral wander of the stem as a fraction of width. */
  sway?: number;
  /** Phase offset so two sprigs differ. */
  phase?: number;
  /** Terminal bud: a small loop. */
  bud?: boolean;
}

/**
 * One continuous pen line: a swaying stem that loops out into a leaf and returns
 * to the stem, again and again, finishing in a small spiral bud.
 */
export function lineBotanical(o: LineBotanicalOpts): OrnamentData {
  const n = o.leaves ?? 7;
  const sway = (o.sway ?? 0.12) * o.w;
  const ph = o.phase ?? 0;
  const cx = o.w / 2;
  const top = o.h * 0.08;
  const bottom = o.h;
  const stemAt = (t: number): Pt => [cx + Math.sin(t * Math.PI * 2.1 + ph) * sway * (0.35 + t * 0.65) - sway * 0.2 * (1 - t), bottom - t * (bottom - top)];
  const p = new Path();
  const s0 = stemAt(0);
  p.M(s0[0], s0[1]);
  const steps = 14;
  const leafT: number[] = [];
  for (let i = 0; i < n; i++) leafT.push(0.12 + (i / n) * 0.78);
  let t = 0;
  let side = 1;
  let li = 0;
  const stemTo = (tt: number) => {
    const k = Math.max(2, Math.round((tt - t) * 140));
    for (let i = 1; i <= k; i++) {
      const q = stemAt(t + ((tt - t) * i) / k);
      p.L(q[0], q[1]);
    }
    t = tt;
  };
  void steps;
  while (li < n) {
    stemTo(leafT[li]);
    const P = stemAt(t);
    const t2 = Math.min(0.97, t + 0.045);
    const P2 = stemAt(t2);
    const len = o.h * (0.17 - 0.05 * (li / n)) + o.w * 0.05;
    const ang = (side > 0 ? -1 : 1) * 0 + (side > 0 ? -0.62 : Math.PI + 0.62); // leaf axis direction (radians)
    const dx = Math.cos(ang);
    const dy = Math.sin(ang);
    const nx = -dy;
    const ny = dx;
    const wd = len * 0.2;
    const tip: Pt = [P[0] + dx * len, P[1] + dy * len];
    const at = (u: number, v: number): Pt => [P[0] + dx * len * u + nx * wd * v, P[1] + dy * len * u + ny * wd * v];
    const a1 = at(0.15, -1.6 * side);
    const a2 = at(0.7, -1.5 * side);
    const b1 = at(0.7, 1.1 * side);
    const b2 = at(0.2, 1.3 * side);
    p.C(a1[0], a1[1], a2[0], a2[1], tip[0], tip[1]);
    p.C(b1[0], b1[1], b2[0], b2[1], P2[0], P2[1]);
    // midrib flick: tiny line from the stem into the leaf, drawn as part of the same stroke
    t = t2;
    side = -side;
    li++;
  }
  stemTo(0.93);
  if (o.bud !== false) {
    const e = stemAt(t);
    const r = Math.max(10, o.w * 0.055);
    // spiral bud: two arcs growing outward, ending in an open curl
    p.C(e[0] - r * 0.2, e[1] - r * 1.2, e[0] + r * 1.6, e[1] - r * 1.6, e[0] + r * 1.5, e[1] - r * 0.2);
    p.C(e[0] + r * 1.4, e[1] + r * 0.9, e[0] - r * 0.4, e[1] + r * 1.0, e[0] - r * 0.3, e[1] - r * 0.1);
    p.C(e[0] - r * 0.25, e[1] - r * 0.55, e[0] + r * 0.45, e[1] - r * 0.6, e[0] + r * 0.5, e[1] - r * 0.1);
    p.include([e[0] - r, e[1] - r * 1.7], [e[0] + r * 1.6, e[1] + r]);
  }
  p.include([0, 0], [o.w, o.h]);
  const specs: PartSpec[] = [{ path: p, stroke: o.stroke, strokeWidth: o.strokeWidth ?? 2.4, lineCap: "round", lineJoin: "round" }];
  return assemble(specs, 0, { w: o.w, h: o.h });
}

/** Tiny dot-and-line fleuron used as a quiet divider. */
export function hairSprig(w: number, stroke: string): OrnamentData {
  const p = new Path();
  const h = w * 0.18;
  p.M(0, h / 2).L(w * 0.42, h / 2);
  p.M(w * 0.58, h / 2).L(w, h / 2);
  const c = new Path();
  c.M(w * 0.5, h * 0.05).C(w * 0.53, h * 0.3, w * 0.53, h * 0.7, w * 0.5, h * 0.95).C(w * 0.47, h * 0.7, w * 0.47, h * 0.3, w * 0.5, h * 0.05).Z();
  const specs: PartSpec[] = [
    { path: p, stroke, strokeWidth: 1 },
    { path: c, stroke, strokeWidth: 1.2 },
  ];
  specs.forEach((s) => s.path.include([0, 0], [w, h]));
  return assemble(specs, 0, { w, h });
}
