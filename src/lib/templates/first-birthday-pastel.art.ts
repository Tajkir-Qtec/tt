import { Path, type PartSpec } from "../design/path";
import type { OrnamentLayer } from "../design/types";
import { ellipsePath, place } from "./birthday-balloons-bold.art";

/** Soft fluffy cloud from overlapping circles + a flat-ish base. All arcs share winding so the union fills solid. */
export function cloud(cx: number, cy: number, w: number, color: string, shade?: string, opacity = 1): OrnamentLayer {
  const h = w * 0.5;
  const base = new Path();
  const addBlob = (p: Path, dy = 0, grow = 1) => {
    const blobs: [number, number, number][] = [
      [-0.3, 0.12, 0.2],
      [-0.1, -0.12, 0.26],
      [0.17, -0.04, 0.23],
      [0.34, 0.12, 0.17],
      [0, 0.14, 0.2],
    ];
    for (const [bx, by, br] of blobs) {
      const c = ellipsePath(cx + bx * w, cy + by * h + dy, br * w * grow, br * w * grow, 0);
      c.pts.length && p.pts.push(...c.pts);
      p.M(cx + bx * w - br * w * grow, cy + by * h + dy).A(br * w * grow, br * w * grow, 0, 1, 0, cx + bx * w + br * w * grow, cy + by * h + dy).A(br * w * grow, br * w * grow, 0, 1, 0, cx + bx * w - br * w * grow, cy + by * h + dy).Z();
    }
    // flat base: wide ellipse
    const e = ellipsePath(cx, cy + h * 0.2 + dy, w * 0.42 * grow, h * 0.2 * grow, 0);
    p.pts.push(...e.pts);
    p.M(cx - w * 0.42 * grow, cy + h * 0.2 + dy).A(w * 0.42 * grow, h * 0.2 * grow, 0, 1, 0, cx + w * 0.42 * grow, cy + h * 0.2 + dy).A(w * 0.42 * grow, h * 0.2 * grow, 0, 1, 0, cx - w * 0.42 * grow, cy + h * 0.2 + dy).Z();
  };
  const specs: PartSpec[] = [];
  if (shade) {
    const s = new Path();
    addBlob(s, h * 0.06, 1);
    specs.push({ path: s, fill: shade });
  }
  addBlob(base);
  specs.push({ path: base, fill: color });
  return place(specs, 2, { opacity });
}

/** Concentric arch-shaped bands (rounded-top rectangles), outermost first. Centre x, spanning top..bottom. */
export function archBands(cx: number, top: number, bottom: number, w: number, colors: string[], bw: number): OrnamentLayer {
  const specs: PartSpec[] = colors.map((color, i) => {
    const inset = i * bw + bw / 2;
    const r = w / 2 - inset;
    const p = new Path();
    p.M(cx - r, bottom).L(cx - r, top + inset + r).A(r, r, 0, 0, 1, cx + r, top + inset + r).L(cx + r, bottom);
    p.include([cx, top + inset]);
    return { path: p, stroke: color, strokeWidth: bw + 0.6, lineCap: "butt" as const };
  });
  return place(specs, 2);
}

/** A scalloped/hanging garland of little stars on a drooping line. */
export function starGarland(x0: number, y0: number, x1: number, y1: number, sag: number, colors: string[], n: number, size = 34): OrnamentLayer {
  const pt = (t: number): [number, number] => [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t + Math.sin(Math.PI * t) * sag];
  const line = new Path();
  line.M(x0, y0);
  for (let i = 1; i <= 24; i++) {
    const q = pt(i / 24);
    line.L(q[0], q[1]);
  }
  const by = new Map<string, Path>();
  for (let i = 0; i < n; i++) {
    const [px, py] = pt((i + 0.5) / n);
    const cy = py + size * 0.7;
    const c = colors[i % colors.length];
    const p = by.get(c) ?? by.set(c, new Path()).get(c)!;
    for (let k = 0; k < 10; k++) {
      const a = -Math.PI / 2 + (k * Math.PI) / 5;
      const rr = k % 2 ? size * 0.22 : size * 0.5;
      const X = px + Math.cos(a) * rr;
      const Y = cy + Math.sin(a) * rr;
      k === 0 ? p.M(X, Y) : p.L(X, Y);
    }
    p.Z();
    line.M(px, py).L(px, cy - size * 0.5);
  }
  const specs: PartSpec[] = [{ path: line, stroke: "#c9b9a4", strokeWidth: 2 }];
  by.forEach((path, c) => specs.push({ path, fill: c }));
  return place(specs, 3);
}
