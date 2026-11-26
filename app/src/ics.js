// Lecture d'un fichier .ics (export de Google Agenda, Outlook, Apple Calendrier).
// Garde les événements des 14 prochains jours, y compris ceux qui se répètent
// chaque jour ou chaque semaine.
import { iso, hm } from './dates';

export function parseICS(txt) {
  const now = new Date();
  txt = String(txt).replace(/\r?\n[ \t]/g, '');
  const out = {};
  const W = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
  txt.split('BEGIN:VEVENT').slice(1).forEach((b) => {
    b = b.split('END:VEVENT')[0];
    const g = (k) => {
      const m = b.match(new RegExp('^' + k + '[^:\\n]*:(.*)$', 'm'));
      return m ? m[1].replace(/\r/g, '').trim() : '';
    };
    const ds = g('DTSTART'), de = g('DTEND'), rr = g('RRULE');
    const t = g('SUMMARY').replace(/\\,/g, ',').replace(/\\n/g, ' ') || 'Événement';
    const P = (v) => {
      const m = v.match(/^(\d{4})(\d\d)(\d\d)(?:T(\d\d)(\d\d)(\d\d)?)?(Z)?$/);
      if (!m) return null;
      const d = m[7]
        ? new Date(Date.UTC(+m[1], m[2] - 1, +m[3], +m[4], +m[5]))
        : new Date(+m[1], m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0));
      return { d, all: m[4] === undefined };
    };
    const a = ds && P(ds), z = de && P(de);
    if (!a) return;
    const s0 = iso(a.d);
    for (let i = 0; i < 14; i++) {
      const x = new Date(now);
      x.setDate(now.getDate() + i);
      const k = iso(x);
      let ok = k === s0;
      if (!ok && rr && k > s0) {
        const f = (rr.match(/FREQ=(\w+)/) || [])[1];
        const u = (rr.match(/UNTIL=(\d{8})/) || [])[1];
        if (!u || k.replace(/-/g, '') <= u) {
          if (f === 'DAILY') ok = true;
          else if (f === 'WEEKLY') {
            const bd = (rr.match(/BYDAY=([^;]+)/) || [])[1];
            ok = (bd ? bd.split(',').map((q) => q.slice(-2)) : [W[a.d.getDay()]]).includes(W[x.getDay()]);
          }
        }
      }
      if (ok) (out[k] = out[k] || []).push({ s: a.all ? '' : hm(a.d), e: a.all || !z ? '' : hm(z.d), t, ty: 'au', src: 'ics' });
    }
  });
  return out;
}

// Remplace les anciens événements importés (à partir d'aujourd'hui) par les nouveaux.
export function mergeICS(s, T, found) {
  Object.keys(s.ev).forEach((k) => {
    if (k >= T) {
      s.ev[k] = s.ev[k].filter((e) => e.src !== 'ics');
      if (!s.ev[k].length) delete s.ev[k];
    }
  });
  Object.entries(found).forEach(([k, v]) => (s.ev[k] = (s.ev[k] || []).concat(v)));
}
