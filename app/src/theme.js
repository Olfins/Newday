// Couleurs et tailles utilisées partout dans l'app.
// Trois designs au choix, mémorisés sur l'appareil :
// - « Verre » (par défaut) : widgets iOS sombres, voir plus bas.
// - « Cozy » (Bureau chaleureux) : fond crème, cartes beige clair, vert sapin pour
//   ce qui est choisi, touches de laiton doré, titres avec une police à empattements.
// - « Focus » (dark academia) : fond presque noir, cartes sombres façon iPhone,
//   or ancien pour ce qui est choisi, touches bordeaux, texte couleur parchemin.
import { Platform } from 'react-native';

// Police à empattements pour les titres (déjà présente sur chaque appareil).
const serif = Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia, "Times New Roman", serif' });
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
  cozy: {
    dark: false,
    bg: '#F2EBDC', // crème
    card: '#FBF7EE', // beige clair
    card2: '#F3ECDD',
    field: '#F6F0E4',
    line: '#E4D9C3',
    track: 'rgba(70,52,20,0.09)',
    ring: 'rgba(70,52,20,0.24)',
    tx: '#22302A', // presque noir, teinté de vert
    mu: '#877C69', // gris chaud
    pri: '#1F4D3A', // vert sapin : jour choisi, cases cochées, boutons actifs
    priRgb: '31,77,58',
    onPri: '#FBF7EE', // texte posé sur le vert
    acc: '#A87F33', // laiton : petites touches dorées
    accRgb: '168,127,51',
    accSoft: 'rgba(168,127,51,0.12)',
    accLine: 'rgba(168,127,51,0.40)',
    lav1: '#E6D5AE', // dégradé doré des cartes mises en avant
    lav2: '#F1E6CC',
    lav3: '#FAF4E7',
    chip: 'rgba(255,255,255,0.65)', // petites pastilles posées sur le dégradé
    shadow: '#6B5320',
    bar: 'rgba(28,58,44,0.97)', // barre d'onglets et minuteur (vert sapin foncé)
    barLine: 'transparent',
    red: '#B4483A',
    c3: '#4F7596', // troisième couleur des anneaux (bleu ardoise)
    serif,
  },
  focus: {
    dark: true,
    bg: '#0B0A09', // noir chaud
    card: '#1A1816', // cartes sombres, comme les listes de l'iPhone
    card2: '#24211E',
    field: '#201D1A',
    line: 'rgba(237,227,208,0.09)',
    track: 'rgba(237,227,208,0.08)',
    ring: 'rgba(237,227,208,0.22)',
    tx: '#EDE3D0', // parchemin
    mu: '#8F877A', // gris pierre
    pri: '#C9A66B', // or ancien : jour choisi, cases cochées, boutons actifs
    priRgb: '201,166,107',
    onPri: '#15110C',
    acc: '#C0736A', // bordeaux adouci : petites touches
    accRgb: '192,115,106',
    accSoft: 'rgba(192,115,106,0.14)',
    accLine: 'rgba(201,166,107,0.30)',
    lav1: '#3A1F1F', // dégradé bordeaux profond des cartes mises en avant
    lav2: '#241917',
    lav3: '#1A1715',
    chip: 'rgba(255,255,255,0.08)',
    shadow: '#000000',
    bar: 'rgba(32,30,28,0.82)', // barre d'onglets façon iPhone, verre fumé flouté
    barLine: 'rgba(237,227,208,0.10)',
    red: '#D0645A',
    c3: '#7F9AAE',
    serif,
  },
};

// Les couleurs du design en cours. Toute l'app lit cet objet ; setTheme le remplit.
// Valeurs par défaut des options propres au design « Verre ».
const BASE = { glass: false, radius: 22, glowA: null, glowB: null, todo: null, emoji: false };
export const C = { ...BASE, ...THEMES.glass, name: 'glass' };
export const THEME_ORDER = ['glass', 'cozy', 'focus'];
export const THEME_LABEL = { glass: 'Verre', cozy: 'Cozy', focus: 'Focus' };
export function setTheme(name) {
  const t = THEMES[name] ? name : 'glass';
  Object.assign(C, BASE, THEMES[t], { name: t });
}
export const nextTheme = (name) => THEME_ORDER[(THEME_ORDER.indexOf(name) + 1) % THEME_ORDER.length];
// Nouvelle clé : tout le monde découvre le design « Verre », puis peut changer.
export const THEME_KEY = 'newday.theme2';

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
