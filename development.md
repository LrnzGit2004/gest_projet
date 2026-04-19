# Spécifications de Développement : Plateforme "Digital Solutions"

Ce document sert de guide de référence pour la génération complète du code source du MVP de gestion de projets collaboratifs.

## 1. Contexte & Stack Technique

- **Objectif** : Créer une plateforme de gestion de projets (MVP).
- **Backend** : Node.js avec Express.js.
- **Base de données** : PostgreSQL (Relationnel).
- **Frontend** : React.js (Routage client-side, gestion d'état centralisée).
- **Sécurité** : JWT (JSON Web Tokens), Bcrypt (Hachage), Middlewares de protection, CORS, Helmet.

## 2. Architecture de la Base de Données (PostgreSQL)

L'application repose sur 4 tables principales avec contraintes d'intégrité :

- `users` : id (UUID), email (Unique), password_hash, nom, role (Admin/Membre), date_inscription.
- `projects` : id (UUID), titre, description, createur_id (FK users), date_creation.
- `project_members` : project_id (FK projects), user_id (FK users) -> Relation N-N.
- `tasks` : id (UUID), projet_id (FK projects), titre, description, assigne_a (FK users), statut (A faire, En cours, Terminé), echeance.

## 3. État Actuel du Projet (Déjà Implémenté)

- Configuration `server.js` (Express, Cors, Helmet).
- Connexion PostgreSQL via un Pool dans `config/db.js`.
- Système d'authentification de base :
  - `authController.js` (register, login avec JWT et Bcrypt).
  - `authMiddleware.js` (vérification du token Bearer).
  - `authRoutes.js` (/register, /login).

## 4. Travail Restant : Backend (Express)

### A. Gestion des Projets (Projets CRUD)

- **Controller (`projectController.js`)** :
  - `getAllProjects` : Liste tous les projets (accessible à tous les membres).
  - `createProject` : Création d'un projet (L'utilisateur connecté est le `createur_id`).
  - `getProjectById` : Détails d'un projet spécifique.
  - `updateProject` : Modification (uniquement par le créateur).
  - `deleteProject` : Suppression (uniquement par le créateur).
- **Routes (`projectRoutes.js`)** : Protéger toutes les routes avec `authMiddleware`.

### B. Gestion des Tâches

- **Controller (`taskController.js`)** :
  - `getTasksByProject` : Lister les tâches d'un projet.
  - `createTask` : Ajouter une tâche à un projet.
  - `updateTaskStatus` : Modifier le statut (A faire -> En cours -> Terminé).
  - `assignTask` : Assigner une tâche à un utilisateur membre du projet.

## 5. Travail Restant : Frontend (React)

### A. Structure & State Management

- **Routage** : `react-router-dom` (Routes publiques : Login/Register ; Routes privées : Dashboard, ProjectDetails).
- **Gestion d'état** : Utiliser `Context API` (AuthContext) pour stocker le token JWT et les infos utilisateur.
- **Services** : Créer un dossier `services/api.js` utilisant `axios` avec un intercepteur pour injecter le token Bearer automatiquement.

### B. Pages à Créer

1. **Connexion / Inscription** : Formulaires avec validation.
2. **Dashboard** : Liste des projets sous forme de cartes (Grid) avec bouton "Nouveau Projet".
3. **Détails du Projet** :
   - Affichage des informations du projet.
   - Liste des tâches filtrable par statut.
   - Interface de gestion des membres.
4. **Profil** : Visualisation des infos utilisateur.

### C. UI/UX (Design & Interaction)

- **Framework CSS** : Tailwind CSS ou CSS Modules.
- **Responsive** : Mobile-first (Breakpoints : 768px, 1024px).
- **Interactivité** :
  - Recherche instantanée dans les projets.
  - Notifications visuelles (Toasts) pour les succès/erreurs.
  - Modales pour la création de tâches/projets.

## 6. Contraintes de Qualité (Critères d'Examen)

1. **Clean Code** : Séparation stricte MVC (Routes -> Controllers -> Models/DB).
2. **Gestion d'erreurs** : Blocs try/catch systématiques au backend avec messages clairs au frontend.
3. **Sécurité** : Ne jamais renvoyer le `password_hash` dans les réponses JSON.
4. **Performance** : Utilisation de `async/await` pour toutes les opérations asynchrones.

---

**Instruction pour l'IA** : Génère le code source de manière itérative en commençant par les contrôleurs de projets, puis les routes, et enfin l'intégralité de la structure React décrite ci-dessus.
