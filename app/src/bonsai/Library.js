// La pièce : une bibliothèque dont chaque étagère est une habitude, et le bonsaï sur sa sellette.
// Les livres arrivent quand l'habitude est faite et repartent quand elle est délaissée.
import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Defs, Ellipse, G, Line, Path, RadialGradient, Rect, Stop } from 'react-native-svg';
import { Bonsai } from './Bonsai';
import { palette, shade } from './items';

const VW = 360, VH = 300, FLOOR = 272;
const BC = { x: 14, w: 196, top: 52 }; // la bibliothèque

// Petit générateur pseudo-aléatoire stable (mêmes livres d'un jour à l'autre).
const rnd = (seed, i) => {
  let x = (seed * 9301 + i * 49297 + 233280) % 233280;
  x = (x * 9301 + 49297) % 233280;
  return x / 233280;
};
const hash = (s) => [...String(s)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 100000, 7);

function Books({ shelf, x, y, w, h, pal }) {
  const seed = hash(shelf.id);
  // Les emplacements possibles sur cette étagère.
  const slots = [];
  let cx = x + 3;
  for (let i = 0; i < 40; i++) {
    const bw = 6 + Math.floor(rnd(seed, i) * 5);
    if (cx + bw > x + w - 4) break;
    slots.push({ x: cx, w: bw, h: h * (0.68 + 0.26 * rnd(seed, i + 50)), tone: rnd(seed, i + 90) });
    cx += bw + 0.6;
  }
  const n = Math.round(shelf.fill * slots.length);
  const base = pal.books[shelf.i % pal.books.length];
  const shown = slots.slice(0, n);
  return (
    <G>
      {shown.map((b, i) => {
        const col = shade(base, (b.tone - 0.5) * 28);
        const lean = i === n - 1 && n < slots.length && n > 1;
        const by = y + h - b.h;
        return (
          <G key={i} transform={lean ? `rotate(14 ${b.x + b.w} ${y + h})` : undefined}>
            <Rect x={b.x} y={by} width={b.w} height={b.h} rx={0.8} fill={col} />
            <Rect x={b.x + b.w - 1.2} y={by} width={1.2} height={b.h} fill="#000" opacity={0.18} />
            <Line x1={b.x + 1} x2={b.x + b.w - 1} y1={by + 4} y2={by + 4} stroke={pal.gold} strokeWidth={0.8} opacity={0.75} />
            <Line x1={b.x + 1} x2={b.x + b.w - 1} y1={y + h - 4} y2={y + h - 4} stroke={pal.gold} strokeWidth={0.8} opacity={0.75} />
            {b.tone > 0.6 ? <Rect x={b.x + 1.4} y={by + b.h * 0.32} width={b.w - 2.8} height={b.h * 0.16} fill={pal.gold} opacity={0.35} /> : null}
          </G>
        );
      })}
    </G>
  );
}

// L'objet posé sur la bibliothèque.
function TopObject({ id, x, y, pal }) {
  if (id === 'lampe') {
    return (
      <G>
        <Circle cx={x} cy={y - 14} r={34} fill="url(#lamp)" />
        <Rect x={x - 9} y={y - 3} width={18} height={3} rx={1} fill="#B8923F" />
        <Rect x={x - 1} y={y - 18} width={2} height={15} fill="#B8923F" />
        <Path d={`M${x - 14} ${y - 16} Q${x} ${y - 30} ${x + 14} ${y - 16} Z`} fill="#2F5A40" />
        <Rect x={x - 14} y={y - 17} width={28} height={2} fill="#C8A24E" />
      </G>
    );
  }
  if (id === 'globe') {
    return (
      <G>
        <Rect x={x - 8} y={y - 3} width={16} height={3} rx={1} fill="#6A4A30" />
        <Rect x={x - 1} y={y - 8} width={2} height={5} fill="#6A4A30" />
        <Circle cx={x} cy={y - 20} r={12} fill="#C9B27A" />
        <Path d={`M${x - 8} ${y - 26} Q${x - 2} ${y - 22} ${x - 4} ${y - 16} Q${x - 9} ${y - 18} ${x - 8} ${y - 26} Z M${x + 2} ${y - 29} Q${x + 9} ${y - 24} ${x + 6} ${y - 14} Q${x + 1} ${y - 20} ${x + 2} ${y - 29} Z`} fill="#7E8A5A" />
        <Path d={`M${x - 14} ${y - 20} A14 14 0 0 1 ${x + 10} ${y - 30}`} stroke="#B8923F" strokeWidth={1.4} fill="none" />
      </G>
    );
  }
  if (id === 'sablier') {
    return (
      <G>
        <Rect x={x - 8} y={y - 3} width={16} height={3} fill="#6A4A30" />
        <Rect x={x - 8} y={y - 30} width={16} height={3} fill="#6A4A30" />
        <Path d={`M${x - 6} ${y - 27} L${x + 6} ${y - 27} L${x + 1} ${y - 15} L${x + 6} ${y - 3} L${x - 6} ${y - 3} L${x - 1} ${y - 15} Z`} fill="#E8E2D2" opacity={0.6} />
        <Path d={`M${x - 4} ${y - 3} L${x + 4} ${y - 3} L${x} ${y - 9} Z M${x - 3} ${y - 24} L${x + 3} ${y - 24} L${x} ${y - 18} Z`} fill="#C8A24E" />
        <Line x1={x - 7} x2={x - 7} y1={y - 27} y2={y - 3} stroke="#6A4A30" strokeWidth={1.2} />
        <Line x1={x + 7} x2={x + 7} y1={y - 27} y2={y - 3} stroke="#6A4A30" strokeWidth={1.2} />
      </G>
    );
  }
  if (id === 'pendule') {
    return (
      <G>
        <Path d={`M${x - 13} ${y} L${x - 13} ${y - 22} Q${x} ${y - 36} ${x + 13} ${y - 22} L${x + 13} ${y} Z`} fill="#4A3020" />
        <Circle cx={x} cy={y - 20} r={8} fill="#EFE7D4" stroke="#B8923F" strokeWidth={1.4} />
        <Line x1={x} y1={y - 20} x2={x} y2={y - 25} stroke="#2A2420" strokeWidth={1.1} />
        <Line x1={x} y1={y - 20} x2={x + 4} y2={y - 18} stroke="#2A2420" strokeWidth={1.1} />
        <Rect x={x - 15} y={y - 2} width={30} height={2} fill="#B8923F" />
      </G>
    );
  }
  return null;
}

export default function Library({ shelves, g, health, setup, style }) {
  const pal = palette(setup);
  const n = Math.max(1, shelves.length);
  const inX = BC.x + 8, inW = BC.w - 16;
  const inTop = BC.top + 8, inBot = FLOOR - 14;
  const board = 5;
  const compH = (inBot - inTop - (n - 1) * board) / n;
  const fallen = health < 0.45 ? Math.round((0.45 - health) * 14) : 0;
  const tx = 280;

  return (
    <View style={[{ width: '100%', aspectRatio: VW / VH, borderRadius: 18, overflow: 'hidden' }, style]}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${VW} ${VH}`}>
        <Defs>
          <RadialGradient id="light" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={pal.glow} stopOpacity={pal.glowA} />
            <Stop offset="1" stopColor={pal.glow} stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="lamp" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor="#F4D58A" stopOpacity={pal.dark ? 0.35 : 0.55} />
            <Stop offset="1" stopColor="#F4D58A" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        {/* mur */}
        <Rect x={0} y={0} width={VW} height={FLOOR} fill={pal.wall} />
        {pal.stripes ? [...Array(24)].map((_, i) => <Rect key={i} x={i * 15} y={0} width={6} height={FLOOR} fill={pal.wall2} opacity={0.55} />) : null}
        {pal.lambris ? (
          <G>
            <Rect x={0} y={180} width={VW} height={FLOOR - 180} fill={pal.wood} opacity={0.9} />
            <Rect x={0} y={176} width={VW} height={5} fill={pal.edge} />
            {[0, 1, 2, 3, 4, 5].map((i) => <Rect key={i} x={8 + i * 60} y={192} width={48} height={66} rx={2} fill="none" stroke={pal.back} strokeWidth={1.4} opacity={0.6} />)}
          </G>
        ) : null}
        <Ellipse cx={tx} cy={130} rx={120} ry={130} fill="url(#light)" />
        {/* sol */}
        <Rect x={0} y={FLOOR} width={VW} height={VH - FLOOR} fill={pal.floor} />
        {[0, 1, 2].map((i) => <Line key={i} x1={0} x2={VW} y1={FLOOR + 8 + i * 8} y2={FLOOR + 8 + i * 8} stroke={pal.floorLine} strokeWidth={0.8} />)}
        <Rect x={0} y={FLOOR - 4} width={VW} height={4} fill={pal.floorLine} />

        {/* bibliothèque */}
        <Rect x={BC.x + 4} y={FLOOR - 2} width={BC.w - 8} height={4} fill="#000" opacity={0.18} />
        <Rect x={BC.x - 4} y={BC.top - 8} width={BC.w + 8} height={8} rx={1.5} fill={pal.edge} />
        <Rect x={BC.x} y={BC.top} width={BC.w} height={FLOOR - BC.top} fill={pal.wood} />
        <Rect x={inX} y={inTop} width={inW} height={inBot - inTop} fill={pal.back} />
        {shelves.map((s, i) => {
          const y = inTop + i * (compH + board);
          return (
            <G key={s.id}>
              <Books shelf={s} x={inX} y={y} w={inW} h={compH} pal={pal} />
              <Rect x={inX} y={y + compH} width={inW} height={board} fill={pal.wood} />
              <Rect x={inX} y={y + compH} width={inW} height={1} fill={pal.edge} />
            </G>
          );
        })}
        <Rect x={BC.x} y={inBot} width={BC.w} height={FLOOR - inBot} fill={pal.edge} opacity={0.6} />
        <TopObject id={setup.obj} x={BC.x + 40} y={BC.top - 8} pal={pal} />

        {/* le bonsaï */}
        <G transform={`translate(${tx} ${FLOOR})`}>
          <Bonsai g={g} health={health} pot={setup.pot} stand={setup.stand} dark={pal.dark} fallen={fallen} />
        </G>
      </Svg>
    </View>
  );
}

// Couleur du dos des livres d'une étagère (pour la légende sous la pièce).
export const bookColor = (setup, i) => { const p = palette(setup).books; return p[i % p.length]; };
