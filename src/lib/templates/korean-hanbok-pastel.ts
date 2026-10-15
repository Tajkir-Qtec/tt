import { GUEST_TOKEN } from "../design/types";
import type { Layer } from "../design/types";
import { archPath } from "../design/ornaments";
import { H, I, lock, P, S, T, W, type TemplateDef } from "./kit";
import { place } from "./summer-party.art";
import { K, PASTELS, archRow, blossomScatter, blossomSpecs, creamBg, falling, hanjiFibers, maedeup, plumBranch } from "./korean-hanbok-pastel.art";

const cap = (text: string, y: number, o: Record<string, unknown> = {}) =>
  T(text, y, { fontFamily: "Jost", fontWeight: 500, fontSize: 21, letterSpacing: 9, uppercase: true, fill: K.rose, ...o });
const display = { fontFamily: "Italiana", fill: K.plum, lineHeight: 1.05 } as const;
const body = { fontFamily: "Cormorant Garamond", fill: K.ink } as const;

/** White blossoms resting on each arch. */
const archBlossoms = (heights: number[], gap = 6) => {
  const n = heights.length;
  const w = (1000 - gap * (n - 1)) / n;
  const specs = heights.flatMap((h, i) => blossomSpecs(i * (w + gap) + w / 2, 1400 - h + Math.min(150, h * 0.5), 34 + (h % 5) * 6, i * 1.3, "#ffffff", "#ffffff"));
  return lock(place(specs, 2));
};

export default function build(): TemplateDef {
  const fibers = () => lock(hanjiFibers(7, 260));

  /* --------------------------------- cover --------------------------------- */
  const heights = [380, 450, 520, 450, 380];
  const [wood, buds, flowers] = plumBranch(
    [
      [[-30, 150], [120, 104], [262, 142], [430, 112]],
      [[120, 104], [170, 40], [240, 4]],
      [[262, 142], [300, 224], [338, 270]],
    ],
    [[44, 130, 34, 0.2], [116, 92, 30, 1], [172, 52, 26, 2], [240, 24, 22, 0.5], [262, 136, 34, 0.7], [336, 128, 28, 1.5], [418, 108, 30, 0.3], [306, 224, 28, 2.2], [344, 270, 24, 1]],
    [[200, 126, 7], [156, 44, 6], [380, 124, 7], [284, 190, 6], [84, 108, 6]],
  );
  const cover = P(
    creamBg,
    [
      fibers(),
      lock(falling(3, [20, 300, 980, 900], 12, (x, y) => x > 140 && x < 860 && y > 340 && y < 860)),
      lock(archRow(heights)),
      archBlossoms(heights),
      lock(wood),
      lock(buds),
      lock(flowers),
      ...maedeup(900, 188, 0.85).map(lock),
      cap("Together with their families", 300),
      T("Seo-yeon", 346, { ...display, fontSize: 124, x: 100, width: 800 }),
      T("&", 468, { ...body, italic: true, fontSize: 54, lineHeight: 1, fill: K.rose }),
      T("Min-jun", 514, { ...display, fontSize: 124, x: 100, width: 800 }),
      T("Saturday, 10 April 2027", 662, { fontFamily: "Jost", fontWeight: 500, fontSize: 27, letterSpacing: 6, uppercase: true, fill: K.ink }),
      T("Hanok Garden House  ·  Seoul", 712, { ...body, italic: true, fontSize: 33 }),
      T(GUEST_TOKEN, 772, { ...body, italic: true, fontWeight: 600, fontSize: 42, fill: K.rose, lineHeight: 1.1 }),
    ],
    "Invitation",
  );

  /* -------------------------------- details -------------------------------- */
  const row = (y: number, fill: string, time: string, ap: string, title: string, sub: string): Layer[] => [
    lock(S({ x: 90, y, width: 820, height: 156, fill, cornerRadius: 30 })),
    lock(S({ x: 330, y: y + 28, width: 2, height: 100, fill: "#ffffff", opacity: 0.9 })),
    T(time, y + 28, { ...display, x: 100, width: 220, fontSize: 60 }),
    T(ap, y + 98, { x: 100, width: 220, fontFamily: "Jost", fontWeight: 500, fontSize: 20, letterSpacing: 8, fill: K.plum }),
    T(title, y + 30, { x: 360, width: 520, align: "left", fontFamily: "Cormorant Garamond", fontWeight: 700, fontSize: 42, lineHeight: 1.1, fill: K.plum }),
    T(sub, y + 86, { x: 360, width: 520, align: "left", ...body, italic: true, fontSize: 29, lineHeight: 1.2 }),
  ];
  const [wood2, buds2, flowers2] = plumBranch(
    [
      [[1030, 60], [900, 100], [800, 80]],
      [[900, 100], [850, 170], [790, 190]],
    ],
    [[930, 90, 32, 0.4], [868, 104, 28, 1.2], [810, 84, 30, 2], [800, 188, 26, 0.9], [850, 160, 22, 0.1]],
    [[890, 70, 6], [830, 130, 6]],
  );
  const heights2 = [150, 200, 250, 200, 150];
  const details = P(
    creamBg,
    [
      fibers(),
      lock(archRow(heights2)),
      archBlossoms(heights2.map((h) => h - 24)),
      lock(wood2),
      lock(buds2),
      lock(flowers2),
      ...maedeup(110, 130, 0.62).map(lock),
      cap("The celebration", 200),
      T("Wedding Day", 240, { ...display, fontSize: 108 }),
      T("Saturday, 10 April 2027", 372, { fontFamily: "Jost", fontWeight: 500, fontSize: 25, letterSpacing: 6, uppercase: true, fill: K.ink }),
      ...row(450, K.pink, "11:30", "AM", "Ceremony", "Vows in the hanok courtyard"),
      ...row(626, K.mint, "1:00", "PM", "Pyebaek", "Traditional bows to the families"),
      ...row(802, K.lavender, "2:30", "PM", "Celebration Lunch", "Banquet, tea and music"),
      T("Hanbok or formal attire welcome", 990, { ...body, italic: true, fontSize: 34, fill: K.rose }),
      T("Hanok Garden House, Bukchon, Seoul", 1040, { fontFamily: "Jost", fontWeight: 500, fontSize: 21, letterSpacing: 4, uppercase: true, fill: K.ink }),
    ],
    "Details",
  );

  /* ------------------------------ photo page ------------------------------ */
  const [wood3, buds3, flowers3] = plumBranch(
    [
      [[-30, 90], [110, 130], [230, 100]],
      [[110, 130], [170, 200], [240, 230]],
    ],
    [[30, 100, 32, 0.3], [90, 124, 28, 1.1], [158, 118, 30, 2], [228, 98, 30, 0.7], [182, 206, 26, 1.7], [240, 230, 22, 0.2]],
    [[130, 90, 6], [200, 160, 6]],
  );
  const archBack = (x: number, y: number, fill: string, op = 1) => lock(place([{ path: archPath(x, y, 470, 640), fill, opacity: op }], 1));
  const heights3 = [110, 160, 210, 160, 110];
  const photo = P(
    creamBg,
    [
      fibers(),
      lock(archRow(heights3)),
      archBlossoms(heights3.map((h) => h - 24)),
      archBack(300, 220, K.lavender),
      archBack(268, 196, K.butter),
      archBack(236, 172, K.pink),
      I({ x: 265, y: 205, width: 470, height: 640, mask: "arch", placeholderFill: "#efe3cf", borderColor: "#ffffff", borderWidth: 8 }),
      lock(wood3),
      lock(buds3),
      lock(flowers3),
      ...maedeup(890, 120, 0.7).map(lock),
      lock(falling(9, [20, 300, 980, 1180], 14, (x, y) => x > 220 && x < 780 && y > 150 && y < 880)),
      T("With all our hearts", 886, { ...display, fontSize: 80 }),
      T("Thank you for sharing the happiest day of", 1000, { x: 100, width: 800, ...body, fontSize: 33 }),
      T("our lives. Your blessings are the most", 1042, { x: 100, width: 800, ...body, fontSize: 33 }),
      T("beautiful gift we could receive.", 1084, { x: 100, width: 800, ...body, fontSize: 33 }),
      T("Seo-yeon & Min-jun", 1150, { ...body, italic: true, fontSize: 46, fill: K.rose }),
    ],
    "Photo",
  );

  void blossomScatter;
  void PASTELS;
  void H;
  return {
    slug: "korean-hanbok-pastel",
    name: "Korean Hanbok Pastel",
    tagline: "Elegant Korean wedding invitation with hanbok pastel colour blocks and plum blossoms",
    description:
      "A soft, modern Korean wedding invitation inspired by hanbok colours, with pastel arch colour blocks, hand-drawn plum blossom branches and a traditional maedeup knot with tassel. Perfect for Korean, pyebaek and minimalist floral weddings.",
    categories: ["cultural", "floral", "minimal"],
    keywords: ["korean wedding invitation", "hanbok pastel wedding card", "plum blossom wedding invitation", "maedeup knot invitation template", "pyebaek wedding invite", "modern korean wedding invitation"],
    palette: ["#fbf6ee", "#f4b9c4", "#bfe3d1", "#cfc3ea", "#df5d58"],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
