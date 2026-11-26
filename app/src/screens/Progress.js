// Écran "Progrès" : séries, régularité, humeur et sauvegarde.
import React, { useState } from 'react';
import { View, Text, Platform } from 'react-native';
import Svg, { Line, Path, Circle, Text as SvgText } from 'react-native-svg';
import * as Clipboard from 'expo-clipboard';
import { C, accA } from '../theme';
import { addDays, mondayOf } from '../dates';
import { best, habitRate, has, moodLinks, nh, pc, rate, streak, weekBest, weekStreak } from '../stats';
import { parseBackup } from '../store';
import { Bar, Btn, Card, Field, Grid, H, Mu, Row } from '../components/ui';

export default function Progress({ S, T, replace, wide }) {
  const any = (k) => nh(S, k) > 0;
  const pcf = (k) => pc(S, k);
  return (
    <>
      <Card hero>
        <H>Progression</H>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
          <Kpi n={streak(S, T, any)} l="jours en série" />
          <Kpi n={best(S, T, any)} l="record" />
          <Kpi n={rate(S, T, pcf, 7) + '%'} l="7 jours" />
          <Kpi n={rate(S, T, pcf, 30) + '%'} l="30 jours" />
        </View>
      </Card>
      <Grid wide={wide}>
        <Habits S={S} T={T} />
        <Heat S={S} T={T} />
        <Mood S={S} T={T} />
        <Links S={S} />
        <Backup S={S} replace={replace} />
      </Grid>
    </>
  );
}

const Kpi = ({ n, l }) => (
  <View style={{ width: '25%', minWidth: 70, alignItems: 'center', paddingVertical: 6 }}>
    <Text style={{ color: C.pri, fontSize: 26, fontWeight: '700' }}>{n}</Text>
    <Text style={{ color: C.mu, fontSize: 11, textAlign: 'center' }}>{l}</Text>
  </View>
);

function Habits({ S, T }) {
  return (
    <Card>
      <H>Habitudes · série en cours</H>
      <Mu>Un jour raté est toléré, deux d’affilée cassent la série. Les jours off ne comptent pas.</Mu>
      {S.h.map((h) => {
        const w = h.w || 7, weekly = w < 7, f = (k) => has(S, k, h.id);
        const r = habitRate(S, T, h);
        return (
          <View key={h.id} style={{ marginTop: 14 }}>
            <Row style={{ justifyContent: 'space-between' }}>
              <Text style={{ color: C.tx, flex: 1 }}>{h.n}{weekly ? ' · ' + w + '×/sem.' : ''}</Text>
              <Text style={{ color: C.pri, fontWeight: '700' }}>
                {weekly ? weekStreak(S, T, h.id, w) + ' sem.' : streak(S, T, f) + ' j'}
              </Text>
            </Row>
            <Mu style={{ fontSize: 12 }}>record {weekly ? weekBest(S, T, h.id, w) : best(S, T, f)} · {r}% sur 30 jours</Mu>
            <Bar pct={r} style={{ marginTop: 6 }} />
          </View>
        );
      })}
    </Card>
  );
}

function Heat({ S, T }) {
  const start = addDays(mondayOf(T), -77);
  const weeks = [...Array(12)].map((_, w) => [...Array(7)].map((_, d) => addDays(start, w * 7 + d)));
  return (
    <Card>
      <H>Régularité · 12 semaines</H>
      <Row style={{ gap: 3, marginTop: 8, alignItems: 'flex-start' }}>
        {weeks.map((col, i) => (
          <View key={i} style={{ flex: 1, gap: 3 }}>
            {col.map((k) => (
              <View
                key={k}
                style={{
                  aspectRatio: 1,
                  borderRadius: 4,
                  backgroundColor: k > T ? C.track : S.off[k] ? 'transparent' : accA(0.08 + 0.85 * pc(S, k)),
                  borderWidth: S.off[k] && k <= T ? 1 : 0,
                  borderStyle: 'dashed',
                  borderColor: C.ring,
                }}
              />
            ))}
          </View>
        ))}
      </Row>
      <Mu style={{ marginTop: 8 }}>Plus la case est dorée, plus tu as validé d’habitudes ce jour-là.</Mu>
    </Card>
  );
}

function Mood({ S, T }) {
  const ms = [...Array(30)].map((_, i) => S.m[addDays(T, -(29 - i))] || 0);
  const X = (i) => 28 + i * (268 / 29), Y = (m) => 12 + (5 - m) * 19;
  let d = '', prev = false;
  ms.forEach((m, i) => { if (m) d += (prev ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(m) + ' '; prev = !!m; });
  const vals = ms.filter(Boolean);
  const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
  return (
    <Card>
      <H>Humeur · 30 jours</H>
      <View style={{ width: '100%', aspectRatio: 3, marginTop: 8 }}>
        <Svg width="100%" height="100%" viewBox="0 0 300 100">
          {[1, 2, 3, 4, 5].map((m) => (
            <React.Fragment key={m}>
              <Line x1="24" x2="300" y1={Y(m)} y2={Y(m)} stroke={C.line} />
              <SvgText x="4" y={Y(m) + 4} fontSize="11" fill={C.mu}>{m}</SvgText>
            </React.Fragment>
          ))}
          {d ? <Path d={d} fill="none" stroke={C.pri} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" /> : null}
          {ms.map((m, i) => (m ? <Circle key={i} cx={X(i)} cy={Y(m)} r="3" fill={C.pri} /> : null))}
        </Svg>
      </View>
      <Mu style={{ marginTop: 8 }}>
        {vals.length ? 'Moyenne ' + avg.toFixed(1).replace('.', ',') + '/5' : 'Aucune humeur enregistrée sur 30 jours.'}
      </Mu>
    </Card>
  );
}

function Links({ S }) {
  const r = moodLinks(S);
  return (
    <Card>
      <H>Humeur et habitudes</H>
      {r.length ? (
        <>
          {r.map((o) => {
            const diff = o.a - o.b;
            return (
              <View key={o.h.id} style={{ marginTop: 10 }}>
                <Row style={{ justifyContent: 'space-between' }}>
                  <Text style={{ color: C.tx }}>{o.h.n}</Text>
                  <Text style={{ color: C.pri, fontWeight: '700' }}>{(diff >= 0 ? '+' : '') + diff.toFixed(1).replace('.', ',')}</Text>
                </Row>
                <Mu style={{ fontSize: 12 }}>{o.a.toFixed(1)} quand c’est fait · {o.b.toFixed(1)} quand ça ne l’est pas</Mu>
              </View>
            );
          })}
          <Mu style={{ marginTop: 10 }}>Humeur moyenne (sur 5) selon que l’habitude est faite ou non. Ce lien n’est pas une preuve de cause.</Mu>
        </>
      ) : (
        <Mu>Il faut au moins 3 jours avec et 3 jours sans chaque habitude, avec une humeur enregistrée.</Mu>
      )}
    </Card>
  );
}

function Backup({ S, replace }) {
  const [txt, setTxt] = useState('');
  const [msg, setMsg] = useState('');
  const exportIt = async () => {
    const j = JSON.stringify(S);
    setTxt(j);
    try { await Clipboard.setStringAsync(j); setMsg('Sauvegarde copiée. Colle-la dans une note ou un mail pour la garder.'); }
    catch (e) { setMsg('Sélectionne et copie le texte ci-dessus.'); }
  };
  const restore = () => {
    try { replace(parseBackup(txt)); setMsg('Sauvegarde restaurée.'); }
    catch (e) { setMsg('Sauvegarde invalide.'); }
  };
  return (
    <Card>
      <H>Sauvegarde</H>
      <Mu>Tes données sont enregistrées sur cet appareil. Génère une copie pour la garder ailleurs. Restaurer remplace les données actuelles.</Mu>
      <Mu style={{ marginTop: 6 }}>Tu peux aussi coller ici une sauvegarde de l’ancienne version de l’app.</Mu>
      <Field value={txt} onChangeText={setTxt} multiline placeholder="Colle ici une sauvegarde pour la restaurer"
        style={{ minHeight: 90, maxHeight: 160, textAlignVertical: 'top', fontSize: 12 }} />
      <Row style={{ marginTop: 10 }}>
        <Btn label="Générer" onPress={exportIt} style={{ flex: 1 }} />
        <Btn label="Restaurer" ghost onPress={restore} style={{ flex: 1 }} />
      </Row>
      {msg ? <Mu style={{ marginTop: 8 }}>{msg}</Mu> : null}
    </Card>
  );
}
