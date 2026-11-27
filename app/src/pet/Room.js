// La pièce du chat : les décorations achetées dans la boutique, posées autour de lui.
// Chaque décoration a un emplacement (mur à gauche, mur à droite, en haut, sol à gauche,
// sol à droite, tapis) : une seule par emplacement.
import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Ellipse, G, Line, Path, Rect } from 'react-native-svg';

export const SLOTS = {
  top: 'En haut', wallL: 'Mur gauche', wallR: 'Mur droit', floorL: 'Sol gauche', floorR: 'Sol droit', rug: 'Tapis',
};

const BOOKS = ['#2F5B4B', '#7A2E3E', '#B8862F', '#4F7596', '#6C5FD4', '#C46A3C'];

// w, h : taille du dessin (en points) ; draw() : le dessin dans une boîte 0 0 w h.
export const DECOS = {
  // ---- En haut ----
  guirlande: {
    slot: 'top', label: 'Guirlande lumineuse', price: 120, w: 300, h: 34,
    draw: () => (
      <G>
        <Path d="M0 6 Q37 26 75 8 Q112 26 150 8 Q187 26 225 8 Q262 26 300 6" stroke="#5B4A3A" strokeWidth="1.5" fill="none" />
        {[18, 46, 75, 104, 132, 168, 196, 225, 254, 282].map((x, i) => {
          const y = 8 + Math.abs(Math.sin(((x % 75) / 75) * Math.PI)) * 9 + 4;
          const c = ['#F2C14C', '#F08A3C', '#F19CB7', '#9CD7A0', '#9CC7F0'][i % 5];
          return (
            <G key={x}>
              <Circle cx={x} cy={y + 3} r="7" fill={c} opacity="0.25" />
              <Ellipse cx={x} cy={y + 3} rx="3.4" ry="4.4" fill={c} />
            </G>
          );
        })}
      </G>
    ),
  },
  fanions: {
    slot: 'top', label: 'Fanions', price: 80, w: 300, h: 34,
    draw: () => (
      <G>
        <Path d="M0 4 Q150 18 300 4" stroke="#5B4A3A" strokeWidth="1.5" fill="none" />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
          const x = 8 + i * 26.5, y = 4 + 14 * (1 - Math.pow((x - 150) / 150, 2)) * 0.95;
          return <Path key={i} d={`M${x - 9} ${y} L${x + 9} ${y} L${x} ${y + 18} Z`} fill={['#D9465A', '#E8B83A', '#2F6B52', '#4F7596'][i % 4]} />;
        })}
      </G>
    ),
  },
  // ---- Mur gauche ----
  tableau: {
    slot: 'wallL', label: 'Tableau', price: 150, w: 64, h: 52,
    draw: () => (
      <G>
        <Rect x="2" y="2" width="60" height="48" rx="2" fill="#BFD9E8" stroke="#8A6A3A" strokeWidth="4" />
        <Circle cx="44" cy="16" r="6" fill="#F2C14C" />
        <Path d="M4 48 L4 36 Q18 22 32 34 Q44 26 60 36 L60 48 Z" fill="#7FB77E" />
        <Path d="M4 48 L4 42 Q24 34 60 44 L60 48 Z" fill="#5E9A5D" />
      </G>
    ),
  },
  fenetre: {
    slot: 'wallL', label: 'Fenêtre étoilée', price: 200, w: 62, h: 74,
    draw: () => (
      <G>
        <Rect x="3" y="3" width="56" height="62" rx="26" fill="#2B3A5C" stroke="#F6F0E4" strokeWidth="5" />
        <Path d="M40 18 a9 9 0 1 0 6 15 a7 7 0 1 1 -6 -15z" fill="#F6E7B0" />
        {[[14, 20], [22, 36], [12, 48], [44, 50], [30, 14]].map(([x, y], i) => <Circle key={i} cx={x} cy={y} r="1.4" fill="#FFFFFF" />)}
        <Line x1="31" y1="5" x2="31" y2="63" stroke="#F6F0E4" strokeWidth="3" />
        <Line x1="5" y1="38" x2="57" y2="38" stroke="#F6F0E4" strokeWidth="3" />
        <Rect x="0" y="64" width="62" height="7" rx="2" fill="#C9AE8E" />
      </G>
    ),
  },
  etagere: {
    slot: 'wallL', label: 'Étagère à livres', price: 180, w: 72, h: 50,
    draw: () => (
      <G>
        {[0, 1, 2, 3, 4].map((i) => <Rect key={i} x={4 + i * 8} y={12 + (i % 2) * 4} width="7" height={30 - (i % 2) * 4} rx="1" fill={BOOKS[i]} />)}
        <Rect x="44" y="18" width="7" height="24" rx="1" fill={BOOKS[5]} transform="rotate(14 47 42)" />
        <Path d="M60 42 h10 l-1.5 -9 h-7 z" fill="#C46A3C" />
        <Path d="M65 33 C62 26 58 24 56 20 M65 33 C66 25 70 22 72 18" stroke="#5E9A5D" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <Rect x="0" y="42" width="72" height="5" rx="2" fill="#8A6A3A" />
        <Path d="M10 47 v3 M62 47 v3" stroke="#6B4A2B" strokeWidth="3" />
      </G>
    ),
  },
  // ---- Mur droit ----
  horloge: {
    slot: 'wallR', label: 'Horloge', price: 120, w: 46, h: 46,
    draw: () => (
      <G>
        <Circle cx="23" cy="23" r="20" fill="#FFFDF7" stroke="#6B4A2B" strokeWidth="3.5" />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
          const a = (i * Math.PI) / 6;
          return <Circle key={i} cx={23 + Math.sin(a) * 15} cy={23 - Math.cos(a) * 15} r={i % 3 ? 0.9 : 1.6} fill="#6B4A2B" />;
        })}
        <Line x1="23" y1="23" x2="23" y2="12" stroke="#22302A" strokeWidth="2.2" strokeLinecap="round" />
        <Line x1="23" y1="23" x2="31" y2="27" stroke="#22302A" strokeWidth="2.2" strokeLinecap="round" />
        <Circle cx="23" cy="23" r="2" fill="#B4483A" />
      </G>
    ),
  },
  diplome: {
    slot: 'wallR', label: 'Diplôme encadré', price: 100, w: 56, h: 46,
    draw: () => (
      <G>
        <Rect x="2" y="2" width="52" height="42" rx="2" fill="#FFF8E7" stroke="#C9A23A" strokeWidth="4" />
        <Line x1="12" y1="13" x2="44" y2="13" stroke="#22302A" strokeWidth="2.4" strokeLinecap="round" />
        {[20, 26, 32].map((y) => <Line key={y} x1="12" y1={y} x2={y === 32 ? 30 : 44} y2={y} stroke="#B5B2C4" strokeWidth="1.6" strokeLinecap="round" />)}
        <Circle cx="40" cy="33" r="5" fill="#B4483A" />
        <Path d="M37 37 l-1 5 l3 -2 z M43 37 l1 5 l-3 -2 z" fill="#B4483A" />
      </G>
    ),
  },
  // ---- Sol gauche ----
  plante: {
    slot: 'floorL', label: 'Plante verte', price: 100, w: 56, h: 84,
    draw: () => (
      <G>
        <Path d="M28 56 C14 48 4 34 8 18 C18 26 24 38 28 56 Z" fill="#5E9A5D" />
        <Path d="M28 56 C40 44 52 34 50 14 C38 22 30 36 28 56 Z" fill="#7FB77E" />
        <Path d="M28 56 C24 40 26 22 32 6 C38 22 34 40 28 56 Z" fill="#4C8A4B" />
        <Path d="M12 56 H44 L40 82 H16 Z" fill="#C46A3C" />
        <Rect x="10" y="54" width="36" height="7" rx="2" fill="#A9552C" />
      </G>
    ),
  },
  lampe: {
    slot: 'floorL', label: 'Lampe sur pied', price: 160, w: 50, h: 116,
    draw: () => (
      <G>
        <Ellipse cx="25" cy="26" rx="24" ry="18" fill="#F6E7B0" opacity="0.35" />
        <Path d="M10 30 L16 6 H34 L40 30 Z" fill="#F2E2B8" stroke="#D9C38C" strokeWidth="1.5" />
        <Line x1="25" y1="30" x2="25" y2="110" stroke="#5B4A3A" strokeWidth="3" />
        <Ellipse cx="25" cy="111" rx="13" ry="4" fill="#5B4A3A" />
      </G>
    ),
  },
  bibliotheque: {
    slot: 'floorL', label: 'Bibliothèque', price: 300, w: 66, h: 108,
    draw: () => (
      <G>
        <Rect x="2" y="2" width="62" height="104" rx="3" fill="#8A6A3A" />
        <Rect x="7" y="7" width="52" height="94" fill="#6B4A2B" />
        {[0, 1, 2].map((r) => (
          <G key={r}>
            {[0, 1, 2, 3, 4].map((i) => <Rect key={i} x={9 + i * 10} y={12 + r * 31 + (i % 3) * 2} width="8" height={24 - (i % 3) * 2} rx="1" fill={BOOKS[(i + r * 2) % 6]} />)}
            <Rect x="7" y={36 + r * 31} width="52" height="4" fill="#8A6A3A" />
          </G>
        ))}
      </G>
    ),
  },
  // ---- Sol droit ----
  panier: {
    slot: 'floorR', label: 'Panier douillet', price: 150, w: 80, h: 38,
    draw: () => (
      <G>
        <Ellipse cx="40" cy="20" rx="36" ry="14" fill="#E9B6BE" />
        <Path d="M4 18 Q4 36 40 36 Q76 36 76 18 Q76 28 40 28 Q4 28 4 18 Z" fill="#B07A4A" />
        <Path d="M4 18 Q40 6 76 18" stroke="#B07A4A" strokeWidth="5" fill="none" strokeLinecap="round" />
        <G stroke="#8A5A32" strokeWidth="1.2">
          {[14, 26, 40, 54, 66].map((x) => <Line key={x} x1={x} y1="26" x2={x} y2="34" />)}
        </G>
      </G>
    ),
  },
  arbre: {
    slot: 'floorR', label: 'Arbre à chat', price: 350, w: 64, h: 124,
    draw: () => (
      <G>
        <Rect x="14" y="20" width="9" height="96" fill="#D9C3A0" />
        <Rect x="42" y="56" width="9" height="60" fill="#D9C3A0" />
        <G stroke="#B39674" strokeWidth="1">
          {[26, 34, 42, 50, 58, 66, 74, 82, 90, 98, 106].map((y) => <Line key={y} x1="14" y1={y} x2="23" y2={y + 3} />)}
          {[62, 70, 78, 86, 94, 102, 110].map((y) => <Line key={y} x1="42" y1={y} x2="51" y2={y + 3} />)}
        </G>
        <Rect x="2" y="12" width="36" height="9" rx="4" fill="#B79E7E" />
        <Rect x="30" y="50" width="32" height="8" rx="4" fill="#B79E7E" />
        <Line x1="54" y1="58" x2="54" y2="74" stroke="#5B4A3A" strokeWidth="1" />
        <Circle cx="54" cy="77" r="4" fill="#D9465A" />
        <Rect x="0" y="114" width="64" height="9" rx="3" fill="#B79E7E" />
      </G>
    ),
  },
  livres: {
    slot: 'floorR', label: 'Pile de livres', price: 60, w: 46, h: 46,
    draw: () => (
      <G>
        <Rect x="4" y="36" width="38" height="9" rx="1.5" fill={BOOKS[0]} />
        <Rect x="7" y="27" width="32" height="9" rx="1.5" fill={BOOKS[1]} />
        <Rect x="3" y="18" width="36" height="9" rx="1.5" fill={BOOKS[2]} />
        <Rect x="8" y="9" width="28" height="9" rx="1.5" fill={BOOKS[3]} />
        <Path d="M26 9 v-6 h9 v6 z" fill="#FFFFFF" stroke="#D5D2E8" strokeWidth="1" />
      </G>
    ),
  },
  // ---- Tapis ----
  tapis: {
    slot: 'rug', label: 'Tapis rond', price: 120, w: 210, h: 30,
    draw: () => (
      <G>
        <Ellipse cx="105" cy="15" rx="103" ry="14" fill="#C98E7A" />
        <Ellipse cx="105" cy="15" rx="84" ry="10" fill="none" stroke="#F6E2D2" strokeWidth="2.5" />
        <Ellipse cx="105" cy="15" rx="60" ry="6.5" fill="none" stroke="#A86A56" strokeWidth="2.5" />
      </G>
    ),
  },
  persan: {
    slot: 'rug', label: 'Tapis persan', price: 250, w: 236, h: 32,
    draw: () => (
      <G>
        <Path d="M22 2 H214 L234 30 H2 Z" fill="#8E2F3A" />
        <Path d="M30 6 H206 L222 26 H14 Z" fill="none" stroke="#E8B83A" strokeWidth="2" />
        <Path d="M118 9 L136 16 L118 23 L100 16 Z" fill="#E8B83A" />
        <Path d="M118 12 L127 16 L118 20 L109 16 Z" fill="#2F3B5C" />
        {[56, 180].map((x) => <Circle key={x} cx={x} cy="16" r="4" fill="#E8B83A" />)}
      </G>
    ),
  },
};

// Le dessin d'une décoration, mis à l'échelle (pour la boutique).
export function DecoArt({ id, size }) {
  const d = DECOS[id];
  if (!d) return null;
  const k = Math.min(size / d.w, size / d.h);
  return (
    <Svg width={d.w * k} height={d.h * k} viewBox={`0 0 ${d.w} ${d.h}`}>{d.draw()}</Svg>
  );
}

// La pièce : les décorations placées, derrière le chat (children).
export function Room({ room, children }) {
  const r = room || {};
  const art = (slot, style) => {
    const d = DECOS[r[slot]];
    if (!d || d.slot !== slot) return null;
    return (
      <View key={slot} pointerEvents="none" style={[{ position: 'absolute' }, style]}>
        <Svg width={d.w} height={d.h} viewBox={`0 0 ${d.w} ${d.h}`}>{d.draw()}</Svg>
      </View>
    );
  };
  const top = DECOS[r.top];
  return (
    <View style={{ alignSelf: 'stretch', alignItems: 'center' }}>
      {top && top.slot === 'top' ? (
        <View pointerEvents="none" style={{ position: 'absolute', top: 4, left: -6, right: -6, height: top.h }}>
          <Svg width="100%" height={top.h} viewBox={`0 0 ${top.w} ${top.h}`} preserveAspectRatio="none">{top.draw()}</Svg>
        </View>
      ) : null}
      {art('wallL', { left: 0, top: 54 })}
      {art('wallR', { right: 2, top: 58 })}
      {r.rug && DECOS[r.rug] ? (
        <View pointerEvents="none" style={{ position: 'absolute', bottom: 14, left: 0, right: 0, alignItems: 'center' }}>
          <Svg width={DECOS[r.rug].w} height={DECOS[r.rug].h} viewBox={`0 0 ${DECOS[r.rug].w} ${DECOS[r.rug].h}`}>{DECOS[r.rug].draw()}</Svg>
        </View>
      ) : null}
      {art('floorL', { left: -4, bottom: 26 })}
      {art('floorR', { right: -4, bottom: 26 })}
      {children}
    </View>
  );
}
