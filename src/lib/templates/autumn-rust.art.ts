import { centerRotate } from "../design/layers";
import { assemble, leaf, Path, type OrnamentData } from "../design/path";
import type { Layer, Paint } from "../design/types";
import { linear, lock, O } from "./kit";

export const AUTUMN = {
  rust: ["#c9703f", "#a8431f"] as [string, string],
  mustard: ["#e6b94d", "#c48a22"] as [string, string],
  olive: ["#8a9250", "#5c6434"] as [string, string],
  burgundy: ["#9b3446", "#5b1a2b"] as [string, string],
  copper: ["#d98b4f", "#b2552a"] as [string, string],
  sage: ["#a3a878", "#6e7646"] as [string, string],
};
export type LeafTone = keyof typeof AUTUMN;

const grad = (a: string, b: string, angle = 70): Paint => linear(angle, [0, a], [1, b]);

/** Maple leaf: pointed lobes sampled from a polar curve, with veins and a stem. */
export function mapleLeaf(size: number, tone: LeafTone, veinColor = "#fff1d0"): OrnamentData {
  const [a, b] = AUTUMN[tone];
  const lobes: [number, number, number][] = [
    [0, 1, 14],
    [-60, 0.9, 12],
    [60, 0.9, 12],
    [-122, 0.58, 11],
    [122, 0.58, 11],
  ];
  const c = size / 2;
  const R = size * 0.46;
  const cy = size * 0.52;
  const pts: [number, number][] = [];
  for (let d = -180; d < 180; d += 1.5) {
    let r = 0.4;
    for (const [at, amp, w] of lobes) {
      const dd = Math.abs(((d - at + 540) % 360) - 180);
      r = Math.max(r, 0.4 + (amp - 0.4) * Math.exp(-dd / w));
    }
    // fine serration
    r *= 0.95 + 0.05 * Math.cos((d * Math.PI) / 180 * 18);
    // notch the stem side
    if (Math.abs(d) > 165) r *= 0.82;
    const t = (d * Math.PI) / 180;
    pts.push([c + Math.sin(t) * r * R * 1.05, cy - Math.cos(t) * r * R]);
  }
  const body = new Path().poly(pts, true);
  const veins = new Path();
  for (const [at, amp] of lobes) {
    const t = (at * Math.PI) / 180;
    veins.M(c, cy + R * 0.12).L(c + Math.sin(t) * amp * R * 0.82, cy - Math.cos(t) * amp * R * 0.82);
  }
  const stem = new Path().M(c, cy + R * 0.1).Q(c + size * 0.02, cy + R * 0.7, c - size * 0.02, size - 1);
  return assemble(
    [
      { path: body, fill: grad(a, b, 60) },
      { path: veins, stroke: veinColor, strokeWidth: Math.max(1.2, size * 0.011), opacity: 0.5 },
      { path: stem, stroke: b, strokeWidth: Math.max(1.8, size * 0.022) },
    ],
    0,
    { w: size, h: size },
  );
}

/** Oak leaf: rounded lobes along a midrib. */
export function oakLeaf(size: number, tone: LeafTone, veinColor = "#fff1d0"): OrnamentData {
  const [a, b] = AUTUMN[tone];
  const w = size * 0.6;
  const h = size;
  const cx = w / 2;
  const stemH = h * 0.1;
  const L = h - stemH;
  const k = 4.5;
  const hw = (t: number, ph: number) => {
    const env = Math.pow(Math.sin(Math.PI * Math.pow(t, 0.8)), 0.8);
    const lobe = 0.42 + 0.58 * Math.pow(Math.abs(Math.sin(Math.PI * k * t + ph)), 0.7);
    return env * lobe * (w / 2) * 0.96 + 0.5;
  };
  const right: [number, number][] = [];
  const left: [number, number][] = [];
  for (let i = 0; i <= 64; i++) {
    const t = i / 64;
    const y = L - t * L;
    right.push([cx + hw(t, 0.2), y]);
    left.push([cx - hw(t, 0.9), y]);
  }
  const body = new Path().poly([...right, ...left.reverse()], true);
  const veins = new Path();
  veins.M(cx, L).L(cx, 3);
  for (let i = 0; i < 4; i++) {
    const t = 0.18 + i * 0.19;
    const y = L - t * L;
    veins.M(cx, y + 6).L(cx + hw(t + 0.03, 0.2) * 0.8, y - 10);
    veins.M(cx, y + 6).L(cx - hw(t + 0.03, 0.9) * 0.8, y - 10);
  }
  const stem = new Path().M(cx, L - 2).L(cx + 1, h);
  return assemble(
    [
      { path: body, fill: grad(a, b, 80) },
      { path: veins, stroke: veinColor, strokeWidth: Math.max(1.2, size * 0.01), opacity: 0.5 },
      { path: stem, stroke: b, strokeWidth: Math.max(1.8, size * 0.02) },
    ],
    0,
    { w, h },
  );
}

/** A slender elliptical leaf (for the draped branch). */
export function slimLeaf(size: number, tone: LeafTone): OrnamentData {
  const [a, b] = AUTUMN[tone];
  const p = new Path();
  leaf(p, [size * 0.2, size * 0.5], 0, size * 0.78, size * 0.22);
  const mid = new Path().M(size * 0.2, size * 0.5).L(size * 0.98, size * 0.5);
  return assemble(
    [
      { path: p, fill: grad(a, b, 20) },
      { path: mid, stroke: "#fff1d0", strokeWidth: 1.2, opacity: 0.4 },
    ],
    0,
    { w: size, h: size },
  );
}

/** Draped branch: the stem curves from the origin down-left, with leaves and berry clusters. */
export function berryBranch(len: number, seed = 1): OrnamentData {
  const rnd = (() => {
    let s = seed * 9301;
    return () => ((s = (s * 49297 + 233280) % 233280) / 233280);
  })();
  const w = len;
  const h = len * 0.62;
  const P0: [number, number] = [w - 6, 6];
  const P1: [number, number] = [w * 0.5, -h * 0.05];
  const P2: [number, number] = [w * 0.2, h * 0.3];
  const P3: [number, number] = [6, h - 6];
  const at = (t: number): [number, number, number] => {
    const u = 1 - t;
    const x = u * u * u * P0[0] + 3 * u * u * t * P1[0] + 3 * u * t * t * P2[0] + t * t * t * P3[0];
    const y = u * u * u * P0[1] + 3 * u * u * t * P1[1] + 3 * u * t * t * P2[1] + t * t * t * P3[1];
    const dx = 3 * u * u * (P1[0] - P0[0]) + 6 * u * t * (P2[0] - P1[0]) + 3 * t * t * (P3[0] - P2[0]);
    const dy = 3 * u * u * (P1[1] - P0[1]) + 6 * u * t * (P2[1] - P1[1]) + 3 * t * t * (P3[1] - P2[1]);
    return [x, y, Math.atan2(dy, dx)];
  };
  const stem = new Path().M(...P0).C(...P1, ...P2, ...P3);
  const colors: [string, Path][] = [
    ["#6e7646", new Path()],
    ["#8a9250", new Path()],
    ["#c48a22", new Path()],
    ["#a8431f", new Path()],
  ];
  const berries = new Path();
  const berriesHi = new Path();
  const twigs = new Path();
  const n = 11;
  for (let i = 1; i <= n; i++) {
    const t = i / (n + 1);
    const [x, y, a] = at(t);
    const side = i % 2 === 0 ? 1 : -1;
    const ll = len * (0.12 + 0.05 * rnd());
    leaf(colors[(i + 1) % 4][1], [x, y], a + side * (0.9 + rnd() * 0.3), ll, ll * 0.2);
    if (i % 3 === 0) {
      // berry cluster on a short twig
      const ta = a - side * (0.7 + rnd() * 0.3);
      const tl = len * 0.07;
      const ex = x + Math.cos(ta) * tl;
      const ey = y + Math.sin(ta) * tl;
      twigs.M(x, y).L(ex, ey);
      for (let j = 0; j < 4; j++) {
        const bx = ex + (rnd() - 0.5) * len * 0.05;
        const by = ey + (rnd() - 0.5) * len * 0.05;
        const r = len * (0.012 + rnd() * 0.008);
        berries.circle(bx, by, r);
        berriesHi.circle(bx - r * 0.3, by - r * 0.3, r * 0.3);
      }
    }
  }
  const specs = [
    { path: stem, stroke: "#5a4632", strokeWidth: Math.max(2.5, len * 0.012) },
    { path: twigs, stroke: "#5a4632", strokeWidth: 1.6 },
    ...colors.map(([c, path]) => ({ path, fill: c as Paint, opacity: 0.95 })),
    { path: berries, fill: grad("#b13a50", "#5b1a2b", 60) },
    { path: berriesHi, fill: "#ffffff" as Paint, opacity: 0.35 },
  ];
  specs.forEach((s) => s.path.include([0, 0], [w, h]));
  return assemble(specs, 0, { w, h });
}

export interface Placed {
  kind: "maple" | "oak" | "slim";
  tone: LeafTone;
  cx: number;
  cy: number;
  size: number;
  rot: number;
  opacity?: number;
}

export function placeLeaves(items: Placed[]): Layer[] {
  return items.map((it) => {
    const data = it.kind === "maple" ? mapleLeaf(it.size, it.tone) : it.kind === "oak" ? oakLeaf(it.size, it.tone) : slimLeaf(it.size, it.tone);
    const layer = O(data, { x: 0, y: 0, width: data.vbW, opacity: it.opacity ?? 1 });
    return lock(centerRotate(layer, it.cx, it.cy, it.rot));
  });
}

/** A leafy cluster around (cx,cy): mirrored/rotated variants make the top and bottom corners differ. */
export function cluster(cx: number, cy: number, scale: number, flip = 1, rotate = 0): Placed[] {
  const spec: [Placed["kind"], LeafTone, number, number, number, number, number][] = [
    // kind, tone, dx, dy, size, rot, opacity
    ["oak", "olive", -60, 70, 230, -35, 0.95],
    ["oak", "copper", 90, -40, 250, 128, 0.95],
    ["maple", "burgundy", -10, 10, 210, 12, 1],
    ["maple", "mustard", 85, 105, 170, 40, 0.95],
    ["maple", "rust", -120, -20, 190, -64, 0.95],
    ["oak", "mustard", -20, 150, 190, 160, 0.9],
    ["maple", "sage", 150, 20, 120, 75, 0.85],
    ["slim", "olive", -150, 110, 150, 205, 0.9],
  ];
  return spec.map(([kind, tone, dx, dy, size, rot, opacity]) => {
    const a = (rotate * Math.PI) / 180;
    const x = dx * flip * scale;
    const y = dy * scale;
    return {
      kind,
      tone,
      cx: cx + x * Math.cos(a) - y * Math.sin(a),
      cy: cy + x * Math.sin(a) + y * Math.cos(a),
      size: size * scale,
      rot: rot * flip + rotate,
      opacity,
    };
  });
}
