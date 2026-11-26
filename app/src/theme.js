// Couleurs et tailles utilisées partout dans l'app.
// Fond sombre, touches dorées.
export const C = {
  bg: '#0A0A0B',
  card: '#141416',
  card2: '#1C1C1F',
  line: '#2A2A2E',
  tx: '#F3EFE6',
  mu: '#8F8A80',
  gold: '#D4AF37',
  goldSoft: 'rgba(212,175,55,0.14)',
  goldLine: 'rgba(212,175,55,0.45)',
  ink: '#16120A',
  red: '#C9705F',
};

// Intensité dorée (0 à 1) pour les cases de calendrier et de régularité.
export const goldA = (a) => `rgba(212,175,55,${Math.max(0, Math.min(1, a)).toFixed(2)})`;

// Couleur de chaque type d'événement de l'agenda.
export const TYPES = [
  { id: 'cours', label: 'Cours', color: C.gold },
  { id: 'rdv', label: 'RDV', color: '#E9DDB4' },
  { id: 'ex', label: 'Examen', color: C.red },
  { id: 'au', label: 'Autre', color: '#77736B' },
];
export const typeColor = (t) => (TYPES.find((x) => x.id === t) || TYPES[3]).color;
