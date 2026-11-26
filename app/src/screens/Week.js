// Écran "Semaine" : grille des habitudes sur 7 jours.
import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { C } from '../theme';
import { addDays, fmt, LETTERS, mondayOf, weekOf } from '../dates';
import { has, nh, weekCount } from '../stats';
import { addHabit, cycleFreq, setMood, toggleHabit } from '../store';
import { AddRow, Bar, Btn, Card, Dot, Grid, H, Icon, Mu, Row } from '../components/ui';
import { MoodPicker } from '../components/bits';

export default function Week({ S, update, T, wide }) {
  const [off, setOff] = useState(0);
  const [name, setName] = useState('');
  const days = weekOf(addDays(mondayOf(T), 7 * off));
  const past = days.filter((k) => k <= T);
  const tot = S.h.length * past.length;
  const done = past.reduce((a, k) => a + nh(S, k), 0);
  const pct = tot ? Math.round((done / tot) * 100) : 0;
  const title = fmt(days[0], { day: 'numeric', month: 'short' }) + ' – ' + fmt(days[6], { day: 'numeric', month: 'short' });
  const add = () => {
    const v = name.trim();
    if (!v) return;
    update((s) => addHabit(s, v));
    setName('');
  };
  const gym = S.h.find((h) => h.id === 'gym');

  return (
    <Grid wide={wide}>
      <Card hero>
        <Row style={{ justifyContent: 'space-between' }}>
          <Icon label="‹" onPress={() => setOff(off - 1)} a11y="Semaine précédente" />
          <H style={{ marginBottom: 0 }}>Semaine du {title}</H>
          <Icon label="›" onPress={() => setOff(off + 1)} a11y="Semaine suivante" />
        </Row>
        {off ? <Btn label="Cette semaine" ghost onPress={() => setOff(0)} style={{ alignSelf: 'center', marginTop: 8 }} /> : null}
        <Bar pct={pct} />
        <Mu style={{ marginTop: 4 }}>{done}/{tot} habitudes validées</Mu>

        <Row style={{ marginTop: 14 }}>
          <View style={{ flex: 1 }} />
          {LETTERS.map((l, i) => (
            <Text key={i} style={{ width: 28, textAlign: 'center', color: C.mu, fontSize: 11 }}>{l}</Text>
          ))}
        </Row>
        {S.h.map((h) => {
          const w = h.w || 7;
          return (
            <Row key={h.id} style={{ marginTop: 10, gap: 6 }}>
              <View style={{ flex: 1, paddingRight: 4 }}>
                <Text style={{ color: C.tx }} numberOfLines={1}>{h.n}</Text>
                <Pressable onPress={() => update((s) => cycleFreq(s, h.id))} accessibilityRole="button"
                  accessibilityLabel={'Changer la fréquence de ' + h.n}>
                  <Text style={{ color: C.gold, fontSize: 11 }}>
                    {w < 7 ? weekCount(S, T, h.id, -off) + '/' + w + ' cette semaine' : 'chaque jour'}
                  </Text>
                </Pressable>
              </View>
              {days.map((k) => (
                <Dot key={k} on={has(S, k, h.id)} today={k === T} disabled={k > T}
                  a11y={h.n + ' ' + k} onPress={() => update((s) => toggleHabit(s, k, h.id))} />
              ))}
            </Row>
          );
        })}
        <Mu style={{ marginTop: 12, fontSize: 12 }}>Touche « chaque jour » sous une habitude pour changer sa fréquence.</Mu>
        <AddRow value={name} onChangeText={setName} onAdd={add} placeholder="Nouvelle habitude" />
      </Card>

      {off === 0 && gym ? (
        <Card style={{ alignItems: 'center' }}>
          <H>{gym.n}</H>
          <Pressable
            onPress={() => update((s) => toggleHabit(s, T, 'gym'))}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: has(S, T, 'gym') }}
            accessibilityLabel={'Check-in ' + gym.n}
            style={{
              width: 96, height: 96, borderRadius: 48, marginVertical: 10,
              alignItems: 'center', justifyContent: 'center', borderWidth: 1,
              borderColor: has(S, T, 'gym') ? C.gold : C.goldLine,
              backgroundColor: has(S, T, 'gym') ? C.gold : 'transparent',
            }}
          >
            <Text style={{ fontSize: 38, color: has(S, T, 'gym') ? C.ink : C.gold }}>✓</Text>
          </Pressable>
          <Mu>{has(S, T, 'gym') ? 'Séance validée' : 'Check-in'}</Mu>
        </Card>
      ) : null}

      {off === 0 ? (
        <Card>
          <H>Humeur du jour</H>
          <MoodPicker value={S.m[T] || 0} onPick={(n) => update((s) => setMood(s, T, n))} />
          <Mu style={{ marginTop: 12, textAlign: 'center' }}>{S.m[T] ? 'Enregistrée' : 'Comment tu te sens, de 1 à 5 ?'}</Mu>
        </Card>
      ) : null}
    </Grid>
  );
}
