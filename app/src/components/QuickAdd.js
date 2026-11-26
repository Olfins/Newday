// Fenêtre qui s'ouvre avec le bouton + : ajouter une tâche, un événement, un examen ou une habitude.
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, Switch, Text, View } from 'react-native';
import { C, TYPES } from '../theme';
import { cap, cleanTime, fmt } from '../dates';
import { addEvent, addExam, addHabit } from '../store';
import { Btn, Field, Mu, Row } from './ui';

const KINDS = [
  { id: 'todo', label: 'Tâche' },
  { id: 'event', label: 'Événement' },
  { id: 'exam', label: 'Examen' },
  { id: 'habit', label: 'Habitude' },
];

export default function QuickAdd({ visible, onClose, update, k, T, initial = 'todo' }) {
  const [kind, setKind] = useState(initial);
  const [name, setName] = useState('');
  const [ty, setTy] = useState('cours');
  const [t1, setT1] = useState('');
  const [t2, setT2] = useState('');
  const [weekly, setWeekly] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (visible) { setKind(initial); setName(''); setT1(''); setT2(''); setWeekly(false); setErr(''); }
  }, [visible, initial]);

  const save = () => {
    const n = name.trim();
    if (!n) return setErr('Écris un intitulé.');
    if (kind === 'todo') update((s) => s.t.push({ t: n, x: false, d: T }));
    else if (kind === 'habit') update((s) => addHabit(s, n));
    else if (kind === 'exam') update((s) => addExam(s, n, k));
    else {
      const a = t1 ? cleanTime(t1) : '', b = t2 ? cleanTime(t2) : '';
      if (a === null || b === null) return setErr('Heure invalide. Écris par exemple 9:30 ou 14h.');
      update((s) => addEvent(s, k, { t: n, s: a, e: b, ty }, weekly));
    }
    onClose();
  };

  const dayLabel = cap(fmt(k, { weekday: 'long', day: 'numeric', month: 'long' }));
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Pressable onPress={onClose} accessibilityLabel="Fermer" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)' }} />
        <View style={{
          backgroundColor: C.card, borderTopLeftRadius: 28, borderTopRightRadius: 28, borderWidth: 1, borderColor: C.accLine,
          padding: 20, paddingBottom: 34, width: '100%', maxWidth: 560, alignSelf: 'center',
        }}>
          <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: C.line, alignSelf: 'center', marginBottom: 14 }} />
          <Text style={{ color: C.tx, fontSize: 22, fontWeight: '700' }}>Ajouter</Text>
          <View style={{ flexDirection: 'row', gap: 4, padding: 4, borderRadius: 999, backgroundColor: C.bg, marginTop: 12 }}>
            {KINDS.map((x) => (
              <Pressable key={x.id} onPress={() => { setKind(x.id); setErr(''); }}
                accessibilityRole="tab" accessibilityState={{ selected: kind === x.id }}
                style={{ flex: 1, paddingVertical: 8, borderRadius: 999, alignItems: 'center', backgroundColor: kind === x.id ? C.pri : 'transparent' }}>
                <Text numberOfLines={1} style={{ color: kind === x.id ? C.onPri : C.mu, fontWeight: '600', fontSize: 13 }}>{x.label}</Text>
              </Pressable>
            ))}
          </View>
          {kind === 'event' || kind === 'exam' ? <Mu style={{ marginTop: 12 }}>Pour : {dayLabel}</Mu> : null}
          {kind === 'event' ? (
            <>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
                {TYPES.filter((x) => x.id !== 'ex').map((x) => (
                  <Btn key={x.id} label={x.label} active={ty === x.id} onPress={() => setTy(x.id)} />
                ))}
              </View>
              <Row>
                <Field value={t1} onChangeText={setT1} placeholder="Début 9:00" style={{ flex: 1 }} />
                <Field value={t2} onChangeText={setT2} placeholder="Fin (facultatif)" style={{ flex: 1 }} />
              </Row>
            </>
          ) : null}
          <Field
            value={name}
            onChangeText={setName}
            autoFocus
            onSubmitEditing={save}
            returnKeyType="done"
            placeholder={{ todo: 'Ex. : Faire les courses', event: 'Ex. : Cours de droit', exam: 'Ex. : Droit civil', habit: 'Ex. : Méditation' }[kind]}
          />
          {kind === 'event' ? (
            <Row style={{ marginTop: 12 }}>
              <Switch value={weekly} onValueChange={setWeekly} trackColor={{ false: C.line, true: C.accLine }}
                thumbColor={weekly ? C.pri : '#FFFFFF'} activeThumbColor={C.pri} />
              <Mu>Chaque semaine (15 semaines)</Mu>
            </Row>
          ) : null}
          {err ? <Text style={{ color: C.red, marginTop: 8, fontSize: 13 }}>{err}</Text> : null}
          <Row style={{ marginTop: 18 }}>
            <Btn label="Annuler" ghost onPress={onClose} style={{ flex: 1 }} />
            <Btn label="Ajouter" active onPress={save} style={{ flex: 1 }} />
          </Row>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
