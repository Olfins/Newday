// Les chats dessinés en traits simples (pas d'images). L'apparence vient des choix
// de l'utilisateur (voir looks.js) : pelage, motif, yeux, accessoire, tenue, couleurs.
// Quatre tailles (chaton, jeune, adulte, PDG) et trois humeurs.
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, PanResponder, Text, Vibration, View } from 'react-native';
import Svg, { Circle, ClipPath, Defs, Ellipse, G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';
import { lookOf, palette, shade } from './looks';
import Headwear from './Headwear';
import { Desk, Hold, Zzz } from './scenes';
import { Polygon, pts, toward } from './shapes';
import { MonsterDrawing } from './Monster';
import { SPECIES, isStarter } from './species';

// Attention : pas de « key » sur les groupes de la tête. Sur le web, ils laissaient
// les anciennes oreilles à l'écran quand le chat changeait de taille.

// look : l'apparence choisie ; kind : ancien choix ('noir' ou 'roux'), utilisé si look manque.
// scene : null (normal), 'work' (au PC), ou une pause : 'coffee', 'walk', 'snack', 'water'.
// t : temps en secondes, pour animer la scène.
export function CatDrawing({ look, kind = 'noir', stage = 0, mood: mood0 = 'happy', size = 200, tail = 0, blink = false, scene = null, t = 0 }) {
  const P = palette(look || lookOf(kind));
  const L = P.look;
  const lidC = P.dark ? P.eye : '#3A2A1E';
  // Gorgée / bouchée : 0 = main en bas, 1 = main à la bouche.
  const holds = scene === 'coffee' || scene === 'water' || scene === 'snack';
  const sipRaw = (Math.sin(t * 1.5) + 1) / 2;
  const sip = holds ? Math.min(1, Math.max(0, (sipRaw - 0.25) / 0.6)) : 0;
  const sleeping = scene === 'sleep';
  const mood = sleeping ? 'sleep' : scene === 'work' ? 'ok' : holds && sip > 0.85 ? 'happy' : scene ? 'happy' : mood0;
  const hr = [48, 45, 42, 42][stage];
  const bw = [56, 68, 78, 84][stage];
  const bh = [48, 62, 76, 84][stage];
  const cx = 100, base = 204, top = base - bh, hy = top - hr * 0.55;
  const er = hr * [0.2, 0.18, 0.16, 0.16][stage];

  const ear = (s) => {
    const a = [cx + s * hr * 0.88, hy - hr * 0.3], b = [cx + s * hr * 0.6, hy - hr * 1.18], c = [cx + s * hr * 0.12, hy - hr * 0.82];
    const m = [(a[0] + b[0] + c[0]) / 3, (a[1] + b[1] + c[1]) / 3];
    return (
      <G>
        <Polygon points={pts([a, b, c])} fill={P.fur} stroke={P.fur} strokeWidth="6" strokeLinejoin="round" />
        <Polygon points={pts([toward(a, m, 0.4), toward(b, m, 0.35), toward(c, m, 0.4)])} fill={P.ear} />
      </G>
    );
  };

  // Cils pour une fille.
  const lashes = (s, ex, ey, r) => (L.sex === 'f' ? (
    <Path d={`M${ex + s * r * 0.75} ${ey - r * 0.55} l${s * 4} -3 M${ex + s * r * 0.95} ${ey - r * 0.1} l${s * 4.5} -1`} stroke={P.dark ? P.line : '#3A2A1E'} strokeWidth="1.8" strokeLinecap="round" />
  ) : null);

  const eye = (s) => {
    const ex = cx + s * hr * 0.4, ey = hy - hr * 0.04;
    // Endormi : paupières fermées, courbées vers le bas.
    if (mood === 'sleep') {
      return <G><Path d={`M${ex - er} ${ey} Q${ex} ${ey + er * 0.9} ${ex + er} ${ey}`} stroke={lidC} strokeWidth="3" strokeLinecap="round" fill="none" />{lashes(s, ex, ey + 1, er)}</G>;
    }
    if (mood === 'happy') {
      return <G><Path d={`M${ex - er} ${ey + 2} Q${ex} ${ey - er * 1.2} ${ex + er} ${ey + 2}`} stroke={lidC} strokeWidth="3.2" strokeLinecap="round" fill="none" />{lashes(s, ex, ey + 2, er)}</G>;
    }
    const r = mood === 'hungry' ? er * 0.85 : er;
    if (blink) return <G><Path d={`M${ex - r} ${ey + 1} Q${ex} ${ey + r * 0.6} ${ex + r} ${ey + 1}`} stroke={lidC} strokeWidth="3" strokeLinecap="round" fill="none" />{lashes(s, ex, ey + 2, r)}</G>;
    return (
      <G>
        <Circle cx={ex} cy={ey} r={r} fill={P.eye} />
        <Ellipse cx={ex} cy={ey + 0.5} rx={r * 0.45} ry={r * 0.8} fill={P.pupil} />
        <Circle cx={ex + r * 0.3} cy={ey - r * 0.35} r={r * 0.22} fill="#FFFFFF" />
        {lashes(s, ex, ey, r)}
        {mood === 'hungry' ? (
          <>
            <Path d={`M${ex - r - 1} ${ey} L${ex + r + 1} ${ey} A${r + 1} ${r + 1} 0 0 0 ${ex - r - 1} ${ey} Z`} fill={s === 1 && L.pat === 'tache' ? P.patch : P.fur} />
            <Line x1={ex - s * r * 1.1} y1={ey - r * 1.6} x2={ex + s * r * 0.9} y2={ey - r * 1.15} stroke={P.line} strokeWidth="2" strokeLinecap="round" />
          </>
        ) : null}
      </G>
    );
  };

  const my = hy + hr * 0.36;
  const chew = scene === 'snack' && sip > 0.6 ? Math.abs(Math.sin(t * 9)) : 0;
  const mouth = chew
    ? `M${cx - 5} ${my} Q${cx} ${my + 3 + chew * 6} ${cx + 5} ${my} Z`
    : mood === 'hungry'
    ? `M${cx - 6} ${my + 4} Q${cx} ${my - 2} ${cx + 6} ${my + 4}`
    : mood === 'happy'
      ? `M${cx - 8} ${my} Q${cx - 4} ${my + 7} ${cx} ${my} Q${cx + 4} ${my + 7} ${cx + 8} ${my}`
      : `M${cx - 6} ${my} Q${cx - 3} ${my + 4} ${cx} ${my} Q${cx + 3} ${my + 4} ${cx + 6} ${my}`;

    const tie = (
    <G fill={P.accent}>
      <Polygon points={pts([[cx - 5, top + 2], [cx + 5, top + 2], [cx + 3, top + 9], [cx - 3, top + 9]])} />
      <Polygon points={pts([[cx - 3, top + 9], [cx + 3, top + 9], [cx + 6, top + bh * 0.34], [cx, top + bh * 0.42], [cx - 6, top + bh * 0.34]])} />
    </G>
  );
  const bodyPath = `M${cx - bw / 2} ${base} L${cx - bw / 2} ${top + 18} Q${cx - bw / 2} ${top} ${cx - bw / 2 + 18} ${top} L${cx + bw / 2 - 18} ${top} Q${cx + bw / 2} ${top} ${cx + bw / 2} ${top + 18} L${cx + bw / 2} ${base} Z`;


  return (
    <Svg width={size} height={size * 1.1} viewBox="0 0 200 220">
      <Ellipse cx={cx} cy={base + 5} rx={bw * 0.75} ry="5" fill="rgba(23,23,29,0.08)" />
      {/* Queue */}
      <G transform={`rotate(${tail.toFixed(1)} ${cx + bw / 2 - 6} ${base - 10})`}>
        <Path d={`M${cx + bw / 2 - 6} ${base - 10} C${cx + bw / 2 + 30} ${base - 4} ${cx + bw / 2 + 36} ${base - 50} ${cx + bw / 2 + 18} ${base - 60}`}
          stroke={P.fur} strokeWidth="10" strokeLinecap="round" fill="none" />
        {L.pat === 'chaussettes' && L.fur !== 'blanc' ? <Circle cx={cx + bw / 2 + 18} cy={base - 60} r="5" fill="#FFFFFF" /> : null}
        {L.pat === 'tigre' ? <TailStripes x0={cx + bw / 2 - 6} y0={base - 10} color={P.furD} /> : null}
      </G>
      {/* Mallette du PDG */}
      {stage === 3 ? (
        <G>
          <Path d={`M${cx - bw / 2 - 26} ${base - 26} v-5 h12 v5`} stroke="#4A3220" strokeWidth="2.5" fill="none" />
          <Rect x={cx - bw / 2 - 32} y={base - 26} width="24" height="20" rx="3" fill="#6B4A2B" />
          <Line x1={cx - bw / 2 - 32} y1={base - 18} x2={cx - bw / 2 - 8} y2={base - 18} stroke="#4A3220" strokeWidth="1.5" />
        </G>
      ) : null}
      {/* Corps = la tenue */}
      {L.out === 'gilet' ? (
        <G>
          <Path d={bodyPath} fill="#FFFFFF" stroke="#E2E0EA" strokeWidth="1.5" />
          {tie}
          <Path d={`M${cx - bw / 2 + 6} ${base} L${cx - bw / 2 + 6} ${top + bh * 0.22} L${cx - 7} ${top + bh * 0.22} L${cx} ${top + bh * 0.62} L${cx + 7} ${top + bh * 0.22} L${cx + bw / 2 - 6} ${top + bh * 0.22} L${cx + bw / 2 - 6} ${base} Z`} fill={P.suit} />
          <Circle cx={cx} cy={top + bh * 0.72} r="2.2" fill={P.suitD} />
          <Circle cx={cx} cy={top + bh * 0.86} r="2.2" fill={P.suitD} />
        </G>
      ) : L.out === 'col' ? (
        <G>
          <Path d={bodyPath} fill={P.suit} />
          <Rect x={cx - 22} y={top - 4} width="44" height="12" rx="6" fill={P.suitD} />
          <G stroke={P.suit} strokeWidth="1.5">
            {[-14, -7, 0, 7, 14].map((d) => <Line key={d} x1={cx + d} y1={top - 2} x2={cx + d} y2={top + 6} />)}
          </G>
          <Circle cx={cx} cy={top + bh * 0.45} r="4" fill="none" stroke={P.accent} strokeWidth="2" />
          <Line x1={cx} y1={top + 8} x2={cx} y2={top + bh * 0.45 - 4} stroke={P.accent} strokeWidth="1.2" />
        </G>
      ) : L.out === 'trench' ? (
        <G>
          <Path d={bodyPath} fill={P.suit} />
          <Polygon points={pts([[cx - 11, top], [cx + 11, top], [cx, top + bh * 0.38]])} fill="#FFFFFF" />
          {tie}
          <Polygon points={pts([[cx - 11, top], [cx - 30, top + 2], [cx - 25, top + bh * 0.3], [cx - 3, top + bh * 0.42]])} fill="#CDB38B" />
          <Polygon points={pts([[cx + 11, top], [cx + 30, top + 2], [cx + 25, top + bh * 0.3], [cx + 3, top + bh * 0.42]])} fill="#CDB38B" />
          <Rect x={cx - bw / 2} y={top + bh * 0.58} width={bw} height="7" fill="#8E7652" />
          <Rect x={cx + 6} y={top + bh * 0.58 - 1.5} width="11" height="10" rx="1.5" stroke="#4E4130" strokeWidth="2" fill="none" />
          {[0.47, 0.78].map((f) => [-9, 9].map((d) => <Circle key={f + '' + d} cx={cx + d} cy={top + bh * f} r="2.3" fill="#5E4E36" />))}
        </G>
      ) : L.out === 'cuir' ? (
        <G>
          <Path d={bodyPath} fill={P.suit} />
          <Polygon points={pts([[cx - 12, top], [cx + 12, top], [cx + 6, top + bh * 0.42], [cx - 6, top + bh * 0.42]])} fill="#F2F0F5" />
          <Polygon points={pts([[cx - 12, top], [cx - 29, top + 2], [cx - 21, top + bh * 0.32], [cx - 5, top + bh * 0.44]])} fill="#1C1614" />
          <Polygon points={pts([[cx + 12, top], [cx + 29, top + 2], [cx + 22, top + bh * 0.28], [cx + 5, top + bh * 0.46]])} fill="#1C1614" />
          <Line x1={cx + 5} y1={top + bh * 0.46} x2={cx + 12} y2={base - 6} stroke="#C9C8D2" strokeWidth="2.2" />
          <Rect x={cx + 9} y={top + bh * 0.55} width="4" height="7" rx="1" fill="#C9C8D2" />
          <Rect x={cx - bw / 2} y={base - 10} width={bw} height="6" fill="#1C1614" />
          <Rect x={cx - 6} y={base - 11} width="9" height="8" rx="1.5" stroke="#C9C8D2" strokeWidth="1.6" fill="none" />
          <Circle cx={cx - 22} cy={top + bh * 0.26} r="1.8" fill="#C9C8D2" />
          <Circle cx={cx + 23} cy={top + bh * 0.22} r="1.8" fill="#C9C8D2" />
          <Path d={`M${cx - bw / 2 + 7} ${top + 16} Q${cx - bw / 2 + 5} ${top + bh * 0.5} ${cx - bw / 2 + 8} ${base - 14}`} stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.12" />
        </G>
      ) : L.out === 'doudoune' ? (
        <G>
          <Path d={bodyPath} fill={P.suit} />
          <G stroke={P.suitD} strokeWidth="2" fill="none" strokeLinecap="round">
            {[1, 2, 3, 4].map((i) => {
              const y = top + (bh * i) / 5;
              return <Path key={i} d={`M${cx - bw / 2 + 1} ${y} Q${cx} ${y + 5} ${cx + bw / 2 - 1} ${y}`} />;
            })}
          </G>
          <G stroke="#FFFFFF" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.16">
            {[0, 1, 2, 3].map((i) => <Path key={i} d={`M${cx - bw / 2 + 8} ${top + (bh * i) / 5 + 6} q8 -2 14 0`} />)}
          </G>
          <Rect x={cx - 24} y={top - 5} width="48" height="13" rx="6" fill={P.suitD} />
          <Line x1={cx} y1={top + 6} x2={cx} y2={base} stroke={shade(P.suit, 0.5)} strokeWidth="2" />
          <Rect x={cx - 2} y={top + 8} width="4" height="8" rx="1" fill="#C9C8D2" />
        </G>
      ) : L.out === 'bucheron' ? (
        <G>
          <Defs>
            <ClipPath id={'plaid' + stage}><Path d={bodyPath} /></ClipPath>
          </Defs>
          <Path d={bodyPath} fill={P.suit} />
          <G clipPath={`url(#plaid${stage})`}>
            {[-3, -2, -1, 0, 1, 2, 3].map((i) => <Rect key={'v' + i} x={cx + i * 13 - 3} y={top} width="6" height={bh} fill={P.suitD} opacity="0.55" />)}
            {[0, 1, 2, 3, 4, 5, 6].map((i) => <Rect key={'h' + i} x={cx - bw / 2} y={top + 6 + i * 13} width={bw} height="6" fill={P.suitD} opacity="0.55" />)}
            {[-3, -2, -1, 0, 1, 2, 3].map((i) => <Line key={'a' + i} x1={cx + i * 13 + 6.5} y1={top} x2={cx + i * 13 + 6.5} y2={base} stroke={P.accent} strokeWidth="1" opacity="0.8" />)}
            {[0, 1, 2, 3, 4, 5, 6].map((i) => <Line key={'b' + i} x1={cx - bw / 2} y1={top + 12.5 + i * 13} x2={cx + bw / 2} y2={top + 12.5 + i * 13} stroke={P.accent} strokeWidth="1" opacity="0.8" />)}
          </G>
          <Polygon points={pts([[cx - 8, top], [cx + 8, top], [cx, top + 9]])} fill="#F2F0F5" />
          <Polygon points={pts([[cx - 8, top], [cx - 20, top + 1], [cx - 3, top + 15]])} fill={shade(P.suit, 0.7)} />
          <Polygon points={pts([[cx + 8, top], [cx + 20, top + 1], [cx + 3, top + 15]])} fill={shade(P.suit, 0.7)} />
          <Line x1={cx} y1={top + 12} x2={cx} y2={base} stroke={shade(P.suit, 0.6)} strokeWidth="1.5" />
          {[0.36, 0.56, 0.76].map((f) => <Circle key={f} cx={cx} cy={top + bh * f} r="2" fill="#F2F0F5" />)}
        </G>
      ) : L.out === 'armure' ? (
        <G>
          <Path d={bodyPath} fill={P.suit} stroke="#7D8592" strokeWidth="1.5" />
          <Path d={`M${cx - bw / 2 + 8} ${top + 8} Q${cx} ${top + 1} ${cx + bw / 2 - 8} ${top + 8} L${cx + bw / 2 - 12} ${top + bh * 0.56} Q${cx} ${top + bh * 0.7} ${cx - bw / 2 + 12} ${top + bh * 0.56} Z`} fill="#C6CCD6" stroke="#7D8592" strokeWidth="1.5" />
          <Path d={`M${cx - 6} ${top + bh * 0.2} h12 v8 q0 7 -6 10 q-6 -3 -6 -10 Z`} fill={P.accent} stroke="#6B7380" strokeWidth="1" />
          <Line x1={cx} y1={top + bh * 0.2 + 2} x2={cx} y2={top + bh * 0.2 + 15} stroke="#FFFFFF" strokeWidth="1.4" opacity="0.85" />
          <G stroke="#7D8592" strokeWidth="1.6" fill="none">
            {[0.72, 0.84].map((f) => <Path key={f} d={`M${cx - bw / 2 + 1} ${top + bh * f} Q${cx} ${top + bh * f + 5} ${cx + bw / 2 - 1} ${top + bh * f}`} />)}
          </G>
          {[-1, 1].map((d) => <Ellipse key={d} cx={cx + d * (bw / 2 - 5)} cy={top + 9} rx="13" ry="9" fill="#B8BFCA" stroke="#7D8592" strokeWidth="1.5" />)}
          {[-1, 1].map((d) => [0.4, 0.62].map((f) => <Circle key={d + '' + f} cx={cx + d * (bw / 2 - 6)} cy={top + bh * f} r="1.7" fill="#6B7380" />))}
          <Rect x={cx - 22} y={top - 4} width="44" height="10" rx="4" fill="#8E96A3" />
          <Path d={`M${cx - bw / 2 + 14} ${top + 14} Q${cx - 10} ${top + 9} ${cx - 8} ${top + bh * 0.4}`} stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.35" />
        </G>
      ) : (
        <G>
          <Path d={bodyPath} fill={P.suit} />
          <Polygon points={pts([[cx - 13, top], [cx + 13, top], [cx, top + bh * 0.44]])} fill="#FFFFFF" />
          <Polygon points={pts([[cx - 13, top], [cx - 26, top + 3], [cx - 2, top + bh * 0.5]])} fill={L.out === 'smoking' ? '#3A3A48' : P.suitD} />
          <Polygon points={pts([[cx + 13, top], [cx + 26, top + 3], [cx + 2, top + bh * 0.5]])} fill={L.out === 'smoking' ? '#3A3A48' : P.suitD} />
          {L.out === 'cravate' ? tie : (
            <G fill={P.accent}>
              <Path d={`M${cx} ${top + 6} L${cx - 13} ${top} L${cx - 13} ${top + 12} Z`} />
              <Path d={`M${cx} ${top + 6} L${cx + 13} ${top} L${cx + 13} ${top + 12} Z`} />
              <Circle cx={cx} cy={top + 6} r="3.5" />
            </G>
          )}
          <Circle cx={cx} cy={top + bh * 0.6} r="2.4" fill={P.suitD} />
          <Circle cx={cx} cy={top + bh * 0.76} r="2.4" fill={P.suitD} />
          {L.out === 'smoking' ? <Polygon points={pts([[cx - bw / 2 + 9, top + bh * 0.34], [cx - bw / 2 + 21, top + bh * 0.34], [cx - bw / 2 + 15, top + bh * 0.25]])} fill="#FFFFFF" /> : stage >= 2 ? <Polygon points={pts([[cx - bw / 2 + 9, top + bh * 0.34], [cx - bw / 2 + 21, top + bh * 0.34], [cx - bw / 2 + 15, top + bh * 0.26]])} fill="#FFFFFF" /> : null}
        </G>
      )}
      {/* Pattes */}
      <Ellipse cx={cx - bw / 4} cy={base - (scene === 'walk' ? Math.max(0, Math.sin(t * 7)) * 6 : 0)} rx={bw / 6} ry="7" fill={P.paw} />
      <Ellipse cx={cx + bw / 4} cy={base - (scene === 'walk' ? Math.max(0, -Math.sin(t * 7)) * 6 : 0)} rx={bw / 6} ry="7" fill={P.paw} />
      {/* Tête */}
      {ear(-1)}{ear(1)}
      <Ellipse cx={cx} cy={hy} rx={hr} ry={hr * 0.9} fill={P.fur} />
      {L.pat === 'tache' ? <Ellipse cx={cx + hr * 0.44} cy={hy - hr * 0.12} rx={hr * 0.4} ry={hr * 0.36} fill={P.patch} /> : null}
      {L.pat === 'tigre' ? (
        <G stroke={P.furD} strokeWidth="3" strokeLinecap="round">
          <Line x1={cx - 9} y1={hy - hr * 0.84} x2={cx - 7} y2={hy - hr * 0.6} />
          <Line x1={cx} y1={hy - hr * 0.88} x2={cx} y2={hy - hr * 0.62} />
          <Line x1={cx + 9} y1={hy - hr * 0.84} x2={cx + 7} y2={hy - hr * 0.6} />
          <Line x1={cx - hr * 0.9} y1={hy + hr * 0.02} x2={cx - hr * 0.74} y2={hy + hr * 0.06} />
          <Line x1={cx + hr * 0.9} y1={hy + hr * 0.02} x2={cx + hr * 0.74} y2={hy + hr * 0.06} />
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
      <Path d={mouth} stroke={P.mouth} strokeWidth="2" strokeLinecap="round" fill="none" />
      <G stroke={P.line} strokeWidth="1.4" strokeLinecap="round">
        {[-1, 1].map((s) => [-4, 1, 6].map((d) => (
          <Line key={s + '' + d} x1={cx + s * hr * 0.42} y1={hy + hr * 0.3 + d * 0.4} x2={cx + s * hr * 1.08} y2={hy + hr * 0.26 + d * 1.6} />
        )))}
      </G>
      {sleeping ? <Zzz x={cx + hr * 0.75} y={hy - hr * 0.55} t={t} /> : null}
      <Headwear L={L} P={P} cx={cx} hy={hy} hr={hr} stage={stage} boss={stage === 3} />
      {scene === 'work' ? <Desk P={P} cx={cx} bw={bw} top={top} t={t} /> : null}
      {holds ? <Hold P={P} scene={scene} cx={cx} bw={bw} top={top} bh={bh} hr={hr} my={my} sip={sip} t={t} /> : null}
    </Svg>
  );
}


// Rayures du chat tigré, posées en travers de la queue (même courbe que la queue).
function TailStripes({ x0, y0, color }) {
  const P = [[x0, y0], [x0 + 36, y0 + 6], [x0 + 42, y0 - 40], [x0 + 24, y0 - 50]];
  const at = (t) => {
    const u = 1 - t;
    const pt = [0, 1].map((i) => u * u * u * P[0][i] + 3 * u * u * t * P[1][i] + 3 * u * t * t * P[2][i] + t * t * t * P[3][i]);
    const d = [0, 1].map((i) => 3 * u * u * (P[1][i] - P[0][i]) + 6 * u * t * (P[2][i] - P[1][i]) + 3 * t * t * (P[3][i] - P[2][i]));
    const n = Math.hypot(d[0], d[1]) || 1;
    return { pt, nx: -d[1] / n, ny: d[0] / n };
  };
  return (
    <G stroke={color} strokeWidth="3" strokeLinecap="round">
      {[0.3, 0.55, 0.8].map((t) => {
        const { pt, nx, ny } = at(t);
        const h = 3.2;
        return <Line key={t} x1={pt[0] - nx * h} y1={pt[1] - ny * h} x2={pt[0] + nx * h} y2={pt[1] + ny * h} />;
      })}
    </G>
  );
}

// Le dessin du compagnon : un starter (plante, eau, feu) ou le chat.
export function PetDrawing({ species, ...rest }) {
  return isStarter(species) ? <MonsterDrawing species={species} {...rest} /> : <CatDrawing {...rest} />;
}

// Phrases au hasard. {n} = prénom.
const SAY = {
  any: ['Miaou !', 'Miaou ?', 'Mrrr…', 'Prrrr…', 'On a une réunion à 10 h ?', 'Je relis mes mails.', 'Tu as coché tes habitudes ?', 'Une petite sieste et je reviens.', 'C’est l’heure de la pâtée ?', 'J’aime bien ton agenda.', 'Tu gères !', 'Pause café ?'],
  happy: ['Merci pour la pâtée !', 'Je me sens en forme !', 'Prrrr… trop bien.', 'Meilleur patron du monde.'],
  hungry: ['J’ai un peu faim…', 'Miaou… la pâtée ?', 'Coche 4 habitudes, s’il te plaît !'],
  boss: ['Je suis le PDG ici.', 'Réunion du conseil à 14 h.', 'Signons ce contrat.'],
  pet: ['Prrrr…', 'Prrrrrr…', 'Encore !', 'Ronron…', 'Juste là, oui…'],
  tap: ['Miaou !', 'Hé !', 'Oui ?', 'Miaou ?', 'Coucou !'],
  work: ['Tap tap tap…', 'Concentration.', 'On avance bien !', 'Encore un mail…', 'Je relis le dossier.', 'On lâche rien !'],
  coffee: ['Ah, un bon café.', 'Pause café bien méritée.', 'Slurp…'],
  walk: ['Je me dégourdis les pattes.', 'Un peu d’air frais !', 'Ça fait du bien de bouger.'],
  snack: ['Crunch crunch…', 'Un petit en-cas.', 'Miam, un biscuit.'],
  water: ['Glou glou…', 'Il faut boire de l’eau !', 'Bien hydraté, bien concentré.'],
  sleep: ['Zzz…', 'Mrrr… zzz…', 'Rrrr… pchhh…', 'Jour off… zzz…'],
  sleepTap: ['Mmh… ?', 'Mrrr…', '…encore cinq minutes…', 'Zzz… ronron…'],
};
// Phrases des starters (leur cri remplace le « Miaou »).
const SAY_MON = {
  any: ['Tu as coché tes habitudes ?', 'J’aime bien ton agenda.', 'Tu gères !', 'On s’entraîne aujourd’hui ?', 'Je deviens plus fort grâce à toi.', 'Une petite sieste et je reviens.'],
  happy: ['Merci pour le festin !', 'Je me sens en forme !', 'Trop bien !', 'Meilleur dresseur du monde.'],
  hungry: ['J’ai un peu faim…', 'Un festin, s’il te plaît ?', 'Coche 4 habitudes, s’il te plaît !'],
  plante: ['Ça sent bon la forêt.', 'J’ai caché un gland quelque part…', 'Un peu de soleil et ça repart !'],
  eau: ['Il faut boire de l’eau !', 'Je fais des bulles.', 'Le calme avant la vague.'],
  feu: ['Je suis tout chaud !', 'Ma flamme brille fort aujourd’hui.', 'Allez, on s’enflamme !'],
};
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const cap1 = (x) => x.charAt(0).toUpperCase() + x.slice(1);

const Heart = ({ size = 18, color = '#E8738A' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.5 3 5 6.4 5c2 0 3.3 1.1 4 2.3h3.2C14.3 6.1 15.6 5 17.6 5 21 5 23.1 8.5 21.6 11.8 19.5 16.4 12 21 12 21z" fill={color} />
  </Svg>
);

function FloatingHeart({ x, y, onDone }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(v, { toValue: 1, duration: 1100, easing: Easing.out(Easing.quad), useNativeDriver: false }).start(onDone);
  }, []);
  return (
    <Animated.View pointerEvents="none" style={{
      position: 'absolute', left: x, top: y,
      opacity: v.interpolate({ inputRange: [0, 0.7, 1], outputRange: [1, 1, 0] }),
      transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, -80] }) }, { scale: v.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0.4, 1.1, 0.9] }) }],
    }}>
      <Heart />
    </Animated.View>
  );
}

// Le chat vivant : il respire, cligne des yeux, bouge la queue, parle,
// et réagit quand on le touche ou qu'on le caresse (glisser le doigt dessus).
export default function Cat({ look, kind, species, stage, mood, size = 200, name, message, scene = null }) {
  const starter = isStarter(species);
  const breathe = useRef(new Animated.Value(0)).current;
  const hop = useRef(new Animated.Value(0)).current;
  const bubbleV = useRef(new Animated.Value(0)).current;
  const [time, setTime] = useState(0);
  const [blink, setBlink] = useState(false);
  const [bubble, setBubble] = useState('');
  const [hearts, setHearts] = useState([]);
  const [purring, setPurring] = useState(false);
  const live = useRef({});
  live.current = { mood, stage, size, scene, species };
  const hideT = useRef(null), purrT = useRef(null);

  const say = (txt, ms = 2200) => {
    setBubble(txt);
    bubbleV.setValue(0);
    Animated.spring(bubbleV, { toValue: 1, friction: 6, useNativeDriver: false }).start();
    clearTimeout(hideT.current);
    hideT.current = setTimeout(() => Animated.timing(bubbleV, { toValue: 0, duration: 250, useNativeDriver: false }).start(), ms);
  };
  const randomLine = () => {
    const { mood: m, stage: st, scene: sc } = live.current;
    if (sc && SAY[sc]) return pick(SAY[sc]);
    const sp = live.current.species;
    if (isStarter(sp)) {
      const pool = [...SPECIES[sp].cry, ...SAY_MON.any, ...(SAY_MON[sp] || []), ...(m === 'hungry' ? SAY_MON.hungry.concat(SAY_MON.hungry) : m === 'happy' ? SAY_MON.happy : [])];
      return pick(pool);
    }
    const pool = [...SAY.any, ...(m === 'hungry' ? SAY.hungry.concat(SAY.hungry) : m === 'happy' ? SAY.happy : []), ...(st === 3 ? SAY.boss : [])];
    return pick(pool);
  };

  useEffect(() => {
    // Respiration
    const a = Animated.loop(Animated.sequence([
      Animated.timing(breathe, { toValue: 1, duration: 1300, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
      Animated.timing(breathe, { toValue: 0, duration: 1300, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
    ]));
    a.start();
    // Queue qui balance doucement
    let t0 = Date.now();
    const tailI = setInterval(() => setTime((Date.now() - t0) / 1000), 60);
    // Clignement des yeux de temps en temps
    let blinkT;
    const loopBlink = () => {
      blinkT = setTimeout(() => { setBlink(true); setTimeout(() => setBlink(false), 140); loopBlink(); }, 2500 + Math.random() * 3000);
    };
    loopBlink();
    // Une phrase au hasard toutes les 7 à 12 secondes
    let talkT;
    const loopTalk = () => { talkT = setTimeout(() => { say(randomLine()); loopTalk(); }, 7000 + Math.random() * 5000); };
    const first = setTimeout(() => say(randomLine()), 1200);
    loopTalk();
    return () => { a.stop(); clearInterval(tailI); clearTimeout(blinkT); clearTimeout(talkT); clearTimeout(first); clearTimeout(hideT.current); clearTimeout(purrT.current); };
  }, []);

  // Message envoyé par l'écran (par exemple quand on le nourrit).
  useEffect(() => {
    if (message && message.text) { say(message.text, 2200); jump(); for (let i = 0; i < 3; i++) setTimeout(heart, i * 150); }
  }, [message && message.id]);

  // Quand la scène change (travail, pause…), il le dit tout de suite.
  const firstScene = useRef(true);
  useEffect(() => {
    if (firstScene.current) { firstScene.current = false; return; }
    if (scene && SAY[scene]) say(pick(SAY[scene]));
  }, [scene]);

  const jump = () => {
    hop.setValue(0);
    Animated.sequence([
      Animated.timing(hop, { toValue: 1, duration: 140, easing: Easing.out(Easing.quad), useNativeDriver: false }),
      Animated.timing(hop, { toValue: 0, duration: 260, easing: Easing.bounce, useNativeDriver: false }),
    ]).start();
  };
  const heart = () => {
    const id = Date.now() + Math.random();
    const x = live.current.size * (0.3 + Math.random() * 0.4);
    setHearts((h) => [...h.slice(-8), { id, x }]);
  };
  const purr = () => {
    setPurring(true);
    clearTimeout(purrT.current);
    purrT.current = setTimeout(() => setPurring(false), 1600);
  };

  // Geste : un toucher = il répond ; un glissement = une caresse.
  const acc = useRef(0);
  const pan = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderTerminationRequest: () => false,
    onPanResponderGrant: () => { acc.current = 0; },
    onPanResponderMove: (e, g) => {
      const d = Math.abs(g.vx) + Math.abs(g.vy);
      acc.current += d * 16;
      if (acc.current > 60) {
        acc.current = 0;
        heart();
        purr();
        if (Math.random() < 0.25) say(pick(live.current.scene === 'sleep' ? SAY.sleepTap : isStarter(live.current.species) ? ['Hihi !', 'Encore !', 'Ça chatouille !', ...SPECIES[live.current.species].cry] : SAY.pet), 1500);
        try { Vibration.vibrate(10); } catch (err) {}
      }
    },
    onPanResponderRelease: (e, g) => {
      if (Math.abs(g.dx) < 6 && Math.abs(g.dy) < 6) {
        // Endormi : il remue à peine sans se réveiller.
        if (live.current.scene === 'sleep') { say(pick(SAY.sleepTap), 1500); heart(); return; }
        jump(); say(pick(isStarter(live.current.species) ? SPECIES[live.current.species].cry : SAY.tap), 1500); heart();
      }
    },
  })).current;

  const sleeping = scene === 'sleep';
  // Endormi : queue presque immobile et respiration lente et profonde.
  const tail = sleeping ? 16 + Math.sin(time * 0.8) * 2 : Math.sin(time / 0.45) * 9;
  const sleepBreath = sleeping ? Math.sin(time * 1.3) : 0;
  const shownMood = purring && !sleeping ? 'happy' : mood;
  // En promenade : il va et vient, et se retourne dans le sens de la marche.
  const walkX = scene === 'walk' ? Math.sin(time * 0.6) * size * 0.3 : 0;
  const face = scene === 'walk' && Math.cos(time * 0.6) > 0 ? -1 : 1;
  const bob = scene === 'walk' ? -Math.abs(Math.sin(time * 7)) * 3 : 0;
  const il = look && look.sex === 'f' ? 'elle' : 'il';
  const hint = sleeping ? (purring ? cap1(il) + (starter ? ' sourit en dormant…' : ' ronronne en dormant…') : 'Chut, ' + il + ' fait la sieste') : purring ? (starter ? cap1(il) + ' adore ça !' : 'Ronron…') : scene === 'work' ? 'On bosse ensemble' : scene ? 'C’est la pause' : 'Touche-le ou caresse-le avec le doigt';
  return (
    <View style={{ width: size, alignItems: 'center' }}>
      <Animated.View pointerEvents="none" style={{
        position: 'absolute', top: -6, zIndex: 3, maxWidth: size * 1.1,
        opacity: bubbleV, transform: [{ scale: bubbleV.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }],
      }}>
        <View style={{ backgroundColor: '#FFFFFF', paddingVertical: 7, paddingHorizontal: 12, borderRadius: 16, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } }}>
          <Text style={{ color: '#15151B', fontSize: 14, fontWeight: '600', textAlign: 'center' }}>{bubble}</Text>
        </View>
        <View style={{ alignSelf: 'center', width: 12, height: 12, backgroundColor: '#FFFFFF', transform: [{ rotate: '45deg' }], marginTop: -6 }} />
      </Animated.View>
      <View {...pan.panHandlers} accessibilityRole="button" accessibilityLabel={'Caresser ' + (name || 'ton compagnon')}
        style={{ paddingTop: 40, cursor: 'grab', userSelect: 'none' }}>
        <View style={{ transform: [{ translateX: walkX }, { translateY: bob + sleepBreath * 1.5 }, { scaleX: face }, { scaleY: 1 + sleepBreath * 0.012 }] }}>
        <Animated.View style={{
          transform: [
            { translateY: Animated.add(breathe.interpolate({ inputRange: [0, 1], outputRange: [0, -3] }), hop.interpolate({ inputRange: [0, 1], outputRange: [0, -22] })) },
            { scaleY: breathe.interpolate({ inputRange: [0, 1], outputRange: [1, 1.015] }) },
          ],
        }}>
          <PetDrawing species={species} look={look} kind={kind} stage={stage} mood={shownMood} size={size} tail={(purring || scene === 'walk') && !sleeping ? tail * 2 : tail} blink={blink && !purring && !sleeping} scene={scene} t={time} />
        </Animated.View>
        </View>
        {hearts.map((h) => <FloatingHeart key={h.id} x={h.x} y={40 + size * 0.42} onDone={() => setHearts((a) => a.filter((z) => z.id !== h.id))} />)}
      </View>
      <Text style={{ color: '#8A8998', fontSize: 12, marginTop: 2, opacity: purring ? 1 : 0.8 }}>{hint}</Text>
    </View>
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
