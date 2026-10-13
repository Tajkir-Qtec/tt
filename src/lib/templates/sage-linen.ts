import { sprig } from "../design/ornaments";
import { centerRotate } from "../design/layers";
import type { Layer } from "../design/types";
import { H, I, linear, lock, O, P, radial, S, T, W, type TemplateDef } from "./kit";

const LINEN = "#f4eee3";
const OAT = "#e9e0cf";
const OLIVE = "#66724a";
const EUCA = "#8fa797";
const PALE = "#b7c6b4";
const INK = "#3b402f";
const MUTED = "#7b7a68";
const LINE = "#cfc4ad";

const bg = () => linear(100, [0, "#f7f2e8"], [0.55, LINEN], [1, "#eee6d6"]);

interface Br {
  x: number; // centre
  y: number;
  len: number;
  rot: number;
  c: string;
  o?: number;
  leaves?: number;
  w?: number; // leaf width factor
  flip?: boolean;
}

function branch(b: Br): Layer {
  const d = sprig({
    color: b.c,
    length: b.len,
    leaves: b.leaves ?? 9,
    leafLen: b.len * 0.078,
    leafW: b.len * 0.078 * 0.8 * (b.w ?? 0.85),
    curve: b.len * 0.06,
    round: true,
    alternate: true,
    stemWidth: 2.6,
    opacity: b.o ?? 1,
    taper: 0.4,
    berryColor: null,
  });
  return lock(centerRotate(O(d, { x: 0, y: 0, width: b.len, flipY: b.flip }), b.x, b.y, b.rot));
}

const glow = (cx: number, cy: number, w: number, h: number, rgb: string, a: number): Layer =>
  lock(
    S({
      shape: "ellipse",
      x: cx - w / 2,
      y: cy - h / 2,
      width: w,
      height: h,
      fill: radial([0, `rgba(${rgb},${a})`], [0.6, `rgba(${rgb},${a * 0.4})`], [1, `rgba(${rgb},0)`]),
    }),
  );

const hair = (x: number, y: number, w: number, c = LINE): Layer => lock(S({ x, y, width: w, height: 1.2, fill: c }));

/** Sparse hanging branches down the right edge. */
function edge(scale = 1, top = 0): Layer[] {
  const k = scale;
  return [
    branch({ x: 905, y: top + 380 * k, len: 760 * k, rot: 92, c: EUCA, o: 0.95, leaves: 15, w: 1 }),
    branch({ x: 850, y: top + 260 * k, len: 520 * k, rot: 84, c: OLIVE, o: 0.95, leaves: 13, w: 0.8, flip: true }),
    branch({ x: 955, y: top + 250 * k, len: 420 * k, rot: 98, c: PALE, o: 0.9, leaves: 11, w: 1.1 }),
    branch({ x: 805, y: top + 120 * k, len: 250 * k, rot: 60, c: OLIVE, o: 0.9, leaves: 8, w: 0.8 }),
  ];
}

function foot(): Layer[] {
  return [
    branch({ x: 165, y: 1345, len: 420, rot: -8, c: EUCA, o: 0.9, leaves: 11, w: 1.05 }),
    branch({ x: 250, y: 1370, len: 330, rot: 4, c: OLIVE, o: 0.9, leaves: 9, w: 0.8, flip: true }),
  ];
}

export default function build(): TemplateDef {
  const rise = (): Layer[] => [
    branch({ x: 800, y: 1250, len: 600, rot: -78, c: EUCA, o: 0.95, leaves: 13, w: 1, flip: true }),
    branch({ x: 880, y: 1290, len: 420, rot: -96, c: OLIVE, o: 0.95, leaves: 10, w: 0.8 }),
  ];
  const cover: Layer[] = [
    ...rise(),
    ...edge(1, 0),
    T("For {to}", 128, { x: 130, width: 560, align: "left", fontFamily: "Fraunces", italic: true, fontWeight: 300, fontSize: 28, fill: MUTED }),
    T("The wedding of", 196, { x: 130, width: 560, align: "left", fontFamily: "Jost", fontWeight: 400, fontSize: 17, fill: OLIVE, letterSpacing: 9, uppercase: true }),
    T("Amara", 262, { x: 124, width: 640, align: "left", fontFamily: "Cormorant Garamond", italic: true, fontWeight: 300, fontSize: 220, fill: INK, lineHeight: 1 }),
    T("& Theo", 468, { x: 124, width: 640, align: "left", fontFamily: "Cormorant Garamond", italic: true, fontWeight: 300, fontSize: 220, fill: INK, lineHeight: 1 }),
    hair(130, 770, 80, OLIVE),
    T("Saturday", 818, { x: 130, width: 500, align: "left", fontFamily: "Jost", fontWeight: 400, fontSize: 15, fill: MUTED, letterSpacing: 9, uppercase: true }),
    T("October 9, 2027", 850, { x: 130, width: 600, align: "left", fontFamily: "Jost", fontWeight: 300, fontSize: 38, fill: INK, letterSpacing: 8, uppercase: true }),
    T("Four o'clock in the afternoon", 916, { x: 130, width: 600, align: "left", fontFamily: "Fraunces", italic: true, fontWeight: 300, fontSize: 24, fill: MUTED }),
    T("Olive Hill Farm", 1176, { x: 130, width: 560, align: "left", fontFamily: "Jost", fontWeight: 500, fontSize: 16, fill: INK, letterSpacing: 8, uppercase: true }),
    T("218 Ridgeway Road, Santa Ynez Valley, California", 1212, { x: 130, width: 640, align: "left", fontFamily: "Jost", fontWeight: 300, fontSize: 18, fill: MUTED, letterSpacing: 1 }),
  ];

  const rows: [string, string, string][] = [
    ["Ceremony", "4:00 PM", "Beneath the old oak"],
    ["Cocktails", "5:00 PM", "Lawn terrace, with local wine and music"],
    ["Dinner", "6:30 PM", "Long tables in the barn, then dancing"],
    ["Venue", "Olive Hill Farm", "218 Ridgeway Road, Santa Ynez Valley, CA 93460"],
    ["Parking", "On the farm lawn", "Free parking on site, shuttle from the village"],
    ["Dress code", "Garden semi-formal", "Earth tones, natural fabrics, flat shoes for the lawn"],
  ];
  const details: Layer[] = [
    ...edge(0.6, -40),
    T("The details", 130, { x: 130, width: 600, align: "left", fontFamily: "Cormorant Garamond", italic: true, fontWeight: 300, fontSize: 120, fill: INK }),
    T("Amara & Theo  ·  09.10.2027", 290, { x: 130, width: 600, align: "left", fontFamily: "Jost", fontWeight: 400, fontSize: 14, fill: OLIVE, letterSpacing: 8, uppercase: true }),
  ];
  rows.forEach(([label, big, small], i) => {
    const y = 380 + i * 152;
    details.push(hair(130, y, 640));
    details.push(T(label, y + 34, { x: 130, width: 220, align: "left", fontFamily: "Jost", fontWeight: 500, fontSize: 15, fill: OLIVE, letterSpacing: 6, uppercase: true }));
    details.push(T(big, y + 24, { x: 370, width: 420, align: "left", fontFamily: "Fraunces", fontWeight: 300, fontSize: 34, fill: INK }));
    details.push(T(small, y + 78, { x: 370, width: 420, align: "left", fontFamily: "Jost", fontWeight: 300, fontSize: 18, fill: MUTED, lineHeight: 1.4 }));
  });
  details.push(hair(130, 380 + rows.length * 152, 640));

  const photo: Layer[] = [
    ...foot(),
    branch({ x: 880, y: 300, len: 560, rot: 88, c: EUCA, o: 0.95, leaves: 12, w: 1 }),
    branch({ x: 930, y: 380, len: 400, rot: 96, c: OLIVE, o: 0.95, leaves: 11, w: 0.8, flip: true }),
    T("Our story", 130, { x: 130, width: 600, align: "left", fontFamily: "Cormorant Garamond", italic: true, fontWeight: 300, fontSize: 110, fill: INK }),
    I({ x: 130, y: 300, width: 600, height: 760, mask: "rounded", cornerRadius: 300, placeholderFill: OAT }),
    T("Every love story is beautiful,", 1112, { x: 130, width: 600, align: "left", fontFamily: "Fraunces", italic: true, fontWeight: 300, fontSize: 30, fill: INK }),
    T("but ours is our favourite.", 1156, { x: 130, width: 600, align: "left", fontFamily: "Fraunces", italic: true, fontWeight: 300, fontSize: 30, fill: INK }),
    T("Amara & Theo  ·  09.10.2027", 1230, { x: 130, width: 600, align: "left", fontFamily: "Jost", fontWeight: 400, fontSize: 13, fill: OLIVE, letterSpacing: 8, uppercase: true }),
  ];

  return {
    slug: "sage-linen",
    name: "Sage Linen",
    tagline: "Minimal modern wedding invitation with eucalyptus and olive branches",
    description:
      "An airy, editorial wedding invitation on warm oat linen with sparse olive and eucalyptus branches, wide-tracked modern sans and an elegant serif italic for the names.",
    categories: ["minimal", "modern", "boho"],
    keywords: ["minimalist eucalyptus wedding invitation", "olive branch wedding card", "modern sage green wedding invitation"],
    palette: [LINEN, OAT, PALE, EUCA, OLIVE],
    width: W,
    height: H,
    pages: [P(bg(), cover, "Invitation"), P(bg(), details, "Details"), P(bg(), photo, "Photo")],
  };
}
