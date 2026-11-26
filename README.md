# Newday

Agenda et traqueur d'habitudes à usage personnel.

- Le site https://olfins.github.io/Newday/ montre la nouvelle version.
- L'ancienne version reste en ligne sur https://olfins.github.io/Newday/old/ (fichiers dans `old/`).
- `app/` : le code de la nouvelle version React Native (Expo), pour iPhone, Android et le web. Voir [app/README.md](app/README.md).
- `index.html`, `_expo/`, `favicon.ico`, `metadata.json` et `.nojekyll` à la racine : la version web construite pour le site. Ne pas les modifier à la main.

## Mettre le site à jour

Dans le dossier `app`, lancer `npm run site`, puis faire un commit et un push sur `main`.
GitHub Pages republie le site en une ou deux minutes.

## Tes données

Les données restent dans ton navigateur, sous le même nom que dans l'ancienne version.
En ouvrant le nouveau site sur le même téléphone et le même navigateur, tu retrouves tes habitudes, ton humeur, tes tâches et ton agenda.
