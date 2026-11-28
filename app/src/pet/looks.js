import { MON_OUTFITS, STARTERS as SPECIES_KEYS, defaultMonLook } from './species';

// Les choix pour créer son chat : pelage, motif, yeux, accessoire, tenue, couleurs, garçon ou fille.
// Chaque option a un libellé en français et ses couleurs.

export const FURS = {
  noir: { label: 'Noir', fur: '#2B2B35', furD: '#1B1B22', muzzle: '#3B3B48', line: '#A3A3B8', mouth: '#A3A3B8', dark: true },
  gris: { label: 'Gris', fur: '#9091A6', furD: '#6E6F84', muzzle: '#C9CAD8', line: '#5B5C70', mouth: '#4A4B5E' },
  blanc: { label: 'Blanc', fur: '#F6F4F9', furD: '#D9D6E3', muzzle: '#FFFFFF', line: '#B5B2C4', mouth: '#8A8798' },
  roux: { label: 'Roux', fur: '#F2A65A', furD: '#D9823A', muzzle: '#FBE3C8', line: '#B9773A', mouth: '#5A3A22' },
  creme: { label: 'Crème', fur: '#EBCB9E', furD: '#D3AD78', muzzle: '#FAEEDC', line: '#A8875A', mouth: '#6B4A2B' },
  brun: { label: 'Chocolat', fur: '#7A5236', furD: '#5C3B24', muzzle: '#A57A58', line: '#C9A88C', mouth: '#2E1D10', dark: true },
};
export const PATTERNS = {
  uni: { label: 'Uni' },
  tigre: { label: 'Tigré' },
  tache: { label: 'Tache sur l’œil' },
  chaussettes: { label: 'Chaussettes blanches' },
};
export const EYES = {
  vert: { label: 'Vert', c: '#B9D84E' },
  jaune: { label: 'Doré', c: '#F2C14C' },
  bleu: { label: 'Bleu', c: '#6FB7E8' },
  marron: { label: 'Marron', c: '#8A5A32' },
  violet: { label: 'Violet', c: '#9D8CF0' },
};
export const ACCESSORIES = {
  none: { label: 'Aucun' },
  lunettes: { label: 'Lunettes' },
  soleil: { label: 'Lunettes de soleil' },
  feutre: { label: 'Chapeau feutre' },
  beret: { label: 'Béret' },
  casquette: { label: 'Casquette' },
  // À acheter dans la boutique (price = prix en pièces).
  noeud: { label: 'Nœud', price: 80 },
  bonnet: { label: 'Bonnet en laine', price: 120 },
  monocle: { label: 'Monocle', price: 150 },
  casque: { label: 'Casque audio', price: 180 },
  haut: { label: 'Haut-de-forme', price: 220 },
  couronne: { label: 'Couronne', price: 350 },
};
// suit / tie : titre du choix de couleur (null = couleur fixe, pas de choix).
export const OUTFITS = {
  cravate: { label: 'Costume et cravate', suit: 'Couleur du costume', tie: 'Couleur de la cravate' },
  noeud: { label: 'Costume et nœud', suit: 'Couleur du costume', tie: 'Couleur du nœud' },
  gilet: { label: 'Gilet et cravate', suit: 'Couleur du gilet', tie: 'Couleur de la cravate' },
  col: { label: 'Col roulé', suit: 'Couleur du pull', tie: 'Couleur du pendentif' },
  // À acheter dans la boutique.
  bucheron: { label: 'Chemise de bûcheron', price: 250, suit: 'Couleur des carreaux', tie: 'Couleur des fils' },
  doudoune: { label: 'Doudoune', price: 350, suit: 'Couleur de la doudoune', tie: null },
  smoking: { label: 'Smoking', price: 400, suit: null, tie: 'Couleur du nœud' },
  cuir: { label: 'Veste en cuir', price: 450, suit: null, tie: null },
  trench: { label: 'Trench-coat', price: 500, suit: null, tie: 'Couleur de la cravate' },
  armure: { label: 'Armure de chevalier', price: 900, suit: null, tie: 'Couleur du blason' },
};
// Tenues dont la couleur est fixe.
const FIXED = { smoking: '#1D1D25', cuir: '#2E2522', trench: '#B89B72', armure: '#A9B0BC' };

// Garde seulement les choix gratuits ou achetés (own : objets achetés, comme « acc:couronne »).
export function available(options, prefix, own) {
  const o = {};
  Object.entries(options).forEach(([k, v]) => { if (!v.price || (own && own[prefix + ':' + k])) o[k] = v; });
  return o;
}
export const SUITS = {
  marine: { label: 'Marine', c: '#2F3B5C' },
  anthracite: { label: 'Anthracite', c: '#4A4D5C' },
  noir: { label: 'Noir', c: '#22222A' },
  bordeaux: { label: 'Bordeaux', c: '#7A2E3E' },
  vert: { label: 'Vert sapin', c: '#2F5B4B' },
  violet: { label: 'Violet', c: '#4B3F72' },
  beige: { label: 'Beige', c: '#B79E7E' },
};
export const TIES = {
  violet: { label: 'Violet', c: '#6C5FD4' },
  orange: { label: 'Orange', c: '#F08A3C' },
  rouge: { label: 'Rouge', c: '#D9465A' },
  jaune: { label: 'Jaune', c: '#E8B83A' },
  bleu: { label: 'Bleu ciel', c: '#5BA8E8' },
  rose: { label: 'Rose', c: '#F19CB7' },
};
export const SEXES = { m: { label: 'Garçon', il: 'il', e: '' }, f: { label: 'Fille', il: 'elle', e: 'e' } };

// Les deux chats d'origine, pour les compagnons déjà adoptés.
export const PRESETS = {
  noir: { fur: 'noir', pat: 'uni', eye: 'vert', acc: 'none', out: 'cravate', suit: 'marine', tie: 'violet', sex: 'm' },
  roux: { fur: 'roux', pat: 'tigre', eye: 'marron', acc: 'none', out: 'noeud', suit: 'violet', tie: 'orange', sex: 'f' },
};
export const DEFAULT_LOOK = PRESETS.noir;

// L'apparence d'un chat : la sienne, ou celle du chat d'origine choisi avant.
export function lookOf(pet) {
  if (!pet) return DEFAULT_LOOK;
  if (typeof pet === 'string') return PRESETS[pet] || DEFAULT_LOOK;
  const l = { ...(PRESETS[pet.kind] || DEFAULT_LOOK), ...(pet.look || {}) };
  // Les anciennes coiffures n'existent plus : on les remplace par « aucun accessoire ».
  delete l.hair; delete l.hc;
  if (!ACCESSORIES[l.acc]) l.acc = 'none';
  if (!OUTFITS[l.out]) l.out = 'cravate';
  return l;
}

// L'apparence de n'importe quel compagnon (chat ou starter).
export function petLook(pet) {
  const sp = pet && SPECIES_KEYS.includes(pet.species) ? pet.species : null;
  if (!sp) return lookOf(pet);
  const l = { ...defaultMonLook(sp), ...((pet && pet.look) || {}) };
  if (!ACCESSORIES[l.acc]) l.acc = 'none';
  if (!MON_OUTFITS[sp][l.out]) l.out = sp + '-none';
  return l;
}

const keys = (o) => Object.keys(o);
const any = (o) => { const k = keys(o); return k[Math.floor(Math.random() * k.length)]; };
export function randomLook(own) {
  return { fur: any(FURS), pat: any(PATTERNS), eye: any(EYES), acc: any(available(ACCESSORIES, 'acc', own)), out: any(available(OUTFITS, 'out', own)), suit: any(SUITS), tie: any(TIES), sex: any(SEXES) };
}

// Assombrit une couleur (#RRGGBB) : f = 0.8 donne 80 % de la luminosité.
export function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  const c = (v) => Math.max(0, Math.min(255, Math.round(v * f))).toString(16).padStart(2, '0');
  return '#' + c(n >> 16) + c((n >> 8) & 255) + c(n & 255);
}

// Toutes les couleurs utiles pour dessiner, à partir des choix.
export function palette(look) {
  const L = { ...DEFAULT_LOOK, ...look };
  const F = FURS[L.fur] || FURS.noir;
  const suit = FIXED[L.out] || (SUITS[L.suit] || SUITS.marine).c;
  const socks = L.pat === 'chaussettes' && L.fur !== 'blanc';
  return {
    ...F,
    ear: '#E9A3B4',
    eye: (EYES[L.eye] || EYES.vert).c,
    pupil: '#15151B',
    suit,
    suitD: shade(suit, 0.75),
    accent: (TIES[L.tie] || TIES.violet).c,
    arm: L.out === 'gilet' ? '#FFFFFF' : L.out === 'bucheron' ? shade(suit, 0.9) : suit,
    paw: socks ? '#FFFFFF' : F.fur,
    muzzle: socks ? '#FFFFFF' : F.muzzle,
    patch: F.dark ? '#EDEAF3' : F.furD,
    look: L,
  };
}
