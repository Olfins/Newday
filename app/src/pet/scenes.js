// Scènes communes au chat et aux monstres : les « z » du sommeil, le bureau du Pomodoro,
// et la patte qui tient un café, un verre d'eau ou un biscuit.
import React from 'react';
import { Circle, Ellipse, G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';
import { Polygon, pts } from './shapes';

export function Zzz({ x, y, t }) {
  return (
    <G>
      {[0, 1, 2].map((i) => {
        const o = (t * 0.32 + i / 3) % 1;
        return (
          <SvgText key={i} x={x + o * 22} y={y - o * 46} fontSize={11 + o * 11} fontWeight="700" fill="#5E6B8C" opacity={o < 0.15 ? o / 0.15 : 1 - (o - 0.15) / 0.85}>z</SvgText>
        );
      })}
    </G>
  );
}

// Le bureau avec l'ordinateur portable ; les pattes tapent au clavier.
export function Desk({ P, cx, bw, top, t }) {
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
export function Hold({ P, scene, cx, bw, top, bh, hr, my, sip, t }) {
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
