import { assemble, Path, type OrnamentData, type PartSpec, type Pt } from "../design/path";

/* Jamdani-inspired woven motifs. Everything is built from straight edges (diamonds and
   stepped polygons) because Jamdani is brocaded thread by thread on a loom. */

export const JD = {
  ivory: "#f5edd9",
  ivoryD: "#ece0c2",
  indigo: "#1f2a63",
  red: "#b3202a",
  gold: "#c9a04a",
  goldL: "#e5c873",
  ink: "#2a1a1d",
};

function dia(p: Path, cx: number, cy: number, rx: number, ry: number) {
  p.poly(
    [
      [cx, cy - ry],
      [cx + rx, cy],
      [cx, cy + ry],
      [cx - rx, cy],
    ],
    true,
  );
}

interface BootiBag {
  red: Path;
  indigo: Path;
  gold: Path;
  ivory: Path;
}

const newBag = (): BootiBag => ({ red: new Path(), indigo: new Path(), gold: new Path(), ivory: new Path() });

function bagParts(b: BootiBag, extra: PartSpec[] = []): PartSpec[] {
  return [
    ...extra,
    { path: b.red, fill: JD.red, lineJoin: "miter" },
    { path: b.indigo, fill: JD.indigo, lineJoin: "miter" },
    { path: b.gold, fill: JD.gold, lineJoin: "miter" },
    { path: b.ivory, fill: JD.ivory, lineJoin: "miter" },
  ];
}

/** Eight-petal phul booti (angular flower). */
function phul(b: BootiBag, cx: number, cy: number, s: number, main: "red" | "indigo" = "red") {
  const m = main === "red" ? b.red : b.indigo;
  const o = main === "red" ? b.indigo : b.red;
  // long petals N/E/S/W
  dia(m, cx, cy - s * 0.52, s * 0.2, s * 0.46);
  dia(m, cx, cy + s * 0.52, s * 0.2, s * 0.46);
  dia(m, cx - s * 0.52, cy, s * 0.46, s * 0.2);
  dia(m, cx + s * 0.52, cy, s * 0.46, s * 0.2);
  // diagonal short petals
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([dx, dy]) => dia(o, cx + dx * s * 0.34, cy + dy * s * 0.34, s * 0.12, s * 0.12));
  // inlays
  dia(b.ivory, cx, cy - s * 0.52, s * 0.07, s * 0.2);
  dia(b.ivory, cx, cy + s * 0.52, s * 0.07, s * 0.2);
  dia(b.ivory, cx - s * 0.52, cy, s * 0.2, s * 0.07);
  dia(b.ivory, cx + s * 0.52, cy, s * 0.2, s * 0.07);
  dia(b.gold, cx, cy, s * 0.17, s * 0.17);
  dia(b.ivory, cx, cy, s * 0.06, s * 0.06);
}

/** Small four-diamond cluster. */
function tarka(b: BootiBag, cx: number, cy: number, s: number) {
  [[0, -1], [1, 0], [0, 1], [-1, 0]].forEach(([dx, dy]) => dia(b.indigo, cx + dx * s * 0.28, cy + dy * s * 0.28, s * 0.16, s * 0.16));
  dia(b.gold, cx, cy, s * 0.14, s * 0.14);
}

const KALKA: Pt[] = [
  [50, 0], [68, 22], [80, 52], [84, 88], [74, 122], [52, 148], [26, 146], [10, 126], [12, 102], [28, 92], [38, 74], [34, 48], [42, 24],
];

function addKalka(b: BootiBag, cx: number, cy: number, s: number, flip = 1) {
  const f = s / 150;
  const tf = (pts: Pt[], k = 1, ox = 0, oy = 0): Pt[] => pts.map(([x, y]) => [cx + (((x - 48) * k + ox) * f) * flip, cy + (((y - 74) * k + oy) * f)] as Pt);
  b.red.poly(tf(KALKA), true);
  b.ivory.poly(tf(KALKA, 0.66, 6, 14), true);
  b.indigo.poly(tf(KALKA, 0.52, 7, 17), true);
  dia(b.gold, cx + 10 * f * flip, cy + 26 * f, 8 * f, 8 * f);
  dia(b.gold, cx + 10 * f * flip, cy - 8 * f, 5 * f, 5 * f);
}

/** Full diagonal-lattice jaal field with alternating booti. */
export function jamdaniField(o: { w: number; h: number; cell?: number; lineOp?: number }): OrnamentData {
  const c = o.cell ?? 110;
  const lines = new Path();
  const b = newBag();
  const n = Math.ceil((o.w + o.h) / c) + 3;
  for (let i = -n; i <= n; i++) {
    // x+y = i*c  and  x-y = i*c
    lines.M(i * c, 0).L(i * c - o.h, o.h);
    lines.M(i * c, 0).L(i * c + o.h, o.h);
  }
  for (let i = -n; i <= n; i++) {
    for (let j = -n; j <= n; j++) {
      const x = ((i + j + 1) * c) / 2;
      const y = ((i - j) * c) / 2;
      if (x < -c || y < -c || x > o.w + c || y > o.h + c) continue;
      if ((i + j) % 2 === 0) phul(b, x, y, c * 0.62, (i - j) % 4 === 0 ? "red" : "indigo");
      else tarka(b, x, y, c * 0.5);
      // intersection diamond
      const ix = (i * c + j * c) / 2;
      const iy = (i * c - j * c) / 2;
      if (ix >= 0 && ix <= o.w && iy >= 0 && iy <= o.h) dia(b.gold, ix, iy, 4, 4);
    }
  }
  return assemble(bagParts(b, [{ path: lines, stroke: JD.indigo, strokeWidth: 1.2, opacity: o.lineOp ?? 0.55, lineCap: "butt" }]), 0, { w: o.w, h: o.h });
}

/** A saree-border style woven band ("paar"): zigzag teeth, nested diamond chain, hairlines. */
export function paar(o: { w: number; h?: number; tone?: "red" | "indigo" }): OrnamentData {
  const h = o.h ?? 100;
  const b = newBag();
  const lines = new Path();
  [10, 16, h - 16, h - 10].forEach((y) => {
    lines.M(0, y).L(o.w, y);
  });
  const step = 56;
  const cy = h / 2;
  const n = Math.floor(o.w / step);
  const x0 = (o.w - n * step) / 2;
  for (let i = 0; i <= n; i++) {
    const cx = x0 + i * step;
    // teeth along top and bottom rows
    const tw = step / 2;
    b.indigo.poly([[cx - tw / 2, 20], [cx + tw / 2, 20], [cx, 30]], true);
    b.indigo.poly([[cx - tw / 2, h - 20], [cx + tw / 2, h - 20], [cx, h - 30]], true);
    // diamond chain
    const main = (o.tone ?? "red") === "red" ? b.red : b.indigo;
    dia(main, cx, cy, 22, 22);
    dia(b.ivory, cx, cy, 14, 14);
    dia(b.gold, cx, cy, 8, 8);
    // connector dots
    if (i < n) {
      dia(b.indigo, cx + step / 2, cy, 5, 5);
      dia(b.gold, cx + step / 2, cy - 17, 2.6, 2.6);
      dia(b.gold, cx + step / 2, cy + 17, 2.6, 2.6);
    }
  }
  return assemble(bagParts(b, [{ path: lines, stroke: JD.gold, strokeWidth: 1.4, lineCap: "butt" }]), 0, { w: o.w, h });
}

/** Panel with chamfered corners and three nested woven-border outlines. */
export function chamferPanel(o: { w: number; h: number; cut?: number; fill?: string }): OrnamentData {
  const cut = o.cut ?? 56;
  const mk = (inset: number, k: number): Path => {
    const i = inset;
    const c = Math.max(8, cut - k);
    return new Path().poly(
      [
        [i + c, i], [o.w - i - c, i], [o.w - i, i + c], [o.w - i, o.h - i - c],
        [o.w - i - c, o.h - i], [i + c, o.h - i], [i, o.h - i - c], [i, i + c],
      ],
      true,
    );
  };
  const specs: PartSpec[] = [
    { path: mk(3, 0), fill: o.fill ?? JD.ivory, stroke: JD.red, strokeWidth: 4, lineJoin: "miter" },
    { path: mk(14, 8), stroke: JD.gold, strokeWidth: 1.6, lineJoin: "miter" },
    { path: mk(22, 14), stroke: JD.indigo, strokeWidth: 1, lineJoin: "miter" },
  ];
  const corners = newBag();
  [[0, 0], [1, 0], [0, 1], [1, 1]].forEach(([fx, fy]) => {
    const cx = fx ? o.w - 3 - cut * 0.34 : 3 + cut * 0.34;
    const cy = fy ? o.h - 3 - cut * 0.34 : 3 + cut * 0.34;
    dia(corners.gold, cx, cy, 7, 7);
    dia(corners.red, cx, cy, 3.6, 3.6);
  });
  specs.push(...bagParts(corners));
  return assemble(specs, 0, { w: o.w, h: o.h });
}

/** Three phul booti joined by a woven thread: a small centrepiece for covers. 360 x 130. */
export function kalkaPair(o: { size?: number }): OrnamentData {
  const k = (o.size ?? 150) / 150;
  const b = newBag();
  const cy = 65 * k;
  const line = new Path().M(10 * k, cy).L(350 * k, cy);
  phul(b, 180 * k, cy, 62 * k, "red");
  phul(b, 62 * k, cy, 38 * k, "indigo");
  phul(b, 298 * k, cy, 38 * k, "indigo");
  [22, 338].forEach((x) => dia(b.gold, x * k, cy, 5 * k, 5 * k));
  [112, 248].forEach((x) => dia(b.gold, x * k, cy, 4 * k, 4 * k));
  return assemble(bagParts(b, [{ path: line, stroke: JD.gold, strokeWidth: 1, opacity: 0.8, lineCap: "butt" }]), 0, { w: 360 * k, h: 130 * k });
}

/** A single phul booti as a standalone ornament (for bullets and dividers). */
export function bootiSolo(o: { size?: number; tone?: "red" | "indigo" }): OrnamentData {
  const s = o.size ?? 100;
  const b = newBag();
  phul(b, s / 2, s / 2, s * 0.5, o.tone ?? "red");
  return assemble(bagParts(b), 0, { w: s, h: s });
}

/** Horizontal chain of small diamonds, a quiet divider. */
export function diamondChain(o: { w: number }): OrnamentData {
  const b = newBag();
  const n = Math.floor(o.w / 34);
  const x0 = (o.w - (n - 1) * 34) / 2;
  const line = new Path().M(0, 12).L(o.w, 12);
  for (let i = 0; i < n; i++) {
    const mid = i === Math.floor(n / 2);
    dia(mid ? b.red : b.gold, x0 + i * 34, 12, mid ? 10 : 5, mid ? 10 : 5);
  }
  return assemble(bagParts(b, [{ path: line, stroke: JD.gold, strokeWidth: 0.9, opacity: 0.6, lineCap: "butt" }]), 0, { w: o.w, h: 24 });
}

/** Fine woven-cloth texture: crossing hairlines. */
export function weave(o: { w: number; h: number; color: string; step?: number }): OrnamentData {
  const step = o.step ?? 7;
  const hz = new Path();
  const vt = new Path();
  for (let y = 0; y <= o.h; y += step) hz.M(0, y).L(o.w, y);
  for (let x = 0; x <= o.w; x += step * 1.4) vt.M(x, 0).L(x, o.h);
  return assemble(
    [
      { path: hz, stroke: o.color, strokeWidth: 0.7, lineCap: "butt" },
      { path: vt, stroke: o.color, strokeWidth: 0.5, opacity: 0.6, lineCap: "butt" },
    ],
    0,
    { w: o.w, h: o.h },
  );
}
