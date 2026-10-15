import { archFrame, divider, islamicPattern, sparkle } from "../design/ornaments";
import { GUEST_TOKEN } from "../design/types";
import { cloud, crescentStarBadge, hills, mobile } from "./bd-aqiqah-welcome.art";
import { H, I, linear, lock, O, P, S, T, W, type TemplateDef } from "./kit";

const TEAL = "#2f5d57";
const SAGE = "#a9c8b4";
const BLUE = "#cfe3ef";
const BLUSH = "#f6dcd8";
const GOLDC = "#b8923a";
const INK = "#3b4b4a";
const MUTED = "#6d7f7c";

const sky = linear(90, [0, "#d3e6f1"], [0.42, "#e8f2ec"], [0.8, "#fbefe9"], [1, "#f9e3dd"]);

export default function bdAqiqahWelcome(): TemplateDef {
  const bgPattern = lock(O(islamicPattern({ color: "#7aa6a0", w: 1000, h: 1400, cell: 130, strokeWidth: 1.1 }), { x: 0, y: 0, width: W, opacity: 0.07 }));
  const clouds = (s: number) => [
    lock(O(cloud(300, "#ffffff"), { x: 40, y: 560 + s, width: 300, opacity: 0.85 })),
    lock(O(cloud(240, "#ffffff"), { x: 720, y: 640 + s, width: 240, opacity: 0.8 })),
  ];

  const cover = P(
    sky,
    [
      bgPattern,
      ...clouds(0),
      lock(O(mobile(), { x: 0, y: 0, width: W })),
      T("بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", 424, { x: 200, width: 600, fontFamily: "Amiri", fontSize: 40, fill: GOLDC, lineHeight: 1.4 }),
      T("আকিকা", 486, { x: 160, width: 680, fontFamily: "Tiro Bangla", fontSize: 142, fill: TEAL, lineHeight: 1.25 }),
      T("AQIQAH  ·  WELCOMING BABY", 668, { x: 180, width: 640, fontFamily: "Jost", fontWeight: 500, fontSize: 18, fill: GOLDC, letterSpacing: 9 }),
      O(divider({ style: "stars", w: 300, color: GOLDC, strokeWidth: 1.6 }), { cx: W / 2, y: 716, width: 300 }),
      T(GUEST_TOKEN, 770, { x: 220, width: 560, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 32, fill: MUTED }),
      T("আমাদের নতুন অতিথিকে স্বাগতম", 820, { x: 160, width: 680, fontFamily: "Hind Siliguri", fontSize: 28, fill: INK }),
      T("Zayan", 862, { x: 180, width: 640, fontFamily: "Great Vibes", fontSize: 118, fill: TEAL, lineHeight: 1.1 }),
      T("রবিবার, ৭ মার্চ ২০২৭  ·  দুপুর ১২টা", 1030, { x: 160, width: 680, fontFamily: "Hind Siliguri", fontWeight: 500, fontSize: 30, fill: INK }),
      T("Sunday, 7 March 2027  ·  12:00 PM", 1078, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 27, fill: MUTED }),
      lock(O(hills(300, ["#e1eee5", "#cde2d3", "#b5d3c0"]), { x: 0, y: 1100, width: W })),
      O(sparkle({ color: "#ffffff", size: 30 }), { cx: 150, y: 1160, width: 24, opacity: 0.9 }),
      O(sparkle({ color: "#ffffff", size: 30 }), { cx: 860, y: 1190, width: 18, opacity: 0.9 }),
      T("আল-নূর কমিউনিটি হল", 1236, { x: 160, width: 680, fontFamily: "Tiro Bangla", fontSize: 40, fill: TEAL, lineHeight: 1.3 }),
      T("Sector 7, Uttara, Dhaka", 1298, { x: 200, width: 600, fontFamily: "Cormorant Garamond", fontWeight: 600, fontSize: 25, fill: INK, letterSpacing: 1 }),
    ],
    "Welcome",
  );

  // ---------- details ----------
  const card = (y: number, h: number, fill: string, stroke: string) =>
    lock(S({ x: 140, y, width: 720, height: h, shape: "rect", cornerRadius: 40, fill, stroke, strokeWidth: 1.6 }));
  const label = (txt: string, y: number) => T(txt, y, { x: 200, width: 600, fontFamily: "Hind Siliguri", fontWeight: 500, fontSize: 20, fill: GOLDC, letterSpacing: 1 });

  const details = P(
    sky,
    [
      bgPattern,
      lock(O(cloud(260, "#ffffff"), { x: 20, y: 60, width: 260, opacity: 0.8 })),
      lock(O(cloud(200, "#ffffff"), { x: 770, y: 110, width: 200, opacity: 0.75 })),
      lock(O(crescentStarBadge(150, "#c9a65a"), { cx: W / 2, y: 70, width: 150 })),
      T("অনুষ্ঠানের বিবরণ", 240, { x: 140, width: 720, fontFamily: "Tiro Bangla", fontSize: 76, fill: TEAL, lineHeight: 1.3 }),
      T("EVENT DETAILS", 338, { x: 200, width: 600, fontFamily: "Jost", fontWeight: 500, fontSize: 17, fill: GOLDC, letterSpacing: 10 }),
      card(410, 220, "rgba(255,255,255,0.82)", "#cfe3ef"),
      label("তারিখ ও সময়  ·  When", 436),
      T("রবিবার, ৭ মার্চ ২০২৭", 484, { x: 160, width: 680, fontFamily: "Tiro Bangla", fontSize: 46, fill: TEAL, lineHeight: 1.3 }),
      T("দুপুর ১২টা থেকে বিকাল ৩টা", 552, { x: 160, width: 680, fontFamily: "Hind Siliguri", fontSize: 28, fill: INK }),
      T("Sunday, 7 March 2027  ·  12 noon to 3 PM", 592, { x: 160, width: 680, fontFamily: "Cormorant Garamond", italic: true, fontSize: 24, fill: MUTED }),
      card(660, 220, "rgba(246,220,216,0.6)", "#ecc9c3"),
      label("স্থান  ·  Where", 686),
      T("আল-নূর কমিউনিটি হল", 734, { x: 160, width: 680, fontFamily: "Tiro Bangla", fontSize: 46, fill: TEAL, lineHeight: 1.3 }),
      T("সেক্টর ৭, উত্তরা, ঢাকা", 802, { x: 160, width: 680, fontFamily: "Hind Siliguri", fontSize: 28, fill: INK }),
      T("Al-Noor Community Hall, Sector 7, Uttara, Dhaka", 842, { x: 160, width: 680, fontFamily: "Cormorant Garamond", italic: true, fontSize: 24, fill: MUTED }),
      card(910, 270, "rgba(207,227,239,0.5)", "#b4d0e0"),
      label("আয়োজন  ·  Programme", 936),
      T("দোয়া ও মিলাদ", 984, { x: 160, width: 680, fontFamily: "Tiro Bangla", fontSize: 38, fill: TEAL, lineHeight: 1.3 }),
      T("নামকরণ ও আকিকার দোয়া", 1038, { x: 160, width: 680, fontFamily: "Tiro Bangla", fontSize: 38, fill: TEAL, lineHeight: 1.3 }),
      T("প্রীতিভোজ", 1092, { x: 160, width: 680, fontFamily: "Tiro Bangla", fontSize: 38, fill: TEAL, lineHeight: 1.3 }),
      T("Dua  ·  Naming  ·  Shared meal", 1140, { x: 160, width: 680, fontFamily: "Cormorant Garamond", italic: true, fontSize: 24, fill: MUTED }),
      lock(O(hills(220, ["#e1eee5", "#cde2d3", "#b5d3c0"]), { x: 0, y: 1230, width: W })),
      T("সপরিবারে আপনার উপস্থিতি কামনা করি", 1290, { x: 120, width: 760, fontFamily: "Hind Siliguri", fontSize: 24, fill: TEAL }),
    ],
    "Details",
  );

  // ---------- blessing ----------
  const photo = P(
    sky,
    [
      bgPattern,
      lock(O(mobile(), { x: 0, y: -95, width: W })),
      ...clouds(180),
      lock(O(archFrame({ w: 440, h: 560, stroke: "#c9a65a", strokeWidth: 3, lines: 2, gap: 12, fill: "#ffffff" }), { cx: W / 2, y: 300, width: 440 })),
      I({ x: 296, y: 312, width: 408, height: 536, mask: "arch", placeholderFill: "#cfe3ef", borderColor: null, borderWidth: 0 }),
      T("بَارَكَ ٱللَّٰهُ لَكُمْ فِي ٱلْمَوْهُوبِ لَكُمْ", 896, { x: 100, width: 800, fontFamily: "Amiri", fontSize: 44, fill: GOLDC, lineHeight: 1.4 }),
      T("নতুন অতিথির জন্য সবার দোয়া চাই", 990, { x: 120, width: 760, fontFamily: "Tiro Bangla", fontSize: 50, fill: TEAL, lineHeight: 1.3 }),
      T("আল্লাহ আমাদের সোনামণিকে সুস্থ, নেক ও দীর্ঘ হায়াত দান করুন।", 1066, { x: 150, width: 700, fontFamily: "Hind Siliguri", fontSize: 26, fill: INK, lineHeight: 1.55 }),
      O(divider({ style: "stars", w: 300, color: GOLDC, strokeWidth: 1.6 }), { cx: W / 2, y: 1170, width: 300 }),
      T("With joyful hearts, we welcome little Zayan.\nMay Allah bless him and keep him safe.", 1206, { x: 160, width: 680, fontFamily: "Cormorant Garamond", italic: true, fontSize: 27, fill: MUTED, lineHeight: 1.4 }),
      T("Imran & Farhana Chowdhury", 1300, { x: 200, width: 600, fontFamily: "Cinzel", fontWeight: 500, fontSize: 21, fill: GOLDC, letterSpacing: 6 }),
    ],
    "Dua",
  );

  return {
    slug: "bd-aqiqah-welcome",
    name: "Aqiqah Welcome Baby",
    tagline: "Soft sage, sky blue and blush Bangla Aqiqah card with a crescent moon mobile",
    description:
      "A gentle gender-neutral Aqiqah invitation in sage, powder blue and blush with a hanging crescent-and-star mobile, soft clouds and rolling hills, with Bangla, Arabic and English wording for a newborn welcome gathering.",
    categories: ["bengali", "ceremony", "islamic", "baby", "cultural"],
    keywords: [
      "aqiqah invitation card bangla",
      "akika invitation card bengali design",
      "newborn welcome islamic invitation",
      "gender neutral aqiqah card crescent moon",
      "online aqiqah invitation maker bangladesh",
    ],
    palette: [TEAL, SAGE, BLUE, BLUSH, GOLDC],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
