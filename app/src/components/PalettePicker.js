// Le choix de la palette de couleurs : une petite fenêtre en bas de l'écran, façon iPhone.
// Le design reste sombre et sobre ; seule la couleur des reflets et des touches change.
import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { C, PALETTES, PALETTE_ORDER } from '../theme';
import { CheckIcon } from './icons';

// Une pastille ronde aux deux couleurs de reflet de la palette.
export function PaletteDot({ name, size = 22 }) {
  const p = PALETTES[name] || PALETTES.nuit;
  const id = 'pd' + name;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Defs>
        <LinearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={`rgb(${p.glowA})`} />
          <Stop offset="1" stopColor={`rgb(${p.glowB})`} />
        </LinearGradient>
      </Defs>
      <Circle cx="12" cy="12" r="10.5" fill={`url(#${id})`} />
      <Circle cx="12" cy="12" r="10.5" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
    </Svg>
  );
}

export default function PalettePicker({ visible, current, onPick, onClose }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable onPress={onClose} style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end', alignItems: 'center' }}>
        <Pressable onPress={() => {}} style={{
          width: '100%', maxWidth: 520, margin: 0, padding: 20, paddingBottom: 34,
          borderTopLeftRadius: 28, borderTopRightRadius: 28, backgroundColor: '#1C1C1E',
          borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)',
        }}>
          <View style={{ width: 36, height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.25)', alignSelf: 'center', marginBottom: 14 }} />
          <Text style={{ fontFamily: C.serif, color: '#FFFFFF', fontSize: 20, fontWeight: '700' }}>Couleurs</Text>
          <Text style={{ color: 'rgba(235,235,245,0.6)', fontSize: 13, marginTop: 2 }}>Le design reste sombre ; seule la couleur des reflets change.</Text>
          <View style={{ marginTop: 14, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            {PALETTE_ORDER.map((name, i) => {
              const on = name === current;
              return (
                <Pressable key={name} onPress={() => { onPick(name); onClose(); }} accessibilityRole="button" accessibilityState={{ selected: on }}
                  accessibilityLabel={'Palette ' + PALETTES[name].label}
                  style={({ pressed }) => ({
                    flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 14,
                    borderTopWidth: i ? 1 : 0, borderTopColor: 'rgba(255,255,255,0.08)', backgroundColor: pressed ? 'rgba(255,255,255,0.06)' : 'transparent',
                  })}>
                  <PaletteDot name={name} size={26} />
                  <Text style={{ flex: 1, color: '#FFFFFF', fontSize: 16 }}>{PALETTES[name].label}</Text>
                  {on ? <CheckIcon size={18} color="#FFFFFF" width={2.6} /> : null}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
