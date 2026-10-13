import type { TemplateDef } from "./kit";
import ivoryArch from "./ivory-arch";
import emeraldNikah from "./emerald-nikah";
import midnightGold from "./midnight-gold";
import royalMaroon from "./royal-maroon";
import blushPeony from "./blush-peony";
import dustyBlueLaurel from "./dusty-blue-laurel";
import sageLinen from "./sage-linen";
import noirEditorial from "./noir-editorial";
import terracottaBoho from "./terracotta-boho";
import sunsetGradient from "./sunset-gradient";
import roseGoldGeometric from "./rose-gold-geometric";
import vintageParchment from "./vintage-parchment";
import starryNight from "./starry-night";
import autumnRust from "./autumn-rust";
import bengaliAlpona from "./bengali-alpona";
import cherryBlossom from "./cherry-blossom";
import ivoryMihrab from "./ivory-mihrab";
import lavenderFields from "./lavender-fields";
import marbleGold from "./marble-gold";
import mehndiHenna from "./mehndi-henna";
import monogramCrest from "./monogram-crest";
import oceanMist from "./ocean-mist";
import polaroidCollage from "./polaroid-collage";
import royalPeacock from "./royal-peacock";
import tropicalPalm from "./tropical-palm";
import winterFrost from "./winter-frost";
import punjabiPhulkari from "./punjabi-phulkari";

export type { TemplateDef } from "./kit";

const builders: (() => TemplateDef)[] = [
  ivoryArch,
  midnightGold,
  blushPeony,
  emeraldNikah,
  royalMaroon,
  sageLinen,
  noirEditorial,
  dustyBlueLaurel,
  terracottaBoho,
  roseGoldGeometric,
  sunsetGradient,
  vintageParchment,
  starryNight,
  autumnRust,
  bengaliAlpona,
  cherryBlossom,
  ivoryMihrab,
  lavenderFields,
  marbleGold,
  mehndiHenna,
  monogramCrest,
  oceanMist,
  polaroidCollage,
  royalPeacock,
  tropicalPalm,
  winterFrost,
  punjabiPhulkari,
];

let cache: TemplateDef[] | null = null;
export function getTemplates(): TemplateDef[] {
  return (cache ??= builders.map((b) => b()));
}
export function getTemplate(slug: string): TemplateDef | undefined {
  return getTemplates().find((t) => t.slug === slug);
}
