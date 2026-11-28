// Les trois starters, dessinés en formes simples comme le chat (pas d'images).
// - Plante : un écureuil vert et crème, une feuille sur le front, une queue en forme de feuille.
// - Eau : un dragon des mers bleu ciel, nageoires dorées.
// - Feu : un bébé léopard orange à taches, le bout de la queue en flammes.
// Chacun a 4 étapes (il grandit et gagne des détails) et ses propres tenues,
// découpées sur la forme de son corps. Les chapeaux et lunettes sont communs (Headwear).
import React from 'react';
import Svg, { Circle, ClipPath, Defs, Ellipse, G, Line, Path, Rect } from 'react-native-svg';
import Headwear from './Headwear';
import { Desk, Hold, Zzz } from './scenes';
import { Polygon, pts } from './shapes';
import { SUITS, TIES, shade } from './looks';
import { MON_OUTFITS } from './species';

const f = (v) => +v.toFixed(2);

// ---------- Couleurs de chaque starter ----------
const COL = {
  feu: { body: '#F4A53C', bodyD: '#D9822B', belly: '#FCE8C8', spot: '#3B2A22', spotIn: '#E57A22', earIn: '#F7E4C6', eye: '#E2452F', lid: '#3B2A22', mouth: '#6E2E22', paw: '#FCE8C8' },
  plante: { body: '#3F9161', bodyD: '#2E7049', belly: '#F5F3C1', bellyD: '#E4E19C', earIn: '#A0613F', eye: '#C73636', lid: '#24402F', mouth: '#5A3A22', leaf: '#8BDB94', leafD: '#55B56E', chev: '#F2B33D', gold: '#D8B03A', tailIn: '#C46B3E', tailInD: '#9C4F2D', paw: '#2E7049' },
  eau: { body: '#A9D0F2', bodyD: '#7EADE0', bodyDD: '#4F86C6', belly: '#FCEBD3', bellyD: '#E9CFA6', fin: '#F3D77B', mem: '#EBD7A6', eye: '#2AAFB5', lid: '#2C4A6B', mouth: '#2C4A6B', muzzle: '#BEDDF7', paw: '#A9D0F2' },
};

// ---------- Tailles par étape ----------
const DIMS = {
  feu: { hr: [44, 42, 40, 40], bw: [60, 72, 82, 90], bh: [48, 62, 76, 86], neck: [0, 0, 0, 0] },
  plante: { hr: [44, 42, 40, 39], bw: [56, 66, 76, 84], bh: [52, 66, 80, 90], neck: [0, 0, 0, 0] },
  eau: { hr: [42, 40, 38, 37], bw: [58, 68, 78, 86], bh: [50, 62, 74, 84], neck: [4, 10, 15, 18] },
};

const pear = (cx, base, top, bw, bh) =>
  `M${f(cx - bw / 2)} ${base} C${f(cx - bw / 2)} ${f(top + bh * 0.42)} ${f(cx - bw * 0.42)} ${top} ${cx} ${top} C${f(cx + bw * 0.42)} ${top} ${f(cx + bw / 2)} ${f(top + bh * 0.42)} ${f(cx + bw / 2)} ${base} Z`;

// Une feuille pointue (centre 0 0, hauteur 2 ry), à placer avec transform.
const leafD = (rx, ry) => `M0 ${ry} C${rx * 1.1} ${ry * 0.4} ${rx * 0.9} ${-ry * 0.6} 0 ${-ry} C${-rx * 0.9} ${-ry * 0.6} ${-rx * 1.1} ${ry * 0.4} 0 ${ry} Z`;

// Une flamme (base en 0 0, pointe vers le haut), qui vacille avec le temps t.
export function Flame({ x, y, k = 1, t = 0, rot = 0, seed = 0, glow = false }) {
  const fl = 1 + Math.sin(t * 9 + seed * 2.1) * 0.08;
  const sway = Math.sin(t * 5 + seed) * 5;
  const out = 'M0 0 C-11 0 -13 -12 -7 -20 C-6 -14 -3 -13 -2 -15 C-4 -22 0 -28 3 -33 C3 -25 9 -22 9 -14 C11 -16 11 -19 11 -21 C16 -12 12 0 0 0 Z';
  return (
    <G transform={`translate(${f(x)} ${f(y)}) rotate(${f(rot + sway)}) scale(${f(k)} ${f(k * fl)})`}>
      {glow ? <Circle cx="0" cy="-12" r="16" fill="#FFB347" opacity="0.18" /> : null}
      <Path d={out} fill="#E8442A" />
      <Path d={out} fill="#FF9A2E" transform="translate(0 -1) scale(0.7)" />
      <Path d={out} fill="#FFD95A" transform="translate(0 -1) scale(0.4)" />
    </G>
  );
}

// ---------- Les yeux (communs) ----------
// calm : paupières à moitié baissées (le dragon d'eau a l'air tranquille).
function Eyes({ g, exf, eyf, erf, iris, lid, skin, calm, lashes }) {
  const { cx, hy, hr, mood, blink } = g;
  const er = hr * erf;
  const one = (s) => {
    const ex = cx + s * hr * exf, ey = hy + hr * eyf;
    const lash = lashes ? <Path d={`M${f(ex + s * er * 0.8)} ${f(ey - er * 0.7)} l${s * 4} -3 M${f(ex + s * er * 1.0)} ${f(ey - er * 0.2)} l${s * 4.5} -1`} stroke={lid} strokeWidth="1.8" strokeLinecap="round" /> : null;
    if (mood === 'sleep') return <G key={s}><Path d={`M${f(ex - er)} ${f(ey)} Q${f(ex)} ${f(ey + er * 0.9)} ${f(ex + er)} ${f(ey)}`} stroke={lid} strokeWidth="3" strokeLinecap="round" fill="none" />{lash}</G>;
    if (mood === 'happy') return <G key={s}><Path d={`M${f(ex - er)} ${f(ey + 2)} Q${f(ex)} ${f(ey - er * 1.3)} ${f(ex + er)} ${f(ey + 2)}`} stroke={lid} strokeWidth="3.4" strokeLinecap="round" fill="none" />{lash}</G>;
    if (blink) return <G key={s}><Path d={`M${f(ex - er)} ${f(ey + 1)} Q${f(ex)} ${f(ey + er * 0.6)} ${f(ex + er)} ${f(ey + 1)}`} stroke={lid} strokeWidth="3" strokeLinecap="round" fill="none" />{lash}</G>;
    const ix = ex - s * er * 0.08;
    const half = calm || mood === 'hungry';
    return (
      <G key={s}>
        <Ellipse cx={f(ex)} cy={f(ey)} rx={f(er * 1.02)} ry={f(er * 1.12)} fill="#FFFFFF" />
        <Circle cx={f(ix)} cy={f(ey + er * 0.1)} r={f(er * 0.8)} fill={iris} />
        <Ellipse cx={f(ix)} cy={f(ey + er * 0.12)} rx={f(er * 0.36)} ry={f(er * 0.52)} fill="#16141A" />
        <Circle cx={f(ix + er * 0.3)} cy={f(ey - er * 0.25)} r={f(er * 0.3)} fill="#FFFFFF" />
        <Circle cx={f(ix - er * 0.3)} cy={f(ey + er * 0.42)} r={f(er * 0.13)} fill="#FFFFFF" opacity="0.85" />
        {half ? (() => {
          // Calme : paupière posée sur le haut de l'œil. Faim : œil à moitié fermé.
          const ly = calm && mood !== 'hungry' ? ey - er * 0.5 : ey - er * 0.15;
          const lq = calm && mood !== 'hungry' ? ey - er * 0.72 : ey + er * 0.1;
          return (
            <G>
              <Path d={`M${f(ex - er * 1.2)} ${f(ey - er * 1.4)} L${f(ex + er * 1.2)} ${f(ey - er * 1.4)} L${f(ex + er * 1.2)} ${f(ly)} Q${f(ex)} ${f(lq)} ${f(ex - er * 1.2)} ${f(ly)} Z`} fill={skin} />
              <Path d={`M${f(ex - er * 1.05)} ${f(ly)} Q${f(ex)} ${f(lq)} ${f(ex + er * 1.05)} ${f(ly)}`} stroke={lid} strokeWidth="2.4" strokeLinecap="round" fill="none" />
            </G>
          );
        })() : (
          <Path d={`M${f(ex - er * 1.05)} ${f(ey - er * 0.2)} Q${f(ex)} ${f(ey - er * 1.45)} ${f(ex + er * 1.05)} ${f(ey - er * 0.2)}`} stroke={lid} strokeWidth="2.4" strokeLinecap="round" fill="none" />
        )}
        {lash}
        {mood === 'hungry' ? <Line x1={f(ex - s * er * 1.1)} y1={f(ey - er * 1.7)} x2={f(ex + s * er * 0.9)} y2={f(ey - er * 1.25)} stroke={lid} strokeWidth="2" strokeLinecap="round" /> : null}
      </G>
    );
  };
  return <G>{one(-1)}{one(1)}</G>;
}

// Bouche : selon l'humeur (fangs : petits crocs du léopard).
function Mouth({ g, y, color, fangs, teeth }) {
  const { cx, mood } = g;
  if (mood === 'happy') {
    return (
      <G>
        <Path d={`M${cx - 7} ${f(y)} Q${cx} ${f(y + 11)} ${cx + 7} ${f(y)} Z`} fill={color} />
        <Path d={`M${cx - 4} ${f(y + 5)} Q${cx} ${f(y + 9.5)} ${cx + 4} ${f(y + 5)} Z`} fill="#E88A8A" />
        {fangs ? <G fill="#FFFFFF"><Path d={`M${cx - 6} ${f(y)} l1.6 3.6 l1.6 -3.6 Z`} /><Path d={`M${cx + 3} ${f(y)} l1.6 3.6 l1.6 -3.6 Z`} /></G> : null}
        {teeth ? <G fill="#FFFFFF"><Rect x={cx - 3.4} y={f(y)} width="3.2" height="4" rx="0.8" /><Rect x={cx + 0.2} y={f(y)} width="3.2" height="4" rx="0.8" /></G> : null}
      </G>
    );
  }
  const d = mood === 'hungry'
    ? `M${cx - 6} ${f(y + 4)} Q${cx} ${f(y - 2)} ${cx + 6} ${f(y + 4)}`
    : `M${cx - 6} ${f(y)} Q${cx - 3} ${f(y + 4)} ${cx} ${f(y)} Q${cx + 3} ${f(y + 4)} ${cx + 6} ${f(y)}`;
  return (
    <G>
      <Path d={d} stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
      {teeth ? <G fill="#FFFFFF" stroke={color} strokeWidth="0.8"><Rect x={cx - 3.2} y={f(y + 1.6)} width="3" height="4" rx="0.8" /><Rect x={cx + 0.2} y={f(y + 1.6)} width="3" height="4" rx="0.8" /></G> : null}
    </G>
  );
}

function Blush({ g, color = '#F19CB7', dy = 0.3 }) {
  if (g.mood !== 'happy') return null;
  return (
    <G fill={color} opacity="0.55">
      <Ellipse cx={f(g.cx - g.hr * 0.66)} cy={f(g.hy + g.hr * dy)} rx={f(g.hr * 0.14)} ry={f(g.hr * 0.08)} />
      <Ellipse cx={f(g.cx + g.hr * 0.66)} cy={f(g.hy + g.hr * dy)} rx={f(g.hr * 0.14)} ry={f(g.hr * 0.08)} />
    </G>
  );
}

// ======================= FEU =======================
const FEU = {
  back(g) {
    const { cx, base, bw, stage, t, tail } = g, c = COL.feu;
    const ox = cx + bw * 0.36, oy = base - 8;
    const P0 = [ox, oy], P1 = [ox + 30, oy + 2], P2 = [ox + 40, oy - 44], P3 = [ox + 22, oy - 62];
    const at = (u) => { const v = 1 - u; return [0, 1].map((i) => v * v * v * P0[i] + 3 * v * v * u * P1[i] + 3 * v * u * u * P2[i] + u * u * u * P3[i]); };
    const k = [0.75, 0.95, 1.15, 1.45][stage];
    const out = [];
    // Crinière de flammes (étapes 3 et 4), derrière la tête.
    if (stage >= 2) {
      const angs = stage === 3 ? [-180, -155, -128, -104, -80, -56, -30, -5, 165, 15] : [-165, -135, -105, -75, -45, -15];
      angs.forEach((a, i) => {
        const r = (a * Math.PI) / 180;
        out.push(<Flame key={'m' + i} x={g.cx + Math.cos(r) * g.hr * 0.86} y={g.hy + Math.sin(r) * g.hr * 0.78} k={stage === 3 ? 1.05 : 0.8} rot={a + 90} t={t} seed={i} />);
      });
    }
    out.push(
      <G key="tail" transform={`rotate(${f(tail)} ${f(ox)} ${f(oy)})`}>
        <Path d={`M${ox} ${oy} C${P1.join(' ')} ${P2.join(' ')} ${P3.join(' ')}`} stroke={c.body} strokeWidth={stage >= 2 ? 11 : 9} strokeLinecap="round" fill="none" />
        {[0.32, 0.52, 0.72].map((u) => { const p = at(u); return <Circle key={u} cx={f(p[0])} cy={f(p[1])} r={stage >= 2 ? 5.6 : 4.6} fill={c.spot} />; })}
        <Circle cx={P3[0]} cy={P3[1]} r={stage >= 2 ? 6.5 : 5.5} fill={c.belly} />
        <Flame x={P3[0] + 1} y={P3[1] - 3} k={k} t={t} seed={7} rot={8} glow={stage === 3} />
      </G>,
    );
    return out;
  },
  body(g) {
    const { cx, base, top, bw, bh, stage, clip } = g, c = COL.feu, s = bw / 70;
    return (
      <G>
        {[-1, 1].map((d) => <Ellipse key={d} cx={f(cx + d * bw * 0.4)} cy={f(base - bh * 0.2)} rx={f(bw * 0.2)} ry={f(bh * 0.24)} fill={c.body} />)}
        {[-1, 1].map((d) => <Ellipse key={'p' + d} cx={f(cx + d * bw * 0.5)} cy={base - 1} rx={f(bw * 0.12)} ry="5" fill={c.paw} />)}
        <Path d={g.bp} fill={c.body} />
        <G clipPath={`url(#${clip})`}>
          <Ellipse cx={cx} cy={f(top + bh * 0.66)} rx={f(bw * 0.3)} ry={f(bh * 0.42)} fill={c.belly} />
          {[[-0.4, 0.42], [0.42, 0.55], [-0.36, 0.8], [0.3, 0.2]].map(([dx, dy], i) => (
            <Circle key={i} cx={f(cx + dx * bw)} cy={f(top + dy * bh)} r={f(5.5 * s)} fill={stage === 3 ? '#FFB347' : c.spotIn} stroke={c.spot} strokeWidth={f(2.8 * s)} />
          ))}
        </G>
      </G>
    );
  },
  limbs(g) {
    const { cx, base, top, bw, bh } = g, c = COL.feu;
    const lw = bw * 0.2;
    return (
      <G>
        {[-1, 1].map((d) => (
          <G key={d}>
            <Rect x={f(cx + d * bw * 0.17 - lw / 2)} y={f(top + bh * 0.38)} width={f(lw)} height={f(base - top - bh * 0.38)} rx={f(lw / 2)} fill={c.body} />
            <Ellipse cx={f(cx + d * bw * 0.17)} cy={base - 1} rx={f(lw * 0.62)} ry="6" fill={c.paw} />
            <Path d={`M${f(cx + d * bw * 0.17 - 2.5)} ${base - 5} v4 M${f(cx + d * bw * 0.17 + 2.5)} ${base - 5} v4`} stroke={c.bodyD} strokeWidth="1.3" strokeLinecap="round" />
          </G>
        ))}
      </G>
    );
  },
  head(g) {
    const { cx, hy, hr, stage, t } = g, c = COL.feu;
    return (
      <G>
        {[-1, 1].map((d) => (
          <G key={d}>
            <Circle cx={f(cx + d * hr * 0.66)} cy={f(hy - hr * 0.6)} r={f(hr * 0.3)} fill={c.spot} />
            <Circle cx={f(cx + d * hr * 0.62)} cy={f(hy - hr * 0.55)} r={f(hr * 0.17)} fill={c.earIn} />
          </G>
        ))}
        <Ellipse cx={cx} cy={hy} rx={hr} ry={f(hr * 0.9)} fill={c.body} />
        <Ellipse cx={cx} cy={f(hy - hr * 0.5)} rx={f(hr * 0.22)} ry={f(hr * 0.16)} fill={stage === 3 ? '#FFB347' : c.spotIn} stroke={c.spot} strokeWidth={f(hr * 0.08)} />
        {[-1, 1].map((d) => (
          <G key={'k' + d}>
            <Path d={`M${f(cx + d * hr * 0.98)} ${f(hy + hr * 0.02)} q${f(-d * hr * 0.14)} ${f(hr * 0.05)} ${f(-d * hr * 0.22)} ${f(hr * 0.16)}`} stroke={c.spot} strokeWidth={f(hr * 0.08)} strokeLinecap="round" fill="none" />
            <Circle cx={f(cx + d * hr * 0.5)} cy={f(hy - hr * 0.62)} r={f(hr * 0.06)} fill={c.spot} />
          </G>
        ))}
        <Ellipse cx={cx} cy={f(hy + hr * 0.38)} rx={f(hr * 0.42)} ry={f(hr * 0.27)} fill={c.belly} />
        <Eyes g={g} exf={0.4} eyf={-0.02} erf={0.21} iris={c.eye} lid={c.lid} skin={c.body} lashes={g.L.sex === 'f'} />
        <Path d={`M${cx - 5} ${f(hy + hr * 0.2)} L${cx + 5} ${f(hy + hr * 0.2)} L${cx} ${f(hy + hr * 0.3)} Z`} fill={c.spot} strokeLinejoin="round" stroke={c.spot} strokeWidth="1.5" />
        <Mouth g={g} y={hy + hr * 0.38} color={c.mouth} fangs />
        <Blush g={g} color="#F07A5A" />
        {stage >= 1 ? <Flame x={cx} y={hy - hr * 0.84} k={stage === 3 ? 0.62 : 0.42} t={t} seed={3} /> : null}
        {stage === 3 ? [-1, 1].map((d) => <Flame key={d} x={cx + d * hr * 0.3} y={hy - hr * 0.82} k={0.4} rot={d * 18} t={t} seed={4 + d} />) : null}
      </G>
    );
  },
  geo: { exf: 0.4, eyf: -0.02, erf: 0.21 },
  limbsFirst: true,
};

// ======================= PLANTE =======================
const PLANTE = {
  back(g) {
    const { cx, base, bw, stage, tail } = g, c = COL.plante;
    const ax = cx - bw * 0.3, ay = base - 10;
    const H = [86, 100, 114, 124][stage], W = [52, 60, 68, 74][stage];
    const lx = ax - W * 0.42, ly = ay - H * 0.5;
    // Contour de la queue : une feuille touffue aux bords dentelés.
    const N = 30, edge = [];
    for (let i = 0; i < N; i++) {
      const th = (i / N) * Math.PI * 2;
      const y = -Math.cos(th) * H * 0.5;
      const prof = Math.sqrt(Math.max(0, 1 - Math.pow(y / (H * 0.5), 2))) * (1 + 0.22 * (y / (H * 0.5)));
      const k = i % 2 ? 1.13 : 0.96;
      edge.push([Math.sin(th) * W * 0.5 * prof * k, y * (i % 2 ? 1.04 : 1)]);
    }
    return (
      <G transform={`rotate(${f(-tail * 0.5)} ${f(ax)} ${f(ay)})`}>
        <G transform={`translate(${f(lx)} ${f(ly)}) rotate(-20)`}>
          <Polygon points={pts(edge)} fill={c.body} stroke={c.body} strokeWidth="3" strokeLinejoin="round" />
          <G transform={`translate(${f(-W * 0.12)} ${f(-H * 0.04)})`}>
          <Path d={leafD(W * 0.34, H * 0.4)} fill={c.tailIn} transform={`translate(0 ${f(H * 0.04)})`} />
          <Path d={leafD(W * 0.16, H * 0.22)} fill={c.tailInD} transform={`translate(${f(-W * 0.08)} ${f(H * 0.1)})`} opacity="0.6" />
          {stage >= 2 ? (
            <G stroke={c.bodyD} strokeWidth="2" strokeLinecap="round" fill="none">
              <Line x1="0" y1={f(H * 0.3)} x2="0" y2={f(-H * 0.3)} />
              {[-0.2, 0, 0.2].map((yy) => [-1, 1].map((d) => <Line key={yy + '' + d} x1="0" y1={f(yy * H)} x2={f(d * W * 0.13)} y2={f(yy * H - 7)} />))}
            </G>
          ) : null}
          <Path d="M0 -9 L5 0 L0 9 L-5 0 Z" fill={c.leaf} transform={`translate(${f(W * 0.02)} ${f(-H * 0.02)})`} />
          {stage === 3 ? [[-0.12, -0.3], [0.14, 0.18], [-0.1, 0.3]].map(([a, b], i) => <Flower key={i} x={a * W * 2} y={b * H} r={5} />) : null}
          </G>
        </G>
      </G>
    );
  },
  body(g) {
    const { cx, base, top, bw, bh, clip } = g, c = COL.plante, s = bw / 66;
    return (
      <G>
        <Path d={g.bp} fill={c.body} />
        <G clipPath={`url(#${clip})`}>
          <Ellipse cx={cx} cy={f(top + bh * 0.6)} rx={f(bw * 0.4)} ry={f(bh * 0.52)} fill={c.belly} />
        </G>
        <Path d={`M${f(cx - 12 * s)} ${f(top + bh * 0.22)} L${cx} ${f(top + bh * 0.4)} L${f(cx + 12 * s)} ${f(top + bh * 0.22)} L${cx} ${f(top + bh * 0.31)} Z`} fill={c.chev} />
        {[-1, 1].map((d) => (
          <G key={d}>
            <Ellipse cx={f(cx + d * bw * 0.24)} cy={base - 1} rx={f(bw * 0.17)} ry="7" fill={c.bodyD} />
            <Path d={`M${f(cx + d * bw * 0.24 - 3)} ${base - 5} v4 M${f(cx + d * bw * 0.24 + 3)} ${base - 5} v4`} stroke={c.body} strokeWidth="1.3" strokeLinecap="round" />
          </G>
        ))}
      </G>
    );
  },
  limbs(g) {
    const { cx, top, bw, bh, mood, scene } = g, c = COL.plante, s = bw / 66;
    const busy = scene === 'work' || scene === 'coffee' || scene === 'water' || scene === 'snack';
    const len = bh * 0.42;
    return (
      <G>
        {[-1, 1].map((d) => {
          if (busy && d === 1) return null;
          if (scene === 'work') return null;
          const sx = cx + d * bw * 0.36, sy = top + bh * 0.24;
          const dir = mood === 'happy' ? [d * 0.72, -0.7] : [d * 0.5, 0.86];
          const hx = sx + dir[0] * len, hy = sy + dir[1] * len;
          const bx = sx + dir[0] * len * 0.72, by = sy + dir[1] * len * 0.72;
          return (
            <G key={d}>
              <Line x1={f(sx)} y1={f(sy)} x2={f(hx)} y2={f(hy)} stroke={c.body} strokeWidth={f(10 * s)} strokeLinecap="round" />
              <Line x1={f(bx - dir[1] * 5 * s)} y1={f(by + dir[0] * 5 * s)} x2={f(bx + dir[1] * 5 * s)} y2={f(by - dir[0] * 5 * s)} stroke={c.gold} strokeWidth={f(3.2 * s)} strokeLinecap="round" />
              <Circle cx={f(hx)} cy={f(hy)} r={f(5.8 * s)} fill={c.bodyD} />
            </G>
          );
        })}
      </G>
    );
  },
  head(g) {
    const { cx, hy, hr, stage } = g, c = COL.plante;
    const ear = (d) => {
      const a = [cx + d * hr * 0.86, hy - hr * 0.3], b = [cx + d * hr * 0.7, hy - hr * 1.12], cc = [cx + d * hr * 0.22, hy - hr * 0.78];
      const m = [(a[0] + b[0] + cc[0]) / 3, (a[1] + b[1] + cc[1]) / 3];
      const tw = (p, k) => [p[0] + (m[0] - p[0]) * k, p[1] + (m[1] - p[1]) * k];
      return (
        <G key={d}>
          <Polygon points={pts([a, b, cc])} fill={c.body} stroke={c.body} strokeWidth="7" strokeLinejoin="round" />
          <Polygon points={pts([tw(a, 0.4), tw(b, 0.32), tw(cc, 0.4)])} fill={c.earIn} />
        </G>
      );
    };
    return (
      <G>
        {stage === 3 ? <Antlers g={g} /> : null}
        {ear(-1)}{ear(1)}
        <Ellipse cx={cx} cy={hy} rx={hr} ry={f(hr * 0.9)} fill={c.body} />
        {[-1, 1].map((d) => <Polygon key={d} points={pts([[cx + d * hr * 0.8, hy + hr * 0.05], [cx + d * hr * 1.12, hy + hr * 0.22], [cx + d * hr * 0.86, hy + hr * 0.42]])} fill={c.belly} />)}
        <Ellipse cx={cx} cy={f(hy + hr * 0.2)} rx={f(hr * 0.9)} ry={f(hr * 0.66)} fill={c.belly} />
        <Polygon points={pts([[cx - hr * 0.34, hy - hr * 0.5], [cx + hr * 0.34, hy - hr * 0.5], [cx, hy - hr * 0.02]])} fill={c.body} />
        <Path d={leafD(hr * 0.1, hr * 0.22)} fill={c.leaf} transform={`translate(${cx} ${f(hy - hr * 0.42)})`} />
        <Line x1={cx} y1={f(hy - hr * 0.6)} x2={cx} y2={f(hy - hr * 0.26)} stroke={c.leafD} strokeWidth="1.2" />
        {stage >= 1 ? [-1, 1].map((d) => (
          <Path key={d} d={leafD(hr * 0.08, hr * 0.18)} fill={c.leafD} transform={`translate(${f(cx + d * hr * 0.2)} ${f(hy - hr * 0.86)}) rotate(${d * 28})`} />
        )) : null}
        {stage >= 2 ? <Path d={leafD(hr * 0.1, hr * 0.22)} fill={c.leaf} transform={`translate(${cx} ${f(hy - hr * 1.02)})`} /> : null}
        <Eyes g={g} exf={0.4} eyf={0.04} erf={0.24} iris={c.eye} lid={c.lid} skin={c.belly} lashes={g.L.sex === 'f'} />
        <Ellipse cx={cx} cy={f(hy + hr * 0.32)} rx="3.6" ry="2.6" fill={c.earIn} />
        <Mouth g={g} y={hy + hr * 0.42} color={c.mouth} teeth />
        <Blush g={g} dy={0.36} />
      </G>
    );
  },
  geo: { exf: 0.4, eyf: 0.04, erf: 0.24 },
};

function Flower({ x, y, r }) {
  return (
    <G>
      {[0, 72, 144, 216, 288].map((a) => <Circle key={a} cx={f(x + Math.cos((a * Math.PI) / 180) * r * 0.8)} cy={f(y + Math.sin((a * Math.PI) / 180) * r * 0.8)} r={f(r * 0.55)} fill="#F6C6D6" />)}
      <Circle cx={x} cy={y} r={f(r * 0.45)} fill="#F2C14C" />
    </G>
  );
}

// Les petites branches de Chênor (étape 4).
function Antlers({ g }) {
  const { cx, hy, hr } = g;
  return (
    <G stroke="#8A5A32" strokeWidth="3.4" strokeLinecap="round" fill="none">
      {[-1, 1].map((d) => (
        <G key={d}>
          <Path d={`M${f(cx + d * hr * 0.3)} ${f(hy - hr * 0.7)} Q${f(cx + d * hr * 0.5)} ${f(hy - hr * 1.3)} ${f(cx + d * hr * 0.82)} ${f(hy - hr * 1.5)}`} />
          <Path d={`M${f(cx + d * hr * 0.46)} ${f(hy - hr * 1.12)} l${f(d * hr * 0.26)} ${f(-hr * 0.06)}`} />
          <Path d={leafD(5, 8)} fill="#8BDB94" stroke="none" transform={`translate(${f(cx + d * hr * 0.86)} ${f(hy - hr * 1.6)}) rotate(${d * 30})`} />
          <Path d={leafD(4, 7)} fill="#55B56E" stroke="none" transform={`translate(${f(cx + d * hr * 0.76)} ${f(hy - hr * 1.2)}) rotate(${d * 70})`} />
        </G>
      ))}
    </G>
  );
}

// ======================= EAU =======================
const EAU = {
  back(g) {
    const { cx, base, bw, hy, hr, stage, tail, t } = g, c = COL.eau;
    const ox = cx + bw * 0.34, oy = base - 6;
    const k = [0.8, 0.95, 1.1, 1.3][stage];
    const ex = ox + 40 * k, ey = oy - 34 * k;
    const lobe = (d) => (
      <G key={d} transform={`translate(${f(ex)} ${f(ey)}) rotate(${d * 26 + 4}) scale(${k})`}>
        <Path d="M0 0 C-7 -10 -8 -24 -2 -36 C6 -24 7 -10 0 0 Z" fill={c.bodyDD} />
        <Path d="M0 0 C-3 -10 -3 -22 -2 -34 C3 -22 4 -10 0 0 Z" fill={c.fin} />
      </G>
    );
    const out = [];
    if (stage >= 2) {
      // Crête dans le dos de la tête.
      const n = stage === 3 ? 7 : 5;
      for (let i = 0; i < n; i++) {
        const a = (-150 + (120 * i) / (n - 1)) * Math.PI / 180;
        const bx = cx + Math.cos(a) * hr * 0.7, by = hy + Math.sin(a) * hr * 0.62;
        const L = hr * (stage === 3 ? 0.62 : 0.46) * (1 - Math.abs(i - (n - 1) / 2) / n * 0.6);
        const tx = cx + Math.cos(a) * (hr * 0.7 + L), ty = hy + Math.sin(a) * (hr * 0.62 + L);
        const nx = -Math.sin(a) * 6, ny = Math.cos(a) * 6;
        out.push(<Polygon key={'c' + i} points={pts([[bx - nx, by - ny], [tx, ty], [bx + nx, by + ny]])} fill={c.bodyDD} />);
        out.push(<Polygon key={'cy' + i} points={pts([[bx - nx * 0.4, by - ny * 0.4], [bx + (tx - bx) * 0.7, by + (ty - by) * 0.7], [bx + nx * 0.4, by + ny * 0.4]])} fill={c.fin} />);
      }
    }
    out.push(
      <G key="tail" transform={`rotate(${f(tail)} ${f(ox)} ${f(oy)})`}>
        <Path d={`M${ox} ${oy} C${f(ox + 26 * k)} ${f(oy + 4)} ${f(ox + 40 * k)} ${f(oy - 10 * k)} ${f(ex)} ${f(ey)}`} stroke={c.body} strokeWidth={f(11 * k)} strokeLinecap="round" fill="none" />
        {lobe(-1)}{lobe(1)}
      </G>,
    );
    if (stage === 3) {
      // Gouttes d'eau qui tournent autour d'Abyssor.
      for (let i = 0; i < 3; i++) {
        const a = t * 0.9 + (i * Math.PI * 2) / 3;
        out.push(<Path key={'d' + i} d="M0 -6 C3 -2 4 1 4 2.5 A4 4 0 0 1 -4 2.5 C-4 1 -3 -2 0 -6 Z" fill="#7FC4F0" opacity="0.8" transform={`translate(${f(cx + Math.cos(a) * 80)} ${f(130 + Math.sin(a) * 22)})`} />);
      }
    }
    return out;
  },
  body(g) {
    const { cx, base, top, bw, bh, hy, hr, neck, clip } = g, c = COL.eau;
    return (
      <G>
        {neck > 0 ? (
          <G>
            <Rect x={f(cx - hr * 0.44)} y={f(hy + hr * 0.3)} width={f(hr * 0.88)} height={f(top - hy - hr * 0.3 + 12)} fill={c.body} />
            <Rect x={f(cx - hr * 0.24)} y={f(hy + hr * 0.5)} width={f(hr * 0.48)} height={f(top - hy - hr * 0.5 + 12)} fill={c.belly} />
          </G>
        ) : null}
        {[-1, 1].map((d) => (
          <Path key={d} d={`M${f(cx + d * bw * 0.22)} ${base - 4} l${d * 16} 3 l${d * -2} 4 l${d * -8} -1 l${d * -3} 3 l${d * -6} -3 Z`} fill={c.bodyD} stroke={c.bodyD} strokeWidth="3" strokeLinejoin="round" />
        ))}
        <Path d={g.bp} fill={c.body} />
        <G clipPath={`url(#${clip})`}>
          <Ellipse cx={cx} cy={f(top + bh * 0.62)} rx={f(bw * 0.3)} ry={f(bh * 0.52)} fill={c.belly} />
          {[0.38, 0.56, 0.74, 0.92].map((k) => (
            <Path key={k} d={`M${f(cx - bw * 0.28)} ${f(top + bh * k)} Q${cx} ${f(top + bh * k + 6)} ${f(cx + bw * 0.28)} ${f(top + bh * k)}`} stroke={c.bellyD} strokeWidth="2" fill="none" />
          ))}
          <Ellipse cx={f(cx - bw * 0.3)} cy={f(top + bh * 0.3)} rx={f(bw * 0.06)} ry={f(bh * 0.18)} fill="#FFFFFF" opacity="0.35" />
        </G>
        {[-1, 1].map((d) => (
          <Path key={'s' + d} d={`M${f(cx + d * bw * 0.26)} ${top + 6} l${d * 3} -8 l${d * 2} 6 l${d * 4} -6 l${d * 1} 9 Z`} fill="#A0805A" />
        ))}
      </G>
    );
  },
  limbs(g) {
    const { cx, top, bw, bh, stage, mood, t, scene } = g, c = COL.eau;
    const L = bh * [0.6, 0.62, 0.74, 0.88][stage];
    const flap = mood === 'happy' ? Math.sin(t * 8) * 8 : 0;
    return (
      <G>
        {[-1, 1].map((d) => {
          if (d === 1 && scene && scene !== 'sleep' && scene !== 'walk') return null;
          const sx = cx + d * bw * 0.38, sy = top + bh * 0.24;
          const tip = [d * L * 0.8, L * 0.72];
          const mem = [[0, 0], tip, [d * L * 0.56, L * 0.62], [d * L * 0.4, L * 0.72], [d * L * 0.26, L * 0.5], [d * L * 0.1, L * 0.56]];
          return (
            <G key={d} transform={`translate(${f(sx)} ${f(sy)}) rotate(${f(-d * flap)})`}>
              <Polygon points={pts(mem)} fill={c.mem} />
              <Path d={`M0 0 Q${f(d * L * 0.45)} ${f(L * 0.2)} ${f(tip[0])} ${f(tip[1])}`} stroke={c.body} strokeWidth="9" strokeLinecap="round" fill="none" />
              <Path d={`M0 0 Q${f(d * L * 0.45)} ${f(L * 0.2)} ${f(tip[0])} ${f(tip[1])}`} stroke={c.bodyD} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
            </G>
          );
        })}
      </G>
    );
  },
  head(g) {
    const { cx, hy, hr, stage } = g, c = COL.eau;
    const fk = [0.9, 1.05, 1.15, 1.2][stage];
    const fin = (d) => {
      const b1 = [cx + d * hr * 0.32, hy - hr * 0.72], b2 = [cx + d * hr * 0.86, hy - hr * 0.3];
      const tp = [cx + d * hr * (0.6 + 0.4 * fk), hy - hr * (0.95 + 0.55 * fk)];
      const mid = [(b1[0] + b2[0]) / 2, (b1[1] + b2[1]) / 2];
      return (
        <G key={d}>
          <Polygon points={pts([b1, tp, b2])} fill={c.bodyDD} stroke={c.bodyDD} strokeWidth="3" strokeLinejoin="round" />
          <Polygon points={pts([[mid[0] + d * 3, mid[1]], [tp[0] - d * 2, tp[1] + 8], b2])} fill={c.fin} />
        </G>
      );
    };
    return (
      <G>
        {stage === 3 ? [-1, 1].map((d) => (
          <Path key={'h' + d} d={`M${f(cx + d * hr * 0.22)} ${f(hy - hr * 0.78)} Q${f(cx + d * hr * 0.3)} ${f(hy - hr * 1.35)} ${f(cx + d * hr * 0.62)} ${f(hy - hr * 1.5)} Q${f(cx + d * hr * 0.4)} ${f(hy - hr * 1.1)} ${f(cx + d * hr * 0.42)} ${f(hy - hr * 0.7)} Z`} fill="#F3E3B8" />
        )) : null}
        {fin(-1)}{fin(1)}
        <Ellipse cx={cx} cy={hy} rx={hr} ry={f(hr * 0.9)} fill={c.body} />
        <Ellipse cx={f(cx - hr * 0.4)} cy={f(hy - hr * 0.5)} rx={f(hr * 0.26)} ry={f(hr * 0.13)} fill="#FFFFFF" opacity="0.4" transform={`rotate(-20 ${f(cx - hr * 0.4)} ${f(hy - hr * 0.5)})`} />
        {stage >= 1 ? <Polygon points={pts([[cx - 5, hy - hr * 0.84], [cx, hy - hr * (1.1 + stage * 0.08)], [cx + 5, hy - hr * 0.84]])} fill={c.bodyDD} stroke={c.bodyDD} strokeWidth="2" strokeLinejoin="round" /> : null}
        <Ellipse cx={cx} cy={f(hy + hr * 0.4)} rx={f(hr * 0.5)} ry={f(hr * 0.3)} fill={c.muzzle} />
        <Circle cx={cx - 5} cy={f(hy + hr * 0.3)} r="1.8" fill={c.bodyDD} />
        <Circle cx={cx + 5} cy={f(hy + hr * 0.3)} r="1.8" fill={c.bodyDD} />
        <Eyes g={g} exf={0.42} eyf={-0.04} erf={0.2} iris={c.eye} lid={c.lid} skin={c.body} calm={g.mood === 'ok'} lashes={g.L.sex === 'f'} />
        <Mouth g={g} y={hy + hr * 0.46} color={c.mouth} />
        <Blush g={g} dy={0.24} />
        {stage === 3 ? (
          <G>
            <Circle cx={cx} cy={f(hy - hr * 0.52)} r={f(hr * 0.1)} fill="#FFFFFF" stroke="#E8B83A" strokeWidth="2" />
            <Circle cx={f(cx - hr * 0.03)} cy={f(hy - hr * 0.55)} r={f(hr * 0.03)} fill="#BFE3F7" />
          </G>
        ) : null}
      </G>
    );
  },
  geo: { exf: 0.42, eyf: -0.04, erf: 0.2 },
};

const DRAW = { feu: FEU, plante: PLANTE, eau: EAU };

// ---------- Les tenues des starters ----------
// Chaque tenue peut avoir trois couches : behind (derrière le corps), on (découpé sur le corps),
// front (par-dessus, hors du corps).
const OUT = {
  // ---- Feu ----
  'feu-bandana': {
    front: ({ cx, ny: top, bw, bh, A }) => (
      <G>
        <Polygon points={pts([[cx - bw * 0.32, top + 4], [cx + bw * 0.32, top + 4], [cx, top + bh * 0.4]])} fill={A} stroke={A} strokeWidth="3" strokeLinejoin="round" />
        <Rect x={f(cx - bw * 0.34)} y={top} width={f(bw * 0.68)} height="7" rx="3.5" fill={shade(A, 0.8)} />
        {[[-0.12, 0.14], [0.1, 0.2], [0, 0.3], [-0.04, 0.12]].map(([a, b], i) => <Circle key={i} cx={f(cx + a * bw)} cy={f(top + b * bh)} r="1.6" fill="#FFFFFF" opacity="0.8" />)}
        <Circle cx={f(cx + bw * 0.3)} cy={top + 4} r="4.5" fill={shade(A, 0.8)} />
      </G>
    ),
  },
  'feu-collier': {
    front: ({ cx, ny: top, bw, S }) => (
      <G>
        <Path d={`M${f(cx - bw * 0.34)} ${top + 4} Q${cx} ${top + 14} ${f(cx + bw * 0.34)} ${top + 4}`} stroke={S} strokeWidth="7" strokeLinecap="round" fill="none" />
        <Circle cx={cx} cy={top + 15} r="5.5" fill="#E8B83A" />
        <Line x1={cx} y1={top + 16} x2={cx} y2={top + 20} stroke="#8A6A1A" strokeWidth="1.4" />
        <Circle cx={cx - 1.8} cy={top + 13.5} r="1.4" fill="#FFF3C2" />
      </G>
    ),
  },
  'feu-harnais': {
    on: ({ cx, top, bw, bh, base }) => (
      <G stroke="#7A4E2E" strokeWidth="6" strokeLinecap="round">
        <Line x1={f(cx - bw * 0.42)} y1={top + 6} x2={f(cx + bw * 0.5)} y2={f(base - bh * 0.15)} />
        <Line x1={f(cx + bw * 0.42)} y1={top + 6} x2={f(cx - bw * 0.5)} y2={f(base - bh * 0.15)} />
      </G>
    ),
    front: ({ cx, top, bw, bh, S }) => (
      <G>
        <Circle cx={cx} cy={f(top + bh * 0.32)} r="5" fill="none" stroke="#E8B83A" strokeWidth="2.6" />
        <Rect x={f(cx + bw * 0.3)} y={f(top + bh * 0.42)} width="20" height="16" rx="4" fill={S} />
        <Path d={`M${f(cx + bw * 0.3)} ${f(top + bh * 0.42 + 4)} h20 v-1 q0 -3 -3 -3 h-14 q-3 0 -3 3 Z`} fill={shade(S, 0.75)} />
        <Rect x={f(cx + bw * 0.3 + 8)} y={f(top + bh * 0.42 + 3)} width="4" height="4" rx="1" fill="#E8B83A" />
      </G>
    ),
  },
  'feu-cape': {
    behind: ({ cx, top, bw, base, S }) => (
      <G>
        <Path d={`M${f(cx - bw * 0.36)} ${top + 4} L${f(cx + bw * 0.36)} ${top + 4} L${f(cx + bw * 0.66)} ${base + 2} Q${cx} ${base + 9} ${f(cx - bw * 0.66)} ${base + 2} Z`} fill={S} />
        <Path d={`M${f(cx + bw * 0.2)} ${top + 10} L${f(cx + bw * 0.5)} ${base + 3}`} stroke={shade(S, 0.75)} strokeWidth="3" />
        <Path d={`M${f(cx - bw * 0.2)} ${top + 10} L${f(cx - bw * 0.5)} ${base + 3}`} stroke={shade(S, 0.75)} strokeWidth="3" />
      </G>
    ),
    front: ({ cx, ny: top, bw, S, A }) => (
      <G>
        <Path d={`M${f(cx - bw * 0.38)} ${top + 2} Q${cx} ${top + 14} ${f(cx + bw * 0.38)} ${top + 2} L${f(cx + bw * 0.42)} ${top + 9} Q${cx} ${top + 20} ${f(cx - bw * 0.42)} ${top + 9} Z`} fill={shade(S, 0.85)} />
        <Circle cx={cx} cy={top + 12} r="5.5" fill={A} stroke="#E8B83A" strokeWidth="1.6" />
      </G>
    ),
  },
  'feu-pompier': {
    on: ({ cx, top, bw, bh, base }) => (
      <G>
        <Rect x={f(cx - bw)} y={top - 4} width={f(bw * 2)} height={f(bh * 0.72)} fill="#C9A24A" />
        {[0.36, 0.6].map((k) => (
          <G key={k}>
            <Rect x={f(cx - bw)} y={f(top + bh * k)} width={f(bw * 2)} height="6" fill="#F4E04D" />
            <Rect x={f(cx - bw)} y={f(top + bh * k + 2)} width={f(bw * 2)} height="2" fill="#D9DCE2" />
          </G>
        ))}
        <Line x1={cx} y1={top} x2={cx} y2={f(top + bh * 0.68)} stroke="#8A6A2A" strokeWidth="2" />
        {[0.24, 0.5].map((k) => <Rect key={k} x={cx - 4} y={f(top + bh * k)} width="8" height="3" rx="1" fill="#4A3A1A" />)}
      </G>
    ),
    front: ({ cx, top, bw }) => <Rect x={f(cx - bw * 0.3)} y={top - 3} width={f(bw * 0.6)} height="9" rx="4.5" fill="#A8843A" />,
  },
  'feu-armure': {
    on: ({ cx, top, bw, bh, base }) => (
      <G>
        <Rect x={f(cx - bw)} y={top - 4} width={f(bw * 2)} height={f(bh * 0.74)} fill="#3A3335" />
        <Path d={`M${f(cx - bw * 0.34)} ${top + 6} Q${cx} ${top} ${f(cx + bw * 0.34)} ${top + 6} L${f(cx + bw * 0.28)} ${f(top + bh * 0.6)} Q${cx} ${f(top + bh * 0.72)} ${f(cx - bw * 0.28)} ${f(top + bh * 0.6)} Z`} fill="#4E4547" />
        <Path d={`M${cx} ${top + 8} l-4 10 l6 6 l-5 10 M${f(cx - bw * 0.2)} ${f(top + bh * 0.3)} l6 5 l-2 7 M${f(cx + bw * 0.18)} ${f(top + bh * 0.34)} l-5 6 l4 6`} stroke="#FF8A2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {[0.56, 0.66].map((k) => <Path key={k} d={`M${f(cx - bw / 2)} ${f(top + bh * k)} Q${cx} ${f(top + bh * k + 5)} ${f(cx + bw / 2)} ${f(top + bh * k)}`} stroke="#5A5052" strokeWidth="2" fill="none" />)}
        
      </G>
    ),
    front: ({ cx, top, bw }) => (
      <G>
        {[-1, 1].map((d) => <Ellipse key={d} cx={f(cx + d * (bw * 0.4))} cy={top + 9} rx="12" ry="8" fill="#4E4547" stroke="#FF8A2A" strokeWidth="1.6" />)}
      </G>
    ),
  },
  // ---- Plante ----
  'plante-salopette': {
    on: ({ cx, top, bw, bh, base, S }) => (
      <G>
        <Rect x={f(cx - bw)} y={f(top + bh * 0.52)} width={f(bw * 2)} height={f(bh)} fill={S} />
        <Rect x={f(cx - bw * 0.22)} y={f(top + bh * 0.26)} width={f(bw * 0.44)} height={f(bh * 0.3)} rx="3" fill={S} />
        <Rect x={f(cx - bw * 0.1)} y={f(top + bh * 0.33)} width={f(bw * 0.2)} height={f(bh * 0.12)} rx="2" fill={shade(S, 0.8)} />
        <Line x1={cx} y1={f(top + bh * 0.6)} x2={cx} y2={base} stroke={shade(S, 0.75)} strokeWidth="1.5" />
      </G>
    ),
    front: ({ cx, top, bw, bh, S }) => (
      <G>
        {[-1, 1].map((d) => (
          <G key={d}>
            <Line x1={f(cx + d * bw * 0.2)} y1={f(top + bh * 0.28)} x2={f(cx + d * bw * 0.3)} y2={top + 3} stroke={S} strokeWidth="4.5" strokeLinecap="round" />
            <Circle cx={f(cx + d * bw * 0.18)} cy={f(top + bh * 0.29)} r="2.6" fill="#E8B83A" />
          </G>
        ))}
      </G>
    ),
  },
  'plante-echarpe': {
    front: ({ cx, ny: top, bw, bh, A }) => (
      <G>
        <Rect x={f(cx - bw * 0.36)} y={top - 3} width={f(bw * 0.72)} height="11" rx="5.5" fill={A} />
        <Path d={`M${f(cx - bw * 0.22)} ${top + 4} l-3 ${f(bh * 0.42)} l12 0 l1 ${f(-bh * 0.38)} Z`} fill={A} />
        {[0.18, 0.3].map((k) => <Rect key={k} x={f(cx - bw * 0.22 - 2)} y={f(top + bh * k)} width="12" height="3" fill={shade(A, 0.75)} />)}
        <Path d={`M${f(cx - bw * 0.22 - 3)} ${f(top + 4 + bh * 0.42)} v4 m3 -4 v4 m3 -4 v4 m3 -4 v4`} stroke={A} strokeWidth="1.6" strokeLinecap="round" />
      </G>
    ),
  },
  'plante-tablier': {
    on: ({ cx, top, bw, bh, base, S }) => (
      <G>
        <Path d={`M${f(cx - bw * 0.26)} ${f(top + bh * 0.2)} h${f(bw * 0.52)} l${f(bw * 0.06)} ${f(bh * 0.3)} l${f(bw * 0.04)} ${f(bh * 0.6)} h${f(-bw * 0.72)} l${f(bw * 0.04)} ${f(-bh * 0.6)} Z`} fill={S} />
        <Rect x={f(cx - bw * 0.2)} y={f(top + bh * 0.58)} width={f(bw * 0.4)} height={f(bh * 0.18)} rx="3" fill={shade(S, 0.8)} />
        <Line x1={cx} y1={f(top + bh * 0.58)} x2={cx} y2={f(top + bh * 0.76)} stroke={shade(S, 0.65)} strokeWidth="1.2" />
        <Rect x={f(cx - bw)} y={f(top + bh * 0.48)} width={f(bw * 2)} height="3" fill={shade(S, 0.7)} />
      </G>
    ),
    front: ({ cx, top, bw, bh }) => (
      <G>
        <Rect x={f(cx - bw * 0.15)} y={f(top + bh * 0.5)} width="5" height="12" rx="2" fill="#8A5A32" />
        <Path d={`M${f(cx - bw * 0.15 - 2)} ${f(top + bh * 0.5)} l4.5 -9 l4.5 9 Z`} fill="#B5B9C2" />
        <Rect x={f(cx + bw * 0.04)} y={f(top + bh * 0.5)} width="9" height="11" rx="1.5" fill="#F6E7B0" />
        <Circle cx={f(cx + bw * 0.04 + 4.5)} cy={f(top + bh * 0.5 + 4.5)} r="2.4" fill="#E8738A" />
      </G>
    ),
  },
  'plante-explorateur': {
    on: ({ cx, top, bw, bh, base }) => (
      <G>
        {[-1, 1].map((d) => (
          <G key={d}>
            <Path d={`M${f(cx + d * bw * 0.1)} ${top - 2} L${f(cx + d * bw)} ${top - 2} L${f(cx + d * bw)} ${base + 2} L${f(cx + d * bw * 0.16)} ${base + 2} Z`} fill="#B9A06A" />
            <Rect x={f(cx + d * bw * 0.3 - 7)} y={f(top + bh * 0.56)} width="14" height="12" rx="2" fill="#A68D58" />
            <Rect x={f(cx + d * bw * 0.3 - 7)} y={f(top + bh * 0.56)} width="14" height="4" rx="1.5" fill="#8E7646" />
          </G>
        ))}
      </G>
    ),
    front: ({ cx, ny: top, bw, bh, A }) => (
      <G>
        <Polygon points={pts([[cx - 10, top + 1], [cx + 10, top + 1], [cx, top + bh * 0.2]])} fill={A} stroke={A} strokeWidth="2" strokeLinejoin="round" />
        <Circle cx={cx} cy={top + 3} r="3.5" fill={shade(A, 0.75)} />
      </G>
    ),
  },
  'plante-kimono': {
    on: ({ cx, top, bw, bh, S, A }) => (
      <G>
        <Rect x={f(cx - bw)} y={top - 4} width={f(bw * 2)} height={f(bh + 10)} fill={S} />
        <Path d={`M${f(cx - bw * 0.28)} ${top} L${f(cx + bw * 0.14)} ${f(top + bh * 0.56)}`} stroke="#FFFFFF" strokeWidth="6" />
        <Path d={`M${f(cx + bw * 0.28)} ${top} L${f(cx - bw * 0.04)} ${f(top + bh * 0.44)}`} stroke="#FFFFFF" strokeWidth="6" />
        <Rect x={f(cx - bw)} y={f(top + bh * 0.54)} width={f(bw * 2)} height={f(bh * 0.14)} fill={A} />
        {[[-0.3, 0.8], [0.26, 0.9], [0.3, 0.3]].map(([a, b], i) => <Circle key={i} cx={f(cx + a * bw)} cy={f(top + b * bh)} r="3" fill={shade(S, 1.35)} opacity="0.7" />)}
      </G>
    ),
    front: ({ cx, top, bh, A }) => <Rect x={cx + 6} y={f(top + bh * 0.52)} width="10" height={f(bh * 0.18)} rx="2" fill={shade(A, 0.8)} />,
  },
  'plante-druide': {
    behind: ({ cx, top, bw, base, hy, hr }) => (
      <G>
        <Path d={`M${f(cx - bw * 0.36)} ${top + 4} L${f(cx + bw * 0.36)} ${top + 4} L${f(cx + bw * 0.66)} ${base + 2} Q${cx} ${base + 9} ${f(cx - bw * 0.66)} ${base + 2} Z`} fill="#4E6E31" />
        <Ellipse cx={cx} cy={f(hy - hr * 0.05)} rx={f(hr * 1.18)} ry={f(hr * 1.08)} fill="#4E6E31" />
      </G>
    ),
    on: ({ cx, top, bw, bh, base }) => (
      <G>
        <Rect x={f(cx - bw)} y={top - 4} width={f(bw * 2)} height={f(bh + 10)} fill="#6E8F45" />
        {[[-0.26, 0.3, 30], [0.22, 0.5, -30], [-0.18, 0.78, 20], [0.3, 0.86, -20]].map(([a, b, r], i) => <Path key={i} d={leafD(4, 8)} fill="#8DB15C" transform={`translate(${f(cx + a * bw)} ${f(top + b * bh)}) rotate(${r})`} />)}
        <Path d={`M${f(cx - bw / 2)} ${f(top + bh * 0.6)} Q${cx} ${f(top + bh * 0.68)} ${f(cx + bw / 2)} ${f(top + bh * 0.6)}`} stroke="#C9A86B" strokeWidth="3" fill="none" />
      </G>
    ),
    front: ({ cx, ny: top, bh }) => (
      <G>
        <Path d={leafD(5, 9)} fill="#E8B83A" transform={`translate(${cx} ${top + 6}) rotate(90)`} />
        <Path d={`M${cx + 4} ${f(top + bh * 0.64)} l3 10 M${cx + 8} ${f(top + bh * 0.64)} l5 8`} stroke="#C9A86B" strokeWidth="2" strokeLinecap="round" />
      </G>
    ),
  },
  // ---- Eau ----
  'eau-mariniere': {
    on: ({ cx, top, bw, bh, S }) => (
      <G>
        <Rect x={f(cx - bw)} y={top - 4} width={f(bw * 2)} height={f(bh + 10)} fill="#F7F7FA" />
        {Array.from({ length: 10 }).map((_, i) => <Rect key={i} x={f(cx - bw)} y={f(top + 6 + i * 9)} width={f(bw * 2)} height="4" fill={S} />)}
      </G>
    ),
    front: ({ cx, ny: top }) => <Path d={`M${cx - 12} ${top} Q${cx} ${top + 8} ${cx + 12} ${top}`} stroke="#E2E2EA" strokeWidth="4" fill="none" strokeLinecap="round" />,
  },
  'eau-noeud': {
    front: ({ cx, ny: top, A }) => (
      <G fill={A}>
        <Path d={`M${cx} ${top + 5} L${cx - 13} ${top - 2} L${cx - 13} ${top + 12} Z`} stroke={A} strokeWidth="2" strokeLinejoin="round" />
        <Path d={`M${cx} ${top + 5} L${cx + 13} ${top - 2} L${cx + 13} ${top + 12} Z`} stroke={A} strokeWidth="2" strokeLinejoin="round" />
        <Circle cx={cx} cy={top + 5} r="3.8" fill={shade(A, 0.8)} />
      </G>
    ),
  },
  'eau-bouee': {
    behind: ({ cx, top, bw, bh, A }) => <Ellipse cx={cx} cy={f(top + bh * 0.66)} rx={f(bw * 0.66)} ry={f(bh * 0.2)} stroke={A} strokeWidth="12" fill="none" />,
    front: ({ cx, top, bw, bh, A }) => {
      const rx = bw * 0.66, ry = bh * 0.2, y = top + bh * 0.66;
      const d = `M${f(cx - rx)} ${f(y)} A${f(rx)} ${f(ry)} 0 0 0 ${f(cx + rx)} ${f(y)}`;
      return (
        <G>
          <Path d={d} stroke={A} strokeWidth="12" fill="none" />
          <Path d={d} stroke="#FFFFFF" strokeWidth="12" fill="none" strokeDasharray="9 13" strokeDashoffset="4" />
          <Path d={`M${f(cx - rx * 0.6)} ${f(y + ry * 0.55)} Q${cx} ${f(y + ry * 1.05)} ${f(cx + rx * 0.3)} ${f(y + ry * 0.85)}`} stroke="#FFFFFF" strokeWidth="2" fill="none" opacity="0.5" />
        </G>
      );
    },
  },
  'eau-capitaine': {
    on: ({ cx, top, bw, bh, S }) => (
      <G>
        <Rect x={f(cx - bw)} y={top - 4} width={f(bw * 2)} height={f(bh + 10)} fill={S} />
        <Polygon points={pts([[cx - 12, top - 2], [cx + 12, top - 2], [cx, top + bh * 0.36]])} fill="#FFFFFF" />
        <Polygon points={pts([[cx - 12, top - 2], [cx - 24, top + 2], [cx - 3, top + bh * 0.44]])} fill={shade(S, 0.78)} />
        <Polygon points={pts([[cx + 12, top - 2], [cx + 24, top + 2], [cx + 3, top + bh * 0.44]])} fill={shade(S, 0.78)} />
        {[0.5, 0.66, 0.82].map((k) => [-9, 9].map((d) => <Circle key={k + '' + d} cx={cx + d} cy={f(top + bh * k)} r="2.4" fill="#E8B83A" />))}
      </G>
    ),
    front: ({ cx, top, bw }) => (
      <G>
        {[-1, 1].map((d) => (
          <G key={d}>
            <Rect x={f(cx + d * bw * 0.4 - 10)} y={top + 2} width="20" height="6" rx="3" fill="#E8B83A" />
            <Path d={`M${f(cx + d * bw * 0.4 - 8)} ${top + 8} v4 m4 -4 v4 m4 -4 v4 m4 -4 v4 m4 -4 v4`} stroke="#E8B83A" strokeWidth="1.5" />
          </G>
        ))}
      </G>
    ),
  },
  'eau-plongee': {
    on: ({ cx, top, bw, bh, base, A }) => (
      <G>
        <Rect x={f(cx - bw)} y={top - 4} width={f(bw * 2)} height={f(bh + 10)} fill="#22313A" />
        {[-1, 1].map((d) => <Path key={d} d={`M${f(cx + d * bw * 0.34)} ${top} Q${f(cx + d * bw * 0.2)} ${f(top + bh * 0.5)} ${f(cx + d * bw * 0.36)} ${base}`} stroke={A} strokeWidth="5" fill="none" />)}
        <Line x1={cx} y1={top} x2={cx} y2={f(top + bh * 0.7)} stroke="#B5B9C2" strokeWidth="2" strokeDasharray="2 2" />
        <Rect x={cx - 2.5} y={f(top + bh * 0.68)} width="5" height="8" rx="1.5" fill="#D9DCE2" />
      </G>
    ),
    front: ({ cx, top, bw }) => <Rect x={f(cx - bw * 0.3)} y={top - 3} width={f(bw * 0.6)} height="8" rx="4" fill="#1A262D" />,
  },
  'eau-royal': {
    behind: ({ cx, top, bw, base }) => (
      <G>
        <Path d={`M${f(cx - bw * 0.36)} ${top + 4} L${f(cx + bw * 0.36)} ${top + 4} L${f(cx + bw * 0.7)} ${base + 2} Q${cx} ${base + 10} ${f(cx - bw * 0.7)} ${base + 2} Z`} fill="#1F3A6B" />
        {[-0.62, -0.42, 0.42, 0.62].map((k) => <Circle key={k} cx={f(cx + k * bw)} cy={base + 1} r="2.6" fill="#F6F2E8" />)}
      </G>
    ),
    front: ({ cx, ny: top, bw, bh }) => (
      <G>
        <Path d={`M${f(cx - bw * 0.36)} ${top + 3} Q${cx} ${top + 18} ${f(cx + bw * 0.36)} ${top + 3}`} stroke="#E8B83A" strokeWidth="5" fill="none" strokeLinecap="round" />
        <Path d={`M${f(cx - bw * 0.36)} ${top + 3} Q${cx} ${top + 18} ${f(cx + bw * 0.36)} ${top + 3}`} stroke="#B8862F" strokeWidth="1.2" fill="none" strokeDasharray="3 3" />
        <Circle cx={cx} cy={top + 16} r="5.5" fill="#F6F2E8" stroke="#E8B83A" strokeWidth="2" />
        <Circle cx={cx - 1.6} cy={top + 14.4} r="1.6" fill="#FFFFFF" />
      </G>
    ),
  },
};

// Les couleurs d'une tenue (choix de l'utilisateur, ou couleur fixe).
function outColors(L) {
  return { S: (SUITS[L.suit] || SUITS.marine).c, A: (TIES[L.tie] || TIES.rouge).c };
}

// ---------- Le dessin complet ----------
export function MonsterDrawing({ species = 'feu', look, stage = 0, mood: mood0 = 'happy', size = 200, tail = 0, blink = false, scene = null, t = 0 }) {
  const D = DRAW[species] || FEU;
  const c = COL[species] || COL.feu;
  const L = { acc: 'none', out: species + '-none', suit: 'marine', tie: 'rouge', sex: 'm', ...(look || {}) };
  if (!(MON_OUTFITS[species] || {})[L.out]) L.out = species + '-none';
  const holds = scene === 'coffee' || scene === 'water' || scene === 'snack';
  const sipRaw = (Math.sin(t * 1.5) + 1) / 2;
  const sip = holds ? Math.min(1, Math.max(0, (sipRaw - 0.25) / 0.6)) : 0;
  const sleeping = scene === 'sleep';
  const mood = sleeping ? 'sleep' : scene === 'work' ? 'ok' : holds && sip > 0.85 ? 'happy' : scene ? 'happy' : mood0;
  const dm = DIMS[species] || DIMS.feu;
  const st = Math.max(0, Math.min(3, stage));
  const hr = dm.hr[st], bw = dm.bw[st], bh = dm.bh[st], neck = dm.neck[st];
  const cx = 100, base = 204, top = base - bh, hy = top - hr * 0.55 - neck;
  const clip = 'mc-' + species + '-' + st;
  const { S, A } = outColors(L);
  const g = { cx, base, top, bw, bh, hr, hy, neck, stage: st, t, tail, mood, blink, scene, L, clip, bp: pear(cx, base, top, bw, bh), S, A, ny: Math.max(top, hy + hr * 0.8) };
  const O = OUT[L.out] || {};
  const P = { accent: A, suit: S, suitD: shade(S, 0.75), dark: false, arm: c.body, paw: c.paw };
  const my = hy + hr * 0.42;
  return (
    <Svg width={size} height={size * 1.1} viewBox="0 0 200 220">
      <Defs>
        <ClipPath id={clip}><Path d={g.bp} /></ClipPath>
      </Defs>
      <Ellipse cx={cx} cy={base + 5} rx={bw * 0.8} ry="5" fill="rgba(23,23,29,0.08)" />
      {O.behind ? O.behind(g) : null}
      {D.back(g)}
      {D.body(g)}
      {D.limbsFirst ? D.limbs(g) : null}
      {O.on ? <G clipPath={`url(#${clip})`}>{O.on(g)}</G> : null}
      {O.front ? O.front(g) : null}
      {D.limbsFirst ? null : D.limbs(g)}
      {D.head(g)}
      {sleeping ? <Zzz x={cx + hr * 0.75} y={hy - hr * 0.55} t={t} /> : null}
      <Headwear L={L} P={P} cx={cx} hy={hy} hr={hr} stage={st} ex={D.geo.exf} ey={D.geo.eyf} er={D.geo.erf + 0.04} />
      {scene === 'work' ? <Desk P={P} cx={cx} bw={bw} top={top} t={t} /> : null}
      {holds ? <Hold P={P} scene={scene} cx={cx} bw={bw} top={top} bh={bh} hr={hr} my={my} sip={sip} t={t} /> : null}
    </Svg>
  );
}
