// Calculs pour les séries, records et pourcentages.
// Même logique que l'ancienne app : un jour raté est toléré,
// deux d'affilée cassent la série, et les jours off ne comptent pas.
import { addDays, mondayOf, iso, toDate } from './dates';

export const has = (S, k, id) => (S.d[k] || []).includes(id);
export const nh = (S, k) => (S.d[k] || []).filter((id) => S.h.some((h) => h.id === id)).length;
export const pc = (S, k) => (S.h.length ? nh(S, k) / S.h.length : 0);

// Tâches visibles aujourd'hui : celles à faire + celles cochées aujourd'hui.
export const visibleTodos = (S, T) =>
  S.t.map((t, i) => ({ t, i })).filter((o) => !o.t.x || o.t.d === T);

export function rate(S, T, f, n) {
  let a = 0, c = 0;
  for (let i = 0; i < n; i++) {
    const k = addDays(T, -i);
    if (S.off[k]) continue;
    a += f(k);
    c++;
  }
  return c ? Math.round((100 * a) / c) : 0;
}

export function habitRate(S, T, h) {
  const w = (h.w || 7) / 7;
  let a = 0, c = 0;
  for (let i = 0; i < 30; i++) {
    const k = addDays(T, -i);
    if (S.off[k]) continue;
    a += has(S, k, h.id) ? 1 : 0;
    c++;
  }
  return c ? Math.min(100, Math.round((100 * a) / (c * w))) : 0;
}

export function streak(S, T, f) {
  let n = 0, miss = 0;
  for (let i = 0; i < 4000; i++) {
    const k = addDays(T, -i);
    if (S.off[k]) continue;
    if (f(k)) { n++; miss = 0; }
    else if (i > 0 && ++miss > 1) break;
  }
  return n;
}

export function best(S, T, f) {
  const ks = Object.keys(S.d).sort();
  if (!ks.length) return 0;
  let b = 0, n = 0, miss = 0;
  for (const x = toDate(ks[0]); iso(x) <= T; x.setDate(x.getDate() + 1)) {
    const k = iso(x);
    if (S.off[k]) continue;
    if (f(k)) { n++; miss = 0; if (n > b) b = n; }
    else if (++miss > 1) n = 0;
  }
  return b;
}

// Nombre de fois où l'habitude a été faite pendant la semaine située "n" semaines avant celle-ci.
export function weekCount(S, T, id, n) {
  const mon = addDays(mondayOf(T), -7 * n);
  let c = 0;
  for (let i = 0; i < 7; i++) if (has(S, addDays(mon, i), id)) c++;
  return c;
}

export function weekStreak(S, T, id, w) {
  let n = 0;
  for (let i = 0; i < 520; i++) {
    if (weekCount(S, T, id, i) >= w) n++;
    else if (i > 0) break;
  }
  return n;
}

export function weekBest(S, T, id, w) {
  let b = 0, n = 0;
  for (let i = 103; i >= 0; i--) {
    if (weekCount(S, T, id, i) >= w) { n++; if (n > b) b = n; }
    else n = 0;
  }
  return b;
}

// Humeur moyenne les jours où l'habitude est faite, comparée aux jours où elle ne l'est pas.
export function moodLinks(S) {
  const ks = Object.keys(S.m).filter((k) => S.m[k] && !S.off[k]);
  const avg = (x) => x.reduce((s, v) => s + v, 0) / x.length;
  return S.h
    .map((h) => {
      const a = ks.filter((k) => has(S, k, h.id)).map((k) => S.m[k]);
      const b = ks.filter((k) => !has(S, k, h.id)).map((k) => S.m[k]);
      return a.length >= 3 && b.length >= 3 ? { h, a: avg(a), b: avg(b) } : null;
    })
    .filter(Boolean)
    .sort((p, q) => q.a - q.b - (p.a - p.b));
}
