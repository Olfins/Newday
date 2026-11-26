// Écran "Aujourd'hui" : focus du jour, agenda, tâches, examens.
import React, { useState } from 'react';
import { Platform, View, Text } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { C } from '../theme';
import { daysBetween, fmt } from '../dates';
import { has, visibleTodos } from '../stats';
import { addHabit, removeHabit, toggleHabit, toggleOff } from '../store';
import { parseICS, mergeICS } from '../ics';
import { AddRow, Bar, Btn, Card, Dot, Grid, H, Icon, Mu, Row } from '../components/ui';
import { HabitChips } from '../components/bits';
import WeekStrip from '../components/WeekStrip';
import DayPanel from '../components/DayPanel';
import EventsBlock from '../components/EventsBlock';

export default function Today(p) {
  const { S, T, cd, setCd, wide } = p;
  const [off, setOff] = useState(0);
  const back = () => { setCd(T); setOff(0); };
  return (
    <>
      <WeekStrip S={S} T={T} cd={cd} setCd={setCd} off={off} setOff={setOff} />
      {cd === T ? <TodayBody {...p} /> : <DayPanel {...p} k={cd} onBack={back} />}
    </>
  );
}

function TodayBody({ S, update, T, wide }) {
  if (S.off[T]) {
    return (
      <Card hero style={{ alignItems: 'center', paddingVertical: 40 }}>
        <Text style={{ color: C.gold, fontSize: 30, fontWeight: '300', letterSpacing: 6 }}>REPOS</Text>
        <Mu style={{ marginTop: 8, textAlign: 'center' }}>Jour off : il ne compte pas dans tes séries.</Mu>
        <Btn label="Annuler le jour off" onPress={() => update((s) => toggleOff(s, T))} style={{ marginTop: 20 }} />
      </Card>
    );
  }
  return (
    <>
      <Grid wide={wide}>
        <Focus S={S} update={update} T={T} />
        <Agenda S={S} update={update} T={T} />
        <Todos S={S} update={update} T={T} />
        <Exams S={S} update={update} T={T} />
      </Grid>
      <Btn label="Jour off" ghost onPress={() => update((s) => toggleOff(s, T))} style={{ alignSelf: 'center' }} />
    </>
  );
}

function Focus({ S, update, T }) {
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState('');
  const tl = visibleTodos(S, T);
  const left = tl.filter((o) => !o.t.x).length;
  const hd = S.h.filter((h) => has(S, T, h.id)).length;
  const pct = Math.round(((hd + tl.length - left) / (S.h.length + tl.length || 1)) * 100);
  const add = () => {
    const v = name.trim();
    if (!v) return;
    update((s) => addHabit(s, v));
    setName('');
  };
  return (
    <Card hero>
      <Row style={{ justifyContent: 'space-between' }}>
        <H>Focus du jour</H>
        <Btn label={edit ? 'Terminé' : 'Modifier'} ghost onPress={() => setEdit(!edit)} />
      </Row>
      <Mu>{left} tâche{left > 1 ? 's' : ''} à faire · {hd}/{S.h.length} habitudes</Mu>
      <Bar pct={pct} />
      <HabitChips
        S={S}
        k={T}
        editing={edit}
        onToggle={(id) => update((s) => toggleHabit(s, T, id))}
        onRemove={(id) => update((s) => removeHabit(s, id))}
      />
      <AddRow value={name} onChangeText={setName} onAdd={add} placeholder="Nouvelle habitude" />
    </Card>
  );
}

function Todos({ S, update, T }) {
  const [v, setV] = useState('');
  const tl = visibleTodos(S, T);
  const add = () => {
    const t = v.trim();
    if (!t) return;
    update((s) => s.t.push({ t, x: false, d: T }));
    setV('');
  };
  return (
    <Card>
      <H>À faire aujourd’hui</H>
      {tl.map(({ t, i }) => (
        <Row key={i} style={{ paddingVertical: 9, borderTopWidth: 1, borderTopColor: C.line, gap: 12 }}>
          <Dot on={t.x} a11y={t.t} onPress={() => update((s) => { s.t[i].x = !s.t[i].x; s.t[i].d = T; })} />
          <Text style={{ flex: 1, color: t.x ? C.mu : C.tx, textDecorationLine: t.x ? 'line-through' : 'none' }}>{t.t}</Text>
          <Icon label="✕" a11y={'Supprimer ' + t.t} onPress={() => update((s) => s.t.splice(i, 1))} />
        </Row>
      ))}
      {!tl.length ? <Mu style={{ marginTop: 4 }}>Aucune tâche pour l’instant.</Mu> : null}
      <AddRow value={v} onChangeText={setV} onAdd={add} placeholder="Ajouter une tâche" />
    </Card>
  );
}

async function readPicked(asset) {
  if (asset.file && asset.file.text) return asset.file.text();
  const r = await fetch(asset.uri);
  return r.text();
}

function Agenda({ S, update, T }) {
  const [msg, setMsg] = useState('');
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
  return (
    <Card>
      <Row style={{ justifyContent: 'space-between' }}>
        <H>Agenda</H>
        <Btn label="Importer .ics" ghost onPress={importICS} />
      </Row>
      {msg ? <Mu>{msg}</Mu> : null}
      <EventsBlock S={S} update={update} k={T} T={T} />
    </Card>
  );
}

function Exams({ S, update, T }) {
  const list = S.x.map((x, i) => ({ x, i, n: daysBetween(T, x.d) })).filter((o) => o.n >= 0);
  if (!list.length) return null;
  return (
    <Card>
      <H>Examens</H>
      {list.map((o) => (
        <Row key={o.i} style={{ paddingVertical: 9, borderTopWidth: 1, borderTopColor: C.line }}>
          <Text style={{ color: C.gold, fontWeight: '700', minWidth: 86 }}>
            {o.n === 0 ? 'Aujourd’hui' : o.n === 1 ? 'Demain' : 'J-' + o.n}
          </Text>
          <Text style={{ color: C.tx, flex: 1 }}>
            {o.x.n} · {fmt(o.x.d, { day: 'numeric', month: 'short' })}
          </Text>
          <Icon label="✕" a11y={'Supprimer ' + o.x.n} onPress={() => update((s) => s.x.splice(o.i, 1))} />
        </Row>
      ))}
    </Card>
  );
}
