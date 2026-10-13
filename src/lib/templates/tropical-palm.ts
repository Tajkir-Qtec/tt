import { archFrame, blossom, divider } from "../design/ornaments";
import type { Layer } from "../design/types";
import { GREENS, jungle, type FrondSpec, type MonsteraSpec } from "./tropical-palm.art";
import { wDetails } from "./wedding-details";
import { H, I, linear, lock, O, P, radial, S, T, W, type TemplateDef } from "./kit";

const DEEP = "#0f4030";
const CREAM = "#fbf1e2";
const CORAL = "#f26d4f";
const PEACH = "#ffb48e";
const SOFT = "#4b6a5c";

type Add = { frond: (f: FrondSpec) => void; monstera: (m: MonsteraSpec) => void; rnd: () => number };

function cluster(add: Add, at: [number, number], theta: number, k = 1, bright = false) {
  const [c1, c2, c3, c4, c5] = bright
    ? [GREENS.forest, GREENS.jungle, GREENS.fern, GREENS.mint, "#a6dcb8"]
    : [GREENS.abyss, GREENS.deep, GREENS.forest, GREENS.jungle, GREENS.fern];
  add.frond({ at, angle: theta - 34, length: 660 * k, bend: 26, color: c1, color2: c2, opacity: 0.98, leaflets: 36 });
  add.frond({ at, angle: theta + 38, length: 620 * k, bend: -24, color: c2, color2: c3, opacity: 0.98, leaflets: 34 });
  add.frond({ at, angle: theta - 12, length: 540 * k, bend: 30, color: c3, color2: c4, opacity: 0.95, leaflets: 32 });
  add.monstera({ at: [at[0] + 10, at[1] + 10], angle: theta + 14, size: 360 * k, color: bright ? GREENS.jungle : GREENS.jungle, vein: GREENS.mint, stem: 80 * k });
  add.monstera({ at: [at[0] + 20, at[1] + 10], angle: theta - 30, size: 250 * k, color: c4 === GREENS.mint ? GREENS.fern : GREENS.fern, vein: "#d4f1dc", opacity: 0.96, stem: 60 * k });
  add.frond({ at, angle: theta + 4, length: 400 * k, bend: -34, color: c4, color2: c5, opacity: 0.88, leaflets: 26 });
}

const sunGlow = (cx: number, cy: number, w: number, h: number, a = 0.55) =>
  lock(
    S({
      shape: "ellipse",
      x: cx - w / 2,
      y: cy - h / 2,
      width: w,
      height: h,
      fill: radial([0, `rgba(255,150,110,${a})`], [0.45, `rgba(255,185,145,${a * 0.5})`], [1, "rgba(255,200,160,0)"]),
    }),
  );

export default function build(): TemplateDef {
  const greenBg = linear(90, [0, "#0e3d2d"], [0.5, "#114534"], [1, "#0a3022"]);
  const creamBg = linear(90, [0, "#fcf4e6"], [1, "#f6e8d3"]);

  const coverFoliage = jungle({
    seed: 3,
    build: (add) => {
      cluster(add, [-30, -40], 46, 0.66);
      cluster(add, [1030, 1440], -132, 0.68);
    },
  });

  const names = (t: string, y: number, size = 138): Layer =>
    T(t, y, { x: 150, width: 700, fontFamily: "Playfair Display", italic: true, fontWeight: 400, fontSize: size, fill: DEEP });
  const caps = (t: string, y: number, fill: string, size = 17, sp = 9, weight = 500): Layer =>
    T(t, y, { x: 150, width: 700, fontFamily: "Montserrat", fontWeight: weight, fontSize: size, letterSpacing: sp, uppercase: true, fill });

  const cover = P(
    greenBg,
    [
      lock(S({ x: 70, y: 70, width: 860, height: 1260, cornerRadius: 34, fill: creamBg })),
      sunGlow(500, 400, 780, 520, 0.5),
      lock(S({ x: 92, y: 92, width: 816, height: 1216, cornerRadius: 22, fill: null, stroke: "#e8a58a", strokeWidth: 1.5 })),
      lock(O(coverFoliage, { x: 0, y: 0, width: W, height: H })),
      lock(O(blossom({ color: "#fffaf0", center: "#ff9a6e", radius: 46 }), { cx: 150, y: 1060, width: 92, rotation: 12 })),
      T("Dear {to},", 255, { x: 250, width: 500, fontFamily: "Playfair Display", italic: true, fontSize: 32, fill: SOFT }),
      caps("Join us for the wedding of", 323, CORAL, 16, 7),
      names("Leilani", 390),
      T("&", 553, { x: 250, width: 500, fontFamily: "Montserrat", fontWeight: 300, fontSize: 54, fill: CORAL }),
      names("Mateo", 613),
      lock(S({ x: 470, y: 815, width: 60, height: 2, fill: CORAL })),
      caps("Saturday", 855, SOFT, 18, 12),
      T("14 · 08 · 2027", 893, { x: 150, width: 700, fontFamily: "Montserrat", fontWeight: 300, fontSize: 58, letterSpacing: 5, fill: DEEP }),
      T("as the sun sets, half past five", 985, { x: 200, width: 600, fontFamily: "Playfair Display", italic: true, fontSize: 28, fill: SOFT }),
      caps("Playa Mirasol Resort", 1055, DEEP, 27, 7, 600),
      T("Tulum, Quintana Roo, Mexico", 1105, { x: 200, width: 600, fontFamily: "Montserrat", fontWeight: 300, fontSize: 20, letterSpacing: 3, fill: SOFT }),
    ],
    "Invitation",
  );

  const detFoliage = jungle({
    seed: 5,
    build: (add) => {
      cluster(add, [1040, -40], 132, 0.64, true);
      cluster(add, [-40, 1440], -50, 0.56, true);
    },
  });

  const details = P(
    greenBg,
    [
      lock(O(detFoliage, { x: 0, y: 0, width: W, height: H })),
      ...wDetails({
        heading: "The Celebration",
        headFont: "Playfair Display",
        headItalic: true,
        headSize: 76,
        headFill: CREAM,
        labelFont: "Montserrat",
        labelFill: PEACH,
        labelWeight: 500,
        strongFont: "Playfair Display",
        strongFill: CREAM,
        strongWeight: 400,
        bodyFont: "Montserrat",
        bodyFill: "#d6e4d8",
        accent: PEACH,
        divider: "dots",
        events: [
          ["Beach Ceremony", "5:30 PM"],
          ["Sunset Cocktails", "6:15 PM"],
          ["Dinner Under the Palms", "7:30 PM"],
        ],
        venue: "Playa Mirasol Resort",
        address: "Km 7.5 Carretera Tulum-Boca Paila\nTulum, Quintana Roo, Mexico",
        dress: ["Dress Code", "Tropical formal  ·  Linen & light colours"],
        closing: ["Good to Know", "Ceremony is barefoot on the sand"],
        y0: 175,
        gap: 1.08,
        x: 160,
      }),
    ],
    "Details",
  );

  const photoFoliage = jungle({
    seed: 9,
    build: (add) => {
      cluster(add, [-30, -40], 46, 0.55);
      cluster(add, [1030, 1440], -132, 0.55);
    },
  });

  const photo = P(
    creamBg,
    [
      sunGlow(500, 420, 1000, 760, 0.55),
      lock(O(archFrame({ w: 560, h: 740, stroke: "#e8a58a", strokeWidth: 1.6, lines: 2, gap: 10 }), { x: 220, y: 160, width: 560 })),
      I({ x: 250, y: 190, width: 500, height: 680, mask: "arch", placeholderFill: "#f3cdb3", borderColor: DEEP, borderWidth: 7, name: "Photo" }),
      lock(O(blossom({ color: "#fffaf0", center: "#ff9a6e", radius: 40 }), { cx: 215, y: 800, width: 80, rotation: -10 })),
      lock(O(blossom({ color: "#fff1e2", center: "#ff9a6e", radius: 28 }), { cx: 262, y: 858, width: 56, rotation: 25 })),
      lock(O(photoFoliage, { x: 0, y: 0, width: W, height: H })),
      T("Leilani & Mateo", 945, { x: 120, width: 760, fontFamily: "Playfair Display", italic: true, fontSize: 76, fill: DEEP }),
      O(divider({ style: "dots", w: 260, color: CORAL }), { cx: W / 2, y: 1025, width: 260 }),
      T("Two hearts, one tide.", 1090, { x: 200, width: 600, fontFamily: "Playfair Display", italic: true, fontSize: 34, fill: SOFT }),
      caps("14 · 08 · 2027  ·  Tulum", 1190, CORAL, 19, 9),
    ],
    "Our Story",
  );

  return {
    slug: "tropical-palm",
    name: "Tropical Palm",
    tagline: "Tropical beach wedding invitation with palms, monstera and coral",
    description:
      "A lush destination-wedding invitation with layered palm fronds and monstera leaves in deep greens, a warm coral sunset glow and cream paper. Italic serif names with clean sans details.",
    categories: ["beach", "nature", "modern", "boho"],
    keywords: ["tropical wedding invitation", "beach wedding card palm leaves", "destination wedding invite monstera", "coral and green wedding invitation"],
    palette: ["#0f4030", "#21714d", "#fbf1e2", "#f26d4f", "#ffb48e"],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
