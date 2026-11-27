// Écran "Calendrier" : vue du mois, le détail du jour choisi, puis les progrès et l'analyse générale.
import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { C, accA, typeColor } from '../theme';
import { cap, LETTERS, toDate } from '../dates';
import { pc } from '../stats';
import { Btn, Card, Grid, Icon, Mu, Row, H } from '../components/ui';
import DayPanel from '../components/DayPanel';
import Progress from './Progress';

const pad = (n) => String(n).padStart(2, '0');

export default function Calendar(p) {
  const { S, T, cd, setCd, wide } = p;
  const [cm, setCm] = useState(cd.slice(0, 7));
  const [Y, M] = cm.split('-').map(Number);
  const first = new Date(Y, M - 1, 1);
  const n = new Date(Y, M, 0).getDate();
  const lead = (first.getDay() + 6) % 7;
  const shift = (d) => {
    const x = new Date(Y, M - 1 + d, 1);
    setCm(x.getFullYear() + '-' + pad(x.getMonth() + 1));
  };
  const goToday = () => { setCm(T.slice(0, 7)); setCd(T); };

  const cells = [];
  for (let i = 0; i < lead; i++) cells.push(null);
  for (let d = 1; d <= n; d++) cells.push(cm + '-' + pad(d));

  return (
    <>
    <Grid wide={wide}>
      <Card>
        <Row style={{ justifyContent: 'space-between' }}>
          <Icon label="‹" onPress={() => shift(-1)} a11y="Mois précédent" />
          <H style={{ marginBottom: 0 }}>{cap(first.toLocaleDateString('fr-BE', { month: 'long', year: 'numeric' }))}</H>
          <Icon label="›" onPress={() => shift(1)} a11y="Mois suivant" />
        </Row>
        <Row style={{ marginTop: 10 }}>
          <Btn label="−1 an" ghost onPress={() => shift(-12)} style={{ flex: 1 }} />
          <Btn label="Aujourd’hui" onPress={goToday} style={{ flex: 1 }} />
          <Btn label="+1 an" ghost onPress={() => shift(12)} style={{ flex: 1 }} />
        </Row>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 12 }}>
          {LETTERS.map((l, i) => (
            <Text key={'l' + i} style={{ width: '14.2857%', textAlign: 'center', color: C.mu, fontSize: 11, marginBottom: 6 }}>{l}</Text>
          ))}
          {cells.map((k, i) =>
            k ? <DayCell key={k} S={S} k={k} T={T} sel={k === cd} onPress={() => setCd(k === cd ? T : k)} /> : <View key={'e' + i} style={{ width: '14.2857%' }} />
          )}
        </View>
        <Mu style={{ marginTop: 10, fontSize: 12 }}>Plus la case est colorée, plus tu as validé d’habitudes. Le chiffre est ton humeur, les points tes événements. Touche un autre jour pour voir son détail.</Mu>
      </Card>
      {cd !== T ? <DayPanel {...p} k={cd} onBack={() => setCd(T)} /> : null}
    </Grid>
    {/* Progrès et analyse générale, sous le calendrier. */}
    <Text style={{ fontFamily: C.serif, color: C.tx, fontSize: 24, fontWeight: '700', marginTop: 10 }}>Progrès et analyse</Text>
    <Progress {...p} />
    </>
  );
}

function DayCell({ S, k, T, sel, onPress }) {
  const m = S.m[k] || 0;
  const types = (S.ev[k] || []).map((e) => e.ty || 'au');
  if (S.x.some((x) => x.d === k)) types.push('ex');
  const dots = [...new Set(types)].slice(0, 3);
  return (
    <View style={{ width: '14.2857%', padding: 2 }}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={toDate(k).toLocaleDateString('fr-BE', { weekday: 'long', day: 'numeric', month: 'long' })}
        style={{
          aspectRatio: 1,
          borderRadius: 10,
          padding: 4,
          backgroundColor: accA(pc(S, k) * 0.45),
          borderWidth: 1,
          borderColor: sel ? C.pri : 'transparent',
          justifyContent: 'space-between',
        }}
      >
        <Text style={{ fontSize: 11, color: k === T ? C.pri : C.tx, fontWeight: k === T ? '800' : '400' }}>{+k.slice(8)}</Text>
        <Text style={{ fontSize: 11, color: C.tx, textAlign: 'center' }}>{m ? String(m) : S.off[k] ? 'off' : ''}</Text>
        <Row style={{ gap: 2, justifyContent: 'center', minHeight: 5 }}>
          {dots.map((t) => <View key={t} style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: typeColor(t) }} />)}
        </Row>
      </Pressable>
    </View>
  );
}
