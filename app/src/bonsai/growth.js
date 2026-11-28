// Règles du bonsaï et de la bibliothèque.
// - Chaque habitude cochée est une petite brique : le bonsaï grandit avec le total, et ne rapetisse jamais.
// - Sa santé suit les 7 derniers jours : feuillage dense et vert quand tu es régulier, plus clair sinon.
// - Chaque étagère de la bibliothèque est une habitude. Elle se remplit d'un livre à chaque fois
//   que tu la fais (sur les 14 derniers jours) et se vide quand tu la délaisses.
// - Les jours off ne comptent pas.
import { addDays } from '../dates';
import { has, pc } from '../stats';

export const STAGES = [
  { n: 'Graine germée', at: 0 },
  { n: 'Pousse', at: 10 },
  { n: 'Jeune plant', at: 35 },
  { n: 'Arbuste', at: 80 },
  { n: 'Bonsaï en formation', at: 150 },
  { n: 'Bonsaï mature', at: 260 },
  { n: 'Bonsaï ancien', at: 420 },
];
export const WINDOW = 14; // jours pris en compte pour les étagères
export const MAX_SHELVES = 7;

// Total des habitudes cochées depuis le début (toutes les dates).
export const bricks = (S) => Object.values(S.d || {}).reduce((a, v) => a + (Array.isArray(v) ? v.length : 0), 0);

// Étape, avancement et croissance continue (0 à 1) à partir du total.
export function growthOf(S) {
  const n = bricks(S);
  let st = 0;
  while (st < STAGES.length - 1 && n >= STAGES[st + 1].at) st++;
  const max = st === STAGES.length - 1;
  const from = STAGES[st].at, to = max ? from : STAGES[st + 1].at;
  const frac = max ? 1 : (n - from) / (to - from);
  return { n, st, max, frac, left: max ? 0 : to - n, g: Math.min(1, (st + (max ? 0 : frac)) / (STAGES.length - 1)) };
}

// Les derniers jours qui comptent (sans les jours off), du plus récent au plus ancien.
function lastDays(S, T, n) {
  const out = [];
  for (let i = 0; out.length < n && i < n * 6; i++) {
    const k = addDays(T, -i);
    if (!S.off[k]) out.push(k);
  }
  return out;
}

// Santé de 0 à 1 : moyenne des 7 derniers jours. Aujourd'hui ne compte que s'il fait monter la moyenne
// (le matin, rien n'est encore coché : l'arbre ne doit pas avoir l'air malade pour autant).
export function healthOf(S, T) {
  if (!S.h.length || !bricks(S)) return 0.7; // tout juste planté : il part en bonne santé
  const avg = (ks) => (ks.length ? ks.reduce((a, k) => a + pc(S, k), 0) / ks.length : 0);
  const withToday = avg(lastDays(S, T, 7));
  const without = avg(lastDays(S, addDays(T, -1), 7));
  return Math.max(withToday, without);
}

// Une étagère par habitude (au plus MAX_SHELVES). fill de 0 à 1 selon ce qui est attendu
// (une habitude 3 fois par semaine est pleine avec 6 fois en 14 jours).
export function shelvesOf(S, T) {
  const ks = lastDays(S, T, WINDOW);
  return S.h.slice(0, MAX_SHELVES).map((h, i) => {
    const done = ks.filter((k) => has(S, k, h.id)).length;
    const want = Math.max(1, Math.round((ks.length * (h.w || 7)) / 7));
    return { id: h.id, name: h.n, i, done, want, fill: Math.min(1, done / want) };
  });
}

export const libraryFill = (shelves) => (shelves.length ? shelves.reduce((a, s) => a + s.fill, 0) / shelves.length : 0);

// Une phrase sobre sur l'état du moment.
export function stateText(health, fill, hasHabits, n) {
  if (hasHabits && !n) return 'Ton bonsaï vient d’être planté. Chaque habitude cochée est une brique : un livre sur l’étagère, un peu de croissance.';
  if (!hasHabits) return 'Ajoute une habitude : chaque fois que tu la fais, un livre rejoint les étagères.';
  if (health >= 0.75) return 'Feuillage dense, étagères bien garnies. Continue à ce rythme.';
  if (health >= 0.5) return 'Le bonsaï se porte bien. Quelques étagères attendent encore leurs livres.';
  if (health >= 0.25) return 'Le feuillage s’éclaircit et des livres repartent. Une habitude aujourd’hui suffit à relancer.';
  return 'Le bonsaï manque d’attention et les étagères se vident. Reprends par une seule petite brique.';
}
