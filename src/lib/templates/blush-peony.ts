import { archFrame, blossom, divider, flower, sprig } from "../design/ornaments";
import { centerRotate } from "../design/layers";
import type { Layer } from "../design/types";
import { detailsLayers } from "./details";
import { H, linear, lock, O, P, radial, S, T, W, type TemplateDef } from "./kit";

const BLUSH = "#f2cdd0";
const ROSE = "#c9808c";
const DEEP = "#7a3f4d";
const SAGE = "#8fa48a";
const CREAM = "#fbf4ee";
const INK = "#6d5a5c";

type Item =
  | { k: "wash"; x: number; y: number; w: number; h: number; c: string; a: number }
  | { k: "sprig"; x: number; y: number; len: number; rot: number; c: string; o: number; flip?: boolean; berry?: boolean }
  | { k: "peony"; x: number; y: number; r: number; rot: number; o: number; tone: 0 | 1 | 2 }
  | { k: "blos"; x: number; y: number; r: number; rot: number; o: number; c: string };

const TONES = [
  ["#f7dcdc", "#f1c3c7", "#e8a9b1", "#d98e9b"],
  ["#fbe7e2", "#f6d2d0", "#eeb9bd", "#e3a0aa"],
  ["#f0bcc3", "#e6a1ac", "#d9808f", "#c4677a"],
];

/** Lay a hand-painted bouquet around an anchor; (sx, sy) = +1/-1 mirrors it into another corner. */
function scaleItem(it: Item, k: number): Item {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const o: any = { ...it, x: it.x * k, y: it.y * k };
  for (const f of ["w", "h", "len", "r"]) if (f in o) o[f] *= k;
  return o;
}

function bouquet(ax: number, ay: number, sx: number, sy: number, items0: Item[], k = 1): Layer[] {
  const items = items0.map((i) => scaleItem(i, k));
  const out: Layer[] = [];
  for (const it of items) {
    const cx = ax + it.x * sx * 1;
    const cy = ay + it.y * sy;
    if (it.k === "wash") {
      out.push(
        lock(
          S({
            shape: "ellipse",
            x: cx - it.w / 2,
            y: cy - it.h / 2,
            width: it.w,
            height: it.h,
            fill: radial([0, hexA(it.c, it.a)], [0.55, hexA(it.c, it.a * 0.45)], [1, hexA(it.c, 0)]),
          }),
        ),
      );
    } else if (it.k === "sprig") {
      const d = sprig({ color: it.c, length: it.len, leaves: 7, leafLen: it.len * 0.2, leafW: it.len * 0.065, curve: it.len * 0.07, berryColor: it.berry ? "#d9a3a8" : null, opacity: it.o, stemWidth: 2.4 });
      const l = O(d, { x: 0, y: 0, width: it.len, flipX: it.flip, flipY: sx * sy < 0 });
      out.push(lock(centerRotate(l, cx, cy, (() => { let a = it.rot; if (sx < 0) a = 180 - a; if (sy < 0) a = -a; return a; })())));
    } else if (it.k === "peony") {
      const t = TONES[it.tone];
      const d = flower({ color: t[0], ringColors: t, stroke: "#c97d8b", strokeWidth: 0.9, radius: it.r, rings: 5, petals: 10, opacity: 0.9, center: "#e9c07a" });
      const w = it.r * 2 + 12;
      out.push(lock(S({ shape: "ellipse", x: cx - it.r * 1.15, y: cy - it.r * 1.0 + it.r * 0.12, width: it.r * 2.3, height: it.r * 2.3, fill: radial([0, "rgba(176,92,112,0.30)"], [0.6, "rgba(176,92,112,0.12)"], [1, "rgba(176,92,112,0)"]) })));
      out.push(lock(centerRotate(O(d, { x: 0, y: 0, width: w, opacity: it.o }), cx, cy, it.rot)));
    } else {
      const d = blossom({ color: it.c, center: "#d9a45b", radius: it.r });
      out.push(lock(centerRotate(O(d, { x: 0, y: 0, width: it.r * 2 + 6, opacity: it.o }), cx, cy, it.rot)));
    }
  }
  return out;
}

function hexA(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

const BIG: Item[] = [
  { k: "wash", x: 110, y: 110, w: 560, h: 480, c: "#f2c4c8", a: 0.55 },
  { k: "wash", x: 250, y: 60, w: 380, h: 260, c: "#cfdcc9", a: 0.45 },
  { k: "wash", x: 40, y: 270, w: 300, h: 340, c: "#f5d3d0", a: 0.5 },
  { k: "sprig", x: 215, y: 25, len: 330, rot: 8, c: SAGE, o: 0.85, berry: true },
  { k: "sprig", x: 50, y: 300, len: 300, rot: 78, c: "#a5b8a0", o: 0.8 },
  { k: "sprig", x: 330, y: 225, len: 230, rot: 38, c: "#7f9a7c", o: 0.75, flip: true },
  { k: "peony", x: 120, y: 120, r: 148, rot: 12, o: 0.95, tone: 0 },
  { k: "peony", x: 285, y: 70, r: 92, rot: -30, o: 0.9, tone: 1 },
  { k: "peony", x: 62, y: 292, r: 98, rot: 40, o: 0.92, tone: 1 },
  { k: "peony", x: 195, y: 232, r: 70, rot: 75, o: 0.95, tone: 2 },
  { k: "peony", x: 40, y: 30, r: 62, rot: 5, o: 0.85, tone: 2 },
  { k: "blos", x: 385, y: 135, r: 30, rot: 20, o: 0.9, c: "#fff3f1" },
  { k: "blos", x: 150, y: 355, r: 26, rot: -15, o: 0.9, c: "#fff3f1" },
  { k: "blos", x: 330, y: 20, r: 22, rot: 40, o: 0.85, c: "#f6c9cc" },
  { k: "blos", x: 20, y: 410, r: 20, rot: 8, o: 0.85, c: "#f6c9cc" },
];

const SMALL: Item[] = [
  { k: "wash", x: 80, y: 90, w: 380, h: 330, c: "#f2c4c8", a: 0.5 },
  { k: "sprig", x: 170, y: 20, len: 240, rot: 0, c: SAGE, o: 0.85, berry: true },
  { k: "sprig", x: 30, y: 215, len: 220, rot: 82, c: "#a5b8a0", o: 0.8 },
  { k: "peony", x: 78, y: 82, r: 104, rot: -20, o: 0.95, tone: 1 },
  { k: "peony", x: 185, y: 55, r: 62, rot: 30, o: 0.9, tone: 0 },
  { k: "peony", x: 40, y: 200, r: 62, rot: 55, o: 0.92, tone: 2 },
  { k: "blos", x: 255, y: 105, r: 22, rot: 0, o: 0.9, c: "#fff3f1" },
  { k: "blos", x: 110, y: 250, r: 20, rot: 30, o: 0.9, c: "#fff3f1" },
];

function ground() {
  return linear(90, [0, "#fdf7f2"], [0.55, CREAM], [1, "#f8ebe6"]);
}

export default function build(): TemplateDef {
  const cover = [
    ...bouquet(-30, -30, 1, 1, BIG, 1.3),
    ...bouquet(1030, 1430, -1, -1, SMALL, 1.35),
    lock(S({ shape: "rect", x: 80, y: 80, width: 840, height: 1240, fill: null, stroke: "#e3b9bd", strokeWidth: 1, opacity: 0.0 })),
    T("Dear {to},", 450, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontSize: 32, fill: INK }),
    T("Together with their families", 514, { x: 200, width: 600, fontFamily: "Jost", fontSize: 17, fill: INK, letterSpacing: 6, uppercase: true }),
    T("joyfully invite you to the wedding of", 552, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontSize: 28, fill: INK }),
    T("Isabella", 598, { x: 150, width: 700, fontFamily: "Great Vibes", fontSize: 150, fill: DEEP }),
    T("&", 748, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontSize: 56, fill: ROSE }),
    T("Edward", 792, { x: 150, width: 700, fontFamily: "Great Vibes", fontSize: 150, fill: DEEP }),
    O(divider({ style: "floral", w: 340, color: ROSE }), { cx: W / 2, y: 972, width: 340 }),
    T("Saturday", 1024, { x: 200, width: 600, fontFamily: "Jost", fontSize: 17, fill: INK, letterSpacing: 9, uppercase: true }),
    T("the Twelfth of June, 2027", 1054, { x: 200, width: 600, fontFamily: "Cormorant Garamond", fontWeight: 500, fontSize: 44, fill: DEEP }),
    T("at half past four in the afternoon", 1112, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontSize: 26, fill: INK }),
    T("The Rosewater Conservatory  ·  Charleston", 1158, { x: 150, width: 700, fontFamily: "Jost", fontSize: 15, fill: ROSE, letterSpacing: 4, uppercase: true, fontWeight: 500 }),
  ];

  const details = [
    ...bouquet(1030, -30, -1, 1, SMALL, 1.3),
    ...bouquet(-30, 1430, 1, -1, SMALL, 1.3),
    ...detailsLayers({
      heading: "The Day",
      headFont: "Great Vibes",
      headSize: 120,
      headFill: DEEP,
      bodyFont: "Jost",
      bodyFill: INK,
      strongFont: "Cormorant Garamond",
      strongFill: DEEP,
      labelFill: ROSE,
      accent: ROSE,
      divider: "floral",
      y0: 190,
      x: 200,
      width: 600,
      gap: 0.95,
    }),
  ];

  const photo = [
    ...bouquet(-30, -30, 1, 1, SMALL, 1.3),
    ...bouquet(1030, 1430, -1, -1, SMALL, 0.95),
    T("Our Story", 150, { x: 200, width: 600, fontFamily: "Great Vibes", fontSize: 96, fill: DEEP }),
    lock(O(archFrame({ w: 640, h: 790, stroke: "#d9a3ab", strokeWidth: 1.5, lines: 2, gap: 10 }), { x: 180, y: 330, width: 640 })),
    {
      ...O(divider({ style: "dots", w: 200, color: ROSE }), { cx: W / 2, y: 1235, width: 200 }),
    },
  ];
  // photo placeholder
  photo.splice(
    4,
    0,
    {
      type: "image",
      id: "photo-main",
      x: 195,
      y: 345,
      width: 610,
      height: 765,
      rotation: 0,
      opacity: 1,
      src: "",
      mask: "arch",
      cornerRadius: 0,
      placeholderFill: "#f1d6d6",
      borderColor: null,
      borderWidth: 0,
      zoom: 1,
      focusX: 0.5,
      focusY: 0.5,
    } as Layer,
  );
  photo.push(
    T("Isabella & Edward  ·  12.06.2027", 1280, { x: 200, width: 600, fontFamily: "Jost", fontSize: 17, fill: INK, letterSpacing: 6, uppercase: true }),
  );

  return {
    slug: "blush-peony",
    name: "Blush Peony",
    tagline: "Romantic watercolor peony wedding invitation in blush pink",
    description:
      "A romantic, lush wedding invitation with layered blush and dusty-rose peonies, sage sprigs and soft watercolor washes, lettered in flowing script and refined serif.",
    categories: ["floral", "classic", "luxury"],
    keywords: ["blush pink peony wedding invitation", "watercolor floral wedding card", "romantic dusty rose invitation"],
    palette: [CREAM, BLUSH, ROSE, DEEP, SAGE],
    width: W,
    height: H,
    pages: [P(ground(), cover, "Invitation"), P(ground(), details, "Details"), P(ground(), photo, "Photo")],
  };
}
