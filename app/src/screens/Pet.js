// Onglet "Pet" : un compagnon (starter plante, eau ou feu, ou le chat d'origine)
// qui grandit grâce à tes habitudes et à ton agenda.
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { C } from '../theme';
import { nh } from '../stats';
import { Btn, Card, Field, Grid, H, Mu, Row } from '../components/ui';
import Cat, { Bowl } from '../pet/Cat';
import Creator from '../pet/Creator';
import { DEFAULT_LOOK, petLook, SEXES } from '../pet/looks';
import { PomodoroCard, BREAK_TEXT, clock, remaining, usePomodoro } from '../pet/Pomodoro';
import { adopt, changeCost, changeStarter, feed, moodOf, restyle, pantry, STAGES, STEP, stageOf, XP } from '../pet/rules';
import { SPECIES, defaultMonLook, isStarter, speciesOf } from '../pet/species';
import Starters from '../pet/Starters';
import { Room } from '../pet/Room';
import Shop from '../pet/Shop';
import { CoinPill } from '../components/Coin';
import { GAIN, wallet } from '../pet/coins';

export default function Pet(p) {
  return p.S.pet ? <Home {...p} /> : <Adopt {...p} />;
}

// ---------- Adoption : on choisit son starter (ou on crée un chat) ----------
function Adopt({ S, update, T, wide }) {
  const [cat, setCat] = useState(false);
  if (cat) {
    return (
      <>
        <View>
          <Text style={{ fontFamily: C.serif, color: C.tx, fontSize: 22, fontWeight: '700' }}>Crée ton chat</Text>
          <Mu style={{ marginTop: 4 }}>Il commence chaton et grandit quand tu tiens tes habitudes.</Mu>
        </View>
        <Creator initial={DEFAULT_LOOK} wide={wide} own={S.shop && S.shop.own} onCancel={() => setCat(false)} onDone={(look, name) => update((s) => adopt(s, T, look, name))} />
      </>
    );
  }
  return (
    <>
      <View>
        <Text style={{ fontFamily: C.serif, color: C.tx, fontSize: 22, fontWeight: '700' }}>Choisis ton starter</Text>
        <Mu style={{ marginTop: 4 }}>Plante, eau ou feu : il grandit et évolue quand tu tiens tes habitudes.</Mu>
      </View>
      <Starters wide={wide} onCat={() => setCat(true)}
        onDone={(sp, name) => update((s) => adopt(s, T, defaultMonLook(sp), name, sp))} />
      <Rules species={null} />
    </>
  );
}

// ---------- Le compagnon ----------
function Home({ S, update, T, wide }) {
  const pet = S.pet;
  const st = stageOf(pet.xp || 0);
  const mood = moodOf(pet, T, S);
  const offToday = !!S.off[T];
  const food = pantry(S, T);
  const look = petLook(pet);
  const sp = speciesOf(pet);
  const info = SPECIES[sp];
  const NAMES = info.stages;
  const k = SEXES[look.sex] || SEXES.m;
  const [edit, setEdit] = useState(false);
  const max = st === STAGES.length - 1;
  const into = (pet.xp || 0) - st * STEP;
  const daysLeft = Math.ceil((STEP - into) / 40);
  const todayHabits = nh(S, T) % 4;
  const [bubble, setBubble] = useState(null);
  const [change, setChange] = useState(false);
  const timer = usePomodoro(S, update, T, (next) => {
    setBubble({ id: Date.now(), text: next === 'break' ? 'Bien joué ! On fait une pause.' : 'Pause finie. On s’y remet ?' });
  });
  const pomo = timer.p;
  const scene = pomo.ph === 'work' ? 'work' : pomo.ph === 'break' ? pomo.scene : offToday ? 'sleep' : null;

  const give = (type) => {
    const before = stageOf(pet.xp || 0);
    const after = stageOf((pet.xp || 0) + XP[type]);
    update((s) => feed(s, T, type));
    setBubble({ id: Date.now(), text: after > before ? (isStarter(sp) ? 'J’évolue ! ' : 'Je grandis ! ') + NAMES[after] : (type === 'p' ? (isStarter(sp) ? 'Miam, un festin ! ' : 'Miam, la pâtée ! ') : 'Crunch ! ') + '+' + XP[type] + ' XP' });
  };

  const moodText = {
    happy: pet.name + ' a bien mangé, ' + k.il + ' est ravi' + k.e + '.',
    ok: pet.name + ' va bien. Donne-lui à manger aujourd’hui.',
    hungry: pet.name + ' a faim… Coche tes habitudes pour gagner ' + (isStarter(sp) ? 'un festin.' : 'de la pâtée.'),
  }[mood];
  const shownText = scene === 'sleep' ? pet.name + ' fait la sieste : c’est ton jour off.' : scene === 'work' ? pet.name + ' travaille avec toi.' : scene ? pet.name + ' ' + BREAK_TEXT[scene] + '.' : moodText;

  const coins = wallet(S, T);
  const cost = changeCost(pet);
  if (change) {
    return (
      <>
        <View>
          <Text style={{ fontFamily: C.serif, color: C.tx, fontSize: 22, fontWeight: '700' }}>{isStarter(sp) ? 'Changer de starter' : 'Choisir un starter'}</Text>
          <Mu style={{ marginTop: 4 }}>{cost ? 'Changer coûte ' + cost + ' pièces et recommence à l’étape 1.' : 'Ton chat peut devenir un starter, gratuitement et sans perdre son XP.'}</Mu>
        </View>
        <Starters mode="change" current={isStarter(sp) ? sp : null} cost={cost} coins={coins} keepXp={cost ? 0 : st} keepName={cost ? null : pet.name} wide={wide}
          onCancel={() => setChange(false)}
          onDone={(nsp, name) => {
            update((s) => changeStarter(s, T, nsp, name));
            setChange(false);
            setBubble({ id: Date.now(), text: SPECIES[nsp].cry[0] + ' Enchanté !' });
          }} />
      </>
    );
  }

  if (edit) {
    return (
      <Creator initial={look} initialName={pet.name} editing stage={st} wide={wide} own={S.shop && S.shop.own} species={sp}
        onCancel={() => setEdit(false)}
        onDone={(l, n) => { update((s) => restyle(s, l, n)); setEdit(false); setBubble({ id: Date.now(), text: 'Nouveau look !' }); }} />
    );
  }

  return (
    <Grid wide={wide}>
      <View style={{ borderRadius: 28, overflow: 'hidden' }}>
        <LinearGradient colors={[C.lav1, C.lav2, C.lav3]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ padding: 18, alignItems: 'center' }}>
          <Row style={{ alignSelf: 'stretch', justifyContent: 'space-between' }}>
            <Text style={{ color: C.acc, fontSize: 11, fontWeight: '700', letterSpacing: 1 }}>{(isStarter(sp) ? info.label + ' · ' + NAMES[st] : NAMES[st]).toUpperCase()}</Text>
            <Row style={{ gap: 6 }}>
            <CoinPill n={coins} bg={C.chip} textColor={C.tx} />
            <View style={{ paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999, backgroundColor: C.chip }}>
              <Text style={{ color: C.tx, fontSize: 12, fontWeight: '600', fontVariant: ['tabular-nums'] }}>
                {scene === 'sleep' ? 'Jour off · dort' : scene ? (scene === 'work' ? 'Au travail' : 'Pause') + ' · ' + clock(remaining(pomo, timer.now)) : mood === 'happy' ? 'Content' : mood === 'ok' ? 'Tranquille' : 'A faim'}
              </Text>
            </View>
            </Row>
          </Row>
          <Room room={S.shop && S.shop.room} species={sp}>
            <Cat look={look} species={sp} stage={st} mood={mood} size={230} name={pet.name} message={bubble} scene={scene} />
          </Room>
          <Text style={{ fontFamily: C.serif, color: C.tx, fontSize: 28, fontWeight: '700', letterSpacing: -0.2 }}>{pet.name}</Text>
          <Mu style={{ textAlign: 'center', marginTop: 2 }}>{shownText}</Mu>
          <Pressable onPress={() => setEdit(true)} accessibilityRole="button" accessibilityLabel="Modifier son apparence"
            style={{ marginTop: 10, paddingVertical: 6, paddingHorizontal: 14, borderRadius: 999, backgroundColor: C.chip }}>
            <Text style={{ color: C.tx, fontSize: 13, fontWeight: '600' }}>Modifier son apparence</Text>
          </Pressable>
          <View style={{ alignSelf: 'stretch', marginTop: 14 }}>
            <Row style={{ justifyContent: 'space-between' }}>
              <Text style={{ color: C.tx, fontWeight: '600', fontSize: 13 }}>{max ? 'Niveau maximum' : (isStarter(sp) ? 'Évolue en « ' : 'Vers « ') + NAMES[st + 1] + ' »'}</Text>
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
        <FoodRow type="p" label={info.food[0]} n={food.p} xp={XP.p} onGive={() => give('p')}
          hint={'Encore ' + (4 - todayHabits) + ' habitude' + (4 - todayHabits > 1 ? 's' : '') + ' à cocher pour la prochaine'} />
        <FoodRow type="c" label={info.food[1]} n={food.c} xp={XP.c} onGive={() => give('c')}
          hint="Chaque rendez-vous passé en rapporte une portion" />
      </Card>

      <Rules species={sp} />

      <Card>
        <H>{isStarter(sp) ? 'Changer de starter' : 'Passer aux starters'}</H>
        <Mu style={{ lineHeight: 19 }}>
          {cost
            ? 'Tu peux prendre un autre starter pour ' + cost + ' pièces. Il recommence à l’étape 1. Tes pièces restantes et tes objets restent.'
            : pet.name + ' peut rester un chat. Si tu préfères un starter (plante, eau ou feu), le premier changement est gratuit et garde son XP.'}
        </Mu>
        <Btn label={isStarter(sp) ? 'Changer de starter' : 'Voir les starters'} ghost onPress={() => setChange(true)} style={{ marginTop: 12 }} />
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

function Rules({ species = 'chat' }) {
  // species = null : avant d'avoir choisi (texte commun aux trois starters).
  const info = species === null ? { food: ['Festin', 'Friandises'], stages: ['bébé', 'jeune', 'adulte', 'sa forme finale'] } : SPECIES[species] || SPECIES.chat;
  const st = species === null || isStarter(species);
  return (
    <Card>
      <H>{st ? 'Comment il évolue' : 'Comment il grandit'}</H>
      <Mu style={{ lineHeight: 20 }}>
        4 habitudes cochées dans une journée = 1 {info.food[0].toLowerCase()} (+30 XP).{'\n'}
        1 rendez-vous passé = 1 portion de {info.food[1].toLowerCase()} (+10 XP).{'\n'}
        Il faut 250 XP pour {st ? 'évoluer' : 'grandir'} : environ une semaine régulière.{'\n'}
        Étapes : {info.stages.slice(0, 3).join(', ')}, puis {info.stages[3]}.{'\n'}
        S’il ne mange pas pendant deux jours, il a faim, mais il ne perd rien.
      </Mu>
      <H style={{ marginTop: 14 }}>Les pièces</H>
      <Mu style={{ lineHeight: 20 }}>
        Chaque habitude cochée rapporte {GAIN.h} pièces, et {GAIN.all} de plus si tu fais toutes tes habitudes du jour.{'\n'}
        Une tâche faite : {GAIN.t} pièces. Un rendez-vous ou un cours passé : {GAIN.ev}. Une séance de salle : {GAIN.w}.{'\n'}
        Décocher retire les pièces du jour ; les jours passés restent acquis.{'\n'}
        Dépense-les dans la boutique : accessoires, tenues, déco de son type et meubles pour sa pièce.
      </Mu>
    </Card>
  );
}
