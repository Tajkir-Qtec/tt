import { Path, type Pt } from "../design/path";
import type { Layer, Paint } from "../design/types";
import type { OrnamentData } from "../design/path";
import { O, T, W } from "./kit";

/** A path wrapper that draws in a local frame (origin bx,by; rotated ang; scaled s). */
export class XF {
  constructor(
    public p: Path,
    public bx: number,
    public by: number,
    public ang: number,
    public s = 1,
    public bend = 0,
    public blen = 1,
  ) {}
  pt(x: number, y: number): Pt {
    y += this.bend * Math.pow(Math.max(0, x) / this.blen, 2);
    const c = Math.cos(this.ang);
    const sn = Math.sin(this.ang);
    return [this.bx + this.s * (c * x - sn * y), this.by + this.s * (sn * x + c * y)];
  }
  M(x: number, y: number) {
    const [a, b] = this.pt(x, y);
    this.p.M(a, b);
    return this;
  }
  L(x: number, y: number) {
    const [a, b] = this.pt(x, y);
    this.p.L(a, b);
    return this;
  }
  Q(x1: number, y1: number, x: number, y: number) {
    const a = this.pt(x1, y1);
    const b = this.pt(x, y);
    this.p.Q(a[0], a[1], b[0], b[1]);
    return this;
  }
  C(x1: number, y1: number, x2: number, y2: number, x: number, y: number) {
    const a = this.pt(x1, y1);
    const b = this.pt(x2, y2);
    const c = this.pt(x, y);
    this.p.C(a[0], a[1], b[0], b[1], c[0], c[1]);
    return this;
  }
  Z() {
    this.p.Z();
    return this;
  }
}

/** Paisley (boteh) with its round bulb at the base and a curled tip, pointing along `ang`. */
export function paisleyAt(p: Path, bx: number, by: number, ang: number, len: number, wd: number, curl = 1) {
  const x = new XF(p, bx, by, ang, 1, curl * len * 0.34, len);
  x.M(0, 0)
    .C(0, -1.5 * wd, 0.5 * len, -1.5 * wd, len, 0)
    .C(0.55 * len, 1.25 * wd, 0, 1.5 * wd, 0, 0)
    .Z();
}

/** Ring of dots. */
export function dotRing(p: Path, cx: number, cy: number, r: number, n: number, dr: number, offset = 0) {
  for (let i = 0; i < n; i++) {
    const a = offset + (i / n) * Math.PI * 2;
    p.circle(cx + Math.cos(a) * r, cy + Math.sin(a) * r, dr);
  }
}

/** Ring of small arcs (scallops) around a circle; out=true bulges outward. */
export function scallopRing(p: Path, cx: number, cy: number, r: number, n: number, out = true, offset = 0) {
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const a = offset + (i / n) * Math.PI * 2;
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  const chord = 2 * r * Math.sin(Math.PI / n);
  const ar = chord / 2;
  p.M(pts[0][0], pts[0][1]);
  for (let i = 1; i <= n; i++) p.A(ar, ar, 0, 0, out ? 1 : 0, pts[i][0], pts[i][1]);
}

export interface EventItem {
  name: string;
  time: string;
  note?: string;
}

export interface EventsStyle {
  heading: string;
  headFont: string;
  headSize: number;
  headFill: Paint;
  headWeight?: number;
  headItalic?: boolean;
  headUpper?: boolean;
  headSpacing?: number;
  /** Optional small line above heading. */
  eyebrow?: string;
  eyebrowFill?: string;
  labelFont: string;
  labelFill: string;
  labelSpacing?: number;
  strongFont: string;
  strongFill: Paint;
  strongWeight?: number;
  strongItalic?: boolean;
  bodyFont: string;
  bodyFill: string;
  bodyItalic?: boolean;
  events: EventItem[];
  venueName: string;
  address: string;
  extras: [string, string][];
  divider: OrnamentData;
  dividerW: number;
  dividerH: number;
  y0: number;
  x?: number;
  width?: number;
  eventGap?: number;
  timeSize?: number;
  strongSize?: number;
}

/** A configurable "details" page body: heading, schedule, venue, extras. Never contains RSVP text. */
export function eventsLayers(s: EventsStyle): Layer[] {
  const x = s.x ?? 150;
  const width = s.width ?? W - 2 * x;
  const out: Layer[] = [];
  let y = s.y0;
  if (s.eyebrow) {
    out.push(T(s.eyebrow, y, { x, width, fontFamily: s.labelFont, fontSize: 18, fill: s.eyebrowFill ?? s.labelFill, letterSpacing: 7, uppercase: true, fontWeight: 500 }));
    y += 38;
  }
  out.push(
    T(s.heading, y, {
      x,
      width,
      fontFamily: s.headFont,
      fontSize: s.headSize,
      fill: s.headFill,
      fontWeight: s.headWeight ?? 400,
      italic: s.headItalic ?? false,
      uppercase: s.headUpper,
      letterSpacing: s.headSpacing ?? 0,
      lineHeight: 1.15,
    }),
  );
  y += s.headSize * 1.3 + 14;
  out.push(O(s.divider, { cx: W / 2, y, width: s.dividerW }));
  y += s.dividerH + 36;
  const label = (t: string, yy: number) =>
    T(t, yy, { x, width, fontFamily: s.labelFont, fontWeight: 500, fontSize: 18, fill: s.labelFill, letterSpacing: s.labelSpacing ?? 6, uppercase: true });
  const timeSize = s.timeSize ?? 46;
  const gap = s.eventGap ?? 122;
  for (const e of s.events) {
    out.push(label(e.name, y));
    out.push(
      T(e.time, y + 34, {
        x,
        width,
        fontFamily: s.strongFont,
        fontSize: timeSize,
        fill: s.strongFill,
        fontWeight: s.strongWeight ?? 500,
        italic: s.strongItalic ?? false,
        lineHeight: 1.1,
      }),
    );
    if (e.note) out.push(T(e.note, y + 34 + timeSize * 1.2, { x, width, fontFamily: s.bodyFont, fontSize: 24, fill: s.bodyFill, italic: s.bodyItalic ?? false }));
    y += gap + (e.note ? 18 : 0);
  }
  y += 10;
  out.push(O(s.divider, { cx: W / 2, y, width: s.dividerW * 0.7 }));
  y += s.dividerH * 0.7 + 34;
  out.push(label("Venue", y));
  out.push(
    T(s.venueName, y + 34, { x, width, fontFamily: s.strongFont, fontSize: s.strongSize ?? 40, fill: s.strongFill, fontWeight: s.strongWeight ?? 500, italic: s.strongItalic ?? false, lineHeight: 1.1 }),
  );
  out.push(T(s.address, y + 34 + (s.strongSize ?? 40) * 1.3, { x, width, fontFamily: s.bodyFont, fontSize: 26, fill: s.bodyFill, lineHeight: 1.45, italic: s.bodyItalic ?? false }));
  y += 190;
  for (const [l, t] of s.extras) {
    out.push(label(l, y));
    out.push(T(t, y + 34, { x, width, fontFamily: s.bodyFont, fontSize: 26, fill: s.bodyFill, italic: s.bodyItalic ?? false, lineHeight: 1.4 }));
    y += 112;
  }
  return out;
}
