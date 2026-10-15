import { divider, flower, sparkle, sprig, ticketFrame } from "../design/ornaments";
import { centerRotate } from "../design/layers";
import { GUEST_TOKEN } from "../design/types";
import { leafGarland, ringEmblem } from "./bd-engagement-ring-bangla.art";
import { H, I, linear, lock, O, P, S, T, W, type TemplateDef } from "./kit";

const IVORY = "#fffaf3";
const BLUSH = "#f3d6cf";
const ROSE = "#c98b7e";
const ROSE_D = "#9b5d54";
const WINE = "#6b3a3f";
const SAGE = "#a3b496";
const MUTED = "#8a6a64";

const RG_TXT = linear(100, [0, "#9b5d54"], [0.45, "#d28d7a"], [0.7, "#b0675d"], [1, "#8f5149"]);
const bg = linear(90, [0, "#fffaf4"], [0.6, "#fbefe6"], [1, "#f6e2d6"]);

const bloom = (r: number, tone: "blush" | "rose" | "ivory") => {
  const sets = {
    blush: { color: "#f6cfc8", ring: ["#fbe3de", "#f6cfc8", "#eab3ab"], center: "#f3d28a" },
    rose: { color: "#e3a398", ring: ["#f0bcb2", "#e3a398", "#c9786f"], center: "#f6dfa0" },
    ivory: { color: "#fff1e6", ring: ["#fffaf3", "#fbe7da", "#f0cdbd"], center: "#e9c373" },
  }[tone];
  return flower({ color: sets.color, ringColors: sets.ring, center: sets.center, radius: r, rings: 4, petals: 9, stroke: "#c98b7e", strokeWidth: 0.8 });
};
const at = <L extends ReturnType<typeof O>>(l: L, cx: number, cy: number): L => centerRotate(l, cx, cy, l.rotation);
const leaves = () => sprig({ color: SAGE, length: 360, leaves: 7, leafLen: 56, leafW: 15, curve: 0.25, spread: 38, alternate: true, stemWidth: 2.4 });

function cornerFlora(flip: boolean): ReturnType<typeof lock>[] {
  const fx = (x: number, w: number) => (flip ? W - x - w + 70 : x);
  const fy = (y: number, h: number) => (flip ? H - y - h + 70 : y);
  const rot = flip ? 180 : 0;
  return [
    lock(at(O(leaves(), { width: 250, rotation: rot + 30 }), flip ? W - 120 : 190, flip ? H - 120 : 190)),
    lock(at(O(leaves(), { width: 210, rotation: rot + 66, opacity: 0.85 }), flip ? W - 40 : 110, flip ? H - 180 : 250)),
    lock(O(bloom(100, "blush"), { x: fx(-50, 200), y: fy(-50, 200), width: 200, rotation: rot })),
    lock(O(bloom(70, "rose"), { x: fx(130, 140), y: fy(-26, 140), width: 140, rotation: rot + 14 })),
    lock(O(bloom(58, "ivory"), { x: fx(-20, 116), y: fy(140, 116), width: 116, rotation: rot + 8 })),
    lock(O(bloom(40, "rose"), { x: fx(240, 80), y: fy(60, 80), width: 80, rotation: rot })),
  ];
}

export default function bdEngagementRingBangla(): TemplateDef {
  const wash = (x: number, y: number, r: number, a: number) =>
    lock(S({ x: x - r, y: y - r, width: r * 2, height: r * 2, shape: "ellipse", fill: { kind: "radial", stops: [[0, `rgba(240,186,170,${a})`], [1, "rgba(240,186,170,0)"]] } }));
  const border = lock(O(ticketFrame({ w: 900, h: 1300, r: 30, stroke: ROSE, strokeWidth: 1.8, lines: 2, gap: 9 }), { x: 50, y: 50, width: 900 }));

  const cover = P(
    bg,
    [
      wash(120, 150, 420, 0.5),
      wash(900, 1260, 440, 0.5),
      border,
      ...cornerFlora(false),
      ...cornerFlora(true),
      lock(O(ringEmblem(340), { cx: W / 2, y: 150, width: 340 })),
      T("বাগদান", 478, { x: 160, width: 680, fontFamily: "Tiro Bangla", fontSize: 138, fill: RG_TXT, lineHeight: 1.25, shadow: { color: "#7a3f36", blur: 6, offsetX: 0, offsetY: 3, opacity: 0.18 } }),
      T("ENGAGEMENT CEREMONY", 664, { x: 160, width: 680, fontFamily: "Jost", fontWeight: 500, fontSize: 17, fill: ROSE_D, letterSpacing: 7 }),
      T(GUEST_TOKEN, 722, { x: 240, width: 520, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 32, fill: MUTED }),
      T("Nusrat  &  Rafiq", 764, { x: 130, width: 740, fontFamily: "Great Vibes", fontSize: 98, fill: WINE, lineHeight: 1.15 }),
      T("নুসরাত জাহান  ও  রফিকুল ইসলাম", 892, { x: 150, width: 700, fontFamily: "Tiro Bangla", fontSize: 36, fill: ROSE_D, lineHeight: 1.4 }),
      O(divider({ style: "diamond", w: 360, color: ROSE }), { cx: W / 2, y: 962, width: 360 }),
      T("শুক্রবার, ২৪ ডিসেম্বর ২০২৭  ·  সন্ধ্যা ৬টা", 1008, { x: 170, width: 660, fontFamily: "Hind Siliguri", fontWeight: 500, fontSize: 28, fill: WINE }),
      T("Friday, 24 December 2027  ·  6:00 PM", 1052, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 27, fill: MUTED }),
      T("লেকশোর গার্ডেন, গুলশান, ঢাকা", 1112, { x: 200, width: 600, fontFamily: "Tiro Bangla", fontSize: 32, fill: ROSE_D, lineHeight: 1.3 }),
    ],
    "Engagement",
  );

  // ---------- timeline ----------
  const steps = [
    { t: "সন্ধ্যা ৬টা", bn: "অতিথি আগমন ও আপ্যায়ন", en: "Welcome drinks and arrivals" },
    { t: "সন্ধ্যা ৭টা", bn: "আংটি বদল", en: "The exchange of rings" },
    { t: "সন্ধ্যা ৭টা ৩০", bn: "ওড়না পরানো ও আশীর্বাদ", en: "Blessings and the draping of the odhna" },
    { t: "রাত ৮টা", bn: "নৈশভোজ ও আনন্দ-আড্ডা", en: "Dinner and celebration" },
  ];
  const tl = steps.flatMap((s, i) => {
    const y = 390 + i * 168;
    return [
      lock(S({ x: 276, y: y + 36, width: 28, height: 28, shape: "ellipse", fill: IVORY, stroke: ROSE, strokeWidth: 3 })),
      lock(S({ x: 284, y: y + 44, width: 12, height: 12, shape: "ellipse", fill: ROSE })),
      T(s.t, y + 32, { x: 80, width: 170, align: "right", fontFamily: "Hind Siliguri", fontWeight: 600, fontSize: 22, fill: ROSE_D, lineHeight: 1.3 }),
      T(s.bn, y + 8, { x: 340, width: 560, align: "left", fontFamily: "Tiro Bangla", fontSize: 36, fill: WINE, lineHeight: 1.3 }),
      T(s.en, y + 62, { x: 340, width: 560, align: "left", fontFamily: "Cormorant Garamond", italic: true, fontSize: 25, fill: MUTED }),
    ];
  });
  const details = P(
    bg,
    [
      wash(900, 120, 380, 0.45),
      wash(100, 1280, 400, 0.45),
      border,
      lock(O(leafGarland(700, 70, SAGE), { cx: W / 2, y: 100, width: 700 })),
      T("অনুষ্ঠানসূচি", 190, { x: 160, width: 680, fontFamily: "Tiro Bangla", fontSize: 84, fill: RG_TXT, lineHeight: 1.3 }),
      T("THE EVENING", 296, { x: 200, width: 600, fontFamily: "Jost", fontWeight: 500, fontSize: 17, fill: ROSE_D, letterSpacing: 10 }),
      lock(S({ x: 289, y: 440, width: 2.4, height: 504, fill: "#e3b8ab" })),
      ...tl,
      O(divider({ style: "floral", w: 340, color: ROSE }), { cx: W / 2, y: 1066, width: 340 }),
      T("স্থান  ·  Venue", 1112, { x: 200, width: 600, fontFamily: "Hind Siliguri", fontWeight: 500, fontSize: 20, fill: ROSE, letterSpacing: 1 }),
      T("লেকশোর গার্ডেন", 1148, { x: 160, width: 680, fontFamily: "Tiro Bangla", fontSize: 44, fill: WINE, lineHeight: 1.3 }),
      T("Lakeshore Garden, Road 41, Gulshan 2, Dhaka", 1214, { x: 140, width: 720, fontFamily: "Cormorant Garamond", fontWeight: 500, fontSize: 26, fill: MUTED }),
      O(sparkle({ color: "#e6b86a", size: 40 }), { cx: 120, y: 1100, width: 26, opacity: 0.8 }),
      O(sparkle({ color: "#e6b86a", size: 40 }), { cx: 880, y: 1130, width: 20, opacity: 0.8 }),
    ],
    "Programme",
  );

  // ---------- photo ----------
  const photo = P(
    bg,
    [
      wash(500, 520, 520, 0.4),
      border,
      lock(at(O(leafGarland(440, 60, SAGE), { width: 440, rotation: -82 }), 196, 440)),
      lock(at(O(leafGarland(440, 60, SAGE), { width: 440, rotation: 82 }), 804, 440)),
      lock(S({ x: 235, y: 135, width: 530, height: 660, shape: "ellipse", fill: null, stroke: ROSE, strokeWidth: 2 })),
      lock(S({ x: 249, y: 149, width: 502, height: 632, shape: "ellipse", fill: null, stroke: "#e3b8ab", strokeWidth: 1.2 })),
      I({ x: 270, y: 170, width: 460, height: 590, mask: "ellipse", placeholderFill: "#f3d6cf", borderColor: null, borderWidth: 0 }),
      lock(O(bloom(78, "blush"), { x: 150, y: 640, width: 156, rotation: 10 })),
      lock(O(bloom(60, "rose"), { x: 250, y: 710, width: 120 })),
      lock(O(bloom(64, "ivory"), { x: 690, y: 650, width: 128, rotation: -12 })),
      lock(O(bloom(46, "rose"), { x: 620, y: 726, width: 92 })),
      T("দুটি হৃদয়ের অঙ্গীকার", 848, { x: 120, width: 760, fontFamily: "Tiro Bangla", fontSize: 62, fill: RG_TXT, lineHeight: 1.3 }),
      T("আপনাদের দোয়া ও শুভকামনা আমাদের\nনতুন পথচলার সবচেয়ে বড় শক্তি।", 948, { x: 130, width: 740, fontFamily: "Hind Siliguri", fontSize: 28, fill: WINE, lineHeight: 1.6 }),
      O(divider({ style: "floral", w: 340, color: ROSE }), { cx: W / 2, y: 1092, width: 340 }),
      T("Join us as we say yes to forever,\nand begin our journey together.", 1136, { x: 160, width: 680, fontFamily: "Cormorant Garamond", italic: true, fontSize: 28, fill: MUTED, lineHeight: 1.4 }),
      T("Nusrat  &  Rafiq", 1246, { x: 200, width: 600, fontFamily: "Cinzel", fontWeight: 500, fontSize: 24, fill: ROSE_D, letterSpacing: 7 }),
    ],
    "Blessing",
  );

  return {
    slug: "bd-engagement-ring-bangla",
    name: "Bagdan Rose Gold Rings",
    tagline: "Rose gold and ivory Bangla engagement card with interlocked rings and blush blooms",
    description:
      "A romantic Bagdan (engagement) invitation in rose gold and ivory with interlocked rings, a faceted diamond and blush flowers, with Bangla wording for the ring exchange and odhna ceremony alongside English text.",
    categories: ["bengali", "ceremony", "engagement", "floral", "luxury"],
    keywords: [
      "bagdan invitation card bangla",
      "bengali engagement ceremony invitation rose gold",
      "ring exchange aangti bodol invitation",
      "bangladeshi engagement card with flowers",
      "online bagdan card maker",
    ],
    palette: [IVORY, BLUSH, ROSE, ROSE_D, WINE],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
