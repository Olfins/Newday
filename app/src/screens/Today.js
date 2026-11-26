// Écran "Jour" : la journée d'aujourd'hui avec ses habitudes, la salle, l'humeur, les tâches et le programme.
// Les autres jours se corrigent dans Semaine ou Calendrier.
import React, { useState } from 'react';
import { Platform, Text, View } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { C } from '../theme';
import { has, visibleTodos } from '../stats';
import { toggleOff } from '../store';
import { parseICS, mergeICS } from '../ics';
import { Btn, Card, Mu, Row } from '../components/ui';
import { DayHabits, GymCard, MoodCard, NowCard, Schedule, TodoCard } from '../components/today';

async function readPicked(asset) {
  if (asset.file && asset.file.text) return asset.file.text();
  const r = await fetch(asset.uri);
  return r.text();
}

export default function Today({ S, update, T, wide, openAdd, openGym }) {
  const [msg, setMsg] = useState('');
  const k = T;
  const tl = visibleTodos(S, T);
  const habitsDone = S.h.filter((h) => has(S, k, h.id)).length;
  const todosDone = tl.filter((o) => o.t.x).length;
  const total = S.h.length + tl.length;

  const importICS = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: Platform.OS === 'web' ? '.ics,text/calendar' : ['text/calendar', '*/*'],
        copyToCacheDirectory: true,
      });
      if (res.canceled || !res.assets || !res.assets[0]) return;
      const found = parseICS(await readPicked(res.assets[0]));
      const n = Object.values(found).reduce((a, v) => a + v.length, 0);
      update((s) => mergeICS(s, T, found));
      setMsg('Agenda importé : ' + n + ' événement' + (n > 1 ? 's' : '') + ' sur 14 jours.');
    } catch (e) {
      setMsg('Fichier .ics illisible.');
    }
  };

  const summary = (
    <Row style={{ gap: 10 }}>
      <Text style={{ color: C.tx, fontSize: 14, fontWeight: '600' }}>Fait {habitsDone + todosDone} sur {total}</Text>
    </Row>
  );

  if (S.off[k]) {
    return (
      <>
        {summary}
        <Card hero style={{ alignItems: 'center', paddingVertical: 40 }}>
          <Text style={{ fontFamily: C.serif, color: C.pri, fontSize: 30, fontWeight: '300', letterSpacing: 6 }}>REPOS</Text>
          <Mu style={{ marginTop: 8, textAlign: 'center' }}>Jour off : il ne compte pas dans tes séries.</Mu>
          <Btn label="Annuler le jour off" onPress={() => update((s) => toggleOff(s, k))} style={{ marginTop: 20 }} />
        </Card>
      </>
    );
  }

  const left = (
    <View style={{ gap: 14 }}>
      <NowCard S={S} T={T} k={k} onAdd={() => openAdd('event')} />
      <DayHabits S={S} update={update} k={k} />
      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'stretch' }}>
        <GymCard S={S} update={update} T={T} k={k} onOpen={openGym} />
        <MoodCard S={S} update={update} T={T} k={k} />
      </View>
      <TodoCard S={S} update={update} T={T} />
    </View>
  );
  const right = (
    <View style={{ gap: 10 }}>
      <Card style={wide ? null : { backgroundColor: 'transparent', borderWidth: 0, padding: 2 }}>
        <Schedule S={S} update={update} T={T} k={k} onAdd={() => openAdd('event')} />
      </Card>
      <Row style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
        <Btn label="Importer un agenda (.ics)" ghost onPress={importICS} textStyle={{ fontSize: 13 }} />
        <Btn label="Jour off" ghost onPress={() => update((s) => toggleOff(s, k))} textStyle={{ fontSize: 13 }} />
      </Row>
      {msg ? <Mu style={{ textAlign: 'center' }}>{msg}</Mu> : null}
    </View>
  );

  return (
    <>
      {summary}
      {wide ? (
        <View style={{ flexDirection: 'row', gap: 16, alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>{left}</View>
          <View style={{ flex: 1 }}>{right}</View>
        </View>
      ) : (
        <>
          {left}
          {right}
        </>
      )}
    </>
  );
}
