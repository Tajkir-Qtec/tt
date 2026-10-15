import { archFrame, divider, scallops } from "../design/ornaments";
import { Path, type PartSpec } from "../design/path";
import { GUEST_TOKEN } from "../design/types";
import type { Layer } from "../design/types";
import { H, I, linear, lock, O, P, S, T, W, type TemplateDef } from "./kit";
import { ellipsePath, place } from "./birthday-balloons-bold.art";
import { BROWN, bushPlant, CREAM, GREEN, hangingPlant, house, icon, keyBunch, PAPER, SAGE, SAGE_D, snakePlant, TERRA, TERRA_D } from "./housewarming-keys-home.art";

const BG = linear(90, [0, "#fcf5e8"], [1, "#f6ead4"]);

const rule = (y: number, w = 300, color = TERRA) => lock(O(divider({ style: "leaf", w, color, strokeWidth: 1.8 }), { cx: W / 2, y: y - 20 }));
const border = (): Layer =>
  lock(S({ x: 26, y: 26, width: 948, height: 1348, cornerRadius: 36, fill: null, stroke: TERRA, strokeWidth: 2, opacity: 0.55 }));

/** The arched landscape the house stands in (peach sky, sun, clouds, hills, lawn). */
function backdrop(x0: number, top: number, w: number, bottom: number, gy: number): Layer[] {
  const r = w / 2;
  const cx = x0 + r;
  const x1 = x0 + w;
  const arch = new Path();
  arch.M(x0, bottom).L(x0, top + r).A(r, r, 0, 0, 1, x1, top + r).L(x1, bottom).Z();
  arch.include([cx, top]);
  const sky: PartSpec[] = [{ path: arch, fill: linear(90, [0, "#fde2c4"], [0.6, "#fff0d6"], [1, "#fff6e2"]) }];
  sky.push({ path: ellipsePath(cx, top + 250, 215, 215), fill: "#fff8e6", opacity: 0.4 });
  sky.push({ path: ellipsePath(cx, top + 250, 150, 150), fill: "#fffaf0", opacity: 0.8 });
  const cloud = (px: number, py: number, k: number) => {
    const c = new Path();
    c.circle(px, py, 18 * k).circle(px + 24 * k, py - 10 * k, 24 * k).circle(px + 54 * k, py, 20 * k).circle(px + 28 * k, py + 10 * k, 20 * k);
    return c;
  };
  sky.push({ path: cloud(x0 + 80, top + 170, 1), fill: "#ffffff", opacity: 0.85 });
  sky.push({ path: cloud(x1 - 170, top + 120, 0.8), fill: "#ffffff", opacity: 0.85 });
  const birds = new Path();
  for (const [bx, by] of [[x0 + 150, top + 270], [x0 + 186, top + 252], [x1 - 120, top + 300]]) birds.M(bx - 10, by - 4).Q(bx - 5, by - 10, bx, by).Q(bx + 5, by - 10, bx + 10, by - 4);
  sky.push({ path: birds, stroke: BROWN, strokeWidth: 2.2, opacity: 0.55 });
  const h1 = new Path();
  h1.M(x0, bottom).L(x0, gy - 20).C(x0 + 90, gy - 90, x0 + 210, gy - 70, cx - 20, gy - 10).L(cx - 20, bottom).Z();
  const h2 = new Path();
  h2.M(x1, bottom).L(x1, gy - 30).C(x1 - 90, gy - 100, x1 - 220, gy - 74, cx + 20, gy - 6).L(cx + 20, bottom).Z();
  sky.push({ path: h1, fill: "#c3d3bd" });
  sky.push({ path: h2, fill: "#b0c5aa" });
  const lawn = new Path();
  lawn.M(x0, bottom).L(x0, gy + 4).C(x0 + 140, gy - 20, x1 - 140, gy - 20, x1, gy + 4).L(x1, bottom).Z();
  sky.push({ path: lawn, fill: linear(90, [0, "#9db39a"], [1, "#7f9f7f"]) });
  const tufts = new Path();
  for (const [tx, ty] of [[x0 + 40, gy + 70], [x0 + 90, gy + 120], [x1 - 60, gy + 80], [x1 - 110, gy + 124], [x0 + 130, gy + 40], [x1 - 150, gy + 36]]) tufts.M(tx - 8, ty).L(tx, ty - 14).L(tx + 3, ty).L(tx + 9, ty - 11).L(tx + 12, ty);
  sky.push({ path: tufts, stroke: "#5f8062", strokeWidth: 2.2, opacity: 0.7 });
  return [place(sky, 2)];
}

export default function build(): TemplateDef {
  /* --------------------------------- cover --------------------------------- */
  const gy = 850;
  const cover = P(
    BG,
    [
      border(),
      T("You're invited to our", 62, { x: 150, width: 700, fontFamily: "Dancing Script", fontWeight: 600, fontSize: 40, fill: TERRA }),
      T("Housewarming", 112, { x: 40, width: 920, fontFamily: "Fraunces", fontWeight: 600, fontSize: 104, lineHeight: 1.1, fill: GREEN }),
      T("& open house", 232, { x: 200, width: 600, fontFamily: "Dancing Script", fontWeight: 700, fontSize: 56, fill: TERRA }),
      lock(O(archFrame({ w: 660, h: 700, stroke: SAGE_D, strokeWidth: 3, lines: 2, gap: 12 }), { x: 170, y: 318 })),
      ...backdrop(190, 338, 620, 1010, gy),
      house(500, gy),
      keyBunch(142, 410, 1),
      hangingPlant(866, 345, 1),
      snakePlant(150, 1030, 1.05),
      bushPlant(850, 1032, 1.1),
      T("Sara & Imran Chowdhury", 1036, { x: 100, width: 800, fontFamily: "Fraunces", italic: true, fontWeight: 500, fontSize: 56, fill: GREEN }),
      T("invite you to see our new home", 1112, { x: 150, width: 700, fontFamily: "Dancing Script", fontWeight: 600, fontSize: 40, fill: TERRA }),
      rule(1182, 300),
      T("Saturday, 20 November 2027  ·  4 PM", 1204, { x: 100, width: 800, fontFamily: "Poppins", fontWeight: 600, fontSize: 28, letterSpacing: 2, fill: BROWN }),
      T("House 14, Road 7, Dhanmondi, Dhaka", 1252, { x: 100, width: 800, fontFamily: "Poppins", fontWeight: 400, fontSize: 25, fill: BROWN, opacity: 0.8 }),
      T(GUEST_TOKEN, 1304, { x: 200, width: 600, fontFamily: "Dancing Script", fontWeight: 700, fontSize: 44, fill: TERRA }),
    ],
    "Invitation",
  );

  /* -------------------------------- details -------------------------------- */
  const rows: ["clock" | "pin" | "leaf" | "gift", string, string, string][] = [
    ["clock", "When", "Saturday, 20 November 2027", "Open house from 4 PM till 8 PM"],
    ["pin", "Where", "House 14, Road 7", "Dhanmondi, Dhaka 1209"],
    ["leaf", "Dress", "Cosy & Casual", "Come as you are, shoes optional"],
    ["gift", "A little note", "Your company is the gift", "No presents needed, just bring a smile"],
  ];
  const rowLayers: Layer[] = [];
  rows.forEach(([ic, k, v, sub], i) => {
    const y = 366 + i * 176;
    rowLayers.push(
      lock(S({ x: 80, y, width: 840, height: 150, cornerRadius: 28, fill: "#fffaf0", stroke: SAGE, strokeWidth: 2 })),
      lock(S({ shape: "ellipse", x: 112, y: y + 26, width: 98, height: 98, fill: i % 2 ? SAGE : "#f1c9b0" })),
      icon(ic, 161, y + 75, i % 2 ? "#ffffff" : TERRA, i % 2 ? SAGE : "#f1c9b0"),
      T(k, y + 20, { x: 250, width: 640, align: "left", fontFamily: "Poppins", fontWeight: 600, fontSize: 19, letterSpacing: 7, uppercase: true, fill: TERRA }),
      T(v, y + 48, { x: 250, width: 650, align: "left", fontFamily: "Fraunces", fontWeight: 600, fontSize: 40, fill: GREEN }),
      T(sub, y + 102, { x: 250, width: 650, align: "left", fontFamily: "Poppins", fontWeight: 400, fontSize: 23, fill: BROWN, opacity: 0.8 }),
    );
  });
  const details = P(
    BG,
    [
      lock(S({ x: 0, y: 0, width: 1000, height: 290, fill: linear(90, [0, "#d0714b"], [1, "#b4532f"]) })),
      lock(O(scallops({ color: "#b4532f", w: 1000, r: 25, fill: true }), { x: 0, y: 268 })),
      hangingPlant(120, -4, 0.72),
      hangingPlant(880, -4, 0.72),
      T("Come on in", 66, { x: 150, width: 700, fontFamily: "Dancing Script", fontWeight: 700, fontSize: 112, lineHeight: 1.1, fill: CREAM }),
      T("Open house details", 206, { x: 150, width: 700, fontFamily: "Poppins", fontWeight: 500, fontSize: 22, letterSpacing: 10, uppercase: true, fill: "#fbe1cf" }),
      ...rowLayers,
      lock(S({ x: 350, y: 1200, width: 300, height: 82, cornerRadius: 14, fill: "#5a4638", stroke: "#3b2f2a", strokeWidth: 3 })),
      lock(S({ x: 362, y: 1212, width: 276, height: 58, cornerRadius: 8, fill: null, stroke: "#d9b98a", strokeWidth: 1.6, dash: [6, 5] })),
      T("Welcome", 1220, { x: 350, width: 300, fontFamily: "Dancing Script", fontWeight: 700, fontSize: 44, fill: "#f3dfc0" }),
      snakePlant(185, 1352, 0.78),
      bushPlant(815, 1352, 0.85),
    ],
    "Details",
  );

  /* ------------------------------ photo page ------------------------------ */
  const photo = P(
    BG,
    [
      border(),
      keyBunch(130, 130, 0.9),
      hangingPlant(880, 56, 0.9),
      T("Our new chapter", 70, { x: 220, width: 560, fontFamily: "Dancing Script", fontWeight: 700, fontSize: 84, fill: TERRA }),
      lock(O(archFrame({ w: 560, h: 700, stroke: SAGE_D, strokeWidth: 3, lines: 2, gap: 12 }), { x: 220, y: 210 })),
      I({ x: 250, y: 240, width: 500, height: 640, mask: "arch", placeholderFill: "#e6c9ac", borderColor: TERRA, borderWidth: 5 }),
      snakePlant(170, 935, 1.0),
      bushPlant(836, 938, 1.05),
      T("Four walls, one roof,", 960, { x: 100, width: 800, fontFamily: "Fraunces", italic: true, fontWeight: 500, fontSize: 52, fill: GREEN }),
      T("endless memories.", 1028, { x: 100, width: 800, fontFamily: "Fraunces", italic: true, fontWeight: 500, fontSize: 52, fill: GREEN }),
      rule(1128, 300),
      T("Come fill our home with laughter, chai and love.", 1148, { x: 160, width: 680, fontFamily: "Poppins", fontWeight: 400, fontSize: 26, lineHeight: 1.45, fill: BROWN, opacity: 0.85 }),
      T("Sara & Imran", 1262, { x: 200, width: 600, fontFamily: "Dancing Script", fontWeight: 700, fontSize: 66, fill: TERRA }),
    ],
    "Photo",
  );

  return {
    slug: "housewarming-keys-home",
    name: "Housewarming Keys & Home",
    tagline: "Warm terracotta and sage housewarming invitation with a cosy home illustration",
    description:
      "A warm, modern housewarming party invitation with a hand-drawn style house, brass keys, potted plants and a terracotta and sage palette. Perfect for new home open house celebrations.",
    categories: ["housewarming", "party"],
    keywords: ["housewarming party invitation template", "new home open house invitation", "terracotta and sage housewarming invite", "house keys new home announcement card", "digital housewarming invitation with guest name", "cozy new home celebration card"],
    palette: ["#fbf3e4", "#c4603c", "#9db39a", "#3f5a46", "#e0a94c"],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
