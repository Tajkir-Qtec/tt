import { assemble, leaf, Path, type OrnamentData, type PartSpec } from "../design/path";
import type { Paint } from "../design/types";

/** Greek key (meander) band, drawn as one continuous stroke with rails above and below. */
export function meander(w: number, h: number, stroke: string, sw = 2.2): OrnamentData {
  const u = h / 7; // grid unit
  const cellW = 8 * u;
  const n = Math.max(1, Math.round(w / cellW));
  const cw = w / n;
  const k = cw / 8;
  const p = new Path();
  const rails = new Path();
  rails.M(0, 0).L(w, 0);
  rails.M(0, h).L(w, h);
  for (let i = 0; i < n; i++) {
    const x = i * cw;
    const y = (a: number) => (a / 7) * h;
    // key: up the left, across the top, down the right, back in, spiralling to the centre
    p.M(x, y(7));
    p.L(x, y(1)).L(x + 6 * k, y(1)).L(x + 6 * k, y(6)).L(x + 2 * k, y(6)).L(x + 2 * k, y(3)).L(x + 4 * k, y(3)).L(x + 4 * k, y(4));
    p.M(x + 6 * k, y(7)).L(x + 8 * k, y(7));
  }
  p.include([0, 0], [w, h]);
  const specs: PartSpec[] = [
    { path: rails, stroke, strokeWidth: sw * 0.6 },
    { path: p, stroke, strokeWidth: sw, lineCap: "butt", lineJoin: "miter" },
  ];
  return assemble(specs, 0, { w, h });
}

/** Olive branch with alternating silvery leaves and a few ripe olives, growing upward-right. */
export function oliveBranch(w: number, h: number, o: { leafA: Paint; leafB: Paint; olive: Paint; stem: string; line?: string; leaves?: number }): OrnamentData {
  const n = o.leaves ?? 9;
  const stem = new Path();
  const la = new Path();
  const lb = new Path();
  const fruit = new Path();
  const pt = (t: number): [number, number] => {
    // quadratic-ish arc from bottom-left to top-right
    const x = w * (0.08 + 0.84 * t);
    const y = h * (0.94 - 0.88 * Math.pow(t, 0.85)) - Math.sin(t * Math.PI) * h * 0.06;
    return [x, y];
  };
  stem.M(...pt(0));
  for (let i = 1; i <= 40; i++) {
    const q = pt(i / 40);
    stem.L(q[0], q[1]);
  }
  const base = -Math.atan2(h * 0.7, w * 0.8);
  for (let i = 0; i < n; i++) {
    const t = 0.12 + (i / n) * 0.8;
    const [x, y] = pt(t);
    const L = Math.min(w, h) * (0.3 - t * 0.12);
    const d = L * 0.18;
    leaf(i % 2 ? lb : la, [x, y], base - 0.9, L, d);
    leaf(i % 2 ? la : lb, [x, y], base + 0.9, L, d);
    if (i % 3 === 1) {
      const a = base + (i % 2 ? 1.25 : -1.25);
      const ex = x + Math.cos(a) * L * 0.55;
      const ey = y + Math.sin(a) * L * 0.55;
      const stalk = new Path();
      stalk.M(x, y).L(ex, ey);
      fruit.M(ex, ey - L * 0.1);
      fruit.C(ex + L * 0.13, ey - L * 0.1, ex + L * 0.13, ey + L * 0.22, ex, ey + L * 0.22);
      fruit.C(ex - L * 0.13, ey + L * 0.22, ex - L * 0.13, ey - L * 0.1, ex, ey - L * 0.1).Z();
      stem.M(x, y).L(ex, ey - L * 0.08);
    }
  }
  const tipLeaf = pt(1);
  leaf(la, tipLeaf, base - 0.1, Math.min(w, h) * 0.2, Math.min(w, h) * 0.035);
  const specs: PartSpec[] = [
    { path: stem, stroke: o.stem, strokeWidth: 2.2 },
    { path: lb, fill: o.leafB, stroke: o.line, strokeWidth: o.line ? 0.7 : 0 },
    { path: la, fill: o.leafA, stroke: o.line, strokeWidth: o.line ? 0.7 : 0 },
    { path: fruit, fill: o.olive },
  ];
  specs.forEach((s) => s.path.include([0, 0], [w, h]));
  return assemble(specs, 0, { w, h });
}

interface Bld {
  x: number;
  w: number;
  h: number;
  dome?: boolean;
  tower?: boolean;
  step?: number;
}

/**
 * Whitewashed Cycladic village silhouette: stacked cubes, blue domes, arched doors,
 * a bell tower. Two depth layers (pale back, white front).
 */
export function village(w: number, h: number, o: { white: string; shade: string; back: string; backShade: string; blue: Paint; door: string }): OrnamentData {
  const s = h / 330;
  const g = h; // ground line
  const back: Bld[] = [
    { x: 20, w: 150, h: 150 },
    { x: 140, w: 120, h: 200, dome: true },
    { x: 330, w: 170, h: 170 },
    { x: 560, w: 130, h: 215 },
    { x: 700, w: 180, h: 160, dome: true },
    { x: 860, w: 130, h: 190 },
  ];
  const front: Bld[] = [
    { x: -10, w: 190, h: 120 },
    { x: 170, w: 130, h: 175, dome: true },
    { x: 300, w: 120, h: 105 },
    { x: 410, w: 90, h: 250, tower: true },
    { x: 500, w: 170, h: 130 },
    { x: 650, w: 140, h: 190, dome: true },
    { x: 780, w: 120, h: 110 },
    { x: 890, w: 120, h: 150 },
  ];
  const specsMap = {
    backBody: new Path(),
    backSide: new Path(),
    body: new Path(),
    side: new Path(),
    dome: new Path(),
    domeHi: new Path(),
    door: new Path(),
    rule: new Path(),
  };
  const draw = (list: Bld[], bodyP: Path, sideP: Path, withDetail: boolean) => {
    list.forEach((b) => {
      const x0 = b.x;
      const x1 = b.x + b.w;
      const top = g - b.h * s;
      bodyP.poly([[x0, g], [x0, top], [x1, top], [x1, g]], true);
      sideP.poly([[x1 - b.w * 0.2, g], [x1 - b.w * 0.2, top], [x1, top], [x1, g]], true);
      if (b.dome) {
        const cx = (x0 + x1) / 2 - b.w * 0.05;
        const rx = b.w * 0.3;
        const ry = rx * 0.9;
        // drum
        bodyP.poly([[cx - rx * 0.92, top], [cx - rx * 0.92, top - ry * 0.28], [cx + rx * 0.92, top - ry * 0.28], [cx + rx * 0.92, top]], true);
        const d = specsMap.dome;
        d.M(cx - rx, top - ry * 0.28).A(rx, ry, 0, 0, 1, cx + rx, top - ry * 0.28).Z();
        d.include([cx, top - ry * 0.28 - ry]);
        if (withDetail) {
          d.M(cx, top - ry * 1.28).L(cx, top - ry * 1.28 - 22 * s);
          d.M(cx - 8 * s, top - ry * 1.28 - 13 * s).L(cx + 8 * s, top - ry * 1.28 - 13 * s);
          d.include([cx, top - ry * 1.28 - 24 * s]);
          const hi = specsMap.domeHi;
          hi.M(cx - rx * 0.55, top - ry * 0.55).A(rx * 0.75, ry * 0.75, 0, 0, 1, cx - rx * 0.05, top - ry * 1.18);
        }
      }
      if (b.tower) {
        const cx = (x0 + x1) / 2;
        // arched belfry opening
        const door = specsMap.door;
        const aw = b.w * 0.34;
        const ay = top + 28 * s;
        door.M(cx - aw / 2, ay + 46 * s).L(cx - aw / 2, ay + aw / 2).A(aw / 2, aw / 2, 0, 0, 1, cx + aw / 2, ay + aw / 2).L(cx + aw / 2, ay + 46 * s).Z();
        // little blue cap
        const d = specsMap.dome;
        d.M(x0 - 4, top).L(x0 - 4, top - 8 * s).L(cx, top - 62 * s).L(x1 + 4, top - 8 * s).L(x1 + 4, top).Z();
      }
      if (withDetail) {
        // arched door + window, rules for stacked storeys
        const door = specsMap.door;
        const dx = x0 + b.w * 0.2;
        const dw = Math.min(30 * s, b.w * 0.26);
        const dh = 46 * s;
        door.M(dx, g).L(dx, g - dh + dw / 2).A(dw / 2, dw / 2, 0, 0, 1, dx + dw, g - dh + dw / 2).L(dx + dw, g).Z();
        door.include([dx + dw / 2, g - dh]);
        if (b.h > 130) {
          const wx = x0 + b.w * 0.5;
          const ww = 20 * s;
          const wy = top + 36 * s;
          door.M(wx, wy + 30 * s).L(wx, wy + ww / 2).A(ww / 2, ww / 2, 0, 0, 1, wx + ww, wy + ww / 2).L(wx + ww, wy + 30 * s).Z();
        }
        specsMap.rule.M(x0, top + 7 * s).L(x1, top + 7 * s);
      }
    });
  };
  draw(back, specsMap.backBody, specsMap.backSide, false);
  draw(front, specsMap.body, specsMap.side, true);
  const specs: PartSpec[] = [
    { path: specsMap.backBody, fill: o.back },
    { path: specsMap.backSide, fill: o.backShade },
    { path: specsMap.body, fill: o.white },
    { path: specsMap.side, fill: o.shade },
    { path: specsMap.dome, fill: o.blue },
    { path: specsMap.domeHi, stroke: "rgba(255,255,255,0.55)", strokeWidth: 3 * s },
    { path: specsMap.door, fill: o.door },
    { path: specsMap.rule, stroke: "rgba(60,100,150,0.25)", strokeWidth: 1.2 },
  ];
  specs.forEach((sp) => sp.path.include([0, 0], [w, h]));
  return assemble(specs, 0, { w, h });
}
