// Les briques visuelles réutilisées dans tous les écrans.
import React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { C } from '../theme';

export const Card = ({ children, style, hero }) => (
  <View style={[s.card, hero && s.hero, style]}>{children}</View>
);

export const H = ({ children, style }) => <Text style={[s.h, style]}>{children}</Text>;
export const Mu = ({ children, style }) => <Text style={[s.mu, style]}>{children}</Text>;
export const Tx = ({ children, style, ...p }) => <Text {...p} style={[s.tx, style]}>{children}</Text>;

export const Row = ({ children, style }) => <View style={[s.row, style]}>{children}</View>;

// Bouton. "active" le colore en doré, "ghost" le rend discret.
export function Btn({ label, onPress, active, ghost, disabled, style, textStyle, a11y }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={a11y || label}
      style={({ pressed }) => [
        s.btn,
        ghost && s.ghost,
        active && s.btnOn,
        disabled && { opacity: 0.35 },
        pressed && { opacity: 0.7 },
        style,
      ]}
    >
      <Text style={[s.btnTx, active && s.btnTxOn, textStyle]}>{label}</Text>
    </Pressable>
  );
}

// Rond à cocher (habitudes, tâches).
export function Dot({ on, today, onPress, disabled, size = 28, a11y }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: !!on, disabled: !!disabled }}
      accessibilityLabel={a11y}
      hitSlop={4}
      style={[
        s.dot,
        { width: size, height: size, borderRadius: size / 2 },
        on && s.dotOn,
        today && !on && { borderColor: C.pri },
        disabled && { opacity: 0.25 },
      ]}
    >
      {on ? <Text style={[s.dotTx, { fontSize: size * 0.5 }]}>✓</Text> : null}
    </Pressable>
  );
}

// Barre de progression colorée.
export const Bar = ({ pct, style }) => (
  <View style={[s.bar, style]}>
    <View style={[s.barIn, { width: Math.max(0, Math.min(100, pct)) + '%' }]} />
  </View>
);

export function Field({ style, ...p }) {
  return <TextInput placeholderTextColor={C.mu} selectionColor={C.pri} {...p} style={[s.field, style]} />;
}

// Petit bouton "+" ou "✕".
export function Icon({ label, onPress, a11y, gold, style }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={a11y}
      hitSlop={8}
      style={({ pressed }) => [s.icon, gold && s.iconGold, pressed && { opacity: 0.6 }, style]}
    >
      <Text style={[s.iconTx, gold && { color: C.onPri }]}>{label}</Text>
    </Pressable>
  );
}

// Champ + bouton "+" pour ajouter quelque chose.
export function AddRow({ value, onChangeText, onAdd, placeholder }) {
  return (
    <Row style={{ marginTop: 12 }}>
      <Field
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        onSubmitEditing={onAdd}
        returnKeyType="done"
        blurOnSubmit={false}
        style={{ flex: 1, marginTop: 0 }}
      />
      <Icon label="+" gold onPress={onAdd} a11y="Ajouter" style={{ width: 44, height: 44, borderRadius: 14 }} />
    </Row>
  );
}

// Sur grand écran, range les cartes sur deux colonnes ; sur téléphone, une seule.
export function Grid({ wide, children }) {
  const items = React.Children.toArray(children).filter(Boolean);
  if (!wide) return <View style={{ gap: 14 }}>{items}</View>;
  const a = [], b = [];
  items.forEach((c, i) => (i % 2 ? b : a).push(c));
  return (
    <View style={{ flexDirection: 'row', gap: 14, alignItems: 'flex-start' }}>
      <View style={{ flex: 1, gap: 14 }}>{a}</View>
      <View style={{ flex: 1, gap: 14 }}>{b}</View>
    </View>
  );
}

// Styles recalculés à chaque changement de design (voir restyle).
export const s = {};
export const restyle = () => Object.assign(s, makeStyles());
const makeStyles = () => ({
  card: {
    backgroundColor: C.card,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: C.line,
  },
  hero: { borderColor: C.accLine },
  h: { color: C.tx, fontSize: 17, fontWeight: '700', fontFamily: C.serif, marginBottom: 4 },
  mu: { color: C.mu, fontSize: 13 },
  tx: { color: C.tx, fontSize: 15 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  btn: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: C.card2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghost: { backgroundColor: 'transparent' },
  btnOn: { backgroundColor: C.pri, borderColor: C.pri },
  btnTx: { color: C.tx, fontSize: 14, fontWeight: '600' },
  btnTxOn: { color: C.onPri },
  dot: {
    borderWidth: 1,
    borderColor: C.ring,
    backgroundColor: C.track,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotOn: { backgroundColor: C.pri, borderColor: C.pri },
  dotTx: { color: C.onPri, fontWeight: '800' },
  bar: { height: 8, borderRadius: 4, backgroundColor: C.track, overflow: 'hidden', marginTop: 10 },
  barIn: { height: '100%', borderRadius: 4, backgroundColor: C.pri },
  field: {
    minWidth: 0,
    marginTop: 10,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: C.field,
    color: C.tx,
    fontSize: 15,
  },
  icon: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  iconGold: { backgroundColor: C.pri },
  iconTx: { color: C.mu, fontSize: 18, fontWeight: '600' },
});
restyle();
