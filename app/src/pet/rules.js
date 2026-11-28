// Règles du compagnon.
// - 4 habitudes cochées dans une même journée = 1 pâtée (+30 XP)
// - chaque rendez-vous passé = 1 portion de croquettes (+10 XP)
// - 250 XP pour passer à l'étape suivante : environ une semaine régulière
//   (7 pâtées = 210 XP + quelques rendez-vous).
import { addDays, hm } from '../dates';
import { nh } from '../stats';
import { wallet } from './coins';
import { CHANGE_PRICE, defaultMonLook } from './species';

export const XP = { p: 30, c: 10 };
export const STEP = 250;
export const STAGES = ['Chaton', 'Jeune chat', 'Adulte', 'PDG'];


// Nourriture gagnée depuis l'adoption, calculée à partir de tes habitudes et de ton agenda.
export function earned(S, T) {
  const pet = S.pet;
  let p = 0, c = 0;
  const now = hm(new Date());
  for (let k = pet.since, n = 0; k <= T && n < 4000; k = addDays(k, 1), n++) {
    p += Math.floor(nh(S, k) / 4);
    (S.ev[k] || []).forEach((e) => {
      const end = e.e || e.s;
      if (k < T || (end && end <= now)) c++;
    });
  }
  return { p, c };
}

export function pantry(S, T) {
  const e = earned(S, T), f = S.pet.fed || { p: 0, c: 0 };
  return { p: Math.max(0, e.p - f.p), c: Math.max(0, e.c - f.c) };
}

export const stageOf = (xp) => Math.min(STAGES.length - 1, Math.floor(xp / STEP));

// Content s'il a mangé aujourd'hui, normal s'il a mangé la veille (ou vient d'arriver), sinon il a faim.
// Les jours off ne comptent pas : ce jour-là il dort, et il n'a pas faim à cause d'eux.
export function moodOf(pet, T, S) {
  if (pet.last === T) return 'happy';
  const off = (S && S.off) || {};
  if (off[T]) return 'ok';
  const base = pet.last || pet.since;
  let gap = 0;
  for (let d = T, n = 0; d > base && n < 400; d = addDays(d, -1), n++) if (!off[d]) gap++;
  if (!pet.last) gap -= 1;
  return gap <= 1 ? 'ok' : 'hungry';
}

export function feed(s, T, type) {
  s.pet.fed = s.pet.fed || { p: 0, c: 0 };
  s.pet.fed[type]++;
  s.pet.xp = (s.pet.xp || 0) + XP[type];
  s.pet.last = T;
}

// species : 'plante', 'eau' ou 'feu' (rien = le chat d'origine).
export function adopt(s, T, look, name, species) {
  s.pet = { look, name: name || 'Minou', since: T, fed: { p: 0, c: 0 }, xp: 0, last: null };
  if (species) s.pet.species = species;
}

// Changer de starter.
// - Depuis le chat : gratuit, une seule fois, et l'XP est gardée (le chat devient un starter).
// - Sinon : coûte CHANGE_PRICE pièces et tout recommence à l'étape 1 (XP, garde-manger).
// Les pièces restantes, les objets achetés et les habitudes ne changent pas.
export function changeCost(pet) {
  return pet && !pet.species && !pet.migrated ? 0 : CHANGE_PRICE;
}
export function changeStarter(s, T, species, name) {
  const free = changeCost(s.pet) === 0;
  if (!free) {
    if (wallet(s, T) < CHANGE_PRICE) return false;
    s.coins.spent = (s.coins.spent || 0) + CHANGE_PRICE;
  }
  const old = s.pet;
  const look = { ...defaultMonLook(species), acc: (old.look && old.look.acc) || 'none', sex: (old.look && old.look.sex) || 'm' };
  if (free) {
    // Le chat garde son XP, son garde-manger et sa date d'adoption.
    s.pet = { ...old, species, look, name: name || old.name, migrated: T, cat: old.look };
  } else {
    s.pet = { look, name: name || old.name, species, since: T, fed: { p: 0, c: 0 }, xp: 0, last: null, migrated: old.migrated || T };
  }
  return true;
}
// Change l'apparence et le prénom, sans toucher à l'XP.
export function restyle(s, look, name) {
  s.pet.look = look;
  if (name) s.pet.name = name;
}
