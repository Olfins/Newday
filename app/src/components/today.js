// Les cartes de l'écran "Aujourd'hui", inspirées des widgets de ton image :
// grille des habitudes, salle, humeur, tâches, et le programme de la journée.
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { C, typeColor, TYPES } from '../theme';
import { addDays, cap, duration, fmt, hm, letter, LETTERS, minutes, mondayOf, toDate, weekOf } from '../dates';
import { has, visibleTodos } from '../stats';
import { gymCheckIn, gymCheckOut, gymDone, gymReset, removeEvent, setMood, toggleHabit } from '../store';
import { AddRow, Btn, Card, H, Icon, Mu, Row } from './ui';
import { MoodPicker } from './bits';
import { CheckIcon, DumbbellIcon, MoodIcon, MOOD_LABELS } from './icons';

// ---------- Sélecteur de jour (grands chiffres) ----------
export function DayPicker({ S, T, cd, setCd }) {
  const [off, setOff] = useState(0);
  const days = weekOf(addDays(mondayOf(cd), 7 * off));
  return (
    <Row style={{ gap: 2, width: '100%', maxWidth: 520, alignSelf: 'center' }}>
      <Icon label="‹" onPress={() => setOff(off - 1)} a11y="Semaine précédente" style={{ width: 22 }} />
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
        {days.map((k) => {
          const sel = k === cd, isT = k === T;
          const n = Math.min(3, (S.ev[k] || []).length + S.x.filter((x) => x.d === k).length);
          return (
            <Pressable
              key={k}
              onPress={() => { setCd(k); setOff(0); }}
              accessibilityRole="button"
              accessibilityState={{ selected: sel }}
              accessibilityLabel={fmt(k, { weekday: 'long', day: 'numeric', month: 'long' })}
              style={{
                width: 44, alignItems: 'center', paddingVertical: 8, borderRadius: 22,
                backgroundColor: sel ? C.pri : 'transparent',
              }}
            >
              <Text style={{ fontSize: 11, fontWeight: '600', color: sel ? C.onPri : C.mu }}>{letter(k)}</Text>
              <Text style={{ fontSize: 24, fontWeight: '700', color: sel ? C.onPri : isT ? C.acc : C.tx, marginTop: 2 }}>
                {toDate(k).getDate()}
              </Text>
              <Row style={{ gap: 3, height: 6, marginTop: 4 }}>
                {[0, 1, 2].map((i) => (
                  <View key={i} style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: sel ? C.onPri : C.mu, opacity: i < n ? 0.9 : 0.15 }} />
                ))}
              </Row>
            </Pressable>
          );
        })}
      </View>
      <Icon label="›" onPress={() => setOff(off + 1)} a11y="Semaine suivante" style={{ width: 22 }} />
    </Row>
  );
}

// ---------- Grille des habitudes de la semaine ----------
// Habitudes d'un seul jour (l'écran Jour) : une ligne par habitude, un rond à cocher.
export function DayHabits({ S, update, k, dot = 30 }) {
  const done = S.h.filter((h) => has(S, k, h.id)).length;
  return (
    <Card>
      <Row style={{ justifyContent: 'space-between' }}>
        <View>
          <H style={{ marginBottom: 0 }}>Habitudes du jour</H>
          <Text style={{ color: C.mu, fontSize: 12, marginTop: 1 }}>{cap(fmt(k, { weekday: 'long', day: 'numeric', month: 'long' }))}</Text>
        </View>
        <View style={{ paddingVertical: 3, paddingHorizontal: 10, borderRadius: 999, backgroundColor: C.card2, borderWidth: 1, borderColor: C.line }}>
          <Text style={{ color: C.tx, fontSize: 12, fontWeight: '600' }}>{done} / {S.h.length}</Text>
        </View>
      </Row>
      {!S.h.length ? <Mu style={{ marginTop: 8 }}>Ajoute une habitude avec le bouton +.</Mu> : null}
      {S.h.map((h) => {
        const on = has(S, k, h.id);
        return (
          <Pressable key={h.id} onPress={() => update((s) => toggleHabit(s, k, h.id))}
            accessibilityRole="checkbox" accessibilityState={{ checked: on }} accessibilityLabel={h.n}
            style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: C.line }}>
            <Text style={{ flex: 1, color: on ? C.mu : C.tx, fontSize: 15, textDecorationLine: on ? 'line-through' : 'none' }} numberOfLines={1}>{h.n}</Text>
            <View style={{
              width: dot, height: dot, borderRadius: dot / 2, alignItems: 'center', justifyContent: 'center',
              backgroundColor: on ? C.pri : 'transparent', borderWidth: 1.4, borderColor: on ? C.pri : C.ring,
            }}>
              {on ? <CheckIcon size={dot * 0.6} color={C.onPri} width={3} /> : null}
            </View>
          </Pressable>
        );
      })}
    </Card>
  );
}

export function HabitGrid({ S, update, T, k, dot = 24 }) {
  const days = weekOf(mondayOf(k));
  const range = toDate(days[0]).getDate() + '–' + fmt(days[6], { day: 'numeric', month: 'short' });
  return (
    <Card>
      <Row style={{ gap: 0 }}>
        <Text style={{ flex: 1, color: C.tx, fontSize: 15, fontWeight: '700' }} numberOfLines={1}>{range}</Text>
        {days.map((d, i) => (
          <View key={d} style={{
            width: dot + 4, height: 22, alignItems: 'center', justifyContent: 'center', borderRadius: 7,
            borderWidth: 1, borderColor: d === k ? C.pri : 'transparent',
          }}>
            <Text style={{ fontSize: 11, fontWeight: '600', color: d === k ? C.pri : C.mu }}>{LETTERS[i]}</Text>
          </View>
        ))}
      </Row>
      {S.h.map((h) => (
        <Row key={h.id} style={{ marginTop: 9, gap: 0 }}>
          <Text style={{ flex: 1, color: C.tx, fontSize: 14 }} numberOfLines={1}>{h.n}</Text>
          {days.map((d) => {
            const on = has(S, d, h.id), fut = d > T;
            return (
              <View key={d} style={{ width: dot + 4, alignItems: 'center' }}>
                <Pressable
                  disabled={fut}
                  onPress={() => update((s) => toggleHabit(s, d, h.id))}
                  hitSlop={3}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: on, disabled: fut }}
                  accessibilityLabel={h.n + ', ' + fmt(d, { weekday: 'long' })}
                  style={{
                    width: dot, height: dot, borderRadius: dot / 2, alignItems: 'center', justifyContent: 'center',
                    backgroundColor: on ? C.pri : 'transparent',
                    borderWidth: 1.4, borderColor: on ? C.pri : d === T ? C.accLine : C.ring,
                    opacity: fut ? 0.25 : 1,
                  }}
                >
                  {on ? <CheckIcon size={dot * 0.62} color={C.onPri} width={3} /> : null}
                </Pressable>
              </View>
            );
          })}
        </Row>
      ))}
      {!S.h.length ? <Mu style={{ marginTop: 8 }}>Ajoute une habitude avec le bouton +.</Mu> : null}
    </Card>
  );
}

// ---------- Salle : check-in / check-out ----------
export function GymCard({ S, update, T, k, style, onOpen }) {
  const g = S.gym[k];
  const fut = k > T;
  const running = S.run && S.run.k === k;
  const w = [...S.ws].reverse().find((x) => x.d === k);
  // La salle est validée seulement quand elle est cochée (carte ou habitude de la semaine).
  const state = running ? 'run' : gymDone(S, k) ? 'done' : 'out';
  const on = state !== 'out';
  // Aujourd'hui : le rond ouvre le module Salle. Autres jours : simple correction manuelle.
  const press = () => {
    if (k === T) return onOpen();
    if (state === 'out') update((s) => { gymCheckIn(s, k, ''); gymCheckOut(s, k, ''); });
    else update((s) => gymReset(s, k));
  };
  const undo = () => update((s) => gymReset(s, k));
  const info = state === 'run' ? 'Commencée à ' + S.run.start + ', pas encore validée'
    : state === 'out' ? (fut ? 'Pas encore' : k === T ? 'Choisis ta séance' : 'Pas de séance')
    : w ? w.name + ' · ' + w.mins + ' min'
    : (g && g.i && g.o && duration(g.i, g.o) ? g.i + '–' + g.o + ' · ' + duration(g.i, g.o) : 'Séance validée');
  const label = k !== T ? (state === 'out' ? 'Valider' : 'Décocher') : state === 'run' ? 'Reprendre' : state === 'out' ? 'Commencer' : 'Ouvrir';
  return (
    <Card glow="a" glowOn={on} style={[{ flex: 1, overflow: 'hidden' }, style]}>
      {!C.glass ? <LinearGradient colors={[`rgba(${C.accRgb},0)`, on ? `rgba(${C.accRgb},0.22)` : `rgba(${C.accRgb},0.08)`]}
        style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '70%' }} pointerEvents="none" /> : null}
      <Row style={{ gap: 6 }}><DumbbellIcon color={C.glass ? '#FFFFFF' : C.acc} /><H style={{ marginBottom: 0 }}>Salle</H></Row>
      <Pressable
        onPress={press}
        disabled={fut}
        accessibilityRole="button"
        accessibilityLabel={k === T ? 'Ouvrir la salle' : state === 'out' ? 'Valider la salle' : 'Décocher la salle'}
        style={{
          width: 64, height: 64, borderRadius: 32, alignSelf: 'center', marginTop: 12,
          alignItems: 'center', justifyContent: 'center', borderWidth: 2,
          borderColor: C.glass ? 'rgba(255,255,255,0.85)' : on ? C.pri : C.accLine,
          backgroundColor: C.glass ? 'rgba(255,255,255,0.08)' : state === 'done' ? C.pri : C.accSoft,
          opacity: fut ? 0.35 : 1,
        }}
      >
        {state === 'done' ? <CheckIcon size={30} color={C.glass ? '#FFFFFF' : C.onPri} width={2.6} />
          : state === 'run' ? <Text style={{ color: C.pri, fontWeight: '700', fontSize: 12 }}>EN COURS</Text>
          : <DumbbellIcon size={26} color={C.glass ? '#FFFFFF' : C.acc} />}
      </Pressable>
      <Text style={{ color: C.mu, fontSize: 12, textAlign: 'center', marginTop: 8 }} numberOfLines={1}>{info}</Text>
      <Btn
        label={label}
        onPress={press}
        disabled={fut}
        active={state === 'run'}
        style={{ alignSelf: 'center', marginTop: 8, paddingVertical: 6 }}
        textStyle={{ fontSize: 12 }}
      />
      {k === T && state !== 'out' ? (
        <Pressable onPress={undo} accessibilityRole="button" accessibilityLabel={state === 'run' ? 'Annuler la séance' : 'Décocher la salle'}
          hitSlop={8} style={{ alignSelf: 'center', marginTop: 6 }}>
          <Text style={{ color: C.mu, fontSize: 12, textDecorationLine: 'underline' }}>{state === 'run' ? 'Annuler la séance' : 'Décocher'}</Text>
        </Pressable>
      ) : null}
    </Card>
  );
}

// ---------- Humeur ----------
export function MoodCard({ S, update, T, k, style }) {
  const m = S.m[k] || 0;
  const fut = k > T;
  return (
    <Card glow="b" glowOn={!!m} style={[{ flex: 1, overflow: 'hidden' }, style]}>
      {!C.glass ? <LinearGradient colors={[`rgba(${C.priRgb},0)`, m ? `rgba(${C.priRgb},0.16)` : `rgba(${C.priRgb},0.06)`]}
        style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '70%' }} pointerEvents="none" /> : null}
      <Row style={{ gap: 6 }}><MoodIcon color={C.glass ? '#FFFFFF' : C.acc} /><H style={{ marginBottom: 0 }}>Humeur</H></Row>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <MoodPicker value={m} disabled={fut} size={26} onPick={(n) => update((s) => setMood(s, k, n))} />
      </View>
      <View style={{
        alignSelf: 'center', marginTop: 8, paddingVertical: 6, paddingHorizontal: 14, borderRadius: 999,
        borderWidth: 1, borderColor: m ? C.pri : C.line,
      }}>
        <Text style={{ color: m ? C.pri : C.mu, fontSize: 12, fontWeight: '600' }}>{m ? MOOD_LABELS[m] : 'Comment ça va ?'}</Text>
      </View>
    </Card>
  );
}

// ---------- Tâches ----------
export function TodoCard({ S, update, T }) {
  const [v, setV] = useState('');
  const tl = visibleTodos(S, T);
  const open = tl.filter((o) => !o.t.x).length;
  const add = () => {
    const t = v.trim();
    if (!t) return;
    update((s) => s.t.push({ t, x: false, d: T }));
    setV('');
  };
  return (
    <Card>
      <Row style={{ justifyContent: 'space-between' }}>
        <H style={{ marginBottom: 0 }}>À faire</H>
        <View style={{ paddingVertical: 3, paddingHorizontal: 10, borderRadius: 999, backgroundColor: C.card2, borderWidth: 1, borderColor: C.line }}>
          <Text style={{ color: C.tx, fontSize: 12, fontWeight: '600' }}>{open} restante{open > 1 ? 's' : ''}</Text>
        </View>
      </Row>
      {tl.map(({ t, i }) => (
        <Row key={i} style={{ paddingVertical: 8, gap: 10 }}>
          <View style={{ width: 3, height: 16, borderRadius: 2, backgroundColor: t.x ? C.line : C.todo ? C.todo[i % C.todo.length] : C.pri }} />
          <Text style={{ flex: 1, color: t.x ? C.mu : C.tx, textDecorationLine: t.x ? 'line-through' : 'none' }}>{t.t}</Text>
          <Icon label="✕" a11y={'Supprimer ' + t.t} onPress={() => update((s) => s.t.splice(i, 1))} style={{ width: 24, height: 24 }} />
          <Pressable
            onPress={() => update((s) => { s.t[i].x = !s.t[i].x; s.t[i].d = T; })}
            hitSlop={6}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: !!t.x }}
            accessibilityLabel={t.t}
            style={{
              width: 22, height: 22, borderRadius: 11, borderWidth: 1.4, alignItems: 'center', justifyContent: 'center',
              borderColor: t.x ? C.pri : C.ring, backgroundColor: t.x ? C.pri : 'transparent',
            }}
          >
            {t.x ? <CheckIcon size={14} color={C.onPri} width={3} /> : null}
          </Pressable>
        </Row>
      ))}
      {!tl.length ? <Mu style={{ marginTop: 8 }}>Rien à faire pour l’instant.</Mu> : null}
      <AddRow value={v} onChangeText={setV} onAdd={add} placeholder="Ajouter une tâche" />
    </Card>
  );
}

// ---------- Événements du jour, triés, avec la ligne "maintenant" ----------
function dayItems(S, k) {
  const ev = (S.ev[k] || []).map((e, i) => ({ ...e, i })).sort((a, b) => (a.s || '').localeCompare(b.s || ''));
  const ex = S.x.map((x, i) => ({ x, i })).filter((o) => o.x.d === k);
  return { ev, ex };
}

// Carte mise en avant : ce qui se passe maintenant, sinon le prochain événement.
export function NowCard({ S, T, k, onAdd }) {
  const { ev, ex } = dayItems(S, k);
  const now = hm(new Date());
  const timed = ev.filter((e) => e.s);
  let cur = null, label = '';
  let finished = false;
  if (k === T) {
    cur = timed.find((e) => e.e && e.s <= now && now < e.e);
    if (cur) label = 'MAINTENANT · jusqu’à ' + cur.e;
    else {
      cur = timed.find((e) => e.s > now);
      if (cur) label = 'ENSUITE · à ' + cur.s;
      else finished = ev.length > 0;
    }
  } else if (k > T) {
    cur = timed[0] || ev[0];
    if (cur) label = cur.s ? 'PREMIER · à ' + cur.s : 'TOUTE LA JOURNÉE';
  }
  if (!cur && ex.length) return (
    <Hero label="EXAMEN" title={ex[0].x.n} sub="Examen ce jour-là · bonne chance" />
  );
  if (!cur && finished) return (
    <Hero label="JOURNÉE TERMINÉE" title="Plus rien de prévu" sub={ev.length + ' événement' + (ev.length > 1 ? 's' : '') + ' aujourd’hui. Bonne soirée.'} />
  );
  if (!cur) return (
    <Hero label={k < T ? 'JOURNÉE PASSÉE' : 'JOURNÉE LIBRE'} title={k < T ? 'Plus rien de prévu' : 'Rien de prévu pour l’instant'}
      sub={k < T ? 'Tu peux encore corriger ce jour ci-dessous.' : 'Ajoute un cours ou un rendez-vous.'} action={k >= T ? onAdd : null} />
  );
  const t = TYPES.find((x) => x.id === (cur.ty || 'au'));
  let pct = null;
  if (k === T && cur.e && cur.s <= now && now < cur.e) pct = (minutes(now) - minutes(cur.s)) / (minutes(cur.e) - minutes(cur.s));
  return (
    <Hero
      label={label}
      title={cur.t}
      sub={(cur.s ? cur.s + (cur.e ? '–' + cur.e : '') : 'Journée') + (duration(cur.s, cur.e) ? ' · ' + duration(cur.s, cur.e) : '') + ' · ' + t.label}
      pct={pct}
    />
  );
}

function Hero({ label, title, sub, pct, action }) {
  return (
    <View style={{ borderRadius: 26, overflow: 'hidden', shadowColor: C.shadow, shadowOpacity: 0.15, shadowRadius: 18, shadowOffset: { width: 0, height: 8 } }}>
      <LinearGradient colors={[C.lav1, C.lav2, C.lav3]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={{ padding: 18 }}>
        <Row style={{ gap: 6 }}>
          <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: C.acc }} />
          <Text style={{ color: C.acc, fontSize: 11, fontWeight: '700', letterSpacing: 1 }}>{label}</Text>
        </Row>
        <Text style={{ fontFamily: C.serif, color: C.tx, fontSize: 26, fontWeight: '700', marginTop: 8, letterSpacing: -0.4 }}>{title}</Text>
        <Text style={{ color: C.mu, fontSize: 13, marginTop: 4 }}>{sub}</Text>
        {pct != null ? (
          <View style={{ height: 4, borderRadius: 2, backgroundColor: C.track, marginTop: 14, overflow: 'hidden' }}>
            <View style={{ width: Math.round(pct * 100) + '%', height: '100%', backgroundColor: C.pri }} />
          </View>
        ) : null}
        {action ? <Btn label="Ajouter un événement" onPress={action} style={{ alignSelf: 'flex-start', marginTop: 14 }} /> : null}
      </LinearGradient>
    </View>
  );
}

// Programme de la journée, façon agenda : heures à gauche, ligne colorée "maintenant".
export function Schedule({ S, update, T, k, onAdd }) {
  const { ev, ex } = dayItems(S, k);
  const now = hm(new Date());
  const booked = ev.reduce((a, e) => a + (e.s && e.e ? Math.max(0, minutes(e.e) - minutes(e.s)) : 0), 0);
  const bh = Math.floor(booked / 60), bm = booked % 60;
  const bookedTx = booked ? ' · ' + [bh ? bh + ' h' : '', bm ? bm + ' min' : ''].filter(Boolean).join(' ') + ' réservées' : '';
  const rows = [];
  let lineDone = k !== T;
  ev.forEach((e) => {
    if (!lineDone && e.s && e.s > now) { rows.push({ line: true }); lineDone = true; }
    rows.push({ e });
  });
  if (!lineDone && ev.length) rows.push({ line: true });
  return (
    <View>
      <Row style={{ justifyContent: 'space-between', marginBottom: 4 }}>
        <Text style={{ fontFamily: C.serif, color: C.tx, fontSize: 20, fontWeight: '700' }}>Programme</Text>
        <Btn label="+ Ajouter" ghost onPress={onAdd} textStyle={{ fontSize: 13 }} style={{ paddingVertical: 6 }} />
      </Row>
      <Mu>{ev.length + ex.length} prévu{ev.length + ex.length > 1 ? 's' : ''}{bookedTx}</Mu>
      <View style={{ marginTop: 8 }}>
        {ex.map((o) => (
          <ScheduleRow key={'x' + o.i} start="Examen" title={o.x.n} color={C.red} meta="Examen"
            onDelete={() => update((s) => s.x.splice(o.i, 1))} />
        ))}
        {rows.map((r, n) =>
          r.line ? (
            <Row key={'now' + n} style={{ gap: 8, marginVertical: 6 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, borderWidth: 2, borderColor: C.acc }} />
              <Text style={{ color: C.acc, fontSize: 12, fontWeight: '700' }}>maintenant {now}</Text>
              <View style={{ flex: 1, height: 1.5, backgroundColor: C.accLine }} />
            </Row>
          ) : (
            <ScheduleRow
              key={r.e.i}
              start={r.e.s || 'Journée'}
              end={r.e.e}
              title={r.e.t}
              color={typeColor(r.e.ty)}
              meta={[duration(r.e.s, r.e.e), (TYPES.find((x) => x.id === (r.e.ty || 'au')) || {}).label].filter(Boolean).join(' · ')}
              past={k < T || (k === T && (r.e.e || r.e.s) && (r.e.e || r.e.s) <= now)}
              onDelete={() => update((s) => removeEvent(s, k, r.e.i))}
            />
          )
        )}
        {!ev.length && !ex.length ? <Mu style={{ marginTop: 8 }}>Rien de prévu ce jour-là.</Mu> : null}
      </View>
    </View>
  );
}

function ScheduleRow({ start, end, title, color, meta, past, onDelete }) {
  return (
    <Row style={{ paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: C.line, gap: 14, opacity: past ? 0.5 : 1, alignItems: 'flex-start' }}>
      <View style={{ width: 54 }}>
        <Text style={{ color: C.tx, fontWeight: '700', fontSize: 15 }}>{start}</Text>
        {end ? <Text style={{ color: C.mu, fontSize: 12 }}>{end}</Text> : null}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: C.tx, fontSize: 15, fontWeight: '500' }}>{title}</Text>
        <Row style={{ gap: 6, marginTop: 3 }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: color }} />
          <Text style={{ color: C.mu, fontSize: 12 }}>{meta}</Text>
        </Row>
      </View>
      <Icon label="✕" a11y={'Supprimer ' + title} onPress={onDelete} style={{ width: 26, height: 26 }} />
    </Row>
  );
}
