// Le module Salle : choisir un programme, faire la séance, puis sortir.
// En sortant, la carte Salle de l'écran Aujourd'hui est validée et la séance est enregistrée.
import React, { useEffect, useRef, useState } from 'react';
import { Modal, Platform, Pressable, ScrollView, Switch, Text, TextInput, Vibration, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { C } from '../theme';
import { cap, fmt, hm } from '../dates';
import { finishRun, gymCheckIn, gymCheckOut, startRun } from '../store';
import { Btn, Card, Mu, Row } from '../components/ui';
import { CheckIcon } from '../components/icons';
import Svg, { Path, Circle } from 'react-native-svg';
import Figure, { isBack, sessionMuscles } from './Figure';
import { LEVELS } from './programs';

const mmss = (s) => { s = Math.max(0, Math.ceil(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
const setsOf = (plan) => { const m = String(plan).match(/^(\d+)\s*(?:×|tours)/); return m ? +m[1] : 0; };

// Dernière séance où cet exercice a été fait, pour afficher la charge de la fois d'avant.
function lastTime(S, name) {
  for (let i = S.ws.length - 1; i >= 0; i--) {
    const x = S.ws[i].ex.find((e) => e.n === name && e.done);
    if (x) return x;
  }
  return null;
}

export default function GymModule({ visible, onClose, S, update, T }) {
  const insets = useSafeAreaInsets();
  const run = S.run && S.run.k === T ? S.run : null;
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: C.bg, paddingTop: insets.top }}>
        {run ? <Run S={S} update={update} T={T} run={run} onClose={onClose} insets={insets} />
          : <Home S={S} update={update} T={T} onClose={onClose} insets={insets} />}
      </View>
    </Modal>
  );
}

function TopBar({ label, onPress, center }) {
  return (
    <Row style={{ paddingHorizontal: 12, paddingVertical: 8 }}>
      <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} hitSlop={8}
        style={{ paddingVertical: 6, paddingHorizontal: 10, borderRadius: 999, backgroundColor: C.card, borderWidth: 1, borderColor: C.line }}>
        <Text style={{ color: C.tx, fontWeight: '600' }}>‹ {label}</Text>
      </Pressable>
      <View style={{ flex: 1, alignItems: 'center' }}>{center}</View>
      <View style={{ width: 80 }} />
    </Row>
  );
}

const Bars = ({ n, color }) => (
  <Row style={{ gap: 3, alignItems: 'flex-end', height: 16 }}>
    {[7, 11, 16].map((h, i) => <View key={i} style={{ width: 4, height: h, borderRadius: 2, backgroundColor: color, opacity: i < n ? 1 : 0.25 }} />)}
  </Row>
);

const WalkIcon = ({ mob }) => (
  <Svg width={28} height={28} viewBox="0 0 48 48" fill="none" stroke={C.acc} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    {mob ? (<><Path d="M35 15A13 13 0 1 0 37 28" /><Path d="M36 7v9h-9" /></>)
      : (<><Path d="M6 38L42 20" /><Circle cx="25" cy="17" r="3.5" /><Path d="M25 21v6l-5 5M25 27l5 3" /></>)}
  </Svg>
);

function Thumb({ x }) {
  return (
    <View style={{ width: 46, height: 56, borderRadius: 14, backgroundColor: C.card2, alignItems: 'center', justifyContent: 'center' }}>
      {x.muscles.length ? <Figure view={isBack(x.muscles[0]) ? 'b' : 'f'} muscles={x.muscles} size={50} />
        : <WalkIcon mob={x.name.indexOf('Mobilité') === 0} />}
    </View>
  );
}

// ---------- Accueil : choix du niveau d'énergie et de la séance ----------
function Home({ S, update, T, onClose, insets }) {
  const pick = S.gymPick || { l: 0, s: 0 };
  const [l, setL] = useState(Math.min(pick.l, LEVELS.length - 1));
  const lv = LEVELS[l];
  const [si, setSi] = useState(Math.min(pick.s, lv.sessions.length - 1));
  const se = lv.sessions[si] || lv.sessions[0];
  const mus = sessionMuscles(se);
  const doneToday = S.ws.filter((w) => w.d === T);
  const choose = (nl, ns) => { setL(nl); setSi(ns); update((s) => (s.gymPick = { l: nl, s: ns })); };
  const start = () => update((s) => { s.gymPick = { l, s: si }; startRun(s, T, l, si, hm(new Date())); });
  const quick = () => {
    const t = hm(new Date());
    update((s) => { if (!s.gym[T]) gymCheckIn(s, T, t); gymCheckOut(s, T, t); });
    onClose();
  };

  return (
    <>
      <TopBar label="Retour" onPress={onClose} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 + insets.bottom, gap: 14, width: '100%', maxWidth: 560, alignSelf: 'center' }}>
        <View>
          <Text style={{ color: C.tx, fontSize: 32, fontWeight: '700', letterSpacing: -0.8 }}>Salle</Text>
          <Mu>Choisis ta séance selon ton énergie du jour.</Mu>
        </View>
        {doneToday.length ? (
          <Card style={{ borderColor: C.accLine }}>
            <Row style={{ gap: 8 }}>
              <CheckIcon size={18} color={C.acc} />
              <Text style={{ color: C.tx, fontWeight: '600', flex: 1 }}>Déjà fait aujourd’hui : {doneToday.map((w) => w.name).join(', ')}</Text>
            </Row>
          </Card>
        ) : null}

        <Text style={{ color: C.tx, fontSize: 18, fontWeight: '700' }}>Niveau d’énergie</Text>
        <Row style={{ gap: 10 }}>
          {LEVELS.map((a, i) => {
            const on = i === l;
            return (
              <Pressable key={i} onPress={() => choose(i, 0)} accessibilityRole="tab" accessibilityState={{ selected: on }}
                style={{ flex: 1, alignItems: 'center', gap: 4, paddingVertical: 14, borderRadius: 20, backgroundColor: on ? C.pri : C.card, borderWidth: 1, borderColor: on ? C.pri : C.line }}>
                <Bars n={a.energy} color={on ? C.onPri : C.tx} />
                <Text style={{ color: on ? C.onPri : C.tx, fontWeight: '600' }}>{a.name}</Text>
                <Text style={{ color: on ? 'rgba(255,255,255,0.75)' : C.mu, fontSize: 12 }}>{a.duration}</Text>
              </Pressable>
            );
          })}
        </Row>

        <View style={{ borderRadius: 28, overflow: 'hidden' }}>
          <LinearGradient colors={[C.lav1, C.lav2, '#F7F6FD']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ padding: 18 }}>
            <Row style={{ justifyContent: 'space-between' }}>
              <Text style={{ color: C.acc, fontSize: 11, fontWeight: '700', letterSpacing: 1 }}>SÉANCE DU JOUR</Text>
              <View style={{ paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.6)' }}>
                <Text style={{ color: C.tx, fontSize: 12, fontWeight: '600' }}>{lv.full}</Text>
              </View>
            </Row>
            <Row style={{ alignItems: 'center', marginTop: 6 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: C.tx, fontSize: 27, fontWeight: '700', letterSpacing: -0.5 }}>{se.name}</Text>
                <Text style={{ color: C.mu, fontSize: 13, marginTop: 6 }}>{lv.tip}</Text>
              </View>
              <Row style={{ gap: 0 }}>
                <Figure view="f" muscles={mus} size={88} />
                <Figure view="b" muscles={mus} size={88} />
              </Row>
            </Row>
            <Row style={{ marginTop: 10 }}>
              <Chip text={lv.duration} />
              <Chip text={se.exercises.length + ' ' + lv.unit} />
            </Row>
            <Row style={{ marginTop: 14 }}>
              <Btn label="Commencer la séance" active onPress={start} style={{ flex: 1, paddingVertical: 12 }} />
              {lv.sessions.length > 1 ? <Btn label="Suivante ›" onPress={() => choose(l, (si + 1) % lv.sessions.length)} style={{ paddingVertical: 12 }} /> : null}
            </Row>
          </LinearGradient>
        </View>

        <Row style={{ justifyContent: 'space-between' }}>
          <Text style={{ color: C.tx, fontSize: 18, fontWeight: '700' }}>Séances</Text>
          <Mu>{lv.sessions.length} séance{lv.sessions.length > 1 ? 's' : ''}</Mu>
        </Row>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingRight: 16 }}>
          {lv.sessions.map((a, i) => {
            const on = i === si;
            const m = sessionMuscles(a);
            return (
              <Pressable key={i} onPress={() => choose(l, i)} accessibilityRole="button" accessibilityState={{ selected: on }}
                style={{ width: 150, padding: 10, borderRadius: 22, backgroundColor: C.card, borderWidth: on ? 2 : 1, borderColor: on ? C.pri : C.line }}>
                <Row style={{ justifyContent: 'center', gap: 0, backgroundColor: C.card2, borderRadius: 14, paddingVertical: 6, marginBottom: 8 }}>
                  <Figure view="f" muscles={m} size={56} />
                  <Figure view="b" muscles={m} size={56} />
                </Row>
                <Text style={{ color: C.tx, fontWeight: '600' }}>{a.name}</Text>
                <Mu style={{ fontSize: 12 }}>{a.exercises.length} {lv.unit}</Mu>
              </Pressable>
            );
          })}
        </ScrollView>

        <Text style={{ color: C.tx, fontSize: 18, fontWeight: '700' }}>Exercices</Text>
        <Card style={{ paddingVertical: 4 }}>
          {se.exercises.map((x, i) => (
            <Row key={i} style={{ paddingVertical: 10, gap: 12, borderBottomWidth: i < se.exercises.length - 1 ? 1 : 0, borderBottomColor: C.line }}>
              <Thumb x={x} />
              <View style={{ flex: 1 }}>
                <Text style={{ color: C.tx, fontWeight: '600' }}>{x.name}</Text>
                <Mu style={{ fontSize: 12 }}>{x.plan}</Mu>
              </View>
            </Row>
          ))}
        </Card>

        <Btn label="Valider la salle sans programme" ghost onPress={quick} />
        <History S={S} />
        <Mu style={{ lineHeight: 19 }}>Règle : pas deux pleines énergies sur le même groupe de muscles à moins de 48 h. Si tu hésites, commence par la version moyenne.</Mu>
      </ScrollView>
    </>
  );
}

const Chip = ({ text }) => (
  <View style={{ paddingVertical: 5, paddingHorizontal: 11, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.6)' }}>
    <Text style={{ color: C.tx, fontSize: 12, fontWeight: '600' }}>{text}</Text>
  </View>
);

export function History({ S, max = 5, title = 'Dernières séances' }) {
  const list = S.ws.slice(-max).reverse();
  return (
    <Card>
      <Text style={{ color: C.tx, fontSize: 16, fontWeight: '700' }}>{title}</Text>
      {list.length ? list.map((w) => (
        <Row key={w.id} style={{ paddingVertical: 9, borderTopWidth: 1, borderTopColor: C.line, marginTop: 6, alignItems: 'flex-start' }}>
          <View style={{ width: 70 }}>
            <Text style={{ color: C.tx, fontWeight: '600' }}>{cap(fmt(w.d, { weekday: 'short', day: 'numeric' }))}</Text>
            <Mu style={{ fontSize: 12 }}>{w.mins} min</Mu>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: C.tx }}>{w.name}</Text>
            <Mu style={{ fontSize: 12 }}>{w.level} · {w.done}/{w.total} exercices{w.start ? ' · ' + w.start + '–' + w.end : ''}</Mu>
          </View>
        </Row>
      )) : <Mu style={{ marginTop: 6 }}>Aucune séance enregistrée pour l’instant.</Mu>}
    </Card>
  );
}

// ---------- Séance en cours ----------
function Run({ S, update, T, run, onClose, insets }) {
  const lv = LEVELS[run.l] || LEVELS[0];
  const se = lv.sessions[run.s] || lv.sessions[0];
  const [open, setOpen] = useState(null);
  const [ask, setAsk] = useState(false);
  const [now, setNow] = useState(Date.now());
  const timer = useRestTimer();

  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  useEffect(() => {
    // Garde l'écran allumé pendant la séance (si l'appareil le permet).
    let on = false, gone = false;
    activateKeepAwakeAsync('salle').then(() => { on = true; if (gone) deactivateKeepAwake('salle').catch(() => {}); }).catch(() => {});
    return () => { gone = true; if (on) Promise.resolve(deactivateKeepAwake('salle')).catch(() => {}); };
  }, []);

  const total = se.exercises.length;
  const done = se.exercises.filter((_, i) => run.done[i]).length;
  const auto = !!S.gymAuto;

  const toggle = (i) => {
    const on = !run.done[i];
    update((s) => { s.run.done[i] = on; if (on && !s.run.sets[i]) s.run.sets[i] = setsOf(se.exercises[i].plan); });
    if (on && auto && se.exercises[i].rest) timer.start(se.exercises[i].rest);
  };
  const setSets = (i, n) => update((s) => {
    const max = setsOf(se.exercises[i].plan) || 10;
    const v = Math.max(0, Math.min(max, n));
    s.run.sets[i] = v;
    s.run.done[i] = v >= max && max > 0 ? true : s.run.done[i];
  });
  const finish = () => {
    if (!done && !ask) return setAsk(true);
    timer.stop();
    update((s) => finishRun(s, hm(new Date()), lv, se));
    onClose();
  };

  return (
    <>
      <TopBar label="Sortir" onPress={finish}
        center={<Text style={{ color: C.tx, fontSize: 17, fontWeight: '700', fontVariant: ['tabular-nums'] }}>{mmss((now - run.ts) / 1000)}</Text>} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 230 + insets.bottom, gap: 14, width: '100%', maxWidth: 560, alignSelf: 'center' }}
        keyboardShouldPersistTaps="handled">
        <View>
          <Text style={{ color: C.acc, fontSize: 11, fontWeight: '700', letterSpacing: 1 }}>SÉANCE EN COURS · DEPUIS {run.start}</Text>
          <Text style={{ color: C.tx, fontSize: 30, fontWeight: '700', letterSpacing: -0.6, marginTop: 4 }}>{se.name}</Text>
          <Mu>{lv.full} · {done}/{total} {lv.unit}</Mu>
          <View style={{ height: 6, borderRadius: 3, backgroundColor: C.track, marginTop: 10, overflow: 'hidden' }}>
            <View style={{ width: Math.round((100 * done) / total) + '%', height: '100%', backgroundColor: C.pri }} />
          </View>
        </View>

        {ask ? (
          <Card style={{ borderColor: C.red }}>
            <Text style={{ color: C.tx, fontWeight: '600' }}>Aucun exercice coché.</Text>
            <Mu style={{ marginTop: 4 }}>Si tu sors maintenant, la séance n’est pas enregistrée et la salle n’est pas validée.</Mu>
            <Row style={{ marginTop: 12 }}>
              <Btn label="Continuer la séance" onPress={() => setAsk(false)} style={{ flex: 1 }} />
              <Btn label="Sortir quand même" ghost onPress={finish} style={{ flex: 1 }} />
            </Row>
          </Card>
        ) : null}

        <Card style={{ paddingVertical: 4 }}>
          {se.exercises.map((x, i) => {
            const on = !!run.done[i];
            const n = setsOf(x.plan);
            const prev = lastTime(S, x.name);
            const isOpen = open === i;
            return (
              <View key={i} style={{ borderBottomWidth: i < total - 1 ? 1 : 0, borderBottomColor: C.line, paddingVertical: 10 }}>
                <Row style={{ gap: 11 }}>
                  <Pressable onPress={() => toggle(i)} hitSlop={6} accessibilityRole="checkbox" accessibilityState={{ checked: on }} accessibilityLabel={x.name}
                    style={{ width: 28, height: 28, borderRadius: 14, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', borderColor: on ? C.pri : C.ring, backgroundColor: on ? C.pri : 'transparent' }}>
                    {on ? <CheckIcon size={16} color={C.onPri} width={3} /> : null}
                  </Pressable>
                  <View style={{ opacity: on ? 0.45 : 1 }}><Thumb x={x} /></View>
                  <Pressable style={{ flex: 1 }} onPress={() => setOpen(isOpen ? null : i)} accessibilityRole="button" accessibilityLabel={'Détails de ' + x.name}>
                    <Text style={{ color: on ? C.mu : C.tx, fontWeight: '600', textDecorationLine: on ? 'line-through' : 'none' }}>{x.name}</Text>
                    <Mu style={{ fontSize: 12 }}>{x.plan}</Mu>
                    {prev && (prev.kg || prev.sets) ? <Text style={{ color: C.acc, fontSize: 12, marginTop: 2 }}>Dernière fois : {[prev.sets ? prev.sets + ' séries' : '', prev.kg ? prev.kg + ' kg' : ''].filter(Boolean).join(' · ')}</Text> : null}
                  </Pressable>
                  {x.rest ? (
                    <Pressable onPress={() => timer.start(x.rest)} accessibilityRole="button" accessibilityLabel={'Lancer le repos de ' + mmss(x.rest)}
                      style={{ paddingVertical: 7, paddingHorizontal: 10, borderRadius: 999, backgroundColor: C.card2, borderWidth: 1, borderColor: C.line }}>
                      <Text style={{ color: C.tx, fontSize: 13, fontVariant: ['tabular-nums'] }}>{mmss(x.rest)}</Text>
                    </Pressable>
                  ) : null}
                </Row>
                {isOpen ? (
                  <Row style={{ marginTop: 10, marginLeft: 39, gap: 14, flexWrap: 'wrap' }}>
                    {n ? (
                      <Row style={{ gap: 6 }}>
                        <Mu>Séries</Mu>
                        <Btn label="−" onPress={() => setSets(i, (run.sets[i] || 0) - 1)} style={{ paddingVertical: 4, paddingHorizontal: 12 }} />
                        <Text style={{ color: C.tx, fontWeight: '700', minWidth: 34, textAlign: 'center' }}>{run.sets[i] || 0}/{n}</Text>
                        <Btn label="+" onPress={() => setSets(i, (run.sets[i] || 0) + 1)} style={{ paddingVertical: 4, paddingHorizontal: 12 }} />
                      </Row>
                    ) : null}
                    {x.muscles.length ? (
                      <Row style={{ gap: 6 }}>
                        <Mu>Charge</Mu>
                        <TextInput
                          value={String(run.kg[i] || '')}
                          onChangeText={(v) => update((s) => (s.run.kg[i] = v.replace(/[^0-9.,]/g, '').slice(0, 5)))}
                          keyboardType="decimal-pad"
                          placeholder={prev && prev.kg ? String(prev.kg) : '0'}
                          placeholderTextColor={C.mu}
                          style={{ width: 64, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10, borderWidth: 1, borderColor: C.line, backgroundColor: C.field, color: C.tx, fontSize: 15 }}
                        />
                        <Mu>kg</Mu>
                      </Row>
                    ) : null}
                  </Row>
                ) : null}
              </View>
            );
          })}
        </Card>
        <Mu style={{ fontSize: 12 }}>Touche le nom d’un exercice pour noter tes séries et ta charge.</Mu>

        <Row>
          <Switch value={auto} onValueChange={(v) => update((s) => (s.gymAuto = v))} trackColor={{ false: C.line, true: C.accLine }}
            thumbColor={auto ? C.pri : '#FFFFFF'} activeThumbColor={C.pri} />
          <Mu style={{ flex: 1 }}>Lancer le repos en cochant un exercice</Mu>
        </Row>
        <Btn label="Terminer la séance" active onPress={finish} style={{ paddingVertical: 14 }} />
      </ScrollView>
      <RestBar timer={timer} insets={insets} />
    </>
  );
}

// ---------- Minuteur de repos ----------
function useRestTimer() {
  const [st, setSt] = useState({ end: 0, total: 0, fin: false });
  const [, force] = useState(0);
  const ctx = useRef(null);
  useEffect(() => {
    if (!st.end) return;
    const t = setInterval(() => {
      if (Date.now() >= st.end) { setSt({ end: 0, total: st.total, fin: true }); beep(ctx.current); }
      else force((n) => n + 1);
    }, 250);
    return () => clearInterval(t);
  }, [st.end]);
  const start = (sec) => {
    if (Platform.OS === 'web') {
      try { const A = window.AudioContext || window.webkitAudioContext; ctx.current = ctx.current || (A ? new A() : null); if (ctx.current && ctx.current.resume) ctx.current.resume(); } catch (e) {}
    }
    setSt({ end: Date.now() + sec * 1000, total: sec, fin: false });
  };
  const add = (sec) => setSt((p) => {
    if (!p.end) return p;
    const end = p.end + sec * 1000;
    // Correction : le temps restant ne peut plus devenir négatif.
    if (end <= Date.now()) return { end: 0, total: p.total, fin: true };
    return { end, total: Math.max(1, p.total + sec), fin: false };
  });
  const stop = () => setSt({ end: 0, total: 0, fin: false });
  return { ...st, start, add, stop };
}

function beep(ctx) {
  try { Vibration.vibrate([0, 200, 100, 200]); } catch (e) {}
  try {
    if (!ctx) return;
    [0, 0.3, 0.6].forEach((d) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.value = 880; g.gain.value = 0.25; o.connect(g); g.connect(ctx.destination);
      o.start(ctx.currentTime + d); o.stop(ctx.currentTime + d + 0.18);
    });
  } catch (e) {}
}

function RestBar({ timer, insets }) {
  const left = timer.end ? (timer.end - Date.now()) / 1000 : 0;
  const pct = timer.end ? Math.min(100, Math.max(0, Math.round(100 * (1 - left / timer.total)))) : timer.fin ? 100 : 0;
  return (
    <View style={{ position: 'absolute', left: 12, right: 12, bottom: insets.bottom + 12, alignItems: 'center' }} pointerEvents="box-none">
      <View style={{
        width: '100%', maxWidth: 536, borderRadius: 26, padding: 14, backgroundColor: 'rgba(22,22,28,0.95)',
        shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 18, shadowOffset: { width: 0, height: 8 },
      }}>
        <View style={{ height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.15)', overflow: 'hidden', marginBottom: 8 }}>
          <View style={{ width: pct + '%', height: '100%', backgroundColor: C.lav1 }} />
        </View>
        <Row>
          <Text style={{ flex: 1, color: timer.fin ? C.lav1 : '#FFFFFF', fontSize: 34, fontWeight: '300', fontVariant: ['tabular-nums'] }}>
            {timer.end ? mmss(left) : timer.fin ? 'Go !' : 'Repos'}
          </Text>
          <DarkBtn label="−15 s" onPress={() => timer.add(-15)} />
          <DarkBtn label="+15 s" onPress={() => timer.add(15)} />
          <DarkBtn label="Stop" onPress={timer.stop} />
        </Row>
        <Row style={{ marginTop: 10, gap: 6 }}>
          {[45, 60, 90, 120, 180].map((s) => <DarkBtn key={s} label={mmss(s)} onPress={() => timer.start(s)} style={{ flex: 1 }} />)}
        </Row>
      </View>
    </View>
  );
}

const DarkBtn = ({ label, onPress, style }) => (
  <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label}
    style={({ pressed }) => [{ paddingVertical: 8, paddingHorizontal: 11, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', opacity: pressed ? 0.7 : 1 }, style]}>
    <Text style={{ color: '#FFFFFF', fontSize: 13, fontVariant: ['tabular-nums'] }}>{label}</Text>
  </Pressable>
);
