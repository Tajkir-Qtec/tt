import { assemble, Path, type OrnamentData, type PartSpec } from "../design/path";

/** Thread colours (code -> [main, highlight tint]). */
export type Code = "m" | "s" | "g" | "b" | "y" | "w";
export const THREAD: Record<Code, string> = {
  m: "#e0267a", // magenta
  s: "#f5a623", // saffron
  g: "#5fb83f", // parrot green
  b: "#2f62d6", // royal blue
  y: "#f1cd6c", // gold
  w: "#fff1d6", // ivory
};
const DEEP: Record<Code, string> = {
  m: "#a3125a",
  s: "#c5710f",
  g: "#2f7f27",
  b: "#1b3d9c",
  y: "#b8892f",
  w: "#d9bf93",
};

type Grid = (Code | null)[][];

/**
 * Turn a cell grid into darning stitches: each row is split into runs of one colour, each run into short
 * parallel stitches (<= maxLen cells) with a small gap, drawn as round-capped thick lines with a thin highlight.
 */
function stitch(grid: Grid, cw: number, ch: number, maxLen = 3, thick = 0.8): PartSpec[] {
  const main = new Map<Code, Path>();
  const hi = new Map<Code, Path>();
  const lo = new Map<Code, Path>();
  const sw = ch * thick;
  const gap = 2.4;
  const add = (m: Map<Code, Path>, c: Code) => {
    if (!m.has(c)) m.set(c, new Path());
    return m.get(c)!;
  };
  grid.forEach((row, y) => {
    let x = 0;
    const cy = y * ch + ch / 2;
    while (x < row.length) {
      const c = row[x];
      if (!c) {
        x++;
        continue;
      }
      let x1 = x;
      while (x1 < row.length && row[x1] === c) x1++;
      // run [x, x1): split into stitches
      const n = x1 - x;
      const parts = Math.max(1, Math.ceil(n / maxLen));
      const each = n / parts;
      for (let i = 0; i < parts; i++) {
        const a = (x + i * each) * cw + sw / 2 + (i === 0 ? 0 : gap / 2);
        const b = (x + (i + 1) * each) * cw - sw / 2 - (i === parts - 1 ? 0 : gap / 2);
        const bb = Math.max(a + 0.5, b);
        add(lo, c).M(a, cy + sw * 0.16).L(bb, cy + sw * 0.16);
        add(main, c).M(a, cy).L(bb, cy);
        add(hi, c).M(a + 1, cy - sw * 0.24).L(bb - 1, cy - sw * 0.24);
      }
      x = x1;
    }
  });
  const specs: PartSpec[] = [];
  for (const [c, p] of lo) specs.push({ path: p, stroke: DEEP[c], strokeWidth: sw + 0.9, lineCap: "round" });
  for (const [c, p] of main) specs.push({ path: p, stroke: THREAD[c], strokeWidth: sw, lineCap: "round" });
  for (const [c, p] of hi) specs.push({ path: p, stroke: "#ffffff", strokeWidth: sw * 0.2, lineCap: "round", opacity: 0.28 });
  return specs;
}

const blank = (cols: number, rows: number): Grid => Array.from({ length: rows }, () => Array<Code | null>(cols).fill(null));

/**
 * A full-width phulkari border band: stepped zigzag edges, nested-colour diamonds with small blue
 * jewel-diamonds between them. Cells are cw x ch; 100 cols x 17 rows -> 1000 x 136.
 */
export function phulkariBand(cols = 100, cw = 10, ch = 8): OrnamentData {
  const rows = 17;
  const g = blank(cols, rows);
  const period = 20;
  const cy = 8;
  for (let x = 0; x < cols; x++) {
    // zigzag edges (top rows 0-1, bottom rows 15-16)
    const t = x % 10 < 5 ? x % 10 : 10 - (x % 10);
    const r = t >= 3 ? 1 : 0;
    g[r][x] = "y";
    g[rows - 1 - r][x] = "y";
    const px = x % period;
    const dx = Math.min(px, period - px);
    for (let y = 2; y <= 14; y++) {
      const dy = Math.abs(y - cy);
      const d = Math.abs(px - 10) + dy;
      if (d <= 6) {
        g[y][x] = (["w", "s", "s", "m", "m", "g", "y"] as Code[])[d];
        if (d === 3) g[y][x] = "m";
        if (d === 5) g[y][x] = "g";
      } else {
        const ds = dx + dy;
        // small jewel diamond between big ones (centre at px===0 => dx===0)
        const sd = Math.abs(px) + dy;
        const sd2 = Math.abs(px - period) + dy;
        const q = Math.min(sd, sd2);
        void ds;
        if (q <= 2) g[y][x] = (["m", "y", "b"] as Code[])[q];
      }
    }
  }
  // symmetrical flourishes: tiny saffron dots in the corner gaps
  for (let x = 0; x < cols; x++) {
    const px = x % period;
    if (px === 6 || px === 14) {
      g[3][x] = g[3][x] ?? "s";
      g[13][x] = g[13][x] ?? "s";
    }
  }
  const w = cols * cw;
  const h = rows * ch;
  return assemble(stitch(g, cw, ch), 0, { w, h });
}

/** A narrow stitched diamond-chain divider (5 rows tall). */
export function phulkariDivider(cols = 41, cw = 9, ch = 7): OrnamentData {
  const rows = 7;
  const g = blank(cols, rows);
  const c = (cols - 1) / 2;
  const cr = 3;
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      const px = (x - c) ;
      // centre big diamond
      const d = Math.abs(px) + Math.abs(y - cr);
      if (d <= 3) g[y][x] = (["w", "m", "s", "y"] as Code[])[d];
      // chain of small diamonds either side
      else if (Math.abs(px) > 5) {
        const k = (Math.abs(px) - 6) % 6;
        const dd = Math.abs(k - 1) + Math.abs(y - cr);
        if (dd <= 1) g[y][x] = dd === 0 ? "m" : "g";
        else if (y === cr && Math.abs(px) > 5 && dd <= 2) g[y][x] = "y";
      }
    }
  }
  return assemble(stitch(g, cw, ch, 2), 0, { w: cols * cw, h: rows * ch });
}

/**
 * Round phulkari medallion / halo. rOut / rIn in px (rIn = 0 gives a full medallion).
 * Colour bands follow an 8-pointed star contour, giving the classic rosette.
 */
export function phulkariMedallion(rOut: number, rIn = 0, cell = 7): OrnamentData {
  const pad = Math.ceil(rOut * 0.26) + 28;
  const size = Math.ceil((rOut + pad) * 2);
  const cols = Math.ceil(size / cell);
  const rows = cols;
  const g = blank(cols, rows);
  const cx = cols / 2;
  const cyy = rows / 2;
  const R = rOut / cell;
  const Ri = rIn / cell;
  const profile = (f: number): Code | null => {
    // f: 0 (inner) -> 1 (outer)
    const bands: [number, Code | null][] = [
      [0.1, "y"],
      [0.2, "m"],
      [0.3, "w"],
      [0.42, "g"],
      [0.5, "s"],
      [0.62, "m"],
      [0.72, "b"],
      [0.82, "y"],
      [0.9, "m"],
      [1.01, "s"],
    ];
    for (const [lim, c] of bands) if (f < lim) return c;
    return null;
  };
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const dx = x + 0.5 - cx;
      const dy = y + 0.5 - cyy;
      const r = Math.hypot(dx, dy);
      const th = Math.atan2(dy, dx);
      // star-shaped contour: petals reach out along 8 directions
      const mod = 1 + 0.2 * Math.cos(8 * th) ** 3 + 0.04 * Math.cos(8 * th);
      const s = r / mod;
      if (s > R || (Ri > 0 && r < Ri)) continue;
      const f = Math.max(0, (s - Ri) / (R - Ri || 1));
      let c = profile(f);
      // dotted accent in the white band (alternate cells)
      if (c === "w" && (x + y) % 2 === 0) c = "m";
      g[y][x] = c;
    }
  }
  if (rIn === 0) {
    // little centre flower
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      const d = Math.abs(x + 0.5 - cx) + Math.abs(y + 0.5 - cyy);
      if (d < 2.4) g[y][x] = d < 1.2 ? "w" : "m";
    }
  }
  const specs = stitch(g, cell, cell, 3, 0.78);
  const c0 = (cols * cell) / 2;
  // gold outline + pearls
  const ring = new Path().circle(c0, c0, rOut * 1.2 + 6);
  specs.push({ path: ring, stroke: "#e8c15a", strokeWidth: 1.6 });
  const pearls = new Path();
  const N = 64;
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    pearls.circle(c0 + Math.cos(a) * (rOut * 1.2 + 15), c0 + Math.sin(a) * (rOut * 1.2 + 15), 2.6);
  }
  specs.push({ path: pearls, fill: "#f1cd6c" });
  return assemble(specs, 0, { w: cols * cell, h: cols * cell });
}
