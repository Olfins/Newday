// Le détail d'un jour choisi (dans la bande de la semaine ou le calendrier).
import React from 'react';
import { View, Text } from 'react-native';
import { C, accA } from '../theme';
import { cap, fmt } from '../dates';
import { nh, pc } from '../stats';
import { setMood, toggleHabit, toggleOff } from '../store';
import { Btn, Card, H, Mu, Row } from './ui';
import { HabitChips, MoodPicker, Ring } from './bits';
import EventsBlock from './EventsBlock';

const mins = (s) => +s.slice(0, 2) * 60 + +s.slice(3, 5);

export default function DayPanel({ S, update, T, k, onBack }) {
  const future = k > T;
  const m = S.m[k] || 0;
  const done = S.t.filter((t) => t.x && t.d === k).length;
  const events = S.ev[k] || [];
  const nx = S.x.filter((x) => x.d === k).length;

  return (
    <Card hero>
      <H style={{ fontSize: 18 }}>{cap(fmt(k, { weekday: 'long', day: 'numeric', month: 'long' }))}</H>
      {onBack ? <Btn label="Fermer" ghost onPress={onBack} style={{ alignSelf: 'flex-start', marginTop: 6 }} /> : null}

      <Row style={{ gap: 18, marginTop: 12 }}>
        <Ring pct={pc(S, k)} />
        <View style={{ gap: 2 }}>
          <Text style={{ color: C.pri, fontSize: 28, fontWeight: '700' }}>{m ? m + '/5' : '—'}</Text>
          <Mu>{nh(S, k)}/{S.h.length} habitudes</Mu>
          <Mu>{done} tâche{done > 1 ? 's' : ''} terminée{done > 1 ? 's' : ''}</Mu>
          <Mu>{events.length + nx} rendez-vous</Mu>
        </View>
      </Row>

      {/* Ligne du temps de 6h à minuit */}
      <View style={{ height: 10, borderRadius: 5, backgroundColor: C.track, marginTop: 16, overflow: 'hidden' }}>
        {events.filter((e) => e.s).map((e, i) => {
          const a = Math.max(mins(e.s), 360), b = e.e ? Math.min(mins(e.e), 1440) : a + 30;
          return (
            <View key={i} style={{
              position: 'absolute', top: 0, bottom: 0, backgroundColor: accA(0.8),
              left: ((a - 360) / 10.8).toFixed(1) + '%', width: Math.max((b - a) / 10.8, 2).toFixed(1) + '%',
            }} />
          );
        })}
      </View>
      <Row style={{ justifyContent: 'space-between', marginTop: 4 }}>
        {['6h', '12h', '18h', '24h'].map((x) => <Mu key={x} style={{ fontSize: 11 }}>{x}</Mu>)}
      </Row>

      <HabitChips S={S} k={k} disabled={future} onToggle={(id) => update((s) => toggleHabit(s, k, id))} />
      <MoodPicker value={m} disabled={future} onPick={(n) => update((s) => setMood(s, k, n))} />
      <Btn
        label={S.off[k] ? 'Jour off activé' : 'Marquer comme jour off'}
        active={!!S.off[k]}
        onPress={() => update((s) => toggleOff(s, k))}
        style={{ marginTop: 14 }}
      />
      {S.ws.filter((w) => w.d === k).map((w) => (
        <View key={w.id} style={{ marginTop: 14, padding: 12, borderRadius: 14, backgroundColor: C.accSoft }}>
          <Text style={{ color: C.tx, fontWeight: '700' }}>Salle : {w.name}</Text>
          <Mu style={{ fontSize: 12 }}>{w.level} · {w.mins} min · {w.done}/{w.total} exercices</Mu>
          <Mu style={{ fontSize: 12, marginTop: 4 }}>{w.ex.filter((x) => x.done).map((x) => x.n + (x.kg ? ' (' + x.kg + ' kg)' : '')).join(' · ')}</Mu>
        </View>
      ))}
      <EventsBlock S={S} update={update} k={k} T={T} />
    </Card>
  );
}
