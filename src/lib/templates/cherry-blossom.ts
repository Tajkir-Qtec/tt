import { divider } from "../design/ornaments";
import { centerRotate } from "../design/layers";
import type { Layer } from "../design/types";
import { sakuraScene } from "./cherry-blossom.art";
import { wDetails } from "./wedding-details";
import { H, I, linear, lock, O, P, radial, S, T, W, type TemplateDef } from "./kit";

const INK = "#2b2a2c";
const SOFT = "#615d5c";
const SEAL = "#c3362d";
const PINK = "#c9677f";

const paper = linear(100, [0, "#fdf9f3"], [0.55, "#fbf3ee"], [1, "#f8ebe8"]);

const wash = (x: number, y: number, w: number, h: number, a: number) =>
  lock(S({ shape: "ellipse", x, y, width: w, height: h, fill: radial([0, `rgba(246,200,212,${a})`], [0.5, `rgba(246,200,212,${a * 0.35})`], [1, "rgba(246,200,212,0)"]) }));

function seal(cx: number, cy: number, size: number, glyph: string, rot: number): Layer[] {
  const x = cx - size / 2;
  const y = cy - size / 2;
  return [
    centerRotate(S({ x, y, width: size, height: size, cornerRadius: 7, fill: linear(120, [0, "#d2453a"], [1, "#b02a22"]), name: "Seal" }), cx, cy, rot),
    centerRotate(S({ x: x + 6, y: y + 6, width: size - 12, height: size - 12, cornerRadius: 3, fill: null, stroke: "rgba(255,236,228,0.75)", strokeWidth: 1.6 }), cx, cy, rot),
    centerRotate(
      T(glyph, cy - size * 0.17, { x, width: size, height: size * 0.34, fontFamily: "Marcellus", fontSize: size * 0.32, lineHeight: 1.05, fill: "#ffece4", letterSpacing: 1, name: "Seal text" }),
      cx,
      cy,
      rot,
    ),
  ];
}

export default function build(): TemplateDef {
  const name = (t: string, y: number, size = 150) =>
    T(t, y, { x: 120, width: 760, fontFamily: "Cormorant Garamond", fontWeight: 300, fontSize: size, fill: INK, letterSpacing: 2 });
  const label = (t: string, y: number, size = 17, sp = 9) =>
    T(t, y, { x: 150, width: 700, fontFamily: "Jost", fontWeight: 400, fontSize: size, letterSpacing: sp, uppercase: true, fill: SOFT });

  const coverArt = sakuraScene({
    seed: 11,
    branches: [
      { pts: [[1090, 30], [880, -20], [640, 120], [420, 60]], width: 19, droop: 1, twigs: 4 },
      { pts: [[-70, 1470], [100, 1380], [210, 1410], [340, 1350]], width: 13, droop: -1, twigs: 3 },
    ],
    petals: 20,
    avoid: [[150, 330, 850, 1220]],
  });

  const cover = P(
    paper,
    [
      wash(-250, -200, 900, 700, 0.5),
      wash(450, 950, 900, 700, 0.4),
      lock(O(coverArt, { x: 0, y: 0, width: W, height: H })),
      T("Dear {to},", 352, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontSize: 32, fill: SOFT }),
      label("Together with their families", 412),
      name("Mika", 475),
      T("and", 650, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontSize: 40, fill: PINK }),
      name("Julian", 695),
      lock(S({ x: 470, y: 900, width: 60, height: 1.5, fill: PINK })),
      T("Saturday  ·  3 April 2027", 945, { x: 150, width: 700, fontFamily: "Tenor Sans", fontSize: 36, letterSpacing: 6, fill: INK }),
      T("at four o'clock in the afternoon", 1007, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontSize: 29, fill: SOFT }),
      T("Seiryu Garden Pavilion", 1070, { x: 150, width: 700, fontFamily: "Marcellus", fontSize: 30, letterSpacing: 5, uppercase: true, fill: INK }),
      T("Higashiyama, Kyoto, Japan", 1118, { x: 150, width: 700, fontFamily: "Jost", fontWeight: 300, fontSize: 21, letterSpacing: 3, fill: SOFT }),
      ...seal(805, 1235, 78, "M·J", 5),
    ],
    "Invitation",
  );

  const detArt = sakuraScene({
    seed: 29,
    branches: [
      { pts: [[-80, -40], [90, 10], [220, -20], [320, 60]], width: 14, droop: 1, twigs: 4 },
      { pts: [[1080, 1470], [900, 1390], [800, 1420], [690, 1340]], width: 10, droop: -1, twigs: 3 },
    ],
    petals: 16,
    avoid: [[150, 260, 850, 1180]],
    petalScale: 0.9,
  });

  const details = P(
    paper,
    [
      wash(500, -150, 800, 600, 0.4),
      wash(-250, 950, 800, 700, 0.35),
      lock(O(detArt, { x: 0, y: 0, width: W, height: H })),
      ...wDetails({
        heading: "The Day",
        headFont: "Cormorant Garamond",
        headWeight: 300,
        headSize: 100,
        headFill: INK,
        labelFont: "Jost",
        labelFill: PINK,
        labelWeight: 400,
        labelSpacing: 8,
        strongFont: "Tenor Sans",
        strongFill: INK,
        strongWeight: 400,
        bodyFont: "Cormorant Garamond",
        bodyFill: SOFT,
        accent: PINK,
        divider: "dots",
        dividerAfter: "dots",
        events: [
          ["Ceremony", "4:00 PM"],
          ["Tea & Reception", "5:00 PM"],
          ["Kaiseki Dinner", "6:30 PM"],
        ],
        venue: "Seiryu Garden Pavilion",
        address: "27 Hanamikoji Lane, Higashiyama\nKyoto 605-0074",
        dress: ["Dress Code", "Soft spring tones  ·  Formal"],
        closing: ["A Small Request", "Share the day, not the screen"],
        y0: 215,
        gap: 0.9,
      }),
    ],
    "Details",
  );

  const photoArt = sakuraScene({
    seed: 47,
    branches: [
      { pts: [[1080, -30], [900, 30], [790, 10], [700, 120]], width: 11, droop: 1, twigs: 4 },
      { pts: [[-60, 1480], [90, 1380], [210, 1420], [330, 1300]], width: 11, droop: -1, twigs: 3 },
    ],
    petals: 16,
    avoid: [[200, 150, 800, 1230]],
    petalScale: 0.9,
  });

  const photo = P(
    paper,
    [
      wash(-200, 100, 800, 700, 0.35),
      wash(450, 800, 800, 700, 0.35),
      lock(S({ shape: "ellipse", x: 230, y: 190, width: 540, height: 690, fill: null, stroke: "#d9a1b0", strokeWidth: 1.4 })),
      I({ x: 250, y: 210, width: 500, height: 650, mask: "ellipse", placeholderFill: "#f5dde2", borderColor: "#ffffff", borderWidth: 6, name: "Photo" }),
      lock(O(photoArt, { x: 0, y: 0, width: W, height: H })),
      T("Mika & Julian", 925, { x: 150, width: 700, fontFamily: "Cormorant Garamond", fontWeight: 300, fontSize: 84, fill: INK }),
      lock(S({ x: 470, y: 1035, width: 60, height: 1.5, fill: PINK })),
      T("Like petals on the spring wind,\nwe found our way to each other.", 1075, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontSize: 34, lineHeight: 1.4, fill: SOFT }),
      T("3 · 4 · 2027", 1215, { x: 200, width: 600, fontFamily: "Tenor Sans", fontSize: 24, letterSpacing: 10, fill: INK }),
    ],
    "Our Story",
  );

  return {
    slug: "cherry-blossom",
    name: "Cherry Blossom",
    tagline: "Japanese-inspired sakura wedding invitation in soft blush",
    description:
      "A serene spring invitation with a hand-drawn sakura branch, drifting petals and a small red hanko seal on pale cream paper. Blush, charcoal ink and vermilion.",
    categories: ["floral", "minimal", "seasonal", "cultural"],
    keywords: ["cherry blossom wedding invitation", "sakura wedding card", "japanese spring wedding invite", "minimal blush floral invitation"],
    palette: ["#fdf9f3", "#f6cbd6", "#c9677f", "#2b2a2c", "#c3362d"],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
