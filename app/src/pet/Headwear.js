// Chapeaux et lunettes, partagés par le chat et les monstres.
// La tête est une ellipse de centre (cx, hy), de rayon hr (largeur) et 0.9 hr (hauteur).
// ex : écart des yeux depuis le centre (en fraction de hr), ey : hauteur des yeux.
import React from 'react';
import { Circle, Ellipse, G, Line, Path, Rect } from 'react-native-svg';
import { shade } from './looks';
import { Polygon, pts } from './shapes';

export default function Headwear({ L, P, cx, hy, hr, stage = 0, boss = false, ex = 0.4, ey = -0.04, er = 0.24 }) {
  const eY = hy + hr * ey;
  const glasses = L.acc === 'lunettes' || (boss && L.acc !== 'soleil' && L.acc !== 'monocle');
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
      case 'couronne': {
        const y0 = hy - hr * 0.76, w = hr * 0.92;
        const peaks = [[cx - w / 2, y0 - hr * 0.44], [cx, y0 - hr * 0.52], [cx + w / 2, y0 - hr * 0.44]];
        return (
          <G>
            <Polygon points={pts([[cx - w / 2, y0], peaks[0], [cx - w / 4, y0 - hr * 0.22], peaks[1], [cx + w / 4, y0 - hr * 0.22], peaks[2], [cx + w / 2, y0]])}
              fill="#E8B83A" stroke="#B8862F" strokeWidth="1.5" strokeLinejoin="round" />
            <Rect x={cx - w / 2} y={y0 - hr * 0.12} width={w} height={hr * 0.12} fill="#D9A62E" />
            {peaks.map(([x, y], i) => <Circle key={i} cx={x} cy={y} r="2.6" fill="#F6D77A" />)}
            <Circle cx={cx} cy={y0 - hr * 0.2} r={hr * 0.08} fill={P.accent} />
            <Circle cx={cx - w * 0.3} cy={y0 - hr * 0.08} r={hr * 0.045} fill="#FFFFFF" opacity="0.9" />
            <Circle cx={cx + w * 0.3} cy={y0 - hr * 0.08} r={hr * 0.045} fill="#FFFFFF" opacity="0.9" />
          </G>
        );
      }
      case 'haut':
        return (
          <G>
            <Rect x={cx - hr * 0.42} y={hy - hr * 1.62} width={hr * 0.84} height={hr * 0.84} rx="3" fill="#22222A" />
            <Rect x={cx - hr * 0.42} y={hy - hr * 0.98} width={hr * 0.84} height={hr * 0.15} fill={P.accent} />
            <Ellipse cx={cx} cy={hy - hr * 0.8} rx={hr * 0.76} ry={hr * 0.13} fill="#17171D" />
            <Line x1={cx - hr * 0.3} y1={hy - hr * 1.52} x2={cx - hr * 0.3} y2={hy - hr * 1.08} stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.18" />
          </G>
        );
      case 'bonnet': {
        const col = P.accent, colD = shade(P.accent, 0.8);
        return (
          <G>
            <Path d={`M${cx - hr * 0.8} ${hy - hr * 0.5} Q${cx - hr * 0.8} ${hy - hr * 1.28} ${cx} ${hy - hr * 1.28} Q${cx + hr * 0.8} ${hy - hr * 1.28} ${cx + hr * 0.8} ${hy - hr * 0.5} Z`} fill={col} />
            <G stroke={colD} strokeWidth="1.6" strokeLinecap="round">
              {[-0.45, -0.15, 0.15, 0.45].map((d) => <Line key={d} x1={cx + hr * d} y1={hy - hr * 0.66} x2={cx + hr * d * 0.8} y2={hy - hr * 1.12} />)}
            </G>
            <Rect x={cx - hr * 0.86} y={hy - hr * 0.7} width={hr * 1.72} height={hr * 0.26} rx={hr * 0.12} fill={colD} />
            <Circle cx={cx} cy={hy - hr * 1.32} r={hr * 0.17} fill="#FFFFFF" />
          </G>
        );
      }
      case 'casque':
        return (
          <G>
            <Path d={`M${cx - hr * 0.94} ${hy - hr * 0.1} Q${cx - hr * 0.98} ${hy - hr * 1.32} ${cx} ${hy - hr * 1.3} Q${cx + hr * 0.98} ${hy - hr * 1.32} ${cx + hr * 0.94} ${hy - hr * 0.1}`}
              stroke="#2B2B35" strokeWidth={hr * 0.13} strokeLinecap="round" fill="none" />
            {[-1, 1].map((d) => (
              <G key={d}>
                <Rect x={cx + d * hr * 0.95 - hr * 0.17} y={hy - hr * 0.36} width={hr * 0.34} height={hr * 0.56} rx={hr * 0.14} fill={P.accent} />
                <Rect x={cx + d * hr * 0.95 - hr * 0.07} y={hy - hr * 0.28} width={hr * 0.14} height={hr * 0.4} rx={hr * 0.07} fill={shade(P.accent, 0.75)} />
              </G>
            ))}
          </G>
        );
      case 'noeud': {
        const bx = cx + hr * 0.5, by = hy - hr * 0.84;
        return (
          <G fill={P.accent}>
            <Path d={`M${bx} ${by} L${bx - hr * 0.32} ${by - hr * 0.2} L${bx - hr * 0.3} ${by + hr * 0.2} Z`} strokeLinejoin="round" stroke={P.accent} strokeWidth="2" />
            <Path d={`M${bx} ${by} L${bx + hr * 0.32} ${by - hr * 0.2} L${bx + hr * 0.3} ${by + hr * 0.2} Z`} strokeLinejoin="round" stroke={P.accent} strokeWidth="2" />
            <Circle cx={bx} cy={by} r={hr * 0.1} fill={shade(P.accent, 0.8)} />
          </G>
        );
      }
      default:
        return null;
    }
  };
  return (
    <G>
      {glasses ? (
        <G stroke="#17171D" strokeWidth="2.5" fill="none">
          <Circle cx={cx - hr * ex} cy={eY} r={hr * er} />
          <Circle cx={cx + hr * ex} cy={eY} r={hr * er} />
          <Line x1={cx - hr * (ex - er)} y1={eY - hr * 0.02} x2={cx + hr * (ex - er)} y2={eY - hr * 0.02} />
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
      {L.acc === 'monocle' ? (
        <G>
          <Circle cx={cx + hr * ex} cy={eY} r={hr * (er + 0.03)} stroke="#C9A23A" strokeWidth="2.6" fill="rgba(255,255,255,0.16)" />
          <Path d={`M${cx + hr * 0.6} ${hy + hr * 0.16} Q${cx + hr * 0.86} ${hy + hr * 0.6} ${cx + hr * 0.56} ${hy + hr * 0.98}`} stroke="#C9A23A" strokeWidth="1.3" fill="none" />
        </G>
      ) : null}
      {hat()}
    </G>
  );
}
