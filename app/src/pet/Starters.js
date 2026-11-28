// Choisir son starter : plante, eau ou feu. On voit sa ligne d'évolution avant de choisir.
// Sert à l'adoption (gratuit) et au changement de starter (payant, voir rules.js).
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { C } from '../theme';
import { Btn, Card, Field, H, Mu, Row } from '../components/ui';
import { Coin } from '../components/Coin';
import { MonsterDrawing } from './Monster';
import { SPECIES, STARTERS } from './species';

// mode : 'adopt' ou 'change'. current : espèce actuelle (pas proposée au changement).
// cost : prix en pièces (0 = gratuit) ; coins : pièces disponibles.
// onDone(species, name) ; onCancel ; onCat : créer un chat à la place (adoption seulement).
export default function Starters({ mode = 'adopt', current, cost = 0, coins = 0, keepXp, keepName, wide, onDone, onCancel, onCat }) {
  const list = STARTERS.filter((s) => s !== current);
  const [sp, setSp] = useState(null);
  const [name, setName] = useState('');
  const info = sp ? SPECIES[sp] : null;
  const finalName = name.trim() || keepName || (info ? info.stages[0] : '');
  const short = cost > coins;

  return (
    <View style={{ gap: 14 }}>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {list.map((k) => {
          const s = SPECIES[k], on = sp === k;
          return (
            <Pressable key={k} onPress={() => { setSp(k); setName(''); }} accessibilityRole="button" accessibilityState={{ selected: on }}
              accessibilityLabel={'Starter ' + s.label + ' : ' + s.stages[0]}
              style={{ flex: 1, borderRadius: 22, overflow: 'hidden', borderWidth: 2, borderColor: on ? s.color : C.line, backgroundColor: C.card }}>
              <LinearGradient colors={[s.soft, 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ alignItems: 'center', paddingTop: 8, paddingBottom: 10 }}>
                <View style={{ paddingVertical: 2, paddingHorizontal: 9, borderRadius: 999, backgroundColor: s.color }}>
                  <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '800', letterSpacing: 0.6 }}>{s.label.toUpperCase()}</Text>
                </View>
                <MonsterDrawing species={k} stage={0} mood={on ? 'happy' : 'ok'} size={wide ? 140 : 104} t={1} />
                <Text style={{ color: C.tx, fontWeight: '700', fontSize: 14, marginTop: -2 }}>{s.stages[0]}</Text>
              </LinearGradient>
            </Pressable>
          );
        })}
      </View>

      {info ? (
        <Card>
          <Row style={{ justifyContent: 'space-between' }}>
            <H style={{ marginBottom: 0 }}>{info.stages[0]}</H>
            <View style={{ paddingVertical: 3, paddingHorizontal: 10, borderRadius: 999, backgroundColor: info.soft }}>
              <Text style={{ color: info.color, fontSize: 12, fontWeight: '700' }}>Type {info.label.toLowerCase()}</Text>
            </View>
          </Row>
          <Mu style={{ marginTop: 4 }}>{info.blurb}</Mu>
          <Text style={{ color: C.tx, fontWeight: '700', fontSize: 14, marginTop: 14 }}>Ses évolutions</Text>
          <View style={{ flexDirection: 'row', marginTop: 4 }}>
            {info.stages.map((n, i) => (
              <View key={n} style={{ flex: 1, alignItems: 'center' }}>
                <MonsterDrawing species={sp} stage={i} mood="ok" size={wide ? 110 : 80} t={1} />
                <Text style={{ color: C.tx, fontSize: 12, fontWeight: '700' }} numberOfLines={1}>{n}</Text>
                <Mu style={{ fontSize: 11 }}>{i * 250} XP</Mu>
              </View>
            ))}
          </View>
          <Text style={{ color: C.tx, fontWeight: '700', fontSize: 14, marginTop: 14, marginBottom: 6 }}>Son prénom</Text>
          <Field value={name} onChangeText={setName} placeholder={keepName || info.stages[0]} maxLength={18} />
          {mode === 'change' ? (
            <View style={{ marginTop: 12, padding: 12, borderRadius: 14, backgroundColor: C.accSoft }}>
              {cost ? (
                <>
                  <Row style={{ gap: 6 }}>
                    <Text style={{ color: C.tx, fontWeight: '700' }}>Prix : {cost}</Text>
                    <Coin size={15} />
                  </Row>
                  <Mu style={{ marginTop: 4, fontSize: 12, lineHeight: 18 }}>
                    Ton compagnon actuel s’en va et {finalName} commence à l’étape 1 (0 XP, garde-manger vide).
                    Tes pièces restantes, tes objets achetés et tes habitudes ne changent pas.
                  </Mu>
                </>
              ) : (
                <>
                  <Text style={{ color: C.tx, fontWeight: '700' }}>Gratuit, une seule fois</Text>
                  <Mu style={{ marginTop: 4, fontSize: 12, lineHeight: 18 }}>
                    Ton chat devient un {info.stages[keepXp || 0]} nommé {finalName} et garde tout son XP{keepXp ? ' : il arrive directement à l’étape « ' + info.stages[keepXp] + ' »' : ''}.
                    Ensuite, changer de starter coûtera des pièces et recommencera à zéro.
                  </Mu>
                </>
              )}
            </View>
          ) : null}
          <Btn label={short ? 'Il manque ' + (cost - coins) + ' pièces' : (mode === 'change' ? 'Choisir ' : 'Adopter ') + finalName}
            active={!short} disabled={short} onPress={() => onDone(sp, finalName)} style={{ paddingVertical: 14, marginTop: 14 }} />
        </Card>
      ) : (
        <Mu style={{ textAlign: 'center' }}>Touche un starter pour voir ses évolutions.</Mu>
      )}
      {onCancel ? <Btn label="Annuler" ghost onPress={onCancel} /> : null}
      {onCat ? (
        <Pressable onPress={onCat} accessibilityRole="button" style={{ alignSelf: 'center', paddingVertical: 8 }}>
          <Text style={{ color: C.mu, fontSize: 13, textDecorationLine: 'underline' }}>Je préfère créer un chat</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
