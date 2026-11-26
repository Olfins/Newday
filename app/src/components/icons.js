// Petites icônes dessinées en traits (pas d'images).
import React from 'react';
import Svg, { Path, Rect, Circle, Line, Ellipse } from 'react-native-svg';
import { C } from '../theme';

const base = (size, color) => ({
  width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
  stroke: color, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round',
});

// Icônes des onglets, esprit fournitures de bureau.
// Aujourd'hui : la tasse de café du matin.
export const HomeIcon = ({ size = 22, color = C.tx }) => (
  <Svg {...base(size, color)}>
    <Path d="M4 9h12v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z" /><Path d="M16 11h1.5a2.5 2.5 0 0 1 0 5H16" />
    <Path d="M8 3.5c-.8 1 .8 1.8 0 3M12 3.5c-.8 1 .8 1.8 0 3" />
  </Svg>
);
// Semaine : un carnet à spirale.
export const WeekIcon = ({ size = 22, color = C.tx }) => (
  <Svg {...base(size, color)}>
    <Rect x="6" y="3" width="14" height="18" rx="2" />
    <Line x1="3.5" y1="7" x2="7.5" y2="7" /><Line x1="3.5" y1="12" x2="7.5" y2="12" /><Line x1="3.5" y1="17" x2="7.5" y2="17" />
    <Line x1="10.5" y1="8" x2="16.5" y2="8" /><Line x1="10.5" y1="12" x2="15" y2="12" />
  </Svg>
);
// Calendrier : un calendrier de bureau à anneaux.
export const CalIcon = ({ size = 22, color = C.tx }) => (
  <Svg {...base(size, color)}>
    <Rect x="3" y="5" width="18" height="16" rx="2.5" /><Line x1="3" y1="10" x2="21" y2="10" />
    <Line x1="8" y1="3" x2="8" y2="7" /><Line x1="16" y1="3" x2="16" y2="7" />
    <Rect x="7" y="13.5" width="3.5" height="3.5" rx="0.8" />
  </Svg>
);
// Progrès : un porte-bloc avec un petit graphique.
export const ChartIcon = ({ size = 22, color = C.tx }) => (
  <Svg {...base(size, color)}>
    <Rect x="4.5" y="4.5" width="15" height="17" rx="2" /><Rect x="9" y="2.5" width="6" height="4" rx="1" />
    <Line x1="9" y1="18" x2="9" y2="14" /><Line x1="12" y1="18" x2="12" y2="10.5" /><Line x1="15" y1="18" x2="15" y2="12.5" />
  </Svg>
);
export const PawIcon = ({ size = 22, color = C.tx }) => (
  <Svg {...base(size, color)}>
    <Path d="M12 13.5c-3 0-5.5 2.6-5.5 4.6 0 1.6 1.3 2.4 2.8 2.4 1.1 0 1.8-.6 2.7-.6s1.6.6 2.7.6c1.5 0 2.8-.8 2.8-2.4 0-2-2.5-4.6-5.5-4.6z" />
    <Circle cx="5.5" cy="10" r="1.8" /><Circle cx="9.5" cy="5.5" r="1.8" /><Circle cx="14.5" cy="5.5" r="1.8" /><Circle cx="18.5" cy="10" r="1.8" />
  </Svg>
);
export const PlusIcon = ({ size = 22, color = C.tx }) => (
  <Svg {...base(size, color)}><Line x1="12" y1="5" x2="12" y2="19" /><Line x1="5" y1="12" x2="19" y2="12" /></Svg>
);
export const CheckIcon = ({ size = 22, color = C.tx, width = 2.4 }) => (
  <Svg {...base(size, color)} strokeWidth={width}><Path d="M5 12.5l4.5 4.5L19 7.5" /></Svg>
);
export const DumbbellIcon = ({ size = 18, color = C.pri }) => (
  <Svg {...base(size, color)}>
    <Line x1="7" y1="12" x2="17" y2="12" /><Rect x="3" y="8" width="4" height="8" rx="1.5" /><Rect x="17" y="8" width="4" height="8" rx="1.5" />
  </Svg>
);
export const MoodIcon = ({ size = 18, color = C.pri }) => (
  <Svg {...base(size, color)}><Path d="M4.3 11.4L4.7 3.8L9.2 7.3Q12 6.5 14.8 7.3L19.3 3.8L19.7 11.4Q20.9 19.6 12 20.6Q3.1 19.6 4.3 11.4Z" /><Path d="M9.8 15.6q1.1 1.2 2.2 0q1.1 1.2 2.2 0" /><Circle cx="9" cy="12.4" r=".7" /><Circle cx="15" cy="12.4" r=".7" /></Svg>
);

// Humeur de 1 (mal) à 5 (super) : une tête de chat dessinée au trait.
const HEAD = 'M4.3 11.4L4.7 3.8L9.2 7.3Q12 6.5 14.8 7.3L19.3 3.8L19.7 11.4Q20.9 19.6 12 20.6Q3.1 19.6 4.3 11.4Z';
export function Face({ level, size = 28, on }) {
  const f = on ? C.onPri : C.mu;
  const line = { stroke: f, strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' };
  const dots = (r = 1.15) => (<><Circle cx="9" cy="12.6" r={r} fill={f} /><Circle cx="15" cy="12.6" r={r} fill={f} /></>);
  const parts = {
    1: (<>
      {dots(1)}
      <Path d="M7.4 11.1L10.1 10.1M16.6 11.1L13.9 10.1" {...line} />
      <Path d="M10.1 17.7q1.9-1.7 3.8 0" {...line} />
      <Path d="M8.6 14.4q-0.9 1.4 0 2q0.9-0.6 0-2z" fill="#8DC3EE" />
    </>),
    2: (<>
      <Path d="M7.8 12.8h2.4M13.8 12.8h2.4" {...line} />
      <Path d="M10 17q1-0.8 2 0q1 0.8 2 0" {...line} />
    </>),
    3: (<>
      {dots()}
      <Path d="M10.4 16.8h3.2" {...line} />
    </>),
    4: (<>
      {dots()}
      <Path d="M9.8 15.9q1.1 1.3 2.2 0q1.1 1.3 2.2 0" {...line} />
    </>),
    5: (<>
      <Path d="M7.7 13.2q1.3-1.8 2.6 0M13.7 13.2q1.3-1.8 2.6 0" {...line} />
      <Path d="M9.9 15.7q2.1 3.1 4.2 0z" fill={f} />
      <Ellipse cx="7" cy="15.4" rx="1.3" ry="0.75" fill="#E8738A" opacity="0.7" />
      <Ellipse cx="17" cy="15.4" rx="1.3" ry="0.75" fill="#E8738A" opacity="0.7" />
    </>),
  };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d={HEAD} fill={on ? C.pri : C.card} stroke={on ? C.pri : '#D3C6AC'} strokeWidth="1.3" strokeLinejoin="round" />
      <Path d="M11.2 14.5h1.6L12 15.3z" fill={on ? '#E9A3B4' : f} stroke={on ? '#E9A3B4' : f} strokeWidth="0.6" strokeLinejoin="round" />
      <Path d="M1.8 14.1l3.2 0.3M2.1 16.3l3-0.7M22.2 14.1l-3.2 0.3M21.9 16.3l-3-0.7" stroke={on ? C.pri : '#D3C6AC'} strokeWidth="0.9" strokeLinecap="round" />
      {parts[level]}
    </Svg>
  );
}
export const MOOD_LABELS = ['', 'Mal', 'Bof', 'Moyen', 'Bien', 'Super'];
