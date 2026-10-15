import { assemble, Path, petal, rad, type OrnamentData, type PartSpec } from "../design/path";

/** Fine line-art shapla (water lily), outline only. */
export function lineShapla(o: { color: string; sw?: number }): OrnamentData {
  const sw = o.sw ?? 1.6;
  const cx = 110;
  const by = 104;
  const specs: PartSpec[] = [];
  const angles = [-72, -48, -24, 24, 48, 72, 0];
  const lens = [64, 82, 96, 96, 82, 64, 100];
  angles.forEach((a, i) => {
    const p = new Path();
    petal(p, cx, by, rad(-90 + a), 6, lens[i], lens[i] * 0.17);
    specs.push({ path: p, stroke: o.color, strokeWidth: i === 6 ? sw * 1.1 : sw });
  });
  const base = new Path().M(cx - 78, by + 4).L(cx + 78, by + 4);
  specs.push({ path: base, stroke: o.color, strokeWidth: sw * 0.8 });
  const dots = new Path();
  [-34, -17, 0, 17, 34].forEach((x) => dots.circle(cx + x, by + 4, 1.6));
  specs.push({ path: dots, fill: o.color });
  return assemble(specs, 2, { w: 220, h: 112 });
}

/** Little notched corner mark (L-shaped hairline with a dot). */
export function cornerTick(o: { color: string; size?: number; sw?: number }): OrnamentData {
  const s = o.size ?? 60;
  const p = new Path().M(0, s).L(0, 0).L(s, 0);
  const d = new Path().circle(s * 0.28, s * 0.28, 2.4);
  return assemble(
    [
      { path: p, stroke: o.color, strokeWidth: o.sw ?? 1.6, lineJoin: "miter", lineCap: "butt" },
      { path: d, fill: o.color },
    ],
    3,
    { w: s + 6, h: s + 6, dx: 3, dy: 3 },
  );
}

/** Radiating hairline sun, used as a faint halo behind the headline. */
export function hairSun(o: { color: string; size: number; rays?: number; sw?: number }): OrnamentData {
  const S = o.size;
  const c = S / 2;
  const rays = o.rays ?? 72;
  const p = new Path();
  for (let i = 0; i < rays; i++) {
    const a = rad((360 / rays) * i);
    const r0 = c * (i % 2 ? 0.9 : 0.86);
    p.M(c + Math.cos(a) * r0, c + Math.sin(a) * r0).L(c + Math.cos(a) * c * 0.99, c + Math.sin(a) * c * 0.99);
  }
  const ring = new Path().circle(c, c, c * 0.8);
  return assemble(
    [
      { path: p, stroke: o.color, strokeWidth: o.sw ?? 1.2, lineCap: "butt" },
      { path: ring, stroke: o.color, strokeWidth: o.sw ?? 1.2 },
    ],
    0,
    { w: S, h: S },
  );
}
