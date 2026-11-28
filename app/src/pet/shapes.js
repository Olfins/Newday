// Petits outils de dessin.
import React from 'react';
import { Path } from 'react-native-svg';

export const pts = (a) => a.map((p) => p.map((v) => +v.toFixed(2)).join(',')).join(' ');
// Les polygones sont dessinés comme des tracés (plus simple et identique partout).
export const Polygon = ({ points, ...rest }) => <Path d={'M' + points.split(' ').join(' L') + ' Z'} {...rest} />;
export const toward = (p, c, f) => [p[0] + (c[0] - p[0]) * f, p[1] + (c[1] - p[1]) * f];
