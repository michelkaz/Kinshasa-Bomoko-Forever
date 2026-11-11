# Charte graphique KBF

## Couleurs (mesurées sur le logo ; tokens dans `app/globals.css`, bloc `@theme`)
| Token | Valeur | Usage | Contraste |
| --- | --- | --- | --- |
| `--color-blue` | #001E6B | principale, fonds profonds, titres | blanc dessus 15:1 |
| `--color-red` | #C50100 | accent clair, boutons, étiquettes | blanc dessus 6,3:1 ; sur blanc 6,3:1 |
| `--color-coral` | #FF6A5C | accent **sur fond bleu seulement** | sur bleu 6:1 ; sur blanc insuffisant |
| `--color-night` | #000F3A | pied de page, sections sombres | |
| `--color-mist` | #EEF1F8 | fonds de section clairs | |
| `--color-ink` | #0B1226 | texte | 17:1 sur blanc |
Thème clair par défaut. Le logo reste dans un cartouche blanc sur fond bleu ou photo.

## Typographie
- Titres : **Archivo** condensée (largeur 62 %), 800, majuscules, interlettrage −0,02 em, interligne 0,9.
- Texte : **Public Sans**, 16 px minimum, interligne 1,6, lignes de 65 caractères maximum.
- Polices servies localement par `next/font` (sous-ensemble latin).

## Formes
Rayons arrondis uniquement (`--radius-sm` 14 · `md` 24 · `lg` 36 · `xl` 48 px), boutons en pilule, photos aux bords doux, bas des en-têtes en courbe, vagues entre sections, formes qui se déforment au survol (`.blob`).

## Animations (`components/motion.tsx`, tout se coupe avec « réduire les animations »)
Titre mot par mot, apparition au défilement, parallaxe des photos, zoom lent, arcs du logo en rotation, cartes qui s'inclinent, boutons magnétiques, défilement fluide (Lenis), barre de progression, rideau de transition entre pages, bandeau de mots, compteurs sur les prix, chiffres du score qui se retournent, carrousel à faire glisser, frise à défilement horizontal, galerie plein écran. Pas de son, pas de vidéo automatique, pas de carrousel automatique.

## Navigation
Barre fixe en pilule : transparente et claire sur la photo d'ouverture, puis fond blanc et texte foncé après la première section (repère `data-hero`). Menu plein écran sur mobile.

## Photos
Uniquement celles de la page Facebook officielle ou de l'association. Voile bleu posé en CSS, jamais dans le fichier. Une photo en tête de chaque page, choisie en paysage et centrée. 7 photos maximum par activité. Texte alternatif factuel, sans nom non confirmé. Quand aucune photo de qualité n'existe : « Affiche seule » (typographie, couleur), jamais d'image inventée.

## États
Chargement (aperçu flou), liste vide (état vide du prochain événement), formulaire envoyé et erreurs de saisie, page introuvable (404 avec photo).
