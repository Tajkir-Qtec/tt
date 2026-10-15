import { archFrame, divider } from "../design/ornaments";
import { GUEST_TOKEN } from "../design/types";
import { loopBand } from "./alpona-red-ivory-grand.art";
import { datePalm, mustardField, pitIcon, pithaPlate, villageSil } from "./bd-pitha-winter-uthsob.art";
import { H, I, linear, lock, O, P, radial, S, T, W, type TemplateDef } from "./kit";

const BROWN = "#3b2315";
const BROWN_M = "#6b4228";
const TERRA = "#b4502a";
const MUST = "#e6aa1c";
const MUST_D = "#a96f0a";
const CREAM = "#fbf1d6";
const CREAM_D = "#f1deaa";

const bgSky = linear(90, [0, "#d6dcd6"], [0.3, "#ece5cf"], [0.55, "#f6d99c"], [0.8, "#efc060"], [1, "#e0a020"]);
const bgPaper = linear(90, [0, "#fdf5df"], [1, "#f3e2b4"]);

const fog = (x: number, y: number, w: number, h: number, a = 0.7) =>
  lock(S({ x, y, width: w, height: h, shape: "ellipse", fill: radial([0, `rgba(255,255,255,${a})`], [1, "rgba(255,255,255,0)"]) }));

const palm = (x: number, y: number, h: number, lean: number, side: 1 | -1 = 1) =>
  lock(O(datePalm({ w: 360, h, lean, trunk: "#4a2e1a", bark: "#2c190c", frond: "#44532a", pot: TERRA, potLight: "#eaa56e", potSide: side }), { x, y }));

function sunScene(sunY: number, villageY: number) {
  return [
    lock(S({ x: 100, y: sunY - 400, width: 800, height: 800, shape: "ellipse", fill: radial([0, "rgba(255,214,140,0.95)"], [0.45, "rgba(255,190,100,0.45)"], [1, "rgba(255,190,100,0)"]) })),
    lock(S({ x: 330, y: sunY - 170, width: 340, height: 340, shape: "ellipse", fill: radial([0, "#ffe2a0"], [0.75, "#f8b657"], [1, "#f1a043"]), opacity: 0.96 })),
    lock(O(villageSil({ w: 1000, h: 120, color: "#98a398", seed: 5 }), { x: 0, y: villageY - 116, opacity: 0.6 })),
    fog(-100, villageY - 130, 1200, 170, 0.5),
    lock(O(villageSil({ w: 1000, h: 110, color: "#66725e", seed: 11 }), { x: 0, y: villageY - 100, opacity: 0.8 })),
  ];
}

function fieldScene(top: number) {
  return [
    lock(S({ x: 0, y: top, width: W, height: H - top, fill: linear(90, [0, "#ead189"], [0.18, "#e4ab22"], [1, "#b97a0c"]) })),
    lock(O(mustardField({ w: W, h: H - top, seed: 9 }), { x: 0, y: top })),
    fog(-100, top - 70, 1200, 190, 0.5),
  ];
}

export default function bdPithaWinterUthsob(): TemplateDef {
  const cap = (text: string, y: number, o = {}) =>
    T(text, y, { x: 200, width: 600, fontFamily: "Jost", fontSize: 15, letterSpacing: 8, fontWeight: 500, fill: BROWN_M, uppercase: true, ...o });

  // ---------- cover ----------
  const cover = P(
    bgSky,
    [
      ...sunScene(380, 850),
      ...fieldScene(850),
      palm(-96, 190, 1230, 40, 1),
      palm(690, 330, 1090, -40, -1),
      
      T("গ্রামীণ শীতের আয়োজন", 140, { x: 250, width: 500, fontFamily: "Hind Siliguri", fontSize: 26, fontWeight: 500, letterSpacing: 6, fill: BROWN_M }),
      T("শীতের", 184, { x: 250, width: 500, fontFamily: "Tiro Bangla", fontSize: 86, fill: TERRA, lineHeight: 1.3 }),
      T("পিঠা উৎসব", 304, { x: 150, width: 700, fontFamily: "Tiro Bangla", fontSize: 148, fill: BROWN, lineHeight: 1.3 }),
      cap("Winter Pitha Festival", 486, { fontSize: 15, fill: BROWN }),
      O(divider({ style: "dots", w: 260, color: BROWN_M, strokeWidth: 1.6 }), { cx: W / 2, y: 520, width: 260 }),
      T(GUEST_TOKEN, 570, { x: 250, width: 500, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 600, fontSize: 36, fill: BROWN }),
      lock(S({ x: 140, y: 940, width: 720, height: 370, shape: "rect", fill: CREAM, stroke: TERRA, strokeWidth: 2.4, cornerRadius: 34 })),
      lock(S({ x: 154, y: 954, width: 692, height: 342, shape: "rect", fill: null, stroke: TERRA, strokeWidth: 1, cornerRadius: 24, dash: [2, 7] })),
      lock(O(loopBand({ w: 420, h: 34, ink: TERRA, accent: MUST }), { cx: W / 2, y: 968 })),
      T("আপনাকে সপরিবারে আমন্ত্রণ", 1020, { x: 200, width: 600, fontFamily: "Hind Siliguri", fontSize: 25, fontWeight: 500, fill: TERRA }),
      T("শনিবার, ১৬ জানুয়ারি ২০২৭", 1064, { x: 160, width: 680, fontFamily: "Tiro Bangla", fontSize: 50, fill: BROWN, lineHeight: 1.3 }),
      T("সকাল ৯টা থেকে সন্ধ্যা পর্যন্ত", 1138, { x: 160, width: 680, fontFamily: "Hind Siliguri", fontSize: 25, fill: BROWN_M }),
      O(divider({ style: "diamond", w: 280, color: TERRA, strokeWidth: 1.5 }), { cx: W / 2, y: 1182, width: 280 }),
      T("ঘোষবাড়ির উঠান, কালীগঞ্জ, ঝিনাইদহ", 1228, { x: 160, width: 680, fontFamily: "Hind Siliguri", fontSize: 27, fontWeight: 500, fill: BROWN }),
    ],
    "Invitation",
  );

  // ---------- programme ----------
  const items = [
    { icon: "pot" as const, bn: "খেজুর রসের আসর", en: "Fresh date-palm sap", t: "সকাল ৮টা", d: "তাজা রস, গুড় ও ভাপা পায়েস" },
    { icon: "pitha" as const, bn: "পিঠা-পুলির মেলা", en: "Pitha fair", t: "সকাল ১০টা", d: "ভাপা, পাটিসাপটা, চিতই ও পুলি" },
    { icon: "music" as const, bn: "বাউল ও লোকগান", en: "Folk music", t: "দুপুর ২টা", d: "একতারা, দোতারা ও পল্লীগীতি" },
    { icon: "fire" as const, bn: "খড়ের আগুনে আড্ডা", en: "Bonfire evening", t: "সন্ধ্যা ৬টা", d: "আগুন ঘিরে গল্প, গান ও গরম পিঠা" },
  ];
  const rows: ReturnType<typeof T>[] = [];
  const marks: (ReturnType<typeof S> | ReturnType<typeof O>)[] = [];
  items.forEach((it, i) => {
    const y = 322 + i * 206;
    marks.push(lock(S({ x: 120, y: y + 6, width: 130, height: 130, shape: "ellipse", fill: TERRA, stroke: MUST, strokeWidth: 3 })));
    marks.push(lock(S({ x: 130, y: y + 16, width: 110, height: 110, shape: "ellipse", fill: null, stroke: CREAM, strokeWidth: 1, dash: [2, 5] })));
    marks.push(lock(O(pitIcon({ kind: it.icon, size: 64, color: CREAM }), { x: 153, y: y + 39 })));
    rows.push(T(it.bn, y - 4, { x: 290, width: 580, align: "left", fontFamily: "Tiro Bangla", fontSize: 48, fill: BROWN, lineHeight: 1.3 }));
    rows.push(T(it.en, y + 62, { x: 292, width: 580, align: "left", fontFamily: "Jost", fontSize: 14, letterSpacing: 6, fontWeight: 500, fill: TERRA, uppercase: true }));
    rows.push(T(it.t, y + 90, { x: 290, width: 580, align: "left", fontFamily: "Hind Siliguri", fontSize: 26, fontWeight: 600, fill: MUST_D }));
    rows.push(T(it.d, y + 128, { x: 290, width: 580, align: "left", fontFamily: "Hind Siliguri", fontSize: 21, fill: BROWN_M }));
    if (i < 3) marks.push(lock(S({ x: 120, y: y + 178, width: 760, height: 1.4, fill: TERRA, opacity: 0.3 })));
  });
  const details = P(
    bgPaper,
    [
      lock(S({ x: 0, y: 0, width: W, height: 280, fill: TERRA })),
      lock(O(loopBand({ w: 840, h: 40, ink: CREAM, accent: MUST }), { cx: W / 2, y: 28 })),
      lock(O(loopBand({ w: 840, h: 40, ink: CREAM, accent: MUST }), { cx: W / 2, y: 232 })),
      T("আয়োজনসূচি", 84, { x: 200, width: 600, fontFamily: "Tiro Bangla", fontSize: 84, fill: CREAM, lineHeight: 1.3 }),
      cap("Programme of the day", 198, { fill: "#f6d9a8" }),
      ...marks,
      ...rows,
      lock(S({ x: 0, y: 1190, width: W, height: 210, fill: BROWN })),
      lock(O(loopBand({ w: 840, h: 30, ink: MUST, accent: CREAM }), { cx: W / 2, y: 1206 })),
      T("ঘোষবাড়ির উঠান, কালীগঞ্জ, ঝিনাইদহ", 1262, { x: 160, width: 680, fontFamily: "Tiro Bangla", fontSize: 38, fill: CREAM, lineHeight: 1.3 }),
      T("গরম কাপড় ও হাসিমুখ সঙ্গে আনবেন", 1332, { x: 160, width: 680, fontFamily: "Hind Siliguri", fontSize: 22, fill: "#f6d9a8" }),
    ],
    "Programme",
  );

  // ---------- photo ----------
  const photo = P(
    bgSky,
    [
      ...sunScene(330, 1010),
      ...fieldScene(1010),
      lock(O(archFrame({ w: 572, h: 732, fill: null, stroke: CREAM, strokeWidth: 2.4, lines: 2, gap: 10 }), { x: 214, y: 84 })),
      I({ x: 230, y: 100, width: 540, height: 700, mask: "arch", placeholderFill: CREAM_D, borderColor: CREAM, borderWidth: 8 }),
      T("শীতের সকাল, পিঠার সুবাস", 826, { x: 100, width: 800, fontFamily: "Tiro Bangla", fontSize: 58, fill: BROWN, lineHeight: 1.35 }),
      T("রসের গন্ধে ভরে উঠুক উঠান, আপনার আসায় পূর্ণ হোক উৎসব।", 906, { x: 100, width: 800, fontFamily: "Hind Siliguri", fontSize: 24, fontWeight: 500, fill: BROWN, lineHeight: 1.55 }),
      lock(O(pithaPlate({ size: 290 }), { cx: W / 2, y: 1040 })),
      T("ঘোষ পরিবার", 1346, { x: 250, width: 500, fontFamily: "Tiro Bangla", fontSize: 34, fill: CREAM, lineHeight: 1.2, shadow: { color: "#3b2315", blur: 6, offsetX: 0, offsetY: 1, opacity: 0.6 } }),
    ],
    "Blessing",
  );

  return {
    slug: "bd-pitha-winter-uthsob",
    name: "Pitha Winter Festival Rural",
    tagline: "Earthy Bangla winter pitha utsav invitation with date-palm sap pots, mustard fields and morning fog",
    description:
      "A warm, rustic Bangladeshi winter festival invitation featuring date-palm sap pots, a banana-leaf platter of pithas, mustard fields and village fog. Perfect for pitha utsav, khejur ras gatherings, Poush-Magh village fairs and family winter parties in Bangla.",
    categories: ["bengali", "winter", "festive", "party"],
    keywords: [
      "pitha utsav invitation card bangla",
      "winter pitha festival invitation bangladesh",
      "khejur ras date palm sap party card",
      "gramin shiter utsob invitation design",
      "poush parbon pitha party invitation",
    ],
    palette: [BROWN, TERRA, MUST, CREAM, "#7b9a3c"],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
