import { assemble, Path, type OrnamentData, type PartSpec, type Pt } from "../design/path";
import { GOLD } from "./kit";

function lcg(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
}

/** Meandering polyline smoothed into a chain of quadratic curves. */
function meander(rnd: () => number, start: Pt, angle: number, steps: number, step: number, wobble: number): Pt[] {
  const pts: Pt[] = [start];
  let a = angle;
  let [x, y] = start;
  let drift = 0;
  for (let i = 0; i < steps; i++) {
    drift = drift * 0.6 + (rnd() - 0.5) * wobble;
    a += drift;
    const len = step * (0.7 + rnd() * 0.6);
    x += Math.cos(a) * len;
    y += Math.sin(a) * len;
    pts.push([x, y]);
  }
  return pts;
}

function smooth(p: Path, pts: Pt[]) {
  p.M(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i][0] + pts[i + 1][0]) / 2;
    const my = (pts[i][1] + pts[i + 1][1]) / 2;
    p.Q(pts[i][0], pts[i][1], mx, my);
  }
  const l = pts[pts.length - 1];
  p.L(l[0], l[1]);
}

interface VeinStyle {
  stroke: string;
  width: number;
  opacity: number;
}

/** Full-page white-marble veining (grey shadow veins + gold veins). */
export function marbleVeins(seed: number, density = 1): OrnamentData {
  const rnd = lcg(seed);
  const specs: PartSpec[] = [];
  const add = (pts: Pt[], st: VeinStyle) => {
    const p = new Path();
    smooth(p, pts);
    specs.push({ path: p, stroke: st.stroke, strokeWidth: st.width, opacity: st.opacity, lineCap: "round", lineJoin: "round" });
  };
  const grey = (w: number, o: number): VeinStyle => ({ stroke: "#8e949e", width: w, opacity: o });
  const gold = (w: number, o: number, c = "#b8913f"): VeinStyle => ({ stroke: c, width: w, opacity: o });

  const mains = Math.round(6 * density);
  for (let k = 0; k < mains; k++) {
    // flow runs from the upper-right toward the lower-left
    const fromTop = rnd() < 0.55;
    const start: Pt = fromTop ? [300 + rnd() * 900, -40] : [1040, rnd() * 900];
    const angle = (105 + rnd() * 35) * (Math.PI / 180);
    const main = meander(rnd, start, angle, 22, 85, 0.75);
    add(main, grey(26 + rnd() * 20, 0.045));
    add(main, grey(8 + rnd() * 6, 0.08));
    add(main, grey(1.6, 0.28));
    const isGold = k % 2 === 0 || rnd() < 0.5;
    if (isGold) {
      add(main, gold(4.2, 0.18, "#d8b869"));
      add(main, gold(1.0 + rnd() * 1.6, 0.8, "#c9a452"));
    }
    for (let b = 0; b < 6; b++) {
      const idx = 3 + Math.floor(rnd() * (main.length - 6));
      const dir = (rnd() < 0.5 ? -1 : 1) * (0.5 + rnd() * 0.8);
      const a0 = Math.atan2(main[idx + 1][1] - main[idx][1], main[idx + 1][0] - main[idx][0]) + dir;
      const br = meander(rnd, main[idx], a0, 5 + Math.floor(rnd() * 7), 55, 1.0);
      add(br, grey(1, 0.22));
      add(br, gold(0.5 + rnd() * 0.7, 0.45 + rnd() * 0.3, rnd() < 0.5 ? "#c9a452" : "#a98232"));
      if (rnd() < 0.5) {
        const j = 1 + Math.floor(rnd() * (br.length - 2));
        const sub = meander(rnd, br[j], a0 + (rnd() - 0.5) * 1.6, 3 + Math.floor(rnd() * 3), 38, 1.1);
        add(sub, gold(0.5, 0.5));
      }
    }
  }
  for (let k = 0; k < Math.round(8 * density); k++) {
    const st: Pt = [rnd() * 1000, rnd() * 1400];
    add(meander(rnd, st, (95 + rnd() * 60) * (Math.PI / 180), 8, 50, 0.9), grey(0.8, 0.14));
  }
  return assemble(specs, 0, { w: 1000, h: 1400 });
}

/** Thick foil frame with chamfered corners plus fine inner and outer keylines. */
export function goldFrame(inset: number, thick: number, chamfer: number, inner = 16): OrnamentData {
  const rect = (i: number, c: number, rev = false): Pt[] => {
    const x0 = i,
      y0 = i,
      x1 = 1000 - i,
      y1 = 1400 - i;
    const pts: Pt[] = [
      [x0 + c, y0], [x1 - c, y0], [x1, y0 + c], [x1, y1 - c], [x1 - c, y1], [x0 + c, y1], [x0, y1 - c], [x0, y0 + c],
    ];
    return rev ? pts.reverse() : pts;
  };
  const ci = Math.max(0, chamfer - thick * 0.4);
  const ring = new Path();
  ring.poly(rect(inset, chamfer), true);
  ring.poly(rect(inset + thick, ci, true), true);
  const outerLine = new Path().poly(rect(inset - 9, chamfer + 8), true);
  const innerLine = new Path().poly(rect(inset + thick + inner, Math.max(0, ci - inner * 0.3)), true);
  const innerLine2 = new Path().poly(rect(inset + thick + inner + 7, Math.max(0, ci - inner * 0.3 - 5)), true);
  const hi = new Path().poly(rect(inset + 3, chamfer), true);
  return assemble(
    [
      { path: ring, fill: GOLD },
      { path: hi, stroke: "#fff3cc", strokeWidth: 0.8, opacity: 0.6 },
      { path: outerLine, stroke: "#b58a35", strokeWidth: 1.2, opacity: 0.9 },
      { path: innerLine, stroke: "#b58a35", strokeWidth: 1.6, opacity: 0.95 },
      { path: innerLine2, stroke: "#c9a452", strokeWidth: 0.8, opacity: 0.8 },
    ],
    0,
    { w: 1000, h: 1400 },
  );
}

/** Small lozenge studs for the frame corners. */
export function cornerStuds(inset: number, thick: number): OrnamentData {
  const specs: PartSpec[] = [];
  const o = inset + thick / 2 + 26;
  const cs: Pt[] = [[o, o], [1000 - o, o], [o, 1400 - o], [1000 - o, 1400 - o]];
  for (const [x, y] of cs) {
    const p = new Path().poly([[x, y - 9], [x + 9, y], [x, y + 9], [x - 9, y]], true);
    specs.push({ path: p, fill: GOLD });
  }
  return assemble(specs, 0, { w: 1000, h: 1400 });
}
