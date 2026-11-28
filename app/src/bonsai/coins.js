// Les pièces : on les gagne en faisant ses habitudes, ses tâches et ses rendez-vous,
// et on les dépense dans la boutique de l'onglet Bonsaï (pots, sellettes, bibliothèque, objets).
//
// Comment c'est compté :
// - Aujourd'hui, les pièces suivent ce qui est coché (décocher les retire, recocher les rend :
//   on ne peut pas gagner deux fois la même habitude).
// - Chaque jour passé est ensuite « mis à la banque » (s.coins.past) : supprimer une vieille
//   tâche ou une habitude ne fait jamais perdre de pièces.
// - Au premier lancement, les jours depuis le début du suivi (s.tree.since) sont comptés : c'est le cadeau de départ.
import { addDays, hm } from '../dates';
import { nh } from '../stats';

export const GAIN = {
  h: 5, // une habitude cochée
  all: 20, // bonus : toutes les habitudes du jour cochées
  t: 10, // une tâche faite
  ev: 5, // un rendez-vous ou un cours passé
  x: 15, // un examen passé
  w: 15, // une séance de salle terminée
};
export const GAIN_LABEL = {
  h: 'Habitude', all: 'Journée parfaite', t: 'Tâche faite', ev: 'Rendez-vous passé', x: 'Examen passé', w: 'Séance de salle',
};

// Détail des pièces gagnées un jour donné (T = aujourd'hui, now = heure actuelle "HH:MM").
export function dayParts(S, k, T, now) {
  const n = nh(S, k);
  const past = k < T;
  const evs = (S.ev[k] || []).filter((e) => { const end = e.e || e.s; return past || (end && end <= now); }).length;
  return {
    h: n * GAIN.h,
    all: S.h.length && n >= S.h.length ? GAIN.all : 0,
    t: S.t.filter((t) => t.x && t.d === k).length * GAIN.t,
    ev: evs * GAIN.ev,
    x: past ? S.x.filter((x) => x.d === k).length * GAIN.x : 0,
    w: (S.ws || []).filter((w) => w.d === k).length * GAIN.w,
  };
}
const sum = (p) => Object.values(p).reduce((a, v) => a + v, 0);

// Depuis quand on compte : le lendemain du dernier jour mis à la banque, sinon le début du suivi.
const startOf = (S) => (S.coins && S.coins.thru ? addDays(S.coins.thru, 1) : S.tree ? S.tree.since : null);

// Met à la banque les jours passés pas encore comptés. Renvoie true si quelque chose a changé.
export function needsBank(S, T) {
  if (!S.tree) return false;
  const st = startOf(S);
  return !S.coins || (st && st < T);
}
export function bank(s, T) {
  if (!s.tree) return;
  const c = s.coins || (s.coins = { past: 0, spent: 0, thru: null });
  const now = hm(new Date());
  let k = startOf(s), n = 0;
  if (!k) return;
  for (; k < T && n < 4000; k = addDays(k, 1), n++) c.past += sum(dayParts(s, k, T, now));
  c.thru = addDays(T, -1);
}

// Pièces gagnées au total (banque + aujourd'hui), et le détail d'aujourd'hui.
export function earnedCoins(S, T) {
  if (!S.tree || !S.coins) return null;
  const today = dayParts(S, T, T, hm(new Date()));
  return { total: S.coins.past + sum(today), today };
}

// Ce qu'on peut dépenser.
export function wallet(S, T) {
  const e = earnedCoins(S, T);
  if (!e) return 0;
  return Math.max(0, e.total - (S.coins.spent || 0));
}

// ---- Boutique ----
// s.lib = { own: { 'pot:celadon': '2026-11-28', ... }, set: { pot, stand, wood, wall, obj } }
export const owns = (S, id) => !!(S.lib && S.lib.own && S.lib.own[id]);
const libOf = (s) => { s.lib = s.lib || {}; s.lib.own = s.lib.own || {}; s.lib.set = s.lib.set || {}; return s.lib; };

// Achète un objet (id comme « pot:celadon » ou « obj:globe »).
export function buy(s, T, id, price) {
  if (owns(s, id) || wallet(s, T) < price) return false;
  libOf(s).own[id] = T;
  s.coins.spent = (s.coins.spent || 0) + price;
  return true;
}

// Utilise un objet dans sa catégorie (une seule à la fois). key = null : retour au choix de base.
export function equip(s, cat, key) {
  const l = libOf(s);
  if (key == null) delete l.set[cat];
  else l.set[cat] = key;
}
