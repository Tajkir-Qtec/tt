import { assemble, Path, type OrnamentData, type PartSpec, type Pt } from "../design/path";

const rad = (d: number) => (d * Math.PI) / 180;

function rng(seed: number) {
  let s = (seed >>> 0) || 1;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Date palm (khejur gach) with chevron bark, feathery fronds and a clay sap pot (rosher hari). */
export function datePalm(o: { w: number; h: number; lean: number; trunk: string; bark: string; frond: string; pot: string; potLight: string; potSide?: 1 | -1 }): OrnamentData {
  const { w, h } = o;
  const bx = w * 0.5 - o.lean * 0.5;
  const crown: Pt = [bx + o.lean, 190];
  const center = (t: number): Pt => [bx + o.lean * t * t, h - (h - crown[1]) * t];
  const hw = (t: number) => 21 - 10 * t;
  const left: Pt[] = [];
  const right: Pt[] = [];
  const N = 36;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const [cx, cy] = center(t);
    left.push([cx - hw(t), cy]);
    right.push([cx + hw(t), cy]);
  }
  const trunk = new Path();
  left.forEach(([x, y], i) => (i === 0 ? trunk.M(x, y) : trunk.L(x, y)));
  right.reverse().forEach(([x, y]) => trunk.L(x, y));
  trunk.Z();
  const bark = new Path();
  for (let t = 0.03; t < 0.98; t += 0.026) {
    const [cx, cy] = center(t);
    const k = hw(t) * 0.92;
    bark.M(cx - k, cy - 4).L(cx, cy + 5).L(cx + k, cy - 4);
  }
  // side shade
  const shade = new Path();
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const [cx, cy] = center(t);
    const x = cx + hw(t) * 0.35;
    if (i === 0) shade.M(x, cy);
    else shade.L(x, cy);
  }
  for (let i = N; i >= 0; i--) {
    const t = i / N;
    const [cx, cy] = center(t);
    shade.L(cx + hw(t), cy);
  }
  shade.Z();

  const ribs = new Path();
  const leaflets = new Path();
  const angles = [-172, -150, -128, -106, -84, -62, -40, -18, 6, 20, -196];
  angles.forEach((deg, idx) => {
    const a = rad(deg);
    const L = (idx % 2 ? 176 : 206) * (w / 360);
    const c: Pt = [crown[0] + Math.cos(a) * L * 0.55, crown[1] + Math.sin(a) * L * 0.55 - 46];
    const e: Pt = [crown[0] + Math.cos(a) * L, crown[1] + Math.sin(a) * L + 58];
    ribs.M(crown[0], crown[1]).Q(c[0], c[1], e[0], e[1]);
    for (let s = 1; s <= 18; s++) {
      const t = 0.14 + (s / 18) * 0.86;
      const u = 1 - t;
      const px = u * u * crown[0] + 2 * u * t * c[0] + t * t * e[0];
      const py = u * u * crown[1] + 2 * u * t * c[1] + t * t * e[1];
      let tx = 2 * u * (c[0] - crown[0]) + 2 * t * (e[0] - c[0]);
      let ty = 2 * u * (c[1] - crown[1]) + 2 * t * (e[1] - c[1]);
      const tl = Math.hypot(tx, ty) || 1;
      tx /= tl;
      ty /= tl;
      const ll = 46 * (1 - 0.5 * t) * (w / 360);
      for (const side of [-1, 1]) {
        const nx = -ty * side;
        const ny = tx * side;
        leaflets.M(px, py).L(px + (tx * 0.5 + nx * 0.7) * ll, py + (ty * 0.5 + ny * 0.7) * ll + ll * 0.35);
      }
    }
  });

  // sap pot hung from a bamboo spout
  const side = o.potSide ?? 1;
  const [tcx, tcy] = center(0.86);
  const nick: Pt = [tcx + side * hw(0.86) * 0.2, tcy];
  const px = tcx + side * (hw(0.86) + 52);
  const py = tcy + 74;
  const spout = new Path().M(nick[0], nick[1]).L(px - side * 4, py - 30);
  const rope = new Path().M(tcx - side * hw(0.86), tcy - 14).L(px - side * 14, py - 20).M(tcx - side * hw(0.86), tcy + 4).L(px - side * 12, py - 12);
  const pot = new Path()
    .M(px - 15, py - 22)
    .C(px - 40, py - 8, px - 40, py + 34, px, py + 40)
    .C(px + 40, py + 34, px + 40, py - 8, px + 15, py - 22)
    .Z();
  const rim = new Path().M(px - 17, py - 24).L(px + 17, py - 24).L(px + 15, py - 18).L(px - 15, py - 18).Z();
  const gloss = new Path().M(px - 20, py - 4).C(px - 24, py + 8, px - 20, py + 20, px - 10, py + 28);
  const notch = new Path().M(nick[0] - 8, nick[1] - 12).L(nick[0] + 2, nick[1] + 4).L(nick[0] + 10, nick[1] - 12);

  const specs: PartSpec[] = [
    { path: ribs, stroke: o.frond, strokeWidth: 4.4 },
    { path: leaflets, stroke: o.frond, strokeWidth: 2.8, opacity: 0.95 },
    { path: trunk, fill: o.trunk },
    { path: shade, fill: o.bark, opacity: 0.35 },
    { path: bark, stroke: o.bark, strokeWidth: 1.8, opacity: 0.8 },
    { path: notch, stroke: "#f1d7a0", strokeWidth: 2.4 },
    { path: spout, stroke: "#d8b46a", strokeWidth: 4.5 },
    { path: rope, stroke: o.bark, strokeWidth: 1.6 },
    { path: pot, fill: o.pot },
    { path: rim, fill: o.bark },
    { path: gloss, stroke: o.potLight, strokeWidth: 3, opacity: 0.8 },
  ];
  return assemble(specs, 0, { w, h });
}

/** Perspective mustard field: rows of small yellow blossoms receding toward the horizon at y=0. */
export function mustardField(o: { w: number; h: number; seed?: number; rows?: number }): OrnamentData {
  const r = rng(o.seed ?? 7);
  const rows = o.rows ?? 17;
  const a = new Path();
  const b = new Path();
  const c = new Path();
  const g = new Path();
  for (let i = 0; i < rows; i++) {
    const t = (i + 0.5) / rows;
    const y = o.h * Math.pow(t, 1.75);
    const size = 1.6 + t * 8.5;
    const step = size * 3.1;
    const n = Math.ceil(o.w / step) + 2;
    for (let k = 0; k < n; k++) {
      const x = (k - 0.5) * step + r() * step * 0.8;
      const yy = y + (r() - 0.5) * size * 1.6;
      const pick = r();
      (pick < 0.45 ? a : pick < 0.8 ? b : c).circle(x, yy, size * (0.75 + r() * 0.5));
      if (t > 0.3) g.M(x, yy + size * 0.6).L(x + (r() - 0.5) * 3, yy + size * 2.8);
    }
  }
  const frame = new Path().M(0, 0).L(o.w, o.h);
  return assemble(
    [
      { path: g, stroke: "#6f7d2e", strokeWidth: 1.5, opacity: 0.7 },
      { path: a, fill: "#f2b826" },
      { path: b, fill: "#ffd24a" },
      { path: c, fill: "#e19a12" },
      { path: frame, stroke: null },
    ],
    0,
    { w: o.w, h: o.h },
  );
}

/** Distant village silhouette: tree blobs, thatched huts and slim palms (baseline at the bottom). */
export function villageSil(o: { w: number; h: number; color: string; seed?: number }): OrnamentData {
  const r = rng(o.seed ?? 3);
  const blobs = new Path();
  const huts = new Path();
  const palms = new Path();
  const fr = new Path();
  let x = 10;
  while (x < o.w - 30) {
    const kind = r();
    if (kind < 0.55) {
      const bw = 40 + r() * 60;
      for (let k = 0; k < 4; k++) blobs.circle(x + (bw * k) / 3 + r() * 8, o.h - 14 - r() * 22, 16 + r() * 18);
      x += bw + 20;
    } else if (kind < 0.8) {
      const hw = 36 + r() * 12;
      huts.M(x, o.h).L(x, o.h - 22).L(x + hw / 2, o.h - 44).L(x + hw, o.h - 22).L(x + hw, o.h).Z();
      x += hw + 26;
    } else {
      const ph = 70 + r() * 40;
      palms.M(x, o.h).L(x + 3, o.h - ph);
      for (let k = 0; k < 6; k++) {
        const aa = rad(-170 + k * 32);
        fr.M(x + 3, o.h - ph).L(x + 3 + Math.cos(aa) * 26, o.h - ph + Math.sin(aa) * 16 + 8);
      }
      x += 40;
    }
  }
  const ground = new Path().M(0, o.h - 6).L(o.w, o.h - 6).L(o.w, o.h).L(0, o.h).Z();
  return assemble(
    [
      { path: blobs, fill: o.color },
      { path: huts, fill: o.color },
      { path: palms, stroke: o.color, strokeWidth: 3 },
      { path: fr, stroke: o.color, strokeWidth: 2.4 },
      { path: ground, fill: o.color },
    ],
    0,
    { w: o.w, h: o.h },
  );
}

function capsule(p: Path, cx: number, cy: number, len: number, wd: number, ang: number) {
  const pts: Pt[] = [];
  const a = rad(ang);
  const ca = Math.cos(a);
  const sa = Math.sin(a);
  const put = (u: number, v: number): Pt => [cx + ca * u - sa * v, cy + sa * u + ca * v];
  const hl = len / 2 - wd / 2;
  for (let i = 0; i <= 10; i++) {
    const t = -Math.PI / 2 + (i / 10) * Math.PI;
    pts.push(put(hl + Math.cos(t) * wd / 2, Math.sin(t) * wd / 2));
  }
  for (let i = 0; i <= 10; i++) {
    const t = Math.PI / 2 + (i / 10) * Math.PI;
    pts.push(put(-hl + Math.cos(t) * wd / 2, Math.sin(t) * wd / 2));
  }
  p.poly(pts, true);
}

/** Banana-leaf platter of winter pithas: chitoi discs, patishapta rolls, pulis and gur. */
export function pithaPlate(o: { size: number }): OrnamentData {
  const S = o.size;
  const c = S / 2;
  const u = (f: number) => f * S;
  const shadow = new Path().circle(c, c + u(0.03), u(0.49));
  const leafOuter = new Path().circle(c, c, u(0.47));
  const leafIn = new Path().circle(c, c, u(0.43));
  const veins = new Path();
  for (let i = -5; i <= 5; i++) {
    const y0 = c + i * u(0.07);
    const half = Math.sqrt(Math.max(0, u(0.42) ** 2 - (i * u(0.07)) ** 2));
    veins.M(c - half, y0 + u(0.05)).L(c + half, y0 - u(0.02));
  }
  const rib = new Path().M(c - u(0.43), c + u(0.06)).L(c + u(0.43), c - u(0.04));

  const chit = [
    [-0.16, -0.17, 0.115],
    [0.19, -0.13, 0.105],
    [-0.04, 0.2, 0.115],
  ];
  const discs = new Path();
  const swirl = new Path();
  const spots = new Path();
  chit.forEach(([dx, dy, rr], k) => {
    const cx = c + u(dx);
    const cy = c + u(dy);
    discs.circle(cx, cy, u(rr));
    for (let i = 0; i <= 36; i++) {
      const t = i / 36;
      const aa = t * Math.PI * 4 + k;
      const rad2 = u(rr) * 0.75 * t;
      const x = cx + Math.cos(aa) * rad2;
      const y = cy + Math.sin(aa) * rad2;
      if (i === 0) swirl.M(x, y);
      else swirl.L(x, y);
    }
    for (let i = 0; i < 12; i++) {
      const aa = (i / 12) * Math.PI * 2;
      spots.circle(cx + Math.cos(aa) * u(rr) * 0.88, cy + Math.sin(aa) * u(rr) * 0.88, 1.4);
    }
  });
  const rolls = new Path();
  const rollEnds = new Path();
  const rollLines = new Path();
  [
    [0.2, 0.16, 18],
    [-0.23, 0.0, -62],
  ].forEach(([dx, dy, ang]) => {
    capsule(rolls, c + u(dx), c + u(dy), u(0.3), u(0.1), ang);
    const a = rad(ang);
    for (const s of [-1, 1]) rollEnds.circle(c + u(dx) + Math.cos(a) * u(0.13) * s, c + u(dy) + Math.sin(a) * u(0.13) * s, u(0.036));
    for (let i = -2; i <= 2; i++) {
      const cx = c + u(dx) + Math.cos(a) * u(0.05) * i;
      const cy = c + u(dy) + Math.sin(a) * u(0.05) * i;
      rollLines.M(cx - Math.sin(a) * u(0.035), cy + Math.cos(a) * u(0.035)).L(cx + Math.sin(a) * u(0.035), cy - Math.cos(a) * u(0.035));
    }
  });
  const puli = new Path();
  const crimp = new Path();
  const pc: Pt = [c + u(0.04), c - u(0.04)];
  const pr = u(0.1);
  puli.M(pc[0] - pr, pc[1] + pr * 0.4).A(pr, pr, 0, 0, 1, pc[0] + pr, pc[1] + pr * 0.4).Z();
  puli.include([pc[0], pc[1] - pr * 0.6]);
  for (let i = 0; i < 7; i++) {
    const aa = Math.PI + (i / 6) * Math.PI;
    crimp.M(pc[0] + Math.cos(aa) * pr * 0.78, pc[1] + pr * 0.4 + Math.sin(aa) * pr * 0.78).L(pc[0] + Math.cos(aa) * pr * 0.98, pc[1] + pr * 0.4 + Math.sin(aa) * pr * 0.98);
  }
  const gur = new Path();
  [
    [0.3, -0.02],
    [0.34, 0.04],
    [-0.31, -0.2],
    [0.0, 0.0],
  ].forEach(([dx, dy], i) => i < 3 && gur.circle(c + u(dx), c + u(dy), u(0.022)));
  const frame = new Path().M(0, 0).L(S, S);
  return assemble(
    [
      { path: shadow, fill: "#2a1a0e", opacity: 0.25 },
      { path: leafOuter, fill: "#4e6b25" },
      { path: leafIn, fill: "#7b9a3c" },
      { path: veins, stroke: "#5f7c2b", strokeWidth: 1.4, opacity: 0.8 },
      { path: rib, stroke: "#4e6b25", strokeWidth: 3 },
      { path: discs, fill: "#f8eed4", stroke: "#d2ac6a", strokeWidth: 1.5 },
      { path: swirl, stroke: "#c59a52", strokeWidth: 1.6 },
      { path: spots, fill: "#c59a52" },
      { path: rolls, fill: "#e4b35e", stroke: "#b98433", strokeWidth: 1.6 },
      { path: rollEnds, fill: "#f8eed4", opacity: 0.9 },
      { path: rollLines, stroke: "#b98433", strokeWidth: 1.2, opacity: 0.8 },
      { path: puli, fill: "#f8eed4", stroke: "#c4a064", strokeWidth: 1.6 },
      { path: crimp, stroke: "#c4a064", strokeWidth: 1.4 },
      { path: gur, fill: "#5a3217" },
      { path: frame, stroke: null },
    ],
    0,
    { w: S, h: S },
  );
}

/** Simple solid icons for the programme list. */
export function pitIcon(o: { kind: "pot" | "pitha" | "music" | "fire"; size: number; color: string }): OrnamentData {
  const S = o.size;
  const u = (f: number) => f * S;
  const fill = new Path();
  const line = new Path();
  if (o.kind === "pot") {
    fill
      .M(u(0.34), u(0.34))
      .C(u(0.12), u(0.46), u(0.14), u(0.9), u(0.5), u(0.92))
      .C(u(0.86), u(0.9), u(0.88), u(0.46), u(0.66), u(0.34))
      .Z();
    line.M(u(0.3), u(0.3)).L(u(0.7), u(0.3));
    line.M(u(0.44), u(0.22)).C(u(0.38), u(0.14), u(0.5), u(0.1), u(0.44), u(0.02));
    line.M(u(0.58), u(0.22)).C(u(0.52), u(0.14), u(0.64), u(0.1), u(0.58), u(0.02));
  } else if (o.kind === "pitha") {
    fill.circle(u(0.34), u(0.42), u(0.2)).circle(u(0.68), u(0.42), u(0.2));
    line.M(u(0.08), u(0.74)).C(u(0.1), u(0.96), u(0.9), u(0.96), u(0.92), u(0.74));
    line.M(u(0.06), u(0.74)).L(u(0.94), u(0.74));
  } else if (o.kind === "music") {
    fill.circle(u(0.34), u(0.72), u(0.2));
    line.M(u(0.44), u(0.62)).L(u(0.78), u(0.08));
    line.M(u(0.72), u(0.1)).L(u(0.86), u(0.1));
  } else {
    fill
      .M(u(0.5), u(0.04))
      .C(u(0.72), u(0.26), u(0.86), u(0.4), u(0.82), u(0.62))
      .C(u(0.78), u(0.82), u(0.62), u(0.88), u(0.5), u(0.88))
      .C(u(0.36), u(0.88), u(0.2), u(0.8), u(0.18), u(0.62))
      .C(u(0.16), u(0.46), u(0.3), u(0.36), u(0.4), u(0.24))
      .C(u(0.42), u(0.34), u(0.46), u(0.36), u(0.5), u(0.04))
      .Z();
    line.M(u(0.14), u(0.96)).L(u(0.86), u(0.82));
    line.M(u(0.14), u(0.82)).L(u(0.86), u(0.96));
  }
  const frame = new Path().M(0, 0).L(S, S);
  return assemble(
    [
      { path: fill, fill: o.color },
      { path: line, stroke: o.color, strokeWidth: Math.max(2.5, S * 0.07) },
      { path: frame, stroke: null },
    ],
    0,
    { w: S, h: S },
  );
}
