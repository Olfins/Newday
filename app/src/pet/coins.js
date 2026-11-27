// Les pièces : on les gagne en faisant ses habitudes, ses tâches et ses rendez-vous,
// et on les dépense dans la boutique de l'onglet Pet.
//
// Comment c'est compté :
// - Aujourd'hui, les pièces suivent ce qui est coché (décocher les retire, recocher les rend :
//   on ne peut pas gagner deux fois la même habitude).
// - Chaque jour passé est ensuite « mis à la banque » (s.coins.past) : supprimer une vieille
//   tâche ou une habitude ne fait jamais perdre de pièces.
// - Au premier lancement, les jours depuis l'adoption du chat sont comptés : c'est le cadeau de départ.
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

// Depuis quand on compte : le lendemain du dernier jour mis à la banque, sinon l'adoption.
const startOf = (S) => (S.coins && S.coins.thru ? addDays(S.coins.thru, 1) : S.pet ? S.pet.since : null);

// Met à la banque les jours passés pas encore comptés. Renvoie true si quelque chose a changé.
export function needsBank(S, T) {
  if (!S.pet) return false;
  const st = startOf(S);
  return !S.coins || (st && st < T);
}
export function bank(s, T) {
  if (!s.pet) return;
  const c = s.coins || (s.coins = { past: 0, spent: 0, thru: null });
  const now = hm(new Date());
  let k = startOf(s), n = 0;
  if (!k) return;
  for (; k < T && n < 4000; k = addDays(k, 1), n++) c.past += sum(dayParts(s, k, T, now));
  c.thru = addDays(T, -1);
}

// Pièces gagnées au total (banque + aujourd'hui), et le détail d'aujourd'hui.
export function earnedCoins(S, T) {
  if (!S.pet || !S.coins) return null;
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
export const owns = (S, id) => !!(S.shop && S.shop.own && S.shop.own[id]);

// Achète un objet (id comme « acc:couronne », « out:smoking » ou « deco:plante »).
export function buy(s, T, id, price) {
  if (owns(s, id) || wallet(s, T) < price) return false;
  s.shop = s.shop || { own: {}, room: {} };
  s.shop.own = s.shop.own || {};
  s.shop.own[id] = T;
  s.coins.spent = (s.coins.spent || 0) + price;
  return true;
}

// Place (ou range) une décoration dans la pièce. Une seule décoration par emplacement.
export function place(s, slot, key) {
  s.shop = s.shop || { own: {}, room: {} };
  s.shop.room = s.shop.room || {};
  if (s.shop.room[slot] === key) delete s.shop.room[slot];
  else s.shop.room[slot] = key;
}
