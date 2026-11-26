// Petites icônes dessinées en traits (pas d'images).
import React from 'react';
import Svg, { Path, Rect, Circle, Line } from 'react-native-svg';
import { C } from '../theme';

const base = (size, color) => ({
  width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
  stroke: color, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round',
});

export const HomeIcon = ({ size = 22, color = C.tx }) => (
  <Svg {...base(size, color)}><Path d="M3 11l9-7 9 7v8a2 2 0 0 1-2 2h-4v-6h-6v6H5a2 2 0 0 1-2-2z" /></Svg>
);
export const WeekIcon = ({ size = 22, color = C.tx }) => (
  <Svg {...base(size, color)}>
    <Line x1="4" y1="7" x2="20" y2="7" /><Line x1="4" y1="12" x2="20" y2="12" /><Line x1="4" y1="17" x2="14" y2="17" />
  </Svg>
);
export const CalIcon = ({ size = 22, color = C.tx }) => (
  <Svg {...base(size, color)}>
    <Rect x="3" y="5" width="18" height="16" rx="3" /><Line x1="3" y1="10" x2="21" y2="10" />
    <Line x1="8" y1="3" x2="8" y2="7" /><Line x1="16" y1="3" x2="16" y2="7" />
  </Svg>
);
export const ChartIcon = ({ size = 22, color = C.tx }) => (
  <Svg {...base(size, color)}>
    <Line x1="5" y1="20" x2="5" y2="12" /><Line x1="12" y1="20" x2="12" y2="5" /><Line x1="19" y1="20" x2="19" y2="9" />
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
  <Svg {...base(size, color)}><Circle cx="12" cy="12" r="9" /><Path d="M8.5 14.5q3.5 3 7 0" /><Circle cx="9" cy="10" r=".6" /><Circle cx="15" cy="10" r=".6" /></Svg>
);

// Visage d'humeur de 1 (mal) à 5 (super), dessiné au trait.
const MOUTHS = {
  1: 'M8 16.5q4-3.5 8 0',
  2: 'M8.5 16q3.5-1.6 7 0',
  3: 'M8.5 15.5h7',
  4: 'M8.5 14.5q3.5 2 7 0',
  5: 'M7.5 13.5q4.5 5 9 0',
};
export function Face({ level, size = 28, on }) {
  const stroke = on ? C.onPri : C.mu;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10.5" fill={on ? C.pri : 'transparent'} stroke={on ? C.pri : C.line} strokeWidth="1.4" />
      <Circle cx="8.8" cy="9.6" r="1.1" fill={stroke} />
      <Circle cx="15.2" cy="9.6" r="1.1" fill={stroke} />
      <Path d={MOUTHS[level]} stroke={stroke} strokeWidth="1.7" strokeLinecap="round" fill="none" />
    </Svg>
  );
}
export const MOOD_LABELS = ['', 'Mal', 'Bof', 'Moyen', 'Bien', 'Super'];
