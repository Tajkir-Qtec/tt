import { banner, sunburst, wreath, sparkle } from "../design/ornaments";
import { assemble, Path, type OrnamentData } from "../design/path";
import type { Layer, Paint } from "../design/types";
import { GOLD, lock, O, radial, S, T } from "./kit";

export interface CrestColors {
  /** metal tone for line art */
  gold: string;
  goldDark: string;
  /** shield body */
  field: string;
  /** letter foil / ivory */
  foil: Paint;
  ivory: string;
}

/** Heater shield with double outline, centred in a 200 x 250 box. */
export function shield(c: CrestColors): OrnamentData {
  const mk = (k: number, topY = -105, botY = 124) => {
    const p = new Path();
    const w = 86 * k;
    const t = topY * k + (1 - k) * 8;
    p.M(-w, t)
      .C(-w * 0.4, t + 10, w * 0.4, t + 10, w, t)
      .L(w, 22 * k)
      .C(w, 74 * k, 44 * k, 104 * k, 0, botY * k + (1 - k) * 4)
      .C(-44 * k, 104 * k, -w, 74 * k, -w, 22 * k)
      .Z();
    return p;
  };
  return assemble(
    [
      { path: mk(1.07), fill: c.goldDark, opacity: 0.55 },
      { path: mk(1), fill: c.field, stroke: c.gold, strokeWidth: 5, lineJoin: "round" },
      { path: mk(0.9), stroke: c.gold, strokeWidth: 1.6, opacity: 0.9 },
    ],
    0,
    { w: 200, h: 250, dx: 100, dy: 122 },
  );
}

/** Small five-point crown. Box 84 x 58. */
export function crown(c: CrestColors): OrnamentData {
  const body = new Path()
    .M(6, 40)
    .L(3, 12)
    .L(24, 28)
    .L(42, 4)
    .L(60, 28)
    .L(81, 12)
    .L(78, 40)
    .Z();
  const band = new Path().poly(
    [
      [6, 40],
      [78, 40],
      [78, 52],
      [6, 52],
    ],
    true,
  );
  const balls = new Path().circle(3, 9, 4).circle(42, 2, 4.6).circle(81, 9, 4);
  const jewels = new Path().circle(24, 46, 3).circle(42, 46, 3.4).circle(60, 46, 3);
  return assemble(
    [
      { path: body, fill: c.gold, stroke: c.goldDark, strokeWidth: 1.6 },
      { path: band, fill: c.gold, stroke: c.goldDark, strokeWidth: 1.6, lineJoin: "miter" },
      { path: balls, fill: c.gold, stroke: c.goldDark, strokeWidth: 1 },
      { path: jewels, fill: c.field },
    ],
    0,
    { w: 84, h: 58 },
  );
}

/** Soft rays and glow behind a crest (centre cx, cy). */
export function crestAura(cx: number, cy: number, color: string, size = 1000, opacity = 0.07): Layer[] {
  return [
    lock(O(sunburst({ color, rays: 36, size, core: 0.12 }), { cx, y: cy - size / 2, width: size, opacity })),
    lock(S({ x: cx - 420, y: cy - 330, width: 840, height: 660, shape: "ellipse", fill: radial([0, "rgba(40,78,140,0.55)"], [1, "rgba(40,78,140,0)"]) })),
  ];
}

/**
 * The complete crest: laurel wreath, shield, crown, ribbon, interlaced initials.
 * `s` scales the whole emblem (1 = ~440px wide wreath).
 */
export function crestLayers(o: {
  cx: number;
  cy: number;
  s: number;
  colors: CrestColors;
  initials: [string, string];
  ribbonText?: string;
  ribbonInk?: string;
}): Layer[] {
  const { cx, cy, s, colors: c } = o;
  const R = 160;
  const leafLen = 48;
  const size = 2 * R + 2 * leafLen + 20;
  const layers: Layer[] = [];
  layers.push(
    lock(O(wreath({ color: c.gold, radius: R, leaves: 11, leafLen, leafW: 14, gap: 30, stemWidth: 3, berryColor: c.goldDark }), { cx, y: cy - (size * s) / 2, width: size * s })),
  );
  layers.push(lock(O(shield(c), { cx, y: cy - 122 * s, width: 200 * s })));
  layers.push(lock(O(crown(c), { cx, y: cy - R * s - 62 * s, width: 84 * s })));
  layers.push(lock(O(sparkle({ color: c.gold, size: 20 }), { cx: cx - 78 * s, y: cy - R * s - 30 * s, width: 20 * s, opacity: 0.9 })));
  layers.push(lock(O(sparkle({ color: c.gold, size: 20 }), { cx: cx + 78 * s, y: cy - R * s - 30 * s, width: 20 * s, opacity: 0.9 })));
  // interlaced initials: second letter overlaps the first
  const fs = 124 * s;
  const lh = 1.1;
  const top = cy - 6 * s - (fs * lh) / 2;
  const bw = 150 * s;
  layers.push(
    T(o.initials[0], top, { x: cx - 30 * s - bw / 2, width: bw, fontFamily: "Bodoni Moda", fontWeight: 600, fontSize: fs, lineHeight: lh, fill: c.foil }),
  );
  layers.push(
    T(o.initials[1], top, {
      x: cx + 30 * s - bw / 2,
      width: bw,
      fontFamily: "Bodoni Moda",
      fontWeight: 500,
      italic: true,
      fontSize: fs,
      lineHeight: lh,
      fill: c.ivory,
      shadow: { color: "#000000", blur: 6, offsetX: 0, offsetY: 2, opacity: 0.55 },
    }),
  );
  if (o.ribbonText) {
    const rw = 360 * s;
    const rh = 54 * s;
    const ry = cy + R * s + 18 * s - rh / 2;
    layers.push(lock(O(banner({ color: c.gold, w: 360, h: 54, stroke: c.goldDark }), { cx, y: ry, width: rw })));
    layers.push(
      T(o.ribbonText, ry + rh / 2 - 12 * s, {
        x: cx - rw / 2 + 56 * s,
        width: rw - 112 * s,
        fontFamily: "Cinzel",
        fontWeight: 600,
        fontSize: 17 * s,
        letterSpacing: 5 * s,
        fill: o.ribbonInk ?? "#0b1a33",
        uppercase: true,
      }),
    );
  }
  return layers;
}

export { GOLD };
