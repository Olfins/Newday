// Les compagnons : le chat d'origine et les trois starters (plante, eau, feu).
// Chaque starter a 4 étapes, comme le chat : on passe à la suivante tous les 250 XP.
// Les tenues des starters sont dessinées pour leur corps : chaque starter a les siennes.

export const SPECIES = {
  plante: {
    label: 'Plante', color: '#3F9161', soft: 'rgba(63,145,97,0.14)',
    stages: ['Glandou', 'Feuillécu', 'Sylvécu', 'Chênor'],
    blurb: 'Un petit écureuil des bois, une feuille sur le front. Doux et curieux.',
    cry: ['Couic !', 'Couic couic !', 'Kss kss…', 'Crr ?'],
    food: ['Festin de glands', 'Baies'],
  },
  eau: {
    label: 'Eau', color: '#4F86C6', soft: 'rgba(79,134,198,0.14)',
    stages: ['Gouttin', 'Ondine', 'Ondragon', 'Abyssor'],
    blurb: 'Un bébé dragon des mers aux nageoires dorées. Calme et malin.',
    cry: ['Blub !', 'Bloup bloup…', 'Fshhh…', 'Plic ?'],
    food: ['Festin marin', 'Crevettes'],
  },
  feu: {
    label: 'Feu', color: '#E0672A', soft: 'rgba(224,103,42,0.14)',
    stages: ['Braisou', 'Flamèche', 'Brasléo', 'Volcaléo'],
    blurb: 'Un bébé léopard à la queue enflammée. Plein d’énergie.',
    cry: ['Grraou !', 'Rrrr !', 'Grrr…', 'Mraou ?'],
    food: ['Festin grillé', 'Braises sucrées'],
  },
  chat: {
    label: 'Chat', color: '#A87F33', soft: 'rgba(168,127,51,0.14)',
    stages: ['Chaton', 'Jeune chat', 'Adulte', 'PDG'],
    blurb: 'Le chat d’origine, à créer toi-même.',
    cry: ['Miaou !', 'Miaou ?', 'Mrrr…'],
    food: ['Pâtée', 'Croquettes'],
  },
};
export const STARTERS = ['plante', 'eau', 'feu'];

// Le compagnon est un chat s'il a été adopté avant les starters.
export const speciesOf = (pet) => (pet && SPECIES[pet.species] ? pet.species : 'chat');
export const isStarter = (sp) => STARTERS.includes(sp);

// Changer de starter coûte des pièces et recommence à l'étape 1.
// Passer du chat à un starter est gratuit une fois et garde l'XP (le chat évolue en starter).
export const CHANGE_PRICE = 400;

// Tenues de chaque starter. suit / tie : titre du choix de couleur (null = couleur fixe).
// Les clés commencent par l'espèce, pour ne pas mélanger les tenues entre starters.
export const MON_OUTFITS = {
  feu: {
    'feu-none': { label: 'Aucune' },
    'feu-bandana': { label: 'Bandana', suit: null, tie: 'Couleur du bandana' },
    'feu-collier': { label: 'Collier à grelot', suit: 'Couleur du collier', tie: null },
    'feu-harnais': { label: 'Harnais d’aventurier', price: 220, suit: 'Couleur de la sacoche', tie: null },
    'feu-cape': { label: 'Cape de héros', price: 320, suit: 'Couleur de la cape', tie: 'Couleur de l’attache' },
    'feu-pompier': { label: 'Veste de pompier', price: 480, suit: null, tie: null },
    'feu-armure': { label: 'Armure de lave', price: 850, suit: null, tie: null },
  },
  plante: {
    'plante-none': { label: 'Aucune' },
    'plante-salopette': { label: 'Salopette', suit: 'Couleur de la salopette', tie: null },
    'plante-echarpe': { label: 'Écharpe', suit: null, tie: 'Couleur de l’écharpe' },
    'plante-tablier': { label: 'Tablier de jardinier', price: 220, suit: 'Couleur du tablier', tie: null },
    'plante-explorateur': { label: 'Gilet d’explorateur', price: 320, suit: null, tie: 'Couleur du foulard' },
    'plante-kimono': { label: 'Kimono', price: 450, suit: 'Couleur du kimono', tie: 'Couleur de la ceinture' },
    'plante-druide': { label: 'Cape de druide', price: 800, suit: null, tie: null },
  },
  eau: {
    'eau-none': { label: 'Aucune' },
    'eau-mariniere': { label: 'Marinière', suit: 'Couleur des rayures', tie: null },
    'eau-noeud': { label: 'Nœud papillon', suit: null, tie: 'Couleur du nœud' },
    'eau-bouee': { label: 'Bouée', price: 200, suit: null, tie: 'Couleur de la bouée' },
    'eau-capitaine': { label: 'Veste de capitaine', price: 360, suit: 'Couleur de la veste', tie: null },
    'eau-plongee': { label: 'Combinaison de plongée', price: 480, suit: null, tie: 'Couleur des bandes' },
    'eau-royal': { label: 'Cape des abysses', price: 820, suit: null, tie: null },
  },
};

// L'apparence de départ d'un starter : pas de tenue, pas d'accessoire.
export const defaultMonLook = (sp) => ({ acc: 'none', out: sp + '-none', suit: 'marine', tie: 'rouge', sex: 'm' });
