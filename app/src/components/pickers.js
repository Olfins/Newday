// Sélecteurs façon iPhone : une roue pour l'heure et un calendrier pour la date.
// Écrits en React Native pur, ils marchent pareil sur iPhone, Android et le web.
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { C } from '../theme';
import { cap, fmt, iso, LETTERS } from '../dates';
import { Icon, Row } from './ui';

const ITEM = 40; // hauteur d'une ligne de la roue
const VISIBLE = 5; // nombre de lignes visibles
const pad = (n) => String(n).padStart(2, '0');

// ---------- Une roue qui défile ----------
export function Wheel({ items, index, onChange, width = 70, a11y }) {
  const ref = useRef(null);
  const timer = useRef(null);
  const [y, setY] = useState(index * ITEM);

  // Place la roue sur la bonne valeur à l'ouverture ou si la valeur change ailleurs.
  useEffect(() => {
    const t = setTimeout(() => ref.current && ref.current.scrollTo({ y: index * ITEM, animated: false }), 0);
    setY(index * ITEM);
    return () => clearTimeout(t);
  }, [index]);

  const settle = (pos) => {
    const i = Math.max(0, Math.min(items.length - 1, Math.round(pos / ITEM)));
    if (ref.current) ref.current.scrollTo({ y: i * ITEM, animated: true });
    if (i !== index) onChange(i);
  };

  const onScroll = (e) => {
    const pos = e.nativeEvent.contentOffset.y;
    setY(pos);
    // Quand le défilement s'arrête, on se cale sur la ligne la plus proche.
    clearTimeout(timer.current);
    timer.current = setTimeout(() => settle(pos), 140);
  };

  return (
    <View style={{ width, height: ITEM * VISIBLE }} accessibilityLabel={a11y} accessibilityValue={{ text: items[index] }}>
      <ScrollView
        ref={ref}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM}
        decelerationRate="fast"
        onScroll={onScroll}
        scrollEventThrottle={16}
        nestedScrollEnabled
        contentContainerStyle={{ paddingVertical: ITEM * 2 }}
      >
        {items.map((it, i) => {
          const d = Math.abs(i * ITEM - y) / ITEM; // distance au centre, en lignes
          return (
            <Pressable key={i} onPress={() => settle(i * ITEM)} style={{ height: ITEM, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{
                fontSize: 22,
                fontWeight: d < 0.5 ? '600' : '400',
                color: C.tx,
                opacity: Math.max(0.18, 1 - d * 0.32),
                transform: [{ scale: Math.max(0.82, 1 - d * 0.07) }],
              }}>{it}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const HOURS = [...Array(24)].map((_, i) => pad(i));
const MINS = [...Array(12)].map((_, i) => pad(i * 5));

// Deux roues : heures et minutes (par pas de 5 minutes).
export function TimeWheel({ value, onChange }) {
  const [h, m] = (value || '09:00').split(':').map(Number);
  const mi = Math.min(11, Math.round(m / 5));
  return (
    <View style={{ alignItems: 'center', marginTop: 8 }}>
      <View style={{ height: ITEM * VISIBLE, justifyContent: 'center' }}>
        {/* Bande grise au centre, comme sur iPhone */}
        <View pointerEvents="none" style={{
          position: 'absolute', left: -12, right: -12, height: ITEM, borderRadius: 10, backgroundColor: C.card2,
        }} />
        <Row style={{ gap: 4 }}>
          <Wheel items={HOURS} index={h} onChange={(i) => onChange(pad(i) + ':' + pad(mi * 5))} a11y="Heures" />
          <Text style={{ fontSize: 22, fontWeight: '600', color: C.tx }}>:</Text>
          <Wheel items={MINS} index={mi} onChange={(i) => onChange(pad(h) + ':' + pad(i * 5))} a11y="Minutes" />
        </Row>
      </View>
    </View>
  );
}

// ---------- Calendrier d'un mois ----------
export function MonthCalendar({ value, onChange, T }) {
  const [cm, setCm] = useState(value.slice(0, 7));
  const [Y, M] = cm.split('-').map(Number);
  const first = new Date(Y, M - 1, 1);
  const n = new Date(Y, M, 0).getDate();
  const lead = (first.getDay() + 6) % 7;
  const shift = (d) => { const x = new Date(Y, M - 1 + d, 1); setCm(x.getFullYear() + '-' + pad(x.getMonth() + 1)); };
  const cells = [...Array(lead).fill(null), ...[...Array(n)].map((_, i) => cm + '-' + pad(i + 1))];
  return (
    <View style={{ marginTop: 8 }}>
      <Row style={{ justifyContent: 'space-between' }}>
        <Text style={{ color: C.tx, fontSize: 16, fontWeight: '700' }}>{cap(first.toLocaleDateString('fr-BE', { month: 'long', year: 'numeric' }))}</Text>
        <Row style={{ gap: 4 }}>
          <Icon label="‹" onPress={() => shift(-1)} a11y="Mois précédent" />
          <Icon label="›" onPress={() => shift(1)} a11y="Mois suivant" />
        </Row>
      </Row>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
        {LETTERS.map((l, i) => (
          <Text key={'l' + i} style={{ width: '14.2857%', textAlign: 'center', color: C.mu, fontSize: 12, fontWeight: '600', marginBottom: 4 }}>{l}</Text>
        ))}
        {cells.map((k, i) => {
          if (!k) return <View key={'e' + i} style={{ width: '14.2857%', height: 40 }} />;
          const sel = k === value, isT = k === T;
          return (
            <View key={k} style={{ width: '14.2857%', height: 40, alignItems: 'center', justifyContent: 'center' }}>
              <Pressable
                onPress={() => onChange(k)}
                accessibilityRole="button"
                accessibilityState={{ selected: sel }}
                accessibilityLabel={fmt(k, { weekday: 'long', day: 'numeric', month: 'long' })}
                style={{ width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: sel ? C.pri : 'transparent' }}
              >
                <Text style={{ fontSize: 17, fontWeight: sel || isT ? '700' : '400', color: sel ? C.onPri : isT ? C.acc : C.tx }}>{+k.slice(8)}</Text>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}

// ---------- Champs qui ouvrent la roue ou le calendrier ----------
// Une ligne "Libellé ........ valeur" ; un toucher ouvre le sélecteur juste en dessous.
function FieldRow({ label, valueText, open, onPress, onClear, placeholder }) {
  return (
    <Row style={{ paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.line }}>
      <Text style={{ flex: 1, color: C.tx, fontSize: 15 }}>{label}</Text>
      {onClear && valueText ? <Icon label="✕" onPress={onClear} a11y={'Effacer ' + label} style={{ width: 26, height: 26 }} /> : null}
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={label + ' : ' + (valueText || placeholder)}
        style={{ paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, backgroundColor: open ? C.accSoft : C.card2 }}
      >
        <Text style={{ fontSize: 15, fontWeight: '600', color: valueText ? (open ? C.acc : C.tx) : C.mu }}>{valueText || placeholder}</Text>
      </Pressable>
    </Row>
  );
}

export function TimeField({ label, value, onChange, open, onToggle, optional, fallback = '09:00' }) {
  return (
    <View>
      <FieldRow
        label={label}
        valueText={value}
        placeholder={optional ? 'Aucune' : 'Choisir'}
        open={open}
        onPress={() => { if (!value) onChange(fallback); onToggle(); }}
        onClear={optional ? () => { onChange(''); if (open) onToggle(); } : null}
      />
      {open ? <TimeWheel value={value || fallback} onChange={onChange} /> : null}
    </View>
  );
}

export function DateField({ label, value, onChange, open, onToggle, T }) {
  return (
    <View>
      <FieldRow label={label} valueText={cap(fmt(value, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }))} open={open} onPress={onToggle} />
      {open ? <MonthCalendar value={value} T={T} onChange={(k) => { onChange(k); onToggle(); }} /> : null}
    </View>
  );
}

// Heure suivante arrondie, pour proposer une valeur de départ réaliste.
export function nextHour() {
  const d = new Date();
  return pad(Math.min(23, d.getHours() + 1)) + ':00';
}
export function plusHour(t) {
  if (!t) return '';
  return pad(Math.min(23, +t.slice(0, 2) + 1)) + ':' + t.slice(3, 5);
}
