// La pièce dorée (avec une patte de chat) et la pluie de pièces qui tombe quand on en gagne.
import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, Text, View, useWindowDimensions } from 'react-native';
import Svg, { Circle, Ellipse, G } from 'react-native-svg';

export function Coin({ size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="12" cy="12" r="11.2" fill="#D9A62E" />
      <Circle cx="12" cy="11.4" r="10" fill="#F2C14C" />
      <Circle cx="12" cy="11.4" r="7.6" fill="none" stroke="#D9A62E" strokeWidth="1.2" />
      <G fill="#C08F22">
        <Ellipse cx="12" cy="13.4" rx="2.9" ry="2.3" />
        <Circle cx="8.9" cy="10.4" r="1.15" />
        <Circle cx="11" cy="8.7" r="1.15" />
        <Circle cx="13.1" cy="8.7" r="1.15" />
        <Circle cx="15.1" cy="10.4" r="1.15" />
      </G>
      <Ellipse cx="8.4" cy="6.6" rx="2.2" ry="1" fill="#FFF3C4" opacity="0.7" transform="rotate(-35 8.4 6.6)" />
    </Svg>
  );
}

// Une pastille « 120 » avec une pièce.
export function CoinPill({ n, style, textColor, bg }) {
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 4, paddingLeft: 6, paddingRight: 10, borderRadius: 999, backgroundColor: bg || 'rgba(255,255,255,0.65)' }, style]}>
      <Coin size={16} />
      <Text style={{ color: textColor || '#22302A', fontSize: 13, fontWeight: '700', fontVariant: ['tabular-nums'] }}>{n}</Text>
    </View>
  );
}

function Falling({ x, delay, dur, h, size, onDone }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(v, { toValue: 1, duration: dur, delay, easing: Easing.in(Easing.quad), useNativeDriver: false }).start(onDone);
  }, []);
  return (
    <Animated.View style={{
      position: 'absolute', left: x, top: -size,
      opacity: v.interpolate({ inputRange: [0, 0.05, 0.8, 1], outputRange: [0, 1, 1, 0] }),
      transform: [
        { translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, h] }) },
        { scaleX: v.interpolate({ inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1], outputRange: [1, 0.15, 1, 0.15, 1, 0.15] }) },
      ],
    }}>
      <Coin size={size} />
    </Animated.View>
  );
}

// amount : pièces gagnées ; label : pourquoi (« Habitude », « Tâche faite »…).
export function CoinRain({ amount, label, onDone }) {
  const { width, height } = useWindowDimensions();
  const pill = useRef(new Animated.Value(0)).current;
  const coins = useMemo(() => {
    const n = Math.max(5, Math.min(16, Math.round(amount / 4)));
    return Array.from({ length: n }, (_, i) => ({
      id: i,
      x: Math.random() * (width - 30),
      delay: i * 70 + Math.random() * 120,
      dur: 1100 + Math.random() * 600,
      size: 20 + Math.random() * 12,
    }));
  }, []);
  useEffect(() => {
    Animated.sequence([
      Animated.spring(pill, { toValue: 1, friction: 6, useNativeDriver: false }),
      Animated.delay(1600),
      Animated.timing(pill, { toValue: 0, duration: 300, useNativeDriver: false }),
    ]).start(() => onDone && onDone());
  }, []);
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, zIndex: 50, overflow: 'hidden' }}>
      {coins.map((c) => <Falling key={c.id} {...c} h={height * 0.85} />)}
      <Animated.View style={{
        position: 'absolute', top: 70, alignSelf: 'center',
        opacity: pill, transform: [{ scale: pill.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }],
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 9, paddingHorizontal: 16, borderRadius: 999, backgroundColor: '#FFFDF5', shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } }}>
          <Coin size={22} />
          <Text style={{ color: '#8A6418', fontSize: 17, fontWeight: '800' }}>+{amount}</Text>
          {label ? <Text style={{ color: '#5B4A3A', fontSize: 14, fontWeight: '600' }}>{label}</Text> : null}
        </View>
      </Animated.View>
    </View>
  );
}
