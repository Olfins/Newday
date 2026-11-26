// Les choix pour créer son chat : pelage, motif, yeux, coiffure, tenue, couleurs, garçon ou fille.
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
export const HAIRS = {
  none: { label: 'Aucune' },
  meche: { label: 'Mèche' },
  frange: { label: 'Frange' },
  crete: { label: 'Crête' },
  chignon: { label: 'Chignon' },
  longs: { label: 'Longs' },
};
export const HAIR_COLORS = {
  assorti: { label: 'Comme le pelage', c: null },
  noir: { label: 'Noir', c: '#1E1E26' },
  brun: { label: 'Brun', c: '#6B4226' },
  blond: { label: 'Blond', c: '#E8C468' },
  roux: { label: 'Roux', c: '#D9682B' },
  rose: { label: 'Rose', c: '#F19CB7' },
  bleu: { label: 'Bleu', c: '#5B8DEF' },
};
export const OUTFITS = {
  cravate: { label: 'Costume et cravate' },
  noeud: { label: 'Costume et nœud' },
  gilet: { label: 'Gilet et cravate' },
  col: { label: 'Col roulé' },
};
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
  noir: { fur: 'noir', pat: 'uni', eye: 'vert', hair: 'none', hc: 'assorti', out: 'cravate', suit: 'marine', tie: 'violet', sex: 'm' },
  roux: { fur: 'roux', pat: 'tigre', eye: 'marron', hair: 'none', hc: 'assorti', out: 'noeud', suit: 'violet', tie: 'orange', sex: 'f' },
};
export const DEFAULT_LOOK = PRESETS.noir;

// L'apparence d'un chat : la sienne, ou celle du chat d'origine choisi avant.
export function lookOf(pet) {
  if (!pet) return DEFAULT_LOOK;
  if (typeof pet === 'string') return PRESETS[pet] || DEFAULT_LOOK;
  return { ...(PRESETS[pet.kind] || DEFAULT_LOOK), ...(pet.look || {}) };
}

const keys = (o) => Object.keys(o);
const any = (o) => { const k = keys(o); return k[Math.floor(Math.random() * k.length)]; };
export function randomLook() {
  return { fur: any(FURS), pat: any(PATTERNS), eye: any(EYES), hair: any(HAIRS), hc: any(HAIR_COLORS), out: any(OUTFITS), suit: any(SUITS), tie: any(TIES), sex: any(SEXES) };
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
  const suit = (SUITS[L.suit] || SUITS.marine).c;
  const socks = L.pat === 'chaussettes' && L.fur !== 'blanc';
  return {
    ...F,
    ear: '#E9A3B4',
    eye: (EYES[L.eye] || EYES.vert).c,
    pupil: '#15151B',
    suit,
    suitD: shade(suit, 0.75),
    accent: (TIES[L.tie] || TIES.violet).c,
    hair: (HAIR_COLORS[L.hc] && HAIR_COLORS[L.hc].c) || F.furD,
    arm: L.out === 'gilet' ? '#FFFFFF' : suit,
    paw: socks ? '#FFFFFF' : F.fur,
    muzzle: socks ? '#FFFFFF' : F.muzzle,
    patch: F.dark ? '#EDEAF3' : F.furD,
    look: L,
  };
}
