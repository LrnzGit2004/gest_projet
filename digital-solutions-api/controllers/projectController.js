const db = require('../config/db');

// @route   GET /api/projects
// @desc    Lister tous les projets
// @access  Privé
const getAllProjects = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM projects ORDER BY date_creation DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erreur getAllProjects:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des projets.' });
  }
};

// @route   GET /api/projects/:id
// @desc    Obtenir les détails d'un projet spécifique
// @access  Privé
const getProjectById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM projects WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Projet introuvable.' });
    }
    
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur getProjectById:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération du projet.' });
  }
};

// @route   POST /api/projects
// @desc    Créer un projet
// @access  Privé
const createProject = async (req, res) => {
  const { titre, description } = req.body;
  
  // Utilisation de req.user.id qui sera disponible grâce au authMiddleware
  const createur_id = req.user && req.user.id; 

  if (!titre) {
    return res.status(400).json({ message: 'Le titre du projet est requis.' });
  }

  try {
    const result = await db.query(
      'INSERT INTO projects (titre, description, createur_id, date_creation) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [titre, description, createur_id]
    );

    const newProject = result.rows[0];

    // Ajouter le créateur comme membre du projet automatiquement par défaut
    if (createur_id) {
       await db.query(
         'INSERT INTO project_members (project_id, user_id) VALUES ($1, $2)',
         [newProject.id, createur_id]
       );
    }

    res.status(201).json(newProject);
  } catch (error) {
    console.error('Erreur createProject:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la création du projet.' });
  }
};

// @route   PUT /api/projects/:id
// @desc    Modifier un projet (créateur uniquement)
// @access  Privé
const updateProject = async (req, res) => {
  const { id } = req.params;
  const { titre, description } = req.body;
  const user_id = req.user && req.user.id;

  try {
    // Vérifier si le projet existe et si l'utilisateur est le créateur
    const projectResult = await db.query('SELECT createur_id FROM projects WHERE id = $1', [id]);
    
    if (projectResult.rows.length === 0) {
      return res.status(404).json({ message: 'Projet introuvable.' });
    }

    if (projectResult.rows[0].createur_id !== user_id) {
      return res.status(403).json({ message: 'Accès refusé. Seul le créateur peut modifier ce projet.' });
    }

    const updateResult = await db.query(
      'UPDATE projects SET titre = COALESCE($1, titre), description = COALESCE($2, description) WHERE id = $3 RETURNING *',
      [titre, description, id]
    );

    res.status(200).json(updateResult.rows[0]);
  } catch (error) {
    console.error('Erreur updateProject:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la modification du projet.' });
  }
};

// @route   DELETE /api/projects/:id
// @desc    Supprimer un projet (créateur uniquement)
// @access  Privé
const deleteProject = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user && req.user.id;

  try {
    // Vérifier si le projet existe et si l'utilisateur est le créateur
    const projectResult = await db.query('SELECT createur_id FROM projects WHERE id = $1', [id]);
    
    if (projectResult.rows.length === 0) {
      return res.status(404).json({ message: 'Projet introuvable.' });
    }

    if (projectResult.rows[0].createur_id !== user_id) {
      return res.status(403).json({ message: 'Accès refusé. Seul le créateur peut supprimer ce projet.' });
    }

    // Enlever d'abord les dépendances ou supposer que le CASCADING est configuré en BD
    // (tasks et project_members). S'il n'y a pas CASCADE ON DELETE dans le schéma, il faut les supprimer manuellement.
    // Supposons une approche sûre s'il n'y a pas CASCADE :
    await db.query('DELETE FROM task_assignments WHERE task_id IN (SELECT id FROM tasks WHERE projet_id = $1)', [id]).catch(() => {});
    await db.query('DELETE FROM tasks WHERE projet_id = $1', [id]).catch(() => {});
    await db.query('DELETE FROM project_members WHERE project_id = $1', [id]).catch(() => {});

    await db.query('DELETE FROM projects WHERE id = $1', [id]);

    res.status(200).json({ message: 'Projet supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur deleteProject:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression du projet.' });
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
};
