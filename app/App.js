// Point d'entrée de l'app : charge les données, affiche l'en-tête, les onglets et l'écran choisi.
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from './src/theme';
import { cap, fmt, today } from './src/dates';
import { useStore } from './src/store';
import Today from './src/screens/Today';
import Week from './src/screens/Week';
import Calendar from './src/screens/Calendar';
import Progress from './src/screens/Progress';

const TABS = [
  { id: 'day', label: 'Aujourd’hui', screen: Today },
  { id: 'week', label: 'Semaine', screen: Week },
  { id: 'cal', label: 'Calendrier', screen: Calendar },
  { id: 'prog', label: 'Progrès', screen: Progress },
];

export default function App() {
  return (
    <SafeAreaProvider>
      <Main />
    </SafeAreaProvider>
  );
}

function Main() {
  const { S, update, replace } = useStore();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const wide = width >= 860; // tablette ou ordinateur : deux colonnes
  const [tab, setTab] = useState('day');
  const T = today();
  const [cd, setCd] = useState(T); // jour sélectionné

  if (!S) return <View style={{ flex: 1, backgroundColor: C.bg }} />;

  const current = TABS.find((t) => t.id === tab);
  const Screen = current.screen;
  const pick = (id) => {
    setTab(id);
    if (id === 'day') setCd(T);
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar style="light" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 16,
          paddingBottom: wide ? 40 : 110 + insets.bottom,
          width: '100%',
          maxWidth: wide ? 1100 : 560,
          alignSelf: 'center',
          gap: 14,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flexDirection: wide ? 'row' : 'column', justifyContent: 'space-between', alignItems: wide ? 'center' : 'flex-start', gap: 12 }}>
          <View>
            <Text style={{ color: C.gold, fontSize: 12, letterSpacing: 3, fontWeight: '600' }}>NEWDAY</Text>
            <Text style={{ color: C.tx, fontSize: 32, fontWeight: '700', letterSpacing: -0.5 }}>{current.label}</Text>
            <Text style={{ color: C.mu, fontSize: 13 }}>{cap(fmt(T, { weekday: 'long', day: 'numeric', month: 'long' }))}</Text>
          </View>
          {wide ? <Tabs tab={tab} pick={pick} /> : null}
        </View>
        <Screen S={S} update={update} replace={replace} T={T} cd={cd} setCd={setCd} wide={wide} />
      </ScrollView>
      {!wide ? (
        <View style={{ position: 'absolute', left: 12, right: 12, bottom: insets.bottom + 12, alignItems: 'center' }}>
          <Tabs tab={tab} pick={pick} />
        </View>
      ) : null}
    </View>
  );
}

function Tabs({ tab, pick }) {
  return (
    <View
      accessibilityRole="tablist"
      style={{
        flexDirection: 'row',
        gap: 4,
        padding: 4,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: C.goldLine,
        backgroundColor: 'rgba(14,14,16,0.96)',
        width: '100%',
        maxWidth: 520,
      }}
    >
      {TABS.map((t) => {
        const on = t.id === tab;
        return (
          <Pressable
            key={t.id}
            onPress={() => pick(t.id)}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            style={{ flex: 1, paddingVertical: 10, borderRadius: 999, backgroundColor: on ? C.gold : 'transparent', alignItems: 'center' }}
          >
            <Text numberOfLines={1} style={{ color: on ? C.ink : C.mu, fontWeight: '600', fontSize: 13 }}>{t.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
