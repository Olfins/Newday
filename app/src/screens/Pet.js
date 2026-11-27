// Onglet "Pet" : un chat qui grandit grâce à tes habitudes et à ton agenda.
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { C } from '../theme';
import { nh } from '../stats';
import { Btn, Card, Field, Grid, H, Mu, Row } from '../components/ui';
import Cat, { Bowl } from '../pet/Cat';
import Creator from '../pet/Creator';
import { DEFAULT_LOOK, lookOf, SEXES } from '../pet/looks';
import { PomodoroCard, BREAK_TEXT, clock, remaining, usePomodoro } from '../pet/Pomodoro';
import { adopt, feed, moodOf, restyle, pantry, STAGES, STEP, stageOf, XP } from '../pet/rules';
import { Room } from '../pet/Room';
import Shop from '../pet/Shop';
import { CoinPill } from '../components/Coin';
import { GAIN, wallet } from '../pet/coins';

export default function Pet(p) {
  return p.S.pet ? <Home {...p} /> : <Adopt {...p} />;
}

// ---------- Adoption : on crée son chat ----------
function Adopt({ S, update, T, wide }) {
  return (
    <>
      <View>
        <Text style={{ fontFamily: C.serif, color: C.tx, fontSize: 22, fontWeight: '700' }}>Crée ton compagnon</Text>
        <Mu style={{ marginTop: 4 }}>Il commence chaton et grandit quand tu tiens tes habitudes. Choisis chaque détail, tu pourras le changer plus tard.</Mu>
      </View>
      <Creator initial={DEFAULT_LOOK} wide={wide} own={S.shop && S.shop.own} onDone={(look, name) => update((s) => adopt(s, T, look, name))} />
      <Rules />
    </>
  );
}

// ---------- Le chat ----------
function Home({ S, update, T, wide }) {
  const pet = S.pet;
  const st = stageOf(pet.xp || 0);
  const mood = moodOf(pet, T, S);
  const offToday = !!S.off[T];
  const food = pantry(S, T);
  const look = lookOf(pet);
  const k = SEXES[look.sex] || SEXES.m;
  const [edit, setEdit] = useState(false);
  const max = st === STAGES.length - 1;
  const into = (pet.xp || 0) - st * STEP;
  const daysLeft = Math.ceil((STEP - into) / 40);
  const todayHabits = nh(S, T) % 4;
  const [bubble, setBubble] = useState(null);
  const [reset, setReset] = useState(false);
  const timer = usePomodoro(S, update, T, (next) => {
    setBubble({ id: Date.now(), text: next === 'break' ? 'Bien joué ! On fait une pause.' : 'Pause finie. On s’y remet ?' });
  });
  const pomo = timer.p;
  const scene = pomo.ph === 'work' ? 'work' : pomo.ph === 'break' ? pomo.scene : offToday ? 'sleep' : null;

  const give = (type) => {
    const before = stageOf(pet.xp || 0);
    const after = stageOf((pet.xp || 0) + XP[type]);
    update((s) => feed(s, T, type));
    setBubble({ id: Date.now(), text: after > before ? 'Je grandis ! ' + STAGES[after] : (type === 'p' ? 'Miam, la pâtée ! ' : 'Crunch ! ') + '+' + XP[type] + ' XP' });
  };

  const moodText = {
    happy: pet.name + ' a bien mangé, ' + k.il + ' est ravi' + k.e + '.',
    ok: pet.name + ' va bien. Donne-lui à manger aujourd’hui.',
    hungry: pet.name + ' a faim… Coche tes habitudes pour gagner de la pâtée.',
  }[mood];
  const shownText = scene === 'sleep' ? pet.name + ' fait la sieste : c’est ton jour off.' : scene === 'work' ? pet.name + ' travaille avec toi.' : scene ? pet.name + ' ' + BREAK_TEXT[scene] + '.' : moodText;

  if (edit) {
    return (
      <Creator initial={look} initialName={pet.name} editing stage={st} wide={wide} own={S.shop && S.shop.own}
        onCancel={() => setEdit(false)}
        onDone={(l, n) => { update((s) => restyle(s, l, n)); setEdit(false); setBubble({ id: Date.now(), text: 'Nouveau look !' }); }} />
    );
  }

  return (
    <Grid wide={wide}>
      <View style={{ borderRadius: 28, overflow: 'hidden' }}>
        <LinearGradient colors={[C.lav1, C.lav2, C.lav3]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ padding: 18, alignItems: 'center' }}>
          <Row style={{ alignSelf: 'stretch', justifyContent: 'space-between' }}>
            <Text style={{ color: C.acc, fontSize: 11, fontWeight: '700', letterSpacing: 1 }}>{STAGES[st].toUpperCase()}</Text>
            <Row style={{ gap: 6 }}>
            <CoinPill n={wallet(S, T)} bg={C.chip} textColor={C.tx} />
            <View style={{ paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999, backgroundColor: C.chip }}>
              <Text style={{ color: C.tx, fontSize: 12, fontWeight: '600', fontVariant: ['tabular-nums'] }}>
                {scene === 'sleep' ? 'Jour off · dort' : scene ? (scene === 'work' ? 'Au travail' : 'Pause') + ' · ' + clock(remaining(pomo, timer.now)) : mood === 'happy' ? 'Content' : mood === 'ok' ? 'Tranquille' : 'A faim'}
              </Text>
            </View>
            </Row>
          </Row>
          <Room room={S.shop && S.shop.room}>
            <Cat look={look} stage={st} mood={mood} size={230} name={pet.name} message={bubble} scene={scene} />
          </Room>
          <Text style={{ fontFamily: C.serif, color: C.tx, fontSize: 28, fontWeight: '700', letterSpacing: -0.2 }}>{pet.name}</Text>
          <Mu style={{ textAlign: 'center', marginTop: 2 }}>{shownText}</Mu>
          <Pressable onPress={() => setEdit(true)} accessibilityRole="button" accessibilityLabel="Modifier son apparence"
            style={{ marginTop: 10, paddingVertical: 6, paddingHorizontal: 14, borderRadius: 999, backgroundColor: C.chip }}>
            <Text style={{ color: C.tx, fontSize: 13, fontWeight: '600' }}>Modifier son apparence</Text>
          </Pressable>
          <View style={{ alignSelf: 'stretch', marginTop: 14 }}>
            <Row style={{ justifyContent: 'space-between' }}>
              <Text style={{ color: C.tx, fontWeight: '600', fontSize: 13 }}>{max ? 'Niveau maximum' : 'Vers « ' + STAGES[st + 1] + ' »'}</Text>
              <Text style={{ color: C.mu, fontSize: 13 }}>{max ? (pet.xp || 0) + ' XP' : into + ' / ' + STEP + ' XP'}</Text>
            </Row>
            <View style={{ height: 8, borderRadius: 4, backgroundColor: C.track, marginTop: 6, overflow: 'hidden' }}>
              <View style={{ width: (max ? 100 : Math.round((100 * into) / STEP)) + '%', height: '100%', backgroundColor: C.pri }} />
            </View>
            {!max ? <Mu style={{ fontSize: 12, marginTop: 4 }}>Encore environ {daysLeft} jour{daysLeft > 1 ? 's' : ''} réguliers.</Mu> : null}
          </View>
        </LinearGradient>
      </View>

      <Shop S={S} update={update} T={T} stage={st} onEvent={(text) => setBubble({ id: Date.now(), text })} />

      <PomodoroCard S={S} update={update} T={T} timer={timer} name={pet.name} />

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
      <H style={{ marginTop: 14 }}>Les pièces</H>
      <Mu style={{ lineHeight: 20 }}>
        Chaque habitude cochée rapporte {GAIN.h} pièces, et {GAIN.all} de plus si tu fais toutes tes habitudes du jour.{'\n'}
        Une tâche faite : {GAIN.t} pièces. Un rendez-vous ou un cours passé : {GAIN.ev}. Une séance de salle : {GAIN.w}.{'\n'}
        Décocher retire les pièces du jour ; les jours passés restent acquis.{'\n'}
        Dépense-les dans la boutique : accessoires, tenues et déco pour sa pièce.
      </Mu>
    </Card>
  );
}
