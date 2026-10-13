import { assemble, Path, type OrnamentData, type PartSpec } from "../design/path";
import { centerRotate } from "../design/layers";
import type { OrnamentLayer, Paint } from "../design/types";
import { O } from "./kit";
import { XF } from "./art-utils";

const rad = (d: number) => (d * Math.PI) / 180;
const KAPPA = 0.5523;

/** Ellipse in a rotated local frame (rot = rotation of the ellipse's own axes). */
function ellipse(p: Path, cx: number, cy: number, rx: number, ry: number, rot = 0) {
  const x = new XF(p, cx, cy, rot);
  x.M(rx, 0)
    .C(rx, ry * KAPPA, rx * KAPPA, ry, 0, ry)
    .C(-rx * KAPPA, ry, -rx, ry * KAPPA, -rx, 0)
    .C(-rx, -ry * KAPPA, -rx * KAPPA, -ry, 0, -ry)
    .C(rx * KAPPA, -ry, rx, -ry * KAPPA, rx, 0)
    .Z();
}

export interface Feather {
  data: OrnamentData;
  w: number;
  h: number;
  /** quill base inside the artwork box */
  bx: number;
  by: number;
}

export interface FeatherOpts {
  L: number;
  /** quill bend (fraction of length) */
  k?: number;
  /** barb half-width */
  wmax?: number;
  /** base eye radius */
  eye?: number;
}

/**
 * A single peacock feather pointing up from its base: curved quill, hundreds of fine barbs
 * in bronze -> emerald -> teal bands, a radiating fringe, and a layered eye
 * (emerald halo, gold ring, teal, sapphire, dark centre with a highlight).
 */
export function peacockFeather(o: FeatherOpts): Feather {
  const L = o.L;
  const k = o.k ?? 0.1;
  const wmax = o.wmax ?? L * 0.22;
  const e = o.eye ?? L * 0.05;
  const P = (t: number): [number, number] => [k * L * t * t, -L * t];
  const Tn = (t: number): [number, number] => {
    const tx = 2 * k * L * t;
    const ty = -L;
    const m = Math.hypot(tx, ty);
    return [tx / m, ty / m];
  };
  const specs: PartSpec[] = [];
  const E = P(1);
  const tang = Math.atan2(Tn(1)[1], Tn(1)[0]); // direction of the quill at the eye
  const rot = tang + Math.PI / 2; // eye ellipse axes: ry along the quill

  // --- barbs -------------------------------------------------------
  const barbPath = (t0: number, t1: number, n: number, lenK: number, offset: number) => {
    const p = new Path();
    for (let i = 0; i < n; i++) {
      const t = t0 + ((i + offset) / n) * (t1 - t0);
      const [px, py] = P(t);
      const [tx, ty] = Tn(t);
      const env = 0.3 + 0.7 * Math.sin(Math.min(1, t / 0.86) * (Math.PI / 2));
      const len = wmax * env * lenK * (0.9 + 0.2 * Math.sin(i * 12.9898));
      const phi = rad(72 - 34 * t);
      for (const s of [-1, 1]) {
        const dx = tx * Math.cos(phi) + -ty * s * Math.sin(phi);
        const dy = ty * Math.cos(phi) + tx * s * Math.sin(phi);
        const ex = px + dx * len;
        const ey = py + dy * len;
        const cx = px + dx * len * 0.55 + tx * len * 0.14;
        const cy = py + dy * len * 0.55 + ty * len * 0.14;
        p.M(px, py).Q(cx, cy, ex, ey);
      }
    }
    return p;
  };
  // under-layer: dark teal for depth
  specs.push({ path: barbPath(0.06, 0.9, 70, 1.0, 0.5), stroke: "#063f46", strokeWidth: 1.6, opacity: 0.9 });
  specs.push({ path: barbPath(0.06, 0.34, 46, 1.0, 0), stroke: "#b8944a", strokeWidth: 1, opacity: 0.85 });
  specs.push({ path: barbPath(0.34, 0.62, 56, 1.0, 0), stroke: "#1f9f78", strokeWidth: 1, opacity: 0.92 });
  specs.push({ path: barbPath(0.62, 0.9, 56, 1.0, 0), stroke: "#16a8a6", strokeWidth: 1, opacity: 0.95 });
  specs.push({ path: barbPath(0.16, 0.88, 24, 0.82, 0.3), stroke: "#e6c973", strokeWidth: 0.9, opacity: 0.7 });
  specs.push({ path: barbPath(0.4, 0.88, 18, 0.7, 0.6), stroke: "#2b6fd0", strokeWidth: 0.9, opacity: 0.65 });

  // --- quill -------------------------------------------------------
  const quill = new Path();
  quill.M(0, 0);
  for (let i = 1; i <= 12; i++) {
    const [x, y] = P(i / 12);
    quill.L(x, y);
  }
  specs.push({ path: quill, stroke: "#5b4420", strokeWidth: 4.2 });
  specs.push({ path: quill, stroke: "#d9bd7a", strokeWidth: 1.5 });

  // --- fringe around the eye --------------------------------------
  const rEll = (th: number, rx: number, ry: number) => {
    // radius along the world angle th for an ellipse whose axes follow `rot`
    const a = th - rot;
    return 1 / Math.sqrt((Math.cos(a) / rx) ** 2 + (Math.sin(a) / ry) ** 2);
  };
  const halo = { rx: e * 2.0, ry: e * 2.75 };
  const fr: Path[] = [new Path(), new Path(), new Path()];
  const N = 54;
  for (let j = 0; j <= N; j++) {
    const th = rad(-200 + (j * 220) / N);
    const r0 = rEll(th, halo.rx, halo.ry) * 0.92;
    const r1 = r0 + e * (0.9 + 0.7 * Math.abs(Math.sin(j * 3.1)));
    fr[j % 3].M(E[0] + Math.cos(th) * r0, E[1] + Math.sin(th) * r0).L(E[0] + Math.cos(th) * r1, E[1] + Math.sin(th) * r1);
  }
  specs.push({ path: fr[0], stroke: "#16a8a6", strokeWidth: 1.3, opacity: 0.95 });
  specs.push({ path: fr[1], stroke: "#e6c973", strokeWidth: 1.1, opacity: 0.85 });
  specs.push({ path: fr[2], stroke: "#1f9f78", strokeWidth: 1.3, opacity: 0.95 });

  // --- the eye -----------------------------------------------------
  const layer = (rxm: number, rym: number, dy = 0) => {
    const p = new Path();
    const off = XF.prototype.pt.call(new XF(p, E[0], E[1], rot), 0, dy);
    ellipse(p, off[0], off[1], e * rxm, e * rym, rot);
    return p;
  };
  specs.push({
    path: layer(2.0, 2.75),
    fill: { kind: "radial", stops: [[0, "#0f9d7a"], [0.7, "#0b7a63"], [1, "#075448"]] },
    stroke: "#d4b25f",
    strokeWidth: 1.4,
  });
  specs.push({ path: layer(1.62, 2.2), fill: { kind: "linear", angle: 90, stops: [[0, "#f0d98c"], [0.5, "#b8903c"], [1, "#e2c26d"]] } });
  specs.push({ path: layer(1.42, 1.96), fill: { kind: "radial", stops: [[0, "#1bb7b0"], [1, "#0a7f86"]] } });
  specs.push({ path: layer(1.12, 1.56), fill: { kind: "radial", stops: [[0, "#3a7be0"], [0.6, "#1d4fa8"], [1, "#12306f"]] }, stroke: "#0b2a5c", strokeWidth: 1 });
  specs.push({ path: layer(0.78, 1.1), fill: { kind: "radial", stops: [[0, "#13a8c4"], [1, "#0b5f86"]] } });
  specs.push({ path: layer(0.46, 0.7, 0.05 * e), fill: { kind: "radial", stops: [[0, "#10305a"], [1, "#050f24"]] } });
  specs.push({ path: layer(0.16, 0.26, -0.28 * e), fill: "#7fe8dc", opacity: 0.75 });

  // --- box ---------------------------------------------------------
  const half = k * L + wmax + e * 3.4 + 24;
  const top = L + e * 2.75 + e * 2.6 + 26;
  const w = half * 2;
  const h = top + 14;
  return { data: assemble(specs, 0, { w, h, dx: half, dy: top }), w, h, bx: half, by: top };
}

/** Place a feather so its quill base sits at (Bx, By), rotated `deg` clockwise from vertical, drawn `scale` times its natural size. */
export function placeFeather(f: Feather, scale: number, Bx: number, By: number, deg: number, extra: { opacity?: number; flipX?: boolean } = {}): OrnamentLayer {
  const layer = O(f.data, { width: f.w * scale, opacity: extra.opacity ?? 1, flipX: extra.flipX });
  const a = rad(deg);
  const ox = ((extra.flipX ? f.w - f.bx : f.bx) - f.w / 2) * scale;
  const oy = (f.by - f.h / 2) * scale;
  const cx = Bx - (ox * Math.cos(a) - oy * Math.sin(a));
  const cy = By - (ox * Math.sin(a) + oy * Math.cos(a));
  return { ...centerRotate(layer, cx, cy, deg), locked: true };
}

/** A small gold crest/jewel used to hide the feather bases: layered gold rings with a sapphire stone. */
export function jewelCrest(size = 160): OrnamentData {
  const c = size / 2;
  const specs: PartSpec[] = [];
  const gold = { kind: "linear", angle: 120, stops: [[0, "#f6e3a1"], [0.35, "#c79a45"], [0.7, "#f1d78b"], [1, "#9a7433"]] } as unknown as Paint;
  const petals = new Path();
  for (let i = 0; i < 16; i++) {
    const a = rad(i * 22.5);
    const x = new XF(petals, c, c, a);
    x.M(c * 0.48, 0).C(c * 0.62, -c * 0.12, c * 0.82, -c * 0.1, c * 0.97, 0).C(c * 0.82, c * 0.1, c * 0.62, c * 0.12, c * 0.48, 0).Z();
  }
  specs.push({ path: petals, fill: gold, stroke: "#6e5222", strokeWidth: 1 });
  specs.push({ path: new Path().circle(c, c, c * 0.5), fill: gold, stroke: "#6e5222", strokeWidth: 1.2 });
  specs.push({ path: new Path().circle(c, c, c * 0.4), fill: { kind: "radial", stops: [[0, "#2f6fd2"], [0.7, "#123a86"], [1, "#0a1f4d"]] }, stroke: "#f3dca0", strokeWidth: 2 });
  specs.push({ path: new Path().circle(c, c, c * 0.22), fill: { kind: "radial", stops: [[0, "#1fc2b8"], [1, "#0b6f86"]] } });
  specs.push({ path: new Path().circle(c - c * 0.07, c - c * 0.09, c * 0.06), fill: "#ffffff", opacity: 0.7 });
  return assemble(specs, 0, { w: size, h: size });
}
