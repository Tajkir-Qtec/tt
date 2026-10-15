import { Path, type PartSpec, type Pt } from "../design/path";
import type { Layer } from "../design/types";
import { linear } from "./kit";
import { ellipsePath, place, rng } from "./birthday-balloons-bold.art";

export const PASTELS = ["#ff9ec7", "#ffc59b", "#fff0a0", "#a6ecc0", "#9ad7ff", "#c5aaff"];
export const INK = "#5a3a9e";
export const PINK = "#ff5fa8";

/** Fluffy cloud: overlapping circles over a flat base. */
export function cloud(cx: number, cy: number, s: number, fill = "#ffffff", op = 1): Layer {
  const p = new Path();
  p.circle(cx - 0.55 * s, cy + 0.05 * s, 0.32 * s);
  p.circle(cx - 0.2 * s, cy - 0.12 * s, 0.42 * s);
  p.circle(cx + 0.25 * s, cy - 0.02 * s, 0.38 * s);
  p.circle(cx + 0.58 * s, cy + 0.08 * s, 0.28 * s);
  const base = new Path().poly(
    [
      [cx - 0.55 * s, cy + 0.2 * s],
      [cx + 0.58 * s, cy + 0.2 * s],
      [cx + 0.58 * s, cy + 0.37 * s],
      [cx - 0.55 * s, cy + 0.37 * s],
    ],
    true,
  );
  const shade = new Path();
  shade.circle(cx + 0.05 * s, cy + 0.22 * s, 0.1 * s);
  return place(
    [
      { path: p, fill },
      { path: base, fill },
      { path: ellipsePath(cx, cy + 0.34 * s, 0.62 * s, 0.1 * s), fill: "#d6c8ff", opacity: 0.45 },
    ],
    3,
    { opacity: op },
  );
}

/** Four-point glitter sparkles scattered, one layer per colour group. */
export function glitter(seed: number, count: number, area: [number, number, number, number], colors: string[], skip?: (x: number, y: number) => boolean, size = 1): Layer {
  const r = rng(seed);
  const m = new Map<string, Path>();
  let n = 0;
  let g = 0;
  while (n < count && g++ < count * 30) {
    const x = area[0] + r() * (area[2] - area[0]);
    const y = area[1] + r() * (area[3] - area[1]);
    if (skip?.(x, y)) continue;
    n++;
    const c = colors[Math.floor(r() * colors.length)];
    const R = (6 + Math.pow(r(), 2) * 22) * size;
    const k = 0.22;
    const p = m.get(c) ?? m.set(c, new Path()).get(c)!;
    if (r() < 0.3) p.circle(x, y, R * 0.28);
    else
      p.poly(
        [
          [x, y - R],
          [x + R * k, y - R * k],
          [x + R, y],
          [x + R * k, y + R * k],
          [x, y + R],
          [x - R * k, y + R * k],
          [x - R, y],
          [x - R * k, y - R * k],
        ],
        true,
      );
  }
  const specs: PartSpec[] = [];
  m.forEach((path, c) => specs.push({ path, fill: c }));
  return place(specs, 2);
}

export interface UnicornOpts {
  /** photo mode: no face, just a ring head (an image goes on top). */
  photo?: boolean;
}

/** Front-facing kawaii unicorn head. (cx,cy) = head centre, s = scale (head half-width ≈ 0.95 s). */
export function unicorn(cx: number, cy: number, s: number, o: UnicornOpts = {}): Layer[] {
  const X = (x: number, y: number): Pt => [cx + x * s, cy + y * s];
  const out: Layer[] = [];

  // mane (back): six pastel bands each side, outermost first
  const mane: PartSpec[] = [];
  for (let i = 5; i >= 0; i--) {
    for (const sg of [-1, 1]) {
      const w = 1.0 + i * 0.13;
      const len = 1.05 + i * 0.1;
      const p = new Path();
      const a = X(sg * 0.2, -0.95);
      p.M(a[0], a[1]);
      let c1 = X(sg * (w + 0.6), -1.1);
      let c2 = X(sg * (w + 0.55), 0.1);
      let e = X(sg * (w + 0.25), len * 0.75);
      p.C(c1[0], c1[1], c2[0], c2[1], e[0], e[1]);
      // curl at the tip
      c1 = X(sg * (w + 0.05), len * 0.95 + 0.1);
      c2 = X(sg * (w - 0.4), len * 0.95 + 0.12);
      e = X(sg * (w - 0.5), len * 0.62);
      p.C(c1[0], c1[1], c2[0], c2[1], e[0], e[1]);
      c1 = X(sg * (w - 0.7), 0.5);
      c2 = X(sg * 0.7, 0.2);
      e = X(sg * 0.2, -0.5);
      p.C(c1[0], c1[1], c2[0], c2[1], e[0], e[1]).Z();
      mane.push({ path: p, fill: PASTELS[i], stroke: "#ffffff", strokeWidth: 2.4, opacity: 1 });
    }
  }
  out.push(place(mane, 4));

  // ears
  const ears: PartSpec[] = [];
  for (const sg of [-1, 1]) {
    const e = new Path();
    const a = X(sg * 0.32, -0.7);
    e.M(a[0], a[1]);
    let c1 = X(sg * 0.35, -1.25);
    let t = X(sg * 0.62, -1.4);
    e.Q(c1[0], c1[1], t[0], t[1]);
    c1 = X(sg * 0.95, -1.05);
    t = X(sg * 0.85, -0.55);
    e.Q(c1[0], c1[1], t[0], t[1]).Z();
    ears.push({ path: e, fill: "#ffffff", stroke: "#e2d4ff", strokeWidth: 3 });
    const inner = new Path();
    const b = X(sg * 0.45, -0.78);
    inner.M(b[0], b[1]);
    c1 = X(sg * 0.48, -1.08);
    t = X(sg * 0.6, -1.15);
    inner.Q(c1[0], c1[1], t[0], t[1]);
    c1 = X(sg * 0.78, -0.95);
    t = X(sg * 0.74, -0.72);
    inner.Q(c1[0], c1[1], t[0], t[1]).Z();
    ears.push({ path: inner, fill: "#ffb6d6" });
  }
  out.push(place(ears, 4));

  // horn
  const horn = new Path().poly([X(-0.2, -0.78), X(0.2, -0.78), X(0.0, -1.95)], true);
  const stripes = new Path();
  for (let i = 0; i < 5; i++) {
    const t = 0.1 + i * 0.17;
    const y = -0.78 - t * 1.17;
    const half = 0.2 * (1 - t);
    const a = X(-half, y + 0.05);
    const b = X(half, y - 0.05);
    stripes.M(a[0], a[1]).L(b[0], b[1]);
  }
  out.push(
    place(
      [
        { path: horn, fill: linear(100, [0, "#f2b84a"], [0.35, "#fff0a8"], [0.6, "#e9a93a"], [1, "#fff0a8"]), stroke: "#e0a43a", strokeWidth: 2.5, lineJoin: "round" },
        { path: stripes, stroke: "#c98a24", strokeWidth: 3.5, lineCap: "round" },
      ],
      4,
    ),
  );

  // head
  const head = ellipsePath(...(([cx, cy, 0.95 * s, 0.86 * s] as unknown) as [number, number, number, number]));
  out.push(place([{ path: head, fill: linear(160, [0, "#ffffff"], [1, "#efe5ff"]), stroke: "#e2d4ff", strokeWidth: o.photo ? 12 : 4 }], 6));
  if (o.photo) return out;

  // forelock curls
  const curls: PartSpec[] = [];
  const curl = (x: number, y: number, rr: number, col: string, flip: number) => {
    const p = new Path();
    const a = X(x, y);
    p.M(a[0], a[1]);
    const c1 = X(x + flip * rr * 1.9, y - rr * 0.9);
    const c2 = X(x + flip * rr * 1.8, y + rr * 2.4);
    const e = X(x + flip * rr * 0.1, y + rr * 1.8);
    p.C(c1[0], c1[1], c2[0], c2[1], e[0], e[1]);
    const d1 = X(x - flip * rr * 0.7, y + rr * 1.2);
    const d2 = X(x - flip * rr * 0.4, y + rr * 0.1);
    p.C(d1[0], d1[1], d2[0], d2[1], a[0], a[1]).Z();
    curls.push({ path: p, fill: col, stroke: "#ffffff", strokeWidth: 2 });
  };
  curl(0.02, -0.82, 0.2, PASTELS[5], 1);
  curl(-0.02, -0.82, 0.2, PASTELS[4], -1);
  curl(0.06, -0.8, 0.17, PASTELS[0], 1);
  curl(-0.06, -0.8, 0.17, PASTELS[2], -1);
  out.push(place(curls, 4));

  // muzzle
  const muz = ellipsePath(cx, cy + 0.5 * s, 0.56 * s, 0.34 * s);
  const nostrils = new Path();
  nostrils.include(X(0, 0));
  const nl = ellipsePath(cx - 0.17 * s, cy + 0.46 * s, 0.045 * s, 0.07 * s, -15);
  const nr = ellipsePath(cx + 0.17 * s, cy + 0.46 * s, 0.045 * s, 0.07 * s, 15);
  const smile = new Path();
  const sm0 = X(-0.17, 0.62);
  const sm1 = X(0, 0.78);
  const sm2 = X(0.17, 0.62);
  smile.M(sm0[0], sm0[1]).Q(sm1[0] - 0, sm1[1], sm2[0], sm2[1]);
  // eyes
  const eyes = new Path();
  const lash = new Path();
  for (const sg of [-1, 1]) {
    const a = X(sg * 0.2, 0.08);
    const b = X(sg * 0.38, -0.14);
    const c = X(sg * 0.6, 0.08);
    eyes.M(a[0], a[1]).Q(b[0], b[1], c[0], c[1]);
    const l1 = X(sg * 0.6, 0.08);
    const l2 = X(sg * 0.7, 0.0);
    lash.M(l1[0], l1[1]).L(l2[0], l2[1]);
    const l3 = X(sg * 0.57, -0.03);
    const l4 = X(sg * 0.66, -0.12);
    lash.M(l3[0], l3[1]).L(l4[0], l4[1]);
  }
  out.push(
    place(
      [
        { path: ellipsePath(cx - 0.62 * s, cy + 0.3 * s, 0.14 * s, 0.09 * s), fill: "#ff8fb8", opacity: 0.55 },
        { path: ellipsePath(cx + 0.62 * s, cy + 0.3 * s, 0.14 * s, 0.09 * s), fill: "#ff8fb8", opacity: 0.55 },
        { path: muz, fill: "#ffe9f3" },
        { path: nl, fill: "#d98ab0" },
        { path: nr, fill: "#d98ab0" },
        { path: eyes, stroke: "#4a2d86", strokeWidth: Math.max(4, s * 0.035), lineCap: "round" },
        { path: lash, stroke: "#4a2d86", strokeWidth: Math.max(3, s * 0.022), lineCap: "round" },
        { path: smile, stroke: "#c25c8c", strokeWidth: Math.max(3, s * 0.02), lineCap: "round" },
      ],
      4,
    ),
  );
  // tiny star on forehead cheek
  return out;
}
