// Point d'entrée de l'app : charge les données, affiche l'en-tête, l'écran choisi
// et la barre d'onglets flottante avec le bouton +.
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from './src/theme';
import { cap, fmt, today, weekNumber } from './src/dates';
import { useStore } from './src/store';
import Today from './src/screens/Today';
import Week from './src/screens/Week';
import Calendar from './src/screens/Calendar';
import Progress from './src/screens/Progress';
import QuickAdd from './src/components/QuickAdd';
import GymModule from './src/gym/GymModule';
import { CalIcon, ChartIcon, HomeIcon, PlusIcon, WeekIcon } from './src/components/icons';

const TABS = [
  { id: 'day', label: 'Aujourd’hui', screen: Today, Icon: HomeIcon },
  { id: 'week', label: 'Semaine', screen: Week, Icon: WeekIcon },
  { id: 'cal', label: 'Calendrier', screen: Calendar, Icon: CalIcon },
  { id: 'prog', label: 'Progrès', screen: Progress, Icon: ChartIcon },
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
  const [add, setAdd] = useState(null); // type d'ajout ouvert avec le bouton +
  const [gym, setGym] = useState(false); // module Salle ouvert

  if (!S) return <View style={{ flex: 1, backgroundColor: C.bg }} />;

  const current = TABS.find((t) => t.id === tab);
  const Screen = current.screen;
  const pick = (id) => {
    setTab(id);
    if (id === 'day') setCd(T);
  };
  const title = tab === 'day' && cd !== T ? cap(fmt(cd, { weekday: 'long' })) : current.label;
  const shown = tab === 'day' ? cd : T;
  const addDay = tab === 'day' || tab === 'cal' ? cd : T;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar style="dark" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top + 18,
          paddingHorizontal: 16,
          paddingBottom: 120 + insets.bottom,
          width: '100%',
          maxWidth: wide ? 1100 : 560,
          alignSelf: 'center',
          gap: 16,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: C.lav2, alignItems: 'center', justifyContent: 'center' }}>
            <current.Icon size={24} color={C.acc} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: C.tx, fontSize: 32, fontWeight: '700', letterSpacing: -0.8 }}>{title}</Text>
          </View>
        </View>
        <Text style={{ color: C.mu, fontSize: 13, marginTop: -10 }}>
          {cap(fmt(shown, { weekday: 'long', day: 'numeric', month: 'long' }))} · semaine {weekNumber(shown)}
        </Text>
        <Screen S={S} update={update} replace={replace} T={T} cd={cd} setCd={setCd} wide={wide} openAdd={setAdd} openGym={() => setGym(true)} />
      </ScrollView>

      <View style={{ position: 'absolute', left: 0, right: 0, bottom: insets.bottom + 16, alignItems: 'center' }} pointerEvents="box-none">
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View
            accessibilityRole="tablist"
            style={{
              flexDirection: 'row', gap: 4, padding: 6, borderRadius: 999,
              backgroundColor: 'rgba(22,22,28,0.94)',
              shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 16, shadowOffset: { width: 0, height: 6 },
            }}
          >
            {TABS.map((t) => {
              const on = t.id === tab;
              return (
                <Pressable
                  key={t.id}
                  onPress={() => pick(t.id)}
                  accessibilityRole="tab"
                  accessibilityLabel={t.label}
                  accessibilityState={{ selected: on }}
                  style={{
                    width: 52, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center',
                    backgroundColor: on ? 'rgba(255,255,255,0.14)' : 'transparent',
                  }}
                >
                  <t.Icon size={21} color={on ? '#FFFFFF' : 'rgba(255,255,255,0.55)'} />
                  <View style={{ width: 4, height: 4, borderRadius: 2, marginTop: 3, backgroundColor: on ? '#FFFFFF' : 'transparent' }} />
                </Pressable>
              );
            })}
          </View>
          <Pressable
            onPress={() => setAdd(tab === 'week' || tab === 'prog' ? 'habit' : 'todo')}
            accessibilityRole="button"
            accessibilityLabel="Ajouter"
            style={({ pressed }) => ({
              width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center',
              backgroundColor: 'rgba(22,22,28,0.94)', opacity: pressed ? 0.8 : 1,
              shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 16, shadowOffset: { width: 0, height: 6 },
            })}
          >
            <PlusIcon size={24} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>

      <GymModule visible={gym} onClose={() => setGym(false)} S={S} update={update} T={T} />
      <QuickAdd visible={!!add} initial={add || 'todo'} onClose={() => setAdd(null)} update={update} k={addDay} T={T} />
    </View>
  );
}
