import { assemble, Path, type OrnamentData, type PartSpec, type Pt } from "../design/path";

/**
 * Woven noksha-pare (saree border) band. u runs along the length, v across the depth.
 * `vertical` swaps the axes so the same weave can run down the sides of the card.
 */
export function weaveBorder(o: { len: number; depth: number; vertical?: boolean; red: string; black: string; ivory: string; gold: string }): OrnamentData {
  const { len, depth: D } = o;
  const m = (u: number, v: number): Pt => (o.vertical ? [v, u] : [u, v]);
  const rect = (p: Path, u0: number, v0: number, u1: number, v1: number) => {
    const a = m(u0, v0);
    const b = m(u1, v0);
    const c = m(u1, v1);
    const d = m(u0, v1);
    p.M(a[0], a[1]).L(b[0], b[1]).L(c[0], c[1]).L(d[0], d[1]).Z();
  };
  const poly = (p: Path, pts: [number, number][]) => {
    pts.forEach(([u, v], i) => {
      const [x, y] = m(u, v);
      if (i === 0) p.M(x, y);
      else p.L(x, y);
    });
    p.Z();
  };
  const line = (p: Path, u0: number, v0: number, u1: number, v1: number) => {
    const a = m(u0, v0);
    const b = m(u1, v1);
    p.M(a[0], a[1]).L(b[0], b[1]);
  };
  const base = new Path();
  rect(base, 0, 0, len, D);
  const reds = new Path();
  const s = D * 0.12;
  rect(reds, 0, s, len, s * 2.1);
  rect(reds, 0, D - s * 2.1, len, D - s);
  const core = new Path();
  const c0 = D * 0.31;
  const c1 = D * 0.69;
  rect(core, 0, c0, len, c1);
  const hair = new Path();
  line(hair, 0, s * 0.5, len, s * 0.5);
  line(hair, 0, D - s * 0.5, len, D - s * 0.5);
  line(hair, 0, c0 - 3, len, c0 - 3);
  line(hair, 0, c1 + 3, len, c1 + 3);

  const cell = D * 0.62;
  const n = Math.max(1, Math.round(len / cell));
  const cw = len / n;
  const dia = new Path();
  const diaIn = new Path();
  const zig = new Path();
  const dots = new Path();
  const mid = D / 2;
  const hv = (c1 - c0) / 2 - 3;
  for (let i = 0; i < n; i++) {
    const cu = (i + 0.5) * cw;
    poly(dia, [
      [cu - hv * 1.15, mid],
      [cu, mid - hv],
      [cu + hv * 1.15, mid],
      [cu, mid + hv],
    ]);
    poly(diaIn, [
      [cu - hv * 0.5, mid],
      [cu, mid - hv * 0.46],
      [cu + hv * 0.5, mid],
      [cu, mid + hv * 0.46],
    ]);
    const ju = i * cw;
    const [dx, dy] = m(ju, mid);
    dots.circle(dx, dy, 2.3);
    // temple-spire teeth on both red stripes
    for (const side of [-1, 1]) {
      const vb = side < 0 ? s * 2.1 : D - s * 2.1;
      const tip = vb + (side < 0 ? 1 : -1) * (c0 - s * 2.1 - 5);
      const k = cw * 0.22;
      poly(zig, [
        [cu - k, vb],
        [cu, tip],
        [cu + k, vb],
      ]);
    }
  }
  const frame = new Path();
  const a = m(0, 0);
  const b = m(len, D);
  frame.M(a[0], a[1]).L(b[0], b[1]);
  const specs: PartSpec[] = [
    { path: base, fill: o.black },
    { path: reds, fill: o.red },
    { path: hair, stroke: o.ivory, strokeWidth: 1.1, opacity: 0.85 },
    { path: core, fill: o.red },
    { path: zig, fill: o.ivory },
    { path: dia, fill: o.ivory },
    { path: diaIn, fill: o.black },
    { path: dots, fill: o.gold },
    { path: frame, stroke: null },
  ];
  return assemble(specs, 0, { w: o.vertical ? D : len, h: o.vertical ? len : D });
}

/** Square corner tile where two weave bands meet. */
export function cornerTile(o: { size: number; red: string; black: string; ivory: string; gold: string }): OrnamentData {
  const S = o.size;
  const c = S / 2;
  const sq = new Path().M(0, 0).L(S, 0).L(S, S).L(0, S).Z();
  const d1 = new Path().M(c, S * 0.12).L(S * 0.88, c).L(c, S * 0.88).L(S * 0.12, c).Z();
  const d2 = new Path().M(c, S * 0.26).L(S * 0.74, c).L(c, S * 0.74).L(S * 0.26, c).Z();
  const dot = new Path().circle(c, c, S * 0.1);
  return assemble(
    [
      { path: sq, fill: o.black },
      { path: d1, fill: o.red, stroke: o.ivory, strokeWidth: 1.2 },
      { path: d2, stroke: o.ivory, strokeWidth: 1 },
      { path: dot, fill: o.gold },
    ],
    0,
    { w: S, h: S },
  );
}

/** Bengal terracotta temple (chala roof tiers, spire, three pointed doorways). */
export function templeBig(o: { w: number; red: string; black: string; ivory: string; gold: string; line?: number }): OrnamentData {
  const w = o.w;
  const h = w * 1.18;
  const sw = o.line ?? 2;
  const x = (f: number) => f * w;
  const y = (f: number) => f * h;
  const plinth = new Path().M(x(0.02), y(1)).L(x(0.02), y(0.955)).L(x(0.06), y(0.955)).L(x(0.06), y(0.915)).L(x(0.94), y(0.915)).L(x(0.94), y(0.955)).L(x(0.98), y(0.955)).L(x(0.98), y(1)).Z();
  const body = new Path().M(x(0.12), y(0.915)).L(x(0.12), y(0.56)).L(x(0.88), y(0.56)).L(x(0.88), y(0.915)).Z();
  const tier = (bw: number, tw: number, yb: number, yt: number) => {
    const p = new Path();
    p.M(x(0.5 - bw / 2), y(yb))
      .Q(x(0.5 - bw / 2 + 0.03), y((yb + yt) / 2 + 0.02), x(0.5 - tw / 2), y(yt))
      .L(x(0.5 + tw / 2), y(yt))
      .Q(x(0.5 + bw / 2 - 0.03), y((yb + yt) / 2 + 0.02), x(0.5 + bw / 2), y(yb))
      .Q(x(0.5), y(yb + 0.035), x(0.5 - bw / 2), y(yb))
      .Z();
    return p;
  };
  const t1 = tier(0.96, 0.66, 0.56, 0.4);
  const t2 = tier(0.62, 0.4, 0.4, 0.26);
  const t3 = tier(0.38, 0.2, 0.26, 0.15);
  const spire = new Path().M(x(0.4), y(0.15)).Q(x(0.47), y(0.1), x(0.5), y(0.02)).Q(x(0.53), y(0.1), x(0.6), y(0.15)).Z();
  const fin = new Path().circle(x(0.5), y(0.02), w * 0.02);
  const doors = new Path();
  const ribs = new Path();
  [0.3, 0.5, 0.7].forEach((cx, i) => {
    const dw = i === 1 ? 0.15 : 0.12;
    const top = i === 1 ? 0.66 : 0.71;
    doors.M(x(cx - dw / 2), y(0.915)).L(x(cx - dw / 2), y(top + 0.06)).Q(x(cx - dw / 2), y(top + 0.015), x(cx), y(top)).Q(x(cx + dw / 2), y(top + 0.015), x(cx + dw / 2), y(top + 0.06)).L(x(cx + dw / 2), y(0.915)).Z();
  });
  // terracotta panel lines on the tiers and body
  for (const [bw, yb, yt] of [[0.8, 0.5, 0.42], [0.5, 0.36, 0.3]] as [number, number, number][]) {
    for (let i = 1; i <= 2; i++) {
      const yy = yb + ((yt - yb) * i) / 3;
      ribs.M(x(0.5 - bw / 2 + 0.07 * i), y(yy)).L(x(0.5 + bw / 2 - 0.07 * i), y(yy));
    }
  }
  for (let i = 0; i < 6; i++) ribs.M(x(0.17 + i * 0.132), y(0.575)).L(x(0.17 + i * 0.132), y(0.6));
  const dots = new Path();
  for (let i = 0; i < 9; i++) dots.circle(x(0.16 + i * 0.085), y(0.585), w * 0.008);
  return assemble(
    [
      { path: plinth, fill: o.black },
      { path: body, fill: "#e3c48e", stroke: o.black, strokeWidth: sw },
      { path: t1, fill: o.red, stroke: o.black, strokeWidth: sw },
      { path: t2, fill: o.red, stroke: o.black, strokeWidth: sw },
      { path: t3, fill: o.red, stroke: o.black, strokeWidth: sw },
      { path: spire, fill: o.black },
      { path: fin, fill: o.gold, stroke: o.black, strokeWidth: 1.4 },
      { path: ribs, stroke: o.ivory, strokeWidth: 1.4, opacity: 0.8 },
      { path: doors, fill: o.black },
      { path: dots, fill: o.red },
    ],
    0,
    { w, h },
  );
}

/** Row of tiny temple spires, used as divider. */
export function spireRow(o: { w: number; red: string; black: string; gold: string }): OrnamentData {
  const n = Math.max(3, Math.round(o.w / 38));
  const step = o.w / n;
  const spires = new Path();
  const caps = new Path();
  const base = new Path().M(0, 30).L(o.w, 30);
  for (let i = 0; i < n; i++) {
    const cx = (i + 0.5) * step;
    const k = step * 0.34;
    const tall = i % 2 === 0;
    spires.M(cx - k, 30).L(cx - k * 0.7, tall ? 14 : 20).L(cx - k * 0.4, tall ? 14 : 20).L(cx, tall ? 2 : 10).L(cx + k * 0.4, tall ? 14 : 20).L(cx + k * 0.7, tall ? 14 : 20).L(cx + k, 30).Z();
    if (tall) caps.circle(cx, 1.5, 1.8);
  }
  return assemble(
    [
      { path: base, stroke: o.black, strokeWidth: 1.6 },
      { path: spires, fill: o.red, stroke: o.black, strokeWidth: 1.2 },
      { path: caps, fill: o.gold },
    ],
    0,
    { w: o.w, h: 34 },
  );
}
