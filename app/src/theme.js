// Couleurs et tailles utilisées partout dans l'app.
// Un seul design, « Verre » : widgets iOS sombres, sobres et épurés.
// On choisit seulement sa palette d'accent (Nuit, Graphite, Émeraude, Lavande, Rubis),
// mémorisée sur l'appareil. La palette colore les reflets des cartes, les touches et les anneaux.
import { Platform } from 'react-native';

// Police système façon iPhone (SF) pour le design « Verre ».
const sf = Platform.select({ ios: 'System', android: 'sans-serif', default: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif' });

export const THEMES = {
  // « Verre » : widgets iOS sombres. Fond noir, cartes en verre dépoli, coches blanches,
  // reflets lumineux colorés en bas des cartes (bleu pour la salle, ambre pour l'humeur).
  glass: {
    dark: true,
    glass: true,
    radius: 28,
    bg: '#000000',
    card: '#141416',
    card2: 'rgba(255,255,255,0.08)',
    field: 'rgba(255,255,255,0.07)',
    line: 'rgba(255,255,255,0.10)',
    track: 'rgba(255,255,255,0.10)',
    ring: 'rgba(255,255,255,0.38)',
    tx: '#FFFFFF',
    mu: 'rgba(235,235,245,0.58)',
    pri: '#FFFFFF', // coches et boutons actifs blancs
    priRgb: '255,255,255',
    onPri: '#000000',
    acc: '#FFB340', // ambre
    accRgb: '255,179,64',
    accSoft: 'rgba(255,255,255,0.08)',
    accLine: 'rgba(255,255,255,0.22)',
    lav1: '#1B2B52', // carte mise en avant : verre teinté de bleu nuit
    lav2: '#11182A',
    lav3: '#0B0C10',
    chip: 'rgba(255,255,255,0.10)',
    shadow: '#000000',
    bar: 'rgba(30,30,32,0.78)',
    barLine: 'rgba(255,255,255,0.12)',
    red: '#FF453A',
    c3: '#64D2FF',
    glowA: '10,96,255', // reflet bleu (salle)
    glowB: '255,149,0', // reflet ambre (humeur)
    todo: ['#FFD60A', '#FF9F0A', '#30D158', '#64D2FF', '#BF5AF2'],
    emoji: true,
    serif: sf,
  },
};

// Les couleurs du design en cours. Toute l'app lit cet objet ; setTheme le remplit.
// Les palettes d'accent. glowA : reflet de la carte Salle ; glowB : reflet de la carte Humeur ;
// acc : petites touches (titres en capitales) ; c3 : troisième anneau ; todo : barres des tâches.
export const PALETTES = {
  nuit: { label: 'Nuit', glowA: '10,96,255', glowB: '255,149,0', acc: '#FFB340', accRgb: '255,179,64', c3: '#64D2FF', lav1: '#1B2B52', lav2: '#11182A', todo: ['#FFD60A', '#FF9F0A', '#30D158', '#64D2FF', '#BF5AF2'] },
  graphite: { label: 'Graphite', glowA: '142,142,160', glowB: '210,210,220', acc: '#D1D1D6', accRgb: '209,209,214', c3: '#8E8E93', lav1: '#2A2A2E', lav2: '#18181B', todo: ['#F2F2F7', '#C7C7CC', '#AEAEB2', '#8E8E93', '#636366'] },
  emeraude: { label: 'Émeraude', glowA: '0,170,120', glowB: '48,209,88', acc: '#5DE08A', accRgb: '93,224,138', c3: '#63E6E2', lav1: '#123A2E', lav2: '#0D1F1A', todo: ['#30D158', '#63E6BE', '#64D2FF', '#FFD60A', '#A2845E'] },
  lavande: { label: 'Lavande', glowA: '94,92,230', glowB: '191,90,242', acc: '#C98BFF', accRgb: '201,139,255', c3: '#8E8CFF', lav1: '#2A2156', lav2: '#16122C', todo: ['#BF5AF2', '#7D7AFF', '#FF6482', '#64D2FF', '#FFD60A'] },
  rubis: { label: 'Rubis', glowA: '200,30,70', glowB: '255,110,64', acc: '#FF7A8A', accRgb: '255,122,138', c3: '#FF9F0A', lav1: '#4A1424', lav2: '#220B12', todo: ['#FF453A', '#FF9F0A', '#FFD60A', '#FF6482', '#BF5AF2'] },
};
export const PALETTE_ORDER = ['nuit', 'graphite', 'emeraude', 'lavande', 'rubis'];

// Les couleurs en cours. Toute l'app lit cet objet ; setTheme le remplit.
export const C = { ...THEMES.glass, ...PALETTES.nuit, name: 'nuit' };
export function setTheme(name) {
  const t = PALETTES[name] ? name : 'nuit';
  Object.assign(C, THEMES.glass, PALETTES[t], { name: t });
}
export const THEME_KEY = 'newday.palette';

// Intensité de la couleur principale (0 à 1) pour les cases de calendrier et de régularité.
export const accA = (a) => `rgba(${C.priRgb},${Math.max(0, Math.min(1, a)).toFixed(2)})`;

// Couleur de chaque type d'événement de l'agenda.
export const TYPES = [
  { id: 'cours', label: 'Cours', color: '#2F6B52' },
  { id: 'rdv', label: 'RDV', color: '#B8862F' },
  { id: 'ex', label: 'Examen', color: '#B4483A' },
  { id: 'au', label: 'Autre', color: '#4F7596' },
];
export const typeColor = (t) => (TYPES.find((x) => x.id === t) || TYPES[3]).color;
