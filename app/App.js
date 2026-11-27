// Point d'entrée de l'app : charge les données, affiche l'en-tête, l'écran choisi
// et la barre d'onglets flottante (4 onglets).
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { C, setTheme, THEME_KEY } from './src/theme';
import { restyle } from './src/components/ui';
import { today } from './src/dates';
import { useStore } from './src/store';
import Today from './src/screens/Today';
import Week from './src/screens/Week';
import Calendar from './src/screens/Calendar';
import Pet from './src/screens/Pet';
import QuickAdd from './src/components/QuickAdd';
import GymModule from './src/gym/GymModule';
import { CoinRain } from './src/components/Coin';
import { bank, earnedCoins, needsBank, GAIN_LABEL } from './src/pet/coins';
import { CalIcon, HomeIcon, MoodIcon, MoonIcon, PawIcon, PlusIcon, WeekIcon } from './src/components/icons';

// Quatre onglets : Jour (aujourd'hui), Semaine, Calendrier (avec les progrès), Pet.
const TABS = [
  { id: 'day', label: 'Jour', title: 'Aujourd’hui', screen: Today, Icon: HomeIcon },
  { id: 'week', label: 'Semaine', screen: Week, Icon: WeekIcon },
  { id: 'cal', label: 'Calendrier', screen: Calendar, Icon: CalIcon },
  { id: 'pet', label: 'Pet', screen: Pet, Icon: PawIcon },
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
  // Design choisi : « cozy » (chat, crème) ou « focus » (dark academia). Mémorisé sur l'appareil.
  const [theme, setThemeName] = useState(null);
  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((v) => applyTheme(v || 'cozy')).catch(() => applyTheme('cozy'));
  }, []);
  const applyTheme = (name) => { setTheme(name); restyle(); setThemeName(C.name); };
  const toggleTheme = () => {
    const next = C.name === 'focus' ? 'cozy' : 'focus';
    applyTheme(next);
    AsyncStorage.setItem(THEME_KEY, next).catch(() => {});
  };
  // Sur le web, la couleur du fond de la page et de la barre du navigateur suit le design.
  useEffect(() => {
    if (!theme || typeof document === 'undefined') return;
    document.body.style.backgroundColor = C.bg;
    let m = document.querySelector('meta[name="theme-color"]');
    if (!m) { m = document.createElement('meta'); m.name = 'theme-color'; document.head.appendChild(m); }
    m.content = C.bg;
  }, [theme]);

  // Pièces : on met les jours passés à la banque, puis on fait pleuvoir des pièces quand on en gagne.
  const [rain, setRain] = useState(null);
  const prevCoins = useRef(null);
  useEffect(() => {
    if (!S) return;
    if (needsBank(S, T)) {
      if (!S.coins) {
        const c = JSON.parse(JSON.stringify(S));
        bank(c, T);
        if (c.coins.past > 0) setRain({ id: Date.now(), n: c.coins.past, label: 'Cadeau de bienvenue' });
      }
      update((s) => bank(s, T));
      return;
    }
    const e = earnedCoins(S, T);
    const p = prevCoins.current;
    prevCoins.current = e ? { ...e, T } : null;
    if (!e || !p || p.T !== T || e.total <= p.total) return;
    let why = null, most = 0;
    Object.keys(e.today).forEach((k) => { const d = e.today[k] - (p.today[k] || 0); if (d > most) { most = d; why = k; } });
    setRain({ id: Date.now(), n: e.total - p.total, label: why ? GAIN_LABEL[why] : '' });
  }, [S, T]);

  if (!S || !theme) return <View style={{ flex: 1, backgroundColor: C.bg }} />;

  const current = TABS.find((t) => t.id === tab);
  const Screen = current.screen;
  const pick = (id) => setTab(id);
  const title = current.title || current.label;
  const addDay = tab === 'cal' ? cd : T;
  const addKind = tab === 'week' || tab === 'pet' ? 'habit' : tab === 'cal' ? 'event' : 'todo';

  return (
    <View key={theme} style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar style={C.dark ? 'light' : 'dark'} />
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
            <Text style={{ fontFamily: C.serif, color: C.tx, fontSize: 32, fontWeight: '700', letterSpacing: -0.3 }}>{title}</Text>
          </View>
          {/* Changer de design : Cozy (chat) ou Focus (sombre). */}
          <Pressable onPress={toggleTheme} accessibilityRole="button" hitSlop={6}
            accessibilityLabel={C.name === 'focus' ? 'Passer au design Cozy' : 'Passer au mode Focus'}
            style={({ pressed }) => ({ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: C.card, borderWidth: 1, borderColor: C.line, opacity: pressed ? 0.7 : 1 })}>
            {C.name === 'focus' ? <MoodIcon size={20} color={C.pri} /> : <MoonIcon size={19} color={C.pri} />}
          </Pressable>
          {/* Ajouter (tâche, événement, examen, habitude) : en haut, pas dans le menu. */}
          <Pressable onPress={() => setAdd(addKind)} accessibilityRole="button" accessibilityLabel="Ajouter" hitSlop={6}
            style={({ pressed }) => ({ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: C.pri, opacity: pressed ? 0.8 : 1 })}>
            <PlusIcon size={20} color={C.onPri} />
          </Pressable>
        </View>
        <Screen S={S} update={update} replace={replace} T={T} cd={cd} setCd={setCd} wide={wide} openAdd={setAdd} openGym={() => setGym(true)} />
      </ScrollView>

      <View style={{ position: 'absolute', left: 0, right: 0, bottom: insets.bottom + 16, alignItems: 'center' }} pointerEvents="box-none">
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View
            accessibilityRole="tablist"
            style={{
              flexDirection: 'row', gap: 4, padding: 6, borderRadius: 999,
              backgroundColor: C.bar, borderWidth: 1, borderColor: C.barLine,
              backdropFilter: 'blur(20px) saturate(160%)', WebkitBackdropFilter: 'blur(20px) saturate(160%)',
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
                    width: 50, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center',
                    backgroundColor: on ? 'rgba(255,255,255,0.14)' : 'transparent',
                  }}
                >
                  <t.Icon size={21} color={on ? '#FFFFFF' : 'rgba(255,255,255,0.55)'} />
                  <View style={{ width: 4, height: 4, borderRadius: 2, marginTop: 3, backgroundColor: on ? '#FFFFFF' : 'transparent' }} />
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>

      <GymModule visible={gym} onClose={() => setGym(false)} S={S} update={update} T={T} />
      {rain ? <CoinRain key={rain.id} amount={rain.n} label={rain.label} onDone={() => setRain(null)} /> : null}
      <QuickAdd visible={!!add} initial={add || 'todo'} onClose={() => setAdd(null)} update={update} k={addDay} T={T} />
    </View>
  );
}
