import { archFrame, crescent, divider, ticketFrame } from "../design/ornaments";
import { GUEST_TOKEN } from "../design/types";
import { cornerStar, mihrabPanel, mosque, starBand } from "./bangladeshi-akd-emerald.art";
import { GOLD, H, I, linear, lock, O, P, radial, S, T, W, type TemplateDef } from "./kit";
import { shaplaSide, shaplaTop } from "./shapla-river-blush.art";

const EM_D = "#041f17";
const EM = "#0a4635";
const EM_M = "#14664b";
const GOLDC = "#dcb66b";
const GOLD_D = "#9a7433";
const IVORY = "#f7f0dc";
const PAPER = "#f6efdb";
const INK = "#0d3b2d";
const shadow = { color: "#010a07", blur: 10, offsetX: 0, offsetY: 3, opacity: 0.55 };

const darkBg = linear(90, [0, EM_D], [0.5, "#08382a"], [1, EM_D]);

function glow(): ReturnType<typeof lock>[] {
  return [
    lock(S({ x: -200, y: 120, width: 1400, height: 1000, shape: "ellipse", fill: radial([0, "rgba(30,130,95,0.55)"], [0.6, "rgba(14,90,66,0.18)"], [1, "rgba(14,90,66,0)"]) })),
    lock(O(ticketFrame({ w: 904, h: 1304, r: 30, stroke: GOLDC, strokeWidth: 2.4, lines: 2, gap: 10 }), { x: 48, y: 48, width: 904 })),
  ];
}

export default function build(): TemplateDef {
  const cover = P(
    darkBg,
    [
      ...glow(),
      lock(O(mosque({ w: 760, color: GOLDC, window: EM_D }), { cx: W / 2, y: 1090, width: 760, opacity: 0.15 })),
      O(crescent({ color: GOLDC, size: 54 }), { cx: W / 2, y: 70, width: 36 }),
      T("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", 150, { x: 120, width: 760, fontFamily: "Amiri", fontWeight: 700, fontSize: 60, fill: GOLD, shadow }),
      T("আসসালামু আলাইকুম", 236, { x: 200, width: 600, fontFamily: "Tiro Bangla", fontSize: 28, fill: "#e8d6a6", letterSpacing: 2 }),
      T(GUEST_TOKEN, 282, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontSize: 34, fill: IVORY }),
      O(mihrabPanel({ w: 700, h: 740, rim: GOLD, inner: linear(90, [0, "#0b4d39"], [1, "#06291f"]), line: GOLDC }), { x: 150, y: 330, width: 700, height: 740 }),
      lock(S({ x: 140, y: 1066, width: 720, height: 9, fill: GOLD })),
      lock(O(shaplaTop({ size: 520, stroke: GOLDC, layers: ["#0e5a43", "#0f6048", "#10674d", "#126f53"], heart: GOLDC, strokeWidth: 1.4 }), { cx: W / 2, y: 540, width: 520, opacity: 0.1 })),
      lock(O(cornerStar({ color: GOLDC, size: 150 }), { cx: W / 2, y: 452, width: 150 })),
      T("আকদ ও ওয়ালিমা", 636, { x: 190, width: 620, fontFamily: "Tiro Bangla", fontSize: 62, fill: GOLD, lineHeight: 1.3, shadow }),
      T("The Akd & Walima", 726, { x: 190, width: 620, fontFamily: "Jost", fontWeight: 500, fontSize: 16, fill: "#e8d6a6", letterSpacing: 10, uppercase: true }),
      T("ফাহিম ও নুসরাত", 786, { x: 190, width: 620, fontFamily: "Tiro Bangla", fontSize: 76, fill: IVORY, lineHeight: 1.3, shadow }),
      T("Fahim  &  Nusrat", 898, { x: 190, width: 620, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 48, fill: GOLD }),
      O(divider({ style: "floral", w: 340, color: GOLDC }), { cx: W / 2, y: 976, width: 340 }),
      T("শুক্রবার  ·  ৯ই এপ্রিল ২০২৭", 1110, { x: 140, width: 720, fontFamily: "Tiro Bangla", fontSize: 40, fill: IVORY, shadow }),
      T("Friday, 9 April 2027  ·  4:30 PM", 1170, { x: 140, width: 720, fontFamily: "Jost", fontSize: 17, fill: GOLDC, letterSpacing: 6, uppercase: true }),
      T("Lakeview Convention Hall, Uttara, Dhaka", 1214, { x: 140, width: 720, fontFamily: "Cormorant Garamond", fontWeight: 500, fontSize: 28, fill: IVORY }),
    ],
    "Cover",
  );

  const block = (y: number, bn: string, en: string, date: string, time: string, timeBn: string) => [
    T(bn, y, { x: 160, width: 680, fontFamily: "Tiro Bangla", fontSize: 58, fill: INK, lineHeight: 1.3 }),
    T(en, y + 84, { x: 160, width: 680, fontFamily: "Jost", fontWeight: 500, fontSize: 16, fill: GOLD_D, letterSpacing: 10, uppercase: true }),
    T(date, y + 122, { x: 160, width: 680, fontFamily: "Cormorant Garamond", fontWeight: 600, fontSize: 38, fill: INK }),
    T(timeBn, y + 176, { x: 160, width: 680, fontFamily: "Hind Siliguri", fontSize: 25, fill: "#35584c" }),
    T(time, y + 214, { x: 160, width: 680, fontFamily: "Jost", fontSize: 17, fill: "#35584c", letterSpacing: 4, uppercase: true }),
  ];

  const sep = (y: number) => O(cornerStar({ color: GOLD_D, size: 34 }), { cx: W / 2, y, width: 34 });

  const details = P(
    linear(90, [0, "#f8f2e0"], [1, "#efe6cc"]),
    [
      lock(O(shaplaTop({ size: 760, stroke: EM, layers: ["#dcebdd", "#e6f1e5", "#eff6ec", "#f6faf2"], heart: GOLD_D, strokeWidth: 1.2 }), { cx: W / 2, y: 330, width: 760, opacity: 0.07 })),
      lock(O(ticketFrame({ w: 904, h: 1304, r: 30, stroke: EM, strokeWidth: 2.4, lines: 2, gap: 10 }), { x: 48, y: 48, width: 904 })),
      lock(O(starBand({ w: 760, color: EM, accent: GOLD_D }), { cx: W / 2, y: 92, width: 760 })),
      T("অনুষ্ঠানসূচি", 190, { x: 160, width: 680, fontFamily: "Tiro Bangla", fontSize: 70, fill: EM, lineHeight: 1.3 }),
      T("Programme of Celebration", 290, { x: 160, width: 680, fontFamily: "Cormorant Garamond", italic: true, fontSize: 32, fill: GOLD_D }),
      ...block(372, "আকদ", "Akd  ·  Nikah", "Friday, 9 April 2027", "4:30 PM", "বিকাল ৪:৩০ টা, আসরের নামাজের পর"),
      sep(646),
      ...block(704, "ওয়ালিমা", "Walima", "Saturday, 10 April 2027", "7:00 PM", "সন্ধ্যা ৭:০০ টা"),
      sep(978),
      T("স্থান", 1030, { x: 160, width: 680, fontFamily: "Tiro Bangla", fontSize: 44, fill: INK }),
      T("Lakeview Convention Hall", 1096, { x: 160, width: 680, fontFamily: "Cormorant Garamond", fontWeight: 600, fontSize: 38, fill: INK }),
      T("লেকভিউ কনভেনশন হল, সেক্টর ৭, উত্তরা, ঢাকা", 1148, { x: 140, width: 720, fontFamily: "Hind Siliguri", fontSize: 23, fill: "#35584c" }),
      T("আপনার সপরিবারে আগমন একান্ত কাম্য", 1210, { x: 140, width: 720, fontFamily: "Tiro Bangla", fontSize: 28, fill: GOLD_D }),
      lock(O(starBand({ w: 760, color: EM, accent: GOLD_D }), { cx: W / 2, y: 1256, width: 760 })),
    ],
    "Details",
  );

  const photo = P(
    darkBg,
    [
      ...glow(),
      lock(O(starBand({ w: 760, color: GOLDC, accent: GOLDC }), { cx: W / 2, y: 92, width: 760, opacity: 0.9 })),
      lock(O(archFrame({ w: 520, h: 650, stroke: GOLDC, strokeWidth: 3, lines: 3, gap: 12 }), { cx: W / 2, y: 170, width: 520 })),
      I({ x: 258, y: 190, width: 484, height: 610, mask: "arch", placeholderFill: "#0e5a43", borderColor: GOLDC, borderWidth: 2 }),
      O(shaplaSide({ w: 210, stroke: GOLDC, fills: ["#f3e7c4", "#f7efd6", "#fbf5e4", "#ffffff"], heart: GOLD_D }), { cx: 232, y: 704, width: 210 }),
      O(shaplaSide({ w: 210, stroke: GOLDC, fills: ["#f3e7c4", "#f7efd6", "#fbf5e4", "#ffffff"], heart: GOLD_D }), { cx: 768, y: 704, width: 210, flipX: true }),
      T("بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا", 860, { x: 120, width: 760, fontFamily: "Amiri", fontSize: 46, fill: GOLD, shadow }),
      T("وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ", 928, { x: 120, width: 760, fontFamily: "Amiri", fontSize: 46, fill: GOLD, shadow }),
      T("আল্লাহ আমাদের এই নতুন পথচলাকে", 1010, { x: 150, width: 700, fontFamily: "Tiro Bangla", fontSize: 38, fill: IVORY, lineHeight: 1.4 }),
      T("বরকতময় করুন", 1062, { x: 150, width: 700, fontFamily: "Tiro Bangla", fontSize: 38, fill: IVORY, lineHeight: 1.4 }),
      T("আপনাদের দোয়া ও উপস্থিতি আমাদের একান্ত প্রত্যাশা", 1130, { x: 150, width: 700, fontFamily: "Hind Siliguri", fontSize: 22, fill: "#e8d6a6", lineHeight: 1.5 }),
      T("Fahim & Nusrat", 1220, { x: 160, width: 680, fontFamily: "Cinzel", fontWeight: 500, fontSize: 30, fill: GOLD, letterSpacing: 8, shadow }),
    ],
    "Blessing",
  );

  void PAPER;
  return {
    slug: "bangladeshi-akd-emerald",
    name: "Bangladeshi Akd Emerald",
    tagline: "Emerald and gold Bangla Akd and Walima invitation with mosque arch",
    description:
      "A refined Bangladeshi Muslim wedding invitation for the Akd and Walima: deep emerald and gold foil, a pointed mihrab arch, geometric arabesque stars, subtle shapla motifs, a Bismillah header and bilingual Bangla and English details.",
    categories: ["bengali", "islamic", "luxury", "geometric", "classic"],
    keywords: [
      "bangla akd invitation card",
      "bangladeshi muslim wedding card emerald green gold",
      "nikah and walima invitation bangla",
      "islamic wedding invitation mosque arch bismillah",
      "bibaho akd walima card design",
    ],
    palette: [EM, EM_D, GOLDC, IVORY, GOLD_D],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
