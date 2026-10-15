import { sparkle, starPoints } from "../design/ornaments";
import { assemble, Path, rad, type OrnamentData, type PartSpec, type Pt } from "../design/path";
import type { Layer, Paint } from "../design/types";
import { lock, O, S, T, W } from "./kit";

/* ------------------------------------------------------------------ */
/* Shared helpers (also imported by the other festive templates)        */
/* ------------------------------------------------------------------ */

export function lcg(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
}

export type Rect = [number, number, number, number];

/** Full-page-coordinate ornament (viewBox == canvas) so parts can be authored in page space. */
export function scene(specs: PartSpec[], w = 1000, h = 1400): OrnamentData {
  return assemble(specs, 0, { w, h, dx: 0, dy: 0 });
}

export function glowBlob(cx: number, cy: number, r: number, rgb: string, a: number): Layer {
  return lock(
    S({
      shape: "ellipse",
      x: cx - r,
      y: cy - r,
      width: r * 2,
      height: r * 2,
      fill: { kind: "radial", stops: [[0, `rgba(${rgb},${a})`], [0.35, `rgba(${rgb},${a * 0.4})`], [0.75, `rgba(${rgb},0)`], [1, `rgba(${rgb},0)`]] },
    }),
  );
}

export function sparkleField(seed: number, count: number, avoid: Rect[], colors: string[], big = [12, 30]): Layer[] {
  const rnd = lcg(seed);
  const out: Layer[] = [];
  let guard = 0;
  while (out.length < count && guard++ < count * 50) {
    const x = 40 + rnd() * 920;
    const y = 40 + rnd() * 1320;
    if (avoid.some(([a, b, c, d]) => x > a && x < c && y > b && y < d)) continue;
    const isBig = rnd() < 0.28;
    const size = isBig ? big[0] + rnd() * (big[1] - big[0]) : 4 + rnd() * 7;
    const color = colors[Math.floor(rnd() * colors.length)];
    const opacity = 0.35 + rnd() * 0.65;
    if (isBig) out.push(lock(O(sparkle({ color, size }), { cx: x, y: y - size / 2, width: size, opacity })));
    else {
      const p = new Path().poly(starPoints(size / 2, size / 2, 5, size / 2, size * 0.22), true);
      out.push(lock(O(assemble([{ path: p, fill: color }], 0, { w: size, h: size }), { cx: x, y: y - size / 2, width: size, opacity })));
    }
  }
  return out;
}

export interface Block {
  label: string;
  title: string;
  sub?: string;
  titleSize?: number;
}

export interface StackStyle {
  y0: number;
  x?: number;
  width?: number;
  labelFont: string;
  labelWeight?: number;
  labelSize?: number;
  labelSpacing?: number;
  labelFill: string;
  titleFont: string;
  titleWeight?: number;
  titleItalic?: boolean;
  titleSize?: number;
  titleFill: Paint;
  subFont: string;
  subWeight?: number;
  subItalic?: boolean;
  subSize?: number;
  subFill: string;
  gap?: number;
  between?: (y: number, i: number) => Layer | undefined;
  betweenGap?: number;
  uppercaseTitle?: boolean;
  titleSpacing?: number;
}

/** Vertical stack of label / title / sub blocks. Returns layers and the y where it ends. */
export function stack(blocks: Block[], s: StackStyle): { layers: Layer[]; end: number } {
  const x = s.x ?? 150;
  const width = s.width ?? W - x * 2;
  const labelSize = s.labelSize ?? 17;
  const subSize = s.subSize ?? 24;
  const layers: Layer[] = [];
  let y = s.y0;
  blocks.forEach((b, i) => {
    const titleSize = b.titleSize ?? s.titleSize ?? 40;
    layers.push(
      T(b.label, y, { x, width, fontFamily: s.labelFont, fontWeight: s.labelWeight ?? 400, fontSize: labelSize, fill: s.labelFill, letterSpacing: s.labelSpacing ?? 7, uppercase: true }),
    );
    y += labelSize * 1.9;
    const tl = b.title.split("\n").length;
    layers.push(
      T(b.title, y, {
        x,
        width,
        fontFamily: s.titleFont,
        fontWeight: s.titleWeight ?? 500,
        italic: s.titleItalic ?? false,
        fontSize: titleSize,
        fill: s.titleFill,
        lineHeight: 1.15,
        uppercase: s.uppercaseTitle,
        letterSpacing: s.titleSpacing ?? 0,
      }),
    );
    y += titleSize * 1.15 * tl + 8;
    if (b.sub) {
      const sl = b.sub.split("\n").length;
      layers.push(T(b.sub, y, { x, width, fontFamily: s.subFont, fontWeight: s.subWeight ?? 400, italic: s.subItalic ?? false, fontSize: subSize, fill: s.subFill, lineHeight: 1.45 }));
      y += subSize * 1.45 * sl;
    }
    if (i < blocks.length - 1) {
      y += s.gap ?? 44;
      const d = s.between?.(y, i);
      if (d) {
        layers.push(d);
        y += s.betweenGap ?? 56;
      }
    }
  });
  return { layers, end: y };
}

/* ------------------------------------------------------------------ */
/* Eid art: lanterns (fanoos), skyline, hanging crescent                */
/* ------------------------------------------------------------------ */

const METAL = "#d9b45a";
const METAL_D = "#9a7433";
const FLAME_GLOW: Paint = { kind: "radial", stops: [[0, "#fff2c2"], [0.5, "#ffc861"], [1, "#e58a1f"]] };
const BODY_GLOW: Paint = { kind: "radial", stops: [[0, "#fff0b8"], [0.45, "#ffc24f"], [1, "#c9731a"]] };
const CAP_GOLD: Paint = { kind: "linear", angle: 100, stops: [[0, "#8a6a2f"], [0.3, "#f0d890"], [0.6, "#b88a3e"], [1, "#e4c576"]] };

/** Parts of one fanoos hanging from a string that starts at (cx, topY). `len` is the string length. */
export function lanternParts(cx: number, topY: number, len: number, s: number, tint: "gold" | "teal" | "rose" = "gold"): PartSpec[] {
  const x = (v: number) => cx + v * s;
  const y0 = topY + len;
  const y = (v: number) => y0 + v * s;
  const specs: PartSpec[] = [];
  const string = new Path().M(cx, topY).L(cx, y(-2));
  specs.push({ path: string, stroke: METAL, strokeWidth: 2, opacity: 0.9 });
  const ring = new Path().circle(cx, y(0), 5 * s);
  specs.push({ path: ring, stroke: METAL, strokeWidth: 2.4 });
  const cap = new Path()
    .M(x(-19), y(34))
    .C(x(-19), y(16), x(-6), y(14), x(0), y(4))
    .C(x(6), y(14), x(19), y(16), x(19), y(34))
    .Z();
  specs.push({ path: cap, fill: CAP_GOLD, stroke: METAL_D, strokeWidth: 1.2 });
  const rim = new Path().poly([[x(-24), y(34)], [x(24), y(34)], [x(24), y(41)], [x(-24), y(41)]], true);
  specs.push({ path: rim, fill: CAP_GOLD, stroke: METAL_D, strokeWidth: 1 });
  const bodyFill: Paint =
    tint === "teal"
      ? { kind: "radial", stops: [[0, "#e6fff7"], [0.45, "#7fe0c4"], [1, "#1f8a7a"]] }
      : tint === "rose"
        ? { kind: "radial", stops: [[0, "#fff0f0"], [0.45, "#ff9fb0"], [1, "#b83a62"]] }
        : BODY_GLOW;
  const body = new Path()
    .M(x(-24), y(41))
    .C(x(-54), y(74), x(-54), y(122), x(-24), y(156))
    .L(x(24), y(156))
    .C(x(54), y(122), x(54), y(74), x(24), y(41))
    .Z();
  specs.push({ path: body, fill: bodyFill, stroke: METAL, strokeWidth: 2.2 });
  // inner pointed-arch window
  const win = new Path()
    .M(x(-14), y(146))
    .L(x(-14), y(92))
    .C(x(-14), y(72), x(-4), y(64), x(0), y(56))
    .C(x(4), y(64), x(14), y(72), x(14), y(92))
    .L(x(14), y(146))
    .Z();
  specs.push({ path: win, fill: "#fff4cf", stroke: METAL_D, strokeWidth: 1.6, opacity: 0.9 });
  // side ribs
  const ribs = new Path();
  for (const sd of [-1, 1]) {
    ribs.M(x(sd * 15), y(41)).C(x(sd * 38), y(76), x(sd * 38), y(122), x(sd * 15), y(156));
    ribs.M(x(sd * 6), y(41)).C(x(sd * 21), y(76), x(sd * 21), y(122), x(sd * 6), y(156));
  }
  specs.push({ path: ribs, stroke: METAL_D, strokeWidth: 1.2, opacity: 0.8 });
  // cut-out diamonds on the window
  const dia = new Path();
  for (const dy of [86, 112]) dia.poly([[x(0), y(dy - 8)], [x(6), y(dy)], [x(0), y(dy + 8)], [x(-6), y(dy)]], true);
  specs.push({ path: dia, fill: METAL_D, opacity: 0.55 });
  const base = new Path().poly([[x(-26), y(156)], [x(26), y(156)], [x(26), y(164)], [x(-26), y(164)]], true);
  specs.push({ path: base, fill: CAP_GOLD, stroke: METAL_D, strokeWidth: 1 });
  const foot = new Path().poly([[x(-24), y(164)], [x(-9), y(190)], [x(9), y(190)], [x(24), y(164)]], true);
  specs.push({ path: foot, fill: CAP_GOLD, stroke: METAL_D, strokeWidth: 1 });
  const tassel = new Path();
  tassel.M(cx, y(190)).L(cx, y(204));
  specs.push({ path: tassel, stroke: METAL, strokeWidth: 1.8 });
  const tas = new Path();
  tas.circle(cx, y(208), 4.5 * s);
  specs.push({ path: tas, fill: METAL });
  const fringe = new Path();
  for (const dx of [-5, 0, 5]) fringe.M(cx, y(212)).L(x(dx * 1.2), y(232));
  specs.push({ path: fringe, stroke: METAL, strokeWidth: 1.6 });
  return specs;
}

export function lanternScene(items: { cx: number; len: number; s: number; tint?: "gold" | "teal" | "rose" }[], topY = 0): OrnamentData {
  return scene(items.flatMap((it) => lanternParts(it.cx, topY, it.len, it.s, it.tint)));
}

/** Lantern center (for glow) given the same params. */
export function lanternCenter(it: { cx: number; len: number; s: number }, topY = 0): [number, number] {
  return [it.cx, topY + it.len + 100 * it.s];
}

/** A crescent with a small star hanging from a thread, in page coordinates. */
export function hangingCrescent(cx: number, topY: number, len: number, R: number): OrnamentData {
  const specs: PartSpec[] = [];
  const cy = topY + len + R;
  specs.push({ path: new Path().M(cx - R * 0.55, topY).L(cx - R * 0.05, cy - R * 0.98), stroke: METAL, strokeWidth: 1.6, opacity: 0.9 });
  specs.push({ path: new Path().M(cx + R * 0.55, topY).L(cx + R * 0.05, cy - R * 0.98), stroke: METAL, strokeWidth: 1.6, opacity: 0.9 });
  const r = R * 0.8;
  const d = R * 0.42;
  const px = (R * R - r * r + d * d) / (2 * d);
  const py = Math.sqrt(Math.max(0, R * R - px * px));
  // crescent opening to the right, rotated so tips point up-right a little
  const rot = rad(-28);
  const rp = (p: Pt): Pt => [cx + p[0] * Math.cos(rot) - p[1] * Math.sin(rot), cy + p[0] * Math.sin(rot) + p[1] * Math.cos(rot)];
  const a = rp([px, -py]);
  const b = rp([px, py]);
  const cres = new Path();
  cres.M(a[0], a[1]).A(R, R, 0, 1, 0, b[0], b[1]).A(r, r, 0, 1, 1, a[0], a[1]).Z();
  cres.include([cx - R, cy - R], [cx + R, cy + R]);
  specs.push({ path: cres, fill: CAP_GOLD, stroke: METAL_D, strokeWidth: 1.2 });
  const sc = rp([R * 0.52, 0]);
  const star = new Path().poly(starPoints(sc[0], sc[1], 5, R * 0.3, R * 0.12, -90), true);
  specs.push({ path: star, fill: CAP_GOLD, stroke: METAL_D, strokeWidth: 1 });
  return scene(specs);
}

/** Mosque skyline silhouette; returns an ornament of size 1000 x h anchored at its bottom. */
export function skyline(color: string, lit: string | null, variant: "near" | "far", h = 330): OrnamentData {
  const base = h;
  const p = new Path();
  const dome = (cx: number, by: number, r: number, hgt: number) => {
    p.M(cx - r, by)
      .C(cx - r * 1.12, by - hgt * 0.55, cx - r * 0.3, by - hgt * 0.62, cx, by - hgt)
      .C(cx + r * 0.3, by - hgt * 0.62, cx + r * 1.12, by - hgt * 0.55, cx + r, by)
      .Z();
    p.M(cx - 1.6, by - hgt).L(cx - 1.6, by - hgt - r * 0.38).L(cx + 1.6, by - hgt - r * 0.38).L(cx + 1.6, by - hgt).Z();
    p.circle(cx, by - hgt - r * 0.42, r * 0.06);
  };
  const block = (x0: number, x1: number, by: number, top: number) => p.poly([[x0, by], [x0, top], [x1, top], [x1, by]], true);
  const minaret = (cx: number, topY: number, wd: number) => {
    block(cx - wd / 2, cx + wd / 2, base, topY + 60);
    block(cx - wd * 0.9, cx + wd * 0.9, topY + 60, topY + 50);
    block(cx - wd * 0.62, cx + wd * 0.62, topY + 50, topY + 24);
    p.M(cx - wd * 0.62, topY + 24).L(cx, topY - 14).L(cx + wd * 0.62, topY + 24).Z();
    p.M(cx - 1.4, topY - 14).L(cx - 1.4, topY - 34).L(cx + 1.4, topY - 34).L(cx + 1.4, topY - 14).Z();
    p.circle(cx, topY - 38, 3);
  };
  if (variant === "near") {
    block(0, 1000, base, base - 40);
    block(360, 640, base, base - 130);
    dome(500, base - 130, 130, 150);
    block(250, 372, base, base - 100);
    dome(311, base - 100, 52, 62);
    block(628, 750, base, base - 100);
    dome(689, base - 100, 52, 62);
    block(130, 250, base, base - 70);
    block(750, 870, base, base - 70);
    dome(190, base - 70, 34, 40);
    dome(810, base - 70, 34, 40);
    minaret(110, base - 250, 26);
    minaret(890, base - 250, 26);
    minaret(215, base - 200, 20);
    minaret(785, base - 200, 20);
  } else {
    block(0, 1000, base, base - 70);
    block(60, 180, base, base - 130);
    dome(120, base - 130, 56, 60);
    block(820, 940, base, base - 130);
    dome(880, base - 130, 56, 60);
    block(300, 700, base, base - 160);
    dome(430, base - 160, 70, 86);
    dome(570, base - 160, 70, 86);
    minaret(40, base - 300, 20);
    minaret(960, base - 300, 20);
    minaret(300, base - 250, 18);
    minaret(700, base - 250, 18);
  }
  p.include([0, 0], [1000, h]);
  const specs: PartSpec[] = [{ path: p, fill: color }];
  if (lit) {
    const w = new Path();
    const wins: [number, number][] =
      variant === "near"
        ? [[430, base - 70], [500, base - 70], [570, base - 70], [311, base - 44], [689, base - 44], [190, base - 30], [810, base - 30], [110, base - 200], [890, base - 200]]
        : [[360, base - 100], [640, base - 100], [120, base - 85], [880, base - 85]];
    wins.forEach(([cx, cy]) => {
      w.M(cx - 7, cy + 20).L(cx - 7, cy + 6).C(cx - 7, cy - 6, cx + 7, cy - 6, cx + 7, cy + 6).L(cx + 7, cy + 20).Z();
    });
    specs.push({ path: w, fill: lit, opacity: 0.9 });
  }
  return assemble(specs, 0, { w: 1000, h, dx: 0, dy: 0 });
}

export { sparkle };
