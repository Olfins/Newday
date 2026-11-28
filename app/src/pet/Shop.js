// La boutique de l'onglet Pet : accessoires, tenues (propres à chaque starter), déco (selon le type
// du compagnon) et meubles de la maison (pour tous), à acheter avec ses pièces.
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { C } from '../theme';
import { Card, H, Mu, Row } from '../components/ui';
import { Coin, CoinPill } from '../components/Coin';
import { PetDrawing } from './Cat';
import { ACCESSORIES, OUTFITS, petLook } from './looks';
import { DECOS, DecoArt, SLOTS, fits } from './Room';
import { MON_OUTFITS, SPECIES, isStarter, speciesOf } from './species';
import { buy, owns, place, wallet, GAIN } from './coins';

const TABS = [
  { id: 'acc', label: 'Accessoires' },
  { id: 'out', label: 'Tenues' },
  { id: 'deco', label: 'Déco' },
  { id: 'home', label: 'Maison' },
];

// Les objets d'un onglet pour ce compagnon. Les déco gardent l'identifiant « deco: » (déjà achetées avant).
const listOf = (tab, sp) => {
  if (tab === 'deco' || tab === 'home') {
    return Object.entries(DECOS).filter(([, v]) => v.price && !!v.home === (tab === 'home') && fits(v, sp))
      .map(([k, v]) => ({ k, id: 'deco:' + k, ...v }))
      .sort((a, b) => (a.type ? 0 : 1) - (b.type ? 0 : 1) || a.price - b.price);
  }
  const src = tab === 'acc' ? ACCESSORIES : isStarter(sp) ? MON_OUTFITS[sp] : OUTFITS;
  return Object.entries(src).filter(([, v]) => v.price).map(([k, v]) => ({ k, id: tab + ':' + k, ...v })).sort((a, b) => a.price - b.price);
};
const isDeco = (tab) => tab === 'deco' || tab === 'home';

export default function Shop({ S, update, T, stage, onEvent }) {
  const [tab, setTab] = useState('acc');
  const [confirm, setConfirm] = useState(null);
  const coins = wallet(S, T);
  const look = petLook(S.pet);
  const room = (S.shop && S.shop.room) || {};
  const pet = S.pet;
  const sp = speciesOf(pet);

  const wear = (it) => update((s) => {
    const l = petLook(s.pet);
    if (tab === 'acc') l.acc = l.acc === it.k ? 'none' : it.k;
    else l.out = it.k;
    s.pet.look = l;
  });

  const press = (it) => {
    const has = owns(S, it.id);
    if (!has) {
      if (coins < it.price) return;
      if (confirm !== it.id) { setConfirm(it.id); return; }
      setConfirm(null);
      update((s) => {
        if (!buy(s, T, it.id, it.price)) return;
        // On l'utilise tout de suite.
        if (isDeco(tab)) place(s, it.slot, it.k);
        else {
          const l = petLook(s.pet);
          if (tab === 'acc') l.acc = it.k; else l.out = it.k;
          s.pet.look = l;
        }
      });
      onEvent && onEvent(isDeco(tab) ? 'Merci ! J’adore ma nouvelle déco.' : 'Merci ! Je l’adore !');
      return;
    }
    if (isDeco(tab)) update((s) => place(s, it.slot, it.k));
    else if (!(tab === 'out' && look.out === it.k)) { wear(it); onEvent && onEvent('Nouveau look !'); }
    else wear(it);
  };

  return (
    <Card>
      <Row style={{ justifyContent: 'space-between' }}>
        <H style={{ marginBottom: 0 }}>Boutique</H>
        <CoinPill n={coins} bg={C.accSoft} textColor={C.tx} />
      </Row>
      <Mu style={{ marginTop: 4 }}>Gagne des pièces avec tes habitudes, tâches et rendez-vous, puis gâte {pet.name}.</Mu>
      {tab === 'deco' && isStarter(sp) ? <Mu style={{ marginTop: 6, fontSize: 12 }}>Les déco marquées « {SPECIES[sp].label} » sont réservées à ton starter de type {SPECIES[sp].label.toLowerCase()}.</Mu> : null}
      {tab === 'out' && isStarter(sp) ? <Mu style={{ marginTop: 6, fontSize: 12 }}>Ces tenues sont faites sur mesure pour {SPECIES[sp].stages[0]} et ses évolutions.</Mu> : null}
      {tab === 'home' ? <Mu style={{ marginTop: 6, fontSize: 12 }}>Lits, murs, sols et tapis : pour tous les compagnons.</Mu> : null}

      <View style={{ flexDirection: 'row', gap: 4, padding: 4, marginTop: 12, borderRadius: 999, backgroundColor: C.field, borderWidth: 1, borderColor: C.line }}>
        {TABS.map((t) => (
          <Pressable key={t.id} onPress={() => { setTab(t.id); setConfirm(null); }} accessibilityRole="tab" accessibilityState={{ selected: tab === t.id }}
            style={{ flex: 1, paddingVertical: 8, borderRadius: 999, alignItems: 'center', backgroundColor: tab === t.id ? C.pri : 'transparent' }}>
            <Text style={{ color: tab === t.id ? C.onPri : C.tx, fontWeight: '600', fontSize: 13 }}>{t.label}</Text>
          </Pressable>
        ))}
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 }}>
        {listOf(tab, sp).map((it) => {
          const has = owns(S, it.id);
          const on = tab === 'acc' ? look.acc === it.k : tab === 'out' ? look.out === it.k : room[it.slot] === it.k;
          const deco = isDeco(tab);
          const short = !has && coins < it.price;
          const asking = confirm === it.id;
          const preview = deco
            ? <DecoArt id={it.k} size={it.slot === 'wall' || it.slot === 'floor' ? 84 : 70} />
            : <PetDrawing species={sp} look={{ ...look, [tab]: it.k }} stage={tab === 'acc' ? Math.max(1, stage) : stage} mood="happy" size={tab === 'acc' ? 128 : 100} />;
          let btn, btnOn = false;
          if (!has) { btn = asking ? 'Confirmer ?' : null; btnOn = asking; }
          else if (deco) { btn = on ? 'Ranger' : 'Placer'; btnOn = !on; }
          else if (tab === 'acc') { btn = on ? 'Enlever' : 'Porter'; btnOn = !on; }
          else { btn = on ? 'Porté' : 'Porter'; btnOn = !on; }
          return (
            <View key={it.id} style={{ flexGrow: 1, flexBasis: 140, maxWidth: '48.5%', borderRadius: 18, backgroundColor: C.card2, borderWidth: 1, borderColor: on ? C.pri : C.line, padding: 10, alignItems: 'center' }}>
              <View style={{ height: 96, width: '100%', borderRadius: 12, backgroundColor: C.lav3, alignItems: 'center', justifyContent: tab === 'acc' ? 'flex-start' : 'center', overflow: 'hidden' }}>
                <View style={tab === 'acc' ? { marginTop: -14 } : null}>{preview}</View>
                {on ? (
                  <View style={{ position: 'absolute', top: 6, right: 6, paddingVertical: 2, paddingHorizontal: 7, borderRadius: 999, backgroundColor: C.pri }}>
                    <Text style={{ color: C.onPri, fontSize: 10, fontWeight: '700' }}>{deco ? 'PLACÉ' : 'PORTÉ'}</Text>
                  </View>
                ) : null}
                {deco && it.type && SPECIES[it.type] ? (
                  <View style={{ position: 'absolute', top: 6, left: 6, paddingVertical: 2, paddingHorizontal: 7, borderRadius: 999, backgroundColor: SPECIES[it.type].color }}>
                    <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '700' }}>{SPECIES[it.type].label.toUpperCase()}</Text>
                  </View>
                ) : null}
              </View>
              <Text style={{ color: C.tx, fontWeight: '700', fontSize: 13, marginTop: 8, textAlign: 'center' }} numberOfLines={1}>{it.label}</Text>
              {deco ? <Mu style={{ fontSize: 11 }}>{SLOTS[it.slot]}</Mu> : null}
              <Pressable onPress={() => press(it)} disabled={short || (tab === 'out' && on)} accessibilityRole="button"
                accessibilityLabel={has ? (btn + ' ' + it.label) : 'Acheter ' + it.label + ' pour ' + it.price + ' pièces'}
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
