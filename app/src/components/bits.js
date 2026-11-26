// Éléments partagés entre plusieurs écrans : humeur, habitudes du jour, anneau de progression.
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { C } from '../theme';
import { Btn, Row } from './ui';
import { has } from '../stats';
import { Face, MOOD_LABELS } from './icons';

export function MoodPicker({ value, onPick, disabled, size = 34 }) {
  return (
    <Row style={{ justifyContent: 'space-between', marginTop: 12, gap: 0 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Pressable
          key={n}
          disabled={disabled}
          onPress={() => onPick(n)}
          hitSlop={4}
          accessibilityRole="button"
          accessibilityState={{ selected: value === n }}
          accessibilityLabel={'Humeur : ' + MOOD_LABELS[n]}
          style={{ opacity: disabled ? 0.3 : 1, transform: [{ scale: value === n ? 1.12 : 1 }] }}
        >
          <Face level={n} size={size} on={value === n} />
        </Pressable>
      ))}
    </Row>
  );
}

export function HabitChips({ S, k, onToggle, disabled, editing, onRemove }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
      {S.h.map((h) =>
        editing ? (
          <Btn key={h.id} label={h.n + '  ✕'} onPress={() => onRemove(h.id)} a11y={'Supprimer ' + h.n} />
        ) : (
          <Btn key={h.id} label={h.n} active={has(S, k, h.id)} disabled={disabled} onPress={() => onToggle(h.id)} />
        )
      )}
    </View>
  );
}

export function Ring({ pct, size = 96 }) {
  const r = 34, L = 2 * Math.PI * r;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} viewBox="0 0 90 90" style={{ position: 'absolute' }}>
        <Circle cx="45" cy="45" r={r} fill="none" stroke={C.track} strokeWidth="8" />
        {pct > 0 ? <Circle
          cx="45"
          cy="45"
          r={r}
          fill="none"
          stroke={C.pri}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${(L * pct).toFixed(1)} ${L.toFixed(1)}`}
          transform="rotate(-90 45 45)"
        /> : null}
      </Svg>
      <Text style={{ color: C.tx, fontSize: 18, fontWeight: '700' }}>{Math.round(pct * 100)}%</Text>
    </View>
  );
}
