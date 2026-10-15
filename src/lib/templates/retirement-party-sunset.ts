import { GUEST_TOKEN } from "../design/types";
import type { Layer } from "../design/types";
import { GOLD, H, I, lock, O, P, S, T, W, type TemplateDef } from "./kit";
import { divider, sunburst } from "../design/ornaments";
import { pg } from "./valentines-dinner-rose.art";
import { birds, compass, hills, road, SKY, SKY_DARK, stars, sunDisc } from "./retirement-party-sunset.art";

const CREAM = "#fff1d6";
const SOFT = "#f6d9b0";
const GOLDC = "#f0cf84";

const horizon = (sunY: number, sunR: number, withRoad = true): Layer[] => [
  lock(O(sunburst({ color: "#ffe4a0", rays: 28, size: 2000, core: 0.04 }), { x: 500 - 1000, y: sunY - 1000, opacity: 0.09 })),
  pg(sunDisc(500, sunY, sunR)),
  pg(hills(sunY + 40, 46, 1.2, "#53326a", 5)),
  pg(hills(sunY + 120, 40, 3.1, "#2f2158", 6)),
  ...(withRoad ? [pg(road(sunY + 70))] : []),
  pg(hills(1370, 26, 5.2, "#140f30")),
];

export default function build(): TemplateDef {
  /* --------------------------------- cover --------------------------------- */
  const cover = P(
    SKY,
    [
      pg(stars(8, 70, [20, 20, 980, 560])),
      pg([birds(3, 5, [700, 190, 920, 330])]),
      ...horizon(1120, 140),
      pg(compass(500, 150, 88)),
      T("together we celebrate", 282, { fontFamily: "Cormorant Garamond", italic: true, fontSize: 32, letterSpacing: 3, fill: SOFT }),
      T("Happy", 322, { fontFamily: "Alex Brush", fontSize: 128, lineHeight: 1.2, fill: GOLD, shadow: { color: "#000000", blur: 14, offsetX: 0, offsetY: 4, opacity: 0.4 } }),
      T("Retirement", 480, { x: 40, width: 920, fontFamily: "Cinzel", fontWeight: 600, fontSize: 98, letterSpacing: 8, uppercase: true, fill: CREAM }),
      lock(O(divider({ style: "double", w: 440, color: GOLDC, strokeWidth: 2 }), { cx: 500, y: 612 })),
      T("honouring Mahmud Hossain and 34 years of service", 640, { x: 100, width: 800, fontFamily: "Cormorant Garamond", fontWeight: 500, fontSize: 36, lineHeight: 1.25, fill: CREAM }),
      T("Saturday  ·  19 June 2027  ·  6 PM", 750, { fontFamily: "Cinzel", fontWeight: 500, fontSize: 32, letterSpacing: 5, fill: GOLDC }),
      T("The Skyline Terrace  ·  Dhanmondi, Dhaka", 804, { fontFamily: "Cormorant Garamond", italic: true, fontSize: 32, fill: SOFT }),
      T(GUEST_TOKEN, 862, { fontFamily: "Alex Brush", fontSize: 56, lineHeight: 1.1, fill: "#ffe3a8" }),
    ],
    "Invitation",
  );

  /* -------------------------------- details -------------------------------- */
  const stop = (y: number, time: string, title: string, sub: string): Layer[] => [
    T(time, y, { x: 80, width: 250, align: "right", fontFamily: "Alex Brush", fontSize: 72, lineHeight: 1.1, fill: GOLD }),
    T(title, y + 6, { x: 440, width: 500, align: "left", fontFamily: "Cinzel", fontWeight: 600, fontSize: 31, letterSpacing: 3, uppercase: true, fill: CREAM }),
    T(sub, y + 52, { x: 440, width: 500, align: "left", fontFamily: "Cormorant Garamond", italic: true, fontSize: 30, fill: SOFT }),
    lock(S({ shape: "ellipse", x: 372, y: y + 26, width: 28, height: 28, fill: "#fff2c8", stroke: "#e0b050", strokeWidth: 4 })),
  ];
  const details = P(
    SKY_DARK,
    [
      pg(stars(21, 60, [20, 20, 980, 800])),
      lock(S({ x: 385, y: 450, width: 2, height: 560, fill: "#f0cf84", opacity: 0.55 })),
      pg(compass(500, 120, 64)),
      T("The Journey", 210, { fontFamily: "Alex Brush", fontSize: 108, lineHeight: 1.2, fill: GOLD }),
      T("an evening of golden hour", 346, { fontFamily: "Cinzel", fontSize: 22, letterSpacing: 9, uppercase: true, fill: SOFT }),
      ...stop(440, "6:00", "Golden Hour", "Welcome drinks on the terrace"),
      ...stop(600, "7:00", "Dinner & Toasts", "A long table and kind words"),
      ...stop(760, "8:00", "Memories", "Stories, photos and a few laughs"),
      ...stop(920, "9:00", "Cake & Cheers", "Raise a glass to what comes next"),
      T("Smart casual  ·  Bring a favourite memory", 1060, { x: 80, width: 840, fontFamily: "Cormorant Garamond", fontWeight: 600, fontSize: 34, fill: CREAM }),
      ...horizon(1230, 90, false),
    ],
    "Details",
  );

  /* ------------------------------ photo page ------------------------------ */
  const photo = P(
    SKY,
    [
      pg(stars(33, 60, [20, 20, 980, 500])),
      pg([birds(9, 4, [60, 300, 200, 420])]),
      T("Thirty-four years,", 70, { fontFamily: "Alex Brush", fontSize: 84, lineHeight: 1.2, fill: GOLD }),
      T("one wonderful journey", 168, { fontFamily: "Alex Brush", fontSize: 84, lineHeight: 1.2, fill: GOLD }),
      pg(compass(500, 560, 270)),
      I({ x: 345, y: 405, width: 310, height: 310, mask: "ellipse", placeholderFill: "#7b3b71", borderColor: "#f0cf84", borderWidth: 4 }),
      ...horizon(1090, 120),
      T("Here's to the road ahead", 860, { fontFamily: "Cinzel", fontWeight: 500, fontSize: 34, letterSpacing: 6, uppercase: true, fill: CREAM, shadow: { color: "#000000", blur: 10, offsetX: 0, offsetY: 3, opacity: 0.5 } }),
      T("Come and share the sunset with us", 920, { fontFamily: "Cormorant Garamond", italic: true, fontSize: 36, fill: "#ffe3a8", shadow: { color: "#000000", blur: 10, offsetX: 0, offsetY: 2, opacity: 0.5 } }),
    ],
    "Photo",
  );

  return {
    slug: "retirement-party-sunset",
    name: "Retirement Party Sunset",
    tagline: "Classy golden-hour retirement party invitation with compass and winding road",
    description:
      "An elegant retirement party invitation with a navy-to-amber sunset sky, setting sun, winding road to the horizon and a gold compass rose. Perfect for retirement celebrations, farewell dinners and tributes to a long career.",
    categories: ["party", "classic"],
    keywords: ["retirement party invitation template", "sunset retirement celebration invite", "classy retirement dinner card", "compass road retirement invitation", "golden hour retirement party", "online retirement invitation"],
    palette: ["#0f1b40", "#7b3b71", "#e0714b", "#ffbf5f", "#f0cf84"],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
