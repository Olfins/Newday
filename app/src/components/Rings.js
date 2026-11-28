// Les statistiques en anneaux, présentées comme des diapositives (titre, filet, numéro de page).
import React from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { C } from '../theme';

// Un anneau de progression : pct de 0 à 100, valeur au centre.
export function Ring({ pct, size = 110, stroke = 10, value, unit, color, a11y }) {
  const r = (size - stroke) / 2;
  const L = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(100, pct || 0));
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }} accessible accessibilityLabel={a11y}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <G rotation={-90} origin={`${size / 2}, ${size / 2}`}>
          <Circle cx={size / 2} cy={size / 2} r={r} stroke={C.track} strokeWidth={stroke} fill="none" />
          {p > 0 ? (
            <Circle cx={size / 2} cy={size / 2} r={r} stroke={color || C.pri} strokeWidth={stroke} fill="none"
              strokeDasharray={`${(L * p) / 100} ${L}`} strokeLinecap="round" />
          ) : null}
        </G>
      </Svg>
      <Text style={{ fontFamily: C.serif, color: C.tx, fontSize: size * 0.24, fontWeight: '700', fontVariant: ['tabular-nums'] }}>
        {value}
        {unit ? <Text style={{ fontSize: size * 0.12, color: C.mu, fontWeight: '600' }}>{unit}</Text> : null}
      </Text>
    </View>
  );
}

// Anneaux concentriques (un par mesure), avec la légende à côté.
export function Rings({ items, size = 150, stroke = 11, gap = 4 }) {
  return (
    <Svg width={size} height={size}>
      <G rotation={-90} origin={`${size / 2}, ${size / 2}`}>
        {items.map((it, i) => {
          const r = size / 2 - stroke / 2 - i * (stroke + gap);
          const L = 2 * Math.PI * r;
          const p = Math.max(0, Math.min(100, it.pct || 0));
          return (
            <G key={it.label}>
              <Circle cx={size / 2} cy={size / 2} r={r} stroke={C.track} strokeWidth={stroke} fill="none" />
              {p > 0 ? <Circle cx={size / 2} cy={size / 2} r={r} stroke={it.color} strokeWidth={stroke} fill="none" strokeDasharray={`${(L * p) / 100} ${L}`} strokeLinecap="round" /> : null}
            </G>
          );
        })}
      </G>
    </Svg>
  );
}

// Une diapositive : bandeau, titre, filet doré, contenu et pied de page numéroté.
export function Slide({ kicker, title, children, page, total, foot }) {
  return (
    <View style={{ backgroundColor: C.card, borderRadius: 22, borderWidth: 1, borderColor: C.accLine, overflow: 'hidden' }}>
      <View style={{ height: 4, backgroundColor: C.pri }} />
      <View style={{ padding: 18, paddingBottom: 14 }}>
        <Text style={{ color: C.acc, fontSize: 11, fontWeight: '700', letterSpacing: 1.4 }}>{kicker.toUpperCase()}</Text>
        <Text style={{ fontFamily: C.serif, color: C.tx, fontSize: 24, fontWeight: '700', marginTop: 4, letterSpacing: -0.2 }}>{title}</Text>
        <View style={{ width: 36, height: 2, backgroundColor: C.acc, marginTop: 10, marginBottom: 16, borderRadius: 1 }} />
        {children}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 18, paddingTop: 10, borderTopWidth: 1, borderTopColor: C.line }}>
          <Text style={{ color: C.mu, fontSize: 11 }} numberOfLines={1}>{foot || 'Newday'}</Text>
          <Text style={{ color: C.mu, fontSize: 11, fontVariant: ['tabular-nums'] }}>{String(page).padStart(2, '0')} / {String(total).padStart(2, '0')}</Text>
        </View>
      </View>
    </View>
  );
}

// Un anneau avec son titre et une ligne d'explication, pour les grilles de diapositive.
export function RingTile({ label, sub, width, ...ring }) {
  return (
    <View style={{ width, alignItems: 'center', marginBottom: 14 }}>
      <Ring {...ring} a11y={label + ' : ' + ring.value + (ring.unit || '') + (sub ? ', ' + sub : '')} />
      <Text style={{ color: C.tx, fontWeight: '700', fontSize: 13, marginTop: 8, textAlign: 'center' }} numberOfLines={1}>{label}</Text>
      {sub ? <Text style={{ color: C.mu, fontSize: 11, textAlign: 'center', marginTop: 1 }} numberOfLines={2}>{sub}</Text> : null}
    </View>
  );
}
