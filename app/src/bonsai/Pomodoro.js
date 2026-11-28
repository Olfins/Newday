// Pomodoro : un temps de travail, puis une pause. La pause propose au hasard
// un café, quelques pas, un en-cas ou un verre d'eau.
// L'état est enregistré dans S.pomo, donc il survit si on ferme l'app.
import React, { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, Text, Vibration, View } from 'react-native';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { C } from '../theme';
import { Btn, Card, H, Mu, Row } from '../components/ui';

export const PRESETS = [
  { w: 25, b: 5, label: '25 / 5' },
  { w: 50, b: 10, label: '50 / 10' },
  { w: 15, b: 3, label: '15 / 3' },
];
export const BREAKS = ['coffee', 'walk', 'snack', 'water'];
export const BREAK_TEXT = {
  coffee: 'Pause : prends un café.',
  walk: 'Pause : marche un peu pour t’aérer.',
  snack: 'Pause : un petit en-cas.',
  water: 'Pause : bois un verre d’eau.',
};

const blank = () => ({ ph: 'idle', end: 0, left: 0, paused: false, w: 25, b: 5, scene: null, days: {} });
export const pomoOf = (S) => ({ ...blank(), ...(S.pomo || {}) });

const randomBreak = (prev) => {
  const pool = BREAKS.filter((b) => b !== prev);
  return pool[Math.floor(Math.random() * pool.length)];
};

// Actions (appelées dans update)
const ensure = (s) => { s.pomo = { ...blank(), ...(s.pomo || {}) }; return s.pomo; };
export function startWork(s, now) {
  const p = ensure(s);
  Object.assign(p, { ph: 'work', end: now + p.w * 60000, left: 0, paused: false });
}
export function startBreak(s, now) {
  const p = ensure(s);
  Object.assign(p, { ph: 'break', end: now + p.b * 60000, left: 0, paused: false, scene: randomBreak(p.scene) });
}
export function stopPomo(s) {
  const p = ensure(s);
  Object.assign(p, { ph: 'idle', end: 0, left: 0, paused: false });
}
export function togglePause(s, now) {
  const p = ensure(s);
  if (p.ph === 'idle') return;
  if (p.paused) Object.assign(p, { paused: false, end: now + p.left, left: 0 });
  else Object.assign(p, { paused: true, left: Math.max(0, p.end - now), end: 0 });
}
export function setPreset(s, w, b) {
  const p = ensure(s);
  p.w = w; p.b = b;
}
// Le temps est fini : travail -> pause (et +1 pomodoro), pause -> fin.
export function advance(s, now, T) {
  const p = ensure(s);
  if (p.ph === 'idle' || p.paused || p.end > now) return;
  if (p.ph === 'work') {
    p.days = p.days || {};
    p.days[T] = (p.days[T] || 0) + 1;
    startBreak(s, now);
  } else stopPomo(s);
}

export const remaining = (p, now) => (p.ph === 'idle' ? p.w * 60000 : p.paused ? p.left : Math.max(0, p.end - now));
export const clock = (ms) => {
  const t = Math.ceil(ms / 1000);
  return String(Math.floor(t / 60)).padStart(2, '0') + ':' + String(t % 60).padStart(2, '0');
};

// Son (web) et vibration à la fin d'une étape.
let audio = null;
function unlockAudio() {
  if (Platform.OS !== 'web') return;
  try { const A = window.AudioContext || window.webkitAudioContext; audio = audio || (A ? new A() : null); if (audio && audio.resume) audio.resume(); } catch (e) {}
}
function ding(high) {
  try { Vibration.vibrate([0, 250, 120, 250]); } catch (e) {}
  try {
    if (!audio) return;
    [0, 0.25].forEach((d, i) => {
      const o = audio.createOscillator(), g = audio.createGain();
      o.frequency.value = high ? 660 + i * 220 : 880 - i * 220; g.gain.value = 0.22; o.connect(g); g.connect(audio.destination);
      o.start(audio.currentTime + d); o.stop(audio.currentTime + d + 0.2);
    });
  } catch (e) {}
}

// Fait avancer le minuteur. Appelle onChange('break'|'done') quand une étape se termine.
export function usePomodoro(S, update, T, onChange) {
  const p = pomoOf(S);
  const [now, setNow] = useState(Date.now());
  const running = p.ph !== 'idle' && !p.paused;
  const cb = useRef(onChange);
  cb.current = onChange;
  const fired = useRef(0);

  useEffect(() => {
    if (!running) return;
    const tick = () => {
      const n = Date.now();
      setNow(n);
      if (p.end && n >= p.end && fired.current !== p.end) {
        fired.current = p.end;
        const next = p.ph === 'work' ? 'break' : 'done';
        update((s) => advance(s, n, T));
        ding(next === 'break');
        if (cb.current) cb.current(next);
      }
    };
    tick();
    const i = setInterval(tick, 500);
    return () => clearInterval(i);
  }, [running, p.end, p.ph]);

  // L'écran reste allumé pendant le minuteur.
  useEffect(() => {
    if (!running) return;
    let on = false, gone = false;
    activateKeepAwakeAsync('pomodoro').then(() => { on = true; if (gone) deactivateKeepAwake('pomodoro').catch(() => {}); }).catch(() => {});
    return () => { gone = true; if (on) Promise.resolve(deactivateKeepAwake('pomodoro')).catch(() => {}); };
  }, [running]);

  return { p, now: running ? now : Date.now(), running };
}

// La carte avec le minuteur et les boutons.
export function PomodoroCard({ S, update, T, timer }) {
  const { p, now } = timer;
  const left = remaining(p, now);
  const total = (p.ph === 'break' ? p.b : p.w) * 60000;
  const pct = p.ph === 'idle' ? 0 : Math.min(100, Math.max(0, Math.round(100 * (1 - left / total))));
  const done = (p.days && p.days[T]) || 0;
  const label = p.ph === 'work' ? 'Au travail' : p.ph === 'break' ? 'Pause' : 'Prêt';
  const sub = p.ph === 'work'
    ? 'Une brique de plus. Reste sur une seule chose.'
    : p.ph === 'break'
      ? BREAK_TEXT[p.scene] || 'Pause.'
      : 'Lance un temps de travail concentré, puis une courte pause.';
  const act = (fn) => { unlockAudio(); update((s) => fn(s, Date.now(), T)); };

  return (
    <Card>
      <Row style={{ justifyContent: 'space-between' }}>
        <H>Pomodoro</H>
        <Mu style={{ fontSize: 12 }}>Aujourd’hui : {done} pomodoro{done > 1 ? 's' : ''}</Mu>
      </Row>
      <View style={{ alignItems: 'center', marginTop: 6 }}>
        <View style={{ paddingVertical: 4, paddingHorizontal: 12, borderRadius: 999, backgroundColor: p.ph === 'break' ? C.accSoft : p.ph === 'work' ? C.pri : C.field }}>
          <Text style={{ color: p.ph === 'work' ? C.onPri : p.ph === 'break' ? C.acc : C.mu, fontSize: 12, fontWeight: '700', letterSpacing: 0.6 }}>
            {(label + (p.paused ? ' · en pause' : '')).toUpperCase()}
          </Text>
        </View>
        <Text accessibilityRole="timer" style={{ color: C.tx, fontSize: 56, fontWeight: '700', letterSpacing: -1.5, fontVariant: ['tabular-nums'], marginTop: 6 }}>
          {clock(left)}
        </Text>
        <Mu style={{ textAlign: 'center' }}>{sub}</Mu>
      </View>
      <View style={{ height: 6, borderRadius: 3, backgroundColor: C.track, marginTop: 12, overflow: 'hidden' }}>
        <View style={{ width: pct + '%', height: '100%', backgroundColor: p.ph === 'break' ? C.acc : C.pri }} />
      </View>

      {p.ph === 'idle' ? (
        <>
          <Row style={{ marginTop: 14, gap: 8 }}>
            {PRESETS.map((x) => {
              const on = p.w === x.w && p.b === x.b;
              return (
                <Pressable key={x.label} onPress={() => update((s) => setPreset(s, x.w, x.b))} accessibilityRole="button" accessibilityState={{ selected: on }}
                  accessibilityLabel={x.w + ' minutes de travail, ' + x.b + ' de pause'}
                  style={{ flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 14, backgroundColor: on ? C.lav2 : C.field, borderWidth: 1, borderColor: on ? C.accLine : 'transparent' }}>
                  <Text style={{ color: on ? C.acc : C.tx, fontWeight: '700' }}>{x.label}</Text>
                  <Text style={{ color: C.mu, fontSize: 11 }}>min</Text>
                </Pressable>
              );
            })}
          </Row>
          <Btn label={done ? 'Encore un pomodoro' : 'Lancer le travail'} active onPress={() => act(startWork)} style={{ marginTop: 12, paddingVertical: 13 }} />
        </>
      ) : (
        <>
          <Row style={{ marginTop: 14, gap: 8 }}>
            <Btn label={p.paused ? 'Reprendre' : 'Mettre en pause'} active onPress={() => act(togglePause)} style={{ flex: 1 }} />
            <Btn label="Arrêter" ghost onPress={() => act(stopPomo)} style={{ flex: 1 }} />
          </Row>
          <Btn label={p.ph === 'work' ? 'Prendre la pause maintenant' : 'Retourner au travail'} ghost
            onPress={() => act(p.ph === 'work' ? startBreak : startWork)} style={{ marginTop: 8 }} />
        </>
      )}
    </Card>
  );
}
