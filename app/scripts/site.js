// Copie la version web (app/dist) à la racine du dépôt, pour le site GitHub Pages
// https://olfins.github.io/Newday/ . L'ancienne version reste dans /old/.
// Utilisation : dans le dossier app, lancer « npm run site », puis commit et push.
const fs = require('fs');
const path = require('path');

const dist = path.join(__dirname, '..', 'dist');
const root = path.join(__dirname, '..', '..');

// On enlève l'ancienne version construite (jamais le dossier old/ ni les autres fichiers).
fs.rmSync(path.join(root, '_expo'), { recursive: true, force: true });
fs.rmSync(path.join(root, 'assets'), { recursive: true, force: true });

fs.cpSync(dist, root, { recursive: true });
// Sans ce fichier, GitHub Pages ignore les dossiers qui commencent par « _ » (comme _expo).
fs.writeFileSync(path.join(root, '.nojekyll'), '');
console.log('Site prêt à la racine du dépôt. Il reste à faire commit et push.');
