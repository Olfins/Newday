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

// Numéro de semaine (norme ISO, utilisée en Belgique et en France).
export function weekNumber(k) {
  const d = toDate(k);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const w1 = new Date(d.getFullYear(), 0, 4);
  return 1 + Math.round(((d - w1) / 864e5 - 3 + ((w1.getDay() + 6) % 7)) / 7);
}

// Durée entre deux heures "HH:MM", écrite "1 h 05" ou "40 min".
export function duration(a, b) {
  if (!a || !b) return '';
  const m = (+b.slice(0, 2) * 60 + +b.slice(3, 5)) - (+a.slice(0, 2) * 60 + +a.slice(3, 5));
  if (m <= 0) return '';
  const h = Math.floor(m / 60), r = m % 60;
  return h ? h + ' h' + (r ? ' ' + String(r).padStart(2, '0') : '') : r + ' min';
}
export const minutes = (s) => +s.slice(0, 2) * 60 + +s.slice(3, 5);
