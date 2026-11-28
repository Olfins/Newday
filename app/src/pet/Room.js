// La pièce du compagnon : les décorations achetées dans la boutique, posées autour de lui.
// Chaque décoration a un emplacement (papier peint, sol, en haut, mur à gauche, mur à droite,
// sol à gauche, sol à droite, tapis) : une seule par emplacement.
// type : réservée à un starter ('plante', 'eau', 'feu') ou au chat ('chat'). Sans type : pour tous.
// home : true pour les meubles de la maison (murs, sols, tapis, lits), rangés dans l'onglet « Maison ».
import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Ellipse, G, Line, Path, Rect } from 'react-native-svg';

export const SLOTS = {
  wall: 'Papier peint', floor: 'Sol', top: 'En haut', wallL: 'Mur gauche', wallR: 'Mur droit', floorL: 'Sol gauche', floorR: 'Sol droit', rug: 'Tapis',
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
    slot: 'floorR', home: true, label: 'Panier douillet', price: 150, w: 80, h: 38,
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
    slot: 'floorR', type: 'chat', label: 'Arbre à chat', price: 350, w: 64, h: 124,
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
    slot: 'rug', home: true, label: 'Tapis rond', price: 120, w: 210, h: 30,
    draw: () => (
      <G>
        <Ellipse cx="105" cy="15" rx="103" ry="14" fill="#C98E7A" />
        <Ellipse cx="105" cy="15" rx="84" ry="10" fill="none" stroke="#F6E2D2" strokeWidth="2.5" />
        <Ellipse cx="105" cy="15" rx="60" ry="6.5" fill="none" stroke="#A86A56" strokeWidth="2.5" />
      </G>
    ),
  },
  persan: {
    slot: 'rug', home: true, label: 'Tapis persan', price: 250, w: 236, h: 32,
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
  // ======== Pour tous : la maison ========
  // ---- Lits (sol droit) ----
  lit: {
    slot: 'floorR', home: true, label: 'Lit douillet', price: 280, w: 96, h: 60,
    draw: () => (
      <G>
        <Rect x="2" y="8" width="10" height="50" rx="3" fill="#8A6A3A" />
        <Rect x="84" y="26" width="10" height="32" rx="3" fill="#8A6A3A" />
        <Rect x="8" y="30" width="80" height="18" rx="5" fill="#F6F0E4" />
        <Rect x="12" y="22" width="26" height="14" rx="7" fill="#FFFFFF" stroke="#E4D9C3" strokeWidth="1.5" />
        <Path d="M34 28 H86 Q90 28 90 34 V46 H34 Z" fill="#7FA7C9" />
        <G stroke="#9CC0DE" strokeWidth="2">
          <Line x1="46" y1="29" x2="46" y2="46" /><Line x1="60" y1="29" x2="60" y2="46" /><Line x1="74" y1="29" x2="74" y2="46" />
        </G>
        <Rect x="6" y="46" width="84" height="7" rx="2" fill="#A07A48" />
      </G>
    ),
  },
  pouf: {
    slot: 'floorR', home: true, label: 'Gros pouf', price: 140, w: 62, h: 42,
    draw: () => (
      <G>
        <Ellipse cx="31" cy="26" rx="29" ry="15" fill="#E8B83A" />
        <Ellipse cx="31" cy="20" rx="25" ry="11" fill="#F2CB5E" />
        <Path d="M31 9 Q29 20 31 31 M12 18 Q22 22 31 20 Q40 22 50 18" stroke="#D9A62E" strokeWidth="1.5" fill="none" />
      </G>
    ),
  },
  // ---- Papiers peints (tout le fond) ----
  rayures: {
    slot: 'wall', home: true, label: 'Papier peint rayé', price: 150, w: 300, h: 300,
    draw: () => (
      <G>
        <Rect width="300" height="300" fill="#F3E3D3" />
        {Array.from({ length: 15 }).map((_, i) => <Rect key={i} x={i * 20 + 6} y="0" width="8" height="300" fill="#EBD3BE" />)}
      </G>
    ),
  },
  briques: {
    slot: 'wall', home: true, label: 'Mur de briques', price: 220, w: 300, h: 300,
    draw: () => (
      <G>
        <Rect width="300" height="300" fill="#E9D6C8" />
        {Array.from({ length: 16 }).map((_, r) => Array.from({ length: 9 }).map((_, c) => (
          <Rect key={r + '-' + c} x={c * 36 - (r % 2) * 18 + 2} y={r * 19 + 2} width="32" height="15" rx="2" fill={(r * 7 + c * 3) % 5 ? '#C98E74' : '#BB7E64'} />
        )))}
      </G>
    ),
  },
  boiserie: {
    slot: 'wall', home: true, label: 'Boiserie', price: 260, w: 300, h: 300,
    draw: () => (
      <G>
        <Rect width="300" height="300" fill="#E5DCC6" />
        {Array.from({ length: 12 }).map((_, i) => <Circle key={i} cx={i * 26 + 12} cy="40" r="2" fill="#D3C6A6" />)}
        <Rect x="0" y="150" width="300" height="150" fill="#8E6B46" />
        <Rect x="0" y="146" width="300" height="8" fill="#6E5034" />
        {[0, 1, 2, 3, 4].map((i) => <Rect key={i} x={i * 62 + 8} y="166" width="48" height="120" rx="3" fill="none" stroke="#6E5034" strokeWidth="3" />)}
      </G>
    ),
  },
  nuit: {
    slot: 'wall', home: true, label: 'Ciel de nuit', price: 300, w: 300, h: 300,
    draw: () => (
      <G>
        <Rect width="300" height="300" fill="#2B3A5C" />
        {[[30, 30], [80, 70], [140, 24], [200, 60], [262, 30], [50, 120], [250, 110], [110, 150], [180, 130], [280, 190], [20, 200]].map(([x, y], i) => <Circle key={i} cx={x} cy={y} r={i % 3 ? 1.4 : 2.2} fill="#F6E7B0" />)}
        <Path d="M236 40 a16 16 0 1 0 12 26 a12 12 0 1 1 -12 -26z" fill="#F6E7B0" />
      </G>
    ),
  },
  // ---- Sols (bas de la pièce) ----
  parquet: {
    slot: 'floor', home: true, label: 'Parquet', price: 150, w: 300, h: 60,
    draw: () => (
      <G>
        <Rect width="300" height="60" fill="#C49A6C" />
        {[0, 1, 2, 3].map((r) => (
          <G key={r}>
            <Line x1="0" y1={r * 15} x2="300" y2={r * 15} stroke="#A57E54" strokeWidth="1.5" />
            {[0, 1, 2, 3, 4, 5].map((c) => <Line key={c} x1={c * 60 + (r % 2) * 30 + 10} y1={r * 15} x2={c * 60 + (r % 2) * 30 + 10} y2={r * 15 + 15} stroke="#A57E54" strokeWidth="1.5" />)}
          </G>
        ))}
      </G>
    ),
  },
  damier: {
    slot: 'floor', home: true, label: 'Carrelage damier', price: 200, w: 300, h: 60,
    draw: () => (
      <G>
        <Rect width="300" height="60" fill="#F4F1EA" />
        {Array.from({ length: 4 }).map((_, r) => Array.from({ length: 20 }).map((_, c) => ((r + c) % 2 ? <Rect key={r + '-' + c} x={c * 15} y={r * 15} width="15" height="15" fill="#2E2C3A" /> : null)))}
      </G>
    ),
  },
  moquette: {
    slot: 'floor', home: true, label: 'Moquette', price: 120, w: 300, h: 60,
    draw: () => (
      <G>
        <Rect width="300" height="60" fill="#D8B9B0" />
        {Array.from({ length: 40 }).map((_, i) => <Circle key={i} cx={(i * 37) % 300} cy={(i * 23) % 60} r="1.3" fill="#C8A59B" />)}
      </G>
    ),
  },

  // ======== Type plante ========
  lierre: {
    slot: 'top', type: 'plante', label: 'Lierre grimpant', price: 140, w: 300, h: 40,
    draw: () => (
      <G>
        <Path d="M0 6 Q75 22 150 8 Q225 22 300 6" stroke="#5E7F3A" strokeWidth="2.5" fill="none" />
        {Array.from({ length: 22 }).map((_, i) => {
          const x = 6 + i * 13.5, y = 9 + Math.abs(Math.sin((x / 150) * Math.PI)) * 9 + (i % 2) * 7;
          return <Path key={i} d="M0 -6 C5 -3 5 3 0 6 C-5 3 -5 -3 0 -6 Z" fill={i % 3 ? '#4C8A4B' : '#7FB77E'} transform={`translate(${x} ${y}) rotate(${i * 40})`} />;
        })}
      </G>
    ),
  },
  suspendu: {
    slot: 'wallL', type: 'plante', label: 'Jardin suspendu', price: 240, w: 66, h: 84,
    draw: () => (
      <G>
        <Rect x="2" y="2" width="62" height="5" rx="2" fill="#8A6A3A" />
        {[12, 33, 54].map((x, i) => (
          <G key={x}>
            <Line x1={x} y1="7" x2={x} y2={22 + i * 8} stroke="#B39674" strokeWidth="1.5" />
            <Path d={`M${x - 8} ${22 + i * 8} h16 l-2 10 h-12 z`} fill="#C46A3C" />
            <Path d={`M${x} ${32 + i * 8} q-6 14 -4 ${24 - i * 6} M${x} ${32 + i * 8} q5 10 6 ${18 - i * 4}`} stroke="#5E9A5D" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <Path d={`M${x - 6} ${22 + i * 8} C${x - 8} ${12 + i * 8} ${x + 8} ${12 + i * 8} ${x + 6} ${22 + i * 8} Z`} fill="#7FB77E" />
          </G>
        ))}
      </G>
    ),
  },
  terrarium: {
    slot: 'wallR', type: 'plante', label: 'Terrarium', price: 200, w: 54, h: 58,
    draw: () => (
      <G>
        <Rect x="0" y="50" width="54" height="6" rx="2" fill="#8A6A3A" />
        <Path d="M27 4 L50 26 L44 50 H10 L4 26 Z" fill="rgba(200,230,240,0.55)" stroke="#9FB8C2" strokeWidth="2" strokeLinejoin="round" />
        <Path d="M10 50 Q27 38 44 50 Z" fill="#8A6A3A" />
        <Path d="M20 46 q-2 -10 3 -16 M28 46 q1 -12 7 -14 M24 44 q-6 -4 -8 -10" stroke="#5E9A5D" strokeWidth="2.4" strokeLinecap="round" fill="none" />
        <Circle cx="35" cy="31" r="2.6" fill="#F19CB7" />
        <Line x1="27" y1="4" x2="27" y2="50" stroke="#9FB8C2" strokeWidth="1" opacity="0.6" />
      </G>
    ),
  },
  monstera: {
    slot: 'floorL', type: 'plante', label: 'Grande monstera', price: 220, w: 70, h: 104,
    draw: () => (
      <G>
        {[[-30, 32, 0.95], [28, 26, 1], [-6, 14, 1.05], [10, 40, 0.85]].map(([r, y, k], i) => (
          <G key={i} transform={`translate(35 ${y + 30}) rotate(${r}) scale(${k})`}>
            <Line x1="0" y1="30" x2="0" y2="0" stroke="#4C8A4B" strokeWidth="2.5" />
            <Path d="M0 -26 C20 -24 22 2 0 6 C-22 2 -20 -24 0 -26 Z" fill={i % 2 ? '#5E9A5D' : '#4C8A4B'} />
            <Path d="M0 -20 V2 M0 -12 l9 -5 M0 -6 l-10 -4 M0 -14 l-8 -6" stroke="#7FB77E" strokeWidth="1.6" strokeLinecap="round" />
          </G>
        ))}
        <Path d="M16 78 H54 L50 102 H20 Z" fill="#E6D9C3" />
        <Rect x="14" y="75" width="42" height="7" rx="2" fill="#D3C3A6" />
      </G>
    ),
  },
  bonsai: {
    slot: 'floorR', type: 'plante', label: 'Bonsaï', price: 260, w: 66, h: 62,
    draw: () => (
      <G>
        <Path d="M33 44 C30 34 22 30 16 26 M33 44 C36 32 44 28 50 22 M33 40 C33 30 32 22 34 16" stroke="#6B4A2B" strokeWidth="4" strokeLinecap="round" fill="none" />
        <Ellipse cx="16" cy="20" rx="14" ry="8" fill="#4C8A4B" />
        <Ellipse cx="50" cy="16" rx="14" ry="8" fill="#5E9A5D" />
        <Ellipse cx="34" cy="10" rx="13" ry="8" fill="#7FB77E" />
        <Path d="M8 46 H58 L54 58 H12 Z" fill="#2F5B4B" />
        <Rect x="5" y="43" width="56" height="5" rx="2" fill="#244A3C" />
      </G>
    ),
  },
  murvegetal: {
    slot: 'wall', home: true, type: 'plante', label: 'Mur végétal', price: 350, w: 300, h: 300,
    draw: () => (
      <G>
        <Rect width="300" height="300" fill="#DCE8C8" />
        {Array.from({ length: 60 }).map((_, i) => {
          const x = (i * 53) % 300, y = (i * 37) % 300;
          return <Path key={i} d="M0 -10 C8 -5 8 5 0 10 C-8 5 -8 -5 0 -10 Z" fill={['#A9C98A', '#8DB86C', '#BBD69E'][i % 3]} transform={`translate(${x} ${y}) rotate(${(i * 47) % 360})`} />;
        })}
      </G>
    ),
  },
  herbe: {
    slot: 'floor', home: true, type: 'plante', label: 'Sol en herbe', price: 180, w: 300, h: 60,
    draw: () => (
      <G>
        <Rect width="300" height="60" fill="#8DBA6A" />
        {Array.from({ length: 34 }).map((_, i) => {
          const x = (i * 29) % 300, y = 8 + ((i * 17) % 48);
          return <Path key={i} d={`M${x} ${y} l-3 -7 M${x} ${y} l0 -8 M${x} ${y} l3 -7`} stroke="#6E9F4E" strokeWidth="1.6" strokeLinecap="round" />;
        })}
        {[[40, 30], [210, 44], [130, 18]].map(([x, y], i) => <Circle key={i} cx={x} cy={y} r="2.6" fill={i % 2 ? '#F6C6D6' : '#FFFFFF'} />)}
      </G>
    ),
  },

  // ======== Type feu ========
  lanternes: {
    slot: 'top', type: 'feu', label: 'Lanternes', price: 140, w: 300, h: 44,
    draw: () => (
      <G>
        <Path d="M0 4 Q150 20 300 4" stroke="#5B4A3A" strokeWidth="1.5" fill="none" />
        {[30, 90, 150, 210, 270].map((x, i) => {
          const y = 4 + 16 * (1 - Math.pow((x - 150) / 150, 2)) * 0.95;
          const c = ['#D9465A', '#E8892A', '#E8B83A'][i % 3];
          return (
            <G key={x}>
              <Circle cx={x} cy={y + 16} r="14" fill={c} opacity="0.18" />
              <Rect x={x - 3} y={y} width="6" height="3" fill="#3A2A1E" />
              <Ellipse cx={x} cy={y + 15} rx="9" ry="11" fill={c} />
              <Line x1={x} y1={y + 4} x2={x} y2={y + 26} stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
              <Rect x={x - 3} y={y + 25} width="6" height="3" fill="#3A2A1E" />
            </G>
          );
        })}
      </G>
    ),
  },
  volcan: {
    slot: 'wallL', type: 'feu', label: 'Tableau volcan', price: 180, w: 64, h: 52,
    draw: () => (
      <G>
        <Rect x="2" y="2" width="60" height="48" rx="2" fill="#F6C99A" stroke="#3A2A1E" strokeWidth="4" />
        <Path d="M4 48 L24 20 H40 L60 48 Z" fill="#6B4A3A" />
        <Path d="M24 20 H40 L36 26 L32 22 L28 27 Z" fill="#E8442A" />
        <Path d="M30 20 Q26 10 32 6 Q38 10 34 20 Z" fill="#FF9A2E" />
        <Circle cx="18" cy="12" r="3" fill="#B0A39A" opacity="0.7" /><Circle cx="46" cy="10" r="4" fill="#B0A39A" opacity="0.6" />
      </G>
    ),
  },
  bougies: {
    slot: 'wallR', type: 'feu', label: 'Étagère à bougies', price: 120, w: 60, h: 44,
    draw: () => (
      <G>
        {[[10, 22], [24, 14], [38, 20], [50, 26]].map(([x, y], i) => (
          <G key={i}>
            <Circle cx={x} cy={y - 4} r="6" fill="#FFD95A" opacity="0.25" />
            <Path d={`M${x} ${y - 9} q3 4 0 6 q-3 -2 0 -6 z`} fill="#FF9A2E" />
            <Rect x={x - 4} y={y} width="8" height={38 - y} rx="1.5" fill={i % 2 ? '#F6F0E4' : '#E9D6B8'} />
          </G>
        ))}
        <Rect x="0" y="38" width="60" height="5" rx="2" fill="#6B4A2B" />
      </G>
    ),
  },
  cheminee: {
    slot: 'floorL', type: 'feu', label: 'Cheminée', price: 420, w: 92, h: 100,
    draw: () => (
      <G>
        <Rect x="0" y="8" width="92" height="10" rx="2" fill="#8A6A3A" />
        <Rect x="6" y="18" width="80" height="82" fill="#B5A08A" />
        {[0, 1, 2, 3, 4].map((r) => [0, 1, 2].map((c) => <Rect key={r + '-' + c} x={8 + c * 26 + (r % 2) * 13 - (r % 2 && c === 2 ? 13 : 0)} y={20 + r * 16} width="24" height="14" rx="2" fill={(r + c) % 2 ? '#A68F78' : '#BFAA93'} />))}
        <Path d="M22 100 V60 Q46 40 70 60 V100 Z" fill="#2A2020" />
        <Circle cx="46" cy="84" r="20" fill="#FF9A2E" opacity="0.2" />
        <Path d="M30 96 h32" stroke="#6B4A2B" strokeWidth="6" strokeLinecap="round" />
        <Path d="M46 94 C34 94 32 82 38 74 C38 80 42 80 42 78 C40 70 46 64 48 58 C50 68 58 70 56 80 C60 78 60 74 60 72 C64 82 58 94 46 94 Z" fill="#E8442A" />
        <Path d="M46 94 C40 94 38 86 42 80 C44 84 46 82 46 80 C46 76 48 72 50 70 C52 78 56 82 54 88 C53 92 50 94 46 94 Z" fill="#FFD95A" />
        <Rect x="28" y="0" width="8" height="8" rx="2" fill="#E8B83A" />
        <Rect x="58" y="2" width="12" height="6" rx="2" fill="#6C5FD4" />
      </G>
    ),
  },
  bois: {
    slot: 'floorR', type: 'feu', label: 'Panier de bûches', price: 160, w: 64, h: 46,
    draw: () => (
      <G>
        {[[14, 20], [32, 16], [50, 20], [22, 8], [42, 6]].map(([x, y], i) => (
          <G key={i}>
            <Rect x={x - 10} y={y} width="20" height="12" rx="6" fill="#8A5A32" />
            <Circle cx={x + 8} cy={y + 6} r="5" fill="#D9A066" />
            <Circle cx={x + 8} cy={y + 6} r="2" fill="#B07A4A" />
          </G>
        ))}
        <Path d="M2 26 H62 L56 44 H8 Z" fill="#3A3335" />
        <Rect x="0" y="24" width="64" height="5" rx="2" fill="#4E4547" />
      </G>
    ),
  },
  murpierre: {
    slot: 'wall', home: true, type: 'feu', label: 'Mur de pierre', price: 300, w: 300, h: 300,
    draw: () => (
      <G>
        <Rect width="300" height="300" fill="#8E8178" />
        {Array.from({ length: 10 }).map((_, r) => Array.from({ length: 6 }).map((_, c) => (
          <Rect key={r + '-' + c} x={c * 56 - (r % 2) * 28 + 3} y={r * 31 + 3} width="50" height="25" rx="7" fill={['#A39488', '#9A8A7E', '#AE9F92'][(r + c) % 3]} />
        )))}
      </G>
    ),
  },
  ardoise: {
    slot: 'floor', home: true, type: 'feu', label: 'Sol volcanique', price: 200, w: 300, h: 60,
    draw: () => (
      <G>
        <Rect width="300" height="60" fill="#3E3638" />
        {Array.from({ length: 4 }).map((_, r) => Array.from({ length: 8 }).map((_, c) => <Rect key={r + '-' + c} x={c * 40 - (r % 2) * 20 + 1} y={r * 15 + 1} width="38" height="13" rx="2" fill={(r + c) % 3 ? '#4E4547' : '#463E40'} />))}
        <Path d="M40 16 l8 6 l-4 8 M200 30 l6 5 l10 -2 M120 46 l-6 6" stroke="#FF8A2A" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.85" />
      </G>
    ),
  },

  // ======== Type eau ========
  coquillages: {
    slot: 'top', type: 'eau', label: 'Guirlande de coquillages', price: 120, w: 300, h: 36,
    draw: () => (
      <G>
        <Path d="M0 6 Q75 24 150 8 Q225 24 300 6" stroke="#B39674" strokeWidth="1.5" fill="none" />
        {[22, 58, 94, 130, 170, 206, 242, 278].map((x, i) => {
          const y = 8 + Math.abs(Math.sin((x / 150) * Math.PI)) * 9 + 3;
          return i % 2 ? (
            <Path key={x} d={`M${x} ${y + 12} L${x - 8} ${y + 2} Q${x} ${y - 4} ${x + 8} ${y + 2} Z`} fill="#F6C6B4" stroke="#E0A28A" strokeWidth="1" />
          ) : (
            <G key={x}>
              <Path d={`M${x} ${y} C${x + 9} ${y} ${x + 9} ${y + 12} ${x} ${y + 12} C${x - 6} ${y + 12} ${x - 6} ${y + 4} ${x} ${y + 4}`} fill="#F6E2C4" stroke="#D9B88C" strokeWidth="1.2" />
            </G>
          );
        })}
      </G>
    ),
  },
  hublot: {
    slot: 'wallL', type: 'eau', label: 'Hublot', price: 180, w: 60, h: 60,
    draw: () => (
      <G>
        <Circle cx="30" cy="30" r="27" fill="#B8862F" />
        <Circle cx="30" cy="30" r="21" fill="#3E7FB5" />
        <Path d="M10 36 Q20 30 30 36 Q40 42 50 36 V44 Q30 56 10 44 Z" fill="#2F6696" />
        <Path d="M22 24 l6 -3 l-1 4 z M36 30 l7 -3 l-1 5 z" fill="#F2B33D" />
        <Circle cx="18" cy="18" r="2" fill="#FFFFFF" opacity="0.7" /><Circle cx="44" cy="20" r="1.4" fill="#FFFFFF" opacity="0.7" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <Circle key={i} cx={30 + Math.cos((i * Math.PI) / 4) * 24} cy={30 + Math.sin((i * Math.PI) / 4) * 24} r="1.6" fill="#6B4A2B" />)}
      </G>
    ),
  },
  bouee: {
    slot: 'wallR', type: 'eau', label: 'Bouée murale', price: 100, w: 50, h: 50,
    draw: () => (
      <G>
        <Circle cx="25" cy="25" r="18" fill="none" stroke="#D9465A" strokeWidth="11" />
        <Circle cx="25" cy="25" r="18" fill="none" stroke="#FFFFFF" strokeWidth="11" strokeDasharray="14 14.3" />
        <Circle cx="25" cy="25" r="23.5" fill="none" stroke="#B39674" strokeWidth="1.5" />
      </G>
    ),
  },
  aquarium: {
    slot: 'floorL', type: 'eau', label: 'Aquarium', price: 360, w: 84, h: 100,
    draw: () => (
      <G>
        <Rect x="10" y="62" width="64" height="38" fill="#6B4A2B" />
        <Rect x="14" y="66" width="56" height="30" fill="#5A3E24" />
        <Rect x="2" y="6" width="80" height="58" rx="4" fill="#9CD3F0" stroke="#5C6B78" strokeWidth="3" />
        <Rect x="4" y="8" width="76" height="8" fill="#BFE3F7" />
        <Path d="M4 56 Q20 50 36 56 Q52 62 80 54 V62 H4 Z" fill="#E9D3A6" />
        <Path d="M16 58 q-4 -14 2 -24 M20 58 q4 -10 0 -18 M66 58 q-2 -12 4 -20" stroke="#4C8A4B" strokeWidth="2.6" strokeLinecap="round" fill="none" />
        <Path d="M40 30 q8 -6 14 0 q-6 6 -14 0 z M54 30 l5 -4 v8 z" fill="#F08A3C" />
        <Path d="M26 42 q6 -4 10 0 q-4 4 -10 0 z M36 42 l4 -3 v6 z" fill="#E8B83A" />
        {[[60, 20], [62, 14], [58, 9]].map(([x, y], i) => <Circle key={i} cx={x} cy={y} r={1.6 + i * 0.4} fill="none" stroke="#FFFFFF" strokeWidth="1" />)}
      </G>
    ),
  },
  fontaine: {
    slot: 'floorR', type: 'eau', label: 'Fontaine coquillage', price: 240, w: 66, h: 66,
    draw: () => (
      <G>
        <Path d="M8 44 Q33 64 58 44 Z" fill="#F6C6B4" />
        <Path d="M8 44 Q33 30 58 44" stroke="#E0A28A" strokeWidth="2" fill="#FBE0D4" />
        {[16, 24, 33, 42, 50].map((x) => <Line key={x} x1="33" y1="58" x2={x} y2="46" stroke="#E0A28A" strokeWidth="1.2" />)}
        <Rect x="30" y="16" width="6" height="30" rx="3" fill="#C9AE8E" />
        <Path d="M33 16 Q22 8 14 26 M33 16 Q44 8 52 26" stroke="#7FC4F0" strokeWidth="3" fill="none" strokeLinecap="round" />
        <Ellipse cx="33" cy="42" rx="20" ry="4" fill="#9CD3F0" />
        <Rect x="26" y="56" width="14" height="8" rx="2" fill="#C9AE8E" />
      </G>
    ),
  },
  murocean: {
    slot: 'wall', home: true, type: 'eau', label: 'Mur océan', price: 320, w: 300, h: 300,
    draw: () => (
      <G>
        <Rect width="300" height="300" fill="#CFE6F5" />
        <Rect y="110" width="300" height="190" fill="#B6D8EE" />
        <Rect y="210" width="300" height="90" fill="#9CC9E6" />
        {[110, 210].map((y) => <Path key={y} d={`M0 ${y} ${Array.from({ length: 10 }).map((_, i) => `Q${i * 30 + 15} ${y - 8} ${i * 30 + 30} ${y}`).join(' ')}`} stroke="#FFFFFF" strokeWidth="3" fill="none" opacity="0.6" />)}
        {[[40, 160], [250, 140], [200, 250], [70, 250], [150, 60]].map(([x, y], i) => <Circle key={i} cx={x} cy={y} r={3 + (i % 3) * 2} fill="none" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.8" />)}
      </G>
    ),
  },
  sable: {
    slot: 'floor', home: true, type: 'eau', label: 'Sol de sable', price: 180, w: 300, h: 60,
    draw: () => (
      <G>
        <Rect width="300" height="60" fill="#EBD3A6" />
        {Array.from({ length: 50 }).map((_, i) => <Circle key={i} cx={(i * 41) % 300} cy={(i * 19) % 60} r="1" fill="#D6B985" />)}
        <Path d="M60 40 L52 30 Q60 24 68 30 Z" fill="#F6C6B4" />
        <Path d="M230 26 l4 -8 l4 8 l8 1 l-6 5 l2 8 l-8 -4 l-8 4 l2 -8 l-6 -5 z" fill="#F08A3C" />
      </G>
    ),
  },
};

// Le dessin d'une décoration, mis à l'échelle (pour la boutique).
export function DecoArt({ id, size }) {
  const d = DECOS[id];
  if (!d) return null;
  // Sol : on montre un morceau agrandi (la bande entière serait trop fine).
  if (d.slot === 'floor') return <Svg width={size * 1.3} height={size * 0.75} viewBox="0 0 110 60" preserveAspectRatio="xMidYMid slice">{d.draw()}</Svg>;
  const k = Math.min(size / d.w, size / d.h);
  return (
    <Svg width={d.w * k} height={d.h * k} viewBox={`0 0 ${d.w} ${d.h}`}>{d.draw()}</Svg>
  );
}

// Une décoration est visible pour ce compagnon (les déco d'un autre type restent rangées).
export const fits = (d, species) => !!d && (!d.type || d.type === (species || 'chat'));

// La pièce : les décorations placées, derrière le compagnon (children).
export function Room({ room, species, children }) {
  const r = room || {};
  const get = (slot) => { const d = DECOS[r[slot]]; return d && d.slot === slot && fits(d, species) ? d : null; };
  const art = (slot, style) => {
    const d = get(slot);
    if (!d) return null;
    return (
      <View key={slot} pointerEvents="none" style={[{ position: 'absolute' }, style]}>
        <Svg width={d.w} height={d.h} viewBox={`0 0 ${d.w} ${d.h}`}>{d.draw()}</Svg>
      </View>
    );
  };
  const wall = get('wall'), floor = get('floor'), top = get('top'), rug = get('rug');
  return (
    <View style={{ alignSelf: 'stretch', alignItems: 'center' }}>
      {wall || floor ? (
        <View pointerEvents="none" style={{ position: 'absolute', top: 0, bottom: 20, left: -6, right: -6, borderRadius: 18, overflow: 'hidden' }}>
          {wall ? <Svg width="100%" height="100%" viewBox="0 0 300 300" preserveAspectRatio="xMidYMid slice">{wall.draw()}</Svg> : null}
          {floor ? (
            <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 58 }}>
              <Svg width="100%" height="58" viewBox={`0 0 ${floor.w} ${floor.h}`} preserveAspectRatio="none">{floor.draw()}</Svg>
            </View>
          ) : null}
        </View>
      ) : null}
      {top ? (
        <View pointerEvents="none" style={{ position: 'absolute', top: 4, left: -6, right: -6, height: top.h }}>
          <Svg width="100%" height={top.h} viewBox={`0 0 ${top.w} ${top.h}`} preserveAspectRatio="none">{top.draw()}</Svg>
        </View>
      ) : null}
      {art('wallL', { left: 4, top: 54 })}
      {art('wallR', { right: 6, top: 58 })}
      {rug ? (
        <View pointerEvents="none" style={{ position: 'absolute', bottom: 14, left: 0, right: 0, alignItems: 'center' }}>
          <Svg width={rug.w} height={rug.h} viewBox={`0 0 ${rug.w} ${rug.h}`}>{rug.draw()}</Svg>
        </View>
      ) : null}
      {art('floorL', { left: -4, bottom: 26 })}
      {art('floorR', { right: -4, bottom: 26 })}
      {children}
    </View>
  );
}
