import { Path, type PartSpec, type Pt } from "../design/path";
import type { Layer, OrnamentLayer } from "../design/types";
import { linear, lock, O, radial, S } from "./kit";
import { sparkle } from "../design/ornaments";
import { ellipsePath, place, rng } from "./birthday-balloons-bold.art";

/** Faceted mirror ball with hanging cord; (cx,cy) centre, R radius. Returns layers (glow, cord, ball). */
export function discoBall(cx: number, cy: number, R: number, cordTop = -20): Layer[] {
  const out: Layer[] = [];
  // soft halo
  out.push(lock(S({ shape: "ellipse", x: cx - R * 2.1, y: cy - R * 2.1, width: R * 4.2, height: R * 4.2, fill: radial([0, "#ff4fd8"], [1, "#1a0b3b"]), opacity: 0.28 })));
  out.push(lock(S({ shape: "ellipse", x: cx - R * 1.5, y: cy - R * 1.5, width: R * 3, height: R * 3, fill: radial([0, "#3df2ff"], [1, "#1a0b3b"]), opacity: 0.16 })));
  const cord = new Path();
  cord.M(cx, cordTop).L(cx, cy - R);
  const cap = ellipsePath(cx, cy - R - 2, R * 0.12, R * 0.07, 0);
  out.push(place([{ path: cord, stroke: "#c9c4f0", strokeWidth: 3 }, { path: cap, fill: "#c9c4f0" }], 2));
  const base = ellipsePath(cx, cy, R, R, 0);
  out.push(place([{ path: base, fill: radial([0, "#3a3280"], [1, "#120b3a"]) }], 1));
  const r = rng(77);
  const palette = ["#241d63", "#322d86", "#4944b0", "#6f6bd2", "#9a98ea", "#cfd0fb", "#ffffff"];
  const buckets: Path[] = palette.map(() => new Path());
  const pink = new Path();
  const cyan = new Path();
  const step = 12;
  const L = [-0.45, -0.55, 0.7];
  const ll = Math.hypot(...L);
  for (let th = -84; th < 84; th += step) {
    for (let ph = -90; ph < 90; ph += step) {
      const t0 = (th * Math.PI) / 180;
      const t1 = ((th + step) * Math.PI) / 180;
      const p0 = (ph * Math.PI) / 180;
      const p1 = ((ph + step) * Math.PI) / 180;
      const corner = (t: number, p: number): Pt => [cx + R * Math.cos(t) * Math.sin(p), cy - R * Math.sin(t)];
      const c: Pt[] = [corner(t0, p0), corner(t0, p1), corner(t1, p1), corner(t1, p0)];
      const mx = (c[0][0] + c[1][0] + c[2][0] + c[3][0]) / 4;
      const my = (c[0][1] + c[1][1] + c[2][1] + c[3][1]) / 4;
      const tm = (t0 + t1) / 2;
      const pm = (p0 + p1) / 2;
      const n = [Math.cos(tm) * Math.sin(pm), -Math.sin(tm), Math.cos(tm) * Math.cos(pm)];
      const lam = Math.max(0, (n[0] * L[0] + n[1] * L[1] + n[2] * L[2]) / ll);
      const shrink = 0.84;
      const q = c.map(([x, y]) => [mx + (x - mx) * shrink, my + (y - my) * shrink] as Pt);
      const rnd = r();
      if (rnd < 0.1 && lam < 0.7) pink.poly(q, true);
      else if (rnd > 0.9 && lam < 0.7) cyan.poly(q, true);
      else {
        const v = Math.min(0.999, lam * 0.95 + (r() - 0.5) * 0.34 + 0.08);
        buckets[Math.max(0, Math.floor(v * palette.length))].poly(q, true);
      }
    }
  }
  const specs: PartSpec[] = buckets.map((path, i) => ({ path, fill: palette[i] }));
  specs.push({ path: pink, fill: "#ff4fd8", opacity: 0.9 });
  specs.push({ path: cyan, fill: "#3df2ff", opacity: 0.9 });
  out.push(place(specs, 1));
  // rim light
  const rim = ellipsePath(cx, cy, R, R, 0);
  out.push(place([{ path: rim, stroke: "#d9d4ff", strokeWidth: 2.4, opacity: 0.6 }], 2));
  return out;
}

/** Layered fake-glow stroke: wide faint halos beneath a bright thin core. */
export function neon(path: Path, color: string, core = 4, extra: Partial<PartSpec> = {}): OrnamentLayer {
  const specs: PartSpec[] = [
    { path, stroke: color, strokeWidth: core * 5, opacity: 0.1, ...extra },
    { path, stroke: color, strokeWidth: core * 3, opacity: 0.2, ...extra },
    { path, stroke: color, strokeWidth: core * 1.7, opacity: 0.45, ...extra },
    { path, stroke: color, strokeWidth: core, opacity: 1, ...extra },
    { path, stroke: "#ffffff", strokeWidth: core * 0.35, opacity: 0.75, ...extra },
  ];
  return place(specs, 4);
}

export function rectPath(x: number, y: number, w: number, h: number, r: number): Path {
  const p = new Path();
  p.M(x + r, y).L(x + w - r, y).Q(x + w, y, x + w, y + r).L(x + w, y + h - r).Q(x + w, y + h, x + w - r, y + h).L(x + r, y + h).Q(x, y + h, x, y + h - r).L(x, y + r).Q(x, y, x + r, y).Z();
  return p;
}

/** Synthwave perspective floor grid from y0 down to y1 converging to vanishing point (vx, vy). */
export function floorGrid(vx: number, vy: number, y0: number, y1: number, color: string, cols = 18, rows = 7): Layer[] {
  const out: Layer[] = [];
  const lines = new Path();
  const spread = 1500;
  for (let i = -cols / 2; i <= cols / 2; i++) {
    const xb = vx + (i / (cols / 2)) * spread;
    const t0 = (y0 - vy) / (y1 - vy);
    lines.M(vx + (xb - vx) * t0, y0).L(xb, y1);
  }
  for (let j = 0; j < rows; j++) {
    const t = Math.pow((j + 1) / rows, 1.8);
    const y = y0 + (y1 - y0) * t;
    lines.M(-50, y).L(1050, y);
  }
  out.push(neon(lines, color, 1.8));
  return out;
}

export function glowSpark(cx: number, cy: number, s: number, color: string): Layer[] {
  const mk = (size: number, c: string, op: number) => lock(O(sparkle({ color: c, size }), { x: cx - size / 2, y: cy - size / 2, opacity: op }));
  return [
    lock(S({ shape: "ellipse", x: cx - s * 0.55, y: cy - s * 0.55, width: s * 1.1, height: s * 1.1, fill: radial([0, color], [1, "#1a0b3b"]), opacity: 0.35 })),
    mk(s * 1.3, color, 0.45),
    mk(s, "#ffffff", 0.95),
  ];
}

export { linear };

export function hline(x0: number, x1: number, y: number, color: string, core = 2): OrnamentLayer {
  return neon(new Path().M(x0, y).L(x1, y), color, core);
}
