# Site de l'ASBL Kinshasa Bomoko Forever (maquette cliquable)

Next.js 16 (App Router) + TypeScript + Tailwind 4 + Motion + Lenis. Export statique pour la partie publique.

## Lancer
```bash
npm install
npm run dev          # http://localhost:3000 (développement)
npm run build        # génère le site statique dans out/
npm run start        # sert out/ sur http://localhost:3000
npm test             # tests Playwright (bureau 1440 px et mobile 360 px, sert out/ sur le port 4173)
npm run shots -- /contact/ 360 contact   # captures de contrôle dans captures/
```
L'espace d'administration simulé est sur `/admin/` (connexion fictive, rôles au choix). Rien n'est envoyé : les modifications restent dans le navigateur.

## Ajouter ou modifier des contenus
Tout vit dans `content/` (modèle proche d'un CMS, chaque contenu porte ses `sources` et ses champs « à confirmer ») :
- `activities.json` : actions et événements (`isEvent`, dates de l'événement et de publication distinctes, photos, résultats, prix).
- `news.json` : actualités et communiqués (`publish: false` = non affiché).
- `photos.json` : catalogue des photos (légende alt, crédit, autorisation, mineurs).
- `site.json` : textes de l'accueil, navigation, coordonnées (`null` = « à confirmer »).

Un événement n'apparaît dans « À venir » que s'il a une date future et un statut non « terminée ». Sans événement futur, l'accueil affiche l'état vide.

## Ajouter des photos
1. Déposer l'original dans `sources/photos/` (nom `AAAA-MM-JJ_sujet_n.jpg`), il n'est jamais modifié.
2. Ajouter une entrée dans `content/photos.json` (`id`, `file`, `alt` factuel, `authorization`).
3. `npm run images` : génère AVIF et WebP en plusieurs largeurs, un aperçu flou, le logo et l'icône provisoire (`public/img/`, `content/media.generated.json`).
4. Référencer l'`id` dans `photos` ou `cover` d'une activité.
Aucune adresse d'image Facebook n'est utilisée dans le code.

## Structure
`app/` pages · `components/` interface et animations (`motion.tsx`) · `components/admin/` admin simulé · `lib/content.ts` accès aux contenus · `scripts/` images et captures · `tests/` Playwright · `sources/` collecte Facebook (publications, photos, logo, manifeste).

## Documents de suivi
`DESIGN.md` charte · `SOURCES_CONTENUS.md` provenance de chaque contenu · `CONTENUS_A_VALIDER.md` manques et décisions en attente.
