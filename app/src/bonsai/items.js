// Le catalogue de la boutique : pots, sellettes, bibliothèque (bois et murs) et objets.
// Le premier objet de chaque catégorie (sans prix) est celui de base, offert.
import { C } from '../theme';

export const POTS = {
  terre: { label: 'Terre cuite', shape: 'rect', body: '#9A5B3C', dark: '#7A4630', rim: '#A9694A' },
  gres: { label: 'Grès brun', price: 120, shape: 'oval', body: '#5B4636', dark: '#45352A', rim: '#6A5442' },
  celadon: { label: 'Céladon émaillé', price: 220, shape: 'oval', body: '#8FB3A0', dark: '#6E9481', rim: '#A6C6B5', glaze: true },
  ardoise: { label: 'Ardoise', price: 260, shape: 'rect', body: '#3B3F44', dark: '#2B2E32', rim: '#4A4F55' },
  indigo: { label: 'Émail indigo', price: 320, shape: 'round', body: '#2E3F66', dark: '#22304F', rim: '#3B4E7A', glaze: true },
  craquele: { label: 'Crème craquelé', price: 400, shape: 'round', body: '#E3D8C2', dark: '#C9BCA2', rim: '#EEE6D6', crackle: true },
};

// h : hauteur de la sellette (le pot est posé dessus).
export const STANDS = {
  table: { label: 'Plateau en bois', h: 34 },
  tranche: { label: 'Tranche de bois', price: 160, h: 26 },
  sellette: { label: 'Sellette haute', price: 220, h: 86 },
  pierre: { label: 'Socle en pierre', price: 280, h: 46 },
  marbre: { label: 'Colonne de marbre', price: 450, h: 96 },
};

export const WOODS = {
  base: { label: 'Chêne clair' },
  noyer: { label: 'Noyer', price: 200, wood: '#5A3E2B', back: '#3A281C', edge: '#6E4D36' },
  acajou: { label: 'Acajou', price: 300, wood: '#6B3324', back: '#401E16', edge: '#82412F' },
  ebene: { label: 'Bois noirci', price: 380, wood: '#2B2420', back: '#181412', edge: '#3A312B' },
};

export const WALLS = {
  base: { label: 'Mur uni' },
  lambris: { label: 'Lambris', price: 200 },
  vert: { label: 'Vert anglais', price: 250, color: '#2F4A3E' },
  bordeaux: { label: 'Bordeaux', price: 250, color: '#4A2226' },
  raye: { label: 'Papier rayé', price: 300 },
};

export const OBJECTS = {
  none: { label: 'Rien' },
  sablier: { label: 'Sablier', price: 150 },
  lampe: { label: 'Lampe de banquier', price: 180 },
  globe: { label: 'Globe terrestre', price: 220 },
  pendule: { label: 'Pendule', price: 260 },
};

export const CATS = [
  { id: 'pot', label: 'Pots', items: POTS, base: 'terre' },
  { id: 'stand', label: 'Sellettes', items: STANDS, base: 'table' },
  { id: 'wood', label: 'Bois', items: WOODS, base: 'base' },
  { id: 'wall', label: 'Murs', items: WALLS, base: 'base' },
  { id: 'obj', label: 'Objets', items: OBJECTS, base: 'none' },
];

// Ce qui est installé (avec les choix de base pour ce qui n'a pas été changé).
export function setupOf(S) {
  const set = (S.lib && S.lib.set) || {};
  const out = {};
  CATS.forEach((c) => { out[c.id] = set[c.id] && c.items[set[c.id]] ? set[c.id] : c.base; });
  return out;
}

// Couleurs de la pièce (design sombre) selon les choix de la boutique.
export function palette(setup) {
  const dark = C.dark;
  const w = WOODS[setup.wood] || {};
  const wl = WALLS[setup.wall] || {};
  const gl = C.glass;
  return {
    dark,
    wall: wl.color || (gl ? '#0E0E10' : dark ? '#1B1714' : '#E8DDC8'),
    wall2: wl.color ? shade(wl.color, -10) : gl ? '#17171B' : dark ? '#15120F' : '#DED1B8',
    stripes: setup.wall === 'raye',
    lambris: setup.wall === 'lambris',
    floor: gl ? '#161412' : dark ? '#221B16' : '#B99B72',
    floorLine: dark ? '#17120F' : '#A3865F',
    wood: w.wood || (dark ? '#4A3423' : '#9C7A52'),
    back: w.back || (dark ? '#2A1D14' : '#6E5236'),
    edge: w.edge || (dark ? '#5C412D' : '#B08C61'),
    glow: gl ? '#FFD9A0' : dark ? '#C9A66B' : '#FFF6DC',
    glowA: gl ? 0.2 : dark ? 0.16 : 0.75,
    gold: dark ? '#C9A66B' : '#C8A24E',
    books: dark
      ? ['#6E2B2B', '#2E4A3B', '#2C3B57', '#7A6230', '#4E3B30', '#5A4060', '#2F5252']
      : ['#7A3434', '#2F5240', '#2E4466', '#9A7A38', '#6A4E3A', '#6A4A6E', '#3C6464'],
  };
}

// Éclaircit (+) ou assombrit (−) une couleur hexadécimale.
export function shade(hex, pct) {
  const n = parseInt(hex.slice(1), 16);
  const f = (v) => Math.max(0, Math.min(255, Math.round(v + (pct / 100) * (pct > 0 ? 255 - v : v))));
  const r = f(n >> 16), g = f((n >> 8) & 255), b = f(n & 255);
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}
