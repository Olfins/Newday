// Bande des 7 jours en haut de l'écran "Aujourd'hui".
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { C } from '../theme';
import { addDays, cap, fmt, letter, mondayOf, weekOf, toDate } from '../dates';
import { nh } from '../stats';
import { Icon, Row } from './ui';

export default function WeekStrip({ S, T, cd, setCd, off, setOff }) {
  const days = weekOf(addDays(mondayOf(T), 7 * off));
  return (
    <View>
      <Text style={{ color: C.mu, textAlign: 'center', fontSize: 13, marginBottom: 8 }}>
        {cap(fmt(days[3], { month: 'long', year: 'numeric' }))}
      </Text>
      <Row style={{ gap: 4 }}>
        <Icon label="‹" onPress={() => setOff(off - 1)} a11y="Semaine précédente" />
        <View style={{ flex: 1, flexDirection: 'row', gap: 4 }}>
          {days.map((k) => {
            const sel = k === cd, isT = k === T;
            const busy = nh(S, k) || (S.ev[k] || []).length;
            return (
              <Pressable
                key={k}
                onPress={() => setCd(k)}
                accessibilityRole="button"
                accessibilityLabel={fmt(k, { weekday: 'long', day: 'numeric', month: 'long' })}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  paddingVertical: 8,
                  borderRadius: 14,
                  backgroundColor: sel ? C.gold : 'transparent',
                  borderWidth: 1,
                  borderColor: sel ? C.gold : isT ? C.goldLine : 'transparent',
                }}
              >
                <Text style={{ fontSize: 11, color: sel ? C.ink : C.mu }}>{letter(k)}</Text>
                <Text style={{ fontSize: 16, fontWeight: '700', color: sel ? C.ink : isT ? C.gold : C.tx }}>
                  {toDate(k).getDate()}
                </Text>
                <View
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: 2,
                    marginTop: 3,
                    backgroundColor: sel ? C.ink : C.gold,
                    opacity: busy ? 1 : 0.15,
                  }}
                />
              </Pressable>
            );
          })}
        </View>
        <Icon label="›" onPress={() => setOff(off + 1)} a11y="Semaine suivante" />
      </Row>
    </View>
  );
}
