// Créer son chat : on choisit chaque détail et on voit le résultat tout de suite.
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { C } from '../theme';
import { Btn, Card, Field, H, Mu, Row } from '../components/ui';
import { CatDrawing } from './Cat';
import { EYES, FURS, HAIR_COLORS, HAIRS, OUTFITS, PATTERNS, SEXES, SUITS, TIES, randomLook } from './looks';

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
export default function Creator({ initial, initialName, onDone, onCancel, editing, stage = 0, wide }) {
  const [look, setLook] = useState(initial);
  const [name, setName] = useState(initialName || NAMES[0]);
  const set = (key) => (v) => setLook((l) => ({ ...l, [key]: v }));
  const finalName = name.trim() || 'Minou';

  const previewCard = (
    <View style={{ borderRadius: 28, overflow: 'hidden' }}>
      <LinearGradient colors={[C.lav1, C.lav2, '#F7F6FD']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ padding: 16, alignItems: 'center' }}>
        <Row style={{ alignSelf: 'stretch', justifyContent: 'space-between' }}>
          <Text style={{ color: C.acc, fontSize: 11, fontWeight: '700', letterSpacing: 1 }}>{editing ? 'MODIFIER' : 'CRÉE TON CHAT'}</Text>
          <Pressable onPress={() => { setLook(randomLook()); if (!editing) setName(NAMES[Math.floor(Math.random() * NAMES.length)]); }}
            accessibilityRole="button" accessibilityLabel="Au hasard"
            style={{ paddingVertical: 5, paddingHorizontal: 12, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.7)' }}>
            <Text style={{ color: C.tx, fontSize: 12, fontWeight: '700' }}>Au hasard</Text>
          </Pressable>
        </Row>
        <CatDrawing look={look} stage={stage} mood="ok" size={wide ? 240 : 210} />
        <Text style={{ color: C.tx, fontSize: 24, fontWeight: '700', letterSpacing: -0.5 }}>{finalName}</Text>
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
        <Card>
          <H>Le chat</H>
          <Section title="Pelage" sub={FURS[look.fur].label}><Swatches title="Pelage" options={FURS} value={look.fur} onPick={set('fur')} color={(k, o) => o.fur} /></Section>
          <Section title="Motif"><Chips title="Motif" options={PATTERNS} value={look.pat} onPick={set('pat')} /></Section>
          <Section title="Yeux" sub={EYES[look.eye].label}><Swatches title="Yeux" options={EYES} value={look.eye} onPick={set('eye')} color={(k, o) => o.c} /></Section>
          <Section title="Coupe de cheveux"><Chips title="Coupe" options={HAIRS} value={look.hair} onPick={set('hair')} /></Section>
          {look.hair !== 'none' ? (
            <Section title="Couleur des cheveux" sub={HAIR_COLORS[look.hc].label}>
              <Swatches title="Couleur des cheveux" options={HAIR_COLORS} value={look.hc} onPick={set('hc')} color={(k, o) => o.c} />
            </Section>
          ) : null}
        </Card>
        <Card>
          <H>La tenue</H>
          <Section title="Style"><Chips title="Tenue" options={OUTFITS} value={look.out} onPick={set('out')} /></Section>
          <Section title={look.out === 'col' ? 'Couleur du pull' : 'Couleur du costume'} sub={SUITS[look.suit].label}>
            <Swatches title="Couleur du costume" options={SUITS} value={look.suit} onPick={set('suit')} color={(k, o) => o.c} />
          </Section>
          <Section title={look.out === 'col' ? 'Couleur du pendentif' : look.out === 'noeud' ? 'Couleur du nœud' : 'Couleur de la cravate'} sub={TIES[look.tie].label}>
            <Swatches title="Couleur de la cravate" options={TIES} value={look.tie} onPick={set('tie')} color={(k, o) => o.c} />
          </Section>
        </Card>
        <Btn label={editing ? 'Enregistrer' : 'Adopter ' + finalName} active onPress={() => onDone(look, finalName)} style={{ paddingVertical: 14 }} />
        {onCancel ? <Btn label="Annuler" ghost onPress={onCancel} /> : null}
      </View>
    </View>
  );
}
