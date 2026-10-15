import { starPoints } from "../design/ornaments";
import { assemble, Path, type OrnamentData, type PartSpec } from "../design/path";
import type { Paint } from "../design/types";

export const TEAL_TILES = ["#0f6b6a", "#12807c", "#0a5656"];
export const GOLD_LINE = "#e2bd62";

function lcg(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
}

/** A strip of star-and-cross mosaic tiles in teal and gold, w x h box. */
export function mosaicStrip(w: number, h: number, cell = 100, seed = 5, tiles: string[] = TEAL_TILES, groutTone = "#06292b"): OrnamentData {
  const rnd = lcg(seed);
  const nRows = Math.max(1, Math.round(h / cell));
  cell = h / nRows;
  const cols = Math.ceil(w / cell);
  const rows = nRows;
  const groups: Path[] = tiles.map(() => new Path());
  const rings = new Path();
  const dots = new Path();
  const diamonds = new Path();
  const outline = new Path();
  const dia = cell * 0.17;
  const R = cell * 0.5;
  const rr = R * 0.58;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cx = c * cell + cell / 2;
      const cy = r * cell + cell / 2;
      const g = groups[Math.floor(rnd() * tiles.length)];
      g.poly(starPoints(cx, cy, 8, R * 0.99, rr, -90), true);
      outline.poly(starPoints(cx, cy, 8, R * 0.99, rr, -90), true);
      rings.circle(cx, cy, rr * 0.7);
      dots.circle(cx, cy, 3.4);
      const x = cx + cell / 2;
      const y = cy + cell / 2;
      diamonds.poly([[x, y - dia], [x + dia, y], [x, y + dia], [x - dia, y]], true);
    }
  }
  const specs: PartSpec[] = [{ path: new Path().poly([[0, 0], [w, 0], [w, h], [0, h]], true), fill: groutTone }];
  groups.forEach((g, i) => specs.push({ path: g, fill: tiles[i] }));
  specs.push({ path: outline, stroke: GOLD_LINE, strokeWidth: 1.6, opacity: 0.9, lineJoin: "miter" });
  specs.push({ path: rings, stroke: "#9fe0d0", strokeWidth: 1.4, opacity: 0.55 });
  specs.push({ path: dots, fill: GOLD_LINE });
  specs.push({ path: diamonds, fill: GOLD_LINE, opacity: 0.9 });
  return assemble(specs, 0, { w, h, dx: 0, dy: 0 });
}

/** Gold double rule with a row of small diamonds, w x 14. */
export function goldRule(w: number, paint: Paint = GOLD_LINE): OrnamentData {
  const s: PartSpec[] = [];
  s.push({ path: new Path().M(0, 3).L(w, 3), stroke: GOLD_LINE, strokeWidth: 3 });
  s.push({ path: new Path().M(0, 11).L(w, 11), stroke: GOLD_LINE, strokeWidth: 1.2 });
  const d = new Path();
  for (let x = 20; x < w; x += 40) d.poly([[x, 4], [x + 5, 7], [x, 10], [x - 5, 7]], true);
  s.push({ path: d, fill: paint });
  return assemble(s, 0, { w, h: 14, dx: 0, dy: 0 });
}

/** Fine arch outline with scallop cut in the corners ("mihrab"), w x h. */
export function mihrab(w: number, h: number, stroke: string, fill: Paint | null, lines = 2): OrnamentData {
  const s: PartSpec[] = [];
  const build = (inset: number) => {
    const x0 = inset;
    const x1 = w - inset;
    const top = inset;
    const midY = h * 0.3;
    const p = new Path().M(x0, h - inset).L(x0, midY);
    p.C(x0, midY - h * 0.14, w * 0.35, top + h * 0.1, w / 2, top);
    p.C(w * 0.65, top + h * 0.1, x1, midY - h * 0.14, x1, midY);
    p.L(x1, h - inset).Z();
    return p;
  };
  s.push({ path: build(4), fill, stroke, strokeWidth: 3.4 });
  for (let i = 1; i < lines; i++) s.push({ path: build(4 + i * 14), stroke, strokeWidth: 1.4, opacity: 0.85 });
  return assemble(s, 0, { w, h, dx: 0, dy: 0 });
}
