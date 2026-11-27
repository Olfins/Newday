// Écran "Semaine" : vue d'ensemble de la semaine, et correction d'un jour oublié.
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { C } from '../theme';
import { addDays, cap, fmt, LETTERS, mondayOf, toDate, weekNumber, weekOf } from '../dates';
import { has, nh, pc, weekCount } from '../stats';
import { addHabit, cycleFreq, gymDone, removeHabit, toggleHabit } from '../store';
import { AddRow, Bar, Btn, Card, Dot, H, Icon, Mu, Row } from '../components/ui';
import { CheckIcon, DumbbellIcon, Face } from '../components/icons';
import DayPanel from '../components/DayPanel';

export default function Week(p) {
  const { S, update, T, wide } = p;
  const [off, setOff] = useState(0);
  // Jour ouvert en détail. Aujourd'hui n'a pas de détail ici : il est déjà dans l'onglet Jour.
  const [sel, setSel] = useState(null);
  const [name, setName] = useState('');
  const [edit, setEdit] = useState(false);
  const days = weekOf(addDays(mondayOf(T), 7 * off));
  const past = days.filter((k) => k <= T && !S.off[k]);
  const tot = S.h.length * past.length;
  const done = past.reduce((a, k) => a + nh(S, k), 0);
  const pct = tot ? Math.round((done / tot) * 100) : 0;
  const moods = days.map((k) => S.m[k]).filter(Boolean);
  const avg = moods.length ? (moods.reduce((a, b) => a + b, 0) / moods.length).toFixed(1).replace('.', ',') : '—';
  const gym = days.filter((k) => gymDone(S, k)).length;
  const tasks = S.t.filter((t) => t.x && days.includes(t.d)).length;
  const go = (n) => {
    const o = off + n;
    setOff(o);
    setSel(null);
  };
  const add = () => {
    const v = name.trim();
    if (!v) return;
    update((s) => addHabit(s, v));
    setName('');
  };
  const title = toDate(days[0]).getDate() + ' – ' + fmt(days[6], { day: 'numeric', month: 'short' });

  const overview = (
    <View style={{ gap: 14 }}>
      <Card hero>
        <Row style={{ justifyContent: 'space-between' }}>
          <Icon label="‹" onPress={() => go(-1)} a11y="Semaine précédente" />
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: C.tx, fontSize: 18, fontWeight: '700' }}>{title}</Text>
            <Mu>Semaine {weekNumber(days[0])}{off === 0 ? ' · en cours' : ''}</Mu>
          </View>
          <Icon label="›" onPress={() => go(1)} a11y="Semaine suivante" />
        </Row>
        {off ? <Btn label="Cette semaine" ghost onPress={() => go(-off)} style={{ alignSelf: 'center', marginTop: 8 }} /> : null}
        <View style={{ flexDirection: 'row', marginTop: 14 }}>
          <Kpi n={pct + '%'} l="habitudes" />
          <Kpi n={gym} l={'séance' + (gym > 1 ? 's' : '') + ' salle'} />
          <Kpi n={avg} l="humeur moy." />
          <Kpi n={tasks} l={'tâche' + (tasks > 1 ? 's' : '') + ' faite' + (tasks > 1 ? 's' : '')} />
        </View>
        <Bar pct={pct} />
      </Card>

      <Card>
        <Row style={{ justifyContent: 'space-between' }}>
          <H style={{ marginBottom: 0 }}>Habitudes</H>
          <Btn label={edit ? 'Terminé' : 'Modifier'} ghost onPress={() => setEdit(!edit)} style={{ paddingVertical: 6 }} textStyle={{ fontSize: 13 }} />
        </Row>
        <Row style={{ marginTop: 10, gap: 2 }}>
          <View style={{ flex: 1 }} />
          {LETTERS.map((l, i) => (
            <Text key={i} style={{ width: 30, textAlign: 'center', color: days[i] === T ? C.pri : C.mu, fontSize: 11, fontWeight: '600' }}>{l}</Text>
          ))}
        </Row>
        {S.h.map((h) => {
          const w = h.w || 7;
          return (
            <Row key={h.id} style={{ marginTop: 10, gap: 2 }}>
              <View style={{ flex: 1, paddingRight: 4 }}>
                <Row style={{ gap: 4 }}>
                  {edit ? <Icon label="✕" a11y={'Supprimer ' + h.n} onPress={() => update((s) => removeHabit(s, h.id))} style={{ width: 22, height: 22 }} /> : null}
                  <Text style={{ color: C.tx, flex: 1 }} numberOfLines={1}>{h.n}</Text>
                </Row>
                <Pressable onPress={() => update((s) => cycleFreq(s, h.id))} accessibilityRole="button"
                  accessibilityLabel={'Changer la fréquence de ' + h.n}>
                  <Text style={{ color: C.acc, fontSize: 11 }}>
                    {w < 7 ? weekCount(S, T, h.id, -off) + '/' + w + ' cette semaine' : 'chaque jour'}
                  </Text>
                </Pressable>
              </View>
              {days.map((k) => (
                <View key={k} style={{ width: 30, alignItems: 'center' }}>
                  <Dot on={has(S, k, h.id)} today={k === T} disabled={k > T} size={26}
                    a11y={h.n + ', ' + fmt(k, { weekday: 'long' })} onPress={() => update((s) => toggleHabit(s, k, h.id))} />
                </View>
              ))}
            </Row>
          );
        })}
        <Mu style={{ marginTop: 12, fontSize: 12 }}>Touche un rond pour corriger un jour. Touche « chaque jour » pour changer la fréquence.</Mu>
        {edit ? <AddRow value={name} onChangeText={setName} onAdd={add} placeholder="Nouvelle habitude" /> : null}
      </Card>

      <Card>
        <H>Jour par jour</H>
        <Mu>Choisis un autre jour pour voir le détail ou ajouter ce que tu as oublié. Aujourd’hui se gère dans l’onglet Jour.</Mu>
        {days.map((k) => {
          const on = k === sel;
          return (
            <Pressable key={k} onPress={() => setSel(k === T || k === sel ? null : k)} accessibilityRole="button" accessibilityState={{ selected: on }}
              style={{
                flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, paddingHorizontal: 10, marginTop: 6,
                borderRadius: 14, borderWidth: 1, borderColor: on ? C.pri : 'transparent', backgroundColor: on ? C.accSoft : 'transparent',
                opacity: k > T ? 0.45 : 1,
              }}>
              <View style={{ width: 70 }}>
                <Text style={{ color: k === T ? C.pri : C.tx, fontWeight: '700' }}>{cap(fmt(k, { weekday: 'short' }))} {toDate(k).getDate()}</Text>
                {S.off[k] ? <Text style={{ color: C.mu, fontSize: 11 }}>jour off</Text> : null}
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ height: 6, borderRadius: 3, backgroundColor: C.track, overflow: 'hidden' }}>
                  <View style={{ width: Math.round(pc(S, k) * 100) + '%', height: '100%', backgroundColor: C.pri }} />
                </View>
              </View>
              <View style={{ width: 22, alignItems: 'center' }}>
                {gymDone(S, k) ? <DumbbellIcon size={16} /> : null}
              </View>
              <View style={{ width: 22, alignItems: 'center' }}>
                {S.m[k] ? <Face level={S.m[k]} size={20} on /> : <Text style={{ color: C.line }}>–</Text>}
              </View>
              <Text style={{ color: C.mu, fontSize: 12, width: 28, textAlign: 'right' }}>{(S.ev[k] || []).length || ''}</Text>
            </Pressable>
          );
        })}
      </Card>
    </View>
  );

  const panel = sel && sel !== T ? <DayPanel {...p} k={sel} onBack={() => setSel(null)} /> : null;
  return wide && panel ? (
    <View style={{ flexDirection: 'row', gap: 16, alignItems: 'flex-start' }}>
      <View style={{ flex: 1 }}>{overview}</View>
      <View style={{ flex: 1 }}>{panel}</View>
    </View>
  ) : (
    <>
      {overview}
      {panel}
    </>
  );
}

const Kpi = ({ n, l }) => (
  <View style={{ flex: 1, alignItems: 'center' }}>
    <Text style={{ color: C.pri, fontSize: 22, fontWeight: '700' }}>{n}</Text>
    <Text style={{ color: C.mu, fontSize: 11, textAlign: 'center' }}>{l}</Text>
  </View>
);
