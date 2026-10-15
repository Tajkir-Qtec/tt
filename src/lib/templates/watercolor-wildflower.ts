import { divider } from "../design/ornaments";
import { GUEST_TOKEN } from "../design/types";
import type { Layer } from "../design/types";
import { flecks, meadow } from "./watercolor-wildflower.art";
import { wDetails } from "./wedding-details";
import { H, I, linear, lock, O, P, radial, S, T, W, type TemplateDef } from "./kit";

const PLUM = "#5a3a63";
const ROSE = "#b0698a";
const INK = "#6a5a6e";

/** A pooled watercolor wash: soft body plus a slightly darker rim. */
function wash(x: number, y: number, w: number, h: number, rgb: string, a: number, rot = 0): Layer[] {
  const mk = (dx: number, dy: number, sw: number, sh: number, alpha: number, rr: number) =>
    lock(
      S({
        shape: "ellipse",
        x: x + dx,
        y: y + dy,
        width: w * sw,
        height: h * sh,
        rotation: rot + rr,
        fill: radial([0, `rgba(${rgb},${alpha * 0.62})`], [0.55, `rgba(${rgb},${alpha * 0.78})`], [0.86, `rgba(${rgb},${alpha})`], [1, `rgba(${rgb},0)`]),
      }),
    );
  return [mk(0, 0, 1, 1, a, 0), mk(w * 0.12, h * 0.1, 0.7, 0.72, a * 0.8, 24)];
}

const BLUSH = "246,184,198";
const LILAC = "190,172,224";
const BUTTER = "248,226,150";
const SKY = "168,204,230";
const SAGE = "166,200,168";
const PEACH = "250,201,172";

const bg = linear(90, [0, "#fdfaf5"], [0.5, "#fbf6ee"], [1, "#f8f1e8"]);

function paper(): Layer[] {
  return [
    lock(S({ shape: "rect", x: 0, y: 0, width: W, height: H, fill: radial([0, "rgba(255,255,255,0.7)"], [1, "rgba(235,224,208,0.35)"]) })),
  ];
}

export default function watercolorWildflower(): TemplateDef {
  const cover = P(
    bg,
    [
      ...paper(),
      ...wash(-260, -200, 760, 640, BLUSH, 0.4, 20),
      ...wash(560, -170, 640, 560, LILAC, 0.36, -15),
      ...wash(-220, 470, 520, 520, SKY, 0.26, 10),
      ...wash(720, 430, 480, 500, BUTTER, 0.34, -20),
      ...wash(-100, 1000, 1200, 560, SAGE, 0.32, 0),
      ...wash(380, 1090, 700, 420, PEACH, 0.28, 8),
      lock(O(flecks(5, W, 820, 46), { x: 0, y: 40, width: W })),
      lock(O(meadow({ seed: 11, w: 1000, h: 640, count: 40, edgeLift: 1.0, base: 120 }), { x: 0, y: H - 640, width: 1000 })),
      lock(O(meadow({ seed: 23, w: 330, h: 330, count: 6, edgeLift: 0.2, base: 90, spread: [0, 200] }), { x: -20, y: -10, width: 330, flipY: true, rotation: 0 })),
      lock(O(meadow({ seed: 37, w: 330, h: 330, count: 6, edgeLift: 0.2, base: 90, spread: [0, 200] }), { x: 690, y: -10, width: 330, flipY: true, flipX: true })),
      T(GUEST_TOKEN, 112, { x: 300, width: 400, fontFamily: "Cormorant Garamond", italic: true, fontSize: 30, letterSpacing: 2, fill: ROSE }),
      T("TOGETHER WITH THEIR FAMILIES", 186, { x: 200, width: 600, fontFamily: "Jost", fontSize: 17, letterSpacing: 8, fill: INK }),
      T("joyfully invite you to celebrate the wedding of", 224, { x: 160, width: 680, fontFamily: "Cormorant Garamond", italic: true, fontSize: 29, fill: INK }),
      T("Olivia", 276, { x: 120, width: 760, fontFamily: "Pinyon Script", fontSize: 168, fill: PLUM }),
      T("&", 470, { x: 120, width: 760, fontFamily: "Cormorant Garamond", italic: true, fontSize: 62, fill: ROSE }),
      T("Benjamin", 520, { x: 120, width: 760, fontFamily: "Pinyon Script", fontSize: 168, fill: PLUM }),
      O(divider({ style: "leaf", w: 300, color: ROSE }), { cx: W / 2, y: 740, width: 300 }),
      T("Saturday", 800, { x: 200, width: 600, fontFamily: "Jost", fontSize: 18, letterSpacing: 10, uppercase: true, fill: INK }),
      T("14 · 06 · 2027", 832, { x: 200, width: 600, fontFamily: "Cormorant Garamond", fontWeight: 500, fontSize: 64, fill: PLUM }),
      T("at four o'clock in the afternoon", 914, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontSize: 27, fill: INK }),
      T("Meadowlark Farm", 962, { x: 200, width: 600, fontFamily: "Cormorant Garamond", fontWeight: 600, fontSize: 32, letterSpacing: 5, uppercase: true, fill: PLUM }),
      T("Willow Creek Road, Hudson Valley", 1006, { x: 200, width: 600, fontFamily: "Jost", fontSize: 18, letterSpacing: 2, fill: INK }),
    ],
    "Invitation",
  );

  const details = P(
    bg,
    [
      ...paper(),
      ...wash(-240, -220, 700, 560, LILAC, 0.34, 10),
      ...wash(600, -160, 600, 500, BLUSH, 0.34, -10),
      ...wash(300, 520, 600, 500, BUTTER, 0.16, 0),
      ...wash(-100, 1080, 1200, 520, SAGE, 0.3, 0),
      lock(O(flecks(9, W, 900, 30), { x: 0, y: 60, width: W })),
      lock(O(meadow({ seed: 51, w: 1000, h: 330, count: 28, edgeLift: 1.0, base: 40 }), { x: 0, y: H - 330, width: 1000 })),
      lock(O(meadow({ seed: 61, w: 300, h: 300, count: 5, edgeLift: 0.2, base: 80, spread: [0, 190] }), { x: -20, y: -10, width: 300, flipY: true })),
      lock(O(meadow({ seed: 71, w: 300, h: 300, count: 5, edgeLift: 0.2, base: 80, spread: [0, 190] }), { x: 720, y: -10, width: 300, flipY: true, flipX: true })),
      ...wDetails({
        heading: "The Details",
        headFont: "Pinyon Script",
        headSize: 110,
        headFill: PLUM,
        labelFont: "Jost",
        labelFill: ROSE,
        strongFont: "Cormorant Garamond",
        strongFill: PLUM,
        strongWeight: 500,
        bodyFont: "Cormorant Garamond",
        bodyFill: INK,
        accent: ROSE,
        divider: "leaf",
        events: [
          ["Ceremony", "4:00 PM"],
          ["Garden Reception", "5:00 PM"],
          ["Dinner & Dancing", "6:30 PM"],
        ],
        venue: "Meadowlark Farm",
        address: "Willow Creek Road, Hudson Valley\nNew York 12534",
        dress: ["Dress Code", "Garden party  ·  Soft pastels"],
        closing: ["With Love", "Come celebrate among the wildflowers"],
        y0: 130,
        x: 180,
        gap: 0.84,
      }),
    ],
    "Details",
  );

  const photo = P(
    bg,
    [
      ...paper(),
      ...wash(-200, -100, 760, 700, BLUSH, 0.34, 15),
      ...wash(480, 60, 700, 700, LILAC, 0.34, -10),
      ...wash(100, 280, 700, 620, BUTTER, 0.2, 0),
      ...wash(-100, 1080, 1200, 520, SAGE, 0.3, 0),
      lock(O(flecks(13, W, 900, 36), { x: 0, y: 40, width: W })),
      lock(O(meadow({ seed: 81, w: 1000, h: 420, count: 32, edgeLift: 1.0, base: 90 }), { x: 0, y: H - 420, width: 1000 })),
      lock(S({ shape: "ellipse", x: 230, y: 130, width: 540, height: 660, fill: "#ffffff", opacity: 0.8 })),
      I({ x: 244, y: 144, width: 512, height: 632, mask: "ellipse", placeholderFill: "#ece4e8", borderColor: "#ffffff", borderWidth: 6, name: "Photo" }),
      T("Olivia & Benjamin", 826, { x: 120, width: 760, fontFamily: "Pinyon Script", fontSize: 84, fill: PLUM }),
      T("Two hearts, one wildflower love.", 944, { x: 160, width: 680, fontFamily: "Cormorant Garamond", italic: true, fontSize: 34, fill: INK }),
      T("14 · 06 · 2027", 1000, { x: 200, width: 600, fontFamily: "Jost", fontSize: 20, letterSpacing: 10, fill: ROSE }),
    ],
    "Our Story",
  );

  return {
    slug: "watercolor-wildflower",
    name: "Watercolor Wildflower",
    tagline: "Airy romantic watercolor wildflower meadow wedding invitation",
    description:
      "A soft, romantic wedding invitation with hand-painted style watercolor washes and a wildflower meadow of daisies, cosmos, poppies and lavender in blush, lilac and butter yellow, finished with deep plum calligraphy. Perfect for garden, spring, summer and countryside weddings.",
    categories: ["floral", "nature", "boho", "seasonal"],
    keywords: ["watercolor wildflower wedding invitation", "meadow garden wedding card", "pastel floral wedding invite", "spring wedding invitation wildflowers", "romantic boho floral invitation"],
    palette: ["#fdfaf5", "#f6b8c6", "#beace0", "#a6c8a8", "#5a3a63"],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
