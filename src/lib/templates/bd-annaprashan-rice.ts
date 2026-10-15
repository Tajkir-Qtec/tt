import { archFrame, divider, flower, heart, sparkle } from "../design/ornaments";
import { GUEST_TOKEN } from "../design/types";
import { alponaRing, bunting, riceStalk, thalaScene } from "./bd-annaprashan-rice.art";
import { GOLD, H, I, linear, lock, O, P, S, T, W, type TemplateDef } from "./kit";

const CREAM = "#fff6e4";
const SAND = "#f9e6c4";
const BROWN = "#6b3f1d";
const MAROON = "#8c2f3a";
const GOLDC = "#c7963c";
const SOFT = "#8a6a4a";
const PASTELS = ["#f9c9c9", "#c9e4d2", "#fbe3a1", "#cfe0f3", "#f4d3ea"];

const bg = linear(90, [0, "#fff9ec"], [0.55, "#fdeed0"], [1, "#f8e1b8"]);

export default function bdAnnaprashanRice(): TemplateDef {
  const frame = (stroke = GOLDC) =>
    lock(O(archFrame({ w: 720, h: 1060, stroke, strokeWidth: 3.2, fill: "#fffdf7", lines: 2, gap: 14 }), { x: 140, y: 230, width: 720 }));

  const stalks = [
    lock(O(riceStalk(520), { x: 20, y: 760, width: 130 })),
    lock(O(riceStalk(520), { x: 850, y: 760, width: 130, flipX: true })),
  ];

  const cover = P(
    bg,
    [
      lock(S({ x: -250, y: 700, width: 1500, height: 900, shape: "ellipse", fill: { kind: "radial", stops: [[0, "rgba(255,210,150,0.55)"], [1, "rgba(255,210,150,0)"]] } })),
      lock(O(bunting(34, 70, PASTELS, 9), { x: 0, y: 0, width: W })),
      frame(),
      lock(O(alponaRing(520, "#d9b266", "#e7a8a8"), { cx: W / 2, y: 700, width: 520, opacity: 0.5 })),
      ...stalks,
      O(sparkle({ color: GOLDC, size: 40 }), { cx: 250, y: 330, width: 30, opacity: 0.8 }),
      O(sparkle({ color: GOLDC, size: 40 }), { cx: 760, y: 360, width: 22, opacity: 0.7 }),
      T("শিশুর মুখে প্রথম ভাত", 296, { x: 220, width: 560, fontFamily: "Hind Siliguri", fontWeight: 500, fontSize: 24, fill: SOFT, letterSpacing: 1 }),
      T("অন্নপ্রাশন", 336, { x: 160, width: 680, fontFamily: "Tiro Bangla", fontSize: 120, fill: MAROON, lineHeight: 1.25 }),
      T("ANNAPRASHAN  ·  MUKHEBHAAT", 490, { x: 180, width: 640, fontFamily: "Jost", fontWeight: 500, fontSize: 17, fill: GOLDC, letterSpacing: 9 }),
      O(divider({ style: "floral", w: 340, color: GOLDC }), { cx: W / 2, y: 536, width: 340 }),
      T(GUEST_TOKEN, 592, { x: 220, width: 560, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 32, fill: SOFT }),
      T("আমাদের আদরের", 640, { x: 220, width: 560, fontFamily: "Hind Siliguri", fontSize: 24, fill: SOFT }),
      T("Aarohi", 668, { x: 180, width: 640, fontFamily: "Great Vibes", fontSize: 112, fill: BROWN, lineHeight: 1.1 }),
      lock(O(thalaScene(), { cx: W / 2, y: 780, width: 600 })),
      T("শনিবার, ১৩ ফেব্রুয়ারি ২০২৭  ·  সকাল ১১টা", 1112, { x: 180, width: 640, fontFamily: "Hind Siliguri", fontWeight: 500, fontSize: 28, fill: BROWN }),
      T("Saturday, 13 February 2027  ·  11:00 AM", 1158, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 26, fill: SOFT }),
      T("মনোরম কমিউনিটি সেন্টার, ধানমন্ডি, ঢাকা", 1204, { x: 180, width: 640, fontFamily: "Hind Siliguri", fontSize: 22, fill: SOFT }),
    ],
    "Invitation",
  );

  // ---------------- details ----------------
  const rows = [
    { t: "সকাল ১০টা ৩০", bn: "অতিথি আগমন ও আপ্যায়ন", en: "Guests arrive  ·  welcome sweets" },
    { t: "সকাল ১১টা", bn: "মুখেভাত  ·  অন্নপ্রাশন", en: "The rice-feeding ceremony" },
    { t: "দুপুর ১২টা ৩০", bn: "ধান-দুর্বায় আশীর্বাদ", en: "Blessings with paddy and durba grass" },
    { t: "দুপুর ১টা", bn: "প্রীতিভোজ", en: "Festive lunch" },
  ];
  const rowLayers = rows.flatMap((r, i) => {
    const y = 380 + i * 168;
    return [
      lock(S({ x: 150, y: y + 6, width: 700, height: 130, shape: "rect", cornerRadius: 26, fill: i % 2 ? "rgba(255,255,255,0.7)" : "rgba(252,226,214,0.55)", stroke: "#e3c88c", strokeWidth: 1.4 })),
      T(r.t, y + 52, { x: 175, width: 230, fontFamily: "Hind Siliguri", fontWeight: 600, fontSize: 25, fill: MAROON, lineHeight: 1.35 }),
      lock(S({ x: 420, y: y + 26, width: 2, height: 90, fill: "#e0be76" })),
      T(r.bn, y + 28, { x: 440, width: 400, align: "left", fontFamily: "Tiro Bangla", fontSize: 32, fill: BROWN, lineHeight: 1.3 }),
      T(r.en, y + 82, { x: 440, width: 400, align: "left", fontFamily: "Cormorant Garamond", italic: true, fontSize: 24, fill: SOFT }),
    ];
  });
  const details = P(
    bg,
    [
      lock(O(bunting(20, 50, PASTELS, 9), { x: 0, y: 0, width: W })),
      lock(O(riceStalk(520), { x: 10, y: 800, width: 130, opacity: 0.8 })),
      lock(O(riceStalk(520), { x: 860, y: 800, width: 130, flipX: true, opacity: 0.8 })),
      T("অনুষ্ঠানসূচি", 156, { x: 160, width: 680, fontFamily: "Tiro Bangla", fontSize: 84, fill: MAROON, lineHeight: 1.3 }),
      T("PROGRAMME OF THE DAY", 262, { x: 200, width: 600, fontFamily: "Jost", fontWeight: 500, fontSize: 17, fill: GOLDC, letterSpacing: 9 }),
      O(divider({ style: "leaf", w: 380, color: GOLDC }), { cx: W / 2, y: 308, width: 380 }),
      ...rowLayers,
      O(divider({ style: "diamond", w: 400, color: GOLDC }), { cx: W / 2, y: 1062, width: 400 }),
      T("স্থান  ·  Venue", 1100, { x: 200, width: 600, fontFamily: "Hind Siliguri", fontWeight: 500, fontSize: 20, fill: GOLDC, letterSpacing: 1 }),
      T("মনোরম কমিউনিটি সেন্টার", 1136, { x: 160, width: 680, fontFamily: "Tiro Bangla", fontSize: 42, fill: MAROON, lineHeight: 1.3 }),
      T("House 12, Road 7, Dhanmondi, Dhaka", 1204, { x: 200, width: 600, fontFamily: "Cormorant Garamond", fontWeight: 500, fontSize: 26, fill: BROWN }),
      T("হালকা রঙের উৎসবের পোশাকে আপনাদের প্রত্যাশায়", 1260, { x: 140, width: 720, fontFamily: "Hind Siliguri", fontSize: 21, fill: SOFT }),
    ],
    "Programme",
  );

  // ---------------- blessing ----------------
  const photo = P(
    bg,
    [
      lock(O(bunting(34, 70, PASTELS, 9), { x: 0, y: 0, width: W })),
      lock(O(alponaRing(580, "#d9b266", "#e7a8a8"), { cx: W / 2, y: 212, width: 580, opacity: 0.6 })),
      I({ x: 290, y: 292, width: 420, height: 420, mask: "ellipse", placeholderFill: "#f6d9c8", borderColor: "#c7963c", borderWidth: 5 }),
      O(flower({ color: "#f4b9b9", ringColors: ["#f9d3d3", "#f4b9b9", "#eaa0a6"], center: "#f6d57a", radius: 70, rings: 3 }), { cx: 190, y: 640, width: 150 }),
      O(flower({ color: "#c9e4d2", ringColors: ["#e2f1e6", "#c9e4d2", "#a9d0b8"], center: "#f6d57a", radius: 60, rings: 3 }), { cx: 810, y: 640, width: 130 }),
      O(heart({ color: "#e9a0a8", size: 36 }), { cx: 240, y: 560, width: 30, opacity: 0.9 }),
      O(heart({ color: "#f2c46d", size: 30 }), { cx: 770, y: 540, width: 26, opacity: 0.9 }),
      T("ছোট্ট সোনামণির প্রথম ভাত", 800, { x: 120, width: 760, fontFamily: "Tiro Bangla", fontSize: 54, fill: MAROON, lineHeight: 1.3 }),
      T("আপনাদের স্নেহ, ভালোবাসা আর আশীর্বাদে ভরে উঠুক\nআমাদের মায়াবী রাজকন্যার নতুন পথচলা।", 896, { x: 130, width: 740, fontFamily: "Hind Siliguri", fontSize: 27, fill: BROWN, lineHeight: 1.6 }),
      O(divider({ style: "floral", w: 340, color: GOLDC }), { cx: W / 2, y: 1052, width: 340 }),
      T("With all our love, join us in blessing little Aarohi\nas she tastes her very first grains of rice.", 1110, { x: 160, width: 680, fontFamily: "Cormorant Garamond", italic: true, fontSize: 28, fill: SOFT, lineHeight: 1.4 }),
      T("আরোহীর বাবা-মা  ·  দাদু-দিদা  ·  দাদী-নানী", 1220, { x: 140, width: 720, fontFamily: "Hind Siliguri", fontWeight: 500, fontSize: 24, fill: MAROON }),
      T("Tahmid & Nusrat Rahman", 1268, { x: 200, width: 600, fontFamily: "Cinzel", fontWeight: 500, fontSize: 22, fill: GOLDC, letterSpacing: 6 }),
    ],
    "Blessing",
  );

  return {
    slug: "bd-annaprashan-rice",
    name: "Annaprashan Rice Ceremony",
    tagline: "Warm cream and gold Bangla Annaprashan card with brass thala and pastel bunting",
    description:
      "A sweet Bengali Annaprashan (mukhebhaat) invitation in cream, gold and pastel, with a brass thala of rice and sweets, alpona ring, rice stalks and bunting, with Bangla and English wording for a baby's first rice ceremony.",
    categories: ["bengali", "ceremony", "baby", "cultural", "classic"],
    keywords: [
      "annaprashan invitation card bangla",
      "mukhe bhaat invitation card design",
      "bengali baby first rice ceremony invite",
      "annaprashan card with brass thala",
      "online annaprashan invitation maker",
    ],
    palette: [CREAM, SAND, GOLDC, MAROON, "#f9c9c9"],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
