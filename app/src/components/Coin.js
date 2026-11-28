// La pièce en chrome (gravée d'une feuille) et la pluie de pièces qui tombe quand on en gagne.
// Les pièces sont argentées (chrome) dans tous les designs.
import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, Text, View, useWindowDimensions } from 'react-native';
import Svg, { Circle, Defs, Ellipse, LinearGradient, Path, Stop } from 'react-native-svg';

// Pièce en chrome : dégradés argentés, reflet net et feuille gravée.
export function Coin({ size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Defs>
        <LinearGradient id="chromeRim" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#FFFFFF" />
          <Stop offset="0.35" stopColor="#8E959E" />
          <Stop offset="0.6" stopColor="#E9ECEF" />
          <Stop offset="1" stopColor="#5E656E" />
        </LinearGradient>
        <LinearGradient id="chromeFace" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#F4F6F8" />
          <Stop offset="0.48" stopColor="#B9C0C8" />
          <Stop offset="0.52" stopColor="#8A929B" />
          <Stop offset="1" stopColor="#D9DEE3" />
        </LinearGradient>
      </Defs>
      <Circle cx="12" cy="12" r="11.2" fill="url(#chromeRim)" />
      <Circle cx="12" cy="12" r="9.4" fill="url(#chromeFace)" />
      <Circle cx="12" cy="12" r="7.4" fill="none" stroke="#7A828B" strokeWidth="0.8" opacity="0.8" />
      <Path d="M8 15.8c0-4 2.6-6.6 7.6-7.2-.3 5-2.9 7.6-6.6 7.6-.4 0-.7-.1-1-.4z" fill="#6E767F" />
      <Path d="M8.6 15.6l4.6-4.6" stroke="#E4E8EC" strokeWidth="0.9" strokeLinecap="round" />
      <Ellipse cx="8.2" cy="6.4" rx="3" ry="1.1" fill="#FFFFFF" opacity="0.85" transform="rotate(-35 8.2 6.4)" />
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
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 9, paddingHorizontal: 16, borderRadius: 999, backgroundColor: '#1C1C1E', borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)', shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } }}>
          <Coin size={22} />
          <Text style={{ color: '#FFFFFF', fontSize: 17, fontWeight: '800' }}>+{amount}</Text>
          {label ? <Text style={{ color: 'rgba(235,235,245,0.7)', fontSize: 14, fontWeight: '600' }}>{label}</Text> : null}
        </View>
      </Animated.View>
    </View>
  );
}
