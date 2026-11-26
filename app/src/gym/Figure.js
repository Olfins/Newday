// Silhouette avec les muscles travaillés surlignés (reprise de l'app Salle).
import React from 'react';
import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import { C } from '../theme';

const BACK = { trap: 1, lat: 1, mid: 1, low: 1, rdelt: 1, tri: 1 };
const MIRROR = 'translate(120 0) scale(-1 1)';

const Arm = () => <Path d="M31 47C22 47 17 55 16 67L13 100C12 118 12 134 13 150H25C26 134 28 118 30 100L34 68Z" />;
const Delt = () => <Ellipse cx="25" cy="60" rx="9" ry="13" transform="rotate(-12 25 60)" />;
const ArmM = () => <Ellipse cx="20.5" cy="88" rx="6" ry="15" />;
const Abs = () => (
  <G>
    {[80, 92, 104, 116].map((y) => (
      <G key={y}>
        <Rect x="50.5" y={y} width="8.5" height="10" rx="3" />
        <Rect x="61" y={y} width="8.5" height="10" rx="3" />
      </G>
    ))}
  </G>
);

// c: true quand la forme est au centre (pas de copie en miroir).
const FRONT = [
  { id: 'trap', D: () => <Path d="M58 42L46 43L38 50L58 51Z" /> },
  { id: 'delt', D: Delt },
  { id: 'pec', D: () => <Path d="M59 52C50 47 40 49 36 56C34 67 42 77 59 76Z" /> },
  { id: 'bic', D: ArmM },
  { id: 'fore', D: () => <Ellipse cx="18" cy="123" rx="5.5" ry="17" /> },
  { id: 'abs', c: true, D: Abs },
];
const REAR = [
  { id: 'trap', c: true, D: () => <Path d="M60 38L44 44L34 53L60 94L86 53L76 44Z" /> },
  { id: 'lat', D: () => <Path d="M58 76L38 62C34 82 42 106 58 116Z" /> },
  { id: 'mid', c: true, D: () => <Rect x="50" y="58" width="20" height="24" rx="5" /> },
  { id: 'low', c: true, D: () => <Rect x="48" y="116" width="24" height="18" rx="6" /> },
  { id: 'rdelt', D: Delt },
  { id: 'tri', D: ArmM },
];

export const isBack = (m) => !!BACK[m];

export default function Figure({ view = 'f', muscles = [], size = 60, dark }) {
  const hi = {};
  muscles.forEach((m) => (hi[m] = 1));
  const body = dark ? 'rgba(255,255,255,0.75)' : '#FFFFFF';
  const line = dark ? 'rgba(23,23,29,0.25)' : C.ring;
  return (
    <Svg width={size * 0.8} height={size} viewBox="0 0 120 150">
      <G fill={body} stroke={line} strokeWidth="1">
        <Circle cx="60" cy="19" r="12" />
        <Rect x="54" y="30" width="12" height="11" rx="4" />
        <Path d="M32 48C38 42 50 40 60 40S82 42 88 48L85 82C83 102 79 120 77 138H43C41 120 37 102 35 82Z" />
        <Arm />
        <G transform={MIRROR}><Arm /></G>
      </G>
      {(view === 'f' ? FRONT : REAR).map((r) => (
        <G key={r.id} fill={hi[r.id] ? C.acc : C.accSoft} stroke={line} strokeWidth="0.7">
          <r.D />
          {r.c ? null : <G transform={MIRROR}><r.D /></G>}
        </G>
      ))}
    </Svg>
  );
}

// Tous les muscles d'une séance, sans doublon.
export const sessionMuscles = (se) => [...new Set(se.exercises.flatMap((x) => x.muscles))];
