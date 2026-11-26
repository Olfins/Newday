// Onglet "Pet" : un chat qui grandit grâce à tes habitudes et à ton agenda.
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { C } from '../theme';
import { nh } from '../stats';
import { Btn, Card, Field, Grid, H, Mu, Row } from '../components/ui';
import Cat, { Bowl, CatDrawing } from '../pet/Cat';
import { adopt, feed, KINDS, moodOf, pantry, STAGES, STEP, stageOf, XP } from '../pet/rules';

export default function Pet(p) {
  return p.S.pet ? <Home {...p} /> : <Adopt {...p} />;
}

// ---------- Adoption ----------
function Adopt({ S, update, T, wide }) {
  const [kind, setKind] = useState('noir');
  const [name, setName] = useState(KINDS.noir.name);
  const pick = (k) => { setKind(k); setName(KINDS[k].name); };
  return (
    <>
      <View>
        <Text style={{ color: C.tx, fontSize: 22, fontWeight: '700' }}>Adopte ton compagnon</Text>
        <Mu style={{ marginTop: 4 }}>Il commence chaton et grandit quand tu tiens tes habitudes. Choisis-le :</Mu>
      </View>
      <Row style={{ gap: 12, alignItems: 'stretch' }}>
        {Object.entries(KINDS).map(([k, v]) => {
          const on = kind === k;
          return (
            <Pressable key={k} onPress={() => pick(k)} accessibilityRole="button" accessibilityState={{ selected: on }} accessibilityLabel={v.label}
              style={{ flex: 1, alignItems: 'center', padding: 12, borderRadius: 24, backgroundColor: C.card, borderWidth: on ? 2 : 1, borderColor: on ? C.pri : C.line }}>
              <CatDrawing kind={k} stage={0} mood="happy" size={130} />
              <Text style={{ color: C.tx, fontWeight: '700', marginTop: 4 }}>{v.label}</Text>
              <Mu style={{ fontSize: 12, textAlign: 'center' }}>{v.sub}</Mu>
            </Pressable>
          );
        })}
      </Row>
      <Card>
        <H>Son prénom</H>
        <Field value={name} onChangeText={setName} placeholder={KINDS[kind].name} maxLength={18} />
        <Btn label={'Adopter ' + (name.trim() || KINDS[kind].name)} active onPress={() => update((s) => adopt(s, T, kind, name.trim()))} style={{ marginTop: 14, paddingVertical: 13 }} />
      </Card>
      <Rules />
    </>
  );
}

// ---------- Le chat ----------
function Home({ S, update, T, wide }) {
  const pet = S.pet;
  const st = stageOf(pet.xp || 0);
  const mood = moodOf(pet, T);
  const food = pantry(S, T);
  const k = KINDS[pet.kind];
  const max = st === STAGES.length - 1;
  const into = (pet.xp || 0) - st * STEP;
  const daysLeft = Math.ceil((STEP - into) / 40);
  const todayHabits = nh(S, T) % 4;
  const [bubble, setBubble] = useState(null);
  const [reset, setReset] = useState(false);

  const give = (type) => {
    const before = stageOf(pet.xp || 0);
    const after = stageOf((pet.xp || 0) + XP[type]);
    update((s) => feed(s, T, type));
    setBubble({ id: Date.now(), text: after > before ? 'Je grandis ! ' + STAGES[after] : (type === 'p' ? 'Miam, la pâtée ! ' : 'Crunch ! ') + '+' + XP[type] + ' XP' });
  };

  const moodText = {
    happy: pet.name + ' a bien mangé, ' + k.il + ' est ' + (pet.kind === 'roux' ? 'ravie' : 'ravi') + '.',
    ok: pet.name + ' va bien. Donne-' + (pet.kind === 'roux' ? 'lui' : 'lui') + ' à manger aujourd’hui.',
    hungry: pet.name + ' a faim… Coche tes habitudes pour gagner de la pâtée.',
  }[mood];

  return (
    <Grid wide={wide}>
      <View style={{ borderRadius: 28, overflow: 'hidden' }}>
        <LinearGradient colors={[C.lav1, C.lav2, '#F7F6FD']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ padding: 18, alignItems: 'center' }}>
          <Row style={{ alignSelf: 'stretch', justifyContent: 'space-between' }}>
            <Text style={{ color: C.acc, fontSize: 11, fontWeight: '700', letterSpacing: 1 }}>{STAGES[st].toUpperCase()}</Text>
            <View style={{ paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.6)' }}>
              <Text style={{ color: C.tx, fontSize: 12, fontWeight: '600' }}>{mood === 'happy' ? 'Content' : mood === 'ok' ? 'Tranquille' : 'A faim'}</Text>
            </View>
          </Row>
          <Cat kind={pet.kind} stage={st} mood={mood} size={230} name={pet.name} message={bubble} />
          <Text style={{ color: C.tx, fontSize: 28, fontWeight: '700', letterSpacing: -0.5 }}>{pet.name}</Text>
          <Mu style={{ textAlign: 'center', marginTop: 2 }}>{moodText}</Mu>
          <View style={{ alignSelf: 'stretch', marginTop: 14 }}>
            <Row style={{ justifyContent: 'space-between' }}>
              <Text style={{ color: C.tx, fontWeight: '600', fontSize: 13 }}>{max ? 'Niveau maximum' : 'Vers « ' + STAGES[st + 1] + ' »'}</Text>
              <Text style={{ color: C.mu, fontSize: 13 }}>{max ? (pet.xp || 0) + ' XP' : into + ' / ' + STEP + ' XP'}</Text>
            </Row>
            <View style={{ height: 8, borderRadius: 4, backgroundColor: 'rgba(23,23,29,0.1)', marginTop: 6, overflow: 'hidden' }}>
              <View style={{ width: (max ? 100 : Math.round((100 * into) / STEP)) + '%', height: '100%', backgroundColor: C.pri }} />
            </View>
            {!max ? <Mu style={{ fontSize: 12, marginTop: 4 }}>Encore environ {daysLeft} jour{daysLeft > 1 ? 's' : ''} réguliers.</Mu> : null}
          </View>
        </LinearGradient>
      </View>

      <Card>
        <H>Garde-manger</H>
        <Mu>Ce que tu as gagné. Touche « Donner » pour nourrir {pet.name}.</Mu>
        <FoodRow type="p" label="Pâtée" n={food.p} xp={XP.p} onGive={() => give('p')}
          hint={'Encore ' + (4 - todayHabits) + ' habitude' + (4 - todayHabits > 1 ? 's' : '') + ' à cocher pour la prochaine'} />
        <FoodRow type="c" label="Croquettes" n={food.c} xp={XP.c} onGive={() => give('c')}
          hint="Chaque rendez-vous passé en rapporte une portion" />
      </Card>

      <Rules />

      <Card>
        {reset ? (
          <>
            <Text style={{ color: C.tx, fontWeight: '600' }}>Recommencer avec un nouveau chaton ?</Text>
            <Mu style={{ marginTop: 4 }}>{pet.name} et son XP seront remplacés. Tes habitudes ne changent pas.</Mu>
            <Row style={{ marginTop: 12 }}>
              <Btn label="Annuler" onPress={() => setReset(false)} style={{ flex: 1 }} />
              <Btn label="Recommencer" ghost onPress={() => update((s) => { delete s.pet; })} style={{ flex: 1 }} />
            </Row>
          </>
        ) : (
          <Btn label="Changer de compagnon" ghost onPress={() => setReset(true)} />
        )}
      </Card>
    </Grid>
  );
}

function FoodRow({ type, label, n, xp, onGive, hint }) {
  return (
    <Row style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: C.line, gap: 12 }}>
      <Bowl type={type} />
      <View style={{ flex: 1 }}>
        <Text style={{ color: C.tx, fontWeight: '700' }}>{label} × {n}</Text>
        <Mu style={{ fontSize: 12 }}>{n ? '+' + xp + ' XP par portion' : hint}</Mu>
      </View>
      <Btn label="Donner" active={n > 0} disabled={!n} onPress={onGive} />
    </Row>
  );
}

function Rules() {
  return (
    <Card>
      <H>Comment il grandit</H>
      <Mu style={{ lineHeight: 20 }}>
        4 habitudes cochées dans une journée = 1 pâtée (+30 XP).{'\n'}
        1 rendez-vous passé = 1 portion de croquettes (+10 XP).{'\n'}
        Il faut 250 XP pour grandir : environ une semaine régulière.{'\n'}
        Étapes : Chaton, Jeune chat, Adulte, puis PDG.{'\n'}
        S’il ne mange pas pendant deux jours, il a faim, mais il ne perd rien.
      </Mu>
    </Card>
  );
}
