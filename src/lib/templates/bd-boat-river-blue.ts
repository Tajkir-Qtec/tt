import { divider, ticketFrame } from "../design/ornaments";
import { GUEST_TOKEN } from "../design/types";
import { birds, cloud, kaash, nouka, shapla, waves } from "./bd-boat-river-blue.art";
import { GOLD, H, I, linear, lock, O, P, radial, S, T, W, type TemplateDef } from "./kit";

const NAVY = "#12365c";
const BLUE = "#2b6aa1";
const SKY = "#b9d8ee";
const MIST = "#e8f2f9";
const PEACH = "#f8dcc6";
const INK = "#1d4268";
const GOLDC = "#d9a85a";

const sky = linear(90, [0, "#9fc8e6"], [0.4, "#d4e8f5"], [0.62, "#f6e6d8"], [1, "#fbe9d8"]);
const river = linear(90, [0, "#3a7cb4"], [0.5, "#1f5688"], [1, "#0f3358"]);
const petalFill = linear(90, [0, "#ffffff"], [1, "#e8f1fa"]);
const petalBack = linear(90, [0, "#eef5fb"], [1, "#cfe1f1"]);

const shaplaArt = () => shapla({ petal: petalFill, petalBack, stroke: "#5f8db7", pad: "#2f7a6a", padStroke: "#1f5a4d", stamen: "#f0b93c" });
const kaashArt = (seed: number, count = 8) => kaash({ stalk: "#7f98ad", plume: "#ffffff", blade: "#3f7e72", seed, count });
const boatArt = () => nouka({ hull: "#10304f", stripe: GOLDC, sails: ["#ffffff", "#cfe3f3", "#8fb7d9"], canopy: "#c18a52", line: "#0c2845", pennant: "#e4574a" });

const label = (text: string, y: number, o = {}) =>
  T(text, y, { x: 150, width: 700, fontFamily: "Jost", fontSize: 16, fill: BLUE, letterSpacing: 8, uppercase: true, fontWeight: 500, ...o });

export default function bdBoatRiverBlue(): TemplateDef {
  // ---------- cover ----------
  const cover = P(
    sky,
    [
      lock(S({ x: 150, y: 640, width: 700, height: 700, shape: "ellipse", fill: radial([0, "rgba(255,214,170,0.95)"], [0.45, "rgba(255,214,170,0.45)"], [1, "rgba(255,214,170,0)"]) })),
      lock(O(cloud("#ffffff"), { x: 60, y: 770, width: 300, opacity: 0.8 })),
      lock(O(cloud("#ffffff"), { x: 660, y: 700, width: 260, opacity: 0.7 })),
      lock(O(cloud("#ffffff"), { x: 360, y: 840, width: 190, opacity: 0.55 })),
      lock(O(birds(NAVY), { x: 700, y: 800, width: 150, opacity: 0.75 })),
      lock(S({ x: -240, y: 906, width: 760, height: 70, shape: "ellipse", fill: "#7fa6c2", opacity: 0.8 })),
      lock(S({ x: 560, y: 912, width: 700, height: 60, shape: "ellipse", fill: "#8fb0c8", opacity: 0.8 })),
      lock(S({ x: 0, y: 940, width: W, height: 460, fill: river })),
      lock(S({ x: 0, y: 934, width: W, height: 14, fill: "rgba(255,240,224,0.5)" })),
      lock(O(boatArt(), { x: 220, y: 806, width: 560 })),
      lock(O(boatArt(), { x: 220, y: 1056, width: 560, flipY: true, opacity: 0.22 })),
      lock(O(waves({ w: 960, h: 420, rows: 11, color: "#d6e8f6", seed: 3 }), { x: 20, y: 962, width: 960, opacity: 0.5 })),
      lock(O(kaashArt(5), { x: -40, y: 790, width: 330 })),
      lock(O(kaashArt(9, 7), { x: 710, y: 830, width: 300, flipX: true })),
      lock(O(shaplaArt(), { x: 40, y: 1210, width: 270 })),
      lock(O(shaplaArt(), { x: 660, y: 1240, width: 320 })),
      lock(O(shaplaArt(), { x: 380, y: 1285, width: 200 })),
      lock(O(ticketFrame({ w: 928, h: 1328, r: 30, stroke: "#ffffff", strokeWidth: 2.4, lines: 2, gap: 10 }), { x: 36, y: 36, width: 928, opacity: 0.9 })),
      T("শুভ বিবাহ", 92, { x: 160, width: 680, fontFamily: "Tiro Bangla", fontSize: 98, fill: NAVY, lineHeight: 1.3 }),
      O(divider({ style: "wave", w: 360, color: BLUE }), { cx: W / 2, y: 236, width: 360 }),
      label("The wedding of", 292, { fontSize: 15 }),
      T(GUEST_TOKEN, 330, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 32, fill: BLUE }),
      T("Nadia", 372, { x: 160, width: 680, fontFamily: "Playfair Display", fontWeight: 500, fontSize: 92, fill: NAVY }),
      T("&", 470, { x: 160, width: 680, fontFamily: "Cormorant Garamond", italic: true, fontSize: 54, fill: GOLDC }),
      T("Tawsif", 500, { x: 160, width: 680, fontFamily: "Playfair Display", fontWeight: 500, fontSize: 92, fill: NAVY }),
      T("নাদিয়া  ও  তাওসিফ", 614, { x: 200, width: 600, fontFamily: "Tiro Bangla", fontSize: 38, fill: BLUE, lineHeight: 1.4 }),
      T("শুক্রবার, ১২ ফেব্রুয়ারি ২০২৭  ·  বিকেল ৪টা", 690, { x: 150, width: 700, fontFamily: "Hind Siliguri", fontWeight: 500, fontSize: 27, fill: INK, lineHeight: 1.4 }),
      T("পদ্মা রিভারভিউ কনভেনশন হল, মাওয়া, মুন্সীগঞ্জ", 734, { x: 120, width: 760, fontFamily: "Hind Siliguri", fontWeight: 400, fontSize: 22, fill: INK, lineHeight: 1.4 }),
    ],
    "Invitation",
  );

  // ---------- schedule ----------
  const events = [
    { bn: "গায়ে হলুদ", en: "Gaye Holud", whenBn: "বৃহস্পতিবার, ১১ ফেব্রুয়ারি  ·  সন্ধ্যা ৬টা", whenEn: "Thursday, 11 February  ·  6:00 PM" },
    { bn: "শুভ বিবাহ", en: "The Wedding", whenBn: "শুক্রবার, ১২ ফেব্রুয়ারি  ·  বিকেল ৪টা", whenEn: "Friday, 12 February  ·  4:00 PM" },
    { bn: "বউভাত", en: "Reception", whenBn: "শনিবার, ১৩ ফেব্রুয়ারি  ·  সন্ধ্যা ৭টা", whenEn: "Saturday, 13 February  ·  7:00 PM" },
  ];
  const evLayers: ReturnType<typeof T>[] = [];
  const sep: ReturnType<typeof O>[] = [];
  events.forEach((e, i) => {
    const y = 360 + i * 236;
    evLayers.push(T(e.bn, y, { x: 200, width: 600, fontFamily: "Tiro Bangla", fontSize: 54, fill: NAVY, lineHeight: 1.3 }));
    evLayers.push(label(e.en, y + 74, { fontSize: 14, letterSpacing: 7 }));
    evLayers.push(T(e.whenBn, y + 104, { x: 150, width: 700, fontFamily: "Hind Siliguri", fontSize: 25, fontWeight: 500, fill: INK }));
    evLayers.push(T(e.whenEn, y + 144, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontSize: 27, fill: INK }));
    if (i < events.length - 1) sep.push(O(shaplaArt(), { cx: W / 2, y: y + 188, width: 62 }));
  });

  const details = P(
    linear(90, [0, "#f4f9fd"], [1, "#dcebf6"]),
    [
      lock(S({ x: 0, y: 0, width: W, height: 290, fill: linear(90, [0, "#1c4d7e"], [1, "#0f3358"]) })),
      lock(O(waves({ w: 960, h: 230, rows: 7, color: "#9cc4e4", seed: 21 }), { x: 20, y: 30, width: 960, opacity: 0.45 })),
      lock(S({ x: 0, y: 290, width: W, height: 4, fill: GOLD })),
      lock(O(ticketFrame({ w: 928, h: 1328, r: 30, stroke: "#8fb3d2", strokeWidth: 2.2, lines: 2, gap: 10 }), { x: 36, y: 36, width: 928 })),
      T("অনুষ্ঠানসূচি", 98, { x: 160, width: 680, fontFamily: "Tiro Bangla", fontSize: 80, fill: "#ffffff", lineHeight: 1.3 }),
      label("Celebration schedule", 214, { color: "#fff", fill: "#cfe3f3", fontSize: 16 }),
      ...evLayers,
      ...sep,
      lock(O(kaashArt(14, 6), { x: -50, y: 1090, width: 240, opacity: 0.9 })),
      lock(O(kaashArt(17, 6), { x: 810, y: 1090, width: 240, flipX: true, opacity: 0.9 })),
      O(divider({ style: "diamond", w: 400, color: BLUE }), { cx: W / 2, y: 1084, width: 400 }),
      label("স্থান  ·  Venue", 1138, { fontFamily: "Hind Siliguri", fontSize: 20, letterSpacing: 4, uppercase: false }),
      T("পদ্মা রিভারভিউ কনভেনশন হল", 1176, { x: 200, width: 600, fontFamily: "Tiro Bangla", fontSize: 38, fill: NAVY, lineHeight: 1.3 }),
      T("Padma Riverview Convention Hall, Mawa, Munshiganj", 1236, { x: 160, width: 680, fontFamily: "Cormorant Garamond", fontSize: 26, fontWeight: 500, fill: INK }),
    ],
    "Schedule",
  );

  // ---------- blessing ----------
  const photo = P(
    sky,
    [
      lock(S({ x: 100, y: 120, width: 800, height: 800, shape: "ellipse", fill: radial([0, "rgba(255,226,196,0.9)"], [1, "rgba(255,226,196,0)"]) })),
      lock(O(cloud("#ffffff"), { x: 40, y: 150, width: 240, opacity: 0.7 })),
      lock(O(cloud("#ffffff"), { x: 720, y: 220, width: 220, opacity: 0.6 })),
      lock(S({ x: 0, y: 1080, width: W, height: 320, fill: river })),
      lock(S({ x: 0, y: 1074, width: W, height: 12, fill: "rgba(255,240,224,0.5)" })),
      lock(O(waves({ w: 960, h: 290, rows: 8, color: "#d6e8f6", seed: 41 }), { x: 20, y: 1100, width: 960, opacity: 0.45 })),
      lock(O(boatArt(), { x: 610, y: 978, width: 320 })),
      lock(O(kaashArt(23), { x: -60, y: 940, width: 230 })),
      lock(O(shaplaArt(), { x: 400, y: 1250, width: 200 })),
      lock(O(shaplaArt(), { x: 40, y: 1270, width: 190 })),
      lock(O(ticketFrame({ w: 928, h: 1328, r: 30, stroke: "#ffffff", strokeWidth: 2.4, lines: 2, gap: 10 }), { x: 36, y: 36, width: 928, opacity: 0.9 })),
      lock(S({ x: 268, y: 98, width: 464, height: 584, shape: "ellipse", fill: null, stroke: "#ffffff", strokeWidth: 3 })),
      I({ x: 280, y: 110, width: 440, height: 560, mask: "ellipse", placeholderFill: "#8fb7d9", borderColor: "#ffffff", borderWidth: 8 }),
      O(shaplaArt(), { cx: W / 2, y: 646, width: 150 }),
      T("দুটি হৃদয়, এক নদীর স্রোত", 810, { x: 120, width: 760, fontFamily: "Tiro Bangla", fontSize: 54, fill: NAVY, lineHeight: 1.35 }),
      T("আপনাদের দোয়া ও উপস্থিতি আমাদের আনন্দকে পূর্ণতা দেবে", 894, { x: 150, width: 700, fontFamily: "Hind Siliguri", fontSize: 26, fill: INK, lineHeight: 1.55 }),
      T("Your blessings and presence will carry our joy home.", 968, { x: 180, width: 640, fontFamily: "Cormorant Garamond", italic: true, fontSize: 27, lineHeight: 1.4, fill: BLUE }),
      T("Nadia & Tawsif", 1150, { x: 200, width: 600, fontFamily: "Cinzel", fontWeight: 500, fontSize: 28, fill: "#ffffff", letterSpacing: 6 }),
    ],
    "Blessing",
  );

  return {
    slug: "bd-boat-river-blue",
    name: "Padma River Boat Blue",
    tagline: "Serene Bangladeshi wedding card with a river nouka, shapla and kaash flowers",
    description:
      "A calm blue-and-white Bangladeshi wedding invitation featuring a patchwork-sail nouka on the Padma, shapla water lilies and white kaash flowers under a peach river sunset, with Bangla Shubho Bibaho typography.",
    categories: ["bengali", "nature", "floral", "cultural", "classic"],
    keywords: [
      "bangladeshi river boat wedding invitation",
      "shapla and kaash flower biyer card",
      "blue and white bangla wedding card",
      "nouka padma river wedding invitation",
      "online bangladeshi wedding card with photo",
    ],
    palette: [NAVY, BLUE, SKY, PEACH, MIST],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
