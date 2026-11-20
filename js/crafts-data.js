/**
 * ============================================================
 *  CRAFTS CUSTOM — GameKnight SMP
 *  Généré à partir de la config FasterHoppers (Default Recipes v5.1).
 *  Ajoute / modifie tes recettes ICI uniquement.
 * ============================================================
 *
 *  1) Déclare un item dans GK_ITEMS (si ce n’est pas déjà fait)
 *  2) Ajoute un objet dans GK_CRAFTS
 *
 *  TEXTURES : prises du wiki officiel https://minecraft.wiki
 *  Le champ `wiki` = nom du fichier Invicon (sans le préfixe "Invicon_").
 *  Vérifie le nom exact ici :
 *  https://minecraft.wiki/w/Special:Search?search=Invicon
 *
 *  Grille 3x3, lecture de gauche à droite, haut vers bas :
 *    0 1 2
 *    3 4 5
 *    6 7 8
 *  Utilise null pour une case vide (AIR), ou l’identifiant d’un item.
 */

window.GK_ITEMS = {
  /* ---------- Items vanille ---------- */
  hopper: {
    name: "Entonnoir",
    wiki: "Hopper.png",
    description: "Entonnoir vanille",
  },
  redstone: {
    name: "Poudre de redstone",
    wiki: "Redstone_Dust.png",
    description: "Poudre de redstone",
  },
  iron_nugget: {
    name: "Pépite de fer",
    wiki: "Iron_Nugget.png",
    description: "Pépite de fer",
  },
  gold_nugget: {
    name: "Pépite d’or",
    wiki: "Gold_Nugget.png",
    description: "Pépite d’or",
  },
  emerald: {
    name: "Émeraude",
    wiki: "Emerald.png",
    description: "Émeraude vanille",
  },
  quartz: {
    name: "Quartz du Nether",
    wiki: "Nether_Quartz.png",
    description: "Quartz du Nether",
  },
  amethyst_shard: {
    name: "Éclat d’améthyste",
    wiki: "Amethyst_Shard.png",
    description: "Éclat d’améthyste",
  },
  diamond: {
    name: "Diamant",
    wiki: "Diamond.png",
    description: "Diamant vanille",
  },

  /* ---------- FasterHoppers (icône wiki : entonnoir) ---------- */
  hopper_slowest: {
    name: "Entonnoir Slowest",
    wiki: "Hopper.png",
    description: "FasterHoppers · Vitesse 4",
  },
  hopper_slower: {
    name: "Entonnoir Slower",
    wiki: "Hopper.png",
    description: "FasterHoppers · Vitesse 8",
  },
  hopper_slow: {
    name: "Entonnoir Slow",
    wiki: "Hopper.png",
    description: "FasterHoppers · Vitesse 12",
  },
  hopper_fast: {
    name: "Entonnoir Fast",
    wiki: "Hopper.png",
    description: "FasterHoppers · Vitesse 16",
  },
  hopper_faster: {
    name: "Entonnoir Faster",
    wiki: "Hopper.png",
    description: "FasterHoppers · Vitesse 20",
  },
  hopper_fastest: {
    name: "Entonnoir Fastest",
    wiki: "Hopper.png",
    description: "FasterHoppers · Vitesse 24",
  },
  hopper_extreme: {
    name: "Entonnoir Extreme",
    wiki: "Hopper.png",
    description: "FasterHoppers · Vitesse 64",
  },
};

window.GK_CRAFTS = [
  {
    id: "hopper-slowest",
    name: "Entonnoir Slowest",
    category: "Hoppers",
    description: "Premier palier des entonnoirs améliorés. Vitesse : 4.",
    grid: [null, "redstone", null, "redstone", "hopper", "redstone", null, "redstone", null],
    result: { item: "hopper_slowest", count: 1 },
  },
  {
    id: "hopper-slower",
    name: "Entonnoir Slower",
    category: "Hoppers",
    description: "Amélioration de l’entonnoir Slowest. Vitesse : 8.",
    grid: [
      "iron_nugget", "redstone", "iron_nugget",
      "redstone", "hopper_slowest", "redstone",
      "iron_nugget", "redstone", "iron_nugget",
    ],
    result: { item: "hopper_slower", count: 1 },
  },
  {
    id: "hopper-slow",
    name: "Entonnoir Slow",
    category: "Hoppers",
    description: "Amélioration de l’entonnoir Slower. Vitesse : 12.",
    grid: [
      "gold_nugget", "redstone", "gold_nugget",
      "redstone", "hopper_slower", "redstone",
      "gold_nugget", "redstone", "gold_nugget",
    ],
    result: { item: "hopper_slow", count: 1 },
  },
  {
    id: "hopper-fast",
    name: "Entonnoir Fast",
    category: "Hoppers",
    description: "Amélioration de l’entonnoir Slow. Vitesse : 16.",
    grid: [
      "emerald", "redstone", "emerald",
      "redstone", "hopper_slow", "redstone",
      "emerald", "redstone", "emerald",
    ],
    result: { item: "hopper_fast", count: 1 },
  },
  {
    id: "hopper-faster",
    name: "Entonnoir Faster",
    category: "Hoppers",
    description: "Amélioration de l’entonnoir Fast. Vitesse : 20.",
    grid: [
      "quartz", "redstone", "quartz",
      "redstone", "hopper_fast", "redstone",
      "quartz", "redstone", "quartz",
    ],
    result: { item: "hopper_faster", count: 1 },
  },
  {
    id: "hopper-fastest",
    name: "Entonnoir Fastest",
    category: "Hoppers",
    description: "Amélioration de l’entonnoir Faster. Vitesse : 24.",
    grid: [
      "amethyst_shard", "redstone", "amethyst_shard",
      "redstone", "hopper_faster", "redstone",
      "amethyst_shard", "redstone", "amethyst_shard",
    ],
    result: { item: "hopper_fastest", count: 1 },
  },
  {
    id: "hopper-extreme",
    name: "Entonnoir Extreme",
    category: "Hoppers",
    description: "Le palier ultime des entonnoirs. Vitesse : 64.",
    grid: [
      "diamond", "redstone", "diamond",
      "redstone", "hopper_fastest", "redstone",
      "diamond", "redstone", "diamond",
    ],
    result: { item: "hopper_extreme", count: 1 },
  },
];
