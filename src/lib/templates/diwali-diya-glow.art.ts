import { assemble, Path, petal, rad, type OrnamentData, type PartSpec } from "../design/path";
import type { Paint } from "../design/types";
import { scene, lcg } from "./eid-iftar-lanterns.art";

const CLAY: Paint = { kind: "linear", angle: 90, stops: [[0, "#f08a3a"], [0.55, "#c4491c"], [1, "#7e1f12"]] };
const GOLD_TRIM = "#f3cf7a";
const FLAME_OUT: Paint = { kind: "radial", stops: [[0, "#fff6c8"], [0.45, "#ffc83d"], [1, "#f06a10"]] };

/** One diya (clay lamp) with a flame; `cx, cy` is the centre of the rim. */
export function diyaParts(cx: number, cy: number, s: number, flame = true): PartSpec[] {
  const x = (v: number) => cx + v * s;
  const y = (v: number) => cy + v * s;
  const out: PartSpec[] = [];
  if (flame) {
    const outer = new Path()
      .M(x(0), y(-6))
      .C(x(-17), y(-18), x(-14), y(-42), x(0), y(-74))
      .C(x(14), y(-42), x(17), y(-18), x(0), y(-6))
      .Z();
    out.push({ path: outer, fill: FLAME_OUT, stroke: null });
    const inner = new Path()
      .M(x(0), y(-8))
      .C(x(-8), y(-15), x(-7), y(-30), x(0), y(-46))
      .C(x(7), y(-30), x(8), y(-15), x(0), y(-8))
      .Z();
    out.push({ path: inner, fill: "#fffbe6", opacity: 0.95 });
    const wick = new Path().M(x(0), y(-6)).L(x(0), y(2));
    out.push({ path: wick, stroke: "#3a1408", strokeWidth: 2 * s });
  }
  const body = new Path()
    .M(x(-40), y(0))
    .L(x(40), y(0))
    .C(x(40), y(28), x(20), y(44), x(0), y(44))
    .C(x(-20), y(44), x(-40), y(28), x(-40), y(0))
    .Z();
  out.push({ path: body, fill: CLAY, stroke: GOLD_TRIM, strokeWidth: 1.6 });
  const spout = new Path()
    .M(x(-38), y(2))
    .C(x(-52), y(0), x(-62), y(-6), x(-72), y(-14))
    .C(x(-64), y(4), x(-54), y(18), x(-34), y(22))
    .Z();
  out.push({ path: spout, fill: CLAY, stroke: GOLD_TRIM, strokeWidth: 1.4 });
  const rim = new Path().M(x(-44), y(0)).L(x(44), y(0));
  out.push({ path: rim, stroke: GOLD_TRIM, strokeWidth: 3 * s, lineCap: "round" });
  const dots = new Path();
  for (let i = 0; i < 7; i++) dots.circle(x(-27 + i * 9), y(10 + 0), 1.5 * s);
  out.push({ path: dots, fill: GOLD_TRIM });
  const petals = new Path();
  for (let i = 0; i < 5; i++) petal(petals, x(-24 + i * 12), y(40), rad(-90), 0, 18 * s, 4.4 * s, true);
  out.push({ path: petals, stroke: GOLD_TRIM, strokeWidth: 1.1, opacity: 0.9 });
  return out;
}

export function diyaRow(items: { cx: number; cy: number; s: number }[]): OrnamentData {
  return scene(items.flatMap((d) => diyaParts(d.cx, d.cy, d.s)));
}

/** Multi-ring rangoli medallion centred on (cx, cy) with radius R, in page coordinates. */
export function rangoliParts(cx: number, cy: number, R: number, pal: { a: string; b: string; c: string; d: string; e: string }): PartSpec[] {
  const out: PartSpec[] = [];
  const ring = (n: number, r0: number, r1: number, hw: number, fill: string, off = 0, pointed = true, line: string | null = "rgba(255,255,255,0.55)") => {
    const p = new Path();
    for (let i = 0; i < n; i++) petal(p, cx, cy, rad(((i + off) * 360) / n - 90), r0 * R, r1 * R, hw * R, pointed);
    out.push({ path: p, fill, stroke: line, strokeWidth: 1.2 });
  };
  // base disc
  out.push({ path: new Path().circle(cx, cy, R), fill: "rgba(20,6,40,0.55)", stroke: pal.e, strokeWidth: 2 });
  // outer drops
  const drops = new Path();
  for (let i = 0; i < 48; i++) {
    const a = rad((i * 360) / 48);
    drops.circle(cx + Math.cos(a) * R * 0.955, cy + Math.sin(a) * R * 0.955, R * 0.012);
  }
  out.push({ path: drops, fill: pal.e });
  ring(24, 0.62, 0.93, 0.05, pal.a, 0);
  ring(24, 0.62, 0.8, 0.045, pal.b, 0.5);
  const dots = new Path();
  for (let i = 0; i < 24; i++) {
    const a = rad(((i + 0.5) * 360) / 24 - 90);
    dots.circle(cx + Math.cos(a) * R * 0.88, cy + Math.sin(a) * R * 0.88, R * 0.014);
  }
  out.push({ path: dots, fill: "#fff3d0" });
  out.push({ path: new Path().circle(cx, cy, R * 0.6), stroke: pal.e, strokeWidth: 1.6 });
  ring(16, 0.2, 0.58, 0.075, pal.c, 0);
  ring(16, 0.2, 0.42, 0.06, pal.d, 0.5);
  ring(8, 0.1, 0.36, 0.06, pal.e, 0.5, true, "rgba(120,40,0,0.55)");
  const midDots = new Path();
  for (let i = 0; i < 16; i++) {
    const a = rad(((i + 0.5) * 360) / 16 - 90);
    midDots.circle(cx + Math.cos(a) * R * 0.5, cy + Math.sin(a) * R * 0.5, R * 0.012);
  }
  out.push({ path: midDots, fill: "#fff3d0" });
  out.push({ path: new Path().circle(cx, cy, R * 0.11), fill: pal.e, stroke: "#fff3d0", strokeWidth: 1.4 });
  out.push({ path: new Path().circle(cx, cy, R * 0.045), fill: "#8a1d1d" });
  return out;
}

export function rangoli(R: number, pal: Parameters<typeof rangoliParts>[3]): OrnamentData {
  const size = R * 2 + 8;
  return assemble(rangoliParts(R + 4, R + 4, R, pal), 0, { w: size, h: size, dx: 0, dy: 0 });
}

function bloom(p1: Path, p2: Path, p3: Path, cx: number, cy: number, r: number, rot: number) {
  for (let i = 0; i < 11; i++) petal(p1, cx, cy, rot + (i * Math.PI * 2) / 11, r * 0.15, r, r * 0.26, false);
  for (let i = 0; i < 8; i++) petal(p2, cx, cy, rot + 0.3 + (i * Math.PI * 2) / 8, r * 0.1, r * 0.62, r * 0.2, false);
  p3.circle(cx, cy, r * 0.13);
}

/** Marigold toran: swags of flower heads across the top with hanging pendants. */
export function marigoldToran(sag = 62, n = 5): OrnamentData {
  const o1 = new Path();
  const o2 = new Path();
  const c = new Path();
  const strings = new Path();
  const leafP = new Path();
  const rnd = lcg(5);
  const seg = 1000 / n;
  for (let k = 0; k < n; k++) {
    const x0 = k * seg;
    const x1 = x0 + seg;
    const top = 6;
    const ctrl: [number, number] = [(x0 + x1) / 2, top + sag * 2];
    const pt = (t: number): [number, number] => {
      const u = 1 - t;
      return [u * u * x0 + 2 * u * t * ctrl[0] + t * t * x1, u * u * top + 2 * u * t * ctrl[1] + t * t * top];
    };
    strings.M(...pt(0));
    for (let i = 1; i <= 24; i++) strings.L(...pt(i / 24));
    const cnt = 9;
    for (let i = 0; i <= cnt; i++) {
      const [px, py] = pt(i / cnt);
      bloom(o1, o2, c, px, py, 19, rnd() * 6);
    }
    // pendant at the lowest point
    const [mx, my] = pt(0.5);
    strings.M(mx, my).L(mx, my + 54);
    bloom(o1, o2, c, mx, my + 62, 17, rnd() * 6);
    for (const d of [-1, 1]) {
      const bx = mx + d * 10;
      const by = my + 80;
      // mango leaf
      const a = Math.PI / 2 + d * 0.28;
      const len = 46;
      const nx = -Math.sin(a);
      const ny = Math.cos(a);
      const tipX = bx + Math.cos(a) * len;
      const tipY = by + Math.sin(a) * len;
      leafP
        .M(mx, my + 78)
        .C(bx + nx * 14 + Math.cos(a) * 14, by + ny * 14 + Math.sin(a) * 14, tipX + nx * 9, tipY + ny * 9, tipX, tipY)
        .C(tipX - nx * 9, tipY - ny * 9, bx - nx * 14 + Math.cos(a) * 14, by - ny * 14 + Math.sin(a) * 14, mx, my + 78)
        .Z();
    }
    strings.include([x0, 0], [x1, my + 130]);
  }
  const specs: PartSpec[] = [
    { path: strings, stroke: "#e0b050", strokeWidth: 1.6, opacity: 0.8 },
    { path: leafP, fill: "#2f8f4a", stroke: "#1b5e30", strokeWidth: 1 },
    { path: o1, fill: "#ff8a12", stroke: "#b84a00", strokeWidth: 0.8 },
    { path: o2, fill: "#ffc02e", stroke: "#d77a00", strokeWidth: 0.6 },
    { path: c, fill: "#9a3a00" },
  ];
  return assemble(specs, 0, { w: 1000, h: 6 + sag + 160, dx: 0, dy: 0 });
}

/** Scatter of marigold petals as small filled teardrops. */
export function petalScatter(seed: number, count: number, avoid: [number, number, number, number][]): OrnamentData {
  const rnd = lcg(seed);
  const a = new Path();
  const b = new Path();
  let guard = 0;
  let n = 0;
  while (n < count && guard++ < count * 40) {
    const x = 30 + rnd() * 940;
    const y = 30 + rnd() * 1340;
    if (avoid.some(([x0, y0, x1, y1]) => x > x0 && x < x1 && y > y0 && y < y1)) continue;
    const r = 8 + rnd() * 9;
    petal(rnd() < 0.55 ? a : b, x, y, rnd() * Math.PI * 2, 0, r * 2, r * 0.5, false);
    n++;
  }
  return assemble(
    [
      { path: a, fill: "#ff9a1f", opacity: 0.8 },
      { path: b, fill: "#ffc83d", opacity: 0.75 },
    ],
    0,
    { w: 1000, h: 1400, dx: 0, dy: 0 },
  );
}
