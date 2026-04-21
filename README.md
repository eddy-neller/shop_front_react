## E.N Shop React - Frontend e-commerce avec React 18 & TypeScript

E.N Shop React est le **frontend e-commerce** du projet E.N Shop, construit avec **React 18**, **TypeScript**, **Vite** et **Tailwind CSS**.  
Comme pour `en_shop_api`, ce dépôt est pensé comme un **projet portfolio** qui montre une approche moderne du front : architecture claire, typage strict, UX soignée, tests automatisés et intégration propre avec une API backend.

---

## 🎯 Objectifs du projet

- **Montrer la maîtrise de React 18, Vite et TypeScript 5** pour une SPA moderne, rapide et maintenable.
- **Illustrer une architecture front claire** : séparation des features, composants UI, couches d'accès API, contexts, schémas, types et tests.
- **Mettre en avant des bonnes pratiques de qualité** : ESLint, Prettier, TypeScript strict, Vitest, Testing Library, gestion d'état serveur avec TanStack Query.
- **S'intégrer dans l'écosystème complet** : backend Symfony/API Platform (`en_shop_api`) + future interface d'administration.

En résumé : ce repo illustre comment je conçois un **front e-commerce maintenable** au-dessus d'une vraie API métier.

---

## 🧩 Rôle du frontend dans l'écosystème

E.N Shop React fournit :

- L'**interface utilisateur** du shop : pages publiques, parcours d'authentification et espace utilisateur.
- La **consommation de l'API** `en_shop_api` : connexion, inscription, activation de compte, réinitialisation du mot de passe, profil, avatar.
- La **gestion de l'authentification** côté front avec JWT, stockage local contrôlé, routes protégées et synchronisation des erreurs d'authentification.
- Une **base UX/UI** réutilisable : layout global, navigation, breadcrumbs, formulaires typés, feedback utilisateur et composants UI.
- Une **expérience multilingue** français/anglais avec chargement dynamique des namespaces i18next.

Le frontend est pensé pour rester **faiblement couplé** au backend :  
l'URL d'API est injectée via les variables d'environnement, pas hardcodée dans le code.

---

## 🛠️ Stack technique & outils

- **React 18** + **Vite 7** pour une SPA performante et une DX rapide.
- **TypeScript 5** avec configuration stricte.
- **React Router 7** pour le routing public, invité et authentifié.
- **React Auth Kit** pour l'authentification côté client.
- **TanStack Query 5** pour les requêtes, le cache serveur et les états de chargement.
- **Axios** avec client HTTP centralisé, intercepteurs, token JWT et gestion des erreurs 401.
- **React Hook Form** + **Zod** + `@hookform/resolvers` pour des formulaires typés et validés.
- **i18next** + `react-i18next` pour l'internationalisation FR/EN.
- **CASL** pour préparer une gestion fine des permissions côté interface.
- **Tailwind CSS 3**, **Sass**, **Radix UI**, **shadcn-style components** et **lucide-react** pour la couche UI.
- Outils qualité :
  - **Vitest** + **Testing Library** + **jsdom** pour les tests unitaires et composants.
  - **ESLint 9** avec règles React, Hooks, Refresh et TypeScript.
  - **Prettier** pour un formatage cohérent.
  - **Husky** pour préparer les hooks Git.

Ces choix visent un front **proche de la production** : DX agréable, typage fort, base testable et architecture prête à évoluer.

---

## 📁 Architecture du projet

Le projet suit une organisation orientée “features” et couches partagées :

- `src/main.tsx` : point d'entrée React, initialisation du `QueryClientProvider`.
- `src/App.tsx` : providers applicatifs globaux (`RouterProvider`, auth, permissions, breadcrumbs, helmet).
- `src/routes.tsx` : définition centralisée des routes publiques, invitées et authentifiées.
- `src/layouts/` : layouts transverses, notamment `MainLayout` avec header, footer, breadcrumbs et outlet.
- `src/pages/` : pages publiques génériques (`Home`, `About`, `Contact`, `NotFound`).
- `src/features/` : **features métier** avec une structure autonome :
  - `Auth/` : login, inscription, activation, reset password, routes invitées, hooks et API dédiées.
  - `User/` : dashboard utilisateur, profil, avatar, changement de mot de passe, rôles et données de compte.
- `src/components/` : composants partagés, composants layout, blocs de page et primitives UI.
- `src/components/ui/` : base de design system réutilisable.
- `src/contexts/` : contexts applicatifs (`AbilityContext`, `BreadcrumbContext`).
- `src/lib/api/` : client HTTP Axios et appels API transverses.
- `src/lib/utils/` : helpers partagés : routes, formats, erreurs, permissions, arbres de catégories, tests utilities.
- `src/schemas/` : schémas Zod transverses.
- `src/locales/` et `src/features/*/locales/` : traductions globales et traductions propres aux features.
- `src/styles/` et `src/index.css` : styles globaux, variables Sass, mixins et composants.
- `src/**/__tests__/` : tests proches du code testé, organisés par feature, page, hook ou composant.

**Décision technique (en clair)** :  
je sépare les **features** (`Auth`, `User`, etc.) de l'**infra front** (`lib`, `contexts`, `components`, `layouts`) pour garder un code lisible, testable et facilement extensible.

---

## 🔎 Ce que ce projet démontre

- **Architecture feature-first** : chaque domaine métier possède ses composants, pages, hooks, schémas, types, API, traductions et tests.
- **Gestion robuste de l'auth** : routes protégées, routes réservées aux invités, JWT, invalidation locale et écoute d'événements `auth:logout`.
- **Client API centralisé** : configuration Axios unique, injection du token, header `Accept-Language`, support `FormData`, traitement des erreurs réseau et tokens expirés.
- **Formulaires sérieux** : validation Zod, React Hook Form, messages localisés et typage des payloads.
- **Internationalisation maintenable** : namespaces chargés à la demande, séparation des traductions globales et métier.
- **Qualité vérifiable** : couverture de tests sur pages, composants, hooks, client HTTP et helpers.
- **Préparation aux permissions** : CASL permet d'exprimer des règles d'affichage selon le rôle utilisateur sans disperser la logique métier.

Ces points sont volontairement visibles dans le code : ils montrent une capacité à structurer un frontend au-delà d'une simple intégration de maquettes.

---

## 🚀 Démarrage rapide

### Prérequis

- **Node.js 20.19+** recommandé pour Vite 7.
- **npm**
- **Git**

### Installation

Depuis la racine du projet :

```bash
git clone <repository-url>
cd <dir>
npm install
```

### Configuration des variables d'environnement

Crée un fichier `.env.local` à la racine du projet (non versionné, voir `.gitignore`) avec par exemple :

```env
# URL de l'API backend (en général en_shop_api)
VITE_API_URL=http://localhost:8000/api
```

**Pourquoi cette approche ?**  
Les URLs dépendantes de l'environnement restent configurables sans modification du code source.

### Lancement du serveur de développement

```bash
npm run dev
```

Avec la configuration Vite actuelle, l'application écoute sur toutes les interfaces (`--host 0.0.0.0`).  
L'URL locale est affichée dans le terminal au démarrage, généralement `http://localhost:5173`.

---

## 📝 Scripts disponibles

- `npm run dev` : démarre le serveur de développement Vite.
- `npm run build` : lance la vérification TypeScript puis génère le build de production.
- `npm run preview` : sert localement le build de production.
- `npm run lint` : exécute ESLint sur le projet.
- `npm run test` : lance Vitest en mode watch.
- `npm run test:ci` : lance les tests une seule fois.
- `npm run test:cov` : lance les tests avec couverture.
- `npm run test-ui` : ouvre l'interface Vitest UI.
- `npm run prepare` : initialise Husky.

---

## ✅ Qualité de code & bonnes pratiques

- **TypeScript strict** pour limiter les erreurs de contrat entre composants, API et formulaires.
- **ESLint** avec les règles React + TypeScript.
- **Prettier** pour un formatage cohérent.
- **Tests automatisés** avec Vitest et Testing Library sur les parcours sensibles : auth, user, pages publiques, composants UI et client HTTP.
- **Validation centralisée** avec Zod pour fiabiliser les entrées utilisateur.
- **Design orienté DRY & KISS** : composants réutilisables, logique partagée dans `lib`, logique métier dans `features`.

**Objectif** : un front **prêt pour la production**, sans dette technique évidente, et facile à faire évoluer.

---

## 📄 Licence / type de projet

Ce dépôt est utilisé comme **projet de portfolio** pour illustrer un frontend e-commerce moderne.  
Il peut être librement consulté et utilisé comme **référence technique** (structure, patterns, organisation du code).  
Si une licence formelle (ex. MIT, alignée sur `en_shop_api`) est ajoutée, elle sera indiquée dans un fichier `LICENSE` dédié.

---

## 👤 À propos du développeur

Ce projet fait partie d'un **portfolio full-stack** autour d'E.N Shop :  
il complète `en_shop_api` (backend Symfony/API Platform) et prépare le terrain pour une future interface d'administration.  
L'objectif est de montrer ma manière de :

- concevoir une **expérience utilisateur** moderne au-dessus d'une vraie API,
- structurer un **front React/Vite** maintenable,
- intégrer proprement les préoccupations **auth, API, formulaires, i18n, permissions, tests, qualité et DX**.

N'hésite pas à parcourir les autres dépôts associés pour avoir une vision complète de l'écosystème.
