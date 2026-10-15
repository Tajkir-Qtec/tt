import { GUEST_TOKEN, type Layer } from "../design/types";
import { H, I, lock, O, P, S, T, W, type TemplateDef } from "./kit";
import { WAX, waxBlocks, waxCircles, waxDiamonds, waxFans, waxRing, waxZigzag } from "./southern-african-wax.art";

const { ochre: OCHRE, indigo: INDIGO, terra: TERRA, forest: FOREST, cream: CREAM, ink: INK } = WAX;

const band = (data: ReturnType<typeof waxCircles>, y: number, h: number, flip = false): Layer =>
  lock(O(data, { x: 0, y, width: W, height: h, flipY: flip }));

/** Stack of pattern bands starting at y; `dir` 1 = top of page, -1 = bottom (mirrored). */
function stack(kind: "full" | "slim", top: boolean): Layer[] {
  const layers: Layer[] = [];
  if (kind === "full") {
    const defs: [(w: number, h: number) => ReturnType<typeof waxCircles>, number][] = [
      [(w, h) => waxCircles(w, h), 150],
      [(w, h) => waxBlocks(w, h), 24],
      [(w, h) => waxZigzag(w, h), 56],
      [(w, h) => waxBlocks(w, h), 24],
      [(w, h) => waxDiamonds(w, h), 96],
    ];
    let y = top ? 0 : H;
    defs.forEach(([fn, h]) => {
      if (!top) y -= h;
      layers.push(band(fn(W, h), y, h, !top));
      if (top) y += h;
    });
  } else {
    const defs: [(w: number, h: number) => ReturnType<typeof waxCircles>, number][] = [
      [(w, h) => waxFans(w, h), 110],
      [(w, h) => waxBlocks(w, h), 22],
      [(w, h) => waxZigzag(w, h, CREAM), 52],
    ];
    let y = top ? 0 : H;
    defs.forEach(([fn, h]) => {
      if (!top) y -= h;
      layers.push(band(fn(W, h), y, h, !top));
      if (top) y += h;
    });
  }
  return layers;
}

const disc = (cx: number, cy: number, r: number, fill: string): Layer =>
  lock(S({ shape: "ellipse", x: cx - r, y: cy - r, width: r * 2, height: r * 2, fill }));

function bull(cx: number, cy: number, r: number): Layer[] {
  return [
    disc(cx, cy, r, CREAM),
    disc(cx, cy, r * 0.92, INDIGO),
    disc(cx, cy, r * 0.76, OCHRE),
    disc(cx, cy, r * 0.6, TERRA),
    disc(cx, cy, r * 0.44, CREAM),
    disc(cx, cy, r * 0.3, FOREST),
    disc(cx, cy, r * 0.14, OCHRE),
  ];
}

function panel(x: number, y: number, w: number, h: number): Layer[] {
  return [
    lock(S({ x: x + 8, y: y + 10, width: w, height: h, fill: "rgba(10,8,30,0.35)" })),
    lock(S({ x, y, width: w, height: h, fill: CREAM, stroke: OCHRE, strokeWidth: 8 })),
    lock(S({ x: x + 18, y: y + 18, width: w - 36, height: h - 36, fill: null, stroke: INDIGO, strokeWidth: 2 })),
    lock(S({ x: x + 28, y: y + 28, width: w - 56, height: h - 56, fill: null, stroke: TERRA, strokeWidth: 1, dash: [2, 6] })),
  ];
}

export default function southernAfricanWax(): TemplateDef {
  const cap = (t: string, y: number, o: Partial<Parameters<typeof T>[2]> = {}) =>
    T(t, y, { x: 150, width: 700, fontFamily: "Outfit", fontWeight: 500, fontSize: 16, fill: TERRA, letterSpacing: 7, uppercase: true, ...o });
  const serif = (t: string, y: number, o: Partial<Parameters<typeof T>[2]> = {}) =>
    T(t, y, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 600, fontSize: 30, fill: INDIGO, ...o });
  const shadow = { color: "#e2a21a", blur: 0, offsetX: 4, offsetY: 4, opacity: 0.5 };

  const cover = P(
    INDIGO,
    [
      ...stack("full", true),
      ...stack("full", false),
      ...panel(80, 364, 840, 672),
      ...bull(500, 364, 54),
      ...bull(500, 1036, 54),
      T(GUEST_TOKEN, 440, { x: 250, width: 500, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 600, fontSize: 28, fill: FOREST, letterSpacing: 2 }),
      cap("We joyfully invite you to the wedding of", 486, { fontSize: 14, letterSpacing: 5 }),
      T("Amara", 530, { x: 100, width: 800, fontFamily: "DM Serif Display", fontSize: 122, fill: INDIGO, lineHeight: 1, shadow }),
      T("&", 656, { x: 100, width: 800, fontFamily: "Playfair Display", italic: true, fontSize: 52, fill: TERRA, lineHeight: 1 }),
      T("Kwesi", 704, { x: 100, width: 800, fontFamily: "DM Serif Display", fontSize: 122, fill: INDIGO, lineHeight: 1, shadow }),
      lock(S({ x: 330, y: 862, width: 340, height: 3, fill: OCHRE })),
      T("Saturday, 11 December 2027", 884, { x: 150, width: 700, fontFamily: "Cormorant Garamond", fontWeight: 700, fontSize: 36, fill: INDIGO }),
      cap("The Protea Gardens · Cape Town", 940, { fontSize: 15, letterSpacing: 6, fill: FOREST }),
    ],
    "Invitation",
  );

  // ---- details
  const row = (y: number, time: string, title: string, note: string): Layer[] => [
    ...bullet(150, y + 34),
    T(time, y, { x: 190, width: 220, align: "left", fontFamily: "DM Serif Display", fontSize: 52, fill: INDIGO, lineHeight: 1 }),
    T(title, y + 4, { x: 430, width: 440, align: "left", fontFamily: "Outfit", fontWeight: 600, fontSize: 22, fill: TERRA, letterSpacing: 6, uppercase: true }),
    T(note, y + 36, { x: 430, width: 440, align: "left", fontFamily: "Cormorant Garamond", italic: true, fontWeight: 600, fontSize: 26, fill: FOREST }),
  ];
  const bullet = (x: number, cy: number): Layer[] => [
    lock(S({ shape: "ellipse", x: x - 12, y: cy - 12, width: 24, height: 24, fill: OCHRE })),
    lock(S({ shape: "ellipse", x: x - 6, y: cy - 6, width: 12, height: 12, fill: INDIGO })),
  ];
  const details = P(
    INDIGO,
    [
      ...stack("slim", true),
      ...stack("slim", false),
      ...panel(70, 250, 860, 900),
      T("The Celebration", 306, { x: 100, width: 800, fontFamily: "DM Serif Display", fontSize: 72, fill: INDIGO, lineHeight: 1 }),
      lock(S({ x: 330, y: 400, width: 340, height: 3, fill: OCHRE })),
      cap("Saturday · 11 December 2027", 424, { fontSize: 15 }),
      ...row(490, "3:00", "Ceremony", "beneath the protea trees"),
      ...row(612, "4:30", "Celebration", "music, drums and dancing"),
      ...row(734, "6:30", "Feast", "a table full of home"),
      lock(S({ x: 150, y: 850, width: 700, height: 1.5, fill: OCHRE })),
      cap("Venue", 878, { fontSize: 14 }),
      T("The Protea Gardens", 906, { x: 150, width: 700, fontFamily: "DM Serif Display", fontSize: 44, fill: INDIGO, lineHeight: 1 }),
      serif("Constantia Road, Cape Town", 962, { fontSize: 28, fill: FOREST }),
      cap("Attire", 1018, { fontSize: 14 }),
      serif("Festive colour – bold prints are very welcome", 1046, { fontSize: 27 }),
    ],
    "Details",
  );

  // ---- photo
  const photo = P(
    INDIGO,
    [
      ...stack("slim", true),
      ...stack("slim", false),
      ...panel(70, 250, 860, 900),
      lock(O(waxRing(640), { cx: 500, y: 290, width: 640 })),
      I({ x: 500 - 232, y: 290 + 320 - 232, width: 464, height: 464, mask: "ellipse", placeholderFill: "#d8b27a", borderColor: null, borderWidth: 0 }),
      T("Together we are a whole village.", 966, { x: 190, width: 620, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 600, fontSize: 38, fill: INDIGO, lineHeight: 1.2 }),
      cap("Amara & Kwesi", 1046, { fontSize: 22, letterSpacing: 10, fill: TERRA }),
      serif("11 · 12 · 2027", 1086, { fontSize: 28, fill: FOREST }),
    ],
    "Photo",
  );

  return {
    slug: "southern-african-wax",
    name: "Southern African Wax",
    tagline: "Vibrant wax-print inspired African wedding invitation in ochre, indigo and terracotta",
    description:
      "A joyful African wedding invitation framed in bold, original wax-print inspired pattern bands (bullseye medallions, chevrons, fans and diamonds) in ochre, indigo, terracotta and forest green, with a clean cream panel for the couple's names. Made for South African, Ghanaian, Nigerian and Pan-African weddings and traditional ceremonies.",
    categories: ["cultural", "geometric", "boho"],
    keywords: [
      "african wedding invitation wax print",
      "ankara pattern wedding invitation",
      "south african traditional wedding invite",
      "colorful african wedding card online",
      "ochre indigo terracotta wedding invitation",
    ],
    palette: [OCHRE, INDIGO, TERRA, FOREST, CREAM],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}

void INK;
