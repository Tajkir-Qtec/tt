import { assemble, leaf, Path, petal, rad, type OrnamentData, type PartSpec } from "../design/path";

/** Rose colour sets: [outer, middle, inner highlight, edge line]. */
export const ROSE_SETS: [string, string, string, string][] = [
  ["#e7a1a6", "#f0b7b7", "#f9d9d0", "#b65a68"], // dusty rose
  ["#f0b39b", "#f6c9b3", "#fde4d4", "#c07a62"], // peach
  ["#d27c8d", "#e49ba5", "#f2bcc1", "#a24557"], // deep rose
  ["#f6d2cb", "#fae1da", "#fff1ea", "#cf9a96"], // blush
];

const LEAF_A = "#8da384";
const LEAF_B = "#6f8d6c";
const LEAF_C = "#a9bb9d";

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function addLeaf(specs: PartSpec[], x: number, y: number, angDeg: number, len: number, tone = 0) {
  const fill = [LEAF_A, LEAF_B, LEAF_C][tone % 3];
  const p = new Path();
  leaf(p, [x, y], rad(angDeg), len, len * 0.2);
  specs.push({ path: p, fill, stroke: "#5f7c5c", strokeWidth: 0.9, opacity: 0.95 });
  const v = new Path();
  v.M(x, y).L(x + Math.cos(rad(angDeg)) * len * 0.86, y + Math.sin(rad(angDeg)) * len * 0.86);
  specs.push({ path: v, stroke: "#f2f5ec", strokeWidth: 0.9, opacity: 0.6 });
}

function addRose(specs: PartSpec[], cx: number, cy: number, R: number, setIdx: number, rot = 0) {
  const set = ROSE_SETS[setIdx % ROSE_SETS.length];
  const rings = [
    { n: 6, rr: 1, hw: 0.5, fill: set[0], off: 0 },
    { n: 5, rr: 0.8, hw: 0.46, fill: set[1], off: 30 },
    { n: 4, rr: 0.58, hw: 0.42, fill: set[2], off: 12 },
    { n: 3, rr: 0.36, hw: 0.36, fill: set[1], off: 48 },
  ];
  rings.forEach((ring) => {
    for (let i = 0; i < ring.n; i++) {
      const a = rad(rot + ring.off + (360 / ring.n) * i);
      const r1 = ring.rr * R;
      const p = new Path();
      petal(p, cx, cy, a, 0, r1, r1 * ring.hw * 0.62, false);
      specs.push({ path: p, fill: ring.fill, stroke: set[3], strokeWidth: 0.6, opacity: 0.97 });
      const h = new Path();
      petal(h, cx, cy, a, r1 * 0.25, r1 * 0.9, r1 * ring.hw * 0.32, false);
      specs.push({ path: h, fill: set[2], opacity: 0.38 });
    }
  });
  const core = new Path();
  core.circle(cx, cy, R * 0.1);
  specs.push({ path: core, fill: set[0], stroke: set[3], strokeWidth: 0.8, opacity: 0.9 });
  const swirl = new Path().M(cx - R * 0.12, cy + R * 0.02).C(cx - R * 0.1, cy - R * 0.14, cx + R * 0.12, cy - R * 0.12, cx + R * 0.1, cy + R * 0.02);
  specs.push({ path: swirl, stroke: set[3], strokeWidth: 0.9, opacity: 0.7 });
}

function addBud(specs: PartSpec[], x: number, y: number, angDeg: number, s: number, setIdx: number) {
  const set = ROSE_SETS[setIdx % ROSE_SETS.length];
  const a = rad(angDeg);
  const stem = new Path().M(x - Math.cos(a) * s * 0.9, y - Math.sin(a) * s * 0.9).L(x, y);
  specs.push({ path: stem, stroke: LEAF_B, strokeWidth: 2 });
  [-16, 16, 0].forEach((d, i) => {
    const p = new Path();
    petal(p, x, y, a + rad(d), 0, s * (i === 2 ? 1.05 : 0.95), s * 0.3, true);
    specs.push({ path: p, fill: i === 2 ? set[1] : set[0], stroke: set[3], strokeWidth: 0.8 });
  });
  const cup = new Path();
  petal(cup, x, y, a + Math.PI, 0, s * 0.34, s * 0.3, true);
  specs.push({ path: cup, fill: LEAF_A, stroke: "#5f7c5c", strokeWidth: 0.7 });
}

function addBlossom(specs: PartSpec[], cx: number, cy: number, r: number, fill = "#fff6ee") {
  for (let i = 0; i < 5; i++) {
    const p = new Path();
    petal(p, cx, cy, rad(-90 + i * 72), 0, r, r * 0.34, false);
    specs.push({ path: p, fill, stroke: "#d9aaa3", strokeWidth: 0.7 });
  }
  const c = new Path().circle(cx, cy, r * 0.16);
  specs.push({ path: c, fill: "#e0b058" });
  const dots = new Path();
  for (let i = 0; i < 6; i++) dots.circle(cx + Math.cos(rad(i * 60)) * r * 0.3, cy + Math.sin(rad(i * 60)) * r * 0.3, r * 0.04);
  specs.push({ path: dots, fill: "#b8862f" });
}

function addSprigs(specs: PartSpec[], pts: [number, number][], seed: number) {
  const r = rng(seed);
  const stems = new Path();
  const dots = new Path();
  pts.forEach(([x, y]) => {
    const a = r() * Math.PI * 2;
    const len = 30 + r() * 30;
    const ex = x + Math.cos(a) * len;
    const ey = y + Math.sin(a) * len;
    stems.M(x, y).Q((x + ex) / 2 + 8, (y + ey) / 2 - 8, ex, ey);
    for (let i = 0; i < 3; i++) dots.circle(ex + Math.cos(a + i * 2) * 4, ey + Math.sin(a + i * 2) * 4, 2.6);
  });
  specs.push({ path: stems, stroke: LEAF_B, strokeWidth: 1, opacity: 0.8 });
  specs.push({ path: dots, fill: "#fff7f0", opacity: 0.95 });
}

/**
 * Corner rose spray. Anchored at the top-left of its 560 x 560 box; flip it for other corners.
 * variant 0 = lush, 1 = lighter.
 */
export function roseSpray(variant: 0 | 1 = 0): OrnamentData {
  const specs: PartSpec[] = [];
  // leaves behind everything
  const leaves: [number, number, number, number, number][] =
    variant === 0
      ? [
          [150, 150, 20, 190, 0], [150, 150, 62, 210, 1], [180, 130, -10, 200, 2], [120, 200, 80, 190, 0],
          [250, 100, 8, 170, 1], [100, 260, 95, 170, 2], [330, 90, -4, 150, 0], [90, 360, 100, 140, 1],
          [200, 220, 40, 150, 2], [60, 140, 55, 130, 0],
        ]
      : [
          [120, 120, 25, 170, 0], [120, 120, 65, 180, 1], [200, 90, 0, 150, 2], [90, 190, 85, 150, 0], [60, 100, 50, 120, 1],
        ];
  leaves.forEach(([x, y, a, l, t]) => addLeaf(specs, x, y, a, l, t));
  addSprigs(
    specs,
    variant === 0 ? [[260, 190], [190, 280], [380, 120], [120, 400], [300, 260], [60, 250]] : [[200, 160], [150, 230], [260, 100]],
    variant === 0 ? 7 : 11,
  );
  const blossoms: [number, number, number][] =
    variant === 0 ? [[300, 60, 26], [60, 300, 26], [380, 200, 20], [220, 330, 22], [420, 70, 18], [50, 440, 18]] : [[230, 60, 22], [50, 230, 22], [190, 210, 16]];
  blossoms.forEach(([x, y, r]) => addBlossom(specs, x, y, r));
  const roses: [number, number, number, number, number][] =
    variant === 0
      ? [
          [150, 150, 128, 0, 10], [300, 120, 82, 1, 40], [120, 310, 84, 2, 5], [250, 250, 62, 3, 20],
          [380, 70, 44, 0, 0], [50, 430, 44, 1, 15], [20, 20, 70, 2, 30],
        ]
      : [
          [120, 120, 100, 1, 20], [250, 80, 58, 0, 0], [80, 250, 60, 3, 40], [10, 10, 52, 0, 0],
        ];
  roses.forEach(([x, y, R, s, rot]) => addRose(specs, x, y, R, s, rot));
  const buds: [number, number, number, number, number][] =
    variant === 0 ? [[430, 150, -20, 34, 0], [150, 430, 80, 34, 1], [330, 300, 30, 28, 2]] : [[300, 140, -20, 30, 2], [140, 300, 75, 30, 0]];
  buds.forEach(([x, y, a, s, set]) => addBud(specs, x, y, a, s, set));
  const w = variant === 0 ? 560 : 400;
  return assemble(specs, 0, { w, h: w, dx: 0, dy: 0 });
}

/** Horizontal vine with small roses, blossoms and leaves. */
export function floralBand(len: number, seed = 3): OrnamentData {
  const specs: PartSpec[] = [];
  const H = 120;
  const cy = H / 2;
  const vine = new Path().M(0, cy);
  const steps = Math.round(len / 70);
  for (let i = 0; i < steps; i++) {
    const x0 = (len / steps) * i;
    const x1 = (len / steps) * (i + 1);
    vine.Q((x0 + x1) / 2, cy + (i % 2 ? 14 : -14), x1, cy);
  }
  specs.push({ path: vine, stroke: LEAF_B, strokeWidth: 1.6, opacity: 0.9 });
  const r = rng(seed);
  for (let i = 0; i < steps * 2; i++) {
    const x = 20 + ((len - 40) / (steps * 2 - 1)) * i;
    const up = i % 2 ? 1 : -1;
    addLeaf(specs, x, cy + up * 2, up * (40 + r() * 30) + (i % 4 < 2 ? 0 : 180) * 0, 40 + r() * 14, i % 3);
  }
  for (let i = 0; i < steps; i++) {
    const x = (len / steps) * (i + 0.5);
    if (i % 2 === 0) addRose(specs, x, cy, 24 + (i % 4 === 0 ? 4 : 0), i % 4, i * 25);
    else addBlossom(specs, x, cy, 15);
  }
  return assemble(specs, 0, { w: len, h: H, dx: 0, dy: 0 });
}

/** A soft rose/peach garland arc (for use above or below text), made of small blossoms. */
export function blossomRow(len: number): OrnamentData {
  const specs: PartSpec[] = [];
  const n = Math.max(3, Math.round(len / 46));
  const line = new Path().M(0, 20).L(len, 20);
  specs.push({ path: line, stroke: "#c9a56a", strokeWidth: 1 });
  for (let i = 0; i < n; i++) {
    const x = (len / n) * (i + 0.5);
    addBlossom(specs, x, 20, i % 2 ? 9 : 12, i % 2 ? "#fbe3dc" : "#fff6ee");
  }
  return assemble(specs, 0, { w: len, h: 40, dx: 0, dy: 0 });
}
