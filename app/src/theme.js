// Couleurs et tailles utilisées partout dans l'app.
// Design clair inspiré de Needt : fond lavande très pâle, cartes blanches,
// noir pour ce qui est sélectionné, lavande pour les touches de couleur.
export const C = {
  bg: '#F3F2F9',
  card: '#FFFFFF',
  card2: '#F1F0F7',
  field: '#F6F5FB',
  line: '#E7E5F0',
  track: 'rgba(30,28,60,0.07)',
  ring: 'rgba(30,28,60,0.22)',
  tx: '#15151B',
  mu: '#8A8998',
  pri: '#17171D', // noir : jour choisi, cases cochées, boutons actifs
  onPri: '#FFFFFF', // texte posé sur le noir
  acc: '#6C5FD4', // lavande foncée : petites touches de couleur
  accSoft: 'rgba(108,95,212,0.10)',
  accLine: 'rgba(108,95,212,0.35)',
  lav1: '#CBC6F2', // dégradé lavande des cartes mises en avant
  lav2: '#E7E4FA',
  red: '#E0564B',
};

// Intensité lavande (0 à 1) pour les cases de calendrier et de régularité.
export const accA = (a) => `rgba(108,95,212,${Math.max(0, Math.min(1, a)).toFixed(2)})`;

// Couleur de chaque type d'événement de l'agenda.
export const TYPES = [
  { id: 'cours', label: 'Cours', color: '#6C5FD4' },
  { id: 'rdv', label: 'RDV', color: '#F08A3C' },
  { id: 'ex', label: 'Examen', color: '#E0564B' },
  { id: 'au', label: 'Autre', color: '#3DB989' },
];
export const typeColor = (t) => (TYPES.find((x) => x.id === t) || TYPES[3]).color;
