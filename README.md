# Plateforme Collaborative "Digital Solutions" (MVP)

Ce projet est un Minimum Viable Product (MVP) d'une plateforme de gestion de projets collaboratifs pour les équipes internes de Digital Solutions. Il a été développé avec une architecture full-stack (React, Node.js/Express, PostgreSQL) en respectant les bonnes pratiques de sécurité (JWT, Bcrypt) et de conception (MVC).

## 1. Prérequis

- **Node.js** (v16 ou supérieur)
- **PostgreSQL** (v15 ou supérieur)
- **Git**

## 2. Variables d'Environnement

Avant de lancer le projet, créez un fichier `.env` à la racine du dossier backend (ou à la racine du projet, selon votre arborescence) et ajoutez les variables suivantes :

```env
PORT=5000
DATABASE_URL=postgres://postgres:VOTRE_MOT_DE_PASSE@localhost:5432/digital_solutions
JWT_SECRET=super_secret_jwt_key_pour_lexamen_2026
JWT_EXPIRES_IN=24h
```

## 3. Instructions d'Installation et de Lancement

### Étape 1 : Base de données
Ouvrez pgAdmin ou votre terminal PostgreSQL.

Créez une base de données nommée `digital_solutions`.

Exécutez le script d'initialisation pour créer les tables :
```bash
psql -U postgres -d digital_solutions -f database/schema.sql
```

### Étape 2 : Lancement du Backend (API)
Ouvrez un terminal, placez-vous dans le dossier du backend et exécutez :
```bash
# Installation des dépendances
npm install

# Démarrage du serveur en mode développement
npm run dev
```
Le backend tournera sur http://localhost:5000.

### Étape 3 : Lancement du Frontend (Client)
Ouvrez un second terminal, placez-vous dans le dossier `client/` et exécutez :
```bash
# Installation des dépendances
npm install

# Démarrage de l'interface React
npm run dev
```
Le frontend sera accessible (généralement) sur http://localhost:5173.

## 4. Utilisateurs de Test
Pour évaluer l'application sans avoir à créer de nouveaux comptes, voici les identifiants de test préconfigurés :

**Compte Administrateur :**
- Email : `admin@digital-solutions.com`
- Mot de passe : `Admin123!`

**Compte Membre (Standard) :**
- Email : `membre@digital-solutions.com`
- Mot de passe : `Membre123!`

*(Note : Si ces utilisateurs ne sont pas encore dans la base, vous pouvez les créer directement via la page d'inscription de l'application frontend).*

## 5. Endpoints de l'API Principaux
Toutes les routes (sauf l'authentification) nécessitent un Header `Authorization: Bearer <token>`.

### Authentification :
- `POST /api/auth/register` : Inscription d'un utilisateur.
- `POST /api/auth/login` : Connexion et récupération du token JWT.

### Projets (CRUD) :
- `GET /api/projects` : Lister tous les projets.
- `POST /api/projects` : Créer un nouveau projet.
- `GET /api/projects/:id` : Voir les détails d'un projet.
- `PUT /api/projects/:id` : Modifier un projet (Créateur uniquement).
- `DELETE /api/projects/:id` : Supprimer un projet (Créateur uniquement).

### Tâches :
- `GET /api/tasks/:projectId` : Récupérer les tâches d'un projet.
- `POST /api/tasks` : Ajouter une tâche.
- `PUT /api/tasks/:id/status` : Mettre à jour le statut (A faire, En cours, Terminé).
