import { assemble, Path, type OrnamentData, type PartSpec } from "../design/path";

export const WAX = {
  ochre: "#e2a21a",
  indigo: "#1c2962",
  terra: "#c4502c",
  forest: "#1f5b3f",
  cream: "#f8edd6",
  ink: "#17130f",
};

type PathMap = Record<string, Path>;
const bag = (): PathMap => ({});
const P = (m: PathMap, k: string) => (m[k] ??= new Path());

function finish(m: PathMap, ground: string, w: number, h: number): OrnamentData {
  const g = new Path().poly([[0, 0], [w, 0], [w, h], [0, h]], true);
  const specs: PartSpec[] = [{ path: g, fill: ground }];
  for (const [color, path] of Object.entries(m)) {
    path.include([0, 0], [w, h]);
    specs.push({ path, fill: color });
  }
  return assemble(specs, 0, { w, h });
}

/** Bullseye medallions (concentric rings) separated by diamonds and dots. */
export function waxCircles(w: number, h: number, ground = WAX.indigo): OrnamentData {
  const m = bag();
  const n = Math.max(1, Math.round(w / (h * 1.0)));
  const step = w / n;
  const rs: [number, string][] = [
    [0.47, WAX.ochre],
    [0.39, WAX.terra],
    [0.31, WAX.cream],
    [0.22, WAX.forest],
    [0.12, WAX.ochre],
    [0.05, WAX.indigo],
  ];
  for (let i = 0; i < n; i++) {
    const cx = step * (i + 0.5);
    const cy = h / 2;
    rs.forEach(([r, c]) => {
      const flip = i % 2 === 1;
      const col = flip ? (c === WAX.terra ? WAX.forest : c === WAX.forest ? WAX.terra : c) : c;
      P(m, col).circle(cx, cy, r * h);
    });
    // diamond between cells
    const dx = cx + step / 2;
    const d = h * 0.15;
    P(m, WAX.cream).poly([[dx, cy - d], [dx + d * 0.8, cy], [dx, cy + d], [dx - d * 0.8, cy]], true);
    P(m, WAX.terra).poly([[dx, cy - d * 0.5], [dx + d * 0.4, cy], [dx, cy + d * 0.5], [dx - d * 0.4, cy]], true);
    P(m, WAX.ochre).circle(dx, h * 0.1, h * 0.035);
    P(m, WAX.ochre).circle(dx, h * 0.9, h * 0.035);
    P(m, WAX.ochre).circle(cx, h * 0.035, h * 0.02);
  }
  return finish(m, ground, w, h);
}

/** Bold chevron stripes. */
export function waxZigzag(w: number, h: number, ground = WAX.cream): OrnamentData {
  const m = bag();
  const per = h * 1.1;
  const n = Math.round(w / per);
  const pw = w / n;
  const lanes: [number, string][] = [
    [0.0, WAX.terra],
    [0.34, WAX.indigo],
    [0.68, WAX.forest],
  ];
  const lh = h * 0.2;
  lanes.forEach(([off, color]) => {
    const p = P(m, color);
    const amp = h * 0.16;
    const y0 = h * 0.13 + off * h * 0.6;
    // upper edge
    const top: [number, number][] = [];
    const bot: [number, number][] = [];
    for (let i = 0; i <= n * 2; i++) {
      const x = (pw / 2) * i;
      const y = y0 + (i % 2 === 0 ? 0 : amp);
      top.push([x, y]);
      bot.push([x, y + lh]);
    }
    p.poly([...top, ...bot.reverse()], true);
  });
  // cream dots in the valleys
  for (let i = 0; i < n; i++) P(m, WAX.ochre).circle(pw * (i + 0.5), h * 0.93, h * 0.045);
  return finish(m, ground, w, h);
}

/** Overlapping fan / scale pattern. */
export function waxFans(w: number, h: number, ground = WAX.ochre): OrnamentData {
  const m = bag();
  const R = h * 0.62;
  const stepX = R * 1.3;
  const n = Math.ceil(w / stepX) + 1;
  const rows = 2;
  const rings: [number, string][] = [
    [1, WAX.indigo],
    [0.78, WAX.cream],
    [0.58, WAX.terra],
    [0.38, WAX.forest],
    [0.18, WAX.ochre],
  ];
  for (let r = rows - 1; r >= 0; r--) {
    const baseY = h * (0.52 + r * 0.5);
    const off = r % 2 ? stepX / 2 : 0;
    for (let i = -1; i < n; i++) {
      const cx = i * stepX + off;
      rings.forEach(([k, c]) => {
        const rr = R * k;
        P(m, c).M(cx - rr, baseY).A(rr, rr, 0, 0, 1, cx + rr, baseY).Z();
      });
    }
  }
  return finish(m, ground, w, h);
}

/** Row of nested diamonds with edge triangles. */
export function waxDiamonds(w: number, h: number, ground = WAX.forest): OrnamentData {
  const m = bag();
  const dw = h * 0.95;
  const n = Math.max(1, Math.round(w / dw));
  const step = w / n;
  const cy = h / 2;
  for (let i = 0; i < n; i++) {
    const cx = step * (i + 0.5);
    const rx = step * 0.46;
    const ry = h * 0.46;
    P(m, WAX.ochre).poly([[cx, cy - ry], [cx + rx, cy], [cx, cy + ry], [cx - rx, cy]], true);
    P(m, WAX.indigo).poly([[cx, cy - ry * 0.7], [cx + rx * 0.7, cy], [cx, cy + ry * 0.7], [cx - rx * 0.7, cy]], true);
    P(m, WAX.cream).poly([[cx, cy - ry * 0.4], [cx + rx * 0.4, cy], [cx, cy + ry * 0.4], [cx - rx * 0.4, cy]], true);
    P(m, WAX.terra).circle(cx, cy, ry * 0.14);
    // triangles between diamonds, top and bottom
    const tx = cx + step / 2;
    const t = h * 0.22;
    P(m, WAX.terra).poly([[tx - t, 0], [tx + t, 0], [tx, t * 1.3]], true);
    P(m, WAX.terra).poly([[tx - t, h], [tx + t, h], [tx, h - t * 1.3]], true);
    P(m, WAX.cream).circle(tx, cy, h * 0.05);
  }
  return finish(m, ground, w, h);
}

/** Slim border of alternating blocks. */
export function waxBlocks(w: number, h: number, ground = WAX.ink): OrnamentData {
  const m = bag();
  const n = Math.round(w / (h * 1.4));
  const step = w / n;
  const cols = [WAX.ochre, WAX.terra, WAX.cream, WAX.forest];
  for (let i = 0; i < n; i++) {
    const x = i * step;
    P(m, cols[i % cols.length]).poly([[x + h * 0.15, h * 0.2], [x + step - h * 0.15, h * 0.2], [x + step - h * 0.15, h * 0.8], [x + h * 0.15, h * 0.8]], true);
  }
  return finish(m, ground, w, h);
}

/** Concentric ring frame (for a round photo). Inner hole is transparent-friendly (rings are strokes). */
export function waxRing(size: number): OrnamentData {
  const c = size / 2;
  const specs: PartSpec[] = [];
  const ring = (r: number, color: string, sw: number) => specs.push({ path: new Path().circle(c, c, r), stroke: color, strokeWidth: sw });
  ring(size * 0.492, WAX.indigo, size * 0.016);
  ring(size * 0.47, WAX.ochre, size * 0.03);
  ring(size * 0.44, WAX.terra, size * 0.016);
  ring(size * 0.42, WAX.cream, size * 0.02);
  ring(size * 0.395, WAX.forest, size * 0.03);
  // beads between the ochre and forest rings
  const beads = new Path();
  const nb = 36;
  for (let i = 0; i < nb; i++) {
    const a = (i * 2 * Math.PI) / nb;
    beads.circle(c + Math.cos(a) * size * 0.43, c + Math.sin(a) * size * 0.43, size * 0.0065);
  }
  specs.push({ path: beads, fill: WAX.indigo });
  specs.forEach((s) => s.path.include([0, 0], [size, size]));
  return assemble(specs, 0, { w: size, h: size });
}
