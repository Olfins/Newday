// Petites fonctions pour manipuler les dates.
// Une date est toujours écrite "AAAA-MM-JJ" (par exemple "2026-11-26"), comme dans l'ancienne app.

const pad = (n) => String(n).padStart(2, '0');

export const iso = (d) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
export const today = () => iso(new Date());
export const toDate = (k) => new Date(k + 'T12:00:00');

export function addDays(k, n) {
  const x = toDate(k);
  x.setDate(x.getDate() + n);
  return iso(x);
}

// Lundi de la semaine qui contient la date k.
export function mondayOf(k) {
  const x = toDate(k);
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
  return iso(x);
}

export const weekOf = (monday) => [0, 1, 2, 3, 4, 5, 6].map((i) => addDays(monday, i));

export const daysBetween = (a, b) => Math.round((toDate(b) - toDate(a)) / 864e5);

export const hm = (d) => pad(d.getHours()) + ':' + pad(d.getMinutes());

export const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);

export const fmt = (k, opts) => toDate(k).toLocaleDateString('fr-BE', opts);

export const LETTERS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
// Initiale du jour (lundi = L ... dimanche = D).
export const letter = (k) => LETTERS[(toDate(k).getDay() + 6) % 7];

// Vérifie et nettoie une heure tapée à la main : "9h", "9:30", "0930" -> "09:00", "09:30".
export function cleanTime(v) {
  const m = String(v || '').trim().match(/^(\d{1,2})(?:[:hH.]?(\d{2}))?$/);
  if (!m) return null;
  const h = +m[1], mi = +(m[2] || 0);
  if (h > 23 || mi > 59) return null;
  return pad(h) + ':' + pad(mi);
}
