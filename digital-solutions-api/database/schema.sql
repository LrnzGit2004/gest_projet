-- Création de l'extension pour générer des UUIDs automatiquement
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Table : users (Utilisateurs)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nom VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'Membre' CHECK (role IN ('Administrateur', 'Membre')),
    date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table : projects (Projets)
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    createur_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Table : project_members (Membres du projet - Relation N-N)
CREATE TABLE project_members (
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, user_id)
);

-- 4. Table : tasks (Tâches)
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    projet_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    assigne_a UUID REFERENCES users(id) ON DELETE SET NULL,
    statut VARCHAR(50) DEFAULT 'A faire' CHECK (statut IN ('A faire', 'En cours', 'Terminé')),
    echeance DATE
);