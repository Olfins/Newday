// La boutique de l'onglet Bonsaï : pots, sellettes, bois de la bibliothèque, murs et objets,
// à acheter avec ses pièces. Le premier de chaque catégorie est offert.
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { C } from '../theme';
import { Card, H, Mu, Row } from '../components/ui';
import { Coin, CoinPill } from '../components/Coin';
import { TreeArt } from './Bonsai';
import Library from './Library';
import { CATS, setupOf } from './items';
import { buy, equip, owns, wallet, GAIN } from './coins';

export default function Shop({ S, update, T, g, health, shelves }) {
  const [tab, setTab] = useState('pot');
  const [confirm, setConfirm] = useState(null);
  const coins = wallet(S, T);
  const setup = setupOf(S);
  const cat = CATS.find((c) => c.id === tab);
  const items = Object.entries(cat.items).map(([k, v]) => ({ k, id: tab + ':' + k, ...v }));

  const press = (it) => {
    const free = !it.price;
    const has = free || owns(S, it.id);
    if (!has) {
      if (coins < it.price) return;
      if (confirm !== it.id) { setConfirm(it.id); return; }
      setConfirm(null);
      update((s) => { if (buy(s, T, it.id, it.price)) equip(s, tab, it.k); });
      return;
    }
    update((s) => equip(s, tab, it.k === cat.base ? null : it.k));
  };

  return (
    <Card>
      <Row style={{ justifyContent: 'space-between' }}>
        <H style={{ marginBottom: 0 }}>Boutique</H>
        <CoinPill n={coins} bg={C.accSoft} textColor={C.tx} />
      </Row>
      <Mu style={{ marginTop: 4 }}>Tes pièces viennent de tes habitudes, tâches et rendez-vous. Elles habillent la pièce, pas l’arbre : lui ne grandit qu’avec tes habitudes.</Mu>

      <View style={{ flexDirection: 'row', gap: 2, padding: 4, marginTop: 12, borderRadius: 999, backgroundColor: C.field, borderWidth: 1, borderColor: C.line }}>
        {CATS.map((t) => (
          <Pressable key={t.id} onPress={() => { setTab(t.id); setConfirm(null); }} accessibilityRole="tab" accessibilityState={{ selected: tab === t.id }}
            style={{ flex: 1, paddingVertical: 8, borderRadius: 999, alignItems: 'center', backgroundColor: tab === t.id ? C.pri : 'transparent' }}>
            <Text numberOfLines={1} style={{ color: tab === t.id ? C.onPri : C.tx, fontWeight: '600', fontSize: 12 }}>{t.label}</Text>
          </Pressable>
        ))}
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 }}>
        {items.map((it) => {
          const free = !it.price;
          const has = free || owns(S, it.id);
          const on = setup[tab] === it.k;
          const short = !has && coins < it.price;
          const asking = confirm === it.id;
          const look = { ...setup, [tab]: it.k };
          const preview = tab === 'pot' || tab === 'stand'
            ? <TreeArt g={Math.max(0.45, g)} health={Math.max(0.7, health)} pot={look.pot} stand={look.stand} size={tab === 'pot' ? 92 : 78} dark={C.dark} />
            : <View style={{ width: 118 }}><Library shelves={shelves} g={g} health={health} setup={look} style={{ borderRadius: 8 }} /></View>;
          let btn, btnOn = false;
          if (!has) { btn = asking ? 'Confirmer ?' : null; btnOn = asking; }
          else { btn = on ? 'Installé' : 'Installer'; btnOn = !on; }
          return (
            <View key={it.id} style={{ flexGrow: 1, flexBasis: 140, maxWidth: '48.5%', borderRadius: 18, backgroundColor: C.card2, borderWidth: 1, borderColor: on ? C.pri : C.line, padding: 10, alignItems: 'center' }}>
              <View style={{ height: 104, width: '100%', borderRadius: 12, backgroundColor: C.lav3, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {preview}
                {on ? (
                  <View style={{ position: 'absolute', top: 6, right: 6, paddingVertical: 2, paddingHorizontal: 7, borderRadius: 999, backgroundColor: C.pri }}>
                    <Text style={{ color: C.onPri, fontSize: 10, fontWeight: '700' }}>INSTALLÉ</Text>
                  </View>
                ) : null}
              </View>
              <Text style={{ color: C.tx, fontWeight: '700', fontSize: 13, marginTop: 8, textAlign: 'center' }} numberOfLines={1}>{it.label}</Text>
              {free ? <Mu style={{ fontSize: 11 }}>Offert</Mu> : null}
              <Pressable onPress={() => press(it)} disabled={short || on} accessibilityRole="button"
                accessibilityLabel={has ? btn + ' ' + it.label : 'Acheter ' + it.label + ' pour ' + it.price + ' pièces'}
                style={({ pressed }) => ({
                  marginTop: 8, alignSelf: 'stretch', flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center',
                  paddingVertical: 8, borderRadius: 999, borderWidth: 1,
                  backgroundColor: btnOn ? C.pri : 'transparent', borderColor: btnOn ? C.pri : C.line,
                  opacity: short ? 0.45 : pressed ? 0.7 : 1,
                })}>
                {!has && !asking ? <Coin size={15} /> : null}
                <Text style={{ color: btnOn ? C.onPri : C.tx, fontWeight: '700', fontSize: 13 }}>{btn || it.price}</Text>
              </Pressable>
              {short ? <Mu style={{ fontSize: 11, marginTop: 4 }}>Il manque {it.price - coins}</Mu> : null}
            </View>
          );
        })}
      </View>
      <Mu style={{ fontSize: 12, marginTop: 12, lineHeight: 18 }}>
        Habitude cochée +{GAIN.h} · Toutes les habitudes du jour +{GAIN.all} · Tâche faite +{GAIN.t} · Rendez-vous ou cours passé +{GAIN.ev} · Séance de salle +{GAIN.w} · Examen passé +{GAIN.x}
      </Mu>
    </Card>
  );
}
