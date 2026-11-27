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

// Rend l'app installable sur l'écran d'accueil (iPhone et Android) et utilisable sans internet.
const htmlPath = path.join(dist, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');
if (!html.includes('manifest.webmanifest')) {
  html = html.replace('<html lang="en">', '<html lang="fr">').replace('</head>', [
    '<link rel="manifest" href="/Newday/manifest.webmanifest"/>',
    '<link rel="apple-touch-icon" href="/Newday/icon-180.png"/>',
    '<meta name="apple-mobile-web-app-capable" content="yes"/>',
    '<meta name="mobile-web-app-capable" content="yes"/>',
    '<meta name="apple-mobile-web-app-title" content="Newday"/>',
    '<meta name="apple-mobile-web-app-status-bar-style" content="default"/>',
    "<script>if('serviceWorker' in navigator)window.addEventListener('load',function(){navigator.serviceWorker.register('/Newday/sw.js',{scope:'/Newday/'}).catch(function(){})});</script>",
    '</head>',
  ].join('\n'));
  fs.writeFileSync(htmlPath, html);
}

fs.cpSync(dist, root, { recursive: true });
// Sans ce fichier, GitHub Pages ignore les dossiers qui commencent par « _ » (comme _expo).
fs.writeFileSync(path.join(root, '.nojekyll'), '');
console.log('Site prêt à la racine du dépôt. Il reste à faire commit et push.');
