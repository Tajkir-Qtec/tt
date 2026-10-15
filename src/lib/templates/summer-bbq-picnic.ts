import { GUEST_TOKEN } from "../design/types";
import type { Layer } from "../design/types";
import { banner } from "../design/ornaments";
import { H, I, lock, O, P, S, T, W, type TemplateDef } from "./kit";
import { burger, dotL, extrude, gingham, grill, lemonade, pennants, scallopEdge, sticker, sun, watermelon } from "./summer-party.art";

const CREAM = "#fbf1da";
const RED = "#d8402f";
const DRED = "#a82a1e";
const MUST = "#f2b632";
const INK = "#3a2a22";
const TEAL = "#2b8a8a";
const FLAGS = [RED, MUST, "#fff6e0", TEAL];

const label = (text: string, y: number, o: Record<string, unknown> = {}) =>
  T(text, y, { x: 150, width: 700, fontFamily: "Poppins", fontWeight: 700, fontSize: 22, letterSpacing: 9, uppercase: true, fill: INK, ...o });

const cloth = (): Layer[] => [gingham(0, 0, 1000, 1400, 50, RED, 0.2)];

const ticket = (x: number, y: number, w: number, h: number): Layer[] => [
  ...sticker(x, y, w, h, "#fffaf0", { shadow: INK, stroke: INK, r: 34, off: 8, sw: 4 }),
  lock(S({ x: x + 14, y: y + 14, width: w - 28, height: h - 28, cornerRadius: 24, fill: null, stroke: RED, strokeWidth: 2.5, dash: [10, 8] })),
];

export default function build(): TemplateDef {
  /* --------------------------------- cover --------------------------------- */
  const cover = P(
    CREAM,
    [
      ...cloth(),
      pennants(-20, 24, 1020, 24, 64, FLAGS, 15, 66),
      lock(sun(890, 235, 48, 14, MUST, "#f6c54a")),
      label("You're invited to a", 150, { fontSize: 22, fill: DRED }),
      T("Backyard", 190, { x: 100, width: 800, fontFamily: "Satisfy", fontSize: 150, lineHeight: 1.1, fill: DRED }),
      ...extrude("BBQ", { x: 40, y: 290, width: 920, fontSize: 340, font: "Abril Fatface", face: RED, side: INK, depth: 12, step: 1.8, letterSpacing: 6 }),
      lock(O(banner({ color: MUST, w: 700, h: 100, stroke: INK }), { cx: W / 2, y: 672 })),
      T("& Summer Picnic", 694, { x: 200, width: 600, fontFamily: "Abril Fatface", fontSize: 46, lineHeight: 1.1, fill: INK }),
      // illustrations
      grill(190, 1010, 0.92),
      burger(500, 905, 240),
      lemonade(815, 1010, 1.1),
      watermelon(665, 975, 58),
      // ticket
      ...ticket(110, 1050, 780, 264),
      T("Saturday, June 26, 2027", 1078, { x: 130, width: 740, fontFamily: "Abril Fatface", fontSize: 54, lineHeight: 1.1, fill: RED }),
      T("12 noon  till  sunset", 1148, { x: 130, width: 740, fontFamily: "Poppins", fontWeight: 700, fontSize: 26, letterSpacing: 6, uppercase: true, fill: INK }),
      lock(S({ x: 330, y: 1196, width: 340, height: 3, fill: MUST })),
      T("The Karim Family Backyard", 1212, { x: 130, width: 740, fontFamily: "Poppins", fontWeight: 600, fontSize: 28, fill: INK }),
      T("27 Orchard Lane, Dhanmondi", 1254, { x: 130, width: 740, fontFamily: "Poppins", fontWeight: 500, fontSize: 22, fill: INK, opacity: 0.75 }),
      T(GUEST_TOKEN, 1338, { x: 200, width: 600, fontFamily: "Satisfy", fontSize: 46, lineHeight: 1.1, fill: DRED }),
    ],
    "Invitation",
  );

  /* -------------------------------- details -------------------------------- */
  const row = (y: number, head: string, big: string, small: string, icon: Layer[], fill = "#fffaf0"): Layer[] => [
    ...sticker(100, y, 800, 214, fill, { shadow: INK, stroke: INK, r: 34, off: 8, sw: 4 }),
    dotL(250, y + 107, 168, "#fbe4a8", 1, INK, 3),
    ...icon,
    T(head, y + 36, { x: 380, width: 490, align: "left", fontFamily: "Poppins", fontWeight: 700, fontSize: 19, letterSpacing: 7, uppercase: true, fill: RED }),
    T(big, y + 66, { x: 380, width: 500, align: "left", fontFamily: "Abril Fatface", fontSize: 44, lineHeight: 1.1, fill: INK }),
    T(small, y + 130, { x: 380, width: 490, align: "left", fontFamily: "Poppins", fontWeight: 500, fontSize: 22, fill: INK, opacity: 0.8, lineHeight: 1.35 }),
  ];
  const details = P(
    CREAM,
    [
      ...cloth(),
      pennants(-20, 24, 1020, 24, 64, FLAGS.slice().reverse(), 15, 66),
      label("Fire up the grill", 150, { fontSize: 22, fill: DRED }),
      T("What's Cooking", 190, { x: 80, width: 840, fontFamily: "Abril Fatface", fontSize: 108, lineHeight: 1.1, fill: RED, shadow: { color: INK, blur: 0, offsetX: 4, offsetY: 4, opacity: 1 } }),
      ...row(370, "On the grill", "Burgers & Kebabs", "Beef, chicken and veggie skewers, corn on the cob", [burger(250, 480, 120)]),
      ...row(620, "To drink", "Fresh Lemonade", "Iced tea, mint coolers and watermelon juice", [lemonade(250, 790, 0.5)]),
      ...row(870, "Lawn games", "Cricket & Sack Race", "Tug of war, frisbee and a dessert contest", [watermelon(250, 950, 60)]),
      ...ticket(150, 1120, 700, 160),
      T("Bring a blanket and an appetite", 1148, { x: 180, width: 640, fontFamily: "Satisfy", fontSize: 52, lineHeight: 1.15, fill: DRED }),
      T("Casual summer wear  ·  Comfy shoes", 1228, { x: 180, width: 640, fontFamily: "Poppins", fontWeight: 600, fontSize: 18, letterSpacing: 3, uppercase: true, fill: INK, opacity: 0.8 }),
      scallopEdge(0, 1372, 1000, 26, RED, INK),
    ],
    "Details",
  );

  /* ------------------------------ photo page ------------------------------ */
  const tape = (x: number, y: number, rot: number): Layer => lock(S({ x, y, width: 150, height: 46, fill: MUST, opacity: 0.88, rotation: rot }));
  const photo = P(
    CREAM,
    [
      ...cloth(),
      pennants(-20, 24, 1020, 24, 64, FLAGS, 15, 66),
      label("Good food, good friends", 150, { fontSize: 22, fill: DRED }),
      T("Come Hungry!", 190, { x: 60, width: 880, fontFamily: "Abril Fatface", fontSize: 116, lineHeight: 1.1, fill: RED, shadow: { color: INK, blur: 0, offsetX: 4, offsetY: 4, opacity: 1 } }),
      lock(S({ x: 215, y: 360, width: 590, height: 680, cornerRadius: 10, fill: INK, rotation: -2 })),
      lock(S({ x: 205, y: 350, width: 590, height: 680, cornerRadius: 10, fill: "#ffffff", stroke: INK, strokeWidth: 4, rotation: -2 })),
      { ...I({ x: 237, y: 382, width: 526, height: 526, mask: "rect", placeholderFill: "#f3c987" }), rotation: -2 },
      tape(240, 330, -12),
      tape(610, 336, 10),
      T("Summer 2027", 944, { x: 230, width: 540, fontFamily: "Satisfy", fontSize: 54, lineHeight: 1.1, fill: DRED, rotation: -2 }),
      burger(140, 1110, 130),
      lemonade(860, 1190, 0.78),
      T("Burgers on the grill, lemonade on ice", 1086, { x: 230, width: 540, fontFamily: "Poppins", fontWeight: 600, fontSize: 25, lineHeight: 1.4, fill: INK }),
      T("and the whole neighbourhood invited.", 1126, { x: 230, width: 540, fontFamily: "Poppins", fontWeight: 600, fontSize: 25, lineHeight: 1.4, fill: INK }),
      T("See you at the BBQ!", 1190, { x: 130, width: 740, fontFamily: "Abril Fatface", fontSize: 60, lineHeight: 1.1, fill: DRED }),
      scallopEdge(0, 1372, 1000, 26, RED, INK),
    ],
    "Photo",
  );

  return {
    slug: "summer-bbq-picnic",
    name: "Summer BBQ Picnic",
    tagline: "Retro gingham backyard BBQ and picnic invitation",
    description:
      "A cheerful retro backyard BBQ invitation with red gingham, a kettle grill, burgers, lemonade and bunting in red, mustard and cream. Great for summer cookouts, family picnics, block parties and Fourth of July get-togethers.",
    categories: ["party", "summer", "festive", "classic", "birthday"],
    keywords: ["backyard bbq invitation template", "summer cookout party invite", "gingham picnic invitation card", "retro barbecue party invitation", "family reunion bbq invite", "lemonade and grill summer party"],
    palette: ["#fbf1da", "#d8402f", "#f2b632", "#2b8a8a", "#3a2a22"],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
