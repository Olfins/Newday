// Les données de l'app et leur enregistrement sur l'appareil.
// On garde exactement le même format que l'ancienne version web,
// pour qu'une sauvegarde de l'ancienne app puisse être restaurée ici.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { today } from './dates';

export const KEY = 'lockin.v1';

const starter = () => ({
  h: [
    { id: 'gym', n: 'Salle', e: '' },
    { id: 'law', n: 'Étude', e: '' },
    { id: 'read', n: 'Lecture', e: '' },
    { id: 'vit', n: 'Vitamines', e: '' },
    { id: 'meal', n: 'Meal prep', e: '' },
  ],
  d: {}, // jour -> liste des habitudes validées
  m: {}, // jour -> humeur de 1 à 5
  t: [], // tâches
  ev: {}, // jour -> événements de l'agenda
  off: {}, // jours off
  x: [], // examens
  gym: {}, // jour -> heures d'arrivée et de départ à la salle
  ws: [], // séances de salle terminées
});

// Complète les morceaux manquants et retire les emojis des habitudes.
export function normalize(o) {
  const s = o && typeof o === 'object' ? o : starter();
  s.h = Array.isArray(s.h) ? s.h : [];
  s.d = s.d || {};
  s.m = s.m || {};
  s.t = Array.isArray(s.t) ? s.t : [];
  s.ev = s.ev || {};
  s.off = s.off || {};
  s.x = Array.isArray(s.x) ? s.x : [];
  s.gym = s.gym || {};
  s.ws = Array.isArray(s.ws) ? s.ws : [];
  s.h.forEach((h) => (h.e = ''));
  delete s.theme;
  // Le bonsaï remplace l'ancien compagnon. Les pièces suivent la date de début du suivi,
  // et les pièces dépensées pour l'ancien compagnon (tenues, déco) sont rendues une fois.
  if (!s.tree || typeof s.tree !== 'object') {
    s.tree = { since: (s.pet && s.pet.since) || today() };
    if (s.pet && s.coins && s.coins.spent) { s.tree.refund = s.coins.spent; s.coins.spent = 0; }
  }
  // Anciennes données : la salle validée coche aussi l'habitude Salle.
  const gid = gymHabitId(s);
  if (gid) Object.keys(s.gym).forEach((k) => { const a = s.d[k] || (s.d[k] = []); if (!a.includes(gid)) a.push(gid); });
  // Une séance commencée mais vide ne compte plus comme validée.
  if (s.run && s.gym[s.run.k] && !s.run.prev && !s.gym[s.run.k].o && !Object.values(s.run.done || {}).some(Boolean)) {
    delete s.gym[s.run.k];
    if (gid && s.d[s.run.k]) s.d[s.run.k] = s.d[s.run.k].filter((x) => x !== gid);
  }
  return s;
}

// Vérifie qu'un texte collé est bien une sauvegarde.
export function parseBackup(txt) {
  const o = JSON.parse(txt);
  if (!o || !Array.isArray(o.h) || typeof o.d !== 'object') throw new Error('invalide');
  return normalize(o);
}

export function useStore() {
  const [S, setS] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((v) => {
        let o = null;
        try { o = JSON.parse(v); } catch (e) {}
        setS(normalize(o));
      })
      .catch(() => setS(normalize(null)));
  }, []);

  const write = (n) => AsyncStorage.setItem(KEY, JSON.stringify(n)).catch(() => {});

  // update(s => { ...modifier s... }) : modifie une copie, l'affiche et l'enregistre.
  const update = useCallback((fn) => {
    setS((prev) => {
      const n = JSON.parse(JSON.stringify(prev));
      fn(n);
      write(n);
      return n;
    });
  }, []);

  const replace = useCallback((n) => {
    write(n);
    setS(n);
  }, []);

  return { S, update, replace };
}

// ---- Actions (elles modifient la copie reçue) ----

export function toggleHabit(s, k, id) {
  // L'habitude Salle suit la carte Salle (et inversement).
  if (id === gymHabitId(s)) {
    if (gymDone(s, k)) gymReset(s, k);
    else gymCheckIn(s, k, '');
    return;
  }
  const a = s.d[k] || (s.d[k] = []);
  const i = a.indexOf(id);
  if (i < 0) a.push(id);
  else a.splice(i, 1);
}

export function addHabit(s, name) {
  s.h.push({ id: 'h' + Date.now(), n: name, e: '' });
}

export function removeHabit(s, id) {
  s.h = s.h.filter((h) => h.id !== id);
}

// Fréquence : chaque jour (7) -> 6 -> ... -> 1 fois par semaine -> chaque jour.
export function cycleFreq(s, id) {
  const h = s.h.find((x) => x.id === id);
  if (!h) return;
  const w = h.w || 7;
  h.w = w <= 1 ? 7 : w - 1;
}

export function setMood(s, k, n) {
  s.m[k] = s.m[k] === n ? 0 : n;
}

export function toggleOff(s, k) {
  if (s.off[k]) delete s.off[k];
  else s.off[k] = 1;
}

export function addEvent(s, k, ev, weekly) {
  const ds = [k];
  if (weekly) for (let i = 1; i < 15; i++) ds.push(addWeeks(k, i));
  ds.forEach((d) => (s.ev[d] = s.ev[d] || []).push({ ...ev, src: 'm' }));
}

function addWeeks(k, n) {
  const x = new Date(k + 'T12:00:00');
  x.setDate(x.getDate() + 7 * n);
  return x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0');
}

export function removeEvent(s, k, i) {
  if (!s.ev[k]) return;
  s.ev[k].splice(i, 1);
  if (!s.ev[k].length) delete s.ev[k];
}

export function addExam(s, name, k) {
  s.x.push({ n: name, d: k });
  s.x.sort((a, b) => a.d.localeCompare(b.d));
}

// ---- Salle ----
// La carte Salle et l'habitude "Salle" de la semaine sont la même chose :
// valider l'une coche l'autre, et décocher l'une décoche l'autre.

// Trouve l'habitude Salle (id "gym", ou une habitude nommée Salle / Gym / Sport / Muscu).
export function gymHabitId(s) {
  const h = s.h.find((x) => x.id === 'gym') || s.h.find((x) => /^(salle|gym|sport|muscu)/i.test((x.n || '').trim()));
  return h ? h.id : null;
}
function gymHabitOn(s, k) {
  let id = gymHabitId(s);
  if (!id) { s.h.unshift({ id: 'gym', n: 'Salle', e: '' }); id = 'gym'; }
  const a = s.d[k] || (s.d[k] = []);
  if (!a.includes(id)) a.push(id);
}
function gymHabitOff(s, k) {
  const id = gymHabitId(s);
  if (id && s.d[k]) s.d[k] = s.d[k].filter((x) => x !== id);
}
export function gymDone(s, k) {
  const id = gymHabitId(s);
  return !!(s.gym[k] || (id && (s.d[k] || []).includes(id)));
}
export function gymCheckIn(s, k, time) {
  s.gym[k] = { i: time, o: (s.gym[k] && s.gym[k].o) || '' };
  gymHabitOn(s, k);
}
export function gymCheckOut(s, k, time) {
  if (s.gym[k]) s.gym[k].o = time;
}
// Décoche la salle ce jour-là (et annule une séance en cours ce jour-là).
export function gymReset(s, k) {
  delete s.gym[k];
  gymHabitOff(s, k);
  if (s.run && s.run.k === k) delete s.run;
}

// ---- Séances de salle (module Salle) ----
// s.run : la séance en cours ; s.ws : l'historique des séances terminées.
export function startRun(s, k, level, session, time) {
  // On garde la séance déjà validée ce jour-là, pour la remettre si celle-ci est annulée.
  // Ouvrir une séance ne valide rien : la salle n'est cochée qu'à la fin, si un exercice est fait.
  s.run = { k, l: level, s: session, start: time, ts: Date.now(), done: {}, sets: {}, kg: {}, prev: s.gym[k] || null };
}

// Termine la séance : enregistrée si au moins un exercice est coché, sinon annulée.
export function finishRun(s, time, lv, se) {
  const r = s.run;
  if (!r) return false;
  delete s.run;
  const ex = se.exercises.map((x, i) => ({ n: x.name, done: !!r.done[i], sets: r.sets[i] || 0, kg: r.kg[i] || '' }));
  const done = ex.filter((x) => x.done).length;
  if (!done) return false;
  s.ws = s.ws || [];
  s.ws.push({ id: 'w' + Date.now(), d: r.k, start: r.start, end: time, mins: Math.max(1, Math.round((Date.now() - r.ts) / 60000)), level: lv.full, name: se.name, ex, done, total: ex.length });
  // Heures de salle : de la première arrivée du jour à la fin de cette séance.
  const before = s.gym[r.k];
  s.gym[r.k] = { i: (before && before.i) || r.start, o: time };
  gymHabitOn(s, r.k);
  return true;
}
