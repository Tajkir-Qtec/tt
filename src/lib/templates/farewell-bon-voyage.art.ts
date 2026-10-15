import { Path, type PartSpec, type Pt } from "../design/path";
import type { Layer } from "../design/types";
import { O, S, linear } from "./kit";
import { pg } from "./valentines-dinner-rose.art";

export const PAPER = "#f4e8d0";
export const NAVY = "#1f3a6e";
export const RED = "#c4382f";
export const BROWN = "#6b4a2b";

/** Local-frame transform with rotation: (x,y) -> page. */
class Tx {
  constructor(public cx: number, public cy: number, public s: number, public a: number) {}
  pt(x: number, y: number): Pt {
    const c = Math.cos(this.a);
    const sn = Math.sin(this.a);
    return [this.cx + this.s * (c * x - sn * y), this.cy + this.s * (sn * x + c * y)];
  }
  M(p: Path, x: number, y: number) { const q = this.pt(x, y); p.M(q[0], q[1]); return this; }
  L(p: Path, x: number, y: number) { const q = this.pt(x, y); p.L(q[0], q[1]); return this; }
  C(p: Path, a: number, b: number, c: number, d: number, e: number, f: number) {
    const q1 = this.pt(a, b), q2 = this.pt(c, d), q3 = this.pt(e, f);
    p.C(q1[0], q1[1], q2[0], q2[1], q3[0], q3[1]);
    return this;
  }
}

/** Vintage propeller plane seen from above, nose pointing along `ang` (radians). Length about 250*s. */
export function plane(cx: number, cy: number, s: number, ang: number): PartSpec[] {
  const t = new Tx(cx, cy, s, ang);
  const wing = (m: number) => {
    const p = new Path();
    t.M(p, 36, m * 10).L(p, 6, m * 122).L(p, -34, m * 122).L(p, -28, m * 10);
    p.Z();
    return p;
  };
  const tail = (m: number) => {
    const p = new Path();
    t.M(p, -92, m * 4).L(p, -112, m * 48).L(p, -130, m * 48).L(p, -124, m * 4);
    p.Z();
    return p;
  };
  const body = new Path();
  t.M(body, 124, 0).C(body, 112, -16, 60, -18, -80, -9).L(body, -134, -3).L(body, -134, 3).L(body, -80, 9).C(body, 60, 18, 112, 16, 124, 0);
  body.Z();
  const stripe = new Path();
  t.M(stripe, 20, -17).L(stripe, 6, 17);
  const stripe2 = new Path();
  t.M(stripe2, -34, -12).L(stripe2, -44, 12);
  const prop = new Path();
  t.M(prop, 130, -46).L(prop, 130, 46);
  const hub = new Path();
  const h = t.pt(126, 0);
  hub.circle(h[0], h[1], 7 * s);
  const cockpit = new Path();
  t.M(cockpit, 70, -8).C(cockpit, 62, -12, 40, -12, 34, 0).C(cockpit, 40, 12, 62, 12, 70, 8).C(cockpit, 74, 4, 74, -4, 70, -8);
  cockpit.Z();
  const sh = new Path();
  const q = t.pt(0, 0);
  sh.circle(q[0] + 10, q[1] + 16, 62 * s);
  return [
    { path: sh, fill: "rgba(60,40,10,0.08)" },
    { path: wing(-1), fill: linear(0, [0, "#2c4f90"], [1, NAVY]), stroke: "#13264d", strokeWidth: 2 },
    { path: wing(1), fill: linear(0, [0, "#2c4f90"], [1, NAVY]), stroke: "#13264d", strokeWidth: 2 },
    { path: tail(-1), fill: NAVY, stroke: "#13264d", strokeWidth: 2 },
    { path: tail(1), fill: NAVY, stroke: "#13264d", strokeWidth: 2 },
    { path: body, fill: linear(0, [0, "#fff7e6"], [1, "#e6d5ae"]), stroke: "#13264d", strokeWidth: 2.5 },
    { path: stripe, stroke: RED, strokeWidth: 9 * s },
    { path: stripe2, stroke: RED, strokeWidth: 6 * s },
    { path: cockpit, fill: "#8fc3df", stroke: "#13264d", strokeWidth: 1.8 },
    { path: prop, stroke: "rgba(31,58,110,0.45)", strokeWidth: 10 * s },
    { path: hub, fill: "#c8963e" },
  ];
}

/** Dashed quadratic trail, drawn as separate segments. */
export function dashedTrail(a: Pt, c: Pt, b: Pt, n = 36, color = NAVY): PartSpec {
  const p = new Path();
  const at = (t: number): Pt => [(1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0], (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]];
  for (let i = 0; i < n; i += 2) {
    const p0 = at(i / n);
    const p1 = at((i + 1) / n);
    p.M(p0[0], p0[1]).L(p1[0], p1[1]);
  }
  return { path: p, stroke: color, strokeWidth: 4, lineCap: "round", opacity: 0.8 };
}

/** Red/white/blue airmail striped border band around the page. */
export function airmail(inset = 22, bw = 26): PartSpec[] {
  const red = new Path();
  const blue = new Path();
  const step = 48;
  const pick = (i: number) => (i % 2 ? blue : red);
  const sl = bw * 0.9;
  const x0 = inset;
  const x1 = 1000 - inset;
  const y0 = inset;
  const y1 = 1400 - inset;
  let i = 0;
  for (let x = x0; x < x1 - 40; x += step, i++) {
    pick(i).poly([[x, y0], [x + 30, y0], [x + 30 + sl * 0.0, y0 + bw], [x - sl * 0.0, y0 + bw]].map(([a, b]) => [a + (b - y0) * 0.7, b] as Pt), true);
    pick(i).poly([[x, y1 - bw], [x + 30, y1 - bw], [x + 30, y1], [x, y1]].map(([a, b]) => [a + (b - (y1 - bw)) * 0.7, b] as Pt), true);
  }
  for (let y = y0 + bw; y < y1 - bw - 40; y += step, i++) {
    pick(i).poly([[x0, y], [x0 + bw, y + bw * 0.7], [x0 + bw, y + bw * 0.7 + 30], [x0, y + 30]], true);
    pick(i).poly([[x1 - bw, y], [x1, y + bw * 0.7], [x1, y + bw * 0.7 + 30], [x1 - bw, y + 30]], true);
  }
  const frame = new Path();
  frame.poly([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], true);
  const frame2 = new Path();
  frame2.poly([[x0 + bw, y0 + bw], [x1 - bw, y0 + bw], [x1 - bw, y1 - bw], [x0 + bw, y1 - bw]], true);
  return [
    { path: frame, fill: "#fbf3e0", stroke: NAVY, strokeWidth: 2, lineJoin: "miter" },
    { path: red, fill: RED },
    { path: blue, fill: "#2c55a0" },
    { path: frame2, fill: PAPER, stroke: NAVY, strokeWidth: 2, lineJoin: "miter" },
  ];
}

export type StampKind = "circle" | "rect" | "oval" | "octagon";

/** Ink-style passport stamp outline. */
export function stamp(kind: StampKind, cx: number, cy: number, w: number, h: number, color: string): PartSpec[] {
  const out: PartSpec[] = [];
  const ring = (inset: number) => {
    const p = new Path();
    const x0 = cx - w / 2 + inset, x1 = cx + w / 2 - inset, y0 = cy - h / 2 + inset, y1 = cy + h / 2 - inset;
    if (kind === "circle" || kind === "oval") {
      const rx = (x1 - x0) / 2, ry = (y1 - y0) / 2;
      p.M(x0, cy).A(rx, ry, 0, 1, 0, x1, cy).A(rx, ry, 0, 1, 0, x0, cy).Z();
      p.include([cx, y0], [cx, y1]);
    } else if (kind === "octagon") {
      const c = Math.min(w, h) * 0.2;
      p.poly([[x0 + c, y0], [x1 - c, y0], [x1, y0 + c], [x1, y1 - c], [x1 - c, y1], [x0 + c, y1], [x0, y1 - c], [x0, y0 + c]], true);
    } else {
      const r = 14;
      p.M(x0 + r, y0).L(x1 - r, y0).Q(x1, y0, x1, y0 + r).L(x1, y1 - r).Q(x1, y1, x1 - r, y1).L(x0 + r, y1).Q(x0, y1, x0, y1 - r).L(x0, y0 + r).Q(x0, y0, x0 + r, y0).Z();
    }
    return p;
  };
  out.push({ path: ring(0), stroke: color, strokeWidth: 5, opacity: 0.88 });
  out.push({ path: ring(13), stroke: color, strokeWidth: 2, opacity: 0.88 });
  // ink wear: little paper-coloured nicks over the outline
  const nick = new Path();
  for (let i = 0; i < 9; i++) {
    const a = i * 2.4 + cx * 0.01;
    const rx = w / 2, ry = h / 2;
    const x = cx + Math.cos(a) * rx * 0.97;
    const y = cy + Math.sin(a) * ry * 0.97;
    nick.M(x - 7, y - 2).L(x + 7, y + 2);
  }
  out.push({ path: nick, stroke: PAPER, strokeWidth: 5, opacity: 0.9 });
  return out;
}

/** Leather vintage suitcase with straps, clasps and travel stickers. */
export function suitcase(x: number, y: number, w: number, h: number, base = "#a8652f", dark = "#6d3e1a", rot = 0, stickers = true): Layer[] {
  const cx = x + w / 2;
  const cy = y + h / 2;
  const rotate = <T extends Layer>(l: T): T => {
    if (!rot) return l;
    const a = (rot * Math.PI) / 180;
    const dx = l.x + l.width / 2 - cx;
    const dy = l.y + l.height / 2 - cy;
    const nx = cx + dx * Math.cos(a) - dy * Math.sin(a);
    const ny = cy + dx * Math.sin(a) + dy * Math.cos(a);
    return { ...l, x: nx - l.width / 2, y: ny - l.height / 2, rotation: l.rotation + rot, locked: true };
  };
  const out: Layer[] = [];
  const hw = w * 0.26;
  const handle = new Path();
  handle.M(0, 40).L(0, 14).Q(0, 0, 14, 0).L(hw * 2 - 14, 0).Q(hw * 2, 0, hw * 2, 14).L(hw * 2, 40);
  out.push(rotate(O({ vbW: hw * 2, vbH: 40, parts: [{ d: handle.toString(), fill: null, stroke: dark, strokeWidth: 11, lineCap: "round", lineJoin: "round" }] }, { x: cx - hw, y: y - 36, width: hw * 2, height: 40 })));
  out.push(rotate(S({ x, y, width: w, height: h, cornerRadius: 22, fill: linear(90, [0, base], [1, dark]), stroke: "#3d2108", strokeWidth: 3 })));
  out.push(rotate(S({ x: x + 14, y: y + 14, width: w - 28, height: h - 28, cornerRadius: 14, fill: null, stroke: "rgba(255,230,190,0.35)", strokeWidth: 2 })));
  for (const fx of [0.2, 0.8]) out.push(rotate(S({ x: x + w * fx - 11, y, width: 22, height: h, fill: "#5a3314", stroke: "#2c1707", strokeWidth: 2 })));
  for (const fx of [0.2, 0.8]) out.push(rotate(S({ x: x + w * fx - 8, y: y + h * 0.44, width: 16, height: 26, cornerRadius: 4, fill: "#e6c36a", stroke: "#8a6a2f", strokeWidth: 2 })));
  out.push(rotate(S({ x: cx - 15, y: y + h * 0.4, width: 30, height: 34, cornerRadius: 6, fill: "#e6c36a", stroke: "#8a6a2f", strokeWidth: 2 })));
  for (const [ex, ey] of [[x + 10, y + 10], [x + w - 34, y + 10], [x + 10, y + h - 34], [x + w - 34, y + h - 34]]) out.push(rotate(S({ x: ex, y: ey, width: 24, height: 24, cornerRadius: 6, fill: "#d9b14f", stroke: "#8a6a2f", strokeWidth: 2 })));
  if (stickers) {
    const sk: [number, number, number, number, string, "ellipse" | "rect"][] = [
      [0.33, 0.12, 52, 52, "#3f9aa6", "ellipse"],
      [0.5, 0.58, 66, 44, "#d8483c", "rect"],
      [0.62, 0.14, 48, 48, "#f0c14b", "ellipse"],
      [0.34, 0.62, 44, 44, "#6aa36b", "ellipse"],
    ];
    for (const [fx, fy, sw, sh, col, shape] of sk) out.push(rotate({ ...S({ shape, x: x + w * fx, y: y + h * fy, width: sw, height: sh, cornerRadius: 6, fill: col, stroke: "#fff7e6", strokeWidth: 4, rotation: (fx * 100) % 20 - 10 }) }));
  }
  return out;
}

/** Perforation circles around a stamp-paper rect, painted in the background colour. */
export function perforations(x: number, y: number, w: number, h: number, r = 11, gap = 30): PartSpec {
  const p = new Path();
  for (let px = x + gap / 2; px < x + w; px += gap) {
    p.circle(px, y, r);
    p.circle(px, y + h, r);
  }
  for (let py = y + gap / 2; py < y + h; py += gap) {
    p.circle(x, py, r);
    p.circle(x + w, py, r);
  }
  return { path: p, fill: PAPER };
}

export { pg };
