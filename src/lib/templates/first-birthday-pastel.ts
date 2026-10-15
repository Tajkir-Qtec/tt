import { rainbow } from "../design/ornaments";
import { GUEST_TOKEN } from "../design/types";
import type { Layer } from "../design/types";
import { H, I, linear, lock, O, P, S, T, W, type TemplateDef } from "./kit";
import { balloon, confetti, dot, heartAt, sparkAt, starAt } from "./birthday-balloons-bold.art";
import { archBands, cloud, starGarland } from "./first-birthday-pastel.art";

const CREAM = "#fbf5ea";
const BLUSH = "#f2c6c0";
const BLUSH_D = "#e29f95";
const SAGE = "#bfd3b4";
const SAGE_D = "#8fae86";
const BUTTER = "#f7e3a6";
const BUTTER_D = "#e6c46a";
const SKY = "#bcd8e4";
const TERRA = "#e8b49c";
const INK = "#6a574f";
const SOFT = "#9a8a80";

const BG = linear(90, [0, "#fdf8ee"], [1, "#f8efe0"]);
const RB = [BLUSH_D, TERRA, BUTTER_D, SAGE_D, "#8bb5c8"];

const PB = {
  blush: { light: "#fde1dc", base: "#f2b5ad", dark: "#df8f86" },
  sage: { light: "#e1eed9", base: "#b3cca7", dark: "#88a97d" },
  butter: { light: "#fff3cb", base: "#f5d985", dark: "#e1b84f" },
  sky: { light: "#dff0f7", base: "#a8cfe0", dark: "#78aac2" },
};

const blob = (x: number, y: number, s: number, fill: string, op = 0.5): Layer => lock(S({ shape: "ellipse", x, y, width: s, height: s * 0.9, fill, opacity: op }));
const script = (text: string, y: number, size: number, o: Record<string, unknown> = {}) =>
  T(text, y, { x: 80, width: 840, fontFamily: "Sacramento", fontSize: size, lineHeight: 1.1, fill: INK, ...o });
const cap = (text: string, y: number, o: Record<string, unknown> = {}) =>
  T(text, y, { x: 150, width: 700, fontFamily: "Josefin Sans", fontWeight: 600, fontSize: 20, letterSpacing: 9, uppercase: true, fill: BLUSH_D, ...o });

export default function build(): TemplateDef {
  const conf = (seed: number, n: number, skip: (x: number, y: number) => boolean) =>
    confetti({ seed, count: n, colors: [BLUSH, SAGE, BUTTER, SKY, "#ffffff"], area: [20, 20, 980, 1380], skip, size: 0.8, opacity: 0.9 });

  /* --------------------------------- cover --------------------------------- */
  const cover = P(
    BG,
    [
      blob(-200, -140, 640, BLUSH, 0.4),
      blob(620, 900, 640, SAGE, 0.4),
      blob(640, -80, 420, BUTTER, 0.35),
      conf(4, 50, (x, y) => (x > 100 && x < 900 && y > 100 && y < 1250)),
      lock(O(rainbow({ colors: RB, size: 760, band: 52 }), { cx: W / 2, y: 70 })),
      cloud(250, 410, 360, "#ffffff", "#ece3d4"),
      cloud(750, 410, 360, "#ffffff", "#ece3d4"),
      starAt(500, 230, 56, BUTTER_D, 0),
      sparkAt(150, 200, 34, BUTTER_D),
      sparkAt(850, 190, 28, BLUSH_D),
      // ONE
      T("O", 480, { x: 190, width: 320, fontFamily: "Fraunces", fontWeight: 600, fontSize: 290, lineHeight: 1, fill: BLUSH_D }),
      T("N", 480, { x: 410, width: 320, fontFamily: "Fraunces", fontWeight: 600, fontSize: 290, lineHeight: 1, fill: SAGE_D }),
      T("E", 480, { x: 600, width: 320, fontFamily: "Fraunces", fontWeight: 600, fontSize: 290, lineHeight: 1, fill: BUTTER_D }),
      // balloons tied to clouds
      balloon(100, 520, 56, 70, PB.blush, { tilt: -8, stringTo: [110, 715], stringBend: 22, stringColor: "#b9a595" }),
      balloon(150, 640, 46, 58, PB.sky, { tilt: 7, stringTo: [110, 715], stringBend: -18, stringColor: "#b9a595" }),
      balloon(900, 520, 56, 70, PB.sage, { tilt: 8, stringTo: [890, 715], stringBend: -22, stringColor: "#b9a595" }),
      balloon(850, 640, 46, 58, PB.butter, { tilt: -7, stringTo: [890, 715], stringBend: 18, stringColor: "#b9a595" }),
      cloud(110, 740, 190, "#ffffff", "#ece3d4"),
      cloud(890, 740, 190, "#ffffff", "#ece3d4"),
      cap("Join us to celebrate", 790, { fontSize: 18 }),
      script("Oliver's First Birthday", 812, 90),
      T("Saturday, May 17  ·  11 AM", 940, { x: 150, width: 700, fontFamily: "Fraunces", fontWeight: 500, fontSize: 36, fill: INK }),
      T("The Garden Room at Willow Café", 1000, { x: 120, width: 760, fontFamily: "Josefin Sans", fontWeight: 600, fontSize: 22, letterSpacing: 3, uppercase: true, fill: SAGE_D }),
      T("22 Orchard Lane", 1042, { x: 150, width: 700, fontFamily: "Josefin Sans", fontWeight: 400, fontSize: 22, letterSpacing: 2, fill: SOFT }),
      heartAt(500, 1135, 34, BLUSH_D, 0),
      T(GUEST_TOKEN, 1175, { x: 250, width: 500, fontFamily: "Sacramento", fontSize: 64, lineHeight: 1.1, fill: BLUSH_D }),
    ],
    "Invitation",
  );

  /* -------------------------------- details -------------------------------- */
  const archCard = (x: number, fill: string, icon: Layer, head: string, big: string, small: string): Layer[] => {
    const w = 270;
    const top = 380;
    const h = 560;
    return [
      lock(S({ shape: "ellipse", x, y: top, width: w, height: w, fill })),
      lock(S({ x, y: top + w / 2 - 40, width: w, height: h - w / 2 + 40, fill, cornerRadius: 22 })),
      lock(S({ x, y: top + w / 2, width: w, height: 70, fill })),
      icon,
      T(head, top + 215, { x, width: w, fontFamily: "Josefin Sans", fontWeight: 600, fontSize: 17, letterSpacing: 7, uppercase: true, fill: SOFT }),
      T(big, top + 262, { x: x + 10, width: w - 20, fontFamily: "Fraunces", fontWeight: 600, fontSize: 40, lineHeight: 1.1, fill: INK }),
      T(small, top + 410, { x: x + 20, width: w - 40, fontFamily: "Josefin Sans", fontWeight: 400, fontSize: 21, lineHeight: 1.45, fill: INK, opacity: 0.85 }),
    ];
  };
  const details = P(
    BG,
    [
      blob(-220, 900, 640, SAGE, 0.3),
      blob(640, -160, 560, BLUSH, 0.38),
      conf(9, 40, (x, y) => x > 60 && x < 940 && y > 180 && y < 1120),
      starGarland(-20, 40, 1020, 40, 70, [BLUSH, SAGE, BUTTER, SKY], 12, 44),
      cap("Little details", 190),
      script("A Day to Remember", 215, 104),
      ...archCard(50, "#f9dcd7", starAt(185, 460, 54, BLUSH_D, 0), "When", "Saturday\nMay 17", "Eleven in the morning until two in the afternoon"),
      ...archCard(365, "#dde9d4", heartAt(500, 460, 54, SAGE_D, 0), "Where", "Willow\nCafé", "The Garden Room\n22 Orchard Lane"),
      ...archCard(680, "#fbefc6", sparkAt(815, 460, 54, BUTTER_D), "Wear", "Soft &\nCozy", "Pastels, linen and your comfiest layers"),
      script("Lunch, cake & lots of cuddles", 1010, 84),
      cloud(150, 1290, 300, "#ffffff", "#ece3d4"),
      cloud(850, 1290, 300, "#ffffff", "#ece3d4"),
      starAt(500, 1250, 36, BUTTER_D, 0),
      sparkAt(330, 1230, 28, BLUSH_D),
      sparkAt(680, 1240, 28, SAGE_D),
    ],
    "Details",
  );

  /* ------------------------------- photo page ------------------------------- */
  const photo = P(
    BG,
    [
      blob(-200, -140, 600, SAGE, 0.38),
      blob(600, 940, 640, BLUSH, 0.4),
      conf(15, 45, (x, y) => (x > 90 && x < 910 && y > 110 && y < 1200)),
      cap("12 months of giggles", 105),
      lock(archBands(500, 170, 920, 640, [BLUSH, TERRA, BUTTER, SAGE, SKY], 22)),
      I({ x: 290, y: 280, width: 420, height: 640, mask: "arch", placeholderFill: "#f3dcd2" }),
      balloon(120, 560, 56, 70, PB.blush, { tilt: -8, stringTo: [160, 900], stringBend: 20, stringColor: "#b9a595" }),
      balloon(880, 540, 56, 70, PB.sage, { tilt: 8, stringTo: [840, 900], stringBend: -20, stringColor: "#b9a595" }),
      balloon(175, 700, 46, 58, PB.butter, { tilt: 6, stringTo: [160, 900], stringBend: -14, stringColor: "#b9a595" }),
      balloon(825, 690, 46, 58, PB.sky, { tilt: -6, stringTo: [840, 900], stringBend: 14, stringColor: "#b9a595" }),
      cloud(160, 930, 240, "#ffffff", "#ece3d4"),
      cloud(840, 930, 240, "#ffffff", "#ece3d4"),
      script("One year of love", 1010, 104),
      T("Oliver's first trip around the sun", 1125, { x: 150, width: 700, fontFamily: "Fraunces", fontWeight: 400, italic: true, fontSize: 32, fill: INK }),
      T("365 days  ·  52 weeks  ·  1 happy baby", 1190, { x: 120, width: 760, fontFamily: "Josefin Sans", fontWeight: 600, fontSize: 18, letterSpacing: 6, uppercase: true, fill: SAGE_D }),
      starAt(500, 1290, 40, BUTTER_D, 0),
      sparkAt(400, 1290, 24, BLUSH_D),
      sparkAt(600, 1290, 24, SKY),
    ],
    "Memories",
  );

  return {
    slug: "first-birthday-pastel",
    name: "First Birthday Pastel",
    tagline: "Soft boho pastel invitation for a baby's 1st birthday",
    description:
      "A gentle boho first birthday invitation with a pastel rainbow arch, fluffy clouds, balloons and stars in sage, blush and butter. Hand-lettered 'ONE' makes baby's big day sweet and photo-ready.",
    categories: ["birthday", "baby", "boho", "party"],
    keywords: ["first birthday invitation template", "boho rainbow 1st birthday invite", "pastel baby birthday invitation", "one year old birthday party invitation", "rainbow arch first birthday card"],
    palette: [CREAM, BLUSH, SAGE, BUTTER, INK],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
