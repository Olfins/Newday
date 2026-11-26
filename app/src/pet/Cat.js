// Les chats dessinés en traits simples (pas d'images). L'apparence vient des choix
// de l'utilisateur (voir looks.js) : pelage, motif, yeux, accessoire, tenue, couleurs.
// Quatre tailles (chaton, jeune, adulte, PDG) et trois humeurs.
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, PanResponder, Text, Vibration, View } from 'react-native';
import Svg, { Circle, Ellipse, G, Line, Path, Rect } from 'react-native-svg';
import { lookOf, palette } from './looks';

const pts = (a) => a.map((p) => p.map((v) => +v.toFixed(2)).join(',')).join(' ');
// Les polygones sont dessinés comme des tracés (plus simple et identique partout).
// Attention : pas de « key » sur les groupes de la tête. Sur le web, ils laissaient
// les anciennes oreilles à l'écran quand le chat changeait de taille.
const Polygon = ({ points, ...rest }) => <Path d={'M' + points.split(' ').join(' L') + ' Z'} {...rest} />;
const toward = (p, c, f) => [p[0] + (c[0] - p[0]) * f, p[1] + (c[1] - p[1]) * f];

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
  const mood = scene === 'work' ? 'ok' : holds && sip > 0.85 ? 'happy' : scene ? 'happy' : mood0;
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

  const jacket = L.out === 'cravate' || L.out === 'noeud';
  const tie = (
    <G fill={P.accent}>
      <Polygon points={pts([[cx - 5, top + 2], [cx + 5, top + 2], [cx + 3, top + 9], [cx - 3, top + 9]])} />
      <Polygon points={pts([[cx - 3, top + 9], [cx + 3, top + 9], [cx + 6, top + bh * 0.34], [cx, top + bh * 0.42], [cx - 6, top + bh * 0.34]])} />
    </G>
  );
  const bodyPath = `M${cx - bw / 2} ${base} L${cx - bw / 2} ${top + 18} Q${cx - bw / 2} ${top} ${cx - bw / 2 + 18} ${top} L${cx + bw / 2 - 18} ${top} Q${cx + bw / 2} ${top} ${cx + bw / 2} ${top + 18} L${cx + bw / 2} ${base} Z`;

  // Accessoire : lunettes ou chapeau. Les lunettes remplacent celles du PDG.
  const glasses = L.acc === 'lunettes' || (stage === 3 && L.acc !== 'soleil');
  const hat = () => {
    switch (L.acc) {
      case 'feutre':
        return (
          <G>
            <Path d={`M${cx - hr * 0.5} ${hy - hr * 0.8} L${cx - hr * 0.4} ${hy - hr * 1.36} Q${cx} ${hy - hr * 1.18} ${cx + hr * 0.4} ${hy - hr * 1.36} L${cx + hr * 0.5} ${hy - hr * 0.8} Z`} fill={P.dark ? '#8C8070' : '#3D3B4A'} />
            <Rect x={cx - hr * 0.49} y={hy - hr * 0.97} width={hr * 0.98} height={hr * 0.13} fill={P.accent} />
            <Ellipse cx={cx} cy={hy - hr * 0.8} rx={hr * 0.88} ry={hr * 0.14} fill={P.dark ? '#73695C' : '#2E2C3A'} />
          </G>
        );
      case 'beret':
        return (
          <G>
            <Ellipse cx={cx + hr * 0.1} cy={hy - hr * 0.8} rx={hr * 0.62} ry={hr * 0.24} fill={P.accent} />
            <Path d={`M${cx - hr * 0.42} ${hy - hr * 0.72} Q${cx} ${hy - hr * 0.62} ${cx + hr * 0.5} ${hy - hr * 0.7}`} stroke={P.accent} strokeWidth="4" strokeLinecap="round" fill="none" />
            <Line x1={cx + hr * 0.1} y1={hy - hr * 1.03} x2={cx + hr * 0.16} y2={hy - hr * 1.13} stroke={P.accent} strokeWidth="3" strokeLinecap="round" />
          </G>
        );
      case 'casquette':
        return (
          <G>
            <Ellipse cx={cx + hr * 0.42} cy={hy - hr * 0.7} rx={hr * 0.42} ry={hr * 0.1} fill={P.suitD} />
            <Path d={`M${cx - hr * 0.56} ${hy - hr * 0.68} Q${cx - hr * 0.52} ${hy - hr * 1.22} ${cx} ${hy - hr * 1.22} Q${cx + hr * 0.52} ${hy - hr * 1.22} ${cx + hr * 0.56} ${hy - hr * 0.68} Z`} fill={P.suit} />
            <Circle cx={cx} cy={hy - hr * 1.2} r="2.6" fill={P.accent} />
            <Line x1={cx} y1={hy - hr * 1.18} x2={cx} y2={hy - hr * 0.72} stroke={P.suitD} strokeWidth="1.2" />
          </G>
        );
      default:
        return null;
    }
  };

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
      ) : (
        <G>
          <Path d={bodyPath} fill={P.suit} />
          <Polygon points={pts([[cx - 13, top], [cx + 13, top], [cx, top + bh * 0.44]])} fill="#FFFFFF" />
          <Polygon points={pts([[cx - 13, top], [cx - 26, top + 3], [cx - 2, top + bh * 0.5]])} fill={P.suitD} />
          <Polygon points={pts([[cx + 13, top], [cx + 26, top + 3], [cx + 2, top + bh * 0.5]])} fill={P.suitD} />
          {L.out === 'cravate' ? tie : (
            <G fill={P.accent}>
              <Path d={`M${cx} ${top + 6} L${cx - 13} ${top} L${cx - 13} ${top + 12} Z`} />
              <Path d={`M${cx} ${top + 6} L${cx + 13} ${top} L${cx + 13} ${top + 12} Z`} />
              <Circle cx={cx} cy={top + 6} r="3.5" />
            </G>
          )}
          <Circle cx={cx} cy={top + bh * 0.6} r="2.4" fill={P.suitD} />
          <Circle cx={cx} cy={top + bh * 0.76} r="2.4" fill={P.suitD} />
          {stage >= 2 ? <Polygon points={pts([[cx - bw / 2 + 9, top + bh * 0.34], [cx - bw / 2 + 21, top + bh * 0.34], [cx - bw / 2 + 15, top + bh * 0.26]])} fill="#FFFFFF" /> : null}
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
      {glasses ? (
        <G stroke="#17171D" strokeWidth="2.5" fill="none">
          <Circle cx={cx - hr * 0.4} cy={hy - hr * 0.04} r={hr * 0.24} />
          <Circle cx={cx + hr * 0.4} cy={hy - hr * 0.04} r={hr * 0.24} />
          <Line x1={cx - hr * 0.16} y1={hy - hr * 0.06} x2={cx + hr * 0.16} y2={hy - hr * 0.06} />
        </G>
      ) : null}
      {L.acc === 'soleil' ? (
        <G>
          <Rect x={cx - hr * 0.68} y={hy - hr * 0.2} width={hr * 0.56} height={hr * 0.34} rx={hr * 0.12} fill="#17171D" />
          <Rect x={cx + hr * 0.12} y={hy - hr * 0.2} width={hr * 0.56} height={hr * 0.34} rx={hr * 0.12} fill="#17171D" />
          <Line x1={cx - hr * 0.14} y1={hy - hr * 0.1} x2={cx + hr * 0.14} y2={hy - hr * 0.1} stroke="#17171D" strokeWidth="2.5" />
          <Line x1={cx - hr * 0.56} y1={hy - hr * 0.1} x2={cx - hr * 0.44} y2={hy - hr * 0.02} stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
          <Line x1={cx + hr * 0.24} y1={hy - hr * 0.1} x2={cx + hr * 0.36} y2={hy - hr * 0.02} stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        </G>
      ) : null}
      {hat()}
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

// Le bureau avec l'ordinateur portable ; les pattes tapent au clavier.
function Desk({ P, cx, bw, top, t }) {
  const lift = (ph) => Math.max(0, Math.sin(t * 13 + ph)) * 5;
  const lx = cx - 48, rx = cx + 48, py = 190;
  const l1 = lift(0), l2 = lift(Math.PI);
  return (
    <G>
      <Line x1={cx - bw / 2 + 8} y1={top + 18} x2={lx} y2={py - l1} stroke={P.arm} strokeWidth="12" strokeLinecap="round" />
      <Line x1={cx + bw / 2 - 8} y1={top + 18} x2={rx} y2={py - l2} stroke={P.arm} strokeWidth="12" strokeLinecap="round" />
      <Rect x="6" y="196" width="188" height="10" rx="4" fill="#C9AE8E" />
      <Rect x="6" y="204" width="188" height="6" rx="3" fill="#B39674" />
      <Rect x={cx - 38} y="150" width="76" height="46" rx="6" fill="#E4E3EC" stroke="#C9C8D6" strokeWidth="2" />
      <Circle cx={cx} cy="173" r="5" fill="#6C5FD4" opacity={0.6 + 0.4 * Math.abs(Math.sin(t * 2))} />
      <Rect x={cx - 44} y="193" width="88" height="5" rx="2.5" fill="#B9B8C8" />
      <Ellipse cx={lx} cy={py - l1} rx="9" ry="6" fill={P.paw} />
      <Ellipse cx={rx} cy={py - l2} rx="9" ry="6" fill={P.paw} />
      {/* Petits traits de frappe */}
      {l1 > 3 ? <Path d={`M${lx - 12} ${py - 12} l-4 -4 M${lx - 4} ${py - 15} l0 -5`} stroke="#8A8998" strokeWidth="1.6" strokeLinecap="round" /> : null}
      {l2 > 3 ? <Path d={`M${rx + 12} ${py - 12} l4 -4 M${rx + 4} ${py - 15} l0 -5`} stroke="#8A8998" strokeWidth="1.6" strokeLinecap="round" /> : null}
      {/* Une petite plante sur le bureau */}
      <Rect x="176" y="182" width="14" height="14" rx="3" fill="#F0EEF8" stroke="#D5D2E8" strokeWidth="1.5" />
      <Path d="M183 182 C178 174 174 172 172 168 M183 182 C184 172 188 168 192 165 M183 182 C182 176 183 172 183 168" stroke="#7FB77E" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </G>
  );
}

// La patte qui tient un café, un verre d'eau ou un biscuit.
function Hold({ P, scene, cx, bw, top, bh, hr, my, sip, t }) {
  const rest = [cx + bw / 2 + 4, top + bh * 0.55];
  const mouthP = [cx + hr * 0.24, my + 8];
  const hx = rest[0] + (mouthP[0] - rest[0]) * sip;
  const hy = rest[1] + (mouthP[1] - rest[1]) * sip;
  const tilt = scene === 'snack' ? 0 : -sip * 28;
  let item = null;
  if (scene === 'coffee') {
    const steam = (k) => {
      const o = ((t * 0.8 + k * 0.5) % 1);
      return <Path key={k} d={`M${hx - 3 + k * 6} ${hy - 12 - o * 14} q3 -4 0 -8 q-3 -4 0 -8`} stroke="#B5B3C6" strokeWidth="2" strokeLinecap="round" fill="none" opacity={1 - o} />;
    };
    item = (
      <G>
        {sip < 0.5 ? [0, 1].map(steam) : null}
        <G transform={`rotate(${tilt.toFixed(1)} ${hx} ${hy})`}>
          <Path d={`M${hx + 8} ${hy - 4} q8 0 8 6 q0 6 -8 6`} stroke="#FFFFFF" strokeWidth="3" fill="none" />
          <Rect x={hx - 9} y={hy - 9} width="18" height="20" rx="4" fill="#FFFFFF" stroke="#D5D2E8" strokeWidth="1.5" />
          <Rect x={hx - 9} y={hy - 2} width="18" height="5" fill="#6C5FD4" />
        </G>
      </G>
    );
  } else if (scene === 'water') {
    item = (
      <G transform={`rotate(${tilt.toFixed(1)} ${hx} ${hy})`}>
        <Polygon points={pts([[hx - 9, hy - 12], [hx + 9, hy - 12], [hx + 7, hy + 12], [hx - 7, hy + 12]])} fill="rgba(255,255,255,0.7)" stroke="#9CC7F0" strokeWidth="1.8" />
        <Polygon points={pts([[hx - 8, hy - 2], [hx + 8, hy - 2], [hx + 7, hy + 11], [hx - 7, hy + 11]])} fill="#9CC7F0" opacity="0.8" />
      </G>
    );
  } else {
    const crumb = (k) => {
      const o = ((t * 1.2 + k * 0.33) % 1);
      return <Circle key={k} cx={hx - 6 + k * 6} cy={hy + 8 + o * 30} r="1.6" fill="#C98A4B" opacity={1 - o} />;
    };
    item = (
      <G>
        {sip > 0.6 ? [0, 1, 2].map(crumb) : null}
        <Circle cx={hx} cy={hy - 4} r="10" fill="#D9A066" />
        {[[-4, -7], [3, -2], [-2, 1], [5, -9]].map(([a, b], i) => <Circle key={i} cx={hx + a} cy={hy + b} r="1.6" fill="#6B4A2B" />)}
      </G>
    );
  }
  return (
    <G>
      <Line x1={cx + bw / 2 - 8} y1={top + 16} x2={hx} y2={hy + 4} stroke={P.arm} strokeWidth="12" strokeLinecap="round" />
      <G transform={`translate(${hx} ${hy}) scale(1.5) translate(${-hx} ${-hy})`}>
        {item}
        <Ellipse cx={hx + 2} cy={hy + 5} rx="6" ry="5" fill={P.paw} />
      </G>
    </G>
  );
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
};
const pick = (a) => a[Math.floor(Math.random() * a.length)];

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
export default function Cat({ look, kind, stage, mood, size = 200, name, message, scene = null }) {
  const breathe = useRef(new Animated.Value(0)).current;
  const hop = useRef(new Animated.Value(0)).current;
  const bubbleV = useRef(new Animated.Value(0)).current;
  const [time, setTime] = useState(0);
  const [blink, setBlink] = useState(false);
  const [bubble, setBubble] = useState('');
  const [hearts, setHearts] = useState([]);
  const [purring, setPurring] = useState(false);
  const live = useRef({});
  live.current = { mood, stage, size, scene };
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
        if (Math.random() < 0.25) say(pick(SAY.pet), 1500);
        try { Vibration.vibrate(10); } catch (err) {}
      }
    },
    onPanResponderRelease: (e, g) => {
      if (Math.abs(g.dx) < 6 && Math.abs(g.dy) < 6) { jump(); say(pick(SAY.tap), 1500); heart(); }
    },
  })).current;

  const tail = Math.sin(time / 0.45) * 9;
  const shownMood = purring ? 'happy' : mood;
  // En promenade : il va et vient, et se retourne dans le sens de la marche.
  const walkX = scene === 'walk' ? Math.sin(time * 0.6) * size * 0.3 : 0;
  const face = scene === 'walk' && Math.cos(time * 0.6) > 0 ? -1 : 1;
  const bob = scene === 'walk' ? -Math.abs(Math.sin(time * 7)) * 3 : 0;
  const hint = purring ? 'Ronron…' : scene === 'work' ? 'On bosse ensemble' : scene ? 'C’est la pause' : 'Touche-le ou caresse-le avec le doigt';
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
      <View {...pan.panHandlers} accessibilityRole="button" accessibilityLabel={'Caresser ' + (name || 'le chat')}
        style={{ paddingTop: 40, cursor: 'grab', userSelect: 'none' }}>
        <View style={{ transform: [{ translateX: walkX }, { translateY: bob }, { scaleX: face }] }}>
        <Animated.View style={{
          transform: [
            { translateY: Animated.add(breathe.interpolate({ inputRange: [0, 1], outputRange: [0, -3] }), hop.interpolate({ inputRange: [0, 1], outputRange: [0, -22] })) },
            { scaleY: breathe.interpolate({ inputRange: [0, 1], outputRange: [1, 1.015] }) },
          ],
        }}>
          <CatDrawing look={look} kind={kind} stage={stage} mood={shownMood} size={size} tail={purring || scene === 'walk' ? tail * 2 : tail} blink={blink && !purring} scene={scene} t={time} />
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
