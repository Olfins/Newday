// Les données de l'app et leur enregistrement sur l'appareil.
// On garde exactement le même format que l'ancienne version web,
// pour qu'une sauvegarde de l'ancienne app puisse être restaurée ici.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

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

// ---- Salle : check-in puis check-out ----
// L'habitude "Salle" (id "gym") est validée au check-in.
export function gymCheckIn(s, k, time) {
  s.gym[k] = { i: time, o: '' };
  const a = s.d[k] || (s.d[k] = []);
  if (s.h.some((h) => h.id === 'gym') && !a.includes('gym')) a.push('gym');
}
export function gymCheckOut(s, k, time) {
  if (s.gym[k]) s.gym[k].o = time;
}
export function gymReset(s, k) {
  delete s.gym[k];
  if (s.d[k]) s.d[k] = s.d[k].filter((id) => id !== 'gym');
}

// ---- Séances de salle (module Salle) ----
// s.run : la séance en cours ; s.ws : l'historique des séances terminées.
export function startRun(s, k, level, session, time) {
  // On garde la séance déjà validée ce jour-là, pour la remettre si celle-ci est annulée.
  s.run = { k, l: level, s: session, start: time, ts: Date.now(), done: {}, sets: {}, kg: {}, prev: s.gym[k] || null };
  if (!s.gym[k]) gymCheckIn(s, k, time);
}

// Termine la séance : enregistrée si au moins un exercice est coché, sinon annulée.
export function finishRun(s, time, lv, se) {
  const r = s.run;
  if (!r) return false;
  delete s.run;
  const ex = se.exercises.map((x, i) => ({ n: x.name, done: !!r.done[i], sets: r.sets[i] || 0, kg: r.kg[i] || '' }));
  const done = ex.filter((x) => x.done).length;
  if (!done) {
    if (!r.prev) gymReset(s, r.k);
    return false;
  }
  s.ws = s.ws || [];
  s.ws.push({ id: 'w' + Date.now(), d: r.k, start: r.start, end: time, mins: Math.max(1, Math.round((Date.now() - r.ts) / 60000)), level: lv.full, name: se.name, ex, done, total: ex.length });
  // Heures de salle : de la première arrivée du jour à la fin de cette séance.
  s.gym[r.k] = { i: (r.prev && r.prev.i) || r.start, o: time };
  const d = s.d[r.k] || (s.d[r.k] = []);
  if (s.h.some((h) => h.id === 'gym') && !d.includes('gym')) d.push('gym');
  return true;
}
