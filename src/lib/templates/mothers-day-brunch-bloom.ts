import { GUEST_TOKEN } from "../design/types";
import type { Layer } from "../design/types";
import { H, I, linear, lock, O, P, S, T, W, type TemplateDef } from "./kit";
import { divider } from "../design/ornaments";
import { pg } from "./valentines-dinner-rose.art";
import { bloomCluster, bloomWreath, dots, daisy, ribbon, teacup, tulip } from "./mothers-day-brunch-bloom.art";

const BG = linear(160, [0, "#fff7f1"], [0.5, "#fdebe8"], [1, "#f8dce2"]);
const PLUM = "#5b3347";
const ROSE = "#cf6a86";
const SAGE = "#5f8f78";

const blobs = (): Layer[] => [
  lock(S({ shape: "ellipse", x: -240, y: 620, width: 520, height: 520, fill: "#e6dcf6", opacity: 0.55 })),
  lock(S({ shape: "ellipse", x: 760, y: 360, width: 440, height: 440, fill: "#fde0cc", opacity: 0.6 })),
  lock(S({ shape: "ellipse", x: 120, y: 1100, width: 420, height: 420, fill: "#d9efe2", opacity: 0.55 })),
];

const card = (x: number, y: number, w: number, h: number): Layer[] => [
  lock(S({ x: x + 6, y: y + 8, width: w, height: h, cornerRadius: 30, fill: "#e9c7d1", opacity: 0.55 })),
  lock(S({ x, y, width: w, height: h, cornerRadius: 30, fill: "#fffaf8", stroke: "#f0c3cf", strokeWidth: 3 })),
];

export default function build(): TemplateDef {
  /* --------------------------------- cover --------------------------------- */
  const cover = P(
    BG,
    [
      ...blobs(),
      pg(dots(7, 34, [60, 380, 940, 1000], ["#f6b5c4", "#cdb8ea", "#f9c9a8", "#a9d5bb"], 8)),
      pg(bloomCluster(150, 170, 1.15)),
      pg(bloomCluster(860, 210, 0.95, -1)),
      T("you are warmly invited to a", 470, { fontFamily: "Cormorant Garamond", italic: true, fontSize: 34, fill: SAGE, letterSpacing: 2 }),
      T("Mother's Day", 510, { x: 20, width: 960, fontFamily: "Parisienne", fontSize: 132, lineHeight: 1.2, fill: linear(90, [0, "#d9758f"], [1, "#a8465f"]) }),
      pg(ribbon(150, 708, 700, 96)),
      T("Brunch & Tea", 724, { x: 150, width: 700, fontFamily: "Jost", fontWeight: 500, fontSize: 52, letterSpacing: 14, uppercase: true, fill: "#fff8f4" }),
      T("Sunday  ·  9 May 2027  ·  11 AM", 850, { fontFamily: "Cormorant Garamond", fontWeight: 600, fontSize: 40, letterSpacing: 2, fill: PLUM }),
      T("The Rosemary Garden Tea House  ·  Banani", 908, { fontFamily: "Jost", fontWeight: 500, fontSize: 22, letterSpacing: 4, uppercase: true, fill: SAGE }),
      T(GUEST_TOKEN, 962, { fontFamily: "Parisienne", fontSize: 54, lineHeight: 1.1, fill: ROSE }),
      pg([...tulip(140, 1360, 250, "#f08aa6", "#fbc3d1", -18), ...tulip(235, 1370, 200, "#c7a6e8", "#e6d8f6", 12), ...tulip(860, 1360, 250, "#f6a98a", "#fcd6c4", 18), ...tulip(765, 1370, 200, "#f08aa6", "#fbc3d1", -10)]),
      pg(teacup(500, 1235, 1.05)),
    ],
    "Invitation",
  );

  /* -------------------------------- details -------------------------------- */
  const row = (y: number, time: string, title: string, sub: string, tint: string): Layer[] => [
    ...card(110, y, 780, 150),
    lock(S({ shape: "ellipse", x: 140, y: y + 25, width: 100, height: 100, fill: tint })),
    T(time, y + 56, { x: 140, width: 100, fontFamily: "Jost", fontWeight: 600, fontSize: 26, fill: PLUM, letterSpacing: 0 }),
    T(title, y + 32, { x: 270, width: 590, align: "left", fontFamily: "Parisienne", fontSize: 54, lineHeight: 1.15, fill: ROSE }),
    T(sub, y + 96, { x: 270, width: 590, align: "left", fontFamily: "Cormorant Garamond", fontWeight: 500, fontSize: 29, fill: PLUM }),
  ];
  const details = P(
    BG,
    [
      ...blobs(),
      pg([...bloomCluster(110, 60, 0.62), ...bloomCluster(890, 60, 0.62, -1)]),
      T("A Morning of Moments", 205, { x: 40, width: 920, fontFamily: "Parisienne", fontSize: 82, lineHeight: 1.2, fill: linear(90, [0, "#d9758f"], [1, "#a8465f"]) }),
      T("brunch  ·  tea  ·  flowers", 330, { fontFamily: "Jost", fontSize: 22, letterSpacing: 10, uppercase: true, fill: SAGE }),
      ...row(400, "11:00", "Welcome Sips", "Mimosas, mocktails and fresh blooms", "#f9d0da"),
      ...row(580, "11:30", "Brunch Table", "Pastries, fruit, eggs and sweet things", "#fde0cc"),
      ...row(760, "12:30", "Tea & Cake", "A pot of tea shared with Mum", "#e6dcf6"),
      ...row(940, "1:30", "Flower Making", "Arrange a bouquet to take home", "#d9efe2"),
      T("Dress in soft pastels and florals", 1140, { fontFamily: "Cormorant Garamond", fontWeight: 600, fontSize: 38, fill: PLUM }),
      T("Bring the whole family", 1196, { fontFamily: "Cormorant Garamond", italic: true, fontSize: 32, fill: SAGE }),
      pg([...tulip(140, 1380, 190, "#f08aa6", "#fbc3d1", -10), ...tulip(860, 1380, 190, "#c7a6e8", "#e6d8f6", 10), ...daisy(500, 1330, 36)]),
    ],
    "Details",
  );

  /* ------------------------------ photo page ------------------------------ */
  const photo = P(
    BG,
    [
      ...blobs(),
      pg(dots(11, 26, [60, 60, 940, 1340], ["#f6b5c4", "#cdb8ea", "#f9c9a8", "#a9d5bb"], 8)),
      T("Thank you, Mum", 90, { x: 60, width: 880, fontFamily: "Parisienne", fontSize: 110, lineHeight: 1.2, fill: linear(90, [0, "#d9758f"], [1, "#a8465f"]) }),
      I({ x: 250, y: 330, width: 500, height: 500, mask: "ellipse", placeholderFill: "#f3c6d2" }),
      pg(bloomWreath(500, 580, 272)),
      lock(O(divider({ style: "floral", w: 420, color: "#cf6a86", strokeWidth: 2 }), { cx: 500, y: 960 })),
      T("For every hug, every story and every cup of tea,", 1020, { x: 100, width: 800, fontFamily: "Cormorant Garamond", italic: true, fontSize: 34, fill: PLUM }),
      T("let us celebrate you together.", 1068, { x: 100, width: 800, fontFamily: "Cormorant Garamond", italic: true, fontSize: 34, fill: PLUM }),
      T("See you at brunch", 1150, { fontFamily: "Parisienne", fontSize: 76, lineHeight: 1.2, fill: ROSE }),
      pg(teacup(500, 1340, 0.5)),
    ],
    "Photo",
  );

  return {
    slug: "mothers-day-brunch-bloom",
    name: "Mother's Day Brunch Bloom",
    tagline: "Pastel floral Mother's Day brunch and tea party invitation",
    description:
      "A soft pastel Mother's Day brunch invitation with hand-built peonies, daisies and tulips, a porcelain teacup and a satin ribbon banner. Ideal for Mother's Day tea parties, family brunches and garden luncheons.",
    categories: ["holiday", "party", "floral"],
    keywords: ["mothers day brunch invitation", "mothers day tea party invite template", "pastel floral brunch invitation", "spring tea party invitation teacup", "mothers day luncheon card", "online mothers day party invite"],
    palette: ["#fdebe8", "#d9758f", "#cdb8ea", "#a9d5bb", "#5b3347"],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
