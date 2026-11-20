# GameKnight SMP — site (GitHub Pages)

Site 100 % statique : pas de serveur Node nécessaire.

## Déployer
1. Crée un dépôt GitHub et envoie **le contenu de ce dossier à la racine** du dépôt.
2. `Settings → Pages → Build and deployment → Deploy from a branch` → branche `main`, dossier `/ (root)`.
3. Le site sera sur `https://<user>.github.io/<repo>/`.

## Ajouter un craft
Édite uniquement `js/crafts-data.js`.

## Textures (optionnel mais recommandé)
Par défaut les icônes sont chargées depuis minecraft.wiki. Pour les héberger toi-même :
`node scripts/download-textures.js` puis commit `img/items/`.
