/**
 * ============================================================
 *  CRAFTS CUSTOM — GameKnight SMP
 *  Ajoute tes recettes ICI uniquement.
 *  Pas besoin de toucher à crafts.html ni au CSS.
 * ============================================================
 *
 *  1) Déclare un item dans GK_ITEMS (si ce n’est pas déjà fait)
 *  2) Ajoute un objet dans GK_CRAFTS
 *
 *  TEXTURES : prises du wiki officiel https://minecraft.wiki
 *  Le champ `wiki` = nom du fichier Invicon (sans le préfixe "Invicon_").
 *  Exemples :
 *    wiki: "Diamond.png"              → File:Invicon Diamond.png
 *    wiki: "Netherite_Ingot.png"      → File:Invicon Netherite Ingot.png
 *    wiki: "Nether_Star.gif"          → File:Invicon Nether Star.gif
 *
 *  Vérifie le nom exact ici :
 *  https://minecraft.wiki/w/Special:Search?search=Invicon
 *
 *  Grille 3x3, lecture de gauche à droite, haut vers bas :
 *    0 1 2
 *    3 4 5
 *    6 7 8
 *  Utilise null pour une case vide, ou l’identifiant d’un item.
 *
 *  Tu peux aussi mettre un objet à la place d’un identifiant :
 *    { item: "diamond", count: 2 }
 *    { name: "Item custom", wiki: "Netherite_Sword.png", description: "..." }
 */

window.GK_ITEMS = {
  stick: {
    name: "Bâton",
    wiki: "Stick.png",
    description: "Bâton vanille",
  },
  diamond: {
    name: "Diamant",
    wiki: "Diamond.png",
    description: "Diamant vanille",
  },
  netherite: {
    name: "Lingot de netherite",
    wiki: "Netherite_Ingot.png",
    description: "Lingot de netherite",
  },
  nether_star: {
    name: "Étoile du Nether",
    wiki: "Nether_Star.gif",
    description: "Étoile du Nether",
  },
  gold_ingot: {
    name: "Lingot d’or",
    wiki: "Gold_Ingot.png",
    description: "Lingot d’or",
  },
  gold_block: {
    name: "Bloc d’or",
    wiki: "Block_of_Gold.png",
    description: "Bloc d’or",
  },
  apple: {
    name: "Pomme",
    wiki: "Apple.png",
    description: "Pomme vanille",
  },
  paper: {
    name: "Papier",
    wiki: "Paper.png",
    description: "Papier vanille",
  },
  emerald: {
    name: "Émeraude",
    wiki: "Emerald.png",
    description: "Émeraude vanille",
  },
  ender_pearl: {
    name: "Perle de l’Ender",
    wiki: "Ender_Pearl.png",
    description: "Perle de l’Ender",
  },
  blaze_rod: {
    name: "Bâton de Blaze",
    wiki: "Blaze_Rod.png",
    description: "Bâton de Blaze",
  },
  book: {
    name: "Livre",
    wiki: "Book.png",
    description: "Livre vanille",
  },
  redstone: {
    name: "Redstone",
    wiki: "Redstone.png",
    description: "Poudre de redstone",
  },
  knight_sword: {
    name: "Lame du Chevalier",
    wiki: "Netherite_Sword.png",
    description: "Épée custom GameKnight SMP (icône wiki : épée en netherite)",
  },
  knight_apple: {
    name: "Pomme du SMP",
    wiki: "Enchanted_Golden_Apple.gif",
    description: "Pomme custom — icône wiki : pomme dorée enchantée",
  },
  staff_pass: {
    name: "Sceau du Staff",
    wiki: "Name_Tag.png",
    description: "Objet staff — icône wiki : name tag",
  },
  warp_compass: {
    name: "Boussole de Warp",
    wiki: "Compass.gif",
    description: "Téléportation vers un warp du spawn — icône wiki : boussole",
  },
  lucky_key: {
    name: "Clé Lucky",
    wiki: "Ominous_Trial_Key.png",
    description: "Ouvre un coffre lucky du hub — icône wiki : ominous trial key",
  },
};

window.GK_CRAFTS = [
  {
    id: "lame-chevalier",
    name: "Lame du Chevalier",
    category: "Armes",
    description: "Épée signature du SMP. Plus solide qu’une épée en diamant, avec un léger éclat rouge-orange.",
    grid: [null, "diamond", null, null, "diamond", null, null, "stick", null],
    result: { item: "knight_sword", count: 1 },
  },
  {
    id: "pomme-smp",
    name: "Pomme du SMP",
    category: "Nourriture",
    description: "Une pomme enchantée custom, craftée avec de l’or et une touche de netherite.",
    grid: [
      "gold_ingot",
      "gold_block",
      "gold_ingot",
      "gold_block",
      "apple",
      "gold_block",
      "gold_ingot",
      "netherite",
      "gold_ingot",
    ],
    result: { item: "knight_apple", count: 1 },
  },
  {
    id: "boussole-warp",
    name: "Boussole de Warp",
    category: "Utilitaires",
    description: "Permet de revenir vers un warp du spawn. Recette communautaire.",
    grid: [
      null,
      "ender_pearl",
      null,
      "redstone",
      "emerald",
      "redstone",
      null,
      "blaze_rod",
      null,
    ],
    result: { item: "warp_compass", count: 1 },
  },
  {
    id: "cle-lucky",
    name: "Clé Lucky",
    category: "Événements",
    description: "Ouvre les coffres lucky lors des events. Le craft peut être activé temporairement.",
    grid: [
      null,
      "gold_ingot",
      null,
      "gold_ingot",
      "nether_star",
      "gold_ingot",
      null,
      "gold_ingot",
      null,
    ],
    result: { item: "lucky_key", count: 1 },
  },
  {
    id: "sceau-staff",
    name: "Sceau du Staff",
    category: "Staff",
    description: "Objet réservé à l’équipe (GameKnight, Creeper56, gamig_). Exemple de recette staff.",
    grid: [
      "paper",
      "nether_star",
      "paper",
      "paper",
      "book",
      "paper",
      "paper",
      "emerald",
      "paper",
    ],
    result: { item: "staff_pass", count: 1 },
  },
];
