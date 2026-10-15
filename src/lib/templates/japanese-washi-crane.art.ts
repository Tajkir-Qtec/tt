import { Path, petal, type PartSpec, type Pt } from "../design/path";
import { centerRotate } from "../design/layers";
import type { Layer, OrnamentLayer } from "../design/types";
import { linear } from "./kit";
import { place, rng } from "./summer-party.art";

export const J = {
  washi: "#f4eee0",
  washiD: "#e8dfca",
  indigo: "#1b2a5c",
  indigoL: "#2f4690",
  indigoD: "#101a3c",
  red: "#c8372d",
  redD: "#9b2218",
  gold: "#b8913f",
  sakura: "#f1b7c5",
  ink: "#222638",
};

const hex = (h: string): [number, number, number] => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
export const mix = (a: string, b: string, t: number) => {
  const A = hex(a);
  const B = hex(b);
  const c = A.map((v, i) => Math.round(v + (B[i] - v) * t));
  return `#${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
};

/** Facets of a side-view origami crane in a 120x90 box, each with a tone (0 = shade, 1 = light). */
const FACETS: { pts: Pt[]; tone: number }[] = [
  { pts: [[44, 50], [52, 4], [66, 50]], tone: 0.5 }, // far wing
  { pts: [[47, 50], [52, 4], [56, 50]], tone: 0.35 },
  { pts: [[9, 14], [15, 16], [46, 54], [36, 58]], tone: 0.4 }, // neck
  { pts: [[3, 22], [9, 14], [15, 16]], tone: 0.95 }, // head
  { pts: [[36, 58], [60, 48], [62, 72]], tone: 0.62 }, // chest
  { pts: [[60, 48], [88, 58], [62, 72]], tone: 0.28 }, // belly
  { pts: [[88, 58], [96, 64], [62, 72]], tone: 0.15 },
  { pts: [[88, 58], [118, 34], [96, 64]], tone: 0.75 }, // tail
  { pts: [[60, 50], [98, 8], [88, 58]], tone: 1 }, // near wing
  { pts: [[60, 50], [98, 8], [76, 48]], tone: 0.78 }, // wing crease
  { pts: [[60, 50], [88, 58], [68, 60]], tone: 0.45 },
];

export function craneSpecs(x: number, y: number, size: number, light: string, dark: string, flip = false): PartSpec[] {
  const s = size / 120;
  return FACETS.map(({ pts, tone }) => {
    const p = new Path();
    const mapped = pts.map(([px, py]): Pt => [x + (flip ? 120 - px : px) * s, y + py * s]);
    p.poly(mapped, true);
    return { path: p, fill: mix(dark, light, tone), stroke: mix(dark, light, Math.min(1, tone + 0.25)), strokeWidth: 0.8 };
  });
}

/** Crane layer centred at (cx,cy), width `size`, rotated. */
export function crane(cx: number, cy: number, size: number, light: string, dark: string, rot = 0, flip = false): OrnamentLayer {
  const l = place(craneSpecs(0, 0, size, light, dark, flip), 1);
  return centerRotate(l, cx, cy, rot);
}

/** A string of small hanging cranes (senbazuru) from (x, y0) down to y1. */
export function senbazuru(x: number, y0: number, y1: number, seed: number, palette: [string, string][], size = 74): Layer[] {
  const rnd = rng(seed);
  const out: Layer[] = [];
  const thread = new Path().M(x, y0).L(x, y1);
  out.push(place([{ path: thread, fill: null, stroke: "#8a7f68", strokeWidth: 2 }], 3));
  const n = Math.floor((y1 - y0) / (size * 1.45));
  for (let i = 0; i < n; i++) {
    const cy = y0 + size * 0.85 + i * (y1 - y0 - size) / Math.max(1, n - 1 || 1);
    const [l, d] = palette[i % palette.length];
    const sz = size * (0.9 + rnd() * 0.25);
    out.push(crane(x + (rnd() - 0.5) * 8, cy, sz, l, d, (rnd() - 0.5) * 24, i % 2 === 1));
  }
  return out;
}

/** Washi paper fibres and flecks. */
export function washiFibers(seed: number, area: [number, number, number, number], n: number, color = "#ffffff", op = 0.55, dark = "#bda982"): OrnamentLayer[] {
  const rnd = rng(seed);
  const light = new Path();
  const darkP = new Path();
  for (let i = 0; i < n; i++) {
    const x = area[0] + rnd() * (area[2] - area[0]);
    const y = area[1] + rnd() * (area[3] - area[1]);
    const a = rnd() * Math.PI;
    const l = 14 + rnd() * 38;
    const p = rnd() > 0.28 ? light : darkP;
    p.M(x, y).Q(x + Math.cos(a + 0.7) * l * 0.5, y + Math.sin(a + 0.7) * l * 0.5, x + Math.cos(a) * l, y + Math.sin(a) * l);
  }
  const flecks = new Path();
  for (let i = 0; i < n / 8; i++) flecks.circle(area[0] + rnd() * (area[2] - area[0]), area[1] + rnd() * (area[3] - area[1]), 1 + rnd() * 1.6);
  return [
    place([{ path: light, fill: null, stroke: color, strokeWidth: 1.4, opacity: op }], 2),
    place([{ path: darkP, fill: null, stroke: dark, strokeWidth: 1.1, opacity: 0.32 }, { path: flecks, fill: dark, opacity: 0.35 }], 2),
  ];
}

/** Deckle-edged paper sheet. */
export function deckle(x: number, y: number, w: number, h: number, seed: number, fill: string, shadow = true): OrnamentLayer[] {
  const rnd = rng(seed);
  const edge = (a: Pt, b: Pt, n: number): Pt[] => {
    const out: Pt[] = [];
    for (let i = 0; i < n; i++) {
      const t = i / n;
      const nx = -(b[1] - a[1]);
      const ny = b[0] - a[0];
      const len = Math.hypot(nx, ny);
      const j = (rnd() - 0.5) * 5;
      out.push([a[0] + (b[0] - a[0]) * t + (nx / len) * j, a[1] + (b[1] - a[1]) * t + (ny / len) * j]);
    }
    return out;
  };
  const pts = [...edge([x, y], [x + w, y], 60), ...edge([x + w, y], [x + w, y + h], 80), ...edge([x + w, y + h], [x, y + h], 60), ...edge([x, y + h], [x, y], 80)];
  const sheet = new Path().poly(pts, true);
  const sh = new Path().poly(pts.map(([px, py]): Pt => [px + 6, py + 9]), true);
  const out: OrnamentLayer[] = [];
  if (shadow) out.push(place([{ path: sh, fill: "#000000", opacity: 0.28 }], 2));
  out.push(place([{ path: sheet, fill }], 2));
  return out;
}

/** Seigaiha (blue ocean wave) kimono pattern, bleeding off the bottom edge. */
export function seigaiha(x0: number, x1: number, yTop: number, r: number, rows: number, cols: [string, string], bgc: string): OrnamentLayer {
  const specs: PartSpec[] = [];
  const nx = Math.ceil((x1 - x0) / (2 * r)) + 1;
  for (let j = 0; j < rows; j++) {
    const cy = yTop + r + j * (r / 2);
    const off = j % 2 ? r : 0;
    for (let i = -1; i < nx; i++) {
      const cx = x0 + i * 2 * r + off;
      const rings = [1, 0.78, 0.56, 0.34];
      rings.forEach((k, idx) => {
        const p = new Path().circle(cx, cy, r * k);
        specs.push({ path: p, fill: idx % 2 === 0 ? cols[0] : cols[1], stroke: bgc, strokeWidth: 1.6 });
      });
    }
  }
  // trim horizontally to the band using the sheet edges: clip is not available, so keep x-range tidy
  return place(specs, 1);
}

/** Falling cherry-blossom petals. */
export function sakuraPetals(seed: number, area: [number, number, number, number], n: number, skip?: (x: number, y: number) => boolean, color = J.sakura): OrnamentLayer {
  const rnd = rng(seed);
  const a = new Path();
  const b = new Path();
  for (let i = 0; i < n; i++) {
    const x = area[0] + rnd() * (area[2] - area[0]);
    const y = area[1] + rnd() * (area[3] - area[1]);
    if (skip?.(x, y)) continue;
    const ang = rnd() * 6.28;
    const len = 16 + rnd() * 12;
    petal(rnd() > 0.5 ? a : b, x, y, ang, 0, len, len * 0.38, false);
  }
  return place([{ path: a, fill: color, opacity: 0.9 }, { path: b, fill: mix(color, "#ffffff", 0.45), opacity: 0.9 }], 2);
}

export const washiBg = linear(90, [0, "#f7f2e6"], [1, "#efe7d3"]);
export const indigoBg = linear(90, [0, "#22336b"], [1, "#141f48"]);
