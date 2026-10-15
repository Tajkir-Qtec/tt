import { assemble, leaf, Path, petal, rad, type OrnamentData, type PartSpec } from "../design/path";
import type { Paint } from "../design/types";

export const BRASS: Paint = { kind: "linear", angle: 90, stops: [[0, "#f6dc92"], [0.35, "#d4a443"], [0.7, "#9c6f22"], [1, "#e8c36a"]] };
export const BRASS_D: Paint = { kind: "linear", angle: 90, stops: [[0, "#8a5f1c"], [0.5, "#c28e32"], [1, "#6f4812"]] };
const RICE: Paint = { kind: "radial", stops: [[0, "#ffffff"], [0.7, "#fff6e0"], [1, "#efdcb4"]] };

function ell(p: Path, cx: number, cy: number, rx: number, ry: number) {
  p.M(cx - rx, cy).A(rx, ry, 0, 1, 0, cx + rx, cy).A(rx, ry, 0, 1, 0, cx - rx, cy).Z();
  p.include([cx, cy - ry], [cx, cy + ry]);
  return p;
}

function scene(specs: PartSpec[], w: number, h: number): OrnamentData {
  return assemble(specs, 0, { w, h, dx: 0, dy: 0 });
}

/** Brass thala with a bowl of rice, sweets and flowers. Local box 640 x 330, plate centre (320, 230). */
export function thalaScene(): OrnamentData {
  const cx = 320;
  const cy = 232;
  const R = 300;
  const ry = 70;
  const s: PartSpec[] = [];
  s.push({ path: ell(new Path(), cx, cy + 40, R * 0.96, ry * 0.9), fill: "#7a5416", opacity: 0.18 });
  s.push({ path: ell(new Path(), cx, cy + 16, R, ry), fill: BRASS_D });
  s.push({ path: ell(new Path(), cx, cy, R, ry), fill: BRASS, stroke: "#8a5f1c", strokeWidth: 2 });
  s.push({ path: ell(new Path(), cx, cy + 2, R * 0.84, ry * 0.8), fill: { kind: "radial", stops: [[0, "#f3d48a"], [1, "#c99534"]] }, stroke: "#8a5f1c", strokeWidth: 1.4 });
  const dots = new Path();
  for (let i = 0; i < 46; i++) {
    const a = (i / 46) * Math.PI * 2;
    dots.circle(cx + Math.cos(a) * R * 0.92, cy + Math.sin(a) * ry * 0.9, 2.2);
  }
  s.push({ path: dots, fill: "#fff0bd", opacity: 0.85 });
  s.push({ path: ell(new Path(), cx, cy + 2, R * 0.66, ry * 0.62), stroke: "#8a5f1c", strokeWidth: 1, opacity: 0.6 });
  // bowl (bati)
  const bw = 112;
  const top = cy - 66;
  const body = new Path().M(cx - bw, top).C(cx - bw, top + 62, cx - 62, top + 92, cx - 52, top + 98).L(cx + 52, top + 98).C(cx + 62, top + 92, cx + bw, top + 62, cx + bw, top).Z();
  s.push({ path: body, fill: BRASS, stroke: "#8a5f1c", strokeWidth: 2 });
  s.push({ path: new Path().M(cx - bw + 14, top + 22).C(cx - bw + 20, top + 60, cx - 66, top + 82, cx - 56, top + 90), stroke: "#fff3c4", strokeWidth: 4, opacity: 0.6 });
  s.push({ path: ell(new Path(), cx, top, bw, 24), fill: BRASS_D, stroke: "#8a5f1c", strokeWidth: 2 });
  const mound = new Path().M(cx - bw + 10, top - 2).C(cx - bw + 18, top - 64, cx - 40, top - 88, cx, top - 90).C(cx + 40, top - 88, cx + bw - 18, top - 64, cx + bw - 10, top - 2).C(cx + 60, top + 14, cx - 60, top + 14, cx - bw + 10, top - 2).Z();
  s.push({ path: mound, fill: RICE, stroke: "#d7c08a", strokeWidth: 1.2 });
  const grains = new Path();
  for (let i = 0; i < 46; i++) {
    const a = i * 2.399;
    const rr = 12 + ((i * 37) % 70);
    const gx = cx + Math.cos(a) * rr * 1.1;
    const gy = top - 36 + Math.sin(a) * rr * 0.5;
    grains.M(gx - 4, gy).L(gx + 4, gy - 2);
  }
  s.push({ path: grains, stroke: "#cbb27a", strokeWidth: 1.6, opacity: 0.8 });
  // small dhan-durba blessing sprig on the rice
  const sp = new Path();
  for (let i = 0; i < 5; i++) leaf(sp, [cx + 8, top - 82], rad(-110 + i * 22), 46, 8);
  s.push({ path: sp, fill: "#7fae5a", stroke: "#4f7f35", strokeWidth: 1 });
  // sweets, left
  const sweet = (x: number, y: number, r: number, c0: string, c1: string) => {
    s.push({ path: ell(new Path(), x, y + r * 0.9, r * 0.9, r * 0.28), fill: "#5b3a0a", opacity: 0.22 });
    s.push({ path: new Path().circle(x, y, r), fill: { kind: "radial", stops: [[0, c0], [1, c1]] }, stroke: c1, strokeWidth: 1 });
    s.push({ path: new Path().M(x - r * 0.5, y - r * 0.4).C(x - r * 0.2, y - r * 0.7, x + r * 0.2, y - r * 0.7, x + r * 0.45, y - r * 0.45), stroke: "#ffffff", strokeWidth: 2.4, opacity: 0.55 });
  };
  sweet(cx - 215, cy - 6, 30, "#fff6e8", "#e9c9a0");
  sweet(cx - 172, cy + 12, 28, "#ffd3d9", "#e58a98");
  sweet(cx - 244, cy + 14, 26, "#ffe6a6", "#d9a03a");
  sweet(cx - 200, cy + 24, 24, "#fff6e8", "#e9c9a0");
  // marigolds, right
  const bloom = (x: number, y: number, r: number, c: string, c2: string) => {
    const p = new Path();
    for (let i = 0; i < 12; i++) petal(p, x, y, rad(i * 30), r * 0.2, r, r * 0.2, false);
    s.push({ path: p, fill: c, stroke: c2, strokeWidth: 0.8 });
    s.push({ path: new Path().circle(x, y, r * 0.22), fill: c2 });
  };
  const lv = new Path();
  leaf(lv, [cx + 190, cy + 4], rad(-30), 70, 14);
  leaf(lv, [cx + 190, cy + 4], rad(-150), 64, 13);
  leaf(lv, [cx + 238, cy + 12], rad(-18), 58, 12);
  s.push({ path: lv, fill: "#7fae5a", stroke: "#4f7f35", strokeWidth: 1 });
  bloom(cx + 196, cy - 4, 34, "#ffb82e", "#e57d12");
  bloom(cx + 244, cy + 8, 28, "#ffd25e", "#e89a1c");
  bloom(cx + 218, cy + 26, 24, "#ff9d2e", "#d96a12");
  // spoon resting at front
  const spoon = new Path().M(cx + 70, cy + 40).L(cx + 150, cy + 24);
  s.push({ path: spoon, stroke: "#8a5f1c", strokeWidth: 9, opacity: 0.9 });
  s.push({ path: spoon, stroke: "#f2cf7a", strokeWidth: 4 });
  s.push({ path: ell(new Path(), cx + 56, cy + 42, 20, 12), fill: BRASS, stroke: "#8a5f1c", strokeWidth: 1.6 });
  return scene(s, 640, 330);
}

/** Drooping rice stalk (dhaner shish). Box 130 x h. */
export function riceStalk(h: number, flip = false): OrnamentData {
  const w = 130;
  const s: PartSpec[] = [];
  const pt = (t: number): [number, number] => {
    const u = 1 - t;
    return [u * u * 40 + 2 * u * t * 38 + t * t * 100, u * u * h + 2 * u * t * (h * 0.3) + t * t * 26];
  };
  const stem = new Path().M(...pt(0));
  for (let i = 1; i <= 24; i++) stem.L(...pt(i / 24));
  s.push({ path: stem, stroke: "#b89a4a", strokeWidth: 4 });
  const lv = new Path();
  leaf(lv, pt(0.1), rad(-70), h * 0.5, 9, false);
  leaf(lv, pt(0.28), rad(-120), h * 0.38, 7, false);
  s.push({ path: lv, fill: "#a8bf6a", opacity: 0.9 });
  const gr = new Path();
  for (let i = 0; i < 12; i++) {
    const t = 0.56 + i * 0.037;
    const p = pt(t);
    leaf(gr, p, rad(-30 + (i % 2 ? 40 : -10) + 60), 28, 6, true);
    leaf(gr, p, rad(150 - (i % 2 ? 0 : 20)), 26, 6, true);
  }
  s.push({ path: gr, fill: "#e9c866", stroke: "#b8923a", strokeWidth: 0.9 });
  const d = scene(s, w, h);
  return flip ? { ...d, parts: d.parts } : d;
}

/** Pastel bunting across the top, page space. */
export function bunting(y0: number, sag: number, colors: string[], n = 9, x0 = -20, x1 = 1020): OrnamentData {
  const s: PartSpec[] = [];
  const pt = (t: number): [number, number] => [x0 + (x1 - x0) * t, y0 + 4 * sag * t * (1 - t)];
  const str = new Path().M(...pt(0));
  for (let i = 1; i <= 40; i++) str.L(...pt(i / 40));
  s.push({ path: str, stroke: "#b88a3e", strokeWidth: 2.4 });
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n;
    const [x, y] = pt(t);
    const slope = (4 * sag * (1 - 2 * t)) / (x1 - x0);
    const a = Math.atan(slope);
    const hw = ((x1 - x0) / n) * 0.36;
    const dx = Math.cos(a) * hw;
    const dy = Math.sin(a) * hw;
    const tri = new Path().poly([[x - dx, y - dy], [x + dx, y + dy], [x - Math.sin(a) * 0 + 0, y + 78 + Math.abs(dy) * 0.2]], true);
    s.push({ path: tri, fill: colors[i % colors.length], stroke: "#ffffff", strokeWidth: 1.4, opacity: 0.96 });
    s.push({ path: new Path().poly([[x - dx * 0.55, y - dy * 0.55 + 10], [x + dx * 0.55, y + dy * 0.55 + 10], [x, y + 48]], true), stroke: "#ffffff", strokeWidth: 1.2, opacity: 0.55 });
    s.push({ path: new Path().circle(x, y + 40, 3.2), fill: "#ffffff", opacity: 0.8 });
  }
  return scene(s, 1000, y0 + sag + 100);
}

/** Alpona-style ring of teardrops and dots, centred in a square box. */
export function alponaRing(size: number, color: string, accent: string): OrnamentData {
  const c = size / 2;
  const R = c - 14;
  const s: PartSpec[] = [];
  const pet = new Path();
  const n = 24;
  for (let i = 0; i < n; i++) petal(pet, c, c, rad((i * 360) / n), R * 0.82, R, 9, true);
  s.push({ path: pet, stroke: color, strokeWidth: 1.8 });
  s.push({ path: new Path().circle(c, c, R * 0.8), stroke: color, strokeWidth: 1.4 });
  s.push({ path: new Path().circle(c, c, R * 0.74), stroke: color, strokeWidth: 0.8, opacity: 0.7 });
  const dots = new Path();
  for (let i = 0; i < n; i++) dots.circle(c + Math.cos(rad((i + 0.5) * (360 / n))) * R * 0.9, c + Math.sin(rad((i + 0.5) * (360 / n))) * R * 0.9, 3);
  s.push({ path: dots, fill: accent });
  return scene(s, size, size);
}
