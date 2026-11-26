// Couleurs et tailles utilisées partout dans l'app.
// Design « Bureau chaleureux » : fond crème, cartes beige clair, vert sapin pour
// ce qui est choisi, touches de laiton doré, titres avec une police à empattements.
import { Platform } from 'react-native';

export const C = {
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
  onPri: '#FBF7EE', // texte posé sur le vert
  acc: '#A87F33', // laiton : petites touches dorées
  accSoft: 'rgba(168,127,51,0.12)',
  accLine: 'rgba(168,127,51,0.40)',
  lav1: '#E6D5AE', // dégradé doré des cartes mises en avant
  lav2: '#F1E6CC',
  lav3: '#FAF4E7',
  bar: 'rgba(28,58,44,0.97)', // barre d'onglets et minuteur (vert sapin foncé)
  red: '#B4483A',
  // Police à empattements pour les titres (déjà présente sur chaque appareil).
  serif: Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia, "Times New Roman", serif' }),
};

// Intensité de vert (0 à 1) pour les cases de calendrier et de régularité.
export const accA = (a) => `rgba(31,77,58,${Math.max(0, Math.min(1, a)).toFixed(2)})`;

// Couleur de chaque type d'événement de l'agenda.
export const TYPES = [
  { id: 'cours', label: 'Cours', color: '#2F6B52' },
  { id: 'rdv', label: 'RDV', color: '#B8862F' },
  { id: 'ex', label: 'Examen', color: '#B4483A' },
  { id: 'au', label: 'Autre', color: '#4F7596' },
];
export const typeColor = (t) => (TYPES.find((x) => x.id === t) || TYPES[3]).color;
