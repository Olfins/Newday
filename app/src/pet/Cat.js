// Les chats dessinés en traits simples (pas d'images) : costume, cravate ou nœud,
// quatre tailles (chaton, jeune, adulte, PDG) et trois humeurs.
import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Circle, Ellipse, G, Line, Path, Polygon, Rect } from 'react-native-svg';

const LOOKS = {
  noir: {
    fur: '#2B2B35', furD: '#1B1B22', muzzle: '#3B3B48', ear: '#E9A3B4', eye: '#C9E265', pupil: '#15151B',
    line: '#A3A3B8', suit: '#2F3B5C', suitD: '#222C47', accent: '#6C5FD4',
  },
  roux: {
    fur: '#F2A65A', furD: '#D9823A', muzzle: '#FBE3C8', ear: '#F6B0BE', eye: '#3A2A1E', pupil: '#3A2A1E',
    line: '#B9773A', suit: '#4B3F72', suitD: '#3A3060', accent: '#F08A3C',
  },
};

const pts = (a) => a.map((p) => p.join(',')).join(' ');
const toward = (p, c, f) => [p[0] + (c[0] - p[0]) * f, p[1] + (c[1] - p[1]) * f];

export function CatDrawing({ kind = 'noir', stage = 0, mood = 'happy', size = 200 }) {
  const P = LOOKS[kind] || LOOKS.noir;
  const hr = [48, 45, 42, 42][stage];
  const bw = [56, 68, 78, 84][stage];
  const bh = [48, 62, 76, 84][stage];
  const cx = 100, base = 204, top = base - bh, hy = top - hr * 0.55;
  const er = hr * [0.2, 0.18, 0.16, 0.16][stage];

  const ear = (s) => {
    const a = [cx + s * hr * 0.88, hy - hr * 0.3], b = [cx + s * hr * 0.6, hy - hr * 1.18], c = [cx + s * hr * 0.12, hy - hr * 0.82];
    const m = [(a[0] + b[0] + c[0]) / 3, (a[1] + b[1] + c[1]) / 3];
    return (
      <G key={s}>
        <Polygon points={pts([a, b, c])} fill={P.fur} stroke={P.fur} strokeWidth="6" strokeLinejoin="round" />
        <Polygon points={pts([toward(a, m, 0.4), toward(b, m, 0.35), toward(c, m, 0.4)])} fill={P.ear} />
      </G>
    );
  };

  const eye = (s) => {
    const ex = cx + s * hr * 0.4, ey = hy - hr * 0.04;
    if (mood === 'happy') {
      return <Path key={s} d={`M${ex - er} ${ey + 2} Q${ex} ${ey - er * 1.2} ${ex + er} ${ey + 2}`} stroke={kind === 'noir' ? P.eye : P.pupil} strokeWidth="3.2" strokeLinecap="round" fill="none" />;
    }
    const r = mood === 'hungry' ? er * 0.85 : er;
    return (
      <G key={s}>
        <Circle cx={ex} cy={ey} r={r} fill={kind === 'noir' ? P.eye : '#FFFFFF'} />
        <Ellipse cx={ex} cy={ey + 0.5} rx={r * 0.45} ry={r * 0.8} fill={P.pupil} />
        <Circle cx={ex + r * 0.3} cy={ey - r * 0.35} r={r * 0.22} fill="#FFFFFF" />
        {mood === 'hungry' ? (
          <>
            <Path d={`M${ex - r - 1} ${ey} L${ex + r + 1} ${ey} A${r + 1} ${r + 1} 0 0 0 ${ex - r - 1} ${ey} Z`} fill={P.fur} />
            <Line x1={ex - s * r * 1.1} y1={ey - r * 1.6} x2={ex + s * r * 0.9} y2={ey - r * 1.15} stroke={P.line} strokeWidth="2" strokeLinecap="round" />
          </>
        ) : null}
      </G>
    );
  };

  const my = hy + hr * 0.36;
  const mouth = mood === 'hungry'
    ? `M${cx - 6} ${my + 4} Q${cx} ${my - 2} ${cx + 6} ${my + 4}`
    : mood === 'happy'
      ? `M${cx - 8} ${my} Q${cx - 4} ${my + 7} ${cx} ${my} Q${cx + 4} ${my + 7} ${cx + 8} ${my}`
      : `M${cx - 6} ${my} Q${cx - 3} ${my + 4} ${cx} ${my} Q${cx + 3} ${my + 4} ${cx + 6} ${my}`;

  return (
    <Svg width={size} height={size * 1.1} viewBox="0 0 200 220">
      <Ellipse cx={cx} cy={base + 5} rx={bw * 0.75} ry="5" fill="rgba(23,23,29,0.08)" />
      {/* Queue */}
      <Path d={`M${cx + bw / 2 - 6} ${base - 10} C${cx + bw / 2 + 30} ${base - 4} ${cx + bw / 2 + 36} ${base - 50} ${cx + bw / 2 + 18} ${base - 60}`}
        stroke={P.fur} strokeWidth="10" strokeLinecap="round" fill="none" />
      {/* Mallette du PDG */}
      {stage === 3 ? (
        <G>
          <Path d={`M${cx - bw / 2 - 26} ${base - 26} v-5 h12 v5`} stroke="#4A3220" strokeWidth="2.5" fill="none" />
          <Rect x={cx - bw / 2 - 32} y={base - 26} width="24" height="20" rx="3" fill="#6B4A2B" />
          <Line x1={cx - bw / 2 - 32} y1={base - 18} x2={cx - bw / 2 - 8} y2={base - 18} stroke="#4A3220" strokeWidth="1.5" />
        </G>
      ) : null}
      {/* Corps = veste de costume */}
      <Path d={`M${cx - bw / 2} ${base} L${cx - bw / 2} ${top + 18} Q${cx - bw / 2} ${top} ${cx - bw / 2 + 18} ${top} L${cx + bw / 2 - 18} ${top} Q${cx + bw / 2} ${top} ${cx + bw / 2} ${top + 18} L${cx + bw / 2} ${base} Z`} fill={P.suit} />
      <Polygon points={pts([[cx - 13, top], [cx + 13, top], [cx, top + bh * 0.44]])} fill="#FFFFFF" />
      <Polygon points={pts([[cx - 13, top], [cx - 26, top + 3], [cx - 2, top + bh * 0.5]])} fill={P.suitD} />
      <Polygon points={pts([[cx + 13, top], [cx + 26, top + 3], [cx + 2, top + bh * 0.5]])} fill={P.suitD} />
      {kind === 'noir' ? (
        <G fill={P.accent}>
          <Polygon points={pts([[cx - 5, top + 2], [cx + 5, top + 2], [cx + 3, top + 9], [cx - 3, top + 9]])} />
          <Polygon points={pts([[cx - 3, top + 9], [cx + 3, top + 9], [cx + 6, top + bh * 0.34], [cx, top + bh * 0.42], [cx - 6, top + bh * 0.34]])} />
        </G>
      ) : (
        <G fill={P.accent}>
          <Path d={`M${cx} ${top + 6} L${cx - 13} ${top} L${cx - 13} ${top + 12} Z`} />
          <Path d={`M${cx} ${top + 6} L${cx + 13} ${top} L${cx + 13} ${top + 12} Z`} />
          <Circle cx={cx} cy={top + 6} r="3.5" />
        </G>
      )}
      <Circle cx={cx} cy={top + bh * 0.6} r="2.4" fill={P.suitD} />
      <Circle cx={cx} cy={top + bh * 0.76} r="2.4" fill={P.suitD} />
      {stage >= 2 ? <Polygon points={pts([[cx - bw / 2 + 9, top + bh * 0.34], [cx - bw / 2 + 21, top + bh * 0.34], [cx - bw / 2 + 15, top + bh * 0.26]])} fill="#FFFFFF" /> : null}
      {/* Pattes */}
      <Ellipse cx={cx - bw / 4} cy={base} rx={bw / 6} ry="7" fill={P.fur} />
      <Ellipse cx={cx + bw / 4} cy={base} rx={bw / 6} ry="7" fill={P.fur} />
      {/* Tête */}
      {ear(-1)}{ear(1)}
      <Ellipse cx={cx} cy={hy} rx={hr} ry={hr * 0.9} fill={P.fur} />
      {kind === 'roux' ? (
        <G stroke={P.furD} strokeWidth="3" strokeLinecap="round">
          <Line x1={cx - 9} y1={hy - hr * 0.84} x2={cx - 7} y2={hy - hr * 0.6} />
          <Line x1={cx} y1={hy - hr * 0.88} x2={cx} y2={hy - hr * 0.62} />
          <Line x1={cx + 9} y1={hy - hr * 0.84} x2={cx + 7} y2={hy - hr * 0.6} />
        </G>
      ) : null}
      <Ellipse cx={cx} cy={hy + hr * 0.33} rx={hr * 0.38} ry={hr * 0.25} fill={P.muzzle} />
      {eye(-1)}{eye(1)}
      {mood === 'happy' ? (
        <G fill={P.ear} opacity="0.55">
          <Ellipse cx={cx - hr * 0.62} cy={hy + hr * 0.3} rx={hr * 0.14} ry={hr * 0.08} />
          <Ellipse cx={cx + hr * 0.62} cy={hy + hr * 0.3} rx={hr * 0.14} ry={hr * 0.08} />
        </G>
      ) : null}
      <Path d={`M${cx - 5} ${hy + hr * 0.18} L${cx + 5} ${hy + hr * 0.18} L${cx} ${hy + hr * 0.27} Z`} fill={P.ear} strokeLinejoin="round" />
      <Path d={mouth} stroke={kind === 'noir' ? P.line : '#5A3A22'} strokeWidth="2" strokeLinecap="round" fill="none" />
      <G stroke={P.line} strokeWidth="1.4" strokeLinecap="round">
        {[-1, 1].map((s) => [-4, 1, 6].map((d) => (
          <Line key={s + '' + d} x1={cx + s * hr * 0.42} y1={hy + hr * 0.3 + d * 0.4} x2={cx + s * hr * 1.08} y2={hy + hr * 0.26 + d * 1.6} />
        )))}
      </G>
      {stage === 3 ? (
        <G stroke="#17171D" strokeWidth="2.5" fill="none">
          <Circle cx={cx - hr * 0.4} cy={hy - hr * 0.04} r={hr * 0.24} />
          <Circle cx={cx + hr * 0.4} cy={hy - hr * 0.04} r={hr * 0.24} />
          <Line x1={cx - hr * 0.16} y1={hy - hr * 0.06} x2={cx + hr * 0.16} y2={hy - hr * 0.06} />
        </G>
      ) : null}
    </Svg>
  );
}

// Le chat qui respire doucement (petite animation).
export default function Cat(props) {
  const y = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const a = Animated.loop(Animated.sequence([
      Animated.timing(y, { toValue: -4, duration: 1100, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
      Animated.timing(y, { toValue: 0, duration: 1100, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
    ]));
    a.start();
    return () => a.stop();
  }, []);
  return (
    <Animated.View style={{ transform: [{ translateY: y }] }}>
      <CatDrawing {...props} />
    </Animated.View>
  );
}

// Gamelles : pâtée (tas) ou croquettes (petits grains).
export function Bowl({ type = 'p', size = 44 }) {
  return (
    <Svg width={size} height={size * 0.8} viewBox="0 0 50 40">
      {type === 'p' ? (
        <Path d="M10 21 Q12 9 25 9 Q38 9 40 21 Z" fill="#9C6B4E" />
      ) : (
        <G fill="#C98A4B">
          {[[15, 18], [21, 15], [27, 17], [33, 15], [19, 20], [25, 20], [31, 20], [36, 19], [24, 12], [30, 12]].map(([x, yy], i) => <Circle key={i} cx={x} cy={yy} r="3" />)}
        </G>
      )}
      <Path d="M5 21 H45 Q45 36 25 36 Q5 36 5 21 Z" fill="#6C5FD4" />
      <Rect x="5" y="20" width="40" height="3" rx="1.5" fill="#5A4EC0" />
    </Svg>
  );
}
