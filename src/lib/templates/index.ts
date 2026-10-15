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
import alponaRedIvoryGrand from "./alpona-red-ivory-grand";
import anniversaryGoldenYears from "./anniversary-golden-years";
import artDecoChampagne from "./art-deco-champagne";
import babyShowerClouds from "./baby-shower-clouds";
import banglaBiyeGold from "./bangla-biye-gold";
import bangladeshiAkdEmerald from "./bangladeshi-akd-emerald";
import bengaliShubhoBibaho from "./bengali-shubho-bibaho";
import birthdayBalloonsBold from "./birthday-balloons-bold";
import birthdayMilestoneGold from "./birthday-milestone-gold";
import birthdayNeonNight from "./birthday-neon-night";
import bridalShowerBlooms from "./bridal-shower-blooms";
import dinnerPartyBotanical from "./dinner-party-botanical";
import diwaliDiyaGlow from "./diwali-diya-glow";
import doubleHappinessRed from "./double-happiness-red";
import eidIftarLanterns from "./eid-iftar-lanterns";
import engagementRingScript from "./engagement-ring-script";
import firstBirthdayPastel from "./first-birthday-pastel";
import gayeHoludTurmeric from "./gaye-holud-turmeric";
import greekOliveSantorini from "./greek-olive-santorini";
import moroccanZellige from "./moroccan-zellige";
import nakshiKantha from "./nakshi-kantha";
import persianGolTurquoise from "./persian-gol-turquoise";
import pujaBoishakhFestive from "./puja-boishakh-festive";
import scandiMinimalLine from "./scandi-minimal-line";
import shaplaRiverBlush from "./shapla-river-blush";
import southernAfricanWax from "./southern-african-wax";
import terracottaTemple from "./terracotta-temple";
import watercolorWildflower from "./watercolor-wildflower";

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
  alponaRedIvoryGrand,
  anniversaryGoldenYears,
  artDecoChampagne,
  babyShowerClouds,
  banglaBiyeGold,
  bangladeshiAkdEmerald,
  bengaliShubhoBibaho,
  birthdayBalloonsBold,
  birthdayMilestoneGold,
  birthdayNeonNight,
  bridalShowerBlooms,
  dinnerPartyBotanical,
  diwaliDiyaGlow,
  doubleHappinessRed,
  eidIftarLanterns,
  engagementRingScript,
  firstBirthdayPastel,
  gayeHoludTurmeric,
  greekOliveSantorini,
  moroccanZellige,
  nakshiKantha,
  persianGolTurquoise,
  pujaBoishakhFestive,
  scandiMinimalLine,
  shaplaRiverBlush,
  southernAfricanWax,
  terracottaTemple,
  watercolorWildflower,
];

let cache: TemplateDef[] | null = null;
export function getTemplates(): TemplateDef[] {
  return (cache ??= builders.map((b) => b()));
}
export function getTemplate(slug: string): TemplateDef | undefined {
  return getTemplates().find((t) => t.slug === slug);
}
