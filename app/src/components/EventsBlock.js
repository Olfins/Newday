// Liste des événements d'un jour + formulaire pour en ajouter.
import React, { useState } from 'react';
import { View, Text, Switch } from 'react-native';
import { C, TYPES, typeColor } from '../theme';
import { cleanTime, hm } from '../dates';
import { addEvent, addExam, removeEvent } from '../store';
import { AddRow, Btn, Field, Icon, Mu, Row } from './ui';

function Line({ when, title, color, onDelete, now }) {
  return (
    <Row
      style={{
        paddingVertical: 9,
        borderTopWidth: 1,
        borderTopColor: C.line,
        backgroundColor: now ? C.goldSoft : 'transparent',
        borderRadius: now ? 10 : 0,
        paddingHorizontal: now ? 6 : 0,
      }}
    >
      <Text style={{ color: C.gold, fontWeight: '700', fontSize: 13, minWidth: 86 }}>{when}</Text>
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color }} />
      <Text style={{ color: C.tx, flex: 1 }}>{title}</Text>
      <Icon label="✕" onPress={onDelete} a11y={'Supprimer ' + title} />
    </Row>
  );
}

export default function EventsBlock({ S, update, k, T }) {
  const [ty, setTy] = useState('cours');
  const [name, setName] = useState('');
  const [t1, setT1] = useState('');
  const [t2, setT2] = useState('');
  const [weekly, setWeekly] = useState(false);
  const [err, setErr] = useState('');

  const nowHM = hm(new Date());
  const events = (S.ev[k] || []).map((e, i) => ({ e, i })).sort((a, b) => (a.e.s || '').localeCompare(b.e.s || ''));
  const exams = S.x.map((x, i) => ({ x, i })).filter((o) => o.x.d === k);

  const add = () => {
    const n = name.trim();
    if (!n) return;
    if (ty === 'ex') {
      update((s) => addExam(s, n, k));
    } else {
      const a = t1 ? cleanTime(t1) : '', b = t2 ? cleanTime(t2) : '';
      if (a === null || b === null) return setErr('Heure invalide. Écris par exemple 9:30 ou 14h.');
      update((s) => addEvent(s, k, { t: n, s: a, e: b, ty }, weekly));
    }
    setName(''); setT1(''); setT2(''); setErr('');
  };

  return (
    <View style={{ marginTop: 8 }}>
      {exams.map((o) => (
        <Line key={'x' + o.i} when="Examen" title={o.x.n} color={C.red}
          onDelete={() => update((s) => s.x.splice(o.i, 1))} />
      ))}
      {events.map(({ e, i }) => (
        <Line
          key={i}
          when={e.s ? e.s + (e.e ? '–' + e.e : '') : 'Journée'}
          title={e.t}
          color={typeColor(e.ty)}
          now={k === T && e.s && e.e && e.s <= nowHM && nowHM < e.e}
          onDelete={() => update((s) => removeEvent(s, k, i))}
        />
      ))}
      {!events.length && !exams.length ? <Mu style={{ marginTop: 4 }}>Rien de prévu ce jour-là.</Mu> : null}

      <Mu style={{ marginTop: 16 }}>Ajouter à l’agenda</Mu>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
        {TYPES.map((x) => (
          <Btn key={x.id} label={x.label} active={ty === x.id} onPress={() => setTy(x.id)} />
        ))}
      </View>
      {ty !== 'ex' ? (
        <Row>
          <Field value={t1} onChangeText={setT1} placeholder="Début 9:00" style={{ flex: 1 }} />
          <Field value={t2} onChangeText={setT2} placeholder="Fin (facultatif)" style={{ flex: 1 }} />
        </Row>
      ) : null}
      <AddRow value={name} onChangeText={setName} onAdd={add} placeholder="Intitulé (cours, rendez-vous…)" />
      {err ? <Text style={{ color: C.red, marginTop: 6, fontSize: 13 }}>{err}</Text> : null}
      {ty !== 'ex' ? (
        <Row style={{ marginTop: 10 }}>
          <Switch
            value={weekly}
            onValueChange={setWeekly}
            trackColor={{ false: C.line, true: C.goldLine }}
            thumbColor={weekly ? C.gold : '#888'}
            activeThumbColor={C.gold}
          />
          <Mu>Chaque semaine (15 semaines)</Mu>
        </Row>
      ) : null}
    </View>
  );
}
