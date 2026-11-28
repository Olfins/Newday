// Créer son chat : on choisit chaque détail et on voit le résultat tout de suite.
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { C } from '../theme';
import { Btn, Card, Field, H, Mu, Row } from '../components/ui';
import { PetDrawing } from './Cat';
import { MON_OUTFITS, SPECIES, isStarter } from './species';
import { ACCESSORIES, EYES, FURS, OUTFITS, PATTERNS, SEXES, SUITS, TIES, available, randomLook } from './looks';

const NAMES = ['Charbon', 'Caramel', 'Moka', 'Biscotte', 'Pixel', 'Réglisse', 'Noisette', 'Gaston', 'Praline', 'Oscar', 'Mimi', 'Tofu'];

// Une rangée de pastilles de couleur.
function Swatches({ options, value, onPick, color, title }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8 }}>
      {Object.entries(options).map(([k, o]) => {
        const on = value === k;
        const c = color(k, o);
        return (
          <Pressable key={k} onPress={() => onPick(k)} accessibilityRole="button" accessibilityState={{ selected: on }} accessibilityLabel={title + ' : ' + o.label}
            style={{ width: 40, height: 40, borderRadius: 20, padding: 3, borderWidth: 2, borderColor: on ? C.pri : 'transparent' }}>
            <View style={{ flex: 1, borderRadius: 16, backgroundColor: c || 'transparent', borderWidth: 1, borderColor: 'rgba(23,23,29,0.12)', alignItems: 'center', justifyContent: 'center' }}>
              {!c ? <Text style={{ color: C.mu, fontSize: 10, fontWeight: '700' }}>=</Text> : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

// Une rangée de choix écrits.
function Chips({ options, value, onPick, title }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
      {Object.entries(options).map(([k, o]) => {
        const on = value === k;
        return (
          <Pressable key={k} onPress={() => onPick(k)} accessibilityRole="button" accessibilityState={{ selected: on }} accessibilityLabel={title + ' : ' + o.label}
            style={{ paddingVertical: 8, paddingHorizontal: 14, borderRadius: 999, backgroundColor: on ? C.pri : C.field, borderWidth: 1, borderColor: on ? C.pri : C.line }}>
            <Text style={{ color: on ? C.onPri : C.tx, fontWeight: '600', fontSize: 13 }}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function Section({ title, sub, children }) {
  return (
    <View style={{ marginTop: 16 }}>
      <Row style={{ justifyContent: 'space-between' }}>
        <Text style={{ color: C.tx, fontWeight: '700', fontSize: 15 }}>{title}</Text>
        {sub ? <Mu style={{ fontSize: 12 }}>{sub}</Mu> : null}
      </Row>
      {children}
    </View>
  );
}

// initial : l'apparence de départ ; onDone(look, name) ; editing : modifier un chat existant.
// own : objets achetés dans la boutique (les accessoires et tenues à acheter n'apparaissent qu'une fois achetés).
export default function Creator({ initial, initialName, onDone, onCancel, editing, stage = 0, wide, own, species }) {
  const starter = isStarter(species);
  const accs = available(ACCESSORIES, 'acc', own);
  const outs = available(starter ? MON_OUTFITS[species] : OUTFITS, 'out', own);
  const [look, setLook] = useState(initial);
  const [name, setName] = useState(initialName || NAMES[0]);
  const set = (key) => (v) => setLook((l) => ({ ...l, [key]: v }));
  const finalName = name.trim() || 'Minou';
  const outfit = (starter ? MON_OUTFITS[species][look.out] : OUTFITS[look.out]) || OUTFITS.cravate;

  const previewCard = (
    <View style={{ borderRadius: 28, overflow: 'hidden' }}>
      <LinearGradient colors={[C.lav1, C.lav2, C.lav3]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ padding: 16, alignItems: 'center' }}>
        <Row style={{ alignSelf: 'stretch', justifyContent: 'space-between' }}>
          <Text style={{ color: C.acc, fontSize: 11, fontWeight: '700', letterSpacing: 1 }}>{editing ? 'MODIFIER' : 'CRÉE TON CHAT'}</Text>
          <Pressable onPress={() => { if (starter) { const any = (o) => { const k = Object.keys(o); return k[Math.floor(Math.random() * k.length)]; }; setLook((l) => ({ ...l, acc: any(accs), out: any(outs), suit: any(SUITS), tie: any(TIES) })); return; } setLook(randomLook(own)); if (!editing) setName(NAMES[Math.floor(Math.random() * NAMES.length)]); }}
            accessibilityRole="button" accessibilityLabel="Au hasard"
            style={{ paddingVertical: 5, paddingHorizontal: 12, borderRadius: 999, backgroundColor: C.chip }}>
            <Text style={{ color: C.tx, fontSize: 12, fontWeight: '700' }}>Au hasard</Text>
          </Pressable>
        </Row>
        <PetDrawing species={species} look={look} stage={stage} mood="ok" size={wide ? 240 : 210} />
        <Text style={{ fontFamily: C.serif, color: C.tx, fontSize: 24, fontWeight: '700', letterSpacing: -0.2 }}>{finalName}</Text>
      </LinearGradient>
    </View>
  );

  return (
    <View style={wide ? { flexDirection: 'row', gap: 16, alignItems: 'flex-start' } : { gap: 14 }}>
      <View style={wide ? { flex: 1 } : null}>{previewCard}</View>
      <View style={wide ? { flex: 1, gap: 14 } : { gap: 14 }}>
        <Card>
          <H>Son prénom</H>
          <Field value={name} onChangeText={setName} placeholder="Minou" maxLength={18} />
          <Section title="Garçon ou fille"><Chips title="Sexe" options={SEXES} value={look.sex} onPick={set('sex')} /></Section>
        </Card>
        {starter ? (
          <Card>
            <H>Accessoire</H>
            <Chips title="Accessoire" options={accs} value={look.acc} onPick={set('acc')} />
          </Card>
        ) : (
          <Card>
            <H>Le chat</H>
            <Section title="Pelage" sub={FURS[look.fur].label}><Swatches title="Pelage" options={FURS} value={look.fur} onPick={set('fur')} color={(k, o) => o.fur} /></Section>
            <Section title="Motif"><Chips title="Motif" options={PATTERNS} value={look.pat} onPick={set('pat')} /></Section>
            <Section title="Yeux" sub={EYES[look.eye].label}><Swatches title="Yeux" options={EYES} value={look.eye} onPick={set('eye')} color={(k, o) => o.c} /></Section>
            <Section title="Accessoire"><Chips title="Accessoire" options={accs} value={look.acc} onPick={set('acc')} /></Section>
          </Card>
        )}
        <Card>
          <H>{starter ? 'Sa tenue' : 'La tenue'}</H>
          <Section title="Style"><Chips title="Tenue" options={outs} value={look.out} onPick={set('out')} /></Section>
          {outfit.suit ? (
            <Section title={outfit.suit} sub={(SUITS[look.suit] || SUITS.marine).label}>
              <Swatches title={outfit.suit} options={SUITS} value={look.suit} onPick={set('suit')} color={(k, o) => o.c} />
            </Section>
          ) : null}
          {outfit.tie ? (
            <Section title={outfit.tie} sub={(TIES[look.tie] || TIES.violet).label}>
              <Swatches title={outfit.tie} options={TIES} value={look.tie} onPick={set('tie')} color={(k, o) => o.c} />
            </Section>
          ) : null}
          {!editing || starter ? <Mu style={{ marginTop: 14, fontSize: 12 }}>{starter ? 'Ses tenues sont faites pour son corps de ' + SPECIES[species].stages[0] + '. D’autres t’attendent dans la boutique.' : 'D’autres accessoires et tenues t’attendent dans la boutique.'}</Mu> : null}
        </Card>
        <Btn label={editing ? 'Enregistrer' : 'Adopter ' + finalName} active onPress={() => onDone(look, finalName)} style={{ paddingVertical: 14 }} />
        {onCancel ? <Btn label="Annuler" ghost onPress={onCancel} /> : null}
      </View>
    </View>
  );
}
