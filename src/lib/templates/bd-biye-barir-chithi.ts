import { corner, divider } from "../design/ornaments";
import { centerRotate } from "../design/layers";
import type { Layer } from "../design/types";
import { GUEST_TOKEN } from "../design/types";
import { airmailBand, perfOutline, postmark, speckle, stampSeal } from "./bd-events.art";
import { lotusBloom } from "./bengali-shubho-bibaho.art";
import { H, I, linear, lock, O, P, radial, S, T, W, type TemplateDef } from "./kit";

const PAPER = "#f3e6c8";
const PAPER_L = "#f9f0d9";
const EDGE = "#c9a96c";
const INK = "#1f2b3d";
const INK_L = "#3b4a63";
const RED = "#b3261e";
const RED_D = "#8c1a14";
const SEPIA = "#8a6a3c";

const paperBg = linear(90, [0, "#f1e2c0"], [0.5, "#f8eed4"], [1, "#efdeb8"]);

function paperGround(seed: number, folds = true) {
  return [
    lock(S({ x: 0, y: 0, width: W, height: H, fill: radial([0, "rgba(160,115,55,0)"], [0.55, "rgba(160,115,55,0)"], [1, "rgba(150,100,45,0.38)"]) })),
    lock(O(speckle({ w: 1000, h: 1400, n: 520, color: SEPIA, seed, fibres: 110 }), { x: 0, y: 0, width: 1000, opacity: 0.5 })),
    ...(folds
      ? [
          lock(S({ x: 0, y: 698, width: W, height: 4, fill: linear(90, [0, "rgba(120,85,35,0)"], [0.5, "rgba(120,85,35,0.22)"], [1, "rgba(120,85,35,0)"]) })),
          lock(S({ x: 0, y: 702, width: W, height: 5, fill: linear(90, [0, "rgba(255,250,235,0)"], [0.5, "rgba(255,250,235,0.5)"], [1, "rgba(255,250,235,0)"]) })),
        ]
      : []),
  ];
}

const lotus = (cx: number, y: number, w: number) =>
  O(lotusBloom({ stroke: RED_D, fill: "#f6d9c8", accent: RED, sw: 3 }), { cx, y, width: w });

/** Rotate a layer by `deg` about the page point (px, py). Layer height should be set for text. */
function rotAbout<L extends Layer>(layer: L, px: number, py: number, deg: number): L {
  const a = (deg * Math.PI) / 180;
  const cx = layer.x + layer.width / 2;
  const cy = layer.y + layer.height / 2;
  const nx = px + (cx - px) * Math.cos(a) - (cy - py) * Math.sin(a);
  const ny = py + (cx - px) * Math.sin(a) + (cy - py) * Math.cos(a);
  return centerRotate(layer, nx, ny, deg);
}

/** The red ink seal with its Bangla legend. */
function seal(cx: number, cy: number, size: number, rot: number) {
  const fs = Math.round(size * 0.2);
  const th = fs * 2.3;
  return [
    centerRotate(O(stampSeal({ size, color: RED, seed: Math.round(cx + cy) }), { x: cx - size / 2, y: cy - size / 2, width: size, opacity: 0.88 }), cx, cy, rot),
    centerRotate(T("শুভ\nবিবাহ", cy - th / 2, { x: cx - size * 0.3, width: size * 0.6, height: th, fontFamily: "Tiro Bangla", fontSize: fs, fill: RED, lineHeight: 1.15, opacity: 0.9 }), cx, cy, rot),
  ];
}

export default function bdBiyeBarirChithi(): TemplateDef {
  const ink = (text: string, y: number, o = {}) =>
    T(text, y, { x: 130, width: 740, fontFamily: "Hind Siliguri", fontSize: 27, fill: INK, ...o });

  // ---------------- cover ----------------
  const cover = P(
    paperBg,
    [
      ...paperGround(3),
      lock(O(corner({ style: "ornate", size: 190, color: INK_L, strokeWidth: 2 }), { x: 46, y: 46, width: 190 })),
      lock(O(corner({ style: "ornate", size: 190, color: INK_L, strokeWidth: 2 }), { x: 764, y: 46, width: 190, flipX: true })),
      lock(O(corner({ style: "ornate", size: 190, color: INK_L, strokeWidth: 2 }), { x: 46, y: 1164, width: 190, flipY: true })),
      lock(O(corner({ style: "ornate", size: 190, color: INK_L, strokeWidth: 2 }), { x: 764, y: 1164, width: 190, flipX: true, flipY: true })),
      lock(S({ x: 64, y: 64, width: 872, height: 1272, fill: null, stroke: INK_L, strokeWidth: 1.6 })),
      lock(S({ x: 74, y: 74, width: 852, height: 1252, fill: null, stroke: INK_L, strokeWidth: 0.8 })),
      // postage stamp and postmark
      O(perfOutline({ w: 150, h: 186, stroke: INK_L, fill: "#fbf3df" }), { x: 760, y: 104, width: 150 }),
      lock(S({ x: 774, y: 118, width: 122, height: 158, fill: "#f4dccb", stroke: RED_D, strokeWidth: 1.2 })),
      lotus(835, 150, 84),
      T("২০২৭", 246, { x: 774, width: 122, fontFamily: "Tiro Bangla", fontSize: 22, fill: RED_D }),
      centerRotate(O(postmark({ size: 260, color: INK }), { x: 590, y: 120, width: 260, opacity: 0.55 }), 720, 250, -9),
      T("পরম করুণাময়ের অশেষ কৃপায়", 132, { x: 130, width: 560, fontFamily: "Tiro Bangla", fontSize: 26, fill: SEPIA, lineHeight: 1.3 }),
      T("বিয়ের নিমন্ত্রণ", 330, { x: 100, width: 800, fontFamily: "Tiro Bangla", fontSize: 112, fill: INK, lineHeight: 1.3 }),
      T("An invitation to our family wedding", 480, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontSize: 30, fill: INK_L }),
      O(divider({ style: "floral", w: 420, color: RED_D }), { cx: W / 2, y: 538, width: 420 }),
      T(GUEST_TOKEN, 610, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 34, fill: RED_D }),
      T("Tahmina", 664, { x: 130, width: 740, fontFamily: "Pinyon Script", fontSize: 108, fill: INK, lineHeight: 1.25 }),
      T("&", 790, { x: 130, width: 740, fontFamily: "Cormorant Garamond", italic: true, fontSize: 56, fill: RED_D }),
      T("Farhan", 836, { x: 130, width: 740, fontFamily: "Pinyon Script", fontSize: 108, fill: INK, lineHeight: 1.25 }),
      T("তাহমিনা  ও  ফারহান", 982, { x: 150, width: 700, fontFamily: "Tiro Bangla", fontSize: 44, fill: RED_D, lineHeight: 1.3 }),
      T("শুক্রবার, ১৯ অগ্রহায়ণ ১৪৩৪  ·  ৩ ডিসেম্বর ২০২৭", 1066, { x: 120, width: 760, fontFamily: "Hind Siliguri", fontSize: 27, fontWeight: 500, fill: INK }),
      T("বিকাল ৪টা  ·  রূপসী বাংলা কমিউনিটি সেন্টার, ধানমন্ডি, ঢাকা", 1112, { x: 100, width: 800, fontFamily: "Hind Siliguri", fontSize: 24, fill: INK_L }),
      ...seal(500, 1242, 152, -10),
    ],
    "Cover",
  );

  // ---------------- the letter ----------------
  const ruled: ReturnType<typeof S>[] = [];
  for (let y = 190; y < 1280; y += 52) ruled.push(lock(S({ x: 110, y, width: 780, height: 1, fill: "rgba(59,74,99,0.14)" })));
  const infoRows = [
    { k: "তারিখ", v: "শুক্রবার, ১৯ অগ্রহায়ণ ১৪৩৪ (৩ ডিসেম্বর ২০২৭)" },
    { k: "সময়", v: "বিকাল ৪টা থেকে রাত ৯টা" },
    { k: "স্থান", v: "রূপসী বাংলা কমিউনিটি সেন্টার, রোড ৮/এ, ধানমন্ডি, ঢাকা" },
  ];
  const info: (ReturnType<typeof T> | ReturnType<typeof S>)[] = [];
  infoRows.forEach((r, i) => {
    const y = 822 + i * 82;
    info.push(T(r.k, y, { x: 160, width: 140, align: "left", fontFamily: "Tiro Bangla", fontSize: 32, fill: RED_D, lineHeight: 1.3 }));
    info.push(T(r.v, y + 2, { x: 300, width: 560, align: "left", fontFamily: "Hind Siliguri", fontSize: 25, fontWeight: 500, fill: INK, lineHeight: 1.45 }));
  });
  const letter = P(
    paperBg,
    [
      ...paperGround(8),
      lock(S({ x: 96, y: 60, width: 2, height: 1280, fill: "rgba(179,38,30,0.35)" })),
      ...ruled,
      T("ঢাকা, ২৩ কার্তিক ১৪৩৪", 92, { x: 500, width: 400, align: "right", fontFamily: "Hind Siliguri", fontSize: 24, fill: INK_L }),
      T("প্রিয় আত্মীয়স্বজন ও শুভানুধ্যায়ী,", 156, { x: 130, width: 760, align: "left", fontFamily: "Tiro Bangla", fontSize: 40, fill: INK, lineHeight: 1.3 }),
      ink("আসসালামু আলাইকুম ও আন্তরিক শুভেচ্ছা নেবেন। আপনাদের সবার দোয়া ও আশীর্বাদে আমাদের পরম স্নেহের কন্যা তাহমিনার শুভ বিবাহ জনাব ফারহান আহমেদের সঙ্গে স্থির হয়েছে। এই আনন্দের দিনে আপনাদের সপরিবারে সদয় উপস্থিতি ও দোয়া কামনা করছি। নবদম্পতির সুন্দর ভবিষ্যতের জন্য আপনাদের আশীর্বাদই আমাদের একমাত্র প্রার্থনা।", 232, { align: "justify", lineHeight: 1.733, fontSize: 30 }),
      T("অনুষ্ঠানের বিবরণ", 676, { x: 130, width: 740, fontFamily: "Tiro Bangla", fontSize: 34, fill: RED_D, lineHeight: 1.3 }),
      O(divider({ style: "diamond", w: 300, color: RED_D }), { cx: W / 2, y: 728, width: 300 }),
      lock(S({ x: 130, y: 790, width: 740, height: 262, fill: "rgba(255,250,235,0.5)", stroke: INK_L, strokeWidth: 1.6 })),
      lock(S({ x: 138, y: 798, width: 724, height: 246, fill: null, stroke: INK_L, strokeWidth: 0.8 })),
      ...info,
      ink("আপনাদের আগমনের প্রতীক্ষায় রইলাম।", 1086, { align: "left", fontSize: 26, fill: INK_L }),
      T("ইতি,", 1146, { x: 480, width: 400, align: "left", fontFamily: "Tiro Bangla", fontSize: 32, fill: INK, lineHeight: 1.3 }),
      T("আপনাদের স্নেহধন্য", 1194, { x: 480, width: 400, align: "left", fontFamily: "Hind Siliguri", fontSize: 24, fill: INK_L }),
      T("মো. আব্দুর রহমান ও পরিবার", 1232, { x: 480, width: 400, align: "left", fontFamily: "Tiro Bangla", fontSize: 32, fill: INK, lineHeight: 1.3 }),
      ...seal(250, 1208, 180, -12),
    ],
    "Letter",
  );

  // ---------------- photo ----------------
  const vert = (x: number) => lock(O(airmailBand({ w: 1400, h: 26, red: RED, blue: "#2b4a8a" }), { x, y: 0, width: 1400, rotation: 90 }));
  const photo = P(
    paperBg,
    [
      ...paperGround(14),
      lock(O(airmailBand({ w: 1000, h: 26, red: RED, blue: "#2b4a8a" }), { x: 0, y: 0, width: 1000 })),
      lock(O(airmailBand({ w: 1000, h: 26, red: RED, blue: "#2b4a8a" }), { x: 0, y: 1374, width: 1000 })),
      vert(26),
      vert(1000),
      lock(rotAbout(S({ x: 232, y: 148, width: 560, height: 700, fill: "rgba(60,40,10,0.18)" }), 502, 484, -1.5)),
      lock(rotAbout(S({ x: 222, y: 134, width: 560, height: 700, fill: "#fffaf0", stroke: "#e2d3b0", strokeWidth: 1 }), 502, 484, -1.5)),
      rotAbout(I({ x: 252, y: 164, width: 500, height: 560, mask: "rect", placeholderFill: "#d8c59a" }), 502, 484, -1.5),
      rotAbout(T("তাহমিনা ও ফারহান", 746, { x: 252, width: 500, height: 56, fontFamily: "Tiro Bangla", italic: true, fontSize: 40, fill: INK, lineHeight: 1.3 }), 502, 484, -1.5),
      lock(centerRotate(S({ x: 160, y: 118, width: 150, height: 44, fill: "rgba(226,198,120,0.72)" }), 236, 142, -38)),
      lock(centerRotate(S({ x: 700, y: 118, width: 150, height: 44, fill: "rgba(226,198,120,0.72)" }), 772, 142, 36)),
      T("আপনাদের ভালোবাসা ও দোয়াই", 906, { x: 100, width: 800, fontFamily: "Tiro Bangla", fontSize: 50, fill: INK, lineHeight: 1.3 }),
      T("আমাদের সবচেয়ে বড় উপহার", 972, { x: 100, width: 800, fontFamily: "Tiro Bangla", fontSize: 50, fill: RED_D, lineHeight: 1.3 }),
      O(divider({ style: "floral", w: 380, color: RED_D }), { cx: W / 2, y: 1058, width: 380 }),
      T("Your love and blessings are the greatest gift we could ask for.", 1100, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontSize: 29, fill: INK_L, lineHeight: 1.4 }),
      ...seal(500, 1252, 150, 8),
    ],
    "Photo",
  );

  return {
    slug: "bd-biye-barir-chithi",
    name: "Biye Barir Chithi",
    tagline: "Nostalgic Bangla wedding invitation letter with red ink seal",
    description:
      "A warm, nostalgic Bangla biyer nimontron written as a family letter on aged cream paper, with a red ink stamp seal, postage stamp and airmail border. Traditional greeting, body paragraph and date and venue block in Bangla.",
    categories: ["bengali", "vintage", "classic", "cultural", "ceremony"],
    keywords: [
      "বিয়ের নিমন্ত্রণ চিঠি",
      "bangla wedding invitation letter style card",
      "vintage bengali biyer card with red seal",
      "bangladeshi family wedding invitation online",
      "nostalgic paper letter wedding invite bangla",
    ],
    palette: [PAPER, PAPER_L, INK, RED, EDGE],
    width: W,
    height: H,
    pages: [cover, letter, photo],
  };
}
