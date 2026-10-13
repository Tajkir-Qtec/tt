import { assemble, leaf, Path, type OrnamentData, type PartSpec } from "../design/path";
import type { Layer } from "../design/types";
import { lock, O } from "./kit";
import { centerRotate } from "../design/layers";

export const LILACS = ["#8d6fb8", "#a98bd0", "#7b5aa6", "#c3a8e0", "#6a4b96"];

export interface StalkOpts {
  length: number;
  /** Horizontal tip offset (positive leans right). */
  bend: number;
  colors?: string[];
  budLen?: number;
  stemColor?: string;
  leaves?: boolean;
}

/** One lavender stalk. Base sits at the bottom-centre of the (fixed) viewBox. */
export function lavenderStalk(o: StalkOpts): OrnamentData {
  const L = o.length;
  const bend = o.bend;
  const pad = 40;
  const w = Math.abs(bend) * 2 + pad * 2 + 60;
  const h = L + 20;
  const bx = w / 2;
  const by = h;
  const P0: [number, number] = [bx, by];
  const P1: [number, number] = [bx + bend * 0.1, by - L * 0.55];
  const P2: [number, number] = [bx + bend, by - L];
  const at = (t: number): [number, number, number] => {
    const u = 1 - t;
    const x = u * u * P0[0] + 2 * u * t * P1[0] + t * t * P2[0];
    const y = u * u * P0[1] + 2 * u * t * P1[1] + t * t * P2[1];
    const tx = 2 * u * (P1[0] - P0[0]) + 2 * t * (P2[0] - P1[0]);
    const ty = 2 * u * (P1[1] - P0[1]) + 2 * t * (P2[1] - P1[1]);
    return [x, y, Math.atan2(ty, tx)];
  };
  const colors = o.colors ?? LILACS;
  const bud = o.budLen ?? 30;
  const stem = new Path().M(...P0).Q(P1[0], P1[1], P2[0], P2[1]);
  const specs: PartSpec[] = [{ path: stem, stroke: o.stemColor ?? "#7d8f6a", strokeWidth: 3.6, opacity: 0.95 }];
  if (o.leaves !== false) {
    const lp = new Path();
    const [x1, y1] = at(0.04);
    leaf(lp, [x1, y1], -Math.PI / 2 - 0.5, L * 0.3, 7);
    leaf(lp, [x1, y1], -Math.PI / 2 + 0.55, L * 0.24, 6);
    specs.push({ path: lp, fill: "#8fa07c", opacity: 0.9 });
  }
  const groups = colors.map(() => new Path());
  const hi = new Path();
  const n = 19;
  for (let i = 0; i < n; i++) {
    const t = 0.32 + (i / (n - 1)) * 0.66;
    const k = 1 - (i / (n - 1)) * 0.55; // taper toward the tip
    const [x, y, a] = at(t);
    const len = bud * k;
    const wd = 8.4 * k + 2;
    const spread = 0.62 - i * 0.012;
    [-1, 1].forEach((s, j) => {
      const g = groups[(i * 2 + j + (i % 3)) % groups.length];
      leaf(g, [x, y], a + s * spread, len, wd);
      // second, slightly shorter bud for fullness
      if (i < n - 2) leaf(g, [x, y], a + s * (spread + 0.45), len * 0.72, wd * 0.9);
    });
    // upright centre bud
    if (i % 2 === 0) leaf(groups[(i + 1) % groups.length], [x, y], a + (i % 4 === 0 ? 0.12 : -0.12), len * 0.9, wd * 0.9);
  }
  // terminal bud
  const [tx, ty, ta] = at(1);
  leaf(groups[1], [tx, ty], ta, bud * 0.6, 4);
  // tiny highlights
  for (let i = 3; i < n; i += 2) {
    const [x, y, a] = at(0.32 + (i / (n - 1)) * 0.66);
    leaf(hi, [x, y], a + (i % 4 === 1 ? 0.8 : -0.8), bud * 0.35, 2.4);
  }
  groups.forEach((g, i) => specs.push({ path: g, fill: colors[i], opacity: 0.88 }));
  specs.push({ path: hi, fill: "#efe3fa", opacity: 0.55 });
  // keep viewBox fixed so the base is exactly bottom-centre
  specs.forEach((s) => s.path.include([0, 0], [w, h]));
  return assemble(specs, 0, { w, h });
}

export interface StalkSpec {
  angle: number;
  length: number;
  bend: number;
  width?: number;
  opacity?: number;
  colors?: string[];
}

/** Fan of stalks whose bases meet at (bx, by); angle is measured from vertical (clockwise). */
export function bouquet(bx: number, by: number, stalks: StalkSpec[], scale = 1, flipX = false): Layer[] {
  return stalks.map((s) => {
    const len = s.length * scale;
    const data = lavenderStalk({ length: len, bend: s.bend * scale * (flipX ? -1 : 1), colors: s.colors, budLen: 26 + len * 0.045 });
    const layer = O(data, { x: 0, y: 0, width: data.vbW, opacity: s.opacity ?? 1 });
    layer.height = data.vbH;
    const a = ((flipX ? -s.angle : s.angle) * Math.PI) / 180;
    const cx = bx + (layer.height / 2) * Math.sin(a);
    const cy = by - (layer.height / 2) * Math.cos(a);
    return lock(centerRotate(layer, cx, cy, flipX ? -s.angle : s.angle));
  });
}

export const FAN: StalkSpec[] = [
  { angle: -22, length: 540, bend: -34, opacity: 0.9, colors: ["#a98bd0", "#c3a8e0", "#8d6fb8", "#b79ad8", "#7b5aa6"] },
  { angle: -6, length: 700, bend: 22 },
  { angle: 6, length: 630, bend: -18, colors: ["#7b5aa6", "#8d6fb8", "#6a4b96", "#a98bd0", "#9577c2"] },
  { angle: 17, length: 560, bend: 30, opacity: 0.92 },
  { angle: 29, length: 450, bend: -22, opacity: 0.85, colors: ["#c3a8e0", "#b79ad8", "#a98bd0", "#d4bdea", "#8d6fb8"] },
  { angle: -32, length: 400, bend: -20, opacity: 0.8, colors: ["#c3a8e0", "#a98bd0", "#d4bdea", "#b79ad8", "#8d6fb8"] },
  { angle: 23, length: 400, bend: -26, opacity: 0.95, colors: ["#6a4b96", "#7b5aa6", "#8d6fb8", "#9577c2", "#a98bd0"] },
];
