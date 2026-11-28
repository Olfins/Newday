// Onglet « Bonsaï » : un bonsaï qui grandit, brique après brique, dans une bibliothèque
// dont chaque étagère est une habitude.
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { C } from '../theme';
import { Card, Grid, H, Mu, Row } from '../components/ui';
import { CoinPill } from '../components/Coin';
import Library, { bookColor } from '../bonsai/Library';
import Shop from '../bonsai/Shop';
import { PomodoroCard, usePomodoro } from '../bonsai/Pomodoro';
import { growthOf, healthOf, libraryFill, MAX_SHELVES, shelvesOf, STAGES, stateText, WINDOW } from '../bonsai/growth';
import { setupOf } from '../bonsai/items';
import { GAIN, wallet } from '../bonsai/coins';

export default function Bonsai({ S, update, T, wide, openAdd }) {
  const gr = growthOf(S);
  const health = healthOf(S, T);
  const shelves = shelvesOf(S, T);
  const fill = libraryFill(shelves);
  const setup = setupOf(S);
  const coins = wallet(S, T);
  const timer = usePomodoro(S, update, T);
  const refund = S.tree && S.tree.refund && !S.tree.refundSeen ? S.tree.refund : 0;
  const pct = (x) => Math.round(100 * x) + ' %';

  return (
    <Grid wide={wide}>
      <Card hero style={{ padding: 14 }}>
        <Row style={{ justifyContent: 'space-between', marginBottom: 10, paddingHorizontal: 2 }}>
          <Text style={{ color: C.acc, fontSize: 11, fontWeight: '700', letterSpacing: 1.2 }}>{STAGES[gr.st].n.toUpperCase()}</Text>
          <CoinPill n={coins} bg={C.chip} textColor={C.tx} />
        </Row>
        <Library shelves={shelves} g={gr.g} health={health} setup={setup} />
        <Mu style={{ marginTop: 12, lineHeight: 19, paddingHorizontal: 2 }}>{stateText(health, fill, S.h.length > 0, gr.n)}</Mu>

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
          <Stat label="Santé" value={pct(health)} sub="sur 7 jours" />
          <Stat label="Bibliothèque" value={pct(fill)} sub={'sur ' + WINDOW + ' jours'} />
          <Stat label="Briques" value={String(gr.n)} sub="habitudes faites" />
        </View>

        <View style={{ marginTop: 14 }}>
          <Row style={{ justifyContent: 'space-between' }}>
            <Text style={{ color: C.tx, fontWeight: '600', fontSize: 13 }}>{gr.max ? 'Dernière étape atteinte' : 'Vers « ' + STAGES[gr.st + 1].n + ' »'}</Text>
            <Text style={{ color: C.mu, fontSize: 13, fontVariant: ['tabular-nums'] }}>{gr.max ? gr.n + ' briques' : 'encore ' + gr.left}</Text>
          </Row>
          <View style={{ height: 6, borderRadius: 3, backgroundColor: C.track, marginTop: 6, overflow: 'hidden' }}>
            <View style={{ width: Math.round(100 * gr.frac) + '%', height: '100%', backgroundColor: C.pri }} />
          </View>
        </View>
      </Card>

      {refund ? (
        <Card>
          <H>Le compagnon laisse sa place</H>
          <Mu style={{ lineHeight: 19 }}>Les {refund} pièces dépensées pour l’ancien compagnon te sont rendues. Elles t’attendent dans la boutique.</Mu>
          <Pressable onPress={() => update((s) => { s.tree.refundSeen = 1; })} accessibilityRole="button" style={{ marginTop: 10, alignSelf: 'flex-start' }}>
            <Text style={{ color: C.pri, fontWeight: '700' }}>Compris</Text>
          </Pressable>
        </Card>
      ) : null}

      <Card>
        <Row style={{ justifyContent: 'space-between' }}>
          <H style={{ marginBottom: 0 }}>Les étagères</H>
          <Mu style={{ fontSize: 12 }}>{WINDOW} derniers jours</Mu>
        </Row>
        <Mu style={{ marginTop: 4 }}>Une étagère par habitude. Chaque fois que tu la fais, un livre s’y range ; quand tu la délaisses, il repart.</Mu>
        {shelves.length ? shelves.map((s) => (
          <View key={s.id} style={{ marginTop: 12 }}>
            <Row style={{ justifyContent: 'space-between' }}>
              <Row style={{ flex: 1, gap: 10 }}>
                <View style={{ width: 6, height: 18, borderRadius: 1.5, backgroundColor: bookColor(setup, s.i) }} />
                <Text style={{ color: C.tx, flex: 1 }} numberOfLines={1}>{s.name}</Text>
              </Row>
              <Text style={{ color: C.mu, fontSize: 13, fontVariant: ['tabular-nums'] }}>{Math.min(s.done, s.want)} / {s.want}</Text>
            </Row>
            <View style={{ height: 4, borderRadius: 2, backgroundColor: C.track, marginTop: 6, marginLeft: 16, overflow: 'hidden' }}>
              <View style={{ width: Math.round(100 * s.fill) + '%', height: '100%', backgroundColor: C.pri }} />
            </View>
          </View>
        )) : (
          <Pressable onPress={() => openAdd && openAdd('habit')} style={{ marginTop: 10 }}>
            <Text style={{ color: C.pri, fontWeight: '700' }}>Ajouter une habitude</Text>
          </Pressable>
        )}
        {S.h.length > MAX_SHELVES ? <Mu style={{ fontSize: 12, marginTop: 10 }}>La bibliothèque montre tes {MAX_SHELVES} premières habitudes.</Mu> : null}
      </Card>

      <Shop S={S} update={update} T={T} g={gr.g} health={health} shelves={shelves} />

      <PomodoroCard S={S} update={update} T={T} timer={timer} />

      <Card>
        <H>Comment ça marche</H>
        <Mu style={{ lineHeight: 20 }}>
          Chaque habitude cochée est une petite brique : le bonsaï grandit avec leur total et ne rapetisse jamais.{'\n'}
          Étapes : {STAGES.map((s) => s.n.toLowerCase()).join(', ')}.{'\n'}
          Sa santé suit tes 7 derniers jours : régulier, le feuillage est dense et vert ; délaissé, il s’éclaircit et perd quelques feuilles.{'\n'}
          Les étagères se remplissent selon la fréquence voulue de chaque habitude, sur {WINDOW} jours. Les jours off ne comptent pas.
        </Mu>
        <H style={{ marginTop: 14 }}>Les pièces</H>
        <Mu style={{ lineHeight: 20 }}>
          Chaque habitude cochée rapporte {GAIN.h} pièces, et {GAIN.all} de plus si tu fais toutes tes habitudes du jour. Une tâche faite : {GAIN.t}. Un rendez-vous ou un cours passé : {GAIN.ev}. Une séance de salle : {GAIN.w}.{'\n'}
          Décocher retire les pièces du jour ; les jours passés restent acquis.
        </Mu>
      </Card>
    </Grid>
  );
}

function Stat({ label, value, sub }) {
  return (
    <View style={{ flex: 1, padding: 10, borderRadius: 14, backgroundColor: C.chip, borderWidth: 1, borderColor: C.line }}>
      <Text style={{ color: C.mu, fontSize: 11, fontWeight: '600', letterSpacing: 0.4 }}>{label}</Text>
      <Text style={{ fontFamily: C.serif, color: C.tx, fontSize: 22, fontWeight: '700', marginTop: 2, fontVariant: ['tabular-nums'] }}>{value}</Text>
      <Text style={{ color: C.mu, fontSize: 11 }} numberOfLines={1}>{sub}</Text>
    </View>
  );
}
