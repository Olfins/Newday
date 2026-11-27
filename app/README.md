# Newday (version React Native)

Agenda et traqueur d'habitudes, fait avec **Expo** (React Native).
Un seul code pour iPhone, Android et le web.

## Tester sur ton téléphone

1. Installe **Node.js** (version LTS) sur ton ordinateur : https://nodejs.org
2. Installe l'app gratuite **Expo Go** sur ton téléphone (App Store ou Play Store).
3. Dans un terminal, va dans ce dossier puis lance :

   ```bash
   cd app
   npm install
   npx expo start
   ```

4. Un QR code s'affiche. Scanne-le avec l'appareil photo (iPhone) ou avec Expo Go (Android).
   Ton téléphone et ton ordinateur doivent être sur le même Wi-Fi.

## Tester dans le navigateur

```bash
cd app
npx expo start --web
```

## Où est quoi

- `App.js` : l'en-tête, les onglets et le choix de l'écran.
- `src/screens/` : les écrans des 4 onglets : Jour (aujourd'hui), Semaine, Calendrier (avec les progrès et l'analyse, dans `Progress.js`) et Pet.
- `src/components/` : les morceaux réutilisés (cartes, boutons, détail d'un jour, agenda).
- `src/store.js` : les données et leur enregistrement sur l'appareil.
- `src/stats.js` : le calcul des séries, records et pourcentages.
- `src/ics.js` : l'import d'un agenda au format `.ics`.
- `src/theme.js` : les couleurs et la police des titres (design « Bureau chaleureux » : fond crème, cartes beige clair, vert sapin et laiton).
- `src/components/today.js` : les cartes de l'écran Aujourd'hui (habitudes, salle, humeur, tâches, programme).
- `src/components/QuickAdd.js` : la fenêtre du bouton + (en haut à droite de chaque écran).
- `src/components/pickers.js` : la roue des heures et le calendrier façon iPhone.
- `src/pet/` : le compagnon (dessin des chats dans `Cat.js`, règles de nourriture et d'XP dans `rules.js`, pièces dans `coins.js`, boutique dans `Shop.js`, décorations de sa pièce dans `Room.js`).
- `src/gym/` : le module Salle (programmes dans `programs.js`, séance en cours dans `GymModule.js`, silhouette des muscles dans `Figure.js`).

## Reprendre tes données de l'ancienne version

Dans l'ancienne app : onglet **Progrès**, carte **Sauvegarde**, bouton **Générer**.
Colle le texte obtenu dans la carte **Sauvegarde** de la nouvelle app (onglet **Calendrier**, tout en bas), puis **Restaurer**.

## Mettre le site en ligne

`npm run site` construit la version web et la copie à la racine du dépôt (pour https://olfins.github.io/Newday/).
Il reste à faire un commit et un push sur `main`. L'ancienne version reste dans `old/`.
