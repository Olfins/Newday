// Le dessin du bonsaï, de son pot et de sa sellette (en SVG, sans images).
// g : croissance de 0 (graine germée) à 1 (bonsaï ancien), en continu.
// health : 0 à 1, la santé des 7 derniers jours (densité et couleur du feuillage).
// Le point (0, 0) est la surface de la terre, au centre du pot ; l'arbre pousse vers le haut.
import React from 'react';
import Svg, { Ellipse, G, Line, Path, Rect } from 'react-native-svg';
import { POTS, STANDS, shade } from './items';

const mixHex = (a, b, t) => {
  const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const x = p(a), y = p(b);
  return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join('');
};

// Les branches : position sur le tronc (t), côté, longueur, montée, et à partir de quelle croissance elles apparaissent.
const BRANCHES = [
  { t: 0.36, s: -1, l: 0.62, r: 0.06, g: 0.2, p: 1 },
  { t: 0.5, s: 1, l: 0.66, r: 0.08, g: 0.3, p: 1.05 },
  { t: 0.64, s: -1, l: 0.5, r: 0.1, g: 0.42, p: 0.9 },
  { t: 0.74, s: 1, l: 0.44, r: 0.12, g: 0.52, p: 0.85 },
  { t: 0.27, s: 1, l: 0.42, r: 0.02, g: 0.64, p: 0.72 },
  { t: 0.84, s: -1, l: 0.34, r: 0.12, g: 0.74, p: 0.72 },
  { t: 0.56, s: -1, l: 0.3, r: -0.02, g: 0.86, p: 0.6 },
];

function bez(H, t) {
  const P = [[0, 0], [0.3 * H, -0.3 * H], [-0.34 * H, -0.62 * H], [0.06 * H, -H]];
  const u = 1 - t;
  const a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t;
  const x = a * P[0][0] + b * P[1][0] + c * P[2][0] + d * P[3][0];
  const y = a * P[0][1] + b * P[1][1] + c * P[2][1] + d * P[3][1];
  const dx = 3 * u * u * (P[1][0] - P[0][0]) + 6 * u * t * (P[2][0] - P[1][0]) + 3 * t * t * (P[3][0] - P[2][0]);
  const dy = 3 * u * u * (P[1][1] - P[0][1]) + 6 * u * t * (P[2][1] - P[1][1]) + 3 * t * t * (P[3][1] - P[2][1]);
  const L = Math.hypot(dx, dy) || 1;
  return { x, y, nx: -dy / L, ny: dx / L };
}

const f1 = (v) => v.toFixed(1);

// Un « coussin » de feuillage, typique des bonsaïs : quelques ellipses superposées.
function Pad({ x, y, R, s, col }) {
  return (
    <G>
      <Ellipse cx={x + s * R * 0.2} cy={y + R * 0.18} rx={R * 1.3} ry={R * 0.52} fill={col.shade} />
      <Ellipse cx={x - s * R * 0.35} cy={y - R * 0.05} rx={R * 0.85} ry={R * 0.48} fill={col.main} />
      <Ellipse cx={x + s * R * 0.45} cy={y - R * 0.02} rx={R * 0.8} ry={R * 0.44} fill={col.main} />
      <Ellipse cx={x} cy={y - R * 0.22} rx={R * 0.9} ry={R * 0.42} fill={col.main} />
      <Ellipse cx={x - s * R * 0.15} cy={y - R * 0.38} rx={R * 0.55} ry={R * 0.2} fill={col.light} opacity={0.85} />
    </G>
  );
}

export function Tree({ g = 0.5, health = 0.7, potW }) {
  const h = Math.max(0, Math.min(1, health));
  const col = {
    main: mixHex('#9A9550', '#3F6B3F', h),
    shade: mixHex('#77733C', '#2C4E30', h),
    light: mixHex('#B8B26C', '#618C50', h),
  };
  const bark = '#6A4E3B', barkDark = '#4C3729', barkLight = '#8A6C53';

  // Graine germée : une tige et deux feuilles.
  if (g < 0.1) {
    const H = 10 + 60 * g;
    const leaf = 4 + 40 * g;
    return (
      <G>
        <Path d={`M0 0 Q${-H * 0.15} ${-H * 0.5} 0 ${-H}`} stroke="#5C7A3E" strokeWidth={1.6 + 6 * g} fill="none" strokeLinecap="round" />
        <Ellipse cx={-leaf * 0.7} cy={-H - 1} rx={leaf} ry={leaf * 0.42} fill={col.main} transform={`rotate(-24 ${-leaf * 0.7} ${-H - 1})`} />
        <Ellipse cx={leaf * 0.7} cy={-H - 2} rx={leaf * 0.9} ry={leaf * 0.38} fill={col.light} transform={`rotate(22 ${leaf * 0.7} ${-H - 2})`} />
      </G>
    );
  }

  const H = 22 + 118 * Math.pow(g, 0.85);
  const w0 = 3 + 17 * g;
  const N = 16;
  const L = [], Rr = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N, p = bez(H, t);
    let w = w0 * (1 - 0.74 * t) + 1.2;
    w *= 1 + 0.7 * Math.pow(1 - t, 7); // pied évasé
    L.push([p.x - (p.nx * w) / 2, p.y - (p.ny * w) / 2]);
    Rr.push([p.x + (p.nx * w) / 2, p.y + (p.ny * w) / 2]);
  }
  const trunk = 'M' + L.map((q) => f1(q[0]) + ' ' + f1(q[1])).join(' L') + ' L' + Rr.reverse().map((q) => f1(q[0]) + ' ' + f1(q[1])).join(' L') + ' Z';
  const crease = 'M' + [0.08, 0.25, 0.42, 0.6].map((t) => { const p = bez(H, t); return f1(p.x + p.nx * w0 * 0.12) + ' ' + f1(p.y); }).join(' L');

  const branches = BRANCHES.filter((b) => g >= b.g).map((b) => {
    const grow = 0.45 + 0.55 * Math.min(1, (g - b.g) / 0.18);
    const p = bez(H, b.t);
    const len = b.l * H * 0.6 * grow;
    const ex = p.x + b.s * len, ey = p.y - b.r * H - len * 0.12;
    const mx = p.x + b.s * len * 0.5, my = p.y - len * 0.02 + 4;
    const sw = Math.max(1.4, w0 * 0.34 * (1 - b.t) + 1);
    const R = (8 + 15 * g) * b.p * (0.55 + 0.45 * grow) * (0.8 + 0.2 * h);
    return { b, d: `M${f1(p.x)} ${f1(p.y)} Q${f1(mx)} ${f1(my)} ${f1(ex)} ${f1(ey)}`, sw, ex, ey, R };
  });
  const top = bez(H, 1);
  const apexR = (9 + 14 * g) * (0.8 + 0.2 * h);

  // Racines visibles (nebari) quand l'arbre a de l'âge.
  const roots = g > 0.35 ? [
    `M${f1(-w0 * 0.4)} 0 Q${f1(-w0 * 1.1)} 1 ${f1(-w0 * 1.6)} 3`,
    `M${f1(w0 * 0.4)} 0 Q${f1(w0 * 1.2)} 0.5 ${f1(w0 * 1.7)} 2.5`,
  ] : [];

  return (
    <G>
      {roots.map((d, i) => <Path key={i} d={d} stroke={barkDark} strokeWidth={2 + 3 * g} fill="none" strokeLinecap="round" />)}
      {branches.map(({ b, d, sw }) => <Path key={'b' + b.t} d={d} stroke={bark} strokeWidth={sw} fill="none" strokeLinecap="round" />)}
      <Path d={trunk} fill={bark} />
      <Path d={crease} stroke={barkDark} strokeWidth={Math.max(0.8, w0 * 0.12)} fill="none" strokeLinecap="round" opacity={0.7} />
      <Path d={'M' + [0.05, 0.2, 0.38].map((t) => { const p = bez(H, t); return f1(p.x - p.nx * w0 * 0.28) + ' ' + f1(p.y); }).join(' L')} stroke={barkLight} strokeWidth={Math.max(0.6, w0 * 0.08)} fill="none" strokeLinecap="round" opacity={0.6} />
      {branches.map(({ b, ex, ey, R }) => <Pad key={'p' + b.t} x={ex} y={ey} R={R} s={b.s} col={col} />)}
      <Pad x={top.x} y={top.y - apexR * 0.15} R={apexR} s={1} col={col} />
    </G>
  );
}

// Largeur du pot selon la croissance (un bonsaï plus grand est rempoté dans un pot plus grand).
export const potSize = (g) => ({ w: 48 + 46 * g, h: 15 + 9 * g });

export function Pot({ id = 'terre', g = 0.5 }) {
  const P = POTS[id] || POTS.terre;
  const { w, h } = potSize(g);
  const x = -w / 2;
  let body;
  if (P.shape === 'rect') {
    body = <Path d={`M${x} 2 L${x + w} 2 L${x + w - 5} ${h} L${x + 5} ${h} Z`} fill={P.body} />;
  } else if (P.shape === 'oval') {
    body = <Path d={`M${x} 2 L${x + w} 2 Q${x + w - 2} ${h} ${x + w - 14} ${h} L${x + 14} ${h} Q${x + 2} ${h} ${x} 2 Z`} fill={P.body} />;
  } else {
    body = <Path d={`M${x + 3} 2 L${x + w - 3} 2 Q${x + w} ${h * 1.15} ${w * 0.18} ${h + 2} L${-w * 0.18} ${h + 2} Q${x} ${h * 1.15} ${x + 3} 2 Z`} fill={P.body} />;
  }
  const bottom = P.shape === 'round' ? h + 2 : h;
  return (
    <G>
      {/* pieds */}
      <Rect x={x + 8} y={bottom - 1} width={7} height={4} rx={1} fill={P.dark} />
      <Rect x={x + w - 15} y={bottom - 1} width={7} height={4} rx={1} fill={P.dark} />
      {body}
      <Path d={`M${x + 4} ${h * 0.55} L${x + w - 4} ${h * 0.55}`} stroke={P.dark} strokeWidth={0.8} opacity={0.5} />
      {P.glaze ? <Path d={`M${x + 6} 5 L${x + w * 0.35} 5`} stroke="#FFFFFF" strokeWidth={1.6} opacity={0.35} strokeLinecap="round" /> : null}
      {P.crackle ? (
        <G stroke={P.dark} strokeWidth={0.6} fill="none" opacity={0.9}>
          <Path d={`M${x + 10} 4 L${x + 16} 9 L${x + 13} 14`} />
          <Path d={`M${x + w * 0.5} 3 L${x + w * 0.46} 8 L${x + w * 0.54} 12`} />
          <Path d={`M${x + w - 14} 5 L${x + w - 20} 10`} />
        </G>
      ) : null}
      {/* bord du pot et terre couverte de mousse */}
      <Rect x={x - 2} y={-1} width={w + 4} height={4} rx={1.5} fill={P.rim} />
      <Ellipse cx={0} cy={-0.5} rx={w / 2 - 3} ry={2.2} fill="#4A3B2C" />
      <Ellipse cx={-w * 0.12} cy={-1.2} rx={w * 0.22} ry={1.6} fill="#5E7A44" opacity={0.9} />
      <Ellipse cx={w * 0.2} cy={-1} rx={w * 0.14} ry={1.3} fill="#6F8A4E" opacity={0.85} />
    </G>
  );
}

// La sellette : de y = 0 (dessus) jusqu'à y = h (le sol).
export function Stand({ id = 'table', w = 100, dark }) {
  const s = STANDS[id] || STANDS.table;
  const h = s.h;
  const wood = dark ? '#4A3423' : '#8A6644', woodDark = dark ? '#33241A' : '#6B4E33';
  if (id === 'tranche') {
    return (
      <G>
        <Rect x={-w * 0.55} y={0} width={w * 1.1} height={h} rx={6} fill="#7A5A3E" />
        <Ellipse cx={0} cy={1} rx={w * 0.55} ry={5} fill="#B08A62" />
        <Ellipse cx={0} cy={1} rx={w * 0.38} ry={3.2} fill="none" stroke="#8A6A48" strokeWidth={0.8} />
        <Ellipse cx={0} cy={1} rx={w * 0.2} ry={1.8} fill="none" stroke="#8A6A48" strokeWidth={0.8} />
        <Path d={`M${-w * 0.4} 8 L${-w * 0.4} ${h - 3} M${w * 0.1} 9 L${w * 0.1} ${h - 2} M${w * 0.35} 7 L${w * 0.35} ${h - 4}`} stroke="#5F452F" strokeWidth={1} />
      </G>
    );
  }
  if (id === 'sellette') {
    return (
      <G>
        <Rect x={-w * 0.48} y={0} width={w * 0.96} height={6} rx={1.5} fill={wood} />
        <Rect x={-w * 0.4} y={6} width={w * 0.8} height={5} fill={woodDark} />
        <Rect x={-w * 0.36} y={11} width={5} height={h - 11} fill={wood} />
        <Rect x={w * 0.36 - 5} y={11} width={5} height={h - 11} fill={wood} />
        <Rect x={-w * 0.36} y={h * 0.62} width={w * 0.72} height={4} fill={woodDark} />
      </G>
    );
  }
  if (id === 'pierre') {
    return (
      <G>
        <Rect x={-w * 0.5} y={0} width={w} height={8} rx={2} fill="#9A958C" />
        <Rect x={-w * 0.4} y={8} width={w * 0.8} height={h - 8} fill="#86817A" />
        <Path d={`M${-w * 0.3} 16 L${-w * 0.18} 24 M${w * 0.2} 20 L${w * 0.28} ${h - 8}`} stroke="#6E6A64" strokeWidth={0.8} />
        <Rect x={-w * 0.46} y={h - 5} width={w * 0.92} height={5} rx={1} fill="#77726B" />
      </G>
    );
  }
  if (id === 'marbre') {
    return (
      <G>
        <Rect x={-w * 0.42} y={0} width={w * 0.84} height={7} rx={1.5} fill="#EFEBE4" />
        <Rect x={-w * 0.3} y={7} width={w * 0.6} height={h - 15} fill="#E2DDD3" />
        {[-0.18, -0.06, 0.06, 0.18].map((f) => <Line key={f} x1={w * f} y1={10} x2={w * f} y2={h - 10} stroke="#CFC8BB" strokeWidth={1.4} />)}
        <Path d={`M${-w * 0.22} 20 Q${-w * 0.05} 40 ${-w * 0.15} 60`} stroke="#B8B0A3" strokeWidth={0.7} fill="none" />
        <Rect x={-w * 0.4} y={h - 8} width={w * 0.8} height={8} rx={1} fill="#EFEBE4" />
      </G>
    );
  }
  // Plateau en bois (de base) : une petite table basse.
  return (
    <G>
      <Rect x={-w * 0.55} y={0} width={w * 1.1} height={7} rx={2} fill={wood} />
      <Rect x={-w * 0.5} y={7} width={6} height={h - 7} fill={woodDark} />
      <Rect x={w * 0.5 - 6} y={7} width={6} height={h - 7} fill={woodDark} />
      <Rect x={-w * 0.5} y={9} width={w} height={3} fill={woodDark} opacity={0.6} />
    </G>
  );
}

// Pot + arbre + sellette, regroupés. Origine : centre du sol sous la sellette.
export function Bonsai({ g, health, pot, stand, dark, fallen = 0 }) {
  const ps = potSize(g);
  const sh = (STANDS[stand] || STANDS.table).h;
  const soil = -sh - ps.h - 3;
  return (
    <G>
      <Ellipse cx={0} cy={0} rx={ps.w * 0.7} ry={4} fill="#000" opacity={0.18} />
      <G transform={`translate(0 ${-sh})`}><Stand id={stand} w={Math.max(70, ps.w + 18)} dark={dark} /></G>
      {/* feuilles tombées quand le bonsaï manque d'attention */}
      {[...Array(fallen)].map((_, i) => (
        <Ellipse key={i} cx={(i % 2 ? 1 : -1) * (ps.w * 0.55 + 4 + i * 3)} cy={-sh - 1} rx={2.4} ry={1.1} fill="#A89A5A" transform={`rotate(${i * 37 - 30} ${(i % 2 ? 1 : -1) * (ps.w * 0.55 + 4 + i * 3)} ${-sh - 1})`} />
      ))}
      <G transform={`translate(0 ${soil})`}>
        <Tree g={g} health={health} />
        <Pot id={pot} g={g} />
      </G>
    </G>
  );
}

// Le bonsaï seul, dans son propre cadre (aperçus de la boutique, jour off).
export function TreeArt({ g = 0.55, health = 0.85, pot = 'terre', stand = 'table', size = 120, dark }) {
  const sh = (STANDS[stand] || STANDS.table).h;
  const H = 30 + 118 * Math.pow(g, 0.85) + sh + 30;
  const W = Math.max(H * 0.95, 140);
  return (
    <Svg width={size} height={size * (H / W)} viewBox={`${-W / 2} ${-H} ${W} ${H + 6}`}>
      <Bonsai g={g} health={health} pot={pot} stand={stand} dark={dark} />
    </Svg>
  );
}

export { shade };
